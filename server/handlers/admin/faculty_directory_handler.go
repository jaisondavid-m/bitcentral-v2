package admin

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"server/config"
	"server/handlers/student"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/option"
	"google.golang.org/api/people/v1"
)

type FacultyMember struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Phone      string `json:"phone"`
	PhotoURL   string `json:"photo_url"`
	Department string `json:"department"`
	JobTitle   string `json:"job_title"`
	ProfileURL string `json:"profile_url,omitempty"`
	UpdatedAt  string `json:"updated_at"`
}

type FacultyDirectoryHandler struct {
	DB            *sql.DB
	sheetsHandler *student.SheetHandler
	syncMu        sync.Mutex
}

func NewFacultyDirectoryHandler(sheetsHandler *student.SheetHandler) *FacultyDirectoryHandler {
	h := &FacultyDirectoryHandler{
		DB:            config.GetAcademicDB(),
		sheetsHandler: sheetsHandler,
	}

	// Start 24-hour background ticker sync
	go h.startPeriodicSync()

	return h
}

func (h *FacultyDirectoryHandler) startPeriodicSync() {
	// Wait brief moment for DB initialization
	time.Sleep(3 * time.Second)

	// Run initial sync on startup if table is empty
	h.checkAndRunInitialSync()

	if os.Getenv("ENABLE_FACULTY_PERIODIC_SYNC") != "true" {
		log.Println("ℹ️ Automatic 24h faculty directory sync is idle (set ENABLE_FACULTY_PERIODIC_SYNC=true to enable). Admins can sync manually via API.")
		return
	}

	ticker := time.NewTicker(24 * time.Hour)
	defer ticker.Stop()

	for range ticker.C {
		log.Println("🔄 Triggering 24-hour periodic Faculty Directory sync...")
		h.SyncGoogleDirectory()
	}
}

func (h *FacultyDirectoryHandler) checkAndRunInitialSync() {
	if h.DB == nil {
		return
	}
	var count int
	if err := h.DB.QueryRow("SELECT COUNT(*) FROM faculty_directory").Scan(&count); err == nil && count > 0 {
		log.Printf("ℹ️ Faculty Directory already populated (%d records). Skipping startup sync to save TiDB limits.", count)
		return
	}
	log.Println("⚡ Initializing Faculty Directory table with full Google Contacts/Directory sync...")
	h.SyncGoogleDirectory()
}

type DirectoryPersonItem struct {
	Person struct {
		Names          []*people.Name         `json:"names"`
		EmailAddresses []*people.EmailAddress `json:"emailAddresses"`
		PhoneNumbers   []*people.PhoneNumber  `json:"phoneNumbers"`
		Photos         []*people.Photo        `json:"photos"`
		Organizations  []*people.Organization `json:"organizations"`
	} `json:"person"`
	Names          []*people.Name         `json:"names"`
	EmailAddresses []*people.EmailAddress `json:"emailAddresses"`
	PhoneNumbers   []*people.PhoneNumber  `json:"phoneNumbers"`
	Photos         []*people.Photo        `json:"photos"`
	Organizations  []*people.Organization `json:"organizations"`
}

func (item DirectoryPersonItem) Extract() ([]*people.Name, []*people.EmailAddress, []*people.PhoneNumber, []*people.Photo, []*people.Organization) {
	names := item.Names
	if len(names) == 0 {
		names = item.Person.Names
	}
	emails := item.EmailAddresses
	if len(emails) == 0 {
		emails = item.Person.EmailAddresses
	}
	phones := item.PhoneNumbers
	if len(phones) == 0 {
		phones = item.Person.PhoneNumbers
	}
	photos := item.Photos
	if len(photos) == 0 {
		photos = item.Person.Photos
	}
	orgs := item.Organizations
	if len(orgs) == 0 {
		orgs = item.Person.Organizations
	}
	return names, emails, phones, photos, orgs
}

func isParentEmail(email string) bool {
	lower := strings.ToLower(strings.TrimSpace(email))
	return strings.Contains(lower, "parent") || strings.Contains(lower, "parents") || strings.HasSuffix(lower, "@parents.bitsathy.ac.in")
}

var studentEmailPattern = regexp.MustCompile(`\.[a-z]{2,4}[0-9]{2}@`)

func isStudentEmail(email string) bool {
	return studentEmailPattern.MatchString(strings.ToLower(strings.TrimSpace(email)))
}

func isValidFacultyRecord(email, phone string) bool {
	cleanEmail := strings.ToLower(strings.TrimSpace(email))

	if cleanEmail == "" {
		return false
	}

	if isStudentEmail(cleanEmail) {
		return false
	}

	// Must NOT end with gmail.com
	if strings.HasSuffix(cleanEmail, "gmail.com") {
		return false
	}

	// Must NOT contain parent or parents in email
	if isParentEmail(cleanEmail) {
		return false
	}

	// Must end with bitsathy.ac.in or bitsathy.in
	if !strings.HasSuffix(cleanEmail, "bitsathy.ac.in") && !strings.HasSuffix(cleanEmail, "bitsathy.in") {
		return false
	}

	return true
}

func (h *FacultyDirectoryHandler) GetOAuthConfig() *oauth2.Config {
	clientID := strings.TrimSpace(os.Getenv("GOOGLE_OAUTH_CLIENT_ID"))
	clientSecret := strings.TrimSpace(os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET"))
	redirectURL := strings.TrimSpace(os.Getenv("REDIRECT_URL"))
	if redirectURL == "" {
		redirectURL = "http://localhost:8080/auth/callback"
	}

	return &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Scopes: []string{
			"https://www.googleapis.com/auth/spreadsheets.readonly",
			"https://www.googleapis.com/auth/contacts.readonly",
			"https://www.googleapis.com/auth/contacts.other.readonly",
			"https://www.googleapis.com/auth/directory.readonly",
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}
}

func (h *FacultyDirectoryHandler) HandleDirectoryLogin(c *gin.Context) {
	cfg := h.GetOAuthConfig()
	authURL := cfg.AuthCodeURL(
		"state-token",
		oauth2.AccessTypeOffline,
		oauth2.SetAuthURLParam("prompt", "consent"),
	)
	c.Redirect(http.StatusTemporaryRedirect, authURL)
}

func (h *FacultyDirectoryHandler) SyncGoogleDirectory() {
	h.syncMu.Lock()
	defer h.syncMu.Unlock()

	log.Println("🔄 Syncing Faculty Directory strictly from Google People/Contacts API...")

	// Purge legacy/invalid records from database first
	if h.DB != nil {
		res, err := h.DB.Exec(`
			DELETE FROM faculty_directory 
			WHERE LOWER(email) LIKE '%gmail.com' 
			   OR LOWER(email) LIKE '%parent%' 
			   OR LOWER(email) LIKE '%parents%'
			   OR LOWER(email) REGEXP '\\.[a-z]{2,4}[0-9]{2}@'
			   OR (LOWER(email) NOT LIKE '%bitsathy.ac.in' AND LOWER(email) NOT LIKE '%bitsathy.in');
		`)
		if err == nil {
			if deleted, _ := res.RowsAffected(); deleted > 0 {
				log.Printf("🧹 Cleaned up %d invalid faculty directory records from DB", deleted)
			}
		}
	}

	var httpClient *http.Client
	cfg := h.GetOAuthConfig()

	// 1. Try using SheetHandler's managed HTTP client first (handles automatic token refreshing & persistence)
	if h.sheetsHandler != nil {
		httpClient = h.sheetsHandler.GetHTTPClient()
	}

	// 2. Try loading token from MySQL database (ps_tokens on Core DB)
	if httpClient == nil && config.GetCoreDB() != nil {
		var tokenStr string
		err := config.GetCoreDB().QueryRow("SELECT token FROM ps_tokens WHERE token_key = 'google_oauth_token' LIMIT 1").Scan(&tokenStr)
		if err == nil && strings.TrimSpace(tokenStr) != "" {
			var tok oauth2.Token
			if err := json.Unmarshal([]byte(tokenStr), &tok); err == nil && (tok.AccessToken != "" || tok.RefreshToken != "") {
				httpClient = cfg.Client(context.Background(), &tok)
			}
		}
	}

	// 3. Try loading token from environment first
	if httpClient == nil {
		envToken := strings.TrimSpace(os.Getenv("GOOGLE_OAUTH_TOKEN_JSON"))
		if envToken != "" {
			var tok oauth2.Token
			if err := json.Unmarshal([]byte(envToken), &tok); err == nil && (tok.AccessToken != "" || tok.RefreshToken != "") {
				httpClient = cfg.Client(context.Background(), &tok)
			}
		}
	}

	// 4. Fallback to loading token.json
	if httpClient == nil {
		if f, err := os.Open("token.json"); err == nil {
			defer f.Close()
			var tok oauth2.Token
			if err := json.NewDecoder(f).Decode(&tok); err == nil && (tok.AccessToken != "" || tok.RefreshToken != "") {
				ctx := context.Background()
				httpClient = cfg.Client(ctx, &tok)
			}
		}
	}

	// 5. Try using SheetHandler's raw OAuth Token if still nil
	if httpClient == nil && h.sheetsHandler != nil && h.sheetsHandler.GetOAuthToken() != nil {
		httpClient = cfg.Client(context.Background(), h.sheetsHandler.GetOAuthToken())
	}

	if httpClient == nil {
		log.Println("⚠️ Google OAuth client is not authenticated. Skipping Google Directory sync.")
		return
	}

	syncedCount := 0

	// 1. Try Google People SDK
	srv, err := people.NewService(context.Background(), option.WithHTTPClient(httpClient))
	if err == nil {
		// Search Connections with pagination
		pageToken := ""
		for {
			call := srv.People.Connections.List("people/me").
				PersonFields("names,emailAddresses,phoneNumbers,photos,organizations").
				PageSize(1000)
			if pageToken != "" {
				call.PageToken(pageToken)
			}
			resp, err := call.Do()
			if err != nil || resp == nil {
				if err != nil {
					log.Printf("⚠️ Google Connections.List error: %v", err)
				}
				break
			}
			for _, p := range resp.Connections {
				syncedCount += h.savePersonToDB(p.Names, p.EmailAddresses, p.PhoneNumbers, p.Photos, p.Organizations)
			}
			pageToken = resp.NextPageToken
			if pageToken == "" {
				break
			}
		}

		// Query Other Contacts API with pagination
		otherPageToken := ""
		for {
			reqUrl := "https://people.googleapis.com/v1/otherContacts?readMask=names,emailAddresses,phoneNumbers,photos,organizations&pageSize=1000"
			if otherPageToken != "" {
				reqUrl += "&pageToken=" + otherPageToken
			}
			req, err := http.NewRequest("GET", reqUrl, nil)
			if err != nil {
				break
			}
			respHttp, err := httpClient.Do(req)
			if err != nil || respHttp.StatusCode != http.StatusOK {
				if respHttp != nil {
					log.Printf("⚠️ Google otherContacts API error status: %d", respHttp.StatusCode)
					respHttp.Body.Close()
				}
				break
			}
			body, _ := io.ReadAll(respHttp.Body)
			respHttp.Body.Close()

			var otherResp struct {
				OtherContacts []DirectoryPersonItem `json:"otherContacts"`
				NextPageToken string                `json:"nextPageToken"`
			}
			if err := json.Unmarshal(body, &otherResp); err == nil {
				for _, oc := range otherResp.OtherContacts {
					names, emails, phones, photos, orgs := oc.Extract()
					syncedCount += h.savePersonToDB(names, emails, phones, photos, orgs)
				}
				otherPageToken = otherResp.NextPageToken
				if otherPageToken == "" {
					break
				}
			} else {
				break
			}
		}

		// Alphabetical & Domain Search for Google Workspace Directory
		queries := []string{"bitsathy", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"}
		for _, q := range queries {
			letterPageToken := ""
			for {
				searchUrl := fmt.Sprintf("https://people.googleapis.com/v1/people:searchDirectoryPeople?query=%s&readMask=names,emailAddresses,phoneNumbers,photos,organizations&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_CONTACT&pageSize=500", url.QueryEscape(q))
				if letterPageToken != "" {
					searchUrl += "&pageToken=" + url.QueryEscape(letterPageToken)
				}
				req, err := http.NewRequest("GET", searchUrl, nil)
				if err != nil {
					break
				}
				respHttp, err := httpClient.Do(req)
				if err != nil || respHttp.StatusCode != http.StatusOK {
					if respHttp != nil {
						if respHttp.StatusCode != http.StatusBadRequest {
							log.Printf("⚠️ Directory search query '%s' status: %d", q, respHttp.StatusCode)
						}
						respHttp.Body.Close()
					}
					break
				}
				body, _ := io.ReadAll(respHttp.Body)
				respHttp.Body.Close()

				var searchResp struct {
					People        []DirectoryPersonItem `json:"people"`
					NextPageToken string                `json:"nextPageToken"`
				}
				if err := json.Unmarshal(body, &searchResp); err == nil {
					for _, p := range searchResp.People {
						names, emails, phones, photos, orgs := p.Extract()
						syncedCount += h.savePersonToDB(names, emails, phones, photos, orgs)
					}
					letterPageToken = searchResp.NextPageToken
					if letterPageToken == "" {
						break
					}
				} else {
					break
				}
			}
		}
	}

	log.Printf("✅ Google Contacts/Directory full sync completed. Processed records: %d", syncedCount)
}

func (h *FacultyDirectoryHandler) savePersonToDB(
	names []*people.Name,
	emails []*people.EmailAddress,
	phones []*people.PhoneNumber,
	photos []*people.Photo,
	orgs []*people.Organization,
) int {
	if len(emails) == 0 {
		return 0
	}

	email := strings.ToLower(strings.TrimSpace(emails[0].Value))
	phone := ""
	if len(phones) > 0 {
		phone = strings.TrimSpace(phones[0].Value)
	}

	if !isValidFacultyRecord(email, phone) {
		return 0
	}

	name := email
	if len(names) > 0 && strings.TrimSpace(names[0].DisplayName) != "" {
		name = strings.TrimSpace(names[0].DisplayName)
	}

	photoURL := ""
	if len(photos) > 0 {
		for _, ph := range photos {
			if strings.TrimSpace(ph.Url) != "" {
				photoURL = strings.TrimSpace(ph.Url)
				if !ph.Default {
					break
				}
			}
		}
	}

	dept := extractDeptFromEmail(email)
	jobTitle := ""
	if len(orgs) > 0 {
		if strings.TrimSpace(orgs[0].Department) != "" {
			dept = strings.TrimSpace(orgs[0].Department)
		}
		if strings.TrimSpace(orgs[0].Title) != "" {
			jobTitle = strings.TrimSpace(orgs[0].Title)
		}
	}

	h.upsertFacultyRecord(email, name, phone, photoURL, dept, jobTitle)
	return 1
}

func (h *FacultyDirectoryHandler) upsertFacultyRecord(email, name, phone, photoURL, dept, jobTitle string) {
	if h.DB == nil {
		return
	}

	cleanEmail := strings.ToLower(strings.TrimSpace(email))
	cleanPhone := strings.TrimSpace(phone)

	if !isValidFacultyRecord(cleanEmail, cleanPhone) {
		return
	}

	query := `
		INSERT INTO faculty_directory (email, name, phone, photo_url, department, job_title, source, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, 'google_directory', NOW())
		ON DUPLICATE KEY UPDATE
			name = CASE 
				WHEN VALUES(name) != '' AND VALUES(name) NOT REGEXP '^[A-Za-z]{1,4}[0-9]{2,6}$' THEN VALUES(name)
				WHEN (name IS NULL OR name = '' OR name = email OR name REGEXP '^[A-Za-z]{1,4}[0-9]{2,6}$') AND VALUES(name) != '' THEN VALUES(name)
				ELSE name 
			END,
			phone = CASE WHEN VALUES(phone) != '' THEN VALUES(phone) ELSE phone END,
			photo_url = CASE 
				WHEN VALUES(photo_url) IS NOT NULL AND VALUES(photo_url) != '' THEN VALUES(photo_url) 
				ELSE faculty_directory.photo_url 
			END,
			department = CASE WHEN VALUES(department) != '' AND (department = '' OR department = 'Faculty & Staff') THEN VALUES(department) ELSE department END,
			job_title = CASE WHEN VALUES(job_title) != '' AND (job_title = '' OR job_title = 'Faculty / Staff') THEN VALUES(job_title) ELSE job_title END,
			updated_at = NOW();
	`

	_, _ = h.DB.Exec(query, cleanEmail, name, cleanPhone, photoURL, dept, jobTitle)
}

func extractDeptFromEmail(email string) string {
	email = strings.ToLower(strings.TrimSpace(email))
	if strings.Contains(email, ".cs") || strings.Contains(email, "cse") {
		return "Computer Science & Engineering"
	}
	if strings.Contains(email, ".ec") || strings.Contains(email, "ece") {
		return "Electronics & Communication"
	}
	if strings.Contains(email, ".ee") || strings.Contains(email, "eee") {
		return "Electrical & Electronics"
	}
	if strings.Contains(email, ".ad") || strings.Contains(email, "aids") {
		return "AI & Data Science"
	}
	if strings.Contains(email, ".al") || strings.Contains(email, "aiml") {
		return "AI & Machine Learning"
	}
	if strings.Contains(email, ".me") || strings.Contains(email, "mech") {
		return "Mechanical Engineering"
	}
	if strings.Contains(email, ".bt") || strings.Contains(email, "biotech") {
		return "Biotechnology"
	}
	if strings.Contains(email, ".it") {
		return "Information Technology"
	}
	if strings.Contains(email, ".cb") || strings.Contains(email, "csbs") {
		return "Computer Science & Business Systems"
	}
	if strings.Contains(email, ".ct") {
		return "Computer Technology"
	}
	return "Faculty & Staff"
}

func (h *FacultyDirectoryHandler) getFacultyDetailsTableName() string {
	if h.DB == nil {
		return "faculty_details"
	}
	var exists string
	err := h.DB.QueryRow("SHOW TABLES LIKE 'faculty_details'").Scan(&exists)
	if err == nil && exists != "" {
		return "faculty_details"
	}
	err = h.DB.QueryRow("SHOW TABLES LIKE 'facutly_details'").Scan(&exists)
	if err == nil && exists != "" {
		return "facutly_details"
	}
	return "faculty_directory"
}

// ServeFacultyPhoto serves faculty photo files securely verified by middleware
func (h *FacultyDirectoryHandler) ServeFacultyPhoto(c *gin.Context) {
	path := c.GetString("faculty_photo_path")
	if path == "" {
		filename := c.Param("filename")
		if filename != "" {
			cleanName := filepath.Base(filepath.Clean(filename))
			candidate := filepath.Join("data", "faculty_photos", cleanName)
			if fi, err := os.Stat(candidate); err == nil && !fi.IsDir() {
				path = candidate
			}
		}
	}

	if path == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Faculty photo not found",
		})
		return
	}

	c.File(path)
}

func (h *FacultyDirectoryHandler) GetFacultyDirectory(c *gin.Context) {
	if c.Query("sync") == "true" || c.Query("force_sync") == "true" || c.Query("refresh") == "true" {
		h.SyncGoogleDirectory()
	}

	if h.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"success":     true,
			"total":       0,
			"page":        1,
			"limit":       20,
			"total_pages": 0,
			"data":        []FacultyMember{},
			"departments": []gin.H{},
		})
		return
	}

	searchQuery := strings.TrimSpace(strings.ToLower(c.Query("q")))
	if searchQuery == "" {
		searchQuery = strings.TrimSpace(strings.ToLower(c.Query("search")))
	}
	if searchQuery == "" {
		searchQuery = strings.TrimSpace(strings.ToLower(c.Query("query")))
	}

	deptQuery := strings.TrimSpace(strings.ToLower(c.Query("dept")))
	if deptQuery == "" {
		deptQuery = strings.TrimSpace(strings.ToLower(c.Query("department")))
	}

	// Parse pagination parameters
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "24")
	if c.Query("limit") == "" && c.Query("per_page") != "" {
		limitStr = c.Query("per_page")
	}

	page, _ := strconv.Atoi(pageStr)
	if page < 1 {
		page = 1
	}

	isAll := c.Query("all") == "true" || limitStr == "all" || limitStr == "0" || limitStr == "-1"
	limit := 24
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
		if limit > 100 {
			limit = 100
		}
	}

	tableName := h.getFacultyDetailsTableName()

	// If using faculty_details or facutly_details
	if tableName == "faculty_details" || tableName == "facutly_details" {
		whereClause := "WHERE d.phone_number IS NOT NULL AND d.phone_number != 0 AND TRIM(CAST(d.phone_number AS CHAR)) != ''"
		var args []interface{}

		if searchQuery != "" {
			whereClause += " AND (LOWER(d.staff_name) LIKE ? OR LOWER(d.department) LIKE ? OR LOWER(d.designation) LIKE ? OR CAST(d.phone_number AS CHAR) LIKE ?)"
			like := "%" + searchQuery + "%"
			args = append(args, like, like, like, like)
		}

		if deptQuery != "" && deptQuery != "all" {
			whereClause += " AND LOWER(d.department) LIKE ?"
			args = append(args, "%"+deptQuery+"%")
		}

		// Count matching records
		var total int
		countQuery := fmt.Sprintf("SELECT COUNT(*) FROM %s d %s", tableName, whereClause)
		if err := h.DB.QueryRow(countQuery, args...).Scan(&total); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
			return
		}

		totalPages := 1
		if total > 0 && limit > 0 {
			totalPages = (total + limit - 1) / limit
		} else if total == 0 {
			totalPages = 0
		}

		// Fetch department names & counts for filter dropdown (only members with phone)
		deptRows, deptErr := h.DB.Query(fmt.Sprintf(`
			SELECT COALESCE(NULLIF(TRIM(department), ''), 'Faculty & Staff') AS dept_name, COUNT(*) AS count
			FROM %s
			WHERE department IS NOT NULL AND department != ''
			  AND phone_number IS NOT NULL AND phone_number != 0 AND TRIM(CAST(phone_number AS CHAR)) != ''
			GROUP BY dept_name
			ORDER BY dept_name ASC
		`, tableName))
		departments := make([]gin.H, 0)
		if deptErr == nil {
			defer deptRows.Close()
			for deptRows.Next() {
				var name string
				var count int
				if err := deptRows.Scan(&name, &count); err == nil {
					departments = append(departments, gin.H{
						"name":  name,
						"count": count,
					})
				}
			}
		}

		// Prepare server baseURL for photo links
		scheme := "http"
		if c.Request.TLS != nil || c.GetHeader("X-Forwarded-Proto") == "https" {
			scheme = "https"
		}
		host := c.Request.Host
		if host == "" {
			host = os.Getenv("BACKEND_HOST")
			if host == "" {
				host = "localhost:8080"
			}
		}
		baseURL := fmt.Sprintf("%s://%s", scheme, host)

		// Build data query
		var dataQuery string
		var queryArgs []interface{}
		baseSelect := fmt.Sprintf(`
			SELECT 
				d.id,
				COALESCE(NULLIF(TRIM(d.staff_name), ''), 'Faculty') AS name,
				COALESCE((
					SELECT dir.email FROM faculty_directory dir 
					WHERE (d.phone_number IS NOT NULL AND d.phone_number != 0 AND dir.phone LIKE CONCAT('%%', d.phone_number, '%%'))
					   OR LOWER(TRIM(dir.name)) = LOWER(TRIM(d.staff_name))
					ORDER BY (dir.phone LIKE CONCAT('%%', d.phone_number, '%%')) DESC, dir.email ASC
					LIMIT 1
				), '') AS email,
				COALESCE(NULLIF(CAST(d.phone_number AS CHAR), '0'), '') AS phone,
				COALESCE(d.department, '') AS department,
				COALESCE(d.designation, '') AS job_title,
				COALESCE(d.profile_url, '') AS profile_url,
				COALESCE(d.photo_path, '') AS photo_path,
				COALESCE(d.photo_status, '') AS photo_status,
				COALESCE(d.scraped_at, '') AS updated_at
			FROM %s d
			%s
			ORDER BY d.id ASC
		`, tableName, whereClause)

		if isAll {
			dataQuery = baseSelect
			queryArgs = args
		} else {
			offset := (page - 1) * limit
			dataQuery = baseSelect + " LIMIT ? OFFSET ?"
			queryArgs = append(args, limit, offset)
		}

		rows, err := h.DB.Query(dataQuery, queryArgs...)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
			return
		}
		defer rows.Close()

		list := make([]FacultyMember, 0)
		for rows.Next() {
			var f FacultyMember
			var rawPhotoPath, rawPhotoStatus string
			if err := rows.Scan(
				&f.ID,
				&f.Name,
				&f.Email,
				&f.Phone,
				&f.Department,
				&f.JobTitle,
				&f.ProfileURL,
				&rawPhotoPath,
				&rawPhotoStatus,
				&f.UpdatedAt,
			); err == nil {
				// Map photo_path to served image link
				photoPath := strings.TrimSpace(rawPhotoPath)
				photoStatus := strings.TrimSpace(rawPhotoStatus)
				if photoPath != "" && (photoStatus == "ok" || photoStatus == "") {
					cleanName := filepath.Base(strings.ReplaceAll(photoPath, "\\", "/"))
					if cleanName != "" && cleanName != "." {
						diskPath := filepath.Join("data", "faculty_photos", cleanName)
						if fi, err := os.Stat(diskPath); err == nil && !fi.IsDir() {
							f.PhotoURL = fmt.Sprintf("%s/faculty-photos/%s", baseURL, url.PathEscape(cleanName))
						}
					}
				}
				list = append(list, f)
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"success":     true,
			"total":       total,
			"page":        page,
			"limit":       limit,
			"total_pages": totalPages,
			"departments": departments,
			"data":        list,
		})
		return
	}

	// Fallback to faculty_directory if table does not exist
	whereClause := `WHERE LOWER(email) NOT LIKE '%gmail.com' 
		AND LOWER(email) NOT LIKE '%parent%' 
		AND LOWER(email) NOT LIKE '%parents%'
		AND LOWER(email) NOT REGEXP '\\.[a-z]{2,4}[0-9]{2}@'
		AND (LOWER(email) LIKE '%bitsathy.ac.in' OR LOWER(email) LIKE '%bitsathy.in')
		AND phone IS NOT NULL AND TRIM(phone) != '' AND TRIM(phone) != '0'`
	var args []interface{}

	if searchQuery != "" {
		whereClause += " AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(phone) LIKE ? OR LOWER(department) LIKE ? OR LOWER(job_title) LIKE ?)"
		like := "%" + searchQuery + "%"
		args = append(args, like, like, like, like, like)
	}

	if deptQuery != "" && deptQuery != "all" {
		whereClause += " AND LOWER(department) LIKE ?"
		args = append(args, "%"+deptQuery+"%")
	}

	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM faculty_directory %s", whereClause)
	if err := h.DB.QueryRow(countQuery, args...).Scan(&total); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	totalPages := 1
	if total > 0 && limit > 0 {
		totalPages = (total + limit - 1) / limit
	} else if total == 0 {
		totalPages = 0
	}

	deptRows, deptErr := h.DB.Query(`
		SELECT COALESCE(NULLIF(TRIM(department), ''), 'Faculty & Staff') AS dept_name, COUNT(*) AS count
		FROM faculty_directory
		WHERE LOWER(email) NOT LIKE '%gmail.com' 
			AND LOWER(email) NOT LIKE '%parent%' 
			AND LOWER(email) NOT LIKE '%parents%'
			AND LOWER(email) NOT REGEXP '\\.[a-z]{2,4}[0-9]{2}@'
			AND (LOWER(email) LIKE '%bitsathy.ac.in' OR LOWER(email) LIKE '%bitsathy.in')
			AND phone IS NOT NULL AND TRIM(phone) != '' AND TRIM(phone) != '0'
		GROUP BY dept_name
		ORDER BY dept_name ASC
	`)
	departments := make([]gin.H, 0)
	if deptErr == nil {
		defer deptRows.Close()
		for deptRows.Next() {
			var name string
			var count int
			if err := deptRows.Scan(&name, &count); err == nil {
				departments = append(departments, gin.H{
					"name":  name,
					"count": count,
				})
			}
		}
	}

	var dataQuery string
	var queryArgs []interface{}
	if isAll {
		dataQuery = fmt.Sprintf(`
			SELECT id, name, email, phone, COALESCE(photo_url, ''), COALESCE(department, ''), COALESCE(job_title, ''), DATE_FORMAT(updated_at, '%%%%Y-%%%%m-%%%%dT%%%%H:%%%%i:%%%%sZ')
			FROM faculty_directory
			%s
			ORDER BY name ASC
		`, whereClause)
		queryArgs = args
	} else {
		offset := (page - 1) * limit
		dataQuery = fmt.Sprintf(`
			SELECT id, name, email, phone, COALESCE(photo_url, ''), COALESCE(department, ''), COALESCE(job_title, ''), DATE_FORMAT(updated_at, '%%%%Y-%%%%m-%%%%dT%%%%H:%%%%i:%%%%sZ')
			FROM faculty_directory
			%s
			ORDER BY name ASC
			LIMIT ? OFFSET ?
		`, whereClause)
		queryArgs = append(args, limit, offset)
	}

	rows, err := h.DB.Query(dataQuery, queryArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer rows.Close()

	list := make([]FacultyMember, 0)
	for rows.Next() {
		var f FacultyMember
		if err := rows.Scan(&f.ID, &f.Name, &f.Email, &f.Phone, &f.PhotoURL, &f.Department, &f.JobTitle, &f.UpdatedAt); err == nil {
			if isValidFacultyRecord(f.Email, f.Phone) {
				list = append(list, f)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"total":       total,
		"page":        page,
		"limit":       limit,
		"total_pages": totalPages,
		"departments": departments,
		"data":        list,
	})
}

func (h *FacultyDirectoryHandler) TriggerSyncAdmin(c *gin.Context) {
	go h.SyncGoogleDirectory()
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Faculty directory synchronization triggered successfully",
	})
}

package handlers

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
	"strings"
	"sync"
	"time"

	"server/config"

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
	UpdatedAt  string `json:"updated_at"`
}

type FacultyDirectoryHandler struct {
	DB            *sql.DB
	sheetsHandler *SheetHandler
	syncMu        sync.Mutex
}

func NewFacultyDirectoryHandler(sheetsHandler *SheetHandler) *FacultyDirectoryHandler {
	h := &FacultyDirectoryHandler{
		DB:            config.DB,
		sheetsHandler: sheetsHandler,
	}

	// Start 24-hour background ticker sync
	go h.startPeriodicSync()

	return h
}

func (h *FacultyDirectoryHandler) startPeriodicSync() {
	// Wait brief moment for DB initialization
	time.Sleep(3 * time.Second)

	// Run initial sync on startup if table is empty or stale
	h.checkAndRunInitialSync()

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

func isValidFacultyRecord(email, phone string) bool {
	cleanEmail := strings.ToLower(strings.TrimSpace(email))
	cleanPhone := strings.TrimSpace(phone)

	// Must have a non-empty mobile / phone number
	if cleanPhone == "" {
		return false
	}

	if cleanEmail == "" {
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
	if clientID == "" {
		clientID = strings.TrimSpace(os.Getenv("CLIENT_ID"))
	}
	clientSecret := strings.TrimSpace(os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET"))
	if clientSecret == "" {
		clientSecret = strings.TrimSpace(os.Getenv("CLIENT_SECRET"))
	}

	redirectURL := strings.TrimSpace(os.Getenv("GOOGLE_CONTACTS_REDIRECT_URI"))
	if redirectURL == "" {
		redirectURL = strings.TrimSpace(os.Getenv("GOOGLE_DIRECTORY_REDIRECT_URI"))
	}
	if redirectURL == "" {
		redirectURL = strings.TrimSpace(os.Getenv("GOOGLE_OAUTH_REDIRECT_URI"))
	}
	if redirectURL == "" {
		redirectURIS := strings.Split(os.Getenv("GOOGLE_OAUTH_REDIRECT_URIS"), ",")
		if len(redirectURIS) > 0 && strings.TrimSpace(redirectURIS[0]) != "" {
			redirectURL = strings.TrimSpace(redirectURIS[0])
		}
	}
	if redirectURL == "" {
		redirectURL = strings.TrimSpace(os.Getenv("REDIRECT_URL"))
	}
	if redirectURL == "" {
		redirectURL = "http://localhost:8080/auth/callback"
	}

	return &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  redirectURL,
		Scopes: []string{
			"https://www.googleapis.com/auth/contacts.readonly",
			"https://www.googleapis.com/auth/directory.readonly",
			"https://www.googleapis.com/auth/userinfo.profile",
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}
}

func (h *FacultyDirectoryHandler) HandleDirectoryLogin(c *gin.Context) {
	if customLoginURL := strings.TrimSpace(os.Getenv("GOOGLE_CONTACTS_LOGIN_URL")); customLoginURL != "" {
		c.Redirect(http.StatusTemporaryRedirect, customLoginURL)
		return
	}
	if customLoginURL := strings.TrimSpace(os.Getenv("GOOGLE_DIRECTORY_LOGIN_URL")); customLoginURL != "" {
		c.Redirect(http.StatusTemporaryRedirect, customLoginURL)
		return
	}

	cfg := h.GetOAuthConfig()
	url := cfg.AuthCodeURL("state-token", oauth2.AccessTypeOffline, oauth2.ApprovalForce)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *FacultyDirectoryHandler) SyncGoogleDirectory() {
	h.syncMu.Lock()
	defer h.syncMu.Unlock()

	log.Println("🔄 Syncing Faculty Directory strictly from Google People/Contacts API...")

	// Purge legacy/invalid records from database first
	if h.DB != nil {
		res, err := h.DB.Exec(`
			DELETE FROM faculty_directory 
			WHERE COALESCE(TRIM(phone), '') = '' 
			   OR LOWER(email) LIKE '%gmail.com' 
			   OR LOWER(email) LIKE '%parent%' 
			   OR LOWER(email) LIKE '%parents%'
			   OR (LOWER(email) NOT LIKE '%bitsathy.ac.in' AND LOWER(email) NOT LIKE '%bitsathy.in');
		`)
		if err == nil {
			if deleted, _ := res.RowsAffected(); deleted > 0 {
				log.Printf("🧹 Cleaned up %d invalid faculty directory records from DB", deleted)
			}
		}
	}

	var httpClient *http.Client

	// Try using SheetHandler's OAuth Token if available
	if h.sheetsHandler != nil && h.sheetsHandler.oauthConfig != nil && h.sheetsHandler.oauthToken != nil {
		httpClient = h.sheetsHandler.oauthConfig.Client(context.Background(), h.sheetsHandler.oauthToken)
	}

	// Fallback to loading token.json with Bearer authorization header
	if httpClient == nil {
		if f, err := os.Open("token.json"); err == nil {
			defer f.Close()
			var tok oauth2.Token
			if err := json.NewDecoder(f).Decode(&tok); err == nil && (tok.AccessToken != "" || tok.RefreshToken != "") {
				ctx := context.Background()
				cfg := h.GetOAuthConfig()
				httpClient = cfg.Client(ctx, &tok)
			}
		}
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

func (h *FacultyDirectoryHandler) GetFacultyDirectory(c *gin.Context) {
	if c.Query("sync") == "true" || c.Query("force_sync") == "true" || c.Query("refresh") == "true" {
		h.SyncGoogleDirectory()
	}

	if h.DB == nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "total": 0, "data": []FacultyMember{}})
		return
	}

	searchQuery := strings.TrimSpace(strings.ToLower(c.Query("q")))
	deptQuery := strings.TrimSpace(strings.ToLower(c.Query("dept")))

	whereClause := `WHERE COALESCE(TRIM(phone), '') != '' 
		AND LOWER(email) NOT LIKE '%gmail.com' 
		AND LOWER(email) NOT LIKE '%parent%' 
		AND LOWER(email) NOT LIKE '%parents%'
		AND (LOWER(email) LIKE '%bitsathy.ac.in' OR LOWER(email) LIKE '%bitsathy.in')`
	var args []interface{}

	if searchQuery != "" {
		whereClause += " AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(phone) LIKE ? OR LOWER(department) LIKE ?)"
		like := "%" + searchQuery + "%"
		args = append(args, like, like, like, like)
	}

	if deptQuery != "" && deptQuery != "all" {
		whereClause += " AND LOWER(department) LIKE ?"
		args = append(args, "%"+deptQuery+"%")
	}

	query := fmt.Sprintf(`
		SELECT id, name, email, phone, COALESCE(photo_url, ''), COALESCE(department, ''), COALESCE(job_title, ''), DATE_FORMAT(updated_at, '%%Y-%%m-%%dT%%H:%%i:%%sZ')
		FROM faculty_directory
		%s
		ORDER BY name ASC
	`, whereClause)

	rows, err := h.DB.Query(query, args...)
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
		"success": true,
		"total":   len(list),
		"data":    list,
	})
}

func (h *FacultyDirectoryHandler) TriggerSyncAdmin(c *gin.Context) {
	go h.SyncGoogleDirectory()
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Faculty directory synchronization triggered successfully",
	})
}

package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"server/config"

	"github.com/gin-gonic/gin"
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

func (h *FacultyDirectoryHandler) SyncGoogleDirectory() {
	h.syncMu.Lock()
	defer h.syncMu.Unlock()

	log.Println("🔄 Syncing Faculty Directory from Google People/Contacts API...")

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

	// Fallback to loading token.json
	if httpClient == nil {
		if f, err := os.Open("token.json"); err == nil {
			defer f.Close()
			var tok struct {
				AccessToken string `json:"access_token"`
			}
			if err := json.NewDecoder(f).Decode(&tok); err == nil && tok.AccessToken != "" {
				httpClient = &http.Client{Timeout: 10 * time.Second}
			}
		}
	}

	syncedCount := 0

	// 1. Try Google People SDK if httpClient is available
	if httpClient != nil {
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
						respHttp.Body.Close()
					}
					break
				}
				body, _ := io.ReadAll(respHttp.Body)
				respHttp.Body.Close()

				var otherResp struct {
					OtherContacts []struct {
						Names          []*people.Name         `json:"names"`
						EmailAddresses []*people.EmailAddress `json:"emailAddresses"`
						PhoneNumbers   []*people.PhoneNumber  `json:"phoneNumbers"`
						Photos         []*people.Photo        `json:"photos"`
						Organizations  []*people.Organization `json:"organizations"`
					} `json:"otherContacts"`
					NextPageToken string `json:"nextPageToken"`
				}
				if err := json.Unmarshal(body, &otherResp); err == nil {
					for _, oc := range otherResp.OtherContacts {
						syncedCount += h.savePersonToDB(oc.Names, oc.EmailAddresses, oc.PhoneNumbers, oc.Photos, oc.Organizations)
					}
					otherPageToken = otherResp.NextPageToken
					if otherPageToken == "" {
						break
					}
				} else {
					break
				}
			}

			// Query Directory People API with pagination
			dirPageToken := ""
			for {
				dirUrl := "https://people.googleapis.com/v1/people:searchDirectoryPeople?query=&readMask=names,emailAddresses,phoneNumbers,photos,organizations&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_CONTACT&pageSize=1000"
				if dirPageToken != "" {
					dirUrl += "&pageToken=" + dirPageToken
				}
				req, err := http.NewRequest("GET", dirUrl, nil)
				if err != nil {
					break
				}
				respHttp, err := httpClient.Do(req)
				if err != nil || respHttp.StatusCode != http.StatusOK {
					if respHttp != nil {
						respHttp.Body.Close()
					}
					break
				}
				body, _ := io.ReadAll(respHttp.Body)
				respHttp.Body.Close()

				var dirResp struct {
					People []struct {
						Names          []*people.Name         `json:"names"`
						EmailAddresses []*people.EmailAddress `json:"emailAddresses"`
						PhoneNumbers   []*people.PhoneNumber  `json:"phoneNumbers"`
						Photos         []*people.Photo        `json:"photos"`
						Organizations  []*people.Organization `json:"organizations"`
					} `json:"people"`
					NextPageToken string `json:"nextPageToken"`
				}
				if err := json.Unmarshal(body, &dirResp); err == nil {
					for _, p := range dirResp.People {
						syncedCount += h.savePersonToDB(p.Names, p.EmailAddresses, p.PhoneNumbers, p.Photos, p.Organizations)
					}
					dirPageToken = dirResp.NextPageToken
					if dirPageToken == "" {
						break
					}
				} else {
					break
				}
			}

			// A-Z Alphabetical Directory Search with full pagination for complete coverage
			alphabet := []string{"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"}
			for _, letter := range alphabet {
				letterPageToken := ""
				for {
					searchUrl := fmt.Sprintf("https://people.googleapis.com/v1/people:searchDirectoryPeople?query=%s&readMask=names,emailAddresses,phoneNumbers,photos,organizations&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE&sources=DIRECTORY_SOURCE_TYPE_DOMAIN_CONTACT&pageSize=1000", letter)
					if letterPageToken != "" {
						searchUrl += "&pageToken=" + letterPageToken
					}
					req, err := http.NewRequest("GET", searchUrl, nil)
					if err != nil {
						break
					}
					respHttp, err := httpClient.Do(req)
					if err != nil || respHttp.StatusCode != http.StatusOK {
						if respHttp != nil {
							respHttp.Body.Close()
						}
						break
					}
					body, _ := io.ReadAll(respHttp.Body)
					respHttp.Body.Close()
					var searchResp struct {
						People []struct {
							Names          []*people.Name         `json:"names"`
							EmailAddresses []*people.EmailAddress `json:"emailAddresses"`
							PhoneNumbers   []*people.PhoneNumber  `json:"phoneNumbers"`
							Photos         []*people.Photo        `json:"photos"`
							Organizations  []*people.Organization `json:"organizations"`
						} `json:"people"`
						NextPageToken string `json:"nextPageToken"`
					}
					if err := json.Unmarshal(body, &searchResp); err == nil {
						for _, p := range searchResp.People {
							syncedCount += h.savePersonToDB(p.Names, p.EmailAddresses, p.PhoneNumbers, p.Photos, p.Organizations)
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
	}

	// 2. Enrich/Sync with users and tracker_users tables in MySQL DB
	if h.DB != nil {
		rowsUser, err := h.DB.Query(`
			SELECT 
				COALESCE(email, ''), 
				COALESCE(NULLIF(TRIM(display_name), ''), COALESCE(email, '')) AS name,
				COALESCE(phone, ''),
				COALESCE(photo_url, '')
			FROM users 
			WHERE COALESCE(TRIM(phone), '') != ''
			  AND email NOT LIKE '%parent%' AND email NOT LIKE '%parents%'
			  AND email NOT LIKE '%gmail.com'
			  AND (email LIKE '%bitsathy.ac.in' OR email LIKE '%bitsathy.in')
		`)
		if err == nil {
			defer rowsUser.Close()
			for rowsUser.Next() {
				var email, name, phone, photoURL string
				if err := rowsUser.Scan(&email, &name, &phone, &photoURL); err == nil {
					cleanEmail := strings.ToLower(strings.TrimSpace(email))
					cleanPhone := strings.TrimSpace(phone)
					if isValidFacultyRecord(cleanEmail, cleanPhone) {
						dept := extractDeptFromEmail(cleanEmail)
						h.upsertFacultyRecord(cleanEmail, name, cleanPhone, photoURL, dept, "Faculty / Staff")
						syncedCount++
					}
				}
			}
		}

		rowsTrack, err := h.DB.Query(`
			SELECT 
				COALESCE(email, ''), 
				COALESCE(NULLIF(TRIM(user_id), ''), COALESCE(email, '')) AS name,
				COALESCE(phone, '')
			FROM tracker_users 
			WHERE COALESCE(TRIM(phone), '') != ''
			  AND email NOT LIKE '%parent%' AND email NOT LIKE '%parents%'
			  AND email NOT LIKE '%gmail.com'
			  AND (email LIKE '%bitsathy.ac.in' OR email LIKE '%bitsathy.in')
		`)
		if err == nil {
			defer rowsTrack.Close()
			for rowsTrack.Next() {
				var email, name, phone string
				if err := rowsTrack.Scan(&email, &name, &phone); err == nil {
					cleanEmail := strings.ToLower(strings.TrimSpace(email))
					cleanPhone := strings.TrimSpace(phone)
					if isValidFacultyRecord(cleanEmail, cleanPhone) {
						dept := extractDeptFromEmail(cleanEmail)
						h.upsertFacultyRecord(cleanEmail, name, cleanPhone, "", dept, "Faculty / Staff")
						syncedCount++
					}
				}
			}
		}
	}

	log.Printf("✅ Faculty Directory full sync completed. Processed records: %d", syncedCount)
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

	// Fallback: Check MySQL DB for phone number if not present in Google Contacts
	if phone == "" && h.DB != nil {
		var dbPhone sql.NullString
		_ = h.DB.QueryRow(`
			SELECT COALESCE(NULLIF(TRIM(phone), ''), '') FROM (
				SELECT phone FROM tracker_users WHERE LOWER(TRIM(email)) = ? AND COALESCE(TRIM(phone), '') != ''
				UNION
				SELECT phone FROM users WHERE LOWER(TRIM(email)) = ? AND COALESCE(TRIM(phone), '') != ''
			) AS combined LIMIT 1
		`, email, email).Scan(&dbPhone)
		if dbPhone.Valid {
			phone = strings.TrimSpace(dbPhone.String)
		}
	}

	if !isValidFacultyRecord(email, phone) {
		return 0
	}

	name := email
	if len(names) > 0 && strings.TrimSpace(names[0].DisplayName) != "" {
		name = strings.TrimSpace(names[0].DisplayName)
	}

	photoURL := ""
	if len(photos) > 0 && strings.TrimSpace(photos[0].Url) != "" {
		photoURL = strings.TrimSpace(photos[0].Url)
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
			name = COALESCE(NULLIF(VALUES(name), ''), name),
			phone = CASE WHEN VALUES(phone) != '' THEN VALUES(phone) ELSE phone END,
			photo_url = CASE WHEN VALUES(photo_url) != '' THEN VALUES(photo_url) ELSE photo_url END,
			department = CASE WHEN VALUES(department) != '' THEN VALUES(department) ELSE department END,
			job_title = CASE WHEN VALUES(job_title) != '' THEN VALUES(job_title) ELSE job_title END,
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

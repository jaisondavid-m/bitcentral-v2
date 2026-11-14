package middleware

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"server/config"
	"server/utils"

	"github.com/gin-gonic/gin"
)

type auditLogItem struct {
	Method     string
	Endpoint   string
	Query      string
	Payload    string
	Response   string
	IPAddress  string
	UserUID    string
	UserName   string
	RollNo     string
	Role       string
	StatusCode int
}

var (
	auditQueue = make(chan auditLogItem, 10000)
	emailRollCache sync.Map
)

func init() {
	// Launch background batch workers for high-throughput writes to Logs DB
	for i := 0; i < 2; i++ {
		go processAuditLogsBatch()
	}
}

// processAuditLogsBatch drains items from auditQueue and flushes in multi-row batches
func processAuditLogsBatch() {
	batch := make([]auditLogItem, 0, 50)
	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	flush := func() {
		if len(batch) == 0 {
			return
		}
		items := batch
		batch = make([]auditLogItem, 0, 50)

		db := config.GetLogsDB()
		if db == nil {
			return
		}

		// Build multi-row batch INSERT
		var placeholders []string
		args := make([]any, 0, len(items)*11)

		for _, item := range items {
			placeholders = append(placeholders, "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
			args = append(args,
				item.Method,
				item.Endpoint,
				item.Query,
				nullIfEmpty(item.Payload),
				nullIfEmpty(item.Response),
				item.IPAddress,
				nullIfEmpty(item.UserUID),
				nullIfEmpty(item.UserName),
				nullIfEmpty(item.RollNo),
				nullIfEmpty(item.Role),
				item.StatusCode,
			)
		}

		query := fmt.Sprintf(
			"INSERT INTO audit_logs (method, endpoint, query, payload, response, ip_address, user_uid, user_name, roll_no, role, status_code) VALUES %s",
			strings.Join(placeholders, ","),
		)

		if _, err := db.Exec(query, args...); err != nil {
			log.Printf("⚠️ Failed to write audit batch (%d logs): %v", len(items), err)
		}
	}

	for {
		select {
		case item, ok := <-auditQueue:
			if !ok {
				flush()
				return
			}
			batch = append(batch, item)
			if len(batch) >= 50 {
				flush()
			}
		case <-ticker.C:
			flush()
		}
	}
}

func nullIfEmpty(s string) any {
	if s == "" {
		return nil
	}
	return s
}

// CacheEmailRoll caches an email-to-roll number mapping for fast audit log tagging
func CacheEmailRoll(email, roll string) {
	cleanEmail := strings.ToLower(strings.TrimSpace(email))
	cleanRoll := strings.ToUpper(strings.TrimSpace(roll))
	if cleanEmail != "" && cleanRoll != "" {
		emailRollCache.Store(cleanEmail, cleanRoll)
	}
}

type bodyLogWriter struct {
	gin.ResponseWriter
	body *bytes.Buffer
	max  int
}

func (w *bodyLogWriter) Write(b []byte) (int, error) {
	if w.body.Len() < w.max {
		toWrite := len(b)
		if w.body.Len()+toWrite > w.max {
			toWrite = w.max - w.body.Len()
		}
		w.body.Write(b[:toWrite])
	}
	return w.ResponseWriter.Write(b)
}

func (w *bodyLogWriter) WriteString(s string) (int, error) {
	if w.body.Len() < w.max {
		toWrite := len(s)
		if w.body.Len()+toWrite > w.max {
			toWrite = w.max - w.body.Len()
		}
		w.body.WriteString(s[:toWrite])
	}
	return w.ResponseWriter.WriteString(s)
}

// AuditLogger records incoming API requests into the high-write Logs database (config.DBLogs)
func AuditLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path

		// Skip noisy / static paths to save database writes
		// Note: Also skip /admin/audit-logs reading endpoints to avoid polluting the log stream with audit-viewer polling
		if path == "/health" ||
			path == "/api/deployment/status" ||
			path == "/favicon.ico" ||
			strings.HasPrefix(path, "/pdfs/") ||
			strings.HasPrefix(path, "/uploads/") ||
			strings.HasPrefix(path, "/faculty-photos/") ||
			strings.HasPrefix(path, "/admin/audit-logs") ||
			c.Request.Method == http.MethodOptions {
			c.Next()
			return
		}

		var payload string
		if c.Request.Body != nil {
			bodyBytes, err := io.ReadAll(c.Request.Body)
			if err == nil {
				// Restore body for subsequent handlers
				c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
				if len(bodyBytes) > 0 {
					payload = string(bodyBytes)
					if len(payload) > 100000 {
						payload = payload[:100000]
					}
				}
			}
		}

		blw := &bodyLogWriter{
			ResponseWriter: c.Writer,
			body:           bytes.NewBuffer(nil),
			max:            100000,
		}
		c.Writer = blw

		// Process downstream request handlers
		c.Next()

		respBody := blw.body.String()

		// Extract user details if present in context or token
		var userUID, userName, userEmail, userRole, rollNo string

		// 1. Check standardized typed claims in Gin context
		if claims, ok := utils.GetAuthClaims(c); ok && claims != nil {
			userUID = claims.UID
			userName = claims.Name
			userEmail = claims.Email
			userRole = claims.Role
		}

		// 2. Check context keys
		if userUID == "" {
			if uidVal, exists := c.Get("actor_uid"); exists {
				if s, ok := uidVal.(string); ok {
					userUID = s
				}
			}
		}
		if userUID == "" {
			if uidVal, exists := c.Get("uid"); exists {
				if s, ok := uidVal.(string); ok {
					userUID = s
				}
			}
		}
		if userEmail == "" {
			if emailVal, exists := c.Get("actor_email"); exists {
				if s, ok := emailVal.(string); ok {
					userEmail = s
				}
			}
		}
		if userEmail == "" {
			if emailVal, exists := c.Get("email"); exists {
				if s, ok := emailVal.(string); ok {
					userEmail = s
				}
			}
		}
		if userRole == "" {
			if roleVal, exists := c.Get("actor_role"); exists {
				if s, ok := roleVal.(string); ok {
					userRole = s
				}
			}
		}

		// 3. Fallback: inspect auth token if context didn't have claims
		if userUID == "" || userName == "" {
			token := utils.ExtractAuthToken(c)
			if token != "" {
				if claims, err := config.VerifyGoogleToken(token); err == nil && claims != nil {
					if userUID == "" {
						userUID = claims.UID
						if userUID == "" {
							userUID = claims.Email
						}
					}
					if userName == "" {
						userName = claims.Name
					}
					if userEmail == "" {
						userEmail = claims.Email
					}
					if userRole == "" {
						userRole = claims.Role
					}
				}
			}
		}

		// Fallback for userUID and userName from email
		if userUID == "" && userEmail != "" {
			userUID = userEmail
		}
		if userName == "" && userEmail != "" {
			userName = strings.Split(userEmail, "@")[0]
		}

		// 4. Resolve Roll Number
		if rVal, exists := c.Get("roll_no"); exists {
			if s, ok := rVal.(string); ok && s != "" {
				rollNo = s
			}
		}
		if rollNo == "" {
			if rVal, exists := c.Get("roll"); exists {
				if s, ok := rVal.(string); ok && s != "" {
					rollNo = s
				}
			}
		}
		if rollNo == "" {
			rollNo = c.Query("roll_no")
			if rollNo == "" {
				rollNo = c.Query("roll")
			}
			if rollNo == "" {
				rollNo = c.Query("rollno")
			}
			if rollNo == "" {
				rollNo = c.Query("register_no")
			}
		}
		if rollNo == "" && userEmail != "" {
			cleanEmail := strings.ToLower(strings.TrimSpace(userEmail))
			if cached, ok := emailRollCache.Load(cleanEmail); ok {
				if s, ok := cached.(string); ok {
					rollNo = s
				}
			}
			if rollNo == "" && strings.Contains(cleanEmail, "@") {
				username := strings.Split(cleanEmail, "@")[0]
				if strings.HasPrefix(username, "7376") {
					rollNo = strings.ToUpper(username)
				}
			}
		}

		item := auditLogItem{
			Method:     c.Request.Method,
			Endpoint:   path,
			Query:      c.Request.URL.RawQuery,
			Payload:    payload,
			Response:   respBody,
			IPAddress:  c.ClientIP(),
			UserUID:    userUID,
			UserName:   userName,
			RollNo:     rollNo,
			Role:       userRole,
			StatusCode: c.Writer.Status(),
		}

		// Non-blocking write to high-capacity buffer
		select {
		case auditQueue <- item:
		default:
			// If buffer is saturated under extreme spike, log warning
			log.Printf("⚠️ Audit queue full; log dropped for %s %s", item.Method, item.Endpoint)
		}
	}
}

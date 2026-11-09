package middleware

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"strings"

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
	auditQueue = make(chan auditLogItem, 1000)
)

func init() {
	go processAuditLogs()
}

func processAuditLogs() {
	for item := range auditQueue {
		db := config.GetLogsDB()
		if db == nil {
			continue
		}

		query := `
			INSERT INTO audit_logs (method, endpoint, query, payload, response, ip_address, user_uid, user_name, roll_no, role, status_code)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`
		if _, err := db.Exec(query,
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
		); err != nil {
			log.Printf("⚠️ Failed to write audit log to free DB: %v", err)
		}
	}
}

func nullIfEmpty(s string) any {
	if s == "" {
		return nil
	}
	return s
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
		// Skip noisy / static paths to save database writes
		path := c.Request.URL.Path
		if path == "/health" ||
			path == "/api/deployment/status" ||
			path == "/favicon.ico" ||
			strings.HasPrefix(path, "/pdfs/") ||
			strings.HasPrefix(path, "/uploads/") ||
			strings.HasPrefix(path, "/faculty-photos/") ||
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

		// Process request
		c.Next()

		respBody := blw.body.String()

		// Extract user details if present in context or token
		var userUID, userName, userRole, rollNo string
		if uidVal, exists := c.Get("actor_uid"); exists {
			if s, ok := uidVal.(string); ok {
				userUID = s
			}
		}
		if roleVal, exists := c.Get("actor_role"); exists {
			if s, ok := roleVal.(string); ok {
				userRole = s
			}
		}

		token := utils.ExtractAuthToken(c)
		if token != "" {
			if claims, err := config.VerifyGoogleToken(token); err == nil && claims != nil {
				if userUID == "" {
					userUID = claims.UID
				}
				if userName == "" {
					userName = claims.Name
				}
				if userRole == "" {
					userRole = claims.Role
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

		// Non-blocking write to channel worker so HTTP latency is zero
		select {
		case auditQueue <- item:
		default:
			// Queue is full under extreme burst; drop to protect memory
		}
	}
}


package middleware

import (
	"bytes"
	"encoding/json"
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
			INSERT INTO audit_logs (method, endpoint, query, payload, ip_address, user_uid, user_name, roll_no, role, status_code)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`
		if _, err := db.Exec(query,
			item.Method,
			item.Endpoint,
			item.Query,
			item.Payload,
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
		if c.Request.Method == http.MethodPost || c.Request.Method == http.MethodPut || c.Request.Method == http.MethodDelete || c.Request.Method == http.MethodPatch {
			if c.Request.Body != nil {
				bodyBytes, err := io.ReadAll(c.Request.Body)
				if err == nil {
					// Restore body for subsequent handlers
					c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
					payload = sanitizePayload(bodyBytes)
				}
			}
		}

		// Process request
		c.Next()

		// Extract user details if present in context or token
		var userUID, userName, userRole, rollNo string
		if uidVal, exists := c.Get("actor_uid"); exists {
			if s, ok := uidVal.(string); ok {
				userUID = s
			}
		}

		token := utils.ExtractAuthToken(c)
		if token != "" {
			if claims, err := config.VerifyGoogleToken(token); err == nil && claims != nil {
				if userUID == "" {
					userUID = claims.UID
				}
				userName = claims.Name
				userRole = claims.Role
			}
		}

		item := auditLogItem{
			Method:     c.Request.Method,
			Endpoint:   path,
			Query:      c.Request.URL.RawQuery,
			Payload:    payload,
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

func sanitizePayload(data []byte) string {
	if len(data) == 0 {
		return ""
	}
	if len(data) > 2048 {
		data = data[:2048]
	}

	var m map[string]any
	if err := json.Unmarshal(data, &m); err == nil {
		maskSensitiveKeys(m)
		if cleaned, err := json.Marshal(m); err == nil {
			return string(cleaned)
		}
	}
	return string(data)
}

func maskSensitiveKeys(m map[string]any) {
	sensitive := []string{"password", "token", "secret", "private_key", "credentials", "authorization"}
	for k, v := range m {
		kLower := strings.ToLower(k)
		for _, s := range sensitive {
			if strings.Contains(kLower, s) {
				m[k] = "[REDACTED]"
				break
			}
		}
		if childMap, ok := v.(map[string]any); ok {
			maskSensitiveKeys(childMap)
		}
	}
}


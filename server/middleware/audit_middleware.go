package middleware

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"
	"sync"

	"server/config"

	"github.com/gin-gonic/gin"
)

type userCacheItem struct {
	Name   string
	RollNo string
	Role   string
}

var (
	userCache sync.Map // email -> userCacheItem
	rollNoRegex = regexp.MustCompile(`^[a-zA-Z0-9]{8,15}$`)
)

func resolveUserInfo(c *gin.Context) (uid, name, rollNo, role string) {
	token := getToken(c)
	if token == "" {
		if val, ok := c.Get("actor_uid"); ok {
			if uidStr, ok := val.(string); ok && uidStr != "" {
				uid = uidStr
			}
		}
		if uid == "" {
			return "", "", "", ""
		}
	}

	var claims *config.GoogleUserClaims
	var err error
	if token != "" {
		claims, err = config.VerifyGoogleToken(token)
		if err != nil || claims == nil {
			claims, err = config.VerifyAppJWT(token)
		}
	}

	if claims != nil {
		uid = claims.UID
		name = claims.Name
		role = claims.Role
		email := strings.ToLower(strings.TrimSpace(claims.Email))

		// Try extracting roll number from email prefix if it looks like roll_no (e.g., 7376241cs101@bitsathy.in)
		if email != "" {
			parts := strings.Split(email, "@")
			if len(parts) == 2 && rollNoRegex.MatchString(parts[0]) {
				rollNo = strings.ToUpper(parts[0])
			}
		}

		// Check cache
		if email != "" {
			if cached, ok := userCache.Load(email); ok {
				item := cached.(userCacheItem)
				if name == "" {
					name = item.Name
				}
				if rollNo == "" {
					rollNo = item.RollNo
				}
				if role == "" {
					role = item.Role
				}
				if name == "" {
					parts := strings.Split(email, "@")
					if len(parts) > 0 {
						name = parts[0]
					}
				}
				return uid, name, rollNo, role
			}
		}

		// Query DB for name, roll_no, role if missing or to populate cache
		if config.DB != nil && email != "" {
			var dbName, dbRole, dbRoll string

			// Lookup roll_no from tracker_users
			_ = config.DB.QueryRow(
				`SELECT COALESCE(user_id, ''), COALESCE(name, '') FROM tracker_users WHERE LOWER(TRIM(email)) = ? LIMIT 1`,
				email,
			).Scan(&dbRoll, &dbName)

			// Lookup role from users
			if dbRole == "" {
				_ = config.DB.QueryRow(
					`SELECT COALESCE(role, 'user'), COALESCE(display_name, '') FROM users WHERE LOWER(TRIM(email)) = ? LIMIT 1`,
					email,
				).Scan(&dbRole, &dbName)
			}

			if name == "" && dbName != "" {
				name = dbName
			}
			if rollNo == "" && dbRoll != "" {
				rollNo = dbRoll
			}
			if role == "" && dbRole != "" {
				role = dbRole
			}

			userCache.Store(email, userCacheItem{
				Name:   name,
				RollNo: rollNo,
				Role:   role,
			})
		}

		if name == "" && email != "" {
			parts := strings.Split(email, "@")
			if len(parts) > 0 {
				name = parts[0]
			}
		}
	}

	if role == "" {
		role = "user"
	}

	return uid, name, rollNo, role
}

func AuditLoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		path := c.Request.URL.Path

		// Exclude noise, static files, health check, and audit logs endpoint
		if path == "/health" ||
			path == "/admin/audit-logs" ||
			strings.HasPrefix(path, "/pdfs") ||
			strings.HasPrefix(path, "/uploads") ||
			strings.HasPrefix(path, "/favicon") ||
			c.Request.Method == http.MethodOptions {
			c.Next()
			return
		}

		// Read request payload for state-changing or POST/PUT methods
		var payload string
		if c.Request.Body != nil && (c.Request.Method == http.MethodPost || c.Request.Method == http.MethodPut || c.Request.Method == http.MethodPatch || c.Request.Method == http.MethodDelete) {
			bodyBytes, err := io.ReadAll(c.Request.Body)
			if err == nil {
				c.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
				payloadStr := string(bodyBytes)
				// Limit payload size to 10k chars
				if len(payloadStr) > 10000 {
					payloadStr = payloadStr[:10000] + "... [truncated]"
				}
				payload = payloadStr
			}
		}

		method := c.Request.Method
		query := c.Request.URL.RawQuery
		ip := c.ClientIP()

		// Resolve user details if authenticated
		userUID, userName, rollNo, userRole := resolveUserInfo(c)

		// Execute downstream handlers
		c.Next()

		// If user wasn't identified before c.Next(), try resolving again in case downstream handlers set auth context
		if userUID == "" && userName == "" {
			userUID, userName, rollNo, userRole = resolveUserInfo(c)
		}

		statusCode := c.Writer.Status()

		// Asynchronously save audit log so API latency is untouched
		go func(m, ep, q, p, clientIP, uid, uname, rno, rrole string, status int) {
			defer func() {
				if err := recover(); err != nil {
					log.Printf("⚠️ Audit logger panic recovered: %v", err)
				}
			}()

			if config.DB == nil {
				return
			}

			querySQL := `INSERT INTO audit_logs (method, endpoint, query, payload, ip_address, user_uid, user_name, roll_no, role, status_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
			_, _ = config.DB.Exec(querySQL, m, ep, q, p, clientIP, uid, uname, rno, rrole, status)
		}(method, path, query, payload, ip, userUID, userName, rollNo, userRole, statusCode)
	}
}

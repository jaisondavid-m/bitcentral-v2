package middleware

import (
	"net/http"
	"strings"

	"server/config"

	"github.com/gin-gonic/gin"
)

func getToken(c *gin.Context) string {
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	if authHeader != "" {
		if len(authHeader) > 7 && strings.EqualFold(authHeader[:7], "bearer ") {
			return strings.TrimSpace(authHeader[7:])
		}
		if token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer")); token != "" && token != authHeader {
			return token
		}
		return authHeader
	}
	cookieNames := []string{"google_auth_token", "jwt", "token", "auth_token", "access_token"}
	for _, name := range cookieNames {
		if cookieVal, err := c.Cookie(name); err == nil && strings.TrimSpace(cookieVal) != "" {
			return strings.TrimSpace(cookieVal)
		}
	}
	return ""
}

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := getToken(c)
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Unauthorized: Authentication token is required",
			})
			c.Abort()
			return
		}

		claims, err := config.VerifyGoogleToken(token)
		if err != nil || claims == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid or expired authentication token",
			})
			c.Abort()
			return
		}

		uid := strings.TrimSpace(claims.UID)
		email := strings.ToLower(strings.TrimSpace(claims.Email))

		// Strict server-side database validation: NEVER trust client claims
		if config.DB != nil {
			var role string
			var blocked int
			err := config.DB.QueryRow(`
				SELECT COALESCE(role, 'user'), COALESCE(blocked, 0)
				FROM users
				WHERE (google_id != '' AND google_id = ?) OR (uid != '' AND uid = ?) OR (email != '' AND LOWER(TRIM(email)) = ?)
				LIMIT 1`,
				uid, uid, email,
			).Scan(&role, &blocked)

			if err == nil {
				if blocked != 0 {
					c.JSON(http.StatusForbidden, gin.H{
						"success": false,
						"message": "Account is blocked. Contact support for assistance.",
					})
					c.Abort()
					return
				}

				r := strings.ToLower(strings.TrimSpace(role))
				// If role in DB is admin or superadmin, grant access
				if r == "admin" || r == "superadmin" || r == "super_admin" {
					c.Set("actor_uid", uid)
					c.Set("actor_email", email)
					c.Set("actor_role", r)
					c.Set("is_admin", true)
					c.Set("is_super_admin", r == "superadmin" || r == "super_admin")
					c.Next()
					return
				}
			}

			// Fallback: check admins table in DB
			var count int
			err = config.DB.QueryRow(`
				SELECT COUNT(*)
				FROM admins a
				LEFT JOIN users u ON a.uid = u.uid
				WHERE (a.uid = ? OR LOWER(TRIM(u.email)) = ?)
				  AND COALESCE(u.blocked, 0) = 0`,
				uid, email,
			).Scan(&count)

			if err == nil && count > 0 {
				c.Set("actor_uid", uid)
				c.Set("actor_email", email)
				c.Set("actor_role", "admin")
				c.Set("is_admin", true)
				c.Set("is_super_admin", false)
				c.Next()
				return
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Unauthorized admin access: insufficient privileges",
		})
		c.Abort()
	}
}

func RequireSuperAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := getToken(c)
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Unauthorized: Authentication token is required",
			})
			c.Abort()
			return
		}

		claims, err := config.VerifyGoogleToken(token)
		if err != nil || claims == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid or expired authentication token",
			})
			c.Abort()
			return
		}

		uid := strings.TrimSpace(claims.UID)
		email := strings.ToLower(strings.TrimSpace(claims.Email))

		// Strict server-side database validation: only superadmin role in DB is allowed
		if config.DB != nil {
			var role string
			var blocked int
			err := config.DB.QueryRow(`
				SELECT COALESCE(role, 'user'), COALESCE(blocked, 0)
				FROM users
				WHERE (google_id != '' AND google_id = ?) OR (uid != '' AND uid = ?) OR (email != '' AND LOWER(TRIM(email)) = ?)
				LIMIT 1`,
				uid, uid, email,
			).Scan(&role, &blocked)

			if err == nil {
				if blocked != 0 {
					c.JSON(http.StatusForbidden, gin.H{
						"success": false,
						"message": "Account is blocked.",
					})
					c.Abort()
					return
				}

				r := strings.ToLower(strings.TrimSpace(role))
				if r == "superadmin" || r == "super_admin" {
					c.Set("actor_uid", uid)
					c.Set("actor_email", email)
					c.Set("actor_role", r)
					c.Set("is_admin", true)
					c.Set("is_super_admin", true)
					c.Next()
					return
				}
			}
		}

		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"message": "Unauthorized super admin access: super privileges required",
		})
		c.Abort()
	}
}

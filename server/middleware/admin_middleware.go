package middleware

import (
	"strings"

	"server/config"
	"server/response"
	"server/utils"

	"github.com/gin-gonic/gin"
)

// validateAdminAccess checks if the token belongs to an unblocked user with admin privileges
func validateAdminAccess(c *gin.Context) bool {
	token := utils.ExtractAuthToken(c)
	if token == "" {
		response.Unauthorized(c, "Authentication token is required")
		c.Abort()
		return false
	}

	claims, err := config.VerifyGoogleToken(token)
	if err != nil || claims == nil {
		response.Unauthorized(c, "Invalid or expired authentication token")
		c.Abort()
		return false
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
				response.Forbidden(c, "Account is blocked. Contact support for assistance.")
				c.Abort()
				return false
			}

			r := strings.ToLower(strings.TrimSpace(role))
			if r == "admin" || r == "superadmin" || r == "super_admin" {
				utils.SetAuthContext(c, claims, true)
				return true
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
			utils.SetAuthContext(c, claims, true)
			return true
		}
	}

	response.Forbidden(c, "Unauthorized: administrator privileges required")
	c.Abort()
	return false
}

// RequireAdmin verifies that the requesting user has valid admin rights
func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		if validateAdminAccess(c) {
			c.Next()
		}
	}
}

// RequireSuperAdmin verifies that the requesting user has administrative privileges
func RequireSuperAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		if validateAdminAccess(c) {
			c.Next()
		}
	}
}

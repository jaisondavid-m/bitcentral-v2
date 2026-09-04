package middleware

import (
	"net/http"
	"strings"

	"server/config"

	"github.com/gin-gonic/gin"
)

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Unauthorized",
			})
			c.Abort()
			return
		}

		claims, err := config.VerifyGoogleToken(token)
		if err != nil || claims == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Invalid authentication token",
			})
			c.Abort()
			return
		}

		uid := claims.UID
		email := strings.ToLower(strings.TrimSpace(claims.Email))

		// Check role in users table
		if config.DB != nil {
			var role string
			err := config.DB.QueryRow(`SELECT role FROM users WHERE (google_id != '' AND google_id = ?) OR (uid != '' AND uid = ?) OR (email != '' AND LOWER(TRIM(email)) = ?)`, uid, uid, email).Scan(&role)
			if err == nil {
				r := strings.ToLower(strings.TrimSpace(role))
				if r == "admin" || r == "superadmin" || r == "super_admin" {
					c.Set("actor_uid", uid)
					c.Next()
					return
				}
			}

			// Fallback: check admins table in DB
			var count int
			err = config.DB.QueryRow(`SELECT COUNT(*) FROM admins a LEFT JOIN users u ON a.uid = u.uid WHERE a.uid = ? OR LOWER(TRIM(u.email)) = ?`, uid, email).Scan(&count)
			if err == nil && count > 0 {
				c.Set("actor_uid", uid)
				c.Next()
				return
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized admin access"})
		c.Abort()
	}
}

func RequireSuperAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
			c.Abort()
			return
		}

		claims, err := config.VerifyGoogleToken(token)
		if err != nil || claims == nil {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
			c.Abort()
			return
		}

		uid := claims.UID
		email := strings.ToLower(strings.TrimSpace(claims.Email))

		// Check role in users table
		if config.DB != nil {
			var role string
			err := config.DB.QueryRow(`SELECT role FROM users WHERE (google_id != '' AND google_id = ?) OR (uid != '' AND uid = ?) OR (email != '' AND LOWER(TRIM(email)) = ?)`, uid, uid, email).Scan(&role)
			if err == nil {
				r := strings.ToLower(strings.TrimSpace(role))
				if r == "superadmin" || r == "super_admin" {
					c.Set("actor_uid", uid)
					c.Next()
					return
				}
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized super admin access"})
		c.Abort()
	}
}

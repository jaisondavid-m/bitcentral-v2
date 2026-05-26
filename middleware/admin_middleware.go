package middleware

import (
	"net/http"
	"os"
	"strings"

	"server/config"

	"github.com/gin-gonic/gin"
)

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		adminUID := strings.TrimSpace(os.Getenv("ADMIN_FIREBASE_UID"))
		superAdminUID := strings.TrimSpace(os.Getenv("SUPER_ADMIN_FIREBASE_UID"))
		if adminUID == "" && superAdminUID == "" {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Admin or Super Admin UID is not configured",
			})
			c.Abort()
			return
		}

		if config.FirebaseApp == nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{
				"success": false,
				"message": "Firebase is not initialized",
			})
			c.Abort()
			return
		}

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

		client, err := config.FirebaseAuthClient()
		if err != nil || client == nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to initialize Firebase auth",
			})
			c.Abort()
			return
		}

		decodedToken, err := client.VerifyIDToken(c.Request.Context(), token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
			c.Abort()
			return
		}

		uid := decodedToken.UID
		// allow if matches configured single admin
		if adminUID != "" && uid == adminUID {
			c.Set("actor_uid", uid)
			c.Next()
			return
		}

		// allow super admin
		if superAdminUID != "" && uid == superAdminUID {
			c.Set("actor_uid", uid)
			c.Next()
			return
		}

		// fallback: check admins table in DB
		if config.DB != nil {
			var count int
			err := config.DB.QueryRow(`SELECT COUNT(*) FROM admins WHERE uid = ?`, uid).Scan(&count)
			if err == nil && count > 0 {
				c.Set("actor_uid", uid)
				c.Next()
				return
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
		c.Abort()
		return
	}
}

func RequireSuperAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		superAdminUID := strings.TrimSpace(os.Getenv("SUPER_ADMIN_FIREBASE_UID"))
		if superAdminUID == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Super admin UID is not configured"})
			c.Abort()
			return
		}

		if config.FirebaseApp == nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"success": false, "message": "Firebase is not initialized"})
			c.Abort()
			return
		}

		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
			c.Abort()
			return
		}

		client, err := config.FirebaseAuthClient()
		if err != nil || client == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to initialize Firebase auth"})
			c.Abort()
			return
		}

		decodedToken, err := client.VerifyIDToken(c.Request.Context(), token)
		if err != nil || decodedToken.UID != superAdminUID {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
			c.Abort()
			return
		}

		c.Set("actor_uid", decodedToken.UID)
		c.Next()
	}
}

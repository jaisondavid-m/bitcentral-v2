package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"

	"server/config"

	"github.com/gin-gonic/gin"
)

func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		adminUID := strings.TrimSpace(os.Getenv("ADMIN_FIREBASE_UID"))
		if adminUID == "" {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Admin UID is not configured",
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

		client, err := config.FirebaseApp.Auth(context.Background())
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to initialize Firebase auth",
			})
			c.Abort()
			return
		}

		decodedToken, err := client.VerifyIDToken(c.Request.Context(), token)
		if err != nil || decodedToken.UID != adminUID {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Unauthorized",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

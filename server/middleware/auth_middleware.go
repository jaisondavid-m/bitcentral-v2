package middleware

import (
	"strings"

	"server/config"
	"server/response"
	"server/utils"

	"github.com/gin-gonic/gin"
)

var publicPrefixes = []string{
	"/health",
	"/auth/login",
	"/auth/callback",
	"/auth/google",
	"/auth/logout",
	"/faculty-directory/auth/login",
	"/faculty-photos",
	"/faculty/photos",
	"/api/faculty-photos",
	"/api/faculty/photos",
	"/cards",
	"/uploads",
	"/sponsors/leaderboard",
	"/sponsors/department-leaderboard",
	"/sponsors/certificate",
}

func isPublicPath(path string) bool {
	for _, p := range publicPrefixes {
		if path == p || strings.HasPrefix(path, p+"/") {
			return true
		}
	}
	return false
}

// RequireAuth enforces valid user authentication on protected API endpoints
func RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Allow internal service requests without user tokens
		if utils.IsInternalServiceRequest(c) {
			c.Set("internal_service", true)
			c.Next()
			return
		}

		token := utils.ExtractAuthToken(c)
		if token != "" {
			claims, err := config.VerifyGoogleToken(token)
			if err == nil && claims != nil {
				utils.SetAuthContext(c, claims, false)
				c.Next()
				return
			}
		}

		// Allow public routes if configured within a group
		if isPublicPath(c.Request.URL.Path) {
			c.Next()
			return
		}

		response.Unauthorized(c, "Authentication required: please sign in")
		c.Abort()
	}
}

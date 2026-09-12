package middleware

import (
	"net/http"
	"strings"

	"server/config"

	"github.com/gin-gonic/gin"
)

// RequireBitsathyAuth ensures that only requests with a valid Google token or JWT
// belonging to an @bitsathy.ac.in or @bitsathy.in email address (or whitelisted) can access the endpoint.
func RequireBitsathyAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := getToken(c)
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Authentication required: please log in with your @bitsathy.ac.in email id",
			})
			c.Abort()
			return
		}

		claims, err := config.VerifyGoogleToken(token)
		if err != nil || claims == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Invalid or expired authentication token. Please sign in again.",
			})
			c.Abort()
			return
		}

		email := strings.ToLower(strings.TrimSpace(claims.Email))
		if email == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Invalid user identity in token",
			})
			c.Abort()
			return
		}

		// Strictly require @bitsathy.ac.in or @bitsathy.in email domain
		if !(strings.HasSuffix(email, "@bitsathy.ac.in") || strings.HasSuffix(email, "@bitsathy.in")) {
			domain := ""
			if at := strings.LastIndex(email, "@"); at >= 0 {
				domain = email[at+1:]
			}
			var count int
			if config.DB != nil {
				_ = config.DB.QueryRow(
					`SELECT COUNT(*) FROM allowed_emails WHERE (type='email' AND LOWER(value)=?) OR (type='domain' AND LOWER(value)=?)`,
					email, domain,
				).Scan(&count)
			}
			if count == 0 {
				c.JSON(http.StatusForbidden, gin.H{
					"success": false,
					"error":   "Only @bitsathy.ac.in or @bitsathy.in email accounts are allowed",
				})
				c.Abort()
				return
			}
		}

		// Check if user is blocked in database
		if config.DB != nil {
			var isBlocked bool
			_ = config.DB.QueryRow(
				`SELECT COALESCE(blocked, 0) FROM users WHERE (google_id != '' AND google_id = ?) OR (uid != '' AND uid = ?) OR (email != '' AND LOWER(TRIM(email)) = ?) LIMIT 1`,
				claims.UID, claims.UID, email,
			).Scan(&isBlocked)
			if isBlocked {
				c.JSON(http.StatusForbidden, gin.H{
					"success": false,
					"status":  "blocked",
					"message": "Your account is blocked. Contact support@bitsathy.in for more details.",
				})
				c.Abort()
				return
			}
		}

		// Set context values for downstream handlers and audit logging
		c.Set("actor_uid", claims.UID)
		c.Set("user_email", email)
		c.Set("user_name", claims.Name)
		c.Set("user_claims", claims)

		c.Next()
	}
}

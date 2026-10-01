package middleware

import (
	"github.com/gin-gonic/gin"
)

// AuditLoggerMiddleware is a no-op middleware to avoid consuming cloud database quota and storage limits
func AuditLoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}

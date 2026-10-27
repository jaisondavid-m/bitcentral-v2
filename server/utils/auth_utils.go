package utils

import (
	"crypto/subtle"
	"errors"
	"net"
	"os"
	"strings"

	"github.com/gin-gonic/gin"

	"server/config"
)

func ExtractAuthToken(c *gin.Context) string {
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	if len(authHeader) > 7 && strings.EqualFold(authHeader[:7], "bearer ") {
		return strings.TrimSpace(authHeader[7:])
	}
	if token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer")); token != "" && token != authHeader {
		return token
	}
	if authHeader != "" {
		return authHeader
	}
	cookieNames := []string{"google_auth_token", "jwt", "token", "auth_token", "access_token"}
	for _, name := range cookieNames {
		if cookieVal, err := c.Cookie(name); err == nil && strings.TrimSpace(cookieVal) != "" {
			return strings.TrimSpace(cookieVal)
		}
	}
	tokenQuery := strings.TrimSpace(c.Query("token"))
	if tokenQuery != "" {
		return tokenQuery
	}
	return ""
}

func IsInternalServiceRequest(c *gin.Context) bool {
	internalSecret := strings.TrimSpace(os.Getenv("INTERNAL_API_SECRET"))
	if internalSecret == "" {
		internalSecret = strings.TrimSpace(os.Getenv("BACKEND_AUTH_TOKEN"))
	}

	if internalSecret != "" {
		candidate := strings.TrimSpace(c.GetHeader("X-Internal-Secret"))
		if candidate == "" {
			candidate = ExtractAuthToken(c)
		}
		return candidate != "" && subtle.ConstantTimeCompare([]byte(candidate), []byte(internalSecret)) == 1
	}

	// When no explicit secret is configured (local dev / Docker Compose bridge),
	// only trust direct loopback or private container requests that did not traverse an external reverse proxy.
	if c.GetHeader("X-Forwarded-For") != "" || c.GetHeader("X-Real-IP") != "" || c.GetHeader("Cf-Connecting-Ip") != "" {
		return false
	}

	host, _, err := net.SplitHostPort(c.Request.RemoteAddr)
	if err != nil {
		host = c.Request.RemoteAddr
	}
	ip := net.ParseIP(strings.TrimSpace(host))
	return ip != nil && (ip.IsLoopback() || ip.IsPrivate())
}

func UserFromToken(token string) (string, string, error) {
	claims, err := config.VerifyGoogleToken(token)
	if err != nil || claims == nil {
		return "", "", errors.New("unauthorized: " + err.Error())
	}
	return claims.UID, strings.TrimSpace(claims.Email), nil
}

func EmailFromToken(token string) (string, error) {
	_, email, err := UserFromToken(token)
	return email, err
}

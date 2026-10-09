package utils

import (
	"errors"
	"strings"

	"github.com/gin-gonic/gin"

	"server/config"
)

func ExtractAuthToken(c *gin.Context) string {
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	if token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer")); token != "" && token != authHeader {
		return token
	}
	if authHeader != "" && !strings.HasPrefix(authHeader, "Bearer ") {
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

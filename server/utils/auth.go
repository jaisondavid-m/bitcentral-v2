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

// Standard Gin context keys for authenticated user identity
const (
	CtxAuthClaims = "auth_claims"
	CtxAuthUID    = "auth_uid"
	CtxAuthEmail  = "auth_email"
	CtxAuthRole   = "auth_role"
	CtxIsAdmin    = "auth_is_admin"
)

// SetAuthContext populates the Gin context with standardized typed identity values
func SetAuthContext(c *gin.Context, claims *config.GoogleUserClaims, isAdmin bool) {
	if claims == nil {
		return
	}
	uid := strings.TrimSpace(claims.UID)
	if uid == "" {
		uid = strings.TrimSpace(claims.Email)
	}
	email := strings.ToLower(strings.TrimSpace(claims.Email))
	role := strings.TrimSpace(claims.Role)
	if role == "" {
		role = "user"
	}
	if isAdmin {
		role = "admin"
	}

	c.Set(CtxAuthClaims, claims)
	c.Set(CtxAuthUID, uid)
	c.Set(CtxAuthEmail, email)
	c.Set(CtxAuthRole, role)
	c.Set(CtxIsAdmin, isAdmin)

	// Set legacy keys for backward-compatibility
	c.Set("user", claims)
	c.Set("uid", uid)
	c.Set("email", email)
	c.Set("role", role)
	c.Set("actor_uid", uid)
	c.Set("actor_email", email)
	c.Set("actor_role", role)
	c.Set("is_admin", isAdmin)
}

// GetAuthClaims extracts the parsed *config.GoogleUserClaims from context
func GetAuthClaims(c *gin.Context) (*config.GoogleUserClaims, bool) {
	if val, exists := c.Get(CtxAuthClaims); exists && val != nil {
		if claims, ok := val.(*config.GoogleUserClaims); ok {
			return claims, true
		}
	}
	if val, exists := c.Get("user"); exists && val != nil {
		if claims, ok := val.(*config.GoogleUserClaims); ok {
			return claims, true
		}
	}
	return nil, false
}

// GetUserID retrieves the authenticated user's UID (or email fallback) from context
func GetUserID(c *gin.Context) string {
	if val, exists := c.Get(CtxAuthUID); exists {
		if s, ok := val.(string); ok && s != "" {
			return s
		}
	}
	if val, exists := c.Get("uid"); exists {
		if s, ok := val.(string); ok && s != "" {
			return s
		}
	}
	if val, exists := c.Get("actor_uid"); exists {
		if s, ok := val.(string); ok && s != "" {
			return s
		}
	}
	if claims, ok := GetAuthClaims(c); ok && claims != nil {
		if claims.UID != "" {
			return claims.UID
		}
		return claims.Email
	}
	return ""
}

// MustGetUserID extracts the user ID or returns an explicit error if missing
func MustGetUserID(c *gin.Context) (string, error) {
	uid := GetUserID(c)
	if uid == "" {
		return "", errors.New("unauthenticated: user ID not found in context")
	}
	return uid, nil
}

// GetUserEmail retrieves the authenticated user's lowercase email from context
func GetUserEmail(c *gin.Context) string {
	if val, exists := c.Get(CtxAuthEmail); exists {
		if s, ok := val.(string); ok && s != "" {
			return s
		}
	}
	if val, exists := c.Get("email"); exists {
		if s, ok := val.(string); ok && s != "" {
			return s
		}
	}
	if val, exists := c.Get("actor_email"); exists {
		if s, ok := val.(string); ok && s != "" {
			return s
		}
	}
	if claims, ok := GetAuthClaims(c); ok && claims != nil {
		return strings.ToLower(strings.TrimSpace(claims.Email))
	}
	return ""
}

// GetUserRole retrieves the role from context
func GetUserRole(c *gin.Context) string {
	if val, exists := c.Get(CtxAuthRole); exists {
		if s, ok := val.(string); ok && s != "" {
			return s
		}
	}
	if val, exists := c.Get("role"); exists {
		if s, ok := val.(string); ok && s != "" {
			return s
		}
	}
	if claims, ok := GetAuthClaims(c); ok && claims != nil && claims.Role != "" {
		return claims.Role
	}
	return "user"
}

// IsAdmin checks if the current request was made by an administrator
func IsAdmin(c *gin.Context) bool {
	if val, exists := c.Get(CtxIsAdmin); exists {
		if b, ok := val.(bool); ok {
			return b
		}
	}
	if val, exists := c.Get("is_admin"); exists {
		if b, ok := val.(bool); ok {
			return b
		}
	}
	role := strings.ToLower(GetUserRole(c))
	return role == "admin" || role == "superadmin" || role == "super_admin"
}

// ExtractAuthToken extracts the authentication token from headers, cookies, or query
func ExtractAuthToken(c *gin.Context) string {
	// 1. Authorization header: "Bearer <token>"
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

	// 2. HTTP-only secure cookie (canonical name: auth_token)
	cookieNames := []string{"auth_token", "google_auth_token", "jwt", "token"}
	for _, name := range cookieNames {
		if cookieVal, err := c.Cookie(name); err == nil && strings.TrimSpace(cookieVal) != "" {
			return strings.TrimSpace(cookieVal)
		}
	}

	// 3. Query parameter fallback
	if tokenQuery := strings.TrimSpace(c.Query("token")); tokenQuery != "" {
		return tokenQuery
	}
	return ""
}

// IsInternalServiceRequest checks if the request originates from a trusted internal worker
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

// UserFromToken validates a token and returns (uid, email, error)
func UserFromToken(token string) (string, string, error) {
	claims, err := config.VerifyGoogleToken(token)
	if err != nil || claims == nil {
		return "", "", errors.New("unauthorized: " + err.Error())
	}
	return claims.UID, strings.TrimSpace(claims.Email), nil
}

// EmailFromToken validates a token and returns the user's email
func EmailFromToken(token string) (string, error) {
	_, email, err := UserFromToken(token)
	return email, err
}

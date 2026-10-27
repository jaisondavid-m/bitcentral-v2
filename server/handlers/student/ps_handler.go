package student

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"server/config"
	"server/utils"

	"github.com/gin-gonic/gin"
)

// resolveUserEmail extracts student email from Gin context, Authorization header token, or query param
func (h *PSHandler) resolveUserEmail(c *gin.Context) string {
	// 1. Gin context (set if auth middleware ran)
	if emailCtx, exists := c.Get("email"); exists {
		if email, ok := emailCtx.(string); ok && strings.TrimSpace(email) != "" {
			return strings.ToLower(strings.TrimSpace(email))
		}
	}

	// 2. Token from Authorization header or cookie
	token := utils.ExtractAuthToken(c)
	if token != "" {
		if _, email, err := utils.UserFromToken(token); err == nil && strings.TrimSpace(email) != "" {
			return strings.ToLower(strings.TrimSpace(email))
		}
	}

	// 3. Query param ?email=...
	if emailParam := strings.TrimSpace(c.Query("email")); emailParam != "" {
		return strings.ToLower(emailParam)
	}

	return ""
}

// PSHandler manages PS (ps.bitsathy.ac.in) JWT token storage and proxying
type PSHandler struct {
	DB         *sql.DB
	httpClient *http.Client
}

func NewPSHandler() *PSHandler {
	h := &PSHandler{
		DB: config.DB,
		httpClient: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
	h.ensureTable()
	return h
}

// ensureTable creates the ps_user_tokens table if it doesn't exist
func (h *PSHandler) ensureTable() {
	if h.DB == nil {
		log.Println("⚠️ PS Handler: DB is nil, skipping table creation")
		return
	}

	query := `
	CREATE TABLE IF NOT EXISTS ps_user_tokens (
		id          INT AUTO_INCREMENT PRIMARY KEY,
		user_email  VARCHAR(255) NOT NULL,
		user_uid    VARCHAR(128) NOT NULL DEFAULT '',
		ps_token    TEXT NOT NULL,
		ps_username VARCHAR(255) NULL,
		user_id     VARCHAR(64) NULL,
		user_off_id VARCHAR(64) NULL,
		role_id     INT NULL,
		dept        VARCHAR(64) NULL,
		year        VARCHAR(64) NULL,
		year_group  VARCHAR(64) NULL,
		exp         BIGINT NULL,
		connected   TINYINT(1) NOT NULL DEFAULT 1,
		created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		UNIQUE KEY idx_user_email (user_email),
		INDEX idx_user_uid (user_uid)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

	if _, err := h.DB.Exec(query); err != nil {
		log.Printf("⚠️ ps_user_tokens table creation notice: %v", err)
	} else {
		log.Println("✅ ps_user_tokens table ready")
	}

	// Add any missing columns for existing tables
	columns := []string{
		"ALTER TABLE ps_user_tokens ADD COLUMN user_id VARCHAR(64) NULL",
		"ALTER TABLE ps_user_tokens ADD COLUMN user_off_id VARCHAR(64) NULL",
		"ALTER TABLE ps_user_tokens ADD COLUMN role_id INT NULL",
		"ALTER TABLE ps_user_tokens ADD COLUMN dept VARCHAR(64) NULL",
		"ALTER TABLE ps_user_tokens ADD COLUMN year VARCHAR(64) NULL",
		"ALTER TABLE ps_user_tokens ADD COLUMN year_group VARCHAR(64) NULL",
		"ALTER TABLE ps_user_tokens ADD COLUMN exp BIGINT NULL",
	}
	for _, colSQL := range columns {
		_, _ = h.DB.Exec(colSQL)
	}
}

// PSTokenClaims models the decoded payload from ps.bitsathy.ac.in JWT
type PSTokenClaims struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	UserID    string `json:"user_id"`
	UserOffID string `json:"user_off_id"`
	RoleID    int    `json:"role_id"`
	Dept      string `json:"dept"`
	Year      string `json:"year"`
	YearGroup string `json:"year_group"`
	Exp       int64  `json:"exp"`
}

// decodePSTokenClaims extracts claims from a PS JWT (without signature verification)
func decodePSTokenClaims(token string) (*PSTokenClaims, map[string]interface{}, error) {
	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, nil, fmt.Errorf("invalid JWT structure")
	}

	payload := parts[1]
	// Add padding if needed
	switch len(payload) % 4 {
	case 2:
		payload += "=="
	case 3:
		payload += "="
	}

	decoded, err := base64.URLEncoding.DecodeString(payload)
	if err != nil {
		decoded, err = base64.RawURLEncoding.DecodeString(parts[1])
		if err != nil {
			return nil, nil, fmt.Errorf("failed to decode payload: %v", err)
		}
	}

	var claims PSTokenClaims
	if err := json.Unmarshal(decoded, &claims); err != nil {
		return nil, nil, fmt.Errorf("failed to parse claims struct: %v", err)
	}

	var rawMap map[string]interface{}
	_ = json.Unmarshal(decoded, &rawMap)

	// Fallback for username if claim is under "name" or "sub"
	if claims.Username == "" {
		if name, ok := rawMap["name"].(string); ok {
			claims.Username = name
		} else if sub, ok := rawMap["sub"].(string); ok {
			claims.Username = sub
		}
	}

	return &claims, rawMap, nil
}

// ConnectPS stores or updates the PS JWT token
// Supports both public calls (from Chrome extension with no BitCentral auth token)
// and authenticated calls from the BitCentral web app.
// It decodes the email directly from the PS JWT payload.
func (h *PSHandler) ConnectPS(c *gin.Context) {
	var body struct {
		PSToken string `json:"ps_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ps_token is required",
		})
		return
	}

	psToken := strings.TrimSpace(body.PSToken)
	if psToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "ps_token cannot be empty",
		})
		return
	}

	// Decode claims from the PS JWT
	claims, _, err := decodePSTokenClaims(psToken)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": fmt.Sprintf("Failed to decode PS JWT: %v", err),
		})
		return
	}

	// Determine student email:
	// Priority 1: From PS JWT claims
	// Priority 2: From gin auth context (if logged in to BitCentral)
	targetEmail := strings.TrimSpace(claims.Email)
	if targetEmail == "" {
		if emailCtx, exists := c.Get("email"); exists {
			targetEmail, _ = emailCtx.(string)
		}
	}

	if targetEmail == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Could not extract student email from PS JWT token",
		})
		return
	}

	// Normalize email to lowercase
	targetEmail = strings.ToLower(targetEmail)

	// Attempt to lookup user UID from BitCentral users table
	var userUID string
	if h.DB != nil {
		_ = h.DB.QueryRow("SELECT uid FROM users WHERE LOWER(email) = ? LIMIT 1", targetEmail).Scan(&userUID)
	}
	if userUID == "" {
		// Try from gin context if present
		if uidCtx, exists := c.Get("uid"); exists {
			userUID, _ = uidCtx.(string)
		}
	}

	// Upsert into ps_user_tokens by user_email
	query := `
		INSERT INTO ps_user_tokens (
			user_email, user_uid, ps_token, ps_username, 
			user_id, user_off_id, role_id, dept, year, year_group, exp, connected
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
		ON DUPLICATE KEY UPDATE
			ps_token = VALUES(ps_token),
			ps_username = VALUES(ps_username),
			user_id = VALUES(user_id),
			user_off_id = VALUES(user_off_id),
			role_id = VALUES(role_id),
			dept = VALUES(dept),
			year = VALUES(year),
			year_group = VALUES(year_group),
			exp = VALUES(exp),
			user_uid = IF(VALUES(user_uid) != '', VALUES(user_uid), user_uid),
			connected = 1,
			updated_at = CURRENT_TIMESTAMP`

	_, err = h.DB.Exec(
		query,
		targetEmail,
		userUID,
		psToken,
		claims.Username,
		claims.UserID,
		claims.UserOffID,
		claims.RoleID,
		claims.Dept,
		claims.Year,
		claims.YearGroup,
		claims.Exp,
	)

	if err != nil {
		log.Printf("❌ PS connect DB error for %s: %v", targetEmail, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to store PS token in database",
		})
		return
	}

	log.Printf("✅ PS connected for user: %s (name: %s, roll: %s, dept: %s)", targetEmail, claims.Username, claims.UserOffID, claims.Dept)

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"message":     "PS account connected successfully",
		"email":       targetEmail,
		"username":    claims.Username,
		"user_id":     claims.UserID,
		"user_off_id": claims.UserOffID,
		"dept":        claims.Dept,
		"year":        claims.Year,
		"year_group":  claims.YearGroup,
		"exp":         claims.Exp,
	})
}

// DisconnectPS removes or deactivates the PS token connection
// Can be called with auth or with { email: "..." } / { ps_token: "..." }
func (h *PSHandler) DisconnectPS(c *gin.Context) {
	var targetEmail string

	if emailCtx, exists := c.Get("email"); exists {
		targetEmail, _ = emailCtx.(string)
	}

	if targetEmail == "" {
		var body struct {
			Email   string `json:"email"`
			PSToken string `json:"ps_token"`
		}
		if err := c.ShouldBindJSON(&body); err == nil {
			if body.Email != "" {
				targetEmail = body.Email
			} else if body.PSToken != "" {
				if claims, _, err := decodePSTokenClaims(body.PSToken); err == nil {
					targetEmail = claims.Email
				}
			}
		}
	}

	if targetEmail == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "User email is required to disconnect",
		})
		return
	}

	targetEmail = strings.ToLower(strings.TrimSpace(targetEmail))

	query := `UPDATE ps_user_tokens SET connected = 0, ps_token = '' WHERE LOWER(user_email) = ?`
	_, err := h.DB.Exec(query, targetEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to disconnect PS",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "PS account disconnected",
		"email":   targetEmail,
	})
}

// GetPSStatus returns the PS connection status for the user
// Supports both authenticated requests (with Authorization header) and querying by ?email=...
func (h *PSHandler) GetPSStatus(c *gin.Context) {
	targetEmail := h.resolveUserEmail(c)

	if targetEmail == "" {
		c.JSON(http.StatusOK, gin.H{
			"success":   true,
			"connected": false,
			"message":   "No active user or email identified",
		})
		return
	}

	var connected bool
	var psUsername, userID, userOffID, dept, year sql.NullString
	var exp sql.NullInt64
	var updatedAt sql.NullString

	err := h.DB.QueryRow(`
		SELECT connected, ps_username, user_id, user_off_id, dept, year, exp, updated_at 
		FROM ps_user_tokens 
		WHERE LOWER(user_email) = ? AND connected = 1`,
		targetEmail,
	).Scan(&connected, &psUsername, &userID, &userOffID, &dept, &year, &exp, &updatedAt)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success":   true,
			"connected": false,
			"email":     targetEmail,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"connected":    connected,
		"email":        targetEmail,
		"ps_username":  psUsername.String,
		"user_id":      userID.String,
		"user_off_id":  userOffID.String,
		"dept":         dept.String,
		"year":         year.String,
		"exp":          exp.Int64,
		"connected_at": updatedAt.String,
	})
}

// ProxyPSImage proxies an image request to ps.bitsathy.ac.in using the stored PS token
func (h *PSHandler) ProxyPSImage(c *gin.Context) {
	targetEmail := h.resolveUserEmail(c)

	if targetEmail == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authentication or email required"})
		return
	}

	targetEmail = strings.ToLower(strings.TrimSpace(targetEmail))

	// Get stored PS token
	var psToken string
	err := h.DB.QueryRow(
		`SELECT ps_token FROM ps_user_tokens WHERE LOWER(user_email) = ? AND connected = 1 AND ps_token != ''`,
		targetEmail,
	).Scan(&psToken)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "PS account not connected. Please login to ps.bitsathy.ac.in with the BitCentral extension.",
		})
		return
	}

	// Get the image path from query param, default to profile image
	imagePath := c.Query("path")
	if imagePath == "" {
		imagePath = "/api/ps_v2/user/images/image.jpg"
	}

	// Build the PS URL
	psURL := fmt.Sprintf("https://ps.bitsathy.ac.in%s", imagePath)

	// Create request with PS JWT cookie
	req, err := http.NewRequest("GET", psURL, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create request"})
		return
	}

	req.Header.Set("Cookie", fmt.Sprintf("PS=%s", psToken))
	req.Header.Set("User-Agent", "BitCentral/1.0")

	resp, err := h.httpClient.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"success": false, "message": "Failed to reach PS server"})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{
			"success": false,
			"message": fmt.Sprintf("PS returned status %d. Token may be expired.", resp.StatusCode),
		})
		return
	}

	// Stream the response back
	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "image/jpeg"
	}

	c.Header("Content-Type", contentType)
	c.Header("Cache-Control", "private, max-age=300")
	c.Status(http.StatusOK)
	io.Copy(c.Writer, resp.Body)
}

// ProxyPSAPI is a generic proxy that forwards requests to PS API endpoints using the stored token
func (h *PSHandler) ProxyPSAPI(c *gin.Context) {
	targetEmail := h.resolveUserEmail(c)

	if targetEmail == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authentication or email required"})
		return
	}

	targetEmail = strings.ToLower(strings.TrimSpace(targetEmail))

	// Get stored PS token
	var psToken string
	err := h.DB.QueryRow(
		`SELECT ps_token FROM ps_user_tokens WHERE LOWER(user_email) = ? AND connected = 1 AND ps_token != ''`,
		targetEmail,
	).Scan(&psToken)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "PS account not connected",
		})
		return
	}

	// Get the target PS API path
	psPath := c.Query("path")
	if psPath == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "path query parameter is required",
		})
		return
	}

	// Ensure path starts with /
	if !strings.HasPrefix(psPath, "/") {
		psPath = "/" + psPath
	}

	psURL := fmt.Sprintf("https://ps.bitsathy.ac.in%s", psPath)

	// Create proxy request
	req, err := http.NewRequest(c.Request.Method, psURL, c.Request.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create request"})
		return
	}

	req.Header.Set("Cookie", fmt.Sprintf("PS=%s", psToken))
	req.Header.Set("User-Agent", "BitCentral/1.0")

	if c.Request.Header.Get("Content-Type") != "" {
		req.Header.Set("Content-Type", c.Request.Header.Get("Content-Type"))
	}

	resp, err := h.httpClient.Do(req)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"success": false, "message": "Failed to reach PS server"})
		return
	}
	defer resp.Body.Close()

	// Forward response headers
	contentType := resp.Header.Get("Content-Type")
	if contentType != "" {
		c.Header("Content-Type", contentType)
	}

	c.Status(resp.StatusCode)
	io.Copy(c.Writer, resp.Body)
}

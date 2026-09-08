package handlers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"server/config"
)

type AIHandler struct {
	DB *sql.DB
}

func NewAIHandler() *AIHandler {
	h := &AIHandler{DB: config.DB}
	h.ensureTableExists()
	return h
}

func (h *AIHandler) ensureTableExists() {
	if h.DB == nil {
		return
	}
	query := `
	CREATE TABLE IF NOT EXISTS ai_api_keys (
		id INT AUTO_INCREMENT PRIMARY KEY,
		key_name VARCHAR(100) NOT NULL UNIQUE,
		api_key TEXT NOT NULL,
		provider VARCHAR(50) DEFAULT 'google_gemini',
		model VARCHAR(50) DEFAULT 'gemini-2.0-flash',
		status VARCHAR(20) DEFAULT 'active',
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		updated_by VARCHAR(100)
	);`
	_, err := h.DB.Exec(query)
	if err != nil {
		log.Printf("⚠️ Failed to ensure ai_api_keys table exists: %v", err)
	}
}

type AIKeyRecord struct {
	ID        int    `json:"id"`
	KeyName   string `json:"key_name"`
	APIKey    string `json:"api_key"`
	MaskedKey string `json:"masked_key"`
	Provider  string `json:"provider"`
	Model     string `json:"model"`
	Status    string `json:"status"`
	UpdatedAt string `json:"updated_at"`
	UpdatedBy string `json:"updated_by"`
}

func maskKey(key string) string {
	key = strings.TrimSpace(key)
	if len(key) <= 8 {
		return "••••••••"
	}
	return key[:4] + "••••••••" + key[len(key)-4:]
}

// GetAIKeyAdmin retrieves current AI key details for Admin panel (masked key returned for security)
func (h *AIHandler) GetAIKeyAdmin(c *gin.Context) {
	h.ensureTableExists()

	var rec AIKeyRecord
	var apiKey, updatedAt, updatedBy sql.NullString
	query := `
		SELECT id, key_name, api_key, provider, model, status, 
		       COALESCE(DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ'), ''), COALESCE(updated_by, '')
		FROM ai_api_keys
		WHERE key_name = 'default_gemini'
		LIMIT 1`

	err := h.DB.QueryRow(query).Scan(&rec.ID, &rec.KeyName, &apiKey, &rec.Provider, &rec.Model, &rec.Status, &updatedAt, &updatedBy)
	if err != nil && err != sql.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	if err == sql.ErrNoRows {
		rec = AIKeyRecord{
			KeyName:   "default_gemini",
			APIKey:    "",
			MaskedKey: "",
			Provider:  "google_gemini",
			Model:     "gemini-2.0-flash",
			Status:    "active",
		}
	} else {
		rec.APIKey = apiKey.String
		rec.MaskedKey = maskKey(apiKey.String)
		rec.UpdatedAt = updatedAt.String
		rec.UpdatedBy = updatedBy.String
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    rec,
	})
}

// UpdateAIKeyAdmin updates or creates the AI API Key configuration in DB
func (h *AIHandler) UpdateAIKeyAdmin(c *gin.Context) {
	h.ensureTableExists()

	var body struct {
		APIKey   string `json:"api_key"`
		Status   string `json:"status"`
		Model    string `json:"model"`
		Provider string `json:"provider"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "invalid JSON payload"})
		return
	}

	newKey := strings.TrimSpace(body.APIKey)
	status := strings.TrimSpace(strings.ToLower(body.Status))
	if status == "" {
		status = "active"
	}
	model := strings.TrimSpace(body.Model)
	if model == "" {
		model = "gemini-2.0-flash"
	}
	provider := strings.TrimSpace(body.Provider)
	if provider == "" {
		provider = "google_gemini"
	}

	actorUID, _ := c.Get("actor_uid")
	actorUIDStr, _ := actorUID.(string)

	// If newKey is masked (contains ••••) and hasn't changed, load existing key
	if strings.Contains(newKey, "••••") || newKey == "" {
		var existingKey string
		err := h.DB.QueryRow(`SELECT api_key FROM ai_api_keys WHERE key_name = 'default_gemini'`).Scan(&existingKey)
		if err == nil && existingKey != "" {
			newKey = existingKey
		}
	}

	query := `
		INSERT INTO ai_api_keys (key_name, api_key, provider, model, status, updated_at, updated_by)
		VALUES ('default_gemini', ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)
		ON DUPLICATE KEY UPDATE
			api_key    = VALUES(api_key),
			provider   = VALUES(provider),
			model      = VALUES(model),
			status     = VALUES(status),
			updated_by = VALUES(updated_by),
			updated_at = CURRENT_TIMESTAMP`

	_, err := h.DB.Exec(query, newKey, provider, model, status, actorUIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": fmt.Sprintf("Failed to save AI configuration: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "AI API Key configuration saved successfully to database",
		"data": gin.H{
			"key_name":   "default_gemini",
			"masked_key": maskKey(newKey),
			"status":     status,
			"model":      model,
			"provider":   provider,
		},
	})
}

// GetInternalAIKey returns unmasked API key for mcp-server background requests
func (h *AIHandler) GetInternalAIKey(c *gin.Context) {
	h.ensureTableExists()

	var apiKey, model, status sql.NullString
	query := `SELECT api_key, model, status FROM ai_api_keys WHERE key_name = 'default_gemini' LIMIT 1`
	err := h.DB.QueryRow(query).Scan(&apiKey, &model, &status)
	if err != nil && err != sql.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	keyStr := strings.TrimSpace(apiKey.String)
	modelStr := strings.TrimSpace(model.String)
	statusStr := strings.TrimSpace(status.String)

	if statusStr == "" {
		statusStr = "active"
	}
	if modelStr == "" {
		modelStr = "gemini-2.0-flash"
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"api_key": keyStr,
		"model":   modelStr,
		"status":  statusStr,
	})
}

// TestAIKey sends a quick verification request to Google Gemini API to test the key
func (h *AIHandler) TestAIKey(c *gin.Context) {
	var body struct {
		APIKey string `json:"api_key"`
		Model  string `json:"model"`
	}
	_ = c.ShouldBindJSON(&body)

	keyToTest := strings.TrimSpace(body.APIKey)
	modelToTest := strings.TrimSpace(body.Model)
	if modelToTest == "" {
		modelToTest = "gemini-2.0-flash"
	}

	if keyToTest == "" || strings.Contains(keyToTest, "••••") {
		var existingKey string
		err := h.DB.QueryRow(`SELECT api_key FROM ai_api_keys WHERE key_name = 'default_gemini'`).Scan(&existingKey)
		if err == nil {
			keyToTest = existingKey
		}
	}

	if keyToTest == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "API key is required to perform test"})
		return
	}

	// Send tiny test payload to Gemini API
	testReqPayload := map[string]interface{}{
		"contents": []map[string]interface{}{
			{
				"parts": []map[string]string{
					{"text": "Hello, respond with 'OK'."},
				},
			},
		},
	}
	reqBytes, _ := json.Marshal(testReqPayload)
	apiURL := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", modelToTest, keyToTest)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Post(apiURL, "application/json", bytes.NewBuffer(reqBytes))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": fmt.Sprintf("Connection test failed: %v", err),
		})
		return
	}
	defer resp.Body.Close()

	respBytes, _ := io.ReadAll(resp.Body)
	if resp.StatusCode >= 400 {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": fmt.Sprintf("Google Gemini API returned status %d: %s", resp.StatusCode, string(respBytes)),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("✅ API Key verified successfully! Model %s is active.", modelToTest),
	})
}

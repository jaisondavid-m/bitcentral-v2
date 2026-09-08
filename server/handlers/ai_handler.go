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

// GetInternalAIKey returns unmasked API key and provider info for mcp-server background requests
func (h *AIHandler) GetInternalAIKey(c *gin.Context) {
	h.ensureTableExists()

	var apiKey, provider, model, status sql.NullString
	query := `SELECT api_key, provider, model, status FROM ai_api_keys WHERE key_name = 'default_gemini' LIMIT 1`
	err := h.DB.QueryRow(query).Scan(&apiKey, &provider, &model, &status)
	if err != nil && err != sql.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	keyStr := strings.TrimSpace(apiKey.String)
	providerStr := strings.TrimSpace(provider.String)
	modelStr := strings.TrimSpace(model.String)
	statusStr := strings.TrimSpace(status.String)

	if statusStr == "" {
		statusStr = "active"
	}
	if strings.HasPrefix(keyStr, "gsk_") && (providerStr == "" || providerStr == "google_gemini") {
		providerStr = "groq"
	}
	if strings.HasPrefix(keyStr, "sk-") && (providerStr == "" || providerStr == "google_gemini") {
		providerStr = "openai"
	}
	if providerStr == "" {
		providerStr = "google_gemini"
	}
	if modelStr == "" {
		if providerStr == "groq" {
			modelStr = "llama-3.3-70b-versatile"
		} else if providerStr == "openai" {
			modelStr = "gpt-4o-mini"
		} else {
			modelStr = "gemini-2.0-flash"
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"api_key":  keyStr,
		"provider": providerStr,
		"model":    modelStr,
		"status":   statusStr,
	})
}

// TestAIKey sends a verification request to the appropriate AI provider (Gemini, Groq, OpenAI) to test the key
func (h *AIHandler) TestAIKey(c *gin.Context) {
	var body struct {
		APIKey   string `json:"api_key"`
		Provider string `json:"provider"`
		Model    string `json:"model"`
	}
	_ = c.ShouldBindJSON(&body)

	keyToTest := strings.TrimSpace(body.APIKey)
	providerToTest := strings.TrimSpace(body.Provider)
	modelToTest := strings.TrimSpace(body.Model)

	if keyToTest == "" || strings.Contains(keyToTest, "••••") {
		var existingKey, existingProvider, existingModel string
		err := h.DB.QueryRow(`SELECT api_key, provider, model FROM ai_api_keys WHERE key_name = 'default_gemini'`).Scan(&existingKey, &existingProvider, &existingModel)
		if err == nil {
			keyToTest = existingKey
			if providerToTest == "" {
				providerToTest = existingProvider
			}
			if modelToTest == "" {
				modelToTest = existingModel
			}
		}
	}

	if keyToTest == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "API key is required to perform test"})
		return
	}

	// Auto-detect provider if prefix matches
	if strings.HasPrefix(keyToTest, "gsk_") {
		providerToTest = "groq"
	} else if strings.HasPrefix(keyToTest, "sk-") {
		providerToTest = "openai"
	} else if providerToTest == "" {
		providerToTest = "google_gemini"
	}

	client := &http.Client{Timeout: 15 * time.Second}

	if providerToTest == "groq" || providerToTest == "openai" {
		if modelToTest == "" || modelToTest == "gemini-2.0-flash" {
			if providerToTest == "groq" {
				modelToTest = "llama-3.3-70b-versatile"
			} else {
				modelToTest = "gpt-4o-mini"
			}
		}

		endpointURL := "https://api.groq.com/openai/v1/chat/completions"
		providerName := "Groq"
		if providerToTest == "openai" {
			endpointURL = "https://api.openai.com/v1/chat/completions"
			providerName = "OpenAI"
		}

		payload := map[string]interface{}{
			"model": modelToTest,
			"messages": []map[string]string{
				{"role": "user", "content": "Hello, respond with 'OK'."},
			},
			"max_tokens": 10,
		}
		reqBytes, _ := json.Marshal(payload)
		httpReq, err := http.NewRequest(http.MethodPost, endpointURL, bytes.NewBuffer(reqBytes))
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"success": false, "message": fmt.Sprintf("Failed to construct test request: %v", err)})
			return
		}
		httpReq.Header.Set("Content-Type", "application/json")
		httpReq.Header.Set("Authorization", "Bearer "+keyToTest)

		resp, err := client.Do(httpReq)
		if err != nil {
			c.JSON(http.StatusOK, gin.H{"success": false, "message": fmt.Sprintf("Connection test failed: %v", err)})
			return
		}
		defer resp.Body.Close()

		respBytes, _ := io.ReadAll(resp.Body)
		if resp.StatusCode >= 400 {
			c.JSON(http.StatusOK, gin.H{
				"success": false,
				"message": fmt.Sprintf("%s API returned status %d: %s", providerName, resp.StatusCode, string(respBytes)),
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": fmt.Sprintf("✅ API Key verified successfully! %s Provider with Model %s is active.", providerName, modelToTest),
		})
		return
	}

	// Default Google Gemini
	if modelToTest == "" {
		modelToTest = "gemini-2.0-flash"
	}

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
		"message": fmt.Sprintf("✅ API Key verified successfully! Google Gemini Model %s is active.", modelToTest),
	})
}

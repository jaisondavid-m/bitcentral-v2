package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"regexp"
	"strings"
	"time"

	"server/models"

	"github.com/gin-gonic/gin"
)

const psRewardsTokenKey = "rewards_breakdown"

var safeTokenTableName = regexp.MustCompile(`^[A-Za-z0-9_]+$`)

func psTokenTableName() string {
	table := strings.TrimSpace(os.Getenv("MYSQL_TOKEN_TABLE"))
	if table == "" {
		return "ps_tokens"
	}
	if !safeTokenTableName.MatchString(table) {
		return "ps_tokens"
	}
	return table
}

func (h *AdminHandler) loadPSToken() (models.PSToken, error) {
	table := psTokenTableName()
	query := fmt.Sprintf(`
		SELECT token, DATE_FORMAT(updated_at, '%%Y-%%m-%%dT%%H:%%i:%%sZ'), COALESCE(updated_by, '')
		FROM %s
		WHERE token_key = ?`, table)

	var token, updatedAt, updatedBy sql.NullString
	err := h.DB.QueryRow(query, psRewardsTokenKey).Scan(&token, &updatedAt, &updatedBy)
	if err != nil {
		return models.PSToken{}, err
	}

	return models.PSToken{
		Token:     strings.TrimSpace(token.String),
		UpdatedAt: updatedAt.String,
		UpdatedBy: updatedBy.String,
		TokenKey:  psRewardsTokenKey,
	}, nil
}

func (h *AdminHandler) savePSToken(token, updatedBy string) error {
	table := psTokenTableName()
	query := fmt.Sprintf(`
		INSERT INTO %s (token_key, token, updated_at, updated_by)
		VALUES (?, ?, CURRENT_TIMESTAMP, ?)
		ON DUPLICATE KEY UPDATE
			token = VALUES(token),
			updated_by = VALUES(updated_by),
			updated_at = CURRENT_TIMESTAMP`, table)

	_, err := h.DB.Exec(query, psRewardsTokenKey, strings.TrimSpace(token), strings.TrimSpace(updatedBy))
	return err
}

func normalizePSTokenValue(token string) string {
	token = strings.TrimSpace(token)
	if token == "" {
		return ""
	}

	parts := strings.Split(token, ";")
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if strings.HasPrefix(part, "PS=") {
			return strings.TrimSpace(strings.TrimPrefix(part, "PS="))
		}
	}

	return token
}

func (h *AdminHandler) GetPSToken(c *gin.Context) {
	token, err := h.loadPSToken()
	if err != nil && err != sql.ErrNoRows {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	if err == sql.ErrNoRows {
		token = models.PSToken{Token: "", UpdatedAt: "", UpdatedBy: "", TokenKey: psRewardsTokenKey}
	}

	c.PureJSON(http.StatusOK, gin.H{"success": true, "data": token})
}

func (h *AdminHandler) UpdatePSToken(c *gin.Context) {
	var body models.PSToken
	if err := c.ShouldBindJSON(&body); err != nil {
		c.PureJSON(http.StatusBadRequest, gin.H{"success": false, "message": "token is required"})
		return
	}

	token := strings.TrimSpace(body.Token)
	if token == "" {
		c.PureJSON(http.StatusBadRequest, gin.H{"success": false, "message": "token is required"})
		return
	}

	updatedBy, _ := c.Get("actor_uid")
	updatedByString, _ := updatedBy.(string)
	if err := h.savePSToken(token, updatedByString); err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	current, err := h.loadPSToken()
	if err != nil && err != sql.ErrNoRows {
		c.PureJSON(http.StatusOK, gin.H{"success": true, "message": "Token saved"})
		return
	}

	c.PureJSON(http.StatusOK, gin.H{"success": true, "message": "Token saved", "data": current})
}

func (h *AdminHandler) FetchPSRewardsBreakdown(c *gin.Context) {
	userID := strings.TrimSpace(c.Query("user_id"))
	if userID == "" {
		c.PureJSON(http.StatusBadRequest, gin.H{"success": false, "message": "user_id is required"})
		return
	}

	token, err := h.loadPSToken()
	if err == sql.ErrNoRows || strings.TrimSpace(token.Token) == "" {
		c.PureJSON(http.StatusBadRequest, gin.H{"success": false, "message": "PS token is not configured"})
		return
	}
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	requestURL, err := url.Parse("https://ps.bitsathy.ac.in/api/ps_v2/activity/rewards/breakdown")
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": "failed to build request URL"})
		return
	}

	query := requestURL.Query()
	query.Set("id", "1")
	query.Set("user_id", userID)
	requestURL.RawQuery = query.Encode()

	req, err := http.NewRequestWithContext(c.Request.Context(), http.MethodGet, requestURL.String(), nil)
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	if psValue := normalizePSTokenValue(token.Token); psValue != "" {
		req.AddCookie(&http.Cookie{Name: "PS", Value: psValue})
	}
	req.Header.Set("Accept", "application/json, text/plain, */*")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		c.PureJSON(http.StatusBadGateway, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		c.PureJSON(http.StatusBadGateway, gin.H{"success": false, "message": err.Error()})
		return
	}

	var parsed any
	if json.Unmarshal(body, &parsed) == nil {
		if resp.StatusCode >= http.StatusBadRequest {
			c.PureJSON(resp.StatusCode, gin.H{
				"success": false,
				"message": "PS API request failed",
				"status":  resp.StatusCode,
				"data":    parsed,
			})
			return
		}

		c.PureJSON(http.StatusOK, gin.H{
			"success": true,
			"status":  resp.StatusCode,
			"data":    parsed,
			"source":  requestURL.String(),
		})
		return
	}

	responseBody := strings.TrimSpace(string(body))
	if resp.StatusCode >= http.StatusBadRequest {
		c.PureJSON(resp.StatusCode, gin.H{
			"success": false,
			"message": "PS API request failed",
			"status":  resp.StatusCode,
			"body":    responseBody,
		})
		return
	}

	c.PureJSON(http.StatusOK, gin.H{
		"success": true,
		"status":  resp.StatusCode,
		"body":    responseBody,
		"source":  requestURL.String(),
	})
}

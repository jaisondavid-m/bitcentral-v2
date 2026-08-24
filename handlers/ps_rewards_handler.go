package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
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
				"message": "Activity points are temporarily unavailable. The admin needs to refresh the token.",
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
			"message": "Activity points are temporarily unavailable. The admin needs to refresh the token.",
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

func (h *AdminHandler) FetchStudentReportDetails(c *gin.Context) {
	id := strings.TrimSpace(c.Query("id"))
	if id == "" {
		id = strings.TrimSpace(c.Query("user_id"))
	}
	if id == "" {
		c.PureJSON(http.StatusBadRequest, gin.H{"success": false, "message": "id parameter is required"})
		return
	}

	cookieHeader := "PS=cc1d0f436efeea00cbaaa2ec081e8d58fb31b9994e573663f83c603acbeeb889; Device-Identifier=B9B6863D-9947-4B2E-920B-D60D67B79BD1;"

	requestURL, err := url.Parse("https://ps.bitsathy.ac.in/api/ps_app_v3/profile/student-report/details")
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": "failed to build request URL"})
		return
	}

	query := requestURL.Query()
	query.Set("id", id)
	requestURL.RawQuery = query.Encode()

	log.Printf("[FetchStudentReportDetails] Fetching student report for ID: %s | URL: %s", id, requestURL.String())

	req, err := http.NewRequestWithContext(c.Request.Context(), http.MethodGet, requestURL.String(), nil)
	if err != nil {
		log.Printf("[FetchStudentReportDetails] Error building request: %v", err)
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	req.Header.Set("Cookie", cookieHeader)
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		log.Printf("[FetchStudentReportDetails] HTTP request failed for ID %s: %v", id, err)
		c.PureJSON(http.StatusBadGateway, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("[FetchStudentReportDetails] Failed to read response body for ID %s: %v", id, err)
		c.PureJSON(http.StatusBadGateway, gin.H{"success": false, "message": err.Error()})
		return
	}

	log.Printf("[FetchStudentReportDetails] Response Status for ID %s: %d | Body Length: %d bytes", id, resp.StatusCode, len(body))

	var parsed any
	if json.Unmarshal(body, &parsed) == nil {
		if resp.StatusCode >= http.StatusBadRequest {
			log.Printf("[FetchStudentReportDetails] Upstream returned error status %d for ID %s", resp.StatusCode, id)
			c.PureJSON(resp.StatusCode, gin.H{
				"success": false,
				"message": "Student report is temporarily unavailable.",
				"status":  resp.StatusCode,
				"data":    parsed,
			})
			return
		}

		c.PureJSON(http.StatusOK, parsed)
		return
	}

	responseBody := strings.TrimSpace(string(body))
	if resp.StatusCode >= http.StatusBadRequest {
		c.PureJSON(resp.StatusCode, gin.H{
			"success": false,
			"message": "Student report is temporarily unavailable.",
			"status":  resp.StatusCode,
			"body":    responseBody,
		})
		return
	}

	c.PureJSON(http.StatusOK, gin.H{
		"success": true,
		"status":  resp.StatusCode,
		"body":    responseBody,
	})
}

// FetchAssessmentDetails fetches student report, auto-validates user, and filters ONLY assessment details
func (h *AdminHandler) FetchAssessmentDetails(c *gin.Context) {
	id := strings.TrimSpace(c.Query("id"))
	if id == "" {
		id = strings.TrimSpace(c.Query("user_id"))
	}

	// Auto-validate user if ID param is not explicitly supplied
	if id == "" {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if token != "" {
			if email, err := emailFromToken(token); err == nil && email != "" {
				if h.DB != nil {
					var rollNo string
					_ = h.DB.QueryRow(`SELECT rollno FROM student_email WHERE LOWER(TRIM(emailid)) = LOWER(TRIM(?)) LIMIT 1`, email).Scan(&rollNo)
					if rollNo != "" {
						id = rollNo
					}
				}
				if id == "" {
					parts := strings.Split(email, "@")
					if len(parts) > 0 {
						id = parts[0]
					}
				}
			}
		}
	}

	if id == "" {
		id = "2025UCS1023" // Default fallback ID if no ID is provided or resolved
	}

	cookieHeader := "PS=cc1d0f436efeea00cbaaa2ec081e8d58fb31b9994e573663f83c603acbeeb889; Device-Identifier=B9B6863D-9947-4B2E-920B-D60D67B79BD1;"

	requestURL, err := url.Parse("https://ps.bitsathy.ac.in/api/ps_app_v3/profile/student-report/details")
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": "failed to build request URL"})
		return
	}

	query := requestURL.Query()
	query.Set("id", id)
	requestURL.RawQuery = query.Encode()

	log.Printf("[FetchAssessmentDetails] Fetching assessment details for ID: %s", id)

	req, err := http.NewRequestWithContext(c.Request.Context(), http.MethodGet, requestURL.String(), nil)
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	req.Header.Set("Cookie", cookieHeader)
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

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

	if resp.StatusCode >= http.StatusBadRequest {
		c.PureJSON(resp.StatusCode, gin.H{
			"success": false,
			"message": "Assessment details unavailable",
			"status":  resp.StatusCode,
		})
		return
	}

	var rawMap map[string]interface{}
	if err := json.Unmarshal(body, &rawMap); err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to parse assessment response"})
		return
	}

	dataMap, ok := rawMap["data"].(map[string]interface{})
	if !ok {
		dataMap = rawMap
	}

	basicMap, _ := dataMap["basic"].(map[string]interface{})
	psMap, _ := dataMap["personalized_skills"].(map[string]interface{})

	var assessments interface{}
	var summary interface{}

	if psMap != nil {
		if assessmentData, exists := psMap["assessment_data"]; exists {
			assessments = assessmentData
		} else if assessmentLogs, exists := psMap["assessment_logs"]; exists {
			assessments = assessmentLogs
		}
		summary = psMap["summary"]
	}

	if assessments == nil {
		assessments = []interface{}{}
	}

	studentInfo := gin.H{
		"id":         id,
		"name":       "",
		"department": "",
		"batch":      "",
		"email":      "",
	}
	if basicMap != nil {
		studentInfo["id"] = basicMap["id"]
		studentInfo["name"] = basicMap["name"]
		studentInfo["department"] = basicMap["department"]
		studentInfo["batch"] = basicMap["batch"]
		studentInfo["email"] = basicMap["email"]
		studentInfo["role"] = basicMap["role"]
	}

	// Filtered response containing ONLY assessment details and student info
	c.PureJSON(http.StatusOK, gin.H{
		"success":     true,
		"user_id":     id,
		"student":     studentInfo,
		"assessments": assessments,
		"summary":     summary,
	})
}

// FetchPointsDetails fetches student report and filters ONLY point/wallet details (excluding withheld_points)
func (h *AdminHandler) FetchPointsDetails(c *gin.Context) {
	id := strings.TrimSpace(c.Query("id"))
	if id == "" {
		id = strings.TrimSpace(c.Query("user_id"))
	}

	if id == "" {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if token != "" {
			if email, err := emailFromToken(token); err == nil && email != "" {
				if h.DB != nil {
					var rollNo string
					_ = h.DB.QueryRow(`SELECT rollno FROM student_email WHERE LOWER(TRIM(emailid)) = LOWER(TRIM(?)) LIMIT 1`, email).Scan(&rollNo)
					if rollNo != "" {
						id = rollNo
					}
				}
				if id == "" {
					parts := strings.Split(email, "@")
					if len(parts) > 0 {
						id = parts[0]
					}
				}
			}
		}
	}

	if id == "" {
		id = "2025UCS1023"
	}

	cookieHeader := "PS=cc1d0f436efeea00cbaaa2ec081e8d58fb31b9994e573663f83c603acbeeb889; Device-Identifier=B9B6863D-9947-4B2E-920B-D60D67B79BD1;"

	requestURL, err := url.Parse("https://ps.bitsathy.ac.in/api/ps_app_v3/profile/student-report/details")
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": "failed to build request URL"})
		return
	}

	query := requestURL.Query()
	query.Set("id", id)
	requestURL.RawQuery = query.Encode()

	log.Printf("[FetchPointsDetails] Fetching points for ID: %s", id)

	req, err := http.NewRequestWithContext(c.Request.Context(), http.MethodGet, requestURL.String(), nil)
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	req.Header.Set("Cookie", cookieHeader)
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

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

	if resp.StatusCode >= http.StatusBadRequest {
		c.PureJSON(resp.StatusCode, gin.H{
			"success": false,
			"message": "Point details unavailable",
			"status":  resp.StatusCode,
		})
		return
	}

	var rawMap map[string]interface{}
	if err := json.Unmarshal(body, &rawMap); err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to parse points response"})
		return
	}

	dataMap, ok := rawMap["data"].(map[string]interface{})
	if !ok {
		dataMap = rawMap
	}

	basicMap, _ := dataMap["basic"].(map[string]interface{})
	pointsMap, _ := dataMap["points"].(map[string]interface{})

	var rawWallets []interface{}
	if pointsMap != nil {
		if w, ok := pointsMap["wallets"].([]interface{}); ok {
			rawWallets = w
		}
	}

	// Filter out withheld_points from wallet details
	var cleanedWallets []map[string]interface{}
	for _, item := range rawWallets {
		if walletObj, ok := item.(map[string]interface{}); ok {
			cleanWallet := make(map[string]interface{})
			for k, v := range walletObj {
				if k != "withheld_points" {
					cleanWallet[k] = v
				}
			}
			cleanedWallets = append(cleanedWallets, cleanWallet)
		}
	}

	studentInfo := gin.H{
		"id":         id,
		"name":       "",
		"department": "",
		"batch":      "",
		"email":      "",
	}
	if basicMap != nil {
		studentInfo["id"] = basicMap["id"]
		studentInfo["name"] = basicMap["name"]
		studentInfo["department"] = basicMap["department"]
		studentInfo["batch"] = basicMap["batch"]
		studentInfo["email"] = basicMap["email"]
		studentInfo["role"] = basicMap["role"]
	}

	c.PureJSON(http.StatusOK, gin.H{
		"success": true,
		"user_id": id,
		"student": studentInfo,
		"wallets": cleanedWallets,
	})
}

// FetchBiometricDetails fetches student report and filters ONLY biometric & attendance details
func (h *AdminHandler) FetchBiometricDetails(c *gin.Context) {
	id := strings.TrimSpace(c.Query("id"))
	if id == "" {
		id = strings.TrimSpace(c.Query("user_id"))
	}

	if id == "" {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if token != "" {
			if email, err := emailFromToken(token); err == nil && email != "" {
				if h.DB != nil {
					var rollNo string
					_ = h.DB.QueryRow(`SELECT rollno FROM student_email WHERE LOWER(TRIM(emailid)) = LOWER(TRIM(?)) LIMIT 1`, email).Scan(&rollNo)
					if rollNo != "" {
						id = rollNo
					}
				}
				if id == "" {
					parts := strings.Split(email, "@")
					if len(parts) > 0 {
						id = parts[0]
					}
				}
			}
		}
	}

	if id == "" {
		id = "2025UCS1023"
	}

	cookieHeader := "PS=cc1d0f436efeea00cbaaa2ec081e8d58fb31b9994e573663f83c603acbeeb889; Device-Identifier=B9B6863D-9947-4B2E-920B-D60D67B79BD1;"

	requestURL, err := url.Parse("https://ps.bitsathy.ac.in/api/ps_app_v3/profile/student-report/details")
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": "failed to build request URL"})
		return
	}

	query := requestURL.Query()
	query.Set("id", id)
	requestURL.RawQuery = query.Encode()

	log.Printf("[FetchBiometricDetails] Fetching biometric for ID: %s", id)

	req, err := http.NewRequestWithContext(c.Request.Context(), http.MethodGet, requestURL.String(), nil)
	if err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	req.Header.Set("Cookie", cookieHeader)
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

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

	if resp.StatusCode >= http.StatusBadRequest {
		c.PureJSON(resp.StatusCode, gin.H{
			"success": false,
			"message": "Biometric details unavailable",
			"status":  resp.StatusCode,
		})
		return
	}

	var rawMap map[string]interface{}
	if err := json.Unmarshal(body, &rawMap); err != nil {
		c.PureJSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to parse biometric response"})
		return
	}

	dataMap, ok := rawMap["data"].(map[string]interface{})
	if !ok {
		dataMap = rawMap
	}

	basicMap, _ := dataMap["basic"].(map[string]interface{})
	biometricList, _ := dataMap["biometric"].([]interface{})
	academicsMap, _ := dataMap["academics"].(map[string]interface{})

	if biometricList == nil {
		biometricList = []interface{}{}
	}

	studentInfo := gin.H{
		"id":         id,
		"name":       "",
		"department": "",
		"batch":      "",
		"email":      "",
	}
	if basicMap != nil {
		studentInfo["id"] = basicMap["id"]
		studentInfo["name"] = basicMap["name"]
		studentInfo["department"] = basicMap["department"]
		studentInfo["batch"] = basicMap["batch"]
		studentInfo["email"] = basicMap["email"]
		studentInfo["role"] = basicMap["role"]
	}

	c.PureJSON(http.StatusOK, gin.H{
		"success":   true,
		"user_id":   id,
		"student":   studentInfo,
		"biometric": biometricList,
		"academics": academicsMap,
	})
}




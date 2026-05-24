package handlers

import (
	"context"
	"database/sql"
	"errors"
	"net/http"
	"strings"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

func emailFromToken(token string) (string, error) {
	client, err := config.FirebaseAuthClient()
	if err != nil || client == nil {
		return "", errors.New("failed to initialize Firebase auth")
	}

	decodedToken, err := client.VerifyIDToken(context.Background(), token)
	if err != nil || decodedToken == nil {
		return "", errors.New("unauthorized")
	}

	emailClaim, ok := decodedToken.Claims["email"].(string)
	if !ok || strings.TrimSpace(emailClaim) == "" {
		return "", errors.New("unauthorized")
	}

	return strings.TrimSpace(emailClaim), nil
}

type StudentLookupHandler struct {
	DB *sql.DB
}

func NewStudentLookupHandler() *StudentLookupHandler {
	return &StudentLookupHandler{DB: config.DB}
}

func (h *StudentLookupHandler) GetRollNoByEmail(c *gin.Context) {
	mailID := strings.TrimSpace(c.Query("mailid"))
	if mailID == "" {
		mailID = strings.TrimSpace(c.Query("emailid"))
	}
	if mailID == "" {
		mailID = strings.TrimSpace(c.Query("email"))
	}
	if mailID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Query param 'mailid' is required",
		})
		return
	}

	var rollNo string
	err := h.DB.QueryRow(
		`SELECT rollno FROM student_email WHERE LOWER(TRIM(emailid)) = LOWER(TRIM(?)) LIMIT 1`,
		mailID,
	).Scan(&rollNo)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "No roll number found for that mail id",
		})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to look up roll number",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"mailid":  mailID,
		"roll_no": rollNo,
	})
}

func (h *StudentLookupHandler) GetMe(c *gin.Context) {
	emailID := strings.TrimSpace(c.Query("emailid"))
	if emailID == "" {
		emailID = strings.TrimSpace(c.Query("mailid"))
	}
	if emailID == "" {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Query param 'emailid' is required or send a Bearer token",
			})
			return
		}

		resolvedEmail, err := emailFromToken(token)
		if err != nil {
			status := http.StatusUnauthorized
			if err.Error() == "failed to initialize Firebase auth" {
				status = http.StatusInternalServerError
			}
			c.JSON(status, gin.H{
				"success": false,
				"error":   err.Error(),
			})
			return
		}

		emailID = resolvedEmail
	}

	if emailID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Query param 'emailid' is required",
		})
		return
	}

	var user models.User
	if err := h.DB.QueryRow(
		`SELECT uid, email, display_name, photo_url, creation_time, last_sign_in_time, COALESCE(last_seen_at, ''), COALESCE(blocked, 0), COALESCE(DATE_FORMAT(blocked_at, '%Y-%m-%dT%H:%i:%sZ'), '')
		 FROM users
		 WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))
		 LIMIT 1`,
		emailID,
	).Scan(
		&user.UID,
		&user.Email,
		&user.DisplayName,
		&user.PhotoURL,
		&user.CreationTime,
		&user.LastSignInTime,
		&user.LastSeenAt,
		&user.IsBlocked,
		&user.BlockedAt,
	); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "No user found for that email id",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to load user profile",
		})
		return
	}

	if user.IsBlocked {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"status":  "blocked",
			"message": "Your account is blocked. Contact support@bitsathy.in for more details.",
		})
		return
	}

	var rollNo string
	rollErr := h.DB.QueryRow(
		`SELECT rollno FROM student_email WHERE LOWER(TRIM(emailid)) = LOWER(TRIM(?)) LIMIT 1`,
		emailID,
	).Scan(&rollNo)
	if rollErr != nil && !errors.Is(rollErr, sql.ErrNoRows) {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to look up roll number",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"uid":               user.UID,
			"email":             user.Email,
			"display_name":      user.DisplayName,
			"photo_url":         user.PhotoURL,
			"creation_time":     user.CreationTime,
			"last_sign_in_time": user.LastSignInTime,
			"last_seen_at":      user.LastSeenAt,
			"is_blocked":        user.IsBlocked,
			"blocked_at":        user.BlockedAt,
			"roll_no":           rollNo,
		},
	})
}

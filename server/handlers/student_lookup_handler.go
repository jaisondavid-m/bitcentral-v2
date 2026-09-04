package handlers

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

func emailFromToken(token string) (string, error) {
	_, email, err := userFromToken(token)
	return email, err
}

func userFromToken(token string) (string, string, error) {
	claims, err := config.VerifyGoogleToken(token)
	if err != nil || claims == nil {
		return "", "", errors.New("unauthorized: " + err.Error())
	}
	return claims.UID, strings.TrimSpace(claims.Email), nil
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
		`SELECT COALESCE(user_id, '') FROM tracker_users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) AND COALESCE(user_id, '') != '' LIMIT 1`,
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

	var claims *config.GoogleUserClaims
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
	if token != "" {
		if cClaims, err := config.VerifyGoogleToken(token); err == nil && cClaims != nil {
			claims = cClaims
			if emailID == "" {
				emailID = claims.Email
			}
		} else if emailID == "" {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"error":   "Invalid authentication token",
			})
			return
		}
	}

	if emailID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "Query param 'emailid' is required or send a Bearer token",
		})
		return
	}

	// Optional enforcement: restrict emails to internal domain unless explicitly allowed.
	if strings.ToLower(strings.TrimSpace(os.Getenv("ENFORCE_EMAIL_DOMAIN"))) == "true" {
		lower := strings.ToLower(strings.TrimSpace(emailID))
		if !(strings.HasSuffix(lower, "@bitsathy.ac.in") || strings.HasSuffix(lower, "@bitsathy.in")) {
			domain := ""
			if at := strings.LastIndex(lower, "@"); at >= 0 {
				domain = lower[at+1:]
			}
			var count int
			if h.DB != nil {
				err := h.DB.QueryRow(`SELECT COUNT(*) FROM allowed_emails WHERE (type='email' AND LOWER(value)=?) OR (type='domain' AND LOWER(value)=?)`, lower, domain).Scan(&count)
				if err != nil || count == 0 {
					c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Access restricted. Contact admin to allow your email."})
					return
				}
			}
		}
	}

	var hasIDCol bool
	if h.DB != nil {
		var cnt int
		_ = h.DB.QueryRow(`SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'id'`).Scan(&cnt)
		hasIDCol = cnt > 0
	}

	idQuery := "0 AS id"
	if hasIDCol {
		idQuery = "COALESCE(id, 0)"
	}

	var user models.User
	cleanEmail := strings.ToLower(strings.TrimSpace(emailID))
	queryStr := fmt.Sprintf(
		`SELECT %s, COALESCE(google_id, COALESCE(uid, '')), COALESCE(email, ''), COALESCE(display_name, ''), COALESCE(photo_url, ''), COALESCE(creation_time, ''), COALESCE(last_sign_in_time, ''), COALESCE(last_seen_at, ''), COALESCE(blocked, 0), COALESCE(DATE_FORMAT(blocked_at, '%%Y-%%m-%%dT%%H:%%i:%%sZ'), ''), COALESCE(role, 'user')
		 FROM users
		 WHERE email = ? OR LOWER(TRIM(email)) = ?
		 LIMIT 1`,
		idQuery,
	)
	err := h.DB.QueryRow(queryStr, emailID, cleanEmail).Scan(
		&user.ID,
		&user.GoogleID,
		&user.Email,
		&user.DisplayName,
		&user.PhotoURL,
		&user.CreationTime,
		&user.LastSignInTime,
		&user.LastSeenAt,
		&user.IsBlocked,
		&user.BlockedAt,
		&user.Role,
	)
	user.UID = user.GoogleID

	if errors.Is(err, sql.ErrNoRows) {
		// Auto-register user from Google claims if email is valid
		uid := emailID
		name := ""
		photo := ""
		if claims != nil {
			if claims.UID != "" {
				uid = claims.UID
			}
			if claims.Name != "" {
				name = claims.Name
			}
			if claims.Picture != "" {
				photo = claims.Picture
			}
		}
		nowStr := strings.TrimSpace(strings.ReplaceAll(strings.ReplaceAll(os.Getenv("NOW"), "\"", ""), "'", ""))
		if nowStr == "" {
			nowStr = "2026-09-04T14:40:00Z"
		}
		_, _ = h.DB.Exec(
			`INSERT INTO users (google_id, uid, email, display_name, photo_url, creation_time, last_sign_in_time, last_seen_at, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user')`,
			uid, uid, emailID, name, photo, nowStr, nowStr, nowStr,
		)
		queryStr2 := fmt.Sprintf(
			`SELECT %s, COALESCE(google_id, COALESCE(uid, '')), COALESCE(email, ''), COALESCE(display_name, ''), COALESCE(photo_url, ''), COALESCE(creation_time, ''), COALESCE(last_sign_in_time, ''), COALESCE(last_seen_at, ''), COALESCE(blocked, 0), COALESCE(DATE_FORMAT(blocked_at, '%%Y-%%m-%%dT%%H:%%i:%%sZ'), ''), COALESCE(role, 'user')
			 FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) LIMIT 1`,
			idQuery,
		)
		_ = h.DB.QueryRow(queryStr2, emailID).Scan(&user.ID, &user.GoogleID, &user.Email, &user.DisplayName, &user.PhotoURL, &user.CreationTime, &user.LastSignInTime, &user.LastSeenAt, &user.IsBlocked, &user.BlockedAt, &user.Role)
		user.UID = user.GoogleID
	} else if err != nil {
		log.Printf("❌ GetMe DB query error for %s: %v", emailID, err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to load user profile: " + err.Error(),
		})
		return
	}

	// Seamlessly update UID and user profile details if claims provide updated info
	if claims != nil {
		if claims.UID != "" && user.GoogleID != claims.UID {
			oldUID := user.GoogleID
			newUID := claims.UID
			_, _ = h.DB.Exec(`UPDATE users SET google_id = ?, uid = ? WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))`, newUID, newUID, emailID)
			_, _ = h.DB.Exec(`UPDATE admins SET uid = ? WHERE uid = ?`, newUID, oldUID)
			_, _ = h.DB.Exec(`UPDATE feedback_messages SET user_uid = ? WHERE user_uid = ?`, newUID, oldUID)
			user.GoogleID = newUID
			user.UID = newUID
		}
		if claims.Name != "" && user.DisplayName == "" {
			_, _ = h.DB.Exec(`UPDATE users SET display_name = ? WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))`, claims.Name, emailID)
			user.DisplayName = claims.Name
		}
		if claims.Picture != "" && user.PhotoURL == "" {
			_, _ = h.DB.Exec(`UPDATE users SET photo_url = ? WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))`, claims.Picture, emailID)
			user.PhotoURL = claims.Picture
		}
	}

	if user.IsBlocked {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"status":  "blocked",
			"message": "Your account is blocked. Contact support@bitsathy.in for more details.",
		})
		return
	}

	var trackerID, trackerUserID, phoneNo string
	if h.DB != nil {
		_ = h.DB.QueryRow(
			`SELECT COALESCE(id, ''), COALESCE(user_id, ''), COALESCE(phone, '') FROM tracker_users WHERE email = ? OR LOWER(TRIM(email)) = ? LIMIT 1`,
			emailID, cleanEmail,
		).Scan(&trackerID, &trackerUserID, &phoneNo)
	}

	rollNo := trackerUserID
	if rollNo == "" {
		rollNo = trackerID
	}

	userID := trackerID
	if userID == "" {
		userID = trackerUserID
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":                user.ID,
			"google_id":         user.GoogleID,
			"user_id":           userID,
			"uid":               user.GoogleID,
			"email":             user.Email,
			"display_name":      user.DisplayName,
			"photo_url":         user.PhotoURL,
			"creation_time":     user.CreationTime,
			"last_sign_in_time": user.LastSignInTime,
			"last_seen_at":      user.LastSeenAt,
			"is_blocked":        user.IsBlocked,
			"blocked_at":        user.BlockedAt,
			"role":              user.Role,
			"roll_no":           rollNo,
			"phone":             phoneNo,
			"phone_no":          phoneNo,
		},
	})
}

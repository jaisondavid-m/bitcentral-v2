package handlers

import (
	"database/sql"
	"net/http"
	"strings"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

type TrackerUserHandler struct {
	DB *sql.DB
}

func NewTrackerUserHandler() *TrackerUserHandler {
	return &TrackerUserHandler{
		DB: config.DB,
	}
}

func (h *TrackerUserHandler) GetTrackerUsers(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database connection is not initialized",
		})
		return
	}

	search := strings.TrimSpace(c.Query("q"))
	if search == "" {
		search = strings.TrimSpace(c.Query("search"))
	}

	var rows *sql.Rows
	var err error

	if search != "" {
		pattern := "%" + strings.ToLower(search) + "%"
		query := `
			SELECT 
				COALESCE(user_id, ''), 
				COALESCE(id, ''), 
				COALESCE(name, ''), 
				COALESCE(email, ''),
				COALESCE(batch, ''),
				COALESCE(phone, ''),
				COALESCE(department, '')
			FROM tracker_users
			WHERE LOWER(user_id) LIKE ? 
			   OR LOWER(id) LIKE ? 
			   OR LOWER(name) LIKE ? 
			   OR LOWER(email) LIKE ?
			ORDER BY name ASC
			LIMIT 1000
		`
		rows, err = h.DB.Query(query, pattern, pattern, pattern, pattern)
	} else {
		query := `
			SELECT 
				COALESCE(user_id, ''), 
				COALESCE(id, ''), 
				COALESCE(name, ''), 
				COALESCE(email, ''),
				COALESCE(batch, ''),
				COALESCE(phone, ''),
				COALESCE(department, '')
			FROM tracker_users
			ORDER BY name ASC
			LIMIT 1000
		`
		rows, err = h.DB.Query(query)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch tracker users: " + err.Error(),
		})
		return
	}
	defer rows.Close()

	users := make([]models.TrackerUser, 0)
	for rows.Next() {
		var u models.TrackerUser
		if err := rows.Scan(&u.UserID, &u.ID, &u.Name, &u.Email, &u.Batch, &u.Phone, &u.Department); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Error reading tracker user row: " + err.Error(),
			})
			return
		}
		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Row iteration error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    users,
		"count":   len(users),
	})
}

func (h *TrackerUserHandler) GetProfileV2(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database connection is not initialized",
		})
		return
	}

	emailID := strings.TrimSpace(c.Query("emailid"))
	if emailID == "" {
		emailID = strings.TrimSpace(c.Query("email"))
	}
	if emailID == "" {
		emailID = strings.TrimSpace(c.Query("mailid"))
	}

	if emailID == "" {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if token != "" {
			resolvedEmail, err := emailFromToken(token)
			if err == nil && resolvedEmail != "" {
				emailID = resolvedEmail
			}
		}
	}

	if emailID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Query param 'email' or valid Authorization Bearer token is required",
		})
		return
	}

	var profile models.TrackerUserProfileV2

	query := `
		SELECT 
			COALESCE(t.id, ''), 
			COALESCE(t.user_id, ''), 
			COALESCE(t.name, ''), 
			COALESCE(t.email, ''), 
			COALESCE(t.batch, ''), 
			COALESCE(t.phone, ''), 
			COALESCE(t.department, ''),
			COALESCE(u.photo_url, ''),
			COALESCE(u.creation_time, ''),
			COALESCE(u.last_sign_in_time, '')
		FROM tracker_users t
		LEFT JOIN users u ON LOWER(TRIM(u.email)) = LOWER(TRIM(t.email))
		WHERE LOWER(TRIM(t.email)) = LOWER(TRIM(?))
		   OR LOWER(TRIM(t.user_id)) = LOWER(TRIM(?))
		   OR LOWER(TRIM(t.id)) = LOWER(TRIM(?))
		LIMIT 1
	`

	err := h.DB.QueryRow(query, emailID, emailID, emailID).Scan(
		&profile.UserID,
		&profile.RegisterNo,
		&profile.Name,
		&profile.Email,
		&profile.Batch,
		&profile.Phone,
		&profile.Department,
		&profile.PhotoURL,
		&profile.CreationTime,
		&profile.LastSignInTime,
	)

	if err == sql.ErrNoRows {
		var userRow models.User
		userErr := h.DB.QueryRow(
			`SELECT uid, email, display_name, photo_url, creation_time, last_sign_in_time FROM users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) LIMIT 1`,
			emailID,
		).Scan(&userRow.UID, &userRow.Email, &userRow.DisplayName, &userRow.PhotoURL, &userRow.CreationTime, &userRow.LastSignInTime)

		if userErr != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "User profile not found",
			})
			return
		}

		profile = models.TrackerUserProfileV2{
			UserID:         userRow.UID,
			RegisterNo:     "",
			Name:           userRow.DisplayName,
			Email:          userRow.Email,
			Batch:          "",
			Phone:          "",
			Department:     "",
			PhotoURL:       userRow.PhotoURL,
			CreationTime:   userRow.CreationTime,
			LastSignInTime: userRow.LastSignInTime,
		}
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch profile: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    profile,
	})
}


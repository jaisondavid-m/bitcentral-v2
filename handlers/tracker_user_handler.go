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
				COALESCE(email, '')
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
				COALESCE(email, '')
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
		if err := rows.Scan(&u.UserID, &u.ID, &u.Name, &u.Email); err != nil {
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

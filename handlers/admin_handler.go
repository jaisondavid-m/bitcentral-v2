package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"time"

	"server/config"
	"server/models"
	"server/utils"

	"github.com/gin-gonic/gin"
)

type AdminHandler struct {
	DB *sql.DB
}

func NewAdminHandler() *AdminHandler {
	return &AdminHandler{
		DB: config.DB,
	}
}
func (h *AdminHandler) GetUsers(c *gin.Context) {
	client, err := config.FirebaseAuthClient()
	if err != nil || client == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to initialize Firebase auth"})
		return
	}

	presenceByUID, err := h.loadUserPresenceMap()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	iter := client.Users(context.Background(), "")

	var users []models.User

	for {
		u, err := iter.Next()
		if err != nil {
			break
		}

		users = append(users, models.User{
			UID:            u.UID,
			Email:          u.Email,
			DisplayName:    u.DisplayName,
			PhotoURL:       u.PhotoURL,
			CreationTime:   utils.TsToString(u.UserMetadata.CreationTimestamp),
			LastSignInTime: utils.TsToString(u.UserMetadata.LastLogInTimestamp),
			LastSeenAt:     presenceByUID[u.UID].LastSeenAt,
			IsOnline:       presenceByUID[u.UID].IsOnline,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"users":   users,
	})
}
func (h *AdminHandler) UpdateUsers(c *gin.Context) {
	client, err := config.FirebaseAuthClient()
	if err != nil || client == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to initialize Firebase auth"})
		return
	}
	iter := client.Users(context.Background(), "")

	var users []models.User
	var syncErr error
	batchSize := 100

	for {
		u, err := iter.Next()
		if err != nil {
			break
		}

		users = append(users, models.User{
			UID:            u.UID,
			Email:          u.Email,
			DisplayName:    u.DisplayName,
			PhotoURL:       u.PhotoURL,
			CreationTime:   utils.TsToString(u.UserMetadata.CreationTimestamp),
			LastSignInTime: utils.TsToString(u.UserMetadata.LastLogInTimestamp),
		})

		// Upsert every 100 users
		if len(users) >= batchSize {
			if err := h.syncUsersToMySQL(users); err != nil {
				syncErr = err
				break
			}
			users = users[:0]
		}
	}

	// Upsert any remaining users
	if syncErr == nil && len(users) > 0 {
		syncErr = h.syncUsersToMySQL(users)
	}

	if syncErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": syncErr.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Users synced successfully",
	})
}

func (h *AdminHandler) syncUsersToMySQL(users []models.User) error {
	query := `
	INSERT INTO users (uid, email, display_name, photo_url, creation_time, last_sign_in_time, last_seen_at)
	VALUES (?, ?, ?, ?, ?, ?, NULL)
	ON DUPLICATE KEY UPDATE
		email           = VALUES(email),
		display_name    = VALUES(display_name),
		photo_url       = VALUES(photo_url),
		last_sign_in_time = VALUES(last_sign_in_time),
		last_seen_at    = COALESCE(last_seen_at, VALUES(last_seen_at))`

	tx, err := h.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, u := range users {
		_, err := stmt.Exec(u.UID, u.Email, u.DisplayName, u.PhotoURL, u.CreationTime, u.LastSignInTime)
		if err != nil {
			return err
		}
	}

	return tx.Commit()
}

type userPresence struct {
	LastSeenAt string
	IsOnline   bool
}

func (h *AdminHandler) loadUserPresenceMap() (map[string]userPresence, error) {
	rows, err := h.DB.Query(`SELECT uid, last_seen_at FROM user_presence`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make(map[string]userPresence)
	for rows.Next() {
		var uid string
		var lastSeen sql.NullString
		if err := rows.Scan(&uid, &lastSeen); err != nil {
			return nil, err
		}

		presence := userPresence{}
		if lastSeen.Valid {
			presence.LastSeenAt = lastSeen.String
			presence.IsOnline = isOnlineFromTimestamp(lastSeen.String)
		}
		result[uid] = presence
	}

	return result, nil
}

func isOnlineFromTimestamp(value string) bool {
	if value == "" {
		return false
	}

	parsed, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return false
	}

	return time.Since(parsed) <= 2*time.Minute
}

func (h *AdminHandler) TouchUserPresence(uid string) error {
	_, err := h.DB.Exec(`
		INSERT INTO user_presence (uid, last_seen_at)
		VALUES (?, ?)
		ON DUPLICATE KEY UPDATE last_seen_at = VALUES(last_seen_at)`,
		uid,
		utils.TimeToString(time.Now()),
	)
	return err
}

// DELETE USER
func (h *AdminHandler) DeleteUser(c *gin.Context) {
	uid := c.Param("uid")

	client, err := config.FirebaseAuthClient()
	if err != nil || client == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to initialize Firebase auth"})
		return
	}
	if err := client.DeleteUser(context.Background(), uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

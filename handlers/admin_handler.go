package handlers

import (
	"context"
	"database/sql"
	"net/http"
	"strings"
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

	adminRows, err := h.DB.Query(`SELECT uid FROM admins`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer adminRows.Close()

	adminByUID := make(map[string]bool)
	for adminRows.Next() {
		var uid string
		if err := adminRows.Scan(&uid); err != nil {
			continue
		}
		adminByUID[uid] = true
	}

	presenceByUID, err := h.loadUserPresenceMap()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	statusByUID, err := h.loadUserStatusMap()
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
			LastUsedRoute:  presenceByUID[u.UID].LastUsedRoute,
			IsOnline:       presenceByUID[u.UID].IsOnline,
			IsAdmin:        adminByUID[u.UID],
			IsBlocked:      statusByUID[u.UID].IsBlocked,
			BlockedAt:      statusByUID[u.UID].BlockedAt,
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
		creation_time   = VALUES(creation_time),
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
	LastSeenAt    string
	LastUsedRoute string
	IsOnline      bool
}

type userStatus struct {
	IsBlocked bool
	BlockedAt string
}

func (h *AdminHandler) loadUserPresenceMap() (map[string]userPresence, error) {
	rows, err := h.DB.Query(`SELECT uid, last_seen_at, last_used_route FROM user_presence`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make(map[string]userPresence)
	for rows.Next() {
		var uid string
		var lastSeen sql.NullString
		var lastUsedRoute sql.NullString
		if err := rows.Scan(&uid, &lastSeen, &lastUsedRoute); err != nil {
			return nil, err
		}

		presence := userPresence{}
		if lastSeen.Valid {
			presence.LastSeenAt = lastSeen.String
			presence.IsOnline = isOnlineFromTimestamp(lastSeen.String)
		}
		if lastUsedRoute.Valid {
			presence.LastUsedRoute = lastUsedRoute.String
		}
		result[uid] = presence
	}

	return result, nil
}

func (h *AdminHandler) loadUserStatusMap() (map[string]userStatus, error) {
	rows, err := h.DB.Query(`SELECT uid, COALESCE(blocked, 0), COALESCE(DATE_FORMAT(blocked_at, '%Y-%m-%dT%H:%i:%sZ'), '') FROM users`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	result := make(map[string]userStatus)
	for rows.Next() {
		var uid string
		var blocked int
		var blockedAt string
		if err := rows.Scan(&uid, &blocked, &blockedAt); err != nil {
			return nil, err
		}

		result[uid] = userStatus{
			IsBlocked: blocked == 1,
			BlockedAt: blockedAt,
		}
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

func (h *AdminHandler) TouchUserPresence(uid, routeLabel string) error {
	_, err := h.DB.Exec(`
		INSERT INTO user_presence (uid, last_seen_at, last_used_route)
		VALUES (?, ?, ?)
		ON DUPLICATE KEY UPDATE last_seen_at = VALUES(last_seen_at), last_used_route = VALUES(last_used_route)`,
		uid,
		utils.TimeToString(time.Now()),
		routeLabel,
	)
	return err
}

func (h *AdminHandler) UpdateUserBlockStatus(c *gin.Context) {
	uid := strings.TrimSpace(c.Param("uid"))
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "uid is required"})
		return
	}

	var body struct {
		Blocked bool `json:"blocked"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	client, err := config.FirebaseAuthClient()
	if err != nil || client == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to initialize Firebase auth"})
		return
	}

	userRecord, err := client.GetUser(context.Background(), uid)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "Firebase user not found"})
		return
	}

	var blockedAt any = nil
	if body.Blocked {
		blockedAt = time.Now().UTC()
	}

	_, err = h.DB.Exec(`
		INSERT INTO users (uid, email, display_name, photo_url, creation_time, last_sign_in_time, last_seen_at, blocked, blocked_at)
		VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)
		ON DUPLICATE KEY UPDATE
			email = VALUES(email),
			display_name = VALUES(display_name),
			photo_url = VALUES(photo_url),
			creation_time = VALUES(creation_time),
			last_sign_in_time = VALUES(last_sign_in_time),
			blocked = VALUES(blocked),
			blocked_at = VALUES(blocked_at)`,
		userRecord.UID,
		userRecord.Email,
		userRecord.DisplayName,
		userRecord.PhotoURL,
		utils.TsToString(userRecord.UserMetadata.CreationTimestamp),
		utils.TsToString(userRecord.UserMetadata.LastLogInTimestamp),
		body.Blocked,
		blockedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	message := "User unblocked successfully"
	if body.Blocked {
		message = "User blocked successfully"
	}

	blockedAtValue := ""
	if body.Blocked {
		blockedAtValue = time.Now().UTC().Format(time.RFC3339)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": message,
		"user": gin.H{
			"uid":        uid,
			"blocked":    body.Blocked,
			"blocked_at": blockedAtValue,
		},
	})
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

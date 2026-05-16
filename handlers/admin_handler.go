package handlers

import (
	"context"
	"database/sql"
	"net/http"

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
	client, _ := config.FirebaseApp.Auth(context.Background())

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
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"users":   users,
	})
}
func (h *AdminHandler) UpdateUsers(c *gin.Context) {
	client, _ := config.FirebaseApp.Auth(context.Background())
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
	INSERT INTO users (uid, email, display_name, photo_url, creation_time, last_sign_in_time)
	VALUES (?, ?, ?, ?, ?, ?)
	ON DUPLICATE KEY UPDATE
		email           = VALUES(email),
		display_name    = VALUES(display_name),
		photo_url       = VALUES(photo_url),
		last_sign_in_time = VALUES(last_sign_in_time)`

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
// DELETE USER
func (h *AdminHandler) DeleteUser(c *gin.Context) {
	uid := c.Param("uid")

	client, _ := config.FirebaseApp.Auth(context.Background())
	client.DeleteUser(context.Background(), uid)

	c.JSON(http.StatusOK, gin.H{"success": true})
}

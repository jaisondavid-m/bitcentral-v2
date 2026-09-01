package handlers

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"math"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"server/config"
	"server/models"
	"server/utils"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
	"firebase.google.com/go/auth"
)

type AdminHandler struct {
	DB *sql.DB
}

func NewAdminHandler() *AdminHandler {
	return &AdminHandler{
		DB: config.DB,
	}
}
func getBatchLabelFromEmail(email string) string {
	email = strings.ToLower(strings.TrimSpace(email))
	if email == "" {
		return "others"
	}
	re := regexp.MustCompile(`(?:^|[^0-9])([0-9]{2})(?:[^0-9]|$)`)
	matches := re.FindStringSubmatch(email)
	if len(matches) < 2 {
		return "others"
	}
	two := matches[1]
	allowed := map[string]bool{"22": true, "23": true, "24": true, "25": true, "26": true}
	if !allowed[two] {
		return "others"
	}
	year, _ := strconv.Atoi(two)
	start := 2000 + year
	end := start + 4
	return fmt.Sprintf("%d-%d", start, end)
}

func (h *AdminHandler) syncFirebaseUsersToDB() error {
	client, err := config.FirebaseAuthClient()
	if err != nil || client == nil {
		return err
	}

	iter := client.Users(context.Background(), "")
	var batchUsers []models.User
	batchSize := 100
	totalSynced := 0

	for {
		u, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Printf("⚠️ Error iterating Firebase users: %v", err)
			break
		}

		batchUsers = append(batchUsers, models.User{
			UID:            u.UID,
			Email:          u.Email,
			DisplayName:    u.DisplayName,
			PhotoURL:       u.PhotoURL,
			CreationTime:   utils.TsToString(u.UserMetadata.CreationTimestamp),
			LastSignInTime: utils.TsToString(u.UserMetadata.LastLogInTimestamp),
		})
		totalSynced++

		if len(batchUsers) >= batchSize {
			if err := h.syncUsersToMySQL(batchUsers); err != nil {
				log.Printf("❌ Failed to sync batch of %d users to MySQL: %v", len(batchUsers), err)
				return err
			}
			batchUsers = batchUsers[:0]
		}
	}

	if len(batchUsers) > 0 {
		if err := h.syncUsersToMySQL(batchUsers); err != nil {
			log.Printf("❌ Failed to sync final batch of %d users to MySQL: %v", len(batchUsers), err)
			return err
		}
	}

	log.Printf("✅ Synced %d total users from Firebase to MySQL", totalSynced)
	return nil
}

func (h *AdminHandler) GetUsers(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "25"))
	if limit < 1 {
		limit = 25
	}
	if limit > 200 {
		limit = 200
	}

	search := strings.ToLower(strings.TrimSpace(c.Query("search")))
	batch := strings.TrimSpace(c.Query("batch"))

	var totalInDB int
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&totalInDB)
	if totalInDB == 0 {
		_ = h.syncFirebaseUsersToDB()
	}

	rows, err := h.DB.Query(`SELECT uid, COALESCE(email, ''), COALESCE(display_name, ''), COALESCE(photo_url, ''), COALESCE(creation_time, ''), COALESCE(last_sign_in_time, ''), COALESCE(blocked, 0), COALESCE(DATE_FORMAT(blocked_at, '%Y-%m-%dT%H:%i:%sZ'), '') FROM users ORDER BY creation_time DESC, uid DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer rows.Close()

	var allUsers []models.User
	batchCounts := make(map[string]int)

	for rows.Next() {
		var u models.User
		var blocked int
		var blockedAt string
		if err := rows.Scan(&u.UID, &u.Email, &u.DisplayName, &u.PhotoURL, &u.CreationTime, &u.LastSignInTime, &blocked, &blockedAt); err != nil {
			continue
		}
		u.IsBlocked = blocked == 1
		u.BlockedAt = blockedAt

		batchLabel := getBatchLabelFromEmail(u.Email)
		batchCounts[batchLabel]++

		allUsers = append(allUsers, u)
	}

	var filtered []models.User
	for _, u := range allUsers {
		if batch != "" {
			label := getBatchLabelFromEmail(u.Email)
			if label != batch {
				continue
			}
		}

		if search != "" {
			emailLower := strings.ToLower(u.Email)
			nameLower := strings.ToLower(u.DisplayName)
			uidLower := strings.ToLower(u.UID)
			if !strings.Contains(emailLower, search) && !strings.Contains(nameLower, search) && !strings.Contains(uidLower, search) {
				continue
			}
		}

		filtered = append(filtered, u)
	}

	// If search query returned 0 matches in local DB, attempt direct Firebase lookup (by email or UID)
	if len(filtered) == 0 && search != "" {
		client, err := config.FirebaseAuthClient()
		if err == nil && client != nil {
			var fbUser *auth.UserRecord
			if strings.Contains(search, "@") {
				fbUser, _ = client.GetUserByEmail(context.Background(), search)
			} else {
				fbUser, _ = client.GetUser(context.Background(), search)
			}

			if fbUser != nil {
				u := models.User{
					UID:            fbUser.UID,
					Email:          fbUser.Email,
					DisplayName:    fbUser.DisplayName,
					PhotoURL:       fbUser.PhotoURL,
					CreationTime:   utils.TsToString(fbUser.UserMetadata.CreationTimestamp),
					LastSignInTime: utils.TsToString(fbUser.UserMetadata.LastLogInTimestamp),
				}

				label := getBatchLabelFromEmail(u.Email)
				if batch == "" || batch == label {
					_ = h.syncUsersToMySQL([]models.User{u})

					statusMap, _ := h.loadUserStatusMap()
					if st, ok := statusMap[u.UID]; ok {
						u.IsBlocked = st.IsBlocked
						u.BlockedAt = st.BlockedAt
					}

					filtered = append(filtered, u)
					allUsers = append(allUsers, u)
					batchCounts[label]++
				}
			}
		}
	}

	totalFiltered := len(filtered)
	totalPages := int(math.Ceil(float64(totalFiltered) / float64(limit)))
	if totalPages < 1 {
		totalPages = 1
	}

	startIndex := (page - 1) * limit
	if startIndex > totalFiltered {
		startIndex = totalFiltered
	}

	endIndex := startIndex + limit
	if endIndex > totalFiltered {
		endIndex = totalFiltered
	}

	paginatedSlice := filtered[startIndex:endIndex]

	adminRows, err := h.DB.Query(`SELECT uid FROM admins`)
	adminByUID := make(map[string]bool)
	if err == nil {
		defer adminRows.Close()
		for adminRows.Next() {
			var uid string
			if err := adminRows.Scan(&uid); err == nil {
				adminByUID[uid] = true
			}
		}
	}

	for i := range paginatedSlice {
		paginatedSlice[i].IsAdmin = adminByUID[paginatedSlice[i].UID]
	}

	c.JSON(http.StatusOK, gin.H{
		"success":       true,
		"users":         paginatedSlice,
		"total":         len(allUsers),
		"filteredTotal": totalFiltered,
		"page":          page,
		"pageSize":      limit,
		"totalPages":    totalPages,
		"batchCounts":   batchCounts,
	})
}
func (h *AdminHandler) UpdateUsers(c *gin.Context) {
	if err := h.syncFirebaseUsersToDB(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	var totalInDB int
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&totalInDB)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Successfully synced all %d users from Firebase", totalInDB),
		"total":   totalInDB,
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

type userStatus struct {
	IsBlocked bool
	BlockedAt string
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
		msg := "Failed to initialize Firebase auth"
		if err != nil {
			msg = "Failed to initialize Firebase auth: " + err.Error()
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": msg})
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
		msg := "Failed to initialize Firebase auth"
		if err != nil {
			msg = "Failed to initialize Firebase auth: " + err.Error()
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": msg})
		return
	}
	if err := client.DeleteUser(context.Background(), uid); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	_, _ = h.DB.Exec("DELETE FROM users WHERE uid = ?", uid)
	_, _ = h.DB.Exec("DELETE FROM admins WHERE uid = ?", uid)

	c.JSON(http.StatusOK, gin.H{"success": true})
}

package handlers

import (
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

func (h *AdminHandler) syncUsersToDB() error {
	log.Println("✅ Users synced from local MySQL database")
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
		_ = h.syncUsersToDB()
	}

	var hasIDCol bool
	if h.DB != nil {
		var cnt int
		_ = h.DB.QueryRow(`SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'id'`).Scan(&cnt)
		hasIDCol = cnt > 0
	}

	idQuery := "0 AS id"
	orderQuery := "creation_time DESC"
	if hasIDCol {
		idQuery = "COALESCE(id, 0)"
		orderQuery = "id DESC"
	}

	queryStr := fmt.Sprintf(`SELECT %s, COALESCE(google_id, COALESCE(uid, '')), COALESCE(email, ''), COALESCE(display_name, ''), COALESCE(photo_url, ''), COALESCE(creation_time, ''), COALESCE(last_sign_in_time, ''), COALESCE(last_seen_at, ''), COALESCE(blocked, 0), COALESCE(DATE_FORMAT(blocked_at, '%%Y-%%m-%%dT%%H:%%i:%%sZ'), ''), COALESCE(role, 'user') FROM users WHERE email LIKE '%%@bitsathy.ac.in' ORDER BY %s`, idQuery, orderQuery)

	rows, err := h.DB.Query(queryStr)
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
		if err := rows.Scan(&u.ID, &u.GoogleID, &u.Email, &u.DisplayName, &u.PhotoURL, &u.CreationTime, &u.LastSignInTime, &u.LastSeenAt, &blocked, &blockedAt, &u.Role); err != nil {
			continue
		}
		u.UID = u.GoogleID
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
			roleLower := strings.ToLower(u.Role)
			if !strings.Contains(emailLower, search) && !strings.Contains(nameLower, search) && !strings.Contains(uidLower, search) && !strings.Contains(roleLower, search) {
				continue
			}
		}

		filtered = append(filtered, u)
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
		paginatedSlice[i].IsAdmin = adminByUID[paginatedSlice[i].UID] || paginatedSlice[i].Role == "admin" || paginatedSlice[i].Role == "superadmin" || paginatedSlice[i].Role == "super_admin"
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
	if err := h.syncUsersToDB(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	var totalInDB int
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM users`).Scan(&totalInDB)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Successfully synced all %d users", totalInDB),
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
		email := strings.ToLower(strings.TrimSpace(u.Email))
		if !strings.HasSuffix(email, "@bitsathy.ac.in") {
			continue
		}
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

	var blockedAt any = nil
	if body.Blocked {
		blockedAt = time.Now().UTC()
	}

	_, err := h.DB.Exec(`UPDATE users SET blocked = ?, blocked_at = ? WHERE CAST(id AS CHAR) = ? OR google_id = ? OR uid = ? OR LOWER(TRIM(email)) = LOWER(TRIM(?))`, body.Blocked, blockedAt, uid, uid, uid, uid)
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

	_, _ = h.DB.Exec("DELETE FROM users WHERE CAST(id AS CHAR) = ? OR google_id = ? OR uid = ?", uid, uid, uid)
	_, _ = h.DB.Exec("DELETE FROM admins WHERE uid = ?", uid)

	c.JSON(http.StatusOK, gin.H{"success": true})
}

type BatchDeleteRequest struct {
	UIDs []string `json:"uids"`
}

// BATCH DELETE USERS
func (h *AdminHandler) DeleteUsersBatch(c *gin.Context) {
	var req BatchDeleteRequest
	if err := c.ShouldBindJSON(&req); err != nil || len(req.UIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "No users selected for deletion"})
		return
	}

	deletedCount := 0
	for _, uid := range req.UIDs {
		if uid == "" {
			continue
		}
		_, _ = h.DB.Exec("DELETE FROM users WHERE CAST(id AS CHAR) = ? OR google_id = ? OR uid = ?", uid, uid, uid)
		_, _ = h.DB.Exec("DELETE FROM admins WHERE uid = ?", uid)
		deletedCount++
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Successfully deleted %d user(s)", deletedCount),
		"count":   deletedCount,
	})
}

func (h *AdminHandler) UpdateUserRole(c *gin.Context) {
	uid := strings.TrimSpace(c.Param("uid"))
	if uid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "uid is required"})
		return
	}

	var body struct {
		Role string `json:"role"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": err.Error()})
		return
	}

	role := strings.TrimSpace(strings.ToLower(body.Role))
	if role == "" {
		role = "user"
	}

	_, err := h.DB.Exec(`UPDATE users SET role = ? WHERE CAST(id AS CHAR) = ? OR google_id = ? OR uid = ? OR LOWER(TRIM(email)) = LOWER(TRIM(?))`, role, uid, uid, uid, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	if role == "admin" || role == "superadmin" || role == "super_admin" {
		actorUID, _ := c.Get("actor_uid")
		_, _ = h.DB.Exec(`INSERT IGNORE INTO admins (uid, created_by) VALUES (?, ?)`, uid, actorUID)
	} else {
		_, _ = h.DB.Exec(`DELETE FROM admins WHERE uid = ?`, uid)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User role updated successfully",
		"uid":     uid,
		"role":    role,
	})
}

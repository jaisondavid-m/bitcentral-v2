package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"server/config"
	"server/models"
)

type NotificationHandler struct {
	DB *sql.DB
}

func NewNotificationHandler() *NotificationHandler {
	return &NotificationHandler{DB: config.DB}
}

// Helper to extract UID and email from auth header
func (h *NotificationHandler) getAuthUser(c *gin.Context) (uid, email string) {
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
	if token == "" {
		return "", ""
	}
	u, e, err := userFromToken(token)
	if err != nil {
		return "", ""
	}
	return u, e
}

// Helper to resolve student profile details for targeted notifications
func (h *NotificationHandler) resolveStudentInfo(uid, email string) (rollNo, batch, dept string) {
	if h.DB == nil {
		return "", "", ""
	}

	query := `
		SELECT 
			COALESCE(id, '') AS roll_no, 
			COALESCE(batch, '') AS batch, 
			COALESCE(department, '') AS department
		FROM tracker_users
		WHERE email = ? OR user_id = ? OR id = ?
		LIMIT 1
	`
	_ = h.DB.QueryRow(query, email, uid, uid).Scan(&rollNo, &batch, &dept)
	return rollNo, batch, dept
}

// GetUserNotifications retrieves in-app notifications for the logged-in user (or public broadcasts)
func (h *NotificationHandler) GetUserNotifications(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"success":      true,
			"unread_count": 0,
			"data":         []models.Notification{},
		})
		return
	}

	userUID, userEmail := h.getAuthUser(c)
	var rollNo, batch, dept string
	if userUID != "" || userEmail != "" {
		rollNo, batch, dept = h.resolveStudentInfo(userUID, userEmail)
	}

	query := `
		SELECT 
			n.id,
			n.title,
			n.message,
			n.type,
			n.priority,
			n.target_type,
			COALESCE(n.target_user_uid, '') AS target_user_uid,
			COALESCE(n.target_email, '') AS target_email,
			COALESCE(n.target_roll_no, '') AS target_roll_no,
			COALESCE(n.target_batch, '') AS target_batch,
			COALESCE(n.target_dept, '') AS target_dept,
			COALESCE(n.link_url, '') AS link_url,
			COALESCE(n.link_text, '') AS link_text,
			COALESCE(n.created_by, '') AS created_by,
			n.is_active,
			CASE WHEN r.id IS NOT NULL THEN 1 ELSE 0 END AS is_read,
			COALESCE(DATE_FORMAT(r.read_at, '%Y-%m-%d %H:%i:%s'), '') AS read_at,
			DATE_FORMAT(n.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
			DATE_FORMAT(n.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
		FROM notifications n
		LEFT JOIN user_notification_reads r ON r.notification_id = n.id AND r.user_uid = ?
		LEFT JOIN user_notification_dismissals d ON d.notification_id = n.id AND d.user_uid = ?
		WHERE n.is_active = 1
		  AND d.id IS NULL
		  AND (
		      n.target_type = 'all'
		      OR (? != '' AND n.target_type = 'user' AND (
		            (n.target_user_uid != '' AND n.target_user_uid = ?)
		         OR (n.target_email != '' AND LOWER(n.target_email) = LOWER(?))
		         OR (n.target_roll_no != '' AND LOWER(n.target_roll_no) = LOWER(?))
		      ))
		      OR (? != '' AND n.target_type = 'batch' AND n.target_batch = ?)
		      OR (? != '' AND n.target_type = 'dept' AND LOWER(n.target_dept) = LOWER(?))
		  )
		ORDER BY n.created_at DESC
		LIMIT 100
	`

	rows, err := h.DB.Query(
		query,
		userUID, userUID,
		userUID, userUID, userEmail, rollNo,
		batch, batch,
		dept, dept,
	)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success":      true,
			"unread_count": 0,
			"data":         []models.Notification{},
		})
		return
	}
	defer rows.Close()

	notifications := make([]models.Notification, 0)
	unreadCount := 0

	for rows.Next() {
		var n models.Notification
		var isReadInt, isActiveInt int

		if err := rows.Scan(
			&n.ID,
			&n.Title,
			&n.Message,
			&n.Type,
			&n.Priority,
			&n.TargetType,
			&n.TargetUserUID,
			&n.TargetEmail,
			&n.TargetRollNo,
			&n.TargetBatch,
			&n.TargetDept,
			&n.LinkURL,
			&n.LinkText,
			&n.CreatedBy,
			&isActiveInt,
			&isReadInt,
			&n.ReadAt,
			&n.CreatedAt,
			&n.UpdatedAt,
		); err != nil {
			continue
		}

		n.IsActive = isActiveInt == 1
		n.IsRead = isReadInt == 1

		if !n.IsRead {
			unreadCount++
		}

		notifications = append(notifications, n)
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"unread_count": unreadCount,
		"count":        len(notifications),
		"data":         notifications,
	})
}

// MarkNotificationAsRead marks a single notification as read
func (h *NotificationHandler) MarkNotificationAsRead(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	userUID, _ := h.getAuthUser(c)
	if userUID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authentication required"})
		return
	}

	idStr := c.Param("id")
	notifID, err := strconv.Atoi(idStr)
	if err != nil || notifID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid notification ID"})
		return
	}

	query := `
		INSERT INTO user_notification_reads (notification_id, user_uid, read_at)
		VALUES (?, ?, NOW())
		ON DUPLICATE KEY UPDATE read_at = NOW()
	`
	_, _ = h.DB.Exec(query, notifID, userUID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Notification marked as read",
	})
}

// MarkAllNotificationsAsRead marks all eligible notifications as read for current user
func (h *NotificationHandler) MarkAllNotificationsAsRead(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	userUID, userEmail := h.getAuthUser(c)
	if userUID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authentication required"})
		return
	}

	rollNo, batch, dept := h.resolveStudentInfo(userUID, userEmail)

	query := `
		INSERT IGNORE INTO user_notification_reads (notification_id, user_uid, read_at)
		SELECT n.id, ?, NOW()
		FROM notifications n
		LEFT JOIN user_notification_dismissals d ON d.notification_id = n.id AND d.user_uid = ?
		WHERE n.is_active = 1
		  AND d.id IS NULL
		  AND (
		      n.target_type = 'all'
		      OR (? != '' AND n.target_type = 'user' AND (
		            (n.target_user_uid != '' AND n.target_user_uid = ?)
		         OR (n.target_email != '' AND LOWER(n.target_email) = LOWER(?))
		         OR (n.target_roll_no != '' AND LOWER(n.target_roll_no) = LOWER(?))
		      ))
		      OR (? != '' AND n.target_type = 'batch' AND n.target_batch = ?)
		      OR (? != '' AND n.target_type = 'dept' AND LOWER(n.target_dept) = LOWER(?))
		  )
	`
	_, err := h.DB.Exec(
		query,
		userUID, userUID,
		userUID, userUID, userEmail, rollNo,
		batch, batch,
		dept, dept,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to mark all as read"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "All notifications marked as read",
	})
}

// DismissNotification removes/hides a notification for current user
func (h *NotificationHandler) DismissNotification(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	userUID, _ := h.getAuthUser(c)
	if userUID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authentication required"})
		return
	}

	idStr := c.Param("id")
	notifID, err := strconv.Atoi(idStr)
	if err != nil || notifID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid notification ID"})
		return
	}

	query := `
		INSERT INTO user_notification_dismissals (notification_id, user_uid, dismissed_at)
		VALUES (?, ?, NOW())
		ON DUPLICATE KEY UPDATE dismissed_at = NOW()
	`
	_, _ = h.DB.Exec(query, notifID, userUID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Notification dismissed",
	})
}

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// GetAdminNotifications lists all notifications with delivery stats
func (h *NotificationHandler) GetAdminNotifications(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	query := `
		SELECT 
			n.id,
			n.title,
			n.message,
			n.type,
			n.priority,
			n.target_type,
			COALESCE(n.target_user_uid, '') AS target_user_uid,
			COALESCE(n.target_email, '') AS target_email,
			COALESCE(n.target_roll_no, '') AS target_roll_no,
			COALESCE(n.target_batch, '') AS target_batch,
			COALESCE(n.target_dept, '') AS target_dept,
			COALESCE(n.link_url, '') AS link_url,
			COALESCE(n.link_text, '') AS link_text,
			COALESCE(n.created_by, '') AS created_by,
			n.is_active,
			DATE_FORMAT(n.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
			DATE_FORMAT(n.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at,
			(SELECT COUNT(*) FROM user_notification_reads WHERE notification_id = n.id) AS read_count
		FROM notifications n
		ORDER BY n.created_at DESC
		LIMIT 200
	`

	rows, err := h.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch notifications: " + err.Error()})
		return
	}
	defer rows.Close()

	notifications := make([]models.Notification, 0)
	stats := models.NotificationStats{}

	for rows.Next() {
		var n models.Notification
		var isActiveInt int

		if err := rows.Scan(
			&n.ID,
			&n.Title,
			&n.Message,
			&n.Type,
			&n.Priority,
			&n.TargetType,
			&n.TargetUserUID,
			&n.TargetEmail,
			&n.TargetRollNo,
			&n.TargetBatch,
			&n.TargetDept,
			&n.LinkURL,
			&n.LinkText,
			&n.CreatedBy,
			&isActiveInt,
			&n.CreatedAt,
			&n.UpdatedAt,
			&n.ReadCount,
		); err != nil {
			continue
		}

		n.IsActive = isActiveInt == 1
		stats.TotalNotifications++
		stats.TotalReads += n.ReadCount

		if n.TargetType == "all" {
			stats.BroadcastCount++
		} else {
			stats.TargetedCount++
		}

		if n.IsActive && (n.Priority == "urgent" || n.Priority == "high" || n.Type == "alert") {
			stats.ActiveAlerts++
		}

		notifications = append(notifications, n)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"count":   len(notifications),
		"stats":   stats,
		"data":    notifications,
	})
}

type CreateNotificationRequest struct {
	Title         string `json:"title" binding:"required"`
	Message       string `json:"message" binding:"required"`
	Type          string `json:"type"`          // "announcement", "alert", "update", "exam", "leave", "general"
	Priority      string `json:"priority"`      // "normal", "high", "urgent"
	TargetType    string `json:"target_type"`   // "all", "user", "batch", "dept"
	TargetUserUID string `json:"target_user_uid"`
	TargetEmail   string `json:"target_email"`
	TargetRollNo  string `json:"target_roll_no"`
	TargetBatch   string `json:"target_batch"`
	TargetDept    string `json:"target_dept"`
	LinkURL       string `json:"link_url"`
	LinkText      string `json:"link_text"`
}

// CreateNotification adds and broadcasts a new notification (Admin only)
func (h *NotificationHandler) CreateNotification(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	adminUID, adminEmail := h.getAuthUser(c)
	createdBy := adminEmail
	if createdBy == "" {
		createdBy = adminUID
	}
	if createdBy == "" {
		createdBy = "admin"
	}

	var req CreateNotificationRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body: " + err.Error()})
		return
	}

	req.Title = strings.TrimSpace(req.Title)
	req.Message = strings.TrimSpace(req.Message)
	req.Type = strings.ToLower(strings.TrimSpace(req.Type))
	req.Priority = strings.ToLower(strings.TrimSpace(req.Priority))
	req.TargetType = strings.ToLower(strings.TrimSpace(req.TargetType))
	req.TargetUserUID = strings.TrimSpace(req.TargetUserUID)
	req.TargetEmail = strings.TrimSpace(req.TargetEmail)
	req.TargetRollNo = strings.TrimSpace(req.TargetRollNo)
	req.TargetBatch = strings.TrimSpace(req.TargetBatch)
	req.TargetDept = strings.TrimSpace(req.TargetDept)
	req.LinkURL = strings.TrimSpace(req.LinkURL)
	req.LinkText = strings.TrimSpace(req.LinkText)

	if req.Title == "" || req.Message == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Title and message are required"})
		return
	}

	if req.Type == "" {
		req.Type = "announcement"
	}
	if req.Priority == "" {
		req.Priority = "normal"
	}
	if req.TargetType != "user" && req.TargetType != "batch" && req.TargetType != "dept" {
		req.TargetType = "all"
	}

	query := `
		INSERT INTO notifications (
			title, message, type, priority, target_type,
			target_user_uid, target_email, target_roll_no, target_batch, target_dept,
			link_url, link_text, created_by, is_active
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
	`

	res, err := h.DB.Exec(
		query,
		req.Title, req.Message, req.Type, req.Priority, req.TargetType,
		req.TargetUserUID, req.TargetEmail, req.TargetRollNo, req.TargetBatch, req.TargetDept,
		req.LinkURL, req.LinkText, createdBy,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": fmt.Sprintf("Failed to create notification: %v", err)})
		return
	}

	insertedID, _ := res.LastInsertId()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Notification dispatched successfully",
		"data": gin.H{
			"id":          insertedID,
			"title":       req.Title,
			"target_type": req.TargetType,
		},
	})
}

// UpdateNotification updates an existing notification (Admin only)
func (h *NotificationHandler) UpdateNotification(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	idStr := c.Param("id")
	notifID, err := strconv.Atoi(idStr)
	if err != nil || notifID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid notification ID"})
		return
	}

	var req struct {
		Title      string `json:"title"`
		Message    string `json:"message"`
		Type       string `json:"type"`
		Priority   string `json:"priority"`
		LinkURL    string `json:"link_url"`
		LinkText   string `json:"link_text"`
		IsActive   *bool  `json:"is_active"`
		TargetType string `json:"target_type"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body: " + err.Error()})
		return
	}

	isActive := 1
	if req.IsActive != nil && !*req.IsActive {
		isActive = 0
	}

	query := `
		UPDATE notifications
		SET title = ?, message = ?, type = ?, priority = ?, link_url = ?, link_text = ?, is_active = ?
		WHERE id = ?
	`
	_, err = h.DB.Exec(query, req.Title, req.Message, req.Type, req.Priority, req.LinkURL, req.LinkText, isActive, notifID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update notification: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Notification updated successfully",
	})
}

// DeleteNotification permanently removes a notification (Admin only)
func (h *NotificationHandler) DeleteNotification(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	idStr := c.Param("id")
	notifID, err := strconv.Atoi(idStr)
	if err != nil || notifID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid notification ID"})
		return
	}

	_, _ = h.DB.Exec("DELETE FROM user_notification_reads WHERE notification_id = ?", notifID)
	_, _ = h.DB.Exec("DELETE FROM user_notification_dismissals WHERE notification_id = ?", notifID)
	_, err = h.DB.Exec("DELETE FROM notifications WHERE id = ?", notifID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete notification: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Notification deleted successfully",
	})
}

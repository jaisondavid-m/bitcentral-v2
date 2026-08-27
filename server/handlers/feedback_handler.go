package handlers

import (
	"database/sql"
	"net/http"
	"strings"
	"time"

	"server/config"

	"github.com/gin-gonic/gin"
)

type FeedbackHandler struct {
	DB *sql.DB
}

func NewFeedbackHandler() *FeedbackHandler {
	return &FeedbackHandler{DB: config.DB}
}

type FeedbackMessage struct {
	ID            int       `json:"id"`
	UserUID       string    `json:"user_uid"`
	SenderType    string    `json:"sender_type"` // 'user' or 'admin'
	SenderName    string    `json:"sender_name"`
	SenderEmail   string    `json:"sender_email"`
	Message       string    `json:"message"`
	IsReadByAdmin bool      `json:"is_read_by_admin"`
	IsReadByUser  bool      `json:"is_read_by_user"`
	CreatedAt     time.Time `json:"created_at"`
}

type ConversationSummary struct {
	UserUID      string    `json:"user_uid"`
	UserName     string    `json:"user_name"`
	UserEmail    string    `json:"user_email"`
	LastMessage  string    `json:"last_message"`
	LastActivity time.Time `json:"last_activity"`
	UnreadCount  int       `json:"unread_count"`
}

// SendMessage handles posting a new feedback message from a student
func (h *FeedbackHandler) SendMessage(c *gin.Context) {
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
		return
	}

	uid, email, err := userFromToken(token)
	if err != nil || uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
		return
	}

	var body struct {
		Message    string `json:"message" binding:"required"`
		SenderName string `json:"sender_name"`
	}

	if err := c.ShouldBindJSON(&body); err != nil || strings.TrimSpace(body.Message) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Message body is required"})
		return
	}

	senderName := strings.TrimSpace(body.SenderName)
	if senderName == "" {
		if email != "" {
			senderName = strings.Split(email, "@")[0]
		} else {
			senderName = "Student"
		}
	}

	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	query := `INSERT INTO feedback_messages (user_uid, sender_type, sender_name, sender_email, message, is_read_by_admin, is_read_by_user)
	VALUES (?, 'user', ?, ?, ?, 0, 1)`

	res, err := h.DB.Exec(query, uid, senderName, email, strings.TrimSpace(body.Message))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to save message: " + err.Error()})
		return
	}

	id, _ := res.LastInsertId()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":               id,
			"user_uid":         uid,
			"sender_type":      "user",
			"sender_name":      senderName,
			"sender_email":     email,
			"message":          strings.TrimSpace(body.Message),
			"is_read_by_admin": false,
			"is_read_by_user":  true,
			"created_at":       time.Now(),
		},
	})
}

// GetUserMessages returns the conversation history for the currently logged in student
func (h *FeedbackHandler) GetUserMessages(c *gin.Context) {
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
		return
	}

	uid, _, err := userFromToken(token)
	if err != nil || uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
		return
	}

	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	// Mark admin messages as read by user
	_, _ = h.DB.Exec(`UPDATE feedback_messages SET is_read_by_user = 1 WHERE user_uid = ? AND sender_type = 'admin'`, uid)

	rows, err := h.DB.Query(`
		SELECT id, user_uid, sender_type, sender_name, sender_email, message, is_read_by_admin, is_read_by_user, created_at
		FROM feedback_messages
		WHERE user_uid = ?
		ORDER BY created_at ASC`, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch messages"})
		return
	}
	defer rows.Close()

	messages := []FeedbackMessage{}
	for rows.Next() {
		var m FeedbackMessage
		if err := rows.Scan(&m.ID, &m.UserUID, &m.SenderType, &m.SenderName, &m.SenderEmail, &m.Message, &m.IsReadByAdmin, &m.IsReadByUser, &m.CreatedAt); err == nil {
			messages = append(messages, m)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    messages,
	})
}

// GetAdminConversations returns a summary of all active user feedback threads for Admin
func (h *FeedbackHandler) GetAdminConversations(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	query := `
		SELECT 
			user_uid,
			COALESCE((SELECT sender_name FROM feedback_messages WHERE user_uid = f.user_uid AND sender_type = 'user' ORDER BY created_at DESC LIMIT 1), 'Student') as user_name,
			COALESCE((SELECT sender_email FROM feedback_messages WHERE user_uid = f.user_uid AND sender_type = 'user' ORDER BY created_at DESC LIMIT 1), '') as user_email,
			COALESCE((SELECT message FROM feedback_messages WHERE user_uid = f.user_uid ORDER BY created_at DESC LIMIT 1), '') as last_message,
			MAX(created_at) as last_activity,
			SUM(CASE WHEN is_read_by_admin = 0 AND sender_type = 'user' THEN 1 ELSE 0 END) as unread_count
		FROM feedback_messages f
		GROUP BY user_uid
		ORDER BY last_activity DESC`

	rows, err := h.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch conversations: " + err.Error()})
		return
	}
	defer rows.Close()

	conversations := []ConversationSummary{}
	for rows.Next() {
		var s ConversationSummary
		if err := rows.Scan(&s.UserUID, &s.UserName, &s.UserEmail, &s.LastMessage, &s.LastActivity, &s.UnreadCount); err == nil {
			conversations = append(conversations, s)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    conversations,
	})
}

// GetAdminUserMessages fetches full message transcript for a specific user thread
func (h *FeedbackHandler) GetAdminUserMessages(c *gin.Context) {
	userUID := strings.TrimSpace(c.Param("user_uid"))
	if userUID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "user_uid parameter is required"})
		return
	}

	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	// Mark user messages as read by admin
	_, _ = h.DB.Exec(`UPDATE feedback_messages SET is_read_by_admin = 1 WHERE user_uid = ? AND sender_type = 'user'`, userUID)

	rows, err := h.DB.Query(`
		SELECT id, user_uid, sender_type, sender_name, sender_email, message, is_read_by_admin, is_read_by_user, created_at
		FROM feedback_messages
		WHERE user_uid = ?
		ORDER BY created_at ASC`, userUID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch messages"})
		return
	}
	defer rows.Close()

	messages := []FeedbackMessage{}
	for rows.Next() {
		var m FeedbackMessage
		if err := rows.Scan(&m.ID, &m.UserUID, &m.SenderType, &m.SenderName, &m.SenderEmail, &m.Message, &m.IsReadByAdmin, &m.IsReadByUser, &m.CreatedAt); err == nil {
			messages = append(messages, m)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    messages,
	})
}

// AdminReply handles admin posting a response to a specific user chat thread
func (h *FeedbackHandler) AdminReply(c *gin.Context) {
	var body struct {
		UserUID string `json:"user_uid" binding:"required"`
		Message string `json:"message" binding:"required"`
	}

	if err := c.ShouldBindJSON(&body); err != nil || strings.TrimSpace(body.Message) == "" || strings.TrimSpace(body.UserUID) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "user_uid and message are required"})
		return
	}

	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	query := `INSERT INTO feedback_messages (user_uid, sender_type, sender_name, sender_email, message, is_read_by_admin, is_read_by_user)
	VALUES (?, 'admin', 'Admin', 'admin@bitsathy.in', ?, 1, 0)`

	res, err := h.DB.Exec(query, body.UserUID, strings.TrimSpace(body.Message))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to send admin reply: " + err.Error()})
		return
	}

	id, _ := res.LastInsertId()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"id":               id,
			"user_uid":         body.UserUID,
			"sender_type":      "admin",
			"sender_name":      "Admin",
			"sender_email":     "admin@bitsathy.in",
			"message":          strings.TrimSpace(body.Message),
			"is_read_by_admin": true,
			"is_read_by_user":  false,
			"created_at":       time.Now(),
		},
	})
}

package handlers

import (
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"

	"server/config"
	"server/models"
)

type HelpHandler struct {
	DB *sql.DB

	// Rate limiters (in-memory thread-safe)
	roomLimitMu   sync.Mutex
	roomLimitMap  map[string][]time.Time
	msgLimitMu    sync.Mutex
	msgLimitMap   map[string][]time.Time
	repLimitMu    sync.Mutex
	repLimitMap   map[string][]time.Time
}

func NewHelpHandler() *HelpHandler {
	return &HelpHandler{
		DB:           config.DB,
		roomLimitMap: make(map[string][]time.Time),
		msgLimitMap:  make(map[string][]time.Time),
		repLimitMap:  make(map[string][]time.Time),
	}
}

// Generate random UUID string for public IDs
func generateUUID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

// --- PII AND PROFANITY DETECTOR ---

var (
	reRegisterNo    = regexp.MustCompile(`(?i)\b(7376|2[0-9])[A-Z0-9]{4,10}\b`)
	rePhone         = regexp.MustCompile(`(?:\+?91[\-\s]?)?[6-9]\d{9}|\b\d{3}[\-\s]?\d{3}[\-\s]?\d{4}\b`)
	reEmail         = regexp.MustCompile(`(?i)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}`)
	reEmailDisguise = regexp.MustCompile(`(?i)\b[a-z0-9._]+\s*(?:at|@)\s*[a-z0-9.-]+\s*(?:dot|\.)\s*[a-z]{2,}\b`)
	reSocialHandle  = regexp.MustCompile(`(?i)(?:instagram|insta|snapchat|telegram|whatsapp|github)\.com\/[A-Za-z0-9_.]+|@([A-Za-z0-9_]{3,30})|t\.me\/[A-Za-z0-9_.]+|wa\.me\/[0-9]+`)
	reContactIntent = regexp.MustCompile(`(?i)\b(dm me|contact me|whatsapp me|call me|text me|message me|ping me|mail me|reach out to me|my number is|my email is|my insta is|hit me up on)\b`)
	reURL           = regexp.MustCompile(`(?i)https?:\/\/[^\s]+`)
)

var blockedProfanities = []string{
	"fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "pussy",
	"slut", "whore", "nigger", "faggot", "motherfucker", "gaand", "bhosdike",
	"madarchod", "bhenchod", "chutiya", "randi",
}

func containsPII(text string) bool {
	if reRegisterNo.MatchString(text) ||
		rePhone.MatchString(text) ||
		reEmail.MatchString(text) ||
		reEmailDisguise.MatchString(text) ||
		reSocialHandle.MatchString(text) ||
		reContactIntent.MatchString(text) ||
		reURL.MatchString(text) {
		return true
	}
	// Check stripped text to catch spaced-out numbers or phone numbers
	stripped := strings.ReplaceAll(strings.ReplaceAll(text, " ", ""), "-", "")
	if rePhone.MatchString(stripped) || reRegisterNo.MatchString(stripped) {
		return true
	}
	return false
}

func normalizeText(text string) string {
	lower := strings.ToLower(text)
	// Replace common obfuscations
	replacer := strings.NewReplacer("@", "a", "$", "s", "0", "o", "1", "i", "!", "i", ".", "", "_", "", "-", "")
	return replacer.Replace(lower)
}

func containsProfanity(text string) bool {
	norm := normalizeText(text)
	for _, word := range blockedProfanities {
		// Use word boundary check in normalized text
		pattern := fmt.Sprintf(`(?i)\b%s\b`, regexp.QuoteMeta(word))
		matched, _ := regexp.MatchString(pattern, norm)
		if matched {
			return true
		}
	}
	return false
}

// --- RATE LIMITERS ---

func (h *HelpHandler) checkRoomRateLimit(uid string) bool {
	h.roomLimitMu.Lock()
	defer h.roomLimitMu.Unlock()
	now := time.Now()
	cutoff := now.Add(-1 * time.Hour)

	var valid []time.Time
	for _, t := range h.roomLimitMap[uid] {
		if t.After(cutoff) {
			valid = append(valid, t)
		}
	}
	h.roomLimitMap[uid] = valid
	if len(valid) >= 5 { // Max 5 rooms per hour
		return false
	}
	h.roomLimitMap[uid] = append(h.roomLimitMap[uid], now)
	return true
}

func (h *HelpHandler) checkMsgRateLimit(uid string) bool {
	h.msgLimitMu.Lock()
	defer h.msgLimitMu.Unlock()
	now := time.Now()
	cutoff := now.Add(-1 * time.Minute)

	var valid []time.Time
	for _, t := range h.msgLimitMap[uid] {
		if t.After(cutoff) {
			valid = append(valid, t)
		}
	}
	h.msgLimitMap[uid] = valid
	if len(valid) >= 20 { // Max 20 messages per minute
		return false
	}
	h.msgLimitMap[uid] = append(h.msgLimitMap[uid], now)
	return true
}

func (h *HelpHandler) checkRepRateLimit(uid string) bool {
	h.repLimitMu.Lock()
	defer h.repLimitMu.Unlock()
	now := time.Now()
	cutoff := now.Add(-1 * time.Hour)

	var valid []time.Time
	for _, t := range h.repLimitMap[uid] {
		if t.After(cutoff) {
			valid = append(valid, t)
		}
	}
	h.repLimitMap[uid] = valid
	if len(valid) >= 10 { // Max 10 reports per hour
		return false
	}
	h.repLimitMap[uid] = append(h.repLimitMap[uid], now)
	return true
}

// --- USER RESTRICTION CHECK ---

func (h *HelpHandler) isUserRestricted(uid string) bool {
	if h.DB == nil {
		return false
	}
	var status string
	var expiresAt sql.NullTime
	err := h.DB.QueryRow(`
		SELECT status, expires_at FROM help_user_restrictions 
		WHERE user_uid = ? AND status IN ('BLOCKED', 'TEMPORARY_BLOCK') 
		ORDER BY created_at DESC LIMIT 1
	`, uid).Scan(&status, &expiresAt)

	if err == nil {
		if expiresAt.Valid && expiresAt.Time.Before(time.Now()) {
			return false // Temporary block expired
		}
		return true
	}
	return false
}

// --- CONVERSATION-SCOPED ANONYMOUS LABEL GENERATOR ---

func (h *HelpHandler) getOrCreateAnonLabel(roomID, uid string, isCreator bool) (string, error) {
	if isCreator {
		return "Anonymous Student", nil
	}

	// Check if participant already exists in room
	var existingLabel string
	err := h.DB.QueryRow(`SELECT anon_label FROM help_participants WHERE room_id = ? AND user_uid = ?`, roomID, uid).Scan(&existingLabel)
	if err == nil && existingLabel != "" {
		return existingLabel, nil
	}

	// Count existing non-creator participants in this room
	var count int
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM help_participants WHERE room_id = ? AND anon_label != 'Anonymous Student'`, roomID).Scan(&count)

	newLabel := fmt.Sprintf("Anonymous Helper %d", count+1)
	_, err = h.DB.Exec(`INSERT INTO help_participants (room_id, user_uid, anon_label) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE anon_label = VALUES(anon_label)`, roomID, uid, newLabel)
	if err != nil {
		log.Printf("Error inserting participant: %v", err)
	}
	return newLabel, nil
}

// Helper: load UserIdentity safely for Admin endpoints
func (h *HelpHandler) loadUserIdentity(uid string) models.AdminUserIdentity {
	identity := models.AdminUserIdentity{
		UID: uid,
	}
	if h.DB == nil || uid == "" {
		return identity
	}

	var name, email, googleID string
	err := h.DB.QueryRow(`SELECT COALESCE(display_name, ''), COALESCE(email, ''), COALESCE(google_id, '') FROM users WHERE uid = ? OR google_id = ? LIMIT 1`, uid, uid).Scan(&name, &email, &googleID)
	if err == nil {
		identity.Name = name
		identity.Email = email
	}

	var rollNo string
	err = h.DB.QueryRow(`SELECT COALESCE(user_id, '') FROM tracker_users WHERE (uid = ? OR LOWER(TRIM(email)) = LOWER(TRIM(?))) AND COALESCE(user_id, '') != '' LIMIT 1`, uid, email).Scan(&rollNo)
	if err == nil {
		identity.RegisterNo = rollNo
	}

	return identity
}

// --- STUDENT HANDLERS ---

// GET /api/help/rooms
func (h *HelpHandler) GetRooms(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, _, _ := userFromToken(token)

	category := strings.TrimSpace(c.Query("category"))
	search := strings.TrimSpace(c.Query("search"))
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "20")

	page, _ := strconv.Atoi(pageStr)
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(limitStr)
	if limit < 1 || limit > 50 {
		limit = 20
	}
	offset := (page - 1) * limit

	query := `SELECT id, creator_uid, creator_anon_label, title, content, category, status, views_count, responses_count, created_at FROM help_rooms WHERE status != 'DELETED'`
	args := []interface{}{}

	if category != "" && category != "All" {
		query += ` AND category = ?`
		args = append(args, category)
	}
	if search != "" {
		query += ` AND (title LIKE ? OR content LIKE ?)`
		args = append(args, "%"+search+"%", "%"+search+"%")
	}

	query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`
	args = append(args, limit, offset)

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch help requests"})
		return
	}
	defer rows.Close()

	rooms := []models.StudentHelpRoomDTO{}
	for rows.Next() {
		var r models.HelpRoom
		if err := rows.Scan(&r.ID, &r.CreatorUID, &r.CreatorAnonLabel, &r.Title, &r.Content, &r.Category, &r.Status, &r.ViewsCount, &r.ResponsesCount, &r.CreatedAt); err != nil {
			continue
		}

		// Check if user is blocked by room creator or vice versa
		if uid != "" && uid != r.CreatorUID {
			var isBlocked int
			_ = h.DB.QueryRow(`SELECT COUNT(*) FROM help_blocks WHERE (blocker_uid = ? AND blocked_uid = ?) OR (blocker_uid = ? AND blocked_uid = ?)`, uid, r.CreatorUID, r.CreatorUID, uid).Scan(&isBlocked)
			if isBlocked > 0 {
				continue // Hide room from blocked users
			}
		}

		dto := models.StudentHelpRoomDTO{
			ID:             r.ID,
			Title:          r.Title,
			Content:        r.Content,
			Category:       r.Category,
			Status:         r.Status,
			ViewsCount:     r.ViewsCount,
			ResponsesCount: r.ResponsesCount,
			AnonLabel:      r.CreatorAnonLabel,
			CreatedAt:      r.CreatedAt,
			IsMine:         (uid != "" && uid == r.CreatorUID),
		}
		rooms = append(rooms, dto)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    rooms,
		"page":    page,
		"limit":   limit,
	})
}

// POST /api/help/rooms
func (h *HelpHandler) CreateRoom(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, _, err := userFromToken(token)
	if err != nil || uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if h.isUserRestricted(uid) {
		c.JSON(http.StatusForbidden, gin.H{
			"error":   "HELP_SYSTEM_RESTRICTED",
			"message": "Your access to BIT Help has been restricted by an administrator.",
		})
		return
	}

	if !h.checkRoomRateLimit(uid) {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error":   "RATE_LIMIT_EXCEEDED",
			"message": "You can only create up to 5 help requests per hour. Please try again later.",
		})
		return
	}

	var req struct {
		Title    string `json:"title" binding:"required"`
		Content  string `json:"content" binding:"required"`
		Category string `json:"category" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title, content and category are required"})
		return
	}

	title := strings.TrimSpace(req.Title)
	content := strings.TrimSpace(req.Content)
	category := strings.TrimSpace(req.Category)

	if len(title) < 5 || len(title) > 200 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title must be between 5 and 200 characters"})
		return
	}
	if len(content) < 10 || len(content) > 3000 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Content must be between 10 and 3000 characters"})
		return
	}

	// Validate PII
	if containsPII(title) || containsPII(content) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "PERSONAL_INFORMATION_NOT_ALLOWED",
			"message": "Please do not share personal contact, roll numbers, or identifying information.",
		})
		return
	}

	// Validate Profanity
	if containsProfanity(title) || containsProfanity(content) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "INAPPROPRIATE_CONTENT",
			"message": "Your request contains prohibited or abusive words. Please rephrase respectfully.",
		})
		return
	}

	roomID := "hr_" + generateUUID()
	creatorLabel := "Anonymous Student"

	query := `INSERT INTO help_rooms (id, creator_uid, creator_anon_label, title, content, category, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'OPEN', ?)`
	now := time.Now()
	_, err = h.DB.Exec(query, roomID, uid, creatorLabel, title, content, category, now)
	if err != nil {
		log.Printf("Failed to create room: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create help request"})
		return
	}

	// Also register creator as participant
	_, _ = h.DB.Exec(`INSERT INTO help_participants (room_id, user_uid, anon_label) VALUES (?, ?, ?)`, roomID, uid, creatorLabel)

	dto := models.StudentHelpRoomDTO{
		ID:             roomID,
		Title:          title,
		Content:        content,
		Category:       category,
		Status:         "OPEN",
		ViewsCount:     0,
		ResponsesCount: 0,
		AnonLabel:      creatorLabel,
		CreatedAt:      now,
		IsMine:         true,
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    dto,
	})
}

// GET /api/help/rooms/:id
func (h *HelpHandler) GetRoomByID(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, _, _ := userFromToken(token)

	roomID := c.Param("id")
	if roomID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Room ID is required"})
		return
	}

	var r models.HelpRoom
	err := h.DB.QueryRow(`SELECT id, creator_uid, creator_anon_label, title, content, category, status, views_count, responses_count, created_at FROM help_rooms WHERE id = ?`, roomID).Scan(
		&r.ID, &r.CreatorUID, &r.CreatorAnonLabel, &r.Title, &r.Content, &r.Category, &r.Status, &r.ViewsCount, &r.ResponsesCount, &r.CreatedAt,
	)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Help request not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Increment view count
	_, _ = h.DB.Exec(`UPDATE help_rooms SET views_count = views_count + 1 WHERE id = ?`, roomID)

	isMine := (uid != "" && uid == r.CreatorUID)
	myAnonLabel := r.CreatorAnonLabel
	if !isMine && uid != "" {
		_ = h.DB.QueryRow(`SELECT anon_label FROM help_participants WHERE room_id = ? AND user_uid = ?`, roomID, uid).Scan(&myAnonLabel)
		if myAnonLabel == "" {
			myAnonLabel = "Anonymous Visitor"
		}
	}

	dto := models.StudentHelpRoomDTO{
		ID:             r.ID,
		Title:          r.Title,
		Content:        r.Content,
		Category:       r.Category,
		Status:         r.Status,
		ViewsCount:     r.ViewsCount + 1,
		ResponsesCount: r.ResponsesCount,
		AnonLabel:      r.CreatorAnonLabel,
		CreatedAt:      r.CreatedAt,
		IsMine:         isMine,
	}

	c.JSON(http.StatusOK, gin.H{
		"success":       true,
		"data":          dto,
		"my_anon_label": myAnonLabel,
	})
}

// GET /api/help/messages
func (h *HelpHandler) GetMessages(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, _, _ := userFromToken(token)

	parentID := strings.TrimSpace(c.Query("parent_id"))
	roomID := c.Param("id")

	query := `
		SELECT m.id, COALESCE(m.parent_id, ''), m.room_id, m.sender_uid, m.anon_label, m.content, m.is_system, m.created_at,
		(SELECT COUNT(*) FROM help_messages r WHERE r.parent_id = m.id AND r.is_removed = 0) as reply_count
		FROM help_messages m
		WHERE m.is_removed = 0
	`
	args := []interface{}{}

	if parentID != "" {
		query += ` AND m.parent_id = ?`
		args = append(args, parentID)
		query += ` ORDER BY m.created_at ASC`
	} else if roomID != "" && roomID != "main" {
		query += ` AND m.room_id = ?`
		args = append(args, roomID)
		query += ` ORDER BY m.created_at ASC`
	} else {
		query = `
			SELECT * FROM (
				SELECT m.id, COALESCE(m.parent_id, ''), m.room_id, m.sender_uid, m.anon_label, m.content, m.is_system, m.created_at,
				(SELECT COUNT(*) FROM help_messages r WHERE r.parent_id = m.id AND r.is_removed = 0) as reply_count
				FROM help_messages m
				WHERE m.is_removed = 0 AND (m.parent_id IS NULL OR m.parent_id = '')
				ORDER BY m.created_at DESC LIMIT 100
			) sub ORDER BY created_at ASC
		`
	}

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch messages"})
		return
	}
	defer rows.Close()

	messages := []models.StudentHelpMessageDTO{}
	for rows.Next() {
		var m models.HelpMessage
		var parent string
		var replyCount int
		if err := rows.Scan(&m.ID, &parent, &m.RoomID, &m.SenderUID, &m.AnonLabel, &m.Content, &m.IsSystem, &m.CreatedAt, &replyCount); err != nil {
			continue
		}

		// Check if message sender is blocked by current user or vice-versa
		if uid != "" && uid != m.SenderUID {
			var isBlocked int
			_ = h.DB.QueryRow(`SELECT COUNT(*) FROM help_blocks WHERE (blocker_uid = ? AND blocked_uid = ?) OR (blocker_uid = ? AND blocked_uid = ?)`, uid, m.SenderUID, m.SenderUID, uid).Scan(&isBlocked)
			if isBlocked > 0 {
				continue // Hide message from blocked user
			}
		}

		dto := models.StudentHelpMessageDTO{
			ID:         m.ID,
			ParentID:   parent,
			RoomID:     m.RoomID,
			AnonLabel:  m.AnonLabel,
			Content:    m.Content,
			IsSystem:   m.IsSystem,
			ReplyCount: replyCount,
			CreatedAt:  m.CreatedAt,
			IsMine:     (uid != "" && uid == m.SenderUID),
		}
		messages = append(messages, dto)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    messages,
	})
}

// POST /api/help/messages
func (h *HelpHandler) SendMessage(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, _, err := userFromToken(token)
	if err != nil || uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if h.isUserRestricted(uid) {
		c.JSON(http.StatusForbidden, gin.H{
			"error":   "HELP_SYSTEM_RESTRICTED",
			"message": "Your access to BIT Help has been restricted by an administrator.",
		})
		return
	}

	if !h.checkMsgRateLimit(uid) {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error":   "RATE_LIMIT_EXCEEDED",
			"message": "Message rate limit reached. Please wait a moment before sending another message.",
		})
		return
	}

	var req struct {
		Content  string `json:"content" binding:"required"`
		ParentID string `json:"parent_id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Message content is required"})
		return
	}

	content := strings.TrimSpace(req.Content)
	parentID := strings.TrimSpace(req.ParentID)
	roomID := c.Param("id")
	if roomID == "" {
		roomID = "main"
	}

	if len(content) < 2 || len(content) > 1500 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Message must be between 2 and 1500 characters"})
		return
	}

	// Validate PII
	if containsPII(content) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "PERSONAL_INFORMATION_NOT_ALLOWED",
			"message": "Please do not share personal contact, roll numbers, or identifying information.",
		})
		return
	}

	// Validate Profanity
	if containsProfanity(content) {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "INAPPROPRIATE_CONTENT",
			"message": "Your message contains prohibited or abusive language. Please keep discussions helpful and respectful.",
		})
		return
	}

	// Determine Anonymous Label for user
	scopeID := roomID
	if parentID != "" {
		scopeID = parentID
	}

	var anonLabel string
	_ = h.DB.QueryRow(`SELECT anon_label FROM help_participants WHERE room_id = ? AND user_uid = ?`, scopeID, uid).Scan(&anonLabel)
	if anonLabel == "" {
		var userCount int
		_ = h.DB.QueryRow(`SELECT COUNT(DISTINCT user_uid) FROM help_participants WHERE room_id = ?`, scopeID).Scan(&userCount)
		if scopeID == "main" && parentID == "" {
			anonLabel = fmt.Sprintf("Anonymous Student %d", userCount+1)
		} else {
			anonLabel = fmt.Sprintf("Anonymous Helper %d", userCount+1)
		}
		_, _ = h.DB.Exec(`INSERT INTO help_participants (room_id, user_uid, anon_label) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE anon_label = VALUES(anon_label)`, scopeID, uid, anonLabel)
	}

	msgID := "hm_" + generateUUID()
	now := time.Now()

	_, err = h.DB.Exec(`INSERT INTO help_messages (id, parent_id, room_id, sender_uid, anon_label, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
		msgID, parentID, roomID, uid, anonLabel, content, now)
	if err != nil {
		log.Printf("Failed to insert message: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
		return
	}

	dto := models.StudentHelpMessageDTO{
		ID:         msgID,
		ParentID:   parentID,
		RoomID:     roomID,
		AnonLabel:  anonLabel,
		Content:    content,
		IsSystem:   false,
		ReplyCount: 0,
		CreatedAt:  now,
		IsMine:     true,
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"data":    dto,
	})
}

// DELETE /api/help/messages/:id
func (h *HelpHandler) DeleteOwnMessage(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, email, err := userFromToken(token)
	if err != nil || uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	msgID := c.Param("id")
	if msgID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Message ID is required"})
		return
	}

	var senderUID string
	err = h.DB.QueryRow(`SELECT sender_uid FROM help_messages WHERE id = ? AND is_removed = 0`, msgID).Scan(&senderUID)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Message not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	isAdmin := false
	var role string
	_ = h.DB.QueryRow(`SELECT role FROM users WHERE (uid != '' AND uid = ?) OR (email != '' AND LOWER(TRIM(email)) = ?)`, uid, strings.ToLower(strings.TrimSpace(email))).Scan(&role)
	r := strings.ToLower(strings.TrimSpace(role))
	if r == "admin" || r == "superadmin" || r == "super_admin" {
		isAdmin = true
	}

	if senderUID != uid && !isAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "You can only delete your own messages unless you are an admin"})
		return
	}

	_, err = h.DB.Exec(`UPDATE help_messages SET is_removed = 1 WHERE id = ?`, msgID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete message"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Message deleted successfully",
	})
}

// POST /api/help/rooms/:id/resolve
func (h *HelpHandler) ResolveRoom(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, _, err := userFromToken(token)
	if err != nil || uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	roomID := c.Param("id")
	var creatorUID string
	err = h.DB.QueryRow(`SELECT creator_uid FROM help_rooms WHERE id = ?`, roomID).Scan(&creatorUID)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	if uid != creatorUID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the creator can mark this room as resolved"})
		return
	}

	_, _ = h.DB.Exec(`UPDATE help_rooms SET status = 'RESOLVED', updated_at = ? WHERE id = ?`, time.Now(), roomID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Help request marked as resolved",
	})
}

// POST /api/help/reports
func (h *HelpHandler) SubmitReport(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, _, err := userFromToken(token)
	if err != nil || uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	if !h.checkRepRateLimit(uid) {
		c.JSON(http.StatusTooManyRequests, gin.H{
			"error":   "RATE_LIMIT_EXCEEDED",
			"message": "Too many reports submitted. Please wait before reporting again.",
		})
		return
	}

	var req struct {
		TargetType string `json:"target_type" binding:"required"` // ROOM or MESSAGE
		TargetID   string `json:"target_id" binding:"required"`
		Reason     string `json:"reason" binding:"required"`
		Details    string `json:"details"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Target type, ID and reason are required"})
		return
	}

	reason := strings.TrimSpace(req.Reason)
	details := strings.TrimSpace(req.Details)
	targetType := strings.ToUpper(strings.TrimSpace(req.TargetType))
	targetID := strings.TrimSpace(req.TargetID)

	_, err = h.DB.Exec(`INSERT INTO help_reports (reporter_uid, target_type, target_id, reason, details, status, created_at) VALUES (?, ?, ?, ?, ?, 'PENDING', ?)`,
		uid, targetType, targetID, reason, details, time.Now())
	if err != nil {
		log.Printf("Failed to insert report: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to submit report"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Report submitted successfully to moderators.",
	})
}

// POST /api/help/block
func (h *HelpHandler) BlockAnonUser(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, _, err := userFromToken(token)
	if err != nil || uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var req struct {
		RoomID    string `json:"room_id" binding:"required"`
		AnonLabel string `json:"target_anon_label" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "room_id and target_anon_label are required"})
		return
	}

	roomID := strings.TrimSpace(req.RoomID)
	targetLabel := strings.TrimSpace(req.AnonLabel)

	// Resolve real user_uid of target from participants or room creator
	var targetUID string
	if targetLabel == "Anonymous Student" {
		_ = h.DB.QueryRow(`SELECT creator_uid FROM help_rooms WHERE id = ?`, roomID).Scan(&targetUID)
	} else {
		_ = h.DB.QueryRow(`SELECT user_uid FROM help_participants WHERE room_id = ? AND anon_label = ?`, roomID, targetLabel).Scan(&targetUID)
	}

	if targetUID == "" || targetUID == uid {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Could not identify user to block"})
		return
	}

	_, err = h.DB.Exec(`INSERT INTO help_blocks (blocker_uid, blocked_uid, room_id, created_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE created_at = VALUES(created_at)`, uid, targetUID, roomID, time.Now())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to block user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User blocked successfully for BIT Help interactions.",
	})
}

// GET /api/help/my
func (h *HelpHandler) GetMyHelpData(c *gin.Context) {
	token := ExtractAuthToken(c)
	uid, _, err := userFromToken(token)
	if err != nil || uid == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// My Created Rooms
	rows, err := h.DB.Query(`SELECT id, title, content, category, status, views_count, responses_count, created_at FROM help_rooms WHERE creator_uid = ? ORDER BY created_at DESC`, uid)
	myRooms := []models.StudentHelpRoomDTO{}
	if err == nil {
		for rows.Next() {
			var r models.HelpRoom
			if err := rows.Scan(&r.ID, &r.Title, &r.Content, &r.Category, &r.Status, &r.ViewsCount, &r.ResponsesCount, &r.CreatedAt); err == nil {
				myRooms = append(myRooms, models.StudentHelpRoomDTO{
					ID:             r.ID,
					Title:          r.Title,
					Content:        r.Content,
					Category:       r.Category,
					Status:         r.Status,
					ViewsCount:     r.ViewsCount,
					ResponsesCount: r.ResponsesCount,
					AnonLabel:      "Anonymous Student",
					CreatedAt:      r.CreatedAt,
					IsMine:         true,
				})
			}
		}
		rows.Close()
	}

	// Rooms where I participated
	rowsP, err := h.DB.Query(`
		SELECT r.id, r.title, r.content, r.category, r.status, r.views_count, r.responses_count, p.anon_label, r.created_at 
		FROM help_participants p 
		JOIN help_rooms r ON p.room_id = r.id 
		WHERE p.user_uid = ? AND r.creator_uid != ? 
		ORDER BY r.updated_at DESC
	`, uid, uid)
	myParticipations := []models.StudentHelpRoomDTO{}
	if err == nil {
		for rowsP.Next() {
			var r models.HelpRoom
			var anonLabel string
			if err := rowsP.Scan(&r.ID, &r.Title, &r.Content, &r.Category, &r.Status, &r.ViewsCount, &r.ResponsesCount, &anonLabel, &r.CreatedAt); err == nil {
				myParticipations = append(myParticipations, models.StudentHelpRoomDTO{
					ID:             r.ID,
					Title:          r.Title,
					Content:        r.Content,
					Category:       r.Category,
					Status:         r.Status,
					ViewsCount:     r.ViewsCount,
					ResponsesCount: r.ResponsesCount,
					AnonLabel:      anonLabel,
					CreatedAt:      r.CreatedAt,
					IsMine:         false,
				})
			}
		}
		rowsP.Close()
	}

	c.JSON(http.StatusOK, gin.H{
		"success":        true,
		"created_rooms":  myRooms,
		"participations": myParticipations,
	})
}

// --- ADMIN HANDLERS (REQUIRES ADMIN PRIVILEGES) ---

// GET /api/admin/help/stats
func (h *HelpHandler) AdminGetStats(c *gin.Context) {
	stats := models.HelpStatsDTO{}
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM help_rooms`).Scan(&stats.TotalRequests)
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM help_rooms WHERE status = 'OPEN'`).Scan(&stats.ActiveRequests)
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM help_messages`).Scan(&stats.TotalMessages)
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM help_reports WHERE status = 'PENDING'`).Scan(&stats.PendingReports)
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM help_user_restrictions WHERE status IN ('BLOCKED', 'TEMPORARY_BLOCK')`).Scan(&stats.RestrictedUsers)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    stats,
	})
}

// GET /api/admin/help/rooms
func (h *HelpHandler) AdminGetRooms(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, creator_uid, creator_anon_label, title, content, category, status, views_count, responses_count, created_at FROM help_rooms ORDER BY created_at DESC LIMIT 50`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch admin rooms"})
		return
	}
	defer rows.Close()

	rooms := []models.AdminHelpRoomDTO{}
	for rows.Next() {
		var r models.HelpRoom
		if err := rows.Scan(&r.ID, &r.CreatorUID, &r.CreatorAnonLabel, &r.Title, &r.Content, &r.Category, &r.Status, &r.ViewsCount, &r.ResponsesCount, &r.CreatedAt); err != nil {
			continue
		}
		creator := h.loadUserIdentity(r.CreatorUID)
		dto := models.AdminHelpRoomDTO{
			ID:             r.ID,
			Title:          r.Title,
			Content:        r.Content,
			Category:       r.Category,
			Status:         r.Status,
			ViewsCount:     r.ViewsCount,
			ResponsesCount: r.ResponsesCount,
			AnonLabel:      r.CreatorAnonLabel,
			CreatedAt:      r.CreatedAt,
			Creator:        creator,
		}
		rooms = append(rooms, dto)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    rooms,
	})
}

// GET /api/admin/help/rooms/:id
func (h *HelpHandler) AdminGetRoomByID(c *gin.Context) {
	roomID := c.Param("id")

	var r models.HelpRoom
	err := h.DB.QueryRow(`SELECT id, creator_uid, creator_anon_label, title, content, category, status, views_count, responses_count, created_at FROM help_rooms WHERE id = ?`, roomID).Scan(
		&r.ID, &r.CreatorUID, &r.CreatorAnonLabel, &r.Title, &r.Content, &r.Category, &r.Status, &r.ViewsCount, &r.ResponsesCount, &r.CreatedAt,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Room not found"})
		return
	}

	creator := h.loadUserIdentity(r.CreatorUID)

	// Fetch Messages
	rowsM, err := h.DB.Query(`SELECT id, room_id, sender_uid, anon_label, content, is_system, is_removed, created_at FROM help_messages WHERE room_id = ? ORDER BY created_at ASC`, roomID)
	messages := []models.AdminHelpMessageDTO{}
	if err == nil {
		for rowsM.Next() {
			var m models.HelpMessage
			if err := rowsM.Scan(&m.ID, &m.RoomID, &m.SenderUID, &m.AnonLabel, &m.Content, &m.IsSystem, &m.IsRemoved, &m.CreatedAt); err == nil {
				sender := h.loadUserIdentity(m.SenderUID)
				messages = append(messages, models.AdminHelpMessageDTO{
					ID:        m.ID,
					RoomID:    m.RoomID,
					AnonLabel: m.AnonLabel,
					Content:   m.Content,
					IsSystem:  m.IsSystem,
					IsRemoved: m.IsRemoved,
					CreatedAt: m.CreatedAt,
					Sender:    sender,
				})
			}
		}
		rowsM.Close()
	}

	// Fetch Reports for this room
	rowsRep, err := h.DB.Query(`SELECT id, reporter_uid, target_type, target_id, reason, details, status, created_at FROM help_reports WHERE target_id = ? OR target_id IN (SELECT id FROM help_messages WHERE room_id = ?)`, roomID, roomID)
	reports := []models.AdminHelpReportDTO{}
	if err == nil {
		for rowsRep.Next() {
			var rep models.HelpReport
			if err := rowsRep.Scan(&rep.ID, &rep.ReporterUID, &rep.TargetType, &rep.TargetID, &rep.Reason, &rep.Details, &rep.Status, &rep.CreatedAt); err == nil {
				reporter := h.loadUserIdentity(rep.ReporterUID)
				reports = append(reports, models.AdminHelpReportDTO{
					ID:         rep.ID,
					Reporter:   reporter,
					TargetType: rep.TargetType,
					TargetID:   rep.TargetID,
					Reason:     rep.Reason,
					Details:    rep.Details,
					Status:     rep.Status,
					CreatedAt:  rep.CreatedAt,
				})
			}
		}
		rowsRep.Close()
	}

	dto := models.AdminHelpRoomDTO{
		ID:             r.ID,
		Title:          r.Title,
		Content:        r.Content,
		Category:       r.Category,
		Status:         r.Status,
		ViewsCount:     r.ViewsCount,
		ResponsesCount: r.ResponsesCount,
		AnonLabel:      r.CreatorAnonLabel,
		CreatedAt:      r.CreatedAt,
		Creator:        creator,
		Messages:       messages,
		Reports:        reports,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    dto,
	})
}

// DELETE /api/admin/help/messages/:id
func (h *HelpHandler) AdminDeleteMessage(c *gin.Context) {
	msgID := c.Param("id")
	_, err := h.DB.Exec(`UPDATE help_messages SET is_removed = 1 WHERE id = ?`, msgID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove message"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Message removed by administrator"})
}

// POST /api/admin/help/rooms/:id/close
func (h *HelpHandler) AdminCloseRoom(c *gin.Context) {
	roomID := c.Param("id")
	_, err := h.DB.Exec(`UPDATE help_rooms SET status = 'CLOSED', updated_at = ? WHERE id = ?`, time.Now(), roomID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to close room"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Room closed by administrator"})
}

// GET /api/admin/help/reports
func (h *HelpHandler) AdminGetReports(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, reporter_uid, target_type, target_id, reason, details, status, created_at FROM help_reports ORDER BY created_at DESC LIMIT 100`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reports"})
		return
	}
	defer rows.Close()

	reports := []models.AdminHelpReportDTO{}
	for rows.Next() {
		var rep models.HelpReport
		if err := rows.Scan(&rep.ID, &rep.ReporterUID, &rep.TargetType, &rep.TargetID, &rep.Reason, &rep.Details, &rep.Status, &rep.CreatedAt); err == nil {
			reporter := h.loadUserIdentity(rep.ReporterUID)

			snippet := ""
			if rep.TargetType == "MESSAGE" {
				_ = h.DB.QueryRow(`SELECT content FROM help_messages WHERE id = ?`, rep.TargetID).Scan(&snippet)
			} else if rep.TargetType == "ROOM" {
				_ = h.DB.QueryRow(`SELECT title FROM help_rooms WHERE id = ?`, rep.TargetID).Scan(&snippet)
			}

			reports = append(reports, models.AdminHelpReportDTO{
				ID:         rep.ID,
				Reporter:   reporter,
				TargetType: rep.TargetType,
				TargetID:   rep.TargetID,
				Reason:     rep.Reason,
				Details:    rep.Details,
				Status:     rep.Status,
				CreatedAt:  rep.CreatedAt,
				Snippet:    snippet,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    reports,
	})
}

// POST /api/admin/help/reports/:id/action
func (h *HelpHandler) AdminActionReport(c *gin.Context) {
	reportID := c.Param("id")
	var req struct {
		Action string `json:"action" binding:"required"` // DISMISSED or ACTIONED
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Action is required"})
		return
	}

	action := strings.ToUpper(strings.TrimSpace(req.Action))
	if action != "DISMISSED" && action != "ACTIONED" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid action status"})
		return
	}

	_, err := h.DB.Exec(`UPDATE help_reports SET status = ? WHERE id = ?`, action, reportID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update report status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Report status updated"})
}

// GET /api/admin/help/restrictions
func (h *HelpHandler) AdminGetRestrictions(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, user_uid, status, COALESCE(reason, ''), created_by, created_at, expires_at FROM help_user_restrictions ORDER BY created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch restrictions"})
		return
	}
	defer rows.Close()

	list := []models.AdminHelpRestrictionDTO{}
	for rows.Next() {
		var r models.HelpUserRestriction
		var expiresAt sql.NullTime
		if err := rows.Scan(&r.ID, &r.UserUID, &r.Status, &r.Reason, &r.CreatedBy, &r.CreatedAt, &expiresAt); err == nil {
			user := h.loadUserIdentity(r.UserUID)
			dto := models.AdminHelpRestrictionDTO{
				ID:        r.ID,
				User:      user,
				Status:    r.Status,
				Reason:    r.Reason,
				CreatedBy: r.CreatedBy,
				CreatedAt: r.CreatedAt,
			}
			if expiresAt.Valid {
				dto.ExpiresAt = &expiresAt.Time
			}
			list = append(list, dto)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    list,
	})
}

// POST /api/admin/help/restrictions
func (h *HelpHandler) AdminManageRestriction(c *gin.Context) {
	token := ExtractAuthToken(c)
	adminUID, _, _ := userFromToken(token)

	var req struct {
		TargetUID string `json:"target_uid" binding:"required"`
		Status    string `json:"status" binding:"required"` // ACTIVE (unban), BLOCKED, TEMPORARY_BLOCK
		Reason    string `json:"reason"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "target_uid and status are required"})
		return
	}

	status := strings.ToUpper(strings.TrimSpace(req.Status))
	targetUID := strings.TrimSpace(req.TargetUID)
	reason := strings.TrimSpace(req.Reason)

	_, err := h.DB.Exec(`INSERT INTO help_user_restrictions (user_uid, status, reason, created_by, created_at) VALUES (?, ?, ?, ?, ?)`,
		targetUID, status, reason, adminUID, time.Now())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save restriction"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Help restriction updated successfully",
	})
}

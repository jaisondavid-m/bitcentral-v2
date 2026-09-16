package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"server/config"
	"server/models"
	"server/services"
)

type LostFoundHandler struct {
	DB        *sql.DB
	UploadDir string
}

func NewLostFoundHandler() *LostFoundHandler {
	return &LostFoundHandler{
		DB:        config.DB,
		UploadDir: "uploads/lost_found",
	}
}

// Helper to extract UID and email from auth header
func (h *LostFoundHandler) getAuthUser(c *gin.Context) (uid, email string) {
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

// Helper to check if caller is an admin
func (h *LostFoundHandler) isAdmin(uid, email string) bool {
	if h.DB == nil || uid == "" {
		return false
	}
	var exists int
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM admins WHERE uid = ?", uid).Scan(&exists)
	if exists > 0 {
		return true
	}
	var role string
	_ = h.DB.QueryRow("SELECT role FROM users WHERE uid = ? OR email = ?", uid, email).Scan(&role)
	role = strings.ToLower(strings.TrimSpace(role))
	return role == "admin" || role == "superadmin" || role == "super_admin"
}

// Helper to resolve full user & student profile
func (h *LostFoundHandler) resolveUserProfile(uid, email string) (name, emailOut, rollNo, dept, batch, phone string) {
	emailOut = email
	if h.DB == nil {
		return "Student", email, "", "", "", ""
	}

	// 1. Try tracker_users table
	queryTracker := `
		SELECT 
			COALESCE(name, '') AS name,
			COALESCE(email, '') AS email,
			COALESCE(id, '') AS roll_no,
			COALESCE(department, '') AS department,
			COALESCE(batch, '') AS batch,
			COALESCE(phone, '') AS phone
		FROM tracker_users
		WHERE email = ? OR user_id = ? OR id = ?
		LIMIT 1
	`
	_ = h.DB.QueryRow(queryTracker, email, uid, uid).Scan(&name, &emailOut, &rollNo, &dept, &batch, &phone)

	// 2. Fallback to users table if name is missing
	if name == "" || emailOut == "" {
		var uName, uEmail, uPhone string
		queryUser := `SELECT COALESCE(display_name, ''), COALESCE(email, ''), COALESCE(phone, '') FROM users WHERE uid = ? OR google_id = ? LIMIT 1`
		if err := h.DB.QueryRow(queryUser, uid, uid).Scan(&uName, &uEmail, &uPhone); err == nil {
			if name == "" && uName != "" {
				name = uName
			}
			if emailOut == "" && uEmail != "" {
				emailOut = uEmail
			}
			if phone == "" && uPhone != "" {
				phone = uPhone
			}
		}
	}

	if name == "" {
		if parts := strings.Split(emailOut, "@"); len(parts) > 0 {
			name = strings.Title(strings.ReplaceAll(parts[0], ".", " "))
		} else {
			name = "Student"
		}
	}

	return name, emailOut, rollNo, dept, batch, phone
}

// GET /api/lost-found - List items with filter & search
func (h *LostFoundHandler) GetItems(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": []models.LostFoundItem{}, "total": 0})
		return
	}

	userUID, _ := h.getAuthUser(c)

	itemType := strings.ToLower(strings.TrimSpace(c.Query("type")))
	category := strings.ToLower(strings.TrimSpace(c.Query("category")))
	location := strings.TrimSpace(c.Query("location"))
	status := strings.ToLower(strings.TrimSpace(c.Query("status")))
	search := strings.TrimSpace(c.Query("q"))
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 20
	}
	offset := (page - 1) * limit

	var conditions []string
	var args []interface{}

	if itemType != "" && itemType != "all" {
		conditions = append(conditions, "item_type = ?")
		args = append(args, itemType)
	}

	if category != "" && category != "all" {
		conditions = append(conditions, "category = ?")
		args = append(args, category)
	}

	if location != "" && location != "all" {
		conditions = append(conditions, "location_campus = ?")
		args = append(args, location)
	}

	if status != "" && status != "all" {
		conditions = append(conditions, "status = ?")
		args = append(args, status)
	}

	if search != "" {
		searchPattern := "%" + search + "%"
		conditions = append(conditions, "(title LIKE ? OR description LIKE ? OR location_details LIKE ? OR location_campus LIKE ? OR matched_roll_number LIKE ?)")
		args = append(args, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern)
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	// Count total
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM lost_found_items %s", whereClause)
	var total int
	_ = h.DB.QueryRow(countQuery, args...).Scan(&total)

	// Fetch items
	selectQuery := fmt.Sprintf(`
		SELECT 
			id,
			item_type,
			title,
			category,
			description,
			location_campus,
			COALESCE(location_details, '') AS location_details,
			date_occurred,
			COALESCE(time_occurred, '') AS time_occurred,
			images,
			COALESCE(matched_roll_number, '') AS matched_roll_number,
			current_custody,
			COALESCE(custody_details, '') AS custody_details,
			COALESCE(secret_question, '') AS secret_question,
			COALESCE(contact_phone, '') AS contact_phone,
			show_phone,
			allow_inapp_claim,
			user_uid,
			user_name,
			user_email,
			COALESCE(user_roll_no, '') AS user_roll_no,
			COALESCE(user_department, '') AS user_department,
			COALESCE(user_batch, '') AS user_batch,
			status,
			latitude,
			longitude,
			is_pinned,
			is_flagged,
			COALESCE(resolved_at, '') AS resolved_at,
			created_at,
			updated_at,
			(SELECT COUNT(*) FROM lost_found_claims WHERE item_id = lost_found_items.id) AS claim_count
		FROM lost_found_items
		%s
		ORDER BY is_pinned DESC, created_at DESC
		LIMIT ? OFFSET ?
	`, whereClause)

	queryArgs := append(args, limit, offset)
	rows, err := h.DB.Query(selectQuery, queryArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch items: " + err.Error()})
		return
	}
	defer rows.Close()

	items := make([]*models.LostFoundItem, 0)
	for rows.Next() {
		item := &models.LostFoundItem{}
		var imagesRaw string
		var resolvedAt sql.NullString
		var updatedAt sql.NullString
		var lat, lng sql.NullFloat64

		err := rows.Scan(
			&item.ID,
			&item.ItemType,
			&item.Title,
			&item.Category,
			&item.Description,
			&item.LocationCampus,
			&item.LocationDetails,
			&item.DateOccurred,
			&item.TimeOccurred,
			&imagesRaw,
			&item.MatchedRollNumber,
			&item.CurrentCustody,
			&item.CustodyDetails,
			&item.SecretQuestion,
			&item.ContactPhone,
			&item.ShowPhone,
			&item.AllowInAppClaim,
			&item.UserUID,
			&item.UserName,
			&item.UserEmail,
			&item.UserRollNo,
			&item.UserDepartment,
			&item.UserBatch,
			&item.Status,
			&lat,
			&lng,
			&item.IsPinned,
			&item.IsFlagged,
			&resolvedAt,
			&item.CreatedAt,
			&updatedAt,
			&item.ClaimCount,
		)
		if err != nil {
			continue
		}

		if lat.Valid {
			item.Latitude = &lat.Float64
		}
		if lng.Valid {
			item.Longitude = &lng.Float64
		}

		if resolvedAt.Valid {
			item.ResolvedAt = resolvedAt.String
		}
		if updatedAt.Valid {
			item.UpdatedAt = updatedAt.String
		}

		// Parse images JSON
		item.Images = []string{}
		if imagesRaw != "" {
			_ = json.Unmarshal([]byte(imagesRaw), &item.Images)
		}

		// Mask phone if show_phone is false and viewer is not owner
		if !item.ShowPhone && userUID != item.UserUID {
			item.ContactPhone = ""
		}

		item.IsMyItem = (userUID != "" && userUID == item.UserUID)
		items = append(items, item)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    items,
		"total":   total,
		"page":    page,
		"limit":   limit,
	})
}

// GET /api/lost-found/:id - Get single item with claims (if authorized)
func (h *LostFoundHandler) GetItemByID(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Item not found"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid item ID"})
		return
	}

	userUID, userEmail := h.getAuthUser(c)
	isAdmin := h.isAdmin(userUID, userEmail)

	query := `
		SELECT 
			id,
			item_type,
			title,
			category,
			description,
			location_campus,
			COALESCE(location_details, '') AS location_details,
			date_occurred,
			COALESCE(time_occurred, '') AS time_occurred,
			images,
			COALESCE(matched_roll_number, '') AS matched_roll_number,
			current_custody,
			COALESCE(custody_details, '') AS custody_details,
			COALESCE(secret_question, '') AS secret_question,
			COALESCE(contact_phone, '') AS contact_phone,
			show_phone,
			allow_inapp_claim,
			user_uid,
			user_name,
			user_email,
			COALESCE(user_roll_no, '') AS user_roll_no,
			COALESCE(user_department, '') AS user_department,
			COALESCE(user_batch, '') AS user_batch,
			status,
			latitude,
			longitude,
			is_pinned,
			is_flagged,
			COALESCE(resolved_at, '') AS resolved_at,
			created_at,
			updated_at,
			(SELECT COUNT(*) FROM lost_found_claims WHERE item_id = lost_found_items.id) AS claim_count
		FROM lost_found_items
		WHERE id = ?
		LIMIT 1
	`

	item := &models.LostFoundItem{}
	var imagesRaw string
	var resolvedAt sql.NullString
	var updatedAt sql.NullString
	var lat, lng sql.NullFloat64

	err = h.DB.QueryRow(query, id).Scan(
		&item.ID,
		&item.ItemType,
		&item.Title,
		&item.Category,
		&item.Description,
		&item.LocationCampus,
		&item.LocationDetails,
		&item.DateOccurred,
		&item.TimeOccurred,
		&imagesRaw,
		&item.MatchedRollNumber,
		&item.CurrentCustody,
		&item.CustodyDetails,
		&item.SecretQuestion,
		&item.ContactPhone,
		&item.ShowPhone,
		&item.AllowInAppClaim,
		&item.UserUID,
		&item.UserName,
		&item.UserEmail,
		&item.UserRollNo,
		&item.UserDepartment,
		&item.UserBatch,
		&item.Status,
		&lat,
		&lng,
		&item.IsPinned,
		&item.IsFlagged,
		&resolvedAt,
		&item.CreatedAt,
		&updatedAt,
		&item.ClaimCount,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Item not found"})
		return
	}

	if lat.Valid {
		item.Latitude = &lat.Float64
	}
	if lng.Valid {
		item.Longitude = &lng.Float64
	}

	if resolvedAt.Valid {
		item.ResolvedAt = resolvedAt.String
	}
	if updatedAt.Valid {
		item.UpdatedAt = updatedAt.String
	}

	item.Images = []string{}
	if imagesRaw != "" {
		_ = json.Unmarshal([]byte(imagesRaw), &item.Images)
	}

	item.IsMyItem = (userUID != "" && userUID == item.UserUID)

	// Fetch claims if owner or admin
	if item.IsMyItem || isAdmin {
		claimsRows, err := h.DB.Query(`
			SELECT id, item_id, claimant_uid, claimant_name, claimant_email, COALESCE(claimant_roll_no, ''), COALESCE(claimant_phone, ''), proof_description, COALESCE(proof_image, ''), status, created_at
			FROM lost_found_claims
			WHERE item_id = ?
			ORDER BY created_at DESC
		`, item.ID)
		if err == nil {
			claims := make([]*models.LostFoundClaim, 0)
			for claimsRows.Next() {
				claim := &models.LostFoundClaim{}
				_ = claimsRows.Scan(
					&claim.ID,
					&claim.ItemID,
					&claim.ClaimantUID,
					&claim.ClaimantName,
					&claim.ClaimantEmail,
					&claim.ClaimantRollNo,
					&claim.ClaimantPhone,
					&claim.ProofDescription,
					&claim.ProofImage,
					&claim.Status,
					&claim.CreatedAt,
				)
				claims = append(claims, claim)
			}
			claimsRows.Close()
			item.Claims = claims
		}
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": item})
}

// POST /api/lost-found - Create new lost or found listing
func (h *LostFoundHandler) CreateItem(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not available"})
		return
	}

	userUID, userEmail := h.getAuthUser(c)
	if userUID == "" && userEmail == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authentication required to post items"})
		return
	}

	var req models.LostFoundItem
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body: " + err.Error()})
		return
	}

	// Validation
	req.Title = strings.TrimSpace(req.Title)
	if req.Title == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Title is required"})
		return
	}

	req.ItemType = strings.ToLower(strings.TrimSpace(req.ItemType))
	if req.ItemType != "lost" && req.ItemType != "found" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Item type must be 'lost' or 'found'"})
		return
	}

	req.Category = strings.ToLower(strings.TrimSpace(req.Category))
	if req.Category == "" {
		req.Category = "others"
	}

	req.LocationCampus = strings.TrimSpace(req.LocationCampus)
	if req.LocationCampus == "" {
		req.LocationCampus = "Campus Premises"
	}

	if req.DateOccurred == "" {
		req.DateOccurred = time.Now().Format("2006-01-02")
	}

	if req.CurrentCustody == "" {
		req.CurrentCustody = "with_finder"
	}

	// Resolve user profile info
	userName, userEmailOut, userRollNo, userDept, userBatch, userPhone := h.resolveUserProfile(userUID, userEmail)
	if req.ContactPhone == "" {
		req.ContactPhone = userPhone
	}

	// Convert images to JSON
	if req.Images == nil {
		req.Images = []string{}
	}
	imagesBytes, _ := json.Marshal(req.Images)

	query := `
		INSERT INTO lost_found_items (
			item_type,
			title,
			category,
			description,
			location_campus,
			location_details,
			date_occurred,
			time_occurred,
			images,
			matched_roll_number,
			current_custody,
			custody_details,
			secret_question,
			contact_phone,
			show_phone,
			allow_inapp_claim,
			user_uid,
			user_name,
			user_email,
			user_roll_no,
			user_department,
			user_batch,
			latitude,
			longitude,
			status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
	`

	res, err := h.DB.Exec(
		query,
		req.ItemType,
		req.Title,
		req.Category,
		req.Description,
		req.LocationCampus,
		req.LocationDetails,
		req.DateOccurred,
		req.TimeOccurred,
		string(imagesBytes),
		req.MatchedRollNumber,
		req.CurrentCustody,
		req.CustodyDetails,
		req.SecretQuestion,
		req.ContactPhone,
		req.ShowPhone,
		req.AllowInAppClaim,
		userUID,
		userName,
		userEmailOut,
		userRollNo,
		userDept,
		userBatch,
		req.Latitude,
		req.Longitude,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create item: " + err.Error()})
		return
	}

	newID, _ := res.LastInsertId()

	// AUTOMATION: If this is a found ID card with a Roll Number, trigger automated notification to that student
	if req.ItemType == "found" && req.MatchedRollNumber != "" {
		matchedRoll := strings.TrimSpace(strings.ToUpper(req.MatchedRollNumber))
		go h.triggerIDCardAutoNotification(int(newID), matchedRoll, req.Title, req.LocationCampus)
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Item posted successfully",
		"id":      newID,
	})
}

// Background auto-notifier when a student ID card is found
func (h *LostFoundHandler) triggerIDCardAutoNotification(itemID int, rollNo, title, location string) {
	if h.DB == nil || rollNo == "" {
		return
	}

	var targetUID, targetEmail string
	_ = h.DB.QueryRow(`
		SELECT COALESCE(user_id, ''), COALESCE(email, '')
		FROM tracker_users
		WHERE id = ? OR email LIKE ?
		LIMIT 1
	`, rollNo, "%"+rollNo+"%").Scan(&targetUID, &targetEmail)

	notifTitle := fmt.Sprintf("ID Card Found (%s)", rollNo)
	notifMsg := fmt.Sprintf("A student ID card matching Roll No %s was found at %s. Click to view and recover your item.", rollNo, location)
	linkURL := fmt.Sprintf("/lost-found?id=%d", itemID)

	_, _ = h.DB.Exec(`
		INSERT INTO notifications (
			title, message, type, priority, target_type, target_user_uid, target_email, target_roll_no, link_url, link_text, created_by
		) VALUES (?, ?, 'alert', 'high', 'user', ?, ?, ?, ?, 'View Lost & Found', 'system')
	`, notifTitle, notifMsg, targetUID, targetEmail, rollNo, linkURL)
}

// PUT /api/lost-found/:id - Update item
func (h *LostFoundHandler) UpdateItem(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not available"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid item ID"})
		return
	}

	userUID, userEmail := h.getAuthUser(c)
	isAdmin := h.isAdmin(userUID, userEmail)

	var ownerUID string
	err = h.DB.QueryRow("SELECT user_uid FROM lost_found_items WHERE id = ?", id).Scan(&ownerUID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Item not found"})
		return
	}

	if !isAdmin && ownerUID != userUID {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "You can only edit your own listings"})
		return
	}

	var req models.LostFoundItem
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid payload: " + err.Error()})
		return
	}

	if req.Images == nil {
		req.Images = []string{}
	}
	imagesBytes, _ := json.Marshal(req.Images)

	query := `
		UPDATE lost_found_items SET
			title = ?,
			category = ?,
			description = ?,
			location_campus = ?,
			location_details = ?,
			date_occurred = ?,
			time_occurred = ?,
			images = ?,
			matched_roll_number = ?,
			current_custody = ?,
			custody_details = ?,
			secret_question = ?,
			contact_phone = ?,
			show_phone = ?,
			allow_inapp_claim = ?,
			latitude = ?,
			longitude = ?
		WHERE id = ?
	`

	_, err = h.DB.Exec(
		query,
		req.Title,
		req.Category,
		req.Description,
		req.LocationCampus,
		req.LocationDetails,
		req.DateOccurred,
		req.TimeOccurred,
		string(imagesBytes),
		req.MatchedRollNumber,
		req.CurrentCustody,
		req.CustodyDetails,
		req.SecretQuestion,
		req.ContactPhone,
		req.ShowPhone,
		req.AllowInAppClaim,
		req.Latitude,
		req.Longitude,
		id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update item: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Item updated successfully"})
}

// POST /api/lost-found/:id/status - Update item status (active, claimed, handed_over, closed)
func (h *LostFoundHandler) UpdateItemStatus(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not available"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid item ID"})
		return
	}

	userUID, userEmail := h.getAuthUser(c)
	isAdmin := h.isAdmin(userUID, userEmail)

	var ownerUID string
	err = h.DB.QueryRow("SELECT user_uid FROM lost_found_items WHERE id = ?", id).Scan(&ownerUID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Item not found"})
		return
	}

	if !isAdmin && ownerUID != userUID {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "You can only update status for your own listings"})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Status is required"})
		return
	}

	req.Status = strings.ToLower(strings.TrimSpace(req.Status))
	if req.Status != "active" && req.Status != "claimed" && req.Status != "handed_over" && req.Status != "closed" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid status value"})
		return
	}

	var resolvedAt *time.Time
	if req.Status != "active" {
		now := time.Now()
		resolvedAt = &now
	}

	_, err = h.DB.Exec("UPDATE lost_found_items SET status = ?, resolved_at = ? WHERE id = ?", req.Status, resolvedAt, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update status: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Status updated successfully", "status": req.Status})
}

// DELETE /api/lost-found/:id - Delete item
func (h *LostFoundHandler) DeleteItem(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not available"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid item ID"})
		return
	}

	userUID, userEmail := h.getAuthUser(c)
	isAdmin := h.isAdmin(userUID, userEmail)

	var ownerUID string
	err = h.DB.QueryRow("SELECT user_uid FROM lost_found_items WHERE id = ?", id).Scan(&ownerUID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Item not found"})
		return
	}

	if !isAdmin && ownerUID != userUID {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "You can only delete your own listings"})
		return
	}

	_, _ = h.DB.Exec("DELETE FROM lost_found_claims WHERE item_id = ?", id)
	_, err = h.DB.Exec("DELETE FROM lost_found_items WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete item: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Item deleted successfully"})
}

// POST /api/lost-found/upload - Upload item image (Cloudinary with local fallback)
func (h *LostFoundHandler) UploadImage(c *gin.Context) {
	userUID, userEmail := h.getAuthUser(c)
	if userUID == "" && userEmail == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authentication required to upload photos"})
		return
	}

	file, err := c.FormFile("image")
	if err != nil {
		file, err = c.FormFile("file")
	}
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Image file is required (field 'image' or 'file')"})
		return
	}

	// 5MB limit
	if file.Size > 5*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Image size exceeds 5MB limit"})
		return
	}

	// Validate extension
	ext := strings.ToLower(filepath.Ext(file.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".webp" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Only JPG, PNG, and WebP images are allowed"})
		return
	}

	// 1. Primary: Upload directly to Cloudinary
	cloudinaryURL, cldErr := services.UploadToCloudinary(file)
	if cldErr == nil && cloudinaryURL != "" {
		c.JSON(http.StatusOK, gin.H{
			"success":  true,
			"url":      cloudinaryURL,
			"provider": "cloudinary",
			"message":  "Image uploaded to Cloudinary successfully",
		})
		return
	}

	if cldErr != nil {
		fmt.Printf("[Cloudinary] Upload attempt notice: %v. Falling back to local storage.\n", cldErr)
	}

	// 2. Fallback: Save to local server uploads directory
	if err := os.MkdirAll(h.UploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create upload directory: " + err.Error()})
		return
	}

	safeName := fmt.Sprintf("%d_%s%s", time.Now().UnixNano(), "item", ext)
	dst := filepath.Join(h.UploadDir, safeName)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to save image: " + err.Error()})
		return
	}

	urlPath := "/uploads/lost_found/" + safeName
	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"url":      urlPath,
		"provider": "local",
		"message":  "Image uploaded successfully",
	})
}

// POST /api/lost-found/:id/claim - Submit a claim on an item
func (h *LostFoundHandler) SubmitClaim(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not available"})
		return
	}

	userUID, userEmail := h.getAuthUser(c)
	if userUID == "" && userEmail == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authentication required to submit claims"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid item ID"})
		return
	}

	var item models.LostFoundItem
	err = h.DB.QueryRow(`
		SELECT id, title, item_type, user_uid, user_name, user_email, allow_inapp_claim, status
		FROM lost_found_items
		WHERE id = ?
	`, id).Scan(
		&item.ID,
		&item.Title,
		&item.ItemType,
		&item.UserUID,
		&item.UserName,
		&item.UserEmail,
		&item.AllowInAppClaim,
		&item.Status,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Item not found"})
		return
	}

	if item.UserUID == userUID {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "You cannot claim your own listing"})
		return
	}

	if !item.AllowInAppClaim {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "In-app claims are disabled for this item. Please contact finder directly."})
		return
	}

	var req struct {
		ProofDescription string `json:"proof_description" binding:"required"`
		ProofImage       string `json:"proof_image"`
		ClaimantPhone    string `json:"claimant_phone"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Proof description is required"})
		return
	}

	name, emailOut, rollNo, _, _, phone := h.resolveUserProfile(userUID, userEmail)
	if req.ClaimantPhone == "" {
		req.ClaimantPhone = phone
	}

	query := `
		INSERT INTO lost_found_claims (
			item_id, claimant_uid, claimant_name, claimant_email, claimant_roll_no, claimant_phone, proof_description, proof_image, status
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
	`
	res, err := h.DB.Exec(query, id, userUID, name, emailOut, rollNo, req.ClaimantPhone, req.ProofDescription, req.ProofImage)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to submit claim: " + err.Error()})
		return
	}

	claimID, _ := res.LastInsertId()

	// Notify the item poster about this new claim
	go func() {
		notifTitle := fmt.Sprintf("New Claim: %s", item.Title)
		notifMsg := fmt.Sprintf("%s (%s) submitted a claim on your item '%s'.", name, rollNo, item.Title)
		linkURL := fmt.Sprintf("/lost-found?id=%d&tab=my", id)

		_, _ = h.DB.Exec(`
			INSERT INTO notifications (
				title, message, type, priority, target_type, target_user_uid, target_email, link_url, link_text, created_by
			) VALUES (?, ?, 'update', 'high', 'user', ?, ?, ?, 'Review Claim', 'system')
		`, notifTitle, notifMsg, item.UserUID, item.UserEmail, linkURL)
	}()

	c.JSON(http.StatusCreated, gin.H{
		"success":  true,
		"message":  "Claim submitted successfully. The finder has been notified.",
		"claim_id": claimID,
	})
}

// POST /api/lost-found/claims/:claimId/status - Approve or reject claim
func (h *LostFoundHandler) UpdateClaimStatus(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not available"})
		return
	}

	userUID, userEmail := h.getAuthUser(c)
	isAdmin := h.isAdmin(userUID, userEmail)

	claimIDStr := c.Param("claimId")
	claimID, err := strconv.Atoi(claimIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid claim ID"})
		return
	}

	var itemID int
	var ownerUID, claimantUID, claimantEmail, itemTitle string
	err = h.DB.QueryRow(`
		SELECT c.item_id, i.user_uid, c.claimant_uid, c.claimant_email, i.title
		FROM lost_found_claims c
		JOIN lost_found_items i ON c.item_id = i.id
		WHERE c.id = ?
	`, claimID).Scan(&itemID, &ownerUID, &claimantUID, &claimantEmail, &itemTitle)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Claim not found"})
		return
	}

	if !isAdmin && ownerUID != userUID {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Only the item poster or admin can review claims"})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required"` // 'approved' or 'rejected'
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Status is required"})
		return
	}

	req.Status = strings.ToLower(strings.TrimSpace(req.Status))
	if req.Status != "approved" && req.Status != "rejected" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Status must be 'approved' or 'rejected'"})
		return
	}

	_, err = h.DB.Exec("UPDATE lost_found_claims SET status = ? WHERE id = ?", req.Status, claimID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update claim status: " + err.Error()})
		return
	}

	// If approved, mark item as claimed
	if req.Status == "approved" {
		now := time.Now()
		_, _ = h.DB.Exec("UPDATE lost_found_items SET status = 'claimed', resolved_at = ? WHERE id = ?", now, itemID)
	}

	// Notify the claimant
	go func() {
		notifTitle := fmt.Sprintf("Claim Update: %s", itemTitle)
		notifMsg := fmt.Sprintf("Your claim on '%s' has been %s by the finder.", itemTitle, req.Status)
		linkURL := fmt.Sprintf("/lost-found?id=%d", itemID)

		_, _ = h.DB.Exec(`
			INSERT INTO notifications (
				title, message, type, priority, target_type, target_user_uid, target_email, link_url, link_text, created_by
			) VALUES (?, ?, 'announcement', 'normal', 'user', ?, ?, ?, 'View Lost & Found', 'system')
		`, notifTitle, notifMsg, claimantUID, claimantEmail, linkURL)
	}()

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Claim updated to " + req.Status})
}

// GET /api/lost-found/my - Get items and claims for the authenticated student
func (h *LostFoundHandler) GetMyItemsAndClaims(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "my_items": []models.LostFoundItem{}, "my_claims": []models.LostFoundClaim{}})
		return
	}

	userUID, _ := h.getAuthUser(c)
	if userUID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authentication required"})
		return
	}

	// 1. My Items
	itemRows, err := h.DB.Query(`
		SELECT 
			id, item_type, title, category, description, location_campus, COALESCE(location_details, ''),
			date_occurred, COALESCE(time_occurred, ''), images, COALESCE(matched_roll_number, ''),
			current_custody, COALESCE(custody_details, ''), COALESCE(secret_question, ''),
			COALESCE(contact_phone, ''), show_phone, allow_inapp_claim, user_uid, user_name, user_email,
			COALESCE(user_roll_no, ''), COALESCE(user_department, ''), COALESCE(user_batch, ''),
			status, latitude, longitude, is_pinned, is_flagged, COALESCE(resolved_at, ''), created_at, updated_at,
			(SELECT COUNT(*) FROM lost_found_claims WHERE item_id = lost_found_items.id) AS claim_count
		FROM lost_found_items
		WHERE user_uid = ?
		ORDER BY created_at DESC
	`, userUID)

	myItems := make([]*models.LostFoundItem, 0)
	if err == nil {
		for itemRows.Next() {
			item := &models.LostFoundItem{}
			var imagesRaw string
			var resolvedAt, updatedAt sql.NullString
			var lat, lng sql.NullFloat64
			_ = itemRows.Scan(
				&item.ID, &item.ItemType, &item.Title, &item.Category, &item.Description,
				&item.LocationCampus, &item.LocationDetails, &item.DateOccurred, &item.TimeOccurred,
				&imagesRaw, &item.MatchedRollNumber, &item.CurrentCustody, &item.CustodyDetails,
				&item.SecretQuestion, &item.ContactPhone, &item.ShowPhone, &item.AllowInAppClaim,
				&item.UserUID, &item.UserName, &item.UserEmail, &item.UserRollNo, &item.UserDepartment,
				&item.UserBatch, &item.Status, &lat, &lng, &item.IsPinned, &item.IsFlagged, &resolvedAt,
				&item.CreatedAt, &updatedAt, &item.ClaimCount,
			)
			if lat.Valid {
				item.Latitude = &lat.Float64
			}
			if lng.Valid {
				item.Longitude = &lng.Float64
			}
			if resolvedAt.Valid {
				item.ResolvedAt = resolvedAt.String
			}
			if updatedAt.Valid {
				item.UpdatedAt = updatedAt.String
			}
			item.Images = []string{}
			if imagesRaw != "" {
				_ = json.Unmarshal([]byte(imagesRaw), &item.Images)
			}
			item.IsMyItem = true
			myItems = append(myItems, item)
		}
		itemRows.Close()
	}

	// 2. My Claims
	claimRows, err := h.DB.Query(`
		SELECT 
			c.id, c.item_id, c.claimant_uid, c.claimant_name, c.claimant_email,
			COALESCE(c.claimant_roll_no, ''), COALESCE(c.claimant_phone, ''),
			c.proof_description, COALESCE(c.proof_image, ''), c.status, c.created_at,
			i.title, i.item_type
		FROM lost_found_claims c
		JOIN lost_found_items i ON c.item_id = i.id
		WHERE c.claimant_uid = ?
		ORDER BY c.created_at DESC
	`, userUID)

	myClaims := make([]*models.LostFoundClaim, 0)
	if err == nil {
		for claimRows.Next() {
			claim := &models.LostFoundClaim{}
			_ = claimRows.Scan(
				&claim.ID, &claim.ItemID, &claim.ClaimantUID, &claim.ClaimantName, &claim.ClaimantEmail,
				&claim.ClaimantRollNo, &claim.ClaimantPhone, &claim.ProofDescription, &claim.ProofImage,
				&claim.Status, &claim.CreatedAt, &claim.ItemTitle, &claim.ItemType,
			)
			myClaims = append(myClaims, claim)
		}
		claimRows.Close()
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"my_items":  myItems,
		"my_claims": myClaims,
	})
}

// GET /api/admin/lost-found - Admin listing with full statistics
func (h *LostFoundHandler) AdminGetItems(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": []models.LostFoundItem{}, "stats": models.LostFoundStats{}})
		return
	}

	// Compute stats
	var stats models.LostFoundStats
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM lost_found_items").Scan(&stats.TotalItems)
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM lost_found_items WHERE item_type = 'lost' AND status = 'active'").Scan(&stats.ActiveLost)
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM lost_found_items WHERE item_type = 'found' AND status = 'active'").Scan(&stats.ActiveFound)
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM lost_found_items WHERE status IN ('claimed', 'handed_over', 'closed')").Scan(&stats.ResolvedCount)
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM lost_found_claims").Scan(&stats.TotalClaims)

	// Delegate to standard GetItems for listing
	search := strings.TrimSpace(c.Query("q"))
	itemType := strings.ToLower(strings.TrimSpace(c.Query("type")))
	status := strings.ToLower(strings.TrimSpace(c.Query("status")))

	var conditions []string
	var args []interface{}

	if itemType != "" && itemType != "all" {
		conditions = append(conditions, "item_type = ?")
		args = append(args, itemType)
	}

	if status != "" && status != "all" {
		conditions = append(conditions, "status = ?")
		args = append(args, status)
	}

	if search != "" {
		searchPattern := "%" + search + "%"
		conditions = append(conditions, "(title LIKE ? OR description LIKE ? OR user_name LIKE ? OR user_email LIKE ? OR user_roll_no LIKE ? OR matched_roll_number LIKE ?)")
		args = append(args, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern)
	}

	whereClause := ""
	if len(conditions) > 0 {
		whereClause = "WHERE " + strings.Join(conditions, " AND ")
	}

	query := fmt.Sprintf(`
		SELECT 
			id, item_type, title, category, description, location_campus, COALESCE(location_details, ''),
			date_occurred, COALESCE(time_occurred, ''), images, COALESCE(matched_roll_number, ''),
			current_custody, COALESCE(custody_details, ''), COALESCE(secret_question, ''),
			COALESCE(contact_phone, ''), show_phone, allow_inapp_claim, user_uid, user_name, user_email,
			COALESCE(user_roll_no, ''), COALESCE(user_department, ''), COALESCE(user_batch, ''),
			status, latitude, longitude, is_pinned, is_flagged, COALESCE(resolved_at, ''), created_at, updated_at,
			(SELECT COUNT(*) FROM lost_found_claims WHERE item_id = lost_found_items.id) AS claim_count
		FROM lost_found_items
		%s
		ORDER BY is_pinned DESC, created_at DESC
		LIMIT 100
	`, whereClause)

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch admin items: " + err.Error()})
		return
	}
	defer rows.Close()

	items := make([]*models.LostFoundItem, 0)
	for rows.Next() {
		item := &models.LostFoundItem{}
		var imagesRaw string
		var resolvedAt, updatedAt sql.NullString
		var lat, lng sql.NullFloat64
		_ = rows.Scan(
			&item.ID, &item.ItemType, &item.Title, &item.Category, &item.Description,
			&item.LocationCampus, &item.LocationDetails, &item.DateOccurred, &item.TimeOccurred,
			&imagesRaw, &item.MatchedRollNumber, &item.CurrentCustody, &item.CustodyDetails,
			&item.SecretQuestion, &item.ContactPhone, &item.ShowPhone, &item.AllowInAppClaim,
			&item.UserUID, &item.UserName, &item.UserEmail, &item.UserRollNo, &item.UserDepartment,
			&item.UserBatch, &item.Status, &lat, &lng, &item.IsPinned, &item.IsFlagged, &resolvedAt,
			&item.CreatedAt, &updatedAt, &item.ClaimCount,
		)
		if lat.Valid {
			item.Latitude = &lat.Float64
		}
		if lng.Valid {
			item.Longitude = &lng.Float64
		}
		if resolvedAt.Valid {
			item.ResolvedAt = resolvedAt.String
		}
		if updatedAt.Valid {
			item.UpdatedAt = updatedAt.String
		}
		item.Images = []string{}
		if imagesRaw != "" {
			_ = json.Unmarshal([]byte(imagesRaw), &item.Images)
		}
		items = append(items, item)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    items,
		"stats":   stats,
	})
}

// POST /api/admin/lost-found/:id/pin - Toggle pin status
func (h *LostFoundHandler) AdminTogglePin(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not available"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid item ID"})
		return
	}

	_, err = h.DB.Exec("UPDATE lost_found_items SET is_pinned = NOT is_pinned WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to toggle pin: " + err.Error()})
		return
	}

	var isPinned bool
	_ = h.DB.QueryRow("SELECT is_pinned FROM lost_found_items WHERE id = ?", id).Scan(&isPinned)

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Pin status updated", "is_pinned": isPinned})
}

package handlers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"server/config"
	"server/data"
	"server/models"
)

type LeaveHandler struct{}

func NewLeaveHandler() *LeaveHandler {
	return &LeaveHandler{}
}

// GetAllLeaves retrieves all leaves/holidays from database, ordered by from_date ascending
func (h *LeaveHandler) GetAllLeaves(c *gin.Context) {
	if config.DB == nil {
		h.fallbackLeaves(c)
		return
	}

	query := `
		SELECT 
			id,
			name,
			DATE_FORMAT(from_date, '%Y-%m-%d') AS from_date,
			DATE_FORMAT(to_date, '%Y-%m-%d') AS to_date,
			COALESCE(day, '') AS day,
			COALESCE(from_half_day, '') AS from_half_day,
			COALESCE(to_half_day, '') AS to_half_day,
			COALESCE(leave_type, 'GP') AS leave_type,
			COALESCE(remarks, '') AS remarks,
			COALESCE(DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s'), '') AS created_at,
			COALESCE(DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s'), '') AS updated_at
		FROM college_leaves
		ORDER BY from_date ASC, id ASC
	`

	rows, err := config.DB.Query(query)
	if err != nil {
		// Fallback to hardcoded data if database table has issue
		h.fallbackLeaves(c)
		return
	}
	defer rows.Close()

	var leaves []models.Holiday
	for rows.Next() {
		var item models.Holiday
		var id int
		var fromDate, toDate, day, fromHalfDay, toHalfDay, leaveType, remarks, createdAt, updatedAt string

		if err := rows.Scan(
			&id,
			&item.Name,
			&fromDate,
			&toDate,
			&day,
			&fromHalfDay,
			&toHalfDay,
			&leaveType,
			&remarks,
			&createdAt,
			&updatedAt,
		); err != nil {
			continue
		}

		item.ID = id
		item.FromDate = fromDate
		item.ToDate = toDate
		item.Day = day
		item.FromHalfDay = fromHalfDay
		item.ToHalfDay = toHalfDay
		item.LeaveType = leaveType
		item.Remarks = remarks
		item.CreatedAt = createdAt
		item.UpdatedAt = updatedAt

		leaves = append(leaves, item)
	}

	if len(leaves) == 0 {
		h.fallbackLeaves(c)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"count":   len(leaves),
		"data":    leaves,
	})
}

// Fallback method when DB is not available
func (h *LeaveHandler) fallbackLeaves(c *gin.Context) {
	processedHolidays := make([]models.Holiday, len(data.Holidays))
	for i, hol := range data.Holidays {
		processedHolidays[i] = hol
		processedHolidays[i].ID = i + 1
		if strings.HasSuffix(hol.FromDate, "(AN)") {
			processedHolidays[i].FromDate = strings.TrimSuffix(hol.FromDate, "(AN)")
			processedHolidays[i].FromHalfDay = "AN"
		} else if strings.HasSuffix(hol.FromDate, "(FN)") {
			processedHolidays[i].FromDate = strings.TrimSuffix(hol.FromDate, "(FN)")
			processedHolidays[i].FromHalfDay = "FN"
		}

		if processedHolidays[i].Day == "" {
			if t, err := time.Parse("2006-01-02", processedHolidays[i].FromDate); err == nil {
				processedHolidays[i].Day = t.Weekday().String()
			}
		}

		if processedHolidays[i].LeaveType == "" {
			if strings.Contains(hol.Name, "GP") {
				processedHolidays[i].LeaveType = "GP"
			} else {
				processedHolidays[i].LeaveType = "Holiday"
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"count":   len(processedHolidays),
		"data":    processedHolidays,
	})
}

type LeaveRequest struct {
	Name        string `json:"name" binding:"required"`
	FromDate    string `json:"from_date" binding:"required"`
	ToDate      string `json:"to_date" binding:"required"`
	Day         string `json:"day"`
	FromHalfDay string `json:"from_half_day"`
	ToHalfDay   string `json:"to_half_day"`
	LeaveType   string `json:"leave_type"`
	Remarks     string `json:"remarks"`
}

// CreateLeave adds a new leave/holiday record (Admin only)
func (h *LeaveHandler) CreateLeave(c *gin.Context) {
	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	var req LeaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body: " + err.Error()})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.FromDate = strings.TrimSpace(req.FromDate)
	req.ToDate = strings.TrimSpace(req.ToDate)
	req.FromHalfDay = strings.ToUpper(strings.TrimSpace(req.FromHalfDay))
	req.ToHalfDay = strings.ToUpper(strings.TrimSpace(req.ToHalfDay))
	req.LeaveType = strings.TrimSpace(req.LeaveType)
	req.Remarks = strings.TrimSpace(req.Remarks)

	if req.Name == "" || req.FromDate == "" || req.ToDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Leave name, from date, and to date are required"})
		return
	}

	// Validate date formats
	fromT, err := time.Parse("2006-01-02", req.FromDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "from_date must be in YYYY-MM-DD format"})
		return
	}
	_, err = time.Parse("2006-01-02", req.ToDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "to_date must be in YYYY-MM-DD format"})
		return
	}

	if req.Day == "" {
		req.Day = fromT.Weekday().String()
	}

	if req.LeaveType == "" {
		if strings.Contains(strings.ToUpper(req.Name), "GP") {
			req.LeaveType = "GP"
		} else {
			req.LeaveType = "Holiday"
		}
	}

	// Normalize half day values
	if req.FromHalfDay != "FN" && req.FromHalfDay != "AN" {
		req.FromHalfDay = ""
	}
	if req.ToHalfDay != "FN" && req.ToHalfDay != "AN" {
		req.ToHalfDay = ""
	}

	query := `
		INSERT INTO college_leaves (name, from_date, to_date, day, from_half_day, to_half_day, leave_type, remarks)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`

	res, err := config.DB.Exec(query, req.Name, req.FromDate, req.ToDate, req.Day, req.FromHalfDay, req.ToHalfDay, req.LeaveType, req.Remarks)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": fmt.Sprintf("Failed to create leave: %v", err)})
		return
	}

	insertedID, _ := res.LastInsertId()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Leave schedule created successfully",
		"data": gin.H{
			"id":            insertedID,
			"name":          req.Name,
			"from_date":     req.FromDate,
			"to_date":       req.ToDate,
			"day":           req.Day,
			"from_half_day": req.FromHalfDay,
			"to_half_day":   req.ToHalfDay,
			"leave_type":    req.LeaveType,
			"remarks":       req.Remarks,
		},
	})
}

// UpdateLeave updates an existing leave/holiday (Admin only)
func (h *LeaveHandler) UpdateLeave(c *gin.Context) {
	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid leave ID"})
		return
	}

	var req LeaveRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body: " + err.Error()})
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.FromDate = strings.TrimSpace(req.FromDate)
	req.ToDate = strings.TrimSpace(req.ToDate)
	req.FromHalfDay = strings.ToUpper(strings.TrimSpace(req.FromHalfDay))
	req.ToHalfDay = strings.ToUpper(strings.TrimSpace(req.ToHalfDay))
	req.LeaveType = strings.TrimSpace(req.LeaveType)
	req.Remarks = strings.TrimSpace(req.Remarks)

	if req.Name == "" || req.FromDate == "" || req.ToDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Leave name, from date, and to date are required"})
		return
	}

	fromT, err := time.Parse("2006-01-02", req.FromDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "from_date must be in YYYY-MM-DD format"})
		return
	}
	_, err = time.Parse("2006-01-02", req.ToDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "to_date must be in YYYY-MM-DD format"})
		return
	}

	if req.Day == "" {
		req.Day = fromT.Weekday().String()
	}

	if req.FromHalfDay != "FN" && req.FromHalfDay != "AN" {
		req.FromHalfDay = ""
	}
	if req.ToHalfDay != "FN" && req.ToHalfDay != "AN" {
		req.ToHalfDay = ""
	}

	query := `
		UPDATE college_leaves
		SET name = ?, from_date = ?, to_date = ?, day = ?, from_half_day = ?, to_half_day = ?, leave_type = ?, remarks = ?
		WHERE id = ?
	`

	res, err := config.DB.Exec(query, req.Name, req.FromDate, req.ToDate, req.Day, req.FromHalfDay, req.ToHalfDay, req.LeaveType, req.Remarks, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": fmt.Sprintf("Failed to update leave: %v", err)})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		// Check if record exists
		var exists int
		_ = config.DB.QueryRow("SELECT COUNT(*) FROM college_leaves WHERE id = ?", id).Scan(&exists)
		if exists == 0 {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Leave record not found"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Leave updated successfully",
	})
}

// DeleteLeave removes a leave/holiday record (Admin only)
func (h *LeaveHandler) DeleteLeave(c *gin.Context) {
	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid leave ID"})
		return
	}

	query := `DELETE FROM college_leaves WHERE id = ?`
	res, err := config.DB.Exec(query, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": fmt.Sprintf("Failed to delete leave: %v", err)})
		return
	}

	rowsAffected, _ := res.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Leave record not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Leave deleted successfully",
	})
}

// BatchCreateLeaves adds multiple leave items at once (Admin only)
func (h *LeaveHandler) BatchCreateLeaves(c *gin.Context) {
	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	var batch []LeaveRequest
	if err := c.ShouldBindJSON(&batch); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid array of leaves: " + err.Error()})
		return
	}

	if len(batch) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No leave items provided"})
		return
	}

	stmt, err := config.DB.Prepare(`
		INSERT INTO college_leaves (name, from_date, to_date, day, from_half_day, to_half_day, leave_type, remarks)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to prepare insert: " + err.Error()})
		return
	}
	defer stmt.Close()

	insertedCount := 0
	for _, req := range batch {
		req.Name = strings.TrimSpace(req.Name)
		req.FromDate = strings.TrimSpace(req.FromDate)
		req.ToDate = strings.TrimSpace(req.ToDate)
		req.FromHalfDay = strings.ToUpper(strings.TrimSpace(req.FromHalfDay))
		req.ToHalfDay = strings.ToUpper(strings.TrimSpace(req.ToHalfDay))
		req.LeaveType = strings.TrimSpace(req.LeaveType)
		req.Remarks = strings.TrimSpace(req.Remarks)

		if req.Name == "" || req.FromDate == "" || req.ToDate == "" {
			continue
		}

		fromT, err := time.Parse("2006-01-02", req.FromDate)
		if err != nil {
			continue
		}

		if req.Day == "" {
			req.Day = fromT.Weekday().String()
		}

		if req.FromHalfDay != "FN" && req.FromHalfDay != "AN" {
			req.FromHalfDay = ""
		}
		if req.ToHalfDay != "FN" && req.ToHalfDay != "AN" {
			req.ToHalfDay = ""
		}
		if req.LeaveType == "" {
			req.LeaveType = "GP"
		}

		_, err = stmt.Exec(req.Name, req.FromDate, req.ToDate, req.Day, req.FromHalfDay, req.ToHalfDay, req.LeaveType, req.Remarks)
		if err == nil {
			insertedCount++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"message":  fmt.Sprintf("Successfully added %d leave records", insertedCount),
		"inserted": insertedCount,
	})
}

// ResetToDefaultLeaves clears and reseeds default holidays (Admin only)
func (h *LeaveHandler) ResetToDefaultLeaves(c *gin.Context) {
	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database not connected"})
		return
	}

	_, _ = config.DB.Exec("TRUNCATE TABLE college_leaves")

	stmt, err := config.DB.Prepare(`
		INSERT INTO college_leaves (name, from_date, to_date, day, from_half_day, to_half_day, leave_type, remarks)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to prepare insert: " + err.Error()})
		return
	}
	defer stmt.Close()

	for _, hol := range data.Holidays {
		fromDate := hol.FromDate
		fromHalfDay := hol.FromHalfDay
		if strings.HasSuffix(fromDate, "(AN)") {
			fromDate = strings.TrimSuffix(fromDate, "(AN)")
			fromHalfDay = "AN"
		} else if strings.HasSuffix(fromDate, "(FN)") {
			fromDate = strings.TrimSuffix(fromDate, "(FN)")
			fromHalfDay = "FN"
		}

		dayName := hol.Day
		if dayName == "" {
			if t, parseErr := time.Parse("2006-01-02", fromDate); parseErr == nil {
				dayName = t.Weekday().String()
			}
		}

		leaveType := "GP"
		if strings.Contains(hol.Name, "GP") {
			leaveType = "GP"
		} else {
			leaveType = "Holiday"
		}

		_, _ = stmt.Exec(hol.Name, fromDate, hol.ToDate, dayName, fromHalfDay, hol.ToHalfDay, leaveType, hol.Remarks)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Reset and seeded default college leaves successfully",
	})
}
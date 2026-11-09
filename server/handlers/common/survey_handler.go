package common

import (
	"database/sql"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"

	"server/config"
	"server/utils"

	"github.com/gin-gonic/gin"
)

type SurveyHandler struct {
	DB *sql.DB
}

func NewSurveyHandler() *SurveyHandler {
	return &SurveyHandler{DB: config.GetLogsDB()}
}

type UISurveyResponse struct {
	ID        int       `json:"id"`
	UserUID   string    `json:"user_uid"`
	UserName  string    `json:"user_name"`
	UserEmail string    `json:"user_email"`
	Liked     string    `json:"liked"` // "yes" or "no"
	Feedback  string    `json:"feedback"`
	UserAgent string    `json:"user_agent"`
	CreatedAt time.Time `json:"created_at"`
}

// SubmitFeedback handles saving user feedback for the UI survey
func (h *SurveyHandler) SubmitFeedback(c *gin.Context) {
	var body struct {
		Liked    string `json:"liked" binding:"required"`
		Feedback string `json:"feedback"`
		UserName string `json:"user_name"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request payload"})
		return
	}

	liked := strings.ToLower(strings.TrimSpace(body.Liked))
	if liked != "yes" && liked != "no" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Liked must be 'yes' or 'no'"})
		return
	}

	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))

	uid := "anonymous"
	email := "anonymous@visitor"
	userName := strings.TrimSpace(body.UserName)

	if token != "" {
		u, e, err := utils.UserFromToken(token)
		if err == nil && u != "" {
			uid = u
			if e != "" {
				email = e
			}
		}
	}

	if userName == "" {
		if email != "" && email != "anonymous@visitor" {
			userName = strings.Split(email, "@")[0]
		} else {
			userName = "Student"
		}
	}

	db := h.DB
	if db == nil {
		db = config.GetLogsDB()
	}
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	query := `INSERT INTO ui_survey_feedback (user_uid, user_name, user_email, liked, feedback, user_agent) VALUES (?, ?, ?, ?, ?, ?)`
	_, err := db.Exec(query, uid, userName, email, liked, strings.TrimSpace(body.Feedback), c.Request.UserAgent())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to save survey feedback: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Feedback submitted successfully. Thank you!",
	})
}

// GetFeedbackList retrieves UI survey submissions with server-side pagination, filtering, and summary analytics for the admin
func (h *SurveyHandler) GetFeedbackList(c *gin.Context) {
	db := h.DB
	if db == nil {
		db = config.GetLogsDB()
	}
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	// 1. Overall all-time summary analytics
	var totalCount int
	var yesCount int
	var noCount int

	_ = db.QueryRow(`SELECT COUNT(*) FROM ui_survey_feedback`).Scan(&totalCount)
	_ = db.QueryRow(`SELECT COUNT(*) FROM ui_survey_feedback WHERE liked = 'yes'`).Scan(&yesCount)
	_ = db.QueryRow(`SELECT COUNT(*) FROM ui_survey_feedback WHERE liked = 'no'`).Scan(&noCount)

	satisfactionRate := 0.0
	if totalCount > 0 {
		satisfactionRate = (float64(yesCount) / float64(totalCount)) * 100.0
	}

	// 2. Pagination query parameters
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "25"))
	if limit < 1 {
		limit = 25
	} else if limit > 100 {
		limit = 100
	}
	offset := (page - 1) * limit

	// 3. Filter query parameters
	search := strings.TrimSpace(c.Query("search"))
	liked := strings.ToLower(strings.TrimSpace(c.Query("liked")))
	hasFeedback := strings.ToLower(strings.TrimSpace(c.Query("has_feedback")))

	whereClauses := []string{"1=1"}
	var args []interface{}

	if liked == "yes" || liked == "no" {
		whereClauses = append(whereClauses, "liked = ?")
		args = append(args, liked)
	}

	if hasFeedback == "true" || hasFeedback == "1" {
		whereClauses = append(whereClauses, "feedback IS NOT NULL AND TRIM(feedback) != ''")
	}

	if search != "" {
		searchTerm := "%" + search + "%"
		whereClauses = append(whereClauses, "(user_name LIKE ? OR user_email LIKE ? OR feedback LIKE ?)")
		args = append(args, searchTerm, searchTerm, searchTerm)
	}

	whereSQL := strings.Join(whereClauses, " AND ")

	// 4. Count total matching current filter
	var filteredTotal int
	countQuery := "SELECT COUNT(*) FROM ui_survey_feedback WHERE " + whereSQL
	err := db.QueryRow(countQuery, args...).Scan(&filteredTotal)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count feedback: " + err.Error()})
		return
	}

	totalPages := int(math.Ceil(float64(filteredTotal) / float64(limit)))
	if totalPages < 1 {
		totalPages = 1
	}

	// 5. Query paginated results
	dataQuery := `SELECT id, user_uid, user_name, user_email, liked, COALESCE(feedback, ''), COALESCE(user_agent, ''), created_at 
	              FROM ui_survey_feedback 
	              WHERE ` + whereSQL + ` 
	              ORDER BY created_at DESC 
	              LIMIT ? OFFSET ?`
	queryArgs := append(args, limit, offset)

	rows, err := db.Query(dataQuery, queryArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch survey feedback: " + err.Error()})
		return
	}
	defer rows.Close()

	var list []UISurveyResponse
	for rows.Next() {
		var item UISurveyResponse
		if err := rows.Scan(&item.ID, &item.UserUID, &item.UserName, &item.UserEmail, &item.Liked, &item.Feedback, &item.UserAgent, &item.CreatedAt); err == nil {
			list = append(list, item)
		}
	}
	if list == nil {
		list = []UISurveyResponse{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"summary": gin.H{
			"total":             totalCount,
			"yes_count":         yesCount,
			"no_count":          noCount,
			"satisfaction_rate": satisfactionRate,
		},
		"pagination": gin.H{
			"page":        page,
			"limit":       limit,
			"total":       filteredTotal,
			"total_pages": totalPages,
		},
		"data": list,
	})
}

// DeleteFeedback removes a specific survey response
func (h *SurveyHandler) DeleteFeedback(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Feedback ID is required"})
		return
	}

	db := h.DB
	if db == nil {
		db = config.GetLogsDB()
	}
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	_, err := db.Exec(`DELETE FROM ui_survey_feedback WHERE id = ?`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete response: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Survey response deleted successfully",
	})
}

// CheckUserSurveyStatus securely checks whether the currently authenticated user
// has already submitted the survey. Only the authenticated user's own token is used.
// Any user ID spoofing via query params or request payload is strictly ignored/prevented.
func (h *SurveyHandler) CheckUserSurveyStatus(c *gin.Context) {
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
	if token == "" {
		// Anonymous visitor or not signed in
		c.JSON(http.StatusOK, gin.H{
			"success":   true,
			"submitted": false,
		})
		return
	}

	uid, email, err := utils.UserFromToken(token)
	if err != nil || (uid == "" && email == "") {
		c.JSON(http.StatusOK, gin.H{
			"success":   true,
			"submitted": false,
		})
		return
	}

	db := h.DB
	if db == nil {
		db = config.GetLogsDB()
	}
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	var liked string
	var lastSubmittedAt time.Time
	query := `SELECT liked, created_at FROM ui_survey_feedback 
	          WHERE (user_uid = ? AND user_uid != 'anonymous') 
	             OR (user_email = ? AND user_email != 'anonymous@visitor' AND user_email != '') 
	          ORDER BY created_at DESC LIMIT 1`
	err = db.QueryRow(query, uid, email).Scan(&liked, &lastSubmittedAt)
	if err == sql.ErrNoRows {
		c.JSON(http.StatusOK, gin.H{
			"success":   true,
			"submitted": false,
		})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to check survey status: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":           true,
		"submitted":         true,
		"liked":             liked,
		"last_submitted_at": lastSubmittedAt,
	})
}


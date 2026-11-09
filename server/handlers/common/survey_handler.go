package common

import (
	"database/sql"
	"net/http"
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

// GetFeedbackList retrieves all UI survey submissions with analytics for the admin
func (h *SurveyHandler) GetFeedbackList(c *gin.Context) {
	db := h.DB
	if db == nil {
		db = config.GetLogsDB()
	}
	if db == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection not available"})
		return
	}

	var totalCount int
	var yesCount int
	var noCount int

	_ = db.QueryRow(`SELECT COUNT(*) FROM ui_survey_feedback`).Scan(&totalCount)
	_ = db.QueryRow(`SELECT COUNT(*) FROM ui_survey_feedback WHERE liked = 'yes'`).Scan(&yesCount)
	_ = db.QueryRow(`SELECT COUNT(*) FROM ui_survey_feedback WHERE liked = 'no'`).Scan(&noCount)

	rows, err := db.Query(`SELECT id, user_uid, user_name, user_email, liked, COALESCE(feedback, ''), COALESCE(user_agent, ''), created_at FROM ui_survey_feedback ORDER BY created_at DESC LIMIT 500`)
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

	satisfactionRate := 0.0
	if totalCount > 0 {
		satisfactionRate = (float64(yesCount) / float64(totalCount)) * 100.0
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"summary": gin.H{
			"total":             totalCount,
			"yes_count":         yesCount,
			"no_count":          noCount,
			"satisfaction_rate": satisfactionRate,
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


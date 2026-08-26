package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

type TrackerUserHandler struct {
	DB *sql.DB
}

func NewTrackerUserHandler() *TrackerUserHandler {
	return &TrackerUserHandler{
		DB: config.DB,
	}
}

func (h *TrackerUserHandler) GetTrackerUsers(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database connection is not initialized",
		})
		return
	}

	search := strings.TrimSpace(c.Query("q"))
	if search == "" {
		search = strings.TrimSpace(c.Query("search"))
	}

	var rows *sql.Rows
	var err error

	if search != "" {
		pattern := "%" + strings.ToLower(search) + "%"
		query := `
			SELECT 
				COALESCE(user_id, ''), 
				COALESCE(id, ''), 
				COALESCE(name, ''), 
				COALESCE(email, ''),
				COALESCE(batch, ''),
				COALESCE(phone, ''),
				COALESCE(department, '')
			FROM tracker_users
			WHERE LOWER(user_id) LIKE ? 
			   OR LOWER(id) LIKE ? 
			   OR LOWER(name) LIKE ? 
			   OR LOWER(email) LIKE ?
			ORDER BY name ASC
			LIMIT 1000
		`
		rows, err = h.DB.Query(query, pattern, pattern, pattern, pattern)
	} else {
		query := `
			SELECT 
				COALESCE(user_id, ''), 
				COALESCE(id, ''), 
				COALESCE(name, ''), 
				COALESCE(email, ''),
				COALESCE(batch, ''),
				COALESCE(phone, ''),
				COALESCE(department, '')
			FROM tracker_users
			ORDER BY name ASC
			LIMIT 1000
		`
		rows, err = h.DB.Query(query)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to fetch tracker users: " + err.Error(),
		})
		return
	}
	defer rows.Close()

	users := make([]models.TrackerUser, 0)
	for rows.Next() {
		var u models.TrackerUser
		if err := rows.Scan(&u.UserID, &u.ID, &u.Name, &u.Email, &u.Batch, &u.Phone, &u.Department); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"error":   "Error reading tracker user row: " + err.Error(),
			})
			return
		}
		users = append(users, u)
	}

	if err := rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Row iteration error: " + err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    users,
		"count":   len(users),
	})
}

var departmentMap = map[string]string{
	"cs": "Computer Science and Engineering",
	"ad": "Artificial Intelligence & Data Science",
	"al": "Artificial Intelligence & Machine Learning",
	"ec": "Electronics and Communication Engineering",
	"ee": "Electrical and Electronics Engineering",
	"ct": "Computer Technology",
	"bt": "Biotechnology",
	"cb": "Computer Science and Business Systems",
	"mz": "Mechatronics",
	"it": "Information Technology",
	"ae": "Aeronautical Engineering",
	"ag": "Agricultural Engineering",
	"bm": "Biomedical Engineering",
	"ce": "Civil Engineering",
	"ft": "Fashion Technology",
	"me": "Mechanical Engineering",
	"se": "Information Science and Engineering",
}

func decodeDepartmentAndBatch(email string) (string, string) {
	lower := strings.ToLower(strings.TrimSpace(email))
	if !strings.HasSuffix(lower, "@bitsathy.ac.in") && !strings.HasSuffix(lower, "@bitsathy.in") {
		return "", ""
	}
	username := strings.Split(lower, "@")[0]
	parts := strings.Split(username, ".")
	if len(parts) < 2 {
		return "", ""
	}
	deptYear := parts[len(parts)-1]
	if len(deptYear) < 4 {
		return "", ""
	}
	deptCode := deptYear[:2]
	yearCode := deptYear[2:]

	dept := departmentMap[deptCode]
	if dept == "" {
		dept = "Engineering Student"
	}

	var batchStr string
	if len(yearCode) == 2 {
		var yr int
		if _, err := fmt.Sscanf(yearCode, "%d", &yr); err == nil {
			startYear := 2000 + yr
			endYear := startYear + 4
			batchStr = fmt.Sprintf("%d - %d", startYear, endYear)
		}
	}

	return dept, batchStr
}

func (h *TrackerUserHandler) GetProfileV2(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database connection is not initialized",
		})
		return
	}

	emailID := strings.TrimSpace(c.Query("emailid"))
	if emailID == "" {
		emailID = strings.TrimSpace(c.Query("email"))
	}
	if emailID == "" {
		emailID = strings.TrimSpace(c.Query("mailid"))
	}

	if emailID == "" {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
		if token != "" {
			resolvedEmail, err := emailFromToken(token)
			if err == nil && resolvedEmail != "" {
				emailID = resolvedEmail
			}
		}
	}

	if emailID == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Query param 'email' or valid Authorization Bearer token is required",
		})
		return
	}

	// 1. Fetch from tracker_users table
	trackerQuery := `
		SELECT 
			COALESCE(id, ''), 
			COALESCE(user_id, ''), 
			COALESCE(name, ''), 
			COALESCE(email, ''), 
			COALESCE(batch, ''), 
			COALESCE(phone, ''), 
			COALESCE(department, '')
		FROM tracker_users
		WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))
		   OR LOWER(TRIM(user_id)) = LOWER(TRIM(?))
		   OR LOWER(TRIM(id)) = LOWER(TRIM(?))
		LIMIT 1
	`

	var tID, tUserID, tName, tEmail, tBatch, tPhone, tDept string
	trackerErr := h.DB.QueryRow(trackerQuery, emailID, emailID, emailID).Scan(
		&tID, &tUserID, &tName, &tEmail, &tBatch, &tPhone, &tDept,
	)

	// 2. Fetch from users table using email
	searchEmail := emailID
	if tEmail != "" {
		searchEmail = tEmail
	}

	var userUID, uEmail, displayName, photoURL, creationTime, lastSignInTime string
	userQuery := `
		SELECT 
			COALESCE(uid, ''), 
			COALESCE(email, ''), 
			COALESCE(display_name, ''), 
			COALESCE(photo_url, ''), 
			COALESCE(creation_time, ''), 
			COALESCE(last_sign_in_time, '')
		FROM users
		WHERE LOWER(TRIM(email)) = LOWER(TRIM(?))
		LIMIT 1
	`
	_ = h.DB.QueryRow(userQuery, searchEmail).Scan(
		&userUID, &uEmail, &displayName, &photoURL, &creationTime, &lastSignInTime,
	)

	// 3. Fetch rollno from student_email table
	var rollNo string
	_ = h.DB.QueryRow(
		`SELECT COALESCE(rollno, '') FROM student_email WHERE LOWER(TRIM(emailid)) = LOWER(TRIM(?)) LIMIT 1`,
		searchEmail,
	).Scan(&rollNo)

	// If not found in tracker_users, users, or student_email
	if trackerErr != nil && userUID == "" && displayName == "" && rollNo == "" {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User profile not found",
		})
		return
	}

	// 4. Consolidate profile details
	finalEmail := tEmail
	if finalEmail == "" {
		finalEmail = uEmail
	}
	if finalEmail == "" {
		finalEmail = emailID
	}

	finalName := tName
	if finalName == "" {
		finalName = displayName
	}

	finalUserID := tID
	if finalUserID == "" {
		finalUserID = userUID
	}

	finalRegNo := tUserID
	if finalRegNo == "" {
		finalRegNo = rollNo
	}

	decodedDept, decodedBatch := decodeDepartmentAndBatch(finalEmail)
	dept := tDept
	if dept == "" {
		dept = decodedDept
	}

	batch := tBatch
	if batch == "" {
		batch = decodedBatch
	}

	profile := models.TrackerUserProfileV2{
		UserID:         finalUserID,
		UID:            userUID,
		RegisterNo:     finalRegNo,
		RollNo:         finalRegNo,
		Name:           finalName,
		Email:          finalEmail,
		Batch:          batch,
		Phone:          tPhone,
		Department:     dept,
		PhotoURL:       photoURL,
		CreationTime:   creationTime,
		LastSignInTime: lastSignInTime,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    profile,
	})
}

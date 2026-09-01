package handlers

import (
	"database/sql"
	"fmt"
	"math"
	"net/http"
	"strconv"
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

	// 3. Fetch rollno (user_id) from tracker_users table
	var rollNo string
	if tUserID != "" {
		rollNo = tUserID
	} else {
		_ = h.DB.QueryRow(
			`SELECT COALESCE(user_id, '') FROM tracker_users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) LIMIT 1`,
			searchEmail,
		).Scan(&rollNo)
	}

	// If not found in tracker_users or users
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

// GetTrackerUsersAdmin fetches tracker_users data with flexible search and pagination for admin view.
// Excludes created_at and updated_at fields as requested.
func (h *TrackerUserHandler) GetTrackerUsersAdmin(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Database connection is not initialized",
		})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "25"))
	if limit < 1 {
		limit = 25
	} else if limit > 500 {
		limit = 500
	}
	offset := (page - 1) * limit

	search := strings.TrimSpace(c.Query("search"))
	batchFilter := strings.TrimSpace(c.Query("batch"))
	deptFilter := strings.TrimSpace(c.Query("department"))

	whereClauses := []string{"1=1"}
	args := []interface{}{}

	if search != "" {
		sPattern := "%" + strings.ToLower(search) + "%"
		whereClauses = append(whereClauses, `(
			LOWER(COALESCE(user_id, '')) LIKE ? OR
			LOWER(COALESCE(id, '')) LIKE ? OR
			LOWER(COALESCE(name, '')) LIKE ? OR
			LOWER(COALESCE(email, '')) LIKE ? OR
			LOWER(COALESCE(batch, '')) LIKE ? OR
			LOWER(COALESCE(phone, '')) LIKE ? OR
			LOWER(COALESCE(department, '')) LIKE ?
		)`)
		args = append(args, sPattern, sPattern, sPattern, sPattern, sPattern, sPattern, sPattern)
	}

	if batchFilter != "" {
		if strings.EqualFold(batchFilter, "others") {
			whereClauses = append(whereClauses, "(batch IS NULL OR batch = '' OR batch = '-')")
		} else {
			whereClauses = append(whereClauses, "LOWER(COALESCE(batch, '')) = LOWER(?)")
			args = append(args, batchFilter)
		}
	}

	if deptFilter != "" {
		whereClauses = append(whereClauses, "LOWER(COALESCE(department, '')) LIKE LOWER(?)")
		args = append(args, "%"+deptFilter+"%")
	}

	whereSQL := strings.Join(whereClauses, " AND ")

	var total int
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM tracker_users").Scan(&total)

	var filteredTotal int
	countQuery := "SELECT COUNT(*) FROM tracker_users WHERE " + whereSQL
	if err := h.DB.QueryRow(countQuery, args...).Scan(&filteredTotal); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to count tracker users: " + err.Error(),
		})
		return
	}

	selectQuery := fmt.Sprintf(`
		SELECT 
			COALESCE(user_id, ''),
			COALESCE(id, ''),
			COALESCE(name, ''),
			COALESCE(email, ''),
			COALESCE(batch, ''),
			COALESCE(phone, ''),
			COALESCE(department, '')
		FROM tracker_users
		WHERE %s
		ORDER BY name ASC, user_id ASC
		LIMIT ? OFFSET ?
	`, whereSQL)

	selectArgs := append(args, limit, offset)

	rows, err := h.DB.Query(selectQuery, selectArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to query tracker users: " + err.Error(),
		})
		return
	}
	defer rows.Close()

	type TrackerUserItem struct {
		UserID     string `json:"user_id"`
		ID         string `json:"id"`
		Name       string `json:"name"`
		Email      string `json:"email"`
		Batch      string `json:"batch"`
		Phone      string `json:"phone"`
		Department string `json:"department"`
	}

	users := make([]TrackerUserItem, 0)
	for rows.Next() {
		var u TrackerUserItem
		if err := rows.Scan(&u.UserID, &u.ID, &u.Name, &u.Email, &u.Batch, &u.Phone, &u.Department); err == nil {
			users = append(users, u)
		}
	}

	batchCounts := make(map[string]int)
	bRows, bErr := h.DB.Query("SELECT COALESCE(batch, ''), COUNT(*) FROM tracker_users GROUP BY batch")
	if bErr == nil {
		defer bRows.Close()
		for bRows.Next() {
			var bName string
			var cnt int
			if err := bRows.Scan(&bName, &cnt); err == nil {
				bName = strings.TrimSpace(bName)
				if bName == "" || bName == "-" {
					batchCounts["others"] += cnt
				} else {
					batchCounts[bName] += cnt
				}
			}
		}
	}

	totalPages := int(math.Ceil(float64(filteredTotal) / float64(limit)))
	if totalPages < 1 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"success":       true,
		"users":         users,
		"total":         total,
		"filteredTotal": filteredTotal,
		"page":          page,
		"pageSize":      limit,
		"totalPages":    totalPages,
		"batchCounts":   batchCounts,
	})
}


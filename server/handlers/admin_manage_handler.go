package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"server/config"

	"github.com/gin-gonic/gin"
)

// Admin management: only accessible by super admin
func (h *AdminHandler) ListAdmins(c *gin.Context) {
    rows, err := h.DB.Query(`
        SELECT
            a.uid,
            a.created_by,
            COALESCE(NULLIF(TRIM(u.display_name), ''), NULLIF(TRIM(u.email), ''), a.created_by) AS created_by_name,
            DATE_FORMAT(a.created_at, '%Y-%m-%dT%H:%i:%sZ')
        FROM admins a
        LEFT JOIN users u ON u.uid = a.created_by
        ORDER BY a.created_at DESC`)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
        return
    }
    defer rows.Close()

    var list []gin.H
    for rows.Next() {
        var uid, createdBy, createdByName, createdAt sql.NullString
        if err := rows.Scan(&uid, &createdBy, &createdByName, &createdAt); err != nil {
            continue
        }
        list = append(list, gin.H{"uid": uid.String, "created_by": createdBy.String, "created_by_name": createdByName.String, "created_at": createdAt.String})
    }

    c.JSON(http.StatusOK, gin.H{"success": true, "admins": list})
}

func (h *AdminHandler) AddAdmin(c *gin.Context) {
    var body struct{
        UID string `json:"uid"`
    }
    if err := c.ShouldBindJSON(&body); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "uid is required"})
        return
    }
    uid := strings.TrimSpace(body.UID)
    if uid == "" {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "uid is required"})
        return
    }

    createdBy, _ := c.Get("actor_uid")

    if _, err := h.DB.Exec(`INSERT IGNORE INTO admins (uid, created_by) VALUES (?, ?);`, uid, createdBy); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"success": true, "message": "Admin added", "uid": uid})
}

func (h *AdminHandler) RemoveAdmin(c *gin.Context) {
    uid := strings.TrimSpace(c.Param("uid"))
    if uid == "" {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "uid is required"})
        return
    }

    if _, err := h.DB.Exec(`DELETE FROM admins WHERE uid = ?`, uid); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"success": true, "message": "Admin removed", "uid": uid})
}

// Allowed emails/domains management
func (h *AdminHandler) ListAllowed(c *gin.Context) {
    rows, err := h.DB.Query(`
        SELECT
            a.id,
            a.value,
            a.type,
            a.created_by,
            COALESCE(NULLIF(TRIM(u.display_name), ''), NULLIF(TRIM(u.email), ''), a.created_by) AS created_by_name,
            DATE_FORMAT(a.created_at, '%Y-%m-%dT%H:%i:%sZ')
        FROM allowed_emails a
        LEFT JOIN users u ON u.uid = a.created_by
        ORDER BY a.created_at DESC`)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
        return
    }
    defer rows.Close()

    var list []gin.H
    for rows.Next() {
        var id int
        var value, typ, createdBy, createdByName, createdAt sql.NullString
        if err := rows.Scan(&id, &value, &typ, &createdBy, &createdByName, &createdAt); err != nil {
            continue
        }
        list = append(list, gin.H{"id": id, "value": value.String, "type": typ.String, "created_by": createdBy.String, "created_by_name": createdByName.String, "created_at": createdAt.String})
    }

    c.JSON(http.StatusOK, gin.H{"success": true, "allowed": list})
}

func (h *AdminHandler) AddAllowed(c *gin.Context) {
    var body struct{
        Value string `json:"value"`
        Type  string `json:"type"` // "email" or "domain"
    }
    if err := c.ShouldBindJSON(&body); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "value and type are required"})
        return
    }
    v := strings.TrimSpace(body.Value)
    t := strings.TrimSpace(strings.ToLower(body.Type))
    if v == "" || (t != "email" && t != "domain") {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid value or type"})
        return
    }

    createdBy, _ := c.Get("actor_uid")

    if _, err := h.DB.Exec(`INSERT INTO allowed_emails (value, type, created_by) VALUES (?, ?, ?)`, v, t, createdBy); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"success": true, "message": "Allowed entry added", "value": v, "type": t})
}

func (h *AdminHandler) RemoveAllowed(c *gin.Context) {
    id := strings.TrimSpace(c.Param("id"))
    if id == "" {
        c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "id is required"})
        return
    }
    if _, err := h.DB.Exec(`DELETE FROM allowed_emails WHERE id = ?`, id); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"success": true, "message": "Allowed entry removed", "id": id})
}

// Check if provided bearer token belongs to configured super admin
func (h *AdminHandler) CheckSuper(c *gin.Context) {
    authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
    token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
    if token == "" {
        c.JSON(http.StatusOK, gin.H{"is_super": false})
        return
    }

    claims, err := config.VerifyGoogleToken(token)
    if err != nil || claims == nil {
        c.JSON(http.StatusOK, gin.H{"is_super": false})
        return
    }

    if h.DB != nil {
        var role string
        email := strings.ToLower(strings.TrimSpace(claims.Email))
        err := h.DB.QueryRow(`SELECT role FROM users WHERE (google_id != '' AND google_id = ?) OR (uid != '' AND uid = ?) OR (email != '' AND LOWER(TRIM(email)) = ?)`, claims.UID, claims.UID, email).Scan(&role)
        if err == nil {
            r := strings.ToLower(strings.TrimSpace(role))
            if r == "superadmin" || r == "super_admin" {
                c.JSON(http.StatusOK, gin.H{"is_super": true})
                return
            }
        }
    }

    c.JSON(http.StatusOK, gin.H{"is_super": false})
}

// GetAuditLogs fetches paginated audit logs with search and filters
func (h *AdminHandler) GetAuditLogs(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Database unavailable"})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	if limit < 1 || limit > 200 {
		limit = 50
	}
	offset := (page - 1) * limit

	search := strings.TrimSpace(c.Query("search"))
	method := strings.TrimSpace(strings.ToUpper(c.Query("method")))
	statusStr := strings.TrimSpace(c.Query("status"))
	userUID := strings.TrimSpace(c.Query("user_uid"))
	rollNo := strings.TrimSpace(c.Query("roll_no"))
	userName := strings.TrimSpace(c.Query("user_name"))
	userKey := strings.TrimSpace(c.Query("user"))

	whereClauses := []string{"1=1"}
	args := []interface{}{}

	if userUID != "" {
		whereClauses = append(whereClauses, "user_uid = ?")
		args = append(args, userUID)
	}
	if rollNo != "" {
		whereClauses = append(whereClauses, "roll_no = ?")
		args = append(args, rollNo)
	}
	if userName != "" {
		whereClauses = append(whereClauses, "user_name = ?")
		args = append(args, userName)
	}
	if userKey != "" {
		whereClauses = append(whereClauses, "(user_uid = ? OR roll_no = ? OR user_name = ?)")
		args = append(args, userKey, userKey, userKey)
	}

	if search != "" {
		whereClauses = append(whereClauses, "(endpoint LIKE ? OR query LIKE ? OR payload LIKE ? OR ip_address LIKE ? OR user_name LIKE ? OR roll_no LIKE ? OR user_uid LIKE ?)")
		pattern := "%" + search + "%"
		args = append(args, pattern, pattern, pattern, pattern, pattern, pattern, pattern)
	}

	if method != "" && method != "ALL" {
		whereClauses = append(whereClauses, "method = ?")
		args = append(args, method)
	}

	if statusStr != "" && statusStr != "ALL" {
		if statusStr == "error" || statusStr == "5xx" {
			whereClauses = append(whereClauses, "status_code >= 400")
		} else if statusStr == "success" || statusStr == "2xx" {
			whereClauses = append(whereClauses, "status_code < 400")
		} else if st, err := strconv.Atoi(statusStr); err == nil {
			whereClauses = append(whereClauses, "status_code = ?")
			args = append(args, st)
		}
	}

	whereStmt := strings.Join(whereClauses, " AND ")

	var total int
	countQuery := fmt.Sprintf("SELECT COUNT(*) FROM audit_logs WHERE %s", whereStmt)
	if err := h.DB.QueryRow(countQuery, args...).Scan(&total); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	querySQL := fmt.Sprintf(`
		SELECT id, method, endpoint, COALESCE(query, ''), COALESCE(payload, ''), ip_address, COALESCE(user_uid, ''), COALESCE(user_name, ''), COALESCE(roll_no, ''), COALESCE(role, ''), status_code, DATE_FORMAT(created_at, '%%Y-%%m-%%dT%%H:%%i:%%sZ')
		FROM audit_logs
		WHERE %s
		ORDER BY id DESC
		LIMIT ? OFFSET ?
	`, whereStmt)

	queryArgs := append(args, limit, offset)
	rows, err := h.DB.Query(querySQL, queryArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer rows.Close()

	var logs []gin.H
	for rows.Next() {
		var id, statusCode int
		var m, ep, q, p, ip, uid, uname, rno, rrole, createdAt string
		if err := rows.Scan(&id, &m, &ep, &q, &p, &ip, &uid, &uname, &rno, &rrole, &statusCode, &createdAt); err != nil {
			continue
		}
		logs = append(logs, gin.H{
			"id":          id,
			"method":      m,
			"endpoint":    ep,
			"query":       q,
			"payload":     p,
			"ip_address":  ip,
			"user_uid":    uid,
			"user_name":   uname,
			"roll_no":     rno,
			"role":        rrole,
			"status_code": statusCode,
			"created_at":  createdAt,
		})
	}

	totalPages := (total + limit - 1) / limit
	if totalPages < 1 {
		totalPages = 1
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"logs":       logs,
		"total":      total,
		"page":       page,
		"limit":      limit,
		"totalPages": totalPages,
	})
}

// UserAuditSummaryItem represents aggregated user audit data for the user audit cards view
type UserAuditSummaryItem struct {
	UserUID        string `json:"user_uid"`
	UserName       string `json:"user_name"`
	DisplayName    string `json:"display_name"`
	Email          string `json:"email"`
	RollNo         string `json:"roll_no"`
	Role           string `json:"role"`
	PhotoURL       string `json:"photo_url"`
	Department     string `json:"department"`
	Batch          string `json:"batch"`
	IsBlocked      bool   `json:"is_blocked"`
	BlockedAt      string `json:"blocked_at"`
	IsFlagged      bool   `json:"is_flagged"`
	FlaggedAt      string `json:"flagged_at"`
	FlagReason     string `json:"flag_reason"`
	TotalRequests  int    `json:"total_requests"`
	ErrorCount     int    `json:"error_count"`
	SuccessCount   int    `json:"success_count"`
	LastActiveAt   string `json:"last_active_at"`
	LastIP         string `json:"last_ip"`
	LastMethod     string `json:"last_method"`
	LastEndpoint   string `json:"last_endpoint"`
}

// GetUserAuditLogsSummary aggregates audit logs per user and returns a summary list with user details
func (h *AdminHandler) GetUserAuditLogsSummary(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Database unavailable"})
		return
	}

	search := strings.ToLower(strings.TrimSpace(c.Query("search")))
	roleFilter := strings.ToLower(strings.TrimSpace(c.Query("role")))
	activityFilter := strings.ToLower(strings.TrimSpace(c.Query("activity")))
	sortBy := strings.ToLower(strings.TrimSpace(c.DefaultQuery("sort", "recent")))
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "30"))
	if limit < 1 || limit > 200 {
		limit = 30
	}

	userMap := make(map[string]*UserAuditSummaryItem)

	// 1. Fetch tracker_users mapping for department and batch
	type trackerInfo struct {
		name       string
		department string
		batch      string
		rollNo     string
	}
	trackerByEmail := make(map[string]trackerInfo)
	trackerByRoll := make(map[string]trackerInfo)

	tRows, tErr := h.DB.Query(`SELECT COALESCE(user_id, ''), COALESCE(email, ''), COALESCE(name, ''), COALESCE(department, ''), COALESCE(batch, '') FROM tracker_users`)
	if tErr == nil {
		defer tRows.Close()
		for tRows.Next() {
			var rNo, em, nm, dept, bt string
			if err := tRows.Scan(&rNo, &em, &nm, &dept, &bt); err == nil {
				info := trackerInfo{name: nm, department: dept, batch: bt, rollNo: rNo}
				if em != "" {
					trackerByEmail[strings.ToLower(strings.TrimSpace(em))] = info
				}
				if rNo != "" {
					trackerByRoll[strings.ToUpper(strings.TrimSpace(rNo))] = info
				}
			}
		}
	}

	// 2. Fetch all registered users from users table
	uRows, uErr := h.DB.Query(`
		SELECT 
			COALESCE(google_id, COALESCE(uid, '')), 
			COALESCE(email, ''), 
			COALESCE(display_name, ''), 
			COALESCE(photo_url, ''), 
			COALESCE(role, 'user'), 
			COALESCE(creation_time, ''), 
			COALESCE(last_seen_at, ''),
			COALESCE(blocked, 0),
			COALESCE(DATE_FORMAT(blocked_at, '%Y-%m-%dT%H:%i:%sZ'), ''),
			COALESCE(flagged, 0),
			COALESCE(DATE_FORMAT(flagged_at, '%Y-%m-%dT%H:%i:%sZ'), ''),
			COALESCE(flag_reason, '')
		FROM users
	`)
	if uErr == nil {
		defer uRows.Close()
		for uRows.Next() {
			var uid, email, dName, photo, role, creationTime, lastSeen, bAt, fAt, fReason string
			var blocked, flagged int
			if err := uRows.Scan(&uid, &email, &dName, &photo, &role, &creationTime, &lastSeen, &blocked, &bAt, &flagged, &fAt, &fReason); err == nil {
				cleanEmail := strings.ToLower(strings.TrimSpace(email))
				key := uid
				if key == "" {
					key = cleanEmail
				}
				if key == "" {
					continue
				}

				dept := ""
				batch := ""
				rollNo := ""

				if info, ok := trackerByEmail[cleanEmail]; ok {
					dept = info.department
					batch = info.batch
					rollNo = info.rollNo
					if dName == "" {
						dName = info.name
					}
				}

				if dept == "" && cleanEmail != "" {
					decodedDept, decodedBatch := decodeDepartmentAndBatch(cleanEmail)
					dept = decodedDept
					if batch == "" {
						batch = decodedBatch
					}
				}

				userMap[key] = &UserAuditSummaryItem{
					UserUID:      uid,
					UserName:     dName,
					DisplayName:  dName,
					Email:        email,
					RollNo:       rollNo,
					Role:         role,
					PhotoURL:     photo,
					Department:   dept,
					Batch:        batch,
					IsBlocked:    blocked == 1,
					BlockedAt:    bAt,
					IsFlagged:    flagged == 1,
					FlaggedAt:    fAt,
					FlagReason:   fReason,
					LastActiveAt: lastSeen,
				}
			}
		}
	}

	// 3. Fetch aggregated audit log data
	auditQuery := `
		SELECT 
			COALESCE(user_uid, '') AS uid,
			COALESCE(user_name, '') AS uname,
			COALESCE(roll_no, '') AS rno,
			COALESCE(role, 'user') AS rrole,
			COUNT(*) AS total_reqs,
			SUM(CASE WHEN status_code >= 400 THEN 1 ELSE 0 END) AS err_count,
			SUM(CASE WHEN status_code < 400 THEN 1 ELSE 0 END) AS succ_count,
			DATE_FORMAT(MAX(created_at), '%Y-%m-%dT%H:%i:%sZ') AS last_time,
			SUBSTRING_INDEX(GROUP_CONCAT(ip_address ORDER BY id DESC SEPARATOR '|||'), '|||', 1) AS last_ip,
			SUBSTRING_INDEX(GROUP_CONCAT(method ORDER BY id DESC SEPARATOR '|||'), '|||', 1) AS last_method,
			SUBSTRING_INDEX(GROUP_CONCAT(endpoint ORDER BY id DESC SEPARATOR '|||'), '|||', 1) AS last_endpoint
		FROM audit_logs
		WHERE (user_uid != '' OR roll_no != '' OR user_name != '')
		GROUP BY user_uid, user_name, roll_no, role
	`

	aRows, aErr := h.DB.Query(auditQuery)
	var totalAuditRequests int
	var totalAuditErrors int

	if aErr == nil {
		defer aRows.Close()
		for aRows.Next() {
			var uid, uname, rno, rrole, lastTime, lastIP, lastMethod, lastEndpoint string
			var totalReqs, errCount, succCount int

			if err := aRows.Scan(&uid, &uname, &rno, &rrole, &totalReqs, &errCount, &succCount, &lastTime, &lastIP, &lastMethod, &lastEndpoint); err == nil {
				totalAuditRequests += totalReqs
				totalAuditErrors += errCount

				// Try matching existing user
				matched := false
				var targetItem *UserAuditSummaryItem

				if uid != "" {
					if item, ok := userMap[uid]; ok {
						targetItem = item
						matched = true
					}
				}

				if !matched && uname != "" {
					cleanUname := strings.ToLower(strings.TrimSpace(uname))
					for _, item := range userMap {
						if strings.ToLower(strings.TrimSpace(item.Email)) == cleanUname || strings.ToLower(strings.TrimSpace(item.DisplayName)) == cleanUname || strings.ToLower(strings.TrimSpace(item.UserUID)) == cleanUname {
							targetItem = item
							matched = true
							break
						}
					}
				}

				if !matched && rno != "" {
					cleanRno := strings.ToUpper(strings.TrimSpace(rno))
					for _, item := range userMap {
						if strings.ToUpper(strings.TrimSpace(item.RollNo)) == cleanRno {
							targetItem = item
							matched = true
							break
						}
					}
				}

				if !matched {
					// Create new entry from audit log data
					key := uid
					if key == "" {
						key = rno
					}
					if key == "" {
						key = uname
					}

					dept := ""
					batch := ""
					dName := uname
					email := ""

					if strings.Contains(uname, "@") {
						email = uname
						decodedDept, decodedBatch := decodeDepartmentAndBatch(email)
						dept = decodedDept
						batch = decodedBatch
					}

					if info, ok := trackerByRoll[strings.ToUpper(strings.TrimSpace(rno))]; ok {
						if dept == "" {
							dept = info.department
						}
						if batch == "" {
							batch = info.batch
						}
						if dName == "" || dName == uname {
							dName = info.name
						}
					}

					targetItem = &UserAuditSummaryItem{
						UserUID:     uid,
						UserName:    uname,
						DisplayName: dName,
						Email:       email,
						RollNo:      rno,
						Role:        rrole,
						Department:  dept,
						Batch:       batch,
					}
					userMap[key] = targetItem
				}

				// Accumulate activity
				targetItem.TotalRequests += totalReqs
				targetItem.ErrorCount += errCount
				targetItem.SuccessCount += succCount

				if targetItem.LastActiveAt == "" || lastTime > targetItem.LastActiveAt {
					targetItem.LastActiveAt = lastTime
				}
				if targetItem.LastIP == "" {
					targetItem.LastIP = lastIP
				}
				if targetItem.LastMethod == "" {
					targetItem.LastMethod = lastMethod
				}
				if targetItem.LastEndpoint == "" {
					targetItem.LastEndpoint = lastEndpoint
				}
				if targetItem.RollNo == "" && rno != "" {
					targetItem.RollNo = rno
				}
				if targetItem.Role == "" || targetItem.Role == "user" {
					if rrole != "" && rrole != "user" {
						targetItem.Role = rrole
					}
				}
			}
		}
	}

	// 4. Filter list
	filtered := make([]*UserAuditSummaryItem, 0, len(userMap))
	activeCount := 0
	flaggedCount := 0
	blockedCount := 0

	for _, item := range userMap {
		if item.TotalRequests > 0 {
			activeCount++
		}
		if item.IsFlagged {
			flaggedCount++
		}
		if item.IsBlocked {
			blockedCount++
		}

		// Role filter
		if roleFilter != "" && roleFilter != "all" {
			if strings.ToLower(item.Role) != roleFilter {
				continue
			}
		}

		// Activity & Security filter
		if activityFilter == "flagged" && !item.IsFlagged {
			continue
		}
		if activityFilter == "blocked" && !item.IsBlocked {
			continue
		}
		if activityFilter == "active" && item.TotalRequests == 0 {
			continue
		}
		if activityFilter == "errors" && item.ErrorCount == 0 {
			continue
		}
		if activityFilter == "inactive" && item.TotalRequests > 0 {
			continue
		}

		// Search filter
		if search != "" {
			combined := strings.ToLower(fmt.Sprintf("%s %s %s %s %s %s %s %s %s",
				item.DisplayName, item.UserName, item.Email, item.RollNo,
				item.UserUID, item.Department, item.Role, item.LastIP, item.FlagReason,
			))
			if !strings.Contains(combined, search) {
				continue
			}
		}

		filtered = append(filtered, item)
	}

	// 5. Sort list
	switch sortBy {
	case "flagged":
		sortSliceUsers(filtered, func(a, b *UserAuditSummaryItem) bool {
			if a.IsFlagged != b.IsFlagged {
				return a.IsFlagged && !b.IsFlagged
			}
			return a.LastActiveAt > b.LastActiveAt
		})
	case "requests":
		sortSliceUsers(filtered, func(a, b *UserAuditSummaryItem) bool {
			if a.TotalRequests != b.TotalRequests {
				return a.TotalRequests > b.TotalRequests
			}
			return a.LastActiveAt > b.LastActiveAt
		})
	case "errors":
		sortSliceUsers(filtered, func(a, b *UserAuditSummaryItem) bool {
			if a.ErrorCount != b.ErrorCount {
				return a.ErrorCount > b.ErrorCount
			}
			return a.TotalRequests > b.TotalRequests
		})
	case "name":
		sortSliceUsers(filtered, func(a, b *UserAuditSummaryItem) bool {
			nameA := a.DisplayName
			if nameA == "" {
				nameA = a.UserName
			}
			nameB := b.DisplayName
			if nameB == "" {
				nameB = b.UserName
			}
			return strings.ToLower(nameA) < strings.ToLower(nameB)
		})
	default: // "recent"
		sortSliceUsers(filtered, func(a, b *UserAuditSummaryItem) bool {
			if a.LastActiveAt != b.LastActiveAt {
				return a.LastActiveAt > b.LastActiveAt
			}
			return a.TotalRequests > b.TotalRequests
		})
	}

	// 6. Paginate
	total := len(filtered)
	totalPages := (total + limit - 1) / limit
	if totalPages < 1 {
		totalPages = 1
	}

	start := (page - 1) * limit
	if start > total {
		start = total
	}
	end := start + limit
	if end > total {
		end = total
	}

	paginated := filtered[start:end]

	c.JSON(http.StatusOK, gin.H{
		"success":            true,
		"users":              paginated,
		"total":              total,
		"totalUsers":         len(userMap),
		"activeUsersCount":   activeCount,
		"flaggedUsersCount":  flaggedCount,
		"blockedUsersCount":  blockedCount,
		"totalAuditRequests": totalAuditRequests,
		"totalAuditErrors":   totalAuditErrors,
		"page":               page,
		"limit":              limit,
		"totalPages":         totalPages,
	})
}

func sortSliceUsers(items []*UserAuditSummaryItem, less func(a, b *UserAuditSummaryItem) bool) {
	for i := 0; i < len(items); i++ {
		for j := i + 1; j < len(items); j++ {
			if less(items[j], items[i]) {
				items[i], items[j] = items[j], items[i]
			}
		}
	}
}

// ClearAuditLogs clears all audit logs from database
func (h *AdminHandler) ClearAuditLogs(c *gin.Context) {
	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Database unavailable"})
		return
	}
	if _, err := h.DB.Exec("TRUNCATE TABLE audit_logs"); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Audit logs cleared successfully"})
}


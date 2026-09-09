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

	whereClauses := []string{"1=1"}
	args := []interface{}{}

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


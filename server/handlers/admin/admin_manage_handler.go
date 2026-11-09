package admin

import (
	"database/sql"
	"net/http"
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
	var body struct {
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

	// Synchronize user role in database so user is recognized as admin everywhere
	_, _ = h.DB.Exec(`UPDATE users SET role = 'admin' WHERE (uid = ? OR google_id = ?) AND role NOT IN ('superadmin', 'super_admin')`, uid, uid)

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

	// Demote user role back to 'user' in database (never demote superadmin)
	_, _ = h.DB.Exec(`UPDATE users SET role = 'user' WHERE (uid = ? OR google_id = ?) AND role NOT IN ('superadmin', 'super_admin')`, uid, uid)

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Admin removed", "uid": uid})
}

// Check if provided bearer token belongs to configured admin or super admin
func (h *AdminHandler) CheckSuper(c *gin.Context) {
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
	if token == "" {
		cookieNames := []string{"google_auth_token", "jwt", "token", "auth_token", "access_token"}
		for _, name := range cookieNames {
			if cookieVal, err := c.Cookie(name); err == nil && strings.TrimSpace(cookieVal) != "" {
				token = strings.TrimSpace(cookieVal)
				break
			}
		}
	}

	if token == "" {
		c.JSON(http.StatusOK, gin.H{"is_admin": false, "is_super": false, "role": "user"})
		return
	}

	claims, err := config.VerifyGoogleToken(token)
	if err != nil || claims == nil {
		c.JSON(http.StatusOK, gin.H{"is_admin": false, "is_super": false, "role": "user"})
		return
	}

	uid := strings.TrimSpace(claims.UID)
	email := strings.ToLower(strings.TrimSpace(claims.Email))

	if h.DB != nil {
		var role string
		var blocked int
		err := h.DB.QueryRow(`
			SELECT COALESCE(role, 'user'), COALESCE(blocked, 0)
			FROM users
			WHERE (google_id != '' AND google_id = ?) OR (uid != '' AND uid = ?) OR (email != '' AND LOWER(TRIM(email)) = ?)
			LIMIT 1`,
			uid, uid, email,
		).Scan(&role, &blocked)

		if err == nil {
			if blocked != 0 {
				c.JSON(http.StatusOK, gin.H{"is_admin": false, "is_super": false, "role": "blocked", "blocked": true})
				return
			}

			r := strings.ToLower(strings.TrimSpace(role))
			if r == "superadmin" || r == "super_admin" {
				c.JSON(http.StatusOK, gin.H{
					"is_admin": true,
					"is_super": true,
					"role":     "superadmin",
				})
				return
			}

			if r == "admin" {
				c.JSON(http.StatusOK, gin.H{
					"is_admin": true,
					"is_super": false,
					"role":     "admin",
				})
				return
			}
		}

		// Fallback check admins table
		var count int
		_ = h.DB.QueryRow(`
			SELECT COUNT(*)
			FROM admins a
			LEFT JOIN users u ON a.uid = u.uid
			WHERE (a.uid = ? OR LOWER(TRIM(u.email)) = ?)
			  AND COALESCE(u.blocked, 0) = 0`,
			uid, email,
		).Scan(&count)

		if count > 0 {
			c.JSON(http.StatusOK, gin.H{
				"is_admin": true,
				"is_super": false,
				"role":     "admin",
			})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"is_admin": false, "is_super": false, "role": "user"})
}

package handlers

import (
    "database/sql"
    "net/http"
    "os"
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

    client, err := config.FirebaseAuthClient()
    if err != nil || client == nil {
        c.JSON(http.StatusOK, gin.H{"is_super": false})
        return
    }

    decoded, err := client.VerifyIDToken(c.Request.Context(), token)
    if err != nil || decoded == nil {
        c.JSON(http.StatusOK, gin.H{"is_super": false})
        return
    }

    superUID := strings.TrimSpace(os.Getenv("SUPER_ADMIN_FIREBASE_UID"))
    if superUID != "" && decoded.UID == superUID {
        c.JSON(http.StatusOK, gin.H{"is_super": true})
        return
    }

    c.JSON(http.StatusOK, gin.H{"is_super": false})
}

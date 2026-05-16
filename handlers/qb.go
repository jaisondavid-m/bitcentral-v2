package handlers

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

type QBHandler struct {
	DB *sql.DB
}

func NewQBHandler() *QBHandler {
	return &QBHandler{DB: config.DB}
}

// GET /admin/qb?semester=3&year=2024
func (h *QBHandler) List(c *gin.Context) {
	query := `
		SELECT id, year, code, name, qb1, qb2, ak1, ak2, sem_qb_with_ans, created_at, updated_at
		FROM semester_subjects
		WHERE 1=1`
	args := []any{}

	if y := c.Query("year"); y != "" {
		query += " AND year = ?"
		args = append(args, y)
	}
	if q := strings.TrimSpace(c.Query("q")); q != "" {
		query += " AND (LOWER(code) LIKE ? OR LOWER(name) LIKE ?)"
		like := "%" + strings.ToLower(q) + "%"
		args = append(args, like, like)
	}
	query += " ORDER BY year DESC, idx ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var items []models.QBAnswerKey
	for rows.Next() {
		var q models.QBAnswerKey
		if err := rows.Scan(
			&q.ID,
			&q.Year,
			&q.SubjectCode,
			&q.SubjectName,
			&q.QB1,
			&q.QB2,
			&q.AK1,
			&q.AK2,
			&q.SemQBWithAns,
			&q.CreatedAt,
			&q.UpdatedAt,
		); err != nil {
			continue
		}
		items = append(items, q)
	}
	if items == nil {
		items = []models.QBAnswerKey{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
}

// POST /admin/qb
func (h *QBHandler) Create(c *gin.Context) {
	var body models.QBAnswerKeyInput
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	var nextIdx int
	if err := h.DB.QueryRow(`SELECT COALESCE(MAX(idx), -1) + 1 FROM semester_subjects WHERE year = ?`, body.Year).Scan(&nextIdx); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	_, err := h.DB.Exec(`
		INSERT INTO semester_subjects (year, idx, code, name, qb1, qb2, ak1, ak2, sem_qb_with_ans)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		body.Year,
		nextIdx,
		strings.TrimSpace(body.SubjectCode),
		strings.TrimSpace(body.SubjectName),
		body.QB1,
		body.QB2,
		body.AK1,
		body.AK2,
		body.SemQBWithAns,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Subject created"})
}

// POST /admin/qb/batch
func (h *QBHandler) BatchCreate(c *gin.Context) {
	var body models.QBAnswerKeyBatchInput
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	if len(body.Subjects) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "subjects cannot be empty"})
		return
	}

	tx, err := h.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer tx.Rollback()

	var startIdx int
	if err := tx.QueryRow(`SELECT COALESCE(MAX(idx), -1) + 1 FROM semester_subjects WHERE year = ?`, body.Year).Scan(&startIdx); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	stmt, err := tx.Prepare(`
		INSERT INTO semester_subjects (year, idx, code, name, qb1, qb2, ak1, ak2, sem_qb_with_ans)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer stmt.Close()

	for i, subject := range body.Subjects {
		if strings.TrimSpace(subject.SubjectCode) == "" || strings.TrimSpace(subject.SubjectName) == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "subject_code and subject_name are required"})
			return
		}
		if _, err := stmt.Exec(
			body.Year,
			startIdx+i,
			strings.TrimSpace(subject.SubjectCode),
			strings.TrimSpace(subject.SubjectName),
			subject.QB1,
			subject.QB2,
			subject.AK1,
			subject.AK2,
			subject.SemQBWithAns,
		); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Subjects added", "count": len(body.Subjects)})
}

// PUT /admin/qb/:id
func (h *QBHandler) Update(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var body models.QBAnswerKeyInput
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	res, err := h.DB.Exec(`
		UPDATE semester_subjects
		SET year=?, code=?, name=?, qb1=?, qb2=?, ak1=?, ak2=?, sem_qb_with_ans=?
		WHERE id=?`,
		body.Year,
		strings.TrimSpace(body.SubjectCode),
		strings.TrimSpace(body.SubjectName),
		body.QB1,
		body.QB2,
		body.AK1,
		body.AK2,
		body.SemQBWithAns,
		id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Record not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Subject updated"})
}

// DELETE /admin/qb/:id
func (h *QBHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	res, err := h.DB.Exec(`DELETE FROM semester_subjects WHERE id=?`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Record not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Deleted"})
}

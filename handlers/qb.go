package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

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
	query := `SELECT id, semester, subject_code, subject_name, year, answers, created_at, updated_at FROM qb_answer_keys WHERE 1=1`
	args := []any{}

	if s := c.Query("semester"); s != "" {
		query += " AND semester = ?"
		args = append(args, s)
	}
	if y := c.Query("year"); y != "" {
		query += " AND year = ?"
		args = append(args, y)
	}
	query += " ORDER BY semester, year, subject_code"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var items []models.QBAnswerKey
	for rows.Next() {
		var q models.QBAnswerKey
		if err := rows.Scan(&q.ID, &q.Semester, &q.SubjectCode, &q.SubjectName, &q.Year, &q.Answers, &q.CreatedAt, &q.UpdatedAt); err != nil {
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

	_, err := h.DB.Exec(`
		INSERT INTO qb_answer_keys (semester, subject_code, subject_name, year, answers)
		VALUES (?, ?, ?, ?, ?)`,
		body.Semester, body.SubjectCode, body.SubjectName, body.Year, body.Answers)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Answer key created"})
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
		UPDATE qb_answer_keys SET semester=?, subject_code=?, subject_name=?, year=?, answers=? WHERE id=?`,
		body.Semester, body.SubjectCode, body.SubjectName, body.Year, body.Answers, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Record not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Answer key updated"})
}

// DELETE /admin/qb/:id
func (h *QBHandler) Delete(c *gin.Context) {
	id := c.Param("id")
	res, err := h.DB.Exec(`DELETE FROM qb_answer_keys WHERE id=?`, id)
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
package handlers

import (
	"database/sql"
	"net/http"
	"strconv"

	"server/config"
	"server/data"
	"server/models"

	"github.com/gin-gonic/gin"
)

type SemesterHandler struct {
	DB *sql.DB
}

func NewSemesterHandler() *SemesterHandler {
	return &SemesterHandler{DB: config.DB}
}

func (h *SemesterHandler) GetSemesterByYear(c *gin.Context) {
	yearParam := c.Param("year")

	year, err := strconv.Atoi(yearParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid year format"})
		return
	}

	rows, err := h.DB.Query(`SELECT idx, code, name, qb1, qb2, ak1, ak2, sem_qb_with_ans FROM semester_subjects WHERE year = ? ORDER BY idx`, year)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.SemesterSubject
	for rows.Next() {
		var idx int
		var code, name, qb1, qb2, ak1, ak2, semqb sql.NullString
		if err := rows.Scan(&idx, &code, &name, &qb1, &qb2, &ak1, &ak2, &semqb); err != nil {
			continue
		}
		var s models.SemesterSubject
		if code.Valid {
			s.Code = &code.String
		}
		if name.Valid {
			s.Name = &name.String
		}
		if qb1.Valid {
			s.QB1 = &qb1.String
		}
		if qb2.Valid {
			s.QB2 = &qb2.String
		}
		if ak1.Valid {
			s.AK1 = &ak1.String
		}
		if ak2.Valid {
			s.AK2 = &ak2.String
		}
		if semqb.Valid {
			s.SemQBWithAns = &semqb.String
		}
		result = append(result, s)
	}

	if len(result) == 0 {
		// fallback to in-memory data if present
		if semData, ok := data.SemestersData[year]; ok {
			c.JSON(http.StatusOK, gin.H{"success": true, "year": year, "count": len(semData), "data": semData})
			return
		}
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Year not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "year": year, "count": len(result), "data": result})
}

// PUT /admin/semesters/:year
func (h *SemesterHandler) UpdateSemesterByYear(c *gin.Context) {
	yearParam := c.Param("year")

	year, err := strconv.Atoi(yearParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid year format"})
		return
	}

	var payload []models.SemesterSubject
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	tx, err := h.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer tx.Rollback()

	if _, err := tx.Exec(`DELETE FROM semester_subjects WHERE year = ?`, year); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	stmt, err := tx.Prepare(`INSERT INTO semester_subjects (year, idx, code, name, qb1, qb2, ak1, ak2, sem_qb_with_ans) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer stmt.Close()

	for i, item := range payload {
		var code, name, qb1, qb2, ak1, ak2, semqb interface{}
		if item.Code != nil {
			code = *item.Code
		} else {
			code = nil
		}
		if item.Name != nil {
			name = *item.Name
		} else {
			name = nil
		}
		if item.QB1 != nil {
			qb1 = *item.QB1
		} else {
			qb1 = nil
		}
		if item.QB2 != nil {
			qb2 = *item.QB2
		} else {
			qb2 = nil
		}
		if item.AK1 != nil {
			ak1 = *item.AK1
		} else {
			ak1 = nil
		}
		if item.AK2 != nil {
			ak2 = *item.AK2
		} else {
			ak2 = nil
		}
		if item.SemQBWithAns != nil {
			semqb = *item.SemQBWithAns
		} else {
			semqb = nil
		}

		if _, err := stmt.Exec(year, i, code, name, qb1, qb2, ak1, ak2, semqb); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	// also update in-memory map for compatibility
	data.SemestersData[year] = payload

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Semester data updated", "year": year, "count": len(payload)})
}

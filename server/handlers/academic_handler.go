package handlers

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"server/config"
	"server/models"
)

type AcademicHandler struct {
	DB *sql.DB
}

func NewAcademicHandler() *AcademicHandler {
	return &AcademicHandler{DB: config.DB}
}

// -----------------------------------------------------------------------------
// DEPENDENT DROPDOWN OPTIONS LOOKUP
// -----------------------------------------------------------------------------

func (h *AcademicHandler) GetAcademicOptions(c *gin.Context) {
	deptIDStr := c.Query("department_id")
	regIDStr := c.Query("regulation_id")
	semIDStr := c.Query("semester_id")

	// 1. Departments
	deptRows, err := h.DB.Query(`
		SELECT d.id, d.name, d.code, d.current_semester_id, COALESCE(s.semester_name, ''), COALESCE(s.semester_number, 0)
		FROM academic_departments d
		LEFT JOIN academic_semesters s ON d.current_semester_id = s.id
		WHERE d.status = 'active' ORDER BY d.name ASC
	`)
	var departments []models.Department
	if err == nil {
		defer deptRows.Close()
		for deptRows.Next() {
			var d models.Department
			deptRows.Scan(&d.ID, &d.Name, &d.Code, &d.CurrentSemesterID, &d.CurrentSemesterName, &d.CurrentSemesterNumber)
			departments = append(departments, d)
		}
	}
	if departments == nil {
		departments = []models.Department{}
	}

	// 2. Regulations
	regRows, err := h.DB.Query("SELECT id, name, year FROM academic_regulations WHERE status = 'active' ORDER BY year DESC")
	var regulations []models.Regulation
	if err == nil {
		defer regRows.Close()
		for regRows.Next() {
			var r models.Regulation
			regRows.Scan(&r.ID, &r.Name, &r.Year)
			regulations = append(regulations, r)
		}
	}
	if regulations == nil {
		regulations = []models.Regulation{}
	}

	// 3. Semesters
	semRows, err := h.DB.Query("SELECT id, semester_number, semester_name, year_number FROM academic_semesters WHERE status = 'active' ORDER BY semester_number ASC")
	var semesters []models.Semester
	if err == nil {
		defer semRows.Close()
		for semRows.Next() {
			var s models.Semester
			semRows.Scan(&s.ID, &s.SemesterNumber, &s.SemesterName, &s.YearNumber)
			semesters = append(semesters, s)
		}
	}
	if semesters == nil {
		semesters = []models.Semester{}
	}

	// 4. Courses (filtered if params passed)
	query := `
		SELECT c.id, c.department_id, COALESCE(d.name, ''), c.regulation_id, COALESCE(r.name, ''),
		       c.semester_id, COALESCE(s.semester_name, ''), c.code, c.name, COALESCE(c.short_name, ''),
		       c.is_elective
		FROM academic_courses c
		LEFT JOIN academic_departments d ON c.department_id = d.id
		LEFT JOIN academic_regulations r ON c.regulation_id = r.id
		LEFT JOIN academic_semesters s ON c.semester_id = s.id
		WHERE c.status = 'active'
	`
	var where []string
	var args []interface{}

	if deptIDStr != "" {
		where = append(where, "c.department_id = ?")
		args = append(args, deptIDStr)
	}
	if regIDStr != "" {
		where = append(where, "c.regulation_id = ?")
		args = append(args, regIDStr)
	}
	if semIDStr != "" {
		where = append(where, "c.semester_id = ?")
		args = append(args, semIDStr)
	}

	if len(where) > 0 {
		query += " AND " + strings.Join(where, " AND ")
	}
	query += " ORDER BY c.code ASC"

	cRows, err := h.DB.Query(query, args...)
	var courses []models.Course
	if err == nil {
		defer cRows.Close()
		for cRows.Next() {
			var cr models.Course
			cRows.Scan(&cr.ID, &cr.DepartmentID, &cr.DepartmentName, &cr.RegulationID, &cr.RegulationName,
				&cr.SemesterID, &cr.SemesterName, &cr.Code, &cr.Name, &cr.ShortName, &cr.IsElective)
			courses = append(courses, cr)
		}
	}
	if courses == nil {
		courses = []models.Course{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"departments": departments,
		"regulations": regulations,
		"semesters":   semesters,
		"courses":     courses,
	})
}

// -----------------------------------------------------------------------------
// 1. DEPARTMENTS
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListDepartments(c *gin.Context) {
	status := c.Query("status")
	query := `
		SELECT d.id, d.name, d.code, COALESCE(d.description, ''), d.current_semester_id, COALESCE(s.semester_name, ''), COALESCE(s.semester_number, 0), d.status, d.created_at, d.updated_at
		FROM academic_departments d
		LEFT JOIN academic_semesters s ON d.current_semester_id = s.id
	`
	var args []interface{}
	if status != "" {
		query += " WHERE d.status = ?"
		args = append(args, status)
	}
	query += " ORDER BY d.name ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Department
	for rows.Next() {
		var d models.Department
		if err := rows.Scan(&d.ID, &d.Name, &d.Code, &d.Description, &d.CurrentSemesterID, &d.CurrentSemesterName, &d.CurrentSemesterNumber, &d.Status, &d.CreatedAt, &d.UpdatedAt); err == nil {
			result = append(result, d)
		}
	}
	if result == nil {
		result = []models.Department{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) CreateDepartment(c *gin.Context) {
	var payload models.Department
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Name = strings.TrimSpace(payload.Name)
	payload.Code = strings.TrimSpace(strings.ToUpper(payload.Code))
	if payload.Name == "" || payload.Code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Department name and short code are required"})
		return
	}
	if payload.Status == "" {
		payload.Status = "active"
	}

	res, err := h.DB.Exec("INSERT INTO academic_departments (name, code, description, current_semester_id, status) VALUES (?, ?, ?, ?, ?)",
		payload.Name, payload.Code, payload.Description, payload.CurrentSemesterID, payload.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Department created successfully", "data": payload})
}

func (h *AcademicHandler) UpdateDepartment(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.Department
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Name = strings.TrimSpace(payload.Name)
	payload.Code = strings.TrimSpace(strings.ToUpper(payload.Code))
	if payload.Name == "" || payload.Code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Department name and short code are required"})
		return
	}

	_, err = h.DB.Exec("UPDATE academic_departments SET name = ?, code = ?, description = ?, current_semester_id = ?, status = ? WHERE id = ?",
		payload.Name, payload.Code, payload.Description, payload.CurrentSemesterID, payload.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Department updated successfully", "data": payload})
}

func (h *AcademicHandler) SetDepartmentCurrentSemester(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid Department ID"})
		return
	}
	var body struct {
		CurrentSemesterID *int `json:"current_semester_id"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	_, err = h.DB.Exec("UPDATE academic_departments SET current_semester_id = ? WHERE id = ?", body.CurrentSemesterID, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Department current semester updated successfully"})
}

func (h *AcademicHandler) DeleteDepartment(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_departments WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Department deleted successfully"})
}

// -----------------------------------------------------------------------------
// 2. REGULATIONS
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListRegulations(c *gin.Context) {
	status := c.Query("status")
	query := "SELECT id, name, year, COALESCE(description, ''), status, created_at, updated_at FROM academic_regulations"
	var args []interface{}
	if status != "" {
		query += " WHERE status = ?"
		args = append(args, status)
	}
	query += " ORDER BY year DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Regulation
	for rows.Next() {
		var r models.Regulation
		if err := rows.Scan(&r.ID, &r.Name, &r.Year, &r.Description, &r.Status, &r.CreatedAt, &r.UpdatedAt); err == nil {
			result = append(result, r)
		}
	}
	if result == nil {
		result = []models.Regulation{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) CreateRegulation(c *gin.Context) {
	var payload models.Regulation
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Name = strings.TrimSpace(payload.Name)
	if payload.Name == "" || payload.Year <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Regulation name and valid year are required"})
		return
	}
	if payload.Status == "" {
		payload.Status = "active"
	}

	res, err := h.DB.Exec("INSERT INTO academic_regulations (name, year, description, status) VALUES (?, ?, ?, ?)",
		payload.Name, payload.Year, payload.Description, payload.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Regulation created successfully", "data": payload})
}

func (h *AcademicHandler) UpdateRegulation(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.Regulation
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Name = strings.TrimSpace(payload.Name)
	if payload.Name == "" || payload.Year <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Regulation name and valid year are required"})
		return
	}

	_, err = h.DB.Exec("UPDATE academic_regulations SET name = ?, year = ?, description = ?, status = ? WHERE id = ?",
		payload.Name, payload.Year, payload.Description, payload.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Regulation updated successfully", "data": payload})
}

func (h *AcademicHandler) DeleteRegulation(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_regulations WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Regulation deleted successfully"})
}

// -----------------------------------------------------------------------------
// 3. BATCHES
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListBatches(c *gin.Context) {
	deptID := c.Query("department_id")
	regID := c.Query("regulation_id")
	status := c.Query("status")

	query := `
		SELECT b.id, b.department_id, d.name, b.regulation_id, r.name, b.start_year, b.end_year, b.batch_name, b.status, b.created_at, b.updated_at
		FROM academic_batches b
		JOIN academic_departments d ON b.department_id = d.id
		JOIN academic_regulations r ON b.regulation_id = r.id
	`
	var where []string
	var args []interface{}
	if deptID != "" {
		where = append(where, "b.department_id = ?")
		args = append(args, deptID)
	}
	if regID != "" {
		where = append(where, "b.regulation_id = ?")
		args = append(args, regID)
	}
	if status != "" {
		where = append(where, "b.status = ?")
		args = append(args, status)
	}
	if len(where) > 0 {
		query += " WHERE " + strings.Join(where, " AND ")
	}
	query += " ORDER BY b.start_year DESC, d.name ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Batch
	for rows.Next() {
		var b models.Batch
		if err := rows.Scan(&b.ID, &b.DepartmentID, &b.DepartmentName, &b.RegulationID, &b.RegulationName, &b.StartYear, &b.EndYear, &b.BatchName, &b.Status, &b.CreatedAt, &b.UpdatedAt); err == nil {
			result = append(result, b)
		}
	}
	if result == nil {
		result = []models.Batch{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) CreateBatch(c *gin.Context) {
	var payload models.Batch
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	if payload.DepartmentID <= 0 || payload.RegulationID <= 0 || payload.StartYear <= 0 || payload.EndYear <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Department, regulation, start year, and end year are required"})
		return
	}
	if strings.TrimSpace(payload.BatchName) == "" {
		payload.BatchName = fmt.Sprintf("%d-%d", payload.StartYear, payload.EndYear)
	}
	if payload.Status == "" {
		payload.Status = "active"
	}

	res, err := h.DB.Exec("INSERT INTO academic_batches (department_id, regulation_id, start_year, end_year, batch_name, status) VALUES (?, ?, ?, ?, ?, ?)",
		payload.DepartmentID, payload.RegulationID, payload.StartYear, payload.EndYear, payload.BatchName, payload.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Batch created successfully", "data": payload})
}

func (h *AcademicHandler) UpdateBatch(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.Batch
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	if payload.DepartmentID <= 0 || payload.RegulationID <= 0 || payload.StartYear <= 0 || payload.EndYear <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Department, regulation, start year, and end year are required"})
		return
	}
	if strings.TrimSpace(payload.BatchName) == "" {
		payload.BatchName = fmt.Sprintf("%d-%d", payload.StartYear, payload.EndYear)
	}

	_, err = h.DB.Exec("UPDATE academic_batches SET department_id = ?, regulation_id = ?, start_year = ?, end_year = ?, batch_name = ?, status = ? WHERE id = ?",
		payload.DepartmentID, payload.RegulationID, payload.StartYear, payload.EndYear, payload.BatchName, payload.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Batch updated successfully", "data": payload})
}

func (h *AcademicHandler) DeleteBatch(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_batches WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Batch deleted successfully"})
}

// -----------------------------------------------------------------------------
// 4. SEMESTERS
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListSemesters(c *gin.Context) {
	status := c.Query("status")
	query := "SELECT id, semester_number, semester_name, year_number, status, created_at, updated_at FROM academic_semesters"
	var args []interface{}
	if status != "" {
		query += " WHERE status = ?"
		args = append(args, status)
	}
	query += " ORDER BY semester_number ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Semester
	for rows.Next() {
		var s models.Semester
		if err := rows.Scan(&s.ID, &s.SemesterNumber, &s.SemesterName, &s.YearNumber, &s.Status, &s.CreatedAt, &s.UpdatedAt); err == nil {
			result = append(result, s)
		}
	}
	if result == nil {
		result = []models.Semester{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) CreateSemester(c *gin.Context) {
	var payload models.Semester
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	if payload.SemesterNumber <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Valid semester number is required"})
		return
	}
	if strings.TrimSpace(payload.SemesterName) == "" {
		payload.SemesterName = fmt.Sprintf("Semester %d", payload.SemesterNumber)
	}
	if payload.YearNumber <= 0 {
		payload.YearNumber = (payload.SemesterNumber + 1) / 2
	}
	if payload.Status == "" {
		payload.Status = "active"
	}

	res, err := h.DB.Exec("INSERT INTO academic_semesters (semester_number, semester_name, year_number, status) VALUES (?, ?, ?, ?)",
		payload.SemesterNumber, payload.SemesterName, payload.YearNumber, payload.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Semester created successfully", "data": payload})
}

func (h *AcademicHandler) UpdateSemester(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.Semester
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	if payload.SemesterNumber <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Valid semester number is required"})
		return
	}
	if strings.TrimSpace(payload.SemesterName) == "" {
		payload.SemesterName = fmt.Sprintf("Semester %d", payload.SemesterNumber)
	}
	if payload.YearNumber <= 0 {
		payload.YearNumber = (payload.SemesterNumber + 1) / 2
	}

	_, err = h.DB.Exec("UPDATE academic_semesters SET semester_number = ?, semester_name = ?, year_number = ?, status = ? WHERE id = ?",
		payload.SemesterNumber, payload.SemesterName, payload.YearNumber, payload.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Semester updated successfully", "data": payload})
}

func (h *AcademicHandler) DeleteSemester(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_semesters WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Semester deleted successfully"})
}

// -----------------------------------------------------------------------------
// 5. COURSES (MAPPED DIRECTLY TO DEPARTMENT, REGULATION, AND SEMESTER)
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListCourses(c *gin.Context) {
	deptID := c.Query("department_id")
	regID := c.Query("regulation_id")
	semID := c.Query("semester_id")
	search := strings.TrimSpace(c.Query("search"))
	status := c.Query("status")

	query := `
		SELECT c.id, c.department_id, COALESCE(d.name, ''), c.regulation_id, COALESCE(r.name, ''),
		       c.semester_id, COALESCE(s.semester_name, ''), COALESCE(s.semester_number, 0),
		       c.code, c.name, COALESCE(c.short_name, ''), c.is_elective,
		       COALESCE(c.description, ''), c.status, c.created_at, c.updated_at
		FROM academic_courses c
		LEFT JOIN academic_departments d ON c.department_id = d.id
		LEFT JOIN academic_regulations r ON c.regulation_id = r.id
		LEFT JOIN academic_semesters s ON c.semester_id = s.id
	`
	var where []string
	var args []interface{}

	if deptID != "" {
		where = append(where, "c.department_id = ?")
		args = append(args, deptID)
	}
	if regID != "" {
		where = append(where, "c.regulation_id = ?")
		args = append(args, regID)
	}
	if semID != "" {
		where = append(where, "c.semester_id = ?")
		args = append(args, semID)
	}
	if search != "" {
		where = append(where, "(c.code LIKE ? OR c.name LIKE ? OR c.short_name LIKE ?)")
		searchTerm := "%" + search + "%"
		args = append(args, searchTerm, searchTerm, searchTerm)
	}
	if status != "" {
		where = append(where, "c.status = ?")
		args = append(args, status)
	}
	if len(where) > 0 {
		query += " WHERE " + strings.Join(where, " AND ")
	}
	query += " ORDER BY s.semester_number ASC, c.code ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Course
	for rows.Next() {
		var cr models.Course
		if err := rows.Scan(&cr.ID, &cr.DepartmentID, &cr.DepartmentName, &cr.RegulationID, &cr.RegulationName,
			&cr.SemesterID, &cr.SemesterName, &cr.SemesterNumber,
			&cr.Code, &cr.Name, &cr.ShortName, &cr.IsElective, &cr.Description, &cr.Status, &cr.CreatedAt, &cr.UpdatedAt); err == nil {
			result = append(result, cr)
		}
	}
	if result == nil {
		result = []models.Course{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) CreateCourse(c *gin.Context) {
	var payload models.Course
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Code = strings.TrimSpace(strings.ToUpper(payload.Code))
	payload.Name = strings.TrimSpace(payload.Name)
	if payload.Code == "" || payload.Name == "" || payload.DepartmentID <= 0 || payload.RegulationID <= 0 || payload.SemesterID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Department, Regulation, Semester, Course Code, and Course Name are required"})
		return
	}
	if payload.Status == "" {
		payload.Status = "active"
	}

	res, err := h.DB.Exec(`
		INSERT INTO academic_courses (department_id, regulation_id, semester_id, code, name, short_name, is_elective, description, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, payload.DepartmentID, payload.RegulationID, payload.SemesterID, payload.Code, payload.Name, payload.ShortName, payload.IsElective, payload.Description, payload.Status)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Course mapped successfully", "data": payload})
}

func (h *AcademicHandler) UpdateCourse(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.Course
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Code = strings.TrimSpace(strings.ToUpper(payload.Code))
	payload.Name = strings.TrimSpace(payload.Name)
	if payload.Code == "" || payload.Name == "" || payload.DepartmentID <= 0 || payload.RegulationID <= 0 || payload.SemesterID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Department, Regulation, Semester, Course Code, and Course Name are required"})
		return
	}

	_, err = h.DB.Exec(`
		UPDATE academic_courses
		SET department_id = ?, regulation_id = ?, semester_id = ?, code = ?, name = ?, short_name = ?, is_elective = ?, description = ?, status = ?
		WHERE id = ?
	`, payload.DepartmentID, payload.RegulationID, payload.SemesterID, payload.Code, payload.Name, payload.ShortName, payload.IsElective, payload.Description, payload.Status, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Course updated successfully", "data": payload})
}

func (h *AcademicHandler) DeleteCourse(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_courses WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Course deleted successfully"})
}

func (h *AcademicHandler) BulkUploadCourses(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "CSV file is required"})
		return
	}

	f, err := file.Open()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Failed to open uploaded file"})
		return
	}
	defer f.Close()

	reader := csv.NewReader(f)
	reader.TrimLeadingSpace = true

	rows, err := reader.ReadAll()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Failed to parse CSV file: " + err.Error()})
		return
	}

	if len(rows) <= 1 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "CSV file is empty or only contains header row"})
		return
	}

	// 1. Fetch Department Lookup Map (UPPER(code) -> id)
	deptMap := make(map[string]int)
	dRows, err := h.DB.Query("SELECT id, UPPER(code) FROM academic_departments")
	if err == nil {
		defer dRows.Close()
		for dRows.Next() {
			var id int
			var code string
			dRows.Scan(&id, &code)
			deptMap[code] = id
		}
	}

	// 2. Fetch Regulation Lookup Map (year -> id)
	regMap := make(map[int]int)
	rRows, err := h.DB.Query("SELECT id, year FROM academic_regulations")
	if err == nil {
		defer rRows.Close()
		for rRows.Next() {
			var id, year int
			rRows.Scan(&id, &year)
			regMap[year] = id
		}
	}

	// 3. Fetch Semester Lookup Map (semester_number -> id)
	semMap := make(map[int]int)
	sRows, err := h.DB.Query("SELECT id, semester_number FROM academic_semesters")
	if err == nil {
		defer sRows.Close()
		for sRows.Next() {
			var id, num int
			sRows.Scan(&id, &num)
			semMap[num] = id
		}
	}

	var successCount int
	var failedCount int
	var errorMessages []string

	// Process data rows (skip header line 0)
	for idx, row := range rows[1:] {
		lineNum := idx + 2
		if len(row) < 5 {
			failedCount++
			errorMessages = append(errorMessages, fmt.Sprintf("Line %d: Incomplete columns (expected at least 5)", lineNum))
			continue
		}

		deptCode := strings.TrimSpace(strings.ToUpper(row[0]))
		regYearStr := strings.TrimSpace(row[1])
		semNumStr := strings.TrimSpace(row[2])
		courseCode := strings.TrimSpace(strings.ToUpper(row[3]))
		courseName := strings.TrimSpace(row[4])
		shortName := ""
		if len(row) > 5 {
			shortName = strings.TrimSpace(row[5])
		}
		isElectiveStr := ""
		if len(row) > 6 {
			isElectiveStr = strings.ToLower(strings.TrimSpace(row[6]))
		}
		description := ""
		if len(row) > 7 {
			description = strings.TrimSpace(row[7])
		}

		if deptCode == "" || regYearStr == "" || semNumStr == "" || courseCode == "" || courseName == "" {
			failedCount++
			errorMessages = append(errorMessages, fmt.Sprintf("Line %d: Department code, regulation year, semester number, course code, and course name are required", lineNum))
			continue
		}

		deptID, ok := deptMap[deptCode]
		if !ok {
			failedCount++
			errorMessages = append(errorMessages, fmt.Sprintf("Line %d: Department code '%s' not found", lineNum, deptCode))
			continue
		}

		regYear, _ := strconv.Atoi(regYearStr)
		regID, ok := regMap[regYear]
		if !ok {
			failedCount++
			errorMessages = append(errorMessages, fmt.Sprintf("Line %d: Regulation for year %d not found", lineNum, regYear))
			continue
		}

		semNum, _ := strconv.Atoi(semNumStr)
		semID, ok := semMap[semNum]
		if !ok {
			failedCount++
			errorMessages = append(errorMessages, fmt.Sprintf("Line %d: Semester %d not found", lineNum, semNum))
			continue
		}

		isElective := isElectiveStr == "true" || isElectiveStr == "1" || isElectiveStr == "yes"

		// Check if course mapping already exists
		var existingID int
		err := h.DB.QueryRow("SELECT id FROM academic_courses WHERE department_id = ? AND regulation_id = ? AND semester_id = ? AND code = ?",
			deptID, regID, semID, courseCode).Scan(&existingID)

		if err == nil && existingID > 0 {
			// Update existing mapping
			_, uErr := h.DB.Exec(`
				UPDATE academic_courses SET name = ?, short_name = ?, is_elective = ?, description = ?, status = 'active'
				WHERE id = ?
			`, courseName, shortName, isElective, description, existingID)
			if uErr != nil {
				failedCount++
				errorMessages = append(errorMessages, fmt.Sprintf("Line %d: Failed to update course: %v", lineNum, uErr))
			} else {
				successCount++
			}
		} else {
			// Insert new course mapping
			_, iErr := h.DB.Exec(`
				INSERT INTO academic_courses (department_id, regulation_id, semester_id, code, name, short_name, is_elective, description, status)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
			`, deptID, regID, semID, courseCode, courseName, shortName, isElective, description)
			if iErr != nil {
				failedCount++
				errorMessages = append(errorMessages, fmt.Sprintf("Line %d: Failed to insert course: %v", lineNum, iErr))
			} else {
				successCount++
			}
		}
	}

	if errorMessages == nil {
		errorMessages = []string{}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Bulk upload processed: %d succeeded, %d failed", successCount, failedCount),
		"data": gin.H{
			"total_rows":    len(rows) - 1,
			"success_count": successCount,
			"failed_count":  failedCount,
			"errors":        errorMessages,
		},
	})
}

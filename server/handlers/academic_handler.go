package handlers

import (
	"database/sql"
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
	deptRows, err := h.DB.Query("SELECT id, name, code FROM academic_departments WHERE status = 'active' ORDER BY name ASC")
	var departments []models.Department
	if err == nil {
		defer deptRows.Close()
		for deptRows.Next() {
			var d models.Department
			deptRows.Scan(&d.ID, &d.Name, &d.Code)
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

	// 4. Courses (master list or narrowed by curriculum if department & regulation & semester provided)
	var courses []models.Course
	if deptIDStr != "" && regIDStr != "" && semIDStr != "" {
		dID, _ := strconv.Atoi(deptIDStr)
		rID, _ := strconv.Atoi(regIDStr)
		sID, _ := strconv.Atoi(semIDStr)

		cRows, err := h.DB.Query(`
			SELECT c.id, c.code, c.name, COALESCE(c.short_name,''), c.credits, c.course_type
			FROM academic_curriculum cu
			JOIN academic_courses c ON cu.course_id = c.id
			WHERE cu.department_id = ? AND cu.regulation_id = ? AND cu.semester_id = ? AND c.status = 'active'
			ORDER BY cu.course_order ASC, c.code ASC
		`, dID, rID, sID)
		if err == nil {
			defer cRows.Close()
			for cRows.Next() {
				var cr models.Course
				cRows.Scan(&cr.ID, &cr.Code, &cr.Name, &cr.ShortName, &cr.Credits, &cr.CourseType)
				courses = append(courses, cr)
			}
		}
	}

	// Fallback to all active master courses if filtered set is empty or no filter was passed
	if len(courses) == 0 {
		cRows, err := h.DB.Query("SELECT id, code, name, COALESCE(short_name,''), credits, course_type FROM academic_courses WHERE status = 'active' ORDER BY code ASC")
		if err == nil {
			defer cRows.Close()
			for cRows.Next() {
				var cr models.Course
				cRows.Scan(&cr.ID, &cr.Code, &cr.Name, &cr.ShortName, &cr.Credits, &cr.CourseType)
				courses = append(courses, cr)
			}
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
	query := "SELECT id, name, code, COALESCE(description, ''), status, created_at, updated_at FROM academic_departments"
	var args []interface{}
	if status != "" {
		query += " WHERE status = ?"
		args = append(args, status)
	}
	query += " ORDER BY name ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Department
	for rows.Next() {
		var d models.Department
		if err := rows.Scan(&d.ID, &d.Name, &d.Code, &d.Description, &d.Status, &d.CreatedAt, &d.UpdatedAt); err == nil {
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

	res, err := h.DB.Exec("INSERT INTO academic_departments (name, code, description, status) VALUES (?, ?, ?, ?)",
		payload.Name, payload.Code, payload.Description, payload.Status)
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

	_, err = h.DB.Exec("UPDATE academic_departments SET name = ?, code = ?, description = ?, status = ? WHERE id = ?",
		payload.Name, payload.Code, payload.Description, payload.Status, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Department updated successfully", "data": payload})
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
// 5. COURSES (MASTER LIST)
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListCourses(c *gin.Context) {
	search := strings.TrimSpace(c.Query("search"))
	courseType := c.Query("course_type")
	status := c.Query("status")

	query := "SELECT id, code, name, COALESCE(short_name, ''), credits, course_type, COALESCE(description, ''), status, created_at, updated_at FROM academic_courses"
	var where []string
	var args []interface{}

	if search != "" {
		where = append(where, "(code LIKE ? OR name LIKE ? OR short_name LIKE ?)")
		searchTerm := "%" + search + "%"
		args = append(args, searchTerm, searchTerm, searchTerm)
	}
	if courseType != "" {
		where = append(where, "course_type = ?")
		args = append(args, courseType)
	}
	if status != "" {
		where = append(where, "status = ?")
		args = append(args, status)
	}
	if len(where) > 0 {
		query += " WHERE " + strings.Join(where, " AND ")
	}
	query += " ORDER BY code ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Course
	for rows.Next() {
		var cr models.Course
		if err := rows.Scan(&cr.ID, &cr.Code, &cr.Name, &cr.ShortName, &cr.Credits, &cr.CourseType, &cr.Description, &cr.Status, &cr.CreatedAt, &cr.UpdatedAt); err == nil {
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
	if payload.Code == "" || payload.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Course code and course name are required"})
		return
	}
	if payload.CourseType == "" {
		payload.CourseType = "Theory"
	}
	if payload.Status == "" {
		payload.Status = "active"
	}

	res, err := h.DB.Exec("INSERT INTO academic_courses (code, name, short_name, credits, course_type, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
		payload.Code, payload.Name, payload.ShortName, payload.Credits, payload.CourseType, payload.Description, payload.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Course created successfully", "data": payload})
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
	if payload.Code == "" || payload.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Course code and course name are required"})
		return
	}

	_, err = h.DB.Exec("UPDATE academic_courses SET code = ?, name = ?, short_name = ?, credits = ?, course_type = ?, description = ?, status = ? WHERE id = ?",
		payload.Code, payload.Name, payload.ShortName, payload.Credits, payload.CourseType, payload.Description, payload.Status, id)
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

// -----------------------------------------------------------------------------
// 6. CURRICULUM (COURSE ASSIGNMENT)
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListCurriculum(c *gin.Context) {
	deptID := c.Query("department_id")
	regID := c.Query("regulation_id")
	semID := c.Query("semester_id")
	status := c.Query("status")

	query := `
		SELECT cu.id, cu.department_id, d.name, cu.regulation_id, r.name,
		       cu.semester_id, s.semester_name, s.semester_number, cu.course_id, c.code, c.name, c.credits, c.course_type,
		       cu.is_elective, cu.course_order, cu.status, cu.created_at, cu.updated_at
		FROM academic_curriculum cu
		JOIN academic_departments d ON cu.department_id = d.id
		JOIN academic_regulations r ON cu.regulation_id = r.id
		JOIN academic_semesters s ON cu.semester_id = s.id
		JOIN academic_courses c ON cu.course_id = c.id
	`
	var where []string
	var args []interface{}

	if deptID != "" {
		where = append(where, "cu.department_id = ?")
		args = append(args, deptID)
	}
	if regID != "" {
		where = append(where, "cu.regulation_id = ?")
		args = append(args, regID)
	}
	if semID != "" {
		where = append(where, "cu.semester_id = ?")
		args = append(args, semID)
	}
	if status != "" {
		where = append(where, "cu.status = ?")
		args = append(args, status)
	}

	if len(where) > 0 {
		query += " WHERE " + strings.Join(where, " AND ")
	}
	query += " ORDER BY s.semester_number ASC, cu.course_order ASC, c.code ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Curriculum
	for rows.Next() {
		var cu models.Curriculum
		if err := rows.Scan(&cu.ID, &cu.DepartmentID, &cu.DepartmentName, &cu.RegulationID, &cu.RegulationName,
			&cu.SemesterID, &cu.SemesterName, &cu.SemesterNumber, &cu.CourseID, &cu.CourseCode, &cu.CourseName, &cu.CourseCredits, &cu.CourseType,
			&cu.IsElective, &cu.CourseOrder, &cu.Status, &cu.CreatedAt, &cu.UpdatedAt); err == nil {
			result = append(result, cu)
		}
	}
	if result == nil {
		result = []models.Curriculum{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) AssignCurriculum(c *gin.Context) {
	var payload models.Curriculum
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	if payload.DepartmentID <= 0 || payload.RegulationID <= 0 || payload.SemesterID <= 0 || payload.CourseID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Department, Regulation, Semester, and Course are required"})
		return
	}
	if payload.Status == "" {
		payload.Status = "active"
	}

	res, err := h.DB.Exec(`
		INSERT INTO academic_curriculum (department_id, regulation_id, semester_id, course_id, is_elective, course_order, status)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, payload.DepartmentID, payload.RegulationID, payload.SemesterID, payload.CourseID, payload.IsElective, payload.CourseOrder, payload.Status)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Course assigned to curriculum successfully", "data": payload})
}

func (h *AcademicHandler) UpdateCurriculum(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.Curriculum
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	_, err = h.DB.Exec(`
		UPDATE academic_curriculum
		SET department_id = ?, regulation_id = ?, semester_id = ?, course_id = ?, is_elective = ?, course_order = ?, status = ?
		WHERE id = ?
	`, payload.DepartmentID, payload.RegulationID, payload.SemesterID, payload.CourseID, payload.IsElective, payload.CourseOrder, payload.Status, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Curriculum assignment updated successfully", "data": payload})
}

func (h *AcademicHandler) DeleteCurriculum(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_curriculum WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Course removed from curriculum"})
}

// -----------------------------------------------------------------------------
// 7. MATERIALS MANAGEMENT
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListMaterials(c *gin.Context) {
	courseID := c.Query("course_id")
	materialType := c.Query("material_type")
	unit := c.Query("unit")
	status := c.Query("status")

	query := `
		SELECT m.id, m.course_id, c.code, c.name, m.title, COALESCE(m.description, ''), m.material_type, m.file_url, COALESCE(m.unit, ''), m.item_order, m.status, m.created_at, m.updated_at
		FROM academic_materials m
		JOIN academic_courses c ON m.course_id = c.id
	`
	var where []string
	var args []interface{}

	if courseID != "" {
		where = append(where, "m.course_id = ?")
		args = append(args, courseID)
	}
	if materialType != "" {
		where = append(where, "m.material_type = ?")
		args = append(args, materialType)
	}
	if unit != "" {
		where = append(where, "m.unit = ?")
		args = append(args, unit)
	}
	if status != "" {
		where = append(where, "m.status = ?")
		args = append(args, status)
	}

	if len(where) > 0 {
		query += " WHERE " + strings.Join(where, " AND ")
	}
	query += " ORDER BY m.item_order ASC, m.created_at DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Material
	for rows.Next() {
		var m models.Material
		if err := rows.Scan(&m.ID, &m.CourseID, &m.CourseCode, &m.CourseName, &m.Title, &m.Description, &m.MaterialType, &m.FileURL, &m.Unit, &m.ItemOrder, &m.Status, &m.CreatedAt, &m.UpdatedAt); err == nil {
			result = append(result, m)
		}
	}
	if result == nil {
		result = []models.Material{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) CreateMaterial(c *gin.Context) {
	var payload models.Material
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Title = strings.TrimSpace(payload.Title)
	payload.FileURL = strings.TrimSpace(payload.FileURL)
	if payload.CourseID <= 0 || payload.Title == "" || payload.FileURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Course, title, and file/link URL are required"})
		return
	}
	if payload.MaterialType == "" {
		payload.MaterialType = "Notes"
	}
	if payload.Status == "" {
		payload.Status = "published"
	}

	res, err := h.DB.Exec(`
		INSERT INTO academic_materials (course_id, title, description, material_type, file_url, unit, item_order, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, payload.CourseID, payload.Title, payload.Description, payload.MaterialType, payload.FileURL, payload.Unit, payload.ItemOrder, payload.Status)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Material created successfully", "data": payload})
}

func (h *AcademicHandler) UpdateMaterial(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.Material
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Title = strings.TrimSpace(payload.Title)
	payload.FileURL = strings.TrimSpace(payload.FileURL)
	if payload.CourseID <= 0 || payload.Title == "" || payload.FileURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Course, title, and file/link URL are required"})
		return
	}

	_, err = h.DB.Exec(`
		UPDATE academic_materials
		SET course_id = ?, title = ?, description = ?, material_type = ?, file_url = ?, unit = ?, item_order = ?, status = ?
		WHERE id = ?
	`, payload.CourseID, payload.Title, payload.Description, payload.MaterialType, payload.FileURL, payload.Unit, payload.ItemOrder, payload.Status, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Material updated successfully", "data": payload})
}

func (h *AcademicHandler) DeleteMaterial(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_materials WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Material deleted successfully"})
}

// -----------------------------------------------------------------------------
// 8. EXAMS
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListExams(c *gin.Context) {
	academicYear := c.Query("academic_year")
	deptID := c.Query("department_id")
	regID := c.Query("regulation_id")
	semID := c.Query("semester_id")
	examType := c.Query("exam_type")
	status := c.Query("status")

	query := `
		SELECT e.id, e.name, e.exam_type, e.academic_year, e.department_id, d.name, e.regulation_id, r.name,
		       e.semester_id, s.semester_name,
		       DATE_FORMAT(e.start_date, '%Y-%m-%d'), DATE_FORMAT(e.end_date, '%Y-%m-%d'),
		       COALESCE(e.description, ''), e.status, e.created_at, e.updated_at
		FROM academic_exams e
		JOIN academic_departments d ON e.department_id = d.id
		JOIN academic_regulations r ON e.regulation_id = r.id
		JOIN academic_semesters s ON e.semester_id = s.id
	`
	var where []string
	var args []interface{}

	if academicYear != "" {
		where = append(where, "e.academic_year = ?")
		args = append(args, academicYear)
	}
	if deptID != "" {
		where = append(where, "e.department_id = ?")
		args = append(args, deptID)
	}
	if regID != "" {
		where = append(where, "e.regulation_id = ?")
		args = append(args, regID)
	}
	if semID != "" {
		where = append(where, "e.semester_id = ?")
		args = append(args, semID)
	}
	if examType != "" {
		where = append(where, "e.exam_type = ?")
		args = append(args, examType)
	}
	if status != "" {
		where = append(where, "e.status = ?")
		args = append(args, status)
	}

	if len(where) > 0 {
		query += " WHERE " + strings.Join(where, " AND ")
	}
	query += " ORDER BY e.created_at DESC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.Exam
	for rows.Next() {
		var e models.Exam
		var sDate, eDate sql.NullString
		if err := rows.Scan(&e.ID, &e.Name, &e.ExamType, &e.AcademicYear, &e.DepartmentID, &e.DepartmentName, &e.RegulationID, &e.RegulationName,
			&e.SemesterID, &e.SemesterName, &sDate, &eDate, &e.Description, &e.Status, &e.CreatedAt, &e.UpdatedAt); err == nil {
			if sDate.Valid {
				e.StartDate = &sDate.String
			}
			if eDate.Valid {
				e.EndDate = &eDate.String
			}
			result = append(result, e)
		}
	}
	if result == nil {
		result = []models.Exam{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) CreateExam(c *gin.Context) {
	var payload models.Exam
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Name = strings.TrimSpace(payload.Name)
	if payload.Name == "" || payload.AcademicYear == "" || payload.DepartmentID <= 0 || payload.RegulationID <= 0 || payload.SemesterID <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Exam name, academic year, department, regulation, and semester are required"})
		return
	}
	if payload.ExamType == "" {
		payload.ExamType = "End Semester Examination"
	}
	if payload.Status == "" {
		payload.Status = "scheduled"
	}

	var startDate, endDate interface{}
	if payload.StartDate != nil && *payload.StartDate != "" {
		startDate = *payload.StartDate
	} else {
		startDate = nil
	}
	if payload.EndDate != nil && *payload.EndDate != "" {
		endDate = *payload.EndDate
	} else {
		endDate = nil
	}

	res, err := h.DB.Exec(`
		INSERT INTO academic_exams (name, exam_type, academic_year, department_id, regulation_id, semester_id, start_date, end_date, description, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, payload.Name, payload.ExamType, payload.AcademicYear, payload.DepartmentID, payload.RegulationID, payload.SemesterID, startDate, endDate, payload.Description, payload.Status)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Exam created successfully", "data": payload})
}

func (h *AcademicHandler) UpdateExam(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.Exam
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	var startDate, endDate interface{}
	if payload.StartDate != nil && *payload.StartDate != "" {
		startDate = *payload.StartDate
	} else {
		startDate = nil
	}
	if payload.EndDate != nil && *payload.EndDate != "" {
		endDate = *payload.EndDate
	} else {
		endDate = nil
	}

	_, err = h.DB.Exec(`
		UPDATE academic_exams
		SET name = ?, exam_type = ?, academic_year = ?, department_id = ?, regulation_id = ?, semester_id = ?, start_date = ?, end_date = ?, description = ?, status = ?
		WHERE id = ?
	`, payload.Name, payload.ExamType, payload.AcademicYear, payload.DepartmentID, payload.RegulationID, payload.SemesterID, startDate, endDate, payload.Description, payload.Status, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Exam updated successfully", "data": payload})
}

func (h *AcademicHandler) DeleteExam(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_exams WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Exam deleted successfully"})
}

// -----------------------------------------------------------------------------
// 9. EXAM SCHEDULES
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListExamSchedules(c *gin.Context) {
	examID := c.Query("exam_id")
	courseID := c.Query("course_id")

	query := `
		SELECT es.id, es.exam_id, e.name, es.course_id, c.code, c.name,
		       DATE_FORMAT(es.exam_date, '%Y-%m-%d'), es.start_time, es.end_time, es.venue, COALESCE(es.instructions, ''), es.status, es.created_at, es.updated_at
		FROM academic_exam_schedules es
		JOIN academic_exams e ON es.exam_id = e.id
		JOIN academic_courses c ON es.course_id = c.id
	`
	var where []string
	var args []interface{}

	if examID != "" {
		where = append(where, "es.exam_id = ?")
		args = append(args, examID)
	}
	if courseID != "" {
		where = append(where, "es.course_id = ?")
		args = append(args, courseID)
	}

	if len(where) > 0 {
		query += " WHERE " + strings.Join(where, " AND ")
	}
	query += " ORDER BY es.exam_date ASC, es.start_time ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.ExamSchedule
	for rows.Next() {
		var es models.ExamSchedule
		if err := rows.Scan(&es.ID, &es.ExamID, &es.ExamName, &es.CourseID, &es.CourseCode, &es.CourseName,
			&es.ExamDate, &es.StartTime, &es.EndTime, &es.Venue, &es.Instructions, &es.Status, &es.CreatedAt, &es.UpdatedAt); err == nil {
			result = append(result, es)
		}
	}
	if result == nil {
		result = []models.ExamSchedule{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) CreateExamSchedule(c *gin.Context) {
	var payload models.ExamSchedule
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.Venue = strings.TrimSpace(payload.Venue)
	if payload.ExamID <= 0 || payload.CourseID <= 0 || payload.ExamDate == "" || payload.StartTime == "" || payload.EndTime == "" || payload.Venue == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Exam, course, date, start time, end time, and venue are required"})
		return
	}
	if payload.Status == "" {
		payload.Status = "scheduled"
	}

	res, err := h.DB.Exec(`
		INSERT INTO academic_exam_schedules (exam_id, course_id, exam_date, start_time, end_time, venue, instructions, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`, payload.ExamID, payload.CourseID, payload.ExamDate, payload.StartTime, payload.EndTime, payload.Venue, payload.Instructions, payload.Status)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Exam schedule added successfully", "data": payload})
}

func (h *AcademicHandler) UpdateExamSchedule(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.ExamSchedule
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	_, err = h.DB.Exec(`
		UPDATE academic_exam_schedules
		SET exam_id = ?, course_id = ?, exam_date = ?, start_time = ?, end_time = ?, venue = ?, instructions = ?, status = ?
		WHERE id = ?
	`, payload.ExamID, payload.CourseID, payload.ExamDate, payload.StartTime, payload.EndTime, payload.Venue, payload.Instructions, payload.Status, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Exam schedule updated successfully", "data": payload})
}

func (h *AcademicHandler) DeleteExamSchedule(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_exam_schedules WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Exam schedule deleted successfully"})
}

// -----------------------------------------------------------------------------
// 10. QUESTION PAPERS
// -----------------------------------------------------------------------------

func (h *AcademicHandler) ListQuestionPapers(c *gin.Context) {
	courseID := c.Query("course_id")
	examType := c.Query("exam_type")
	academicYear := c.Query("academic_year")
	regID := c.Query("regulation_id")
	semID := c.Query("semester_id")
	status := c.Query("status")

	query := `
		SELECT q.id, q.course_id, c.code, c.name, q.exam_type, q.academic_year, q.regulation_id, r.name,
		       q.semester_id, s.semester_name, q.year_number, q.file_url, COALESCE(q.description, ''), q.status, q.created_at, q.updated_at
		FROM academic_question_papers q
		JOIN academic_courses c ON q.course_id = c.id
		JOIN academic_regulations r ON q.regulation_id = r.id
		JOIN academic_semesters s ON q.semester_id = s.id
	`
	var where []string
	var args []interface{}

	if courseID != "" {
		where = append(where, "q.course_id = ?")
		args = append(args, courseID)
	}
	if examType != "" {
		where = append(where, "q.exam_type = ?")
		args = append(args, examType)
	}
	if academicYear != "" {
		where = append(where, "q.academic_year = ?")
		args = append(args, academicYear)
	}
	if regID != "" {
		where = append(where, "q.regulation_id = ?")
		args = append(args, regID)
	}
	if semID != "" {
		where = append(where, "q.semester_id = ?")
		args = append(args, semID)
	}
	if status != "" {
		where = append(where, "q.status = ?")
		args = append(args, status)
	}

	if len(where) > 0 {
		query += " WHERE " + strings.Join(where, " AND ")
	}
	query += " ORDER BY q.academic_year DESC, c.code ASC"

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var result []models.QuestionPaper
	for rows.Next() {
		var qp models.QuestionPaper
		if err := rows.Scan(&qp.ID, &qp.CourseID, &qp.CourseCode, &qp.CourseName, &qp.ExamType, &qp.AcademicYear, &qp.RegulationID, &qp.RegulationName,
			&qp.SemesterID, &qp.SemesterName, &qp.YearNumber, &qp.FileURL, &qp.Description, &qp.Status, &qp.CreatedAt, &qp.UpdatedAt); err == nil {
			result = append(result, qp)
		}
	}
	if result == nil {
		result = []models.QuestionPaper{}
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "data": result})
}

func (h *AcademicHandler) CreateQuestionPaper(c *gin.Context) {
	var payload models.QuestionPaper
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.FileURL = strings.TrimSpace(payload.FileURL)
	if payload.CourseID <= 0 || payload.RegulationID <= 0 || payload.SemesterID <= 0 || payload.AcademicYear == "" || payload.FileURL == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Course, regulation, semester, academic year, and question paper file URL are required"})
		return
	}
	if payload.ExamType == "" {
		payload.ExamType = "End Semester Examination"
	}
	if payload.YearNumber <= 0 {
		payload.YearNumber = 1
	}
	if payload.Status == "" {
		payload.Status = "active"
	}

	res, err := h.DB.Exec(`
		INSERT INTO academic_question_papers (course_id, exam_type, academic_year, regulation_id, semester_id, year_number, file_url, description, status)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, payload.CourseID, payload.ExamType, payload.AcademicYear, payload.RegulationID, payload.SemesterID, payload.YearNumber, payload.FileURL, payload.Description, payload.Status)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "Question paper uploaded successfully", "data": payload})
}

func (h *AcademicHandler) UpdateQuestionPaper(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	var payload models.QuestionPaper
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	_, err = h.DB.Exec(`
		UPDATE academic_question_papers
		SET course_id = ?, exam_type = ?, academic_year = ?, regulation_id = ?, semester_id = ?, year_number = ?, file_url = ?, description = ?, status = ?
		WHERE id = ?
	`, payload.CourseID, payload.ExamType, payload.AcademicYear, payload.RegulationID, payload.SemesterID, payload.YearNumber, payload.FileURL, payload.Description, payload.Status, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Question paper updated successfully", "data": payload})
}

func (h *AcademicHandler) DeleteQuestionPaper(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid ID"})
		return
	}
	_, err = h.DB.Exec("DELETE FROM academic_question_papers WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Question paper deleted successfully"})
}

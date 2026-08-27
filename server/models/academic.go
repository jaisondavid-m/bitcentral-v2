package models

import "time"

type Department struct {
	ID                    int       `json:"id"`
	Name                  string    `json:"name"`
	Code                  string    `json:"code"`
	Description           string    `json:"description"`
	CurrentSemesterID     *int      `json:"current_semester_id"`
	CurrentSemesterName   string    `json:"current_semester_name,omitempty"`
	CurrentSemesterNumber int       `json:"current_semester_number,omitempty"`
	Status                string    `json:"status"` // active, inactive
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
}

type Regulation struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Year        int       `json:"year"`
	Description string    `json:"description"`
	Status      string    `json:"status"` // active, inactive
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Batch struct {
	ID             int       `json:"id"`
	DepartmentID   int       `json:"department_id"`
	DepartmentName string    `json:"department_name,omitempty"`
	RegulationID   int       `json:"regulation_id"`
	RegulationName string    `json:"regulation_name,omitempty"`
	StartYear      int       `json:"start_year"`
	EndYear        int       `json:"end_year"`
	BatchName      string    `json:"batch_name"`
	Status         string    `json:"status"` // active, inactive
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Semester struct {
	ID             int       `json:"id"`
	SemesterNumber int       `json:"semester_number"`
	SemesterName   string    `json:"semester_name"`
	YearNumber     int       `json:"year_number"`
	Status         string    `json:"status"` // active, inactive
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Course struct {
	ID             int       `json:"id"`
	DepartmentID   int       `json:"department_id"`
	DepartmentName string    `json:"department_name,omitempty"`
	RegulationID   int       `json:"regulation_id"`
	RegulationName string    `json:"regulation_name,omitempty"`
	SemesterID     int       `json:"semester_id"`
	SemesterName   string    `json:"semester_name,omitempty"`
	SemesterNumber int       `json:"semester_number,omitempty"`
	Code           string    `json:"code"`
	Name           string    `json:"name"`
	ShortName      string    `json:"short_name"`
	IsElective     bool      `json:"is_elective"`
	Description    string    `json:"description"`
	Status         string    `json:"status"` // active, inactive
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Material struct {
	ID             int       `json:"id"`
	CourseID       int       `json:"course_id"`
	CourseCode     string    `json:"course_code,omitempty"`
	CourseName     string    `json:"course_name,omitempty"`
	DepartmentID   int       `json:"department_id,omitempty"`
	DepartmentName string    `json:"department_name,omitempty"`
	SemesterID     int       `json:"semester_id,omitempty"`
	SemesterName   string    `json:"semester_name,omitempty"`
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	MaterialType   string    `json:"material_type"` // PDF
	FileURL        string    `json:"file_url"`
	Unit           string    `json:"unit"`
	ItemOrder      int       `json:"item_order"`
	Status         string    `json:"status"` // published, unpublished
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type ExamSchedule struct {
	ID           int       `json:"id"`
	ExamID       int       `json:"exam_id"`
	ExamName     string    `json:"exam_name,omitempty"`
	CourseID     int       `json:"course_id"`
	CourseCode   string    `json:"course_code,omitempty"`
	CourseName   string    `json:"course_name,omitempty"`
	ExamDate     string    `json:"exam_date"`
	StartTime    string    `json:"start_time"`
	EndTime      string    `json:"end_time"`
	Venue        string    `json:"venue"`
	Instructions string    `json:"instructions"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Exam struct {
	ID             int            `json:"id"`
	Name           string         `json:"name"`
	ExamType       string         `json:"exam_type"` // PT-1, PT-2, Model Exam, Semester-End Exam, Practical Exam, Other
	AcademicYear   string         `json:"academic_year"`
	DepartmentID   int            `json:"department_id"`
	DepartmentIDs  []int          `json:"department_ids,omitempty"`
	DepartmentName string         `json:"department_name,omitempty"`
	SemesterID     int            `json:"semester_id"`
	SemesterName   string         `json:"semester_name,omitempty"`
	StartDate      string         `json:"start_date,omitempty"`
	EndDate        string         `json:"end_date,omitempty"`
	Description    string         `json:"description"`
	Status         string         `json:"status"` // scheduled, ongoing, completed, cancelled
	Schedules      []ExamSchedule `json:"schedules,omitempty"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
}

type QuestionPaper struct {
	ID             int       `json:"id"`
	ExamID         *int      `json:"exam_id"`
	ExamName       string    `json:"exam_name,omitempty"`
	CourseID       int       `json:"course_id"`
	CourseCode     string    `json:"course_code,omitempty"`
	CourseName     string    `json:"course_name,omitempty"`
	DepartmentID   int       `json:"department_id,omitempty"`
	DepartmentName string    `json:"department_name,omitempty"`
	SemesterID     int       `json:"semester_id,omitempty"`
	SemesterName   string    `json:"semester_name,omitempty"`
	ExamType       string    `json:"exam_type"`
	AcademicYear   string    `json:"academic_year"`
	FileURL        string    `json:"file_url"`
	Description    string    `json:"description"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

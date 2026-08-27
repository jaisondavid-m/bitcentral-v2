package models

import "time"

type Department struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Code        string    `json:"code"`
	Description string    `json:"description"`
	Status      string    `json:"status"` // active, inactive
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Program struct {
	ID             int       `json:"id"`
	DepartmentID   int       `json:"department_id"`
	DepartmentName string    `json:"department_name,omitempty"`
	DepartmentCode string    `json:"department_code,omitempty"`
	Name           string    `json:"name"`
	Code           string    `json:"code"`
	DegreeType     string    `json:"degree_type"`    // B.E., B.Tech, M.E., M.Tech, etc.
	DurationYears  int       `json:"duration_years"` // Default 4
	Status         string    `json:"status"`         // active, inactive
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
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
	ProgramID      int       `json:"program_id"`
	ProgramName    string    `json:"program_name,omitempty"`
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
	ID          int       `json:"id"`
	Code        string    `json:"code"`
	Name        string    `json:"name"`
	ShortName   string    `json:"short_name"`
	Credits     int       `json:"credits"`
	CourseType  string    `json:"course_type"` // Theory, Laboratory, Project, Elective, Practical, Other
	Description string    `json:"description"`
	Status      string    `json:"status"` // active, inactive
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type Curriculum struct {
	ID             int       `json:"id"`
	DepartmentID   int       `json:"department_id"`
	DepartmentName string    `json:"department_name,omitempty"`
	ProgramID      int       `json:"program_id"`
	ProgramName    string    `json:"program_name,omitempty"`
	RegulationID   int       `json:"regulation_id"`
	RegulationName string    `json:"regulation_name,omitempty"`
	SemesterID     int       `json:"semester_id"`
	SemesterName   string    `json:"semester_name,omitempty"`
	SemesterNumber int       `json:"semester_number,omitempty"`
	CourseID       int       `json:"course_id"`
	CourseCode     string    `json:"course_code,omitempty"`
	CourseName     string    `json:"course_name,omitempty"`
	CourseCredits  int       `json:"course_credits,omitempty"`
	CourseType     string    `json:"course_type,omitempty"`
	IsElective     bool      `json:"is_elective"`
	CourseOrder    int       `json:"course_order"`
	Status         string    `json:"status"` // active, inactive
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type Material struct {
	ID           int       `json:"id"`
	CourseID     int       `json:"course_id"`
	CourseCode   string    `json:"course_code,omitempty"`
	CourseName   string    `json:"course_name,omitempty"`
	Title        string    `json:"title"`
	Description  string    `json:"description"`
	MaterialType string    `json:"material_type"` // Notes, PDF, Video, Link, Question Bank, Previous Year Paper, Other
	FileURL      string    `json:"file_url"`
	Unit         string    `json:"unit"`
	ItemOrder    int       `json:"item_order"`
	Status       string    `json:"status"` // published, unpublished
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type Exam struct {
	ID             int       `json:"id"`
	Name           string    `json:"name"`
	ExamType       string    `json:"exam_type"` // Internal Assessment, Model Examination, End Semester Examination, Practical Examination, Other
	AcademicYear   string    `json:"academic_year"`
	ProgramID      int       `json:"program_id"`
	ProgramName    string    `json:"program_name,omitempty"`
	RegulationID   int       `json:"regulation_id"`
	RegulationName string    `json:"regulation_name,omitempty"`
	SemesterID     int       `json:"semester_id"`
	SemesterName   string    `json:"semester_name,omitempty"`
	StartDate      *string   `json:"start_date,omitempty"`
	EndDate        *string   `json:"end_date,omitempty"`
	Description    string    `json:"description"`
	Status         string    `json:"status"` // scheduled, ongoing, completed, cancelled
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
	Status       string    `json:"status"` // scheduled, rescheduled, completed, cancelled
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type QuestionPaper struct {
	ID             int       `json:"id"`
	CourseID       int       `json:"course_id"`
	CourseCode     string    `json:"course_code,omitempty"`
	CourseName     string    `json:"course_name,omitempty"`
	ExamType       string    `json:"exam_type"`
	AcademicYear   string    `json:"academic_year"`
	RegulationID   int       `json:"regulation_id"`
	RegulationName string    `json:"regulation_name,omitempty"`
	SemesterID     int       `json:"semester_id"`
	SemesterName   string    `json:"semester_name,omitempty"`
	YearNumber     int       `json:"year_number"`
	FileURL        string    `json:"file_url"`
	Description    string    `json:"description"`
	Status         string    `json:"status"` // active, inactive
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

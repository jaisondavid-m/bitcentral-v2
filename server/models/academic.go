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

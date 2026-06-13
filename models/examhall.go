package models

type SeatingRecord struct {
	HallNo     string
	CourseCode string
	RegisterNos []string
}

type ExamSession struct {
	HallNo     string `json:"hall_no"`
	CourseCode string `json:"course_code"`
}
package models

type SeatingRecord struct {
	HallNo      string
	CourseCode  string
	RegisterNos []string
}

type ExamSession struct {
	HallNo     string `json:"hall_no"`
	CourseCode string `json:"course_code"`
	CourseName string `json:"course_name"`
	Date       string `json:"date"`
	Session    string `json:"session"`
	Time       string `json:"time"`
}
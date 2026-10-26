package studentmodels

type SeatingRecord struct {
	HallNo      string
	CourseCode  string
	RegisterNos []string
	Time        string
}

type ExamSession struct {
	HallNo     string  `json:"hall_no"`
	Block      *string `json:"block"`
	CourseCode string  `json:"course_code"`
	CourseName string  `json:"course_name"`
	Date       string  `json:"date"`
	Session    string  `json:"session"`
	Time       string  `json:"time"`
	IsArrear   bool    `json:"is_arrear"`
}

type HallMember struct {
	SeatNo     int    `json:"seat_no"`
	RegisterNo string `json:"register_no"`
	Name       string `json:"name,omitempty"`
	CourseCode string `json:"course_code"`
	CourseName string `json:"course_name"`
	Department string `json:"department"`
	Time       string `json:"time"`
}

type HallCourseSummary struct {
	CourseCode string `json:"course_code"`
	CourseName string `json:"course_name"`
	Department string `json:"department"`
	Count      int    `json:"count"`
}

type HallSessionOption struct {
	Date    string `json:"date"`
	Session string `json:"session"`
	Time    string `json:"time"`
}

type HallMembersResponse struct {
	Success           bool                `json:"success"`
	Message           string              `json:"message,omitempty"`
	HallNo            string              `json:"hall_no"`
	Block             *string             `json:"block"`
	Date              string              `json:"date"`
	Session           string              `json:"session"`
	Time              string              `json:"time"`
	TotalStudents     int                 `json:"total_students"`
	Courses           []HallCourseSummary `json:"courses"`
	Members           []HallMember        `json:"members"`
	AvailableSessions []HallSessionOption `json:"available_sessions,omitempty"`
}


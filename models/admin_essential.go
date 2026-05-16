package models

type User struct {
	UID            string `json:"uid"`
	Email          string `json:"email"`
	DisplayName    string `json:"displayName"`
	PhotoURL       string `json:"photoURL"`
	CreationTime   string `json:"creationTime"`
	LastSignInTime string `json:"lastSignInTime"`
}

type PSToken struct {
	Token string `json:"token"`
}

type QBAnswerKey struct {
	ID         int    `json:"id"`
	Semester   int    `json:"semester"`
	SubjectCode string `json:"subject_code"`
	SubjectName string `json:"subject_name"`
	Year       int    `json:"year"`      // exam year
	Answers    string `json:"answers"`   // JSON string: {"1":"A","2":"C",...}
	CreatedAt  string `json:"created_at"`
	UpdatedAt  string `json:"updated_at"`
}

type QBAnswerKeyInput struct {
	Semester    int    `json:"semester" binding:"required"`
	SubjectCode string `json:"subject_code" binding:"required"`
	SubjectName string `json:"subject_name" binding:"required"`
	Year        int    `json:"year" binding:"required"`
	Answers     string `json:"answers" binding:"required"`
}
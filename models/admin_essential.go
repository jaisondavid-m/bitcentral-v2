package models

type User struct {
	UID            string `json:"uid"`
	Email          string `json:"email"`
	DisplayName    string `json:"displayName"`
	PhotoURL       string `json:"photoURL"`
	CreationTime   string `json:"creationTime"`
	LastSignInTime string `json:"lastSignInTime"`
	LastSeenAt     string `json:"lastSeenAt"`
	IsOnline       bool   `json:"isOnline"`
}

type PSToken struct {
	Token string `json:"token"`
}

type QBAnswerKey struct {
	ID           int     `json:"id"`
	Year         int     `json:"year"`
	SubjectCode  string  `json:"subject_code"`
	SubjectName  string  `json:"subject_name"`
	QB1          *string `json:"qb1"`
	QB2          *string `json:"qb2"`
	AK1          *string `json:"ak1"`
	AK2          *string `json:"ak2"`
	SemQBWithAns *string `json:"semqbwithans"`
	CreatedAt    string  `json:"created_at"`
	UpdatedAt    string  `json:"updated_at"`
}

type QBAnswerKeyInput struct {
	Year         int     `json:"year" binding:"required"`
	SubjectCode  string  `json:"subject_code" binding:"required"`
	SubjectName  string  `json:"subject_name" binding:"required"`
	QB1          *string `json:"qb1"`
	QB2          *string `json:"qb2"`
	AK1          *string `json:"ak1"`
	AK2          *string `json:"ak2"`
	SemQBWithAns *string `json:"semqbwithans"`
}

type QBAnswerKeyBatchInput struct {
	Year     int                `json:"year" binding:"required"`
	Subjects []QBAnswerKeyInput `json:"subjects" binding:"required"`
}

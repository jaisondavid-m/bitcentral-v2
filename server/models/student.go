package models

// Student maps to the Google Sheet columns.
type Student struct {
	SlNo             string `json:"sl_no"`
	Year             string `json:"year"`
	RollNo           string `json:"roll_no"`
	StudentName      string `json:"student_name"`
	CourseCode       string `json:"course_code"`
	Department       string `json:"department"`
	MentorName       string `json:"mentor_name"`
	CumulativePoints string `json:"cumulative_reward_points"`
	RedeemedPoints   string `json:"redeemed_points"`
	BalancePoints    string `json:"balance_points"`
	Tab              string `json:"tab"`
}
package models

type Holiday struct {
	ID          int    `json:"id"`
	FromDate    string `json:"from_date"`
	ToDate      string `json:"to_date"`
	Day         string `json:"day,omitempty"`
	Name        string `json:"name"`
	FromHalfDay string `json:"from_half_day,omitempty"`
	ToHalfDay   string `json:"to_half_day,omitempty"`
	LeaveType   string `json:"leave_type,omitempty"`
	Remarks     string `json:"remarks,omitempty"`
	CreatedAt   string `json:"created_at,omitempty"`
	UpdatedAt   string `json:"updated_at,omitempty"`
}
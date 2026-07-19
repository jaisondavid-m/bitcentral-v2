package models

type Holiday struct {
	FromDate    string `json:"from_date"`
	ToDate      string `json:"to_date"`
	Day         string `json:"day,omitempty"`
	Name        string `json:"name"`
	FromHalfDay string `json:"from_half_day,omitempty"`
}
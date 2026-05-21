package models

type Card struct {
	ID       int      `json:"id"`
	Image    string   `json:"img"`
	Name     string   `json:"name"`
	Keywords []string `json:"keywords"`
	Link     string   `json:"link"`
	BtnText  string   `json:"btntext"`
}
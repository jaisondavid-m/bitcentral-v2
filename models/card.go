package models

type Card struct {
	ID       int      `json:"id"`
	Order    int      `json:"card_order"`
	Image    string   `json:"img"`
	Name     string   `json:"name"`
	Keywords []string `json:"keywords"`
	Link     string   `json:"link"`
	BtnText  string   `json:"btntext"`
}

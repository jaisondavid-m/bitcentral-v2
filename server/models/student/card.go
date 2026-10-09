package studentmodels

type Card struct {
	ID         int      `json:"id"`
	Order      int      `json:"card_order"`
	Image      string   `json:"img"`
	Name       string   `json:"name"`
	Keywords   []string `json:"keywords"`
	Link       string   `json:"link"`
	AppRoute   string   `json:"app_route"`
	BtnText    string   `json:"btntext"`
	ClickCount int      `json:"click_count"`
	ShowOnSite *bool    `json:"show_on_site"`
	ShowOnApp  *bool    `json:"show_on_app"`
}

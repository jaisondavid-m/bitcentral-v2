package models

type LostFoundItem struct {
	ID                int               `json:"id"`
	ItemType          string            `json:"item_type"` // "lost" | "found"
	Title             string            `json:"title"`
	Category          string            `json:"category"` // "id_card", "electronics", "keys_cycles", "wallet_money", "documents", "clothing", "accessories", "others"
	Description       string            `json:"description"`
	LocationCampus    string            `json:"location_campus"`
	LocationDetails   string            `json:"location_details,omitempty"`
	DateOccurred      string            `json:"date_occurred"`
	TimeOccurred      string            `json:"time_occurred,omitempty"`
	Images            []string          `json:"images"`
	MatchedRollNumber string            `json:"matched_roll_number,omitempty"`
	CurrentCustody    string            `json:"current_custody"` // "with_finder", "main_security_gate", "dept_office", "hostel_warden"
	CustodyDetails    string            `json:"custody_details,omitempty"`
	SecretQuestion    string            `json:"secret_question,omitempty"`
	ContactPhone      string            `json:"contact_phone,omitempty"`
	ShowPhone         bool              `json:"show_phone"`
	AllowInAppClaim   bool              `json:"allow_inapp_claim"`
	UserUID           string            `json:"user_uid"`
	UserName          string            `json:"user_name"`
	UserEmail         string            `json:"user_email"`
	UserRollNo        string            `json:"user_roll_no,omitempty"`
	UserDepartment    string            `json:"user_department,omitempty"`
	UserBatch         string            `json:"user_batch,omitempty"`
	Status            string            `json:"status"` // "active", "claimed", "handed_over", "closed"
	Latitude          *float64          `json:"latitude,omitempty"`
	Longitude         *float64          `json:"longitude,omitempty"`
	IsPinned          bool              `json:"is_pinned"`
	IsFlagged         bool              `json:"is_flagged"`
	IsDeleted         bool              `json:"is_deleted"`
	DeletedAt         string            `json:"deleted_at,omitempty"`
	DeletedBy         string            `json:"deleted_by,omitempty"`
	ResolvedAt        string            `json:"resolved_at,omitempty"`
	CreatedAt         string            `json:"created_at"`
	UpdatedAt         string            `json:"updated_at,omitempty"`
	ClaimCount        int               `json:"claim_count,omitempty"`
	Claims            []*LostFoundClaim `json:"claims,omitempty"`
	IsMyItem          bool              `json:"is_my_item,omitempty"`
}

type LostFoundClaim struct {
	ID               int    `json:"id"`
	ItemID           int    `json:"item_id"`
	ClaimantUID      string `json:"claimant_uid"`
	ClaimantName     string `json:"claimant_name"`
	ClaimantEmail    string `json:"claimant_email"`
	ClaimantRollNo   string `json:"claimant_roll_no,omitempty"`
	ClaimantPhone    string `json:"claimant_phone,omitempty"`
	ProofDescription string `json:"proof_description"`
	ProofImage       string `json:"proof_image,omitempty"`
	Status           string `json:"status"` // "pending", "approved", "rejected"
	CreatedAt        string `json:"created_at"`
	ItemTitle        string `json:"item_title,omitempty"`
	ItemType         string `json:"item_type,omitempty"`
}

type LostFoundStats struct {
	TotalItems    int `json:"total_items"`
	ActiveLost    int `json:"active_lost"`
	ActiveFound   int `json:"active_found"`
	ResolvedCount int `json:"resolved_count"`
	TotalClaims   int `json:"total_claims"`
}

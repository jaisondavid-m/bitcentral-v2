package models

// TrackerUser maps to tracker_users table
type TrackerUser struct {
	UserID     string `json:"user_id"`
	ID         string `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Batch      string `json:"batch"`
	Phone      string `json:"phone"`
	Department string `json:"department"`
}

// TrackerUserProfileV2 defines response payload for v2 profile endpoint
type TrackerUserProfileV2 struct {
	UserID         string `json:"user_id"`
	RegisterNo     string `json:"register_no"`
	Name           string `json:"name"`
	Email          string `json:"email"`
	Batch          string `json:"batch"`
	Phone          string `json:"phone"`
	Department     string `json:"department"`
	PhotoURL       string `json:"photo_url"`
	CreationTime   string `json:"creation_time"`
	LastSignInTime string `json:"last_sign_in_time"`
}


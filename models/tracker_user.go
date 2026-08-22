package models

// TrackerUser maps to tracker_users table (excluding created_at and updated_at)
type TrackerUser struct {
	UserID string `json:"user_id"`
	ID     string `json:"id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
}

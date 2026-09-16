package models

type Notification struct {
	ID            int    `json:"id"`
	Title         string `json:"title"`
	Message       string `json:"message"`
	Type          string `json:"type"`          // "announcement", "alert", "update", "exam", "leave", "general"
	Priority      string `json:"priority"`      // "normal", "high", "urgent"
	TargetType    string `json:"target_type"`   // "all", "user", "batch", "dept"
	TargetUserUID string `json:"target_user_uid,omitempty"`
	TargetEmail   string `json:"target_email,omitempty"`
	TargetRollNo  string `json:"target_roll_no,omitempty"`
	TargetBatch   string `json:"target_batch,omitempty"`
	TargetDept    string `json:"target_dept,omitempty"`
	LinkURL       string `json:"link_url,omitempty"`
	LinkText      string `json:"link_text,omitempty"`
	CreatedBy     string `json:"created_by,omitempty"`
	IsActive      bool   `json:"is_active"`
	IsRead        bool   `json:"is_read"`
	ReadAt        string `json:"read_at,omitempty"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at,omitempty"`
	ReadCount     int    `json:"read_count,omitempty"`
}

type NotificationStats struct {
	TotalNotifications int `json:"total_notifications"`
	BroadcastCount     int `json:"broadcast_count"`
	TargetedCount      int `json:"targeted_count"`
	ActiveAlerts       int `json:"active_alerts"`
	TotalReads         int `json:"total_reads"`
}

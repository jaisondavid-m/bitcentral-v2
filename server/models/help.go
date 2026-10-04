package models

import "time"

// Internal DB model for help room
type HelpRoom struct {
	ID                string    `json:"id"`
	CreatorUID        string    `json:"creator_uid"`
	CreatorAnonLabel  string    `json:"creator_anon_label"`
	Title             string    `json:"title"`
	Content           string    `json:"content"`
	Category          string    `json:"category"`
	Status            string    `json:"status"` // OPEN, RESOLVED, CLOSED
	ViewsCount        int       `json:"views_count"`
	ResponsesCount    int       `json:"responses_count"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

// Internal DB model for help message
type HelpMessage struct {
	ID         string    `json:"id"`
	ParentID   string    `json:"parent_id,omitempty"`
	RoomID     string    `json:"room_id"`
	SenderUID  string    `json:"sender_uid"`
	AnonLabel  string    `json:"anon_label"`
	Content    string    `json:"content"`
	IsSystem   bool      `json:"is_system"`
	IsRemoved  bool      `json:"is_removed"`
	CreatedAt  time.Time `json:"created_at"`
}

// Internal DB model for help report
type HelpReport struct {
	ID          int       `json:"id"`
	ReporterUID string    `json:"reporter_uid"`
	TargetType  string    `json:"target_type"` // ROOM, MESSAGE
	TargetID    string    `json:"target_id"`
	Reason      string    `json:"reason"`
	Details     string    `json:"details"`
	Status      string    `json:"status"` // PENDING, REVIEWED, DISMISSED, ACTIONED
	CreatedAt   time.Time `json:"created_at"`
}

// Internal DB model for help block
type HelpBlock struct {
	ID         int       `json:"id"`
	BlockerUID string    `json:"blocker_uid"`
	BlockedUID string    `json:"blocked_uid"`
	RoomID     string    `json:"room_id,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
}

// Internal DB model for user restriction (BIT Help Ban)
type HelpUserRestriction struct {
	ID        int        `json:"id"`
	UserUID   string     `json:"user_uid"`
	Status    string     `json:"status"` // ACTIVE, BLOCKED, TEMPORARY_BLOCK
	Reason    string     `json:"reason"`
	CreatedBy string     `json:"created_by"`
	CreatedAt time.Time  `json:"created_at"`
	ExpiresAt *time.Time `json:"expires_at,omitempty"`
}

// --- STUDENT-FACING DTOS (NEVER CONTAIN SENDER IDENTITY/UID/NAME/EMAIL) ---

type StudentHelpRoomDTO struct {
	ID             string    `json:"id"`
	Title          string    `json:"title"`
	Content        string    `json:"content"`
	Category       string    `json:"category"`
	Status         string    `json:"status"`
	ViewsCount     int       `json:"views_count"`
	ResponsesCount int       `json:"responses_count"`
	AnonLabel      string    `json:"anon_label"`
	CreatedAt      time.Time `json:"created_at"`
	IsMine         bool      `json:"is_mine"`
}

type StudentHelpMessageDTO struct {
	ID         string    `json:"id"`
	ParentID   string    `json:"parent_id,omitempty"`
	RoomID     string    `json:"room_id,omitempty"`
	AnonLabel  string    `json:"anon_label"`
	Content    string    `json:"content"`
	IsSystem   bool      `json:"is_system"`
	ReplyCount int       `json:"reply_count"`
	CreatedAt  time.Time `json:"created_at"`
	IsMine     bool      `json:"is_mine"`
}

// --- ADMIN-FACING DTOS (CONTAIN FULL USER IDENTITY FOR MODERATION) ---

type AdminUserIdentity struct {
	UID         string `json:"uid"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	RegisterNo  string `json:"register_no"`
	PhotoURL    string `json:"photo_url,omitempty"`
}

type AdminHelpMessageDTO struct {
	ID          string             `json:"id"`
	ParentID    string             `json:"parent_id,omitempty"`
	RoomID      string             `json:"room_id,omitempty"`
	AnonLabel   string             `json:"anon_label"`
	Content     string             `json:"content"`
	IsSystem    bool               `json:"is_system"`
	IsRemoved   bool               `json:"is_removed"`
	ReplyCount  int                `json:"reply_count"`
	CreatedAt   time.Time          `json:"created_at"`
	Sender      AdminUserIdentity  `json:"sender"`
}

type AdminHelpRoomDTO struct {
	ID             string                `json:"id"`
	Title          string                `json:"title"`
	Content        string                `json:"content"`
	Category       string                `json:"category"`
	Status         string                `json:"status"`
	ViewsCount     int                   `json:"views_count"`
	ResponsesCount int                   `json:"responses_count"`
	AnonLabel      string                `json:"anon_label"`
	CreatedAt      time.Time             `json:"created_at"`
	Creator        AdminUserIdentity     `json:"creator"`
	Messages       []AdminHelpMessageDTO `json:"messages,omitempty"`
	Reports        []AdminHelpReportDTO  `json:"reports,omitempty"`
}

type AdminHelpReportDTO struct {
	ID            int               `json:"id"`
	Reporter      AdminUserIdentity `json:"reporter"`
	TargetType    string            `json:"target_type"`
	TargetID      string            `json:"target_id"`
	TargetContent string            `json:"target_content,omitempty"`
	TargetUser    AdminUserIdentity `json:"target_user,omitempty"`
	TargetLabel   string            `json:"target_label,omitempty"`
	Reason        string            `json:"reason"`
	Details       string            `json:"details"`
	Status        string            `json:"status"`
	CreatedAt     time.Time         `json:"created_at"`
	Snippet       string            `json:"snippet,omitempty"`
}

type AdminHelpUserRestrictionDTO struct {
	ID        int               `json:"id"`
	User      AdminUserIdentity `json:"user"`
	Status    string            `json:"status"`
	Reason    string            `json:"reason"`
	CreatedBy string            `json:"created_by"`
	CreatedAt time.Time         `json:"created_at"`
	ExpiresAt *time.Time        `json:"expires_at,omitempty"`
}

type HelpStatsDTO struct {
	TotalRequests     int `json:"total_requests"`
	ActiveRequests    int `json:"active_requests"`
	TotalMessages    int `json:"total_messages"`
	PendingReports   int `json:"pending_reports"`
	RestrictedUsers  int `json:"restricted_users"`
}

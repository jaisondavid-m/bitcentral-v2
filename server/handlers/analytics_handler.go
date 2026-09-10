package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"server/config"
	"github.com/gin-gonic/gin"
)

type AnalyticsHandler struct {
	DB *sql.DB
}

func NewAnalyticsHandler() *AnalyticsHandler {
	h := &AnalyticsHandler{
		DB: config.DB,
	}

	// Start periodic background aggregation for daily active users
	go h.startPeriodicDAUSync()

	return h
}

type AnalyticsDataResponse struct {
	Success      bool                 `json:"success"`
	Summary      AnalyticsSummaryData `json:"summary"`
	DailyHistory []DailyHistoryPoint  `json:"dailyHistory"`
	Source       string               `json:"source"`
}

type AnalyticsSummaryData struct {
	RegisteredUsers  int    `json:"registered_users"`
	DailyActiveUsers int    `json:"daily_active_users"`
	PeakDAU          int    `json:"peak_dau"`
	PeakDate         string `json:"peak_date"`
	AvgDAU           int    `json:"avg_dau"`
	TotalDaysTracked int    `json:"total_days_tracked"`
	LastSyncedAt     string `json:"last_synced_at"`
}

type DailyHistoryPoint struct {
	Date        string `json:"date"`        // e.g. "2026-09-10"
	DateLabel   string `json:"dateLabel"`   // e.g. "10 Sep"
	ActiveUsers int    `json:"activeUsers"` // Count of unique active users
	TotalUsers  int    `json:"totalUsers"`  // Total registered users
}

// Background worker that aggregates daily active users periodically
func (h *AnalyticsHandler) startPeriodicDAUSync() {
	time.Sleep(3 * time.Second)

	// Initial sync on startup
	h.SyncDailyActiveUsers()

	ticker := time.NewTicker(1 * time.Hour)
	defer ticker.Stop()

	for range ticker.C {
		log.Println("🔄 Triggering periodic Daily Active Users sync from users table...")
		h.SyncDailyActiveUsers()
	}
}

// SyncDailyActiveUsers calculates and stores daily active users from users table into daily_active_user_stats
func (h *AnalyticsHandler) SyncDailyActiveUsers() {
	if h.DB == nil {
		return
	}

	var totalUsers int
	_ = h.DB.QueryRow("SELECT COUNT(*) FROM users").Scan(&totalUsers)

	// 1. Group all historical dates from last_seen_at / last_sign_in_time
	query := `
		SELECT LEFT(COALESCE(NULLIF(last_seen_at, ''), NULLIF(last_sign_in_time, '')), 10) AS activity_date,
		       COUNT(DISTINCT id) AS active_count
		FROM users
		WHERE (last_seen_at IS NOT NULL AND last_seen_at != '')
		   OR (last_sign_in_time IS NOT NULL AND last_sign_in_time != '')
		GROUP BY LEFT(COALESCE(NULLIF(last_seen_at, ''), NULLIF(last_sign_in_time, '')), 10)
		HAVING activity_date REGEXP '^[0-9]{4}-[0-9]{2}-[0-9]{2}'
		ORDER BY activity_date ASC;
	`
	rows, err := h.DB.Query(query)
	if err != nil {
		log.Printf("⚠️ SyncDailyActiveUsers query notice: %v", err)
		return
	}
	defer rows.Close()

	upsertStmt, err := h.DB.Prepare(`
		INSERT INTO daily_active_user_stats (date, active_users_count, total_users_count)
		VALUES (?, ?, ?)
		ON DUPLICATE KEY UPDATE 
			active_users_count = VALUES(active_users_count),
			total_users_count = VALUES(total_users_count),
			updated_at = CURRENT_TIMESTAMP;
	`)
	if err != nil {
		log.Printf("⚠️ Prepare upsertStmt error: %v", err)
		return
	}
	defer upsertStmt.Close()

	for rows.Next() {
		var actDate string
		var actCount int
		if err := rows.Scan(&actDate, &actCount); err == nil && actDate != "" {
			actDate = strings.TrimSpace(actDate)
			if len(actDate) == 10 {
				_, _ = upsertStmt.Exec(actDate, actCount, totalUsers)
			}
		}
	}

	// 2. Ensure today (IST & Local) is always recorded/updated
	todayIST := time.Now().UTC().Add(5*time.Hour + 30*time.Minute).Format("2006-01-02")
	todayLocal := time.Now().Format("2006-01-02")

	var todayCount int
	_ = h.DB.QueryRow(`
		SELECT COUNT(DISTINCT id) FROM users 
		WHERE (last_seen_at IS NOT NULL AND (last_seen_at LIKE CONCAT(?, '%') OR last_seen_at LIKE CONCAT(?, '%')))
		   OR (last_sign_in_time IS NOT NULL AND (last_sign_in_time LIKE CONCAT(?, '%') OR last_sign_in_time LIKE CONCAT(?, '%')))
	`, todayIST, todayLocal, todayIST, todayLocal).Scan(&todayCount)

	_, _ = upsertStmt.Exec(todayIST, todayCount, totalUsers)
}

func (h *AnalyticsHandler) GetAnalytics(c *gin.Context) {
	var registeredCount int = 0
	if h.DB != nil {
		_ = h.DB.QueryRow("SELECT COUNT(*) FROM users").Scan(&registeredCount)
	}

	// Live active today calculation (IST & Local)
	todayIST := time.Now().UTC().Add(5*time.Hour + 30*time.Minute).Format("2006-01-02")
	todayLocal := time.Now().Format("2006-01-02")

	activeTodayCount := 0
	if h.DB != nil {
		_ = h.DB.QueryRow(`
			SELECT COUNT(DISTINCT id) FROM users 
			WHERE (last_seen_at IS NOT NULL AND (last_seen_at LIKE CONCAT(?, '%') OR last_seen_at LIKE CONCAT(?, '%')))
			   OR (last_sign_in_time IS NOT NULL AND (last_sign_in_time LIKE CONCAT(?, '%') OR last_sign_in_time LIKE CONCAT(?, '%')))
		`, todayIST, todayLocal, todayIST, todayLocal).Scan(&activeTodayCount)
	}

	// Trigger sync to ensure table is fully updated
	h.SyncDailyActiveUsers()

	// Retrieve multi-day historical DAU records from daily_active_user_stats
	var dailyHistory []DailyHistoryPoint
	var peakDAU int = 0
	var peakDate string = ""
	var totalDAUSum int = 0

	if h.DB != nil {
		historyRows, err := h.DB.Query(`
			SELECT date, active_users_count, total_users_count
			FROM daily_active_user_stats
			ORDER BY date DESC
			LIMIT 30;
		`)
		if err == nil {
			defer historyRows.Close()
			var rawPoints []DailyHistoryPoint
			for historyRows.Next() {
				var d string
				var activeCount, totCount int
				if err := historyRows.Scan(&d, &activeCount, &totCount); err == nil {
					// Parse date into readable label e.g. "10 Sep"
					label := d
					if parsedDate, parseErr := time.Parse("2006-01-02", d); parseErr == nil {
						label = parsedDate.Format("02 Jan")
					}
					// If this is today, ensure it reflects the latest live count
					if (d == todayIST || d == todayLocal) && activeTodayCount > activeCount {
						activeCount = activeTodayCount
					}

					if activeCount > peakDAU {
						peakDAU = activeCount
						peakDate = label
					}
					totalDAUSum += activeCount

					rawPoints = append(rawPoints, DailyHistoryPoint{
						Date:        d,
						DateLabel:   label,
						ActiveUsers: activeCount,
						TotalUsers:  totCount,
					})
				}
			}

			// Reverse to chronological order (oldest to newest)
			for i := len(rawPoints) - 1; i >= 0; i-- {
				dailyHistory = append(dailyHistory, rawPoints[i])
			}
		}
	}

	// If no history exists yet, construct today's data point
	if len(dailyHistory) == 0 {
		todayLabel := time.Now().Format("02 Jan")
		dailyHistory = append(dailyHistory, DailyHistoryPoint{
			Date:        todayIST,
			DateLabel:   todayLabel,
			ActiveUsers: activeTodayCount,
			TotalUsers:  registeredCount,
		})
		peakDAU = activeTodayCount
		peakDate = todayLabel
		totalDAUSum = activeTodayCount
	}

	avgDAU := 0
	if len(dailyHistory) > 0 {
		avgDAU = totalDAUSum / len(dailyHistory)
	}

	summary := AnalyticsSummaryData{
		RegisteredUsers:  registeredCount,
		DailyActiveUsers: activeTodayCount,
		PeakDAU:          peakDAU,
		PeakDate:         peakDate,
		AvgDAU:           avgDAU,
		TotalDaysTracked: len(dailyHistory),
		LastSyncedAt:     fmt.Sprintf("%s IST", time.Now().UTC().Add(5*time.Hour+30*time.Minute).Format("15:04:05")),
	}

	c.JSON(http.StatusOK, AnalyticsDataResponse{
		Success:      true,
		Summary:      summary,
		DailyHistory: dailyHistory,
		Source:       "MySQL Database (daily_active_user_stats)",
	})
}


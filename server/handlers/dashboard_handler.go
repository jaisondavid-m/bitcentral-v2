package handlers

import (
	"net/http"
	"strconv"
	"strings"
	"time"
	"unicode"

	"github.com/gin-gonic/gin"
	"server/config"
	"server/data"
	"server/models"
)

// DashboardHandler aggregates data for the student dashboard summary endpoint.
// Route: GET /dashboard/summary  (auth-protected via middleware.RequireJWT / ExtractAuthToken)
type DashboardHandler struct {
	SheetH *SheetHandler
	MessH  *MessHandler
}

func NewDashboardHandler(sh *SheetHandler, mh *MessHandler) *DashboardHandler {
	return &DashboardHandler{SheetH: sh, MessH: mh}
}

// ─── helpers ─────────────────────────────────────────────────────────────────

// parseLeaveDate strips optional half-day suffixes and parses "2006-01-02".
func parseLeaveDate(raw string) (time.Time, error) {
	raw = strings.TrimSuffix(raw, "(AN)")
	raw = strings.TrimSuffix(raw, "(FN)")
	raw = strings.TrimSpace(raw)
	loc, _ := time.LoadLocation("Asia/Kolkata")
	return time.ParseInLocation("2006-01-02", raw, loc)
}

type FormattedHoliday struct {
	Name        string  `json:"name"`
	FromDate    string  `json:"from_date"`
	ToDate      string  `json:"to_date"`
	Day         string  `json:"day,omitempty"`
	DaysCount   float64 `json:"days_count"`
	FromHalfDay string  `json:"from_half_day,omitempty"`
	IsCurrent   bool    `json:"is_current"`
}

// upcomingLeaves returns up to `n` leaves whose ToDate or FromDate >= today (IST).
func upcomingLeaves(n int) []FormattedHoliday {
	loc, _ := time.LoadLocation("Asia/Kolkata")
	today := time.Now().In(loc).Truncate(24 * time.Hour)

	var result []FormattedHoliday
	for _, h := range data.Holidays {
		fromHalfDay := ""
		if strings.HasSuffix(h.FromDate, "(AN)") {
			fromHalfDay = "AN"
		} else if strings.HasSuffix(h.FromDate, "(FN)") {
			fromHalfDay = "FN"
		}

		from, errFrom := parseLeaveDate(h.FromDate)
		to, errTo := parseLeaveDate(h.ToDate)
		if errFrom != nil {
			continue
		}
		if errTo != nil {
			to = from
		}

		// Check if the leave is today or in the future
		if !to.Before(today) {
			diffDays := float64(int(to.Sub(from).Hours()/24)) + 1.0
			if diffDays < 1.0 {
				diffDays = 1.0
			}
			if fromHalfDay == "AN" {
				diffDays -= 0.5
			}

			dayName := h.Day
			if dayName == "" {
				dayName = from.Weekday().String()
			}

			isCurrent := !today.Before(from) && !today.After(to)

			cleanFrom := strings.TrimSuffix(strings.TrimSuffix(h.FromDate, "(AN)"), "(FN)")
			cleanTo := strings.TrimSuffix(strings.TrimSuffix(h.ToDate, "(AN)"), "(FN)")
			if cleanTo == "" {
				cleanTo = cleanFrom
			}

			result = append(result, FormattedHoliday{
				Name:        h.Name,
				FromDate:    cleanFrom,
				ToDate:      cleanTo,
				Day:         dayName,
				DaysCount:   diffDays,
				FromHalfDay: fromHalfDay,
				IsCurrent:   isCurrent,
			})

			if len(result) >= n {
				break
			}
		}
	}
	return result
}

// resolveMealTime determines the current or next upcoming meal based on IST time.
// Breakfast: 07:00 - 08:30
// Lunch:     12:20 - 13:30
// Dinner:    19:00 - 20:30
func resolveMealTime(now time.Time) (mealType string, dateStr string, startTime string, endTime string, isCurrent bool, label string) {
	hhmm := now.Format("15:04")
	todayStr := now.Format("2006-01-02")

	if hhmm <= "08:30" {
		mealType = "Breakfast"
		dateStr = todayStr
		startTime = mealTimings["Breakfast"][0]
		endTime = mealTimings["Breakfast"][1]
		isCurrent = hhmm >= startTime
		if isCurrent {
			label = "Currently Serving Breakfast"
		} else {
			label = "Today's Breakfast (Upcoming)"
		}
	} else if hhmm <= "13:30" {
		mealType = "Lunch"
		dateStr = todayStr
		startTime = mealTimings["Lunch"][0]
		endTime = mealTimings["Lunch"][1]
		isCurrent = hhmm >= startTime
		if isCurrent {
			label = "Currently Serving Lunch"
		} else {
			label = "Today's Lunch (Upcoming)"
		}
	} else if hhmm <= "20:30" {
		mealType = "Dinner"
		dateStr = todayStr
		startTime = mealTimings["Dinner"][0]
		endTime = mealTimings["Dinner"][1]
		isCurrent = hhmm >= startTime
		if isCurrent {
			label = "Currently Serving Dinner"
		} else {
			label = "Today's Dinner (Upcoming)"
		}
	} else {
		// After dinner -> Tomorrow's Breakfast
		tomorrow := now.AddDate(0, 0, 1)
		mealType = "Breakfast"
		dateStr = tomorrow.Format("2006-01-02")
		startTime = mealTimings["Breakfast"][0]
		endTime = mealTimings["Breakfast"][1]
		isCurrent = false
		label = "Tomorrow's Breakfast (Upcoming)"
	}

	return
}

// getSingleMealMenu returns ONLY the items for the specified meal (e.g. Lunch only, Breakfast only, Dinner only).
func (h *DashboardHandler) getSingleMealMenu(hostel, dateStr, mealType string) []string {
	// 1. Try DB first
	if h.MessH != nil && h.MessH.DB != nil {
		rows, err := h.MessH.DB.Query(`
			SELECT item FROM mess_menu_items
			WHERE hostel = ? AND menu_date = ? AND meal_type = ?
			ORDER BY item_order ASC`, hostel, dateStr, mealType)
		if err == nil {
			defer rows.Close()
			var items []string
			for rows.Next() {
				var item string
				if rows.Scan(&item) == nil && strings.TrimSpace(item) != "" {
					items = append(items, strings.TrimSpace(item))
				}
			}
			if len(items) > 0 {
				return items
			}
		}
	}

	// 2. Fallback to default menu
	_, menu := fallbackMessMenu(hostel, dateStr)
	mealKey := strings.ToLower(mealType)
	if items, ok := menu[mealKey]; ok && len(items) > 0 {
		return items
	}

	return []string{}
}

// searchStudentByQuery searches the sheet using the exact same logic as UniversalSearch (/search?q=...)
func (h *DashboardHandler) searchStudentByQuery(queries ...string) (*models.Student, bool) {
	if h.SheetH == nil {
		return nil, false
	}
	all, _ := h.SheetH.fetchAllTabs()
	if len(all) == 0 {
		return nil, false
	}

	for _, rawQuery := range queries {
		query := strings.TrimSpace(rawQuery)
		if query == "" {
			continue
		}

		searchableCount := 0
		for _, ch := range query {
			if unicode.IsLetter(ch) || unicode.IsDigit(ch) {
				searchableCount++
			}
		}
		if searchableCount < 3 {
			continue
		}

		queryUpper := strings.ToUpper(strings.ReplaceAll(query, " ", ""))
		queryLower := strings.ToLower(query)

		// 1. Exact Roll number match
		for i := range all {
			s := &all[i]
			rollNormalized := strings.ToUpper(strings.ReplaceAll(s.RollNo, " ", ""))
			if rollNormalized == queryUpper {
				return s, true
			}
		}

		// 2. Roll contains query or query contains roll (UniversalSearch matching)
		for i := range all {
			s := &all[i]
			rollNormalized := strings.ToUpper(strings.ReplaceAll(s.RollNo, " ", ""))
			if rollNormalized != "" && (rollNormalized == queryUpper || strings.Contains(rollNormalized, queryUpper) || strings.Contains(queryUpper, rollNormalized)) {
				return s, true
			}
		}

		// 3. Name contains query
		for i := range all {
			s := &all[i]
			if strings.Contains(strings.ToLower(s.StudentName), queryLower) {
				return s, true
			}
		}
	}

	return nil, false
}

// rewardSummary fetches total, balance, redeemed points for candidate student identifiers.
func (h *DashboardHandler) rewardSummary(queries ...string) (total, balance, redeemed string, foundStudent *models.Student, found bool) {
	// 1. Search via UniversalSearch logic from all sheet tabs
	if student, ok := h.searchStudentByQuery(queries...); ok && student != nil {
		tot := strings.TrimSpace(student.CumulativePoints)
		bal := strings.TrimSpace(student.BalancePoints)
		red := strings.TrimSpace(student.RedeemedPoints)
		if tot == "" {
			tot = "0"
		}
		if bal == "" {
			bal = "0"
		}
		if red == "" {
			red = "0"
		}
		return tot, bal, red, student, true
	}

	// 2. Fallback: Search in rewards index (per-activity logs)
	if h.SheetH != nil {
		index, indexErr := h.SheetH.getRewardsIndex()
		if indexErr == nil && index != nil {
			for _, q := range queries {
				norm := normalizeRollNo(q)
				if norm == "" {
					continue
				}
				if activities, ok := index[norm]; ok && len(activities) > 0 {
					var pos, neg float64
					for _, a := range activities {
						pts, e := strconv.ParseFloat(a.RewardPoints, 64)
						if e != nil {
							continue
						}
						if a.Type == "negative" {
							neg += pts
						} else {
							pos += pts
						}
					}
					bal := pos - neg
					return fmtPts(pos), fmtPts(bal), fmtPts(neg), nil, true
				}
			}
		}
	}

	return "0", "0", "0", nil, false
}

func fmtPts(f float64) string {
	if f == float64(int64(f)) {
		return strconv.FormatInt(int64(f), 10)
	}
	return strconv.FormatFloat(f, 'f', 2, 64)
}

// ─── Handler ─────────────────────────────────────────────────────────────────

// GetDashboardSummary handles GET /dashboard/summary
// Automatically verifies and authenticates the student from their session token.
// Query params:
//   - hostel  = "boys" | "girls"  (default: "boys")
func (h *DashboardHandler) GetDashboardSummary(c *gin.Context) {
	// ── 1. Authenticate Token ────────────────────────────────────────────────
	token := ExtractAuthToken(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Authentication required"})
		return
	}
	claims, err := config.VerifyGoogleToken(token)
	if err != nil || claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Invalid token"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(claims.Email))
	displayName := strings.TrimSpace(claims.Name)

	// ── 2. Automatic Identity & Roll Number Resolution ───────────────────────
	var trackerID, trackerUserID, dbName, photoUrl string
	if config.DB != nil {
		_ = config.DB.QueryRow(
			`SELECT COALESCE(id, ''), COALESCE(user_id, ''), COALESCE(display_name, ''), COALESCE(photo_url, '') 
			 FROM tracker_users
			 WHERE LOWER(TRIM(email)) = ? OR email = ? LIMIT 1`, email, email,
		).Scan(&trackerID, &trackerUserID, &dbName, &photoUrl)

		if dbName != "" {
			displayName = dbName
		}
		if displayName == "" || photoUrl == "" {
			var uName, uPhoto string
			_ = config.DB.QueryRow(
				`SELECT COALESCE(display_name, ''), COALESCE(photo_url, '') 
				 FROM users 
				 WHERE LOWER(TRIM(email)) = ? OR email = ? LIMIT 1`, email, email,
			).Scan(&uName, &uPhoto)
			if displayName == "" {
				displayName = uName
			}
			if photoUrl == "" {
				photoUrl = uPhoto
			}
		}
	}

	rollNo := trackerUserID
	if rollNo == "" {
		rollNo = trackerID
	}

	emailPrefix := strings.Split(email, "@")[0]
	var nameFromPrefix string
	if dotIdx := strings.LastIndex(emailPrefix, "."); dotIdx > 0 {
		nameFromPrefix = emailPrefix[:dotIdx]
	}

	// ── 3. Build candidate search queries automatically ──────────────────────
	var candidates []string
	if rollNo != "" {
		candidates = append(candidates, rollNo)
	}
	if trackerID != "" && trackerID != rollNo {
		candidates = append(candidates, trackerID)
	}
	if emailPrefix != "" {
		candidates = append(candidates, emailPrefix)
	}
	if nameFromPrefix != "" {
		candidates = append(candidates, nameFromPrefix)
	}
	if displayName != "" && displayName != emailPrefix {
		candidates = append(candidates, displayName)
	}

	// ── 4. Automatic Reward Points Resolution (UniversalSearch logic) ─────────
	total, balance, redeemed, matchedStudent, found := h.rewardSummary(candidates...)

	if matchedStudent != nil {
		if matchedStudent.StudentName != "" && (displayName == "" || displayName == emailPrefix) {
			displayName = matchedStudent.StudentName
		}
		if matchedStudent.RollNo != "" {
			rollNo = matchedStudent.RollNo
		}
	}

	if rollNo == "" && len(emailPrefix) > 0 {
		rollNo = strings.ToUpper(emailPrefix)
	}
	if displayName == "" {
		displayName = emailPrefix
	}

	rewardData := gin.H{
		"total":     total,
		"balance":   balance,
		"redeemed":  redeemed,
		"available": found,
	}

	// ── 5. Resolve hostel preference ─────────────────────────────────────────
	hostel := strings.ToLower(strings.TrimSpace(c.Query("hostel")))
	if hostel != "girls" {
		hostel = "boys"
	}

	// ── 6. Current / Upcoming single mess meal menu ──────────────────────────
	loc, _ := time.LoadLocation("Asia/Kolkata")
	now := time.Now().In(loc)
	mealType, mealDate, startTime, endTime, isCurrent, mealLabel := resolveMealTime(now)
	mealItems := h.getSingleMealMenu(hostel, mealDate, mealType)

	// ── 7. Upcoming leaves (strictly 2 leaves only) ──────────────────────────
	leaves := upcomingLeaves(2)

	// ── 8. Response ──────────────────────────────────────────────────────────
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"user": gin.H{
				"name":      displayName,
				"email":     email,
				"roll_no":   rollNo,
				"photo_url": photoUrl,
			},
			"rewards": rewardData,
			"mess": gin.H{
				"meal_type":   mealType,
				"label":       mealLabel,
				"date":        mealDate,
				"day":         dayNameFromDate(mealDate),
				"hostel":      hostel,
				"start_time":  startTime,
				"end_time":    endTime,
				"is_current":  isCurrent,
				"items":       mealItems,
			},
			"upcoming_leaves": leaves,
		},
	})
}

// GetDashboardRewards handles GET /dashboard/rewards
// Returns the authenticated student's profile & reward points.
func (h *DashboardHandler) GetDashboardRewards(c *gin.Context) {
	token := ExtractAuthToken(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Authentication required"})
		return
	}
	claims, err := config.VerifyGoogleToken(token)
	if err != nil || claims == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "error": "Invalid token"})
		return
	}

	email := strings.ToLower(strings.TrimSpace(claims.Email))
	displayName := strings.TrimSpace(claims.Name)

	var trackerID, trackerUserID, dbName, photoUrl string
	if config.DB != nil {
		_ = config.DB.QueryRow(
			`SELECT COALESCE(id, ''), COALESCE(user_id, ''), COALESCE(display_name, ''), COALESCE(photo_url, '') 
			 FROM tracker_users
			 WHERE LOWER(TRIM(email)) = ? OR email = ? LIMIT 1`, email, email,
		).Scan(&trackerID, &trackerUserID, &dbName, &photoUrl)

		if dbName != "" {
			displayName = dbName
		}
		if displayName == "" || photoUrl == "" {
			var uName, uPhoto string
			_ = config.DB.QueryRow(
				`SELECT COALESCE(display_name, ''), COALESCE(photo_url, '') 
				 FROM users 
				 WHERE LOWER(TRIM(email)) = ? OR email = ? LIMIT 1`, email, email,
			).Scan(&uName, &uPhoto)
			if displayName == "" {
				displayName = uName
			}
			if photoUrl == "" {
				photoUrl = uPhoto
			}
		}
	}

	rollNo := trackerUserID
	if rollNo == "" {
		rollNo = trackerID
	}

	emailPrefix := strings.Split(email, "@")[0]
	var nameFromPrefix string
	if dotIdx := strings.LastIndex(emailPrefix, "."); dotIdx > 0 {
		nameFromPrefix = emailPrefix[:dotIdx]
	}

	var candidates []string
	if rollNo != "" {
		candidates = append(candidates, rollNo)
	}
	if trackerID != "" && trackerID != rollNo {
		candidates = append(candidates, trackerID)
	}
	if emailPrefix != "" {
		candidates = append(candidates, emailPrefix)
	}
	if nameFromPrefix != "" {
		candidates = append(candidates, nameFromPrefix)
	}
	if displayName != "" && displayName != emailPrefix {
		candidates = append(candidates, displayName)
	}

	total, balance, redeemed, matchedStudent, found := h.rewardSummary(candidates...)

	if matchedStudent != nil {
		if matchedStudent.StudentName != "" && (displayName == "" || displayName == emailPrefix) {
			displayName = matchedStudent.StudentName
		}
		if matchedStudent.RollNo != "" {
			rollNo = matchedStudent.RollNo
		}
	}

	if rollNo == "" && len(emailPrefix) > 0 {
		rollNo = strings.ToUpper(emailPrefix)
	}
	if displayName == "" {
		displayName = emailPrefix
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"user": gin.H{
				"name":      displayName,
				"email":     email,
				"roll_no":   rollNo,
				"photo_url": photoUrl,
			},
			"rewards": gin.H{
				"total":     total,
				"balance":   balance,
				"redeemed":  redeemed,
				"available": found,
			},
		},
	})
}

// GetDashboardMess handles GET /dashboard/mess?hostel=boys
// Fast dedicated endpoint for mess menu meal banner.
func (h *DashboardHandler) GetDashboardMess(c *gin.Context) {
	hostel := strings.ToLower(strings.TrimSpace(c.Query("hostel")))
	if hostel != "girls" {
		hostel = "boys"
	}

	loc, _ := time.LoadLocation("Asia/Kolkata")
	now := time.Now().In(loc)
	mealType, mealDate, startTime, endTime, isCurrent, mealLabel := resolveMealTime(now)
	mealItems := h.getSingleMealMenu(hostel, mealDate, mealType)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"meal_type":  mealType,
			"label":      mealLabel,
			"date":       mealDate,
			"day":        dayNameFromDate(mealDate),
			"hostel":     hostel,
			"start_time": startTime,
			"end_time":   endTime,
			"is_current": isCurrent,
			"items":      mealItems,
		},
	})
}

// GetDashboardLeaves handles GET /dashboard/leaves
// Fast dedicated endpoint for upcoming leaves.
func (h *DashboardHandler) GetDashboardLeaves(c *gin.Context) {
	leaves := upcomingLeaves(2)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    leaves,
	})
}

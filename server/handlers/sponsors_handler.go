 	package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"server/config"

	"github.com/gin-gonic/gin"
)

type SponsorsHandler struct{}

func NewSponsorsHandler() *SponsorsHandler {
	return &SponsorsHandler{}
}

type RazorpayPaymentItem struct {
	ID         string                 `json:"id"`
	Entity     string                 `json:"entity"`
	Amount     int64                  `json:"amount"`
	AmountPaid int64                  `json:"amount_paid"`
	Currency   string                 `json:"currency"`
	Status     string                 `json:"status"`
	Email      string                 `json:"email"`
	Contact    string                 `json:"contact"`
	CreatedAt  int64                  `json:"created_at"`
	Notes      map[string]interface{} `json:"notes"`
}

type RazorpayPaymentsResponse struct {
	Entity string                `json:"entity"`
	Count  int                   `json:"count"`
	Items  []RazorpayPaymentItem `json:"items"`
}

type SponsorItem struct {
	ID        string  `json:"id"`
	Amount    float64 `json:"amount"` // in Rupees
	Status    string  `json:"status"`
	Currency  string  `json:"currency"`
	Email     string  `json:"email"`
	Phone     string  `json:"phone"`
	Name      string  `json:"name"`
	CreatedAt string  `json:"created_at"`
}

func extractName(notes map[string]interface{}, topEmail string) string {
	if notes != nil {
		keys := []string{"name", "Name", "full_name", "Full Name", "customer_name", "donor_name", "title"}
		for _, k := range keys {
			if val, ok := notes[k].(string); ok && strings.TrimSpace(val) != "" {
				return strings.TrimSpace(val)
			}
		}
		for k, v := range notes {
			if strVal, ok := v.(string); ok && strings.TrimSpace(strVal) != "" {
				kLower := strings.ToLower(k)
				if !strings.Contains(kLower, "email") && !strings.Contains(kLower, "phone") && !strings.Contains(kLower, "contact") && !strings.Contains(kLower, "id") {
					return strings.TrimSpace(strVal)
				}
			}
		}
	}
	if topEmail != "" {
		parts := strings.Split(topEmail, "@")
		if len(parts) > 0 && strings.TrimSpace(parts[0]) != "" {
			namePart := parts[0]
			namePart = strings.ReplaceAll(namePart, ".", " ")
			namePart = strings.ReplaceAll(namePart, "_", " ")
			return strings.Title(strings.TrimSpace(namePart))
		}
	}
	return "Anonymous BITSian"
}

// GetSponsorsAdmin fetches order/payment data directly from Razorpay API
func (h *SponsorsHandler) GetSponsorsAdmin(c *gin.Context) {
	countStr := c.DefaultQuery("count", "10")
	skipStr := c.DefaultQuery("skip", "0")

	count, _ := strconv.Atoi(countStr)
	skip, _ := strconv.Atoi(skipStr)

	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	var sponsors []SponsorItem
	var totalRaised float64

	if keyID != "" && keySecret != "" {
		url := fmt.Sprintf("https://api.razorpay.com/v1/payments?count=%d&skip=%d", count, skip)
		req, err := http.NewRequest("GET", url, nil)
		if err == nil {
			req.SetBasicAuth(keyID, keySecret)
			client := &http.Client{Timeout: 10 * time.Second}
			resp, err := client.Do(req)
			if err == nil && resp.StatusCode == http.StatusOK {
				defer resp.Body.Close()
				body, _ := io.ReadAll(resp.Body)

				var rzpRes RazorpayPaymentsResponse
				if err := json.Unmarshal(body, &rzpRes); err == nil {
					for _, item := range rzpRes.Items {
						st := strings.ToLower(item.Status)
						if st != "captured" && st != "authorized" {
							continue
						}

						amtInRupees := float64(item.Amount) / 100.0
						if item.AmountPaid > 0 {
							amtInRupees = float64(item.AmountPaid) / 100.0
						}
						totalRaised += amtInRupees

						email := item.Email
						phone := item.Contact
						if item.Notes != nil {
							if e, ok := item.Notes["email"].(string); ok && e != "" {
								email = e
							}
							if p, ok := item.Notes["phone"].(string); ok && p != "" {
								phone = p
							}
						}

						donorName := extractName(item.Notes, email)

						sponsors = append(sponsors, SponsorItem{
							ID:        item.ID,
							Amount:    amtInRupees,
							Status:    item.Status,
							Currency:  item.Currency,
							Email:     email,
							Phone:     phone,
							Name:      donorName,
							CreatedAt: time.Unix(item.CreatedAt, 0).Format("2006-01-02 15:04:05"),
						})
					}

					sort.Slice(sponsors, func(i, j int) bool {
						return sponsors[i].Amount > sponsors[j].Amount
					})
				}
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":             true,
		"count":               len(sponsors),
		"skip":                skip,
		"total_amount_raised": totalRaised,
		"orders":              sponsors,
	})
}

func cleanPhone(phone string) string {
	var digits []rune
	for _, r := range phone {
		if r >= '0' && r <= '9' {
			digits = append(digits, r)
		}
	}
	s := string(digits)
	if len(s) >= 10 {
		return s[len(s)-10:]
	}
	return s
}

func getOverridesMap() map[string]string {
	overrides := make(map[string]string)
	if config.DB == nil {
		return overrides
	}
	rows, err := config.DB.Query("SELECT donor_key, custom_name, COALESCE(email, ''), COALESCE(phone, '') FROM sponsor_name_overrides")
	if err != nil {
		return overrides
	}
	defer rows.Close()

	for rows.Next() {
		var key, customName, email, phone string
		if err := rows.Scan(&key, &customName, &email, &phone); err == nil {
			customName = strings.TrimSpace(customName)
			if customName != "" {
				if key != "" {
					overrides[key] = customName
				}
				if phone != "" {
					pDigits := cleanPhone(phone)
					if pDigits != "" {
						overrides["phone_"+pDigits] = customName
					}
				}
				if email != "" {
					overrides["email_"+strings.ToLower(strings.TrimSpace(email))] = customName
				}
			}
		}
	}
	return overrides
}

type AggregatedDonor struct {
	DonorKey       string  `json:"donor_key"`
	Name           string  `json:"name"`
	OriginalName   string  `json:"original_name"`
	Email          string  `json:"email"`
	Phone          string  `json:"phone"`
	PhoneDigits    string  `json:"phone_digits"`
	Amount         float64 `json:"amount"`
	LatestDate     string  `json:"date"`
	TargetDeptID   int     `json:"target_department_id"`
	TargetDeptCode string  `json:"target_department_code"`
	IsAnonymous    bool    `json:"is_anonymous"`
}

type SponsorDepartment struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	Code      string `json:"code"`
	EmailCode string `json:"email_code"`
	Year      string `json:"year"`
	YearCode  string `json:"year_code"`
	CreatedAt string `json:"created_at,omitempty"`
}

func getDepartmentsMap() (map[int]SponsorDepartment, []SponsorDepartment) {
	deptMap := make(map[int]SponsorDepartment)
	var deptList []SponsorDepartment
	if config.DB == nil {
		return deptMap, deptList
	}
	rows, err := config.DB.Query("SELECT id, name, code, COALESCE(email_code, ''), year, COALESCE(year_code, '') FROM sponsor_departments ORDER BY name ASC, year ASC")
	if err != nil {
		return deptMap, deptList
	}
	defer rows.Close()

	for rows.Next() {
		var d SponsorDepartment
		if err := rows.Scan(&d.ID, &d.Name, &d.Code, &d.EmailCode, &d.Year, &d.YearCode); err == nil {
			deptMap[d.ID] = d
			deptList = append(deptList, d)
		}
	}
	return deptMap, deptList
}

func getDepartmentMappingsMap() map[string]int {
	mappings := make(map[string]int)
	if config.DB == nil {
		return mappings
	}
	rows, err := config.DB.Query("SELECT donor_key, department_id FROM sponsor_department_mappings")
	if err != nil {
		return mappings
	}
	defer rows.Close()

	for rows.Next() {
		var key string
		var deptID int
		if err := rows.Scan(&key, &deptID); err == nil {
			mappings[key] = deptID
		}
	}
	return mappings
}

func extractEmailDepartmentAndYear(email string) (string, string) {
	emailLower := strings.ToLower(strings.TrimSpace(email))
	if emailLower == "" {
		return "", ""
	}

	atIdx := strings.Index(emailLower, "@")
	username := emailLower
	if atIdx != -1 {
		username = emailLower[:atIdx]
	}

	dotIdx := strings.LastIndex(username, ".")
	codeSegment := username
	if dotIdx != -1 && dotIdx < len(username)-1 {
		codeSegment = username[dotIdx+1:]
	}

	var alphaParts []string
	var digitParts []string

	var curAlpha strings.Builder
	var curDigit strings.Builder

	for _, ch := range codeSegment {
		if (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') {
			if curDigit.Len() > 0 {
				digitParts = append(digitParts, curDigit.String())
				curDigit.Reset()
			}
			curAlpha.WriteRune(ch)
		} else if ch >= '0' && ch <= '9' {
			if curAlpha.Len() > 0 {
				alphaParts = append(alphaParts, curAlpha.String())
				curAlpha.Reset()
			}
			curDigit.WriteRune(ch)
		}
	}
	if curAlpha.Len() > 0 {
		alphaParts = append(alphaParts, curAlpha.String())
	}
	if curDigit.Len() > 0 {
		digitParts = append(digitParts, curDigit.String())
	}

	parsedEmailCode := ""
	parsedYearCode := ""

	if len(alphaParts) > 0 {
		parsedEmailCode = alphaParts[0]
	}
	if len(digitParts) > 0 {
		for _, d := range digitParts {
			if len(d) == 2 {
				parsedYearCode = d
				break
			}
		}
		if parsedYearCode == "" && len(digitParts) > 0 {
			parsedYearCode = digitParts[0]
		}
	}

	return parsedEmailCode, parsedYearCode
}

func resolveDonorDepartmentID(key string, donor *AggregatedDonor, mappings map[string]int) int {
	if donor != nil && donor.TargetDeptID > 0 {
		return donor.TargetDeptID
	}
	if donor != nil && donor.TargetDeptCode != "" {
		_, deptList := getDepartmentsMap()
		for _, d := range deptList {
			if strings.EqualFold(d.Code, donor.TargetDeptCode) || strings.EqualFold(d.EmailCode, donor.TargetDeptCode) {
				return d.ID
			}
		}
	}
	if deptID, ok := mappings[key]; ok && deptID > 0 {
		return deptID
	}
	if donor != nil && donor.PhoneDigits != "" {
		if deptID, ok := mappings["phone_"+donor.PhoneDigits]; ok && deptID > 0 {
			return deptID
		}
	}
	if donor != nil && donor.Email != "" {
		emailLower := strings.ToLower(strings.TrimSpace(donor.Email))
		if deptID, ok := mappings["email_"+emailLower]; ok && deptID > 0 {
			return deptID
		}
		// Automatic email short code and year code matching fallback (e.g. 'it' and '23' in cheran.it23@bitsathy.ac.in)
		parsedEmailCode, parsedYearCode := extractEmailDepartmentAndYear(emailLower)
		_, deptList := getDepartmentsMap()

		// Pass 1: Try matching BOTH email_code AND year_code with exact equality
		if parsedEmailCode != "" && parsedYearCode != "" {
			for _, dept := range deptList {
				emailCode := strings.ToLower(strings.TrimSpace(dept.EmailCode))
				yearCode := strings.ToLower(strings.TrimSpace(dept.YearCode))
				if emailCode != "" && yearCode != "" {
					if strings.EqualFold(emailCode, parsedEmailCode) && strings.EqualFold(yearCode, parsedYearCode) {
						return dept.ID
					}
				}
			}
		}

		// Pass 2: Fallback matching email_code + year number pattern (e.g. '26'->1st Year, '25'->2nd Year, '24'->3rd Year, '23'->3rd Year, '22'->4th Year)
		if parsedEmailCode != "" {
			for _, dept := range deptList {
				emailCode := strings.ToLower(strings.TrimSpace(dept.EmailCode))
				if emailCode != "" && strings.EqualFold(emailCode, parsedEmailCode) {
					if parsedYearCode != "" {
						yearStr := strings.ToLower(dept.Year)
						if parsedYearCode == "26" && strings.Contains(yearStr, "1") {
							return dept.ID
						} else if parsedYearCode == "25" && strings.Contains(yearStr, "2") {
							return dept.ID
						} else if parsedYearCode == "24" && strings.Contains(yearStr, "3") {
							return dept.ID
						} else if parsedYearCode == "23" && strings.Contains(yearStr, "3") {
							return dept.ID
						} else if parsedYearCode == "22" && strings.Contains(yearStr, "4") {
							return dept.ID
						}
					}
				}
			}

			// Pass 3: Fallback matching email_code alone with exact equality (so 'ch' or 'ag' won't match student names)
			for _, dept := range deptList {
				emailCode := strings.ToLower(strings.TrimSpace(dept.EmailCode))
				if emailCode != "" && strings.EqualFold(emailCode, parsedEmailCode) {
					return dept.ID
				}
			}
		}

		// Pass 4: Fallback if email didn't have a dot separator, check for '.{email_code}' in email
		for _, dept := range deptList {
			emailCode := strings.ToLower(strings.TrimSpace(dept.EmailCode))
			if emailCode != "" && len(emailCode) >= 2 {
				if strings.Contains(emailLower, "."+emailCode) {
					return dept.ID
				}
			}
		}
	}
	return 0
}

func buildDepartmentLeaderboard(aggregatedMap map[string]*AggregatedDonor) []gin.H {
	_, deptList := getDepartmentsMap()
	mappings := getDepartmentMappingsMap()

	deptTotals := make(map[int]float64)
	deptCounts := make(map[int]int)

	for key, donor := range aggregatedMap {
		deptID := resolveDonorDepartmentID(key, donor, mappings)
		if deptID > 0 {
			deptTotals[deptID] += donor.Amount
			deptCounts[deptID] += 1
		}
	}

	var leaderboard []gin.H
	for _, dept := range deptList {
		totalAmt := deptTotals[dept.ID]
		supporters := deptCounts[dept.ID]

		leaderboard = append(leaderboard, gin.H{
			"id":               dept.ID,
			"name":             dept.Name,
			"code":             dept.Code,
			"year":             dept.Year,
			"display_name":     fmt.Sprintf("%s - %s", dept.Code, dept.Year),
			"full_name":        fmt.Sprintf("%s (%s - %s)", dept.Name, dept.Code, dept.Year),
			"total_amount":     totalAmt,
			"total_supporters": supporters,
		})
	}

	sort.Slice(leaderboard, func(i, j int) bool {
		amtI, _ := leaderboard[i]["total_amount"].(float64)
		amtJ, _ := leaderboard[j]["total_amount"].(float64)
		if amtI != amtJ {
			return amtI > amtJ
		}
		cntI, _ := leaderboard[i]["total_supporters"].(int)
		cntJ, _ := leaderboard[j]["total_supporters"].(int)
		if cntI != cntJ {
			return cntI > cntJ
		}
		nameI, _ := leaderboard[i]["display_name"].(string)
		nameJ, _ := leaderboard[j]["display_name"].(string)
		return nameI < nameJ
	})

	for i := range leaderboard {
		leaderboard[i]["rank"] = i + 1
	}

	return leaderboard
}

// GetSponsorsLeaderboard returns real public leaderboard for Support Dev page
func (h *SponsorsHandler) GetSponsorsLeaderboard(c *gin.Context) {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	var sponsors []gin.H
	var total float64
	overridesMap := getOverridesMap()
	deptMap, _ := getDepartmentsMap()
	deptMappings := getDepartmentMappingsMap()
	aggregatedMap := make(map[string]*AggregatedDonor)

	if keyID != "" && keySecret != "" {
		url := "https://api.razorpay.com/v1/payments?count=100"
		req, err := http.NewRequest("GET", url, nil)
		if err == nil {
			req.SetBasicAuth(keyID, keySecret)
			client := &http.Client{Timeout: 10 * time.Second}
			resp, err := client.Do(req)
			if err == nil && resp.StatusCode == http.StatusOK {
				defer resp.Body.Close()
				body, _ := io.ReadAll(resp.Body)

				var rzpRes RazorpayPaymentsResponse
				if err := json.Unmarshal(body, &rzpRes); err == nil {
					for _, item := range rzpRes.Items {
						st := strings.ToLower(item.Status)
						if st != "captured" && st != "authorized" {
							continue
						}

						amt := float64(item.Amount) / 100.0
						if item.AmountPaid > 0 {
							amt = float64(item.AmountPaid) / 100.0
						}
						total += amt

						email := item.Email
						phone := item.Contact
						isAnon := false
						var targetDeptID int
						var targetDeptCode string

						if item.Notes != nil {
							if e, ok := item.Notes["email"].(string); ok && e != "" {
								email = e
							}
							if p, ok := item.Notes["phone"].(string); ok && p != "" {
								phone = p
							} else if p, ok := item.Notes["contact"].(string); ok && p != "" {
								phone = p
							}
							if anonStr, ok := item.Notes["is_anonymous"].(string); ok {
								isAnon = (anonStr == "true" || anonStr == "1" || anonStr == "yes")
							} else if anonBool, ok := item.Notes["is_anonymous"].(bool); ok {
								isAnon = anonBool
							}
							if deptIDStr, ok := item.Notes["target_department_id"].(string); ok && deptIDStr != "" {
								targetDeptID, _ = strconv.Atoi(deptIDStr)
							} else if deptIDNum, ok := item.Notes["target_department_id"].(float64); ok {
								targetDeptID = int(deptIDNum)
							}
							if codeStr, ok := item.Notes["target_department_code"].(string); ok && codeStr != "" {
								targetDeptCode = codeStr
							}
						}

						donorName := extractName(item.Notes, email)
						if isAnon {
							donorName = "Anonymous BITSian"
						}
						phoneDigits := cleanPhone(phone)

						var normKey string
						if phoneDigits != "" {
							normKey = "phone_" + phoneDigits
						} else if strings.TrimSpace(email) != "" {
							normKey = "email_" + strings.ToLower(strings.TrimSpace(email))
						} else {
							normKey = "name_" + strings.ToLower(strings.TrimSpace(donorName))
						}

						itemDate := time.Unix(item.CreatedAt, 0).Format("2006-01-02")

						if existing, found := aggregatedMap[normKey]; found {
							existing.Amount += amt
							if itemDate > existing.LatestDate {
								existing.LatestDate = itemDate
							}
							if len(donorName) > len(existing.OriginalName) && donorName != "Anonymous BITSian" {
								existing.OriginalName = donorName
							}
							if existing.Email == "" && email != "" {
								existing.Email = email
							}
							if existing.Phone == "" && phone != "" {
								existing.Phone = phone
							}
							if targetDeptID > 0 {
								existing.TargetDeptID = targetDeptID
							}
							if targetDeptCode != "" {
								existing.TargetDeptCode = targetDeptCode
							}
						} else {
							aggregatedMap[normKey] = &AggregatedDonor{
								DonorKey:       normKey,
								Name:           donorName,
								OriginalName:   donorName,
								Email:          email,
								Phone:          phone,
								PhoneDigits:    phoneDigits,
								Amount:         amt,
								LatestDate:     itemDate,
								TargetDeptID:   targetDeptID,
								TargetDeptCode: targetDeptCode,
								IsAnonymous:    isAnon,
							}
						}
					}

					for key, donor := range aggregatedMap {
						displayName := donor.OriginalName
						if custom, ok := overridesMap[key]; ok && custom != "" {
							displayName = custom
						} else if donor.PhoneDigits != "" {
							if custom, ok := overridesMap["phone_"+donor.PhoneDigits]; ok && custom != "" {
								displayName = custom
							}
						} else if donor.Email != "" {
							if custom, ok := overridesMap["email_"+strings.ToLower(strings.TrimSpace(donor.Email))]; ok && custom != "" {
								displayName = custom
							}
						}

						deptID := resolveDonorDepartmentID(key, donor, deptMappings)
						var deptDisplay string
						var deptCode string
						var deptYear string
						if deptID > 0 {
							if d, ok := deptMap[deptID]; ok {
								deptDisplay = fmt.Sprintf("%s - %s", d.Code, d.Year)
								deptCode = d.Code
								deptYear = d.Year
							}
						}

						sponsors = append(sponsors, gin.H{
							"name":               displayName,
							"amount":             donor.Amount,
							"date":               donor.LatestDate,
							"email":              donor.Email,
							"department_id":      deptID,
							"department_code":    deptCode,
							"department_year":    deptYear,
							"department_display": deptDisplay,
						})
					}

					sort.Slice(sponsors, func(i, j int) bool {
						amtI, _ := sponsors[i]["amount"].(float64)
						amtJ, _ := sponsors[j]["amount"].(float64)
						if amtI != amtJ {
							return amtI > amtJ
						}
						dateI, _ := sponsors[i]["date"].(string)
						dateJ, _ := sponsors[j]["date"].(string)
						if dateI != dateJ {
							return dateI > dateJ
						}
						nameI, _ := sponsors[i]["name"].(string)
						nameJ, _ := sponsors[j]["name"].(string)
						return strings.ToLower(nameI) < strings.ToLower(nameJ)
					})
				}
			}
		}
	}

	deptLeaderboard := buildDepartmentLeaderboard(aggregatedMap)

	c.JSON(http.StatusOK, gin.H{
		"success":                true,
		"total_raised":           total,
		"total_supporters":       len(sponsors),
		"sponsors":               sponsors,
		"department_leaderboard": deptLeaderboard,
	})
}

// GetSponsorsLeaderboardAdmin returns detailed leaderboard data for admin review with override state
func (h *SponsorsHandler) GetSponsorsLeaderboardAdmin(c *gin.Context) {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	var leaderboard []gin.H
	overridesMap := getOverridesMap()
	deptMap, _ := getDepartmentsMap()
	deptMappings := getDepartmentMappingsMap()
	aggregatedMap := make(map[string]*AggregatedDonor)

	if keyID != "" && keySecret != "" {
		url := "https://api.razorpay.com/v1/payments?count=100"
		req, err := http.NewRequest("GET", url, nil)
		if err == nil {
			req.SetBasicAuth(keyID, keySecret)
			client := &http.Client{Timeout: 10 * time.Second}
			resp, err := client.Do(req)
			if err == nil && resp.StatusCode == http.StatusOK {
				defer resp.Body.Close()
				body, _ := io.ReadAll(resp.Body)

				var rzpRes RazorpayPaymentsResponse
				if err := json.Unmarshal(body, &rzpRes); err == nil {
					for _, item := range rzpRes.Items {
						st := strings.ToLower(item.Status)
						if st != "captured" && st != "authorized" {
							continue
						}

						amt := float64(item.Amount) / 100.0
						if item.AmountPaid > 0 {
							amt = float64(item.AmountPaid) / 100.0
						}

						email := item.Email
						phone := item.Contact
						isAnon := false
						var targetDeptID int
						var targetDeptCode string

						if item.Notes != nil {
							if e, ok := item.Notes["email"].(string); ok && e != "" {
								email = e
							}
							if p, ok := item.Notes["phone"].(string); ok && p != "" {
								phone = p
							} else if p, ok := item.Notes["contact"].(string); ok && p != "" {
								phone = p
							}
							if anonStr, ok := item.Notes["is_anonymous"].(string); ok {
								isAnon = (anonStr == "true" || anonStr == "1" || anonStr == "yes")
							} else if anonBool, ok := item.Notes["is_anonymous"].(bool); ok {
								isAnon = anonBool
							}
							if deptIDStr, ok := item.Notes["target_department_id"].(string); ok && deptIDStr != "" {
								targetDeptID, _ = strconv.Atoi(deptIDStr)
							} else if deptIDNum, ok := item.Notes["target_department_id"].(float64); ok {
								targetDeptID = int(deptIDNum)
							}
							if codeStr, ok := item.Notes["target_department_code"].(string); ok && codeStr != "" {
								targetDeptCode = codeStr
							}
						}

						donorName := extractName(item.Notes, email)
						if isAnon {
							donorName = "Anonymous BITSian"
						}
						phoneDigits := cleanPhone(phone)

						var normKey string
						if phoneDigits != "" {
							normKey = "phone_" + phoneDigits
						} else if strings.TrimSpace(email) != "" {
							normKey = "email_" + strings.ToLower(strings.TrimSpace(email))
						} else {
							normKey = "name_" + strings.ToLower(strings.TrimSpace(donorName))
						}

						itemDate := time.Unix(item.CreatedAt, 0).Format("2006-01-02")

						if existing, found := aggregatedMap[normKey]; found {
							existing.Amount += amt
							if itemDate > existing.LatestDate {
								existing.LatestDate = itemDate
							}
							if len(donorName) > len(existing.OriginalName) && donorName != "Anonymous BITSian" {
								existing.OriginalName = donorName
							}
							if existing.Email == "" && email != "" {
								existing.Email = email
							}
							if existing.Phone == "" && phone != "" {
								existing.Phone = phone
							}
							if targetDeptID > 0 {
								existing.TargetDeptID = targetDeptID
							}
							if targetDeptCode != "" {
								existing.TargetDeptCode = targetDeptCode
							}
						} else {
							aggregatedMap[normKey] = &AggregatedDonor{
								DonorKey:       normKey,
								Name:           donorName,
								OriginalName:   donorName,
								Email:          email,
								Phone:          phone,
								PhoneDigits:    phoneDigits,
								Amount:         amt,
								LatestDate:     itemDate,
								TargetDeptID:   targetDeptID,
								TargetDeptCode: targetDeptCode,
								IsAnonymous:    isAnon,
							}
						}
					}

					for key, donor := range aggregatedMap {
						customName := ""
						isOverridden := false
						if custom, ok := overridesMap[key]; ok && custom != "" {
							customName = custom
							isOverridden = true
						} else if donor.PhoneDigits != "" {
							if custom, ok := overridesMap["phone_"+donor.PhoneDigits]; ok && custom != "" {
								customName = custom
								isOverridden = true
							}
						} else if donor.Email != "" {
							if custom, ok := overridesMap["email_"+strings.ToLower(strings.TrimSpace(donor.Email))]; ok && custom != "" {
								customName = custom
								isOverridden = true
							}
						}

						displayName := donor.OriginalName
						if isOverridden && customName != "" {
							displayName = customName
						}

						deptID := resolveDonorDepartmentID(key, donor, deptMappings)
						var deptDisplay string
						var deptCode string
						var deptYear string
						var deptName string
						if deptID > 0 {
							if d, ok := deptMap[deptID]; ok {
								deptDisplay = fmt.Sprintf("%s - %s", d.Code, d.Year)
								deptCode = d.Code
								deptYear = d.Year
								deptName = d.Name
							}
						}

						leaderboard = append(leaderboard, gin.H{
							"donor_key":          key,
							"display_name":       displayName,
							"original_name":      donor.OriginalName,
							"custom_name":        customName,
							"is_overridden":      isOverridden,
							"email":              donor.Email,
							"phone":              donor.Phone,
							"amount":             donor.Amount,
							"date":               donor.LatestDate,
							"department_id":      deptID,
							"department_name":    deptName,
							"department_code":    deptCode,
							"department_year":    deptYear,
							"department_display": deptDisplay,
						})
					}

					sort.Slice(leaderboard, func(i, j int) bool {
						amtI, _ := leaderboard[i]["amount"].(float64)
						amtJ, _ := leaderboard[j]["amount"].(float64)
						if amtI != amtJ {
							return amtI > amtJ
						}
						dateI, _ := leaderboard[i]["date"].(string)
						dateJ, _ := leaderboard[j]["date"].(string)
						if dateI != dateJ {
							return dateI > dateJ
						}
						nameI, _ := leaderboard[i]["display_name"].(string)
						nameJ, _ := leaderboard[j]["display_name"].(string)
						return strings.ToLower(nameI) < strings.ToLower(nameJ)
					})
				}
			}
		}
	}

	deptLeaderboard := buildDepartmentLeaderboard(aggregatedMap)

	c.JSON(http.StatusOK, gin.H{
		"success":                true,
		"leaderboard":            leaderboard,
		"department_leaderboard": deptLeaderboard,
	})
}

type UpdateSponsorNameOverrideRequest struct {
	DonorKey   string `json:"donor_key"`
	CustomName string `json:"custom_name"`
	Email      string `json:"email"`
	Phone      string `json:"phone"`
}

// UpdateSponsorNameOverride allows admin to change how a donor's name appears on the leaderboard
func (h *SponsorsHandler) UpdateSponsorNameOverride(c *gin.Context) {
	var req UpdateSponsorNameOverrideRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request payload"})
		return
	}

	donorKey := strings.TrimSpace(req.DonorKey)
	customName := strings.TrimSpace(req.CustomName)
	if donorKey == "" || customName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "donor_key and custom_name are required"})
		return
	}

	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Database connection not available"})
		return
	}

	query := `
		INSERT INTO sponsor_name_overrides (donor_key, custom_name, email, phone)
		VALUES (?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			custom_name = VALUES(custom_name),
			email = VALUES(email),
			phone = VALUES(phone);
	`

	_, err := config.DB.Exec(query, donorKey, customName, strings.TrimSpace(req.Email), strings.TrimSpace(req.Phone))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("Failed to update name override: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Donor leaderboard display name updated successfully",
	})
}

// DeleteSponsorNameOverride resets a donor's leaderboard display name back to original
func (h *SponsorsHandler) DeleteSponsorNameOverride(c *gin.Context) {
	donorKey := strings.TrimSpace(c.Query("donor_key"))
	if donorKey == "" {
		var req struct {
			DonorKey string `json:"donor_key"`
		}
		c.ShouldBindJSON(&req)
		donorKey = strings.TrimSpace(req.DonorKey)
	}

	if donorKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "donor_key is required"})
		return
	}

	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Database connection not available"})
		return
	}

	_, err := config.DB.Exec("DELETE FROM sponsor_name_overrides WHERE donor_key = ?", donorKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("Failed to reset name override: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Donor leaderboard display name reset to original",
	})
}

type ContributionCheckRequest struct {
	Phone string `json:"phone"`
	Email string `json:"email"`
}

// CheckContribution searches Razorpay payments for a specific user's phone or email
// and returns their total contribution amount, rank, and supporter details securely.
func (h *SponsorsHandler) CheckContribution(c *gin.Context) {
	var reqBody ContributionCheckRequest
	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Invalid request body",
		})
		return
	}

	searchPhoneDigits := cleanPhone(reqBody.Phone)
	searchEmail := strings.ToLower(strings.TrimSpace(reqBody.Email))

	if searchPhoneDigits == "" && searchEmail == "" {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"found":   false,
			"amount":  0,
			"rank":    0,
		})
		return
	}

	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	if keyID == "" || keySecret == "" {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"found":   false,
			"amount":  0,
			"rank":    0,
		})
		return
	}

	url := "https://api.razorpay.com/v1/payments?count=100"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to create request"})
		return
	}

	req.SetBasicAuth(keyID, keySecret)
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"found":   false,
			"amount":  0,
			"rank":    0,
		})
		return
	}
	defer resp.Body.Close()
	body, _ := io.ReadAll(resp.Body)

	var rzpRes RazorpayPaymentsResponse
	if err := json.Unmarshal(body, &rzpRes); err != nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "found": false})
		return
	}

	type InternalDonor struct {
		Key             string
		Name            string
		Amount          float64
		NamedAmount     float64
		AnonymousAmount float64
		LatestDate      string
		Phones          map[string]bool
		Emails          map[string]bool
	}

	aggregatedMap := make(map[string]*InternalDonor)

	for _, item := range rzpRes.Items {
		st := strings.ToLower(item.Status)
		if st != "captured" && st != "authorized" {
			continue
		}

		amt := float64(item.Amount) / 100.0
		if item.AmountPaid > 0 {
			amt = float64(item.AmountPaid) / 100.0
		}

		email := strings.ToLower(strings.TrimSpace(item.Email))
		phone := cleanPhone(item.Contact)
		isAnon := false
		if item.Notes != nil {
			if e, ok := item.Notes["email"].(string); ok && e != "" {
				email = strings.ToLower(strings.TrimSpace(e))
			}
			if p, ok := item.Notes["phone"].(string); ok && p != "" {
				phone = cleanPhone(p)
			} else if p, ok := item.Notes["contact"].(string); ok && p != "" {
				phone = cleanPhone(p)
			}
			if anonStr, ok := item.Notes["is_anonymous"].(string); ok {
				isAnon = (anonStr == "true" || anonStr == "1" || anonStr == "yes")
			} else if anonBool, ok := item.Notes["is_anonymous"].(bool); ok {
				isAnon = anonBool
			}
		}

		donorName := extractName(item.Notes, email)
		if donorName == "Anonymous BITSian" {
			isAnon = true
		}

		var normKey string
		if phone != "" {
			normKey = "phone_" + phone
		} else if email != "" {
			normKey = "email_" + email
		} else {
			normKey = "name_" + strings.ToLower(strings.TrimSpace(donorName))
		}

		itemDate := time.Unix(item.CreatedAt, 0).Format("2006-01-02")

		if existing, found := aggregatedMap[normKey]; found {
			existing.Amount += amt
			if isAnon {
				existing.AnonymousAmount += amt
			} else {
				existing.NamedAmount += amt
			}
			if itemDate > existing.LatestDate {
				existing.LatestDate = itemDate
			}
			if len(donorName) > len(existing.Name) && donorName != "Anonymous BITSian" {
				existing.Name = donorName
			}
			if phone != "" {
				existing.Phones[phone] = true
			}
			if email != "" {
				existing.Emails[email] = true
			}
		} else {
			donor := &InternalDonor{
				Key:        normKey,
				Name:       donorName,
				Amount:     amt,
				LatestDate: itemDate,
				Phones:     make(map[string]bool),
				Emails:     make(map[string]bool),
			}
			if isAnon {
				donor.AnonymousAmount = amt
			} else {
				donor.NamedAmount = amt
			}
			if phone != "" {
				donor.Phones[phone] = true
			}
			if email != "" {
				donor.Emails[email] = true
			}
			aggregatedMap[normKey] = donor
		}
	}

	var donorList []*InternalDonor
	for _, d := range aggregatedMap {
		donorList = append(donorList, d)
	}

	sort.Slice(donorList, func(i, j int) bool {
		if donorList[i].Amount != donorList[j].Amount {
			return donorList[i].Amount > donorList[j].Amount
		}
		if donorList[i].LatestDate != donorList[j].LatestDate {
			return donorList[i].LatestDate > donorList[j].LatestDate
		}
		return strings.ToLower(donorList[i].Name) < strings.ToLower(donorList[j].Name)
	})

	var matchedDonor *InternalDonor
	matchedRank := 0

	for i, d := range donorList {
		matchesPhone := searchPhoneDigits != "" && d.Phones[searchPhoneDigits]
		matchesEmail := searchEmail != "" && d.Emails[searchEmail]
		if matchesPhone || matchesEmail {
			matchedDonor = d
			matchedRank = i + 1
			break
		}
	}

	if matchedDonor != nil {
		hVal := uint32(0)
		for _, ch := range []byte(matchedDonor.Key) {
			hVal = hVal*31 + uint32(ch)
		}
		certID := fmt.Sprintf("BIT-PATRON-%d", hVal)

		overridesMap := getOverridesMap()
		displayName := matchedDonor.Name
		if custom, ok := overridesMap[matchedDonor.Key]; ok && custom != "" {
			displayName = custom
		} else {
			if searchPhoneDigits != "" {
				if custom, ok := overridesMap["phone_"+searchPhoneDigits]; ok && custom != "" {
					displayName = custom
				}
			}
			if searchEmail != "" {
				if custom, ok := overridesMap["email_"+searchEmail]; ok && custom != "" {
					displayName = custom
				}
			}
		}

		matchedEmail := searchEmail
		if matchedEmail == "" {
			for e := range matchedDonor.Emails {
				matchedEmail = e
				break
			}
		}

		matchedPhone := searchPhoneDigits
		if matchedPhone == "" {
			for p := range matchedDonor.Phones {
				matchedPhone = p
				break
			}
		}

		c.JSON(http.StatusOK, gin.H{
			"success":          true,
			"found":            true,
			"amount":           matchedDonor.Amount,
			"named_amount":     matchedDonor.NamedAmount,
			"anonymous_amount": matchedDonor.AnonymousAmount,
			"rank":             matchedRank,
			"total_supporters": len(donorList),
			"name":             displayName,
			"email":            matchedEmail,
			"phone":            matchedPhone,
			"donor_key":        matchedDonor.Key,
			"is_top_10":        matchedRank <= 10,
			"certificate_id":   certID,
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"success":          true,
			"found":            false,
			"amount":           0,
			"rank":             0,
			"total_supporters": len(donorList),
		})
	}
}

type CreateOrderRequest struct {
	Amount             float64 `json:"amount"` // in Rupees
	Name               string  `json:"name"`
	Email              string  `json:"email"`
	Phone              string  `json:"phone"`
	IsAnonymous        bool    `json:"is_anonymous"`
	TargetDepartmentID int     `json:"target_department_id"`
	TargetDeptCode     string  `json:"target_department_code"`
}

// CreateOrder creates a Razorpay order with payment_capture: 1 for automatic capture
func (h *SponsorsHandler) CreateOrder(c *gin.Context) {
	var req CreateOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.Amount <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid amount"})
		return
	}

	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	if keyID == "" || keySecret == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Razorpay API keys missing"})
		return
	}

	amountInPaise := int64(req.Amount * 100)

	payload := map[string]interface{}{
		"amount":          amountInPaise,
		"currency":        "INR",
		"payment_capture": 1, // Auto capture
		"notes": map[string]string{
			"name":                   req.Name,
			"email":                  req.Email,
			"phone":                  req.Phone,
			"contact":                req.Phone,
			"is_anonymous":           fmt.Sprintf("%t", req.IsAnonymous),
			"target_department_id":   fmt.Sprintf("%d", req.TargetDepartmentID),
			"target_department_code": req.TargetDeptCode,
		},
	}

	jsonBytes, _ := json.Marshal(payload)
	url := "https://api.razorpay.com/v1/orders"

	httpReq, err := http.NewRequest("POST", url, strings.NewReader(string(jsonBytes)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to build order request"})
		return
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.SetBasicAuth(keyID, keySecret)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Razorpay Order creation failed"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var orderRes struct {
		ID       string `json:"id"`
		Amount   int64  `json:"amount"`
		Currency string `json:"currency"`
	}

	if err := json.Unmarshal(body, &orderRes); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to parse order response"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"order_id": orderRes.ID,
		"amount":   orderRes.Amount,
		"currency": orderRes.Currency,
	})
}

type CapturePaymentRequest struct {
	PaymentID string  `json:"payment_id"`
	Amount    float64 `json:"amount"`
}

// CapturePayment captures an authorized payment immediately via Razorpay API
func (h *SponsorsHandler) CapturePayment(c *gin.Context) {
	var req CapturePaymentRequest
	if err := c.ShouldBindJSON(&req); err != nil || req.PaymentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid payment ID"})
		return
	}

	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	if keyID == "" || keySecret == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Razorpay credentials missing"})
		return
	}

	amountInPaise := int64(req.Amount * 100)
	payload := map[string]interface{}{
		"amount":   amountInPaise,
		"currency": "INR",
	}

	jsonBytes, _ := json.Marshal(payload)
	url := fmt.Sprintf("https://api.razorpay.com/v1/payments/%s/capture", req.PaymentID)

	httpReq, err := http.NewRequest("POST", url, strings.NewReader(string(jsonBytes)))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Failed to build capture request"})
		return
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.SetBasicAuth(keyID, keySecret)

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Razorpay capture call failed"})
		return
	}
	defer resp.Body.Close()

	c.JSON(http.StatusOK, gin.H{"success": true, "captured": true})
}

// GetCertificate fetches and verifies total cumulative patron contribution details directly from Razorpay
func (h *SponsorsHandler) GetCertificate(c *gin.Context) {
	idParam := c.Param("id")
	idParam = strings.TrimSpace(idParam)

	cleanID := idParam
	if strings.HasPrefix(cleanID, "BIT-PATRON-") {
		cleanID = strings.TrimPrefix(cleanID, "BIT-PATRON-")
	}
	cleanID = strings.ToLower(cleanID)

	if cleanID == "" {
		c.JSON(http.StatusOK, gin.H{
			"success":  true,
			"verified": false,
			"error":    "Missing certificate ID",
		})
		return
	}

	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	if keyID == "" || keySecret == "" {
		c.JSON(http.StatusOK, gin.H{
			"success":  true,
			"verified": false,
			"error":    "Server credentials missing",
		})
		return
	}

	url := "https://api.razorpay.com/v1/payments?count=100"
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "verified": false, "error": "Failed to create request"})
		return
	}

	req.SetBasicAuth(keyID, keySecret)
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusOK, gin.H{"success": true, "verified": false, "error": "Failed to query Razorpay records"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var rzpRes RazorpayPaymentsResponse
	if err := json.Unmarshal(body, &rzpRes); err != nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "verified": false, "error": "Failed to parse payment records"})
		return
	}

	type InternalDonor struct {
		Key        string
		CertID     string
		Name       string
		Amount     float64
		LatestDate string
		PaymentIDs []string
		Phones     map[string]bool
		Emails     map[string]bool
	}

	aggregatedMap := make(map[string]*InternalDonor)

	for _, item := range rzpRes.Items {
		st := strings.ToLower(item.Status)
		if st != "captured" && st != "authorized" {
			continue
		}

		amt := float64(item.Amount) / 100.0
		if item.AmountPaid > 0 {
			amt = float64(item.AmountPaid) / 100.0
		}

		email := strings.ToLower(strings.TrimSpace(item.Email))
		phone := cleanPhone(item.Contact)
		if item.Notes != nil {
			if e, ok := item.Notes["email"].(string); ok && e != "" {
				email = strings.ToLower(strings.TrimSpace(e))
			}
			if p, ok := item.Notes["phone"].(string); ok && p != "" {
				phone = cleanPhone(p)
			} else if p, ok := item.Notes["contact"].(string); ok && p != "" {
				phone = cleanPhone(p)
			}
		}

		donorName := extractName(item.Notes, email)

		var normKey string
		if phone != "" {
			normKey = "phone_" + phone
		} else if email != "" {
			normKey = "email_" + email
		} else {
			normKey = "name_" + strings.ToLower(strings.TrimSpace(donorName))
		}

		itemDate := time.Unix(item.CreatedAt, 0).Format("2006-01-02")

		if existing, found := aggregatedMap[normKey]; found {
			existing.Amount += amt
			if itemDate > existing.LatestDate {
				existing.LatestDate = itemDate
			}
			if len(donorName) > len(existing.Name) && donorName != "Anonymous BITSian" {
				existing.Name = donorName
			}
			if phone != "" {
				existing.Phones[phone] = true
			}
			if email != "" {
				existing.Emails[email] = true
			}
			existing.PaymentIDs = append(existing.PaymentIDs, item.ID)
		} else {
			donor := &InternalDonor{
				Key:        normKey,
				Name:       donorName,
				Amount:     amt,
				LatestDate: itemDate,
				PaymentIDs: []string{item.ID},
				Phones:     make(map[string]bool),
				Emails:     make(map[string]bool),
			}
			if phone != "" {
				donor.Phones[phone] = true
			}
			if email != "" {
				donor.Emails[email] = true
			}
			aggregatedMap[normKey] = donor
		}
	}

	var donorList []*InternalDonor
	for _, d := range aggregatedMap {
		// Generate deterministic numeric patron cert ID snippet
		hVal := uint32(0)
		for _, ch := range []byte(d.Key) {
			hVal = hVal*31 + uint32(ch)
		}
		d.CertID = fmt.Sprintf("%d", hVal)
		donorList = append(donorList, d)
	}

	sort.Slice(donorList, func(i, j int) bool {
		if donorList[i].Amount != donorList[j].Amount {
			return donorList[i].Amount > donorList[j].Amount
		}
		if donorList[i].LatestDate != donorList[j].LatestDate {
			return donorList[i].LatestDate > donorList[j].LatestDate
		}
		return strings.ToLower(donorList[i].Name) < strings.ToLower(donorList[j].Name)
	})

	rawClean := strings.TrimSpace(idParam)
	rawClean = strings.TrimPrefix(rawClean, "BIT-PATRON-")
	rawClean = strings.TrimPrefix(rawClean, "bit-patron-")
	rawCleanNoPay := strings.TrimPrefix(rawClean, "pay_")
	rawCleanNoPay = strings.TrimPrefix(rawCleanNoPay, "PAY_")

	var matchedDonor *InternalDonor
	matchedRank := 0

	for i, d := range donorList {
		matchesCertID := strings.EqualFold(d.CertID, rawClean) || strings.EqualFold(d.CertID, rawCleanNoPay)

		matchesPaymentID := false
		for _, pid := range d.PaymentIDs {
			pidNoPay := strings.TrimPrefix(pid, "pay_")
			if strings.EqualFold(pid, rawClean) ||
				strings.EqualFold(pid, "pay_"+rawCleanNoPay) ||
				strings.EqualFold(pidNoPay, rawClean) ||
				strings.EqualFold(pidNoPay, rawCleanNoPay) {
				matchesPaymentID = true
				break
			}
		}

		if matchesCertID || matchesPaymentID {
			matchedDonor = d
			matchedRank = i + 1
			break
		}
	}


	if matchedDonor != nil {
		c.JSON(http.StatusOK, gin.H{
			"success":          true,
			"verified":         true,
			"certificate_id":   "BIT-PATRON-" + matchedDonor.CertID,
			"name":             matchedDonor.Name,
			"amount":           matchedDonor.Amount,
			"rank":             matchedRank,
			"total_supporters": len(donorList),
			"date":             matchedDonor.LatestDate,
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"success":  true,
			"verified": false,
			"error":    "No verified patron contribution record found for this certificate ID.",
		})
	}
}

func (h *SponsorsHandler) GetDepartmentLeaderboard(c *gin.Context) {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	aggregatedMap := make(map[string]*AggregatedDonor)

	if keyID != "" && keySecret != "" {
		url := "https://api.razorpay.com/v1/payments?count=100"
		req, err := http.NewRequest("GET", url, nil)
		if err == nil {
			req.SetBasicAuth(keyID, keySecret)
			client := &http.Client{Timeout: 10 * time.Second}
			resp, err := client.Do(req)
			if err == nil && resp.StatusCode == http.StatusOK {
				defer resp.Body.Close()
				body, _ := io.ReadAll(resp.Body)

				var rzpRes RazorpayPaymentsResponse
				if err := json.Unmarshal(body, &rzpRes); err == nil {
					for _, item := range rzpRes.Items {
						st := strings.ToLower(item.Status)
						if st != "captured" && st != "authorized" {
							continue
						}

						amt := float64(item.Amount) / 100.0
						if item.AmountPaid > 0 {
							amt = float64(item.AmountPaid) / 100.0
						}

						email := item.Email
						phone := item.Contact
						if item.Notes != nil {
							if e, ok := item.Notes["email"].(string); ok && e != "" {
								email = e
							}
							if p, ok := item.Notes["phone"].(string); ok && p != "" {
								phone = p
							} else if p, ok := item.Notes["contact"].(string); ok && p != "" {
								phone = p
							}
						}

						donorName := extractName(item.Notes, email)
						phoneDigits := cleanPhone(phone)

						var normKey string
						if phoneDigits != "" {
							normKey = "phone_" + phoneDigits
						} else if strings.TrimSpace(email) != "" {
							normKey = "email_" + strings.ToLower(strings.TrimSpace(email))
						} else {
							normKey = "name_" + strings.ToLower(strings.TrimSpace(donorName))
						}

						itemDate := time.Unix(item.CreatedAt, 0).Format("2006-01-02")

						if existing, found := aggregatedMap[normKey]; found {
							existing.Amount += amt
							if itemDate > existing.LatestDate {
								existing.LatestDate = itemDate
							}
						} else {
							aggregatedMap[normKey] = &AggregatedDonor{
								DonorKey:     normKey,
								Name:         donorName,
								OriginalName: donorName,
								Email:        email,
								Phone:        phone,
								PhoneDigits:  phoneDigits,
								Amount:       amt,
								LatestDate:   itemDate,
							}
						}
					}
				}
			}
		}
	}

	deptLeaderboard := buildDepartmentLeaderboard(aggregatedMap)
	c.JSON(http.StatusOK, gin.H{
		"success":                true,
		"department_leaderboard": deptLeaderboard,
	})
}

func (h *SponsorsHandler) GetSponsorDepartments(c *gin.Context) {
	_, list := getDepartmentsMap()
	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"departments": list,
	})
}

func (h *SponsorsHandler) CreateSponsorDepartment(c *gin.Context) {
	var req struct {
		Name      string `json:"name"`
		Code      string `json:"code"`
		EmailCode string `json:"email_code"`
		Year      string `json:"year"`
		YearCode  string `json:"year_code"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request payload"})
		return
	}

	name := strings.TrimSpace(req.Name)
	code := strings.ToUpper(strings.TrimSpace(req.Code))
	emailCode := strings.ToLower(strings.TrimSpace(req.EmailCode))
	year := strings.TrimSpace(req.Year)
	yearCode := strings.ToLower(strings.TrimSpace(req.YearCode))

	if name == "" || code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Department name and short code are required"})
		return
	}
	if year == "" {
		year = "1st Year"
	}

	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Database not available"})
		return
	}

	res, err := config.DB.Exec("INSERT INTO sponsor_departments (name, code, email_code, year, year_code) VALUES (?, ?, ?, ?, ?)", name, code, emailCode, year, yearCode)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": fmt.Sprintf("Failed to create department: %v", err)})
		return
	}

	id, _ := res.LastInsertId()
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Department created successfully",
		"department": gin.H{
			"id":         id,
			"name":       name,
			"code":       code,
			"email_code": emailCode,
			"year":       year,
			"year_code":  yearCode,
		},
	})
}

func (h *SponsorsHandler) UpdateSponsorDepartment(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid department ID"})
		return
	}

	var req struct {
		Name      string `json:"name"`
		Code      string `json:"code"`
		EmailCode string `json:"email_code"`
		Year      string `json:"year"`
		YearCode  string `json:"year_code"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request payload"})
		return
	}

	name := strings.TrimSpace(req.Name)
	code := strings.ToUpper(strings.TrimSpace(req.Code))
	emailCode := strings.ToLower(strings.TrimSpace(req.EmailCode))
	year := strings.TrimSpace(req.Year)
	yearCode := strings.ToLower(strings.TrimSpace(req.YearCode))

	if name == "" || code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Department name and short code are required"})
		return
	}

	_, err = config.DB.Exec("UPDATE sponsor_departments SET name = ?, code = ?, email_code = ?, year = ?, year_code = ? WHERE id = ?", name, code, emailCode, year, yearCode, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("Failed to update department: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Department updated successfully",
	})
}

func (h *SponsorsHandler) DeleteSponsorDepartment(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid department ID"})
		return
	}

	_, _ = config.DB.Exec("DELETE FROM sponsor_department_mappings WHERE department_id = ?", id)
	_, err = config.DB.Exec("DELETE FROM sponsor_departments WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("Failed to delete department: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Department deleted successfully",
	})
}

func (h *SponsorsHandler) UpdateSponsorDepartmentMapping(c *gin.Context) {
	var req struct {
		DonorKey     string `json:"donor_key"`
		DepartmentID int    `json:"department_id"`
		Email        string `json:"email"`
		Phone        string `json:"phone"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request payload"})
		return
	}

	donorKey := strings.TrimSpace(req.DonorKey)
	if donorKey == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "donor_key is required"})
		return
	}

	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Database not available"})
		return
	}

	if req.DepartmentID <= 0 {
		_, err := config.DB.Exec("DELETE FROM sponsor_department_mappings WHERE donor_key = ?", donorKey)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("Failed to remove mapping: %v", err)})
			return
		}
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "Donor department mapping removed"})
		return
	}

	query := `
		INSERT INTO sponsor_department_mappings (donor_key, department_id)
		VALUES (?, ?)
		ON DUPLICATE KEY UPDATE department_id = VALUES(department_id);
	`
	_, err := config.DB.Exec(query, donorKey, req.DepartmentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("Failed to update mapping: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Donor department mapping updated successfully",
	})
}

func (h *SponsorsHandler) CreateSponsorDepartmentsBatch(c *gin.Context) {
	var req struct {
		Departments []struct {
			Name      string `json:"name"`
			Code      string `json:"code"`
			EmailCode string `json:"email_code"`
			Year      string `json:"year"`
			YearCode  string `json:"year_code"`
		} `json:"departments"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request payload"})
		return
	}

	if len(req.Departments) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "No departments provided"})
		return
	}

	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Database not available"})
		return
	}

	stmt, err := config.DB.Prepare(`
		INSERT INTO sponsor_departments (name, code, email_code, year, year_code)
		VALUES (?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE name = VALUES(name), email_code = VALUES(email_code), year_code = VALUES(year_code)
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("Failed to prepare statement: %v", err)})
		return
	}
	defer stmt.Close()

	added := 0
	for _, d := range req.Departments {
		name := strings.TrimSpace(d.Name)
		code := strings.ToUpper(strings.TrimSpace(d.Code))
		emailCode := strings.ToLower(strings.TrimSpace(d.EmailCode))
		year := strings.TrimSpace(d.Year)
		yearCode := strings.ToLower(strings.TrimSpace(d.YearCode))

		if name != "" && code != "" {
			if year == "" {
				year = "1st Year"
			}
			if _, err := stmt.Exec(name, code, emailCode, year, yearCode); err == nil {
				added++
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"message":     fmt.Sprintf("Successfully uploaded %d departments", added),
		"count_added": added,
	})
}

func (h *SponsorsHandler) UpdateSponsorDepartmentMappingsBatch(c *gin.Context) {
	var req struct {
		Mappings []struct {
			DonorKey       string `json:"donor_key"`
			Email          string `json:"email"`
			Phone          string `json:"phone"`
			DepartmentCode string `json:"department_code"`
			Year           string `json:"year"`
			DepartmentID   int    `json:"department_id"`
		} `json:"mappings"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "Invalid request payload"})
		return
	}

	if len(req.Mappings) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "No mappings provided"})
		return
	}

	if config.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "Database not available"})
		return
	}

	deptMap, _ := getDepartmentsMap()
	lookupByCodeYear := make(map[string]int)
	lookupByCode := make(map[string]int)
	for _, d := range deptMap {
		key := strings.ToLower(d.Code) + "_" + strings.ToLower(d.Year)
		lookupByCodeYear[key] = d.ID
		lookupByCode[strings.ToLower(d.Code)] = d.ID
	}

	stmt, err := config.DB.Prepare(`
		INSERT INTO sponsor_department_mappings (donor_key, department_id)
		VALUES (?, ?)
		ON DUPLICATE KEY UPDATE department_id = VALUES(department_id)
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": fmt.Sprintf("Failed to prepare statement: %v", err)})
		return
	}
	defer stmt.Close()

	updatedCount := 0
	for _, m := range req.Mappings {
		deptID := m.DepartmentID

		if deptID <= 0 && m.DepartmentCode != "" {
			codeLower := strings.ToLower(strings.TrimSpace(m.DepartmentCode))
			yearLower := strings.ToLower(strings.TrimSpace(m.Year))
			if yearLower != "" {
				if id, found := lookupByCodeYear[codeLower+"_"+yearLower]; found {
					deptID = id
				}
			}
			if deptID <= 0 {
				if id, found := lookupByCode[codeLower]; found {
					deptID = id
				}
			}
		}

		if deptID <= 0 {
			continue
		}

		var keysToMap []string
		donorKey := strings.TrimSpace(m.DonorKey)
		if donorKey != "" {
			keysToMap = append(keysToMap, donorKey)
		}

		phoneDigits := cleanPhone(m.Phone)
		if phoneDigits != "" {
			keysToMap = append(keysToMap, "phone_"+phoneDigits)
		}

		email := strings.ToLower(strings.TrimSpace(m.Email))
		if email != "" {
			keysToMap = append(keysToMap, "email_"+email)
		}

		for _, k := range keysToMap {
			if _, err := stmt.Exec(k, deptID); err == nil {
				updatedCount++
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("Successfully mapped %d donor records to departments", updatedCount),
		"updated": updatedCount,
	})
}






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

	"bitcentral-v2/server/config"

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
	DonorKey     string  `json:"donor_key"`
	Name         string  `json:"name"`
	OriginalName string  `json:"original_name"`
	Email        string  `json:"email"`
	Phone        string  `json:"phone"`
	PhoneDigits  string  `json:"phone_digits"`
	Amount       float64 `json:"amount"`
	LatestDate   string  `json:"date"`
}

// GetSponsorsLeaderboard returns real public leaderboard for Support Dev page
func (h *SponsorsHandler) GetSponsorsLeaderboard(c *gin.Context) {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	var sponsors []gin.H
	var total float64
	overridesMap := getOverridesMap()

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
					aggregatedMap := make(map[string]*AggregatedDonor)

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
							if len(donorName) > len(existing.OriginalName) && donorName != "Anonymous BITSian" {
								existing.OriginalName = donorName
							}
							if existing.Email == "" && email != "" {
								existing.Email = email
							}
							if existing.Phone == "" && phone != "" {
								existing.Phone = phone
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

						sponsors = append(sponsors, gin.H{
							"name":   displayName,
							"amount": donor.Amount,
							"date":   donor.LatestDate,
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

	c.JSON(http.StatusOK, gin.H{
		"success":          true,
		"total_raised":     total,
		"total_supporters": len(sponsors),
		"sponsors":         sponsors,
	})
}

// GetSponsorsLeaderboardAdmin returns detailed leaderboard data for admin review with override state
func (h *SponsorsHandler) GetSponsorsLeaderboardAdmin(c *gin.Context) {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	var leaderboard []gin.H
	overridesMap := getOverridesMap()

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
					aggregatedMap := make(map[string]*AggregatedDonor)

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
							if len(donorName) > len(existing.OriginalName) && donorName != "Anonymous BITSian" {
								existing.OriginalName = donorName
							}
							if existing.Email == "" && email != "" {
								existing.Email = email
							}
							if existing.Phone == "" && phone != "" {
								existing.Phone = phone
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

						leaderboard = append(leaderboard, gin.H{
							"donor_key":     key,
							"display_name":  displayName,
							"original_name": donor.OriginalName,
							"custom_name":   customName,
							"is_overridden": isOverridden,
							"email":         donor.Email,
							"phone":         donor.Phone,
							"amount":        donor.Amount,
							"date":          donor.LatestDate,
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

	c.JSON(http.StatusOK, gin.H{
		"success":     true,
		"leaderboard": leaderboard,
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
		Key        string
		Name       string
		Amount     float64
		LatestDate string
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
		} else {
			donor := &InternalDonor{
				Key:        normKey,
				Name:       donorName,
				Amount:     amt,
				LatestDate: itemDate,
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

		c.JSON(http.StatusOK, gin.H{
			"success":          true,
			"found":            true,
			"amount":           matchedDonor.Amount,
			"rank":             matchedRank,
			"total_supporters": len(donorList),
			"name":             matchedDonor.Name,
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
	Amount float64 `json:"amount"` // in Rupees
	Name   string  `json:"name"`
	Email  string  `json:"email"`
	Phone  string  `json:"phone"`
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
			"name":    req.Name,
			"email":   req.Email,
			"phone":   req.Phone,
			"contact": req.Phone,
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






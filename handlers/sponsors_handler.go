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

	"github.com/gin-gonic/gin"
)

type SponsorsHandler struct{}

func NewSponsorsHandler() *SponsorsHandler {
	return &SponsorsHandler{}
}

type RazorpayPaymentItem struct {
	ID         string                 `json:"id"`
	Entity     string                 `json:"entity"`
	Amount     int64                  `json:"amount"`      // in paise
	AmountPaid int64                  `json:"amount_paid"` // in paise
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

// GetSponsorsLeaderboard returns real public leaderboard for Support Dev page
func (h *SponsorsHandler) GetSponsorsLeaderboard(c *gin.Context) {
	keyID := os.Getenv("RAZORPAY_KEY_ID")
	keySecret := os.Getenv("RAZORPAY_KEY_SECRET")

	var sponsors []gin.H
	var total float64

	if keyID != "" && keySecret != "" {
		url := "https://api.razorpay.com/v1/payments?count=50"
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
						amt := float64(item.Amount) / 100.0
						if item.AmountPaid > 0 {
							amt = float64(item.AmountPaid) / 100.0
						}
						total += amt

						donorName := extractName(item.Notes, item.Email)

						sponsors = append(sponsors, gin.H{
							"name":   donorName,
							"amount": amt,
							"date":   time.Unix(item.CreatedAt, 0).Format("2006-01-02"),
						})
					}

					sort.Slice(sponsors, func(i, j int) bool {
						amtI, _ := sponsors[i]["amount"].(float64)
						amtJ, _ := sponsors[j]["amount"].(float64)
						return amtI > amtJ
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

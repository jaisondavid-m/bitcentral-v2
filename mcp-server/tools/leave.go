package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/mark3labs/mcp-go/mcp"
)

type HolidayItem struct {
	ID          int    `json:"id"`
	Date        string `json:"date"`
	FromDate    string `json:"from_date"`
	FromHalfDay string `json:"from_half_day,omitempty"`
	ToDate      string `json:"to_date"`
	ToHalfDay   string `json:"to_half_day,omitempty"`
	Day         string `json:"day"`
	Occasion    string `json:"occasion"`
	Type        string `json:"type"`
	Status      string `json:"status,omitempty"`        // "upcoming", "today", "past"
	DaysAway    int    `json:"days_remaining,omitempty"` // e.g. 5 days from today
}

type LeaveResponse struct {
	Success bool          `json:"success"`
	Count   int           `json:"count"`
	Data    []HolidayItem `json:"data"`
}

type FilteredLeavesResponse struct {
	Filter      string        `json:"filter"`
	Total       int           `json:"total"`
	CurrentDate string        `json:"current_date"`
	Leaves      []HolidayItem `json:"leaves"`
}

// GetLeaveDetailsHandler retrieves upcoming, past, or all college leaves and holidays.
func GetLeaveDetailsHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	statusFilter := GetStringArg(request, "status")
	if statusFilter == "" {
		statusFilter = GetStringArg(request, "filter")
	}
	if statusFilter == "" {
		statusFilter = "upcoming"
	}
	statusFilter = strings.ToLower(statusFilter)

	var rawResp LeaveResponse
	err := DefaultClient.Get(ctx, "/leaves", nil, &rawResp)
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to fetch leaves from backend: %v", err)), nil
	}

	loc, err := time.LoadLocation("Asia/Kolkata")
	if err != nil {
		loc = time.FixedZone("IST", 5*3600+1800)
	}
	now := time.Now().In(loc)
	todayDate := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)

	var filtered []HolidayItem

	for _, h := range rawResp.Data {
		dateStr := h.FromDate
		if dateStr == "" {
			dateStr = h.Date
		}
		dateStr = strings.TrimSpace(dateStr)

		var holDate time.Time
		var parseErr error
		for _, layout := range []string{"2006-01-02", "02-01-2006", "02/01/2006", "02-Jan-2006", "2 January 2006"} {
			holDate, parseErr = time.ParseInLocation(layout, dateStr, loc)
			if parseErr == nil {
				break
			}
		}

		item := h
		if parseErr == nil {
			diffDays := int(holDate.Sub(todayDate).Hours() / 24)
			item.DaysAway = diffDays

			if diffDays > 0 {
				item.Status = "upcoming"
			} else if diffDays == 0 {
				item.Status = "today"
			} else {
				item.Status = "past"
			}
		} else {
			item.Status = "unspecified"
		}

		// Apply filter
		switch statusFilter {
		case "upcoming":
			if item.Status == "upcoming" || item.Status == "today" {
				filtered = append(filtered, item)
			}
		case "past", "finished":
			if item.Status == "past" {
				filtered = append(filtered, item)
			}
		default: // "all"
			filtered = append(filtered, item)
		}
	}

	result := FilteredLeavesResponse{
		Filter:      statusFilter,
		Total:       len(filtered),
		CurrentDate: todayDate.Format("2006-01-02") + " (IST)",
		Leaves:      filtered,
	}

	resultJSON, err := json.MarshalIndent(result, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format leave response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}
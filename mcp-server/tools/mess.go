package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/mark3labs/mcp-go/mcp"
)

type CurrentMealInfo struct {
	MealType  string   `json:"meal_type"`
	StartTime string   `json:"start_time"`
	EndTime   string   `json:"end_time"`
	Items     []string `json:"items"`
}

type FullMenu struct {
	Breakfast []string `json:"breakfast"`
	Lunch     []string `json:"lunch"`
	Dinner    []string `json:"dinner"`
}

type MessMenuResponse struct {
	Hostel      string          `json:"hostel"`
	Date        string          `json:"date"`
	Day         string          `json:"day"`
	CurrentTime string          `json:"current_time"`
	CurrentMeal CurrentMealInfo `json:"current_meal"`
	FullMenu    FullMenu        `json:"full_menu"`
	DataFound   bool            `json:"data_found"`
	DefaultMenu bool            `json:"default_menu"`
}

// GetMessMenuHandler retrieves the mess menu for boys or girls hostel for today or a specific date.
func GetMessMenuHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	hostel := GetStringArg(request, "hostel")
	if hostel == "" {
		hostel = "boys"
	}
	hostel = strings.ToLower(hostel)
	if hostel != "boys" && hostel != "girls" {
		return mcp.NewToolResultError("Hostel must be either 'boys' or 'girls'"), nil
	}

	dateStr := GetStringArg(request, "date")
	if dateStr == "" {
		loc, err := time.LoadLocation("Asia/Kolkata")
		if err != nil {
			loc = time.FixedZone("IST", 5*3600+1800)
		}
		dateStr = time.Now().In(loc).Format("2006-01-02")
	}

	queryParams := map[string]string{
		"hostel": hostel,
		"date":   dateStr,
	}

	var menuResp MessMenuResponse
	err := DefaultClient.Get(ctx, "/mess", queryParams, &menuResp)
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to fetch mess menu: %v", err)), nil
	}

	resultJSON, err := json.MarshalIndent(menuResp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format mess response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}

// GetMessTimingsHandler retrieves the standard mess schedule and meal timing windows.
func GetMessTimingsHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	var timingsResp interface{}
	err := DefaultClient.Get(ctx, "/mess/timings", nil, &timingsResp)
	if err != nil {
		timingsResp = map[string]interface{}{
			"Breakfast": map[string]string{"start": "07:00", "end": "08:30", "display": "7:00 AM - 8:30 AM"},
			"Lunch":     map[string]string{"start": "12:20", "end": "13:30", "display": "12:20 PM - 1:30 PM"},
			"Dinner":    map[string]string{"start": "19:00", "end": "20:30", "display": "7:00 PM - 8:30 PM"},
			"timezone":  "Asia/Kolkata (IST)",
		}
	}

	resultJSON, err := json.MarshalIndent(timingsResp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format timings response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}

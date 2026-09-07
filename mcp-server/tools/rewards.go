package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/mark3labs/mcp-go/mcp"
)

type StudentRewardSummary struct {
	SlNo             string `json:"sl_no"`
	Year             string `json:"year"`
	RollNo           string `json:"roll_no"`
	StudentName      string `json:"student_name"`
	CourseCode       string `json:"course_code"`
	Department       string `json:"department"`
	MentorName       string `json:"mentor_name"`
	CumulativePoints string `json:"cumulative_points"`
	RedeemedPoints   string `json:"redeemed_points"`
	BalancePoints    string `json:"balance_points"`
	Tab              string `json:"tab,omitempty"`
}

type SearchRewardResponse struct {
	Query        string                 `json:"query"`
	Total        int                    `json:"total"`
	Data         []StudentRewardSummary `json:"data"`
	DataComplete bool                   `json:"data_complete"`
	Message      string                 `json:"message,omitempty"`
}

type RewardActivityItem struct {
	Date         string `json:"date"`
	RewardPoints string `json:"reward_points"`
	ActivityType string `json:"activity_type"`
	ActivityName string `json:"activity_name"`
	Type         string `json:"type"` // "positive" or "negative"
}

type OverallAveragesResponse struct {
	Averages map[string]interface{} `json:"averages"`
}

// GetStudentRewardPointsHandler handles searching for a student's reward point balance and profile
func GetStudentRewardPointsHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	query := GetStringArg(request, "query")
	if query == "" {
		query = GetStringArg(request, "roll_no")
	}
	if query == "" {
		query = GetStringArg(request, "rollno")
	}
	if query == "" {
		return mcp.NewToolResultError("Query parameter 'query' or 'roll_no' is required (e.g. roll number '7376231CS106' or student name)"), nil
	}

	var searchResp SearchRewardResponse
	err := DefaultClient.Get(ctx, "/search", map[string]string{"q": query}, &searchResp)
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to fetch reward points details: %v", err)), nil
	}

	if len(searchResp.Data) == 0 {
		return mcp.NewToolResultText(fmt.Sprintf("No student reward points record found for query: %s", query)), nil
	}

	resultJSON, err := json.MarshalIndent(searchResp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}

// GetStudentRewardHistoryHandler handles fetching detailed reward activities / history for a student
func GetStudentRewardHistoryHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	rollNo := GetStringArg(request, "roll_no")
	if rollNo == "" {
		rollNo = GetStringArg(request, "rollno")
	}
	if rollNo == "" {
		rollNo = GetStringArg(request, "query")
	}
	if rollNo == "" {
		return mcp.NewToolResultError("Parameter 'roll_no' is required (e.g. '7376231CS106')"), nil
	}
	rollNo = strings.ToUpper(rollNo)

	queryParams := map[string]string{
		"roll_no": rollNo,
	}

	if page, ok := GetNumberArg(request, "page"); ok && page > 0 {
		queryParams["page"] = fmt.Sprintf("%d", int(page))
	}
	if limit, ok := GetNumberArg(request, "limit"); ok && limit > 0 {
		queryParams["limit"] = fmt.Sprintf("%d", int(limit))
	}

	var rawResp interface{}
	err := DefaultClient.Get(ctx, "/rewards", queryParams, &rawResp)
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to fetch student reward history: %v", err)), nil
	}

	resultJSON, err := json.MarshalIndent(rawResp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}

// GetRewardPointsAveragesHandler handles fetching year-wise overall reward point averages across college
func GetRewardPointsAveragesHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	var avgResp OverallAveragesResponse
	err := DefaultClient.Get(ctx, "/averages", nil, &avgResp)
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to fetch overall reward point averages: %v", err)), nil
	}

	resultJSON, err := json.MarshalIndent(avgResp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}
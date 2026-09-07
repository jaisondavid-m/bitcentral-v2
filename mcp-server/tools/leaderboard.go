package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/mark3labs/mcp-go/mcp"
)

type LeaderboardStudentItem struct {
	StudentName   string `json:"student_name"`
	RollNo        string `json:"roll_no"`
	Department    string `json:"department"`
	BalancePoints string `json:"balance_points"`
	Rank          int    `json:"rank,omitempty"`
}

type Top10LeaderboardResponse struct {
	Year         string                   `json:"year,omitempty"`
	Dept         string                   `json:"dept,omitempty"`
	Total        int                      `json:"total"`
	Data         []LeaderboardStudentItem `json:"data"`
	DataComplete bool                     `json:"data_complete"`
	Warnings     []string                 `json:"warnings,omitempty"`
	Message      string                   `json:"message,omitempty"`
}

// GetRewardPointsLeaderboardHandler retrieves the top 10 students leaderboard ranked by reward points.
func GetRewardPointsLeaderboardHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	queryParams := make(map[string]string)

	year := GetStringArg(request, "year")
	if year != "" {
		queryParams["year"] = year
	}

	dept := GetStringArg(request, "department")
	if dept == "" {
		dept = GetStringArg(request, "dept")
	}
	if dept != "" {
		queryParams["dept"] = dept
	}

	// If neither year nor dept was provided, default to year="III" to satisfy backend query requirement
	if queryParams["year"] == "" && queryParams["dept"] == "" {
		queryParams["year"] = "III"
	}

	var leadResp Top10LeaderboardResponse
	err := DefaultClient.Get(ctx, "/top10", queryParams, &leadResp)
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to fetch leaderboard: %v", err)), nil
	}

	// Add 1-indexed ranks for clear presentation
	for i := range leadResp.Data {
		leadResp.Data[i].Rank = i + 1
	}

	resultJSON, err := json.MarshalIndent(leadResp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format leaderboard response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}

// GetSponsorsLeaderboardHandler retrieves the top student sponsors and contributors leaderboard.
func GetSponsorsLeaderboardHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	leaderboardType := GetStringArg(request, "type")
	if leaderboardType == "" {
		leaderboardType = "individual"
	}
	leaderboardType = strings.ToLower(leaderboardType)

	endpoint := "/sponsors/leaderboard"
	if leaderboardType == "department" || leaderboardType == "dept" {
		endpoint = "/sponsors/department-leaderboard"
	}

	var rawResp interface{}
	err := DefaultClient.Get(ctx, endpoint, nil, &rawResp)
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to fetch sponsors leaderboard: %v", err)), nil
	}

	resultJSON, err := json.MarshalIndent(rawResp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format sponsors response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}

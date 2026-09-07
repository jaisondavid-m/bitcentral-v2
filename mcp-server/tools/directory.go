package tools

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"
)

type FacultyMemberInfo struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Phone      string `json:"phone"`
	PhotoURL   string `json:"photo_url"`
	Department string `json:"department"`
	JobTitle   string `json:"job_title"`
	UpdatedAt  string `json:"updated_at,omitempty"`
}

type FacultyDirectoryResponse struct {
	Success bool                `json:"success"`
	Total   int                 `json:"total"`
	Data    []FacultyMemberInfo `json:"data"`
	Message string              `json:"message,omitempty"`
}

// SearchFacultyDirectoryHandler searches the campus faculty directory for contact numbers, emails, and departments.
func SearchFacultyDirectoryHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	queryParams := make(map[string]string)

	query := GetStringArg(request, "query")
	if query == "" {
		query = GetStringArg(request, "name")
	}
	if query != "" {
		queryParams["q"] = query
	}

	dept := GetStringArg(request, "department")
	if dept == "" {
		dept = GetStringArg(request, "dept")
	}
	if dept != "" {
		queryParams["dept"] = dept
	}

	var dirResp FacultyDirectoryResponse
	err := DefaultClient.Get(ctx, "/faculty-directory", queryParams, &dirResp)
	if err != nil {
		errAlt := DefaultClient.Get(ctx, "/faculty", queryParams, &dirResp)
		if errAlt != nil {
			return mcp.NewToolResultError(fmt.Sprintf("Failed to query faculty directory: %v", err)), nil
		}
	}

	if len(dirResp.Data) == 0 {
		return mcp.NewToolResultText("No faculty members found matching your search criteria."), nil
	}

	resultJSON, err := json.MarshalIndent(dirResp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format faculty response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}
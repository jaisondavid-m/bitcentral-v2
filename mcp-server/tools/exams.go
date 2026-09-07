package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"github.com/mark3labs/mcp-go/mcp"
)

type ExamSessionInfo struct {
	SubjectCode string  `json:"subjectCode"`
	SubjectName string  `json:"subjectName,omitempty"`
	Date        string  `json:"date"`
	Session     string  `json:"session"`
	HallNo      string  `json:"hallNo"`
	SeatNo      string  `json:"seatNo,omitempty"`
	Block       *string `json:"block,omitempty"`
}

type AllExamHallsResponse struct {
	Success    bool              `json:"success"`
	RegisterNo string            `json:"registerNo"`
	Sessions   []ExamSessionInfo `json:"sessions"`
	Message    string            `json:"message,omitempty"`
}

type SingleExamHallResponse struct {
	Success    bool   `json:"success"`
	RegisterNo string `json:"registerNo"`
	CourseCode string `json:"courseCode"`
	HallNo     string `json:"hallNo"`
	Message    string `json:"message,omitempty"`
}

// GetStudentExamHallsHandler retrieves all scheduled exam sessions, halls, and block locations for a student register number.
func GetStudentExamHallsHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	registerNo := GetStringArg(request, "register_no")
	if registerNo == "" {
		registerNo = GetStringArg(request, "registerNo")
	}
	if registerNo == "" {
		registerNo = GetStringArg(request, "roll_no")
	}
	if registerNo == "" {
		registerNo = GetStringArg(request, "rollno")
	}
	if registerNo == "" {
		return mcp.NewToolResultError("Parameter 'register_no' is required (e.g. '7376231CS106')"), nil
	}
	registerNo = strings.ToUpper(registerNo)

	var resp AllExamHallsResponse
	err := DefaultClient.Get(ctx, "/exam-hall/all", map[string]string{"registerNo": registerNo}, &resp)
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to fetch exam halls for register number %s: %v", registerNo, err)), nil
	}

	if len(resp.Sessions) == 0 {
		return mcp.NewToolResultText(fmt.Sprintf("No exam sessions found for register number %s", registerNo)), nil
	}

	resultJSON, err := json.MarshalIndent(resp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format exam response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}

// GetExamHallByCourseHandler queries a specific exam hall for a given student register number and course code.
func GetExamHallByCourseHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	registerNo := GetStringArg(request, "register_no")
	if registerNo == "" {
		registerNo = GetStringArg(request, "registerNo")
	}
	if registerNo == "" {
		registerNo = GetStringArg(request, "roll_no")
	}
	if registerNo == "" {
		return mcp.NewToolResultError("Parameter 'register_no' is required"), nil
	}
	registerNo = strings.ToUpper(registerNo)

	courseCode := GetStringArg(request, "course_code")
	if courseCode == "" {
		courseCode = GetStringArg(request, "courseCode")
	}
	if courseCode == "" {
		return mcp.NewToolResultError("Parameter 'course_code' is required (e.g. '22CS501')"), nil
	}
	courseCode = strings.ToUpper(courseCode)

	var resp SingleExamHallResponse
	err := DefaultClient.Get(ctx, "/exam-hall", map[string]string{
		"registerNo": registerNo,
		"courseCode": courseCode,
	}, &resp)
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to fetch exam hall: %v", err)), nil
	}

	resultJSON, err := json.MarshalIndent(resp, "", "  ")
	if err != nil {
		return mcp.NewToolResultError(fmt.Sprintf("Failed to format response: %v", err)), nil
	}

	return mcp.NewToolResultText(string(resultJSON)), nil
}
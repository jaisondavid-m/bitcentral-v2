package chat

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"mcp-server/tools"

	"github.com/mark3labs/mcp-go/mcp"
)

type ChatMessage struct {
	Role       string     `json:"role"`
	Content    string     `json:"content"`
	Name       string     `json:"name,omitempty"`
	ToolCalls  []ToolCall `json:"tool_calls,omitempty"`
	ToolCallID string     `json:"tool_call_id,omitempty"`
}

type ToolCall struct {
	ID       string       `json:"id"`
	Type     string       `json:"type"`
	Function FunctionCall `json:"function"`
}

type FunctionCall struct {
	Name      string `json:"name"`
	Arguments string `json:"arguments"`
}

type RequestBody struct {
	Message string        `json:"message"`
	History []ChatMessage `json:"history,omitempty"`
	RollNo  string        `json:"roll_no,omitempty"`
}

type ChatResponse struct {
	Success   bool     `json:"success"`
	Message   string   `json:"message"`
	ToolsUsed []string `json:"tools_used,omitempty"`
	Error     string   `json:"error,omitempty"`
}

// Ollama OpenAI API spec structures
type OllamaTool struct {
	Type     string         `json:"type"`
	Function OllamaFunction `json:"function"`
}

type OllamaFunction struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Parameters  map[string]interface{} `json:"parameters"`
}

type OllamaChatRequest struct {
	Model    string        `json:"model"`
	Messages []ChatMessage `json:"messages"`
	Tools    []OllamaTool  `json:"tools,omitempty"`
	Stream   bool          `json:"stream"`
}

type OllamaChatResponse struct {
	Choices []struct {
		Message ChatMessage `json:"message"`
	} `json:"choices"`
	Error map[string]interface{} `json:"error,omitempty"`
}

// GetToolDefinitions returns OpenAI-compatible tool specifications for Qwen2.5 / Ollama
func GetToolDefinitions() []OllamaTool {
	return []OllamaTool{
		{
			Type: "function",
			Function: OllamaFunction{
				Name:        "get_student_reward_points",
				Description: "Get reward points balance and student profile by roll number (e.g., 7376231CS106) or student name.",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"query": map[string]interface{}{
							"type":        "string",
							"description": "Student roll number (e.g. '7376231CS106') or student name",
						},
					},
					"required": []string{"query"},
				},
			},
		},
		{
			Type: "function",
			Function: OllamaFunction{
				Name:        "get_student_reward_history",
				Description: "Get detailed activity history of reward points for a student roll number.",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"roll_no": map[string]interface{}{
							"type":        "string",
							"description": "Student roll number (e.g. '7376231CS106')",
						},
					},
					"required": []string{"roll_no"},
				},
			},
		},
		{
			Type: "function",
			Function: OllamaFunction{
				Name:        "get_mess_menu",
				Description: "Get today's or a specific date's hostel mess menu for 'boys' or 'girls' hostel.",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"hostel": map[string]interface{}{
							"type":        "string",
							"enum":        []string{"boys", "girls"},
							"description": "Hostel category: 'boys' or 'girls'",
						},
						"date": map[string]interface{}{
							"type":        "string",
							"description": "Date in YYYY-MM-DD format (optional)",
						},
					},
					"required": []string{"hostel"},
				},
			},
		},
		{
			Type: "function",
			Function: OllamaFunction{
				Name:        "get_mess_timings",
				Description: "Get timing schedule for breakfast, lunch, and dinner in the hostel mess.",
				Parameters: map[string]interface{}{
					"type":       "object",
					"properties": map[string]interface{}{},
				},
			},
		},
		{
			Type: "function",
			Function: OllamaFunction{
				Name:        "search_faculty_directory",
				Description: "Search faculty phone numbers, emails, department, and designation by name or department.",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"query": map[string]interface{}{
							"type":        "string",
							"description": "Faculty name or keyword",
						},
						"department": map[string]interface{}{
							"type":        "string",
							"description": "Department name (e.g. 'CSE', 'ECE', 'MECH')",
						},
					},
				},
			},
		},
		{
			Type: "function",
			Function: OllamaFunction{
				Name:        "get_student_exam_halls",
				Description: "Get all exam sessions, hall numbers, block names, and timings for a student by roll number.",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"register_no": map[string]interface{}{
							"type":        "string",
							"description": "Student register/roll number (e.g. '7376231CS106')",
						},
					},
					"required": []string{"register_no"},
				},
			},
		},
		{
			Type: "function",
			Function: OllamaFunction{
				Name:        "get_leave_details",
				Description: "Get college leaves, holidays, and days countdown notice.",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"status": map[string]interface{}{
							"type":        "string",
							"enum":        []string{"upcoming", "past", "all"},
							"description": "Leave filter status: 'upcoming', 'past', or 'all'",
						},
					},
				},
			},
		},
		{
			Type: "function",
			Function: OllamaFunction{
				Name:        "get_reward_points_leaderboard",
				Description: "Get top 10 ranked students by reward points.",
				Parameters: map[string]interface{}{
					"type": "object",
					"properties": map[string]interface{}{
						"year": map[string]interface{}{
							"type":        "string",
							"description": "Year: 'I', 'II', 'III', or 'IV'",
						},
						"department": map[string]interface{}{
							"type":        "string",
							"description": "Department filter (e.g. 'CSE')",
						},
					},
				},
			},
		},
	}
}

// ExecuteMCPTool calls local Go MCP handlers and returns JSON string result
func ExecuteMCPTool(ctx context.Context, name string, argsJSON string) (string, error) {
	var args map[string]interface{}
	if argsJSON != "" {
		_ = json.Unmarshal([]byte(argsJSON), &args)
	}
	if args == nil {
		args = make(map[string]interface{})
	}

	req := mcp.CallToolRequest{}
	req.Params.Name = name
	req.Params.Arguments = args

	var res *mcp.CallToolResult
	var err error

	switch name {
	case "get_student_reward_points":
		res, err = tools.GetStudentRewardPointsHandler(ctx, req)
	case "get_student_reward_history":
		res, err = tools.GetStudentRewardHistoryHandler(ctx, req)
	case "get_reward_points_averages":
		res, err = tools.GetRewardPointsAveragesHandler(ctx, req)
	case "get_mess_menu":
		res, err = tools.GetMessMenuHandler(ctx, req)
	case "get_mess_timings":
		res, err = tools.GetMessTimingsHandler(ctx, req)
	case "search_faculty_directory":
		res, err = tools.SearchFacultyDirectoryHandler(ctx, req)
	case "get_student_exam_halls":
		res, err = tools.GetStudentExamHallsHandler(ctx, req)
	case "get_exam_hall_by_course":
		res, err = tools.GetExamHallByCourseHandler(ctx, req)
	case "get_leave_details":
		res, err = tools.GetLeaveDetailsHandler(ctx, req)
	case "get_reward_points_leaderboard":
		res, err = tools.GetRewardPointsLeaderboardHandler(ctx, req)
	case "get_sponsors_leaderboard":
		res, err = tools.GetSponsorsLeaderboardHandler(ctx, req)
	default:
		return "", fmt.Errorf("unknown tool: %s", name)
	}

	if err != nil {
		return "", err
	}

	if res != nil && len(res.Content) > 0 {
		if textContent, ok := res.Content[0].(mcp.TextContent); ok {
			return textContent.Text, nil
		}
	}

	b, _ := json.Marshal(res)
	return string(b), nil
}

// HandleChat processes an incoming user message using Ollama (Qwen2.5 1.5B) + MCP tools
func HandleChat(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"Method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var req RequestBody
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Invalid request payload"})
		return
	}

	if strings.TrimSpace(req.Message) == "" {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Message parameter is required"})
		return
	}

	ollamaBaseURL := os.Getenv("OLLAMA_URL")
	if ollamaBaseURL == "" {
		ollamaBaseURL = "http://localhost:11434"
	}
	ollamaBaseURL = strings.TrimRight(ollamaBaseURL, "/")

	modelName := os.Getenv("MODEL_NAME")
	if modelName == "" {
		modelName = "qwen2.5:1.5b"
	}

	// Prepare message history
	systemPrompt := "You are BitBot, the intelligent official AI assistant for BitCentral at Bannari Amman Institute of Technology (BIT Sathy). You have access to real-time tools for looking up student reward points, mess menus, exam hall allocations, faculty phone numbers, and college leaves. Always be polite, helpful, concise, and accurate. When presenting information from tool results, format it cleanly using bullet points or standard Markdown."
	if req.RollNo != "" {
		systemPrompt += fmt.Sprintf(" The current logged-in student's roll number is %s.", req.RollNo)
	}

	messages := []ChatMessage{
		{Role: "system", Content: systemPrompt},
	}

	for _, h := range req.History {
		messages = append(messages, h)
	}
	messages = append(messages, ChatMessage{Role: "user", Content: req.Message})

	toolsList := GetToolDefinitions()
	toolsUsed := []string{}

	ctx, cancel := context.WithTimeout(r.Context(), 120*time.Second)
	defer cancel()

	// Max 3 tool iteration steps
	var finalAnswer string
	for step := 0; step < 3; step++ {
		ollamaReq := OllamaChatRequest{
			Model:    modelName,
			Messages: messages,
			Tools:    toolsList,
			Stream:   false,
		}

		reqBytes, err := json.Marshal(ollamaReq)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Failed to construct request"})
			return
		}

		apiEndpoint := fmt.Sprintf("%s/v1/chat/completions", ollamaBaseURL)
		httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, apiEndpoint, bytes.NewBuffer(reqBytes))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Failed to create Ollama request"})
			return
		}
		httpReq.Header.Set("Content-Type", "application/json")

		client := &http.Client{Timeout: 90 * time.Second}
		resp, err := client.Do(httpReq)
		if err != nil {
			log.Printf("Ollama connection error: %v", err)
			w.WriteHeader(http.StatusServiceUnavailable)
			_ = json.NewEncoder(w).Encode(ChatResponse{
				Success: false,
				Error:   "Ollama AI service is starting or unavailable on VPS. Please ensure 'ollama run qwen2.5:1.5b' is running.",
			})
			return
		}

		respBytes, err := io.ReadAll(resp.Body)
		resp.Body.Close()

		if resp.StatusCode >= 400 {
			log.Printf("Ollama error status %d: %s", resp.StatusCode, string(respBytes))
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{
				Success: false,
				Error:   fmt.Sprintf("Ollama returned error status %d: %s", resp.StatusCode, string(respBytes)),
			})
			return
		}

		var ollamaResp OllamaChatResponse
		if err := json.Unmarshal(respBytes, &ollamaResp); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Failed to parse Ollama response"})
			return
		}

		if len(ollamaResp.Choices) == 0 {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Empty response from Ollama model"})
			return
		}

		choiceMsg := ollamaResp.Choices[0].Message

		// Check if Qwen2.5 called tool(s)
		if len(choiceMsg.ToolCalls) > 0 {
			messages = append(messages, choiceMsg)
			for _, tc := range choiceMsg.ToolCalls {
				toolName := tc.Function.Name
				toolsUsed = append(toolsUsed, toolName)
				log.Printf("🤖 Qwen2.5 executing tool [%s] args: %s", toolName, tc.Function.Arguments)

				toolResult, toolErr := ExecuteMCPTool(ctx, toolName, tc.Function.Arguments)
				if toolErr != nil {
					toolResult = fmt.Sprintf(`{"error": %q}`, toolErr.Error())
				}

				messages = append(messages, ChatMessage{
					Role:       "tool",
					Name:       toolName,
					Content:    toolResult,
					ToolCallID: tc.ID,
				})
			}
			continue
		}

		// No more tool calls, we have the final text answer
		finalAnswer = choiceMsg.Content
		break
	}

	if finalAnswer == "" {
		finalAnswer = "I evaluated your query, but could not get a complete response. Please try rephrasing."
	}

	_ = json.NewEncoder(w).Encode(ChatResponse{
		Success:   true,
		Message:   finalAnswer,
		ToolsUsed: toolsUsed,
	})
}

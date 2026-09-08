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
	Role    string `json:"role"`
	Content string `json:"content"`
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

// Gemini API Data Structures
type GeminiContent struct {
	Role  string       `json:"role,omitempty"`
	Parts []GeminiPart `json:"parts"`
}

type GeminiPart struct {
	Text             string                  `json:"text,omitempty"`
	FunctionCall     *GeminiFunctionCall     `json:"functionCall,omitempty"`
	FunctionResponse *GeminiFunctionResponse `json:"functionResponse,omitempty"`
	ThoughtSignature string                  `json:"thought_signature,omitempty"`
}

type GeminiFunctionCall struct {
	Name             string                 `json:"name"`
	Args             map[string]interface{} `json:"args,omitempty"`
	ThoughtSignature string                 `json:"thought_signature,omitempty"`
}

type GeminiFunctionResponse struct {
	Name     string                 `json:"name"`
	Response map[string]interface{} `json:"response"`
}

type GeminiTool struct {
	FunctionDeclarations []GeminiFunctionDeclaration `json:"functionDeclarations"`
}

type GeminiFunctionDeclaration struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Parameters  map[string]interface{} `json:"parameters,omitempty"`
}

type GeminiSystemInstruction struct {
	Parts []GeminiPart `json:"parts"`
}

type GeminiRequest struct {
	Contents          []interface{}            `json:"contents"`
	SystemInstruction *GeminiSystemInstruction `json:"systemInstruction,omitempty"`
	Tools             []GeminiTool             `json:"tools,omitempty"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content      map[string]interface{} `json:"content"`
		FinishReason string                 `json:"finishReason"`
	} `json:"candidates"`
	Error *struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
		Status  string `json:"status"`
	} `json:"error,omitempty"`
}

// OpenAI / Groq Compatible Data Structures
type OpenAIFunction struct {
	Name        string                 `json:"name"`
	Description string                 `json:"description"`
	Parameters  map[string]interface{} `json:"parameters"`
}

type OpenAITool struct {
	Type     string         `json:"type"`
	Function OpenAIFunction `json:"function"`
}

type OpenAIToolCallFunction struct {
	Name      string `json:"name"`
	Arguments string `json:"arguments"`
}

type OpenAIToolCall struct {
	ID       string                 `json:"id"`
	Type     string                 `json:"type"`
	Function OpenAIToolCallFunction `json:"function"`
}

type OpenAIMessage struct {
	Role       string           `json:"role"`
	Content    string           `json:"content,omitempty"`
	ToolCalls  []OpenAIToolCall `json:"tool_calls,omitempty"`
	ToolCallID string           `json:"tool_call_id,omitempty"`
}

type OpenAIRequest struct {
	Model       string          `json:"model"`
	Messages    []OpenAIMessage `json:"messages"`
	Tools       []OpenAITool    `json:"tools,omitempty"`
	Temperature float64         `json:"temperature,omitempty"`
}

type OpenAIResponse struct {
	Choices []struct {
		Message      OpenAIMessage `json:"message"`
		FinishReason string        `json:"finish_reason"`
	} `json:"choices"`
	Error *struct {
		Message string `json:"message"`
		Type    string `json:"type"`
		Code    string `json:"code"`
	} `json:"error,omitempty"`
}

func GetOpenAIToolDefinitions() []OpenAITool {
	geminiTools := GetToolDefinitions()
	var openAITools []OpenAITool
	if len(geminiTools) > 0 {
		for _, decl := range geminiTools[0].FunctionDeclarations {
			openAITools = append(openAITools, OpenAITool{
				Type: "function",
				Function: OpenAIFunction{
					Name:        decl.Name,
					Description: decl.Description,
					Parameters:  decl.Parameters,
				},
			})
		}
	}
	return openAITools
}

// GetToolDefinitions returns Gemini-compatible function declarations
func GetToolDefinitions() []GeminiTool {
	declarations := []GeminiFunctionDeclaration{
		{
			Name:        "get_student_reward_points",
			Description: "Get reward points balance and student profile by roll number (e.g. 7376231CS106) or student name.",
			Parameters: map[string]interface{}{
				"type": "OBJECT",
				"properties": map[string]interface{}{
					"query": map[string]interface{}{
						"type":        "STRING",
						"description": "Student roll number (e.g. '7376231CS106') or student name",
					},
				},
				"required": []string{"query"},
			},
		},
		{
			Name:        "get_student_reward_history",
			Description: "Get detailed activity history of reward points for a student roll number.",
			Parameters: map[string]interface{}{
				"type": "OBJECT",
				"properties": map[string]interface{}{
					"roll_no": map[string]interface{}{
						"type":        "STRING",
						"description": "Student roll number (e.g. '7376231CS106')",
					},
				},
				"required": []string{"roll_no"},
			},
		},
		{
			Name:        "get_reward_points_averages",
			Description: "Get overall college batch/year-wise average reward points.",
			Parameters: map[string]interface{}{
				"type":       "OBJECT",
				"properties": map[string]interface{}{},
			},
		},
		{
			Name:        "get_mess_menu",
			Description: "Get today's or a specific date's hostel mess menu for 'boys' or 'girls' hostel. When asked for mess menu, invoke this tool for BOTH 'boys' and 'girls' hostels.",
			Parameters: map[string]interface{}{
				"type": "OBJECT",
				"properties": map[string]interface{}{
					"hostel": map[string]interface{}{
						"type":        "STRING",
						"enum":        []string{"boys", "girls"},
						"description": "Hostel category: 'boys' or 'girls'",
					},
					"date": map[string]interface{}{
						"type":        "STRING",
						"description": "Date in YYYY-MM-DD format (optional)",
					},
				},
				"required": []string{"hostel"},
			},
		},
		{
			Name:        "get_mess_timings",
			Description: "Get timing schedule for breakfast, lunch, and dinner in the hostel mess.",
			Parameters: map[string]interface{}{
				"type":       "OBJECT",
				"properties": map[string]interface{}{},
			},
		},
		{
			Name:        "search_faculty_directory",
			Description: "Search faculty phone numbers, emails, department, and designation by name or department.",
			Parameters: map[string]interface{}{
				"type": "OBJECT",
				"properties": map[string]interface{}{
					"query": map[string]interface{}{
						"type":        "STRING",
						"description": "Faculty name or keyword",
					},
					"department": map[string]interface{}{
						"type":        "STRING",
						"description": "Department name (e.g. 'CSE', 'ECE', 'MECH')",
					},
				},
			},
		},
		{
			Name:        "get_student_exam_halls",
			Description: "Get all exam sessions, hall numbers, block names, and timings for a student by roll number.",
			Parameters: map[string]interface{}{
				"type": "OBJECT",
				"properties": map[string]interface{}{
					"register_no": map[string]interface{}{
						"type":        "STRING",
						"description": "Student register/roll number (e.g. '7376231CS106')",
					},
				},
				"required": []string{"register_no"},
			},
		},
		{
			Name:        "get_exam_hall_by_course",
			Description: "Lookup specific exam hall number and block for a student register number and course code.",
			Parameters: map[string]interface{}{
				"type": "OBJECT",
				"properties": map[string]interface{}{
					"register_no": map[string]interface{}{
						"type":        "STRING",
						"description": "Student register number (e.g. '7376231CS106')",
					},
					"course_code": map[string]interface{}{
						"type":        "STRING",
						"description": "Course/Subject code (e.g. '22CS501')",
					},
				},
				"required": []string{"register_no", "course_code"},
			},
		},
		{
			Name:        "get_leave_details",
			Description: "Get college leaves, holidays, and days countdown notice.",
			Parameters: map[string]interface{}{
				"type": "OBJECT",
				"properties": map[string]interface{}{
					"status": map[string]interface{}{
						"type":        "STRING",
						"enum":        []string{"upcoming", "past", "all"},
						"description": "Leave filter status: 'upcoming', 'past', or 'all'",
					},
				},
			},
		},
		{
			Name:        "get_reward_points_leaderboard",
			Description: "Get top 10 ranked students by reward points.",
			Parameters: map[string]interface{}{
				"type": "OBJECT",
				"properties": map[string]interface{}{
					"year": map[string]interface{}{
						"type":        "STRING",
						"description": "Year: 'I', 'II', 'III', or 'IV'",
					},
					"department": map[string]interface{}{
						"type":        "STRING",
						"description": "Department filter (e.g. 'CSE')",
					},
				},
			},
		},
		{
			Name:        "get_sponsors_leaderboard",
			Description: "Get top contributors and department sponsor leaderboards.",
			Parameters: map[string]interface{}{
				"type": "OBJECT",
				"properties": map[string]interface{}{
					"type": map[string]interface{}{
						"type":        "STRING",
						"enum":        []string{"individual", "department"},
						"description": "Leaderboard type: 'individual' or 'department'",
					},
				},
			},
		},
	}

	return []GeminiTool{
		{FunctionDeclarations: declarations},
	}
}

// ExecuteMCPTool calls local Go MCP handlers and returns result string
func ExecuteMCPTool(ctx context.Context, name string, args map[string]interface{}) (string, error) {
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

// HandleChat processes an incoming user message using Google Gemini API + MCP tools
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

	type InternalAIKeyResp struct {
		Success  bool   `json:"success"`
		APIKey   string `json:"api_key"`
		Provider string `json:"provider"`
		Model    string `json:"model"`
		Status   string `json:"status"`
	}

	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		apiKey = os.Getenv("GROQ_API_KEY")
	}
	if apiKey == "" {
		apiKey = os.Getenv("OPENAI_API_KEY")
	}

	modelName := os.Getenv("GEMINI_MODEL")
	provider := os.Getenv("AI_PROVIDER")

	// Query live AI Key & status stored in database via main backend
	var dbKeyResp InternalAIKeyResp
	ctxKey, cancelKey := context.WithTimeout(r.Context(), 5*time.Second)
	errKey := tools.DefaultClient.Get(ctxKey, "/internal/ai-key", nil, &dbKeyResp)
	cancelKey()

	if errKey == nil && dbKeyResp.Success && dbKeyResp.APIKey != "" {
		if dbKeyResp.Status == "inactive" || dbKeyResp.Status == "disabled" {
			w.WriteHeader(http.StatusServiceUnavailable)
			_ = json.NewEncoder(w).Encode(ChatResponse{
				Success: false,
				Error:   "BitBot AI Assistant service has been temporarily disabled by administrator.",
			})
			return
		}
		apiKey = dbKeyResp.APIKey
		if dbKeyResp.Model != "" {
			modelName = dbKeyResp.Model
		}
		if dbKeyResp.Provider != "" {
			provider = dbKeyResp.Provider
		}
	}

	if apiKey == "" {
		log.Printf("⚠️ AI_API_KEY is missing in database and environment")
		w.WriteHeader(http.StatusInternalServerError)
		_ = json.NewEncoder(w).Encode(ChatResponse{
			Success: false,
			Error:   "AI API Key is not configured in database or environment. Please configure it in Admin Dashboard.",
		})
		return
	}

	// Auto-detect provider if needed
	if strings.HasPrefix(apiKey, "gsk_") {
		provider = "groq"
	} else if strings.HasPrefix(apiKey, "sk-") {
		provider = "openai"
	} else if provider == "" {
		provider = "google_gemini"
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

	// Build System Prompt
	loc, err := time.LoadLocation("Asia/Kolkata")
	if err != nil {
		loc = time.FixedZone("IST", 5*3600+1800)
	}
	currentTimeStr := time.Now().In(loc).Format("Monday, 02 Jan 2006, 03:04 PM IST")

	systemPrompt := fmt.Sprintf(`You are BitBot, the intelligent official AI assistant for BitCentral at Bannari Amman Institute of Technology (BIT Sathy).
Current time: %s.

CRITICAL GUIDELINES FOR RESPONSES:
1. MESS MENU INQUIRIES:
   - When asked for the mess menu (e.g. "What is today's boys mess menu?"), retrieve the mess menu for BOTH "boys" AND "girls" hostels (by invoking 'get_mess_menu' with hostel="boys" and 'get_mess_menu' with hostel="girls").
   - Display the Boys' Hostel Mess Menu first, followed immediately by the Girls' Hostel Mess Menu below it.
   - Pay close attention to the current time (%s):
     * If the current time is in the late afternoon/evening (e.g. 5:30 PM / after lunch), focus on and highlight the upcoming NIGHT MESS / DINNER menu for today.
     * Clearly indicate the meal status (e.g., "🌙 Upcoming Night Mess / Dinner (7:00 PM – 8:30 PM)").
2. GENERAL FORMATTING:
   - Format cleanly with standard Markdown headers (###), bold items (**item**), and bullet points (- item).
   - Never mention internal technical details or MCP tools.`, currentTimeStr, currentTimeStr)

	if req.RollNo != "" {
		systemPrompt += fmt.Sprintf(" Current logged-in student's roll number is %s.", req.RollNo)
	}

	toolsUsed := []string{}
	ctx, cancel := context.WithTimeout(r.Context(), 60*time.Second)
	defer cancel()

	var finalAnswer string
	client := &http.Client{Timeout: 45 * time.Second}

	// Route to OpenAI/Groq if provider is groq or openai
	if provider == "groq" || provider == "openai" {
		endpointURL := "https://api.groq.com/openai/v1/chat/completions"
		providerName := "Groq"
		if provider == "openai" {
			endpointURL = "https://api.openai.com/v1/chat/completions"
			providerName = "OpenAI"
		}

		if modelName == "" || modelName == "gemini-2.0-flash" {
			if provider == "groq" {
				modelName = "llama-3.3-70b-versatile"
			} else {
				modelName = "gpt-4o-mini"
			}
		}

		messages := []OpenAIMessage{
			{Role: "system", Content: systemPrompt},
		}
		for _, h := range req.History {
			role := "user"
			if h.Role == "assistant" || h.Role == "model" {
				role = "assistant"
			}
			messages = append(messages, OpenAIMessage{Role: role, Content: h.Content})
		}
		messages = append(messages, OpenAIMessage{Role: "user", Content: req.Message})

		openAITools := GetOpenAIToolDefinitions()

		for step := 0; step < 4; step++ {
			openAIReq := OpenAIRequest{
				Model:    modelName,
				Messages: messages,
				Tools:    openAITools,
			}
			reqBytes, err := json.Marshal(openAIReq)
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Failed to construct request"})
				return
			}

			httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, endpointURL, bytes.NewBuffer(reqBytes))
			if err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Failed to create HTTP request"})
				return
			}
			httpReq.Header.Set("Content-Type", "application/json")
			httpReq.Header.Set("Authorization", "Bearer "+apiKey)

			resp, err := client.Do(httpReq)
			if err != nil {
				log.Printf("%s API connection error: %v", providerName, err)
				w.WriteHeader(http.StatusServiceUnavailable)
				_ = json.NewEncoder(w).Encode(ChatResponse{
					Success: false,
					Error:   fmt.Sprintf("Unable to connect to %s API.", providerName),
				})
				return
			}

			respBytes, err := io.ReadAll(resp.Body)
			resp.Body.Close()

			if resp.StatusCode >= 400 {
				log.Printf("%s API error status %d: %s", providerName, resp.StatusCode, string(respBytes))
				w.WriteHeader(http.StatusInternalServerError)
				_ = json.NewEncoder(w).Encode(ChatResponse{
					Success: false,
					Error:   fmt.Sprintf("%s API error status %d: %s", providerName, resp.StatusCode, string(respBytes)),
				})
				return
			}

			var oaiResp OpenAIResponse
			if err := json.Unmarshal(respBytes, &oaiResp); err != nil {
				w.WriteHeader(http.StatusInternalServerError)
				_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Failed to parse AI response"})
				return
			}

			if oaiResp.Error != nil {
				w.WriteHeader(http.StatusInternalServerError)
				_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: oaiResp.Error.Message})
				return
			}

			if len(oaiResp.Choices) == 0 {
				w.WriteHeader(http.StatusInternalServerError)
				_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Empty response from AI model"})
				return
			}

			choice := oaiResp.Choices[0]
			messages = append(messages, choice.Message)

			if choice.Message.Content != "" {
				finalAnswer = choice.Message.Content
			}

			if len(choice.Message.ToolCalls) == 0 {
				break
			}

			for _, tc := range choice.Message.ToolCalls {
				funcName := tc.Function.Name
				var args map[string]interface{}
				if tc.Function.Arguments != "" {
					_ = json.Unmarshal([]byte(tc.Function.Arguments), &args)
				}
				toolsUsed = append(toolsUsed, funcName)
				log.Printf("🤖 %s executing tool [%s] args: %v", providerName, funcName, args)

				toolResultStr, toolErr := ExecuteMCPTool(ctx, funcName, args)
				if toolErr != nil {
					toolResultStr = fmt.Sprintf(`{"error": %q}`, toolErr.Error())
				}

				messages = append(messages, OpenAIMessage{
					Role:       "tool",
					ToolCallID: tc.ID,
					Content:    toolResultStr,
				})
			}
		}

		if finalAnswer == "" {
			finalAnswer = "I evaluated your request, but could not produce a text response."
		}

		_ = json.NewEncoder(w).Encode(ChatResponse{
			Success:   true,
			Message:   finalAnswer,
			ToolsUsed: toolsUsed,
		})
		return
	}

	if modelName == "" {
		modelName = "gemini-2.0-flash"
	}

	systemInstruction := &GeminiSystemInstruction{
		Parts: []GeminiPart{{Text: systemPrompt}},
	}

	// Prepare history in Gemini contents format
	var contents []interface{}
	for _, h := range req.History {
		role := "user"
		if h.Role == "assistant" || h.Role == "model" {
			role = "model"
		}
		contents = append(contents, GeminiContent{
			Role:  role,
			Parts: []GeminiPart{{Text: h.Content}},
		})
	}
	contents = append(contents, GeminiContent{
		Role:  "user",
		Parts: []GeminiPart{{Text: req.Message}},
	})

	toolsList := GetToolDefinitions()

	// Up to 4 multi-turn tool interaction steps
	for step := 0; step < 4; step++ {
		geminiReq := GeminiRequest{
			Contents:          contents,
			SystemInstruction: systemInstruction,
			Tools:             toolsList,
		}

		reqBytes, err := json.Marshal(geminiReq)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Failed to construct Gemini request"})
			return
		}

		apiURL := fmt.Sprintf("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", modelName, apiKey)
		httpReq, err := http.NewRequestWithContext(ctx, http.MethodPost, apiURL, bytes.NewBuffer(reqBytes))
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Failed to create request"})
			return
		}
		httpReq.Header.Set("Content-Type", "application/json")

		resp, err := client.Do(httpReq)
		if err != nil {
			log.Printf("Gemini API connection error: %v", err)
			w.WriteHeader(http.StatusServiceUnavailable)
			_ = json.NewEncoder(w).Encode(ChatResponse{
				Success: false,
				Error:   "Unable to connect to Google Gemini API. Please check server network connection.",
			})
			return
		}

		respBytes, err := io.ReadAll(resp.Body)
		resp.Body.Close()

		if resp.StatusCode >= 400 {
			log.Printf("Gemini API error status %d: %s", resp.StatusCode, string(respBytes))
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{
				Success: false,
				Error:   fmt.Sprintf("Gemini API error status %d: %s", resp.StatusCode, string(respBytes)),
			})
			return
		}

		var geminiResp GeminiResponse
		if err := json.Unmarshal(respBytes, &geminiResp); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Failed to parse Gemini response"})
			return
		}

		if geminiResp.Error != nil {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: geminiResp.Error.Message})
			return
		}

		if len(geminiResp.Candidates) == 0 {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "Empty response received from Gemini AI model"})
			return
		}

		candidate := geminiResp.Candidates[0]
		rawContentMap := candidate.Content

		parts, _ := rawContentMap["parts"].([]interface{})
		if len(parts) == 0 {
			w.WriteHeader(http.StatusInternalServerError)
			_ = json.NewEncoder(w).Encode(ChatResponse{Success: false, Error: "No parts in candidate response from Gemini"})
			return
		}

		// Check if candidate contains function call(s) or text
		hasFunctionCall := false
		// Append model's response to conversation contents (preserves all fields including thought_signature!)
		contents = append(contents, rawContentMap)

		for _, p := range parts {
			partMap, ok := p.(map[string]interface{})
			if !ok {
				continue
			}

			if fcVal, exists := partMap["functionCall"]; exists && fcVal != nil {
				fcMap, ok := fcVal.(map[string]interface{})
				if ok {
					hasFunctionCall = true
					funcName, _ := fcMap["name"].(string)
					args, _ := fcMap["args"].(map[string]interface{})
					toolsUsed = append(toolsUsed, funcName)
					log.Printf("🤖 Gemini executing tool [%s] args: %v", funcName, args)

					toolResultStr, toolErr := ExecuteMCPTool(ctx, funcName, args)
					if toolErr != nil {
						toolResultStr = fmt.Sprintf(`{"error": %q}`, toolErr.Error())
					}

					// Provide tool result back as user role functionResponse
					contents = append(contents, map[string]interface{}{
						"role": "user",
						"parts": []map[string]interface{}{
							{
								"functionResponse": map[string]interface{}{
									"name": funcName,
									"response": map[string]interface{}{
										"name":   funcName,
										"result": toolResultStr,
									},
								},
							},
						},
					})
				}
			} else if textVal, ok := partMap["text"].(string); ok && textVal != "" {
				finalAnswer = textVal
			}
		}

		if !hasFunctionCall {
			break
		}
	}

	if finalAnswer == "" {
		finalAnswer = "I evaluated your request, but could not produce a text response."
	}

	_ = json.NewEncoder(w).Encode(ChatResponse{
		Success:   true,
		Message:   finalAnswer,
		ToolsUsed: toolsUsed,
	})
}

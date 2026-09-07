package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"

	"mcp-server/chat"
	"mcp-server/tools"
)

func main() {
	useStdio := flag.Bool("stdio", false, "Run in stdio mode (for local CLI / desktop MCP clients)")
	flag.Parse()

	// Check environment variable as well
	if os.Getenv("MCP_TRANSPORT") == "stdio" || os.Getenv("TRANSPORT") == "stdio" {
		*useStdio = true
	}

	// 1. Initialize MCP Server
	s := server.NewMCPServer(
		"BitCentral MCP Server",
		"1.0.0",
		server.WithToolCapabilities(true),
		server.WithLogging(),
	)

	// 2. Register Tools

	// --- Reward Points Tools ---
	s.AddTool(
		mcp.NewTool(
			"get_student_reward_points",
			mcp.WithDescription("Get reward points balance and profile details for a student by roll number (e.g. 7376231CS106) or student name. Returns balance points, redeemed points, cumulative points, mentor name, year, and department."),
			mcp.WithString("query", mcp.Required(), mcp.Description("Student roll number (e.g. '7376231CS106') or student name to search")),
		),
		tools.GetStudentRewardPointsHandler,
	)

	s.AddTool(
		mcp.NewTool(
			"get_student_reward_history",
			mcp.WithDescription("Get detailed reward points activity history for a student by roll number. Returns a chronological log of events, dates, activity types, and positive/negative points earned or deducted."),
			mcp.WithString("roll_no", mcp.Required(), mcp.Description("Student roll number (e.g. '7376231CS106')")),
			mcp.WithNumber("page", mcp.Description("Page number for pagination (optional)")),
			mcp.WithNumber("limit", mcp.Description("Number of entries per page (optional)")),
		),
		tools.GetStudentRewardHistoryHandler,
	)

	s.AddTool(
		mcp.NewTool(
			"get_reward_points_averages",
			mcp.WithDescription("Get overall college batch/year-wise average reward points (Year I, Year II, Year III, Year IV)."),
		),
		tools.GetRewardPointsAveragesHandler,
	)

	// --- Mess Menu Tools ---
	s.AddTool(
		mcp.NewTool(
			"get_mess_menu",
			mcp.WithDescription("Get today's or a specific date's hostel mess menu for 'boys' or 'girls' hostel. Returns current ongoing meal, timing window, and complete breakfast, lunch, and dinner items."),
			mcp.WithString("hostel", mcp.Required(), mcp.Description("Hostel type: 'boys' or 'girls'"), mcp.Enum("boys", "girls")),
			mcp.WithString("date", mcp.Description("Date in YYYY-MM-DD format (optional, defaults to current date in IST)")),
		),
		tools.GetMessMenuHandler,
	)

	s.AddTool(
		mcp.NewTool(
			"get_mess_timings",
			mcp.WithDescription("Get standard mess meal timing windows (Breakfast, Lunch, Dinner)."),
		),
		tools.GetMessTimingsHandler,
	)

	// --- Faculty Directory Tools ---
	s.AddTool(
		mcp.NewTool(
			"search_faculty_directory",
			mcp.WithDescription("Search faculty contact details and phone numbers by faculty name, department, or keyword. Returns full names, phone numbers, email addresses, department, and designation."),
			mcp.WithString("query", mcp.Description("Search keyword, faculty name, or phone number")),
			mcp.WithString("department", mcp.Description("Department filter (e.g. 'CSE', 'ECE', 'AI & DS', 'Mechanical')")),
		),
		tools.SearchFacultyDirectoryHandler,
	)

	// --- Exam Hall Tools ---
	s.AddTool(
		mcp.NewTool(
			"get_student_exam_halls",
			mcp.WithDescription("Get all scheduled exam sessions, exam hall numbers, dates, timings, and campus block names for a student using their register number (e.g. '7376231CS106')."),
			mcp.WithString("register_no", mcp.Required(), mcp.Description("Student register/roll number (e.g. '7376231CS106')")),
		),
		tools.GetStudentExamHallsHandler,
	)

	s.AddTool(
		mcp.NewTool(
			"get_exam_hall_by_course",
			mcp.WithDescription("Lookup specific exam hall number and block for a student register number and course code."),
			mcp.WithString("register_no", mcp.Required(), mcp.Description("Student register number (e.g. '7376231CS106')")),
			mcp.WithString("course_code", mcp.Required(), mcp.Description("Course/Subject code (e.g. '22CS501')")),
		),
		tools.GetExamHallByCourseHandler,
	)

	// --- Leave & Holiday Tools ---
	s.AddTool(
		mcp.NewTool(
			"get_leave_details",
			mcp.WithDescription("Get college leave and holiday details. Supports filtering for 'upcoming' leaves (with days remaining countdown), 'past' leaves, or 'all' academic holidays, including half-day (FN/AN) notices."),
			mcp.WithString("status", mcp.Description("Filter type: 'upcoming', 'past', or 'all' (default is 'upcoming')"), mcp.Enum("upcoming", "past", "all")),
		),
		tools.GetLeaveDetailsHandler,
	)

	// --- Leaderboard Tools ---
	s.AddTool(
		mcp.NewTool(
			"get_reward_points_leaderboard",
			mcp.WithDescription("Get top 10 ranked students leaderboard based on reward points. Can be filtered by year (I, II, III, IV) and/or department (CSE, IT, ECE, MECH, etc.)."),
			mcp.WithString("year", mcp.Description("Year filter: 'I', 'II', 'III', or 'IV' (optional)")),
			mcp.WithString("department", mcp.Description("Department filter (e.g. 'CSE', 'IT', 'ECE', 'AI&DS', 'MECH')")),
		),
		tools.GetRewardPointsLeaderboardHandler,
	)

	s.AddTool(
		mcp.NewTool(
			"get_sponsors_leaderboard",
			mcp.WithDescription("Get top contributors and department sponsor leaderboards."),
			mcp.WithString("type", mcp.Description("Leaderboard type: 'individual' or 'department' (default 'individual')"), mcp.Enum("individual", "department")),
		),
		tools.GetSponsorsLeaderboardHandler,
	)

	// 3. Execution Transport (Stdio or SSE Server for Render)
	if *useStdio {
		log.Println("Starting BitCentral MCP Server over stdio...")
		if err := server.ServeStdio(s); err != nil {
			log.Fatalf("MCP Stdio server error: %v", err)
		}
		return
	}

	// Server-Sent Events (SSE) mode for Render deployment and HTTP chatbot integrations
	port := os.Getenv("PORT")
	if port == "" {
		port = "8081" // default local port if PORT is not set
	}

	sseServer := server.NewSSEServer(
		s,
		server.WithSSEEndpoint("/sse"),
		server.WithMessageEndpoint("/message"),
	)

	mux := http.NewServeMux()

	// Health check for Render deployment health checks
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(`{"status":"ok","service":"bitcentral-mcp-server","version":"1.0.0"}`))
	})

	// Root info endpoint
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte(`{
				"service": "BitCentral Model Context Protocol (MCP) Server",
				"version": "1.0.0",
				"status": "online",
				"endpoints": {
					"sse": "/sse",
					"messages": "/message",
					"health": "/health"
				},
				"tools": [
					"get_student_reward_points",
					"get_student_reward_history",
					"get_reward_points_averages",
					"get_mess_menu",
					"get_mess_timings",
					"search_faculty_directory",
					"get_student_exam_halls",
					"get_exam_hall_by_course",
					"get_leave_details",
					"get_reward_points_leaderboard",
					"get_sponsors_leaderboard"
				]
			}`))
			return
		}
		http.NotFound(w, r)
	})

	// SSE and Message handlers
	mux.Handle("/sse", sseServer.SSEHandler())
	mux.Handle("/message", sseServer.MessageHandler())

	// AI Chat Assistant endpoint powered by Ollama (Qwen2.5 1.5B) + MCP Tools
	mux.HandleFunc("/api/chat", chat.HandleChat)
	mux.HandleFunc("/chat", chat.HandleChat)

	// CORS wrapper
	handler := corsMiddleware(mux)

	addr := fmt.Sprintf("0.0.0.0:%s", port)
	log.Printf("🚀 BitCentral MCP Server running on %s", addr)
	log.Printf("📡 SSE Endpoint:     http://localhost:%s/sse", port)
	log.Printf("📨 Message Endpoint: http://localhost:%s/message", port)
	log.Printf("🩺 Health Endpoint:  http://localhost:%s/health", port)

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// corsMiddleware adds standard CORS headers for web chatbot access
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
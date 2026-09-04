package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"

	"server/config"
	"server/handlers"
	"server/routes"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Failed to load .env (%v). Using system environment variables.", err)
	}

	// config.InitMySQL()

	if os.Getenv("SKIP_SERVICE_INIT") == "true" {
		log.Println("⚠️ SKIPPING MySQL and Google OAuth initialization because SKIP_SERVICE_INIT=true")
	} else {
		config.InitMySQL()
		config.InitGoogleOAuth()
	}

	sheetHandler := handlers.NewSheetHandler()
	sheetHandler.InitOAuth()

	if sheetHandler.LoadSavedToken() {
		fmt.Println("Loaded saved token - no login needed")
	} else {
		fmt.Println("Not authenticated. Visit: http://localhost:8080/auth/login")
	}

	cardHandler := handlers.NewCardHandler()
	semesterHandler := handlers.NewSemesterHandler()
	adminHandler := handlers.NewAdminHandler()
	examHallHandler := handlers.NewExamHallHandler()
	messHandler := handlers.NewMessHandler()
	leaderboardHandler := handlers.NewLeaderboardHandler(sheetHandler)
	leaveHandler := handlers.NewLeaveHandler()
	qbHandler := handlers.NewQBHandler()
	studentLookupHandler := handlers.NewStudentLookupHandler()
	uploadHandler := handlers.NewUploadHandler()
	trackerUserHandler := handlers.NewTrackerUserHandler()
	sponsorsHandler := handlers.NewSponsorsHandler()
	feedbackHandler := handlers.NewFeedbackHandler()
	analyticsHandler := handlers.NewAnalyticsHandler()
	facultyDirectoryHandler := handlers.NewFacultyDirectoryHandler(sheetHandler)

	r := routes.SetupRouter(
		sheetHandler,
		cardHandler,
		semesterHandler,
		adminHandler,
		messHandler,
		leaderboardHandler,
		leaveHandler,
		examHallHandler,
		qbHandler,
		studentLookupHandler,
		uploadHandler,
		trackerUserHandler,
		sponsorsHandler,
		feedbackHandler,
		analyticsHandler,
		facultyDirectoryHandler,
	)
	r.Static("/pdfs", "./pdfs")

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running at http://localhost:%s", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

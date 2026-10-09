package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"

	"server/config"
	"server/handlers/admin"
	"server/handlers/common"
	"server/handlers/student"
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

	sheetHandler := student.NewSheetHandler()
	sheetHandler.InitOAuth()

	if sheetHandler.LoadSavedToken() {
		fmt.Println("Loaded saved token - no login needed")
	} else {
		fmt.Println("Not authenticated. Visit: http://localhost:8080/auth/login")
	}

	cardHandler := student.NewCardHandler()
	semesterHandler := student.NewSemesterHandler()
	adminHandler := admin.NewAdminHandler()
	examHallHandler := student.NewExamHallHandler()
	messHandler := student.NewMessHandler()
	leaderboardHandler := student.NewLeaderboardHandler(sheetHandler)
	leaveHandler := student.NewLeaveHandler()
	qbHandler := student.NewQBHandler()
	studentLookupHandler := admin.NewStudentLookupHandler()
	uploadHandler := common.NewUploadHandler()
	trackerUserHandler := admin.NewTrackerUserHandler()
	sponsorsHandler := admin.NewSponsorsHandler()
	feedbackHandler := common.NewFeedbackHandler()
	analyticsHandler := admin.NewAnalyticsHandler()
	facultyDirectoryHandler := admin.NewFacultyDirectoryHandler(sheetHandler)
	chatHandler := common.NewChatHandler()
	aiHandler := common.NewAIHandler()
	mailHandler := common.NewMailHandler()
	mailHandler.StartQueueWorker()
	internalMarksHandler := student.NewInternalMarksHandler()
	notificationHandler := common.NewNotificationHandler()
	helpHandler := common.NewHelpHandler()

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
		chatHandler,
		aiHandler,
		mailHandler,
		internalMarksHandler,
		notificationHandler,
		helpHandler,
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

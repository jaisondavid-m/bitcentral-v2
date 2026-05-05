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
	// config.InitFirebase()

	if os.Getenv("SKIP_SERVICE_INIT") == "true" {
		log.Println("⚠️ SKIPPING MySQL and Firebase initialization because SKIP_SERVICE_INIT=true")
	} else {
		config.InitMySQL()
		config.InitFirebase()
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
	messHandler := handlers.NewMessHandler(sheetHandler)
	leaderboardHandler := handlers.NewLeaderboardHandler(sheetHandler)
	leaveHandler := handlers.NewLeaveHandler()

	r := routes.SetupRouter(
		sheetHandler,
		cardHandler,
		semesterHandler,
		adminHandler,
		messHandler,
		leaderboardHandler,
		leaveHandler,
		examHallHandler,
	)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server running at http://localhost:%s", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
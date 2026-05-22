package routes

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"server/handlers"
	"server/middleware"
)

func SetupRouter(
	handler *handlers.SheetHandler,
	cardHandler *handlers.CardHandler,
	semesterHandler *handlers.SemesterHandler,
	adminHandler *handlers.AdminHandler,
	presenceHandler *handlers.PresenceHandler,
	messHandler *handlers.MessHandler,
	leaderboardHandler *handlers.LeaderboardHandler,
	leaveHandler *handlers.LeaveHandler,
	examHallHandler *handlers.ExamHallHandler,
	qbHandler *handlers.QBHandler,
	uploadHandler *handlers.UploadHandler,
) *gin.Engine {

	r := gin.Default()

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"https://bitcentral.vercel.app",
			"https://bitcenteral.netlify.app",
			"https://bitcentral.bitsathy.in",
			"https://bitsathy.in",
		},
		AllowMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS",
		},
		AllowHeaders: []string{
			"Origin", "Content-Type", "Authorization",
		},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status": "ok",
			"time":   time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Public routes
	r.GET("/auth/login", handler.HandleLogin)
	r.GET("/auth/callback", handler.HandleCallback)
	r.GET("/cards", handlers.GetCards)
	r.GET("/leaves", leaveHandler.GetAllLeaves)
	r.GET("/exam-hall", examHallHandler.GetHall)

	// Protected routes
	api := r.Group("/")
	api.Use(handler.RequireAuth())
	{
		api.GET("/search", handler.UniversalSearch)
		api.GET("/rewards", handler.GetRewardsByRollNo)
		api.GET("/averages", handler.GetOverallAverageFromSheet)
		api.GET("/semesters/:year", semesterHandler.GetSemesterByYear)
		api.GET("/qb", qbHandler.List)

		api.GET("/mess", messHandler.GetMess)
		api.GET("/mess/timings", messHandler.GetMealTimings)

		api.GET("/top10", leaderboardHandler.GetTop10Students)
	}

	// Serve uploaded files
	r.Static("/uploads", "./uploads")

	// Proxy PDF by Google Drive ID (keeps original links hidden)
	r.GET("/pdf/:id", uploadHandler.ProxyPDF)

	// Admin routes
	admin := r.Group("/admin")
	admin.Use(middleware.RequireAdmin())
	{
		admin.GET("/users", adminHandler.GetUsers)
		admin.GET("/users/update", adminHandler.UpdateUsers)
		admin.DELETE("/users/:uid", adminHandler.DeleteUser)
		// admin.GET("/qb", qbHandler.List)
		admin.GET("/qb", qbHandler.List)
		admin.POST("/qb", qbHandler.Create)
		admin.POST("/qb/batch", qbHandler.BatchCreate)
		admin.PUT("/qb/reorder", qbHandler.Reorder)
		admin.PUT("/qb/:id", qbHandler.Update)
		admin.DELETE("/qb/:id", qbHandler.Delete)
		admin.PUT("/semesters/:year", semesterHandler.UpdateSemesterByYear)
		admin.POST("/upload", uploadHandler.Upload)

		// Cards admin CRUD
		admin.GET("/cards", handlers.GetCards)
		admin.POST("/cards", handlers.CreateCard)
		admin.PUT("/cards/:id", handlers.UpdateCard)
		admin.DELETE("/cards/:id", handlers.DeleteCard)
	}

	r.POST("/presence/ping", presenceHandler.Ping)

	return r
}

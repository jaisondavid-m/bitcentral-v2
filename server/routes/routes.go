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
	messHandler *handlers.MessHandler,
	leaderboardHandler *handlers.LeaderboardHandler,
	leaveHandler *handlers.LeaveHandler,
	examHallHandler *handlers.ExamHallHandler,
	qbHandler *handlers.QBHandler,
	studentLookupHandler *handlers.StudentLookupHandler,
	uploadHandler *handlers.UploadHandler,
	trackerUserHandler *handlers.TrackerUserHandler,
	sponsorsHandler *handlers.SponsorsHandler,
	feedbackHandler *handlers.FeedbackHandler,
	analyticsHandler *handlers.AnalyticsHandler,
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
			"http://bitcentral.bitsathy.in",
			"https://bitsathy.in",
			"http://bitsathy.in",
			"https://www.bitsathy.in",
			"http://www.bitsathy.in",
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

	r.GET("/docs/about", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"developer": gin.H{
				"name": "Jaison David M",
				"bio":  "1st-year CSE student at Bannari Amman Institute of Technology. Builds web apps and freelance services.",
				"links": gin.H{
					"github":    "https://github.com/jaisondavid-m",
					"linkedin":  "https://www.linkedin.com/in/jaison-david-m-a14072360/",
					"freelance": "https://herostack.netlify.app/",
				},
			},

			"contact": gin.H{
				"email":         "developer@bitsathy.in",
				"phone":         "+919843777817",
				"feedback_form": "https://forms.gle/LSMMFVBHSPUvPKKK9",
			},
		})
	})

	// Public routes
	r.GET("/auth/login", handler.HandleLogin)
	r.GET("/auth/callback", handler.HandleCallback)
	r.POST("/auth/google", studentLookupHandler.GoogleLogin)
	r.POST("/auth/logout", studentLookupHandler.GoogleLogout)
	r.GET("/auth/logout", studentLookupHandler.GoogleLogout)
	r.GET("/exam-hall", examHallHandler.GetHall)
	r.GET("/exam-hall/all", examHallHandler.GetAllHallsByRegNo)

	// Protected routes
	api := r.Group("/")
	api.Use(handler.RequireAuth())
	{
		api.POST("/cards/:id/click", handlers.TrackCardClick)
		api.GET("/cards", handlers.GetCards)
		api.GET("/leaves", leaveHandler.GetAllLeaves)
		api.GET("/search", handler.UniversalSearch)
		api.GET("/rewards", handler.GetRewardsByRollNo)
		api.GET("/me", studentLookupHandler.GetMe)
		api.GET("/student/roll-no", studentLookupHandler.GetRollNoByEmail)
		api.GET("/averages", handler.GetOverallAverageFromSheet)
		api.GET("/semesters/:year", semesterHandler.GetSemesterByYear)
		api.GET("/qb", qbHandler.List)
		api.GET("/mess", messHandler.GetMess)
		api.GET("/mess/timings", messHandler.GetMealTimings)
		api.GET("/ps/rewards/breakdown", adminHandler.FetchPSRewardsBreakdown)
		api.GET("/ps/student-report/details", adminHandler.FetchStudentReportDetails)
		api.GET("/ps/assessments", adminHandler.FetchAssessmentDetails)
		api.GET("/ps/points", adminHandler.FetchPointsDetails)
		api.GET("/ps/biometrics", adminHandler.FetchBiometricDetails)
		api.GET("/v2/profile", trackerUserHandler.GetProfileV2)
		api.GET("/profile/v2", trackerUserHandler.GetProfileV2)

		api.GET("/top10", leaderboardHandler.GetTop10Students)

		// Feedback Chat User API
		api.POST("/feedback/messages", feedbackHandler.SendMessage)
		api.GET("/feedback/messages", feedbackHandler.GetUserMessages)
	}

	// Serve uploaded files
	r.Static("/uploads", "./uploads")

	// Public/Protected Leaderboard & Sponsors API
	r.GET("/sponsors/leaderboard", sponsorsHandler.GetSponsorsLeaderboard)
	r.GET("/sponsors/department-leaderboard", sponsorsHandler.GetDepartmentLeaderboard)
	r.POST("/sponsors/check-contribution", sponsorsHandler.CheckContribution)
	r.POST("/sponsors/create-order", sponsorsHandler.CreateOrder)
	r.POST("/sponsors/capture-payment", sponsorsHandler.CapturePayment)
	r.GET("/sponsors/certificate/:id", sponsorsHandler.GetCertificate)

	// Proxy PDF by Google Drive ID (keeps original links hidden)
	r.GET("/pdf/:id", uploadHandler.ProxyPDF)

	// Admin routes

	r.GET("/admin/super/check", adminHandler.CheckSuper)

	admin := r.Group("/admin")
	admin.Use(middleware.RequireAdmin())
	{
		admin.GET("/analytics", analyticsHandler.GetAnalytics)
		admin.GET("/sponsors", sponsorsHandler.GetSponsorsAdmin)
		admin.GET("/sponsors/leaderboard", sponsorsHandler.GetSponsorsLeaderboardAdmin)
		admin.PUT("/sponsors/name-override", sponsorsHandler.UpdateSponsorNameOverride)
		admin.DELETE("/sponsors/name-override", sponsorsHandler.DeleteSponsorNameOverride)
		admin.PUT("/sponsors/transaction-override", sponsorsHandler.UpdateSponsorTransactionOverride)
		admin.GET("/sponsors/departments", sponsorsHandler.GetSponsorDepartments)
		admin.POST("/sponsors/departments", sponsorsHandler.CreateSponsorDepartment)
		admin.POST("/sponsors/departments/batch", sponsorsHandler.CreateSponsorDepartmentsBatch)
		admin.PUT("/sponsors/departments/:id", sponsorsHandler.UpdateSponsorDepartment)
		admin.DELETE("/sponsors/departments/:id", sponsorsHandler.DeleteSponsorDepartment)
		admin.POST("/sponsors/department-mapping", sponsorsHandler.UpdateSponsorDepartmentMapping)
		admin.POST("/sponsors/department-mapping/batch", sponsorsHandler.UpdateSponsorDepartmentMappingsBatch)
		admin.GET("/users", adminHandler.GetUsers)
		admin.GET("/tracker-users", trackerUserHandler.GetTrackerUsersAdmin)
		admin.GET("/users/update", adminHandler.UpdateUsers)
		admin.PUT("/users/:uid/block", adminHandler.UpdateUserBlockStatus)
		admin.PUT("/users/:uid/role", adminHandler.UpdateUserRole)
		admin.DELETE("/users/:uid", adminHandler.DeleteUser)
		admin.POST("/users/delete-batch", adminHandler.DeleteUsersBatch)
		// admin.GET("/qb", qbHandler.List)
		admin.GET("/qb", qbHandler.List)
		admin.POST("/qb", qbHandler.Create)
		admin.POST("/qb/batch", qbHandler.BatchCreate)
		admin.PUT("/qb/reorder", qbHandler.Reorder)
		admin.PUT("/qb/:id", qbHandler.Update)
		admin.DELETE("/qb/:id", qbHandler.Delete)
		admin.GET("/ps-token", adminHandler.GetPSToken)
		admin.PUT("/ps-token", adminHandler.UpdatePSToken)
		admin.GET("/ps/rewards/breakdown", adminHandler.FetchPSRewardsBreakdown)
		admin.GET("/ps/student-report/details", adminHandler.FetchStudentReportDetails)
		admin.GET("/mess", messHandler.ListAdmin)
		admin.POST("/mess/upload", messHandler.UploadCSV)
		admin.PUT("/mess/:id", messHandler.UpdateAdmin)
		admin.DELETE("/mess/:id", messHandler.DeleteAdmin)
		admin.PUT("/semesters/:year", semesterHandler.UpdateSemesterByYear)
		admin.POST("/upload", uploadHandler.Upload)

		// Cards admin CRUD
		admin.GET("/cards", handlers.GetCards)
		admin.POST("/cards", handlers.CreateCard)
		admin.PUT("/cards/:id", handlers.UpdateCard)
		admin.PUT("/cards/reorder", handlers.ReorderCards)
		admin.DELETE("/cards/:id", handlers.DeleteCard)

		// Feedback Chat Admin API
		admin.GET("/feedback/conversations", feedbackHandler.GetAdminConversations)
		admin.GET("/feedback/messages/:user_uid", feedbackHandler.GetAdminUserMessages)
		admin.POST("/feedback/reply", feedbackHandler.AdminReply)
	}

	// Super-admin routes: manage admins and allowed external emails/domains
	super := r.Group("/admin/super")
	super.Use(middleware.RequireSuperAdmin())
	{
		super.GET("/admins", adminHandler.ListAdmins)
		super.POST("/admins", adminHandler.AddAdmin)
		super.DELETE("/admins/:uid", adminHandler.RemoveAdmin)

		super.GET("/allowed", adminHandler.ListAllowed)
		super.POST("/allowed", adminHandler.AddAllowed)
		super.DELETE("/allowed/:id", adminHandler.RemoveAllowed)
	}

	return r
}

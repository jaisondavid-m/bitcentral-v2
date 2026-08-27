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
	studentLookupHandler *handlers.StudentLookupHandler,
	uploadHandler *handlers.UploadHandler,
	trackerUserHandler *handlers.TrackerUserHandler,
	sponsorsHandler *handlers.SponsorsHandler,
	academicHandler *handlers.AcademicHandler,
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

	// Protected routes
	api := r.Group("/")
	api.Use(handler.RequireAuth())
	{
		api.POST("/cards/:id/click", handlers.TrackCardClick)
		api.GET("/cards", handlers.GetCards)
		api.GET("/leaves", leaveHandler.GetAllLeaves)
		api.GET("/exam-hall", examHallHandler.GetHall)
		api.GET("/exam-hall/all", examHallHandler.GetAllHallsByRegNo)
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
		api.GET("/tracker-users", trackerUserHandler.GetTrackerUsers)
		api.GET("/v2/profile", trackerUserHandler.GetProfileV2)
		api.GET("/profile/v2", trackerUserHandler.GetProfileV2)

		api.GET("/top10", leaderboardHandler.GetTop10Students)

		// Public / Student Read-only Academic API
		api.GET("/academic/options", academicHandler.GetAcademicOptions)
		api.GET("/academic/departments", academicHandler.ListDepartments)
		api.GET("/academic/regulations", academicHandler.ListRegulations)
		api.GET("/academic/batches", academicHandler.ListBatches)
		api.GET("/academic/semesters", academicHandler.ListSemesters)
		api.GET("/academic/courses", academicHandler.ListCourses)
	}

	// Serve uploaded files
	r.Static("/uploads", "./uploads")

	// Public/Protected Leaderboard & Sponsors API
	r.GET("/sponsors/leaderboard", sponsorsHandler.GetSponsorsLeaderboard)

	// Proxy PDF by Google Drive ID (keeps original links hidden)
	r.GET("/pdf/:id", uploadHandler.ProxyPDF)

	// Admin routes

	r.GET("/admin/super/check", adminHandler.CheckSuper)

	admin := r.Group("/admin")
	admin.Use(middleware.RequireAdmin())
	{
		admin.GET("/sponsors", sponsorsHandler.GetSponsorsAdmin)
		admin.GET("/users", adminHandler.GetUsers)
		admin.GET("/users/update", adminHandler.UpdateUsers)
		admin.PUT("/users/:uid/block", adminHandler.UpdateUserBlockStatus)
		admin.DELETE("/users/:uid", adminHandler.DeleteUser)
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

		// Academic Management Admin CRUD
		admin.GET("/academic/options", academicHandler.GetAcademicOptions)

		admin.GET("/academic/departments", academicHandler.ListDepartments)
		admin.POST("/academic/departments", academicHandler.CreateDepartment)
		admin.PUT("/academic/departments/:id", academicHandler.UpdateDepartment)
		admin.PUT("/academic/departments/:id/current-semester", academicHandler.SetDepartmentCurrentSemester)
		admin.DELETE("/academic/departments/:id", academicHandler.DeleteDepartment)

		admin.GET("/academic/regulations", academicHandler.ListRegulations)
		admin.POST("/academic/regulations", academicHandler.CreateRegulation)
		admin.PUT("/academic/regulations/:id", academicHandler.UpdateRegulation)
		admin.DELETE("/academic/regulations/:id", academicHandler.DeleteRegulation)

		admin.GET("/academic/batches", academicHandler.ListBatches)
		admin.POST("/academic/batches", academicHandler.CreateBatch)
		admin.PUT("/academic/batches/:id", academicHandler.UpdateBatch)
		admin.DELETE("/academic/batches/:id", academicHandler.DeleteBatch)

		admin.GET("/academic/semesters", academicHandler.ListSemesters)
		admin.POST("/academic/semesters", academicHandler.CreateSemester)
		admin.PUT("/academic/semesters/:id", academicHandler.UpdateSemester)
		admin.DELETE("/academic/semesters/:id", academicHandler.DeleteSemester)

		admin.GET("/academic/courses", academicHandler.ListCourses)
		admin.POST("/academic/courses", academicHandler.CreateCourse)
		admin.POST("/academic/courses/bulk-upload", academicHandler.BulkUploadCourses)
		admin.PUT("/academic/courses/:id", academicHandler.UpdateCourse)
		admin.DELETE("/academic/courses/:id", academicHandler.DeleteCourse)

		// Materials (PDF Only)
		admin.GET("/academic/materials", academicHandler.ListMaterials)
		admin.POST("/academic/materials", academicHandler.CreateMaterial)
		admin.PUT("/academic/materials/:id", academicHandler.UpdateMaterial)
		admin.DELETE("/academic/materials/:id", academicHandler.DeleteMaterial)

		// Exams & Schedules
		admin.GET("/academic/exams", academicHandler.ListExams)
		admin.POST("/academic/exams", academicHandler.CreateExam)
		admin.PUT("/academic/exams/:id", academicHandler.UpdateExam)
		admin.DELETE("/academic/exams/:id", academicHandler.DeleteExam)
		admin.POST("/academic/exam-schedules", academicHandler.AddExamSchedule)
		admin.DELETE("/academic/exam-schedules/:id", academicHandler.DeleteExamSchedule)

		// Question Banks (PDF Only)
		admin.GET("/academic/question-papers", academicHandler.ListQuestionPapers)
		admin.POST("/academic/question-papers", academicHandler.CreateQuestionPaper)
		admin.DELETE("/academic/question-papers/:id", academicHandler.DeleteQuestionPaper)
	}

	// Public Student Course Content API
	r.GET("/academic/courses/:id/content", academicHandler.GetCourseContent)

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

	r.POST("/presence/ping", presenceHandler.Ping)

	return r
}

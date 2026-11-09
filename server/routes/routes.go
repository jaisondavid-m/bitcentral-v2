package routes

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"

	"server/handlers/admin"
	"server/handlers/common"
	"server/handlers/student"
	"server/middleware"
)

func SetupRouter(
	handler *student.SheetHandler,
	cardHandler *student.CardHandler,
	adminHandler *admin.AdminHandler,
	messHandler *student.MessHandler,
	leaderboardHandler *student.LeaderboardHandler,
	leaveHandler *student.LeaveHandler,
	examHallHandler *student.ExamHallHandler,
	studentLookupHandler *admin.StudentLookupHandler,
	uploadHandler *common.UploadHandler,
	trackerUserHandler *admin.TrackerUserHandler,
	sponsorsHandler *admin.SponsorsHandler,
	feedbackHandler *common.FeedbackHandler,
	facultyDirectoryHandler *admin.FacultyDirectoryHandler,
	mailHandler *common.MailHandler,
	internalMarksHandler *student.InternalMarksHandler,
	notificationHandler *common.NotificationHandler,
	surveyHandler *common.SurveyHandler,
) *gin.Engine {

	r := gin.Default()

	// High-write Audit Logging Middleware (logs to config.DBLogs)
	r.Use(middleware.AuditLogger())

	// CORS configuration
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://127.0.0.1:5173",
			"https://bitcentral.vercel.app",
			"https://bitcentral.bitsathy.in",
			"http://bitcentral.bitsathy.in",
		},
		AllowOriginFunc: func(origin string) bool {
			return strings.HasSuffix(origin, ".bitsathy.in") ||
				strings.HasSuffix(origin, ".jaisondavidm.xyz") ||
				strings.HasSuffix(origin, ".vercel.app") ||
				strings.HasSuffix(origin, ".pages.dev")
		},
		AllowMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS",
		},
		AllowHeaders: []string{
			"Origin", "Content-Type", "Authorization", "X-Requested-With",
		},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":      "ok",
			"server_type": "own_server",
			"time":        time.Now().UTC().Format(time.RFC3339),
		})
	})

	// Login & Auth Callback routes (Public)
	r.GET("/auth/login", handler.HandleLogin)
	r.GET("/auth/callback", func(c *gin.Context) {
		code := c.Query("code")
		if code == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Missing authorization code"})
			return
		}

		var token *oauth2.Token
		var err error

		// Try SheetHandler OAuth config first
		sheetCfg := handler.GetOAuthConfig()
		if sheetCfg != nil {
			token, err = sheetCfg.Exchange(c.Request.Context(), code)
		}

		// Fallback to Directory OAuth config if needed
		if err != nil || token == nil || token.AccessToken == "" {
			dirCfg := facultyDirectoryHandler.GetOAuthConfig()
			if dirCfg != nil {
				token, err = dirCfg.Exchange(c.Request.Context(), code)
			}
		}

		if err != nil || token == nil || token.AccessToken == "" {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("Token exchange failed: %v", err),
			})
			return
		}

		// If Google didn't return a refresh_token in this exchange, keep existing one
		if token.RefreshToken == "" && handler.GetOAuthToken() != nil && handler.GetOAuthToken().RefreshToken != "" {
			token.RefreshToken = handler.GetOAuthToken().RefreshToken
		}

		// Initialize Sheets service in memory & persist to MySQL and token.json
		sheetErr := handler.SetTokenAndInitService(token)

		// Sync Faculty Directory in background
		go facultyDirectoryHandler.SyncGoogleDirectory()

		if sheetErr != nil {
			c.JSON(http.StatusOK, gin.H{
				"success": true,
				"warning": fmt.Sprintf("Token saved, but Sheets initialization returned: %v", sheetErr),
				"message": "Authentication successful! Token saved.",
			})
			return
		}

		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": "Google Sheets & Contacts authentication successful! Sheets service is active.",
		})
	})
	r.POST("/auth/google", studentLookupHandler.GoogleLogin)
	r.GET("/faculty-directory/auth/login", facultyDirectoryHandler.HandleDirectoryLogin)

	// Faculty Photos with access middleware
	r.GET("/faculty-photos/:filename", middleware.FacultyPhotoAccess(), facultyDirectoryHandler.ServeFacultyPhoto)
	r.GET("/faculty/photos/:filename", middleware.FacultyPhotoAccess(), facultyDirectoryHandler.ServeFacultyPhoto)
	r.GET("/api/faculty-photos/:filename", middleware.FacultyPhotoAccess(), facultyDirectoryHandler.ServeFacultyPhoto)
	r.GET("/api/faculty/photos/:filename", middleware.FacultyPhotoAccess(), facultyDirectoryHandler.ServeFacultyPhoto)

	// Protected routes (Requires logged-in user)
	api := r.Group("/")
	api.Use(handler.RequireAuth())
	{
		// Logout
		api.POST("/auth/logout", studentLookupHandler.GoogleLogout)
		api.GET("/auth/logout", studentLookupHandler.GoogleLogout)

		// Exam Hall
		api.GET("/exam-hall", examHallHandler.GetHall)
		api.GET("/exam-hall/all", examHallHandler.GetAllHallsByRegNo)
		api.GET("/exam-hall/members", examHallHandler.GetHallMembers)

		// Faculty Directory
		api.GET("/faculty-directory", facultyDirectoryHandler.GetFacultyDirectory)
		api.GET("/faculty", facultyDirectoryHandler.GetFacultyDirectory)

		// Notifications
		api.GET("/notifications", notificationHandler.GetUserNotifications)

		// Internal Marks & Cards
		api.GET("/internal-marks/conversion", internalMarksHandler.GetInternalMarksConversion)
		api.GET("/api/internal-marks/conversion", internalMarksHandler.GetInternalMarksConversion)
		api.POST("/cards/:id/click", student.TrackCardClick)
		api.GET("/cards", student.GetCards)
		api.GET("/leaves", leaveHandler.GetAllLeaves)
		api.GET("/search", handler.UniversalSearch)
		api.GET("/rewards", handler.GetRewardsByRollNo)
		api.GET("/me", studentLookupHandler.GetMe)
		api.GET("/student/roll-no", studentLookupHandler.GetRollNoByEmail)
		api.GET("/averages", handler.GetOverallAverageFromSheet)
		api.GET("/mess", messHandler.GetMess)
		api.GET("/mess/timings", messHandler.GetMealTimings)
		api.GET("/mess/closures", messHandler.GetActiveClosures)
		api.GET("/v2/profile", trackerUserHandler.GetProfileV2)
		api.GET("/profile/v2", trackerUserHandler.GetProfileV2)

		api.GET("/top10", leaderboardHandler.GetTop10Students)
		api.GET("/rank", leaderboardHandler.GetStudentRank)
		api.GET("/rewards/rank", leaderboardHandler.GetStudentRank)

		// Feedback Chat User API
		api.POST("/feedback/messages", feedbackHandler.SendMessage)
		api.GET("/feedback/messages", feedbackHandler.GetUserMessages)

		// UI Survey Feedback API
		api.POST("/survey/feedback", surveyHandler.SubmitFeedback)
		api.GET("/survey/status", surveyHandler.CheckUserSurveyStatus)

		// Notifications User Actions API
		api.POST("/notifications/:id/read", notificationHandler.MarkNotificationAsRead)
		api.POST("/notifications/read-all", notificationHandler.MarkAllNotificationsAsRead)
		api.DELETE("/notifications/:id/dismiss", notificationHandler.DismissNotification)

		// Serve uploaded files
		api.Static("/uploads", "./uploads")

		// Leaderboard & Sponsors API
		api.GET("/sponsors/leaderboard", sponsorsHandler.GetSponsorsLeaderboard)
		api.GET("/sponsors/department-leaderboard", sponsorsHandler.GetDepartmentLeaderboard)
		api.POST("/sponsors/check-contribution", sponsorsHandler.CheckContribution)
		api.POST("/sponsors/create-order", sponsorsHandler.CreateOrder)
		api.POST("/sponsors/capture-payment", sponsorsHandler.CapturePayment)
		api.GET("/sponsors/certificate/:id", sponsorsHandler.GetCertificate)

		// Proxy PDF by Google Drive ID
		api.GET("/pdf/:id", uploadHandler.ProxyPDF)

	}

	// Admin routes
	r.GET("/admin/super/check", adminHandler.CheckSuper)

	admin := r.Group("/admin")
	admin.Use(middleware.RequireAdmin())
	{
		admin.GET("/audit-logs", adminHandler.GetAuditLogs)
		admin.GET("/audit-logs/users", adminHandler.GetAuditLogUsers)
		admin.GET("/audit-logs/api-usage", adminHandler.GetAuditAPIUsage)
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
		admin.POST("/faculty-directory/sync", facultyDirectoryHandler.TriggerSyncAdmin)
		admin.GET("/tracker-users", trackerUserHandler.GetTrackerUsersAdmin)
		admin.GET("/users/update", adminHandler.UpdateUsers)
		admin.PUT("/users/:uid/block", adminHandler.UpdateUserBlockStatus)
		admin.PUT("/users/:uid/flag", adminHandler.UpdateUserFlagStatus)
		admin.PUT("/users/:uid/role", adminHandler.UpdateUserRole)
		admin.DELETE("/users/:uid", adminHandler.DeleteUser)
		admin.POST("/users/delete-batch", adminHandler.DeleteUsersBatch)
		admin.GET("/mess", messHandler.ListAdmin)
		admin.POST("/mess/upload", messHandler.UploadCSV)
		admin.PUT("/mess/:id", messHandler.UpdateAdmin)
		admin.DELETE("/mess/:id", messHandler.DeleteAdmin)
		admin.GET("/mess/closures", messHandler.ListClosuresAdmin)
		admin.POST("/mess/closures", messHandler.CreateClosureAdmin)
		admin.PUT("/mess/closures/:id", messHandler.UpdateClosureAdmin)
		admin.DELETE("/mess/closures/:id", messHandler.DeleteClosureAdmin)
		admin.POST("/upload", uploadHandler.Upload)
		
		// Cards admin CRUD
		admin.GET("/cards", student.GetCards)
		admin.POST("/cards", student.CreateCard)
		admin.POST("/cards/bulk", student.BulkUploadCards)
		admin.PUT("/cards/:id", student.UpdateCard)
		admin.PUT("/cards/reorder", student.ReorderCards)
		admin.DELETE("/cards/:id", student.DeleteCard)

		// Leaves admin CRUD
		admin.GET("/leaves", leaveHandler.GetAllLeaves)
		admin.POST("/leaves", leaveHandler.CreateLeave)
		admin.PUT("/leaves/:id", leaveHandler.UpdateLeave)
		admin.DELETE("/leaves/:id", leaveHandler.DeleteLeave)
		admin.POST("/leaves/batch", leaveHandler.BatchCreateLeaves)
		admin.POST("/leaves/reset", leaveHandler.ResetToDefaultLeaves)

		// Feedback Chat Admin API
		admin.GET("/feedback/conversations", feedbackHandler.GetAdminConversations)
		admin.GET("/feedback/messages/:user_uid", feedbackHandler.GetAdminUserMessages)
		admin.POST("/feedback/reply", feedbackHandler.AdminReply)

		// Mail Sender Admin API (Gomail & Job Queue)
		admin.GET("/mail/config", mailHandler.GetMailConfig)
		admin.POST("/mail/test", mailHandler.TestMailConnection)
		admin.POST("/mail/send", mailHandler.SendAdminEmail)
		admin.GET("/mail/queues", mailHandler.GetMailQueues)
		admin.GET("/mail/queues/:batch_id", mailHandler.GetMailQueueDetails)
		admin.POST("/mail/queues/:batch_id/resend-failed", mailHandler.ResendFailedQueue)
		admin.POST("/mail/queues/item/:id/retry", mailHandler.RetryQueueItem)
		admin.DELETE("/mail/queues/:batch_id", mailHandler.DeleteMailQueue)
		admin.GET("/mail/history", mailHandler.GetMailHistory)
		admin.DELETE("/mail/history/:id", mailHandler.DeleteMailLog)

		// Notifications Admin CRUD
		admin.GET("/notifications", notificationHandler.GetAdminNotifications)
		admin.POST("/notifications", notificationHandler.CreateNotification)
		admin.PUT("/notifications/:id", notificationHandler.UpdateNotification)
		admin.DELETE("/notifications/:id", notificationHandler.DeleteNotification)

		// UI Survey Feedback Admin API
		admin.GET("/survey/feedback", surveyHandler.GetFeedbackList)
		admin.DELETE("/survey/feedback/:id", surveyHandler.DeleteFeedback)

	}

	// Super-admin routes: manage admins and allowed external emails/domains
	super := r.Group("/admin/super")
	super.Use(middleware.RequireSuperAdmin())
	{
		super.GET("/admins", adminHandler.ListAdmins)
		super.POST("/admins", adminHandler.AddAdmin)
		super.DELETE("/admins/:uid", adminHandler.RemoveAdmin)
	}

	return r
}

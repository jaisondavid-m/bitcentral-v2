package handlers

import (
	"crypto/rand"
	"crypto/tls"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"gopkg.in/gomail.v2"

	"server/config"
)

type MailHandler struct {
	DB          *sql.DB
	triggerChan chan struct{}
	mu          sync.Mutex
	isWorkerRun bool
}

func NewMailHandler() *MailHandler {
	h := &MailHandler{
		DB:          config.DB,
		triggerChan: make(chan struct{}, 50),
	}
	return h
}

type EmailRecipient struct {
	Email      string `json:"email"`
	Name       string `json:"name"`
	RegisterNo string `json:"register_no"`
	UserID     string `json:"user_id"`
	RollNo     string `json:"roll_no,omitempty"`
	Department string `json:"department"`
	Batch      string `json:"batch"`
}

type CustomSMTPConfig struct {
	Host               string `json:"host"`
	Port               int    `json:"port"`
	User               string `json:"user"`
	Pass               string `json:"pass"`
	FromName           string `json:"from_name"`
	FromEmail          string `json:"from_email"`
	InsecureSkipVerify bool   `json:"insecure_skip_verify"`
}

type SendMailRequest struct {
	Recipients     []EmailRecipient  `json:"recipients"`
	RawEmails      []string          `json:"raw_emails"`
	Subject        string            `json:"subject"`
	Body           string            `json:"body"`
	IsHTML         bool              `json:"is_html"`
	ReplyTo        string            `json:"reply_to"`
	CustomFromName string            `json:"custom_from_name"`
	SMTPConfig     *CustomSMTPConfig `json:"smtp_config,omitempty"`
}

type TestMailRequest struct {
	TargetEmail string            `json:"target_email"`
	SMTPConfig  *CustomSMTPConfig `json:"smtp_config,omitempty"`
}

type EmailJobBatch struct {
	ID             int              `json:"id"`
	BatchID        string           `json:"batch_id"`
	AdminUID       string           `json:"admin_uid"`
	AdminEmail     string           `json:"admin_email"`
	Subject        string           `json:"subject"`
	Body           string           `json:"body"`
	IsHTML         bool             `json:"is_html"`
	CustomFromName string           `json:"custom_from_name"`
	ReplyTo        string           `json:"reply_to"`
	Status         string           `json:"status"` // pending, processing, completed, failed, paused
	TotalCount     int              `json:"total_count"`
	SentCount      int              `json:"sent_count"`
	FailedCount    int              `json:"failed_count"`
	PendingCount   int              `json:"pending_count"`
	CreatedAt      string           `json:"created_at"`
	UpdatedAt      string           `json:"updated_at"`
	Items          []EmailQueueItem `json:"items,omitempty"`
}

type EmailQueueItem struct {
	ID                  int     `json:"id"`
	BatchID             string  `json:"batch_id"`
	RecipientEmail      string  `json:"recipient_email"`
	RecipientName       string  `json:"recipient_name"`
	RecipientUserID     string  `json:"recipient_user_id"`
	RecipientRegisterNo string  `json:"recipient_register_no"`
	RecipientDept       string  `json:"recipient_dept"`
	RecipientBatch      string  `json:"recipient_batch"`
	Status              string  `json:"status"` // pending, processing, sent, failed
	Attempts            int     `json:"attempts"`
	ErrorMessage        string  `json:"error_message"`
	SentAt              *string `json:"sent_at"`
	CreatedAt           string  `json:"created_at"`
	UpdatedAt           string  `json:"updated_at"`
}

func (h *MailHandler) getEffectiveSMTPConfig(override *CustomSMTPConfig) CustomSMTPConfig {
	cfg := CustomSMTPConfig{
		Host:               "smtp.gmail.com",
		Port:               587,
		User:               "",
		Pass:               "",
		FromName:           "BIT Central",
		FromEmail:          "",
		InsecureSkipVerify: false,
	}

	// Read from environment
	if host := os.Getenv("SMTP_HOST"); host != "" {
		cfg.Host = strings.TrimSpace(host)
	}
	if portStr := os.Getenv("SMTP_PORT"); portStr != "" {
		if p, err := strconv.Atoi(strings.TrimSpace(portStr)); err == nil && p > 0 {
			cfg.Port = p
		}
	}
	if user := os.Getenv("SMTP_USER"); user != "" {
		cfg.User = strings.TrimSpace(user)
	} else if email := os.Getenv("SMTP_EMAIL"); email != "" {
		cfg.User = strings.TrimSpace(email)
	} else if username := os.Getenv("SMTP_USERNAME"); username != "" {
		cfg.User = strings.TrimSpace(username)
	}

	if pass := os.Getenv("SMTP_PASSWORD"); pass != "" {
		cfg.Pass = strings.TrimSpace(pass)
	} else if pass := os.Getenv("SMTP_PASS"); pass != "" {
		cfg.Pass = strings.TrimSpace(pass)
	}

	if fromName := os.Getenv("SMTP_FROM_NAME"); fromName != "" {
		cfg.FromName = strings.TrimSpace(fromName)
	}
	if fromEmail := os.Getenv("SMTP_FROM_EMAIL"); fromEmail != "" {
		cfg.FromEmail = strings.TrimSpace(fromEmail)
	}
	if strings.EqualFold(os.Getenv("SMTP_INSECURE_SKIP_VERIFY"), "true") {
		cfg.InsecureSkipVerify = true
	}

	// Apply user overrides if provided
	if override != nil {
		if override.Host != "" {
			cfg.Host = strings.TrimSpace(override.Host)
		}
		if override.Port > 0 {
			cfg.Port = override.Port
		}
		if override.User != "" {
			cfg.User = strings.TrimSpace(override.User)
		}
		if override.Pass != "" {
			cfg.Pass = strings.TrimSpace(override.Pass)
		}
		if override.FromName != "" {
			cfg.FromName = strings.TrimSpace(override.FromName)
		}
		if override.FromEmail != "" {
			cfg.FromEmail = strings.TrimSpace(override.FromEmail)
		}
		if override.InsecureSkipVerify {
			cfg.InsecureSkipVerify = true
		}
	}

	if cfg.FromEmail == "" {
		cfg.FromEmail = cfg.User
	}

	return cfg
}

func maskString(s string) string {
	if len(s) <= 4 {
		return "****"
	}
	return s[:2] + strings.Repeat("*", len(s)-4) + s[len(s)-2:]
}

func maskEmail(email string) string {
	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return maskString(email)
	}
	name := parts[0]
	domain := parts[1]
	if len(name) <= 2 {
		return name + "@" + domain
	}
	return name[:2] + "***@" + domain
}

func generateRandomHex(n int) string {
	bytes := make([]byte, n)
	if _, err := rand.Read(bytes); err != nil {
		return strconv.FormatInt(time.Now().UnixNano(), 16)
	}
	return hex.EncodeToString(bytes)
}

// StartQueueWorker starts the background sequential worker that processes email jobs one by one.
func (h *MailHandler) StartQueueWorker() {
	h.mu.Lock()
	if h.isWorkerRun {
		h.mu.Unlock()
		return
	}
	h.isWorkerRun = true
	h.mu.Unlock()

	// Reset any stuck 'processing' items from prior crashes back to 'pending'
	if h.DB != nil {
		_, _ = h.DB.Exec(`UPDATE email_queue_items SET status = 'pending' WHERE status = 'processing'`)
		_, _ = h.DB.Exec(`UPDATE email_job_batches SET status = 'pending' WHERE status = 'processing'`)
	}

	log.Println("🚀 Sequential Email Queue Worker started")
	go h.runQueueWorkerLoop()
}

func (h *MailHandler) triggerWorker() {
	select {
	case h.triggerChan <- struct{}{}:
	default:
	}
}

func (h *MailHandler) runQueueWorkerLoop() {
	for {
		if h.DB == nil {
			time.Sleep(2 * time.Second)
			continue
		}

		processedAny := h.processNextQueueItem()
		if !processedAny {
			// No pending items, wait for wake trigger or poll every 3 seconds
			select {
			case <-h.triggerChan:
			case <-time.After(3 * time.Second):
			}
		}
	}
}

func (h *MailHandler) processNextQueueItem() bool {
	if h.DB == nil {
		return false
	}

	// 1. Fetch next pending item with batch context
	var (
		itemID                                                 int
		batchID, recEmail, recName, recUID, recRegNo, recDept, recBatch string
		attempts                                               int
		subject, body, customFromName, replyTo                 string
		isHTMLInt                                              int
	)

	row := h.DB.QueryRow(`
		SELECT eq.id, eq.batch_id, eq.recipient_email, COALESCE(eq.recipient_name, ''), 
		       COALESCE(eq.recipient_user_id, ''), COALESCE(eq.recipient_register_no, ''),
		       COALESCE(eq.recipient_dept, ''), COALESCE(eq.recipient_batch, ''), eq.attempts,
		       b.subject, b.body, b.is_html, COALESCE(b.custom_from_name, ''), COALESCE(b.reply_to, '')
		FROM email_queue_items eq
		JOIN email_job_batches b ON eq.batch_id = b.batch_id
		WHERE eq.status = 'pending' AND b.status != 'paused'
		ORDER BY eq.id ASC
		LIMIT 1
	`)

	err := row.Scan(
		&itemID, &batchID, &recEmail, &recName,
		&recUID, &recRegNo, &recDept, &recBatch, &attempts,
		&subject, &body, &isHTMLInt, &customFromName, &replyTo,
	)
	if err != nil {
		if err != sql.ErrNoRows {
			log.Printf("⚠️ Queue worker query error: %v", err)
		}
		return false
	}

	// 2. Atomically claim this item
	res, err := h.DB.Exec(`UPDATE email_queue_items SET status = 'processing', attempts = attempts + 1 WHERE id = ? AND status = 'pending'`, itemID)
	if err != nil {
		log.Printf("⚠️ Failed to claim email item %d: %v", itemID, err)
		return true
	}
	rowsAff, _ := res.RowsAffected()
	if rowsAff == 0 {
		return true // Claimed by another cycle
	}

	// Mark batch status as 'processing'
	_, _ = h.DB.Exec(`UPDATE email_job_batches SET status = 'processing' WHERE batch_id = ? AND status IN ('pending', 'processing')`, batchID)

	// 3. Prepare email data
	r := EmailRecipient{
		Email:      recEmail,
		Name:       recName,
		RegisterNo: recRegNo,
		UserID:     recUID,
		Department: recDept,
		Batch:      recBatch,
	}

	cfg := h.getEffectiveSMTPConfig(nil)
	fromHeader := cfg.FromEmail
	if customFromName != "" {
		fromHeader = fmt.Sprintf("%s <%s>", customFromName, cfg.FromEmail)
	} else if cfg.FromName != "" {
		fromHeader = fmt.Sprintf("%s <%s>", cfg.FromName, cfg.FromEmail)
	}

	personalizedSubject := replaceTemplateVariables(h.DB, subject, r)
	personalizedBody := replaceTemplateVariables(h.DB, body, r)

	m := gomail.NewMessage()
	m.SetHeader("From", fromHeader)
	m.SetHeader("To", r.Email)
	m.SetHeader("Subject", personalizedSubject)
	if replyTo != "" {
		m.SetHeader("Reply-To", replyTo)
	}

	if isHTMLInt == 1 {
		finalHTML := wrapInHTMLTemplate(personalizedSubject, personalizedBody)
		m.SetBody("text/html", finalHTML)
	} else {
		m.SetBody("text/plain", personalizedBody)
	}

	// 4. Dial SMTP and send sequentially (one by one)
	_, s, dialErr := dialSMTP(cfg)
	var sendErr error
	if dialErr != nil {
		sendErr = dialErr
	} else {
		sendErr = gomail.Send(s, m)
		s.Close()
	}

	// 5. Update Status
	if sendErr == nil {
		log.Printf("✅ [Queue Worker] Successfully sent email to %s (Batch: %s, Item: %d)", r.Email, batchID, itemID)
		_, _ = h.DB.Exec(`
			UPDATE email_queue_items 
			SET status = 'sent', sent_at = NOW(), error_message = '' 
			WHERE id = ?
		`, itemID)

		_, _ = h.DB.Exec(`
			UPDATE email_job_batches 
			SET sent_count = sent_count + 1, pending_count = GREATEST(0, pending_count - 1) 
			WHERE batch_id = ?
		`, batchID)
	} else {
		errMsg := sendErr.Error()
		log.Printf("❌ [Queue Worker] Failed sending email to %s: %s", r.Email, errMsg)
		_, _ = h.DB.Exec(`
			UPDATE email_queue_items 
			SET status = 'failed', error_message = ? 
			WHERE id = ?
		`, errMsg, itemID)

		_, _ = h.DB.Exec(`
			UPDATE email_job_batches 
			SET failed_count = failed_count + 1, pending_count = GREATEST(0, pending_count - 1) 
			WHERE batch_id = ?
		`, batchID)
	}

	// 6. Synchronize overall batch status
	h.syncBatchStatus(batchID)

	// 7. Controlled safety delay between emails to strictly respect SMTP rate limits
	time.Sleep(350 * time.Millisecond)
	return true
}

func (h *MailHandler) syncBatchStatus(batchID string) {
	if h.DB == nil {
		return
	}
	var totalCount, pendingCount, processingCount, sentCount, failedCount int
	_ = h.DB.QueryRow(`
		SELECT 
			COUNT(*),
			COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END), 0)
		FROM email_queue_items
		WHERE batch_id = ?
	`, batchID).Scan(&totalCount, &pendingCount, &processingCount, &sentCount, &failedCount)

	newStatus := "processing"
	if pendingCount+processingCount == 0 {
		if sentCount > 0 {
			newStatus = "completed"
		} else {
			newStatus = "failed"
		}
	} else if sentCount == 0 && failedCount == 0 {
		newStatus = "pending"
	}

	_, _ = h.DB.Exec(`
		UPDATE email_job_batches 
		SET status = ?, total_count = ?, sent_count = ?, failed_count = ?, pending_count = ?
		WHERE batch_id = ?
	`, newStatus, totalCount, sentCount, failedCount, pendingCount+processingCount, batchID)
}

// GET /admin/mail/config
func (h *MailHandler) GetMailConfig(c *gin.Context) {
	cfg := h.getEffectiveSMTPConfig(nil)

	isConfigured := cfg.Host != "" && cfg.User != "" && cfg.Pass != ""

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"config": gin.H{
			"host":                 cfg.Host,
			"port":                 cfg.Port,
			"user_masked":          maskEmail(cfg.User),
			"from_name":            cfg.FromName,
			"from_email":           cfg.FromEmail,
			"is_configured":        isConfigured,
			"insecure_skip_verify": cfg.InsecureSkipVerify,
		},
	})
}

func dialSMTP(cfg CustomSMTPConfig) (*gomail.Dialer, gomail.SendCloser, error) {
	primaryDialer := gomail.NewDialer(cfg.Host, cfg.Port, cfg.User, cfg.Pass)
	if cfg.Port == 465 {
		primaryDialer.SSL = true
	}
	if cfg.InsecureSkipVerify {
		primaryDialer.TLSConfig = &tls.Config{InsecureSkipVerify: true, ServerName: cfg.Host}
	} else {
		primaryDialer.TLSConfig = &tls.Config{ServerName: cfg.Host}
	}

	s, err := primaryDialer.Dial()
	if err == nil {
		return primaryDialer, s, nil
	}

	// Fallback to SSL direct 465 if 587 failed, or vice versa
	fallbackPort := 465
	if cfg.Port == 465 {
		fallbackPort = 587
	}

	log.Printf("⚠️ SMTP dial on port %d failed (%v). Attempting fallback port %d...", cfg.Port, err, fallbackPort)
	fallbackDialer := gomail.NewDialer(cfg.Host, fallbackPort, cfg.User, cfg.Pass)
	if fallbackPort == 465 {
		fallbackDialer.SSL = true
	}
	if cfg.InsecureSkipVerify {
		fallbackDialer.TLSConfig = &tls.Config{InsecureSkipVerify: true, ServerName: cfg.Host}
	} else {
		fallbackDialer.TLSConfig = &tls.Config{ServerName: cfg.Host}
	}

	sFallback, errFallback := fallbackDialer.Dial()
	if errFallback == nil {
		log.Printf("✅ SMTP connected successfully using fallback port %d", fallbackPort)
		return fallbackDialer, sFallback, nil
	}

	return primaryDialer, nil, fmt.Errorf("port %d failed (%v) and fallback port %d failed (%v)", cfg.Port, err, fallbackPort, errFallback)
}

// POST /admin/mail/test
func (h *MailHandler) TestMailConnection(c *gin.Context) {
	var req TestMailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid test request payload"})
		return
	}

	target := strings.TrimSpace(req.TargetEmail)
	if target == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Target email address is required for connection test"})
		return
	}

	cfg := h.getEffectiveSMTPConfig(req.SMTPConfig)
	if cfg.User == "" || cfg.Pass == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "SMTP credentials not configured. Please define SMTP_USER and SMTP_PASSWORD in environment or payload.",
		})
		return
	}

	fromHeader := cfg.FromEmail
	if cfg.FromName != "" {
		fromHeader = fmt.Sprintf("%s <%s>", cfg.FromName, cfg.FromEmail)
	}

	m := gomail.NewMessage()
	m.SetHeader("From", fromHeader)
	m.SetHeader("To", target)
	m.SetHeader("Subject", "⚡ [BIT Central] SMTP Connection Test Successful")

	testBody := fmt.Sprintf(`<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 28px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
      <h2 style="color: #2563eb; margin: 0; font-size: 20px;">BIT Central SMTP Test</h2>
    </div>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      Great news! The Gomail SMTP connection on <strong>BIT Central</strong> is working properly.
    </p>
    <div style="background: #f1f5f9; border-radius: 10px; padding: 14px; font-size: 13px; font-family: monospace; color: #475569; margin: 18px 0;">
      <div><strong>Host:</strong> %s:%d</div>
      <div><strong>Sender:</strong> %s</div>
      <div><strong>Target:</strong> %s</div>
      <div><strong>Timestamp:</strong> %s</div>
    </div>
    <p style="font-size: 12px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 14px;">
      Sent automatically by BIT Central Admin Mailer.
    </p>
  </div>
</body>
</html>`, cfg.Host, cfg.Port, cfg.FromEmail, target, time.Now().Format("02 Jan 2006 03:04:05 PM MST"))

	m.SetBody("text/html", testBody)

	d, s, err := dialSMTP(cfg)
	if err != nil {
		log.Printf("❌ SMTP Test dial failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": fmt.Sprintf("SMTP connection failed: %v. In production, ensure SMTP_PORT=465 is set.", err),
		})
		return
	}
	defer s.Close()

	if err := gomail.Send(s, m); err != nil {
		log.Printf("❌ SMTP Test send failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": fmt.Sprintf("SMTP send failed: %v", err),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("SMTP test email successfully sent to %s via %s:%d (SSL/TLS)", target, d.Host, d.Port),
	})
}

func extractCleanNameAndFirst(r EmailRecipient) (string, string) {
	fullName := strings.TrimSpace(r.Name)
	if fullName == "" || strings.EqualFold(fullName, "Student") || strings.EqualFold(fullName, "User") || strings.Contains(fullName, "@") {
		prefix := strings.Split(r.Email, "@")[0]
		parts := strings.Split(prefix, ".")
		if len(parts) >= 1 {
			rawName := parts[0]
			if len(rawName) > 3 {
				lastChar := rawName[len(rawName)-1:]
				baseName := rawName[:len(rawName)-1]
				fullName = strings.Title(baseName) + " " + strings.ToUpper(lastChar)
			} else {
				fullName = strings.Title(rawName)
			}
		} else {
			fullName = strings.Title(prefix)
		}
	}

	firstName := fullName
	if parts := strings.Fields(fullName); len(parts) > 0 {
		firstName = parts[0]
	}
	return fullName, firstName
}

func replaceTemplateVariables(db *sql.DB, templateStr string, r EmailRecipient) string {
	fullName := strings.TrimSpace(r.Name)
	registerNo := strings.TrimSpace(r.RegisterNo)
	userID := strings.TrimSpace(r.UserID)
	dept := strings.TrimSpace(r.Department)
	batch := strings.TrimSpace(r.Batch)

	if registerNo == "" && r.RollNo != "" {
		registerNo = strings.TrimSpace(r.RollNo)
	}

	if db != nil {
		var tName, tUserID, tID, tDept, tBatch string
		_ = db.QueryRow(
			`SELECT COALESCE(name, ''), COALESCE(user_id, ''), COALESCE(id, ''), COALESCE(department, ''), COALESCE(batch, '') FROM tracker_users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) LIMIT 1`,
			r.Email,
		).Scan(&tName, &tUserID, &tID, &tDept, &tBatch)

		if strings.TrimSpace(tName) != "" {
			fullName = strings.TrimSpace(tName)
		}
		if registerNo == "" {
			registerNo = tUserID
		}
		if userID == "" {
			userID = tID
		}
		if dept == "" {
			dept = tDept
		}
		if batch == "" {
			batch = tBatch
		}
	}

	if fullName == "" {
		fullName, _ = extractCleanNameAndFirst(r)
	}

	var firstName string
	if parts := strings.Fields(fullName); len(parts) > 0 {
		firstName = parts[0]
	} else {
		firstName = fullName
	}

	if registerNo == "" {
		registerNo = "null"
	}
	if userID == "" {
		userID = "null"
	}
	if dept == "" {
		dept = "null"
	}
	if batch == "" {
		batch = "null"
	}
	if fullName == "" {
		fullName = "null"
	}
	if firstName == "" {
		firstName = "null"
	}

	res := templateStr
	res = strings.ReplaceAll(res, "{{name}}", fullName)
	res = strings.ReplaceAll(res, "{{first_name}}", firstName)
	res = strings.ReplaceAll(res, "{{email}}", r.Email)
	res = strings.ReplaceAll(res, "{{user_id}}", userID)
	res = strings.ReplaceAll(res, "{{register_no}}", registerNo)
	res = strings.ReplaceAll(res, "{{roll_no}}", registerNo)
	res = strings.ReplaceAll(res, "{{department}}", dept)
	res = strings.ReplaceAll(res, "{{batch}}", batch)
	res = strings.ReplaceAll(res, "{{date}}", time.Now().Format("02-Jan-2006"))
	res = strings.ReplaceAll(res, "{{year}}", strconv.Itoa(time.Now().Year()))
	return res
}

func wrapInHTMLTemplate(subject, bodyContent string) string {
	if strings.Contains(strings.ToLower(bodyContent), "<html") || strings.Contains(strings.ToLower(bodyContent), "<body") {
		return bodyContent
	}

	paragraphs := strings.Split(bodyContent, "\n")
	var formatted strings.Builder
	for _, p := range paragraphs {
		trimmed := strings.TrimSpace(p)
		if trimmed == "" {
			formatted.WriteString("<br/>")
		} else {
			formatted.WriteString(fmt.Sprintf("<p style=\"margin: 0 0 12px 0; line-height: 1.6;\">%s</p>", trimmed))
		}
	}

	return fmt.Sprintf(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>%s</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e40af 0%%, #2563eb 100%%); padding: 24px 28px; text-align: left;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">BIT Central</h1>
      <p style="color: #bfdbfe; margin: 4px 0 0 0; font-size: 12px;">Official Student & Campus Portal Notification</p>
    </div>

    <!-- Body -->
    <div style="padding: 28px; font-size: 14px; color: #334155; line-height: 1.65;">
      %s
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f5f9; padding: 16px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; line-height: 1.5;">
      <p style="margin: 0 0 3px 0; color: #475569;">This is an automated computer-generated message from BIT Central.</p>
      <p style="margin: 0; font-size: 10px; color: #94a3b8;">If you don't need this message again, please contact <a href="mailto:developer@bitsathy.in" style="color: #2563eb; text-decoration: underline;">developer@bitsathy.in</a>.</p>
    </div>
  </div>
</body>
</html>`, subject, formatted.String())
}

// POST /admin/mail/send -> Asynchronously enqueues batch and items into the Job Queue
func (h *MailHandler) SendAdminEmail(c *gin.Context) {
	var req SendMailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request payload: " + err.Error()})
		return
	}

	// Collect unique recipients
	recipientsMap := make(map[string]EmailRecipient)
	for _, r := range req.Recipients {
		cleanEmail := strings.ToLower(strings.TrimSpace(r.Email))
		if cleanEmail != "" {
			r.Email = cleanEmail
			recipientsMap[cleanEmail] = r
		}
	}
	for _, raw := range req.RawEmails {
		cleanEmail := strings.ToLower(strings.TrimSpace(raw))
		if cleanEmail != "" {
			if _, exists := recipientsMap[cleanEmail]; !exists {
				recipientsMap[cleanEmail] = EmailRecipient{
					Email: cleanEmail,
					Name:  cleanEmail,
				}
			}
		}
	}

	if len(recipientsMap) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No valid recipients specified"})
		return
	}

	reqSubject := strings.TrimSpace(req.Subject)
	if reqSubject == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Subject is required"})
		return
	}

	reqBody := strings.TrimSpace(req.Body)
	if reqBody == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Email body is required"})
		return
	}

	// Verify SMTP config exists
	cfg := h.getEffectiveSMTPConfig(req.SMTPConfig)
	if cfg.User == "" || cfg.Pass == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "SMTP credentials are missing. Please configure SMTP_USER & SMTP_PASSWORD.",
		})
		return
	}

	// Sender admin info
	actorUID, _ := c.Get("actor_uid")
	adminUIDStr, _ := actorUID.(string)

	var adminEmailStr string
	if h.DB != nil && adminUIDStr != "" {
		_ = h.DB.QueryRow(`SELECT email FROM users WHERE uid = ? OR google_id = ?`, adminUIDStr, adminUIDStr).Scan(&adminEmailStr)
	}

	// Generate batch ID
	batchID := fmt.Sprintf("batch_%d_%s", time.Now().Unix(), generateRandomHex(4))

	recipientsList := make([]EmailRecipient, 0, len(recipientsMap))
	for _, r := range recipientsMap {
		recipientsList = append(recipientsList, r)
	}
	totalRecipients := len(recipientsList)

	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection unavailable"})
		return
	}

	isHTMLInt := 0
	if req.IsHTML {
		isHTMLInt = 1
	}

	// Insert into email_job_batches
	_, err := h.DB.Exec(`
		INSERT INTO email_job_batches 
		(batch_id, admin_uid, admin_email, subject, body, is_html, custom_from_name, reply_to, status, total_count, sent_count, failed_count, pending_count) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, 0, 0, ?)
	`, batchID, adminUIDStr, adminEmailStr, reqSubject, reqBody, isHTMLInt, strings.TrimSpace(req.CustomFromName), strings.TrimSpace(req.ReplyTo), totalRecipients, totalRecipients)
	if err != nil {
		log.Printf("❌ Failed to create email_job_batches: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create email job batch: " + err.Error()})
		return
	}

	// Batch insert into email_queue_items
	stmt, err := h.DB.Prepare(`
		INSERT INTO email_queue_items 
		(batch_id, recipient_email, recipient_name, recipient_user_id, recipient_register_no, recipient_dept, recipient_batch, status, attempts) 
		VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 0)
	`)
	if err != nil {
		log.Printf("❌ Failed to prepare queue items insert: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to queue recipient items: " + err.Error()})
		return
	}
	defer stmt.Close()

	for _, r := range recipientsList {
		_, _ = stmt.Exec(batchID, r.Email, r.Name, r.UserID, r.RegisterNo, r.Department, r.Batch)
	}

	// Also record in admin_sent_emails for backward compatibility
	recipientsJSONBytes, _ := json.Marshal(recipientsList)
	_, _ = h.DB.Exec(`
		INSERT INTO admin_sent_emails 
		(admin_uid, admin_email, subject, body, is_html, recipient_count, success_count, fail_count, recipients_json, error_details) 
		VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, 'Queued in Job Queue')
	`, adminUIDStr, adminEmailStr, reqSubject, reqBody, isHTMLInt, totalRecipients, string(recipientsJSONBytes))

	// Wake up sequential background worker immediately
	h.triggerWorker()

	c.JSON(http.StatusOK, gin.H{
		"success":  true,
		"batch_id": batchID,
		"total":    totalRecipients,
		"sent":     0,
		"pending":  totalRecipients,
		"failed":   0,
		"message":  fmt.Sprintf("Successfully queued %d emails for sequential delivery (Batch: %s)", totalRecipients, batchID),
	})
}

// GET /admin/mail/queues -> Lists all job batches with metrics and status
func (h *MailHandler) GetMailQueues(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit
	statusFilter := strings.TrimSpace(c.Query("status"))
	search := strings.TrimSpace(c.Query("search"))

	if h.DB == nil {
		c.JSON(http.StatusOK, gin.H{"success": true, "data": []interface{}{}, "total": 0})
		return
	}

	whereClauses := []string{"1=1"}
	args := []interface{}{}

	if statusFilter != "" && statusFilter != "all" {
		whereClauses = append(whereClauses, "b.status = ?")
		args = append(args, statusFilter)
	}
	if search != "" {
		whereClauses = append(whereClauses, "(b.subject LIKE ? OR b.batch_id LIKE ? OR b.admin_email LIKE ?)")
		pattern := "%" + search + "%"
		args = append(args, pattern, pattern, pattern)
	}

	whereSQL := strings.Join(whereClauses, " AND ")

	var totalBatches int
	countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM email_job_batches b WHERE %s`, whereSQL)
	_ = h.DB.QueryRow(countQuery, args...).Scan(&totalBatches)

	// Summary stats
	var totalJobs, activeJobs, totalSent, totalFailed, totalPending int
	_ = h.DB.QueryRow(`
		SELECT 
			COUNT(*),
			COALESCE(SUM(CASE WHEN status IN ('pending', 'processing') THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(sent_count), 0),
			COALESCE(SUM(failed_count), 0),
			COALESCE(SUM(pending_count), 0)
		FROM email_job_batches
	`).Scan(&totalJobs, &activeJobs, &totalSent, &totalFailed, &totalPending)

	query := fmt.Sprintf(`
		SELECT b.id, b.batch_id, COALESCE(b.admin_uid, ''), COALESCE(b.admin_email, ''),
		       b.subject, b.body, b.is_html, COALESCE(b.custom_from_name, ''), COALESCE(b.reply_to, ''),
		       b.status, b.total_count, b.sent_count, b.failed_count, b.pending_count,
		       DATE_FORMAT(b.created_at, '%%Y-%%m-%%dT%%H:%%i:%%sZ'),
		       DATE_FORMAT(b.updated_at, '%%Y-%%m-%%dT%%H:%%i:%%sZ')
		FROM email_job_batches b
		WHERE %s
		ORDER BY b.created_at DESC
		LIMIT ? OFFSET ?
	`, whereSQL)

	queryArgs := append(args, limit, offset)
	rows, err := h.DB.Query(query, queryArgs...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var batches []EmailJobBatch
	for rows.Next() {
		var item EmailJobBatch
		var isHTMLInt int
		if err := rows.Scan(
			&item.ID, &item.BatchID, &item.AdminUID, &item.AdminEmail,
			&item.Subject, &item.Body, &isHTMLInt, &item.CustomFromName, &item.ReplyTo,
			&item.Status, &item.TotalCount, &item.SentCount, &item.FailedCount, &item.PendingCount,
			&item.CreatedAt, &item.UpdatedAt,
		); err == nil {
			item.IsHTML = isHTMLInt == 1
			batches = append(batches, item)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    batches,
		"total":   totalBatches,
		"page":    page,
		"limit":   limit,
		"stats": gin.H{
			"total_jobs":    totalJobs,
			"active_jobs":   activeJobs,
			"total_sent":    totalSent,
			"total_failed":  totalFailed,
			"total_pending": totalPending,
		},
	})
}

// GET /admin/mail/queues/:batch_id -> Returns batch details and all recipient items
func (h *MailHandler) GetMailQueueDetails(c *gin.Context) {
	batchID := strings.TrimSpace(c.Param("batch_id"))
	if batchID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Batch ID is required"})
		return
	}

	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection unavailable"})
		return
	}

	var batch EmailJobBatch
	var isHTMLInt int
	err := h.DB.QueryRow(`
		SELECT id, batch_id, COALESCE(admin_uid, ''), COALESCE(admin_email, ''),
		       subject, body, is_html, COALESCE(custom_from_name, ''), COALESCE(reply_to, ''),
		       status, total_count, sent_count, failed_count, pending_count,
		       DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ'),
		       DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ')
		FROM email_job_batches
		WHERE batch_id = ?
	`, batchID).Scan(
		&batch.ID, &batch.BatchID, &batch.AdminUID, &batch.AdminEmail,
		&batch.Subject, &batch.Body, &isHTMLInt, &batch.CustomFromName, &batch.ReplyTo,
		&batch.Status, &batch.TotalCount, &batch.SentCount, &batch.FailedCount, &batch.PendingCount,
		&batch.CreatedAt, &batch.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Email job batch not found"})
		return
	}
	batch.IsHTML = isHTMLInt == 1

	// Query items
	rows, err := h.DB.Query(`
		SELECT id, batch_id, recipient_email, COALESCE(recipient_name, ''),
		       COALESCE(recipient_user_id, ''), COALESCE(recipient_register_no, ''),
		       COALESCE(recipient_dept, ''), COALESCE(recipient_batch, ''),
		       status, attempts, COALESCE(error_message, ''),
		       DATE_FORMAT(sent_at, '%Y-%m-%dT%H:%i:%sZ'),
		       DATE_FORMAT(created_at, '%Y-%m-%dT%H:%i:%sZ'),
		       DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ')
		FROM email_queue_items
		WHERE batch_id = ?
		ORDER BY id ASC
	`, batchID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	var items []EmailQueueItem
	for rows.Next() {
		var item EmailQueueItem
		var sentAtNull sql.NullString
		if err := rows.Scan(
			&item.ID, &item.BatchID, &item.RecipientEmail, &item.RecipientName,
			&item.RecipientUserID, &item.RecipientRegisterNo, &item.RecipientDept, &item.RecipientBatch,
			&item.Status, &item.Attempts, &item.ErrorMessage, &sentAtNull, &item.CreatedAt, &item.UpdatedAt,
		); err == nil {
			if sentAtNull.Valid {
				item.SentAt = &sentAtNull.String
			}
			items = append(items, item)
		}
	}

	batch.Items = items
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"batch":   batch,
		"items":   items,
	})
}

// POST /admin/mail/queues/:batch_id/resend-failed -> Re-queues all failed items in the batch
func (h *MailHandler) ResendFailedQueue(c *gin.Context) {
	batchID := strings.TrimSpace(c.Param("batch_id"))
	if batchID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Batch ID is required"})
		return
	}

	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection unavailable"})
		return
	}

	res, err := h.DB.Exec(`
		UPDATE email_queue_items 
		SET status = 'pending', error_message = '' 
		WHERE batch_id = ? AND status = 'failed'
	`, batchID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to re-queue failed emails: " + err.Error()})
		return
	}

	rowsAff, _ := res.RowsAffected()
	h.syncBatchStatus(batchID)
	h.triggerWorker()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"count":   rowsAff,
		"message": fmt.Sprintf("Re-queued %d failed email(s) for resending", rowsAff),
	})
}

// POST /admin/mail/queues/item/:id/retry -> Retries a single failed email item
func (h *MailHandler) RetryQueueItem(c *gin.Context) {
	idStr := strings.TrimSpace(c.Param("id"))
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid item ID"})
		return
	}

	if h.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Database connection unavailable"})
		return
	}

	var batchID string
	err = h.DB.QueryRow(`SELECT batch_id FROM email_queue_items WHERE id = ?`, id).Scan(&batchID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Queue item not found"})
		return
	}

	_, err = h.DB.Exec(`
		UPDATE email_queue_items 
		SET status = 'pending', error_message = '' 
		WHERE id = ? AND status = 'failed'
	`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to re-queue item: " + err.Error()})
		return
	}

	h.syncBatchStatus(batchID)
	h.triggerWorker()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Email re-queued for delivery",
	})
}

// DELETE /admin/mail/queues/:batch_id -> Deletes a batch and its associated queue items
func (h *MailHandler) DeleteMailQueue(c *gin.Context) {
	batchID := strings.TrimSpace(c.Param("batch_id"))
	if batchID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Batch ID is required"})
		return
	}

	if h.DB != nil {
		_, _ = h.DB.Exec(`DELETE FROM email_queue_items WHERE batch_id = ?`, batchID)
		_, _ = h.DB.Exec(`DELETE FROM email_job_batches WHERE batch_id = ?`, batchID)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Mail job queue deleted successfully",
	})
}

// GET /admin/mail/history
func (h *MailHandler) GetMailHistory(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	if h.DB == nil {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"data":    []interface{}{},
			"total":   0,
		})
		return
	}

	var total int
	_ = h.DB.QueryRow(`SELECT COUNT(*) FROM admin_sent_emails`).Scan(&total)

	rows, err := h.DB.Query(`
		SELECT id, COALESCE(admin_uid, ''), COALESCE(admin_email, ''), subject, body, is_html, 
		       recipient_count, success_count, fail_count, COALESCE(recipients_json, ''), COALESCE(error_details, ''),
		       DATE_FORMAT(sent_at, '%Y-%m-%dT%H:%i:%sZ')
		FROM admin_sent_emails
		ORDER BY sent_at DESC
		LIMIT ? OFFSET ?
	`, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	type MailLogItem struct {
		ID             int             `json:"id"`
		AdminUID       string          `json:"admin_uid"`
		AdminEmail     string          `json:"admin_email"`
		Subject        string          `json:"subject"`
		Body           string          `json:"body"`
		IsHTML         bool            `json:"is_html"`
		RecipientCount int             `json:"recipient_count"`
		SuccessCount   int             `json:"success_count"`
		FailCount      int             `json:"fail_count"`
		Recipients     json.RawMessage `json:"recipients"`
		ErrorDetails   string          `json:"error_details"`
		SentAt         string          `json:"sent_at"`
	}

	var logs []MailLogItem
	for rows.Next() {
		var item MailLogItem
		var isHTMLInt int
		var recipientsStr string
		if err := rows.Scan(
			&item.ID, &item.AdminUID, &item.AdminEmail, &item.Subject, &item.Body, &isHTMLInt,
			&item.RecipientCount, &item.SuccessCount, &item.FailCount, &recipientsStr, &item.ErrorDetails, &item.SentAt,
		); err == nil {
			item.IsHTML = isHTMLInt == 1
			if recipientsStr != "" {
				item.Recipients = json.RawMessage(recipientsStr)
			} else {
				item.Recipients = json.RawMessage("[]")
			}
			logs = append(logs, item)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    logs,
		"total":   total,
		"page":    page,
		"limit":   limit,
	})
}

// DELETE /admin/mail/history/:id
func (h *MailHandler) DeleteMailLog(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid log ID"})
		return
	}

	if h.DB != nil {
		_, _ = h.DB.Exec(`DELETE FROM admin_sent_emails WHERE id = ?`, id)
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Mail log deleted successfully"})
}


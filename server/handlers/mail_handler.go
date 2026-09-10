package handlers

import (
	"crypto/tls"
	"database/sql"
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
	DB *sql.DB
}

func NewMailHandler() *MailHandler {
	return &MailHandler{
		DB: config.DB,
	}
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
	Recipients       []EmailRecipient  `json:"recipients"`
	RawEmails        []string          `json:"raw_emails"`
	Subject          string            `json:"subject"`
	Body             string            `json:"body"`
	IsHTML           bool              `json:"is_html"`
	ReplyTo          string            `json:"reply_to"`
	CustomFromName   string            `json:"custom_from_name"`
	SMTPConfig       *CustomSMTPConfig `json:"smtp_config,omitempty"`
}

type TestMailRequest struct {
	TargetEmail string            `json:"target_email"`
	SMTPConfig  *CustomSMTPConfig `json:"smtp_config,omitempty"`
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

	d := gomail.NewDialer(cfg.Host, cfg.Port, cfg.User, cfg.Pass)
	if cfg.InsecureSkipVerify {
		d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
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

	if err := d.DialAndSend(m); err != nil {
		log.Printf("❌ SMTP Test failed: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": fmt.Sprintf("SMTP test failed: %v", err),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": fmt.Sprintf("SMTP test email successfully sent to %s via %s:%d", target, cfg.Host, cfg.Port),
	})
}

func extractCleanNameAndFirst(r EmailRecipient) (string, string) {
	fullName := strings.TrimSpace(r.Name)
	if fullName == "" || strings.EqualFold(fullName, "Student") || strings.EqualFold(fullName, "User") || strings.Contains(fullName, "@") {
		prefix := strings.Split(r.Email, "@")[0]
		parts := strings.Split(prefix, ".")
		if len(parts) >= 1 {
			rawName := parts[0]
			// E.g. "jaisondavidm" -> "Jaison David M" or "balakumarr" -> "Balakumar R"
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

	if db != nil && (fullName == "" || registerNo == "" || userID == "" || dept == "" || batch == "" || strings.EqualFold(fullName, "Student") || strings.EqualFold(fullName, "User")) {
		var tName, tUserID, tID, tDept, tBatch string
		_ = db.QueryRow(
			`SELECT COALESCE(name, ''), COALESCE(user_id, ''), COALESCE(id, ''), COALESCE(department, ''), COALESCE(batch, '') FROM tracker_users WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) LIMIT 1`,
			r.Email,
		).Scan(&tName, &tUserID, &tID, &tDept, &tBatch)

		if fullName == "" || strings.EqualFold(fullName, "Student") || strings.EqualFold(fullName, "User") {
			fullName = tName
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
	res = strings.ReplaceAll(res, "{{roll_no}}", registerNo) // backward compatibility fallback
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

// POST /admin/mail/send
func (h *MailHandler) SendAdminEmail(c *gin.Context) {
	var req SendMailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request payload: " + err.Error()})
		return
	}

	// Collect all recipients
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

	cfg := h.getEffectiveSMTPConfig(req.SMTPConfig)
	if req.CustomFromName != "" {
		cfg.FromName = strings.TrimSpace(req.CustomFromName)
	}

	if cfg.User == "" || cfg.Pass == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "SMTP credentials are missing. Please configure SMTP_USER & SMTP_PASSWORD.",
		})
		return
	}

	fromHeader := cfg.FromEmail
	if cfg.FromName != "" {
		fromHeader = fmt.Sprintf("%s <%s>", cfg.FromName, cfg.FromEmail)
	}

	// Get sender admin UID / email from token context
	actorUID, _ := c.Get("actor_uid")
	adminUIDStr, _ := actorUID.(string)

	var adminEmailStr string
	if h.DB != nil && adminUIDStr != "" {
		_ = h.DB.QueryRow(`SELECT email FROM users WHERE uid = ? OR google_id = ?`, adminUIDStr, adminUIDStr).Scan(&adminEmailStr)
	}

	// Prepare list for batch dispatch
	recipientsList := make([]EmailRecipient, 0, len(recipientsMap))
	for _, r := range recipientsMap {
		recipientsList = append(recipientsList, r)
	}

	totalRecipients := len(recipientsList)
	successCount := 0
	failCount := 0
	var errorDetails []string
	var failedRecipients []string
	var mu sync.Mutex

	// Worker pool for concurrency (max 5 parallel workers)
	workerCount := 5
	if totalRecipients < workerCount {
		workerCount = totalRecipients
	}

	jobs := make(chan EmailRecipient, totalRecipients)
	for _, r := range recipientsList {
		jobs <- r
	}
	close(jobs)

	var wg sync.WaitGroup
	for i := 0; i < workerCount; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()

			d := gomail.NewDialer(cfg.Host, cfg.Port, cfg.User, cfg.Pass)
			if cfg.InsecureSkipVerify {
				d.TLSConfig = &tls.Config{InsecureSkipVerify: true}
			}

			// Open reusable sender connection per worker
			s, err := d.Dial()
			if err != nil {
				mu.Lock()
				failCount++
				errorDetails = append(errorDetails, fmt.Sprintf("Dial error: %v", err))
				mu.Unlock()
				return
			}
			defer s.Close()

			for r := range jobs {
				personalizedSubject := replaceTemplateVariables(h.DB, reqSubject, r)
				personalizedBody := replaceTemplateVariables(h.DB, reqBody, r)

				m := gomail.NewMessage()
				m.SetHeader("From", fromHeader)
				m.SetHeader("To", r.Email)
				m.SetHeader("Subject", personalizedSubject)
				if req.ReplyTo != "" {
					m.SetHeader("Reply-To", req.ReplyTo)
				}

				if req.IsHTML {
					finalHTML := wrapInHTMLTemplate(personalizedSubject, personalizedBody)
					m.SetBody("text/html", finalHTML)
				} else {
					m.SetBody("text/plain", personalizedBody)
				}

				if err := gomail.Send(s, m); err != nil {
					log.Printf("❌ Failed to send email to %s: %v", r.Email, err)
					mu.Lock()
					failCount++
					failedRecipients = append(failedRecipients, r.Email)
					if len(errorDetails) < 20 {
						errorDetails = append(errorDetails, fmt.Sprintf("%s: %v", r.Email, err))
					}
					mu.Unlock()
				} else {
					mu.Lock()
					successCount++
					mu.Unlock()
				}

				// Small delay to prevent bursting
				time.Sleep(30 * time.Millisecond)
			}
		}()
	}

	wg.Wait()

	// Store log in admin_sent_emails
	recipientsJSONBytes, _ := json.Marshal(recipientsList)
	errorDetailsStr := strings.Join(errorDetails, "\n")

	if h.DB != nil {
		isHTMLInt := 0
		if req.IsHTML {
			isHTMLInt = 1
		}
		_, err := h.DB.Exec(`
			INSERT INTO admin_sent_emails 
			(admin_uid, admin_email, subject, body, is_html, recipient_count, success_count, fail_count, recipients_json, error_details) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`, adminUIDStr, adminEmailStr, reqSubject, reqBody, isHTMLInt, totalRecipients, successCount, failCount, string(recipientsJSONBytes), errorDetailsStr)
		if err != nil {
			log.Printf("⚠️ Failed to record admin_sent_emails log: %v", err)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":           failCount == 0 || successCount > 0,
		"total":             totalRecipients,
		"sent":              successCount,
		"failed":            failCount,
		"failed_recipients": failedRecipients,
		"error_details":     errorDetails,
		"message":           fmt.Sprintf("Sent %d / %d emails successfully (Failed: %d)", successCount, totalRecipients, failCount),
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

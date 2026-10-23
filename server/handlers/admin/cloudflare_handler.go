package admin

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"strings"
	"time"

	"server/config"

	"github.com/cloudflare/cloudflare-go/v7"
	"github.com/cloudflare/cloudflare-go/v7/option"
	"github.com/cloudflare/cloudflare-go/v7/pages"
	"github.com/gin-gonic/gin"
)

type CloudflareHandler struct {
	DB *sql.DB
}

func NewCloudflareHandler() *CloudflareHandler {
	h := &CloudflareHandler{DB: config.DB}
	h.ensureTableExists()
	return h
}

func (h *CloudflareHandler) ensureTableExists() {
	if h.DB == nil {
		return
	}
	query := `
	CREATE TABLE IF NOT EXISTS cloudflare_config (
		id INT AUTO_INCREMENT PRIMARY KEY,
		config_key VARCHAR(100) NOT NULL UNIQUE,
		api_token TEXT NOT NULL,
		account_id VARCHAR(100) NOT NULL,
		project_name VARCHAR(100) DEFAULT '',
		status VARCHAR(20) DEFAULT 'active',
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		updated_by VARCHAR(100)
	);`
	if _, err := h.DB.Exec(query); err != nil {
		log.Printf("⚠️ Failed to ensure cloudflare_config table exists: %v", err)
	}
}

func maskCloudflareToken(token string) string {
	token = strings.TrimSpace(token)
	if token == "" {
		return ""
	}
	if len(token) <= 8 {
		return "••••••••"
	}
	return token[:4] + "••••••••" + token[len(token)-4:]
}

func (h *CloudflareHandler) getEffectiveConfig() (apiToken, accountID, projectName, source, updatedAt string) {
	// 1. Try DB first
	if h.DB != nil {
		var tok, acc, proj, upd sql.NullString
		err := h.DB.QueryRow(`
			SELECT api_token, account_id, project_name, 
			       COALESCE(DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ'), '')
			FROM cloudflare_config 
			WHERE config_key = 'default' 
			LIMIT 1
		`).Scan(&tok, &acc, &proj, &upd)
		if err == nil && strings.TrimSpace(tok.String) != "" && strings.TrimSpace(acc.String) != "" {
			return strings.TrimSpace(tok.String), strings.TrimSpace(acc.String), strings.TrimSpace(proj.String), "db", upd.String
		}
	}

	// 2. Fallback to Environment Variables
	envToken := strings.TrimSpace(os.Getenv("CLOUDFLARE_API_TOKEN"))
	envAcc := strings.TrimSpace(os.Getenv("CLOUDFLARE_ACCOUNT_ID"))
	envProj := strings.TrimSpace(os.Getenv("CLOUDFLARE_PAGES_PROJECT_NAME"))

	if envToken != "" && envAcc != "" {
		return envToken, envAcc, envProj, "env", ""
	}

	return "", "", envProj, "none", ""
}

// GetCloudflareConfig returns masked token and configuration details
func (h *CloudflareHandler) GetCloudflareConfig(c *gin.Context) {
	h.ensureTableExists()

	apiToken, accountID, projectName, source, updatedAt := h.getEffectiveConfig()

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"configured":   apiToken != "" && accountID != "",
		"source":       source,
		"masked_token": maskCloudflareToken(apiToken),
		"account_id":   accountID,
		"project_name": projectName,
		"updated_at":   updatedAt,
	})
}

type UpdateCloudflareConfigRequest struct {
	APIToken    string `json:"api_token"`
	AccountID   string `json:"account_id"`
	ProjectName string `json:"project_name"`
}

// UpdateCloudflareConfig updates the Cloudflare API credentials stored in DB
func (h *CloudflareHandler) UpdateCloudflareConfig(c *gin.Context) {
	h.ensureTableExists()
	if h.DB == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"success": false, "message": "Database not initialized"})
		return
	}

	var req UpdateCloudflareConfigRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body"})
		return
	}

	req.AccountID = strings.TrimSpace(req.AccountID)
	req.ProjectName = strings.TrimSpace(req.ProjectName)
	rawToken := strings.TrimSpace(req.APIToken)

	// If token was masked or unchanged, keep existing token from DB or env
	if strings.Contains(rawToken, "••••") || rawToken == "" {
		existingToken, existingAcc, _, _, _ := h.getEffectiveConfig()
		if existingToken != "" {
			rawToken = existingToken
		}
		if req.AccountID == "" {
			req.AccountID = existingAcc
		}
	}

	if rawToken == "" || req.AccountID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "API Token and Account ID are required"})
		return
	}

	// Verify credentials against Cloudflare API before committing
	cfClient := cloudflare.NewClient(option.WithAPIToken(rawToken))
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	listParams := pages.ProjectListParams{
		AccountID: cloudflare.F(req.AccountID),
		PerPage:   cloudflare.F(int64(10)),
	}
	projectsResp, err := cfClient.Pages.Projects.List(ctx, listParams)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": fmt.Sprintf("Cloudflare API verification failed: %v", err),
		})
		return
	}

	// Auto-fill project name if not provided
	if req.ProjectName == "" && len(projectsResp.Result) > 0 {
		req.ProjectName = projectsResp.Result[0].Name
	}

	var updatedBy string
	if email, exists := c.Get("user_email"); exists {
		updatedBy = fmt.Sprintf("%v", email)
	}

	query := `
		INSERT INTO cloudflare_config (config_key, api_token, account_id, project_name, status, updated_by)
		VALUES ('default', ?, ?, ?, 'active', ?)
		ON DUPLICATE KEY UPDATE 
			api_token = VALUES(api_token),
			account_id = VALUES(account_id),
			project_name = VALUES(project_name),
			status = 'active',
			updated_by = VALUES(updated_by);
	`
	_, err = h.DB.Exec(query, rawToken, req.AccountID, req.ProjectName, updatedBy)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": fmt.Sprintf("Failed to save config: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":      true,
		"message":      "Cloudflare credentials validated and saved successfully!",
		"masked_token": maskCloudflareToken(rawToken),
		"account_id":   req.AccountID,
		"project_name": req.ProjectName,
		"projects":     extractProjectSummaries(projectsResp.Result),
	})
}

// TestCloudflareConnection tests credentials against Cloudflare API
func (h *CloudflareHandler) TestCloudflareConnection(c *gin.Context) {
	var req UpdateCloudflareConfigRequest
	_ = c.ShouldBindJSON(&req)

	apiToken := strings.TrimSpace(req.APIToken)
	accountID := strings.TrimSpace(req.AccountID)

	if strings.Contains(apiToken, "••••") || apiToken == "" || accountID == "" {
		existingToken, existingAcc, _, _, _ := h.getEffectiveConfig()
		if apiToken == "" || strings.Contains(apiToken, "••••") {
			apiToken = existingToken
		}
		if accountID == "" {
			accountID = existingAcc
		}
	}

	if apiToken == "" || accountID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "API Token and Account ID are required"})
		return
	}

	cfClient := cloudflare.NewClient(option.WithAPIToken(apiToken))
	ctx, cancel := context.WithTimeout(c.Request.Context(), 10*time.Second)
	defer cancel()

	listParams := pages.ProjectListParams{
		AccountID: cloudflare.F(accountID),
		PerPage:   cloudflare.F(int64(20)),
	}
	projectsResp, err := cfClient.Pages.Projects.List(ctx, listParams)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": false,
			"message": fmt.Sprintf("Cloudflare API Error: %v", err),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":        true,
		"message":        fmt.Sprintf("Connection successful! Found %d Pages project(s) in account.", len(projectsResp.Result)),
		"total_projects": len(projectsResp.Result),
		"projects":       extractProjectSummaries(projectsResp.Result),
	})
}

type ProjectSummaryItem struct {
	Name             string    `json:"name"`
	Subdomain        string    `json:"subdomain"`
	Domains          []string  `json:"domains"`
	ProductionBranch string    `json:"production_branch"`
	CreatedOn        time.Time `json:"created_on"`
}

func extractProjectSummaries(projects []pages.Project) []ProjectSummaryItem {
	var list []ProjectSummaryItem
	for _, p := range projects {
		list = append(list, ProjectSummaryItem{
			Name:             p.Name,
			Subdomain:        p.Subdomain,
			Domains:          p.Domains,
			ProductionBranch: p.ProductionBranch,
			CreatedOn:        p.CreatedOn,
		})
	}
	return list
}

// GetCloudflareUsage retrieves real-time usage, limits, and deployment stats for Cloudflare Pages
func (h *CloudflareHandler) GetCloudflareUsage(c *gin.Context) {
	apiToken, accountID, projectName, source, updatedAt := h.getEffectiveConfig()

	if apiToken == "" || accountID == "" {
		c.JSON(http.StatusOK, gin.H{
			"success":    true,
			"configured": false,
			"message":    "Cloudflare credentials not configured. Please add your Cloudflare API Token and Account ID in Admin Settings or server/.env",
		})
		return
	}

	cfClient := cloudflare.NewClient(option.WithAPIToken(apiToken))
	ctx, cancel := context.WithTimeout(c.Request.Context(), 15*time.Second)
	defer cancel()

	// 1. Fetch Projects List
	listParams := pages.ProjectListParams{
		AccountID: cloudflare.F(accountID),
		PerPage:   cloudflare.F(int64(25)),
	}
	projectsResp, err := cfClient.Pages.Projects.List(ctx, listParams)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success":    false,
			"configured": true,
			"message":    fmt.Sprintf("Failed to list Cloudflare Pages projects: %v", err),
		})
		return
	}

	allProjects := projectsResp.Result
	if len(allProjects) == 0 {
		c.JSON(http.StatusOK, gin.H{
			"success":        true,
			"configured":     true,
			"total_projects": 0,
			"message":        "No Cloudflare Pages projects found in this account.",
		})
		return
	}

	// Resolve target project
	targetProjectName := strings.TrimSpace(c.Query("project"))
	if targetProjectName == "" {
		targetProjectName = projectName
	}
	if targetProjectName == "" {
		// Pick first project or one containing 'bitcentral'
		targetProjectName = allProjects[0].Name
		for _, p := range allProjects {
			if strings.Contains(strings.ToLower(p.Name), "bitcentral") {
				targetProjectName = p.Name
				break
			}
		}
	}

	// 2. Fetch Target Project Details
	project, err := cfClient.Pages.Projects.Get(ctx, targetProjectName, pages.ProjectGetParams{
		AccountID: cloudflare.F(accountID),
	})
	if err != nil {
		// Fallback to project in list if Get fails
		for _, p := range allProjects {
			if p.Name == targetProjectName {
				project = &p
				err = nil
				break
			}
		}
	}

	if err != nil || project == nil {
		c.JSON(http.StatusOK, gin.H{
			"success":    false,
			"configured": true,
			"message":    fmt.Sprintf("Failed to load project '%s': %v", targetProjectName, err),
		})
		return
	}

	// 3. Fetch Recent Deployments (up to 50 to compute monthly usage accurately)
	deploymentsResp, err := cfClient.Pages.Projects.Deployments.List(ctx, targetProjectName, pages.ProjectDeploymentListParams{
		AccountID: cloudflare.F(accountID),
		PerPage:   cloudflare.F(int64(50)),
	})

	var deploymentsList []pages.Deployment
	if err == nil && deploymentsResp != nil {
		deploymentsList = deploymentsResp.Result
	}

	// 4. Calculate Usage & Limits
	nowUTC := time.Now().UTC()
	currentYear := nowUTC.Year()
	currentMonth := nowUTC.Month()

	deploymentsThisMonth := 0
	successfulDeployments := 0
	failedDeployments := 0

	type DeploymentView struct {
		ID            string    `json:"id"`
		ShortID       string    `json:"short_id"`
		Environment   string    `json:"environment"`
		Status        string    `json:"status"`
		URL           string    `json:"url"`
		CreatedOn     time.Time `json:"created_on"`
		CommitHash    string    `json:"commit_hash"`
		CommitMessage string    `json:"commit_message"`
		Branch        string    `json:"branch"`
		CommitDirty   bool      `json:"commit_dirty"`
		DurationSecs  int       `json:"duration_secs"`
	}

	var recentDeployments []DeploymentView

	for idx, d := range deploymentsList {
		// Count monthly
		if d.CreatedOn.Year() == currentYear && d.CreatedOn.Month() == currentMonth {
			deploymentsThisMonth++
		}

		statusStr := string(d.LatestStage.Status)
		if statusStr == "" {
			statusStr = string(d.LatestStage.Name)
		}
		if statusStr == "success" {
			successfulDeployments++
		} else if statusStr == "failure" || statusStr == "failed" {
			failedDeployments++
		}

		// Keep top 15 for recent history
		if idx < 15 {
			commitHash := d.DeploymentTrigger.Metadata.CommitHash
			if len(commitHash) > 7 {
				commitHash = commitHash[:7]
			}
			commitMsg := d.DeploymentTrigger.Metadata.CommitMessage
			branch := d.DeploymentTrigger.Metadata.Branch
			commitDirty := d.DeploymentTrigger.Metadata.CommitDirty

			// Calculate build duration if stages exist
			duration := 0
			if !d.ModifiedOn.IsZero() && !d.CreatedOn.IsZero() {
				diff := d.ModifiedOn.Sub(d.CreatedOn)
				if diff > 0 && diff < 2*time.Hour {
					duration = int(diff.Seconds())
				}
			}

			recentDeployments = append(recentDeployments, DeploymentView{
				ID:            d.ID,
				ShortID:       d.ShortID,
				Environment:   string(d.Environment),
				Status:        statusStr,
				URL:           d.URL,
				CreatedOn:     d.CreatedOn,
				CommitHash:    commitHash,
				CommitMessage: commitMsg,
				Branch:        branch,
				CommitDirty:   commitDirty,
				DurationSecs:  duration,
			})
		}
	}

	// Free tier limit is 500 deployments per month
	const monthlyDeploymentLimit = 500
	const maxProjectsLimit = 100
	const maxCustomDomainsLimit = 100
	const concurrentBuildsLimit = 1
	const buildTimeoutMinutes = 20

	usagePercent := float64(deploymentsThisMonth) / float64(monthlyDeploymentLimit) * 100
	if usagePercent > 100 {
		usagePercent = 100
	}

	// Canonical (active production) deployment info
	var canonicalDeployment *DeploymentView
	if project.CanonicalDeployment.ID != "" {
		cDep := project.CanonicalDeployment
		cStatus := string(cDep.LatestStage.Status)
		if cStatus == "" {
			cStatus = string(cDep.LatestStage.Name)
		}
		cHash := cDep.DeploymentTrigger.Metadata.CommitHash
		if len(cHash) > 7 {
			cHash = cHash[:7]
		}
		canonicalDeployment = &DeploymentView{
			ID:            cDep.ID,
			ShortID:       cDep.ShortID,
			Environment:   string(cDep.Environment),
			Status:        cStatus,
			URL:           cDep.URL,
			CreatedOn:     cDep.CreatedOn,
			CommitHash:    cHash,
			CommitMessage: cDep.DeploymentTrigger.Metadata.CommitMessage,
			Branch:        cDep.DeploymentTrigger.Metadata.Branch,
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"configured": true,
		"source":     source,
		"updated_at": updatedAt,
		"account": gin.H{
			"account_id":     accountID,
			"masked_token":   maskCloudflareToken(apiToken),
			"total_projects": len(allProjects),
			"max_projects":   maxProjectsLimit,
		},
		"project": gin.H{
			"id":                 project.ID,
			"name":               project.Name,
			"subdomain":          project.Subdomain,
			"domains":            project.Domains,
			"production_branch":  project.ProductionBranch,
			"framework":          project.Framework,
			"framework_version":  project.FrameworkVersion,
			"uses_functions":     project.UsesFunctions,
			"created_on":         project.CreatedOn,
			"canonical_deploy":   canonicalDeployment,
		},
		"usage": gin.H{
			"deployments_this_month":   deploymentsThisMonth,
			"monthly_deployment_limit": monthlyDeploymentLimit,
			"usage_percent":            math.Round(usagePercent*10) / 10,
			"remaining_deployments":    maxInt(0, monthlyDeploymentLimit-deploymentsThisMonth),
			"total_recorded":           len(deploymentsList),
			"successful_deployments":   successfulDeployments,
			"failed_deployments":       failedDeployments,
			"billing_period":           fmt.Sprintf("%s %d", currentMonth.String(), currentYear),
		},
		"limits": gin.H{
			"plan_tier":                "Cloudflare Pages Free",
			"monthly_deployments":      monthlyDeploymentLimit,
			"concurrent_builds":        concurrentBuildsLimit,
			"build_timeout_minutes":    buildTimeoutMinutes,
			"max_projects":             maxProjectsLimit,
			"max_custom_domains":       maxCustomDomainsLimit,
			"max_asset_size_mb":        25,
			"max_files_per_deploy":     20000,
			"bandwidth":                "Unlimited",
			"requests":                 "Unlimited",
			"functions_requests_daily": "100,000 / day",
		},
		"available_projects": extractProjectSummaries(allProjects),
		"recent_deployments": recentDeployments,
	})
}

func maxInt(a, b int) int {
	if a > b {
		return a
	}
	return b
}

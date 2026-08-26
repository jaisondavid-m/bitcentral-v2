package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
	"unicode"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/option"
	"google.golang.org/api/sheets/v4"

	"server/models"
)

var defaultTabs = []string{
	"INDEX", "Details", "MTRS", "MECH", "IT", "ISE", "FD",
	"FT", "EIE", "ECE", "EEE", "CT", "CSE", "CSD", "CSBS",
	"CIVIL", "BT", "BIOMEDICAL", "AI&DS", "AGRI", "AIML",
}

type SheetHandler struct {
	oauthConfig  *oauth2.Config
	sheetsSvc    *sheets.Service
	oauthToken   *oauth2.Token
	tabs         []string
	mu           sync.RWMutex
	rangeCache   map[string]sheetRangeCacheEntry
	rangeCacheMu sync.RWMutex
}

type sheetRangeCacheEntry struct {
	values    [][]interface{}
	expiresAt time.Time
}

const sheetRangeCacheTTL = 2 * time.Minute

func NewSheetHandler() *SheetHandler {
	return &SheetHandler{
		tabs:       defaultTabs,
		rangeCache: make(map[string]sheetRangeCacheEntry),
	}
}

func (h *SheetHandler) InitOAuth() {
	h.oauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("CLIENT_ID"),
		ClientSecret: os.Getenv("CLIENT_SECRET"),
		RedirectURL:  os.Getenv("REDIRECT_URL"),
		Scopes:       []string{sheets.SpreadsheetsReadonlyScope},
		Endpoint:     google.Endpoint,
	}
}

func (h *SheetHandler) LoadSavedToken() bool {
	f, err := os.Open("token.json")
	if err != nil {
		return false
	}
	defer f.Close()

	tok := &oauth2.Token{}
	if err := json.NewDecoder(f).Decode(tok); err != nil {
		return false
	}

	h.oauthToken = tok
	if err := h.createSheetsService(); err != nil {
		return false
	}
	return true
}

func (h *SheetHandler) saveToken(token *oauth2.Token) {
	f, err := os.Create("token.json")
	if err != nil {
		return
	}
	defer f.Close()
	_ = json.NewEncoder(f).Encode(token)
}

func (h *SheetHandler) createSheetsService() error {
	if h.oauthConfig == nil || h.oauthToken == nil {
		return fmt.Errorf("oauth config or token not initialized")
	}

	client := h.oauthConfig.Client(context.Background(), h.oauthToken)
	srv, err := sheets.NewService(context.Background(), option.WithHTTPClient(client))
	if err != nil {
		return err
	}

	h.mu.Lock()
	h.sheetsSvc = srv
	h.mu.Unlock()

	h.rangeCacheMu.Lock()
	h.rangeCache = make(map[string]sheetRangeCacheEntry)
	h.rangeCacheMu.Unlock()
	return nil
}

func (h *SheetHandler) getSheetsService() *sheets.Service {
	h.mu.RLock()
	defer h.mu.RUnlock()
	return h.sheetsSvc
}

func (h *SheetHandler) HandleLogin(c *gin.Context) {
	url := h.oauthConfig.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *SheetHandler) HandleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing authorization code"})
		return
	}

	token, err := h.oauthConfig.Exchange(context.Background(), code)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Token exchange failed: %v", err)})
		return
	}

	h.oauthToken = token
	h.saveToken(token)
	if err := h.createSheetsService(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to initialize Sheets service: %v", err)})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful! You can now use the API.",
	})
}

func (h *SheetHandler) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		if h.getSheetsService() == nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":    "Not authenticated",
				"login_at": h.getLoginURL(c),
			})
			c.Abort()
			return
		}
		c.Next()
	}
}

func (h *SheetHandler) getLoginURL(c *gin.Context) string {
	scheme := "http"
	if c.Request.TLS != nil {
		scheme = "https"
	}
	host := c.Request.Host
	if host == "" {
		host = os.Getenv("BACKEND_HOST")
		if host == "" {
			host = "localhost:8080"
		}
	}
	return fmt.Sprintf("%s://%s/auth/login", scheme, host)
}

func safeGet(row []interface{}, index int) string {
	if index < len(row) {
		return strings.TrimSpace(fmt.Sprintf("%v", row[index]))
	}
	return ""
}

func deepCopySheetValues(values [][]interface{}) [][]interface{} {
	out := make([][]interface{}, len(values))
	for i, row := range values {
		rowCopy := make([]interface{}, len(row))
		copy(rowCopy, row)
		out[i] = rowCopy
	}
	return out
}

func (h *SheetHandler) getCachedRange(cacheKey string) ([][]interface{}, bool) {
	h.rangeCacheMu.RLock()
	entry, ok := h.rangeCache[cacheKey]
	h.rangeCacheMu.RUnlock()
	if !ok || time.Now().After(entry.expiresAt) {
		if ok {
			h.rangeCacheMu.Lock()
			delete(h.rangeCache, cacheKey)
			h.rangeCacheMu.Unlock()
		}
		return nil, false
	}
	return deepCopySheetValues(entry.values), true
}

func (h *SheetHandler) setCachedRange(cacheKey string, values [][]interface{}, ttl time.Duration) {
	h.rangeCacheMu.Lock()
	h.rangeCache[cacheKey] = sheetRangeCacheEntry{
		values:    deepCopySheetValues(values),
		expiresAt: time.Now().Add(ttl),
	}
	h.rangeCacheMu.Unlock()
}

func (h *SheetHandler) fetchRangeValuesCached(spreadsheetID, fullRange string, ttl time.Duration) ([][]interface{}, error) {
	cacheKey := spreadsheetID + "::" + fullRange
	if cached, ok := h.getCachedRange(cacheKey); ok {
		return cached, nil
	}

	svc := h.getSheetsService()
	if svc == nil {
		return nil, fmt.Errorf("sheets service not initialized")
	}

	resp, err := svc.Spreadsheets.Values.Get(spreadsheetID, fullRange).Do()
	if err != nil {
		return nil, err
	}

	if resp.Values == nil {
		resp.Values = [][]interface{}{}
	}

	h.setCachedRange(cacheKey, resp.Values, ttl)
	return deepCopySheetValues(resp.Values), nil
}

func (h *SheetHandler) fetchSheetRows(tab, rangeStr string) ([]models.Student, error) {
	spreadsheetID := os.Getenv("SPREADSHEET_ID")
	fullRange := fmt.Sprintf("%s!%s", tab, rangeStr)

	values, err := h.fetchRangeValuesCached(spreadsheetID, fullRange, sheetRangeCacheTTL)
	if err != nil {
		return nil, err
	}

	var students []models.Student
	for _, row := range values {
		slNo := safeGet(row, 0)
		if _, err := strconv.Atoi(slNo); err != nil {
			continue
		}
		students = append(students, models.Student{
			SlNo:             slNo,
			Year:             safeGet(row, 1),
			RollNo:           safeGet(row, 2),
			StudentName:      safeGet(row, 3),
			CourseCode:       safeGet(row, 4),
			Department:       safeGet(row, 5),
			MentorName:       safeGet(row, 6),
			CumulativePoints: safeGet(row, 7),
			RedeemedPoints:   safeGet(row, 8),
			BalancePoints:    safeGet(row, 9),
			Tab:              tab,
		})
	}
	return students, nil
}

func (h *SheetHandler) fetchAllTabs() ([]models.Student, []string) {
	var (
		mu     sync.Mutex
		wg     sync.WaitGroup
		all    []models.Student
		errors []string
	)

	sem := make(chan struct{}, 5)

	for _, tab := range h.tabs {
		wg.Add(1)
		go func(t string) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()

			var rows []models.Student
			var err error

			for attempt := 0; attempt < 3; attempt++ {
				rows, err = h.fetchSheetRows(t, "A1:J9999")
				if err == nil {
					break
				}
				if attempt < 2 {
					time.Sleep(time.Duration(attempt+1) * 300 * time.Millisecond)
				}
			}

			mu.Lock()
			if err != nil {
				errors = append(errors, fmt.Sprintf("%s: %v", t, err))
			} else {
				all = append(all, rows...)
			}
			mu.Unlock()
		}(tab)
	}

	wg.Wait()
	return all, errors
}

func (h *SheetHandler) UniversalSearch(c *gin.Context) {
	query := strings.TrimSpace(c.Query("q"))
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Query param 'q' is required",
			"example": "/search?q=Abishek  or  /search?q=7376231CS106",
		})
		return
	}

	searchableCount := 0
	for _, character := range query {
		if unicode.IsLetter(character) || unicode.IsDigit(character) {
			searchableCount++
		}
	}

	if searchableCount < 3 {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Query param 'q' must contain at least 3 letters or digits",
			"example": "/search?q=Abi  or  /search?q=737",
		})
		return
	}

	queryLower := strings.ToLower(strings.TrimSpace(query))
	queryUpper := strings.ToUpper(strings.TrimSpace(query))

	all, errs := h.fetchAllTabs()

	var results []models.Student
	for _, s := range all {
		rollNormalized := strings.ToUpper(strings.ReplaceAll(s.RollNo, " ", ""))
		queryNormalized := strings.ReplaceAll(queryUpper, " ", "")

		rollMatch := rollNormalized == queryNormalized || strings.Contains(rollNormalized, queryNormalized)
		nameMatch := strings.Contains(strings.ToLower(s.StudentName), queryLower)

		if rollMatch || nameMatch {
			results = append(results, s)
		}
	}

	if len(results) == 0 {
		if len(errs) > 0 {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "Unable to access Google Sheet",
				"details": errs,
			})
			return
		}
		c.JSON(http.StatusNotFound, gin.H{
			"query":   query,
			"message": "No student found with that name or roll number",
		})
		return
	}

	resp := gin.H{
		"query": query,
		"total": len(results),
		"data":  results,
	}
	if len(errs) > 0 {
		resp["warnings"] = errs
		resp["data_complete"] = false
	} else {
		resp["data_complete"] = true
	}

	c.JSON(http.StatusOK, resp)
}

func (h *SheetHandler) GetOverallAverageFromSheet(c *gin.Context) {
	svc := h.getSheetsService()
	if svc == nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sheets service not initialized"})
		return
	}

	spreadsheetID := os.Getenv("SPREADSHEET_ID")

	yearData := []struct {
		key  string
		rang string
	}{
		{"year_1", "Details!C11"},
		{"year_2", "Details!D11"},
		{"year_3", "Details!F11"},
		{"year_4", "Details!G11"},
	}

	yearAverages := gin.H{}
	var total float64
	var count int
	var firstErr error

	for _, yd := range yearData {
		values, err := h.fetchRangeValuesCached(spreadsheetID, yd.rang, sheetRangeCacheTTL)
		val := "0"
		if err == nil && len(values) > 0 && len(values[0]) > 0 {
			val = fmt.Sprintf("%v", values[0][0])
		} else if err != nil {
			if firstErr == nil {
				firstErr = err
			}
		}
		yearAverages[yd.key] = val
		if f, err := strconv.ParseFloat(val, 64); err == nil && f > 0 {
			total += f
			count++
		}
	}

	if firstErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "Unable to access Google Sheet",
			"detail": firstErr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"averages": yearAverages,
	})
}

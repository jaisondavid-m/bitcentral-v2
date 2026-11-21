package student

import (
	"bufio"
	"bytes"
	"crypto/rand"
	"encoding/csv"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"server/config"

	"github.com/gin-gonic/gin"
)

type InternalMarksCacheEntry struct {
	RollNo    string    `json:"roll_no"`
	RawData   string    `json:"raw_data"`
	CachedAt  time.Time `json:"cached_at"`
	ExpiresAt time.Time `json:"expires_at"`
}

type negativeCacheEntry struct {
	errMsg    string
	expiresAt time.Time
}

type flightCall struct {
	wg  sync.WaitGroup
	val string
	err error
}

type GradioJoinPayload struct {
	Data        []interface{} `json:"data"`
	EventData   interface{}   `json:"event_data"`
	FnIndex     int           `json:"fn_index"`
	TriggerID   interface{}   `json:"trigger_id"`
	SessionHash string        `json:"session_hash"`
}

type GradioSSEEvent struct {
	Msg    string `json:"msg"`
	Output struct {
		Data []interface{} `json:"data"`
	} `json:"output"`
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

// Structured models for Google Sheet Internal Marks
type InternalSubjectMark struct {
	Code     string  `json:"code"`
	Category string  `json:"category"`
	Mark     float64 `json:"mark"`
	MaxMarks float64 `json:"max_marks"`
}

type InternalMarksOverall struct {
	TotalSubjects      int     `json:"total_subjects"`
	TotalInternalMarks float64 `json:"total_internal_marks"`
	MaxMarks           float64 `json:"max_marks"`
	Percentage         float64 `json:"percentage"`
}

type StudentInternalMarks struct {
	RollNo      string                `json:"roll_no"`
	StudentName string                `json:"student_name"`
	Degree      string                `json:"degree"`
	Year        string                `json:"year"`
	Department  string                `json:"department"`
	Subjects    []InternalSubjectMark `json:"subjects"`
	Overall     InternalMarksOverall  `json:"overall"`
	RawData     string                `json:"raw_data"`
}

const (
	InternalMarksCacheDuration         = 48 * time.Hour
	InternalMarksIncompleteDuration    = 12 * time.Hour
	InternalMarksMinRefreshInterval    = 5 * time.Minute
	InternalMarksNegativeCacheDuration = 5 * time.Minute
	InternalMarksSheetCacheDuration    = 15 * time.Minute
	GradioSpaceHost                    = "https://praneshjs-rewardpointssite.hf.space"
)

var istLocation = time.FixedZone("IST", 5*3600+30*60)

func formatIST(t time.Time) string {
	return t.In(istLocation).Format(time.RFC3339)
}

type InternalMarksHandler struct {
	sheetHandler  *SheetHandler
	mu            sync.RWMutex
	memoryCache   map[string]InternalMarksCacheEntry
	negativeMu    sync.RWMutex
	negativeCache map[string]negativeCacheEntry
	flightMu      sync.Mutex
	flightCalls   map[string]*flightCall

	// In-memory cache for full sheet index
	sheetMu       sync.RWMutex
	sheetCache    map[string]StudentInternalMarks
	sheetExpiry   time.Time
	sheetBuilding sync.Mutex
}

func NewInternalMarksHandler(sheetHandler *SheetHandler) *InternalMarksHandler {
	h := &InternalMarksHandler{
		sheetHandler:  sheetHandler,
		memoryCache:   make(map[string]InternalMarksCacheEntry),
		negativeCache: make(map[string]negativeCacheEntry),
		flightCalls:   make(map[string]*flightCall),
		sheetCache:    make(map[string]StudentInternalMarks),
	}
	h.initDBTable()
	return h
}

func (h *InternalMarksHandler) initDBTable() {
	if config.DB == nil {
		return
	}
	query := `
	CREATE TABLE IF NOT EXISTS internal_marks_cache (
		roll_no VARCHAR(64) PRIMARY KEY,
		raw_data MEDIUMTEXT NOT NULL,
		cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		expires_at TIMESTAMP NULL,
		INDEX idx_expires_at (expires_at)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	`
	if _, err := config.DB.Exec(query); err != nil {
		log.Printf("⚠️ Note: internal_marks_cache table init: %v", err)
	}
}

func (h *InternalMarksHandler) getFromMemory(rollNo string) (InternalMarksCacheEntry, bool) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	entry, ok := h.memoryCache[rollNo]
	if !ok {
		return InternalMarksCacheEntry{}, false
	}
	if time.Now().After(entry.ExpiresAt) {
		return InternalMarksCacheEntry{}, false
	}
	return entry, true
}

func (h *InternalMarksHandler) saveToMemory(entry InternalMarksCacheEntry) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.memoryCache[entry.RollNo] = entry
}

func (h *InternalMarksHandler) getNegativeCache(rollNo string) (string, bool) {
	h.negativeMu.RLock()
	defer h.negativeMu.RUnlock()

	entry, ok := h.negativeCache[rollNo]
	if !ok {
		return "", false
	}
	if time.Now().After(entry.expiresAt) {
		return "", false
	}
	return entry.errMsg, true
}

func (h *InternalMarksHandler) setNegativeCache(rollNo string, errMsg string) {
	h.negativeMu.Lock()
	defer h.negativeMu.Unlock()
	h.negativeCache[rollNo] = negativeCacheEntry{
		errMsg:    errMsg,
		expiresAt: time.Now().Add(InternalMarksNegativeCacheDuration),
	}
}

func (h *InternalMarksHandler) getFromDB(rollNo string) (InternalMarksCacheEntry, bool) {
	if config.DB == nil {
		return InternalMarksCacheEntry{}, false
	}

	query := `SELECT roll_no, raw_data, cached_at, expires_at FROM internal_marks_cache WHERE roll_no = ? AND expires_at > NOW() LIMIT 1`
	var entry InternalMarksCacheEntry
	err := config.DB.QueryRow(query, rollNo).Scan(&entry.RollNo, &entry.RawData, &entry.CachedAt, &entry.ExpiresAt)
	if err != nil {
		return InternalMarksCacheEntry{}, false
	}
	h.saveToMemory(entry)
	return entry, true
}

func (h *InternalMarksHandler) saveToDB(entry InternalMarksCacheEntry) {
	if config.DB == nil {
		return
	}

	query := `
	INSERT INTO internal_marks_cache (roll_no, raw_data, cached_at, expires_at)
	VALUES (?, ?, ?, ?)
	ON DUPLICATE KEY UPDATE
		raw_data = VALUES(raw_data),
		cached_at = VALUES(cached_at),
		expires_at = VALUES(expires_at)
	`
	if _, err := config.DB.Exec(query, entry.RollNo, entry.RawData, entry.CachedAt, entry.ExpiresAt); err != nil {
		log.Printf("⚠️ Failed to persist internal marks cache for %s in DB: %v", entry.RollNo, err)
	}
}

// extractSpreadsheetID extracts the 44-character spreadsheet ID from URLs or raw IDs
func extractSpreadsheetID(val string) string {
	val = strings.TrimSpace(val)
	val = strings.Trim(val, `"'`)
	if val == "" {
		return ""
	}

	if strings.Contains(val, "/d/e/") {
		// Published URL, return as-is for HTTP fetcher
		return val
	}

	if strings.Contains(val, "/d/") {
		parts := strings.Split(val, "/d/")
		if len(parts) > 1 {
			idPart := parts[1]
			if idx := strings.Index(idPart, "/"); idx != -1 {
				idPart = idPart[:idx]
			}
			if idx := strings.Index(idPart, "?"); idx != -1 {
				idPart = idPart[:idx]
			}
			if idx := strings.Index(idPart, "#"); idx != -1 {
				idPart = idPart[:idx]
			}
			return strings.TrimSpace(idPart)
		}
	}

	if u, err := url.Parse(val); err == nil && u.Query().Get("key") != "" {
		return u.Query().Get("key")
	}

	return val
}

type subjectColPair struct {
	CodeCol  int
	MarkCol  int
	Category string
	MaxMarks float64
}

// buildInternalMarksIndex fetches the Google Sheet (via Sheets API or CSV) and parses all students
func (h *InternalMarksHandler) buildInternalMarksIndex() (map[string]StudentInternalMarks, error) {
	sheetConfig := strings.TrimSpace(os.Getenv("INTERNAL_MARKS_SHEET"))
	if sheetConfig == "" {
		sheetConfig = strings.TrimSpace(os.Getenv("INTERNAL_MARKS_SHEET_ID"))
	}
	if sheetConfig == "" {
		sheetConfig = strings.TrimSpace(os.Getenv("Internal_Marks_sheet"))
	}
	if sheetConfig == "" {
		return nil, fmt.Errorf("INTERNAL_MARKS_SHEET is not set in environment or .env file")
	}

	var rows [][]string

	// Case 1: If it's a URL (http/https), try fetching as CSV
	if strings.HasPrefix(sheetConfig, "http://") || strings.HasPrefix(sheetConfig, "https://") {
		csvURL := sheetConfig
		if strings.Contains(sheetConfig, "/pubhtml") {
			csvURL = strings.Replace(sheetConfig, "/pubhtml", "/pub?output=csv", 1)
		} else if strings.Contains(sheetConfig, "/pub") && !strings.Contains(sheetConfig, "output=csv") {
			if strings.Contains(sheetConfig, "?") {
				csvURL = sheetConfig + "&output=csv"
			} else {
				csvURL = sheetConfig + "?output=csv"
			}
		}

		client := &http.Client{Timeout: 30 * time.Second}
		req, err := http.NewRequest("GET", csvURL, nil)
		if err == nil {
			req.Header.Set("User-Agent", "Mozilla/5.0")
			resp, err := client.Do(req)
			if err == nil && resp.StatusCode == http.StatusOK {
				defer resp.Body.Close()
				r := csv.NewReader(resp.Body)
				r.LazyQuotes = true
				r.FieldsPerRecord = -1
				if csvRows, err := r.ReadAll(); err == nil && len(csvRows) > 2 {
					rows = csvRows
				}
			}
		}
	}

	// Case 2: Use Google Sheets API via SheetHandler (view-only Google account)
	if len(rows) == 0 && h.sheetHandler != nil {
		spreadsheetID := extractSpreadsheetID(sheetConfig)
		if strings.HasPrefix(spreadsheetID, "http") {
			return nil, fmt.Errorf("could not access published URL and no standard Google Sheet ID provided: %s", sheetConfig)
		}

		svc := h.sheetHandler.GetSheetsService()
		if svc == nil {
			h.sheetHandler.LoadSavedToken()
			svc = h.sheetHandler.GetSheetsService()
		}
		if svc == nil {
			return nil, fmt.Errorf("Google Sheets service not initialized. Check OAuth token/credentials")
		}

		// Look for target tab by gid or name
		meta, err := svc.Spreadsheets.Get(spreadsheetID).Do()
		var tabName string
		targetGid := int64(1533805453) // default gid from user's URL if present

		if err == nil && meta != nil && len(meta.Sheets) > 0 {
			for _, s := range meta.Sheets {
				if s.Properties != nil && s.Properties.SheetId == targetGid {
					tabName = s.Properties.Title
					break
				}
			}
			if tabName == "" {
				tabName = meta.Sheets[0].Properties.Title
			}
		}
		if tabName == "" {
			tabName = "Sheet1"
		}

		readRange := fmt.Sprintf("'%s'!A1:AD", tabName)
		vr, err := svc.Spreadsheets.Values.Get(spreadsheetID, readRange).Do()
		if err != nil {
			vr, err = svc.Spreadsheets.Values.Get(spreadsheetID, "A1:AD").Do()
		}
		if err != nil {
			return nil, fmt.Errorf("failed to fetch sheet values for %s: %w", spreadsheetID, err)
		}

		for _, row := range vr.Values {
			var rStr []string
			for _, cell := range row {
				rStr = append(rStr, fmt.Sprintf("%v", cell))
			}
			rows = append(rows, rStr)
		}
	}

	if len(rows) < 3 {
		return nil, fmt.Errorf("insufficient data rows fetched from sheet: got %d rows", len(rows))
	}

	// Detect Column Headers and Subject Pairs dynamically
	rollNoCol := 1
	nameCol := 2
	degreeCol := 3
	yearCol := 4
	deptCol := 5

	headerRowIdx := 1
	for rIdx := 0; rIdx < int(math.Min(float64(len(rows)), 4)); rIdx++ {
		row := rows[rIdx]
		for cIdx, cell := range row {
			cLower := strings.ToLower(strings.TrimSpace(cell))
			if strings.Contains(cLower, "roll") && strings.Contains(cLower, "no") {
				rollNoCol = cIdx
				headerRowIdx = rIdx
			} else if strings.Contains(cLower, "student") && strings.Contains(cLower, "name") {
				nameCol = cIdx
			} else if strings.Contains(cLower, "department") {
				deptCol = cIdx
			} else if cLower == "year" {
				yearCol = cIdx
			} else if strings.Contains(cLower, "course") && strings.Contains(cLower, "code") && cIdx < 6 {
				degreeCol = cIdx
			}
		}
	}

	// Detect Subject Pairs
	var pairs []subjectColPair
	maxCols := 0
	for _, r := range rows[:int(math.Min(float64(len(rows)), 5))] {
		if len(r) > maxCols {
			maxCols = len(r)
		}
	}

	for c := 6; c < maxCols-1; c++ {
		var headerText string
		for rIdx := 0; rIdx <= int(math.Min(float64(len(rows)-1), 3)); rIdx++ {
			if c < len(rows[rIdx]) {
				headerText += " " + rows[rIdx][c]
			}
		}

		headerUpper := strings.ToUpper(headerText)
		isSubjectCodeCol := strings.Contains(headerUpper, "SUBJECT CODE") ||
			strings.Contains(headerUpper, "COURSE CODE") ||
			strings.Contains(headerUpper, "THEORY SUBJECT") ||
			strings.Contains(headerUpper, "LAB. SUBJECT") ||
			strings.Contains(headerUpper, "LAB SUBJECT") ||
			strings.Contains(headerUpper, "HONOR") ||
			strings.Contains(headerUpper, "MINOR")

		nextHeader := ""
		for rIdx := 0; rIdx <= int(math.Min(float64(len(rows)-1), 3)); rIdx++ {
			if c+1 < len(rows[rIdx]) {
				nextHeader += " " + rows[rIdx][c+1]
			}
		}
		isNextMarkCol := strings.Contains(strings.ToUpper(nextHeader), "INTERNAL MARK") ||
			strings.Contains(strings.ToUpper(nextHeader), "MARK")

		if isSubjectCodeCol && isNextMarkCol {
			cat := "Theory Subjects"
			if strings.Contains(headerUpper, "LAB") {
				cat = "Lab Subjects"
			} else if strings.Contains(headerUpper, "HONOR") || strings.Contains(headerUpper, "MINOR") {
				cat = "Honor / Minor Subjects"
			}

			pairs = append(pairs, subjectColPair{
				CodeCol:  c,
				MarkCol:  c + 1,
				Category: cat,
				MaxMarks: 30.0,
			})
			c++ // skip mark col
		}
	}

	// Fallback to standard columns if dynamic detection found fewer than 2 pairs
	if len(pairs) == 0 {
		defaultSpecs := []struct {
			codeCol int
			markCol int
			cat     string
		}{
			{8, 9, "Theory Subjects"},
			{10, 11, "Theory Subjects"},
			{12, 13, "Theory Subjects"},
			{14, 15, "Theory Subjects"},
			{16, 17, "Theory Subjects"},
			{18, 19, "Theory Subjects"},
			{20, 21, "Theory Subjects"},
			{22, 23, "Lab Subjects"},
			{24, 25, "Lab Subjects"},
			{26, 27, "Honor / Minor Subjects"},
			{28, 29, "Honor / Minor Subjects"},
		}
		for _, ds := range defaultSpecs {
			if ds.markCol < maxCols {
				pairs = append(pairs, subjectColPair{
					CodeCol:  ds.codeCol,
					MarkCol:  ds.markCol,
					Category: ds.cat,
					MaxMarks: 30.0,
				})
			}
		}
	}

	// Check for a MAX marks row in rows 1 to 4
	for rIdx := headerRowIdx; rIdx < int(math.Min(float64(len(rows)), 5)); rIdx++ {
		firstCol := ""
		if len(rows[rIdx]) > 0 {
			firstCol = strings.ToUpper(strings.TrimSpace(rows[rIdx][0]))
		}
		secondCol := ""
		if len(rows[rIdx]) > 1 {
			secondCol = strings.ToUpper(strings.TrimSpace(rows[rIdx][1]))
		}

		if strings.Contains(firstCol, "MAX") || strings.Contains(secondCol, "MAX") {
			for i := range pairs {
				if pairs[i].MarkCol < len(rows[rIdx]) {
					valStr := strings.TrimSpace(rows[rIdx][pairs[i].MarkCol])
					if m, err := strconv.ParseFloat(valStr, 64); err == nil && m > 0 {
						pairs[i].MaxMarks = m
					}
				}
			}
			break
		}
	}

	// Parse all student records
	index := make(map[string]StudentInternalMarks)

	for rIdx := headerRowIdx + 1; rIdx < len(rows); rIdx++ {
		row := rows[rIdx]
		if len(row) <= rollNoCol {
			continue
		}

		rawRoll := strings.TrimSpace(row[rollNoCol])
		normRoll := normalizeRollNo(rawRoll)

		// Skip empty, header-like, or non-student rows
		if normRoll == "" || normRoll == "MAX" || len(normRoll) < 5 ||
			strings.HasPrefix(normRoll, "SL") || strings.HasPrefix(normRoll, "ROLL") {
			continue
		}

		name := ""
		if nameCol < len(row) {
			name = strings.TrimSpace(row[nameCol])
		}
		degree := ""
		if degreeCol < len(row) {
			degree = strings.TrimSpace(row[degreeCol])
		}
		year := ""
		if yearCol < len(row) {
			year = strings.TrimSpace(row[yearCol])
		}
		dept := ""
		if deptCol < len(row) {
			dept = strings.TrimSpace(row[deptCol])
		}

		// Extract ONLY available subjects
		var subjects []InternalSubjectMark
		for _, pair := range pairs {
			if pair.CodeCol >= len(row) || pair.MarkCol >= len(row) {
				continue
			}

			code := strings.TrimSpace(row[pair.CodeCol])
			markStr := strings.TrimSpace(row[pair.MarkCol])

			// Skip if no subject code is enrolled
			if code == "" || code == "-" || strings.EqualFold(code, "NIL") || strings.EqualFold(code, "NA") {
				continue
			}

			mark, _ := strconv.ParseFloat(markStr, 64)
			maxM := pair.MaxMarks
			if maxM <= 0 {
				maxM = 30.0
			}

			subjects = append(subjects, InternalSubjectMark{
				Code:     code,
				Category: pair.Category,
				Mark:     mark,
				MaxMarks: maxM,
			})
		}

		if len(subjects) == 0 {
			continue
		}

		var totalEarned float64
		var totalMax float64
		for _, s := range subjects {
			totalEarned += s.Mark
			totalMax += s.MaxMarks
		}
		var pct float64
		if totalMax > 0 {
			pct = math.Round((totalEarned/totalMax)*1000) / 10
		}

		overall := InternalMarksOverall{
			TotalSubjects:      len(subjects),
			TotalInternalMarks: math.Round(totalEarned*100) / 100,
			MaxMarks:           math.Round(totalMax*100) / 100,
			Percentage:         pct,
		}

		// Build formatted rawData string for frontend compatibility
		var b strings.Builder
		grouped := make(map[string][]InternalSubjectMark)
		var catOrder []string
		for _, s := range subjects {
			if len(grouped[s.Category]) == 0 {
				catOrder = append(catOrder, s.Category)
			}
			grouped[s.Category] = append(grouped[s.Category], s)
		}

		for _, cat := range catOrder {
			subs := grouped[cat]
			icon := "📚"
			if strings.Contains(strings.ToLower(cat), "lab") {
				icon = "🔬"
			} else if strings.Contains(strings.ToLower(cat), "honor") || strings.Contains(strings.ToLower(cat), "minor") {
				icon = "🎖️"
			}
			b.WriteString(fmt.Sprintf("%s %s (%d subjects)\n", icon, strings.ToUpper(cat), len(subs)))
			for _, s := range subs {
				b.WriteString(fmt.Sprintf("🔹 %s\n", s.Code))
				b.WriteString(fmt.Sprintf("Internal Marks: Total: %.2f\n", s.Mark))
			}
			b.WriteString("\n")
		}

		b.WriteString("🎯 OVERALL SUMMARY\n")
		b.WriteString(fmt.Sprintf("TOTAL SUBJECTS: %d\n", overall.TotalSubjects))
		b.WriteString(fmt.Sprintf("TOTAL INTERNAL MARKS: %.2f\n", overall.TotalInternalMarks))

		rawData := b.String()

		index[normRoll] = StudentInternalMarks{
			RollNo:      normRoll,
			StudentName: name,
			Degree:      degree,
			Year:        year,
			Department:  dept,
			Subjects:    subjects,
			Overall:     overall,
			RawData:     rawData,
		}
	}

	log.Printf("✅ Successfully built internal marks index: %d students parsed", len(index))
	return index, nil
}

func (h *InternalMarksHandler) getOrRefreshSheetIndex(forceRefresh bool) (map[string]StudentInternalMarks, error) {
	h.sheetMu.RLock()
	if !forceRefresh && len(h.sheetCache) > 0 && time.Now().Before(h.sheetExpiry) {
		cache := h.sheetCache
		h.sheetMu.RUnlock()
		return cache, nil
	}
	h.sheetMu.RUnlock()

	h.sheetBuilding.Lock()
	defer h.sheetBuilding.Unlock()

	// Double-check after acquiring lock
	h.sheetMu.RLock()
	if !forceRefresh && len(h.sheetCache) > 0 && time.Now().Before(h.sheetExpiry) {
		cache := h.sheetCache
		h.sheetMu.RUnlock()
		return cache, nil
	}
	h.sheetMu.RUnlock()

	index, err := h.buildInternalMarksIndex()
	if err != nil {
		return nil, err
	}

	h.sheetMu.Lock()
	h.sheetCache = index
	h.sheetExpiry = time.Now().Add(InternalMarksSheetCacheDuration)
	h.sheetMu.Unlock()

	return index, nil
}

// Fetch from Hugging Face Gradio Space (fallback)
func (h *InternalMarksHandler) fetchFromHuggingFace(rollNo string) (string, error) {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	sessionHash := hex.EncodeToString(b)

	joinPayload := GradioJoinPayload{
		Data:        []interface{}{rollNo},
		EventData:   nil,
		FnIndex:     4,
		TriggerID:   nil,
		SessionHash: sessionHash,
	}

	bodyBytes, err := json.Marshal(joinPayload)
	if err != nil {
		return "", err
	}

	joinURL := GradioSpaceHost + "/gradio_api/queue/join?"
	req, err := http.NewRequest("POST", joinURL, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	if hfToken := os.Getenv("HF_TOKEN"); hfToken != "" {
		req.Header.Set("Authorization", "Bearer "+hfToken)
	}

	client := &http.Client{Timeout: 35 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("gradio queue join request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("gradio returned status %d: %s", resp.StatusCode, string(respBody))
	}

	dataURL := fmt.Sprintf("%s/gradio_api/queue/data?session_hash=%s", GradioSpaceHost, sessionHash)
	sseReq, err := http.NewRequest("GET", dataURL, nil)
	if err != nil {
		return "", err
	}
	sseReq.Header.Set("Accept", "text/event-stream")
	if hfToken := os.Getenv("HF_TOKEN"); hfToken != "" {
		sseReq.Header.Set("Authorization", "Bearer "+hfToken)
	}

	sseClient := &http.Client{Timeout: 50 * time.Second}
	sseResp, err := sseClient.Do(sseReq)
	if err != nil {
		return "", fmt.Errorf("gradio sse stream connection failed: %w", err)
	}
	defer sseResp.Body.Close()

	scanner := bufio.NewScanner(sseResp.Body)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		dataJson := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		var event GradioSSEEvent
		if err := json.Unmarshal([]byte(dataJson), &event); err != nil {
			continue
		}

		if event.Msg == "process_completed" {
			if len(event.Output.Data) > 0 {
				if str, ok := event.Output.Data[0].(string); ok {
					return str, nil
				}
				marshaled, _ := json.Marshal(event.Output.Data[0])
				return string(marshaled), nil
			}
			return "", fmt.Errorf("gradio returned empty output")
		}
	}

	if err := scanner.Err(); err != nil {
		return "", fmt.Errorf("error reading gradio stream: %w", err)
	}

	return "", fmt.Errorf("gradio stream completed without output")
}

// Single-flight deduplication for HF fallback
func (h *InternalMarksHandler) fetchWithSingleFlight(rollNo string) (string, error) {
	h.flightMu.Lock()
	if c, ok := h.flightCalls[rollNo]; ok {
		h.flightMu.Unlock()
		c.wg.Wait()
		return c.val, c.err
	}

	c := new(flightCall)
	c.wg.Add(1)
	h.flightCalls[rollNo] = c
	h.flightMu.Unlock()

	c.val, c.err = h.fetchFromHuggingFace(rollNo)
	c.wg.Done()

	h.flightMu.Lock()
	delete(h.flightCalls, rollNo)
	h.flightMu.Unlock()

	return c.val, c.err
}

// GetInternalMarksConversion handles GET /internal-marks/conversion?roll_no=...
func (h *InternalMarksHandler) GetInternalMarksConversion(c *gin.Context) {
	rollNo := strings.TrimSpace(c.Query("roll_no"))
	if rollNo == "" {
		rollNo = strings.TrimSpace(c.Query("rollNo"))
	}
	if rollNo == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "roll_no parameter is required",
		})
		return
	}

	normRoll := normalizeRollNo(rollNo)
	forceRefresh := c.Query("refresh") == "true"

	// 1. Try Google Sheet index first
	sheetIndex, sheetErr := h.getOrRefreshSheetIndex(forceRefresh)
	if sheetErr == nil && sheetIndex != nil {
		if studentData, found := sheetIndex[normRoll]; found {
			now := time.Now()
			expiresAt := now.Add(InternalMarksCacheDuration)

			entry := InternalMarksCacheEntry{
				RollNo:    normRoll,
				RawData:   studentData.RawData,
				CachedAt:  now,
				ExpiresAt: expiresAt,
			}
			h.saveToMemory(entry)
			go h.saveToDB(entry)

			c.Header("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600")
			c.Header("X-Cache", "SHEET_HIT")
			c.JSON(http.StatusOK, gin.H{
				"success":      true,
				"roll_no":      normRoll,
				"student_name": studentData.StudentName,
				"department":   studentData.Department,
				"year":         studentData.Year,
				"degree":       studentData.Degree,
				"subjects":     studentData.Subjects,
				"overall":      studentData.Overall,
				"raw":          studentData.RawData,
				"cached":       !forceRefresh,
				"cached_at":    formatIST(now),
				"expires_at":   formatIST(expiresAt),
			})
			return
		}
	} else if sheetErr != nil {
		log.Printf("⚠️ Note: Google Sheets internal marks error: %v. Checking cache / fallback.", sheetErr)
	}

	// 2. Check existing cache (Memory first, then DB)
	existingEntry, hasExisting := h.getFromMemory(normRoll)
	if !hasExisting {
		existingEntry, hasExisting = h.getFromDB(normRoll)
	}

	if hasExisting {
		if !forceRefresh {
			c.Header("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600")
			c.Header("X-Cache", "HIT")
			c.JSON(http.StatusOK, gin.H{
				"success":    true,
				"roll_no":    normRoll,
				"raw":        existingEntry.RawData,
				"cached":     true,
				"cached_at":  formatIST(existingEntry.CachedAt),
				"expires_at": formatIST(existingEntry.ExpiresAt),
			})
			return
		}

		if time.Since(existingEntry.CachedAt) < InternalMarksMinRefreshInterval {
			c.Header("Cache-Control", "public, max-age=300")
			c.Header("X-Cache", "HIT_COOLDOWN")
			c.JSON(http.StatusOK, gin.H{
				"success":    true,
				"roll_no":    normRoll,
				"raw":        existingEntry.RawData,
				"cached":     true,
				"cached_at":  formatIST(existingEntry.CachedAt),
				"expires_at": formatIST(existingEntry.ExpiresAt),
				"notice":     "Data was updated recently. Refresh cooldown active (5 minutes).",
			})
			return
		}
	}

	// 3. Fallback: If student was not found in sheet but sheet index is loaded, return 404
	if sheetErr == nil && sheetIndex != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   fmt.Sprintf("No internal marks record found for roll number %s in the spreadsheet.", normRoll),
		})
		return
	}

	// 4. Hugging Face fallback if sheet is not configured
	rawData, err := h.fetchWithSingleFlight(normRoll)
	if err != nil {
		log.Printf("❌ Failed to fetch internal marks from HF for %s: %v", normRoll, err)
		h.setNegativeCache(normRoll, err.Error())
		c.JSON(http.StatusBadGateway, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Failed to fetch internal marks from sheet and fallback: %v", err),
		})
		return
	}

	now := time.Now()
	ttl := InternalMarksCacheDuration
	if !strings.Contains(rawData, "IP-2") {
		ttl = InternalMarksIncompleteDuration
	}
	expiresAt := now.Add(ttl)

	entry := InternalMarksCacheEntry{
		RollNo:    normRoll,
		RawData:   rawData,
		CachedAt:  now,
		ExpiresAt: expiresAt,
	}

	h.saveToMemory(entry)
	go h.saveToDB(entry)

	c.Header("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600")
	c.Header("X-Cache", "MISS")
	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"roll_no":    normRoll,
		"raw":        rawData,
		"cached":     false,
		"cached_at":  formatIST(now),
		"expires_at": formatIST(expiresAt),
	})
}

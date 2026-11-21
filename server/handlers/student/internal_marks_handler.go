package student

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
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

// InternalSubjectMark represents an individual evaluated subject
type InternalSubjectMark struct {
	Code     string  `json:"code"`
	Category string  `json:"category"`
	Mark     float64 `json:"mark"`
	MaxMarks float64 `json:"max_marks"`
}

// InternalMarksOverall represents overall internal evaluation summary
type InternalMarksOverall struct {
	TotalSubjects      int     `json:"total_subjects"`
	TotalInternalMarks float64 `json:"total_internal_marks"`
	MaxMarks           float64 `json:"max_marks"`
	Percentage         float64 `json:"percentage"`
}

// StudentInternalMarks represents all internal marks for a single student
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

type InternalMarksCacheEntry struct {
	RollNo    string    `json:"roll_no"`
	RawData   string    `json:"raw_data"`
	CachedAt  time.Time `json:"cached_at"`
	ExpiresAt time.Time `json:"expires_at"`
}

const (
	InternalMarksCacheDuration      = 48 * time.Hour
	InternalMarksSheetCacheDuration = 10 * time.Minute
)

var istLocation = time.FixedZone("IST", 5*3600+30*60)

func formatIST(t time.Time) string {
	return t.In(istLocation).Format(time.RFC3339)
}

type InternalMarksHandler struct {
	sheetHandler  *SheetHandler
	sheetMu       sync.RWMutex
	sheetCache    map[string]StudentInternalMarks
	sheetExpiry   time.Time
	sheetBuilding sync.Mutex

	dbCacheMu sync.RWMutex
}

func NewInternalMarksHandler(sheetHandler *SheetHandler) *InternalMarksHandler {
	h := &InternalMarksHandler{
		sheetHandler: sheetHandler,
		sheetCache:   make(map[string]StudentInternalMarks),
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

func (h *InternalMarksHandler) getFromDB(rollNo string) (StudentInternalMarks, bool) {
	if config.DB == nil {
		return StudentInternalMarks{}, false
	}

	query := `SELECT raw_data FROM internal_marks_cache WHERE roll_no = ? AND expires_at > NOW() LIMIT 1`
	var rawData string
	err := config.DB.QueryRow(query, rollNo).Scan(&rawData)
	if err != nil {
		return StudentInternalMarks{}, false
	}

	var data StudentInternalMarks
	if err := json.Unmarshal([]byte(rawData), &data); err != nil {
		return StudentInternalMarks{}, false
	}
	return data, true
}

func (h *InternalMarksHandler) saveToDB(student StudentInternalMarks) {
	if config.DB == nil {
		return
	}

	payload, err := json.Marshal(student)
	if err != nil {
		return
	}

	query := `
	INSERT INTO internal_marks_cache (roll_no, raw_data, cached_at, expires_at)
	VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 48 HOUR))
	ON DUPLICATE KEY UPDATE
		raw_data = VALUES(raw_data),
		cached_at = NOW(),
		expires_at = DATE_ADD(NOW(), INTERVAL 48 HOUR)
	`
	if _, err := config.DB.Exec(query, student.RollNo, string(payload)); err != nil {
		log.Printf("⚠️ Failed to persist internal marks for %s in DB: %v", student.RollNo, err)
	}
}

// cleanSpreadsheetID handles raw IDs or full URLs if entered in .env
func cleanSpreadsheetID(val string) string {
	val = strings.TrimSpace(val)
	val = strings.Trim(val, `"'`)
	if val == "" {
		return ""
	}

	if strings.Contains(val, "2PACX-") || strings.Contains(val, "/d/e/") {
		return ""
	}

	if strings.Contains(val, "/d/") {
		parts := strings.Split(val, "/d/")
		if len(parts) > 1 {
			idPart := parts[1]
			for _, delim := range []string{"/", "?", "#"} {
				if idx := strings.Index(idPart, delim); idx != -1 {
					idPart = idPart[:idx]
				}
			}
			return strings.TrimSpace(idPart)
		}
	}

	if u, err := url.Parse(val); err == nil && u.Query().Get("key") != "" {
		return u.Query().Get("key")
	}

	return val
}

type internalSubjectPair struct {
	CodeCol  int
	MarkCol  int
	Category string
	MaxMarks float64
}

// parseInternalMarksFromCSV reads and parses a local CSV file
func parseInternalMarksFromCSV(filePath string) (map[string]StudentInternalMarks, error) {
	f, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	reader := csv.NewReader(f)
	reader.FieldsPerRecord = -1
	reader.LazyQuotes = true
	records, err := reader.ReadAll()
	if err != nil {
		return nil, fmt.Errorf("failed to read CSV %s: %w", filePath, err)
	}

	values := make([][]interface{}, len(records))
	for i, row := range records {
		rowIface := make([]interface{}, len(row))
		for j, cell := range row {
			rowIface[j] = cell
		}
		values[i] = rowIface
	}
	return parseInternalMarksValues(values)
}

// buildInternalMarksIndex fetches the Google Sheet via Sheets API, or loads a local CSV
func (h *InternalMarksHandler) buildInternalMarksIndex() (map[string]StudentInternalMarks, error) {
	// 1. Try local CSV file first if present
	csvCandidates := []string{
		"data/internal_marks.csv",
		"server/data/internal_marks.csv",
		"../server/data/internal_marks.csv",
		"internal_marks.csv",
	}
	for _, p := range csvCandidates {
		if st, err := os.Stat(p); err == nil && !st.IsDir() {
			log.Printf("📄 Found local internal marks CSV at %s, parsing...", p)
			idx, err := parseInternalMarksFromCSV(p)
			if err == nil && len(idx) > 0 {
				log.Printf("✅ Loaded %d students from %s", len(idx), p)
				return idx, nil
			}
			log.Printf("⚠️ Error parsing %s: %v", p, err)
		}
	}

	rawEnv := os.Getenv("INTERNAL_MARKS_SHEET")
	if rawEnv == "" {
		rawEnv = os.Getenv("INTERNAL_MARKS_SHEET_ID")
	}
	if rawEnv == "" {
		rawEnv = os.Getenv("Internal_Marks_sheet")
	}
	if rawEnv == "" {
		return nil, fmt.Errorf("INTERNAL_MARKS_SHEET is not set in server/.env, and server/data/internal_marks.csv was not found")
	}

	if strings.Contains(rawEnv, "2PACX-") || strings.Contains(rawEnv, "/d/e/") {
		return nil, fmt.Errorf("Web-published links (2PACX-...) cannot be read by Google Sheets API without browser cookies. Please download the CSV from your browser and place it in server/data/internal_marks.csv, OR import it to your Google Drive and set the new Sheet ID.")
	}

	spreadsheetID := cleanSpreadsheetID(rawEnv)
	if spreadsheetID == "" {
		return nil, fmt.Errorf("invalid spreadsheet ID in INTERNAL_MARKS_SHEET: %s", rawEnv)
	}

	if h.sheetHandler == nil {
		return nil, fmt.Errorf("SheetHandler not initialized on server")
	}

	svc := h.sheetHandler.GetSheetsService()
	if svc == nil {
		h.sheetHandler.LoadSavedToken()
		svc = h.sheetHandler.GetSheetsService()
	}
	if svc == nil {
		return nil, fmt.Errorf("Google Sheets service not initialized. Check server token")
	}

	// 1. Inspect sheets metadata to find the matching tab
	meta, err := svc.Spreadsheets.Get(spreadsheetID).Do()
	if err != nil {
		return nil, fmt.Errorf("failed to access internal marks spreadsheet (%s): %w", spreadsheetID, err)
	}

	var tabName string
	targetGid := int64(1533805453) // gid from user sheet URL if present

	if meta != nil && len(meta.Sheets) > 0 {
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

	// 2. Fetch full table values (A to AD columns)
	readRange := fmt.Sprintf("'%s'!A1:AD", tabName)
	vr, err := svc.Spreadsheets.Values.Get(spreadsheetID, readRange).Do()
	if err != nil {
		vr, err = svc.Spreadsheets.Values.Get(spreadsheetID, "A1:AD").Do()
	}
	if err != nil {
		return nil, fmt.Errorf("failed to fetch values for tab %s: %w", tabName, err)
	}

	return parseInternalMarksValues(vr.Values)
}

func parseInternalMarksValues(values [][]interface{}) (map[string]StudentInternalMarks, error) {
	if len(values) < 3 {
		return nil, fmt.Errorf("data has insufficient rows (got %d)", len(values))
	}

	// 3. Detect column positions dynamically from header rows
	rollNoCol := 1
	nameCol := 2
	degreeCol := 3
	yearCol := 4
	deptCol := 5

	headerRowIdx := 1
	for rIdx := 0; rIdx < int(math.Min(float64(len(values)), 4)); rIdx++ {
		row := values[rIdx]
		for cIdx, cell := range row {
			cLower := strings.ToLower(strings.TrimSpace(fmt.Sprintf("%v", cell)))
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

	// 4. Detect Subject Pairs across Theory, Lab, and Honor/Minor subjects
	var pairs []internalSubjectPair
	maxCols := 0
	for _, r := range values[:int(math.Min(float64(len(values)), 5))] {
		if len(r) > maxCols {
			maxCols = len(r)
		}
	}

	for c := 6; c < maxCols-1; c++ {
		var headerText string
		for rIdx := 0; rIdx <= int(math.Min(float64(len(values)-1), 3)); rIdx++ {
			if c < len(values[rIdx]) {
				headerText += " " + fmt.Sprintf("%v", values[rIdx][c])
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
		for rIdx := 0; rIdx <= int(math.Min(float64(len(values)-1), 3)); rIdx++ {
			if c+1 < len(values[rIdx]) {
				nextHeader += " " + fmt.Sprintf("%v", values[rIdx][c+1])
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

			pairs = append(pairs, internalSubjectPair{
				CodeCol:  c,
				MarkCol:  c + 1,
				Category: cat,
				MaxMarks: 30.0,
			})
			c++
		}
	}

	// Fallback to standard sheet columns if dynamic detection found none
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
				pairs = append(pairs, internalSubjectPair{
					CodeCol:  ds.codeCol,
					MarkCol:  ds.markCol,
					Category: ds.cat,
					MaxMarks: 30.0,
				})
			}
		}
	}

	// 5. Detect MAX row if present in rows 1 to 4
	for rIdx := headerRowIdx; rIdx < int(math.Min(float64(len(values)), 5)); rIdx++ {
		firstCol := ""
		if len(values[rIdx]) > 0 {
			firstCol = strings.ToUpper(strings.TrimSpace(fmt.Sprintf("%v", values[rIdx][0])))
		}
		secondCol := ""
		if len(values[rIdx]) > 1 {
			secondCol = strings.ToUpper(strings.TrimSpace(fmt.Sprintf("%v", values[rIdx][1])))
		}

		if strings.Contains(firstCol, "MAX") || strings.Contains(secondCol, "MAX") {
			for i := range pairs {
				if pairs[i].MarkCol < len(values[rIdx]) {
					valStr := strings.TrimSpace(fmt.Sprintf("%v", values[rIdx][pairs[i].MarkCol]))
					if m, err := strconv.ParseFloat(valStr, 64); err == nil && m > 0 {
						pairs[i].MaxMarks = m
					}
				}
			}
			break
		}
	}

	// 6. Parse all student rows into an in-memory index
	index := make(map[string]StudentInternalMarks)

	for rIdx := headerRowIdx + 1; rIdx < len(values); rIdx++ {
		row := values[rIdx]
		if len(row) <= rollNoCol {
			continue
		}

		rawRoll := strings.TrimSpace(fmt.Sprintf("%v", row[rollNoCol]))
		normRoll := normalizeRollNo(rawRoll)

		if normRoll == "" || normRoll == "MAX" || len(normRoll) < 5 ||
			strings.HasPrefix(normRoll, "SL") || strings.HasPrefix(normRoll, "ROLL") {
			continue
		}

		name := ""
		if nameCol < len(row) {
			name = strings.TrimSpace(fmt.Sprintf("%v", row[nameCol]))
		}
		degree := ""
		if degreeCol < len(row) {
			degree = strings.TrimSpace(fmt.Sprintf("%v", row[degreeCol]))
		}
		year := ""
		if yearCol < len(row) {
			year = strings.TrimSpace(fmt.Sprintf("%v", row[yearCol]))
		}
		dept := ""
		if deptCol < len(row) {
			dept = strings.TrimSpace(fmt.Sprintf("%v", row[deptCol]))
		}

		// Only include available enrolled subjects
		var subjects []InternalSubjectMark
		for _, pair := range pairs {
			if pair.CodeCol >= len(row) || pair.MarkCol >= len(row) {
				continue
			}

			code := strings.TrimSpace(fmt.Sprintf("%v", row[pair.CodeCol]))
			markStr := strings.TrimSpace(fmt.Sprintf("%v", row[pair.MarkCol]))

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

		// Formatted raw string for backward compatibility
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

	log.Printf("✅ Internal marks Google Sheet parsed successfully: %d students indexed", len(index))
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

	// Double-check lock condition
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

	// 1. Fetch from Google Sheet index (same view-only account as RP sheets)
	sheetIndex, sheetErr := h.getOrRefreshSheetIndex(forceRefresh)
	if sheetErr == nil && sheetIndex != nil {
		if studentData, found := sheetIndex[normRoll]; found {
			now := time.Now()
			expiresAt := now.Add(InternalMarksCacheDuration)

			go h.saveToDB(studentData)

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

		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"error":   fmt.Sprintf("No internal marks record found for roll number %s in the Google Sheet.", normRoll),
		})
		return
	}

	// 2. Fallback to DB cache if sheet is temporarily unreachable
	if dbStudent, foundInDB := h.getFromDB(normRoll); foundInDB {
		now := time.Now()
		expiresAt := now.Add(InternalMarksCacheDuration)
		c.Header("Cache-Control", "public, max-age=300")
		c.Header("X-Cache", "DB_FALLBACK")
		c.JSON(http.StatusOK, gin.H{
			"success":      true,
			"roll_no":      normRoll,
			"student_name": dbStudent.StudentName,
			"department":   dbStudent.Department,
			"year":         dbStudent.Year,
			"degree":       dbStudent.Degree,
			"subjects":     dbStudent.Subjects,
			"overall":      dbStudent.Overall,
			"raw":          dbStudent.RawData,
			"cached":       true,
			"cached_at":    formatIST(now),
			"expires_at":   formatIST(expiresAt),
		})
		return
	}

	log.Printf("❌ Failed to fetch internal marks: %v", sheetErr)
	c.JSON(http.StatusBadGateway, gin.H{
		"success": false,
		"error":   fmt.Sprintf("Failed to fetch internal marks from Google Sheet: %v", sheetErr),
	})
}

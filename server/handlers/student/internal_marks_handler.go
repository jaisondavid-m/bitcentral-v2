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
	Code        string  `json:"code"`
	Category    string  `json:"category"`
	Mark        float64 `json:"mark"`
	MaxMarks    float64 `json:"max_marks"`
	IP1Points   float64 `json:"ip1_points"`
	IP2Points   float64 `json:"ip2_points"`
	IP1Marks    float64 `json:"ip1_marks"`
	IP2Marks    float64 `json:"ip2_marks"`
	TotalPoints float64 `json:"total_points"`
}

// InternalMarksOverall represents overall internal evaluation summary
type InternalMarksOverall struct {
	TotalSubjects      int     `json:"total_subjects"`
	TotalInternalMarks float64 `json:"total_internal_marks"`
	TotalRewardPoints  float64 `json:"total_reward_points"`
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
	InternalMarksSheetCacheDuration = 12 * time.Hour
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

	// Reject stale cache entries that lack IP period marks
	if !strings.Contains(rawData, "ip1_marks") {
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

const DefaultInternalMarksSheetID = "1gHiOy41cpyg8dZxDWu-MsF8o0abLbL8MHbVK-GkMjqw"
const InternalMarksSheetTab = "Studentwise Reward Points"

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
	return parseStudentwiseSheetValues(values)
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

	spreadsheetID := cleanSpreadsheetID(rawEnv)
	if spreadsheetID == "" {
		spreadsheetID = DefaultInternalMarksSheetID
	}

	if h.sheetHandler == nil {
		return nil, fmt.Errorf("SheetHandler not initialized on server")
	}

	if h.sheetHandler.GetOAuthConfig() == nil {
		h.sheetHandler.InitOAuth()
	}

	svc := h.sheetHandler.GetSheetsService()
	if svc == nil {
		h.sheetHandler.LoadSavedToken()
		svc = h.sheetHandler.GetSheetsService()
	}
	if svc == nil {
		return nil, fmt.Errorf("Google Sheets service not initialized. Check server token")
	}

	// Columns A to CR (indices 0 to 97) contain Roll No, Student Name, TS1-9, LS1-2, IP1/IP2 points & marks
	readRange := fmt.Sprintf("'%s'!A1:CV", InternalMarksSheetTab)
	vr, err := svc.Spreadsheets.Values.Get(spreadsheetID, readRange).Do()
	if err != nil {
		vr, err = svc.Spreadsheets.Values.Get(spreadsheetID, fmt.Sprintf("%s!A1:CV", InternalMarksSheetTab)).Do()
	}
	if err != nil {
		return nil, fmt.Errorf("failed to fetch values for tab %s from %s: %w", InternalMarksSheetTab, spreadsheetID, err)
	}

	return parseStudentwiseSheetValues(vr.Values)
}

// parseStudentwiseSheetValues extracts subjects, reward points, and marks using the exact logic from extract_subjects_and_marks_for_gradio
func parseStudentwiseSheetValues(values [][]interface{}) (map[string]StudentInternalMarks, error) {
	if len(values) < 2 {
		return nil, fmt.Errorf("sheet has insufficient rows (got %d)", len(values))
	}

	headers := values[0]
	headerMap := make(map[string]int, len(headers))
	for i, h := range headers {
		name := strings.TrimSpace(fmt.Sprintf("%v", h))
		if name != "" {
			headerMap[name] = i
		}
	}

	rollCol, hasRoll := headerMap["Roll No."]
	if !hasRoll {
		for name, idx := range headerMap {
			if strings.Contains(strings.ToLower(name), "roll") && strings.Contains(strings.ToLower(name), "no") {
				rollCol = idx
				hasRoll = true
				break
			}
		}
	}
	if !hasRoll {
		rollCol = 1
	}

	nameCol := headerMap["Student Name"]
	courseCol := headerMap["Course Code"]
	yearCol := headerMap["Year"]
	deptCol := headerMap["Department"]

	getVal := func(row []interface{}, colName string) string {
		idx, ok := headerMap[colName]
		if !ok || idx >= len(row) {
			return ""
		}
		return strings.TrimSpace(fmt.Sprintf("%v", row[idx]))
	}

	getNum := func(row []interface{}, colName string) float64 {
		s := getVal(row, colName)
		if s == "" {
			return 0
		}
		s = strings.ReplaceAll(s, ",", "")
		v, err := strconv.ParseFloat(s, 64)
		if err != nil {
			return 0
		}
		return v
	}

	index := make(map[string]StudentInternalMarks)

	// Rows start from index 1 (skipping header row 0)
	for rIdx := 1; rIdx < len(values); rIdx++ {
		row := values[rIdx]
		if len(row) <= rollCol {
			continue
		}

		rawRoll := strings.TrimSpace(fmt.Sprintf("%v", row[rollCol]))
		normRoll := normalizeRollNo(rawRoll)

		// Search first 5 columns if roll column did not yield a valid student roll number
		if normRoll == "" || len(normRoll) < 5 || strings.Contains(strings.ToUpper(rawRoll), "HIDDEN") {
			for c := 0; c < int(math.Min(float64(len(row)), 5)); c++ {
				cand := normalizeRollNo(fmt.Sprintf("%v", row[c]))
				if len(cand) >= 10 && (strings.HasPrefix(cand, "7376") || strings.HasPrefix(cand, "2025")) {
					normRoll = cand
					break
				}
			}
		}

		if normRoll == "" || len(normRoll) < 5 || strings.Contains(normRoll, "HIDDEN") ||
			strings.HasPrefix(normRoll, "SL") || strings.HasPrefix(normRoll, "ROLL") {
			continue
		}

		studentName := getVal(row, "Student Name")
		if studentName == "" && nameCol < len(row) {
			studentName = strings.TrimSpace(fmt.Sprintf("%v", row[nameCol]))
		}
		if studentName == "" {
			studentName = "Unknown"
		}

		courseCode := getVal(row, "Course Code")
		if courseCode == "" && courseCol < len(row) {
			courseCode = strings.TrimSpace(fmt.Sprintf("%v", row[courseCol]))
		}

		year := getVal(row, "Year")
		if year == "" && yearCol < len(row) {
			year = strings.TrimSpace(fmt.Sprintf("%v", row[yearCol]))
		}

		department := getVal(row, "Department")
		if department == "" && deptCol < len(row) {
			department = strings.TrimSpace(fmt.Sprintf("%v", row[deptCol]))
		}

		// 1. Collect Theory Subjects (TS1 to TS9)
		var theorySubjects []InternalSubjectMark
		var totalTheoryIP1Points, totalTheoryIP2Points float64
		var totalTheoryIP1Marks, totalTheoryIP2Marks float64

		for i := 1; i <= 9; i++ {
			code := getVal(row, fmt.Sprintf("TS%d", i))
			if code != "" {
				ip1Points := getNum(row, fmt.Sprintf("IP1TS%dR", i))
				ip2Points := getNum(row, fmt.Sprintf("IP2TS%dR", i))
				ip1Marks := getNum(row, fmt.Sprintf("IP1TS%dM", i))
				ip2Marks := getNum(row, fmt.Sprintf("IP2TS%dM", i))
				totPoints := math.Round((ip1Points+ip2Points)*100) / 100
				totMarks := math.Round((ip1Marks+ip2Marks)*100) / 100

				totalTheoryIP1Points += ip1Points
				totalTheoryIP2Points += ip2Points
				totalTheoryIP1Marks += ip1Marks
				totalTheoryIP2Marks += ip2Marks

				theorySubjects = append(theorySubjects, InternalSubjectMark{
					Code:        code,
					Category:    "Theory Subjects",
					Mark:        totMarks,
					MaxMarks:    30.0,
					IP1Points:   ip1Points,
					IP2Points:   ip2Points,
					IP1Marks:    ip1Marks,
					IP2Marks:    ip2Marks,
					TotalPoints: totPoints,
				})
			}
		}

		// 2. Collect Lab Subjects (LS1 to LS2)
		var labSubjects []InternalSubjectMark
		var totalLabIP1Points, totalLabIP2Points float64
		var totalLabIP1Marks, totalLabIP2Marks float64

		for i := 1; i <= 2; i++ {
			code := getVal(row, fmt.Sprintf("LS%d", i))
			if code != "" {
				ip1Points := getNum(row, fmt.Sprintf("IP1LS%dR", i))
				ip2Points := getNum(row, fmt.Sprintf("IP2LS%dR", i))
				ip1Marks := getNum(row, fmt.Sprintf("IP1LS%dM", i))
				ip2Marks := getNum(row, fmt.Sprintf("IP2LS%dM", i))
				totPoints := math.Round((ip1Points+ip2Points)*100) / 100
				totMarks := math.Round((ip1Marks+ip2Marks)*100) / 100

				totalLabIP1Points += ip1Points
				totalLabIP2Points += ip2Points
				totalLabIP1Marks += ip1Marks
				totalLabIP2Marks += ip2Marks

				labSubjects = append(labSubjects, InternalSubjectMark{
					Code:        code,
					Category:    "Lab Subjects",
					Mark:        totMarks,
					MaxMarks:    30.0,
					IP1Points:   ip1Points,
					IP2Points:   ip2Points,
					IP1Marks:    ip1Marks,
					IP2Marks:    ip2Marks,
					TotalPoints: totPoints,
				})
			}
		}

		allSubjects := append(theorySubjects, labSubjects...)
		totalSubjects := len(allSubjects)
		grandTotalPoints := totalTheoryIP1Points + totalTheoryIP2Points + totalLabIP1Points + totalLabIP2Points
		grandTotalMarks := totalTheoryIP1Marks + totalTheoryIP2Marks + totalLabIP1Marks + totalLabIP2Marks

		maxMarksPossible := float64(totalSubjects) * 30.0
		var pct float64
		if maxMarksPossible > 0 {
			pct = math.Round((grandTotalMarks/maxMarksPossible)*1000) / 10
		}

		overall := InternalMarksOverall{
			TotalSubjects:      totalSubjects,
			TotalInternalMarks: math.Round(grandTotalMarks*100) / 100,
			TotalRewardPoints:  math.Round(grandTotalPoints*100) / 100,
			MaxMarks:           maxMarksPossible,
			Percentage:         pct,
		}

		// Build output text string formatted identically to Python extract_subjects_and_marks_for_gradio
		var b strings.Builder
		b.WriteString("\n🏆 INNOVATIVE PRACTICE (IP) SUMMARY\n")
		b.WriteString(strings.Repeat("=", 80) + "\n")

		if len(theorySubjects) > 0 {
			b.WriteString(fmt.Sprintf("\n📚 THEORY SUBJECTS (%d subjects)\n", len(theorySubjects)))
			b.WriteString(strings.Repeat("-", 50) + "\n")
			for _, s := range theorySubjects {
				b.WriteString(fmt.Sprintf("\n🔹 %s\n", s.Code))
				if s.IP1Points > 0 || s.IP2Points > 0 {
					pLine := "  Reward Points: "
					if s.IP1Points > 0 {
						pLine += fmt.Sprintf("IP-1: %.2f", s.IP1Points)
					}
					if s.IP2Points > 0 {
						if s.IP1Points > 0 {
							pLine += fmt.Sprintf(" | IP-2: %.2f", s.IP2Points)
						} else {
							pLine += fmt.Sprintf("IP-2: %.2f", s.IP2Points)
						}
					}
					pLine += fmt.Sprintf(" | Total: %.2f\n", s.TotalPoints)
					b.WriteString(pLine)
				}
				if s.IP1Marks > 0 || s.IP2Marks > 0 {
					mLine := "  Internal Marks: "
					if s.IP1Marks > 0 {
						mLine += fmt.Sprintf("IP-1: %.2f", s.IP1Marks)
					}
					if s.IP2Marks > 0 {
						if s.IP1Marks > 0 {
							mLine += fmt.Sprintf(" | IP-2: %.2f", s.IP2Marks)
						} else {
							mLine += fmt.Sprintf("IP-2: %.2f", s.IP2Marks)
						}
					}
					mLine += fmt.Sprintf(" | Total: %.2f\n", s.Mark)
					b.WriteString(mLine)
				}
			}
		}

		if len(labSubjects) > 0 {
			b.WriteString(fmt.Sprintf("\n🧪 LAB SUBJECTS (%d subjects)\n", len(labSubjects)))
			b.WriteString(strings.Repeat("-", 50) + "\n")
			for _, s := range labSubjects {
				b.WriteString(fmt.Sprintf("\n🔹 %s\n", s.Code))
				if s.IP1Points > 0 || s.IP2Points > 0 {
					pLine := "  Reward Points: "
					if s.IP1Points > 0 {
						pLine += fmt.Sprintf("IP-1: %.2f", s.IP1Points)
					}
					if s.IP2Points > 0 {
						if s.IP1Points > 0 {
							pLine += fmt.Sprintf(" | IP-2: %.2f", s.IP2Points)
						} else {
							pLine += fmt.Sprintf("IP-2: %.2f", s.IP2Points)
						}
					}
					pLine += fmt.Sprintf(" | Total: %.2f\n", s.TotalPoints)
					b.WriteString(pLine)
				}
				if s.IP1Marks > 0 || s.IP2Marks > 0 {
					mLine := "  Internal Marks: "
					if s.IP1Marks > 0 {
						mLine += fmt.Sprintf("IP-1: %.2f", s.IP1Marks)
					}
					if s.IP2Marks > 0 {
						if s.IP1Marks > 0 {
							mLine += fmt.Sprintf(" | IP-2: %.2f", s.IP2Marks)
						} else {
							mLine += fmt.Sprintf("IP-2: %.2f", s.IP2Marks)
						}
					}
					mLine += fmt.Sprintf(" | Total: %.2f\n", s.Mark)
					b.WriteString(mLine)
				}
			}
		}

		b.WriteString("\n" + strings.Repeat("=", 80) + "\n")
		b.WriteString("📊 OVERALL SUMMARY\n")
		b.WriteString(strings.Repeat("=", 80) + "\n")

		b.WriteString("\n🏅 REWARD POINTS BREAKDOWN:\n")
		if len(theorySubjects) > 0 {
			b.WriteString(fmt.Sprintf("  Theory Subjects: %.2f points\n", totalTheoryIP1Points+totalTheoryIP2Points))
			if totalTheoryIP1Points > 0 {
				b.WriteString(fmt.Sprintf("    ➤ IP-1: %.2f\n", totalTheoryIP1Points))
			}
			if totalTheoryIP2Points > 0 {
				b.WriteString(fmt.Sprintf("    ➤ IP-2: %.2f\n", totalTheoryIP2Points))
			}
		}
		if len(labSubjects) > 0 {
			b.WriteString(fmt.Sprintf("  Lab Subjects: %.2f points\n", totalLabIP1Points+totalLabIP2Points))
			if totalLabIP1Points > 0 {
				b.WriteString(fmt.Sprintf("    ➤ IP-1: %.2f\n", totalLabIP1Points))
			}
			if totalLabIP2Points > 0 {
				b.WriteString(fmt.Sprintf("    ➤ IP-2: %.2f\n", totalLabIP2Points))
			}
		}
		b.WriteString(fmt.Sprintf("\n🎯 TOTAL REWARD POINTS: %.2f\n", grandTotalPoints))

		b.WriteString("\n📝 INTERNAL MARKS BREAKDOWN:\n")
		if len(theorySubjects) > 0 {
			b.WriteString(fmt.Sprintf("  Theory Subjects: %.2f marks\n", totalTheoryIP1Marks+totalTheoryIP2Marks))
			if totalTheoryIP1Marks > 0 {
				b.WriteString(fmt.Sprintf("    ➤ IP-1: %.2f\n", totalTheoryIP1Marks))
			}
			if totalTheoryIP2Marks > 0 {
				b.WriteString(fmt.Sprintf("    ➤ IP-2: %.2f\n", totalTheoryIP2Marks))
			}
		}
		if len(labSubjects) > 0 {
			b.WriteString(fmt.Sprintf("  Lab Subjects: %.2f marks\n", totalLabIP1Marks+totalLabIP2Marks))
			if totalLabIP1Marks > 0 {
				b.WriteString(fmt.Sprintf("    ➤ IP-1: %.2f\n", totalLabIP1Marks))
			}
			if totalLabIP2Marks > 0 {
				b.WriteString(fmt.Sprintf("    ➤ IP-2: %.2f\n", totalLabIP2Marks))
			}
		}
		b.WriteString(fmt.Sprintf("\n📊 TOTAL INTERNAL MARKS: %.2f\n", grandTotalMarks))
		b.WriteString(fmt.Sprintf("\n📚 TOTAL SUBJECTS: %d\n", totalSubjects))
		b.WriteString("\n" + strings.Repeat("=", 80) + "\n")

		index[normRoll] = StudentInternalMarks{
			RollNo:      normRoll,
			StudentName: studentName,
			Degree:      courseCode,
			Year:        year,
			Department:  department,
			Subjects:    allSubjects,
			Overall:     overall,
			RawData:     b.String(),
		}
	}

	log.Printf("✅ Internal marks parsed successfully: %d students indexed", len(index))
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

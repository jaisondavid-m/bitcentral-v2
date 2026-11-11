package student

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func TestStudentRankHarinath(t *testing.T) {
	gin.SetMode(gin.TestMode)
	_ = godotenv.Load("../../.env")
	os.Chdir("../..")

	sheetHandler := NewSheetHandler()
	sheetHandler.InitOAuth()
	if !sheetHandler.LoadSavedToken() {
		t.Skip("No saved Google OAuth token found, skipping online test")
	}

	lbHandler := NewLeaderboardHandler(sheetHandler)

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	req, _ := http.NewRequest(http.MethodGet, "/rank?roll_no=7376251EI115&refresh=true", nil)
	c.Request = req

	lbHandler.GetStudentRank(c)

	if w.Code != http.StatusOK {
		t.Fatalf("Expected 200 OK, got %d: %s", w.Code, w.Body.String())
	}

	var resp struct {
		Success bool `json:"success"`
		Student struct {
			RollNo        string  `json:"roll_no"`
			StudentName   string  `json:"student_name"`
			Department    string  `json:"department"`
			Tab           string  `json:"tab"`
			Year          string  `json:"year"`
			BalancePoints float64 `json:"balance_points"`
		} `json:"student"`
		Ranks struct {
			DeptYear RankStat `json:"dept_year"`
			Dept     RankStat `json:"dept"`
			Year     RankStat `json:"year"`
			College  RankStat `json:"college"`
		} `json:"ranks"`
		Toppers []TopPerformer `json:"toppers"`
	}

	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Failed to parse JSON response: %v", err)
	}

	t.Logf("Student: %s (%s)", resp.Student.StudentName, resp.Student.RollNo)
	t.Logf("Dept & Year Rank: #%d of %d (Percentile: %.1f%%)", resp.Ranks.DeptYear.Rank, resp.Ranks.DeptYear.Total, resp.Ranks.DeptYear.Percentile)
	t.Logf("Department Rank: #%d of %d (Percentile: %.1f%%)", resp.Ranks.Dept.Rank, resp.Ranks.Dept.Total, resp.Ranks.Dept.Percentile)
	t.Logf("Year Rank: #%d of %d (Percentile: %.1f%%)", resp.Ranks.Year.Rank, resp.Ranks.Year.Total, resp.Ranks.Year.Percentile)
	t.Logf("College Rank: #%d of %d (Percentile: %.1f%%)", resp.Ranks.College.Rank, resp.Ranks.College.Total, resp.Ranks.College.Percentile)
	t.Logf("Toppers in Dept & Year: %+v", resp.Toppers)

	// Verification assertions:
	// 1. Dept & Year for EIE II Year must be exactly 49 students (not 774)
	if resp.Ranks.DeptYear.Total != 49 {
		t.Errorf("Expected 49 students in II Year EIE, got %d", resp.Ranks.DeptYear.Total)
	}
	if resp.Ranks.DeptYear.Rank != 11 {
		t.Errorf("Expected rank #11 for Harinath D in II Year EIE, got %d", resp.Ranks.DeptYear.Rank)
	}

	// 2. Department Rank for EIE must be exactly 265 students (not 3621)
	if resp.Ranks.Dept.Total != 265 {
		t.Errorf("Expected 265 students in All EIE, got %d", resp.Ranks.Dept.Total)
	}

	// 3. Year Rank for II Year must be 1514 students
	if resp.Ranks.Year.Total != 1514 {
		t.Errorf("Expected 1514 students in II Year, got %d", resp.Ranks.Year.Total)
	}

	// 4. College Rank must be exactly 6707 valid students (without trailing empty rows or INDEX fake rows)
	if resp.Ranks.College.Total != 6707 {
		t.Errorf("Expected 6707 students in entire college, got %d", resp.Ranks.College.Total)
	}

	// 5. Toppers should be from EIE II Year and have 3 entries
	if len(resp.Toppers) != 3 {
		t.Errorf("Expected 3 toppers, got %d", len(resp.Toppers))
	}
	for _, top := range resp.Toppers {
		if top.RollNo == "" || top.StudentName == "" || top.BalancePoints <= 0 {
			t.Errorf("Invalid topper data: %+v", top)
		}
	}
}

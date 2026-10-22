package student

import (
	"fmt"
	"math"
	"net/http"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"

	studentmodels "server/models/student"
)

const rankCacheTTL = 5 * time.Minute

var (
	rankCacheMu       sync.RWMutex
	rankCacheBuildMu  sync.Mutex
	cachedAllStudents []studentmodels.Student
	rankCacheExpiry   time.Time
)

type RankStat struct {
	Rank       int     `json:"rank"`
	Total      int     `json:"total"`
	Percentile float64 `json:"percentile"`
	TopScore   float64 `json:"top_score"`
	AvgScore   float64 `json:"avg_score"`
	Label      string  `json:"label"`
	Scope      string  `json:"scope"`
}

type TopPerformer struct {
	Rank          int     `json:"rank"`
	StudentName   string  `json:"student_name"`
	RollNo        string  `json:"roll_no"`
	BalancePoints float64 `json:"balance_points"`
}

func normalizeYear(y string) string {
	y = strings.ToUpper(strings.TrimSpace(y))
	y = strings.TrimSuffix(y, "YEAR")
	y = strings.TrimSpace(y)
	switch y {
	case "1", "1ST", "FIRST", "I":
		return "I"
	case "2", "2ND", "SECOND", "II":
		return "II"
	case "3", "3RD", "THIRD", "III":
		return "III"
	case "4", "4TH", "FOURTH", "IV":
		return "IV"
	}
	if strings.HasPrefix(y, "IV") {
		return "IV"
	} else if strings.HasPrefix(y, "III") {
		return "III"
	} else if strings.HasPrefix(y, "II") {
		return "II"
	} else if strings.HasPrefix(y, "I") {
		return "I"
	}
	return y
}

func isSameDepartment(s studentmodels.Student, target *studentmodels.Student) bool {
	if s.Tab != "" && target.Tab != "" {
		if strings.EqualFold(strings.TrimSpace(s.Tab), strings.TrimSpace(target.Tab)) {
			return true
		}
	}
	sDept := normalize(s.Department)
	tDept := normalize(target.Department)
	if sDept != "" && tDept != "" {
		if sDept == tDept || strings.Contains(sDept, tDept) || strings.Contains(tDept, sDept) {
			return true
		}
	}
	if s.CourseCode != "" && target.CourseCode != "" && strings.EqualFold(s.CourseCode, target.CourseCode) {
		return true
	}
	return false
}

func calculateRankStat(cohort []studentmodels.Student, targetScore float64, getScore func(s studentmodels.Student) float64, label, scope string) RankStat {
	total := len(cohort)
	if total == 0 {
		return RankStat{
			Rank:       1,
			Total:      1,
			Percentile: 100,
			Label:      label,
			Scope:      scope,
		}
	}

	rank := 1
	var sumScore float64
	var maxScore float64

	for i, s := range cohort {
		score := getScore(s)
		if i == 0 || score > maxScore {
			maxScore = score
		}
		sumScore += score
		if score > targetScore {
			rank++
		}
	}

	avg := math.Round((sumScore/float64(total))*100) / 100

	pct := (float64(total-rank+1) / float64(total)) * 100
	pct = math.Round(pct*10) / 10

	return RankStat{
		Rank:       rank,
		Total:      total,
		Percentile: pct,
		TopScore:   maxScore,
		AvgScore:   avg,
		Label:      label,
		Scope:      scope,
	}
}

func (h *LeaderboardHandler) GetAllStudentsCached(forceRefresh bool) ([]studentmodels.Student, error) {
	if !forceRefresh {
		rankCacheMu.RLock()
		if cachedAllStudents != nil && time.Now().Before(rankCacheExpiry) {
			students := cachedAllStudents
			rankCacheMu.RUnlock()
			return students, nil
		}
		rankCacheMu.RUnlock()
	}

	rankCacheBuildMu.Lock()
	defer rankCacheBuildMu.Unlock()

	if !forceRefresh {
		rankCacheMu.RLock()
		if cachedAllStudents != nil && time.Now().Before(rankCacheExpiry) {
			students := cachedAllStudents
			rankCacheMu.RUnlock()
			return students, nil
		}
		rankCacheMu.RUnlock()
	}

	all, _ := h.sheet.fetchAllTabs()
	if len(all) == 0 {
		return nil, fmt.Errorf("no student records could be loaded from sheets")
	}

	rankCacheMu.Lock()
	cachedAllStudents = all
	rankCacheExpiry = time.Now().Add(rankCacheTTL)
	rankCacheMu.Unlock()

	return all, nil
}

func (h *LeaderboardHandler) GetStudentRank(c *gin.Context) {
	rollNo := strings.TrimSpace(c.Query("roll_no"))
	if rollNo == "" {
		rollNo = strings.TrimSpace(c.Query("rollNo"))
	}
	if rollNo == "" {
		rollNo = strings.TrimSpace(c.Query("q"))
	}
	if rollNo == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Query param 'roll_no' is required",
			"example": "/rank?roll_no=7376251CS221",
		})
		return
	}

	forceRefresh := c.Query("refresh") == "true"
	all, err := h.GetAllStudentsCached(forceRefresh)
	if err != nil || len(all) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":  "Unable to access Google Sheet or retrieve student records",
			"detail": fmt.Sprintf("%v", err),
		})
		return
	}

	targetRoll := normalizeRollNo(rollNo)
	var targetStudent *studentmodels.Student
	for i := range all {
		if normalizeRollNo(all[i].RollNo) == targetRoll {
			targetStudent = &all[i]
			break
		}
	}

	if targetStudent == nil {
		c.JSON(http.StatusNotFound, gin.H{
			"roll_no": rollNo,
			"error":   fmt.Sprintf("Student with roll number '%s' not found in reward points sheet", rollNo),
		})
		return
	}

	targetYear := normalizeYear(targetStudent.Year)
	targetTab := strings.ToUpper(strings.TrimSpace(targetStudent.Tab))
	if targetTab == "" {
		targetTab = strings.ToUpper(strings.TrimSpace(targetStudent.Department))
	}

	var deptYearCohort []studentmodels.Student
	var deptCohort []studentmodels.Student
	var yearCohort []studentmodels.Student
	var collegeCohort []studentmodels.Student

	for _, s := range all {
		if strings.TrimSpace(s.RollNo) == "" {
			continue
		}
		collegeCohort = append(collegeCohort, s)
		sYear := normalizeYear(s.Year)
		sameDept := isSameDepartment(s, targetStudent)

		if sameDept {
			deptCohort = append(deptCohort, s)
			if sYear == targetYear {
				deptYearCohort = append(deptYearCohort, s)
			}
		}
		if sYear == targetYear {
			yearCohort = append(yearCohort, s)
		}
	}

	targetBal := parseBalance(targetStudent.BalancePoints)
	targetCum := parseBalance(targetStudent.CumulativePoints)
	targetRedeemed := parseBalance(targetStudent.RedeemedPoints)

	// Balance-based ranks
	deptYearBalRank := calculateRankStat(deptYearCohort, targetBal, func(s studentmodels.Student) float64 {
		return parseBalance(s.BalancePoints)
	}, "Dept & Year Rank", fmt.Sprintf("%s Year • %s", targetYear, targetTab))

	deptBalRank := calculateRankStat(deptCohort, targetBal, func(s studentmodels.Student) float64 {
		return parseBalance(s.BalancePoints)
	}, "Department Rank", fmt.Sprintf("All %s", targetTab))

	yearBalRank := calculateRankStat(yearCohort, targetBal, func(s studentmodels.Student) float64 {
		return parseBalance(s.BalancePoints)
	}, "Year-wise Rank", fmt.Sprintf("All %s Year", targetYear))

	collegeBalRank := calculateRankStat(collegeCohort, targetBal, func(s studentmodels.Student) float64 {
		return parseBalance(s.BalancePoints)
	}, "College Overall Rank", "Entire College")

	// Cumulative-based ranks
	deptYearCumRank := calculateRankStat(deptYearCohort, targetCum, func(s studentmodels.Student) float64 {
		return parseBalance(s.CumulativePoints)
	}, "Dept & Year Rank (Earned)", fmt.Sprintf("%s Year • %s", targetYear, targetTab))

	deptCumRank := calculateRankStat(deptCohort, targetCum, func(s studentmodels.Student) float64 {
		return parseBalance(s.CumulativePoints)
	}, "Department Rank (Earned)", fmt.Sprintf("All %s", targetTab))

	yearCumRank := calculateRankStat(yearCohort, targetCum, func(s studentmodels.Student) float64 {
		return parseBalance(s.CumulativePoints)
	}, "Year-wise Rank (Earned)", fmt.Sprintf("All %s Year", targetYear))

	collegeCumRank := calculateRankStat(collegeCohort, targetCum, func(s studentmodels.Student) float64 {
		return parseBalance(s.CumulativePoints)
	}, "College Overall Rank (Earned)", "Entire College")

	// Top 3 in Dept & Year
	sortedDeptYear := make([]studentmodels.Student, len(deptYearCohort))
	copy(sortedDeptYear, deptYearCohort)
	sort.Slice(sortedDeptYear, func(i, j int) bool {
		return parseBalance(sortedDeptYear[i].BalancePoints) > parseBalance(sortedDeptYear[j].BalancePoints)
	})

	limit := 3
	if len(sortedDeptYear) < limit {
		limit = len(sortedDeptYear)
	}
	toppers := make([]TopPerformer, 0, limit)
	for i := 0; i < limit; i++ {
		toppers = append(toppers, TopPerformer{
			Rank:          i + 1,
			StudentName:   sortedDeptYear[i].StudentName,
			RollNo:        sortedDeptYear[i].RollNo,
			BalancePoints: parseBalance(sortedDeptYear[i].BalancePoints),
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"student": gin.H{
			"roll_no":           targetStudent.RollNo,
			"student_name":      targetStudent.StudentName,
			"department":        targetStudent.Department,
			"tab":               targetTab,
			"year":              targetStudent.Year,
			"normalized_year":   targetYear,
			"course_code":       targetStudent.CourseCode,
			"mentor_name":       targetStudent.MentorName,
			"balance_points":    targetBal,
			"cumulative_points": targetCum,
			"redeemed_points":   targetRedeemed,
		},
		"ranks": gin.H{
			"dept_year": deptYearBalRank,
			"dept":      deptBalRank,
			"year":      yearBalRank,
			"college":   collegeBalRank,
		},
		"cumulative_ranks": gin.H{
			"dept_year": deptYearCumRank,
			"dept":      deptCumRank,
			"year":      yearCumRank,
			"college":   collegeCumRank,
		},
		"toppers": toppers,
	})
}

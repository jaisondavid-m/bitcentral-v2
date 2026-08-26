package handlers

import (
	"net/http"
	"sort"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"

	"server/models"
)

type LeaderboardHandler struct {
	sheet *SheetHandler
}

func NewLeaderboardHandler(sheet *SheetHandler) *LeaderboardHandler {
	return &LeaderboardHandler{sheet: sheet}
}

type Top10Student struct {
	StudentName   string `json:"student_name"`
	RollNo        string `json:"roll_no"`
	Department    string `json:"department"`
	BalancePoints string `json:"balance_points"`
}

func toTop10(s models.Student) Top10Student {
	return Top10Student{
		StudentName:   s.StudentName,
		RollNo:        s.RollNo,
		Department:    s.Department,
		BalancePoints: s.BalancePoints,
	}
}

func parseBalance(s string) float64 {
	s = strings.ReplaceAll(s, ",", "")
	f, _ := strconv.ParseFloat(strings.TrimSpace(s), 64)
	return f
}

func normalize(s string) string {
	s = strings.ToUpper(s)
	s = strings.ReplaceAll(s, "&", "AND")
	s = strings.ReplaceAll(s, " ", "")
	return s
}

func findTab(dept string, tabs []string) string {
	deptNorm := normalize(dept)

	for _, tab := range tabs {
		tabNorm := normalize(tab)
		if tabNorm == deptNorm {
			return tab
		}
		if strings.Contains(tabNorm, deptNorm) || strings.Contains(deptNorm, tabNorm) {
			return tab
		}
	}

	return ""
}

func filterByYear(students []models.Student, year string) []models.Student {
	if year == "" {
		return students
	}
	var out []models.Student
	for _, s := range students {
		if strings.EqualFold(s.Year, year) {
			out = append(out, s)
		}
	}
	return out
}

func top10Sorted(students []models.Student) []models.Student {
	sort.Slice(students, func(i, j int) bool {
		return parseBalance(students[i].BalancePoints) > parseBalance(students[j].BalancePoints)
	})
	if len(students) > 10 {
		return students[:10]
	}
	return students
}

func (h *LeaderboardHandler) GetTop10Students(c *gin.Context) {
	year := strings.TrimSpace(c.Query("year"))
	dept := strings.TrimSpace(c.Query("dept"))

	if year == "" && dept == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Provide at least one filter: 'year' or 'dept'",
			"example": "/top10?year=III  or  /top10?dept=CSE  or  /top10?year=III&dept=CSE",
		})
		return
	}

	var (
		students []models.Student
		errs     []string
	)

	if dept != "" {
		tab := findTab(dept, h.sheet.tabs)
		if tab == "" {
			c.JSON(http.StatusNotFound, gin.H{
				"dept":      dept,
				"message":   "No department tab found matching that name",
				"available": h.sheet.tabs,
			})
			return
		}

		rows, err := h.sheet.fetchSheetRows(tab, "A1:J9999")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
			})
			return
		}
		students = filterByYear(rows, year)

	} else {
		all, e := h.sheet.fetchAllTabs()
		errs = e
		students = filterByYear(all, year)
	}
	if len(students) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"year":    year,
			"dept":    dept,
			"message": "No students found for the given filters",
		})
		return
	}

	top := top10Sorted(students)

	results := make([]Top10Student, len(top))
	for i, s := range top {
		results[i] = toTop10(s)
	}

	resp := gin.H{
		"year":          year,
		"dept":          dept,
		"total":         len(results),
		"data":          results,
		"data_complete": len(errs) == 0,
	}
	if len(errs) > 0 {
		resp["warnings"] = errs
	}

	c.JSON(http.StatusOK, resp)
}
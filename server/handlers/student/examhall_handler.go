package student

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"server/config"
)

type ExamHallHandler struct{}


func NewExamHallHandler() *ExamHallHandler {
    return &ExamHallHandler{}
}

func (h *ExamHallHandler) GetHall(c *gin.Context) {
    registerNo := c.Query("registerNo")
    courseCode := c.Query("courseCode")

    if strings.TrimSpace(registerNo) == "" || strings.TrimSpace(courseCode) == "" {
        c.JSON(http.StatusBadRequest, gin.H{
            "success": false,
            "message": "registerNo and courseCode query parameters are required",
        })
        return
    }

    hall, found := LookupHall(registerNo, courseCode)
    if !found {
        c.JSON(http.StatusNotFound, gin.H{
            "success": false,
            "message": "exam hall not found for the provided register number and course code",
        })
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "success":    true,
        "hallNo":     hall,
        "registerNo": strings.TrimSpace(registerNo),
        "courseCode": strings.TrimSpace(courseCode),
    })
}

// hallBlock maps the prefix of a hall number to a human-readable block label.
// Returns nil when the prefix is unrecognised so the JSON field is null.
func hallBlock(hallNo string) *string {
	upper := strings.ToUpper(strings.TrimSpace(hallNo))

	var label string
	switch {
	case strings.HasPrefix(upper, "AE"):
		label = "Research Park - Right Side"
	case strings.HasPrefix(upper, "EW"):
		label = "AS Block"
	case strings.HasPrefix(upper, "WW"):
		label = "IB Block"
	case strings.HasPrefix(upper, "MH"):
		label = "Research Park - Left Side"
	case strings.HasPrefix(upper, "ME") || strings.HasPrefix(upper, "MECH"):
		label = "Mechanical Block"
	case strings.HasPrefix(upper, "SF"):
		label = "SunFlower(SF) Block"
	case strings.HasPrefix(upper, "CC"):
		label = "Mechanical Block"
	case strings.HasPrefix(upper, "CSE"):
		label = "SunFlower(SF) Block"
	case strings.HasPrefix(upper, "AIML"):
		label = "-"
	case strings.HasPrefix(upper, "IT"):
		label = "-"
	case strings.HasPrefix(upper, "DIGITAL") || strings.HasPrefix(upper, "ANALOG") || strings.HasPrefix(upper, "COMMUNICATION") || strings.HasPrefix(upper, "COMMM"):
		label = "-"
	case strings.HasPrefix(upper, "AI BASED"):
		label = "AS Block"
	case strings.HasPrefix(upper, "LATHE"):
		label = "Mechanical Block"
	case strings.HasPrefix(upper, "THERMAL"):
		label = "Mechanical Block"
	default:
		return nil
	}

	return &label
}

func (h *ExamHallHandler) GetAllHallsByRegNo(c *gin.Context) {
	registerNo := c.Query("registerNo")

	if strings.TrimSpace(registerNo) == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "registerNo query parameter is required",
		})
		return
	}

	sessions := LookupAllByRegister(registerNo)
	if len(sessions) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"success":    false,
			"message":    "no exam sessions found for the provided register number",
			"registerNo": strings.TrimSpace(strings.ToUpper(registerNo)),
		})
		return
	}

	// Attach block label to every session
	for i := range sessions {
		sessions[i].Block = hallBlock(sessions[i].HallNo)
	}

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"registerNo": strings.TrimSpace(strings.ToUpper(registerNo)),
		"sessions":   sessions,
	})
}

func fetchStudentNames(db *sql.DB, regNos []string) map[string]string {
	names := make(map[string]string)
	if db == nil || len(regNos) == 0 {
		return names
	}

	chunkSize := 50
	for i := 0; i < len(regNos); i += chunkSize {
		end := i + chunkSize
		if end > len(regNos) {
			end = len(regNos)
		}
		chunk := regNos[i:end]
		placeholders := make([]string, len(chunk))
		args := make([]interface{}, len(chunk))
		for j, reg := range chunk {
			placeholders[j] = "?"
			args[j] = strings.ToUpper(strings.TrimSpace(reg))
		}

		query := fmt.Sprintf("SELECT UPPER(TRIM(user_id)), name FROM tracker_users WHERE UPPER(TRIM(user_id)) IN (%s)", strings.Join(placeholders, ","))
		rows, err := db.Query(query, args...)
		if err != nil {
			continue
		}
		for rows.Next() {
			var uid, name string
			if err := rows.Scan(&uid, &name); err == nil && name != "" {
				names[uid] = strings.TrimSpace(name)
			}
		}
		rows.Close()
	}

	return names
}

func (h *ExamHallHandler) GetHallMembers(c *gin.Context) {
	hallNo := c.Query("hall")
	if hallNo == "" {
		hallNo = c.Query("hallNo")
	}
	if hallNo == "" {
		hallNo = c.Query("hall_no")
	}

	if strings.TrimSpace(hallNo) == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "hall query parameter is required (e.g. ?hall=WW 214)",
		})
		return
	}

	date := c.Query("date")
	session := c.Query("session")
	timeStr := c.Query("time")

	resp, found := LookupHallMembers(hallNo, date, session, timeStr)
	if !found {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": fmt.Sprintf("no seating arrangement found for hall %s", strings.TrimSpace(hallNo)),
			"hall_no": strings.TrimSpace(hallNo),
		})
		return
	}

	// Attach block label
	resp.Block = hallBlock(resp.HallNo)

	// Enrich student names from DB if available
	if config.DB != nil && len(resp.Members) > 0 {
		regNos := make([]string, len(resp.Members))
		for i, m := range resp.Members {
			regNos[i] = m.RegisterNo
		}
		nameMap := fetchStudentNames(config.DB, regNos)
		for i := range resp.Members {
			if name, ok := nameMap[resp.Members[i].RegisterNo]; ok && name != "" {
				resp.Members[i].Name = name
			}
		}
	}

	c.JSON(http.StatusOK, resp)
}


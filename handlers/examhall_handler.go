package handlers

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"
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
		label = "Research Block - Right Side"
	case strings.HasPrefix(upper, "EW"):
		label = "AS Block"
	case strings.HasPrefix(upper, "WW"):
		label = "IB Block"
	case strings.HasPrefix(upper, "MH"):
		label = "Research Block - Left Side"
	case strings.HasPrefix(upper, "ME") || strings.HasPrefix(upper, "MECH"):
		label = "Mechanical Block"
	case strings.HasPrefix(upper, "SF"):
		label = "SunFlower(SF) Block"
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
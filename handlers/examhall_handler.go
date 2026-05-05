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

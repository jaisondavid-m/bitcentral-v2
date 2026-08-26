package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"server/data"
	"server/models"
)

type LeaveHandler struct{}

func NewLeaveHandler() *LeaveHandler {
	return &LeaveHandler{}
}

func (h *LeaveHandler) GetAllLeaves(c *gin.Context) {
	processedHolidays := make([]models.Holiday, len(data.Holidays))
	for i, hol := range data.Holidays {
		processedHolidays[i] = hol
		if strings.HasSuffix(hol.FromDate, "(AN)") {
			processedHolidays[i].FromDate = strings.TrimSuffix(hol.FromDate, "(AN)")
			processedHolidays[i].FromHalfDay = "AN"
		} else if strings.HasSuffix(hol.FromDate, "(FN)") {
			processedHolidays[i].FromDate = strings.TrimSuffix(hol.FromDate, "(FN)")
			processedHolidays[i].FromHalfDay = "FN"
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"count":   len(processedHolidays),
		"data":    processedHolidays,
	})
}
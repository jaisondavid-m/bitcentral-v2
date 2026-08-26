package handlers

import (
	"net/http"
	"strings"

	"server/config"

	"github.com/gin-gonic/gin"
)

type PresenceHandler struct {
	Admin *AdminHandler
}

func NewPresenceHandler(admin *AdminHandler) *PresenceHandler {
	return &PresenceHandler{Admin: admin}
}

func (h *PresenceHandler) Ping(c *gin.Context) {
	var payload struct {
		RouteLabel string `json:"routeLabel"`
	}

	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
		return
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		payload.RouteLabel = ""
	}
	if payload.RouteLabel = strings.TrimSpace(payload.RouteLabel); payload.RouteLabel == "" {
		payload.RouteLabel = "Other"
	}

	client, err := config.FirebaseAuthClient()
	if err != nil || client == nil {
		msg := "Failed to initialize Firebase auth"
		if err != nil {
			msg = "Failed to initialize Firebase auth: " + err.Error()
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": msg})
		return
	}

	decodedToken, err := client.VerifyIDToken(c.Request.Context(), token)
	if err != nil || decodedToken == nil || decodedToken.UID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
		return
	}

	if err := h.Admin.TouchUserPresence(decodedToken.UID, payload.RouteLabel); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

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
	authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer"))
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
		return
	}

	client, err := config.FirebaseAuthClient()
	if err != nil || client == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to initialize Firebase auth"})
		return
	}

	decodedToken, err := client.VerifyIDToken(c.Request.Context(), token)
	if err != nil || decodedToken == nil || decodedToken.UID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Unauthorized"})
		return
	}

	if err := h.Admin.TouchUserPresence(decodedToken.UID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

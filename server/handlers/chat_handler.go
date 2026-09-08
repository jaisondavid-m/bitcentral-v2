package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type ChatHandler struct {
	MCPServerURL string
	HTTPClient   *http.Client
}

func NewChatHandler() *ChatHandler {
	mcpURL := os.Getenv("MCP_SERVER_URL")
	if mcpURL == "" {
		mcpURL = os.Getenv("BITCENTRAL_MCP_URL")
	}
	if mcpURL == "" {
		mcpURL = "https://mcp-bitcentral.bitsathy.in"
	}
	mcpURL = strings.TrimRight(mcpURL, "/")

	return &ChatHandler{
		MCPServerURL: mcpURL,
		HTTPClient: &http.Client{
			Timeout: 120 * time.Second,
		},
	}
}

type ChatPayload struct {
	Message string        `json:"message" binding:"required"`
	History []interface{} `json:"history"`
	RollNo  string        `json:"roll_no"`
}

func (h *ChatHandler) HandleChat(c *gin.Context) {
	var body ChatPayload
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "Message parameter is required in request body",
		})
		return
	}

	payloadBytes, err := json.Marshal(body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to encode chat request",
		})
		return
	}

	mcpURL := os.Getenv("MCP_SERVER_URL")
	if mcpURL == "" {
		mcpURL = h.MCPServerURL
	}
	targetURL := fmtChatURL(mcpURL)
	req, err := http.NewRequestWithContext(c.Request.Context(), http.MethodPost, targetURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to construct proxy request",
		})
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "BitCentral-Backend/1.0")

	resp, err := h.HTTPClient.Do(req)
	if err != nil {
		log.Printf("⚠️ MCP VPS Chat server unreachable (%s): %v", targetURL, err)
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"success": false,
			"error":   fmt.Sprintf("BitBot AI Assistant on VPS unreachable (%s): %v", targetURL, err),
		})
		return
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"error":   "Failed to read MCP server response",
		})
		return
	}

	var jsonResp map[string]interface{}
	if err := json.Unmarshal(respBytes, &jsonResp); err != nil {
		c.JSON(http.StatusOK, gin.H{
			"success": true,
			"message": string(respBytes),
		})
		return
	}

	c.JSON(resp.StatusCode, jsonResp)
}

func fmtChatURL(baseURL string) string {
	if strings.HasSuffix(baseURL, "/api/chat") || strings.HasSuffix(baseURL, "/chat") {
		return baseURL
	}
	return baseURL + "/api/chat"
}

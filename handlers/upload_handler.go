package handlers

import (
	"fmt"
	"net/http"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

type UploadHandler struct {
	UploadDir string
}

func NewUploadHandler() *UploadHandler {
	return &UploadHandler{UploadDir: "uploads"}
}

// POST /admin/upload (multipart form, field name: file)
func (h *UploadHandler) Upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "file is required"})
		return
	}

	// ensure upload directory exists
	if err := os.MkdirAll(h.UploadDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	safeName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
	dst := filepath.Join(h.UploadDir, safeName)

	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	// return a path that the server will serve at /uploads/<name>
	urlPath := "/uploads/" + safeName
	c.JSON(http.StatusOK, gin.H{"success": true, "url": urlPath})
}

// GET /pdf/:id  - proxy Google Drive file bytes by file ID
func (h *UploadHandler) ProxyPDF(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "id is required"})
		return
	}

	// construct drive direct download URL
	url := fmt.Sprintf("https://drive.google.com/uc?export=download&id=%s", id)

	client := &http.Client{}
	resp, err := client.Get(url)
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		// pass through status and body
		c.Status(resp.StatusCode)
		io.Copy(c.Writer, resp.Body)
		return
	}

	// Optionally force download
	if c.Query("download") != "" {
		c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", id))
	} else {
		c.Header("Content-Disposition", "inline")
	}

	if ct := resp.Header.Get("Content-Type"); ct != "" {
		c.Header("Content-Type", ct)
	} else {
		c.Header("Content-Type", "application/octet-stream")
	}

	// Stream body
	c.Status(http.StatusOK)
	io.Copy(c.Writer, resp.Body)
}

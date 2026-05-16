package handlers

import (
    "fmt"
    "net/http"
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

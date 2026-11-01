package middleware

import (
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"

	"server/config"
	"server/utils"
)

// FacultyPhotoAccess validates access to faculty photos stored on the server
func FacultyPhotoAccess() gin.HandlerFunc {
	// Base directory for faculty photos
	photoDir := filepath.Join("data", "faculty_photos")
	absPhotoDir, err := filepath.Abs(photoDir)
	if err != nil {
		absPhotoDir = photoDir
	}

	return func(c *gin.Context) {
		// 1. Authentication & Authorization check
		isAuthorized := false

		// Check internal service request
		if utils.IsInternalServiceRequest(c) {
			isAuthorized = true
		}

		// Check token in header, cookies, or query parameter (?token=...)
		if !isAuthorized {
			token := utils.ExtractAuthToken(c)
			if token != "" {
				claims, err := config.VerifyGoogleToken(token)
				if err == nil && claims != nil {
					isAuthorized = true
					c.Set("user", claims)
				}
			}
		}

		// Also permit requests originating from approved BitCentral frontend origins / referers
		if !isAuthorized {
			origin := c.GetHeader("Origin")
			referer := c.GetHeader("Referer")
			if isAllowedOriginOrReferer(origin, referer) {
				isAuthorized = true
			}
		}

		if !isAuthorized {
			c.JSON(http.StatusUnauthorized, gin.H{
				"success": false,
				"message": "Authentication required to access faculty photos",
			})
			c.Abort()
			return
		}

		// 2. Validate and sanitize filename parameter
		rawFilename := c.Param("filename")
		if rawFilename == "" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Filename is required"})
			c.Abort()
			return
		}

		// Decode URL path component if needed
		decodedFilename, err := url.PathUnescape(rawFilename)
		if err != nil {
			decodedFilename = rawFilename
		}

		// Sanitize to prevent path traversal attacks (e.g., ../ or ..\)
		cleanFilename := filepath.Base(filepath.Clean(decodedFilename))
		if cleanFilename == "." || cleanFilename == "/" || cleanFilename == "\\" || strings.Contains(cleanFilename, "..") {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid file name"})
			c.Abort()
			return
		}

		// Check allowed image extensions
		ext := strings.ToLower(filepath.Ext(cleanFilename))
		if ext != ".webp" && ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid image extension"})
			c.Abort()
			return
		}

		// Build target absolute path and verify directory containment
		targetPath := filepath.Join(absPhotoDir, cleanFilename)
		cleanTargetPath := filepath.Clean(targetPath)
		if !strings.HasPrefix(cleanTargetPath, absPhotoDir) {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Access denied"})
			c.Abort()
			return
		}

		// 3. Verify file exists
		fileInfo, err := os.Stat(cleanTargetPath)
		if err != nil || fileInfo.IsDir() {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Faculty photo not found"})
			c.Abort()
			return
		}

		// 4. Set security, caching, and CORS headers
		c.Header("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800")
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("Access-Control-Allow-Origin", "*")

		// Pass the validated path to the handler
		c.Set("faculty_photo_path", cleanTargetPath)
		c.Next()
	}
}

func isAllowedOriginOrReferer(origin, referer string) bool {
	check := func(str string) bool {
		s := strings.ToLower(str)
		if s == "" {
			return false
		}
		return strings.Contains(s, "localhost") ||
			strings.Contains(s, "127.0.0.1") ||
			strings.Contains(s, "bitsathy.in") ||
			strings.Contains(s, "bitsathy.ac.in") ||
			strings.Contains(s, "bitcentral") ||
			strings.Contains(s, "vercel.app") ||
			strings.Contains(s, "netlify.app") ||
			strings.Contains(s, "pages.dev") ||
			strings.Contains(s, "jaisondavidm.xyz")
	}
	return check(origin) || check(referer)
}


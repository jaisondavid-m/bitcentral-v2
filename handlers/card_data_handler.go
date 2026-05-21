package handlers

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"

	"server/config"
	"server/models"

	"github.com/gin-gonic/gin"
)

type CardHandler struct{}

func NewCardHandler() *CardHandler {
	return &CardHandler{}
}

func GetCards(c *gin.Context) {
	rows, err := config.DB.Query(`SELECT id, img, name, keywords, link, btntext FROM cards ORDER BY id ASC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer rows.Close()

	var cards []models.Card
	for rows.Next() {
		var id int
		var img, name, link, btntext string
		var keywords sql.NullString
		if err := rows.Scan(&id, &img, &name, &keywords, &link, &btntext); err != nil {
			continue
		}
		var kw []string
		if keywords.Valid && keywords.String != "" {
			_ = json.Unmarshal([]byte(keywords.String), &kw)
		}
		cards = append(cards, models.Card{
			ID:       id,
			Image:    img,
			Name:     name,
			Keywords: kw,
			Link:     link,
			BtnText:  btntext,
		})
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "count": len(cards), "data": cards})
}

// Admin: Create card
func CreateCard(c *gin.Context) {
	var payload models.Card
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid payload"})
		return
	}
	kwBytes, _ := json.Marshal(payload.Keywords)
	res, err := config.DB.Exec(`INSERT INTO cards (img, name, keywords, link, btntext) VALUES (?, ?, ?, ?, ?)`, payload.Image, payload.Name, string(kwBytes), payload.Link, payload.BtnText)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	id, _ := res.LastInsertId()
	payload.ID = int(id)
	c.JSON(http.StatusOK, gin.H{"success": true, "data": payload})
}

// Admin: Update card
func UpdateCard(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid id"})
		return
	}
	var payload models.Card
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid payload"})
		return
	}
	kwBytes, _ := json.Marshal(payload.Keywords)
	_, err = config.DB.Exec(`UPDATE cards SET img=?, name=?, keywords=?, link=?, btntext=? WHERE id=?`, payload.Image, payload.Name, string(kwBytes), payload.Link, payload.BtnText, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "data": payload})
}

// Admin: Delete card
func DeleteCard(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid id"})
		return
	}
	_, err = config.DB.Exec(`DELETE FROM cards WHERE id=?`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

// UploadCardImage accepts a multipart file and returns a base64 data URL
func UploadCardImage(c *gin.Context) {
	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "file is required"})
		return
	}
	defer file.Close()

	// read file bytes
	buf := make([]byte, header.Size)
	n, err := file.Read(buf)
	if err != nil && err != multipart.ErrMessageTooLarge && err.Error() != "EOF" {
		// try reading with alternative method
		// fall back to reading remaining bytes
	}
	data := buf[:n]

	// try to detect mime type from filename extension
	mime := "application/octet-stream"
	if idx := strings.LastIndex(header.Filename, "."); idx != -1 {
		ext := strings.ToLower(header.Filename[idx+1:])
		switch ext {
		case "png":
			mime = "image/png"
		case "jpg", "jpeg":
			mime = "image/jpeg"
		case "gif":
			mime = "image/gif"
		case "webp":
			mime = "image/webp"
		}
	}

	b64 := base64.StdEncoding.EncodeToString(data)
	dataURL := "data:" + mime + ";base64," + b64

	c.JSON(http.StatusOK, gin.H{"success": true, "data": gin.H{"base64": dataURL}})
}

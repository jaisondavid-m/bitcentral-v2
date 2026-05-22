package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

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

package handlers

import (
	"database/sql"
	"encoding/json"
	"errors"
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
	rows, err := config.DB.Query(`SELECT id, card_order, img, name, keywords, link, btntext, click_count FROM cards ORDER BY card_order ASC, id ASC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer rows.Close()

	var cards []models.Card
	for rows.Next() {
		var id, order int
		var clickCount int
		var img, name, link, btntext string
		var keywords sql.NullString
		if err := rows.Scan(&id, &order, &img, &name, &keywords, &link, &btntext, &clickCount); err != nil {
			continue
		}
		var kw []string
		if keywords.Valid && keywords.String != "" {
			_ = json.Unmarshal([]byte(keywords.String), &kw)
		}
		cards = append(cards, models.Card{
			ID:       id,
			Order:    order,
			Image:    img,
			Name:     name,
			Keywords: kw,
			Link:     link,
			BtnText:  btntext,
			ClickCount: clickCount,
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
	if payload.Order <= 0 {
		if err := config.DB.QueryRow(`SELECT COALESCE(MAX(card_order), 0) + 1 FROM cards`).Scan(&payload.Order); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
			return
		}
	}
	kwBytes, _ := json.Marshal(payload.Keywords)
	res, err := config.DB.Exec(`INSERT INTO cards (card_order, img, name, keywords, link, btntext) VALUES (?, ?, ?, ?, ?, ?)`, payload.Order, payload.Image, payload.Name, string(kwBytes), payload.Link, payload.BtnText)
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
	if payload.Order <= 0 {
		if err := config.DB.QueryRow(`SELECT card_order FROM cards WHERE id=?`, id).Scan(&payload.Order); err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "card not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
			return
		}
	}
	kwBytes, _ := json.Marshal(payload.Keywords)
	_, err = config.DB.Exec(`UPDATE cards SET card_order=?, img=?, name=?, keywords=?, link=?, btntext=? WHERE id=?`, payload.Order, payload.Image, payload.Name, string(kwBytes), payload.Link, payload.BtnText, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	payload.ID = id
	c.JSON(http.StatusOK, gin.H{"success": true, "data": payload})
}

// Public: Track card click
func TrackCardClick(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid id"})
		return
	}

	res, err := config.DB.Exec(`UPDATE cards SET click_count = click_count + 1 WHERE id = ?`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	affected, _ := res.RowsAffected()
	if affected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "error": "card not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
}

// Admin: Reorder cards
func ReorderCards(c *gin.Context) {
	var payload struct {
		CardIDs []int `json:"card_ids"`
	}
	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid payload"})
		return
	}
	if len(payload.CardIDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "card_ids cannot be empty"})
		return
	}

	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`UPDATE cards SET card_order=? WHERE id=?`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer stmt.Close()

	for index, cardID := range payload.CardIDs {
		if _, err := stmt.Exec(index+1, cardID); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true})
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

	rows, err := config.DB.Query(`SELECT id FROM cards ORDER BY card_order ASC, id ASC`)
	if err == nil {
		defer rows.Close()
		position := 1
		for rows.Next() {
			var cardID int
			if scanErr := rows.Scan(&cardID); scanErr != nil {
				continue
			}
			_, _ = config.DB.Exec(`UPDATE cards SET card_order=? WHERE id=?`, position, cardID)
			position++
		}
	}
	c.JSON(http.StatusOK, gin.H{"success": true})
}

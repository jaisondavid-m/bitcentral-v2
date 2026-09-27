package handlers

import (
	"database/sql"
	"encoding/csv"
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"path/filepath"
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
	rows, err := config.DB.Query(`SELECT id, card_order, img, name, keywords, link, COALESCE(app_route, ''), btntext, click_count FROM cards ORDER BY card_order ASC, id ASC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer rows.Close()

	var cards []models.Card
	for rows.Next() {
		var id, order int
		var clickCount int
		var img, name, link, appRoute, btntext string
		var keywords sql.NullString
		if err := rows.Scan(&id, &order, &img, &name, &keywords, &link, &appRoute, &btntext, &clickCount); err != nil {
			continue
		}
		var kw []string
		if keywords.Valid && keywords.String != "" {
			_ = json.Unmarshal([]byte(keywords.String), &kw)
		}
		cards = append(cards, models.Card{
			ID:         id,
			Order:      order,
			Image:      img,
			Name:       name,
			Keywords:   kw,
			Link:       link,
			AppRoute:   appRoute,
			BtnText:    btntext,
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
	res, err := config.DB.Exec(`INSERT INTO cards (card_order, img, name, keywords, link, app_route, btntext) VALUES (?, ?, ?, ?, ?, ?, ?)`, payload.Order, payload.Image, payload.Name, string(kwBytes), payload.Link, payload.AppRoute, payload.BtnText)
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
	_, err = config.DB.Exec(`UPDATE cards SET card_order=?, img=?, name=?, keywords=?, link=?, app_route=?, btntext=? WHERE id=?`, payload.Order, payload.Image, payload.Name, string(kwBytes), payload.Link, payload.AppRoute, payload.BtnText, id)
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

func parseCardsCSV(reader io.Reader) ([]models.Card, error) {
	csvReader := csv.NewReader(reader)
	csvReader.FieldsPerRecord = -1
	csvReader.TrimLeadingSpace = true
	csvReader.LazyQuotes = true
	records, err := csvReader.ReadAll()
	if err != nil {
		return nil, err
	}
	if len(records) < 2 {
		return nil, errors.New("CSV must contain a header row and at least one data row")
	}

	headerMap := make(map[string]int)
	for i, col := range records[0] {
		clean := strings.ToLower(strings.TrimSpace(col))
		clean = strings.Trim(clean, `"'`)
		headerMap[clean] = i
	}

	getVal := func(row []string, names ...string) string {
		for _, name := range names {
			if idx, ok := headerMap[name]; ok && idx < len(row) {
				return strings.TrimSpace(row[idx])
			}
		}
		return ""
	}

	var cards []models.Card
	for i := 1; i < len(records); i++ {
		row := records[i]
		if len(row) == 0 || (len(row) == 1 && strings.TrimSpace(row[0]) == "") {
			continue
		}

		name := getVal(row, "name", "card_name", "title")
		if name == "" {
			continue
		}

		orderStr := getVal(row, "card_order", "order", "position")
		order, _ := strconv.Atoi(orderStr)

		clicksStr := getVal(row, "click_count", "clicks", "clickcount", "count")
		clicks, _ := strconv.Atoi(clicksStr)

		idStr := getVal(row, "id", "card_id")
		id, _ := strconv.Atoi(idStr)

		img := getVal(row, "img", "image", "icon", "icon_url")
		link := getVal(row, "link", "url", "website")
		appRoute := getVal(row, "app_route", "route", "approute", "app_redirection_route")
		btnText := getVal(row, "btntext", "btn_text", "button_text", "button")

		kwRaw := getVal(row, "keywords", "keyword", "tags", "tag")
		var kwList []string
		if kwRaw != "" {
			if strings.HasPrefix(kwRaw, "[") && strings.HasSuffix(kwRaw, "]") {
				_ = json.Unmarshal([]byte(kwRaw), &kwList)
			}
			if len(kwList) == 0 {
				parts := strings.Split(kwRaw, ",")
				for _, p := range parts {
					cleaned := strings.TrimSpace(p)
					cleaned = strings.Trim(cleaned, `"'[]`)
					if cleaned != "" {
						kwList = append(kwList, cleaned)
					}
				}
			}
		}

		cards = append(cards, models.Card{
			ID:         id,
			Order:      order,
			ClickCount: clicks,
			Image:      img,
			Name:       name,
			Keywords:   kwList,
			Link:       link,
			AppRoute:   appRoute,
			BtnText:    btnText,
		})
	}

	return cards, nil
}

// Admin: Bulk upload cards via CSV or JSON file or JSON payload
func BulkUploadCards(c *gin.Context) {
	var cardsToImport []models.Card
	mode := "append"

	contentType := c.GetHeader("Content-Type")

	if strings.Contains(contentType, "multipart/form-data") {
		file, fileHeader, err := c.Request.FormFile("file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "file is required in multipart form"})
			return
		}
		defer file.Close()

		if formMode := c.Request.FormValue("mode"); formMode != "" {
			mode = strings.ToLower(strings.TrimSpace(formMode))
		}

		ext := strings.ToLower(filepath.Ext(fileHeader.Filename))
		if ext == ".csv" {
			parsed, err := parseCardsCSV(file)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "failed to parse CSV: " + err.Error()})
				return
			}
			cardsToImport = parsed
		} else if ext == ".json" {
			body, err := io.ReadAll(file)
			if err != nil {
				c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "failed to read JSON file: " + err.Error()})
				return
			}
			var arr []models.Card
			if err := json.Unmarshal(body, &arr); err == nil {
				cardsToImport = arr
			} else {
				var obj struct {
					Mode  string        `json:"mode"`
					Cards []models.Card `json:"cards"`
				}
				if err2 := json.Unmarshal(body, &obj); err2 == nil {
					cardsToImport = obj.Cards
					if obj.Mode != "" {
						mode = strings.ToLower(strings.TrimSpace(obj.Mode))
					}
				} else {
					c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid JSON format. Expected an array of cards or { cards: [...] }"})
					return
				}
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "unsupported file format. Only .csv and .json are supported"})
			return
		}
	} else {
		body, err := io.ReadAll(c.Request.Body)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "failed to read request body"})
			return
		}

		var arr []models.Card
		if err := json.Unmarshal(body, &arr); err == nil {
			cardsToImport = arr
		} else {
			var obj struct {
				Mode  string        `json:"mode"`
				Cards []models.Card `json:"cards"`
			}
			if err2 := json.Unmarshal(body, &obj); err2 == nil {
				cardsToImport = obj.Cards
				if obj.Mode != "" {
					mode = strings.ToLower(strings.TrimSpace(obj.Mode))
				}
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "invalid JSON payload. Provide an array of cards or { cards: [...], mode: 'append'|'replace' }"})
				return
			}
		}
	}

	if len(cardsToImport) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "no valid card records found to import"})
		return
	}

	var validCards []models.Card
	for _, card := range cardsToImport {
		card.Name = strings.TrimSpace(card.Name)
		if card.Name == "" {
			continue
		}
		if card.Keywords == nil {
			card.Keywords = []string{}
		}
		validCards = append(validCards, card)
	}

	if len(validCards) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "error": "no cards with a valid 'name' field found"})
		return
	}

	tx, err := config.DB.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer tx.Rollback()

	if mode == "replace" {
		if _, err := tx.Exec("DELETE FROM cards"); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "failed to clear existing cards: " + err.Error()})
			return
		}
	}

	var currentMaxOrder int
	if mode != "replace" {
		_ = tx.QueryRow("SELECT COALESCE(MAX(card_order), 0) FROM cards").Scan(&currentMaxOrder)
	}

	stmtWithID, err := tx.Prepare(`
		INSERT INTO cards (id, card_order, click_count, img, name, keywords, link, app_route, btntext)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE card_order=VALUES(card_order), click_count=VALUES(click_count), img=VALUES(img), name=VALUES(name), keywords=VALUES(keywords), link=VALUES(link), app_route=VALUES(app_route), btntext=VALUES(btntext)
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer stmtWithID.Close()

	stmtNoID, err := tx.Prepare(`
		INSERT INTO cards (card_order, click_count, img, name, keywords, link, app_route, btntext)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": err.Error()})
		return
	}
	defer stmtNoID.Close()

	insertedCount := 0
	for _, card := range validCards {
		kwBytes, _ := json.Marshal(card.Keywords)
		order := card.Order
		if order <= 0 {
			currentMaxOrder++
			order = currentMaxOrder
		} else if order > currentMaxOrder {
			currentMaxOrder = order
		}

		if card.ID > 0 {
			_, err = stmtWithID.Exec(card.ID, order, card.ClickCount, card.Image, card.Name, string(kwBytes), card.Link, card.AppRoute, card.BtnText)
		} else {
			_, err = stmtNoID.Exec(order, card.ClickCount, card.Image, card.Name, string(kwBytes), card.Link, card.AppRoute, card.BtnText)
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "failed to insert card '" + card.Name + "': " + err.Error()})
			return
		}
		insertedCount++
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "error": "failed to commit transaction: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": strconv.Itoa(insertedCount) + " cards successfully uploaded",
		"count":   insertedCount,
		"mode":    mode,
	})
}

package handlers

import (
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"net/http"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"server/config"
)

// Meal timing windows (IST — adjust as needed)
var mealTimings = map[string][2]string{
	"Breakfast": {"07:00", "08:30"},
	"Lunch":     {"12:20", "13:30"},
	"Dinner":    {"19:00", "20:30"},
}

// defaultMessMenus is auto-predicted from May 2026 mess menu data.
// Items are selected based on recurrence frequency across all sampled weeks.
// Prediction confidence shown as comments (% of weeks the item appeared).
var defaultMessMenus = map[string]map[string]map[string][]string{
	"boys": {
		"Monday": {
			"breakfast": {"Curry Leaves podi uthappam", "Sambar", "Bread / Avul upma", "Malli chutney", "Idly podi with gingelly oil", "Coffee/Milk/Tea"},
			"lunch":     {"Rice", "Dhall Fry (North Indian Style)", "Puli Rasam", "Payasam (Semiya)", "Paruppuvadai + Ash gourd kootu", "Buttermilk"},
			"dinner":    {"Rumali rotti", "Veg Kuruma", "Tomato Rice", "Onion raita", "Curd rice", "Banana"},
		},
		"Tuesday": {
			"breakfast": {"Kambu Idly", "Lapsi Sweet", "Rava Kitchadi (White)", "Tomato kuruma", "Groundnut chutney", "Idly podi with gingelly oil", "Coffee/Milk/Tea"},
			"lunch":     {"Rice", "Black Sundal kalambu", "Dhall Rasam", "Beetroot Poriyal", "Curd", "Appalam"},
			"dinner":    {"Kal dosai (Potato masala)", "Noodles", "Kumbakonam Kadappa", "Coconut chutney", "Tomato Sauce", "Curd rice", "Rasna mango flavor"},
		},
		"Wednesday": {
			"breakfast": {"Venpongal", "Semiya Biryani", "Meduvadai", "Sambar", "Veg chutney", "Coffee/Milk/Tea"},
			"lunch":     {"Rice", "Pattani Tomato Bath", "Mysore Rasam", "Curd rice", "Buttermilk", "Vadagam", "Pickle"},
			"dinner":    {"Chapatti", "Mint Rice", "Egg pepper fry", "Aloo mutter", "Avul Sweet", "Curd rice", "Veg salad / Onion raita"},
		},
		"Thursday": {
			"breakfast": {"Ragi / Plain Idly", "Sweet Pongal (Jaggery)", "Tomato Kulambu", "Wheat rava + Curd", "Groundnut chutney", "Coffee/Milk/Tea"},
			"lunch":     {"Rice", "Avaramochai Brinjal Kulambu", "Tomato Rasam", "Carrot beans poriyal", "Curd", "Kambu Koozh + Vathal"},
			"dinner":    {"Kara dosa", "Arisiparuppu Sadam", "Tiffin Sambar", "Coconut / Curry leaves Chutney", "Curd rice & Banana"},
		},
		"Friday": {
			"breakfast": {"Veg uthappam (Soya)", "White Rava Upma", "Tomato kulambu", "Kara chutney", "Idly podi with gingelly oil", "Coffee/Milk/Tea"},
			"lunch":     {"Rice", "Brinjal Sambar", "Pineapple Rasam", "Potato Varuval", "Ada Pradhaman Payasam", "Buttermilk"},
			"dinner":    {"Chapatti", "Malli Biryani", "Onion Tomato gravy", "Ragi Semiya sweet", "Egg masala", "Curd rice", "Onion raita / Veg Salad"},
		},
		"Saturday": {
			"breakfast": {"Idly", "Semiya Kitchadi", "Medhu Vadai", "Kumbakonam Kadappa", "Coconut chutney / Red chilli", "Idly podi with gingelly oil", "Coffee/Milk/Tea"},
			"lunch":     {"Rice", "Milaguthakali Vathal - Pulikulambu", "Lemon Rasam", "Meal Maker Poriyal", "Appalam", "Curd"},
			"dinner":    {"Pesarattu Dosa", "Kuruma", "Kara Chutney", "Karuveppilai sadam", "Idly podi with gingelly oil", "Banana"},
		},
		"Sunday": {
			"breakfast": {"Bread", "Jam/Butter", "Thinai Pongal", "Coconut chutney", "Coffee/Milk/Tea"},
			"lunch":     {"Soya Biryani", "Rice", "Onion raita", "Pacha Puli Rasam", "Egg gravy", "Buttermilk"},
			"dinner":    {"Idly", "Brinjal Kosthu", "Black Sundal Rice", "Curd rice & Rose milk", "Groundnut chutney"},
		},
	},
	"girls": {
		"Monday": {
			"breakfast": {"Idly", "Rava upma", "White kuruma", "Kara chutney", "Idly podi with gingelly oil", "Tea/Coffee/Milk"},
			"lunch":     {"Rice", "Arachuvecha (Onion+Drumstick) Kulambu", "Rasam", "Bottle gourd kootu", "Kambu Koozh+Vathal", "Buttermilk"},
			"dinner":    {"Veg uthappam", "Sambar", "Karuveppilai sadam", "Coconut chutney", "Curd rice", "Banana"},
		},
		"Tuesday": {
			"breakfast": {"Seeragasamba kurunai Pongal", "Tomato Semiya", "Sambar", "Medhu Vadai", "Coconut Chutney", "Tea/Coffee/Milk"},
			"lunch":     {"Rice", "Kollu paruppu", "Kollu Rasam", "Carrot Green Peas Poriyal", "Appalam", "Curd"},
			"dinner":    {"Chapathi", "Pattani Paal Curry Kuruma", "Empty Biriyani", "Egg+Avul/Ragi semiya sweet", "Curd Rice", "Veg Salad/Onion Raitha"},
		},
		"Wednesday": {
			"breakfast": {"Idly", "Tomato Kulambu", "Wheat Rava Upma+Curd", "Mint Chutney", "Tea/Coffee/Milk"},
			"lunch":     {"Rice", "Ladiesfinger Morkulambu", "Milagu Rasam", "Potato Finger varuval", "Payasam", "Appalam", "Butter Milk"},
			"dinner":    {"Set Dosa", "Vada curry", "Coconut rice", "Curd Rice", "Veg Chutney", "Badham Milk/Ragi Malt"},
		},
		"Thursday": {
			"breakfast": {"Bread+Jam+Butter", "Onion Mini Uttappam", "Siruparuppu Sambar", "Kaara Chutney", "Tea/Coffee/Milk"},
			"lunch":     {"Rice", "Tomato Rice (Kuska)", "Sambar Sadham", "Onion Raitha", "Rasam", "Vadagam+Butter Milk"},
			"dinner":    {"Chapathi+Jam", "Mixed Veg Curry", "Beetroot sadham", "Curd Rice", "Egg Pepper Fry/Masala", "Veg Salad/Onion Raitha"},
		},
		"Friday": {
			"breakfast": {"Plain Idly", "Yellow pumpkin sambar", "Sweet pongal", "Medu Vadai", "Coconut chutney", "Tea/Coffee/Milk"},
			"lunch":     {"Rice", "Kothavarai vathal kulambu", "Lemon Rasam", "Cabbage Poriyal", "Curd"},
			"dinner":    {"Rumali Roti", "Veg butter masala", "Ghee rice", "Curd Rice", "Banana"},
		},
		"Saturday": {
			"breakfast": {"Machine Dosa", "Veg Paya", "Ragi Semiya", "Coconut chutney", "Tea/Coffee/Milk"},
			"lunch":     {"Rice", "Drumstick Sambar", "Tomato Rasam", "Payasam", "Paruppuvadai+Poriyal", "Buttermilk"},
			"dinner":    {"Idly", "Brinjal Gosthu", "Tomato rice", "Curd Rice", "Kara Chutney", "Lemon juice"},
		},
		"Sunday": {
			"breakfast": {"Bread", "Jam butter", "Semiya (Variety)", "Coconut Chutney", "Tea/Coffee/Milk"},
			"lunch":     {"Rice", "Veg Biriyani", "Pachapuli Rasam", "Egg Gravy", "Onion Raitha", "Butter Milk"},
			"dinner":    {"Onion Dosa", "Jeera Sadam/Sambar Sadam", "Sambar", "Curd Rice", "Banana+Tomato Sauce", "Coriander Chutney"},
		},
	},
}

type MessHandler struct {
	DB *sql.DB
}

type parsedMessRow struct {
	Date     string
	Day      string
	MealType string
	Item     string
	Order    int
}

type messMenuRow struct {
	ID       int    `json:"id"`
	Hostel   string `json:"hostel"`
	Date     string `json:"date"`
	Day      string `json:"day"`
	MealType string `json:"meal_type"`
	Item     string `json:"item"`
	Order    int    `json:"item_order"`
	Source   string `json:"source_file,omitempty"`
	Updated  string `json:"updated_at,omitempty"`
}

type messMenuRowInput struct {
	Hostel   string `json:"hostel"`
	Date     string `json:"date"`
	Day      string `json:"day"`
	MealType string `json:"meal_type"`
	Item     string `json:"item"`
	Order    int    `json:"item_order"`
}

func NewMessHandler() *MessHandler {
	return &MessHandler{DB: config.DB}
}

func currentMealType() string {
	loc, _ := time.LoadLocation("Asia/Kolkata")
	now := time.Now().In(loc)
	hhmm := now.Format("15:04")

	order := []string{"Breakfast", "Lunch", "Dinner"}
	for _, meal := range order {
		window := mealTimings[meal]
		if hhmm >= window[0] && hhmm <= window[1] {
			return meal
		}
	}
	for _, meal := range order {
		if hhmm < mealTimings[meal][0] {
			return meal
		}
	}
	return "Breakfast"
}

func normalizeHostel(hostel string) (string, error) {
	hostel = strings.ToLower(strings.TrimSpace(hostel))
	switch hostel {
	case "boys", "girls":
		return hostel, nil
	default:
		return "", fmt.Errorf("unknown hostel '%s'; use 'boys' or 'girls'", hostel)
	}
}

func normalizeMeal(raw string) (string, error) {
	switch strings.ToLower(strings.TrimSpace(raw)) {
	case "breakfast":
		return "Breakfast", nil
	case "lunch":
		return "Lunch", nil
	case "dinner":
		return "Dinner", nil
	default:
		return "", fmt.Errorf("invalid meal type %q", raw)
	}
}

func normalizeCell(value string) string {
	return strings.TrimSpace(strings.TrimPrefix(value, "\ufeff"))
}

func dayNameFromDate(dateStr string) string {
	loc, _ := time.LoadLocation("Asia/Kolkata")
	parsed, err := time.ParseInLocation("2006-01-02", dateStr, loc)
	if err != nil {
		return ""
	}
	return parsed.Weekday().String()
}

func cloneMessMenu(defaultMenu map[string][]string) map[string][]string {
	menu := map[string][]string{
		"breakfast": {},
		"lunch":     {},
		"dinner":    {},
	}
	for mealType, items := range defaultMenu {
		menu[mealType] = append([]string{}, items...)
	}
	return menu
}

func fallbackMessMenu(hostel, dateStr string) (string, map[string][]string) {
	dayName := dayNameFromDate(dateStr)
	hostelMenus, ok := defaultMessMenus[hostel]
	if !ok {
		hostelMenus = defaultMessMenus["boys"]
	}
	defaultMenu, ok := hostelMenus[dayName]
	if !ok {
		defaultMenu = hostelMenus["Monday"]
		dayName = "Monday"
	}
	return dayName, cloneMessMenu(defaultMenu)
}

func parseMessCSV(reader io.Reader) ([]parsedMessRow, error) {
	csvReader := csv.NewReader(reader)
	csvReader.FieldsPerRecord = -1
	csvReader.TrimLeadingSpace = true
	rows, err := csvReader.ReadAll()
	if err != nil {
		return nil, err
	}

	parsed := make([]parsedMessRow, 0, len(rows))
	sequence := make(map[string]int)

	for index, row := range rows {
		if len(row) == 0 {
			continue
		}

		dateRaw := normalizeCell(row[0])
		if dateRaw == "" {
			continue
		}
		if index == 0 && strings.EqualFold(dateRaw, "date") {
			continue
		}

		if len(row) < 4 {
			return nil, fmt.Errorf("row %d must have at least 4 columns: date, day, meal type, item", index+1)
		}

		if _, err := time.Parse("2006-01-02", dateRaw); err != nil {
			return nil, fmt.Errorf("invalid date %q at row %d", dateRaw, index+1)
		}

		day := normalizeCell(row[1])
		mealType, err := normalizeMeal(row[2])
		if err != nil {
			return nil, fmt.Errorf("row %d: %w", index+1, err)
		}

		item := normalizeCell(strings.Join(row[3:], ","))
		if item == "" {
			continue
		}

		key := dateRaw + "|" + mealType
		sequence[key]++
		parsed = append(parsed, parsedMessRow{
			Date:     dateRaw,
			Day:      day,
			MealType: mealType,
			Item:     item,
			Order:    sequence[key],
		})
	}

	return parsed, nil
}

func (h *MessHandler) GetMess(c *gin.Context) {
	hostel, err := normalizeHostel(c.Query("hostel"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "'hostel' query param is required",
			"example": "/mess?hostel=boys&date=2026-04-02",
		})
		return
	}

	loc, _ := time.LoadLocation("Asia/Kolkata")
	now := time.Now().In(loc)

	dateStr := strings.TrimSpace(c.Query("date"))
	if dateStr == "" {
		dateStr = now.Format("2006-01-02")
	} else if _, err := time.Parse("2006-01-02", dateStr); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid date format; use YYYY-MM-DD"})
		return
	}

	rows, err := h.DB.Query(`
		SELECT day, meal_type, item, item_order
		FROM mess_menu_items
		WHERE hostel = ? AND menu_date = ?
		ORDER BY FIELD(meal_type, 'Breakfast', 'Lunch', 'Dinner'), item_order ASC`, hostel, dateStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	menu := map[string][]string{
		"breakfast": {},
		"lunch":     {},
		"dinner":    {},
	}
	dayName := ""
	hasData := false

	for rows.Next() {
		var day, mealType, item string
		var order int
		if err := rows.Scan(&day, &mealType, &item, &order); err != nil {
			continue
		}
		hasData = true
		if dayName == "" {
			dayName = day
		}
		switch strings.ToLower(mealType) {
		case "breakfast":
			menu["breakfast"] = append(menu["breakfast"], item)
		case "lunch":
			menu["lunch"] = append(menu["lunch"], item)
		case "dinner":
			menu["dinner"] = append(menu["dinner"], item)
		}
	}

	if !hasData {
		dayName, menu = fallbackMessMenu(hostel, dateStr)
	}

	if dayName == "" {
		dayName = dayNameFromDate(dateStr)
	}

	activeMeal := currentMealType()
	window := mealTimings[activeMeal]
	currentMealData := gin.H{
		"meal_type":  activeMeal,
		"start_time": window[0],
		"end_time":   window[1],
		"items":      menu[strings.ToLower(activeMeal)],
	}

	fullMenu := gin.H{
		"breakfast": menu["breakfast"],
		"lunch":     menu["lunch"],
		"dinner":    menu["dinner"],
	}

	c.JSON(http.StatusOK, gin.H{
		"hostel":       hostel,
		"date":         dateStr,
		"day":          dayName,
		"current_time": now.Format("15:04") + " IST",
		"current_meal": currentMealData,
		"full_menu":    fullMenu,
		"data_found":   hasData,
		"default_menu": !hasData,
	})
}

func (h *MessHandler) ListAdmin(c *gin.Context) {
	hostel, err := normalizeHostel(c.Query("hostel"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "hostel must be boys or girls"})
		return
	}

	dateStr := strings.TrimSpace(c.Query("date"))
	if dateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "date is required"})
		return
	}
	if _, err := time.Parse("2006-01-02", dateStr); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "invalid date format; use YYYY-MM-DD"})
		return
	}

	rows, err := h.DB.Query(`
		SELECT id, hostel, DATE_FORMAT(menu_date, '%Y-%m-%d') AS menu_date, day, meal_type, item, item_order, COALESCE(source_file, ''), COALESCE(DATE_FORMAT(updated_at, '%Y-%m-%dT%H:%i:%sZ'), '')
		FROM mess_menu_items
		WHERE hostel = ? AND menu_date = ?
		ORDER BY FIELD(meal_type, 'Breakfast', 'Lunch', 'Dinner'), item_order ASC, id ASC`, hostel, dateStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer rows.Close()

	items := make([]messMenuRow, 0)
	for rows.Next() {
		var item messMenuRow
		if err := rows.Scan(&item.ID, &item.Hostel, &item.Date, &item.Day, &item.MealType, &item.Item, &item.Order, &item.Source, &item.Updated); err != nil {
			continue
		}
		items = append(items, item)
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": items})
}

func (h *MessHandler) UpdateAdmin(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "id is required"})
		return
	}

	var input messMenuRowInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}

	hostel, err := normalizeHostel(input.Hostel)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "hostel must be boys or girls"})
		return
	}
	if _, err := time.Parse("2006-01-02", input.Date); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "invalid date format; use YYYY-MM-DD"})
		return
	}
	mealType, err := normalizeMeal(input.MealType)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	item := strings.TrimSpace(input.Item)
	if item == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "item is required"})
		return
	}
	if input.Order < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "item_order must be 1 or greater"})
		return
	}

	res, err := h.DB.Exec(`
		UPDATE mess_menu_items
		SET hostel = ?, menu_date = ?, day = ?, meal_type = ?, item_order = ?, item = ?
		WHERE id = ?`, hostel, input.Date, strings.TrimSpace(input.Day), mealType, input.Order, item, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	affected, _ := res.RowsAffected()
	if affected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "menu row not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Menu item updated"})
}

func (h *MessHandler) DeleteAdmin(c *gin.Context) {
	id := strings.TrimSpace(c.Param("id"))
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "id is required"})
		return
	}

	res, err := h.DB.Exec(`DELETE FROM mess_menu_items WHERE id = ?`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	affected, _ := res.RowsAffected()
	if affected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "menu row not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Menu item deleted"})
}

func (h *MessHandler) UploadCSV(c *gin.Context) {
	hostel, err := normalizeHostel(c.PostForm("hostel"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "hostel must be boys or girls"})
		return
	}

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "csv file is required"})
		return
	}

	if ext := strings.ToLower(filepath.Ext(file.Filename)); ext != ".csv" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "only .csv files are supported"})
		return
	}

	opened, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer opened.Close()

	parsedRows, err := parseMessCSV(opened)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": err.Error()})
		return
	}
	if len(parsedRows) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "csv contains no valid menu rows"})
		return
	}

	dateSet := make(map[string]struct{})
	for _, row := range parsedRows {
		dateSet[row.Date] = struct{}{}
	}

	dates := make([]string, 0, len(dateSet))
	for date := range dateSet {
		dates = append(dates, date)
	}
	sort.Strings(dates)

	tx, err := h.DB.BeginTx(c.Request.Context(), nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer tx.Rollback()

	for _, date := range dates {
		if _, err := tx.Exec(`DELETE FROM mess_menu_items WHERE hostel = ? AND menu_date = ?`, hostel, date); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
			return
		}
	}

	stmt, err := tx.Prepare(`
		INSERT INTO mess_menu_items (hostel, menu_date, day, meal_type, item_order, item, source_file, uploaded_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}
	defer stmt.Close()

	uploadedAt := time.Now()
	for _, row := range parsedRows {
		if _, err := stmt.Exec(hostel, row.Date, row.Day, row.MealType, row.Order, row.Item, file.Filename, uploadedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
			return
		}
	}

	if err := tx.Commit(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": err.Error()})
		return
	}

	var firstDate, lastDate string
	if len(dates) > 0 {
		firstDate = dates[0]
		lastDate = dates[len(dates)-1]
	}

	c.JSON(http.StatusOK, gin.H{
		"success":         true,
		"message":         "Mess menu uploaded successfully",
		"hostel":          hostel,
		"rows_inserted":   len(parsedRows),
		"dates_covered":   len(dates),
		"first_date":      firstDate,
		"last_date":       lastDate,
		"source_filename": file.Filename,
	})
}

// GetMealTimings handles: GET /mess/timings
// Returns the configured meal time windows.
func (h *MessHandler) GetMealTimings(c *gin.Context) {
	type window struct {
		Meal      string `json:"meal"`
		StartTime string `json:"start_time"`
		EndTime   string `json:"end_time"`
	}
	timings := []window{
		{"Breakfast", mealTimings["Breakfast"][0], mealTimings["Breakfast"][1]},
		{"Lunch", mealTimings["Lunch"][0], mealTimings["Lunch"][1]},
		{"Dinner", mealTimings["Dinner"][0], mealTimings["Dinner"][1]},
	}
	c.JSON(http.StatusOK, gin.H{"timings": timings})
}

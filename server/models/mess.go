package models

import (
	"time"
)

// MealType represents the type of meal
type MealType string

const (
	Breakfast MealType = "Breakfast"
	Lunch     MealType = "Lunch"
	Dinner    MealType = "Dinner"
)

// MealTiming stores the timing for different meals
type MealTiming struct {
	MealType  MealType `json:"meal_type"`
	StartTime string   `json:"start_time"` // e.g., "07:00"
	EndTime   string   `json:"end_time"`   // e.g., "08:30"
}

// MessItem represents a single food item in a meal
type MessItem struct {
	Item     string `json:"item"`
	MealType string `json:"meal_type"`
}

// MessMenu represents the complete menu for a specific date
type MessMenu struct {
	Date      string     `json:"date"`
	Day       string     `json:"day"`
	Breakfast []MessItem `json:"breakfast"`
	Lunch     []MessItem `json:"lunch"`
	Dinner    []MessItem `json:"dinner"`
}

// MessData represents food items for a date and meal type
type MessData struct {
	Date     string     `json:"date"`
	Day      string     `json:"day"`
	MealType string     `json:"meal_type"`
	Items    []MessItem `json:"items"`
	Timing   MealTiming `json:"timing"`
}

// MessQueryParams holds parameters for querying mess data
type MessQueryParams struct {
	Date     time.Time
	MealType MealType
	MessType string // "boys" or "girls"
}

// MessResponse is the response structure for API endpoints
type MessResponse struct {
	Status    string      `json:"status"`
	Message   string      `json:"message"`
	Data      interface{} `json:"data"`
	Timestamp time.Time   `json:"timestamp"`
}

// AvailableMeal represents what meal is currently available
type AvailableMeal struct {
	MealType  string `json:"meal_type"`
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
	IsActive  bool   `json:"is_active"`
	NextMeal  string `json:"next_meal,omitempty"`
	TimeUntil string `json:"time_until,omitempty"`
}

// CurrentMealResponse contains information about the current meal
type CurrentMealResponse struct {
	CurrentTime   string         `json:"current_time"`
	AvailableMeal *AvailableMeal `json:"available_meal"`
	MenuData      *MessMenu      `json:"menu_data"`
}

// MenuSearchResult represents a search result for menu items
type MenuSearchResult struct {
	Date     string `json:"date"`
	Day      string `json:"day"`
	Item     string `json:"item"`
	MealType string `json:"meal_type"`
}
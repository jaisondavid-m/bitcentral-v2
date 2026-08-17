package handlers

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"google.golang.org/api/sheets/v4"
)

type RewardActivity struct {
	Date         string `json:"date"`
	RewardPoints string `json:"reward_points"`
	ActivityType string `json:"activity_type"`
	ActivityName string `json:"activity_name"`
	Type         string `json:"type"`
	SheetSource  string `json:"sheet_source,omitempty"`
}

var rewardSheetTabs = []string{
	"Reward Points Entry",
	"Negative Reward Points",
	"EXTERNAL REWARD POINTS",
}

const rewardsCacheTTL = 5 * time.Minute

type RewardsData struct {
	Index       map[string][]RewardActivity
	SheetErrors map[string]string
}

var (
	rewardsCacheMu      sync.RWMutex
	rewardsCacheBuildMu sync.Mutex
	rewardsCacheData    *RewardsData
	rewardsCacheExpiry  time.Time
)

func cloneRewardsData(src *RewardsData) *RewardsData {
	if src == nil {
		return nil
	}
	out := &RewardsData{
		Index:       cloneRewardMap(src.Index),
		SheetErrors: make(map[string]string),
	}
	for k, v := range src.SheetErrors {
		out.SheetErrors[k] = v
	}
	return out
}

func normalizeRollNo(s string) string {
	return strings.ToUpper(strings.ReplaceAll(strings.TrimSpace(s), " ", ""))
}

func cloneRewardMap(src map[string][]RewardActivity) map[string][]RewardActivity {
	if src == nil {
		return nil
	}
	out := make(map[string][]RewardActivity, len(src))
	for k, v := range src {
		vv := make([]RewardActivity, len(v))
		copy(vv, v)
		out[k] = vv
	}
	return out
}

func (h *SheetHandler) getActualTabName(svc *sheets.Service, spreadsheetID, expectedTab string) string {
	spreadsheet, err := svc.Spreadsheets.Get(spreadsheetID).Fields("sheets.properties.title").Do()
	if err != nil {
		log.Printf("[WARNING] Failed to fetch spreadsheet metadata for ID %s: %v. Defaulting to %q", spreadsheetID, err, expectedTab)
		return expectedTab
	}

	normExpected := strings.ToLower(strings.TrimSpace(expectedTab))
	for _, sheet := range spreadsheet.Sheets {
		if sheet.Properties != nil {
			title := sheet.Properties.Title
			if strings.ToLower(strings.TrimSpace(title)) == normExpected {
				return title
			}
		}
	}
	return expectedTab
}

func (h *SheetHandler) buildRewardsIndexForSheet(spreadsheetID string, sourceLabel string) (map[string][]RewardActivity, error) {
	if spreadsheetID == "" {
		return make(map[string][]RewardActivity), nil
	}
	svc := h.getSheetsService()

	if svc == nil {
		return nil, fmt.Errorf("sheets service not initialized")
	}

	ranges := make([]string, 0, len(rewardSheetTabs))
	for _, tab := range rewardSheetTabs {
		actualTab := h.getActualTabName(svc, spreadsheetID, tab)
		r := fmt.Sprintf("'%s'!A2:J", actualTab)
		log.Printf("[DEBUG] Spreadsheet ID: %q (%s) | Requested Tab: %q | Actual Tab Resolved: %q | Constructed Range: %q",
			spreadsheetID, sourceLabel, tab, actualTab, r)
		ranges = append(ranges, r)
	}

	resp, err := svc.Spreadsheets.Values.BatchGet(spreadsheetID).Ranges(ranges...).Do()
	if err != nil {
		log.Printf("[ERROR] BatchGet failed for Spreadsheet ID %q (%s) with ranges %v: %v",
			spreadsheetID, sourceLabel, ranges, err)
		return nil, err
	}

	index := make(map[string][]RewardActivity)
	for i, vr := range resp.ValueRanges {
		// Use the actual resolved name or the requested tab name for tab matching logic
		tabName := rewardSheetTabs[i]
		for _, row := range vr.Values {
			rollNorm := normalizeRollNo(safeGet(row, 3))
			if rollNorm == "" {
				continue
			}
			points := safeGet(row, 7)

			rewardType := "positive"

			if tabName == "Negative Reward Points" && points != "" {
				rewardType = "negative"
			}
			index[rollNorm] = append(index[rollNorm], RewardActivity{
				Date:         safeGet(row, 1),
				RewardPoints: points,
				ActivityType: safeGet(row, 8),
				ActivityName: safeGet(row, 9),
				Type:         rewardType,
				SheetSource:  sourceLabel,
			})
		}
	}

	return index, nil
}

func (h *SheetHandler) buildRewardsIndex() (map[string][]RewardActivity, map[string]string, error) {
	spreadsheetID1 := os.Getenv("RP_Detailed_sheet")
	spreadsheetID2 := os.Getenv("RP_Detailed_sheet_2")

	sheetErrors := make(map[string]string)

	var index1 map[string][]RewardActivity
	var err1 error
	if spreadsheetID1 != "" {
		index1, err1 = h.buildRewardsIndexForSheet(spreadsheetID1, "Sheet 1")
		if err1 != nil {
			log.Printf("Error: failed to build index for sheet 1 (%s): %v", spreadsheetID1, err1)
			sheetErrors["Sheet 1"] = err1.Error()
			index1 = make(map[string][]RewardActivity)
		}
	} else {
		index1 = make(map[string][]RewardActivity)
		sheetErrors["Sheet 1"] = "Spreadsheet ID is empty"
	}

	var index2 map[string][]RewardActivity
	var err2 error
	if spreadsheetID2 != "" {
		index2, err2 = h.buildRewardsIndexForSheet(spreadsheetID2, "Sheet 2")
		if err2 != nil {
			log.Printf("Error: failed to build index for sheet 2 (%s): %v", spreadsheetID2, err2)
			sheetErrors["Sheet 2"] = err2.Error()
			index2 = make(map[string][]RewardActivity)
		}
	} else {
		index2 = make(map[string][]RewardActivity)
		sheetErrors["Sheet 2"] = "Spreadsheet ID is empty"
	}

	merged := make(map[string][]RewardActivity)

	allRolls := make(map[string]bool)
	for r := range index1 {
		allRolls[r] = true
	}
	for r := range index2 {
		allRolls[r] = true
	}

	for r := range allRolls {
		s1 := index1[r]
		s2 := index2[r]

		// Reverse s1 in-place (oldest-to-newest -> newest-to-oldest)
		for i, j := 0, len(s1)-1; i < j; i, j = i+1, j-1 {
			s1[i], s1[j] = s1[j], s1[i]
		}

		// Reverse s2 in-place (oldest-to-newest -> newest-to-oldest)
		for i, j := 0, len(s2)-1; i < j; i, j = i+1, j-1 {
			s2[i], s2[j] = s2[j], s2[i]
		}

		// Concatenate: s1 first, then s2
		combined := make([]RewardActivity, 0, len(s1)+len(s2))
		combined = append(combined, s1...)
		combined = append(combined, s2...)

		merged[r] = combined
	}

	return merged, sheetErrors, nil
}

func (h *SheetHandler) getRewardsIndex() (*RewardsData, error) {
	now := time.Now()

	rewardsCacheMu.RLock()
	if rewardsCacheData != nil && now.Before(rewardsCacheExpiry) {
		cached := cloneRewardsData(rewardsCacheData)
		rewardsCacheMu.RUnlock()
		return cached, nil
	}
	rewardsCacheMu.RUnlock()

	rewardsCacheBuildMu.Lock()
	defer rewardsCacheBuildMu.Unlock()

	rewardsCacheMu.RLock()
	if rewardsCacheData != nil && time.Now().Before(rewardsCacheExpiry) {
		cached := cloneRewardsData(rewardsCacheData)
		rewardsCacheMu.RUnlock()
		return cached, nil
	}
	rewardsCacheMu.RUnlock()

	index, sheetErrors, err := h.buildRewardsIndex()
	if err != nil {
		rewardsCacheMu.RLock()
		stale := cloneRewardsData(rewardsCacheData)
		rewardsCacheMu.RUnlock()
		if stale != nil {
			return stale, nil
		}
		return nil, err
	}

	data := &RewardsData{
		Index:       index,
		SheetErrors: sheetErrors,
	}

	rewardsCacheMu.Lock()
	rewardsCacheData = data
	rewardsCacheExpiry = time.Now().Add(rewardsCacheTTL)
	rewardsCacheMu.Unlock()

	return cloneRewardsData(data), nil
}

func (h *SheetHandler) GetRewardsByRollNo(c *gin.Context) {
	rawQuery := strings.TrimSpace(c.Query("roll_no"))
	if rawQuery == "" {
		rawQuery = strings.TrimSpace(c.Query("rollno"))
	}
	if rawQuery == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Query param 'roll_no' is required",
		})
		return
	}

	queryNorm := normalizeRollNo(rawQuery)
	data, err := h.getRewardsIndex()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to read reward sheet data",
		})
		return
	}

	matched := data.Index[queryNorm]

	if len(matched) == 0 && len(data.SheetErrors) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"message": "No reward activities found for this roll number",
		})
		return
	}

	pageStr := c.Query("page")
	limitStr := c.Query("limit")

	page := 1
	limit := 0

	if pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
			limit = l
		}
	}

	if limit > 0 {
		total := len(matched)
		startIndex := (page - 1) * limit
		if startIndex < 0 {
			startIndex = 0
		}
		endIndex := startIndex + limit

		var paginated []RewardActivity
		if startIndex >= total {
			paginated = []RewardActivity{}
		} else {
			if endIndex > total {
				endIndex = total
			}
			paginated = matched[startIndex:endIndex]
		}

		c.JSON(http.StatusOK, gin.H{
			"data":         paginated,
			"total":        total,
			"page":         page,
			"limit":        limit,
			"sheet_errors": data.SheetErrors,
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"data":         matched,
			"sheet_errors": data.SheetErrors,
		})
	}

}

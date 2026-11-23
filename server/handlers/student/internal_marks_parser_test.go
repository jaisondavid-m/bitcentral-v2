package student

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"testing"
)

func TestParseStudentwiseSheetValues(t *testing.T) {
	tokenData, err := os.ReadFile("../../token.json")
	if err != nil {
		t.Skip("No token.json available, skipping live test")
		return
	}
	var tok struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.Unmarshal(tokenData, &tok); err != nil || tok.AccessToken == "" {
		t.Skip("Invalid token, skipping")
		return
	}

	sheetID := "1gHiOy41cpyg8dZxDWu-MsF8o0abLbL8MHbVK-GkMjqw"
	rangeEscaped := url.PathEscape("Studentwise Reward Points!A1:CV")
	reqURL := fmt.Sprintf("https://sheets.googleapis.com/v4/spreadsheets/%s/values/%s", sheetID, rangeEscaped)
	req, _ := http.NewRequest("GET", reqURL, nil)
	req.Header.Set("Authorization", "Bearer "+tok.AccessToken)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("Failed to fetch sheet: %v", err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var vr struct {
		Values [][]interface{} `json:"values"`
	}
	if err := json.Unmarshal(body, &vr); err != nil {
		t.Fatalf("JSON unmarshal error: %v", err)
	}

	index, err := parseStudentwiseSheetValues(vr.Values)
	if err != nil {
		t.Fatalf("parseStudentwiseSheetValues error: %v (body: %s)", err, string(body)[:min(len(body), 200)])
	}

	t.Logf("Indexed %d students", len(index))

	// Check JAISON DAVID M
	jaison, ok := index["7376251CS221"]
	if !ok {
		t.Errorf("Expected 7376251CS221 to be found in index")
	} else {
		t.Logf("Found 7376251CS221: Name=%s, Subjects=%d, TotalMarks=%.2f, TotalPoints=%.2f",
			jaison.StudentName, len(jaison.Subjects), jaison.Overall.TotalInternalMarks, jaison.Overall.TotalRewardPoints)
		for _, s := range jaison.Subjects {
			t.Logf("  Subject: %s (%s) Mark=%.2f Points=%.2f", s.Code, s.Category, s.Mark, s.TotalPoints)
		}
	}

	// Check ANISH M
	anish, ok := index["7376232AG102"]
	if !ok {
		t.Errorf("Expected 7376232AG102 to be found in index")
	} else {
		t.Logf("Found 7376232AG102: Name=%s, Subjects=%d, TotalMarks=%.2f, TotalPoints=%.2f",
			anish.StudentName, len(anish.Subjects), anish.Overall.TotalInternalMarks, anish.Overall.TotalRewardPoints)
		for _, s := range anish.Subjects {
			t.Logf("  Subject: %s (%s) Mark=%.2f Points=%.2f", s.Code, s.Category, s.Mark, s.TotalPoints)
		}
	}
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

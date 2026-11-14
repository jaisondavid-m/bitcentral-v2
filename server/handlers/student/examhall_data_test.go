package student

import (
	"testing"
)

func TestBuildSeatingData16Nov2026(t *testing.T) {
	// FN Session: 125 candidates
	fnRecords := buildSeatingData16Nov2026FN()
	fnCount := 0
	for _, r := range fnRecords {
		fnCount += len(r.RegisterNos)
		if r.HallNo == "" {
			t.Errorf("Empty hall number in FN record: %+v", r)
		}
		if r.CourseCode == "" {
			t.Errorf("Empty course code in FN record: %+v", r)
		}
		if r.Time != "09:00 AM – 12:00 PM" {
			t.Errorf("Unexpected time in FN record: %s", r.Time)
		}
	}
	if fnCount != 125 {
		t.Fatalf("Expected 125 candidates for 16-Nov-2026 FN, got %d", fnCount)
	}

	// AN Session: 1834 candidates
	anRecords := buildSeatingData16Nov2026AN()
	anCount := 0
	for _, r := range anRecords {
		anCount += len(r.RegisterNos)
		if r.HallNo == "" {
			t.Errorf("Empty hall number in AN record: %+v", r)
		}
		if r.CourseCode == "" {
			t.Errorf("Empty course code in AN record: %+v", r)
		}
		if r.Time != "01:30 PM – 04:30 PM" {
			t.Errorf("Unexpected time in AN record: %s", r.Time)
		}
	}
	if anCount != 1834 {
		t.Fatalf("Expected 1834 candidates for 16-Nov-2026 AN, got %d", anCount)
	}

	t.Logf("16-Nov-2026 FN: %d records, %d candidates", len(fnRecords), fnCount)
	t.Logf("16-Nov-2026 AN: %d records, %d candidates", len(anRecords), anCount)

	// Test lookups
	tests := []struct {
		regNo      string
		courseCode string
		expected   string
	}{
		{"7376231CD102", "22CD007", "WW 202"},
		{"7376232AL103", "22AM001", "WW 202"},
		{"7376231CD154", "22CD007", "WW 205"},
		{"7376241CS102", "22CS501", "ME 102"},
		{"7376241EC103", "22EC501", "ME 102"},
		{"7376241MZ101", "22MC501", "WW 226"},
		{"7376242BT164", "22BT501", "WW 227"},
	}

	for _, tt := range tests {
		hall, found := LookupHall(tt.regNo, tt.courseCode)
		if !found || hall != tt.expected {
			t.Errorf("LookupHall(%s, %s) = (%s, %v); expected (%s, true)", tt.regNo, tt.courseCode, hall, found, tt.expected)
		}
	}
}

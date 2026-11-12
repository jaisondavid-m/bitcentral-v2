package response_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"server/response"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestOK(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	testData := map[string]string{"user": "alice"}
	response.OK(c, "Fetched successfully", testData)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}

	var res response.APIResponse
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if !res.Success {
		t.Errorf("expected success true, got false")
	}
	if res.Message != "Fetched successfully" {
		t.Errorf("expected message 'Fetched successfully', got '%s'", res.Message)
	}
	if res.Error != nil {
		t.Errorf("expected error to be nil, got %+v", res.Error)
	}
}

func TestBadRequest(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	response.BadRequest(c, "Invalid input data", "field 'email' is required")

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400, got %d", w.Code)
	}

	var res response.APIResponse
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if res.Success {
		t.Errorf("expected success false, got true")
	}
	if res.Error == nil {
		t.Fatalf("expected error info, got nil")
	}
	if res.Error.Code != "BAD_REQUEST" {
		t.Errorf("expected code BAD_REQUEST, got %s", res.Error.Code)
	}
}

func TestUnauthorized(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	response.Unauthorized(c, "Token missing")

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401, got %d", w.Code)
	}

	var res response.APIResponse
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to unmarshal response: %v", err)
	}

	if res.Success {
		t.Errorf("expected success false, got true")
	}
	if res.Error == nil || res.Error.Code != "UNAUTHORIZED" {
		t.Errorf("expected error code UNAUTHORIZED")
	}
}

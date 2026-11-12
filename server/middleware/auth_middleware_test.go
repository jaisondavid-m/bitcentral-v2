package middleware_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"server/config"
	"server/middleware"
	"server/response"
	"server/utils"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestRequireAuth_NoToken(t *testing.T) {
	r := gin.New()
	r.Use(middleware.RequireAuth())
	r.GET("/protected", func(c *gin.Context) {
		response.OK(c, "success", nil)
	})

	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/protected", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401, got %d", w.Code)
	}

	var res response.APIResponse
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to parse json response: %v", err)
	}
	if res.Success {
		t.Errorf("expected success false")
	}
}

func TestRequireAuth_ValidToken(t *testing.T) {
	claims := &config.GoogleUserClaims{
		UID:   "student_456",
		Email: "student@bitsathy.ac.in",
		Name:  "Test Student",
		Role:  "student",
	}

	token, err := config.GenerateAppJWT(claims, 1*time.Hour)
	if err != nil {
		t.Fatalf("failed to generate test JWT: %v", err)
	}

	r := gin.New()
	r.Use(middleware.RequireAuth())
	r.GET("/protected", func(c *gin.Context) {
		uid := utils.GetUserID(c)
		email := utils.GetUserEmail(c)
		response.OK(c, "success", gin.H{"uid": uid, "email": email})
	})

	// Pass via Bearer header
	w := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d: %s", w.Code, w.Body.String())
	}

	var res response.APIResponse
	if err := json.Unmarshal(w.Body.Bytes(), &res); err != nil {
		t.Fatalf("failed to parse json response: %v", err)
	}
	if !res.Success {
		t.Errorf("expected success true")
	}
}

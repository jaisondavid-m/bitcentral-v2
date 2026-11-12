package utils_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"server/config"
	"server/utils"

	"github.com/gin-gonic/gin"
)

func init() {
	gin.SetMode(gin.TestMode)
}

func TestSetAndGetAuthContext(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	claims := &config.GoogleUserClaims{
		UID:   "user_12345",
		Email: "student.cs23@bitsathy.ac.in",
		Name:  "Alice Bob",
		Role:  "student",
	}

	utils.SetAuthContext(c, claims, false)

	if uid := utils.GetUserID(c); uid != "user_12345" {
		t.Errorf("expected UID 'user_12345', got '%s'", uid)
	}

	if email := utils.GetUserEmail(c); email != "student.cs23@bitsathy.ac.in" {
		t.Errorf("expected email 'student.cs23@bitsathy.ac.in', got '%s'", email)
	}

	if role := utils.GetUserRole(c); role != "student" {
		t.Errorf("expected role 'student', got '%s'", role)
	}

	if isAdmin := utils.IsAdmin(c); isAdmin {
		t.Errorf("expected isAdmin false, got true")
	}

	mustUID, err := utils.MustGetUserID(c)
	if err != nil || mustUID != "user_12345" {
		t.Errorf("expected MustGetUserID to return 'user_12345', got '%s' (err: %v)", mustUID, err)
	}
}

func TestAdminAuthContext(t *testing.T) {
	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)

	claims := &config.GoogleUserClaims{
		UID:   "admin_999",
		Email: "admin@bitsathy.ac.in",
		Role:  "admin",
	}

	utils.SetAuthContext(c, claims, true)

	if !utils.IsAdmin(c) {
		t.Errorf("expected isAdmin true, got false")
	}
	if role := utils.GetUserRole(c); role != "admin" {
		t.Errorf("expected role 'admin', got '%s'", role)
	}
}

func TestExtractAuthToken(t *testing.T) {
	// 1. From Authorization Bearer header
	req1 := httptest.NewRequest("GET", "/", nil)
	req1.Header.Set("Authorization", "Bearer test_token_xyz")
	w1 := httptest.NewRecorder()
	c1, _ := gin.CreateTestContext(w1)
	c1.Request = req1

	if token := utils.ExtractAuthToken(c1); token != "test_token_xyz" {
		t.Errorf("expected 'test_token_xyz', got '%s'", token)
	}

	// 2. From Cookie
	req2 := httptest.NewRequest("GET", "/", nil)
	req2.AddCookie(&http.Cookie{Name: "auth_token", Value: "cookie_token_abc"})
	w2 := httptest.NewRecorder()
	c2, _ := gin.CreateTestContext(w2)
	c2.Request = req2

	if token := utils.ExtractAuthToken(c2); token != "cookie_token_abc" {
		t.Errorf("expected 'cookie_token_abc', got '%s'", token)
	}
}

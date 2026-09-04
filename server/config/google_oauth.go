package config

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

type GoogleUserClaims struct {
	UID      string `json:"sub"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Picture  string `json:"picture"`
	Audience string `json:"aud"`
}

type cachedTokenClaims struct {
	claims    *GoogleUserClaims
	expiresAt time.Time
}

type GoogleOAuth struct {
	ClientID     string
	ClientSecret string
	httpClient   *http.Client
}

var (
	GoogleOAuthInstance *GoogleOAuth
	googleOAuthOnce     sync.Once
	tokenCache          sync.Map
)

func InitGoogleOAuth() {
	googleOAuthOnce.Do(func() {
		clientID := strings.TrimSpace(os.Getenv("GOOGLE_OAUTH_CLIENT_ID"))
		if clientID == "" {
			clientID = strings.TrimSpace(os.Getenv("CLIENT_ID"))
		}
		clientSecret := strings.TrimSpace(os.Getenv("GOOGLE_OAUTH_CLIENT_SECRET"))
		if clientSecret == "" {
			clientSecret = strings.TrimSpace(os.Getenv("CLIENT_SECRET"))
		}

		GoogleOAuthInstance = &GoogleOAuth{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			httpClient:   &http.Client{Timeout: 3 * time.Second},
		}
		log.Println("✅ Google OAuth service initialized successfully")
	})
}

func parseLocalJWTClaims(tokenString string) (*GoogleUserClaims, int64) {
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, 0
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		payloadBytes, err = base64.URLEncoding.DecodeString(parts[1])
		if err != nil {
			return nil, 0
		}
	}

	var raw struct {
		Sub     string `json:"sub"`
		UserID  string `json:"user_id"`
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
		Aud     string `json:"aud"`
		Exp     int64  `json:"exp"`
		Iss     string `json:"iss"`
	}

	if err := json.Unmarshal(payloadBytes, &raw); err != nil {
		return nil, 0
	}

	if raw.Email == "" {
		return nil, 0
	}

	if raw.Iss != "" && !strings.Contains(raw.Iss, "accounts.google.com") {
		return nil, 0
	}

	nowSec := time.Now().Unix()
	if raw.Exp > 0 && raw.Exp < nowSec {
		return nil, 0
	}

	uid := raw.Sub
	if uid == "" {
		uid = raw.UserID
	}
	if uid == "" {
		uid = raw.Email
	}

	claims := &GoogleUserClaims{
		UID:      uid,
		Email:    raw.Email,
		Name:     raw.Name,
		Picture:  raw.Picture,
		Audience: raw.Aud,
	}

	return claims, raw.Exp
}

func VerifyGoogleToken(tokenString string) (*GoogleUserClaims, error) {
	tokenString = strings.TrimSpace(tokenString)
	if tokenString == "" {
		return nil, errors.New("empty token")
	}

	// 0. High-speed in-memory token cache lookup (< 0.001 ms)
	if val, ok := tokenCache.Load(tokenString); ok {
		if cached, ok := val.(*cachedTokenClaims); ok {
			if time.Now().Before(cached.expiresAt) {
				return cached.claims, nil
			}
			tokenCache.Delete(tokenString)
		}
	}

	if GoogleOAuthInstance == nil {
		InitGoogleOAuth()
	}

	// 1. Fast local JWT payload parsing (< 0.01 ms)
	if localClaims, exp := parseLocalJWTClaims(tokenString); localClaims != nil {
		ttl := 30 * 24 * time.Hour // 1 month cache
		if exp > 0 {
			remaining := time.Until(time.Unix(exp, 0))
			if remaining > 0 {
				ttl = remaining
			}
		}
		tokenCache.Store(tokenString, &cachedTokenClaims{
			claims:    localClaims,
			expiresAt: time.Now().Add(ttl),
		})
		return localClaims, nil
	}

	// 2. Fallback: Google Tokeninfo endpoint
	tokenInfoURL := fmt.Sprintf("https://oauth2.googleapis.com/tokeninfo?id_token=%s", tokenString)
	req, err := http.NewRequest("GET", tokenInfoURL, nil)
	if err == nil {
		resp, err := GoogleOAuthInstance.httpClient.Do(req)
		if err == nil {
			defer resp.Body.Close()
			if resp.StatusCode == http.StatusOK {
				body, err := io.ReadAll(resp.Body)
				if err == nil {
					var claims GoogleUserClaims
					if err := json.Unmarshal(body, &claims); err == nil && claims.Email != "" {
						if claims.UID == "" {
							var raw map[string]interface{}
							_ = json.Unmarshal(body, &raw)
							if subVal, ok := raw["user_id"].(string); ok {
								claims.UID = subVal
							}
						}
						tokenCache.Store(tokenString, &cachedTokenClaims{
							claims:    &claims,
							expiresAt: time.Now().Add(30 * 24 * time.Hour),
						})
						return &claims, nil
					}
				}
			}
		}
	}

	// 3. Fallback: Google UserInfo endpoint
	userInfoURL := "https://www.googleapis.com/oauth2/v3/userinfo"
	req, err = http.NewRequest("GET", userInfoURL, nil)
	if err == nil {
		req.Header.Set("Authorization", "Bearer "+tokenString)
		resp, err := GoogleOAuthInstance.httpClient.Do(req)
		if err == nil {
			defer resp.Body.Close()
			if resp.StatusCode == http.StatusOK {
				body, err := io.ReadAll(resp.Body)
				if err == nil {
					var claims GoogleUserClaims
					if err := json.Unmarshal(body, &claims); err == nil && claims.Email != "" {
						tokenCache.Store(tokenString, &cachedTokenClaims{
							claims:    &claims,
							expiresAt: time.Now().Add(30 * 24 * time.Hour),
						})
						return &claims, nil
					}
				}
			}
		}
	}

	return nil, errors.New("invalid or expired Google token")
}

package tools

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/mark3labs/mcp-go/mcp"
)

type APIClient struct {
	BaseURL    string
	HTTPClient *http.Client
	AuthToken  string
}

var DefaultClient = NewAPIClient()

func NewAPIClient() *APIClient {
	baseURL := os.Getenv("BACKEND_URL")
	if baseURL == "" {
		baseURL = os.Getenv("BITCENTRAL_API_URL")
	}
	if baseURL == "" {
		baseURL = "http://localhost:8080"
	}
	baseURL = strings.TrimRight(baseURL, "/")

	authToken := os.Getenv("BACKEND_AUTH_TOKEN")

	return &APIClient{
		BaseURL: baseURL,
		HTTPClient: &http.Client{
			Timeout: 20 * time.Second,
		},
		AuthToken: authToken,
	}
}

// Get performs an HTTP GET request to the BitCentral backend API and unmarshals JSON response.
func (c *APIClient) Get(ctx context.Context, endpoint string, queryParams map[string]string, target interface{}) error {
	reqURL, err := url.Parse(c.BaseURL + endpoint)
	if err != nil {
		return fmt.Errorf("invalid URL: %w", err)
	}

	q := reqURL.Query()
	for k, v := range queryParams {
		if v != "" {
			q.Set(k, v)
		}
	}
	reqURL.RawQuery = q.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, reqURL.String(), nil)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Accept", "application/json")
	if c.AuthToken != "" {
		req.Header.Set("Authorization", "Bearer "+c.AuthToken)
	}

	resp, err := c.HTTPClient.Do(req)
	if err != nil {
		return fmt.Errorf("backend request failed (%s): %w", reqURL.String(), err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read backend response: %w", err)
	}

	if resp.StatusCode >= 400 {
		return fmt.Errorf("backend returned error status %d from %s: %s", resp.StatusCode, endpoint, string(bodyBytes))
	}

	if target != nil {
		if err := json.Unmarshal(bodyBytes, target); err != nil {
			return fmt.Errorf("failed to parse backend JSON response: %w (raw response: %s)", err, string(bodyBytes))
		}
	}

	return nil
}

// GetStringArg safely retrieves a string argument from CallToolRequest
func GetStringArg(request mcp.CallToolRequest, key string) string {
	if args, ok := request.Params.Arguments.(map[string]any); ok {
		if val, exists := args[key]; exists && val != nil {
			if str, ok := val.(string); ok {
				return strings.TrimSpace(str)
			}
			return strings.TrimSpace(fmt.Sprintf("%v", val))
		}
	}
	if args, ok := request.Params.Arguments.(map[string]interface{}); ok {
		if val, exists := args[key]; exists && val != nil {
			if str, ok := val.(string); ok {
				return strings.TrimSpace(str)
			}
			return strings.TrimSpace(fmt.Sprintf("%v", val))
		}
	}
	return ""
}

// GetNumberArg safely retrieves a number argument from CallToolRequest
func GetNumberArg(request mcp.CallToolRequest, key string) (float64, bool) {
	if args, ok := request.Params.Arguments.(map[string]any); ok {
		if val, exists := args[key]; exists && val != nil {
			switch n := val.(type) {
			case float64:
				return n, true
			case int:
				return float64(n), true
			case int64:
				return float64(n), true
			}
		}
	}
	if args, ok := request.Params.Arguments.(map[string]interface{}); ok {
		if val, exists := args[key]; exists && val != nil {
			switch n := val.(type) {
			case float64:
				return n, true
			case int:
				return float64(n), true
			case int64:
				return float64(n), true
			}
		}
	}
	return 0, false
}

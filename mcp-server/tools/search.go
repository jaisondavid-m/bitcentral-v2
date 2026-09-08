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

// allowedSearchKeywords are the only topics BitBot may Google.
// The query is always automatically scoped to one of these.
var allowedSearchKeywords = []string{
	"bitsathy", "bit sathy", "bannari amman institute of technology",
	"bitcentral", "jaison david",
}

// GoogleSearchResult holds a single search hit.
type GoogleSearchResult struct {
	Title   string `json:"title"`
	Link    string `json:"link"`
	Snippet string `json:"snippet"`
}

// GoogleSearchResponse is the relevant part of the Custom Search JSON API response.
type GoogleSearchResponse struct {
	Items []GoogleSearchResult `json:"items"`
	Error *struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

// GoogleSearchHandler performs a Google Custom Search restricted to
// BIT Sathy / BitCentral / Jaison David topics.
func GoogleSearchHandler(ctx context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	query := GetStringArg(request, "query")
	if query == "" {
		return mcp.NewToolResultText("Error: query parameter is required."), nil
	}

	// Reject anything not related to allowed topics
	queryLower := strings.ToLower(query)
	allowed := false
	for _, kw := range allowedSearchKeywords {
		if strings.Contains(queryLower, kw) {
			allowed = true
			break
		}
	}
	if !allowed {
		return mcp.NewToolResultText(
			"Search restricted: I can only search for information about BIT Sathy, BitCentral, or Jaison David.",
		), nil
	}

	apiKey := os.Getenv("GOOGLE_SEARCH_API_KEY")
	cx := os.Getenv("GOOGLE_SEARCH_CX")

	if apiKey == "" || cx == "" {
		return mcp.NewToolResultText(
			"Google Search is not configured. Please set GOOGLE_SEARCH_API_KEY and GOOGLE_SEARCH_CX environment variables.",
		), nil
	}

	// Always append a site/topic constraint so the model cannot drift
	searchQuery := query
	hasSiteConstraint := false
	for _, kw := range allowedSearchKeywords {
		if strings.Contains(queryLower, kw) {
			hasSiteConstraint = true
			break
		}
	}
	if !hasSiteConstraint {
		searchQuery = query + " BIT Sathy"
	}

	endpoint := "https://www.googleapis.com/customsearch/v1"
	params := url.Values{}
	params.Set("key", apiKey)
	params.Set("cx", cx)
	params.Set("q", searchQuery)
	params.Set("num", "5") // top 5 results

	reqURL := endpoint + "?" + params.Encode()

	httpCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	httpReq, err := http.NewRequestWithContext(httpCtx, http.MethodGet, reqURL, nil)
	if err != nil {
		return mcp.NewToolResultText(fmt.Sprintf("Failed to create search request: %v", err)), nil
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		return mcp.NewToolResultText(fmt.Sprintf("Google Search request failed: %v", err)), nil
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return mcp.NewToolResultText("Failed to read search response."), nil
	}

	var searchResp GoogleSearchResponse
	if err := json.Unmarshal(body, &searchResp); err != nil {
		return mcp.NewToolResultText("Failed to parse Google Search response."), nil
	}

	if searchResp.Error != nil {
		return mcp.NewToolResultText(
			fmt.Sprintf("Google Search API error %d: %s", searchResp.Error.Code, searchResp.Error.Message),
		), nil
	}

	if len(searchResp.Items) == 0 {
		return mcp.NewToolResultText("No search results found for: " + query), nil
	}

	// Format results as readable text for the AI
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("Google Search results for \"%s\":\n\n", query))
	for i, item := range searchResp.Items {
		sb.WriteString(fmt.Sprintf("%d. **%s**\n", i+1, item.Title))
		sb.WriteString(fmt.Sprintf("   %s\n", item.Snippet))
		sb.WriteString(fmt.Sprintf("   Source: %s\n\n", item.Link))
	}

	return mcp.NewToolResultText(sb.String()), nil
}

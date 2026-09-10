package handlers

import (
	"bufio"
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	"server/config"

	"github.com/gin-gonic/gin"
)

type InternalMarksCacheEntry struct {
	RollNo    string    `json:"roll_no"`
	RawData   string    `json:"raw_data"`
	CachedAt  time.Time `json:"cached_at"`
	ExpiresAt time.Time `json:"expires_at"`
}

type GradioJoinPayload struct {
	Data        []interface{} `json:"data"`
	EventData   interface{}   `json:"event_data"`
	FnIndex     int           `json:"fn_index"`
	TriggerID   interface{}   `json:"trigger_id"`
	SessionHash string        `json:"session_hash"`
}

type GradioSSEEvent struct {
	Msg    string `json:"msg"`
	Output struct {
		Data []interface{} `json:"data"`
	} `json:"output"`
	Success bool   `json:"success"`
	Error   string `json:"error"`
}

const (
	InternalMarksCacheDuration = 48 * time.Hour
	GradioSpaceHost            = "https://praneshjs-rewardpointssite.hf.space"
)

var istLocation = time.FixedZone("IST", 5*3600+30*60)

func formatIST(t time.Time) string {
	return t.In(istLocation).Format(time.RFC3339)
}

type InternalMarksHandler struct {
	mu           sync.RWMutex
	memoryCache  map[string]InternalMarksCacheEntry
	inFlightMu   sync.Mutex
	inFlightReqs map[string]chan struct{}
}

func NewInternalMarksHandler() *InternalMarksHandler {
	h := &InternalMarksHandler{
		memoryCache:  make(map[string]InternalMarksCacheEntry),
		inFlightReqs: make(map[string]chan struct{}),
	}
	h.initDBTable()
	return h
}

func (h *InternalMarksHandler) initDBTable() {
	if config.DB == nil {
		return
	}
	query := `
	CREATE TABLE IF NOT EXISTS internal_marks_cache (
		roll_no VARCHAR(64) PRIMARY KEY,
		raw_data MEDIUMTEXT NOT NULL,
		cached_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		expires_at TIMESTAMP NULL,
		INDEX idx_expires_at (expires_at)
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
	`
	if _, err := config.DB.Exec(query); err != nil {
		log.Printf("⚠️ Note: internal_marks_cache table init: %v", err)
	}
}

func (h *InternalMarksHandler) getFromMemory(rollNo string) (InternalMarksCacheEntry, bool) {
	h.mu.RLock()
	defer h.mu.RUnlock()

	entry, ok := h.memoryCache[rollNo]
	if !ok {
		return InternalMarksCacheEntry{}, false
	}
	if time.Now().After(entry.ExpiresAt) {
		return InternalMarksCacheEntry{}, false
	}
	return entry, true
}

func (h *InternalMarksHandler) saveToMemory(entry InternalMarksCacheEntry) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.memoryCache[entry.RollNo] = entry
}

func (h *InternalMarksHandler) getFromDB(rollNo string) (InternalMarksCacheEntry, bool) {
	if config.DB == nil {
		return InternalMarksCacheEntry{}, false
	}

	query := `SELECT roll_no, raw_data, cached_at, expires_at FROM internal_marks_cache WHERE roll_no = ? AND expires_at > NOW() LIMIT 1`
	var entry InternalMarksCacheEntry
	err := config.DB.QueryRow(query, rollNo).Scan(&entry.RollNo, &entry.RawData, &entry.CachedAt, &entry.ExpiresAt)
	if err != nil {
		return InternalMarksCacheEntry{}, false
	}
	// Sync back to in-memory cache
	h.saveToMemory(entry)
	return entry, true
}

func (h *InternalMarksHandler) saveToDB(entry InternalMarksCacheEntry) {
	if config.DB == nil {
		return
	}

	query := `
	INSERT INTO internal_marks_cache (roll_no, raw_data, cached_at, expires_at)
	VALUES (?, ?, ?, ?)
	ON DUPLICATE KEY UPDATE
		raw_data = VALUES(raw_data),
		cached_at = VALUES(cached_at),
		expires_at = VALUES(expires_at)
	`
	if _, err := config.DB.Exec(query, entry.RollNo, entry.RawData, entry.CachedAt, entry.ExpiresAt); err != nil {
		log.Printf("⚠️ Failed to persist internal marks cache for %s in DB: %v", entry.RollNo, err)
	}
}

// Fetch from Hugging Face Gradio Space
func (h *InternalMarksHandler) fetchFromHuggingFace(rollNo string) (string, error) {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	sessionHash := hex.EncodeToString(b)

	joinPayload := GradioJoinPayload{
		Data:        []interface{}{rollNo},
		EventData:   nil,
		FnIndex:     4,
		TriggerID:   nil,
		SessionHash: sessionHash,
	}

	bodyBytes, err := json.Marshal(joinPayload)
	if err != nil {
		return "", err
	}

	joinURL := GradioSpaceHost + "/gradio_api/queue/join?"
	req, err := http.NewRequest("POST", joinURL, bytes.NewBuffer(bodyBytes))
	if err != nil {
		return "", err
	}
	req.Header.Set("Content-Type", "application/json")
	if hfToken := os.Getenv("HF_TOKEN"); hfToken != "" {
		req.Header.Set("Authorization", "Bearer "+hfToken)
	} else if hfToken := os.Getenv("HUGGINGFACE_TOKEN"); hfToken != "" {
		req.Header.Set("Authorization", "Bearer "+hfToken)
	}

	client := &http.Client{Timeout: 35 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("gradio queue join request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		respBody, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("gradio returned status %d: %s", resp.StatusCode, string(respBody))
	}

	// Connect to SSE stream
	dataURL := fmt.Sprintf("%s/gradio_api/queue/data?session_hash=%s", GradioSpaceHost, sessionHash)
	sseReq, err := http.NewRequest("GET", dataURL, nil)
	if err != nil {
		return "", err
	}
	sseReq.Header.Set("Accept", "text/event-stream")
	if hfToken := os.Getenv("HF_TOKEN"); hfToken != "" {
		sseReq.Header.Set("Authorization", "Bearer "+hfToken)
	} else if hfToken := os.Getenv("HUGGINGFACE_TOKEN"); hfToken != "" {
		sseReq.Header.Set("Authorization", "Bearer "+hfToken)
	}

	sseClient := &http.Client{Timeout: 50 * time.Second}
	sseResp, err := sseClient.Do(sseReq)
	if err != nil {
		return "", fmt.Errorf("gradio sse stream connection failed: %w", err)
	}
	defer sseResp.Body.Close()

	scanner := bufio.NewScanner(sseResp.Body)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		dataJson := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		var event GradioSSEEvent
		if err := json.Unmarshal([]byte(dataJson), &event); err != nil {
			continue
		}

		if event.Msg == "process_completed" {
			if len(event.Output.Data) > 0 {
				if str, ok := event.Output.Data[0].(string); ok {
					return str, nil
				}
				marshaled, _ := json.Marshal(event.Output.Data[0])
				return string(marshaled), nil
			}
			return "", fmt.Errorf("gradio returned empty output")
		}
	}

	if err := scanner.Err(); err != nil {
		return "", fmt.Errorf("error reading gradio stream: %w", err)
	}

	return "", fmt.Errorf("gradio stream completed without output")
}

// GetInternalMarksConversion handles GET /internal-marks/conversion?roll_no=...
func (h *InternalMarksHandler) GetInternalMarksConversion(c *gin.Context) {
	rollNo := strings.TrimSpace(c.Query("roll_no"))
	if rollNo == "" {
		rollNo = strings.TrimSpace(c.Query("rollNo"))
	}
	if rollNo == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"error":   "roll_no parameter is required",
		})
		return
	}

	normRoll := strings.ToUpper(strings.ReplaceAll(rollNo, " ", ""))

	// 1. Check in-memory cache (fastest)
	if entry, found := h.getFromMemory(normRoll); found {
		c.JSON(http.StatusOK, gin.H{
			"success":    true,
			"roll_no":    normRoll,
			"raw":        entry.RawData,
			"cached":     true,
			"cached_at":  formatIST(entry.CachedAt),
			"expires_at": formatIST(entry.ExpiresAt),
		})
		return
	}

	// 2. Check DB cache
	if entry, found := h.getFromDB(normRoll); found {
		c.JSON(http.StatusOK, gin.H{
			"success":    true,
			"roll_no":    normRoll,
			"raw":        entry.RawData,
			"cached":     true,
			"cached_at":  formatIST(entry.CachedAt),
			"expires_at": formatIST(entry.ExpiresAt),
		})
		return
	}

	// 3. Prevent duplicate concurrent in-flight requests for the same roll number (Single-flight protection)
	h.inFlightMu.Lock()
	ch, inFlight := h.inFlightReqs[normRoll]
	if inFlight {
		h.inFlightMu.Unlock()
		// Wait for the in-flight request to finish
		<-ch
		// Check cache again
		if entry, found := h.getFromMemory(normRoll); found {
			c.JSON(http.StatusOK, gin.H{
				"success":    true,
				"roll_no":    normRoll,
				"raw":        entry.RawData,
				"cached":     true,
				"cached_at":  formatIST(entry.CachedAt),
				"expires_at": formatIST(entry.ExpiresAt),
			})
			return
		}
	} else {
		ch = make(chan struct{})
		h.inFlightReqs[normRoll] = ch
		h.inFlightMu.Unlock()
		defer func() {
			h.inFlightMu.Lock()
			delete(h.inFlightReqs, normRoll)
			close(ch)
			h.inFlightMu.Unlock()
		}()
	}

	// 4. Fetch from Hugging Face Gradio API
	rawData, err := h.fetchFromHuggingFace(normRoll)
	if err != nil {
		log.Printf("❌ Failed to fetch internal marks from HF for %s: %v", normRoll, err)
		c.JSON(http.StatusBadGateway, gin.H{
			"success": false,
			"error":   fmt.Sprintf("Failed to fetch conversion from Hugging Face: %v", err),
		})
		return
	}

	now := time.Now()
	expiresAt := now.Add(InternalMarksCacheDuration)

	entry := InternalMarksCacheEntry{
		RollNo:    normRoll,
		RawData:   rawData,
		CachedAt:  now,
		ExpiresAt: expiresAt,
	}

	// 5. Store in 48-hour cache (Memory + DB)
	h.saveToMemory(entry)
	go h.saveToDB(entry)

	c.JSON(http.StatusOK, gin.H{
		"success":    true,
		"roll_no":    normRoll,
		"raw":        rawData,
		"cached":     false,
		"cached_at":  formatIST(now),
		"expires_at": formatIST(expiresAt),
	})
}

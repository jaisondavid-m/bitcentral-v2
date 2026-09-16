package services

import (
	"bytes"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"time"
)

type CloudinaryUploadResult struct {
	PublicID     string `json:"public_id"`
	SecureURL    string `json:"secure_url"`
	URL          string `json:"url"`
	Format       string `json:"format"`
	Bytes        int64  `json:"bytes"`
	Width        int    `json:"width"`
	Height       int    `json:"height"`
	OriginalName string `json:"original_filename"`
	Error        *struct {
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

// UploadToCloudinary uploads a file stream or bytes directly to Cloudinary using Signed REST API
func UploadToCloudinary(fileHeader *multipart.FileHeader, customFolder ...string) (string, error) {
	cloudName := strings.TrimSpace(os.Getenv("CLOUDINARY_CLOUD_NAME"))
	apiKey := strings.TrimSpace(os.Getenv("CLOUDINARY_API_KEY"))
	apiSecret := strings.TrimSpace(os.Getenv("CLOUDINARY_API_SECRET"))

	if cloudName == "" {
		cloudName = "root"
	}
	if apiKey == "" {
		apiKey = "332117387278742"
	}
	if apiSecret == "" {
		apiSecret = "Hta5Baon5D6e4Lc7s10OOtTvKYw"
	}

	folder := strings.TrimSpace(os.Getenv("CLOUDINARY_FOLDER"))
	if len(customFolder) > 0 && strings.TrimSpace(customFolder[0]) != "" {
		folder = strings.TrimSpace(customFolder[0])
	}
	if folder == "" {
		folder = "bitcentral/lost_found"
	}

	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open uploaded file: %w", err)
	}
	defer file.Close()

	timestamp := strconv.FormatInt(time.Now().Unix(), 10)

	// Build parameters to sign (Cloudinary requires alphabetical sorting of signed params)
	paramsToSign := map[string]string{
		"timestamp": timestamp,
	}
	if folder != "" {
		paramsToSign["folder"] = folder
	}

	var keys []string
	for k := range paramsToSign {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	var signParts []string
	for _, k := range keys {
		signParts = append(signParts, fmt.Sprintf("%s=%s", k, paramsToSign[k]))
	}
	stringToSign := strings.Join(signParts, "&") + apiSecret

	hasher := sha1.New()
	hasher.Write([]byte(stringToSign))
	signature := hex.EncodeToString(hasher.Sum(nil))

	// Create multipart request body
	bodyBuf := &bytes.Buffer{}
	writer := multipart.NewWriter(bodyBuf)

	for k, v := range paramsToSign {
		if err := writer.WriteField(k, v); err != nil {
			return "", fmt.Errorf("failed to write form field %s: %w", k, err)
		}
	}

	if err := writer.WriteField("api_key", apiKey); err != nil {
		return "", fmt.Errorf("failed to write api_key: %w", err)
	}
	if err := writer.WriteField("signature", signature); err != nil {
		return "", fmt.Errorf("failed to write signature: %w", err)
	}

	part, err := writer.CreateFormFile("file", filepath.Base(fileHeader.Filename))
	if err != nil {
		return "", fmt.Errorf("failed to create form file: %w", err)
	}
	if _, err := io.Copy(part, file); err != nil {
		return "", fmt.Errorf("failed to copy file to form: %w", err)
	}

	if err := writer.Close(); err != nil {
		return "", fmt.Errorf("failed to close multipart writer: %w", err)
	}

	uploadURL := fmt.Sprintf("https://api.cloudinary.com/v1_1/%s/image/upload", cloudName)
	req, err := http.NewRequest("POST", uploadURL, bodyBuf)
	if err != nil {
		return "", fmt.Errorf("failed to create http request: %w", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{Timeout: 30 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to connect to Cloudinary: %w", err)
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read Cloudinary response: %w", err)
	}

	var result CloudinaryUploadResult
	if err := json.Unmarshal(respBytes, &result); err != nil {
		return "", fmt.Errorf("failed to parse Cloudinary response: %w (raw: %s)", err, string(respBytes))
	}

	if result.Error != nil && result.Error.Message != "" {
		return "", fmt.Errorf("cloudinary error: %s", result.Error.Message)
	}

	if result.SecureURL != "" {
		return result.SecureURL, nil
	}
	if result.URL != "" {
		return result.URL, nil
	}

	return "", fmt.Errorf("cloudinary upload succeeded but returned no URL: %s", string(respBytes))
}

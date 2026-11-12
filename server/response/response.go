package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// ErrorInfo represents structured error details
type ErrorInfo struct {
	Code    string      `json:"code"`
	Details interface{} `json:"details,omitempty"`
}

// APIResponse represents the standardized JSON response envelope
type APIResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   *ErrorInfo  `json:"error,omitempty"`
}

// JSON sends a standardized JSON response
func JSON(c *gin.Context, statusCode int, success bool, message string, data interface{}, errInfo *ErrorInfo) {
	c.JSON(statusCode, APIResponse{
		Success: success,
		Message: message,
		Data:    data,
		Error:   errInfo,
	})
}

// OK sends a 200 OK standardized success response
func OK(c *gin.Context, message string, data interface{}) {
	JSON(c, http.StatusOK, true, message, data, nil)
}

// Created sends a 201 Created standardized success response
func Created(c *gin.Context, message string, data interface{}) {
	JSON(c, http.StatusCreated, true, message, data, nil)
}

// Success sends a success response with a custom status code
func Success(c *gin.Context, statusCode int, message string, data interface{}) {
	JSON(c, statusCode, true, message, data, nil)
}

// NoContent sends a 204 No Content response
func NoContent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

// Error sends a standardized error response with custom HTTP status code and error details
func Error(c *gin.Context, statusCode int, code string, message string, details interface{}) {
	JSON(c, statusCode, false, message, nil, &ErrorInfo{
		Code:    code,
		Details: details,
	})
}

// BadRequest sends a 400 Bad Request error response
func BadRequest(c *gin.Context, message string, details ...interface{}) {
	var d interface{}
	if len(details) > 0 {
		d = details[0]
	}
	Error(c, http.StatusBadRequest, "BAD_REQUEST", message, d)
}

// ValidationError sends a 422 Unprocessable Entity (or 400) validation error response
func ValidationError(c *gin.Context, message string, details ...interface{}) {
	var d interface{}
	if len(details) > 0 {
		d = details[0]
	}
	Error(c, http.StatusUnprocessableEntity, "VALIDATION_ERROR", message, d)
}

// Unauthorized sends a 401 Unauthorized error response
func Unauthorized(c *gin.Context, message string) {
	if message == "" {
		message = "Authentication required"
	}
	Error(c, http.StatusUnauthorized, "UNAUTHORIZED", message, nil)
}

// Forbidden sends a 403 Forbidden error response
func Forbidden(c *gin.Context, message string) {
	if message == "" {
		message = "Access denied"
	}
	Error(c, http.StatusForbidden, "FORBIDDEN", message, nil)
}

// NotFound sends a 404 Not Found error response
func NotFound(c *gin.Context, message string) {
	if message == "" {
		message = "Resource not found"
	}
	Error(c, http.StatusNotFound, "NOT_FOUND", message, nil)
}

// InternalServerError sends a 500 Internal Server Error response without leaking sensitive info
func InternalServerError(c *gin.Context, message string) {
	if message == "" {
		message = "An internal server error occurred"
	}
	Error(c, http.StatusInternalServerError, "INTERNAL_SERVER_ERROR", message, nil)
}

import test from "node:test";
import assert from "node:assert/strict";

function normalizeApiError(error, fallback = "An unexpected error occurred") {
  return error?.normalized?.message || error?.response?.data?.message || error?.message || fallback;
}

function parseStandardResponse(data) {
  if (!data || typeof data !== "object") {
    return { success: false, message: "Invalid payload", data: null, error: { code: "PARSE_ERROR" } };
  }
  return {
    success: Boolean(data.success),
    message: data.message || "",
    data: data.data !== undefined ? data.data : null,
    error: data.error || null,
  };
}

test("Frontend response parser extracts data correctly from standardized success response", () => {
  const backendPayload = {
    success: true,
    message: "User profile loaded",
    data: {
      id: 42,
      name: "John Doe",
      email: "john@bitsathy.ac.in",
    },
  };

  const parsed = parseStandardResponse(backendPayload);
  assert.equal(parsed.success, true);
  assert.equal(parsed.message, "User profile loaded");
  assert.equal(parsed.data.id, 42);
  assert.equal(parsed.data.name, "John Doe");
  assert.equal(parsed.error, null);
});

test("Frontend error normalizer handles standardized error responses", () => {
  const standardError = {
    response: {
      status: 400,
      data: {
        success: false,
        message: "Invalid student roll number format",
        error: {
          code: "VALIDATION_ERROR",
          details: { field: "roll_no" },
        },
      },
    },
  };

  const msg = normalizeApiError(standardError);
  assert.equal(msg, "Invalid student roll number format");
});

test("Frontend error normalizer handles fallback on missing network response", () => {
  const networkError = new Error("Network Error");
  const msg = normalizeApiError(networkError, "Connection timeout");
  assert.equal(msg, "Network Error");

  const emptyError = {};
  const fallbackMsg = normalizeApiError(emptyError, "Server is unreachable");
  assert.equal(fallbackMsg, "Server is unreachable");
});


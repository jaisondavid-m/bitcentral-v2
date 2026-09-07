import api from "./axios";

/**
 * Sends a message to the BitBot AI assistant (Ollama Qwen2.5 1.5B + BitCentral MCP tools)
 * @param {Object} params
 * @param {string} params.message - The user's query text
 * @param {Array} params.history - Previous chat history [{role: 'user'|'assistant', content: string}]
 * @param {string} [params.rollNo] - Optional current user's roll number
 */
export async function sendChatMessage({ message, history = [], rollNo = "" }) {
  try {
    const response = await api.post("/api/chat", {
      message,
      history,
      roll_no: rollNo,
    });
    return response.data;
  } catch (error) {
    console.error("AI Chat API call failed:", error);
    const errorMsg = error.response?.data?.error || error.message || "Failed to reach AI service";
    return {
      success: false,
      error: errorMsg,
      message: "⚠️ Unable to connect to BitBot AI service. Please check your internet connection or try again later.",
    };
  }
}

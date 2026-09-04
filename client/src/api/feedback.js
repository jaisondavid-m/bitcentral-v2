import api, { getAuthenticatedHeaders } from "./axios.js";

async function getAdminHeaders() {
  return getAuthenticatedHeaders();
}

// User Feedback Chat Endpoints
export async function sendFeedbackMessage(message, senderName) {
  const headers = await getAuthenticatedHeaders();
  const response = await api.post("/feedback/messages", { message, sender_name: senderName }, { headers });
  return response.data?.data || null;
}

export async function getFeedbackMessages(markRead = false) {
  const headers = await getAuthenticatedHeaders();
  const url = markRead ? "/feedback/messages?mark_read=true" : "/feedback/messages";
  const response = await api.get(url, { headers });
  return response.data?.data || [];
}

// Admin Feedback Management Endpoints
export async function getAdminFeedbackConversations() {
  const headers = await getAdminHeaders();
  const response = await api.get("/admin/feedback/conversations", { headers });
  return response.data?.data || [];
}

export async function getAdminFeedbackMessages(userUid) {
  const headers = await getAdminHeaders();
  const response = await api.get(`/admin/feedback/messages/${userUid}`, { headers });
  return response.data?.data || [];
}

export async function sendAdminFeedbackReply(userUid, message) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/feedback/reply", { user_uid: userUid, message }, { headers });
  return response.data?.data || null;
}

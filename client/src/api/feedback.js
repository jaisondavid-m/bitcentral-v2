import api, { getAuthenticatedHeaders } from "./axios.js";
import { auth } from "../Authentication/firebase.js";

async function getAdminHeaders() {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be signed in as admin");
  }
  const idToken = await currentUser.getIdToken();
  return { Authorization: `Bearer ${idToken}` };
}

// User Feedback Chat Endpoints
export async function sendFeedbackMessage(message, senderName) {
  const headers = await getAuthenticatedHeaders();
  const response = await api.post("/feedback/messages", { message, sender_name: senderName }, { headers });
  return response.data?.data || null;
}

export async function getFeedbackMessages() {
  const headers = await getAuthenticatedHeaders();
  const response = await api.get("/feedback/messages", { headers });
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

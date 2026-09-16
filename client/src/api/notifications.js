import api, { getAuthenticatedHeaders } from "./axios";

export async function getUserNotifications() {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.get("/notifications", { headers });
    return response.data;
  } catch (error) {
    // If not authenticated or error, try public fetch
    try {
      const fallback = await api.get("/notifications");
      return fallback.data;
    } catch (e) {
      return { success: false, unread_count: 0, count: 0, data: [] };
    }
  }
}

export async function markNotificationAsRead(id) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.post(`/notifications/${id}/read`, {}, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: error?.message || "Failed to mark as read" };
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.post("/notifications/read-all", {}, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: error?.message || "Failed to mark all as read" };
  }
}

export async function dismissNotification(id) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.delete(`/notifications/${id}/dismiss`, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: error?.message || "Failed to dismiss notification" };
  }
}

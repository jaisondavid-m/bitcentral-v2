import api, { getAuthenticatedHeaders } from "./axios";

export const getHelpRooms = async (category = "All", search = "", page = 1) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get("/api/help/rooms", {
    params: { category, search, page },
    headers,
  });
  return res.data;
};

export const createHelpRoom = async ({ title, content, category }) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.post("/api/help/rooms", { title, content, category }, { headers });
  return res.data;
};

export const getHelpRoomByID = async (roomId) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get(`/api/help/rooms/${roomId}`, { headers });
  return res.data;
};

export const getHelpFeed = async (parentId = "") => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get("/api/help/messages", {
    params: { parent_id: parentId },
    headers,
  });
  return res.data;
};

export const postHelpMessage = async (content, parentId = "") => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.post("/api/help/messages", { content, parent_id: parentId }, { headers });
  return res.data;
};

export const deleteHelpMessage = async (messageId) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.delete(`/api/help/messages/${messageId}`, { headers });
  return res.data;
};

export const getHelpMessages = async (roomId) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get(`/api/help/rooms/${roomId}/messages`, { headers });
  return res.data;
};

export const sendHelpMessage = async (roomId, content) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.post(`/api/help/rooms/${roomId}/messages`, { content }, { headers });
  return res.data;
};

export const resolveHelpRoom = async (roomId) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.post(`/api/help/rooms/${roomId}/resolve`, {}, { headers });
  return res.data;
};

export const submitHelpReport = async ({ targetType, targetId, reason, details }) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.post("/api/help/reports", { target_type: targetType, target_id: targetId, reason, details }, { headers });
  return res.data;
};

export const blockHelpUser = async (roomId, targetAnonLabel) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.post("/api/help/block", { room_id: roomId, target_anon_label: targetAnonLabel }, { headers });
  return res.data;
};

export const getMyHelpData = async () => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get("/api/help/my", { headers });
  return res.data;
};

// --- ADMIN API CALLS ---

export const getAdminHelpStats = async () => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get("/admin/help/stats", { headers });
  return res.data;
};

export const getAdminHelpRooms = async () => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get("/admin/help/rooms", { headers });
  return res.data;
};

export const getAdminHelpRoomByID = async (roomId) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get(`/admin/help/rooms/${roomId}`, { headers });
  return res.data;
};

export const deleteAdminHelpMessage = async (messageId) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.delete(`/admin/help/messages/${messageId}`, { headers });
  return res.data;
};

export const closeAdminHelpRoom = async (roomId) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.post(`/admin/help/rooms/${roomId}/close`, {}, { headers });
  return res.data;
};

export const getAdminHelpReports = async () => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get("/admin/help/reports", { headers });
  return res.data;
};

export const actionAdminHelpReport = async (reportId, action) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.post(`/admin/help/reports/${reportId}/action`, { action }, { headers });
  return res.data;
};

export const getAdminHelpRestrictions = async () => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.get("/admin/help/restrictions", { headers });
  return res.data;
};

export const updateAdminHelpRestriction = async ({ target_uid, status, reason }) => {
  const headers = await getAuthenticatedHeaders();
  const res = await api.post("/admin/help/restrictions", { target_uid, status, reason }, { headers });
  return res.data;
};

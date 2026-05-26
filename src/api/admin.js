import api from "./axios";
import { auth } from "../Authentication/firebase.js";

async function getAdminHeaders() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in to use the admin dashboard");
  }

  const idToken = await currentUser.getIdToken();

  return {
    Authorization: `Bearer ${idToken}`,
  };
}

export async function listAdminUsers() {
  const headers = await getAdminHeaders();
  const response = await api.get("/admin/users", {
    headers,
  });

  return {
    success: response.data.success,
    users: response.data.users || [],
  };
}

export async function listAllAdminUsers() {
  const data = await listAdminUsers();

  return {
    users: data.users || [],
    totalUsers: (data.users || []).length,
  };
}

export async function deleteAdminUser({ uid }) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/users/${uid}`, {
    headers,
  });

  return response.data;
}

export async function setAdminUserBlocked({ uid, blocked }) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/users/${uid}/block`, { blocked }, { headers });
  return response.data;
}

export async function updateUsers() {
  const headers = await getAdminHeaders();
  const response = await api.get("/admin/users/update", {
    headers,
  });

  return response.data;
}

export async function listQBAnswerKeys({ semester, year } = {}) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (semester) params.set("semester", semester);
  if (year) params.set("year", year);
  const response = await api.get(`/admin/qb?${params.toString()}`, { headers });
  return response.data;
}

export async function createQBAnswerKey(payload) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/qb", payload, { headers });
  return response.data;
}

export async function updateQBAnswerKey(id, payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/qb/${id}`, payload, { headers });
  return response.data;
}

export async function createQBAnswerKeysBatch(payload) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/qb/batch", payload, { headers });
  return response.data;
}

export async function reorderQBAnswerKeys(payload) {
  const headers = await getAdminHeaders();
  const response = await api.put("/admin/qb/reorder", payload, { headers });
  return response.data;
}

export async function deleteQBAnswerKey(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/qb/${id}`, { headers });
  return response.data;
}

export async function uploadMessMenuCsv(formData) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/mess/upload", formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
    timeout: 0,
  });
  return response.data;
}

export async function listMessMenuRows({ hostel, date }) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (hostel) params.set("hostel", hostel);
  if (date) params.set("date", date);
  const response = await api.get(`/admin/mess?${params.toString()}`, { headers });
  return response.data;
}

export async function updateMessMenuRow(id, payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/mess/${id}`, payload, { headers });
  return response.data;
}

export async function deleteMessMenuRow(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/mess/${id}`, { headers });
  return response.data;
}

export async function uploadAdminFile(formData) {
  const headers = await getAdminHeaders();
  // Let axios set Content-Type with boundary for multipart
  const response = await api.post(`/admin/upload`, formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
    timeout: 0,
  });
  const data = response.data || {};
  if (data.url && data.url.startsWith("/")) {
    try {
      // Ensure returned url is absolute so <input type="url"> accepts it
      const base = import.meta.env.VITE_API_BASE_URL || api.defaults.baseURL;
      data.url = new URL(data.url, base).href;
    } catch (e) {
      // fallback: leave as-is
    }
  }
  return data;
}

export async function listAdminCards() {
  const headers = await getAdminHeaders();
  const response = await api.get(`/admin/cards`, { headers });
  return response.data;
}

export async function createCard(payload) {
  const headers = await getAdminHeaders();
  const response = await api.post(`/admin/cards`, payload, { headers });
  return response.data;
}

export async function updateCard(id, payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/cards/${id}`, payload, { headers });
  return response.data;
}

export async function reorderAdminCards(payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/cards/reorder`, payload, { headers });
  return response.data;
}

export async function deleteCard(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/cards/${id}`, { headers });
  return response.data;
}
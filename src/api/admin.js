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

export async function deleteQBAnswerKey(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/qb/${id}`, { headers });
  return response.data;
}
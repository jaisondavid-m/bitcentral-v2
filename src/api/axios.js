import axios from "axios";
import { auth } from "../Authentication/firebase.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function listQBAnswerKeys({ semester } = {}) {
  const params = new URLSearchParams();
  if (semester) params.set("semester", semester);
  const res = await api.get(`/qb?${params}`);
  return res.data.data || [];
}

export default api;

export async function getAuthenticatedHeaders() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in");
  }

  const idToken = await currentUser.getIdToken();

  return {
    Authorization: `Bearer ${idToken}`,
  };
}
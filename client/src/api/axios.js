import axios from "axios";
import { auth } from "@/config/firebase.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000000,
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

export async function getMeProfile() {
  const headers = await getAuthenticatedHeaders();
  const response = await api.get("/me", { headers });
  return response.data?.data || null;
}

export async function getV2Profile() {
  const headers = await getAuthenticatedHeaders();
  const response = await api.get("/v2/profile", { headers });
  return response.data?.data || null;
}

export async function getSponsorsLeaderboard() {
  try {
    const response = await api.get("/sponsors/leaderboard");
    return response.data;
  } catch (error) {
    return {
      success: true,
      total_raised: 0,
      total_supporters: 0,
      sponsors: [],
    };
  }
}

export async function checkUserContribution({ phone, email } = {}) {
  try {
    const response = await api.post("/sponsors/check-contribution", { phone, email });
    return response.data;
  } catch (error) {
    return {
      success: false,
      found: false,
      amount: 0,
      rank: 0,
    };
  }
}

export async function createSponsorOrder({ amount, name, email, phone }) {
  try {
    const response = await api.post("/sponsors/create-order", { amount, name, email, phone });
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function captureSponsorPayment({ payment_id, amount }) {
  try {
    const response = await api.post("/sponsors/capture-payment", { payment_id, amount });
    return response.data;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getVerifiedCertificate(id) {
  try {
    const response = await api.get(`/sponsors/certificate/${encodeURIComponent(id)}`);
    return response.data;
  } catch (error) {
    return { success: false, verified: false, error: "Failed to fetch certificate" };
  }
}


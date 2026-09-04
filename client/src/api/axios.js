import axios from "axios";
import { auth, getStoredToken } from "@/config/auth.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 1000000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function postGoogleAuth(credential) {
  try {
    const res = await api.post("/auth/google", { credential });
    return res.data;
  } catch (err) {
    console.error("Backend google auth call failed:", err);
    return null;
  }
}

export async function postGoogleLogout() {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (err) {
    return null;
  }
}

export async function listQBAnswerKeys({ semester } = {}) {
  const params = new URLSearchParams();
  if (semester) params.set("semester", semester);
  const res = await api.get(`/qb?${params}`);
  return res.data.data || [];
}

export default api;

export async function getAuthenticatedHeaders() {
  const token = getStoredToken();

  if (!token) {
    throw new Error("You must be signed in");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

let inFlightMePromise = null;

export async function getMeProfile() {
  if (inFlightMePromise) {
    return inFlightMePromise;
  }
  inFlightMePromise = (async () => {
    try {
      const headers = await getAuthenticatedHeaders();
      const response = await api.get("/me", { headers });
      return response.data?.data || null;
    } finally {
      inFlightMePromise = null;
    }
  })();
  return inFlightMePromise;
}

let inFlightV2Promise = null;

export async function getV2Profile() {
  if (inFlightV2Promise) {
    return inFlightV2Promise;
  }
  inFlightV2Promise = (async () => {
    try {
      const headers = await getAuthenticatedHeaders();
      const response = await api.get("/v2/profile", { headers });
      return response.data?.data || null;
    } finally {
      inFlightV2Promise = null;
    }
  })();
  return inFlightV2Promise;
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
      department_leaderboard: [],
    };
  }
}

export async function getDepartmentLeaderboard() {
  try {
    const response = await api.get("/sponsors/department-leaderboard");
    return response.data;
  } catch (error) {
    return {
      success: true,
      department_leaderboard: [],
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

export async function createSponsorOrder({ amount, name, email, phone, is_anonymous, target_department_id, target_department_code }) {
  try {
    const response = await api.post("/sponsors/create-order", {
      amount,
      name,
      email,
      phone,
      is_anonymous,
      target_department_id,
      target_department_code,
    });
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


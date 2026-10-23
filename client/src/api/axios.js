import axios from "axios";
import { auth, getStoredToken } from "@/config/auth.js";

export function getApiBaseUrl() {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:8080";
    }
  }
  return import.meta.env.VITE_API_BASE_URL || "https://bitcentral-v2.onrender.com";
}

const api = axios.create({
  baseURL: "https://bitcentral-v2.onrender.com",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    config.baseURL = getApiBaseUrl();
    try {
      const token = getStoredToken();
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {}
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      const url = error.config?.url || "";
      // Prevent loop if the auth or logout calls themselves trigger 401
      if (!url.includes("/auth/logout") && !url.includes("/auth/google")) {
        try {
          const { logout } = await import("@/config/auth.js");
          await logout();
        } catch (e) {
          localStorage.removeItem("google_auth_token");
          localStorage.removeItem("jwt");
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("auth_state_changed"));
        }
      }
    }
    return Promise.reject(error);
  }
);

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

let meCache = { data: null, timestamp: 0 };
let inFlightMePromise = null;
let v2Cache = { data: null, timestamp: 0 };
let inFlightV2Promise = null;

export function clearProfileCache() {
  meCache = { data: null, timestamp: 0 };
  v2Cache = { data: null, timestamp: 0 };
}

if (typeof window !== "undefined") {
  window.addEventListener("auth_state_changed", clearProfileCache);
}

export async function getMeProfile(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && meCache.data && now - meCache.timestamp < 60 * 1000) {
    return meCache.data;
  }
  if (inFlightMePromise) {
    return inFlightMePromise;
  }
  inFlightMePromise = (async () => {
    try {
      const headers = await getAuthenticatedHeaders();
      const response = await api.get("/me", { headers });
      const data = response.data?.data || null;
      meCache = { data, timestamp: Date.now() };
      return data;
    } finally {
      inFlightMePromise = null;
    }
  })();
  return inFlightMePromise;
}

export async function getV2Profile(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && v2Cache.data && now - v2Cache.timestamp < 60 * 1000) {
    return v2Cache.data;
  }
  if (inFlightV2Promise) {
    return inFlightV2Promise;
  }
  inFlightV2Promise = (async () => {
    try {
      const headers = await getAuthenticatedHeaders();
      const response = await api.get("/v2/profile", { headers });
      const data = response.data?.data || null;
      v2Cache = { data, timestamp: Date.now() };
      return data;
    } finally {
      inFlightV2Promise = null;
    }
  })();
  return inFlightV2Promise;
}

let sponsorsLeaderboardCache = { data: null, timestamp: 0 };

export async function getSponsorsLeaderboard(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && sponsorsLeaderboardCache.data && now - sponsorsLeaderboardCache.timestamp < 2 * 60 * 1000) {
    return sponsorsLeaderboardCache.data;
  }
  try {
    const response = await api.get("/sponsors/leaderboard");
    sponsorsLeaderboardCache = { data: response.data, timestamp: Date.now() };
    return response.data;
  } catch (error) {
    return sponsorsLeaderboardCache.data || {
      success: true,
      total_raised: 0,
      total_supporters: 0,
      sponsors: [],
      department_leaderboard: [],
    };
  }
}

let deptLeaderboardCache = { data: null, timestamp: 0 };

export async function getDepartmentLeaderboard(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && deptLeaderboardCache.data && now - deptLeaderboardCache.timestamp < 2 * 60 * 1000) {
    return deptLeaderboardCache.data;
  }
  try {
    const response = await api.get("/sponsors/department-leaderboard");
    deptLeaderboardCache = { data: response.data, timestamp: Date.now() };
    return response.data;
  } catch (error) {
    return deptLeaderboardCache.data || {
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

export async function getFacultyDirectory({ query = "", department = "", page = 1, limit = 24 } = {}) {
  try {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (department && department !== "ALL") params.set("dept", department);
    if (page) params.set("page", page.toString());
    if (limit) params.set("limit", limit.toString());
    const response = await api.get(`/faculty-directory?${params.toString()}`);
    return response.data;
  } catch (error) {
    return { success: false, total: 0, page: 1, limit: 24, total_pages: 0, data: [], departments: [], error: error.message };
  }
}



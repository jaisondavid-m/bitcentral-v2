import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_BASE_URL;
const sanitizedBaseURL = rawBaseURL
  ? String(rawBaseURL).replace(/^"|"$/g, "").trim().replace(/\/$/, "")
  : "";

const resolvedBaseURL = sanitizedBaseURL || "https://api.bitcentral.bitsathy.in";

const api = axios.create({
  baseURL: resolvedBaseURL,
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
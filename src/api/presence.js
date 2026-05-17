import api, { getAuthenticatedHeaders } from "./axios";

export async function pingPresence(user = null) {
  const headers = user && typeof user.getIdToken === "function"
    ? { Authorization: `Bearer ${await user.getIdToken()}` }
    : await getAuthenticatedHeaders();
  const response = await api.post("/presence/ping", {}, { headers });
  return response.data;
}
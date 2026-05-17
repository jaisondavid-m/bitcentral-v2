import api, { getAuthenticatedHeaders } from "./axios";

export async function pingPresence() {
  const headers = await getAuthenticatedHeaders();
  const response = await api.post("/presence/ping", {}, { headers });
  return response.data;
}
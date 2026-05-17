import api, { getAuthenticatedHeaders } from "./axios";

export async function pingPresence(user = null, routeLabel = "Other") {
  const headers = user && typeof user.getIdToken === "function"
    ? { Authorization: `Bearer ${await user.getIdToken()}` }
    : await getAuthenticatedHeaders();
  const response = await api.post("/presence/ping", { routeLabel }, { headers });
  return response.data;
}
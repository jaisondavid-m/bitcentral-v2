import api, { getAuthenticatedHeaders } from "./axios";
import { PING_ON } from "../config/runtimeFlags.js";

export async function pingPresence(user = null, routeLabel = "Other") {
  if (!PING_ON) {
    return null;
  }

  const headers = user && typeof user.getIdToken === "function"
    ? { Authorization: `Bearer ${await user.getIdToken()}` }
    : await getAuthenticatedHeaders();
  const response = await api.post("/presence/ping", { routeLabel }, { headers });
  return response.data;
}
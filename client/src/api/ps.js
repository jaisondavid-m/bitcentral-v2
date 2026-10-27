import api from "@/api/axios.js";

// Connect PS account (store token from extension)
export async function connectPS(psToken) {
  try {
    const response = await api.post("/ps/connect", { ps_token: psToken });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to connect PS",
    };
  }
}

// Disconnect PS account
export async function disconnectPS() {
  try {
    const response = await api.post("/ps/disconnect");
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message || "Failed to disconnect PS",
    };
  }
}

// Get PS connection status
export async function getPSStatus(email = null) {
  try {
    const params = {};
    if (email) params.email = email;
    const response = await api.get("/ps/status", { params });
    return response.data;
  } catch (error) {
    return { success: false, connected: false };
  }
}

// Get PS proxy image URL (returns the URL string to use as img src)
export function getPSImageUrl(path = "/api/ps_v2/user/images/image.jpg", email = null) {
  const baseUrl = api.defaults.baseURL || "http://localhost:8080";
  let url = `${baseUrl}/ps/proxy/image?path=${encodeURIComponent(path)}`;
  if (email) url += `&email=${encodeURIComponent(email)}`;
  return url;
}

// Fetch PS proxy image as blob (for direct use)
export async function fetchPSImage(path = "/api/ps_v2/user/images/image.jpg", email = null) {
  try {
    const params = { path };
    if (email) params.email = email;
    const response = await api.get("/ps/proxy/image", {
      params,
      responseType: "blob",
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    return null;
  }
}

// Generic PS API proxy
export async function proxyPSAPI(psPath, method = "GET", data = null) {
  try {
    const config = {
      method: method.toLowerCase(),
      url: "/ps/proxy/api",
      params: { path: psPath },
    };
    if (data) config.data = data;
    const response = await api(config);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
}

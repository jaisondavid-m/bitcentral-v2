import api, { getAuthenticatedHeaders } from "./axios";

// List items with filters and search
export async function getLostFoundItems(params = {}) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.get("/lost-found", {
      params,
      headers: headers.Authorization ? headers : {},
    });
    return response.data;
  } catch (error) {
    try {
      const fallback = await api.get("/lost-found", { params });
      return fallback.data;
    } catch (e) {
      return { success: false, data: [], total: 0 };
    }
  }
}

// Get single item by ID
export async function getLostFoundItemById(id) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.get(`/lost-found/${id}`, {
      headers: headers.Authorization ? headers : {},
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error?.response?.data?.message || error?.message };
  }
}

// Create new Lost or Found report
export async function createLostFoundItem(payload) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.post("/lost-found", payload, { headers });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to post item",
    };
  }
}

// Update existing report
export async function updateLostFoundItem(id, payload) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.put(`/lost-found/${id}`, payload, { headers });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to update item",
    };
  }
}

// Update item status (active, claimed, handed_over, closed)
export async function updateLostFoundStatus(id, status) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.post(`/lost-found/${id}/status`, { status }, { headers });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to update status",
    };
  }
}

// Delete item
export async function deleteLostFoundItem(id) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.delete(`/lost-found/${id}`, { headers });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to delete item",
    };
  }
}

// Upload item image (multipart)
export async function uploadLostFoundImage(file) {
  try {
    const headers = await getAuthenticatedHeaders();
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/lost-found/upload", formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to upload image",
    };
  }
}

// Submit a claim on an item
export async function submitItemClaim(id, payload) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.post(`/lost-found/${id}/claim`, payload, { headers });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to submit claim",
    };
  }
}

// Update claim status (approved / rejected)
export async function updateClaimStatus(claimId, status) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.post(`/lost-found/claims/${claimId}/status`, { status }, { headers });
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error?.response?.data?.message || error?.message || "Failed to update claim",
    };
  }
}

// Get user's own items and claims
export async function getMyLostFound() {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.get("/lost-found/my", { headers });
    return response.data;
  } catch (error) {
    return { success: false, my_items: [], my_claims: [] };
  }
}

// Admin: Get items with moderation stats
export async function getAdminLostFound(params = {}) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.get("/admin/lost-found", { params, headers });
    return response.data;
  } catch (error) {
    return { success: false, data: [], stats: {} };
  }
}

// Admin: Toggle item pin
export async function toggleAdminLostFoundPin(id) {
  try {
    const headers = await getAuthenticatedHeaders();
    const response = await api.post(`/admin/lost-found/${id}/pin`, {}, { headers });
    return response.data;
  } catch (error) {
    return { success: false, message: error?.response?.data?.message || error?.message };
  }
}

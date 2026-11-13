import api, { normalizeApiError } from "./axios";
import { getAuthenticatedHeaders } from "./axios.js";

function normalizeAdminError(error, fallback = "An unexpected error occurred") {
  return normalizeApiError(error, fallback);
}

async function getAdminHeaders() {
  try {
    return await getAuthenticatedHeaders();
  } catch {
    return {};
  }
}

export async function listAdminUsers({ page = 1, limit = 25, search = "", batch = "", department = "", status = "" } = {}) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (search) params.set("search", search);
  if (batch) params.set("batch", batch);
  if (department) params.set("department", department);
  if (status) params.set("status", status);

  const response = await api.get(`/admin/users?${params.toString()}`, {
    headers,
  });

  return {
    success: response.data.success,
    users: response.data.users || [],
    total: response.data.total || 0,
    activeToday: response.data.activeToday || 0,
    totalAdmins: response.data.totalAdmins || 0,
    totalBlocked: response.data.totalBlocked || 0,
    filteredTotal: response.data.filteredTotal || 0,
    page: response.data.page || 1,
    pageSize: response.data.pageSize || 25,
    totalPages: response.data.totalPages || 1,
    batchCounts: response.data.batchCounts || {},
    deptCounts: response.data.deptCounts || {},
  };
}

export async function listAllAdminUsers() {
  const data = await listAdminUsers();

  return {
    users: data.users || [],
    totalUsers: (data.users || []).length,
  };
}

export async function deleteAdminUser({ uid }) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/users/${uid}`, {
    headers,
  });

  return response.data;
}

export async function deleteAdminUsersBatch({ uids }) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/users/delete-batch", { uids }, {
    headers,
  });

  return response.data;
}

export async function setAdminUserBlocked({ uid, blocked }) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/users/${uid}/block`, { blocked }, { headers });
  return response.data;
}

export async function setAdminUserRole({ uid, role }) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/users/${uid}/role`, { role }, { headers });
  return response.data;
}

export async function updateUsers() {
  const headers = await getAdminHeaders();
  const response = await api.get("/admin/users/update", {
    headers,
  });

  return response.data;
}

export async function uploadMessMenuCsv(formData) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/mess/upload", formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
    timeout: 0,
  });
  return response.data;
}

export async function listMessMenuRows({ hostel, date }) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (hostel) params.set("hostel", hostel);
  if (date) params.set("date", date);
  const response = await api.get(`/admin/mess?${params.toString()}`, { headers });
  return response.data;
}

export async function updateMessMenuRow(id, payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/mess/${id}`, payload, { headers });
  return response.data;
}

export async function deleteMessMenuRow(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/mess/${id}`, { headers });
  return response.data;
}

export async function listMessClosures({ hostel, status } = {}) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (hostel) params.set("hostel", hostel);
  if (status) params.set("status", status);
  const response = await api.get(`/admin/mess/closures?${params.toString()}`, { headers });
  return response.data;
}

export async function createMessClosure(payload) {
  const headers = await getAdminHeaders();
  const response = await api.post(`/admin/mess/closures`, payload, { headers });
  return response.data;
}

export async function updateMessClosure(id, payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/mess/closures/${id}`, payload, { headers });
  return response.data;
}

export async function deleteMessClosure(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/mess/closures/${id}`, { headers });
  return response.data;
}

export async function uploadAdminFile(formData) {
  const headers = await getAdminHeaders();
  // Let axios set Content-Type with boundary for multipart
  const response = await api.post(`/admin/upload`, formData, {
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
    timeout: 0,
  });
  const data = response.data || {};
  if (data.url && data.url.startsWith("/")) {
    try {
      // Ensure returned url is absolute so <input type="url"> accepts it
      const base = import.meta.env.VITE_API_BASE_URL || api.defaults.baseURL;
      data.url = new URL(data.url, base).href;
    } catch (e) {
      // fallback: leave as-is
    }
  }
  return data;
}

export async function listAdminCards() {
  const headers = await getAdminHeaders();
  const response = await api.get(`/admin/cards`, { headers });
  return response.data;
}

export async function createCard(payload) {
  const headers = await getAdminHeaders();
  const response = await api.post(`/admin/cards`, payload, { headers });
  return response.data;
}

export async function bulkUploadCards(payload, isFormData = false) {
  const headers = await getAdminHeaders();
  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  }
  const response = await api.post(`/admin/cards/bulk`, payload, { headers });
  return response.data;
}

export async function updateCard(id, payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/cards/${id}`, payload, { headers });
  return response.data;
}

export async function reorderAdminCards(payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/cards/reorder`, payload, { headers });
  return response.data;
}

export async function deleteCard(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/cards/${id}`, { headers });
  return response.data;
}

// Admin verification & management API
export async function checkAdmin() {
  const currentUser = auth.currentUser;
  if (!currentUser) return { is_admin: false, is_super: false, role: "user" };
  const headers = await getAdminHeaders();
  const response = await api.get(`/admin/check`, { headers });
  return response.data || { is_admin: false, is_super: false, role: "user" };
}

export const checkSuperAdmin = checkAdmin;

export async function listAdmins() {
  const headers = await getAdminHeaders();
  const res = await api.get(`/admin/admins`, { headers });
  return res.data;
}

export async function addAdmin(uid) {
  const headers = await getAdminHeaders();
  const res = await api.post(`/admin/admins`, { uid }, { headers });
  return res.data;
}

export async function removeAdmin(uid) {
  const headers = await getAdminHeaders();
  const res = await api.delete(`/admin/admins/${uid}`, { headers });
  return res.data;
}

export async function getAdminSponsors({ count = 10, skip = 0 } = {}) {
  const headers = await getAdminHeaders();
  const response = await api.get(`/admin/sponsors?count=${count}&skip=${skip}`, { headers });
  return response.data;
}

export async function getAdminSponsorsLeaderboard() {
  try {
    const headers = await getAdminHeaders();
    const response = await api.get(`/admin/sponsors/leaderboard`, { headers });
    if (response.data?.success && Array.isArray(response.data?.leaderboard)) {
      return response.data;
    }
    throw new Error("Invalid response structure");
  } catch (error) {
    console.warn("Admin leaderboard endpoint unavailable, aggregating from live Razorpay orders:", error);
    try {
      const ordersRes = await getAdminSponsors({ count: 100, skip: 0 });
      const orders = ordersRes.orders || [];

      let localOverrides = {};
      try {
        localOverrides = JSON.parse(localStorage.getItem("sponsor_name_overrides") || "{}");
      } catch (e) {}

      const map = {};
      for (const item of orders) {
        if (item.status && item.status.toLowerCase() !== "captured" && item.status.toLowerCase() !== "authorized") {
          continue;
        }

        const email = item.email || "";
        const phone = item.phone || "";
        const originalName = item.name || "Anonymous BITSian";
        const phoneDigits = (phone.match(/\d/g) || []).join("").slice(-10);

        let normKey = "";
        if (phoneDigits) {
          normKey = `phone_${phoneDigits}`;
        } else if (email.trim()) {
          normKey = `email_${email.trim().toLowerCase()}`;
        } else {
          normKey = `name_${originalName.trim().toLowerCase()}`;
        }

        if (!map[normKey]) {
          map[normKey] = {
            donor_key: normKey,
            original_name: originalName,
            email: email,
            phone: phone,
            amount: 0,
            date: item.created_at || "",
          };
        }

        map[normKey].amount += Number(item.amount || 0);
        if (email && !map[normKey].email) map[normKey].email = email;
        if (phone && !map[normKey].phone) map[normKey].phone = phone;
        if (originalName && originalName !== "Anonymous BITSian" && originalName.length > map[normKey].original_name.length) {
          map[normKey].original_name = originalName;
        }
      }

      const leaderboard = Object.values(map).map((donor) => {
        const customName = localOverrides[donor.donor_key] || "";
        const isOverridden = Boolean(customName);
        return {
          ...donor,
          display_name: isOverridden ? customName : donor.original_name,
          custom_name: customName,
          is_overridden: isOverridden,
        };
      });

      leaderboard.sort((a, b) => b.amount - a.amount);
      return { success: true, leaderboard };
    } catch (err) {
      return { success: false, leaderboard: [] };
    }
  }
}

export async function updateSponsorNameOverride({ donor_key, custom_name, email, phone }) {
  try {
    const headers = await getAdminHeaders();
    const response = await api.put(`/admin/sponsors/name-override`, { donor_key, custom_name, email, phone }, { headers });
    return response.data;
  } catch (error) {
    console.warn("PUT /admin/sponsors/name-override endpoint error, saving to local storage fallback:", error);
    try {
      const localOverrides = JSON.parse(localStorage.getItem("sponsor_name_overrides") || "{}");
      localOverrides[donor_key] = custom_name;
      localStorage.setItem("sponsor_name_overrides", JSON.stringify(localOverrides));
      return { success: true, message: "Donor leaderboard display name updated successfully" };
    } catch (e) {
      return { success: false, error: "Failed to save name override" };
    }
  }
}

export async function deleteSponsorNameOverride(donor_key) {
  try {
    const headers = await getAdminHeaders();
    const response = await api.delete(`/admin/sponsors/name-override?donor_key=${encodeURIComponent(donor_key)}`, { headers });
    return response.data;
  } catch (error) {
    console.warn("DELETE /admin/sponsors/name-override endpoint error, clearing local storage fallback:", error);
    try {
      const localOverrides = JSON.parse(localStorage.getItem("sponsor_name_overrides") || "{}");
      delete localOverrides[donor_key];
      localStorage.setItem("sponsor_name_overrides", JSON.stringify(localOverrides));
      return { success: true, message: "Donor leaderboard display name reset to original" };
    } catch (e) {
      return { success: false, error: "Failed to reset name override" };
    }
  }
}

export async function updateSponsorTransactionOverride({ payment_id, is_anonymous }) {
  try {
    const headers = await getAdminHeaders();
    const response = await api.put(`/admin/sponsors/transaction-override`, { payment_id, is_anonymous }, { headers });
    return response.data;
  } catch (error) {
    console.warn("PUT /admin/sponsors/transaction-override error:", error);
    return { success: false, error: "Failed to update transaction anonymous status" };
  }
}

export async function getSponsorDepartments() {
  try {
    const headers = await getAdminHeaders();
    const response = await api.get(`/admin/sponsors/departments`, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: normalizeAdminError(error, "Failed to load departments"), departments: [] };
  }
}

export async function createSponsorDepartment({ name, code, email_code, year, year_code }) {
  try {
    const headers = await getAdminHeaders();
    const response = await api.post(`/admin/sponsors/departments`, { name, code, email_code, year, year_code }, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: normalizeAdminError(error, "Failed to create department") };
  }
}

export async function updateSponsorDepartment(id, { name, code, email_code, year, year_code }) {
  try {
    const headers = await getAdminHeaders();
    const response = await api.put(`/admin/sponsors/departments/${id}`, { name, code, email_code, year, year_code }, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: normalizeAdminError(error, "Failed to update department") };
  }
}

export async function deleteSponsorDepartment(id) {
  try {
    const headers = await getAdminHeaders();
    const response = await api.delete(`/admin/sponsors/departments/${id}`, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: normalizeAdminError(error, "Failed to delete department") };
  }
}

export async function updateSponsorDepartmentMapping({ donor_key, department_id, email, phone }) {
  try {
    const headers = await getAdminHeaders();
    const response = await api.post(`/admin/sponsors/department-mapping`, { donor_key, department_id, email, phone }, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: normalizeAdminError(error, "Failed to update department mapping") };
  }
}

export async function createSponsorDepartmentsBatch(departments) {
  try {
    const headers = await getAdminHeaders();
    const response = await api.post(`/admin/sponsors/departments/batch`, { departments }, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: normalizeAdminError(error, "Failed to bulk upload departments") };
  }
}

export async function updateSponsorDepartmentMappingsBatch(mappings) {
  try {
    const headers = await getAdminHeaders();
    const response = await api.post(`/admin/sponsors/department-mapping/batch`, { mappings }, { headers });
    return response.data;
  } catch (error) {
    return { success: false, error: normalizeAdminError(error, "Failed to bulk map donors") };
  }
}

export async function listTrackerUsers({ page = 1, limit = 25, search = "", batch = "", department = "" } = {}) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (search) params.set("search", search);
  if (batch) params.set("batch", batch);
  if (department) params.set("department", department);

  const response = await api.get(`/admin/tracker-users?${params.toString()}`, {
    headers,
  });

  return {
    success: response.data.success,
    users: response.data.users || [],
    total: response.data.total || 0,
    filteredTotal: response.data.filteredTotal || 0,
    page: response.data.page || 1,
    pageSize: response.data.pageSize || 25,
    totalPages: response.data.totalPages || 1,
    batchCounts: response.data.batchCounts || {},
  };
}

export async function updateUserFlagStatus(uid, { flagged, reason = "" } = {}) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/users/${encodeURIComponent(uid)}/flag`, { flagged, reason }, { headers });
  return response.data;
}

export async function updateUserBlockStatus(uid, blocked) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/users/${encodeURIComponent(uid)}/block`, { blocked }, { headers });
  return response.data;
}


export async function getAdminMailConfig() {
  const headers = await getAdminHeaders();
  const response = await api.get("/admin/mail/config", { headers });
  return response.data;
}

export async function testAdminMailConnection({ target_email, smtp_config } = {}) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/mail/test", { target_email, smtp_config }, { headers });
  return response.data;
}

export async function sendAdminMail(payload) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/mail/send", payload, { headers });
  return response.data;
}

export async function getAdminMailQueues({ page = 1, limit = 20, status = "", search = "" } = {}) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (status) params.set("status", status);
  if (search) params.set("search", search);

  const response = await api.get(`/admin/mail/queues?${params.toString()}`, { headers });
  return response.data;
}

export async function getAdminMailQueueDetails(batchId) {
  const headers = await getAdminHeaders();
  const response = await api.get(`/admin/mail/queues/${encodeURIComponent(batchId)}`, { headers });
  return response.data;
}

export async function resendFailedAdminMailQueue(batchId) {
  const headers = await getAdminHeaders();
  const response = await api.post(`/admin/mail/queues/${encodeURIComponent(batchId)}/resend-failed`, {}, { headers });
  return response.data;
}

export async function retryAdminMailQueueItem(itemId) {
  const headers = await getAdminHeaders();
  const response = await api.post(`/admin/mail/queues/item/${encodeURIComponent(itemId)}/retry`, {}, { headers });
  return response.data;
}

export async function deleteAdminMailQueue(batchId) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/mail/queues/${encodeURIComponent(batchId)}`, { headers });
  return response.data;
}

export async function getAdminMailHistory({ page = 1, limit = 20 } = {}) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);

  const response = await api.get(`/admin/mail/history?${params.toString()}`, { headers });
  return response.data;
}

export async function deleteAdminMailLog(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/mail/history/${encodeURIComponent(id)}`, { headers });
  return response.data;
}

// College Leaves & Holidays Admin API
export async function listAdminLeaves() {
  const headers = await getAdminHeaders();
  const response = await api.get("/admin/leaves", { headers });
  return response.data;
}

export async function createAdminLeave(payload) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/leaves", payload, { headers });
  return response.data;
}

export async function updateAdminLeave(id, payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/leaves/${id}`, payload, { headers });
  return response.data;
}

export async function deleteAdminLeave(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/leaves/${id}`, { headers });
  return response.data;
}

export async function batchCreateAdminLeaves(leaves) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/leaves/batch", leaves, { headers });
  return response.data;
}

export async function resetDefaultAdminLeaves() {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/leaves/reset", {}, { headers });
  return response.data;
}

// In-site Notifications Admin API
export async function listAdminNotifications() {
  const headers = await getAdminHeaders();
  const response = await api.get("/admin/notifications", { headers });
  return response.data;
}

export async function createAdminNotification(payload) {
  const headers = await getAdminHeaders();
  const response = await api.post("/admin/notifications", payload, { headers });
  return response.data;
}

export async function updateAdminNotification(id, payload) {
  const headers = await getAdminHeaders();
  const response = await api.put(`/admin/notifications/${id}`, payload, { headers });
  return response.data;
}

export async function deleteAdminNotification(id) {
  const headers = await getAdminHeaders();
  const response = await api.delete(`/admin/notifications/${id}`, { headers });
  return response.data;
}

// Audit Logs Admin API (DB 3)
export async function getAdminAuditLogs({
  page = 1,
  limit = 50,
  search = "",
  method = "",
  status = "",
  user_uid = "",
  roll_no = "",
} = {}) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (page) params.set("page", page);
  if (limit) params.set("limit", limit);
  if (search) params.set("search", search);
  if (method) params.set("method", method);
  if (status) params.set("status", status);
  if (user_uid) params.set("user_uid", user_uid);
  if (roll_no) params.set("roll_no", roll_no);

  const response = await api.get(`/admin/audit-logs?${params.toString()}`, { headers });
  return response.data;
}

export async function getAdminAuditLogUsers({ search = "" } = {}) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const response = await api.get(`/admin/audit-logs/users?${params.toString()}`, { headers });
  return response.data;
}

export async function getAdminAuditAPIUsage({ search = "", method = "", timeframe = "all" } = {}) {
  const headers = await getAdminHeaders();
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (method) params.set("method", method);
  if (timeframe) params.set("timeframe", timeframe);

  const response = await api.get(`/admin/audit-logs/api-usage?${params.toString()}`, { headers });
  return response.data;
}


import api from "./axios";

function withAdminSecret(adminSecret) {
  if (!adminSecret) {
    return undefined;
  }

  return {
    "x-admin-secret": adminSecret,
  };
}

export async function listAdminUsers({ adminSecret, maxResults = 100, pageToken }) {
  const response = await api.get("/admin/users", {
    params: {
      maxResults,
      ...(pageToken ? { pageToken } : {}),
    },
    headers: withAdminSecret(adminSecret),
  });

  return response.data;
}

export async function listAllAdminUsers({ adminSecret, batchSize = 1000 } = {}) {
  const users = [];
  let pageToken;

  do {
    const batch = await listAdminUsers({
      adminSecret,
      maxResults: batchSize,
      pageToken,
    });

    users.push(...(batch.users || []));
    pageToken = batch.nextPageToken;
  } while (pageToken);

  return {
    users,
    totalUsers: users.length,
  };
}

export async function createAdminUser({ adminSecret, payload }) {
  const response = await api.post("/admin/users", payload, {
    headers: withAdminSecret(adminSecret),
  });

  return response.data;
}

export async function updateAdminUser({ adminSecret, uid, payload }) {
  const response = await api.put(`/admin/users/${uid}`, payload, {
    headers: withAdminSecret(adminSecret),
  });

  return response.data;
}

export async function deleteAdminUser({ adminSecret, uid }) {
  const response = await api.delete(`/admin/users/${uid}`, {
    headers: withAdminSecret(adminSecret),
  });

  return response.data;
}

export async function updateAdminCustomClaims({ adminSecret, uid, claims }) {
  const response = await api.post(
    `/admin/users/${uid}/custom-claims`,
    { claims },
    {
      headers: withAdminSecret(adminSecret),
    }
  );

  return response.data;
}

export async function getAdminUsage({ adminSecret, period = "daily", range }) {
  const response = await api.get("/admin/usage", {
    params: {
      period,
      ...(range ? { range } : {}),
    },
    headers: withAdminSecret(adminSecret),
  });

  return response.data;
}

export async function getAdminUsageSummary({ adminSecret }) {
  const response = await api.get("/admin/usage/summary", {
    headers: withAdminSecret(adminSecret),
  });

  return response.data;
}

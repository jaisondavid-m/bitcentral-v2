import api from "./axios";

export async function listAdminUsers({ adminSecret }) {
  const response = await api.get("/admin/users", {
    headers: {
      "x-admin-secret": adminSecret,
    },
  });

  return {
    success: response.data.success,
    users: response.data.users || [],
  };
}

export async function listAllAdminUsers({ adminSecret } = {}) {
  const data = await listAdminUsers({ adminSecret });

  return {
    users: data.users || [],
    totalUsers: (data.users || []).length,
  };
}

export async function deleteAdminUser({ adminSecret, uid }) {
  const response = await api.delete(`/admin/users/${uid}`, {
    headers: {
      "x-admin-secret": adminSecret,
    },
  });

  return response.data;
}

export async function updateAdminPsToken({ adminSecret, token }) {
  const response = await api.post(
    "/admin/ps-token",
    { token },
    {
      headers: {
        "x-admin-secret": adminSecret,
      },
    }
  );

  return response.data;
}
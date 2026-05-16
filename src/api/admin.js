import api from "./axios";
import { auth } from "../Authentication/firebase.js";

async function getAdminHeaders() {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("You must be signed in to use the admin dashboard");
  }

  const idToken = await currentUser.getIdToken();

  return {
    Authorization: `Bearer ${idToken}`,
  };
}

export async function listAdminUsers() {
  const headers = await getAdminHeaders();
  const response = await api.get("/admin/users", {
    headers,
  });

  return {
    success: response.data.success,
    users: response.data.users || [],
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

export async function updateUsers() {
  const headers = await getAdminHeaders();
  const response = await api.get("/admin/users/update", {
    headers,
  });

  return response.data;
}

export async function updateAdminPsToken({ token }) {
  const headers = await getAdminHeaders();
  const response = await api.post(
    "/admin/ps-token",
    { token },
    {
      headers,
    }
  );

  return response.data;
}
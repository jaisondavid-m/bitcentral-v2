import { useEffect, useState } from "react";
import {
  createAdminUser,
  deleteAdminUser,
  listAdminUsers,
  updateAdminCustomClaims,
  updateAdminUser,
} from "../api/admin.js";
import { AlertTriangle, Loader, RefreshCw, Shield, Trash2, UserPlus, Users } from "lucide-react";

const ADMIN_SECRET_KEY = "admin-dashboard-secret";

const emptyCreateForm = {
  email: "",
  password: "",
  displayName: "",
  phoneNumber: "",
};

const emptyUpdateForm = {
  uid: "",
  email: "",
  password: "",
  displayName: "",
  photoURL: "",
  phoneNumber: "",
  disabled: "",
  emailVerified: "",
};

function parseOptionalBoolean(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function compactPayload(payload) {
  const next = { ...payload };
  Object.keys(next).forEach((key) => {
    if (next[key] === "" || next[key] === undefined) {
      delete next[key];
    }
  });
  return next;
}

function normalizeError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function AdminDashboard() {
  const [adminSecret, setAdminSecret] = useState(() => sessionStorage.getItem(ADMIN_SECRET_KEY) || "");
  const [users, setUsers] = useState([]);
  const [maxResults, setMaxResults] = useState(50);
  const [pageToken, setPageToken] = useState("");
  const [tokenHistory, setTokenHistory] = useState([""]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });

  const [createForm, setCreateForm] = useState(emptyCreateForm);
  const [updateForm, setUpdateForm] = useState(emptyUpdateForm);
  const [deleteUid, setDeleteUid] = useState("");
  const [claimsUid, setClaimsUid] = useState("");
  const [claimsJson, setClaimsJson] = useState('{"admin": true}');

  useEffect(() => {
    sessionStorage.setItem(ADMIN_SECRET_KEY, adminSecret);
  }, [adminSecret]);

  const loadUsers = async (token = "", options = { pushHistory: true }) => {
    setIsLoading(true);
    setBanner({ type: "", message: "" });

    try {
      const data = await listAdminUsers({
        adminSecret,
        maxResults,
        pageToken: token || undefined,
      });

      setUsers(data.users || []);
      setNextPageToken(data.nextPageToken || null);
      setPageToken(token);

      if (options.pushHistory) {
        setTokenHistory((prev) => {
          const last = prev[prev.length - 1] || "";
          if (last === token) return prev;
          return [...prev, token];
        });
      }
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to load users") });
      setUsers([]);
      setNextPageToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maxResults]);

  const onCreateUser = async (event) => {
    event.preventDefault();
    setBanner({ type: "", message: "" });

    try {
      await createAdminUser({
        adminSecret,
        payload: compactPayload(createForm),
      });
      setCreateForm(emptyCreateForm);
      setBanner({ type: "success", message: "User created successfully" });
      await loadUsers(pageToken, { pushHistory: false });
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to create user") });
    }
  };

  const onUpdateUser = async (event) => {
    event.preventDefault();
    setBanner({ type: "", message: "" });

    if (!updateForm.uid.trim()) {
      setBanner({ type: "error", message: "UID is required for update" });
      return;
    }

    const payload = compactPayload({
      email: updateForm.email,
      password: updateForm.password,
      displayName: updateForm.displayName,
      photoURL: updateForm.photoURL,
      phoneNumber: updateForm.phoneNumber,
      disabled: parseOptionalBoolean(updateForm.disabled),
      emailVerified: parseOptionalBoolean(updateForm.emailVerified),
    });

    if (Object.keys(payload).length === 0) {
      setBanner({ type: "error", message: "Provide at least one field to update" });
      return;
    }

    try {
      await updateAdminUser({
        adminSecret,
        uid: updateForm.uid.trim(),
        payload,
      });
      setBanner({ type: "success", message: "User updated successfully" });
      await loadUsers(pageToken, { pushHistory: false });
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to update user") });
    }
  };

  const onDeleteUser = async (event) => {
    event.preventDefault();
    setBanner({ type: "", message: "" });

    const uid = deleteUid.trim();
    if (!uid) {
      setBanner({ type: "error", message: "UID is required to delete a user" });
      return;
    }

    try {
      await deleteAdminUser({ adminSecret, uid });
      setDeleteUid("");
      setBanner({ type: "success", message: `User ${uid} deleted` });
      await loadUsers(pageToken, { pushHistory: false });
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to delete user") });
    }
  };

  const onUpdateClaims = async (event) => {
    event.preventDefault();
    setBanner({ type: "", message: "" });

    const uid = claimsUid.trim();
    if (!uid) {
      setBanner({ type: "error", message: "UID is required for custom claims" });
      return;
    }

    let claims;
    try {
      claims = JSON.parse(claimsJson);
    } catch {
      setBanner({ type: "error", message: "Claims must be valid JSON" });
      return;
    }

    try {
      await updateAdminCustomClaims({ adminSecret, uid, claims });
      setBanner({ type: "success", message: "Custom claims updated" });
      await loadUsers(pageToken, { pushHistory: false });
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to update custom claims") });
    }
  };

  const goToNextPage = async () => {
    if (!nextPageToken) return;
    await loadUsers(nextPageToken);
  };

  const goToPreviousPage = async () => {
    if (tokenHistory.length <= 1) return;

    const previousHistory = tokenHistory.slice(0, -1);
    const previousToken = previousHistory[previousHistory.length - 1] || "";
    setTokenHistory(previousHistory);
    await loadUsers(previousToken, { pushHistory: false });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                <Shield className="h-7 w-7 text-blue-600" />
                Admin Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Manage Firebase Authentication users, roles, and account access from one place.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadUsers(pageToken, { pushHistory: false })}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh Users
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1fr_auto]">
            <label className="text-sm font-medium text-slate-700">
              Admin secret header (x-admin-secret)
              <input
                type="password"
                value={adminSecret}
                onChange={(event) => setAdminSecret(event.target.value)}
                placeholder="Leave empty if backend has no ADMIN_DASHBOARD_SECRET"
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Max results
              <input
                type="number"
                min={1}
                max={1000}
                value={maxResults}
                onChange={(event) => setMaxResults(Math.min(Number(event.target.value) || 1, 1000))}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
            </label>
          </div>

          {banner.message && (
            <div
              className={`mt-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
                banner.type === "error"
                  ? "border-red-300 bg-red-50 text-red-700"
                  : "border-emerald-300 bg-emerald-50 text-emerald-700"
              }`}
            >
              {banner.type === "error" ? (
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              ) : (
                <Users className="mt-0.5 h-4 w-4 flex-shrink-0" />
              )}
              <span>{banner.message}</span>
            </div>
          )}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <form onSubmit={onCreateUser} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <UserPlus className="h-5 w-5 text-blue-600" />
              Create User
            </h2>
            <div className="grid gap-3">
              <input
                type="email"
                required
                value={createForm.email}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <input
                type="password"
                required
                value={createForm.password}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Password"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <input
                type="text"
                value={createForm.displayName}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, displayName: event.target.value }))}
                placeholder="Display name"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <input
                type="text"
                value={createForm.phoneNumber}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                placeholder="Phone number"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Create User
            </button>
          </form>

          <form onSubmit={onUpdateUser} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Update User</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                required
                value={updateForm.uid}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, uid: event.target.value }))}
                placeholder="UID"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring sm:col-span-2"
              />
              <input
                type="email"
                value={updateForm.email}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Email"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <input
                type="password"
                value={updateForm.password}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Password"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <input
                type="text"
                value={updateForm.displayName}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, displayName: event.target.value }))}
                placeholder="Display name"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <input
                type="text"
                value={updateForm.photoURL}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, photoURL: event.target.value }))}
                placeholder="Photo URL"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <input
                type="text"
                value={updateForm.phoneNumber}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                placeholder="Phone number"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <select
                value={updateForm.disabled}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, disabled: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              >
                <option value="">Disabled (no change)</option>
                <option value="true">Disabled = true</option>
                <option value="false">Disabled = false</option>
              </select>
              <select
                value={updateForm.emailVerified}
                onChange={(event) => setUpdateForm((prev) => ({ ...prev, emailVerified: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              >
                <option value="">Email verified (no change)</option>
                <option value="true">Email verified = true</option>
                <option value="false">Email verified = false</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-400"
            >
              Update User
            </button>
          </form>

          <form onSubmit={onUpdateClaims} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Custom Claims</h2>
            <div className="grid gap-3">
              <input
                type="text"
                required
                value={claimsUid}
                onChange={(event) => setClaimsUid(event.target.value)}
                placeholder="UID"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <textarea
                value={claimsJson}
                onChange={(event) => setClaimsJson(event.target.value)}
                rows={5}
                className="rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs outline-none ring-blue-500 focus:ring"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Update Claims
            </button>
          </form>

          <form onSubmit={onDeleteUser} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete User
            </h2>
            <input
              type="text"
              required
              value={deleteUid}
              onChange={(event) => setDeleteUid(event.target.value)}
              placeholder="UID"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
            />
            <button
              type="submit"
              className="mt-4 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Delete User
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Users</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={tokenHistory.length <= 1 || isLoading}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goToNextPage}
                disabled={!nextPageToken || isLoading}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">UID</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Display Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Verified</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Disabled</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Claims</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                      {isLoading ? "Loading users..." : "No users found"}
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => (
                    <tr key={userItem.uid}>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-700">{userItem.uid}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">{userItem.email || "-"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">{userItem.displayName || "-"}</td>
                      <td className="px-4 py-3 text-slate-700">{userItem.emailVerified ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-slate-700">{userItem.disabled ? "Yes" : "No"}</td>
                      <td className="max-w-xs px-4 py-3 font-mono text-xs text-slate-700">
                        <div className="line-clamp-2">{JSON.stringify(userItem.customClaims || {})}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;

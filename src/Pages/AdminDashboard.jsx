import { useEffect, useState } from "react";
import {
  deleteAdminUser,
  listAdminUsers,
} from "../api/admin.js";
import { AlertTriangle, Loader, RefreshCw, Shield, Trash2, Users } from "lucide-react";

const ADMIN_SECRET_KEY = "admin-dashboard-secret";

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

  const [deleteUid, setDeleteUid] = useState("");

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
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="bg-blue-600 px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
                  <Shield className="h-7 w-7" />
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-white/90">
                  Manage Firebase Authentication users and account access from one place.
                </p>
              </div>
              <button
                type="button"
                onClick={() => loadUsers(pageToken, { pushHistory: false })}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Refresh Users
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h2 className="text-base font-semibold text-gray-900">Admin Access</h2>

              <div className="mt-3 grid gap-4 sm:grid-cols-[1fr_auto]">
                <label className="text-sm font-medium text-gray-700">
                  Admin secret header (x-admin-secret)
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={(event) => setAdminSecret(event.target.value)}
                    placeholder="Leave empty if backend has no ADMIN_DASHBOARD_SECRET"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
                  />
                </label>

                <label className="text-sm font-medium text-gray-700">
                  Max results
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={maxResults}
                    onChange={(event) => setMaxResults(Math.min(Number(event.target.value) || 1, 1000))}
                    className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
                  />
                </label>
              </div>
            </div>
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
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <form onSubmit={onDeleteUser} className="max-w-xl">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Trash2 className="h-5 w-5 text-red-600" />
              Delete User
            </h2>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                required
                value={deleteUid}
                onChange={(event) => setDeleteUid(event.target.value)}
                placeholder="Enter UID"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
              />
              <button
                type="submit"
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={tokenHistory.length <= 1 || isLoading}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={goToNextPage}
                disabled={!nextPageToken || isLoading}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">UID</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Display Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Verified</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Disabled</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Claims</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      {isLoading ? "Loading users..." : "No users found"}
                    </td>
                  </tr>
                ) : (
                  users.map((userItem) => (
                    <tr key={userItem.uid}>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-700">{userItem.uid}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">{userItem.email || "-"}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-gray-700">{userItem.displayName || "-"}</td>
                      <td className="px-4 py-3 text-gray-700">{userItem.emailVerified ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-gray-700">{userItem.disabled ? "Yes" : "No"}</td>
                      <td className="max-w-xs px-4 py-3 font-mono text-xs text-gray-700">
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

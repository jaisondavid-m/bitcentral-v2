import { useEffect, useState, useMemo } from "react";
import {
  deleteAdminUser,
  listAdminUsers,
  updateAdminPsToken,
  updateUsers
} from "../api/admin.js";
import {
  AlertTriangle,
  Loader,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";

const ADMIN_SECRET_KEY = "admin-dashboard-secret";
const PS_TOKEN_UPDATED_AT_KEY = "admin-ps-token-updated-at";
const PS_TOKEN_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3 hours

function normalizeError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function formatCountdown(ms) {
  const clamped = Math.max(0, ms);
  const totalSeconds = Math.floor(clamped / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}



function SecretPrompt({ value, onChange, onSubmit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:border dark:border-blue-900 dark:bg-slate-950">
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">
          Admin Secret Required
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-slate-300">
          Enter the admin secret header (x-admin-secret). This will be stored in
          localStorage.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <input
            type="password"
            value={value}
            onChange={onChange}
            placeholder="Enter x-admin-secret"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
            autoFocus
            required
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [authUser] = useAuthState(auth);

  const [adminSecret, setAdminSecret] = useState(
    () => localStorage.getItem(ADMIN_SECRET_KEY) || ""
  );
  const [secretDraft, setSecretDraft] = useState("");
  const [needsSecret, setNeedsSecret] = useState(
    () => !localStorage.getItem(ADMIN_SECRET_KEY)
  );

  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [deletingUid, setDeletingUid] = useState("");
  const [psToken, setPsToken] = useState("");
  const [isUpdatingPsToken, setIsUpdatingPsToken] = useState(false);
  const [isUpdatingUsers, setIsUpdatingUsers] = useState(false);
  const [psTokenUpdatedAt, setPsTokenUpdatedAt] = useState(() => {
    const stored = localStorage.getItem(PS_TOKEN_UPDATED_AT_KEY);
    const parsed = Number(stored);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  });
  const [nowTs, setNowTs] = useState(() => Date.now());
  const [banner, setBanner] = useState({ type: "", message: "" });
  const onUpdateUsers = async () => {
    if (!adminSecret) return;

    setIsUpdatingUsers(true);
    setBanner({ type: "", message: "" });

    try {
      const result = await updateUsers({ adminSecret });
      setBanner({
        type: "success",
        message: result?.message || "Users updated successfully",
      });
      await loadUsers();
    } catch (error) {
      setBanner({
        type: "error",
        message: normalizeError(error, "Failed to update users"),
      });
    } finally {
      setIsUpdatingUsers(false);
    }
  };

  const currentAdminUser = useMemo(() => {
    return (authUser?.displayName || authUser?.email || "admin").trim();
  }, [authUser]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;

    return users.filter((user) => {
      const email = (user.email || "").toLowerCase();
      const name = (user.displayName || "").toLowerCase();
      const uid = (user.uid || "").toLowerCase();
      return email.includes(q) || name.includes(q) || uid.includes(q);
    });
  }, [users, searchQuery]);

  const nextUpdateAt = psTokenUpdatedAt
    ? psTokenUpdatedAt + PS_TOKEN_INTERVAL_MS
    : 0;
  const remainingMs = nextUpdateAt ? Math.max(0, nextUpdateAt - nowTs) : 0;
  const isPsTokenDue = !psTokenUpdatedAt || remainingMs === 0;

  useEffect(() => {
    if (adminSecret) {
      localStorage.setItem(ADMIN_SECRET_KEY, adminSecret);
    }
  }, [adminSecret]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNowTs(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);


  const loadUsers = async () => {
    if (!adminSecret) return;

    setIsLoadingUsers(true);
    setBanner({ type: "", message: "" });

    try {
      const usersResult = await listAdminUsers({ adminSecret });
      setUsers(usersResult.users || []);
      setUsersLoaded(true);
    } catch (error) {
      setUsers([]);
      setBanner({
        type: "error",
        message: normalizeError(error, "Failed to load users"),
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadDashboardData = async () => {
    await loadUsers();
  };

  const onSubmitSecret = (event) => {
    event.preventDefault();
    const trimmed = secretDraft.trim();

    if (!trimmed) {
      return;
    }

    setAdminSecret(trimmed);
    setNeedsSecret(false);
    setSecretDraft("");
  };

  const onDeleteUser = async (uid) => {
    const confirmed = window.confirm("Delete this user permanently?");
    if (!confirmed) return;

    setDeletingUid(uid);
    setBanner({ type: "", message: "" });

    try {
      await deleteAdminUser({ adminSecret, uid });
      setUsers((prev) => prev.filter((user) => user.uid !== uid));
      setBanner({ type: "success", message: "User deleted successfully" });
    } catch (error) {
      setBanner({
        type: "error",
        message: normalizeError(error, "Failed to delete user"),
      });
    } finally {
      setDeletingUid("");
    }
  };

  const onUpdatePsToken = async (event) => {
    event.preventDefault();

    const tokenValue = psToken.trim();
    if (!tokenValue) {
      setBanner({ type: "error", message: "PS token is required" });
      return;
    }

    setIsUpdatingPsToken(true);
    setBanner({ type: "", message: "" });

    try {
      const result = await updateAdminPsToken({
        adminSecret,
        token: tokenValue,
      });

      const updatedAtTs = Date.now();
      localStorage.setItem(PS_TOKEN_UPDATED_AT_KEY, String(updatedAtTs));
      setPsTokenUpdatedAt(updatedAtTs);
      setNowTs(updatedAtTs);
      setPsToken("");

      setBanner({
        type: "success",
        message: result?.message || "PS token updated successfully",
      });
    } catch (error) {
      setBanner({
        type: "error",
        message: normalizeError(error, "Failed to update PS token"),
      });
    } finally {
      setIsUpdatingPsToken(false);
    }
  };

  const clearStoredSecret = () => {
    localStorage.removeItem(ADMIN_SECRET_KEY);
    setAdminSecret("");
    setNeedsSecret(true);
    setSecretDraft("");
    setUsers([]);
    setUsersLoaded(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-sky-50 via-white to-slate-100 px-4 py-6 sm:px-6 lg:px-8 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="pointer-events-none absolute -left-16 top-12 h-44 w-44 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-900/20" />
      <div className="pointer-events-none absolute -right-20 top-28 h-56 w-56 rounded-full bg-blue-300/35 blur-3xl dark:bg-blue-900/20" />
      {needsSecret && (
        <SecretPrompt
          value={secretDraft}
          onChange={(event) => setSecretDraft(event.target.value)}
          onSubmit={onSubmitSecret}
        />
      )}

      <div className="relative z-10 mx-auto max-w-5xl space-y-6">
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
          <div className="bg-linear-to-r from-sky-600 via-blue-600 to-indigo-600 px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
                  <Shield className="h-7 w-7" />
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-white/90">
                  Manage users and rotate PS tokens.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={loadDashboardData}
                  disabled={!adminSecret}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className="h-4 w-4" /> Refresh
                </button>

                <button
                  type="button"
                  onClick={clearStoredSecret}
                  className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Change Secret
                </button>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-blue-900 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  Total Users
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {usersLoaded ? users.length : "-"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-blue-900 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  Showing
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {usersLoaded ? filteredUsers.length : "-"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-blue-900 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                  Token Status
                </p>
                <p
                  className={`mt-2 text-sm font-semibold ${isPsTokenDue
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-emerald-700 dark:text-emerald-300"
                    }`}
                >
                  {isPsTokenDue ? "Update due" : "On schedule"}
                </p>
              </div>
            </div>

            {banner.message && (
              <div
                className={`mt-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${banner.type === "error"
                  ? "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
                  : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                  }`}
              >
                {banner.type === "error" ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <Users className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>{banner.message}</span>
              </div>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-blue-900 dark:bg-slate-950">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                PS Token Rotation
              </h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-slate-300">
                Update your PS token every 3 hours. Timer is saved in localStorage.
              </p>
            </div>
            <div
              className={`inline-flex w-fit items-center rounded-lg border px-3 py-2 text-sm font-semibold ${isPsTokenDue
                ? "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200"
                : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
                }`}
            >
              {isPsTokenDue
                ? "Token update due now"
                : `Next update in ${formatCountdown(remainingMs)}`}
            </div>
          </div>

          <div className="mb-4 grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2 dark:border-blue-900 dark:bg-slate-900">
            <p className="text-sm text-gray-700 dark:text-slate-300">
              <span className="font-semibold text-gray-900 dark:text-slate-100">
                Last updated:
              </span>{" "}
              {psTokenUpdatedAt
                ? formatDateTime(psTokenUpdatedAt)
                : "Not updated yet"}
            </p>
            <p className="text-sm text-gray-700 dark:text-slate-300">
              <span className="font-semibold text-gray-900 dark:text-slate-100">
                Next recommended:
              </span>{" "}
              {nextUpdateAt
                ? formatDateTime(nextUpdateAt)
                : "Update once to start timer"}
            </p>
          </div>

          <form onSubmit={onUpdatePsToken} className="grid gap-3 sm:grid-cols-3">
            <input
              type="password"
              value={psToken}
              onChange={(event) => setPsToken(event.target.value)}
              placeholder="Enter new PS token"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring sm:col-span-3 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
              required
            />
            <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 sm:col-span-3 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-300">
              Admin user: <span className="font-semibold text-gray-800 dark:text-slate-100">{currentAdminUser}</span>
            </p>
            <button
              type="submit"
              disabled={isUpdatingPsToken || !adminSecret}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-3"
            >
              {isUpdatingPsToken ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {isUpdatingPsToken ? "Updating PS token..." : "Update PS token"}
            </button>
          </form>
        </section>



        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-blue-900 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Users
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onUpdateUsers}
                disabled={isUpdatingUsers || !adminSecret}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingUsers ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {isUpdatingUsers ? "Updating..." : "Update Users"}
              </button>

              <button
                type="button"
                onClick={loadUsers}
                disabled={isLoadingUsers || !adminSecret}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingUsers ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                {isLoadingUsers ? "Loading..." : usersLoaded ? "Reload Users" : "Load Users"}
              </button>
            </div>
          </div>

          {!usersLoaded ? (
            <div className="flex h-36 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-blue-900 dark:bg-slate-900">
              <Users className="h-8 w-8 text-gray-400 dark:text-slate-500" />
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Click <span className="font-semibold text-blue-600">Load Users</span> to fetch the user list.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-blue-900 dark:bg-slate-900">
                <Search className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search by email, name, or UID"
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-blue-900">
                <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900">
                  <thead className="bg-gray-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                        Photo
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                        Display Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                        Creation Time
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                        Last Login
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                        Delete
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-blue-900 dark:bg-slate-950">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-gray-500 dark:text-slate-300"
                        >
                          No users found for your search
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((userItem, index) => (
                        <tr key={userItem.uid}>
                          <td className="px-4 py-3 font-medium text-gray-700 dark:text-slate-300">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            {userItem.photoURL ? (
                              <img
                                src={userItem.photoURL}
                                alt={
                                  userItem.displayName ||
                                  userItem.email ||
                                  "User"
                                }
                                className="h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-blue-900"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-slate-900 dark:text-slate-300">
                                {(
                                  userItem.displayName ||
                                  userItem.email ||
                                  "U"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">
                            {userItem.email || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">
                            {userItem.displayName || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">
                            {formatDateTime(userItem.creationTime)}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">
                            {formatDateTime(userItem.lastSignInTime)}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => onDeleteUser(userItem.uid)}
                              disabled={deletingUid === userItem.uid}
                              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingUid === userItem.uid ? (
                                <Loader className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  deleteAdminUser,
  listAdminUsers,
  updateUsers,
  listQBAnswerKeys,
  createQBAnswerKeysBatch,
  updateQBAnswerKey,
  deleteQBAnswerKey,
  uploadAdminFile,
} from "../api/admin.js";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  Edit2,
  Loader,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";

function normalizeError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function parseDateValue(value) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

const EMPTY_QB_FORM = {
  year: "",
  subject_code: "",
  subject_name: "",
  qb1: "",
  qb2: "",
  ak1: "",
  ak2: "",
  semqbwithans: "",
};

function Banner({ banner, onDismiss }) {
  if (!banner.message) return null;
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
        banner.type === "error"
          ? "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
      }`}
    >
      {banner.type === "error" ? (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span className="flex-1">{banner.message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-2 opacity-60 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ─── QB Subject Link Form (Edit single subject) ──────────────────────────────
function QBForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(initial || EMPTY_QB_FORM);
  const [uploading, setUploading] = useState({});

  const handleFileChange = (field) => async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      setUploading((s) => ({ ...s, [field]: true }));
      const res = await uploadAdminFile(fd);
      if (res && res.success && res.url) {
        setForm((prev) => ({ ...prev, [field]: res.url }));
      }
    } catch (err) {
      console.error("upload error", err);
    } finally {
      setUploading((s) => ({ ...s, [field]: false }));
    }
  };

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function toNullable(value) {
    const trimmed = (value || "").trim();
    return trimmed ? trimmed : null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.year || !form.subject_code.trim() || !form.subject_name.trim()) {
      return;
    }
    onSubmit({
      year: Number(form.year),
      subject_code: form.subject_code.trim(),
      subject_name: form.subject_name.trim(),
      qb1: toNullable(form.qb1),
      qb2: toNullable(form.qb2),
      ak1: toNullable(form.ak1),
      ak2: toNullable(form.ak2),
      semqbwithans: toNullable(form.semqbwithans),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Year
          </label>
          <select
            value={form.year}
            onChange={set("year")}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Select year</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Subject code
          </label>
          <input
            type="text"
            value={form.subject_code}
            onChange={set("subject_code")}
            placeholder="e.g. CS301"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Subject name
          </label>
          <input
            type="text"
            value={form.subject_name}
            onChange={set("subject_name")}
            placeholder="e.g. Data Structures"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">QB1 link</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={form.qb1 || ""}
              onChange={set("qb1")}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
            />
            <label className="inline-flex items-center rounded-md border px-3 py-2 bg-white text-sm text-gray-700 cursor-pointer">
              {uploading.qb1 ? "Uploading…" : "Upload"}
              <input type="file" accept="application/pdf" onChange={handleFileChange("qb1")} className="sr-only" />
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">QB2 link</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={form.qb2 || ""}
              onChange={set("qb2")}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
            />
            <label className="inline-flex items-center rounded-md border px-3 py-2 bg-white text-sm text-gray-700 cursor-pointer">
              {uploading.qb2 ? "Uploading…" : "Upload"}
              <input type="file" accept="application/pdf" onChange={handleFileChange("qb2")} className="sr-only" />
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">AK1 link</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={form.ak1 || ""}
              onChange={set("ak1")}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
            />
            <label className="inline-flex items-center rounded-md border px-3 py-2 bg-white text-sm text-gray-700 cursor-pointer">
              {uploading.ak1 ? "Uploading…" : "Upload"}
              <input type="file" accept="application/pdf" onChange={handleFileChange("ak1")} className="sr-only" />
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">AK2 link</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={form.ak2 || ""}
              onChange={set("ak2")}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
            />
            <label className="inline-flex items-center rounded-md border px-3 py-2 bg-white text-sm text-gray-700 cursor-pointer">
              {uploading.ak2 ? "Uploading…" : "Upload"}
              <input type="file" accept="application/pdf" onChange={handleFileChange("ak2")} className="sr-only" />
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">Semester QB with answer link</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={form.semqbwithans || ""}
            onChange={set("semqbwithans")}
            placeholder="https://..."
            className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
          <label className="inline-flex items-center rounded-md border px-3 py-2 bg-white text-sm text-gray-700 cursor-pointer">
            {uploading.semqbwithans ? "Uploading…" : "Upload"}
            <input type="file" accept="application/pdf" onChange={handleFileChange("semqbwithans")} className="sr-only" />
          </label>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          {isLoading ? "Saving…" : initial ? "Save changes" : "Add answer key"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}

function LinkCell({ value }) {
  if (!value) {
    return <span className="text-xs text-gray-400">-</span>;
  }
  return (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="text-xs font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-300"
    >
      Open
    </a>
  );
}

function AdminPageShell({ title, description, children }) {
  const location = useLocation();

  const navItems = [
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/qb", label: "QB Handling", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 dark:bg-black">
      <div className="mx-auto max-w-6xl space-y-4">
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-blue-900 dark:bg-slate-950">
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-4 dark:border-blue-900 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-slate-400">Admin</p>
              <h1 className="mt-1 text-2xl font-semibold text-gray-900 dark:text-slate-100">{title}</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {children}
      </div>
    </div>
  );
}

function UsersSection() {
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [deletingUid, setDeletingUid] = useState("");
  const [isUpdatingUsers, setIsUpdatingUsers] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });

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

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((left, right) => {
      const leftOnline = Boolean(left.isOnline);
      const rightOnline = Boolean(right.isOnline);

      if (leftOnline !== rightOnline) {
        return leftOnline ? -1 : 1;
      }

      const lastSeenDiff = parseDateValue(right.lastSeenAt) - parseDateValue(left.lastSeenAt);
      if (lastSeenDiff !== 0) return lastSeenDiff;

      return parseDateValue(right.creationTime) - parseDateValue(left.creationTime);
    });
  }, [filteredUsers]);

  const onlineUsers = useMemo(() => sortedUsers.filter((user) => user.isOnline), [sortedUsers]);
  const recentActivityUsers = useMemo(() => sortedUsers.filter((user) => !user.isOnline && user.lastSeenAt), [sortedUsers]);
  const neverActiveUsers = useMemo(() => sortedUsers.filter((user) => !user.isOnline && !user.lastSeenAt), [sortedUsers]);
  const latestActiveUser = sortedUsers[0] || null;

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await listAdminUsers();
      setUsers(result.users || []);
      setUsersLoaded(true);
    } catch (error) {
      setUsers([]);
      setUsersLoaded(false);
      setBanner({ type: "error", message: normalizeError(error, "Failed to load users") });
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const intervalId = window.setInterval(loadUsers, 30000);
    return () => window.clearInterval(intervalId);
  }, [loadUsers]);

  const onUpdateUsers = async () => {
    setIsUpdatingUsers(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await updateUsers();
      setBanner({ type: "success", message: result?.message || "Users updated successfully" });
      await loadUsers();
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to update users") });
    } finally {
      setIsUpdatingUsers(false);
    }
  };

  const onDeleteUser = async (uid) => {
    if (!window.confirm("Delete this user permanently?")) return;
    setDeletingUid(uid);
    setBanner({ type: "", message: "" });
    try {
      await deleteAdminUser({ uid });
      setUsers((prev) => prev.filter((user) => user.uid !== uid));
      setBanner({ type: "success", message: "User deleted successfully" });
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to delete user") });
    } finally {
      setDeletingUid("");
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-blue-900 dark:bg-slate-950">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Users</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">Search and remove users.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onUpdateUsers}
            disabled={isUpdatingUsers}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingUsers ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isUpdatingUsers ? "Updating…" : "Update users"}
          </button>
          <button
            type="button"
            onClick={loadUsers}
            disabled={isLoadingUsers}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingUsers ? <Loader className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            {isLoadingUsers ? "Loading…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Online now</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800 dark:text-emerald-200">{onlineUsers.length}</p>
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">Latest activity</p>
          <p className="mt-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
            {latestActiveUser ? latestActiveUser.displayName || latestActiveUser.email || latestActiveUser.uid : "No activity yet"}
          </p>
          <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
            {latestActiveUser?.lastSeenAt ? formatDateTime(latestActiveUser.lastSeenAt) : "Never"}
          </p>
        </div>
      </div>

      {banner.message && (
        <div className="mb-4">
          <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
        </div>
      )}

      {isLoadingUsers && !usersLoaded ? (
        <div className="flex h-36 items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-blue-900 dark:bg-slate-900">
            <Search className="h-4 w-4 text-gray-500 dark:text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email, name, or UID"
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20">
              <div className="border-b border-emerald-200 px-4 py-3 dark:border-emerald-900">
                <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                  Online now
                </h3>
              </div>
              {onlineUsers.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500 dark:text-slate-400">No users online right now.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-emerald-200 text-sm dark:divide-emerald-900">
                    <thead className="bg-white/70 dark:bg-slate-900/70">
                      <tr>
                        {['#', 'Photo', 'Email', 'Display name', 'Last used', 'Delete'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-200 bg-white dark:divide-emerald-900 dark:bg-slate-950">
                      {onlineUsers.map((userItem, index) => (
                        <tr key={userItem.uid} className="transition hover:bg-emerald-50 dark:hover:bg-slate-900">
                          <td className="px-4 py-3 font-medium text-gray-700 dark:text-slate-300">{index + 1}</td>
                          <td className="px-4 py-3">
                            {userItem.photoURL ? (
                              <img
                                src={userItem.photoURL}
                                alt={userItem.displayName || userItem.email || "User"}
                                className="h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-blue-900"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-slate-900 dark:text-slate-300">
                                {(userItem.displayName || userItem.email || "U").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.email || "-"}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.displayName || "-"}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{formatDateTime(userItem.lastSeenAt)}</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50/40 dark:border-blue-900 dark:bg-blue-950/20">
              <div className="border-b border-blue-200 px-4 py-3 dark:border-blue-900">
                <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                  Latest used users
                </h3>
              </div>
              {recentActivityUsers.length === 0 && neverActiveUsers.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-500 dark:text-slate-400">No activity history available.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-blue-200 text-sm dark:divide-blue-900">
                    <thead className="bg-white/70 dark:bg-slate-900/70">
                      <tr>
                        {['#', 'Photo', 'Email', 'Display name', 'Status', 'Last used', 'Delete'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-200 bg-white dark:divide-blue-900 dark:bg-slate-950">
                      {[...recentActivityUsers, ...neverActiveUsers].map((userItem, index) => (
                        <tr key={userItem.uid} className="transition hover:bg-blue-50 dark:hover:bg-slate-900">
                          <td className="px-4 py-3 font-medium text-gray-700 dark:text-slate-300">{index + 1}</td>
                          <td className="px-4 py-3">
                            {userItem.photoURL ? (
                              <img
                                src={userItem.photoURL}
                                alt={userItem.displayName || userItem.email || "User"}
                                className="h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-blue-900"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-slate-900 dark:text-slate-300">
                                {(userItem.displayName || userItem.email || "U").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.email || "-"}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.displayName || "-"}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${userItem.isOnline ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-gray-100 text-gray-600 dark:bg-slate-900 dark:text-slate-300"}`}>
                              {userItem.isOnline ? "Online" : "Offline"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.lastSeenAt ? formatDateTime(userItem.lastSeenAt) : "Never"}</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </section>
  );
}

// ─── QB Handling Section (Year + Subject links) ──────────────────────────────
function QBSection() {
  const [qbItems, setQbItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editItem, setEditItem] = useState(null); // null = not editing, object = editing
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchRows, setBatchRows] = useState([{ subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [filterYear, setFilterYear] = useState(String(CURRENT_YEAR));
  const [searchQuery, setSearchQuery] = useState("");

  function toNullable(value) {
    const trimmed = (value || "").trim();
    return trimmed ? trimmed : null;
  }

  const load = useCallback(async () => {
    if (!filterYear) return;
    setIsLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await listQBAnswerKeys({
        year: filterYear || undefined,
      });
      setQbItems(result.data || []);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to load subjects") });
      setQbItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterYear]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return qbItems;
    return qbItems.filter(
      (item) =>
        (item.subject_code || "").toLowerCase().includes(q) ||
        (item.subject_name || "").toLowerCase().includes(q)
    );
  }, [qbItems, searchQuery]);

  async function handleCreateBatch() {
    const validRows = batchRows
      .map((row) => ({
        year: Number(filterYear),
        subject_code: row.subject_code.trim(),
        subject_name: row.subject_name.trim(),
        qb1: toNullable(row.qb1),
        qb2: toNullable(row.qb2),
        ak1: toNullable(row.ak1),
        ak2: toNullable(row.ak2),
        semqbwithans: toNullable(row.semqbwithans),
      }))
      .filter((row) => row.subject_code && row.subject_name);

    if (!filterYear || validRows.length === 0) {
      setBanner({ type: "error", message: "Select year and add at least one subject code + name" });
      return;
    }

    setIsSaving(true);
    setBanner({ type: "", message: "" });
    try {
      await createQBAnswerKeysBatch({ year: Number(filterYear), subjects: validRows });
      setBanner({ type: "success", message: "Subjects added successfully" });
      setShowBatchForm(false);
      setBatchRows([{ subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]);
      await load();
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to add subjects") });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(payload) {
    setIsSaving(true);
    setBanner({ type: "", message: "" });
    try {
      await updateQBAnswerKey(editItem.id, payload);
      setBanner({ type: "success", message: "Subject updated successfully" });
      setEditItem(null);
      await load();
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to update subject") });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this subject permanently?")) return;
    setDeletingId(id);
    setBanner({ type: "", message: "" });
    try {
      await deleteQBAnswerKey(id);
      setQbItems((prev) => prev.filter((item) => item.id !== id));
      setBanner({ type: "success", message: "Subject deleted" });
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete subject") });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-blue-900 dark:bg-slate-950">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-slate-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
            QB Handling
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
            Add multiple subjects for a year, then edit links later
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowBatchForm(true); setEditItem(null); }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add subjects (batch)
        </button>
      </div>

      {/* Banner */}
      {banner.message && (
        <div className="mb-4">
          <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
        </div>
      )}

      {/* Batch add form */}
      {showBatchForm && !editItem && (
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-slate-200">
            Add subjects for year {filterYear || "-"}
          </h3>
          <div className="space-y-3">
            {batchRows.map((row, idx) => (
              <div key={idx} className="grid gap-2 rounded-lg border border-blue-200 bg-white p-3 sm:grid-cols-7 dark:border-blue-900 dark:bg-slate-950">
                <input
                  type="text"
                  value={row.subject_code}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, subject_code: e.target.value } : r)))}
                  placeholder="Code"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="text"
                  value={row.subject_name}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, subject_name: e.target.value } : r)))}
                  placeholder="Subject name"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="url"
                  value={row.qb1}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, qb1: e.target.value } : r)))}
                  placeholder="QB1"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="url"
                  value={row.qb2}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, qb2: e.target.value } : r)))}
                  placeholder="QB2"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="url"
                  value={row.ak1}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ak1: e.target.value } : r)))}
                  placeholder="AK1"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="url"
                  value={row.ak2}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ak2: e.target.value } : r)))}
                  placeholder="AK2"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={row.semqbwithans}
                    onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, semqbwithans: e.target.value } : r)))}
                    placeholder="Sem QB + Ans"
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setBatchRows((prev) => prev.filter((_, i) => i !== idx))}
                    disabled={batchRows.length === 1}
                    className="rounded border border-red-300 px-2 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setBatchRows((prev) => [...prev, { subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }])}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-slate-900"
              >
                <Plus className="h-4 w-4" />
                Add row
              </button>
              <button
                type="button"
                onClick={handleCreateBatch}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Save batch
              </button>
              <button
                type="button"
                onClick={() => setShowBatchForm(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">All years</option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-blue-900 dark:bg-slate-900">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject code or name"
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <button
          type="button"
          onClick={load}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-blue-900 dark:bg-slate-900">
          <BookOpen className="h-7 w-7 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-slate-400">No subjects found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-blue-900">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">#</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Code</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Subject</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">QB1</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">QB2</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">AK1</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">AK2</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Sem + Ans</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Updated</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-blue-900 dark:bg-slate-950">
              {filtered.map((item, idx) =>
                editItem?.id === item.id ? (
                  <tr key={item.id}>
                    <td colSpan={10} className="px-4 py-4">
                      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-slate-900">
                        <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-slate-200">
                          Edit: {item.subject_code} - {item.subject_name}
                        </h4>
                        <QBForm
                          initial={{ ...editItem, year: String(editItem.year) }}
                          onSubmit={handleUpdate}
                          onCancel={() => setEditItem(null)}
                          isLoading={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id} className="transition hover:bg-gray-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3 font-medium text-gray-500 dark:text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700 dark:bg-slate-800 dark:text-slate-200">
                        {item.subject_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-slate-200">{item.subject_name}</td>
                    <td className="px-4 py-3"><LinkCell value={item.qb1} /></td>
                    <td className="px-4 py-3"><LinkCell value={item.qb2} /></td>
                    <td className="px-4 py-3"><LinkCell value={item.ak1} /></td>
                    <td className="px-4 py-3"><LinkCell value={item.ak2} /></td>
                    <td className="px-4 py-3"><LinkCell value={item.semqbwithans} /></td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{formatDateTime(item.updated_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => { setEditItem(item); setShowBatchForm(false); }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                        >
                          {deletingId === item.id ? (
                            <Loader className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function AdminUsersPage() {
  return (
    <AdminPageShell
      title="Users"
      description="Manage admin-visible user accounts."
    >
      <UsersSection />
    </AdminPageShell>
  );
}

function AdminQBPage() {
  return (
    <AdminPageShell
      title="QB Handling"
      description="Create and edit question bank entries."
    >
      <QBSection />
    </AdminPageShell>
  );
}

function AdminDashboard() {
  return <Navigate to="/admin/users" replace />;
}

export { AdminUsersPage, AdminQBPage };
export default AdminDashboard;
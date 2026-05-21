import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import {
  deleteAdminUser,
  listAdminUsers,
  updateUsers,
  listQBAnswerKeys,
  createQBAnswerKeysBatch,
  reorderQBAnswerKeys,
  updateQBAnswerKey,
  deleteQBAnswerKey,
  uploadAdminFile,
  listAdminCards,
  createCard,
  updateCard,
  deleteCard,
  uploadCardImage,
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
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Wifi,
  WifiOff,
  GripVertical,
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

function formatRouteLabel(value) {
  if (!value) return "-";
  return value;
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
        <button type="button" onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/* -- File upload field ------------------------------------------------------- */
function FileUrlField({ label, fieldKey, value, onChange, onUpload, uploading }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://... or /route"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
        />
        <label className="inline-flex shrink-0 cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100">
          {uploading ? <Loader className="h-4 w-4 animate-spin" /> : "Upload"}
          <input type="file" accept="application/pdf" onChange={onUpload} className="sr-only" />
        </label>
      </div>
    </div>
  );
}

/* -- QB Form ----------------------------------------------------------------- */
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
      if (res?.success && res.url) setForm((prev) => ({ ...prev, [field]: res.url }));
    } catch (err) {
      console.error("upload error", err);
    } finally {
      setUploading((s) => ({ ...s, [field]: false }));
    }
  };

  const set = (key) => (val) =>
    setForm((prev) => ({ ...prev, [key]: typeof val === "string" ? val : val.target.value }));

  function toNullable(value) {
    const trimmed = (value || "").trim();
    return trimmed ? trimmed : null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.year || !form.subject_code.trim() || !form.subject_name.trim()) return;
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

  const urlFields = [
    { key: "qb1", label: "QB1 link" },
    { key: "qb2", label: "QB2 link" },
    { key: "ak1", label: "AK1 link" },
    { key: "ak2", label: "AK2 link" },
    { key: "semqbwithans", label: "Semester QB with answer link" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Year / Code / Name */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">Year</label>
          <select
            value={form.year}
            onChange={set("year")}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Select year</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">Subject code</label>
          <input
            type="text"
            value={form.subject_code}
            onChange={set("subject_code")}
            placeholder="e.g. CS301"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">Subject name</label>
          <input
            type="text"
            value={form.subject_name}
            onChange={set("subject_name")}
            placeholder="e.g. Data Structures"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* URL fields -- 2-col on sm+ */}
      <div className="grid gap-3 sm:grid-cols-2">
        {urlFields.slice(0, 4).map(({ key, label }) => (
          <FileUrlField
            key={key}
            label={label}
            fieldKey={key}
            value={form[key]}
            onChange={(val) => set(key)(val)}
            onUpload={handleFileChange(key)}
            uploading={uploading[key]}
          />
        ))}
      </div>
      <FileUrlField
        label="Semester QB with answer link"
        fieldKey="semqbwithans"
        value={form.semqbwithans}
        onChange={(val) => set("semqbwithans")(val)}
        onUpload={handleFileChange("semqbwithans")}
        uploading={uploading.semqbwithans}
      />

      {/* Actions */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:py-2.5"
        >
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          {isLoading ? "Saving..." : initial ? "Save changes" : "Add answer key"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 sm:flex-none sm:py-2.5"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}

function LinkCell({ value, label }) {
  if (!value) return <span className="text-xs text-gray-400">--</span>;
  return (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-300"
    >
      {label || "Open"} <ExternalLink className="h-3 w-3" />
    </a>
  );
}

function reorderList(items, fromId, toId) {
  const fromIndex = items.findIndex((item) => item.id === fromId);
  const toIndex = items.findIndex((item) => item.id === toId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

/* -- Shell ------------------------------------------------------------------- */
function AdminPageShell({ title, description, children }) {
  const location = useLocation();

  const navItems = [
    { to: "/admin/cards", label: "Cards", icon: Plus },
  ];

  const activeItem = navItems.find((it) => location.pathname === it.to) || navItems[0];
  const otherItems = navItems.filter((it) => it.to !== activeItem.to);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-black sm:pb-6">
      {/* Top header */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-blue-900 dark:bg-slate-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">Admin</p>
            <h1 className="truncate text-base font-bold text-gray-900 dark:text-slate-100">{title}</h1>
          </div>
          {/* Desktop nav: show active item prominently, others below it */}
          <div className="hidden sm:flex sm:flex-col sm:items-end">
            <div>
              {activeItem && (() => {
                const ActiveIcon = activeItem.icon;
                return (
                  <Link
                    to={activeItem.to}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                  >
                    <ActiveIcon className="h-4 w-4" />
                    {activeItem.label}
                  </Link>
                );
              })()}
            </div>
            <nav className="mt-2 flex gap-2">
              {otherItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        {/* Mobile sub-label */}
        <p className="mx-auto mt-0.5 max-w-6xl text-xs text-gray-500 dark:text-slate-400 sm:hidden">{description}</p>
      </header>

      {/* Page body */}
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-4">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-gray-200 bg-white dark:border-blue-900 dark:bg-slate-950 sm:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] font-semibold transition ${
                active ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-slate-400"
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? "text-blue-600 dark:text-blue-400" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

/* -- User card (mobile) ------------------------------------------------------ */
function UserCard({ userItem, index, onDelete, deletingUid, showStatus }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
      {/* Card header -- always visible */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        {userItem.photoURL ? (
          <img
            src={userItem.photoURL}
            alt={userItem.displayName || userItem.email || "User"}
            className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover dark:border-blue-900"
            loading="lazy"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {(userItem.displayName || userItem.email || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
            {userItem.displayName || userItem.email || userItem.uid}
          </p>
          <p className="truncate text-xs text-gray-500 dark:text-slate-400">{userItem.email || userItem.uid}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {showStatus && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              userItem.isOnline
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400"
            }`}>
              {userItem.isOnline ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
              {userItem.isOnline ? "Online" : "Offline"}
            </span>
          )}
          {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-blue-900">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-semibold text-gray-500 dark:text-slate-400">Last seen</p>
              <p className="mt-0.5 text-gray-800 dark:text-slate-200">{userItem.lastSeenAt ? formatDateTime(userItem.lastSeenAt) : "Never"}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 dark:text-slate-400">Last route</p>
              <p className="mt-0.5 truncate text-gray-800 dark:text-slate-200">{formatRouteLabel(userItem.lastUsedRoute)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDelete(userItem.uid)}
            disabled={deletingUid === userItem.uid}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deletingUid === userItem.uid ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete user
          </button>
        </div>
      )}
    </div>
  );
}

/* -- Users table (desktop) --------------------------------------------------- */
function UserTable({ users, onDelete, deletingUid, showStatus }) {
  const cols = showStatus
    ? ["#", "Photo", "Email", "Display name", "Status", "Last seen", "Last used", "Delete"]
    : ["#", "Photo", "Email", "Display name", "Last seen", "Last used", "Delete"];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900">
        <thead className="bg-white/70 dark:bg-slate-900/70">
          <tr>
            {cols.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white dark:divide-blue-900 dark:bg-slate-950">
          {users.map((userItem, index) => (
            <tr key={userItem.uid} className="transition hover:bg-gray-50 dark:hover:bg-slate-900">
              <td className="px-4 py-3 font-medium text-gray-500 dark:text-slate-400">{index + 1}</td>
              <td className="px-4 py-3">
                {userItem.photoURL ? (
                  <img src={userItem.photoURL} alt="" className="h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-blue-900" loading="lazy" />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-slate-800 dark:text-slate-300">
                    {(userItem.displayName || userItem.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </td>
              <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.email || "-"}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.displayName || "-"}</td>
              {showStatus && (
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    userItem.isOnline ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}>
                    {userItem.isOnline ? "Online" : "Offline"}
                  </span>
                </td>
              )}
              <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.lastSeenAt ? formatDateTime(userItem.lastSeenAt) : "Never"}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{formatRouteLabel(userItem.lastUsedRoute)}</td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => onDelete(userItem.uid)}
                  disabled={deletingUid === userItem.uid}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                >
                  {deletingUid === userItem.uid ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -- Users Section ----------------------------------------------------------- */
function UsersSection() {
  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [deletingUid, setDeletingUid] = useState("");
  const [isUpdatingUsers, setIsUpdatingUsers] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });

  function getBatchLabelFromEmail(email) {
    if (!email) return "others";
    // find first occurrence of exactly two digits not part of a longer digit sequence
    const m = email.match(/(^|[^0-9])(\d{2})(?!\d)/);
    if (!m) return "others";
    const two = m[2];
    if (!/^[0-9]{2}$/.test(two)) return "others";
    // only allow these two-digit batches
    const allowed = ["22", "23", "24", "25", "26"];
    if (!allowed.includes(two)) return "others";
    const start = 2000 + Number(two);
    const end = start + 4;
    return `${start}-${end}`;
  }

  const batchCounts = useMemo(() => {
    const counts = {};
    for (const u of users) {
      const label = getBatchLabelFromEmail((u.email || "").toLowerCase());
      counts[label] = (counts[label] || 0) + 1;
    }
    return counts;
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((user) => {
      if (batchFilter) {
        const label = getBatchLabelFromEmail((user.email || "").toLowerCase());
        if (label !== batchFilter) return false;
      }
      if (!q) return true;
      const email = (user.email || "").toLowerCase();
      const name = (user.displayName || "").toLowerCase();
      const uid = (user.uid || "").toLowerCase();
      return email.includes(q) || name.includes(q) || uid.includes(q);
    });
  }, [users, searchQuery, batchFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((left, right) => {
      const leftOnline = Boolean(left.isOnline);
      const rightOnline = Boolean(right.isOnline);
      if (leftOnline !== rightOnline) return leftOnline ? -1 : 1;
      const lastSeenDiff = parseDateValue(right.lastSeenAt) - parseDateValue(left.lastSeenAt);
      if (lastSeenDiff !== 0) return lastSeenDiff;
      return parseDateValue(right.creationTime) - parseDateValue(left.creationTime);
    });
  }, [filteredUsers]);

  const onlineUsers = useMemo(() => sortedUsers.filter((u) => u.isOnline), [sortedUsers]);
  const recentActivityUsers = useMemo(() => sortedUsers.filter((u) => !u.isOnline && u.lastSeenAt), [sortedUsers]);
  const neverActiveUsers = useMemo(() => sortedUsers.filter((u) => !u.isOnline && !u.lastSeenAt), [sortedUsers]);
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

  useEffect(() => { loadUsers(); }, [loadUsers]);
  useEffect(() => {
    const id = window.setInterval(loadUsers, 30000);
    return () => window.clearInterval(id);
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
      setUsers((prev) => prev.filter((u) => u.uid !== uid));
      setBanner({ type: "success", message: "User deleted successfully" });
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to delete user") });
    } finally {
      setDeletingUid("");
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
      {/* Section header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-blue-900 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Users</h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">Search and remove user accounts.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onUpdateUsers}
            disabled={isUpdatingUsers}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 sm:flex-none"
          >
            {isUpdatingUsers ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span>{isUpdatingUsers ? "Updating..." : "Update users"}</span>
          </button>
          <button
            type="button"
            onClick={loadUsers}
            disabled={isLoadingUsers}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:flex-none"
          >
            {isLoadingUsers ? <Loader className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            <span>{isLoadingUsers ? "Loading..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Stats */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
            <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Online now</p>
            <p className="mt-2 text-3xl font-black text-emerald-800 dark:text-emerald-200">{onlineUsers.length}</p>
          </div>
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Latest activity</p>
            <p className="mt-2 truncate text-sm font-bold text-blue-800 dark:text-blue-200">
              {latestActiveUser ? latestActiveUser.displayName || latestActiveUser.email || latestActiveUser.uid : "No activity"}
            </p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300">
              <Clock className="h-3 w-3" />
              {latestActiveUser?.lastSeenAt ? formatDateTime(latestActiveUser.lastSeenAt) : "Never"}
            </p>
            <p className="mt-0.5 truncate text-xs text-blue-600 dark:text-blue-400">
              {latestActiveUser?.lastUsedRoute ? formatRouteLabel(latestActiveUser.lastUsedRoute) : "No route"}
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
            {/* Batch badges */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setBatchFilter("")}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${batchFilter === "" ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
              >
                All
                <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">{users.length}</span>
              </button>
              {Object.entries(batchCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([label, count]) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setBatchFilter(label)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${batchFilter === label ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-700"}`}
                  >
                    {label}
                    <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700">{count}</span>
                  </button>
                ))}
              {batchFilter && (
                <button type="button" onClick={() => setBatchFilter("")} className="ml-auto text-xs text-gray-500 underline">
                  Clear
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-blue-900 dark:bg-slate-900">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email, name, or UID"
                className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Online users group */}
            <div className="mb-4 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2 border-b border-emerald-200 px-4 py-3 dark:border-emerald-900">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-200">Online now</h3>
                <span className="ml-auto rounded-full bg-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                  {onlineUsers.length}
                </span>
              </div>
              {onlineUsers.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-slate-400">No users online right now.</p>
              ) : (
                <>
                  {/* Mobile: cards */}
                  <div className="space-y-2 p-3 sm:hidden">
                    {onlineUsers.map((u, i) => (
                      <UserCard key={u.uid} userItem={u} index={i} onDelete={onDeleteUser} deletingUid={deletingUid} showStatus={false} />
                    ))}
                  </div>
                  {/* Desktop: table */}
                  <div className="hidden sm:block">
                    <UserTable users={onlineUsers} onDelete={onDeleteUser} deletingUid={deletingUid} showStatus={false} />
                  </div>
                </>
              )}
            </div>

            {/* All other users group */}
            <div className="overflow-hidden rounded-xl border border-blue-200 bg-blue-50/40 dark:border-blue-900 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 border-b border-blue-200 px-4 py-3 dark:border-blue-900">
                <h3 className="text-sm font-bold text-blue-800 dark:text-blue-200">All other users</h3>
                <span className="ml-auto rounded-full bg-blue-200 px-2 py-0.5 text-xs font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {recentActivityUsers.length + neverActiveUsers.length}
                </span>
              </div>
              {recentActivityUsers.length === 0 && neverActiveUsers.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-500 dark:text-slate-400">No activity history available.</p>
              ) : (
                <>
                  {/* Mobile: cards */}
                  <div className="space-y-2 p-3 sm:hidden">
                    {[...recentActivityUsers, ...neverActiveUsers].map((u, i) => (
                      <UserCard key={u.uid} userItem={u} index={i} onDelete={onDeleteUser} deletingUid={deletingUid} showStatus />
                    ))}
                  </div>
                  {/* Desktop: table */}
                  <div className="hidden sm:block">
                    <UserTable users={[...recentActivityUsers, ...neverActiveUsers]} onDelete={onDeleteUser} deletingUid={deletingUid} showStatus />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* -- Card form -------------------------------------------------------------- */
function CardForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(
    initial || { img: "", name: "", keywords: [], link: "", btntext: "" }
  );
  const [uploading, setUploading] = useState(false);

  const set = (key) => (val) =>
    setForm((prev) => ({ ...prev, [key]: typeof val === "string" ? val : val.target.value }));

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      setUploading(true);
      const res = await uploadCardImage(fd);
      if (res?.success && res.data?.base64) setForm((p) => ({ ...p, img: res.data.base64 }));
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      img: form.img || null,
      name: (form.name || "").trim(),
      keywords: Array.isArray(form.keywords) ? form.keywords : (form.keywords || "").split(",").map(s=>s.trim()).filter(Boolean),
      link: (form.link || "").trim() || null,
      btntext: (form.btntext || "").trim() || null,
    };
    if (!payload.name) return;
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">Name</label>
          <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="w-full rounded-lg border p-2" required />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">Button Text</label>
          <input value={form.btntext} onChange={(e)=>setForm({...form, btntext:e.target.value})} className="w-full rounded-lg border p-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">Link</label>
          <input value={form.link} onChange={(e)=>setForm({...form, link:e.target.value})} className="w-full rounded-lg border p-2" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">Keywords (comma-separated)</label>
          <input value={Array.isArray(form.keywords)?form.keywords.join(", "):form.keywords} onChange={(e)=>setForm({...form, keywords:e.target.value})} className="w-full rounded-lg border p-2" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300">Image (URL or upload)</label>
        <div className="flex gap-2">
          <input value={form.img} onChange={(e)=>setForm({...form, img:e.target.value})} placeholder="data:image/... or https://..." className="flex-1 rounded-lg border p-2" />
          <label className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer">
            {uploading ? <Loader className="h-4 w-4 animate-spin" /> : "Upload"}
            <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
          </label>
        </div>
        {form.img && (
          <div className="mt-2">
            <img src={form.img} alt="preview" className="h-24 w-auto rounded-md border" />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white">{isLoading?"Saving...":"Save"}</button>
        <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2">Cancel</button>
      </div>
    </form>
  );
}

/* -- Cards Section --------------------------------------------------------- */
function CardsSection() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [banner, setBanner] = useState({ type: "", message: "" });

  const load = async () => {
    setLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const res = await listAdminCards();
      setCards(res.data || []);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to load cards") });
    } finally { setLoading(false); }
  };

  useEffect(()=>{ load(); }, []);

  const onCreate = async (payload) => {
    try {
      const res = await createCard(payload);
      if (res?.success) {
        setCards((p)=>[...(p||[]), res.data]);
        setShowForm(false);
        setBanner({ type: "success", message: "Card added" });
      }
    } catch (err) { setBanner({ type: "error", message: normalizeError(err, "Create failed") }); }
  };

  const onUpdate = async (payload) => {
    try {
      const res = await updateCard(editItem.id, payload);
      if (res?.success) {
        setCards((prev)=>prev.map(c=> c.id===editItem.id? res.data : c));
        setEditItem(null); setShowForm(false);
        setBanner({ type: "success", message: "Card updated" });
      }
    } catch (err) { setBanner({ type: "error", message: normalizeError(err, "Update failed") }); }
  };

  const onDeleteCard = async (id) => {
    if (!window.confirm("Delete this card?")) return;
    try {
      const res = await deleteCard(id);
      if (res?.success) {
        setCards((p)=>p.filter(c=>c.id!==id));
        setBanner({ type: "success", message: "Deleted" });
      }
    } catch (err) { setBanner({ type: "error", message: normalizeError(err, "Delete failed") }); }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b dark:border-blue-900">
        <div>
          <h2 className="text-lg font-bold">Cards</h2>
          <p className="text-sm text-gray-500">Manage homepage cards</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>{ setEditItem(null); setShowForm(true); }} className="rounded-lg bg-blue-600 px-4 py-2 text-white inline-flex items-center gap-2"><Plus/>Add Card</button>
          <button onClick={load} className="rounded-lg border px-3 py-2">Refresh</button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {banner.message && <Banner banner={banner} onDismiss={()=>setBanner({type:"",message:""})} />}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {cards.map(card=> (
              <div key={card.id} className="rounded-lg border p-3 bg-white dark:bg-slate-950">
                {card.img ? <img src={card.img} alt="" className="h-28 w-full object-cover rounded-md" /> : <div className="h-28 w-full bg-gray-100" />}
                <h3 className="mt-2 font-semibold">{card.name}</h3>
                <p className="text-xs text-gray-500">{(card.keywords||[]).join(", ")}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={()=>{ setEditItem(card); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-sm"> <Edit2/> Edit</button>
                  <button onClick={()=>onDeleteCard(card.id)} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1 text-sm text-white"> <Trash2/> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-40 flex items-start justify-center p-6">
            <div className="absolute inset-0 bg-black/40" onClick={()=>{ setShowForm(false); setEditItem(null); }} />
            <div className="relative z-50 w-full max-w-2xl rounded-lg bg-white p-6 dark:bg-slate-950">
              <h3 className="text-lg font-semibold mb-2">{editItem?"Edit Card":"Add Card"}</h3>
              <CardForm initial={editItem} onSubmit={editItem? onUpdate : onCreate} onCancel={()=>{ setShowForm(false); setEditItem(null); }} isLoading={false} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* -- QB card (mobile) -------------------------------------------------------- */
function QBCard({
  item,
  index,
  onEdit,
  onDelete,
  deletingId,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDropTarget,
}) {
  const [expanded, setExpanded] = useState(false);
  const links = [
    { key: "qb1", label: "QB1" },
    { key: "qb2", label: "QB2" },
    { key: "ak1", label: "AK1" },
    { key: "ak2", label: "AK2" },
    { key: "semqbwithans", label: "Sem+Ans" },
  ];

  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      className={`rounded-xl border border-gray-200 bg-white shadow-sm transition dark:border-blue-900 dark:bg-slate-950 ${
        isDragging ? "opacity-50" : ""
      } ${isDropTarget ? "ring-2 ring-inset ring-blue-400" : ""}`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-start gap-3 px-4 py-3 text-left"
      >
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 dark:text-slate-600" />
        <span className="mt-0.5 shrink-0 rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs font-bold text-gray-600 dark:bg-slate-800 dark:text-slate-300">
          {item.subject_code}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{item.subject_name}</p>
          <p className="mt-0.5 text-xs text-gray-400">{item.year}</p>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-blue-900">
          {/* Links grid */}
          <div className="mb-3 grid grid-cols-3 gap-2">
            {links.map(({ key, label }) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-2 dark:border-blue-900 dark:bg-slate-900">
                <p className="text-[10px] font-bold uppercase text-gray-400 dark:text-slate-500">{label}</p>
                <div className="mt-1">
                  <LinkCell value={item[key]} label="Open" />
                </div>
              </div>
            ))}
          </div>
          <p className="mb-3 text-xs text-gray-400">Updated: {formatDateTime(item.updated_at)}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              disabled={deletingId === item.id}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {deletingId === item.id ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -- QB Section -------------------------------------------------------------- */
function QBSection() {
  const [qbItems, setQbItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchRows, setBatchRows] = useState([
    { subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" },
  ]);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [filterYear, setFilterYear] = useState(String(CURRENT_YEAR));
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedId, setDraggedId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);

  function toNullable(value) {
    const trimmed = (value || "").trim();
    return trimmed ? trimmed : null;
  }

  const load = useCallback(async () => {
    if (!filterYear) return;
    setIsLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await listQBAnswerKeys({ year: filterYear || undefined });
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

  const canReorder = Boolean(filterYear) && !searchQuery.trim() && !isLoading && !isSaving && !showBatchForm && !editItem;

  async function persistOrder(nextItems) {
    const previousItems = qbItems;
    const subject_ids = nextItems.map((item) => item.id);

    setQbItems(nextItems);
    setIsReordering(true);
    setBanner({ type: "", message: "" });

    try {
      await reorderQBAnswerKeys({ year: Number(filterYear), subject_ids });
      setBanner({ type: "success", message: "Subject order updated" });
    } catch (err) {
      setQbItems(previousItems);
      setBanner({ type: "error", message: normalizeError(err, "Failed to reorder subjects") });
      await load();
    } finally {
      setIsReordering(false);
      setDraggedId(null);
      setDropTargetId(null);
    }
  }

  async function handleDropOrder(targetId) {
    if (!canReorder || draggedId == null || draggedId === targetId) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    const nextItems = reorderList(qbItems, draggedId, targetId);
    if (nextItems === qbItems) {
      setDraggedId(null);
      setDropTargetId(null);
      return;
    }

    await persistOrder(nextItems);
  }

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
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-blue-900 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-slate-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
            QB Handling
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">Add multiple subjects for a year, then edit links later</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowBatchForm(true); setEditItem(null); }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          Add subjects (batch)
        </button>
      </div>

      <div className="p-4 sm:p-6">
        {banner.message && (
          <div className="mb-4">
            <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
          </div>
        )}

        {/* Batch add form */}
        {showBatchForm && !editItem && (
          <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-slate-900">
            <h3 className="mb-3 text-sm font-bold text-gray-800 dark:text-slate-200">
              Add subjects for year {filterYear || "--"}
            </h3>
            <div className="space-y-3">
              {batchRows.map((row, idx) => (
                <div key={idx} className="rounded-xl border border-blue-200 bg-white p-3 dark:border-blue-900 dark:bg-slate-950">
                  {/* Mobile: stacked labels; Desktop: 7-col grid */}
                  <div className="grid gap-2 sm:grid-cols-7">
                    <div className="space-y-1 sm:col-span-1">
                      <label className="block text-[10px] font-bold uppercase text-gray-400 sm:hidden">Code</label>
                      <input
                        type="text"
                        value={row.subject_code}
                        onChange={(e) => setBatchRows((prev) => prev.map((r, i) => i === idx ? { ...r, subject_code: e.target.value } : r))}
                        placeholder="Code"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-1">
                      <label className="block text-[10px] font-bold uppercase text-gray-400 sm:hidden">Subject name</label>
                      <input
                        type="text"
                        value={row.subject_name}
                        onChange={(e) => setBatchRows((prev) => prev.map((r, i) => i === idx ? { ...r, subject_name: e.target.value } : r))}
                        placeholder="Subject name"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    {[
                      ["qb1", "QB1"],
                      ["qb2", "QB2"],
                      ["ak1", "AK1"],
                      ["ak2", "AK2"],
                    ].map(([field, label]) => (
                      <div key={field} className="space-y-1">
                        <label className="block text-[10px] font-bold uppercase text-gray-400 sm:hidden">{label}</label>
                        <input
                          type="text"
                          value={row[field]}
                          onChange={(e) => setBatchRows((prev) => prev.map((r, i) => i === idx ? { ...r, [field]: e.target.value } : r))}
                          placeholder={label}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                        />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase text-gray-400 sm:hidden">Sem QB + Ans</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={row.semqbwithans}
                          onChange={(e) => setBatchRows((prev) => prev.map((r, i) => i === idx ? { ...r, semqbwithans: e.target.value } : r))}
                          placeholder="Sem QB + Ans"
                          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                        />
                        <button
                          type="button"
                          onClick={() => setBatchRows((prev) => prev.filter((_, i) => i !== idx))}
                          disabled={batchRows.length === 1}
                          className="shrink-0 rounded-lg border border-red-200 px-3 py-2.5 text-xs font-semibold text-red-600 disabled:opacity-40 dark:border-red-900"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setBatchRows((prev) => [...prev, { subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }])}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-300 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300"
                >
                  <Plus className="h-4 w-4" />
                  Add row
                </button>
                <button
                  type="button"
                  onClick={handleCreateBatch}
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Save batch
                </button>
                <button
                  type="button"
                  onClick={() => setShowBatchForm(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
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
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">All years</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-blue-900 dark:bg-slate-900">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code or name..."
              className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={load}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        <div className="mb-4 rounded-xl border border-dashed border-blue-200 bg-blue-50/60 px-4 py-3 text-sm text-blue-900 dark:border-blue-900 dark:bg-slate-900 dark:text-blue-100">
          {canReorder
            ? "Drag subjects by the grip icon to change their order. The new order is saved automatically."
            : "Clear search and keep one year selected to reorder subjects."}
          {isReordering && <span className="ml-2 font-semibold">Saving order...</span>}
        </div>

        {/* Edit form inline */}
        {editItem && (
          <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-slate-900">
            <h4 className="mb-3 text-sm font-bold text-gray-800 dark:text-slate-200">
              Edit: {editItem.subject_code} -- {editItem.subject_name}
            </h4>
            <QBForm
              initial={{ ...editItem, year: String(editItem.year) }}
              onSubmit={handleUpdate}
              onCancel={() => setEditItem(null)}
              isLoading={isSaving}
            />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 dark:border-blue-900 dark:bg-slate-900">
            <BookOpen className="h-7 w-7 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-slate-400">No subjects found</p>
          </div>
        ) : (
          <>
            {/* Mobile: expandable cards */}
            <div className="space-y-2 sm:hidden">
              {filtered.map((item, idx) => (
                <QBCard
                  key={item.id}
                  item={item}
                  index={idx}
                  onEdit={(i) => { setEditItem(i); setShowBatchForm(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  onDelete={handleDelete}
                  deletingId={deletingId}
                  draggable={canReorder}
                  onDragStart={(event) => {
                    if (!canReorder) return;
                    setDraggedId(item.id);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", String(item.id));
                  }}
                  onDragOver={(event) => {
                    if (!canReorder) return;
                    event.preventDefault();
                    setDropTargetId(item.id);
                  }}
                  onDrop={async (event) => {
                    if (!canReorder) return;
                    event.preventDefault();
                    await handleDropOrder(item.id);
                  }}
                  onDragEnd={() => {
                    setDraggedId(null);
                    setDropTargetId(null);
                  }}
                  isDragging={draggedId === item.id}
                  isDropTarget={dropTargetId === item.id}
                />
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-x-auto rounded-xl border border-gray-200 dark:border-blue-900 sm:block">
              <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900">
                <thead className="bg-gray-50 dark:bg-slate-900">
                  <tr>
                    {["#", "Move", "Code", "Subject", "QB1", "QB2", "AK1", "AK2", "Sem + Ans", "Updated", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-blue-900 dark:bg-slate-950">
                  {filtered.map((item, idx) =>
                    editItem?.id === item.id ? null : (
                      <tr
                        key={item.id}
                        draggable={canReorder}
                        onDragStart={(event) => {
                          if (!canReorder) return;
                          setDraggedId(item.id);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", String(item.id));
                        }}
                        onDragOver={(event) => {
                          if (!canReorder) return;
                          event.preventDefault();
                          setDropTargetId(item.id);
                        }}
                        onDrop={async (event) => {
                          if (!canReorder) return;
                          event.preventDefault();
                          await handleDropOrder(item.id);
                        }}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setDropTargetId(null);
                        }}
                        className={`transition hover:bg-gray-50 dark:hover:bg-slate-900 ${draggedId === item.id ? "opacity-50" : ""} ${dropTargetId === item.id ? "ring-2 ring-inset ring-blue-400" : ""}`}
                      >
                        <td className="px-4 py-3 font-medium text-gray-500 dark:text-slate-400">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            disabled={!canReorder}
                            className="inline-flex cursor-grab items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-gray-400 transition hover:bg-gray-50 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-500"
                            aria-label={`Drag to reorder ${item.subject_code}`}
                          >
                            <GripVertical className="h-4 w-4" />
                          </button>
                        </td>
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
                              {deletingId === item.id ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
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
          </>
        )}
      </div>
    </section>
  );
}

/* -- Pages ------------------------------------------------------------------- */
function AdminUsersPage() {
  return (
    <AdminPageShell title="Users" description="Manage admin-visible user accounts.">
      <UsersSection />
    </AdminPageShell>
  );
}

function AdminQBPage() {
  return (
    <AdminPageShell title="QB Handling" description="Create and edit question bank entries.">
      <QBSection />
    </AdminPageShell>
  );
}

function AdminCardsPage() {
  return (
    <AdminPageShell title="Cards" description="Manage homepage cards">
      <CardsSection />
    </AdminPageShell>
  );
}

function AdminDashboard() {
  return <Navigate to="/admin/users" replace />;
}

export { AdminUsersPage, AdminQBPage, AdminCardsPage };
export default AdminDashboard;
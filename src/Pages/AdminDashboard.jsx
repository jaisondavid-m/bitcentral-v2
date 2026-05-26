import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import {
  deleteAdminUser,
  listAdminUsers,
  updateUsers,
  setAdminUserBlocked,
  listQBAnswerKeys,
  createQBAnswerKeysBatch,
  reorderQBAnswerKeys,
  updateQBAnswerKey,
  deleteQBAnswerKey,
  uploadMessMenuCsv,
  uploadAdminFile,
  listAdminCards,
  createCard,
  updateCard,
  reorderAdminCards,
  deleteCard,
} from "../api/admin.js";
import { MealCard } from "../Component/MealCard.jsx";
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
  Eye,
  ExternalLink,
  Clock,
  Wifi,
  WifiOff,
  GripVertical,
  LayoutGrid,
  CalendarDays,
  Upload,
  Database,
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

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function formatRouteLabel(value) {
  if (!value) return "-";
  return value;
}

function formatBlockedAt(value) {
  if (!value) return "-";
  return formatDateTime(value);
}

function parseDateValue(value) {
  if (!value) return 0;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function todayIST() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
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

const ADMIN_TABS = [
  {
    key: "users",
    label: "Users",
    href: "/admin/users",
    icon: Users,
    description: "Manage admin-visible user accounts and activity.",
  },
  {
    key: "qb",
    label: "QB Handling",
    href: "/admin/qb",
    icon: BookOpen,
    description: "Create, edit, and organize question bank entries.",
  },
  {
    key: "cards",
    label: "Cards",
    href: "/admin/cards",
    icon: LayoutGrid,
    description: "Control homepage cards, links, and images.",
  },
  {
    key: "mess",
    label: "Mess Menu",
    href: "/admin/mess",
    icon: CalendarDays,
    description: "Upload boys and girls CSV menus into the database.",
  },
];

function getAdminTabFromPath(pathname) {
  if (pathname.startsWith("/admin/qb")) return "qb";
  if (pathname.startsWith("/admin/cards")) return "cards";
  if (pathname.startsWith("/admin/mess")) return "mess";
  return "users";
}

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

function ConfirmModal({ open, title, description, confirmLabel, cancelLabel = "Cancel", tone = "danger", busy = false, onConfirm, onCancel }) {
  if (!open) return null;

  const confirmClasses =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
      : "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 dark:border-slate-800 dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div className="min-w-0">
            <h3 id="confirm-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-slate-100"
            aria-label="Close confirmation dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">This action will take effect immediately after you confirm.</p>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={busy}
              className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-950 ${confirmClasses}`}
            >
              {busy ? <Loader className="h-4 w-4 animate-spin" /> : null}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
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
function AdminDashboardShell({ activeTab, children }) {
  const activeItem = ADMIN_TABS.find((tab) => tab.key === activeTab) || ADMIN_TABS[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.14),transparent_38%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),rgba(2,6,23,1)_45%)]">
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-400">Admin console</p>
              <h1 className="mt-1 text-xl font-black tracking-tight text-slate-900 dark:text-white">{activeItem.label}</h1>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{activeItem.description}</p>
            </div>

            <div className="hidden rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex">
              {ADMIN_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = tab.key === activeTab;

                return (
                  <Link
                    key={tab.key}
                    to={tab.href}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-4 pb-28 sm:px-6 lg:px-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-4 z-30 px-4 sm:hidden">
        <div className="mx-auto grid max-w-2xl grid-cols-3 overflow-hidden rounded-full border border-white/70 bg-white/90 p-1 shadow-[0_20px_50px_rgba(15,23,42,0.18)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
          {ADMIN_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = tab.key === activeTab;

            return (
              <Link
                key={tab.key}
                to={tab.href}
                className={`flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* -- User card (mobile) ------------------------------------------------------ */
function UserCard({ userItem, index, onDelete, onToggleBlock, deletingUid, showStatus }) {
  const [expanded, setExpanded] = useState(false);
  const isBlocked = Boolean(userItem.isBlocked);
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
          {isBlocked && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
              Blocked
            </span>
          )}
          {showStatus && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              isBlocked
                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                : userItem.isOnline
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400"
            }`}>
              {isBlocked ? <AlertTriangle className="h-2.5 w-2.5" /> : userItem.isOnline ? <Wifi className="h-2.5 w-2.5" /> : <WifiOff className="h-2.5 w-2.5" />}
              {isBlocked ? "Blocked" : userItem.isOnline ? "Online" : "Offline"}
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
            <div>
              <p className="font-semibold text-gray-500 dark:text-slate-400">Blocked at</p>
              <p className="mt-0.5 text-gray-800 dark:text-slate-200">{isBlocked ? formatBlockedAt(userItem.blockedAt) : "-"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onDelete(userItem.uid)}
            disabled={deletingUid === userItem.uid}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-slate-950 dark:text-red-300 dark:hover:bg-slate-900"
          >
            {deletingUid === userItem.uid ? <Loader className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Delete user
          </button>
          <button
            type="button"
            onClick={() => onToggleBlock(userItem.uid, !isBlocked)}
            className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition ${
              isBlocked ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isBlocked ? "Unblock user" : "Block user"}
          </button>
        </div>
      )}
    </div>
  );
}

/* -- Users table (desktop) --------------------------------------------------- */
function UserTable({ users, onDelete, onToggleBlock, deletingUid, showStatus }) {
  const cols = showStatus
    ? ["#", "Photo", "Email", "Display name", "Status", "Last seen", "Last used", "Blocked at", "Action"]
    : ["#", "Photo", "Email", "Display name", "Last seen", "Last used", "Blocked at", "Action"];

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
                  <img src={userItem.photoURL} alt={userItem.displayName || userItem.email || "User profile photo"} className="h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-blue-900" loading="lazy" decoding="async" />
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
                    userItem.isBlocked
                      ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      : userItem.isOnline
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}>
                    {userItem.isBlocked ? "Blocked" : userItem.isOnline ? "Online" : "Offline"}
                  </span>
                </td>
              )}
              <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.lastSeenAt ? formatDateTime(userItem.lastSeenAt) : "Never"}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{formatRouteLabel(userItem.lastUsedRoute)}</td>
              <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{formatBlockedAt(userItem.blockedAt)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleBlock(userItem.uid, !userItem.isBlocked)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white transition ${
                      userItem.isBlocked ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {userItem.isBlocked ? "Unblock" : "Block"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(userItem.uid)}
                    disabled={deletingUid === userItem.uid}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:bg-slate-950 dark:text-red-300 dark:hover:bg-slate-900"
                  >
                    {deletingUid === userItem.uid ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    Delete
                  </button>
                </div>
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
  const [confirmation, setConfirmation] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
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

  const closeConfirmation = () => {
    if (isConfirming) return;
    setConfirmation(null);
  };

  const deleteUser = async (uid) => {
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

  const onDeleteUser = (uid) => {
    setConfirmation({ type: "delete", uid });
  };

  const onConfirmDelete = async () => {
    if (!confirmation || confirmation.type !== "delete") return;
    setIsConfirming(true);
    try {
      await deleteUser(confirmation.uid);
      setConfirmation(null);
    } finally {
      setIsConfirming(false);
    }
  };

  const blockUser = async (uid, blocked) => {
    setBanner({ type: "", message: "" });
    try {
      const result = await setAdminUserBlocked({ uid, blocked });
      setUsers((prev) =>
        prev.map((user) =>
          user.uid === uid
            ? {
                ...user,
                isBlocked: blocked,
                blockedAt: blocked ? result?.user?.blocked_at || new Date().toISOString() : "",
              }
            : user
        )
      );
      setBanner({ type: "success", message: result?.message || (blocked ? "User blocked successfully" : "User unblocked successfully") });
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, blocked ? "Failed to block user" : "Failed to unblock user") });
    }
  };

  const onToggleBlock = async (uid, blocked) => {
    if (blocked) {
      setConfirmation({ type: "block", uid, blocked });
      return;
    }
    await blockUser(uid, blocked);
  };

  const onConfirmBlock = async () => {
    if (!confirmation || confirmation.type !== "block") return;
    setIsConfirming(true);
    try {
      await blockUser(confirmation.uid, true);
      setConfirmation(null);
    } finally {
      setIsConfirming(false);
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

        <ConfirmModal
          open={Boolean(confirmation)}
          title={confirmation?.type === "delete" ? "Delete this user?" : "Block this user?"}
          description={
            confirmation?.type === "delete"
              ? "This permanently removes the user from the database and cannot be undone."
              : "The user will be blocked from signing in and will see the support contact message."
          }
          confirmLabel={confirmation?.type === "delete" ? "Delete user" : "Block user"}
          cancelLabel="Cancel"
          tone="danger"
          busy={isConfirming || Boolean(deletingUid)}
          onConfirm={confirmation?.type === "delete" ? onConfirmDelete : onConfirmBlock}
          onCancel={closeConfirmation}
        />

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
                      <UserCard key={u.uid} userItem={u} index={i} onDelete={onDeleteUser} onToggleBlock={onToggleBlock} deletingUid={deletingUid} showStatus={false} />
                    ))}
                  </div>
                  {/* Desktop: table */}
                  <div className="hidden sm:block">
                    <UserTable users={onlineUsers} onDelete={onDeleteUser} onToggleBlock={onToggleBlock} deletingUid={deletingUid} showStatus={false} />
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
                      <UserCard key={u.uid} userItem={u} index={i} onDelete={onDeleteUser} onToggleBlock={onToggleBlock} deletingUid={deletingUid} showStatus />
                    ))}
                  </div>
                  {/* Desktop: table */}
                  <div className="hidden sm:block">
                    <UserTable users={[...recentActivityUsers, ...neverActiveUsers]} onDelete={onDeleteUser} onToggleBlock={onToggleBlock} deletingUid={deletingUid} showStatus />
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

  useEffect(() => {
    setForm(initial || { img: "", name: "", keywords: [], link: "", btntext: "" });
  }, [initial]);

  const set = (key) => (val) =>
    setForm((prev) => ({ ...prev, [key]: typeof val === "string" ? val : val.target.value }));

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const base64 = await fileToDataURL(file);
      setForm((p) => ({ ...p, img: base64 }));
    } catch (err) {
      console.error("card image upload error", err);
    } finally {
      setUploading(false);
      e.target.value = "";
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            required
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Button Text</label>
          <input
            value={form.btntext}
            onChange={(e) => setForm({ ...form, btntext: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Link</label>
          <input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Keywords</label>
          <input
            value={Array.isArray(form.keywords) ? form.keywords.join(", ") : form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            placeholder="Comma-separated keywords"
            className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="min-w-0 flex-1 space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Image</label>
            <input
              value={form.img}
              onChange={(e) => setForm({ ...form, img: e.target.value })}
              placeholder="Paste an image URL or upload a file to store as base64"
              className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
                Uploaded images are converted to base64 and saved in the database. Use the View img button in the list to preview it.
            </p>
          </div>
          <label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-slate-900">
            {uploading ? <Loader className="h-4 w-4 animate-spin" /> : "Upload image"}
            <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          {isLoading ? "Saving..." : "Save card"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
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
  const [viewCard, setViewCard] = useState(null);
  const [isReordering, setIsReordering] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const orderedCards = useMemo(() => {
    return [...cards].sort((left, right) => {
      const leftOrder = Number(left.card_order ?? 0);
      const rightOrder = Number(right.card_order ?? 0);
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return Number(left.id ?? 0) - Number(right.id ?? 0);
    });
  }, [cards]);

  const visibleCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orderedCards;
    return orderedCards.filter((card) => {
      const keywords = Array.isArray(card.keywords) ? card.keywords.join(" ") : "";
      return [card.name, card.link, card.btntext, keywords].join(" ").toLowerCase().includes(query);
    });
  }, [orderedCards, searchQuery]);

  const cardStats = useMemo(() => ({
    total: orderedCards.length,
    cardsWithImage: orderedCards.filter((card) => Boolean(card.img)).length,
    totalKeywords: orderedCards.reduce((count, card) => count + (Array.isArray(card.keywords) ? card.keywords.length : 0), 0),
    totalClicks: orderedCards.reduce((count, card) => count + Number(card.click_count ?? 0), 0),
  }), [orderedCards]);

  const load = useCallback(async () => {
    setLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const res = await listAdminCards();
      setCards(res.data || []);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to load cards") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persistCardOrder = async (nextCards) => {
    const previousCards = cards;
    const normalizedCards = nextCards.map((card, index) => ({
      ...card,
      card_order: index + 1,
    }));

    setCards(normalizedCards);
    setIsReordering(true);
    setBanner({ type: "", message: "" });

    try {
      await reorderAdminCards({ card_ids: normalizedCards.map((card) => card.id) });
      setBanner({ type: "success", message: "Card order updated" });
    } catch (err) {
      setCards(previousCards);
      setBanner({ type: "error", message: normalizeError(err, "Failed to reorder cards") });
      await load();
    } finally {
      setIsReordering(false);
    }
  };

  const swapCardOrder = async (fromId, toId) => {
    if (searchQuery.trim()) return;
    if (fromId === toId) return;

    const fromIndex = orderedCards.findIndex((card) => card.id === fromId);
    const toIndex = orderedCards.findIndex((card) => card.id === toId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const nextCards = [...orderedCards];
    [nextCards[fromIndex], nextCards[toIndex]] = [nextCards[toIndex], nextCards[fromIndex]];
    await persistCardOrder(nextCards);
  };

  const handleDragStart = (cardId) => (event) => {
    if (searchQuery.trim()) return;
    setDraggedCardId(cardId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(cardId));
  };

  const handleDragOver = (cardId) => (event) => {
    if (searchQuery.trim()) return;
    event.preventDefault();
    setDropTargetId(cardId);
  };

  const handleDrop = (cardId) => async (event) => {
    if (searchQuery.trim()) return;
    event.preventDefault();
    setDropTargetId(null);
    await swapCardOrder(draggedCardId, cardId);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDropTargetId(null);
  };

  const onCreate = async (payload) => {
    try {
      const res = await createCard(payload);
      if (res?.success) {
        setCards((current) => [...(current || []), res.data]);
        setShowForm(false);
        setBanner({ type: "success", message: "Card added" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Create failed") });
    }
  };

  const onUpdate = async (payload) => {
    try {
      const res = await updateCard(editItem.id, payload);
      if (res?.success) {
        setCards((current) => current.map((card) => (card.id === editItem.id ? res.data : card)));
        setEditItem(null);
        setShowForm(false);
        setBanner({ type: "success", message: "Card updated" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Update failed") });
    }
  };

  const onDeleteCard = async (id) => {
    if (!window.confirm("Delete this card?")) return;
    try {
      const res = await deleteCard(id);
      if (res?.success) {
        await load();
        setBanner({ type: "success", message: "Deleted" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Delete failed") });
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Homepage cards</div>
          <h2 className="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">Cards</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage the homepage cards and drag them to change the order.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:min-w-[360px]">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-wide text-slate-400">Total</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{cardStats.total}</p></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-wide text-slate-400">Images</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{cardStats.cardsWithImage}</p></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-wide text-slate-400">Keywords</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{cardStats.totalKeywords}</p></div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-wide text-slate-400">Clicks</p><p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">{cardStats.totalClicks}</p></div>
        </div>
      </div>
      <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:px-6 dark:border-slate-800">
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search cards..." className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500" />
          {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-4 w-4" /></button>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setEditItem(null); setShowForm(true); }} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 sm:flex-none"><Plus className="h-4 w-4" />Add Card</button>
          <button onClick={load} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900 sm:flex-none"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />Refresh</button>
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {banner.message && <div className="mb-4"><Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} /></div>}
        {loading ? (
          <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900"><Loader className="h-5 w-5 animate-spin text-slate-600 dark:text-slate-300" /></div>
        ) : visibleCards.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center dark:border-slate-800 dark:bg-slate-900"><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{searchQuery ? "No matching cards" : "No cards yet"}</p><p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{searchQuery ? "Try a different search term." : "Add a card to show it on the homepage."}</p></div>
        ) : (
          <div className="space-y-2">
            {!searchQuery && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                <GripVertical className="h-4 w-4" />
                Drag rows to change card order.
              </div>
            )}

            {visibleCards.map((card, index) => {
              const keywords = Array.isArray(card.keywords) ? card.keywords : [];
              const isDragging = draggedCardId === card.id;
              const isDropTarget = dropTargetId === card.id;
              return (
                <article
                  key={card.id}
                  draggable={!searchQuery.trim()}
                  onDragStart={handleDragStart(card.id)}
                  onDragOver={handleDragOver(card.id)}
                  onDrop={handleDrop(card.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm transition dark:bg-slate-950 sm:flex-row sm:items-center ${isDragging ? "opacity-50" : ""} ${isDropTarget ? "ring-2 ring-inset ring-slate-400" : "border-slate-200 dark:border-slate-800"}`}
                >
                  <button
                    type="button"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    disabled={Boolean(searchQuery.trim())}
                    title={searchQuery.trim() ? "Clear search to reorder" : "Drag to reorder"}
                  >
                    <GripVertical className="h-5 w-5" />
                  </button>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        Order {card.card_order ?? index + 1}
                      </span>
                      <span className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        #{card.id}
                      </span>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
                        Clicks {Number(card.click_count ?? 0)}
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{card.name}</h3>
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">{card.btntext || "No button text"}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Clicked {Number(card.click_count ?? 0)} times</p>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{card.link || "No link"}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {keywords.length ? keywords.map((keyword) => (
                        <span key={keyword} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          {keyword}
                        </span>
                      )) : (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-slate-900 dark:text-slate-400">No keywords</span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setViewCard(card)}
                      disabled={!card.img}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                    >
                      <Eye className="h-4 w-4" />
                      View img
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditItem(card); setShowForm(true); }}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCard(card.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {viewCard && (
          <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm sm:px-6">
            <div className="absolute inset-0" onClick={() => setViewCard(null)} />
            <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Card image</p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{viewCard.name}</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Clicked {Number(viewCard.click_count ?? 0)} times</p>
                </div>
                <button type="button" onClick={() => setViewCard(null)} className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {viewCard.img ? (
                  <img src={viewCard.img} alt={viewCard.name || "Card image"} className="max-h-[70vh] w-full rounded-2xl border border-slate-200 object-contain dark:border-slate-800" />
                ) : (
                  <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    No image attached
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/55 px-4 py-6 backdrop-blur-sm sm:px-6">
            <div className="absolute inset-0" onClick={() => { setShowForm(false); setEditItem(null); }} />
            <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6"><div><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Card editor</p><h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{editItem ? "Edit card" : "Add card"}</h3></div><button type="button" onClick={() => { setShowForm(false); setEditItem(null); }} className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"><X className="h-4 w-4" /></button></div>
              <div className="p-4 sm:p-6"><CardForm initial={editItem} onSubmit={editItem ? onUpdate : onCreate} onCancel={() => { setShowForm(false); setEditItem(null); }} isLoading={false} /></div>
            </div>
          </div>
        )}
      </div>
    </section>
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
  const [viewItem, setViewItem] = useState(null);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchYear, setBatchYear] = useState(String(CURRENT_YEAR));
  const [batchPreviewItems, setBatchPreviewItems] = useState([]);
  const [batchPreviewLoading, setBatchPreviewLoading] = useState(false);
  const [batchPreviewError, setBatchPreviewError] = useState("");
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

  const loadBatchPreview = useCallback(async () => {
    if (!batchYear) return;

    setBatchPreviewLoading(true);
    setBatchPreviewError("");

    try {
      const result = await listQBAnswerKeys({ year: batchYear });
      setBatchPreviewItems(result.data || []);
    } catch (err) {
      setBatchPreviewItems([]);
      setBatchPreviewError(normalizeError(err, "Failed to load selected batch details"));
    } finally {
      setBatchPreviewLoading(false);
    }
  }, [batchYear]);

  useEffect(() => {
    loadBatchPreview();
  }, [loadBatchPreview]);

  const batchPreviewStats = useMemo(() => {
    const total = batchPreviewItems.length;
    const withLinks = batchPreviewItems.filter((item) => item.qb1 || item.qb2 || item.ak1 || item.ak2 || item.semqbwithans).length;
    const latestItem = [...batchPreviewItems].sort((left, right) => {
      return new Date(right.updated_at || 0).getTime() - new Date(left.updated_at || 0).getTime();
    })[0] || null;

    return {
      total,
      withLinks,
      latestItem,
    };
  }, [batchPreviewItems]);

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
        year: Number(batchYear),
        subject_code: row.subject_code.trim(),
        subject_name: row.subject_name.trim(),
        qb1: toNullable(row.qb1),
        qb2: toNullable(row.qb2),
        ak1: toNullable(row.ak1),
        ak2: toNullable(row.ak2),
        semqbwithans: toNullable(row.semqbwithans),
      }))
      .filter((row) => row.subject_code && row.subject_name);

    if (!batchYear || validRows.length === 0) {
      setBanner({ type: "error", message: "Select a batch year and add at least one subject code + name" });
      return;
    }

    setIsSaving(true);
    setBanner({ type: "", message: "" });
    try {
      await createQBAnswerKeysBatch({ year: Number(batchYear), subjects: validRows });
      setBanner({ type: "success", message: "Subjects added successfully" });
      setShowBatchForm(false);
      setBatchYear(String(CURRENT_YEAR));
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

  function openEdit(item) {
    setEditItem({
      id: item.id,
      year: String(item.year || batchYear || CURRENT_YEAR),
      subject_code: item.subject_code || "",
      subject_name: item.subject_name || "",
      qb1: item.qb1 || "",
      qb2: item.qb2 || "",
      ak1: item.ak1 || "",
      ak2: item.ak2 || "",
      semqbwithans: item.semqbwithans || "",
    });
    setShowBatchForm(false);
    setViewItem(null);
  }

  function openView(item) {
    setViewItem(item);
    setEditItem(null);
    setShowBatchForm(false);
  }

  function closePreviewModals() {
    setViewItem(null);
    setEditItem(null);
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


        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Batch year</h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Select a year to review and manage its subjects.</p>
            </div>
            <div className="w-full sm:w-48">
              <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Year</label>
              <select
                value={batchYear}
                onChange={(e) => setBatchYear(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {YEAR_OPTIONS.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Selected batch</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {batchPreviewLoading ? "Loading subjects..." : `${batchPreviewStats.total} subject${batchPreviewStats.total === 1 ? "" : "s"} in ${batchYear}`}
                </p>
              </div>
              <button
                type="button"
                onClick={loadBatchPreview}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${batchPreviewLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {batchPreviewError ? (
              <p className="mt-3 text-sm text-red-600 dark:text-red-300">{batchPreviewError}</p>
            ) : batchPreviewLoading ? (
              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Loader className="h-4 w-4 animate-spin" />
                Loading batch details...
              </div>
            ) : batchPreviewItems.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">This batch is empty. You can add the first subject below.</p>
            ) : (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <div className="max-h-64 overflow-y-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                    <thead className="sticky top-0 bg-slate-50 dark:bg-slate-900">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Code</th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Subject</th>
                        <th className="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {batchPreviewItems.slice(0, 10).map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                          <td className="px-3 py-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">{item.subject_code}</td>
                          <td className="px-3 py-2 text-slate-700 dark:text-slate-200">{item.subject_name}</td>
                          <td className="px-3 py-2">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => openView(item)}
                                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => openEdit(item)}
                                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900 dark:bg-slate-950 dark:text-red-300 dark:hover:bg-slate-900"
                              >
                                {deletingId === item.id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {batchPreviewItems.length > 10 && (
                  <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                    Showing first 10 subjects of {batchPreviewItems.length}.
                  </div>
                )}
              </div>
            )}
          </div>

          </div>

        {showBatchForm && !editItem && (
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Add subjects</h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Add one or more subjects for the selected year.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowBatchForm(false);
                  setBatchRows([{ subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]);
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Hide form
              </button>
            </div>

            <div className="space-y-3">
              {batchRows.map((row, index) => (
                <div key={`${index}-${row.subject_code}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Subject {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => setBatchRows((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                      disabled={batchRows.length === 1}
                      className="text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={row.subject_code}
                      onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, subject_code: e.target.value } : item))}
                      placeholder="Subject code"
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                    <input
                      value={row.subject_name}
                      onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, subject_name: e.target.value } : item))}
                      placeholder="Subject name"
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                    <input value={row.qb1} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, qb1: e.target.value } : item))} placeholder="QB1 link" className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    <input value={row.qb2} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, qb2: e.target.value } : item))} placeholder="QB2 link" className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    <input value={row.ak1} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, ak1: e.target.value } : item))} placeholder="AK1 link" className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    <input value={row.ak2} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, ak2: e.target.value } : item))} placeholder="AK2 link" className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    <input value={row.semqbwithans} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, semqbwithans: e.target.value } : item))} placeholder="Sem QB with answer link" className="sm:col-span-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBatchRows((current) => ([...current, { subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]))}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  Add row
                </button>
                <button
                  type="button"
                  onClick={handleCreateBatch}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {isSaving ? "Saving..." : "Save batch"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBatchForm(false);
                    setBatchRows([{ subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]);
                    setBatchYear(String(CURRENT_YEAR));
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900">
            <thead className="bg-white/70 dark:bg-slate-900/70">
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

        {viewItem && (
          <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm sm:px-6">
            <div className="absolute inset-0" onClick={closePreviewModals} />
            <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Subject details</p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{viewItem.subject_code}</h3>
                </div>
                <button type="button" onClick={closePreviewModals} className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">Year</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{viewItem.year}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-[10px] uppercase tracking-wide text-slate-400">Subject</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{viewItem.subject_name}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-wide text-slate-400">QB1</p><LinkCell value={viewItem.qb1} /></div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-wide text-slate-400">QB2</p><LinkCell value={viewItem.qb2} /></div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-wide text-slate-400">AK1</p><LinkCell value={viewItem.ak1} /></div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"><p className="text-[10px] uppercase tracking-wide text-slate-400">AK2</p><LinkCell value={viewItem.ak2} /></div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900 sm:col-span-2"><p className="text-[10px] uppercase tracking-wide text-slate-400">Sem QB with answer</p><LinkCell value={viewItem.semqbwithans} /></div>
              </div>
            </div>
          </div>
        )}

        {editItem && (
          <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm sm:px-6">
            <div className="absolute inset-0" onClick={closePreviewModals} />
            <div className="relative z-50 w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Edit subject</p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{editItem.subject_code}</h3>
                </div>
                <button type="button" onClick={closePreviewModals} className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <QBForm
                  initial={editItem}
                  onSubmit={handleUpdate}
                  onCancel={closePreviewModals}
                  isLoading={isSaving}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* -- Mess Section ----------------------------------------------------------- */
function MessSection() {
  const [hostel, setHostel] = useState("boys");
  const [selectedDate, setSelectedDate] = useState(todayIST());
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });

  const loadPreview = useCallback(async () => {
    if (!hostel || !selectedDate) return;

    setLoading(true);
    setBanner({ type: "", message: "" });

    try {
      const response = await api.get("/mess", { params: { hostel, date: selectedDate } });
      setPreview(response.data || {});
    } catch (err) {
      setPreview(null);
      setBanner({ type: "error", message: normalizeError(err, "Failed to load mess menu") });
    } finally {
      setLoading(false);
    }
  }, [hostel, selectedDate]);

  useEffect(() => {
    loadPreview();
  }, [loadPreview]);

  const fullMenu = preview?.full_menu || {};
  const totalItems = useMemo(() => {
    return ["breakfast", "lunch", "dinner"].reduce((sum, key) => sum + (fullMenu[key]?.length || 0), 0);
  }, [fullMenu]);

  const currentMeal = preview?.current_meal?.meal_type?.toLowerCase?.() || "breakfast";

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("hostel", hostel);
    formData.append("file", file);

    setUploading(true);
    setBanner({ type: "", message: "" });

    try {
      const result = await uploadMessMenuCsv(formData);
      setBanner({ type: "success", message: result?.message || "Mess menu uploaded successfully" });
      await loadPreview();
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to upload mess CSV") });
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-blue-900 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-slate-100">
            <Database className="h-5 w-5 text-blue-600" />
            Mess Menu
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">Upload a CSV for boys or girls in the same date/day/meal/item format.</p>
        </div>
        <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto">
          {uploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload CSV"}
          <input type="file" accept=".csv,text/csv" onChange={handleUpload} className="sr-only" disabled={uploading} />
        </label>
      </div>

      <div className="p-4 sm:p-6">
        {banner.message && (
          <div className="mb-4">
            <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Hostel</p>
            <div className="mt-2 flex gap-2">
              {["boys", "girls"].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setHostel(value)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${hostel === value ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"}`}
                >
                  {value === "boys" ? "Boys" : "Girls"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Date</p>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Items</p>
            <p className="mt-2 text-2xl font-black text-slate-900 dark:text-slate-100">{totalItems}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-[10px] uppercase tracking-wide text-slate-400">Loaded day</p>
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{preview?.day || "-"}</p>
            <button
              type="button"
              onClick={loadPreview}
              className="mt-3 inline-flex rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Refresh preview
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {loading ? (
            <div className="lg:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-16 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
              Loading mess menu preview...
            </div>
          ) : (
            ["breakfast", "lunch", "dinner"].map((meal) => (
              <MealCard
                key={meal}
                type={meal}
                items={fullMenu[meal] || []}
                isActive={currentMeal === meal}
                isServingNow={preview?.current_meal?.meal_type?.toLowerCase?.() === meal}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

/* -- Pages ------------------------------------------------------------------- */
function AdminDashboard({ initialTab } = {}) {
  const location = useLocation();
  const activeTab = initialTab || getAdminTabFromPath(location.pathname);

  return (
    <AdminDashboardShell activeTab={activeTab}>
      {activeTab === "qb" ? <QBSection /> : activeTab === "cards" ? <CardsSection /> : activeTab === "mess" ? <MessSection /> : <UsersSection />}
    </AdminDashboardShell>
  );
}

function AdminUsersPage() {
  return <AdminDashboard initialTab="users" />;
}

function AdminQBPage() {
  return <AdminDashboard initialTab="qb" />;
}

function AdminCardsPage() {
  return <AdminDashboard initialTab="cards" />;
}

function AdminMessPage() {
  return <AdminDashboard initialTab="mess" />;
}

export { AdminUsersPage, AdminQBPage, AdminCardsPage, AdminMessPage };
export default AdminDashboard;
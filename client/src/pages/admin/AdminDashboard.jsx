import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "@/api/axios";
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
  listMessMenuRows,
  updateMessMenuRow,
  deleteMessMenuRow,
  uploadAdminFile,
  listAdminCards,
  createCard,
  updateCard,
  reorderAdminCards,
  deleteCard,
  addAdmin,
  removeAdmin,
  getAdminSponsors,
} from "@/api/admin.js";
import { MealCard } from "@/components/cards/MealCard.jsx";
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
  Check,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
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
  Download,
  UserMinus,
  Heart,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import SuperAdminPanel from "./SuperAdminPanel.jsx";
import AdminPSRewardsPage from "./AdminPSRewards.jsx";
import AdminFeedbackPage from "./AdminFeedbackPage.jsx";
import { checkSuperAdmin } from "@/api/admin.js";

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

function dateKeyFromValue(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

const MESS_CSV_TEMPLATE = `date,day,meal_type,item
2026-04-01,Wednesday,Breakfast,Raw rice pongal
2026-04-01,Wednesday,Breakfast,Sambar
2026-04-01,Wednesday,Breakfast,Coffee/Milk/Tea
2026-04-01,Wednesday,Lunch,Rice
2026-04-01,Wednesday,Lunch,Brinjal Sambar
2026-04-01,Wednesday,Dinner,Chapatti
2026-04-01,Wednesday,Dinner,Egg masala
`;

function downloadMessTemplate() {
  const blob = new Blob([MESS_CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mess-menu-template.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
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
    gradient: "from-violet-600 to-purple-600",
    badge: "User Directory",
    description: "Manage registered user accounts, system roles, permissions, and account status.",
  },
  {
    key: "sponsors",
    label: "Sponsored Users",
    href: "/admin/sponsors",
    icon: Heart,
    gradient: "from-rose-500 to-pink-600",
    badge: "Contributions",
    description: "Live contribution history & Razorpay payment logs for sponsored students.",
  },
  {
    key: "qb",
    label: "QB Handling",
    href: "/admin/qb",
    icon: BookOpen,
    gradient: "from-emerald-500 to-teal-600",
    badge: "Question Papers",
    description: "Create, edit, search, and organize general question bank entries and answer keys.",
  },
  {
    key: "ps",
    label: "PS Rewards",
    href: "/admin/ps-rewards",
    icon: Clock,
    gradient: "from-amber-500 to-orange-600",
    badge: "PS Integration",
    description: "Store PS cookie credentials and inspect live rewards breakdown responses.",
  },
  {
    key: "cards",
    label: "Cards",
    href: "/admin/cards",
    icon: LayoutGrid,
    gradient: "from-cyan-500 to-blue-600",
    badge: "Banners & Links",
    description: "Control home page feature cards, custom quick links, banners, and card ordering.",
  },
  {
    key: "mess",
    label: "Mess Menu",
    href: "/admin/mess",
    icon: CalendarDays,
    gradient: "from-fuchsia-500 to-pink-600",
    badge: "Food & Meals",
    description: "Upload and schedule boys & girls mess menu CSV files for weekly meals.",
  },
  {
    key: "feedback",
    label: "Feedback & Support",
    href: "/admin/feedback",
    icon: MessageSquare,
    gradient: "from-blue-600 to-indigo-600",
    badge: "Student Chat",
    description: "Chat directly with users to answer feedback, resolve issues, and send live status updates.",
  },
  {
    key: "super",
    label: "Super Admin",
    href: "/admin/super",
    icon: Database,
    gradient: "from-slate-800 to-slate-950",
    badge: "Super Privileges",
    description: "Manage super-admin privileges, domain restrictions, and administrative access.",
  },
];

function getAdminTabFromPath(pathname) {
  if (pathname === "/admin" || pathname === "/admin/") return "overview";
  if (pathname.startsWith("/admin/sponsors")) return "sponsors";
  if (pathname.startsWith("/admin/qb")) return "qb";
  if (pathname.startsWith("/admin/ps-rewards")) return "ps";
  if (pathname.startsWith("/admin/cards")) return "cards";
  if (pathname.startsWith("/admin/mess")) return "mess";
  if (pathname.startsWith("/admin/feedback")) return "feedback";
  if (pathname.startsWith("/admin/super")) return "super";
  if (pathname.startsWith("/admin/users")) return "users";
  return "overview";
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

/* -- Admin Overview Grid ----------------------------------------------------- */
function AdminOverviewGrid({ isSuper }) {
  const visibleTabs = ADMIN_TABS.filter((t) => {
    if (t.key === "users" || t.key === "super") return Boolean(isSuper);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Simple, Professional Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Admin Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Select an administrative module below to manage your system settings, user directory, and content.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {visibleTabs.length} Active Modules
          </span>
        </div>
      </div>

      {/* Module Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.key}
              to={tab.href}
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:border-blue-500/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-blue-500/40"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tab.gradient} text-white shadow-xs`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {tab.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                  {tab.label}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                  {tab.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-medium text-slate-500 transition-colors group-hover:text-blue-600 dark:border-slate-800 dark:text-slate-400 dark:group-hover:text-blue-400">
                <span>Manage module</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* -- Shell ------------------------------------------------------------------- */
function AdminDashboardShell({ activeTab, children }) {
  const activeItem = ADMIN_TABS.find((tab) => tab.key === activeTab) || ADMIN_TABS[0];
  const Icon = activeItem?.icon;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_40%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),rgba(2,6,23,1)_45%)]">
      {activeTab !== "overview" && (
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
            {/* Minimal Left Breadcrumb Navigation */}
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="group flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-4 w-4 text-blue-600 transition transform group-hover:-translate-x-0.5" />
                <span>Admin Dashboard</span>
              </Link>

              <span className="text-slate-300 dark:text-slate-700">/</span>

              <div className="flex items-center gap-2">
                {Icon && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Icon className="h-4 w-4" />
                  </div>
                )}
                <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                  {activeItem.label}
                </h1>
              </div>
            </div>

            {/* Right Status Badge */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live System
              </span>
            </div>
          </div>
        </header>
      )}

      <main className="mx-auto max-w-7xl px-4 py-5 pb-16 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}

/* -- User card (mobile) ------------------------------------------------------ */
function UserCard({ userItem, index, onDelete, onToggleBlock, deletingUid, showStatus, isSuper, onToggleAdmin, adminActionUid }) {
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
          {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3 dark:border-blue-900">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-semibold text-gray-500 dark:text-slate-400">Created at</p>
              <p className="mt-0.5 text-gray-800 dark:text-slate-200">{formatDateTime(userItem.creationTime)}</p>
            </div>
            <div>
              <p className="font-semibold text-gray-500 dark:text-slate-400">Last sign in</p>
              <p className="mt-0.5 text-gray-800 dark:text-slate-200">{formatDateTime(userItem.lastSignInTime)}</p>
            </div>
            {isBlocked && (
              <div className="col-span-2">
                <p className="font-semibold text-gray-500 dark:text-slate-400">Blocked at</p>
                <p className="mt-0.5 text-gray-800 dark:text-slate-200">{formatBlockedAt(userItem.blockedAt)}</p>
              </div>
            )}
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
          {isSuper && (
            <button
              type="button"
              onClick={() => onToggleAdmin(userItem)}
              disabled={adminActionUid === userItem.uid}
              className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                userItem.isAdmin
                  ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200 dark:hover:bg-amber-950/60"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              }`}
            >
              {adminActionUid === userItem.uid ? <Loader className="h-4 w-4 animate-spin" /> : userItem.isAdmin ? <UserMinus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {userItem.isAdmin ? "Depromote" : "Promote to admin"}
            </button>
          )}
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
function UserTable({ users, onDelete, onToggleBlock, deletingUid, isSuper, onToggleAdmin, adminActionUid, page, pageSize }) {
  const cols = ["#", "User", "Created at", "Last sign in", "Status", "Action"];

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-blue-900/60">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900/60">
        <thead className="bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:bg-slate-900/80 dark:text-slate-400">
          <tr>
            {cols.map((h) => (
              <th key={h} className="px-4 py-3.5 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white dark:divide-blue-900/40 dark:bg-slate-950">
          {users.map((userItem, index) => {
            const rowNumber = (page - 1) * pageSize + index + 1;
            const isBlocked = userItem.isBlocked;
            return (
              <tr key={userItem.uid} className="transition hover:bg-gray-50/80 dark:hover:bg-slate-900/50">
                <td className="px-4 py-3.5 text-xs font-medium text-gray-400 dark:text-slate-500">{rowNumber}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    {userItem.photoURL ? (
                      <img
                        src={userItem.photoURL}
                        alt={userItem.displayName || userItem.email || "User photo"}
                        className="h-9 w-9 shrink-0 rounded-full border border-gray-200 object-cover dark:border-slate-700"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300 border border-blue-100 dark:border-blue-900">
                        {(userItem.displayName || userItem.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {userItem.displayName || "No Name"}
                      </p>
                      <p className="truncate text-xs text-gray-500 dark:text-slate-400">{userItem.email || userItem.uid}</p>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-gray-600 dark:text-slate-300">{formatDateTime(userItem.creationTime)}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-gray-600 dark:text-slate-300">{formatDateTime(userItem.lastSignInTime)}</td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  {isBlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-900">
                      Blocked
                    </span>
                  ) : userItem.isAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                      Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                      Active
                    </span>
                  )}
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {isSuper && (
                      <button
                        type="button"
                        onClick={() => onToggleAdmin(userItem)}
                        disabled={adminActionUid === userItem.uid}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                          userItem.isAdmin
                            ? "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        }`}
                      >
                        {adminActionUid === userItem.uid ? (
                          <Loader className="h-3.5 w-3.5 animate-spin" />
                        ) : userItem.isAdmin ? (
                          <UserMinus className="h-3.5 w-3.5" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                        <span>{userItem.isAdmin ? "Depromote" : "Promote"}</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onToggleBlock(userItem.uid, !userItem.isBlocked)}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white transition ${
                        userItem.isBlocked ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
                      }`}
                    >
                      <span>{userItem.isBlocked ? "Unblock" : "Block"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(userItem.uid)}
                      disabled={deletingUid === userItem.uid}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/60 dark:bg-slate-950 dark:text-red-400 dark:hover:bg-red-950/40"
                    >
                      {deletingUid === userItem.uid ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      <span>Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* -- Users Section ----------------------------------------------------------- */
function UsersSection({ isSuper }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [batchCounts, setBatchCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [deletingUid, setDeletingUid] = useState("");
  const [isUpdatingUsers, setIsUpdatingUsers] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [adminActionUid, setAdminActionUid] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await listAdminUsers({
        page,
        limit: pageSize,
        search: debouncedSearch,
        batch: batchFilter,
      });
      setUsers(result.users || []);
      setTotal(result.total || 0);
      setFilteredTotal(result.filteredTotal || 0);
      setTotalPages(result.totalPages || 1);
      setBatchCounts(result.batchCounts || {});
    } catch (error) {
      setUsers([]);
      setBanner({ type: "error", message: normalizeError(error, "Failed to load users") });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [page, pageSize, debouncedSearch, batchFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const onUpdateUsers = async () => {
    setIsUpdatingUsers(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await updateUsers();
      setBanner({ type: "success", message: result?.message || "Users synced successfully" });
      await loadUsers();
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to sync users") });
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
      setBanner({ type: "success", message: "User deleted successfully" });
      await loadUsers();
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
      setBanner({ type: "success", message: result?.message || (blocked ? "User blocked successfully" : "User unblocked successfully") });
      await loadUsers();
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

  const onToggleAdmin = (user) => {
    if (!user?.uid) return;
    setConfirmation({
      type: "admin",
      uid: user.uid,
      isAdmin: Boolean(user.isAdmin),
      label: user.displayName || user.email || user.uid,
    });
  };

  const onConfirmAdminToggle = async () => {
    if (!confirmation || confirmation.type !== "admin") return;
    setIsConfirming(true);
    setAdminActionUid(confirmation.uid);
    setBanner({ type: "", message: "" });
    try {
      const isAdmin = Boolean(confirmation.isAdmin);
      const res = isAdmin ? await removeAdmin(confirmation.uid) : await addAdmin(confirmation.uid);
      setBanner({ type: "success", message: res?.message || (isAdmin ? "Admin removed" : "Admin added") });
      await loadUsers();
      setConfirmation(null);
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, confirmation.isAdmin ? "Failed to depromote user" : "Failed to promote user") });
    } finally {
      setIsConfirming(false);
      setAdminActionUid("");
    }
  };

  const allowedBatches = ["2026-2030", "2025-2029", "2024-2028", "2023-2027", "2022-2026", "others"];

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
      {/* Section header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-blue-900 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">Users</h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {total.toLocaleString()} total
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
            Search across all user accounts and manage permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onUpdateUsers}
            disabled={isUpdatingUsers}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60 sm:flex-none"
          >
            {isUpdatingUsers ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span>{isUpdatingUsers ? "Syncing..." : "Sync users"}</span>
          </button>
          <button
            type="button"
            onClick={loadUsers}
            disabled={isLoadingUsers}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:flex-none"
          >
            {isLoadingUsers ? <Loader className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            <span>{isLoadingUsers ? "Loading..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {banner.message && (
          <div className="mb-4">
            <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
          </div>
        )}

        <ConfirmModal
          open={Boolean(confirmation)}
          title={confirmation?.type === "delete" ? "Delete this user?" : confirmation?.type === "block" ? "Block this user?" : confirmation?.isAdmin ? "Depromote this user?" : "Promote this user?"}
          description={
            confirmation?.type === "delete"
              ? "This permanently removes the user from the database and cannot be undone."
              : confirmation?.type === "block"
                ? "The user will be blocked from signing in and will see the support contact message."
                : confirmation?.isAdmin
                  ? `This will remove admin access from ${confirmation?.label || "this user"}.`
                  : `This will add ${confirmation?.label || "this user"} to the admins table and grant admin access.`
          }
          confirmLabel={confirmation?.type === "delete" ? "Delete user" : confirmation?.type === "block" ? "Block user" : confirmation?.isAdmin ? "Depromote user" : "Promote user"}
          cancelLabel="Cancel"
          tone={confirmation?.type === "admin" && !confirmation?.isAdmin ? "success" : "danger"}
          busy={isConfirming || Boolean(deletingUid) || Boolean(adminActionUid)}
          onConfirm={confirmation?.type === "delete" ? onConfirmDelete : confirmation?.type === "block" ? onConfirmBlock : onConfirmAdminToggle}
          onCancel={closeConfirmation}
        />

        {/* Batch badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => { setBatchFilter(""); setPage(1); }}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              batchFilter === "" ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <span>All</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${batchFilter === "" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300"}`}>
              {total.toLocaleString()}
            </span>
          </button>
          {allowedBatches.map((label) => {
            const count = batchCounts[label] || 0;
            return (
              <button
                key={label}
                type="button"
                onClick={() => { setBatchFilter(label); setPage(1); }}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  batchFilter === label ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <span>{label}</span>
                <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${batchFilter === label ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                  {count.toLocaleString()}
                </span>
              </button>
            );
          })}
          {batchFilter && (
            <button type="button" onClick={() => { setBatchFilter(""); setPage(1); }} className="ml-auto text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
              Clear filter
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-blue-900 dark:bg-slate-900 dark:focus-within:bg-slate-950">
          <Search className="h-4 w-4 shrink-0 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all users by email, name, or UID..."
            className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Table Content */}
        {isLoadingUsers ? (
          <div className="flex h-48 items-center justify-center">
            <Loader className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-6 dark:border-slate-800">
            <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">No users found</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Try adjusting your search query or batch filter.</p>
          </div>
        ) : (
          <>
            {/* Mobile: cards */}
            <div className="space-y-2.5 sm:hidden">
              {users.map((u, i) => (
                <UserCard
                  key={u.uid}
                  userItem={u}
                  index={i}
                  onDelete={onDeleteUser}
                  onToggleBlock={onToggleBlock}
                  deletingUid={deletingUid}
                  isSuper={isSuper}
                  onToggleAdmin={onToggleAdmin}
                  adminActionUid={adminActionUid}
                />
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block">
              <UserTable
                users={users}
                onDelete={onDeleteUser}
                onToggleBlock={onToggleBlock}
                deletingUid={deletingUid}
                isSuper={isSuper}
                onToggleAdmin={onToggleAdmin}
                adminActionUid={adminActionUid}
                page={page}
                pageSize={pageSize}
              />
            </div>

            {/* Pagination Controls Footer */}
            <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-blue-900/50 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-slate-400">
                <span>
                  Showing{" "}
                  <span className="font-semibold text-gray-800 dark:text-slate-200">
                    {filteredTotal === 0 ? 0 : (page - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-800 dark:text-slate-200">
                    {Math.min(page * pageSize, filteredTotal)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-800 dark:text-slate-200">
                    {filteredTotal.toLocaleString()}
                  </span>{" "}
                  users {batchFilter || debouncedSearch ? `(filtered from ${total.toLocaleString()})` : ""}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">|</span>
                  <span>Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Page buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoadingUsers}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1 px-2 text-xs font-bold text-gray-700 dark:text-slate-300">
                  <span>Page {page}</span>
                  <span className="font-normal text-gray-400">of</span>
                  <span>{totalPages}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoadingUsers}
                  className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
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

/* -- Student Email Parsing Helper ----------------------------------------- */
const DEPARTMENT_MASTER = {
  cs: { code: "CS", alt: "CSE", name: "Computer Science & Engineering (CS / CSE)" },
  ad: { code: "AD", alt: "AI&DS", name: "Artificial Intelligence & Data Science (AD / AI&DS)" },
  al: { code: "AL", alt: "AIML", name: "Artificial Intelligence & Machine Learning (AL / AIML)" },
  it: { code: "IT", alt: "IT", name: "Information Technology (IT)" },
  ec: { code: "EC", alt: "ECE", name: "Electronics & Communication Engineering (EC / ECE)" },
  ee: { code: "EE", alt: "EEE", name: "Electrical & Electronics Engineering (EE / EEE)" },
  ei: { code: "EI", alt: "EIE", name: "Electronics & Instrumentation Engineering (EI)" },
  me: { code: "ME", alt: "MECH", name: "Mechanical Engineering (ME / MECH)" },
  ce: { code: "CE", alt: "CIVIL", name: "Civil Engineering (CE / CIVIL)" },
  ag: { code: "AG", alt: "AGRI", name: "Agricultural Engineering (AG / AGRI)" },
  bt: { code: "BT", alt: "BT", name: "Biotechnology (BT)" },
  ft: { code: "FT", alt: "FT", name: "Food Technology (FT)" },
  fd: { code: "FD", alt: "FD", name: "Fashion Technology (FD)" },
  bm: { code: "BM", alt: "BME", name: "Biomedical Engineering (BM / BME)" },
  mb: { code: "MB", alt: "MBA", name: "Management Studies (MB / MBA)" },
  cb: { code: "CB", alt: "CSBS", name: "Computer Science & Business Systems (CB / CSBS)" },
  cd: { code: "CD", alt: "CSD", name: "Computer Science & Design (CD / CSD)" },
  ct: { code: "CT", alt: "CT", name: "Computer Technology (CT)" },
  mz: { code: "MZ", alt: "MCTR", name: "Mechatronics Engineering (MZ)" },
};

function parseStudentEmail(email) {
  if (!email || typeof email !== "string") return null;
  const cleanEmail = email.trim().toLowerCase();

  // Must end with @bitsathy.ac.in (ignore gmail.com or plain domains)
  if (!cleanEmail.endsWith("@bitsathy.ac.in")) return null;

  const username = cleanEmail.split("@")[0];
  const parts = username.split(".");
  // Must have a dot before @, e.g., jaisondavidm.cs25
  if (parts.length < 2) return null;

  const deptYear = parts[parts.length - 1]; // e.g. "cs25", "ad25", "al25"
  const match = deptYear.match(/^([a-z]{2})(\d{2})$/);
  if (!match) return null;

  const rawDept = match[1];
  const yearTwoDigits = match[2];
  const fullYear = 2000 + parseInt(yearTwoDigits, 10);

  const deptInfo = DEPARTMENT_MASTER[rawDept] || {
    code: rawDept.toUpperCase(),
    alt: rawDept.toUpperCase(),
    name: `${rawDept.toUpperCase()} Department`,
  };

  return {
    email: cleanEmail,
    deptCode: deptInfo.code,
    deptAlt: deptInfo.alt,
    deptName: deptInfo.name,
    yearCode: yearTwoDigits,
    fullYear: String(fullYear),
  };
}

/* -- Department Multi-Select Component ----------------------------------- */
const DEFAULT_DEPARTMENTS_LIST = [
  { code: "ALL", name: "All Departments" },
  { code: "CS", name: "Computer Science & Engineering (CS / CSE)" },
  { code: "AD", name: "Artificial Intelligence & Data Science (AD / AI&DS)" },
  { code: "AL", name: "Artificial Intelligence & Machine Learning (AL / AIML)" },
  { code: "IT", name: "Information Technology (IT)" },
  { code: "EC", name: "Electronics & Communication Engineering (EC / ECE)" },
  { code: "EE", name: "Electrical & Electronics Engineering (EE / EEE)" },
  { code: "EI", name: "Electronics & Instrumentation Engineering (EI)" },
  { code: "ME", name: "Mechanical Engineering (ME / MECH)" },
  { code: "CE", name: "Civil Engineering (CE / CIVIL)" },
  { code: "AG", name: "Agricultural Engineering (AG / AGRI)" },
  { code: "BT", name: "Biotechnology (BT)" },
  { code: "FT", name: "Food Technology (FT)" },
  { code: "FD", name: "Fashion Technology (FD)" },
  { code: "BM", name: "Biomedical Engineering (BM / BME)" },
  { code: "MB", name: "Management Studies (MB / MBA)" },
  { code: "CB", name: "Computer Science & Business Systems (CB / CSBS)" },
  { code: "CD", name: "Computer Science & Design (CD / CSD)" },
  { code: "CT", name: "Computer Technology (CT)" },
  { code: "MZ", name: "Mechatronics Engineering (MZ)" },
];

function DepartmentSelect({ value = "ALL", onChange, label = "Department", isMulti = true, customOptions = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const availableDepts = useMemo(() => {
    const baseList = customOptions && customOptions.length > 0 ? customOptions : DEFAULT_DEPARTMENTS_LIST;
    const hasAll = baseList.some((d) => d.code === "ALL");
    return hasAll ? baseList : [{ code: "ALL", name: "All Departments" }, ...baseList];
  }, [customOptions]);

  const selectedCodes = useMemo(() => {
    if (!value || value.toUpperCase() === "ALL") return ["ALL"];
    return value.split(",").map((s) => s.trim()).filter(Boolean);
  }, [value]);

  const isAll = selectedCodes.includes("ALL");

  const filteredDepts = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return availableDepts;
    return availableDepts.filter(
      (d) => d.code.toLowerCase().includes(q) || (d.name || "").toLowerCase().includes(q)
    );
  }, [search, availableDepts]);

  const toggleDept = (code) => {
    if (!isMulti) {
      onChange(code);
      setIsOpen(false);
      return;
    }

    if (code === "ALL") {
      onChange("ALL");
      return;
    }

    let next = selectedCodes.filter((c) => c !== "ALL");
    if (next.includes(code)) {
      next = next.filter((c) => c !== code);
    } else {
      next.push(code);
    }

    if (next.length === 0) {
      onChange("ALL");
    } else {
      onChange(next.join(", "));
    }
  };

  const removeDept = (e, code) => {
    e.stopPropagation();
    if (code === "ALL" || selectedCodes.length <= 1) {
      onChange("ALL");
    } else {
      const next = selectedCodes.filter((c) => c !== code && c !== "ALL");
      onChange(next.length === 0 ? "ALL" : next.join(", "));
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>}

      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex min-h-[42px] cursor-pointer flex-wrap items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm transition hover:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-500"
      >
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {selectedCodes.map((code) => (
            <span
              key={code}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                code === "ALL"
                  ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  : "border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/70 dark:text-blue-300"
              }`}
            >
              {code === "ALL" ? "All Departments" : code}
              {selectedCodes.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => removeDept(e, code)}
                  className="rounded hover:bg-blue-200/60 dark:hover:bg-blue-900"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>

        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[280px] max-w-md rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xl animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dept code (e.g. cs, ad, al) or name..."
              className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {filteredDepts.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">No matching department found</div>
            ) : (
              filteredDepts.map((dept) => {
                const isSelected = selectedCodes.includes(dept.code);
                return (
                  <button
                    key={dept.code}
                    type="button"
                    onClick={() => toggleDept(dept.code)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                      isSelected
                        ? "bg-blue-50 font-bold text-blue-700 dark:bg-blue-950/80 dark:text-blue-200"
                        : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs ${dept.code === "ALL" ? "text-slate-500 dark:text-slate-400" : "text-blue-600 dark:text-blue-400 font-bold"}`}>
                          {dept.code}
                        </span>
                        <span className="truncate text-slate-800 dark:text-slate-200">{dept.name}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />}
                  </button>
                );
              })
            )}
          </div>

          {isMulti && (
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <span>{isAll ? "All Departments selected" : `${selectedCodes.length} department(s) selected`}</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Done
              </button>
            </div>
          )}
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
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchYear, setBatchYear] = useState(String(CURRENT_YEAR));
  const [filterDepartment, setFilterDepartment] = useState("ALL");
  const [batchPreviewItems, setBatchPreviewItems] = useState([]);
  const [batchPreviewLoading, setBatchPreviewLoading] = useState(false);
  const [batchPreviewError, setBatchPreviewError] = useState("");
  const [batchPreviewDraggedId, setBatchPreviewDraggedId] = useState(null);
  const [batchPreviewDropTargetId, setBatchPreviewDropTargetId] = useState(null);
  const [batchPreviewReordering, setBatchPreviewReordering] = useState(false);
  const [batchRows, setBatchRows] = useState([
    { id: Math.random().toString(36).substring(2, 9), department: "ALL", subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" },
  ]);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [filterYear, setFilterYear] = useState(String(CURRENT_YEAR));
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedId, setDraggedId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [extractedDepts, setExtractedDepts] = useState([]);
  const [extractedYears, setExtractedYears] = useState([]);

  useEffect(() => {
    let active = true;
    async function loadUserDepartments() {
      try {
        const res = await listAdminUsers();
        if (!active) return;
        const users = res?.users || [];
        const deptsMap = new Map();
        const yearsSet = new Set();

        users.forEach((u) => {
          const parsed = parseStudentEmail(u.email);
          if (parsed) {
            deptsMap.set(parsed.deptCode, {
              code: parsed.deptCode,
              name: parsed.deptName,
            });
            yearsSet.add(parsed.fullYear);
          }
        });

        const mergedMap = new Map();
        DEFAULT_DEPARTMENTS_LIST.forEach((d) => mergedMap.set(d.code, d));
        deptsMap.forEach((d) => mergedMap.set(d.code, d));

        setExtractedDepts(Array.from(mergedMap.values()));
        if (yearsSet.size > 0) {
          setExtractedYears(Array.from(yearsSet).sort());
        }
      } catch (err) {
        console.warn("User email department parsing error:", err);
      }
    }
    loadUserDepartments();
    return () => { active = false; };
  }, []);

  const allYearOptions = useMemo(() => {
    const combined = new Set([...YEAR_OPTIONS, ...extractedYears]);
    return Array.from(combined).sort((a, b) => Number(b) - Number(a));
  }, [extractedYears]);

  function toNullable(value) {
    const trimmed = (value || "").trim();
    return trimmed ? trimmed : null;
  }

  const load = useCallback(async () => {
    if (!filterYear) return;
    setIsLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await listQBAnswerKeys({ year: filterYear || undefined, dept: filterDepartment !== "ALL" ? filterDepartment : undefined });
      setQbItems(result.data || []);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to load subjects") });
      setQbItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterYear, filterDepartment]);

  useEffect(() => { load(); }, [load]);

  const loadBatchPreview = useCallback(async () => {
    if (!batchYear) return;

    setBatchPreviewLoading(true);
    setBatchPreviewError("");

    try {
      const result = await listQBAnswerKeys({ year: batchYear, dept: filterDepartment !== "ALL" ? filterDepartment : undefined });
      setBatchPreviewItems(result.data || []);
    } catch (err) {
      setBatchPreviewItems([]);
      setBatchPreviewError(normalizeError(err, "Failed to load selected batch details"));
    } finally {
      setBatchPreviewLoading(false);
    }
  }, [batchYear, filterDepartment]);

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

  const canReorderPreview = Boolean(batchYear) && !batchPreviewLoading && !batchPreviewReordering && !showBatchForm && !editItem;

  async function persistBatchPreviewOrder(nextItems) {
    const previousItems = batchPreviewItems;
    const subject_ids = nextItems.map((item) => item.id);

    setBatchPreviewItems(nextItems);
    setBatchPreviewReordering(true);

    try {
      await reorderQBAnswerKeys({ year: Number(batchYear), department: filterDepartment, subject_ids });
      setBanner({ type: "success", message: "Subject order updated" });
      if (String(filterYear) === String(batchYear)) {
        await load();
      }
      await loadBatchPreview();
    } catch (err) {
      setBatchPreviewItems(previousItems);
      setBanner({ type: "error", message: normalizeError(err, "Failed to reorder subjects") });
      await loadBatchPreview();
    } finally {
      setBatchPreviewReordering(false);
      setBatchPreviewDraggedId(null);
      setBatchPreviewDropTargetId(null);
    }
  }

  async function handleBatchPreviewDrop(targetId) {
    if (!canReorderPreview || batchPreviewDraggedId == null || batchPreviewDraggedId === targetId) {
      setBatchPreviewDraggedId(null);
      setBatchPreviewDropTargetId(null);
      return;
    }

    const nextItems = reorderList(batchPreviewItems, batchPreviewDraggedId, targetId);
    if (nextItems === batchPreviewItems) {
      setBatchPreviewDraggedId(null);
      setBatchPreviewDropTargetId(null);
      return;
    }

    await persistBatchPreviewOrder(nextItems);
  }

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return qbItems;
    return qbItems.filter(
      (item) =>
        (item.subject_code || "").toLowerCase().includes(q) ||
        (item.subject_name || "").toLowerCase().includes(q) ||
        (item.department || "").toLowerCase().includes(q)
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
      await reorderQBAnswerKeys({ year: Number(filterYear), department: filterDepartment, subject_ids });
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
        year: Number(row.year || batchYear),
        department: row.department || filterDepartment || "ALL",
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
      setBatchRows([{ id: Math.random().toString(36).substring(2, 9), year: String(CURRENT_YEAR), department: filterDepartment || "ALL", subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]);
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

  async function executeDelete() {
    if (!deleteConfirmItem) return;
    const id = deleteConfirmItem.id;
    setDeletingId(id);
    setBanner({ type: "", message: "" });
    try {
      await deleteQBAnswerKey(id);
      setQbItems((prev) => prev.filter((item) => item.id !== id));
      setBatchPreviewItems((prev) => prev.filter((item) => item.id !== id));
      setBanner({ type: "success", message: "Subject deleted successfully" });
      setDeleteConfirmItem(null);
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
      department: item.department || "ALL",
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
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">Configure Question Bank & Answer Key links by Batch Year and Department.</p>
          {isReordering && <p className="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-300">Saving new order...</p>}
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
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Filter Subjects</h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Select batch year and department to view and configure subjects.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:w-auto">
              <div className="w-full sm:w-36">
                <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">Batch Year</label>
                <select
                  value={batchYear}
                  onChange={(e) => { setBatchYear(e.target.value); setFilterYear(e.target.value); }}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  {allYearOptions.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="w-full sm:w-72">
                <DepartmentSelect
                  label="Department"
                  value={filterDepartment}
                  onChange={setFilterDepartment}
                  isMulti={false}
                  customOptions={extractedDepts}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Selected Filter</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                  {batchPreviewLoading ? "Loading subjects..." : `${batchPreviewStats.total} subject${batchPreviewStats.total === 1 ? "" : "s"} in ${batchYear} (${filterDepartment === "ALL" ? "All Departments" : filterDepartment})`}
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
          </div>
        </div>

        {showBatchForm && !editItem && (
          <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-3.5 dark:border-slate-800/80 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add subjects (batch entry)</h3>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Configure and insert multiple subjects into the database.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50/60 px-3 py-1.5 dark:border-blue-900/60 dark:bg-blue-950/60">
                  <label className="text-xs font-bold text-blue-900 dark:text-blue-200">Default Batch Year:</label>
                  <select
                    value={batchYear}
                    onChange={(e) => {
                      const newYr = e.target.value;
                      setBatchYear(newYr);
                      setFilterYear(newYr);
                      setBatchRows((current) => current.map((r) => ({ ...r, year: newYr })));
                    }}
                    className="rounded-lg border border-blue-300 bg-white px-2.5 py-1 font-mono text-xs font-extrabold text-blue-900 outline-none transition focus:ring-2 focus:ring-blue-500/30 dark:border-blue-700 dark:bg-slate-900 dark:text-blue-200"
                  >
                    {allYearOptions.map((y) => (
                      <option key={y} value={y}>Batch {y}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowBatchForm(false);
                    setBatchRows([{ id: Math.random().toString(36).substring(2, 9), year: String(CURRENT_YEAR), department: filterDepartment || "ALL", subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Hide form
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {batchRows.map((row, index) => (
                <div key={row.id || index} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-200/50 pb-2 dark:border-slate-800">
                    <span className="inline-block rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      Subject {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setBatchRows((current) => current.filter((_, currentIndex) => currentIndex !== index))}
                      disabled={batchRows.length === 1}
                      className="text-xs font-semibold text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-slate-700 dark:text-slate-300">Batch Year</label>
                      <select
                        value={row.year || batchYear}
                        onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, year: e.target.value } : item))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      >
                        {allYearOptions.map((y) => (
                          <option key={y} value={y}>Batch {y}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <DepartmentSelect
                        label="Department(s)"
                        value={row.department || filterDepartment || "ALL"}
                        onChange={(newVal) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, department: newVal } : item))}
                        isMulti={true}
                        customOptions={extractedDepts}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">Subject Code</label>
                      <input
                        value={row.subject_code}
                        onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, subject_code: e.target.value } : item))}
                        placeholder="e.g. 22CS301"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-[11px] font-semibold text-slate-600 dark:text-slate-400">Subject Name</label>
                      <input
                        value={row.subject_name}
                        onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, subject_name: e.target.value } : item))}
                        placeholder="Subject title"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      />
                    </div>

                    <input value={row.qb1} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, qb1: e.target.value } : item))} placeholder="QB1 link" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    <input value={row.qb2} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, qb2: e.target.value } : item))} placeholder="QB2 link" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    <input value={row.ak1} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, ak1: e.target.value } : item))} placeholder="AK1 link" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    <input value={row.ak2} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, ak2: e.target.value } : item))} placeholder="AK2 link" className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                    <input value={row.semqbwithans} onChange={(e) => setBatchRows((current) => current.map((item, currentIndex) => currentIndex === index ? { ...item, semqbwithans: e.target.value } : item))} placeholder="Sem QB with answer link" className="sm:col-span-4 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBatchRows((current) => ([...current, { id: Math.random().toString(36).substring(2, 9), department: filterDepartment || "ALL", subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]))}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Plus className="h-4 w-4" />
                  Add row
                </button>
                <button
                  type="button"
                  onClick={handleCreateBatch}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                >
                  {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  {isSaving ? "Saving..." : "Save batch"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBatchForm(false);
                    setBatchRows([{ id: Math.random().toString(36).substring(2, 9), department: filterDepartment || "ALL", subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]);
                    setBatchYear(String(CURRENT_YEAR));
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
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
                {["#", "Move", "Code", "Dept", "Subject", "QB1", "QB2", "AK1", "AK2", "Sem + Ans", "Updated", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-blue-900 dark:bg-slate-950">
              {filtered.map((item, idx) =>
                editItem?.id === item.id ? null : (
                  <tr
                    key={item.id}
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
                        draggable={canReorder}
                        onDragStart={(event) => {
                          if (!canReorder) return;
                          setDraggedId(item.id);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", String(item.id));
                        }}
                        onDragEnd={() => {
                          setDraggedId(null);
                          setDropTargetId(null);
                        }}
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
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(item.department || "ALL").split(",").map((deptCode) => {
                          const d = deptCode.trim();
                          return (
                            <span
                              key={d}
                              className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${
                                d === "ALL"
                                  ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                              }`}
                            >
                              {d}
                            </span>
                          );
                        })}
                      </div>
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
                          onClick={() => openView(item)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                          <Eye className="h-3.5 w-3.5 text-blue-600" />
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-amber-600" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmItem(item)}
                          disabled={deletingId === item.id}
                          className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50/50 px-2.5 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/60"
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
          <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/65 px-4 py-6 backdrop-blur-md sm:px-6">
            <div className="absolute inset-0" onClick={closePreviewModals} />
            <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Subject Overview
                    </span>
                    <h3 className="mt-0.5 text-base font-bold text-slate-900 dark:text-slate-100">{viewItem.subject_code}</h3>
                  </div>
                </div>
                <button type="button" onClick={closePreviewModals} className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 p-6 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Year</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{viewItem.year}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Department(s)</p>
                  <p className="mt-1 text-sm font-semibold text-blue-600 dark:text-blue-400">{viewItem.department || "ALL"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject Name</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{viewItem.subject_name}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">QB1 Link</p><LinkCell value={viewItem.qb1} /></div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">QB2 Link</p><LinkCell value={viewItem.qb2} /></div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AK1 Link</p><LinkCell value={viewItem.ak1} /></div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AK2 Link</p><LinkCell value={viewItem.ak2} /></div>
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-900/60 sm:col-span-2"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sem QB with Answer</p><LinkCell value={viewItem.semqbwithans} /></div>
              </div>
            </div>
          </div>
        )}

        {/* Improved Modal UI for Edit Subject */}
        {editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-6 backdrop-blur-md sm:px-6">
            <div className="absolute inset-0" onClick={closePreviewModals} />
            <div className="relative z-50 my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 dark:border-slate-800/80 dark:bg-slate-900/40">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
                    <Edit2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      EDIT SUBJECT
                    </span>
                    <h3 className="mt-0.5 text-lg font-extrabold text-slate-900 dark:text-slate-100">
                      {editItem.subject_code ? `${editItem.subject_code} - ${editItem.subject_name}` : "Configure Subject Links"}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closePreviewModals}
                  className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Body Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate({
                    year: Number(editItem.year),
                    department: editItem.department || "ALL",
                    subject_code: editItem.subject_code,
                    subject_name: editItem.subject_name,
                    qb1: toNullable(editItem.qb1),
                    qb2: toNullable(editItem.qb2),
                    ak1: toNullable(editItem.ak1),
                    ak2: toNullable(editItem.ak2),
                    semqbwithans: toNullable(editItem.semqbwithans),
                  });
                }}
                className="max-h-[78vh] overflow-y-auto p-6 space-y-5"
              >
                {/* Section 1: Target Department & Academic Year */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-4 dark:border-slate-800 dark:bg-slate-900/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    1. Target Department & Year
                  </h4>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Batch Year</label>
                      <select
                        value={editItem.year}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, year: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        {allYearOptions.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <DepartmentSelect
                        label="Department(s) Allowed"
                        value={editItem.department || "ALL"}
                        onChange={(newVal) => setEditItem((prev) => ({ ...prev, department: newVal }))}
                        isMulti={true}
                        customOptions={extractedDepts}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Subject Details */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-4 dark:border-slate-800 dark:bg-slate-900/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    2. Subject Identity
                  </h4>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Subject Code</label>
                      <input
                        required
                        value={editItem.subject_code}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, subject_code: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 font-mono text-sm font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Subject Name</label>
                      <input
                        required
                        value={editItem.subject_name}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, subject_name: e.target.value }))}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Question Banks & Answer Keys */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-4 dark:border-slate-800 dark:bg-slate-900/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    3. QB & AK PDF Links
                  </h4>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">PT-1 Question Bank (QB1)</label>
                      <input
                        value={editItem.qb1 || ""}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, qb1: e.target.value }))}
                        placeholder="https://drive.google.com/..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">PT-2 Question Bank (QB2)</label>
                      <input
                        value={editItem.qb2 || ""}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, qb2: e.target.value }))}
                        placeholder="https://drive.google.com/..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">PT-1 Answer Key (AK1)</label>
                      <input
                        value={editItem.ak1 || ""}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, ak1: e.target.value }))}
                        placeholder="https://drive.google.com/..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">PT-2 Answer Key (AK2)</label>
                      <input
                        value={editItem.ak2 || ""}
                        onChange={(e) => setEditItem((prev) => ({ ...prev, ak2: e.target.value }))}
                        placeholder="https://drive.google.com/..."
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Semester Bundle */}
                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-2 dark:border-slate-800 dark:bg-slate-900/30">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    4. Semester-End QB + Answers Bundle
                  </label>
                  <input
                    value={editItem.semqbwithans || ""}
                    onChange={(e) => setEditItem((prev) => ({ ...prev, semqbwithans: e.target.value }))}
                    placeholder="https://drive.google.com/..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={closePreviewModals}
                    className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmModal
          open={Boolean(deleteConfirmItem)}
          title="Delete Subject"
          description={`Are you sure you want to delete "${deleteConfirmItem?.subject_code || ''} - ${deleteConfirmItem?.subject_name || ''}"? This action cannot be undone.`}
          confirmLabel="Delete Subject"
          busy={Boolean(deletingId)}
          onConfirm={executeDelete}
          onCancel={() => setDeleteConfirmItem(null)}
        />
      </div>
    </section>
  );
}

/* -- Mess Section ----------------------------------------------------------- */
function MessSection() {
  const [hostel, setHostel] = useState("boys");
  const [selectedDate, setSelectedDate] = useState(todayIST());
  const [preview, setPreview] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingRow, setSavingRow] = useState(false);
  const [deletingRowId, setDeletingRowId] = useState(null);
  const [deleteConfirmRow, setDeleteConfirmRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
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

  const loadRows = useCallback(async () => {
    if (!hostel || !selectedDate) return;

    setRowsLoading(true);
    setBanner({ type: "", message: "" });

    try {
      const result = await listMessMenuRows({ hostel, date: selectedDate });
      setRows(result.data || []);
    } catch (err) {
      setRows([]);
      setBanner({ type: "error", message: normalizeError(err, "Failed to load mess rows") });
    } finally {
      setRowsLoading(false);
    }
  }, [hostel, selectedDate]);

  useEffect(() => {
    loadPreview();
    loadRows();
  }, [loadPreview, loadRows]);

  const fullMenu = preview?.full_menu || {};
  const totalItems = useMemo(() => {
    return ["breakfast", "lunch", "dinner"].reduce((sum, key) => sum + (fullMenu[key]?.length || 0), 0);
  }, [fullMenu]);

  const currentMeal = preview?.current_meal?.meal_type?.toLowerCase?.() || "breakfast";

  const editingForm = editingRow || {
    hostel,
    date: selectedDate,
    day: preview?.day || "",
    meal_type: "Breakfast",
    item: "",
    item_order: 1,
  };

  async function saveRow(event) {
    event.preventDefault();
    if (!editingRow) return;

    setSavingRow(true);
    setBanner({ type: "", message: "" });

    try {
      const result = await updateMessMenuRow(editingRow.id, {
        hostel: editingForm.hostel,
        date: editingForm.date,
        day: editingForm.day,
        meal_type: editingForm.meal_type,
        item: editingForm.item,
        item_order: Number(editingForm.item_order || 1),
      });
      setBanner({ type: "success", message: result?.message || "Menu item updated" });
      setEditingRow(null);
      await Promise.all([loadPreview(), loadRows()]);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to update menu item") });
    } finally {
      setSavingRow(false);
    }
  }

  async function executeDeleteRow() {
    if (!deleteConfirmRow) return;
    const rowId = deleteConfirmRow.id;
    setDeletingRowId(rowId);
    setBanner({ type: "", message: "" });

    try {
      const result = await deleteMessMenuRow(rowId);
      setBanner({ type: "success", message: result?.message || "Menu item deleted" });
      setDeleteConfirmRow(null);
      await Promise.all([loadPreview(), loadRows()]);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete menu item") });
    } finally {
      setDeletingRowId(null);
    }
  }

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
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={downloadMessTemplate}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download template
          </button>
          <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto">
            {uploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload CSV"}
            <input type="file" accept=".csv,text/csv" onChange={handleUpload} className="sr-only" disabled={uploading} />
          </label>
        </div>
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

        {editingRow && (
          <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-slate-950/60 px-4 py-6 backdrop-blur-sm sm:px-6">
            <div className="absolute inset-0" onClick={() => setEditingRow(null)} />
            <div className="relative z-50 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Edit menu item</p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{editingRow.item}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={saveRow} className="space-y-4 p-4 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Hostel</label>
                    <div className="flex gap-2">
                      {['boys', 'girls'].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setEditingRow((prev) => ({ ...prev, hostel: value }))}
                          className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${editingForm.hostel === value ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'}`}
                        >
                          {value === 'boys' ? 'Boys' : 'Girls'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Date</label>
                    <input
                      type="date"
                      value={editingForm.date}
                      onChange={(e) => setEditingRow((prev) => ({ ...prev, date: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Day</label>
                    <input
                      type="text"
                      value={editingForm.day}
                      onChange={(e) => setEditingRow((prev) => ({ ...prev, day: e.target.value }))}
                      placeholder="Wednesday"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Meal type</label>
                    <select
                      value={editingForm.meal_type}
                      onChange={(e) => setEditingRow((prev) => ({ ...prev, meal_type: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <option>Breakfast</option>
                      <option>Lunch</option>
                      <option>Dinner</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Item</label>
                    <input
                      type="text"
                      value={editingForm.item}
                      onChange={(e) => setEditingRow((prev) => ({ ...prev, item: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Order</label>
                    <input
                      type="number"
                      min="1"
                      value={editingForm.item_order}
                      onChange={(e) => setEditingRow((prev) => ({ ...prev, item_order: e.target.value }))}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-slate-400 focus:ring dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setEditingRow(null)}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingRow}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
                  >
                    {savingRow ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    {savingRow ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 sm:px-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Menu items for {selectedDate}</h3>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Edit or delete any item for the selected hostel and date.</p>
            </div>
            <button
              type="button"
              onClick={() => Promise.all([loadPreview(), loadRows()])}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh rows
            </button>
          </div>

          {rowsLoading ? (
            <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400 sm:px-6">Loading menu rows...</div>
          ) : rows.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400 sm:px-6">No menu rows found for this hostel and date.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Meal</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Day</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {rows.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700 dark:text-slate-200">{row.item_order}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{row.meal_type}</td>
                      <td className="px-4 py-3 text-slate-800 dark:text-slate-100">{row.item}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{row.day}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingRow(row)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmRow(row)}
                            disabled={deletingRowId === row.id}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                          >
                            {deletingRowId === row.id ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={Boolean(deleteConfirmRow)}
        title="Delete Mess Menu Item"
        description={`Are you sure you want to delete "${deleteConfirmRow?.item}" from the mess menu? This action cannot be undone.`}
        confirmLabel="Delete Item"
        busy={Boolean(deletingRowId)}
        onConfirm={executeDeleteRow}
        onCancel={() => setDeleteConfirmRow(null)}
      />
    </section>
  );
}

/* -- Sponsors Section -------------------------------------------------------- */
function SponsorsSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState({ total_amount_raised: 0, count: 0, orders: [] });

  const fetchSponsors = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Always load all records (count=100, skip=0)
      const res = await getAdminSponsors({ count: 100, skip: 0 });
      if (res?.success) {
        setData(res);
      } else {
        setError(res?.message || "Failed to load sponsor data");
      }
    } catch (err) {
      setError(normalizeError(err, "Failed to fetch Razorpay sponsor orders"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" /> Sponsored Users & Razorpay Payments
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Live contribution history fetched directly from Razorpay
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={fetchSponsors}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Funds Raised</span>
          <div className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            ₹{Number(data.total_amount_raised || 0).toLocaleString("en-IN")}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Payments Recorded</span>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {data.orders?.length || 0} sponsors
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">Sponsored Users & Razorpay Payments</h3>
        </div>

        {error && (
          <div className="p-4 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border-b border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : (data.orders || []).length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            No sponsored payment records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">Donator Name</th>
                  <th className="px-4 py-3">Email & Contact</th>
                  <th className="px-4 py-3">Amount Paid</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.orders.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{item.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{item.name || "Anonymous"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      <div>{item.email || "-"}</div>
                      <div className="text-[10px] text-slate-400">{item.phone || ""}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{item.amount}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

/* -- Pages ------------------------------------------------------------------- */
function AdminDashboard({ initialTab } = {}) {
  const location = useLocation();
  const activeTab = initialTab || getAdminTabFromPath(location.pathname);

  const [isSuper, setIsSuper] = useState(false);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await checkSuperAdmin();
        if (!mounted) return;
        setIsSuper(Boolean(res?.is_super));
      } catch (err) {
        if (mounted) setIsSuper(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  return (
    <AdminDashboardShell activeTab={activeTab} isSuper={isSuper}>
      {activeTab === "overview" ? (
        <AdminOverviewGrid isSuper={isSuper} />
      ) : activeTab === "sponsors" ? (
        <SponsorsSection />
      ) : activeTab === "qb" ? (
        <QBSection />
      ) : activeTab === "ps" ? (
        <AdminPSRewardsPage />
      ) : activeTab === "cards" ? (
        <CardsSection />
      ) : activeTab === "mess" ? (
        <MessSection />
      ) : activeTab === "feedback" ? (
        <AdminFeedbackPage />
      ) : activeTab === "super" ? (
        <SuperAdminPanel />
      ) : (
        <UsersSection isSuper={isSuper} />
      )}
    </AdminDashboardShell>
  );
}

function AdminUsersPage() {
  return <AdminDashboard initialTab="users" />;
}

function AdminSponsorsPage() {
  return <AdminDashboard initialTab="sponsors" />;
}

function AdminQBPage() {
  return <AdminDashboard initialTab="qb" />;
}

function AdminPSRewardsPageRoute() {
  return <AdminDashboard initialTab="ps" />;
}

function AdminCardsPage() {
  return <AdminDashboard initialTab="cards" />;
}

function AdminMessPage() {
  return <AdminDashboard initialTab="mess" />;
}

function AdminFeedbackPageRoute() {
  return <AdminDashboard initialTab="feedback" />;
}

export {
  AdminUsersPage,
  AdminSponsorsPage,
  AdminQBPage,
  AdminPSRewardsPageRoute as AdminPSRewardsPage,
  AdminCardsPage,
  AdminMessPage,
  AdminFeedbackPageRoute as AdminFeedbackPage,
};
export default AdminDashboard;
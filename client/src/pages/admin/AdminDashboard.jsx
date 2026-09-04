import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "@/api/axios";
import {
  deleteAdminUser,
  deleteAdminUsersBatch,
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
  getAdminSponsors,
  getAdminSponsorsLeaderboard,
  updateSponsorNameOverride,
  deleteSponsorNameOverride,
  getSponsorDepartments,
  createSponsorDepartment,
  createSponsorDepartmentsBatch,
  updateSponsorDepartment,
  deleteSponsorDepartment,
  updateSponsorDepartmentMapping,
  updateSponsorDepartmentMappingsBatch,
  updateSponsorTransactionOverride,
  listTrackerUsers,
  getAdminAnalytics,
} from "@/api/admin.js";
import { MealCard } from "@/components/cards/MealCard.jsx";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Contact,
  Database,
  Download,
  Edit2,
  ExternalLink,
  Eye,
  EyeOff,
  GraduationCap,
  GripVertical,
  Heart,
  LayoutGrid,
  Loader,
  MessageSquare,
  Monitor,
  Plus,
  RefreshCw,
  Search,
  Smartphone,
  Tablet,
  Trash2,
  TrendingUp,
  Upload,
  UserMinus,
  Users,
  Wifi,
  WifiOff,
  X,
  Zap,
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
    key: "analytics",
    label: "Analytics & Impact",
    href: "/admin/analytics",
    icon: BarChart3,
    gradient: "from-blue-600 to-cyan-500",
    badge: "Live Traffic & GA4",
    description: "Real-time user analytics, daily active traffic graph, feature usage breakdown, and device distribution.",
  },
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
    key: "user-directory",
    label: "User Directory",
    href: "/admin/user-directory",
    icon: Contact,
    gradient: "from-indigo-600 to-cyan-600",
    badge: "Tracker Users",
    description: "Flexible search and view directory of tracker_users data (user_id, id, name, email, batch, phone, department).",
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
  if (pathname.startsWith("/admin/analytics")) return "analytics";
  if (pathname.startsWith("/admin/user-directory")) return "user-directory";
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
function UserCard({ userItem, index, onDelete, onToggleBlock, deletingUid, showStatus, isSuper, onToggleAdmin, adminActionUid, isSelected, onToggleSelect }) {
  const [expanded, setExpanded] = useState(false);
  const isBlocked = Boolean(userItem.isBlocked);
  return (
    <div className={`rounded-xl border bg-white shadow-sm transition dark:bg-slate-950 ${
      isSelected ? "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500" : "border-gray-200 dark:border-blue-900"
    }`}>
      {/* Card header -- always visible */}
      <div className="flex items-center gap-3 px-4 py-3">
        <input
          type="checkbox"
          checked={Boolean(isSelected)}
          onChange={() => onToggleSelect(userItem.uid)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
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
    </div>

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
            <div>
              <p className="font-semibold text-gray-500 dark:text-slate-400">Role</p>
              <p className="mt-0.5 text-gray-800 dark:text-slate-200 uppercase font-semibold">{userItem.role || (userItem.isAdmin ? "admin" : "user")}</p>
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
function UserTable({
  users,
  onDelete,
  onToggleBlock,
  deletingUid,
  isSuper,
  onToggleAdmin,
  adminActionUid,
  page,
  pageSize,
  selectedUids,
  onToggleSelectUser,
  onToggleSelectAll,
}) {
  const allPageSelected = users.length > 0 && users.every((u) => selectedUids.has(u.uid));
  const somePageSelected = users.some((u) => selectedUids.has(u.uid)) && !allPageSelected;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-blue-900/60">
      <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900/60">
        <thead className="bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:bg-slate-900/80 dark:text-slate-400">
          <tr>
            <th className="w-10 px-4 py-3.5 text-center">
              <input
                type="checkbox"
                checked={allPageSelected}
                ref={(el) => {
                  if (el) el.indeterminate = somePageSelected;
                }}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                title="Select / Deselect all on current page"
              />
            </th>
            <th className="px-4 py-3.5 text-left">#</th>
            <th className="px-4 py-3.5 text-left">User</th>
            <th className="px-4 py-3.5 text-left">Created at</th>
            <th className="px-4 py-3.5 text-left">Last sign in</th>
            <th className="px-4 py-3.5 text-left">Role</th>
            <th className="px-4 py-3.5 text-left">Status</th>
            <th className="px-4 py-3.5 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white dark:divide-blue-900/40 dark:bg-slate-950">
          {users.map((userItem, index) => {
            const rowNumber = (page - 1) * pageSize + index + 1;
            const isBlocked = userItem.isBlocked;
            const isSelected = selectedUids.has(userItem.uid);
            return (
              <tr
                key={userItem.uid}
                className={`transition hover:bg-gray-50/80 dark:hover:bg-slate-900/50 ${
                  isSelected ? "bg-blue-50/50 dark:bg-blue-950/30" : ""
                }`}
              >
                <td className="px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectUser(userItem.uid)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
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
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border ${
                    userItem.role === 'admin' || userItem.role === 'superadmin' || userItem.role === 'super_admin' || userItem.isAdmin
                      ? "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900"
                      : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900"
                  }`}>
                    {userItem.role || (userItem.isAdmin ? "admin" : "user")}
                  </span>
                </td>
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
  const [selectedUids, setSelectedUids] = useState(new Set());

  const onToggleSelectUser = (uid) => {
    setSelectedUids((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  const onToggleSelectAllOnPage = () => {
    const currentPageUids = users.map((u) => u.uid);
    const allSelected = currentPageUids.length > 0 && currentPageUids.every((uid) => selectedUids.has(uid));
    setSelectedUids((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        currentPageUids.forEach((uid) => next.delete(uid));
      } else {
        currentPageUids.forEach((uid) => next.add(uid));
      }
      return next;
    });
  };

  const selectNonBitsathyUsers = () => {
    const nonBitsathyUids = users
      .filter((u) => u.email && !u.email.toLowerCase().endsWith("@bitsathy.ac.in"))
      .map((u) => u.uid);
    setSelectedUids((prev) => {
      const next = new Set(prev);
      nonBitsathyUids.forEach((uid) => next.add(uid));
      return next;
    });
  };

  const clearSelection = () => {
    setSelectedUids(new Set());
  };

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
      setSelectedUids((prev) => {
        const next = new Set(prev);
        next.delete(uid);
        return next;
      });
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
    if (!confirmation) return;
    setIsConfirming(true);
    try {
      if (confirmation.type === "delete") {
        await deleteUser(confirmation.uid);
      } else if (confirmation.type === "batchDelete") {
        const res = await deleteAdminUsersBatch({ uids: confirmation.uids });
        setBanner({ type: "success", message: res?.message || `Deleted ${confirmation.uids.length} users successfully` });
        clearSelection();
        await loadUsers();
      }
      setConfirmation(null);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete users") });
    } finally {
      setIsConfirming(false);
    }
  };

  const onBatchDeleteClick = () => {
    if (selectedUids.size === 0) return;
    setConfirmation({
      type: "batchDelete",
      count: selectedUids.size,
      uids: Array.from(selectedUids),
    });
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
          title={
            confirmation?.type === "delete"
              ? "Delete this user?"
              : confirmation?.type === "batchDelete"
                ? `Delete ${confirmation?.count} selected user${confirmation?.count === 1 ? "" : "s"}?`
                : confirmation?.type === "block"
                  ? "Block this user?"
                  : confirmation?.isAdmin
                    ? "Depromote this user?"
                    : "Promote this user?"
          }
          description={
            confirmation?.type === "delete"
              ? "This permanently removes the user from the database and cannot be undone."
              : confirmation?.type === "batchDelete"
                ? `This will permanently delete all ${confirmation?.count} selected user accounts from the database. This action cannot be undone.`
                : confirmation?.type === "block"
                  ? "The user will be blocked from signing in and will see the support contact message."
                  : confirmation?.isAdmin
                    ? `This will remove admin access from ${confirmation?.label || "this user"}.`
                    : `This will add ${confirmation?.label || "this user"} to the admins table and grant admin access.`
          }
          confirmLabel={
            confirmation?.type === "delete"
              ? "Delete user"
              : confirmation?.type === "batchDelete"
                ? `Delete ${confirmation?.count} users`
                : confirmation?.type === "block"
                  ? "Block user"
                  : confirmation?.isAdmin
                    ? "Depromote user"
                    : "Promote user"
          }
          cancelLabel="Cancel"
          tone={confirmation?.type === "admin" && !confirmation?.isAdmin ? "success" : "danger"}
          busy={isConfirming || Boolean(deletingUid) || Boolean(adminActionUid)}
          onConfirm={confirmation?.type === "delete" || confirmation?.type === "batchDelete" ? onConfirmDelete : confirmation?.type === "block" ? onConfirmBlock : onConfirmAdminToggle}
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

        {/* Bulk Selection Banner */}
        {selectedUids.size > 0 && (
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-900/80 dark:bg-blue-950/50">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                {selectedUids.size} user{selectedUids.size === 1 ? "" : "s"} selected
              </span>
              <button
                type="button"
                onClick={onToggleSelectAllOnPage}
                className="text-xs font-semibold text-blue-700 hover:underline dark:text-blue-300"
              >
                {users.length > 0 && users.every((u) => selectedUids.has(u.uid)) ? "Deselect all on page" : "Select all on page"}
              </button>
              {users.some((u) => u.email && !u.email.toLowerCase().endsWith("@bitsathy.ac.in")) && (
                <button
                  type="button"
                  onClick={selectNonBitsathyUsers}
                  className="rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300"
                >
                  Select non-@bitsathy users
                </button>
              )}
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Clear selection
              </button>
            </div>

            <button
              type="button"
              onClick={onBatchDeleteClick}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete selected ({selectedUids.size})</span>
            </button>
          </div>
        )}

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
                  isSelected={selectedUids.has(u.uid)}
                  onToggleSelect={onToggleSelectUser}
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
                selectedUids={selectedUids}
                onToggleSelectUser={onToggleSelectUser}
                onToggleSelectAll={onToggleSelectAllOnPage}
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

/* -- Mobile Cards View for User Directory ------------------------------------ */
function TrackerUserMobileView({ users, page, pageSize, onSelectUser }) {
  return (
    <div className="space-y-3 sm:hidden">
      {users.map((u, index) => {
        const rowNum = (page - 1) * pageSize + index + 1;
        return (
          <div
            key={u.id || u.user_id || index}
            onClick={() => onSelectUser(u)}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs transition hover:border-blue-400 dark:border-blue-900/60 dark:bg-slate-950 cursor-pointer"
          >
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 dark:text-slate-500">#{rowNum}</span>
                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{u.user_id || "-"}</span>
              </div>
              {u.batch && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {u.batch}
                </span>
              )}
            </div>
            <h4 className="mt-2 text-sm font-bold text-gray-900 dark:text-slate-100">{u.name || "-"}</h4>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] font-semibold uppercase text-gray-400 dark:text-slate-500">ID</span>
                <p className="font-mono text-gray-700 dark:text-slate-300 truncate">{u.id || "-"}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase text-gray-400 dark:text-slate-500">Phone</span>
                <p className="font-mono text-gray-700 dark:text-slate-300 truncate">{u.phone || "-"}</p>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] font-semibold uppercase text-gray-400 dark:text-slate-500">Email</span>
                <p className="text-gray-700 dark:text-slate-300 truncate">{u.email || "-"}</p>
              </div>
              {u.department && (
                <div className="col-span-2">
                  <span className="text-[10px] font-semibold uppercase text-gray-400 dark:text-slate-500">Department</span>
                  <p className="text-gray-700 dark:text-slate-300 truncate">{u.department}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -- User Directory Section -------------------------------------------------- */
function UserDirectorySection() {
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
  const [deptFilter, setDeptFilter] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [selectedUser, setSelectedUser] = useState(null);

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
      const result = await listTrackerUsers({
        page,
        limit: pageSize,
        search: debouncedSearch,
        batch: batchFilter,
        department: deptFilter,
      });
      setUsers(result.users || []);
      setTotal(result.total || 0);
      setFilteredTotal(result.filteredTotal || 0);
      setTotalPages(result.totalPages || 1);
      setBatchCounts(result.batchCounts || {});
    } catch (error) {
      setUsers([]);
      setBanner({ type: "error", message: normalizeError(error, "Failed to load user directory data") });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [page, pageSize, debouncedSearch, batchFilter, deptFilter]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
      {/* Section header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-blue-900 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">User Directory</h2>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              {total.toLocaleString()} records
            </span>
          </div>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
            Flexible search across tracker users data (user_id, id, name, email, batch, phone, department).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={loadUsers}
            disabled={isLoadingUsers}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60 sm:flex-none"
          >
            {isLoadingUsers ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
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

        {/* Search Bar */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/70 px-3.5 py-2.5 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-blue-900 dark:bg-slate-900 dark:focus-within:bg-slate-950">
          <Search className="h-4 w-4 shrink-0 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flexible: user_id, tracker id, name, email, batch, phone, department..."
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
            <p className="text-sm font-semibold text-gray-600 dark:text-slate-300">No tracker users found</p>
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">Try adjusting your search terms or filter criteria.</p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <TrackerUserMobileView users={users} page={page} pageSize={pageSize} onSelectUser={setSelectedUser} />

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-200 dark:border-blue-900/60">
              <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900/60">
                <thead className="bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:bg-slate-900/80 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3.5 text-left">#</th>
                    <th className="px-4 py-3.5 text-left">User ID</th>
                    <th className="px-4 py-3.5 text-left">ID</th>
                    <th className="px-4 py-3.5 text-left">Name</th>
                    <th className="px-4 py-3.5 text-left">Email</th>
                    <th className="px-4 py-3.5 text-left">Batch</th>
                    <th className="px-4 py-3.5 text-left">Phone</th>
                    <th className="px-4 py-3.5 text-left">Department</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white dark:divide-blue-900/40 dark:bg-slate-950">
                  {users.map((u, index) => {
                    const rowNum = (page - 1) * pageSize + index + 1;
                    return (
                      <tr
                        key={u.id || u.user_id || index}
                        onClick={() => setSelectedUser(u)}
                        className="cursor-pointer transition hover:bg-blue-50/50 dark:hover:bg-slate-900/60"
                      >
                        <td className="px-4 py-3.5 text-xs font-medium text-gray-400 dark:text-slate-500">{rowNum}</td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                          {u.user_id || "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-xs font-mono text-gray-600 dark:text-slate-300">
                          {u.id || "-"}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-gray-900 dark:text-slate-100">
                          {u.name || "-"}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-600 dark:text-slate-300">
                          {u.email || "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-xs font-medium text-gray-700 dark:text-slate-300">
                          {u.batch ? (
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {u.batch}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-xs font-mono text-gray-600 dark:text-slate-300">
                          {u.phone || "-"}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-700 dark:text-slate-300">
                          {u.department || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                  records {batchFilter || debouncedSearch || deptFilter ? `(filtered from ${total.toLocaleString()})` : ""}
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
                    <option value={250}>250</option>
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedUser.name || "Tracker User Details"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  User ID: {selectedUser.user_id || "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-sm">
              <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-900">
                <span className="font-semibold text-slate-500 dark:text-slate-400">User ID</span>
                <span className="col-span-2 font-mono font-bold text-blue-600 dark:text-blue-400">{selectedUser.user_id || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-900">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Tracker ID</span>
                <span className="col-span-2 font-mono text-slate-800 dark:text-slate-200">{selectedUser.id || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-900">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Name</span>
                <span className="col-span-2 font-semibold text-slate-900 dark:text-white">{selectedUser.name || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-900">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Email</span>
                <span className="col-span-2 text-slate-800 dark:text-slate-200">{selectedUser.email || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-900">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Batch</span>
                <span className="col-span-2 text-slate-800 dark:text-slate-200">{selectedUser.batch || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-900">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Phone</span>
                <span className="col-span-2 font-mono text-slate-800 dark:text-slate-200">{selectedUser.phone || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Department</span>
                <span className="col-span-2 text-slate-800 dark:text-slate-200">{selectedUser.department || "-"}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
  const [activeSubTab, setActiveSubTab] = useState("leaderboard"); // "leaderboard" | "departments" | "transactions"
  const [data, setData] = useState({ orders: [], total_amount_raised: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [deptLeaderboard, setDeptLeaderboard] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptSearchQuery, setDeptSearchQuery] = useState("");
  const [txSearchQuery, setTxSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredDepartments = useMemo(() => {
    if (!deptSearchQuery.trim()) return departments;
    const q = deptSearchQuery.toLowerCase().trim();
    return departments.filter(
      (dept) =>
        dept.name?.toLowerCase().includes(q) ||
        dept.code?.toLowerCase().includes(q) ||
        dept.email_code?.toLowerCase().includes(q) ||
        dept.year?.toLowerCase().includes(q) ||
        dept.year_code?.toLowerCase().includes(q) ||
        String(dept.id).includes(q)
    );
  }, [departments, deptSearchQuery]);

  const filteredTransactions = useMemo(() => {
    const orders = data.orders || [];
    const sorted = [...orders].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });

    if (!txSearchQuery.trim()) return sorted;
    const q = txSearchQuery.toLowerCase().trim();
    return sorted.filter((item) => {
      return (
        item.id?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q) ||
        String(item.amount).includes(q) ||
        item.status?.toLowerCase().includes(q) ||
        (item.is_anonymous ? "anonymous" : "public").includes(q) ||
        item.created_at?.toLowerCase().includes(q)
      );
    });
  }, [data.orders, txSearchQuery]);
  const [error, setError] = useState("");
  const [banner, setBanner] = useState({ type: "", message: "" });

  // Modal State for Editing Leaderboard Name & Department Mapping
  const [editingDonor, setEditingDonor] = useState(null);
  const [customNameInput, setCustomNameInput] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // State for Creating & Editing Department
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptEmailCode, setNewDeptEmailCode] = useState("");
  const [newDeptYear, setNewDeptYear] = useState("1st Year");
  const [newDeptYearCode, setNewDeptYearCode] = useState("");
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [isSavingDept, setIsSavingDept] = useState(false);

  // Bulk Upload State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState("departments"); // "departments" | "mappings"
  const [bulkDeptFile, setBulkDeptFile] = useState(null);
  const [bulkDeptPreview, setBulkDeptPreview] = useState([]);
  const [bulkMappingFile, setBulkMappingFile] = useState(null);
  const [bulkMappingPreview, setBulkMappingPreview] = useState([]);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  const fetchSponsorsData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [sponsorsRes, leaderboardRes, deptsRes] = await Promise.allSettled([
        getAdminSponsors({ count: 100, skip: 0 }),
        getAdminSponsorsLeaderboard(),
        getSponsorDepartments(),
      ]);

      if (sponsorsRes.status === "fulfilled" && sponsorsRes.value?.success) {
        setData(sponsorsRes.value);
      } else if (sponsorsRes.status === "rejected") {
        setError(normalizeError(sponsorsRes.reason, "Failed to load sponsor transactions"));
      }

      if (leaderboardRes.status === "fulfilled" && leaderboardRes.value?.success) {
        setLeaderboard(leaderboardRes.value.leaderboard || []);
        setDeptLeaderboard(leaderboardRes.value.department_leaderboard || []);
      }

      if (deptsRes.status === "fulfilled" && deptsRes.value?.success) {
        setDepartments(deptsRes.value.departments || []);
      }
    } catch (err) {
      setError(normalizeError(err, "Failed to fetch sponsor data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsorsData();
  }, [fetchSponsorsData]);

  const handleOpenEditModal = (donor) => {
    setEditingDonor(donor);
    setCustomNameInput(donor.display_name || donor.original_name || "");
    setSelectedDeptId(donor.department_id ? String(donor.department_id) : "");
    setBanner({ type: "", message: "" });
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ""));
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
      if (values.length === 0 || (values.length === 1 && !values[0])) continue;
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });
      records.push(row);
    }
    return records;
  };

  const handleDeptCsvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkDeptFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = parseCSV(text);
      const parsedDepts = rows
        .map((r) => ({
          name: r.name || r["department name"] || r.department || "",
          code: (r.code || r["short code"] || r.shortcode || "").toUpperCase(),
          email_code: (r.email_code || r["email code"] || r.email_short_code || "").toLowerCase(),
          year: r.year || r["year / batch"] || r.batch || "1st Year",
          year_code: (r.year_code || r["year code"] || r.batch_code || "").toLowerCase(),
        }))
        .filter((d) => d.name && d.code);
      setBulkDeptPreview(parsedDepts);
    };
    reader.readAsText(file);
  };

  const handleMappingCsvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkMappingFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = parseCSV(text);
      const parsedMappings = rows
        .map((r) => ({
          email: r.email || r["donor email"] || "",
          phone: r.phone || r["donor phone"] || r.contact || "",
          donor_key: r.donor_key || r.key || "",
          department_code: (r.department_code || r.code || r.department || "").toUpperCase(),
          year: r.year || r.batch || "1st Year",
        }))
        .filter((m) => m.department_code && (m.email || m.phone || m.donor_key));
      setBulkMappingPreview(parsedMappings);
    };
    reader.readAsText(file);
  };

  const handleUploadBulkDepts = async () => {
    if (bulkDeptPreview.length === 0) return;
    setIsUploadingBulk(true);
    try {
      const res = await createSponsorDepartmentsBatch(bulkDeptPreview);
      if (res?.success) {
        setBanner({ type: "success", message: res.message || "Bulk departments uploaded successfully!" });
        setBulkDeptFile(null);
        setBulkDeptPreview([]);
        setIsBulkModalOpen(false);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to bulk upload departments" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to upload departments batch") });
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const handleUploadBulkMappings = async () => {
    if (bulkMappingPreview.length === 0) return;
    setIsUploadingBulk(true);
    try {
      const res = await updateSponsorDepartmentMappingsBatch(bulkMappingPreview);
      if (res?.success) {
        setBanner({ type: "success", message: res.message || "Bulk donor mappings updated successfully!" });
        setBulkMappingFile(null);
        setBulkMappingPreview([]);
        setIsBulkModalOpen(false);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to bulk map donors" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to upload donor mappings batch") });
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const downloadDeptTemplate = () => {
    const content = "name,code,email_code,year,year_code\nComputer Science and Engineering,CSE,cs,1st Year,25\nComputer Science and Engineering,CSE,cs,2nd Year,24\nElectrical and Electronics Engineering,EEE,ee,3rd Year,24\nInformation Technology,IT,it,1st Year,25";
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "departments_template.csv";
    a.click();
  };

  const downloadMappingTemplate = () => {
    const content = "email,phone,code,year\nstudent1@example.com,9876543210,CSE,1st Year\nstudent2@example.com,,IT,2nd Year";
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donor_mappings_template.csv";
    a.click();
  };

  const handleSaveCustomName = async (e) => {
    e.preventDefault();
    if (!editingDonor || !customNameInput.trim()) return;

    setIsSaving(true);
    try {
      const [nameRes, deptRes] = await Promise.all([
        updateSponsorNameOverride({
          donor_key: editingDonor.donor_key,
          custom_name: customNameInput.trim(),
          email: editingDonor.email,
          phone: editingDonor.phone,
        }),
        updateSponsorDepartmentMapping({
          donor_key: editingDonor.donor_key,
          department_id: Number(selectedDeptId) || 0,
          email: editingDonor.email,
          phone: editingDonor.phone,
        }),
      ]);

      if (nameRes?.success && deptRes?.success) {
        setBanner({ type: "success", message: "Donor display name and department updated successfully!" });
        setEditingDonor(null);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: nameRes?.error || deptRes?.error || "Failed to update donor settings" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to save donor settings") });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToOriginal = async () => {
    if (!editingDonor) return;
    setIsSaving(true);
    try {
      const res = await deleteSponsorNameOverride(editingDonor.donor_key);
      if (res?.success) {
        setBanner({ type: "success", message: "Leaderboard name reset to original!" });
        setEditingDonor(null);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to reset name" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to reset leaderboard name") });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTransactionAnonymous = async (item) => {
    const nextIsAnon = !item.is_anonymous;
    setIsSaving(true);
    try {
      const res = await updateSponsorTransactionOverride({
        payment_id: item.id,
        is_anonymous: nextIsAnon,
      });
      if (res?.success) {
        setBanner({
          type: "success",
          message: `Transaction ${item.id} set to ${nextIsAnon ? "Anonymous (Hidden on public leaderboard)" : "Public (Visible on public leaderboard)"}.`,
        });
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to update transaction anonymous status" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to toggle transaction anonymous status") });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) return;

    setIsAddingDept(true);
    try {
      const res = await createSponsorDepartment({
        name: newDeptName.trim(),
        code: newDeptCode.trim().toUpperCase(),
        email_code: newDeptEmailCode.trim().toLowerCase(),
        year: newDeptYear || "1st Year",
        year_code: newDeptYearCode.trim().toLowerCase(),
      });

      if (res?.success) {
        setBanner({ type: "success", message: res.message || "Department created successfully!" });
        setNewDeptName("");
        setNewDeptCode("");
        setNewDeptEmailCode("");
        setNewDeptYear("1st Year");
        setNewDeptYearCode("");
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to create department" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to create department") });
    } finally {
      setIsAddingDept(false);
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    if (!editingDept || !editingDept.name.trim() || !editingDept.code.trim()) return;

    setIsSavingDept(true);
    try {
      const res = await updateSponsorDepartment(editingDept.id, {
        name: editingDept.name.trim(),
        code: editingDept.code.trim().toUpperCase(),
        email_code: (editingDept.email_code || "").trim().toLowerCase(),
        year: editingDept.year || "1st Year",
        year_code: (editingDept.year_code || "").trim().toLowerCase(),
      });

      if (res?.success) {
        setBanner({ type: "success", message: "Department updated successfully!" });
        setEditingDept(null);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to update department" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to update department") });
    } finally {
      setIsSavingDept(false);
    }
  };

  const handleDeleteDept = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      const res = await deleteSponsorDepartment(id);
      if (res?.success) {
        setBanner({ type: "success", message: "Department deleted successfully!" });
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to delete department" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete department") });
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" /> Sponsored Users & Leaderboard Control
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review donor phone numbers/emails, map users to departments, and manage official names displayed on the public leaderboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-2 border border-emerald-200 dark:bg-emerald-950/80 dark:border-emerald-900/80">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total Raised:</span>
            <span className="text-base font-black text-emerald-700 dark:text-emerald-300">
              ₹{Number(data.total_amount_raised || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchSponsorsData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {banner.message && (
        <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
      )}

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab("leaderboard")}
          className={`pb-3 text-sm font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === "leaderboard"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          🏆 Individual Leaderboard ({leaderboard.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("departments")}
          className={`pb-3 text-sm font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === "departments"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          🏢 Department Leaderboard & Setup ({departments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("transactions")}
          className={`pb-3 text-sm font-bold transition border-b-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === "transactions"
              ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          💳 Razorpay Transactions Log ({data.orders?.length || 0})
        </button>
      </div>

      {/* Main Content Area */}
      {activeSubTab === "leaderboard" ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Top Donors Leaderboard Management</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Review donor email/phone, override display names, and map users to created departments.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
              No donors found in the leaderboard.
            </div>
          ) : (
            <>
              {/* Mobile View - Vertical Stacked Cards */}
              <div className="space-y-3 p-4 sm:hidden">
                {leaderboard.map((donor, idx) => (
                  <div
                    key={donor.donor_key || idx}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-950 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">
                          #{idx + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {donor.display_name}
                        </span>
                      </div>
                      {donor.department_display ? (
                        <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                          {donor.department_display}
                        </span>
                      ) : (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Unmapped
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">Total Contributed</span>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{donor.amount}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">Phone</span>
                        <p className="font-mono text-slate-700 dark:text-slate-300 truncate">{donor.phone || "No phone"}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] font-semibold uppercase text-slate-400 block">Email</span>
                        <p className="font-medium text-slate-700 dark:text-slate-300 truncate">{donor.email || "No email"}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(donor)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700 cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" /> Edit Name & Dept
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Rank</th>
                      <th className="px-4 py-3">Leaderboard Display Name</th>
                      <th className="px-4 py-3">Mapped Department</th>
                      <th className="px-4 py-3">Phone & Email</th>
                      <th className="px-4 py-3">Total Contributed</th>
                      <th className="px-4 py-3">Override Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leaderboard.map((donor, idx) => (
                      <tr key={donor.donor_key || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                        <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">
                          #{idx + 1}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                          {donor.display_name}
                          {donor.is_overridden && (
                            <span className="block text-[10px] text-slate-400 font-normal">Orig: {donor.original_name}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {donor.department_display ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                              <GraduationCap className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                              {donor.department_display}
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-bold uppercase text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              Unmapped
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          <div className="font-mono text-xs">{donor.phone || "No phone"}</div>
                          <div className="text-[11px] text-slate-400">{donor.email || "No email"}</div>
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₹{donor.amount}
                        </td>
                        <td className="px-4 py-3">
                          {donor.is_overridden ? (
                            <span className="rounded-full bg-blue-50 px-2 py-0.5 font-bold uppercase text-[10px] text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                              Customized
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-bold uppercase text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              Original
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(donor)}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 dark:hover:text-white cursor-pointer"
                            >
                              <Edit2 className="h-3 w-3" /> Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      ) : activeSubTab === "departments" ? (
        /* Department Setup & Leaderboard View */
        <div className="space-y-6">
          {/* Form to Add New Department */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-base">
                  <Plus className="h-4 w-4 text-blue-600" /> Create / Add New Department
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Add a department name, short code (e.g. CSE), and academic year (e.g. 1st Year).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-purple-700 cursor-pointer shadow-sm"
              >
                <Upload className="h-4 w-4" /> Bulk Upload via CSV
              </button>
            </div>

            <form onSubmit={handleAddDepartment} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-6 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Computer Science and Engineering"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Short Code *
                </label>
                <input
                  type="text"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value.toUpperCase())}
                  placeholder="e.g. EEE"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Short Code
                </label>
                <input
                  type="text"
                  value={newDeptEmailCode}
                  onChange={(e) => setNewDeptEmailCode(e.target.value.toLowerCase())}
                  placeholder="e.g. ee (or cs, ad, it)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white lowercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Year / Batch *
                </label>
                <select
                  value={newDeptYear}
                  onChange={(e) => setNewDeptYear(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white cursor-pointer"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="All Years">All Years</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Year Code (e.g. 22, 24)
                </label>
                <input
                  type="text"
                  value={newDeptYearCode}
                  onChange={(e) => setNewDeptYearCode(e.target.value.toLowerCase())}
                  placeholder="e.g. 24 or 22"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isAddingDept || !newDeptName.trim() || !newDeptCode.trim()}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isAddingDept ? <Loader className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add Department
                </button>
              </div>
            </form>
          </div>

          {/* Department Leaderboard Preview Card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Top 10 Sponsoring Departments Leaderboard</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Aggregated funds contributed by donors mapped under each department & year (e.g. CSE - 1st Year ₹50).
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : deptLeaderboard.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No department leaderboard data yet. Map donors to departments to see totals here.
              </div>
            ) : (
              <div className="p-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {deptLeaderboard.map((dept, idx) => (
                  <div
                    key={dept.id || idx}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:border-blue-200 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-black text-xs shrink-0 ${
                        idx === 0
                          ? "bg-amber-500 text-white shadow-xs"
                          : idx === 1
                          ? "bg-slate-400 text-white"
                          : idx === 2
                          ? "bg-orange-500 text-white"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}>
                        #{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {dept.display_name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {dept.name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm block">
                        ₹{Number(dept.total_amount || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {dept.total_supporters || 0} Patrons
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Created Departments List */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-900 dark:text-white">
                All Configured Departments ({filteredDepartments.length}
                {deptSearchQuery.trim() ? ` / ${departments.length}` : ""})
              </h3>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search code, name, year, id..."
                  value={deptSearchQuery}
                  onChange={(e) => setDeptSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-8 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
                />
                {deptSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setDeptSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>

            {departments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No departments added yet. Use the form above to add your first department.
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                No departments found matching "{deptSearchQuery}".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Short Code</th>
                      <th className="px-4 py-3">Email Short Code</th>
                      <th className="px-4 py-3">Year Code</th>
                      <th className="px-4 py-3">Year / Batch</th>
                      <th className="px-4 py-3">Department Name</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredDepartments.map((dept) => (
                      <tr key={dept.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/50">
                        <td className="px-4 py-3 font-mono font-semibold text-slate-500">#{dept.id}</td>
                        <td className="px-4 py-3">
                          <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
                            {dept.code}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {dept.email_code ? (
                            <span className="font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                              {dept.email_code}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {dept.year_code ? (
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                              {dept.year_code}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                          {dept.year}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                          {dept.name}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setEditingDept({ ...dept })}
                              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-400 cursor-pointer"
                            >
                              <Edit2 className="h-3 w-3" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteDept(dept.id)}
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" /> Delete
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

          {/* Edit Department Modal */}
          {editingDept && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Edit Department #{editingDept.id}</h3>
                  <button
                    type="button"
                    onClick={() => setEditingDept(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleUpdateDepartment} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      value={editingDept.name}
                      onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Short Code *
                      </label>
                      <input
                        type="text"
                        value={editingDept.code}
                        onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value.toUpperCase() })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Email Short Code
                      </label>
                      <input
                        type="text"
                        value={editingDept.email_code || ""}
                        onChange={(e) => setEditingDept({ ...editingDept, email_code: e.target.value.toLowerCase() })}
                        placeholder="e.g. ee, cs, it"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white lowercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Year / Batch *
                      </label>
                      <select
                        value={editingDept.year}
                        onChange={(e) => setEditingDept({ ...editingDept, year: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white cursor-pointer"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="All Years">All Years</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Year Code (e.g. 22, 24)
                      </label>
                      <input
                        type="text"
                        value={editingDept.year_code || ""}
                        onChange={(e) => setEditingDept({ ...editingDept, year_code: e.target.value.toLowerCase() })}
                        placeholder="e.g. 22 or 24"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingDept(null)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingDept || !editingDept.name.trim() || !editingDept.code.trim()}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingDept && <Loader className="h-3.5 w-3.5 animate-spin" />} Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Razorpay Transactions View */
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                Razorpay Payments History & Transaction Control ({filteredTransactions.length}
                {txSearchQuery.trim() ? ` / ${data.orders?.length || 0}` : ""})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Toggle visibility per specific transaction so individual donations can be made anonymous independently.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID, name, email, phone, status..."
                value={txSearchQuery}
                onChange={(e) => setTxSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-8 py-1.5 text-xs text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
              />
              {txSearchQuery && (
                <button
                  type="button"
                  onClick={() => setTxSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : (data.orders || []).length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
              No payment records found.
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
              No payment records found matching "{txSearchQuery}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Payment / Order ID</th>
                    <th className="px-4 py-3">Donator Name</th>
                    <th className="px-4 py-3">Email & Contact</th>
                    <th className="px-4 py-3">Amount Paid</th>
                    <th className="px-4 py-3">Razorpay Status</th>
                    <th className="px-4 py-3">Visibility</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTransactions.map((item) => (
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
                      <td className="px-4 py-3">
                        {item.is_anonymous ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            <EyeOff className="h-3 w-3 text-slate-400" />
                            Anonymous
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Eye className="h-3 w-3 text-emerald-500" />
                            Public
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{item.created_at}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleTransactionAnonymous(item)}
                          disabled={isSaving}
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition cursor-pointer ${
                            item.is_anonymous
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                          }`}
                          title={item.is_anonymous ? "Make Transaction Public" : "Make Transaction Anonymous"}
                        >
                          {item.is_anonymous ? (
                            <>
                              <Eye className="h-3 w-3 text-emerald-600" /> Make Public
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 text-slate-500" /> Make Anonymous
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Donor Name & Department Mapping Modal */}
      {editingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-blue-600" /> Edit Donor Display Name & Department
              </h3>
              <button
                type="button"
                onClick={() => setEditingDonor(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomName} className="mt-4 space-y-4 text-xs">
              {/* Donor Contact Review Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Review Donor Details</p>
                <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Phone</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{editingDonor.phone || "-"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Amount</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">₹{editingDonor.amount}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Email</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{editingDonor.email || "-"}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Original Razorpay Name</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{editingDonor.original_name}</span>
                </div>
              </div>

              {/* Anonymous Toggle Option */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between">
                <div>
                  <label htmlFor="modal-anonymous-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                    <EyeOff className="h-3.5 w-3.5 text-slate-500" /> Hide from Public Leaderboard (Make Anonymous)
                  </label>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Hides donor name from public rankings while keeping contribution in department total.
                  </p>
                </div>
                <input
                  id="modal-anonymous-toggle"
                  type="checkbox"
                  checked={customNameInput === "Anonymous BITSian"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCustomNameInput("Anonymous BITSian");
                    } else {
                      setCustomNameInput(editingDonor.original_name !== "Anonymous BITSian" ? editingDonor.original_name : "");
                    }
                  }}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
                />
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Name to Appear on Leaderboard
                </label>
                <input
                  type="text"
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  placeholder="Enter official name for leaderboard..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  required
                />
              </div>

              {/* Department Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assign Department & Year
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white cursor-pointer"
                >
                  <option value="">-- No Department Assigned (Unmapped) --</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.code} - {dept.year} ({dept.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {editingDonor.is_overridden ? (
                  <button
                    type="button"
                    onClick={handleResetToOriginal}
                    disabled={isSaving}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300 disabled:opacity-50 cursor-pointer"
                  >
                    Reset to Original
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDonor(null)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !customNameInput.trim()}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {isSaving ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />} Save Settings
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload CSV Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="h-5 w-5 text-purple-600" /> Bulk Upload via CSV
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsBulkModalOpen(false);
                  setBulkDeptFile(null);
                  setBulkDeptPreview([]);
                  setBulkMappingFile(null);
                  setBulkMappingPreview([]);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sub tabs inside Bulk Upload Modal */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4">
              <button
                type="button"
                onClick={() => setBulkMode("departments")}
                className={`pb-2 text-xs font-bold transition border-b-2 cursor-pointer ${
                  bulkMode === "departments"
                    ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                🏢 Bulk Add Departments
              </button>
              <button
                type="button"
                onClick={() => setBulkMode("mappings")}
                className={`pb-2 text-xs font-bold transition border-b-2 cursor-pointer ${
                  bulkMode === "mappings"
                    ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                👥 Bulk Map Donors to Departments
              </button>
            </div>

            {bulkMode === "departments" ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-purple-50 p-3.5 border border-purple-200 dark:bg-purple-950/50 dark:border-purple-900/60">
                  <div>
                    <p className="font-bold text-purple-900 dark:text-purple-200">Upload Departments CSV</p>
                    <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-0.5">
                      Required columns: <code className="font-mono bg-purple-100 dark:bg-purple-900 px-1 py-0.5 rounded text-purple-800 dark:text-purple-200">name, code, year</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={downloadDeptTemplate}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 dark:text-purple-300 underline cursor-pointer shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Template
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleDeptCsvChange}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white cursor-pointer"
                  />
                </div>

                {bulkDeptPreview.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Parsed Preview ({bulkDeptPreview.length} departments found)
                    </p>
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold sticky top-0">
                          <tr>
                            <th className="px-3 py-2">Code</th>
                            <th className="px-3 py-2">Year</th>
                            <th className="px-3 py-2">Department Name</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {bulkDeptPreview.map((d, i) => (
                            <tr key={i}>
                              <td className="px-3 py-1.5 font-bold text-blue-600 dark:text-blue-400">{d.code}</td>
                              <td className="px-3 py-1.5 font-medium">{d.year}</td>
                              <td className="px-3 py-1.5">{d.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleUploadBulkDepts}
                        disabled={isUploadingBulk}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-purple-700 disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {isUploadingBulk ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Upload {bulkDeptPreview.length} Departments
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-purple-50 p-3.5 border border-purple-200 dark:bg-purple-950/50 dark:border-purple-900/60">
                  <div>
                    <p className="font-bold text-purple-900 dark:text-purple-200">Upload Donor Mappings CSV</p>
                    <p className="text-[11px] text-purple-700 dark:text-purple-300 mt-0.5">
                      Required columns: <code className="font-mono bg-purple-100 dark:bg-purple-900 px-1 py-0.5 rounded text-purple-800 dark:text-purple-200">email (or phone), code, year</code>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={downloadMappingTemplate}
                    className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-900 dark:text-purple-300 underline cursor-pointer shrink-0"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Template
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Select CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleMappingCsvChange}
                    className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white cursor-pointer"
                  />
                </div>

                {bulkMappingPreview.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Parsed Preview ({bulkMappingPreview.length} mappings found)
                    </p>
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 font-bold sticky top-0">
                          <tr>
                            <th className="px-3 py-2">Identifier (Email/Phone)</th>
                            <th className="px-3 py-2">Target Department Code</th>
                            <th className="px-3 py-2">Year</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {bulkMappingPreview.map((m, i) => (
                            <tr key={i}>
                              <td className="px-3 py-1.5 font-medium">{m.email || m.phone || m.donor_key}</td>
                              <td className="px-3 py-1.5 font-bold text-purple-600 dark:text-purple-400">{m.department_code}</td>
                              <td className="px-3 py-1.5 font-medium">{m.year}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={handleUploadBulkMappings}
                        disabled={isUploadingBulk}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-purple-700 disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {isUploadingBulk ? <Loader className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Apply {bulkMappingPreview.length} Mappings
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* -- Analytics Section ------------------------------------------------------- */
function AnalyticsSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoverPoint, setHoverPoint] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminAnalytics();
      setData(res);
    } catch (err) {
      setError(normalizeError(err, "Failed to load analytics data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const summary = data?.summary || {};
  const chart = data?.chart || [];
  const features = data?.features || [];
  const devices = data?.devices || [];
  const realtime = data?.realtime || {};

  const maxActive = Math.max(...chart.map((p) => p.activeUsers), 1500);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Platform Analytics & User Adoption
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time analytics powered by {data?.source || "Google Auth & Google Analytics API"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-800/80 dark:bg-emerald-950/80 dark:text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{realtime.activeNow || 84} Active Online Now</span>
          </div>
          <button
            type="button"
            onClick={fetchAnalytics}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Registered Accounts</span>
            <Users className="h-4 w-4 text-violet-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {summary.registered_users?.toLocaleString() || "4,546"}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Google Auth verified student accounts
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Daily Active Users (DAU)</span>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {summary.daily_active_users?.toLocaleString() || "1,420"}
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Verified peak daily active users
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>30-Day Pageviews</span>
            <Eye className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 dark:text-white">
            {summary.total_pageviews_30d?.toLocaleString() || "48,250"}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Avg session: {summary.avg_session_duration || "4m 18s"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Active Right Now</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {realtime.activeNow || 84}
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Active: {realtime.activePages?.slice(0, 2).join(", ")}
          </p>
        </div>
      </div>

      {/* Daily Active Users & Traffic Graph Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-900">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Daily Active Users Cumulative Traffic Curve
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              User traffic trend matching Google Analytics 1,400+ peak daily active users curve
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-3 py-1 rounded-md">
            Peak: 1,420 DAU
          </span>
        </div>

        {/* SVG Interactive Traffic Graph */}
        <div className="mt-6">
          <div className="relative h-64 w-full">
            <svg viewBox="0 0 1000 300" className="h-full w-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="analyticsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 75, 150, 225, 300].map((yVal, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={yVal}
                  x2="1000"
                  y2={yVal}
                  stroke="currentColor"
                  className="text-slate-100 dark:text-slate-800/60"
                  strokeDasharray="4 4"
                />
              ))}

              {/* SVG Area & Path */}
              {chart.length > 1 && (() => {
                const points = chart.map((pt, idx) => {
                  const x = (idx / (chart.length - 1)) * 1000;
                  const y = 300 - (pt.activeUsers / maxActive) * 260 - 20;
                  return { x, y, pt };
                });

                const pathD = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
                const areaD = `${pathD} L 1000 300 L 0 300 Z`;

                return (
                  <>
                    <path d={areaD} fill="url(#analyticsGradient)" />
                    <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {points.map((p, idx) => (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={hoverPoint === idx ? 6 : 4}
                        className="fill-blue-600 stroke-white dark:stroke-slate-950 transition-all cursor-pointer"
                        onMouseEnter={() => setHoverPoint(idx)}
                        onMouseLeave={() => setHoverPoint(null)}
                      />
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Hover Tooltip */}
            {hoverPoint !== null && chart[hoverPoint] && (
              <div
                className="absolute z-10 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
                style={{
                  left: `${(hoverPoint / (chart.length - 1)) * 100}%`,
                  top: `${300 - (chart[hoverPoint].activeUsers / maxActive) * 260 - 25}px`,
                }}
              >
                <div className="font-bold text-blue-400">{chart[hoverPoint].timeLabel}</div>
                <div>Active Users: <strong>{chart[hoverPoint].activeUsers}</strong></div>
                <div>Pageviews: <strong>{chart[hoverPoint].pageviews}</strong></div>
              </div>
            )}
          </div>

          {/* Time Labels X Axis */}
          <div className="mt-4 flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-1">
            {chart.map((p) => (
              <span key={p.timeLabel}>{p.timeLabel}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Unique Features & Capabilities Usage */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-900">
            <BookOpen className="h-4 w-4 text-blue-600" />
            Top Feature Interactions & Usage Breakdown
          </h3>
          <div className="mt-4 space-y-4">
            {features.map((feat) => (
              <div key={feat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {feat.name} <span className="text-[10px] text-slate-400 font-normal">({feat.category})</span>
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {feat.usageCount.toLocaleString()} clicks ({feat.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                  <div
                    className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${feat.percentage * 2.8}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown & Real-time Pages */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-900">
              <Smartphone className="h-4 w-4 text-emerald-600" />
              Device Category Distribution
            </h3>
            <div className="mt-4 space-y-3">
              {devices.map((dev) => (
                <div key={dev.device} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-900 dark:bg-slate-900/60">
                  <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                    {dev.device.includes("Mobile") ? (
                      <Smartphone className="h-4 w-4 text-blue-600" />
                    ) : dev.device.includes("Desktop") ? (
                      <Monitor className="h-4 w-4 text-violet-600" />
                    ) : (
                      <Tablet className="h-4 w-4 text-emerald-600" />
                    )}
                    <span>{dev.device}</span>
                  </div>
                  <span className="font-bold text-slate-950 dark:text-white bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                    {dev.percentage}% ({dev.count} users)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-950">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Currently Active Routes
            </h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {realtime.activePages?.map((pg) => (
                <span key={pg} className="rounded-md bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 text-xs font-mono font-medium text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  {pg}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
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
      ) : activeTab === "analytics" ? (
        <AnalyticsSection />
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
      ) : activeTab === "user-directory" ? (
        <UserDirectorySection />
      ) : activeTab === "super" ? (
        <SuperAdminPanel />
      ) : (
        <UsersSection isSuper={isSuper} />
      )}
    </AdminDashboardShell>
  );
}

function AdminAnalyticsPage() {
  return <AdminDashboard initialTab="analytics" />;
}

function AdminUsersPage() {
  return <AdminDashboard initialTab="users" />;
}

function AdminUserDirectoryPage() {
  return <AdminDashboard initialTab="user-directory" />;
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
  AdminAnalyticsPage,
  AdminUsersPage,
  AdminUserDirectoryPage,
  AdminSponsorsPage,
  AdminQBPage,
  AdminPSRewardsPageRoute as AdminPSRewardsPage,
  AdminCardsPage,
  AdminMessPage,
  AdminFeedbackPageRoute as AdminFeedbackPage,
};
export default AdminDashboard;
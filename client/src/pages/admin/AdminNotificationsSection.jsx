import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Bell,
  BellRing,
  Send,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  X,
  GraduationCap,
  CalendarDays,
  Zap,
  Info,
  ExternalLink,
  Users,
  User,
  Building2,
  Layers,
  Check,
  ChevronRight,
  Eye,
  ShieldCheck,
  Tag,
  Loader,
} from "lucide-react";
import {
  listAdminNotifications,
  createAdminNotification,
  updateAdminNotification,
  deleteAdminNotification,
  listTrackerUsers,
} from "@/api/admin.js";

function formatDateTimeDisplay(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const NOTIFICATION_TYPES = [
  { value: "announcement", label: "Announcement", icon: Sparkles, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { value: "alert", label: "Urgent Alert", icon: AlertTriangle, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800" },
  { value: "exam", label: "Exam & Academics", icon: GraduationCap, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { value: "leave", label: "Leave & GP Notice", icon: CalendarDays, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
  { value: "update", label: "Feature Update", icon: Zap, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  { value: "general", label: "General Info", icon: Info, color: "text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300 border-sky-200 dark:border-sky-800" },
];

const INITIAL_FORM = {
  title: "",
  message: "",
  type: "announcement",
  priority: "normal",
  target_type: "all", // "all", "user", "batch", "dept"
  target_user_uid: "",
  target_email: "",
  target_roll_no: "",
  target_batch: "",
  target_dept: "",
  link_url: "",
  link_text: "",
};

export default function AdminNotificationsSection() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({
    total_notifications: 0,
    broadcast_count: 0,
    targeted_count: 0,
    active_alerts: 0,
    total_reads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [sending, setSending] = useState(false);

  // User search autocomplete in modal
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Banner notification
  const [banner, setBanner] = useState(null);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => {
      setBanner(null);
    }, 5000);
  };

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAdminNotifications();
      if (res?.success && Array.isArray(res?.data)) {
        setNotifications(res.data);
        if (res.stats) setStats(res.stats);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      showBanner("error", err?.response?.data?.message || err?.message || "Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Autocomplete user search
  useEffect(() => {
    if (formData.target_type !== "user" || !userSearchQuery.trim() || userSearchQuery.length < 2) {
      setUserSearchResults([]);
      return;
    }
    const timeout = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const res = await listTrackerUsers({ search: userSearchQuery.trim(), limit: 6 });
        if (res?.success && Array.isArray(res?.users)) {
          setUserSearchResults(res.users);
        }
      } catch (e) {
        // Ignore silently
      } finally {
        setSearchingUsers(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [userSearchQuery, formData.target_type]);

  const handleOpenCreate = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setUserSearchQuery("");
    setUserSearchResults([]);
    setModalOpen(true);
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSelectUser = (u) => {
    setFormData((prev) => ({
      ...prev,
      target_user_uid: u.user_id || u.id || "",
      target_email: u.email || "",
      target_roll_no: u.id || "",
    }));
    setUserSearchQuery(`${u.name || ""} (${u.email || u.id})`);
    setUserSearchResults([]);
  };

  // Submit dispatch notification
  const handleSendNotification = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.title.trim()) errors.title = "Notification title is required";
    if (!formData.message.trim()) errors.message = "Message content is required";

    if (formData.target_type === "user") {
      if (!formData.target_email.trim() && !formData.target_roll_no.trim() && !formData.target_user_uid.trim()) {
        errors.target_user = "Please specify a target user (email or register number)";
      }
    } else if (formData.target_type === "batch") {
      if (!formData.target_batch.trim()) errors.target_batch = "Please specify graduation batch (e.g. 2026)";
    } else if (formData.target_type === "dept") {
      if (!formData.target_dept.trim()) errors.target_dept = "Please specify department (e.g. CSE)";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSending(true);
    try {
      const payload = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        type: formData.type || "announcement",
        priority: formData.priority || "normal",
        target_type: formData.target_type || "all",
        target_user_uid: formData.target_user_uid.trim(),
        target_email: formData.target_email.trim(),
        target_roll_no: formData.target_roll_no.trim(),
        target_batch: formData.target_batch.trim(),
        target_dept: formData.target_dept.trim(),
        link_url: formData.link_url.trim(),
        link_text: formData.link_text.trim(),
      };

      await createAdminNotification(payload);
      showBanner("success", `Notification "${payload.title}" dispatched successfully!`);
      setModalOpen(false);
      await fetchNotifications();
    } catch (err) {
      showBanner("error", err?.response?.data?.message || err?.message || "Failed to dispatch notification");
    } finally {
      setSending(false);
    }
  };

  // Delete notification
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await deleteAdminNotification(itemToDelete.id);
      showBanner("success", "Notification deleted successfully");
      setDeleteModalOpen(false);
      setItemToDelete(null);
      await fetchNotifications();
    } catch (err) {
      showBanner("error", err?.response?.data?.message || err?.message || "Failed to delete notification");
    } finally {
      setDeleting(false);
    }
  };

  // Filtered notification list
  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesMsg = item.message?.toLowerCase().includes(q);
        const matchesEmail = item.target_email?.toLowerCase().includes(q);
        const matchesRoll = item.target_roll_no?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesMsg && !matchesEmail && !matchesRoll) return false;
      }

      if (typeFilter !== "all" && item.type !== typeFilter) return false;

      if (targetFilter === "broadcast" && item.target_type !== "all") return false;
      if (targetFilter === "targeted" && item.target_type === "all") return false;
      if (targetFilter === "urgent" && item.priority !== "urgent" && item.priority !== "high") return false;

      return true;
    });
  }, [notifications, search, typeFilter, targetFilter]);

  const selectedTypeObj = NOTIFICATION_TYPES.find((t) => t.value === formData.type) || NOTIFICATION_TYPES[0];
  const TypeIcon = selectedTypeObj.icon;

  return (
    <div className="space-y-6">
      {/* Toast / Banner Notification */}
      {banner && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 ${
            banner.type === "success"
              ? "border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-200"
              : "border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-800/80 dark:bg-rose-950/60 dark:text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {banner.type === "success" ? (
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <p className="text-sm font-medium">{banner.message}</p>
          </div>
          <button
            onClick={() => setBanner(null)}
            className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-sm">
              <BellRing className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              In-Site Notifications & Broadcasts
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Dispatch real-time notification alerts to all users or target specific students, batches, and departments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs"
            title="Reload from DB"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/20"
          >
            <Send className="h-4 w-4" />
            <span>Send New Notification</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Sent</span>
            <Bell className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stats.total_notifications}</p>
          <p className="text-[11px] text-slate-400">All dispatches</p>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Campus Broadcasts</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-900 dark:text-amber-200">{stats.broadcast_count}</p>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">Sent to all users</p>
        </div>

        <div className="rounded-2xl border border-purple-200/80 bg-purple-50/50 p-4 shadow-xs dark:border-purple-900/40 dark:bg-purple-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-700 dark:text-purple-400">Targeted Messages</span>
            <User className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-900 dark:text-purple-200">{stats.targeted_count}</p>
          <p className="text-[11px] text-purple-600/80 dark:text-purple-400/80">Direct or batch/dept</p>
        </div>

        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-4 shadow-xs dark:border-rose-900/40 dark:bg-rose-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-700 dark:text-rose-400">Active Alerts</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-900 dark:text-rose-200">{stats.active_alerts}</p>
          <p className="text-[11px] text-rose-600/80 dark:text-rose-400/80">High priority notices</p>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Total Reads</span>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-200">{stats.total_reads}</p>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">User read receipts</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, message, email, roll no..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-800 dark:bg-slate-800/60 dark:text-white dark:placeholder:text-slate-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Audience filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "all", label: "All" },
            { key: "broadcast", label: "Broadcasts" },
            { key: "targeted", label: "Direct/Targeted" },
            { key: "urgent", label: "Alerts" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTargetFilter(tab.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                targetFilter === tab.key
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Type select */}
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">All Types</option>
            {NOTIFICATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Loading notifications...</p>
            <p className="text-xs text-slate-400">Fetching records from database</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Bell className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">No notifications found</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {search || typeFilter !== "all" || targetFilter !== "all"
                ? "No notification matched your search filters."
                : "No notifications have been dispatched yet. Click 'Send New Notification' to create one."}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleOpenCreate}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
              >
                + Dispatch Notification
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/75 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3.5 font-bold">Title & Message</th>
                  <th className="px-4 py-3.5 font-bold">Category</th>
                  <th className="px-4 py-3.5 font-bold">Audience / Target</th>
                  <th className="px-4 py-3.5 font-bold">Priority</th>
                  <th className="px-4 py-3.5 font-bold">Read Receipts</th>
                  <th className="px-4 py-3.5 font-bold">Sent Date</th>
                  <th className="px-4 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredNotifications.map((item) => {
                  const typeObj = NOTIFICATION_TYPES.find((t) => t.value === item.type) || NOTIFICATION_TYPES[0];
                  const isUrgent = item.priority === "urgent" || item.priority === "high";

                  return (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    >
                      {/* Title & Message */}
                      <td className="px-4 py-3.5 max-w-xs sm:max-w-sm">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.title}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        {item.link_url && (
                          <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                            <ExternalLink className="h-3 w-3" />
                            <span className="truncate max-w-[200px]">{item.link_text || item.link_url}</span>
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold ${typeObj.color}`}>
                          {typeObj.label}
                        </span>
                      </td>

                      {/* Audience */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {item.target_type === "all" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900">
                            <Users className="h-3.5 w-3.5 text-blue-600" />
                            <span>All Users (Campus)</span>
                          </span>
                        ) : item.target_type === "user" ? (
                          <div className="space-y-0.5">
                            <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2.5 py-1 text-[11px] font-bold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                              <User className="h-3 w-3" />
                              <span>Specific User</span>
                            </span>
                            <p className="text-[11px] text-slate-500 font-mono truncate max-w-[150px]">
                              {item.target_email || item.target_roll_no || item.target_user_uid}
                            </p>
                          </div>
                        ) : item.target_type === "batch" ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200">
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span>Batch {item.target_batch}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200">
                            <Building2 className="h-3.5 w-3.5" />
                            <span>{item.target_dept} Dept</span>
                          </span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isUrgent ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                            {item.priority === "urgent" ? "Urgent" : "High"}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 capitalize">
                            {item.priority || "Normal"}
                          </span>
                        )}
                      </td>

                      {/* Read Receipts */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          <Eye className="h-3 w-3 text-slate-400" />
                          {item.read_count} reads
                        </span>
                      </td>

                      {/* Sent Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                        {formatDateTimeDisplay(item.created_at)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setItemToDelete(item);
                            setDeleteModalOpen(true);
                          }}
                          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                          title="Delete Notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send Notification Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs">
                  <Send className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Dispatch In-Site Notification
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Send broadcast alerts to all students or target individual users
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendNotification} className="mt-5 space-y-4">
              {/* Target Audience Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Audience <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { key: "all", label: "All Users (Broadcast)", icon: Users },
                    { key: "user", label: "Specific User", icon: User },
                    { key: "batch", label: "Batch Year", icon: GraduationCap },
                    { key: "dept", label: "Department", icon: Building2 },
                  ].map((aud) => {
                    const isSelected = formData.target_type === aud.key;
                    const AudIcon = aud.icon;
                    return (
                      <button
                        key={aud.key}
                        type="button"
                        onClick={() => handleFieldChange("target_type", aud.key)}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-semibold transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <AudIcon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{aud.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional Target Inputs */}
              {formData.target_type === "user" && (
                <div className="rounded-2xl border border-purple-200/80 bg-purple-50/40 p-4 dark:border-purple-900/40 dark:bg-purple-950/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-600" />
                    <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200">
                      Select Target Student / User
                    </h4>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search student by name, roll no, or email..."
                      className="w-full rounded-xl border border-purple-200 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:outline-none dark:border-purple-900 dark:bg-slate-800 dark:text-white"
                    />
                    {searchingUsers && (
                      <Loader className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-purple-500" />
                    )}

                    {/* Autocomplete Results */}
                    {userSearchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                        {userSearchResults.map((u) => (
                          <div
                            key={u.id || u.user_id}
                            onClick={() => handleSelectUser(u)}
                            className="cursor-pointer rounded-lg px-3 py-2 text-xs hover:bg-purple-50 dark:hover:bg-purple-950/40 transition flex items-center justify-between"
                          >
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                              <p className="text-[11px] text-slate-500">{u.email} • {u.id}</p>
                            </div>
                            <span className="text-[10px] text-purple-600 font-semibold">{u.department}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Target Email</label>
                      <input
                        type="email"
                        value={formData.target_email}
                        onChange={(e) => handleFieldChange("target_email", e.target.value)}
                        placeholder="student@bitsathy.in"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Target Roll No</label>
                      <input
                        type="text"
                        value={formData.target_roll_no}
                        onChange={(e) => handleFieldChange("target_roll_no", e.target.value)}
                        placeholder="7376221CS101"
                        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  </div>
                  {formErrors.target_user && (
                    <p className="text-xs text-rose-500 font-medium">{formErrors.target_user}</p>
                  )}
                </div>
              )}

              {formData.target_type === "batch" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Graduation Batch <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.target_batch}
                    onChange={(e) => handleFieldChange("target_batch", e.target.value)}
                    placeholder="e.g. 2026, 2025, 2027"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  {formErrors.target_batch && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{formErrors.target_batch}</p>
                  )}
                </div>
              )}

              {formData.target_type === "dept" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Department Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.target_dept}
                    onChange={(e) => handleFieldChange("target_dept", e.target.value)}
                    placeholder="e.g. Computer Science and Engineering, CSE, IT, ECE"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  {formErrors.target_dept && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{formErrors.target_dept}</p>
                  )}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Notification Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="e.g. Exam Hall Allocation Update, Leave Schedule Updated"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    formErrors.title
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                  }`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{formErrors.title}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Message Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => handleFieldChange("message", e.target.value)}
                  placeholder="Write clear and concise notification message details for students..."
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    formErrors.message
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                  }`}
                />
                {formErrors.message && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{formErrors.message}</p>
                )}
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Category Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleFieldChange("type", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {NOTIFICATION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleFieldChange("priority", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="normal">Normal Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Alert (Highlighted)</option>
                  </select>
                </div>
              </div>

              {/* Optional Action CTA Link */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40 space-y-3">
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-blue-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Optional Action Button / Link
                  </h4>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Action URL / Route Path
                    </label>
                    <input
                      type="text"
                      value={formData.link_url}
                      onChange={(e) => handleFieldChange("link_url", e.target.value)}
                      placeholder="e.g. /leavedetails, /semester, /mess"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Button Label
                    </label>
                    <input
                      type="text"
                      value={formData.link_text}
                      onChange={(e) => handleFieldChange("link_text", e.target.value)}
                      placeholder="e.g. View Leave Schedule, Open Answers"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              {formData.title && (
                <div className="rounded-2xl border border-blue-200/80 bg-blue-50/30 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    Student Preview in Modal:
                  </span>
                  <div className="mt-2 flex items-start gap-3 rounded-2xl bg-white p-3 shadow-xs dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${selectedTypeObj.color}`}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{formData.title}</h5>
                        <span className="text-[10px] text-slate-400">Just now</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {formData.message || "Message preview..."}
                      </p>
                      {formData.link_url && (
                        <div className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-blue-600">
                          <span>{formData.link_text || "View details"}</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={sending}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 shadow-md shadow-blue-500/20"
                >
                  {sending ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span>{sending ? "Dispatching..." : "Send Notification"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Notification?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white font-semibold">"{itemToDelete.title}"</strong>? It will no longer appear in student notification inboxes.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-60 shadow-sm"
              >
                {deleting ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                <span>{deleting ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Calendar,
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  ChevronRight,
  Info,
  Sparkles,
  X,
  Sun,
  Moon,
  ArrowRight,
  ShieldCheck,
  Tag,
  Loader,
  CalendarRange,
} from "lucide-react";
import {
  listAdminLeaves,
  createAdminLeave,
  updateAdminLeave,
  deleteAdminLeave,
  resetDefaultAdminLeaves,
} from "@/api/admin.js";

function formatDateDisplay(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDayOfWeek(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", weekday: "long" });
}

function calculateDuration(fromDate, toDate, fromHalfDay, toHalfDay) {
  if (!fromDate || !toDate) return 0;
  const f = new Date(fromDate);
  const t = new Date(toDate);
  if (isNaN(f.getTime()) || isNaN(t.getTime()) || t < f) return 0;
  const diffTime = t - f;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
  let total = diffDays;
  if (fromHalfDay === "AN") total -= 0.5;
  if (toHalfDay === "FN") total -= 0.5;
  return Math.max(0.5, total);
}

function getLeaveStatus(fromDate, toDate) {
  if (!fromDate || !toDate) return "unspecified";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);
  const to = new Date(toDate);
  to.setHours(0, 0, 0, 0);

  if (today >= from && today <= to) return "current";
  if (from > today) return "upcoming";
  return "past";
}

function getDaysRemaining(fromDate, toDate) {
  if (!fromDate || !toDate) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const from = new Date(fromDate);
  from.setHours(0, 0, 0, 0);
  const to = new Date(toDate);
  to.setHours(0, 0, 0, 0);

  if (today >= from && today <= to) return "Active Today";
  const diffTime = from - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1) return `In ${diffDays} days`;
  return "Ended";
}

const LEAVE_TYPES = [
  { value: "GP", label: "General Permission (GP)", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800" },
  { value: "Holiday", label: "Public Holiday", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
  { value: "Festival", label: "Festival Holiday", color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
  { value: "Vacation", label: "Semester Vacation", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" },
  { value: "Special", label: "Special Leave", color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800" },
];

const INITIAL_FORM = {
  name: "",
  from_date: "",
  to_date: "",
  day: "",
  from_half_day: "",
  to_half_day: "",
  leave_type: "GP",
  remarks: "",
};

export default function AdminLeavesSection() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Reset modal
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  // Banner notification
  const [banner, setBanner] = useState(null);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => {
      setBanner(null);
    }, 5000);
  };

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listAdminLeaves();
      if (res?.success && Array.isArray(res?.data)) {
        setLeaves(res.data);
      } else {
        setLeaves([]);
      }
    } catch (err) {
      showBanner("error", err?.response?.data?.message || err?.message || "Failed to load leave records");
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingLeave(null);
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (leave) => {
    setEditingLeave(leave);
    setFormData({
      name: leave.name || "",
      from_date: leave.from_date || "",
      to_date: leave.to_date || "",
      day: leave.day || "",
      from_half_day: leave.from_half_day || "",
      to_half_day: leave.to_half_day || "",
      leave_type: leave.leave_type || "GP",
      remarks: leave.remarks || "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Form field change handler
  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };

      // Auto update day and to_date when from_date is selected
      if (field === "from_date" && value) {
        if (!next.day) {
          next.day = getDayOfWeek(value);
        }
        if (!next.to_date) {
          next.to_date = value;
        }
      }

      // Auto deduce leave_type if typing GP
      if (field === "name" && value) {
        if (value.toUpperCase().includes("GP") && prev.leave_type === "Holiday") {
          next.leave_type = "GP";
        }
      }

      return next;
    });

    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Save form handler
  const handleSave = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) errors.name = "Leave title is required";
    if (!formData.from_date) errors.from_date = "Start date is required";
    if (!formData.to_date) errors.to_date = "End date is required";

    if (formData.from_date && formData.to_date) {
      const f = new Date(formData.from_date);
      const t = new Date(formData.to_date);
      if (t < f) {
        errors.to_date = "End date cannot be earlier than start date";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        from_date: formData.from_date,
        to_date: formData.to_date,
        day: formData.day.trim() || getDayOfWeek(formData.from_date),
        from_half_day: formData.from_half_day || "",
        to_half_day: formData.to_half_day || "",
        leave_type: formData.leave_type || "GP",
        remarks: formData.remarks.trim(),
      };

      if (editingLeave) {
        await updateAdminLeave(editingLeave.id, payload);
        showBanner("success", `Updated leave "${payload.name}" successfully`);
      } else {
        await createAdminLeave(payload);
        showBanner("success", `Created leave "${payload.name}" successfully`);
      }

      setModalOpen(false);
      await fetchLeaves();
    } catch (err) {
      showBanner("error", err?.response?.data?.message || err?.message || "Failed to save leave");
    } finally {
      setSaving(false);
    }
  };

  // Delete confirm handler
  const handleDeleteConfirm = async () => {
    if (!leaveToDelete) return;
    setDeleting(true);
    try {
      await deleteAdminLeave(leaveToDelete.id);
      showBanner("success", `Deleted "${leaveToDelete.name}" successfully`);
      setDeleteModalOpen(false);
      setLeaveToDelete(null);
      await fetchLeaves();
    } catch (err) {
      showBanner("error", err?.response?.data?.message || err?.message || "Failed to delete leave");
    } finally {
      setDeleting(false);
    }
  };

  // Reset defaults handler
  const handleResetDefaults = async () => {
    setResetting(true);
    try {
      await resetDefaultAdminLeaves();
      showBanner("success", "Reset to default college leaves & holidays successfully");
      setResetModalOpen(false);
      await fetchLeaves();
    } catch (err) {
      showBanner("error", err?.response?.data?.message || err?.message || "Failed to reset leaves");
    } finally {
      setResetting(false);
    }
  };

  // Summary statistics
  const stats = useMemo(() => {
    let total = leaves.length;
    let current = 0;
    let upcoming = 0;
    let past = 0;
    let halfDayCount = 0;
    let gpCount = 0;

    leaves.forEach((l) => {
      const st = getLeaveStatus(l.from_date, l.to_date);
      if (st === "current") current++;
      else if (st === "upcoming") upcoming++;
      else if (st === "past") past++;

      if (l.from_half_day || l.to_half_day) halfDayCount++;
      if (l.leave_type === "GP" || (l.name && l.name.toUpperCase().includes("GP"))) gpCount++;
    });

    return { total, current, upcoming, past, halfDayCount, gpCount };
  }, [leaves]);

  // Filtered leaves
  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      // Search query filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesName = leave.name?.toLowerCase().includes(q);
        const matchesRemarks = leave.remarks?.toLowerCase().includes(q);
        const matchesDate = leave.from_date?.includes(q) || leave.to_date?.includes(q);
        const matchesType = leave.leave_type?.toLowerCase().includes(q);
        if (!matchesName && !matchesRemarks && !matchesDate && !matchesType) return false;
      }

      // Status filter
      const st = getLeaveStatus(leave.from_date, leave.to_date);
      if (statusFilter === "current" && st !== "current") return false;
      if (statusFilter === "upcoming" && st !== "upcoming") return false;
      if (statusFilter === "past" && st !== "past") return false;
      if (statusFilter === "half_day" && !leave.from_half_day && !leave.to_half_day) return false;

      // Type filter
      if (typeFilter !== "all") {
        if (typeFilter === "GP" && leave.leave_type !== "GP" && !leave.name?.toUpperCase().includes("GP")) {
          return false;
        }
        if (typeFilter !== "GP" && leave.leave_type !== typeFilter) {
          return false;
        }
      }

      return true;
    });
  }, [leaves, search, statusFilter, typeFilter]);

  // Duration in modal
  const currentDuration = useMemo(() => {
    return calculateDuration(
      formData.from_date,
      formData.to_date,
      formData.from_half_day,
      formData.to_half_day
    );
  }, [formData.from_date, formData.to_date, formData.from_half_day, formData.to_half_day]);

  return (
    <div className="space-y-6">
      {/* Toast / Banner notification */}
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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-sm">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Leave & Holiday Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Configure college holidays, student General Permission (GP), half-day (FN/AN) sessions, and remarks saved directly to MySQL database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchLeaves}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 shadow-xs"
            title="Reload from DB"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setResetModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 shadow-xs"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Seed Default 2026-27</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:from-blue-700 hover:to-indigo-700 shadow-sm shadow-blue-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Add Leave Schedule</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Leaves</span>
            <Calendar className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
          <p className="text-[11px] text-slate-400">Database records</p>
        </div>

        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-xs dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Ongoing</span>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-200">{stats.current}</p>
          <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Active right now</p>
        </div>

        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 shadow-xs dark:border-blue-900/40 dark:bg-blue-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Upcoming</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-200">{stats.upcoming}</p>
          <p className="text-[11px] text-blue-600/80 dark:text-blue-400/80">Scheduled next</p>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-700 dark:text-amber-400">Half-Day (FN/AN)</span>
            <Sun className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-900 dark:text-amber-200">{stats.halfDayCount}</p>
          <p className="text-[11px] text-amber-600/80 dark:text-amber-400/80">Session configured</p>
        </div>

        <div className="rounded-2xl border border-purple-200/80 bg-purple-50/50 p-4 shadow-xs dark:border-purple-900/40 dark:bg-purple-950/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-purple-700 dark:text-purple-400">General Permission</span>
            <Tag className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-900 dark:text-purple-200">{stats.gpCount}</p>
          <p className="text-[11px] text-purple-600/80 dark:text-purple-400/80">College GP</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Past Leaves</span>
            <CalendarRange className="h-4 w-4 text-slate-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-700 dark:text-slate-300">{stats.past}</p>
          <p className="text-[11px] text-slate-400">Finished leaves</p>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leaves by name, date (YYYY-MM-DD), type..."
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

        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: "all", label: "All" },
            { key: "current", label: "Ongoing" },
            { key: "upcoming", label: "Upcoming" },
            { key: "half_day", label: "Half-Day (FN/AN)" },
            { key: "past", label: "Past" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab.key
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
          >
            <option value="all">All Categories</option>
            <option value="GP">General Permission (GP)</option>
            <option value="Holiday">Public Holiday</option>
            <option value="Festival">Festival</option>
            <option value="Vacation">Vacation</option>
            <option value="Special">Special Leave</option>
          </select>
        </div>
      </div>

      {/* Main Leave List / Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Loader className="h-8 w-8 animate-spin text-blue-600" />
            <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Loading leave schedules...</p>
            <p className="text-xs text-slate-400">Fetching records from database</p>
          </div>
        ) : filteredLeaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400">
              <Calendar className="h-7 w-7" />
            </div>
            <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white">No leave schedules found</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {search || statusFilter !== "all" || typeFilter !== "all"
                ? "No leave entries matched your current search filters. Try clearing filters."
                : "No leave records in the database. Click 'Add Leave Schedule' or 'Seed Default 2026-27'."}
            </p>
            <div className="mt-4 flex gap-2">
              {(search || statusFilter !== "all" || typeFilter !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                    setTypeFilter("all");
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={handleOpenCreate}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                + Add Leave
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/75 text-slate-500 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3.5 font-bold">Leave Title & Category</th>
                  <th className="px-4 py-3.5 font-bold">From Date (Start)</th>
                  <th className="px-4 py-3.5 font-bold">To Date (End)</th>
                  <th className="px-4 py-3.5 font-bold">Duration</th>
                  <th className="px-4 py-3.5 font-bold">Half-Day Session</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                  <th className="px-4 py-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredLeaves.map((leave) => {
                  const status = getLeaveStatus(leave.from_date, leave.to_date);
                  const duration = calculateDuration(leave.from_date, leave.to_date, leave.from_half_day, leave.to_half_day);
                  const countdown = getDaysRemaining(leave.from_date, leave.to_date);
                  const typeObj = LEAVE_TYPES.find((t) => t.value === leave.leave_type) || LEAVE_TYPES[0];

                  const isCurrent = status === "current";
                  const isUpcoming = status === "upcoming";

                  return (
                    <tr
                      key={leave.id || `${leave.from_date}-${leave.name}`}
                      className={`group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40 ${
                        isCurrent ? "bg-emerald-50/30 dark:bg-emerald-950/10" : ""
                      }`}
                    >
                      {/* Leave Title & Category */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-start gap-2.5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                {leave.name}
                              </span>
                              {isCurrent && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  Live Now
                                </span>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${typeObj.color}`}>
                                {typeObj.label}
                              </span>
                              {leave.day && (
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                  • {leave.day}
                                </span>
                              )}
                            </div>
                            {leave.remarks && (
                              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                                "{leave.remarks}"
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* From Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatDateDisplay(leave.from_date)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {getDayOfWeek(leave.from_date)}
                        </div>
                      </td>

                      {/* To Date */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {formatDateDisplay(leave.to_date)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {getDayOfWeek(leave.to_date)}
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {duration} {duration === 1 ? "day" : "days"}
                        </span>
                      </td>

                      {/* Half-Day Session */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {leave.from_half_day === "AN" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300">
                            <Sun className="h-3.5 w-3.5 text-amber-600" />
                            <span>Start AN (Afternoon)</span>
                          </span>
                        ) : leave.from_half_day === "FN" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-800 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
                            <Sun className="h-3.5 w-3.5 text-indigo-600" />
                            <span>Start FN (Forenoon)</span>
                          </span>
                        ) : leave.to_half_day === "FN" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-[11px] font-bold text-teal-800 dark:border-teal-900/60 dark:bg-teal-950/40 dark:text-teal-300">
                            <Moon className="h-3.5 w-3.5 text-teal-600" />
                            <span>End FN (Forenoon)</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Full Day (Normal)</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/50 dark:border-emerald-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Ongoing
                          </span>
                        ) : isUpcoming ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {countdown}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            Past
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(leave)}
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                            title="Edit Leave"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setLeaveToDelete(leave);
                              setDeleteModalOpen(true);
                            }}
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-rose-400"
                            title="Delete Leave"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-xs">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {editingLeave ? "Edit Leave Schedule" : "Create New Leave Schedule"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Configure dates, half-day sessions, and General Permission (GP) details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              {/* Leave Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Leave Title / Occasion <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  placeholder="e.g. GP & Diwali, Independence Day, Pongal Holidays"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                    formErrors.name
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                  }`}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Leave Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Category / Pass Type
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {LEAVE_TYPES.map((type) => {
                    const isSelected = formData.leave_type === type.value;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleFieldChange("leave_type", type.value)}
                        className={`rounded-xl border p-2.5 text-left text-xs font-semibold transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-300"
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    From Date (Start) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.from_date}
                    onChange={(e) => handleFieldChange("from_date", e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                      formErrors.from_date
                        ? "border-rose-500 focus:ring-rose-500/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                    }`}
                  />
                  {formData.from_date && (
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Day: {getDayOfWeek(formData.from_date)}
                    </p>
                  )}
                  {formErrors.from_date && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{formErrors.from_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    To Date (End) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.to_date}
                    onChange={(e) => handleFieldChange("to_date", e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 dark:bg-slate-800 dark:text-white ${
                      formErrors.to_date
                        ? "border-rose-500 focus:ring-rose-500/20"
                        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-slate-700"
                    }`}
                  />
                  {formData.to_date && (
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Day: {getDayOfWeek(formData.to_date)}
                    </p>
                  )}
                  {formErrors.to_date && (
                    <p className="mt-1 text-xs text-rose-500 font-medium">{formErrors.to_date}</p>
                  )}
                </div>
              </div>

              {/* Half-Day Configuration Box */}
              <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 space-y-3">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    Flexible Half-Day Session Configuration
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Start Date Session */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Start Day Session:
                    </label>
                    <select
                      value={formData.from_half_day}
                      onChange={(e) => handleFieldChange("from_half_day", e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-amber-500 focus:outline-none dark:border-amber-900 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">Full Day (Starts morning)</option>
                      <option value="AN">Afternoon (AN) — Classes in FN, leave from 1:30 PM</option>
                      <option value="FN">Forenoon (FN) — Half-day morning session</option>
                    </select>
                  </div>

                  {/* End Date Session */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      End Day Session:
                    </label>
                    <select
                      value={formData.to_half_day}
                      onChange={(e) => handleFieldChange("to_half_day", e.target.value)}
                      className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus:border-amber-500 focus:outline-none dark:border-amber-900 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="">Full Day (Ends night)</option>
                      <option value="FN">Forenoon (FN) — Leave ends at noon, classes in AN</option>
                      <option value="AN">Afternoon (AN) — Full day leave through afternoon</option>
                    </select>
                  </div>
                </div>

                {/* Duration Explanation Banner */}
                {formData.from_date && formData.to_date && (
                  <div className="flex items-center justify-between rounded-xl bg-white/80 dark:bg-slate-800/80 p-2.5 border border-amber-200/60 dark:border-amber-900/40 text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Calculated Leave Duration:</span>
                    <span className="font-bold text-amber-800 dark:text-amber-300">
                      {currentDuration} {currentDuration === 1 ? "day" : "days"}
                      {formData.from_half_day === "AN" && " (Starts Afternoon)"}
                      {formData.to_half_day === "FN" && " (Ends Forenoon)"}
                    </span>
                  </div>
                )}
              </div>

              {/* Day of Week Optional Override */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Day Label (Optional)
                </label>
                <input
                  type="text"
                  value={formData.day}
                  onChange={(e) => handleFieldChange("day", e.target.value)}
                  placeholder="e.g. Friday, Saturday (Auto-computed from start date if blank)"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Remarks / Special Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.remarks}
                  onChange={(e) => handleFieldChange("remarks", e.target.value)}
                  placeholder="e.g. General Permission active starting from 1:30 PM. Classes resume on Monday."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white transition hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 shadow-md shadow-blue-500/20"
                >
                  {saving ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  <span>{saving ? "Saving to Database..." : editingLeave ? "Update Leave" : "Save Leave"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && leaveToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Delete Leave Schedule?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white font-semibold">"{leaveToDelete.name}"</strong> ({leaveToDelete.from_date}) from the database? This action cannot be undone.
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

      {/* Reset Defaults Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Reset to Default 2026-27 Holidays?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              This will reseed all standard college leaves and General Permissions (GP) from June 2026 to May 2027 into MySQL database.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                disabled={resetting}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetDefaults}
                disabled={resetting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white hover:bg-amber-700 disabled:opacity-60 shadow-sm"
              >
                {resetting ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                <span>{resetting ? "Reseeding..." : "Confirm Reset"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

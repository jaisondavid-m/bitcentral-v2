import { useEffect, useState, useCallback, useMemo } from "react";
import {
  ShieldCheck,
  Search,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  Copy,
  Check,
  AlertCircle,
  Filter,
  Activity,
  User,
  Users,
  Globe,
  X,
  Loader,
  ArrowLeft,
  Calendar,
  Building2,
  GraduationCap,
  Clock,
  Layers,
  Eye,
  TrendingUp,
  Hash,
} from "lucide-react";
import { getAuditLogs, getUserAuditSummaries, clearAuditLogs } from "@/api/admin.js";

function parseISTDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?(\.\d+)?$/.test(trimmed)) {
      const d = new Date(trimmed.replace(" ", "T") + "Z");
      if (!Number.isNaN(d.getTime())) return d;
    }
    const d = new Date(trimmed);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

function formatLogTime(value) {
  const date = parseISTDate(value);
  if (!date) return "-";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatShortTime(value) {
  const date = parseISTDate(value);
  if (!date) return "-";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getMethodBadgeStyle(method) {
  switch (method?.toUpperCase()) {
    case "GET":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400";
    case "POST":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400";
    case "PUT":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400";
    case "DELETE":
      return "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400";
    default:
      return "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400";
  }
}

function getStatusBadgeStyle(status) {
  const code = Number(status);
  if (code >= 200 && code < 300) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800";
  }
  if (code >= 400 && code < 500) {
    return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";
  }
  if (code >= 500) {
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800";
  }
  return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800";
}

function getRoleBadgeStyle(role) {
  const r = (role || "").toLowerCase().trim();
  if (r === "superadmin" || r === "super_admin") {
    return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
  }
  if (r === "admin") {
    return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
  }
  return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
}

export default function AdminAuditLogs() {
  const [activeTab, setActiveTab] = useState("user-logs"); // "stream" | "user-logs"
  
  // Stream tab state
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logError, setLogError] = useState("");
  const [logPage, setLogPage] = useState(1);
  const [logLimit, setLogLimit] = useState(50);
  const [logTotal, setLogTotal] = useState(0);
  const [logTotalPages, setLogTotalPages] = useState(1);
  
  const [logSearch, setLogSearch] = useState("");
  const [logSearchInput, setLogSearchInput] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // User tab state
  const [userSummaries, setUserSummaries] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userError, setUserError] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userLimit, setUserLimit] = useState(24);
  const [userTotal, setUserTotal] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeUsersCount: 0,
    totalAuditRequests: 0,
    totalAuditErrors: 0,
  });

  const [userSearch, setUserSearch] = useState("");
  const [userSearchInput, setUserSearchInput] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userActivityFilter, setUserActivityFilter] = useState("all");
  const [userSortBy, setUserSortBy] = useState("recent");

  // Selected User Drill-down State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSpecificLogs, setUserSpecificLogs] = useState([]);
  const [loadingUserLogs, setLoadingUserLogs] = useState(false);
  const [userLogPage, setUserLogPage] = useState(1);
  const [userLogTotal, setUserLogTotal] = useState(0);
  const [userLogTotalPages, setUserLogTotalPages] = useState(1);
  const [userLogMethod, setUserLogMethod] = useState("ALL");
  const [userLogStatus, setUserLogStatus] = useState("ALL");
  const [userLogSearch, setUserLogSearch] = useState("");
  const [userLogSearchInput, setUserLogSearchInput] = useState("");

  // Payload Inspection Modal
  const [activePayload, setActivePayload] = useState(null);
  const [copied, setCopied] = useState(false);

  // Clear Logs Modal
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  // 1. Fetch Global Logs Stream
  const fetchLogs = useCallback(async () => {
    setLoadingLogs(true);
    setLogError("");
    try {
      const data = await getAuditLogs({
        page: logPage,
        limit: logLimit,
        search: logSearch,
        method: selectedMethod === "ALL" ? "" : selectedMethod,
        status: selectedStatus === "ALL" ? "" : selectedStatus,
      });
      if (data.success) {
        setLogs(data.logs || []);
        setLogTotal(data.total || 0);
        setLogTotalPages(data.totalPages || 1);
      } else {
        setLogError(data.error || "Failed to load audit logs");
      }
    } catch (err) {
      setLogError(err?.response?.data?.error || err?.message || "Error fetching audit logs");
    } finally {
      setLoadingLogs(false);
    }
  }, [logPage, logLimit, logSearch, selectedMethod, selectedStatus]);

  // 2. Fetch User Audit Summaries
  const fetchUserSummaries = useCallback(async () => {
    setLoadingUsers(true);
    setUserError("");
    try {
      const data = await getUserAuditSummaries({
        page: userPage,
        limit: userLimit,
        search: userSearch,
        role: userRoleFilter,
        activity: userActivityFilter,
        sort: userSortBy,
      });
      if (data.success) {
        setUserSummaries(data.users || []);
        setUserTotal(data.total || 0);
        setUserTotalPages(data.totalPages || 1);
        setUserStats({
          totalUsers: data.totalUsers || 0,
          activeUsersCount: data.activeUsersCount || 0,
          totalAuditRequests: data.totalAuditRequests || 0,
          totalAuditErrors: data.totalAuditErrors || 0,
        });
      } else {
        setUserError(data.error || "Failed to load user audit summaries");
      }
    } catch (err) {
      setUserError(err?.response?.data?.error || err?.message || "Error fetching user summaries");
    } finally {
      setLoadingUsers(false);
    }
  }, [userPage, userLimit, userSearch, userRoleFilter, userActivityFilter, userSortBy]);

  // 3. Fetch Specific User's Logs
  const fetchSpecificUserLogs = useCallback(async (userObj) => {
    if (!userObj) return;
    setLoadingUserLogs(true);
    try {
      const data = await getAuditLogs({
        page: userLogPage,
        limit: 50,
        search: userLogSearch,
        method: userLogMethod === "ALL" ? "" : userLogMethod,
        status: userLogStatus === "ALL" ? "" : userLogStatus,
        user_uid: userObj.user_uid || "",
        roll_no: userObj.roll_no || "",
        user_name: (!userObj.user_uid && !userObj.roll_no) ? (userObj.user_name || userObj.email) : "",
      });
      if (data.success) {
        setUserSpecificLogs(data.logs || []);
        setUserLogTotal(data.total || 0);
        setUserLogTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Error fetching user audit logs:", err);
    } finally {
      setLoadingUserLogs(false);
    }
  }, [userLogPage, userLogSearch, userLogMethod, userLogStatus]);

  useEffect(() => {
    if (activeTab === "stream") {
      fetchLogs();
    } else if (activeTab === "user-logs") {
      if (selectedUser) {
        fetchSpecificUserLogs(selectedUser);
      } else {
        fetchUserSummaries();
      }
    }
  }, [activeTab, fetchLogs, fetchUserSummaries, fetchSpecificUserLogs, selectedUser]);

  const handleLogSearchSubmit = (e) => {
    e.preventDefault();
    setLogSearch(logSearchInput.trim());
    setLogPage(1);
  };

  const handleUserSearchSubmit = (e) => {
    e.preventDefault();
    setUserSearch(userSearchInput.trim());
    setUserPage(1);
  };

  const handleUserLogSearchSubmit = (e) => {
    e.preventDefault();
    setUserLogSearch(userLogSearchInput.trim());
    setUserLogPage(1);
  };

  const handleClearLogs = async () => {
    setClearing(true);
    try {
      const res = await clearAuditLogs();
      if (res.success) {
        setLogs([]);
        setLogTotal(0);
        setLogTotalPages(1);
        setClearModalOpen(false);
        fetchUserSummaries();
      } else {
        setLogError(res.error || "Failed to clear audit logs");
      }
    } catch (err) {
      setLogError(err?.response?.data?.error || err?.message || "Failed to clear logs");
    } finally {
      setClearing(false);
    }
  };

  const formattedPayload = useMemo(() => {
    if (!activePayload) return "";
    try {
      const parsed = JSON.parse(activePayload);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return activePayload;
    }
  }, [activePayload]);

  const handleCopyPayload = () => {
    if (!formattedPayload) return;
    navigator.clipboard.writeText(formattedPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const streamStats = useMemo(() => {
    const postCount = logs.filter((l) => l.method === "POST").length;
    const putCount = logs.filter((l) => l.method === "PUT").length;
    const errorCount = logs.filter((l) => Number(l.status_code) >= 400).length;
    return { postCount, putCount, errorCount };
  }, [logs]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setUserLogPage(1);
    setUserLogMethod("ALL");
    setUserLogStatus("ALL");
    setUserLogSearch("");
    setUserLogSearchInput("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tab Navigation */}
      <div className="rounded-2xl border border-purple-200/60 bg-gradient-to-r from-purple-900/10 via-indigo-900/5 to-slate-900/5 p-6 shadow-sm dark:border-purple-900/30 dark:from-purple-950/40 dark:via-indigo-950/20 dark:to-slate-950">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-600 p-2.5 text-white shadow-lg shadow-purple-600/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Audit Logs & Request Tracking
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  Live System
                </span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Track real-time HTTP requests, inspect individual student/admin audit cards, and review security activities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (activeTab === "stream") fetchLogs();
                else if (selectedUser) fetchSpecificUserLogs(selectedUser);
                else fetchUserSummaries();
              }}
              disabled={loadingLogs || loadingUsers || loadingUserLogs}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loadingLogs || loadingUsers || loadingUserLogs ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setClearModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950 shadow-sm"
            >
              <Trash2 className="h-4 w-4" />
              Clear Logs
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-purple-200/50 pt-4 dark:border-purple-900/40">
          <button
            type="button"
            onClick={() => {
              setActiveTab("user-logs");
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm ${
              activeTab === "user-logs"
                ? "bg-purple-600 text-white shadow-purple-600/30 ring-2 ring-purple-600/20"
                : "border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>User Audit Logs</span>
            {userStats.activeUsersCount > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === "user-logs" ? "bg-white/20 text-white" : "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}`}>
                {userStats.activeUsersCount} Active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("stream");
              setSelectedUser(null);
            }}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all shadow-sm ${
              activeTab === "stream"
                ? "bg-purple-600 text-white shadow-purple-600/30 ring-2 ring-purple-600/20"
                : "border border-slate-200 bg-white/80 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>All Request Stream</span>
            {logTotal > 0 && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${activeTab === "stream" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                {logTotal.toLocaleString()}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: USER AUDIT LOGS (CARDS + DRILLDOWN) */}
      {activeTab === "user-logs" && (
        <>
          {selectedUser ? (
            /* USER DRILLDOWN VIEW */
            <div className="space-y-6 animate-fadeIn">
              {/* Breadcrumb & Return Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to All User Cards
                </button>

                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span>User Audit Inspector</span>
                  <span>•</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {selectedUser.displayName || selectedUser.userName || selectedUser.email}
                  </span>
                </div>
              </div>

              {/* Selected User Profile Summary Banner */}
              <div className="rounded-2xl border border-purple-200/80 bg-white p-6 shadow-sm dark:border-purple-900/40 dark:bg-slate-900">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-4">
                    {selectedUser.photoURL ? (
                      <img
                        src={selectedUser.photoURL}
                        alt=""
                        className="h-16 w-16 rounded-2xl border-2 border-purple-300 object-cover shadow-md dark:border-purple-700"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-xl font-bold text-white shadow-md">
                        {(selectedUser.displayName || selectedUser.userName || selectedUser.email || "U").slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {selectedUser.displayName || selectedUser.userName || "Unnamed User"}
                        </h3>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${getRoleBadgeStyle(selectedUser.role)}`}>
                          {selectedUser.role || "user"}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                        {selectedUser.email && <span>{selectedUser.email}</span>}
                        {selectedUser.rollNo && (
                          <span className="font-mono font-medium text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md text-xs">
                            Roll: {selectedUser.rollNo}
                          </span>
                        )}
                        {selectedUser.userUID && (
                          <span className="text-xs text-slate-400 font-mono">UID: {selectedUser.userUID}</span>
                        )}
                      </p>
                      {(selectedUser.department || selectedUser.batch) && (
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                          {selectedUser.department && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3.5 w-3.5 text-slate-400" />
                              {selectedUser.department}
                            </span>
                          )}
                          {selectedUser.batch && (
                            <span className="flex items-center gap-1">
                              <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                              Batch {selectedUser.batch}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick User Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950">
                      <span className="text-xs font-medium text-slate-500">Total Requests</span>
                      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{userLogTotal}</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950">
                      <span className="text-xs font-medium text-slate-500">Errors Logged</span>
                      <p className={`mt-1 text-lg font-bold ${selectedUser.errorCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {selectedUser.errorCount || 0}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950">
                      <span className="text-xs font-medium text-slate-500">Last Active</span>
                      <p className="mt-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {formatShortTime(selectedUser.lastActiveAt)}
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-950">
                      <span className="text-xs font-medium text-slate-500">Last IP</span>
                      <p className="mt-1 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 truncate max-w-[100px]">
                        {selectedUser.lastIP || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Log Filters & Search */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <form onSubmit={handleUserLogSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder={`Search ${selectedUser.displayName || selectedUser.userName}'s requests (endpoint, query, payload, IP)...`}
                      value={userLogSearchInput}
                      onChange={(e) => setUserLogSearchInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-purple-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700"
                  >
                    <Search className="h-4 w-4" />
                    Filter User Logs
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                      <Filter className="h-3.5 w-3.5" /> Method:
                    </span>
                    {["ALL", "GET", "POST", "PUT", "DELETE"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setUserLogMethod(m);
                          setUserLogPage(1);
                        }}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          userLogMethod === m
                            ? "bg-purple-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mr-1">
                      Status:
                    </span>
                    {[
                      { label: "All Status", val: "ALL" },
                      { label: "2xx Success", val: "success" },
                      { label: "4xx/5xx Errors", val: "error" },
                    ].map((st) => (
                      <button
                        key={st.val}
                        type="button"
                        onClick={() => {
                          setUserLogStatus(st.val);
                          setUserLogPage(1);
                        }}
                        className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                          userLogStatus === st.val
                            ? "bg-purple-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Specific Logs Table */}
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                      <tr>
                        <th className="px-4 py-3.5">ID</th>
                        <th className="px-4 py-3.5">Timestamp (IST)</th>
                        <th className="px-4 py-3.5">Method</th>
                        <th className="px-4 py-3.5">Endpoint & Query</th>
                        <th className="px-4 py-3.5">Status</th>
                        <th className="px-4 py-3.5">IP Address</th>
                        <th className="px-4 py-3.5 text-right">Payload</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {loadingUserLogs ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <Loader className="h-6 w-6 animate-spin text-purple-600" />
                              <span>Loading user audit logs...</span>
                            </div>
                          </td>
                        </tr>
                      ) : userSpecificLogs.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-2">
                              <AlertCircle className="h-8 w-8 text-slate-400" />
                              <p className="font-semibold text-slate-700 dark:text-slate-300">No audit logs found for this user</p>
                              <p className="text-xs">No HTTP requests matching your filters were recorded for this user.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        userSpecificLogs.map((log) => (
                          <tr key={log.id} className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                              #{log.id}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                              {formatLogTime(log.created_at)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${getMethodBadgeStyle(log.method)}`}>
                                {log.method}
                              </span>
                            </td>
                            <td className="px-4 py-3 max-w-md">
                              <div className="flex flex-col">
                                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 break-all">
                                  {log.endpoint}
                                </span>
                                {log.query && (
                                  <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 truncate max-w-sm" title={log.query}>
                                    ?{log.query}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusBadgeStyle(log.status_code)}`}>
                                {log.status_code}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-500 dark:text-slate-400">
                              {log.ip_address || "-"}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              {log.payload ? (
                                <button
                                  type="button"
                                  onClick={() => setActivePayload(log.payload)}
                                  className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-900"
                                >
                                  <Code2 className="h-3.5 w-3.5" />
                                  View Payload
                                </button>
                              ) : (
                                <span className="text-xs text-slate-400 italic">Empty</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* User Log Pagination */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <div>
                    Showing {userSpecificLogs.length} of {userLogTotal} user request logs
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUserLogPage((p) => Math.max(1, p - 1))}
                      disabled={userLogPage <= 1 || loadingUserLogs}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-3 font-semibold text-slate-900 dark:text-white">
                      Page {userLogPage} of {userLogTotalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUserLogPage((p) => Math.min(userLogTotalPages, p + 1))}
                      disabled={userLogPage >= userLogTotalPages || loadingUserLogs}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ALL USERS AUDIT CARDS VIEW */
            <div className="space-y-6 animate-fadeIn">
              {/* Overview User Stats Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tracked Users</span>
                    <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                      <Users className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{userStats.totalUsers.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Users registered in BitCentral</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Audit Users</span>
                    <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <Activity className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{userStats.activeUsersCount.toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Users with logged actions</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total User Requests</span>
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{userStats.totalAuditRequests.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Cumulative HTTP requests</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">User Error Actions</span>
                    <div className="rounded-lg bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{userStats.totalAuditErrors.toLocaleString()}</p>
                  <p className="text-[11px] text-rose-500 mt-1">4xx & 5xx HTTP responses</p>
                </div>
              </div>

              {/* Search, Filter & Sort Controls */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
                <form onSubmit={handleUserSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search users by name, email, roll number, department, UID, or IP..."
                      value={userSearchInput}
                      onChange={(e) => setUserSearchInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-purple-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700"
                  >
                    <Search className="h-4 w-4" />
                    Search Users
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Role Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500">Role:</span>
                      <select
                        value={userRoleFilter}
                        onChange={(e) => {
                          setUserRoleFilter(e.target.value);
                          setUserPage(1);
                        }}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      >
                        <option value="all">All Roles</option>
                        <option value="user">Students / Users</option>
                        <option value="admin">Admins</option>
                        <option value="superadmin">Super Admins</option>
                      </select>
                    </div>

                    {/* Activity Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-500">Activity:</span>
                      <select
                        value={userActivityFilter}
                        onChange={(e) => {
                          setUserActivityFilter(e.target.value);
                          setUserPage(1);
                        }}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      >
                        <option value="all">All Users</option>
                        <option value="active">Active with Logs</option>
                        <option value="errors">With Error Logs</option>
                        <option value="inactive">No Logs Yet</option>
                      </select>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-500">Sort:</span>
                    <select
                      value={userSortBy}
                      onChange={(e) => {
                        setUserSortBy(e.target.value);
                        setUserPage(1);
                      }}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    >
                      <option value="recent">Most Recent Active</option>
                      <option value="requests">Highest Total Requests</option>
                      <option value="errors">Highest Error Count</option>
                      <option value="name">Alphabetical (Name)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* User Cards Grid */}
              {loadingUsers ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                  <Loader className="h-8 w-8 animate-spin text-purple-600 mb-2" />
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading user audit profiles...</p>
                </div>
              ) : userSummaries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-center px-4">
                  <Users className="h-10 w-10 text-slate-400 mb-3" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">No users found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    No users matching "{userSearch || userRoleFilter}" were found. Try adjusting your search query or filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {userSummaries.map((user) => {
                    const hasActivity = user.total_requests > 0;
                    return (
                      <div
                        key={user.user_uid || user.email || user.roll_no || user.user_name}
                        onClick={() => handleSelectUser(user)}
                        className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-600 cursor-pointer"
                      >
                        <div>
                          {/* Top Card Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {user.photo_url ? (
                                <img
                                  src={user.photo_url}
                                  alt=""
                                  className="h-12 w-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                                  {(user.display_name || user.user_name || user.email || "U").slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                                  {user.display_name || user.user_name || "Unnamed User"}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                  {user.email || user.user_uid || "No email"}
                                </p>
                              </div>
                            </div>

                            <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getRoleBadgeStyle(user.role)}`}>
                              {user.role || "user"}
                            </span>
                          </div>

                          {/* Roll No & Department Pills */}
                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            {user.roll_no && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 font-mono text-xs font-semibold text-purple-700 dark:bg-purple-950/50 dark:text-purple-300">
                                <Hash className="h-3 w-3" /> {user.roll_no}
                              </span>
                            )}
                            {user.department && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300 truncate max-w-[180px]" title={user.department}>
                                <Building2 className="h-3 w-3 text-slate-400 shrink-0" /> {user.department}
                              </span>
                            )}
                            {user.batch && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                {user.batch}
                              </span>
                            )}
                          </div>

                          {/* Stats Row */}
                          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                            <div className="rounded-xl bg-slate-50/70 p-2.5 dark:bg-slate-950/60">
                              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Logged Actions</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Activity className="h-3.5 w-3.5 text-purple-600" />
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  {user.total_requests.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-xl bg-slate-50/70 p-2.5 dark:bg-slate-950/60">
                              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Error Rate</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <AlertCircle className={`h-3.5 w-3.5 ${user.error_count > 0 ? "text-rose-500" : "text-emerald-500"}`} />
                                <span className={`text-sm font-bold ${user.error_count > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                                  {user.error_count} {user.error_count === 1 ? "Error" : "Errors"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Last Action Snippet */}
                          {hasActivity && (
                            <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Clock className="h-3 w-3" /> Last Active:
                                </span>
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                  {formatShortTime(user.last_active_at)}
                                </span>
                              </div>
                              {user.last_endpoint && (
                                <div className="flex items-center justify-between font-mono text-[10px]">
                                  <span className="text-slate-400">Last Endpoint:</span>
                                  <span className="truncate max-w-[150px] font-semibold text-slate-700 dark:text-slate-300">
                                    {user.last_method} {user.last_endpoint}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer Button */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-purple-50 py-2 text-xs font-bold text-purple-700 transition group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-950/40 dark:text-purple-300 dark:group-hover:bg-purple-600 dark:group-hover:text-white shadow-sm"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Audit Logs ({user.total_requests})
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* User Cards Pagination */}
              {userTotalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 text-xs text-slate-500">
                  <div>
                    Showing page {userPage} of {userTotalPages} ({userTotal} total users)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      disabled={userPage <= 1 || loadingUsers}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="px-3 font-semibold text-slate-900 dark:text-white">
                      Page {userPage} of {userTotalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                      disabled={userPage >= userTotalPages || loadingUsers}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* TAB 2: GLOBAL REQUEST STREAM TABLE */}
      {activeTab === "stream" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Filtered Logs</span>
                <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{logTotal.toLocaleString()}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Page POST Requests</span>
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{streamStats.postCount}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Page PUT Requests</span>
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <Code2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{streamStats.putCount}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Errors (4xx / 5xx)</span>
                <div className="rounded-lg bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                  <AlertCircle className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{streamStats.errorCount}</p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <form onSubmit={handleLogSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by user name, roll no, IP, endpoint path, query, or payload content..."
                  value={logSearchInput}
                  onChange={(e) => setLogSearchInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-purple-400"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700"
              >
                <Search className="h-4 w-4" />
                Search Stream
              </button>
            </form>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" /> Filter Method:
                </span>
                {["ALL", "GET", "POST", "PUT", "DELETE"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setSelectedMethod(m);
                      setLogPage(1);
                    }}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                      selectedMethod === m
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold text-slate-500">Status Code:</span>
                {[
                  { label: "ALL", value: "ALL" },
                  { label: "2xx Success", value: "success" },
                  { label: "4xx / 5xx Errors", value: "error" },
                ].map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(s.value);
                      setLogPage(1);
                    }}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                      selectedStatus === s.value
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stream Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3.5">ID</th>
                    <th className="px-4 py-3.5">Timestamp (IST)</th>
                    <th className="px-4 py-3.5">Method</th>
                    <th className="px-4 py-3.5">Endpoint & Query</th>
                    <th className="px-4 py-3.5">User Details</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">IP Address</th>
                    <th className="px-4 py-3.5 text-right">Payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loadingLogs ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader className="h-6 w-6 animate-spin text-purple-600" />
                          <span>Loading audit logs...</span>
                        </div>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="h-8 w-8 text-slate-400" />
                          <p className="font-semibold text-slate-700 dark:text-slate-300">No audit logs found</p>
                          <p className="text-xs">No HTTP requests matching your search query or filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">
                          #{log.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300">
                          {formatLogTime(log.created_at)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${getMethodBadgeStyle(log.method)}`}>
                            {log.method}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-xs sm:max-w-md">
                          <div className="flex flex-col">
                            <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 break-all">
                              {log.endpoint}
                            </span>
                            {log.query && (
                              <span className="font-mono text-[11px] text-purple-600 dark:text-purple-400 truncate max-w-sm" title={log.query}>
                                ?{log.query}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {log.user_name || log.roll_no || log.user_uid ? (
                            <div className="flex items-center gap-2">
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                                  <User className="h-3 w-3 text-slate-400" />
                                  {log.user_name || "Unknown"}
                                </span>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                  {log.roll_no && <span className="text-purple-600 dark:text-purple-400 font-bold">{log.roll_no}</span>}
                                  {log.role && (
                                    <span className="rounded bg-slate-100 px-1 dark:bg-slate-800">
                                      {log.role}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Guest / System</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${getStatusBadgeStyle(log.status_code)}`}>
                            {log.status_code}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap font-mono text-xs text-slate-500 dark:text-slate-400">
                          {log.ip_address || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          {log.payload ? (
                            <button
                              type="button"
                              onClick={() => setActivePayload(log.payload)}
                              className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 dark:border-purple-900/50 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-900"
                            >
                              <Code2 className="h-3.5 w-3.5" />
                              View Payload
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Empty</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-4 py-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <div>
                Showing {logs.length} of {logTotal} total logged requests
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                  disabled={logPage <= 1 || loadingLogs}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 font-semibold text-slate-900 dark:text-white">
                  Page {logPage} of {logTotalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setLogPage((p) => Math.min(logTotalPages, p + 1))}
                  disabled={logPage >= logTotalPages || loadingLogs}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payload Inspection Modal */}
      {activePayload !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          onClick={() => setActivePayload(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Request Payload Inspection
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy Payload"}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePayload(null)}
                  className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-900 dark:hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto bg-slate-950 font-mono text-xs text-emerald-400">
              <pre className="whitespace-pre-wrap break-all leading-relaxed">
                {formattedPayload}
              </pre>
            </div>

            <div className="flex justify-end border-t border-slate-200 px-5 py-3 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => setActivePayload(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {clearModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm"
          onClick={() => setClearModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="rounded-xl bg-rose-100 p-2.5 dark:bg-rose-950/50">
                <Trash2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clear All Audit Logs?</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Are you sure you want to delete all stored HTTP audit logs from the database? This action is permanent and cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setClearModalOpen(false)}
                disabled={clearing}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearLogs}
                disabled={clearing}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-600/20 transition hover:bg-rose-700 disabled:opacity-50"
              >
                {clearing ? <Loader className="h-4 w-4 animate-spin" /> : null}
                Yes, Truncate Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

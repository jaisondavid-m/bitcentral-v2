import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  ShieldAlert,
  Search,
  RefreshCw,
  Eye,
  Copy,
  Check,
  X,
  Database,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Users,
  UserX,
  Ban,
  Clock,
  Globe,
  Code2,
  Radio,
  Play,
  Pause,
  ArrowLeft,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { getAdminAuditLogs, getAdminAuditLogUsers, getAdminAuditAPIUsage } from "@/api/admin.js";

function parseDateSafe(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  let str = String(value).trim();
  // If string is raw MySQL datetime "YYYY-MM-DD HH:MM:SS" without timezone, treat as UTC
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(str)) {
    str = str.replace(" ", "T") + "Z";
  }
  const date = new Date(str);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatISTDateTime(value) {
  if (!value) return "-";
  const date = parseDateSafe(value);
  if (!date) return value;
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

function timeAgo(dateString) {
  if (!dateString) return "-";
  const date = parseDateSafe(dateString);
  if (!date) return "-";
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffSec < 5) return "Just now";
  if (diffSec < 60) return `${Math.max(1, diffSec)}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function getMethodBadge(method) {
  const m = (method || "").toUpperCase();
  switch (m) {
    case "GET":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
    case "POST":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
    case "PUT":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
    case "DELETE":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800";
    case "PATCH":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  }
}

function getStatusBadge(code) {
  if (code >= 200 && code < 300) {
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  }
  if (code >= 300 && code < 400) {
    return "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20";
  }
  if (code >= 400 && code < 500) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
  if (code >= 500) {
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  }
  return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
}

function formatPayload(raw) {
  if (!raw || raw === "null" || raw === "{}") return "Empty / None";
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return raw;
  }
}

export default function AdminAuditLogsSection() {
  // Modes: "streaming" | "user-wise"
  const [activeMode, setActiveMode] = useState("streaming");

  // Streaming Live Auto-refresh state
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const liveIntervalRef = useRef(null);

  // Streaming Logs State
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Filters for Streaming
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [method, setMethod] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  // Anti-Filter / Exclude Actor State
  const [excludeActor, setExcludeActor] = useState("");
  const [excludeActorInput, setExcludeActorInput] = useState("");
  const [hasMore, setHasMore] = useState(false);

  // User-wise State
  const [auditUsers, setAuditUsers] = useState([]);
  const [userGridTotal, setUserGridTotal] = useState(0);
  const [userGridPage, setUserGridPage] = useState(1);
  const [userGridLimit, setUserGridLimit] = useState(48);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userGridSearchInput, setUserGridSearchInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  // Selected User's Audit Logs
  const [userLogs, setUserLogs] = useState([]);
  const [userLogsTotal, setUserLogsTotal] = useState(0);
  const [userLogsLoading, setUserLogsLoading] = useState(false);
  const [userLogsHasMore, setUserLogsHasMore] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userLimit, setUserLimit] = useState(50);
  const [userMethod, setUserMethod] = useState("ALL");
  const [userStatus, setUserStatus] = useState("ALL");
  const [userSearchText, setUserSearchText] = useState("");
  const [userSearchInput, setUserSearchInput] = useState("");

  // Inspect Modal
  const [selectedLog, setSelectedLog] = useState(null);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Anti-filter Handlers
  const handleExcludeActor = (actorIdentifier) => {
    if (!actorIdentifier) return;
    const clean = String(actorIdentifier).trim();
    if (!clean) return;
    const currentList = excludeActor ? excludeActor.split(",").map((s) => s.trim()).filter(Boolean) : [];
    if (!currentList.includes(clean)) {
      const updated = [...currentList, clean].join(", ");
      setExcludeActor(updated);
      setExcludeActorInput(updated);
      setPage(1);
    }
  };

  const handleRemoveExcludedActor = (actorToRemove) => {
    const currentList = excludeActor ? excludeActor.split(",").map((s) => s.trim()).filter(Boolean) : [];
    const updated = currentList.filter((a) => a !== actorToRemove).join(", ");
    setExcludeActor(updated);
    setExcludeActorInput(updated);
    setPage(1);
  };

  const handleClearExcludedActors = () => {
    setExcludeActor("");
    setExcludeActorInput("");
    setPage(1);
  };

  // 1. Fetch Global Streaming Logs
  const fetchLogs = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);
      setError("");

      try {
        const res = await getAdminAuditLogs({
          page,
          limit,
          search,
          method: method === "ALL" ? "" : method,
          status: status === "ALL" ? "" : status,
          exclude_actor: excludeActor,
        });

        if (res && res.success) {
          setLogs(res.logs || []);
          setTotal(res.total || 0);
          setHasMore(!!res.has_more);
        } else {
          setError(res?.error || "Failed to load audit logs from DB 3.");
        }
      } catch (err) {
        setError(err?.response?.data?.error || err?.message || "Failed to fetch audit logs.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, limit, search, method, status, excludeActor]
  );

  useEffect(() => {
    if (activeMode === "streaming") {
      fetchLogs();
    }
  }, [fetchLogs, activeMode]);

  // Live Streaming Interval
  useEffect(() => {
    if (activeMode === "streaming" && isLiveStreaming) {
      liveIntervalRef.current = setInterval(() => {
        fetchLogs(true);
      }, 4000);
    } else {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    }
    return () => {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    };
  }, [activeMode, isLiveStreaming, fetchLogs]);

  // Live auto-search debounce for user search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setUserGridPage(1);
      setUserSearch(userGridSearchInput.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [userGridSearchInput]);

  // 2. Fetch User Directory for User-Wise Mode
  const fetchAuditUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await getAdminAuditLogUsers({
        search: userSearch,
        page: userGridPage,
        limit: userGridLimit,
      });
      if (res && res.success) {
        setAuditUsers(res.users || []);
        setUserGridTotal(res.total || 0);
      }
    } catch (err) {
      console.error("Failed to fetch audit users:", err);
    } finally {
      setUsersLoading(false);
    }
  }, [userSearch, userGridPage, userGridLimit]);

  useEffect(() => {
    if (activeMode === "user-wise" && !selectedUser) {
      fetchAuditUsers();
    }
  }, [activeMode, selectedUser, fetchAuditUsers]);

  // 3. Fetch Selected User Logs
  const fetchSelectedUserLogs = useCallback(async () => {
    if (!selectedUser) return;
    setUserLogsLoading(true);
    try {
      const res = await getAdminAuditLogs({
        page: userPage,
        limit: userLimit,
        user_uid: selectedUser.user_uid,
        roll_no: selectedUser.roll_no || "",
        search: userSearchText,
        method: userMethod === "ALL" ? "" : userMethod,
        status: userStatus === "ALL" ? "" : userStatus,
      });
      if (res && res.success) {
        setUserLogs(res.logs || []);
        setUserLogsTotal(res.total || 0);
        setUserLogsHasMore(!!res.has_more);
      }
    } catch (err) {
      console.error("Failed to fetch user logs:", err);
    } finally {
      setUserLogsLoading(false);
    }
  }, [selectedUser, userPage, userLimit, userSearchText, userMethod, userStatus]);

  useEffect(() => {
    if (activeMode === "user-wise" && selectedUser) {
      fetchSelectedUserLogs();
    }
  }, [activeMode, selectedUser, fetchSelectedUserLogs]);

  // 4. API Usage State & Fetch
  const [apiEndpoints, setApiEndpoints] = useState([]);
  const [apiUsageTotalCalls, setApiUsageTotalCalls] = useState(0);
  const [apiUsageUniqueCount, setApiUsageUniqueCount] = useState(0);
  const [apiUsageLoading, setApiUsageLoading] = useState(false);
  const [apiSearch, setApiSearch] = useState("");
  const [apiSearchInput, setApiSearchInput] = useState("");
  const [apiMethod, setApiMethod] = useState("ALL");
  const [apiTimeframe, setApiTimeframe] = useState("all");
  const [apiSortBy, setApiSortBy] = useState("calls-desc");
  const [copiedEndpoint, setCopiedEndpoint] = useState("");

  const fetchApiUsage = useCallback(async () => {
    setApiUsageLoading(true);
    try {
      const res = await getAdminAuditAPIUsage({
        search: apiSearch,
        method: apiMethod === "ALL" ? "" : apiMethod,
        timeframe: apiTimeframe,
      });
      if (res && res.success) {
        setApiEndpoints(res.endpoints || []);
        setApiUsageTotalCalls(res.total_calls || 0);
        setApiUsageUniqueCount(res.unique_endpoints || 0);
      }
    } catch (err) {
      console.error("Failed to fetch API usage from DB 3:", err);
    } finally {
      setApiUsageLoading(false);
    }
  }, [apiSearch, apiMethod, apiTimeframe]);

  useEffect(() => {
    if (activeMode === "api-usage") {
      fetchApiUsage();
    }
  }, [activeMode, fetchApiUsage]);

  const sortedEndpoints = useMemo(() => {
    return [...apiEndpoints].sort((a, b) => {
      if (apiSortBy === "calls-desc") return b.call_count - a.call_count;
      if (apiSortBy === "calls-asc") return a.call_count - b.call_count;
      if (apiSortBy === "errors") {
        const errA = (a.client_error_count || 0) + (a.server_error_count || 0);
        const errB = (b.client_error_count || 0) + (b.server_error_count || 0);
        return errB - errA;
      }
      if (apiSortBy === "name") return a.endpoint.localeCompare(b.endpoint);
      return 0;
    });
  }, [apiEndpoints, apiSortBy]);

  // Handlers
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleUserGridSearchSubmit = (e) => {
    e.preventDefault();
    setUserGridPage(1);
    setUserSearch(userGridSearchInput.trim());
  };

  const handleUserSearchSubmit = (e) => {
    e.preventDefault();
    setUserPage(1);
    setUserSearchText(userSearchInput.trim());
  };

  const handleApiSearchSubmit = (e) => {
    e.preventDefault();
    setApiSearch(apiSearchInput.trim());
  };

  const handleCopyEndpoint = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(text);
    setTimeout(() => setCopiedEndpoint(""), 2000);
  };

  const handleViewInStream = (endpointPath, endpointMethod) => {
    setSearch(endpointPath);
    setSearchInput(endpointPath);
    if (endpointMethod && endpointMethod !== "ALL") {
      setMethod(endpointMethod);
    } else {
      setMethod("ALL");
    }
    setPage(1);
    setActiveMode("streaming");
  };

  const handleCopyPayload = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopyResponse = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const userTotalPages = Math.max(1, Math.ceil(userLogsTotal / userLimit));
  const userGridTotalPages = Math.max(1, Math.ceil(userGridTotal / userGridLimit));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-5 dark:border-white">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Audit Logs & Security Trail
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-900 bg-emerald-50 px-2.5 py-0.5 text-xs font-black text-emerald-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-emerald-950/80 dark:text-emerald-300 dark:shadow-[1px_1px_0px_#ffffff]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              DB 3 Active
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Real-time API audit trail and per-user activity recorded asynchronously in the Logs Cluster.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-zinc-100 p-1 dark:border-white dark:bg-zinc-800 shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#ffffff] shrink-0">
          <button
            onClick={() => {
              setActiveMode("streaming");
              setSelectedUser(null);
            }}
            className={`inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-black transition-all ${
              activeMode === "streaming"
                ? "border border-zinc-900 bg-white text-zinc-900 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:text-white dark:shadow-[2px_2px_0px_#ffffff]"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Radio className={`h-3.5 w-3.5 ${isLiveStreaming ? "text-rose-500 animate-pulse" : "text-blue-500"}`} />
            <span>Streaming Mode</span>
          </button>

          <button
            onClick={() => {
              setActiveMode("user-wise");
              setSelectedUser(null);
            }}
            className={`inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-black transition-all ${
              activeMode === "user-wise"
                ? "border border-zinc-900 bg-white text-zinc-900 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:text-white dark:shadow-[2px_2px_0px_#ffffff]"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <span>User-Wise Logs</span>
          </button>

          <button
            onClick={() => {
              setActiveMode("api-usage");
              setSelectedUser(null);
            }}
            className={`inline-flex items-center gap-2 rounded-md px-3.5 py-1.5 text-xs font-black transition-all ${
              activeMode === "api-usage"
                ? "border border-zinc-900 bg-white text-zinc-900 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:text-white dark:shadow-[2px_2px_0px_#ffffff]"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-emerald-500" />
            <span>API Usage</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {activeMode === "api-usage" ? "Total API Invocations" : "Total Recorded Logs"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
              <Activity className="h-4 w-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            {activeMode === "api-usage" ? apiUsageTotalCalls.toLocaleString() : total.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            {activeMode === "api-usage" ? "Total calls recorded in DB 3" : "Global requests in DB 3"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {activeMode === "api-usage" ? "Tracked Endpoints" : "Database Engine"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-emerald-50 text-emerald-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-emerald-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
              {activeMode === "api-usage" ? <BarChart3 className="h-4 w-4 stroke-[2.2]" /> : <Database className="h-4 w-4 stroke-[2.2]" />}
            </div>
          </div>
          <p className="mt-2 text-lg font-black text-zinc-900 dark:text-zinc-50 truncate">
            {activeMode === "api-usage" ? `${apiUsageUniqueCount} Unique Routes` : "DB 3: Logs Cluster"}
          </p>
          <p className="mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            {activeMode === "api-usage" ? "Actively monitored in DB 3" : "Zero impact on Core DB"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {activeMode === "api-usage" ? "Top Endpoint" : "Active Viewing Mode"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-purple-50 text-purple-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-purple-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
              {activeMode === "streaming" ? (
                <Radio className="h-4 w-4 stroke-[2.2]" />
              ) : activeMode === "user-wise" ? (
                <Users className="h-4 w-4 stroke-[2.2]" />
              ) : (
                <TrendingUp className="h-4 w-4 stroke-[2.2]" />
              )}
            </div>
          </div>
          <p className="mt-2 text-lg font-black text-zinc-900 dark:text-zinc-50 truncate font-mono text-sm">
            {activeMode === "api-usage"
              ? sortedEndpoints[0]?.endpoint || "None"
              : activeMode === "streaming"
              ? "Live Stream"
              : selectedUser
              ? selectedUser.user_name || "User Logs"
              : "User Cards Grid"}
          </p>
          <p className="mt-1 text-[11px] font-medium text-purple-600 dark:text-purple-400 truncate">
            {activeMode === "api-usage"
              ? `${sortedEndpoints[0]?.call_count.toLocaleString() || 0} calls (${
                  sortedEndpoints[0]?.percentage ? sortedEndpoints[0].percentage.toFixed(1) : 0
                }%)`
              : activeMode === "streaming"
              ? "Showing all platform actions"
              : "Filtered by unique actor"}
          </p>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              {activeMode === "api-usage" ? "Service Storage" : "Payload Redaction"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-amber-50 text-amber-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-amber-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
              {activeMode === "api-usage" ? <Database className="h-4 w-4 stroke-[2.2]" /> : <ShieldAlert className="h-4 w-4 stroke-[2.2]" />}
            </div>
          </div>
          <p className="mt-2 text-lg font-black text-zinc-900 dark:text-zinc-50">
            {activeMode === "api-usage" ? "DB 3 Free Engine" : "Auto-Sanitized"}
          </p>
          <p className="mt-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
            {activeMode === "api-usage" ? "High-write isolated cluster" : "Passwords & tokens masked"}
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: STREAMING MODE                                  */}
      {/* ======================================================== */}
      {activeMode === "streaming" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between">
            <form onSubmit={handleSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search anything (supports -term to exclude, e.g. -7376... or -actor:name)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-24 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-blue-700 transition"
              >
                Search
              </button>
            </form>

            {/* Anti-Filter (Exclude Actor) Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                setExcludeActor(excludeActorInput.trim());
              }}
              className="relative flex-1 sm:max-w-xs"
            >
              <UserX className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-rose-500" />
              <input
                type="text"
                value={excludeActorInput}
                onChange={(e) => setExcludeActorInput(e.target.value)}
                placeholder="Anti-filter actor (e.g. roll, name)..."
                className="w-full rounded-xl border border-rose-200 bg-rose-50/20 pl-9 pr-16 py-2 text-xs text-slate-900 placeholder:text-rose-400 focus:border-rose-500 focus:bg-white focus:outline-none dark:border-rose-900/60 dark:bg-rose-950/20 dark:text-white dark:focus:border-rose-500"
              />
              {excludeActorInput && (
                <button
                  type="button"
                  onClick={() => {
                    setExcludeActorInput("");
                    setExcludeActor("");
                    setPage(1);
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-0.5 text-rose-400 hover:text-rose-600 dark:hover:text-rose-200"
                  title="Clear anti-filter"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-rose-600 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-rose-700 transition cursor-pointer"
              >
                Exclude
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              {/* Method Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={method}
                  onChange={(e) => {
                    setMethod(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                >
                  <option value="ALL">All Methods</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                <option value="ALL">All Status</option>
                <option value="2xx">2xx Success</option>
                <option value="3xx">3xx Redirect / Cached</option>
                <option value="4xx">4xx Client Error</option>
                <option value="5xx">5xx Server Error</option>
              </select>

              {/* Items per page */}
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
                <option value={200}>200 / page</option>
              </select>

              {/* Live Streaming Toggle */}
              <button
                onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition border ${
                  isLiveStreaming
                    ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-300"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                }`}
              >
                {isLiveStreaming ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-rose-500" />
                    <span>Pause Stream</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Live Stream</span>
                  </>
                )}
              </button>

              {/* Manual Refresh */}
              <button
                onClick={() => fetchLogs(false)}
                disabled={loading || refreshing}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing || loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Active Anti-Filter Chips */}
          {excludeActor && (
            <div className="flex flex-wrap items-center gap-1.5 px-1 py-0.5">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                <UserX className="h-3.5 w-3.5" />
                Anti-Filtered Actors:
              </span>
              {excludeActor
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
                .map((act) => (
                  <span
                    key={act}
                    className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-mono font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800"
                  >
                    <span>🚫 {act}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExcludedActor(act)}
                      className="hover:text-rose-900 dark:hover:text-white ml-0.5 cursor-pointer"
                      title={`Remove anti-filter for ${act}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              <button
                type="button"
                onClick={handleClearExcludedActors}
                className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 underline dark:text-slate-400 dark:hover:text-rose-400 cursor-pointer ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/50 dark:text-rose-300">
              {error}
            </div>
          )}

          {/* Streaming Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-4">Endpoint & Query</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-3">Client IP</th>
                    <th className="py-3 px-4 text-right">Payload & Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {loading && logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-500 mb-2" />
                        <span>Streaming audit records from DB 3...</span>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <ShieldAlert className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-medium text-slate-600 dark:text-slate-300">No audit logs found</p>
                        <p className="text-xs text-slate-400 mt-1">Try clearing filters or search query.</p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-medium text-slate-900 dark:text-white">
                            {timeAgo(log.created_at)}
                          </div>
                          <div className="text-[10px] text-slate-400">{formatISTDateTime(log.created_at)}</div>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border ${getMethodBadge(
                              log.method
                            )}`}
                          >
                            {log.method}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 break-all">
                            {log.endpoint}
                          </div>
                          {log.query && (
                            <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-xs mt-0.5">
                              ?{log.query}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded-md border ${getStatusBadge(
                              log.status_code
                            )}`}
                          >
                            {log.status_code}
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {log.user_name || log.roll_no ? (
                            <div className="flex items-center justify-between gap-2 group/actor">
                              <div>
                                <div className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                                  <span>{log.user_name || "User"}</span>
                                  {log.role && (
                                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600 dark:text-slate-300">
                                      {log.role}
                                    </span>
                                  )}
                                </div>
                                {log.roll_no && (
                                  <div className="text-[10px] text-slate-400 font-mono">{log.roll_no}</div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExcludeActor(log.roll_no || log.user_name || log.user_uid);
                                }}
                                className="opacity-0 group-hover/actor:opacity-100 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-md transition cursor-pointer"
                                title={`Anti-filter: Exclude ${log.user_name || log.roll_no}`}
                              >
                                <UserX className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Anonymous</span>
                          )}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          {log.ip_address || "-"}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          >
                            <Eye className="h-3 w-3 text-slate-400" />
                            <span>Inspect</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Showing{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {logs.length > 0 ? (page - 1) * limit + 1 : 0}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {(page - 1) * limit + logs.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {total > 0 && !hasMore && total <= (page - 1) * limit + logs.length
                    ? total.toLocaleString()
                    : total > (page - 1) * limit + logs.length
                    ? total.toLocaleString()
                    : `${(page - 1) * limit + logs.length}+`}
                </span>{" "}
                entries
                {` · Page ${page}${totalPages > 1 && total > (page - 1) * limit + logs.length ? ` of ${totalPages}` : ""}`}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-semibold px-2 text-slate-700 dark:text-slate-300">
                  {page} {totalPages > 1 && total > (page - 1) * limit + logs.length ? `/ ${totalPages}` : ""}
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(!hasMore && page >= totalPages && logs.length < limit) || loading || logs.length === 0}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: USER-WISE LOGS                                  */}
      {/* ======================================================== */}
      {activeMode === "user-wise" && (
        <div className="space-y-4">
          {!selectedUser ? (
            /* --- User Selection Grid --- */
            <div className="space-y-4">
              {/* User Search & Controls Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
                <form onSubmit={handleUserGridSearchSubmit} className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 stroke-[2.2]" />
                  <input
                    type="text"
                    value={userGridSearchInput}
                    onChange={(e) => setUserGridSearchInput(e.target.value)}
                    placeholder="Search by name, roll no (e.g. 7376... or CS221), email, or UID..."
                    className="w-full rounded-lg border border-zinc-900 bg-zinc-50 pl-9 pr-24 py-2 text-xs font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:border-white dark:bg-zinc-900 dark:text-zinc-50"
                  />
                  {userGridSearchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserGridSearchInput("");
                        setUserSearch("");
                        setUserGridPage(1);
                      }}
                      className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md border border-zinc-900 bg-blue-600 px-2.5 py-1 text-[11px] font-black text-white hover:bg-blue-700 dark:border-white transition-all cursor-pointer"
                  >
                    Search
                  </button>
                </form>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                    <span className="font-black text-zinc-900 dark:text-zinc-100">{userGridTotal.toLocaleString()}</span> users
                  </span>

                  {/* Cards per page dropdown */}
                  <select
                    value={userGridLimit}
                    onChange={(e) => {
                      setUserGridLimit(Number(e.target.value));
                      setUserGridPage(1);
                    }}
                    className="rounded-lg border border-zinc-900 bg-white px-2.5 py-1.5 text-xs font-bold text-zinc-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-[1px_1px_0px_#ffffff]"
                  >
                    <option value={24}>24 cards / page</option>
                    <option value={48}>48 cards / page</option>
                    <option value={96}>96 cards / page</option>
                    <option value={200}>200 cards / page</option>
                  </select>

                  <button
                    onClick={fetchAuditUsers}
                    disabled={usersLoading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-black text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
                  >
                    <RefreshCw className={`h-3 w-3 stroke-[2.2] ${usersLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Users Cards Grid */}
              {usersLoading ? (
                <div className="py-20 text-center text-zinc-400">
                  <RefreshCw className="mx-auto h-7 w-7 animate-spin text-blue-600 mb-2 stroke-[2.2]" />
                  <p className="text-xs font-bold">Loading active users from Logs Cluster...</p>
                </div>
              ) : auditUsers.length === 0 ? (
                <div className="rounded-xl border border-zinc-900 bg-white p-12 text-center dark:border-white dark:bg-[#111827] shadow-[3px_3px_0px_#18181b] dark:shadow-[3px_3px_0px_#ffffff]">
                  <Users className="mx-auto h-8 w-8 text-zinc-400 mb-2 stroke-[2.2]" />
                  <p className="font-black text-zinc-900 dark:text-zinc-100">No users found</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {userSearch ? "Try adjusting your search query." : "Users will appear here as they interact with the API."}
                  </p>
                  {userSearch && (
                    <button
                      onClick={() => {
                        setUserGridSearchInput("");
                        setUserSearch("");
                        setUserGridPage(1);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] cursor-pointer"
                    >
                      Clear Search Filter
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {auditUsers.map((u) => (
                      <div
                        key={u.user_uid}
                        onClick={() => {
                          setSelectedUser(u);
                          setUserPage(1);
                          setUserLimit(50);
                          setUserSearchText("");
                          setUserSearchInput("");
                          setUserMethod("ALL");
                          setUserStatus("ALL");
                        }}
                        className="group cursor-pointer rounded-xl border border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-900 bg-blue-600 text-white font-black text-sm shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                                {(u.user_name || u.roll_no || "U").charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate" title={u.user_name || "Unknown User"}>
                                  {u.user_name || "Unknown User"}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  {u.roll_no ? (
                                    <span className="font-mono text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                                      {u.roll_no}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[120px]" title={u.user_uid}>
                                      UID: {u.user_uid.slice(0, 10)}...
                                    </span>
                                  )}
                                  {u.role && (
                                    <span className="rounded-md border border-zinc-900 bg-zinc-100 px-1.5 py-0.2 text-[9px] font-black uppercase text-zinc-800 dark:border-white dark:bg-zinc-800 dark:text-zinc-200">
                                      {u.role}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <span className="rounded-md border border-zinc-900 bg-blue-50 px-2 py-0.5 text-xs font-black text-blue-700 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-blue-950/80 dark:text-blue-300 dark:shadow-[1px_1px_0px_#ffffff] shrink-0">
                              {u.log_count} logs
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <span className="text-zinc-500 font-bold uppercase text-[9px] dark:text-zinc-400">Last Active</span>
                              <p className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 truncate" title={formatISTDateTime(u.last_active)}>
                                {timeAgo(u.last_active)}
                              </p>
                            </div>
                            <div>
                              <span className="text-zinc-500 font-bold uppercase text-[9px] dark:text-zinc-400">Last Known IP</span>
                              <p className="font-mono font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 truncate" title={u.last_ip}>
                                {u.last_ip || "-"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs font-black text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                          <span>View Logs</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Grid Pagination Controls */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-zinc-900 bg-white p-4 dark:border-white dark:bg-[#111827] shadow-[3px_3px_0px_#18181b] dark:shadow-[3px_3px_0px_#ffffff]">
                    <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                      Showing <span className="font-black text-zinc-900 dark:text-zinc-50">{(userGridPage - 1) * userGridLimit + 1}</span> to{" "}
                      <span className="font-black text-zinc-900 dark:text-zinc-50">{Math.min(userGridPage * userGridLimit, userGridTotal)}</span> of{" "}
                      <span className="font-black text-zinc-900 dark:text-zinc-50">{userGridTotal.toLocaleString()}</span> active users
                      {userGridTotalPages > 1 && ` · Page ${userGridPage} of ${userGridTotalPages}`}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setUserGridPage((p) => Math.max(1, p - 1))}
                        disabled={userGridPage <= 1 || usersLoading}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-x-0 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[1.5px_1.5px_0px_#ffffff] cursor-pointer"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span>Previous</span>
                      </button>

                      <span className="text-xs font-black px-2 text-zinc-900 dark:text-zinc-100">
                        {userGridPage} / {userGridTotalPages}
                      </span>

                      <button
                        onClick={() => setUserGridPage((p) => Math.min(userGridTotalPages, p + 1))}
                        disabled={userGridPage >= userGridTotalPages || usersLoading}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-x-0 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[1.5px_1.5px_0px_#ffffff] cursor-pointer"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* --- Dedicated Single User Audit Logs --- */
            <div className="space-y-4">
              {/* User Profile Header Card */}
              <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="rounded-lg border border-zinc-900 bg-white p-2 text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
                      title="Back to All Users"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-900 bg-blue-600 text-white font-black text-lg shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
                      {(selectedUser.user_name || selectedUser.roll_no || "U").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                          {selectedUser.user_name || "User Logs"}
                        </h2>
                        {selectedUser.role && (
                          <span className="rounded-md border border-zinc-900 bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase text-blue-700 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-blue-950 dark:text-blue-300 dark:shadow-[1px_1px_0px_#ffffff]">
                            {selectedUser.role}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 font-bold">
                        {selectedUser.roll_no && (
                          <span className="font-mono text-zinc-800 dark:text-zinc-200">
                            Roll: {selectedUser.roll_no}
                          </span>
                        )}
                        <span className="font-mono text-[11px]" title={selectedUser.user_uid}>UID: {selectedUser.user_uid}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] font-bold uppercase text-zinc-500 dark:text-zinc-400">Recorded User Actions</span>
                      <p className="text-base font-black text-blue-600 dark:text-blue-400">
                        {userLogsTotal.toLocaleString()} requests
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedUser(null)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-3 py-2 text-xs font-black text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to All Users</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters for this user */}
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between">
                <form onSubmit={handleUserSearchSubmit} className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={userSearchInput}
                    onChange={(e) => setUserSearchInput(e.target.value)}
                    placeholder="Search user logs: endpoint, query, payload, response..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-24 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-purple-500"
                  />
                  {userSearchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserSearchInput("");
                        setUserSearchText("");
                        setUserPage(1);
                      }}
                      className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-purple-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-purple-700 transition"
                  >
                    Filter
                  </button>
                </form>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={userMethod}
                    onChange={(e) => {
                      setUserMethod(e.target.value);
                      setUserPage(1);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <option value="ALL">All Methods</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>

                  <select
                    value={userStatus}
                    onChange={(e) => {
                      setUserStatus(e.target.value);
                      setUserPage(1);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <option value="ALL">All Status</option>
                    <option value="2xx">2xx Success</option>
                    <option value="3xx">3xx Redirect</option>
                    <option value="4xx">4xx Client Error</option>
                    <option value="5xx">5xx Server Error</option>
                  </select>

                  {/* Limit per page */}
                  <select
                    value={userLimit}
                    onChange={(e) => {
                      setUserLimit(Number(e.target.value));
                      setUserPage(1);
                    }}
                    className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                  >
                    <option value={25}>25 / page</option>
                    <option value={50}>50 / page</option>
                    <option value={100}>100 / page</option>
                  </select>

                  <button
                    onClick={fetchSelectedUserLogs}
                    disabled={userLogsLoading}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3 py-2 text-xs font-semibold text-white hover:bg-purple-700"
                  >
                    <RefreshCw className={`h-3 w-3 ${userLogsLoading ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* User's Audit Log Table */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-3">Method</th>
                        <th className="py-3 px-4">Endpoint & Query</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Client IP</th>
                        <th className="py-3 px-4 text-right">Payload & Response</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {userLogsLoading && userLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <RefreshCw className="mx-auto h-6 w-6 animate-spin text-purple-500 mb-2" />
                            <span>Loading user audit trail...</span>
                          </td>
                        </tr>
                      ) : userLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            <ShieldCheck className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
                            <p className="font-medium text-slate-600 dark:text-slate-300">No logs found for this user</p>
                            <p className="text-xs text-slate-400 mt-1">Try clearing filters or search query.</p>
                          </td>
                        </tr>
                      ) : (
                        userLogs.map((log) => (
                          <tr
                            key={log.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                          >
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-medium text-slate-900 dark:text-white">
                                {timeAgo(log.created_at)}
                              </div>
                              <div className="text-[10px] text-slate-400">{formatISTDateTime(log.created_at)}</div>
                            </td>

                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border ${getMethodBadge(
                                  log.method
                                )}`}
                              >
                                {log.method}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 break-all">
                                {log.endpoint}
                              </div>
                              {log.query && (
                                <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-xs mt-0.5">
                                  ?{log.query}
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-0.5 text-[11px] font-bold rounded-md border ${getStatusBadge(
                                  log.status_code
                                )}`}
                              >
                                {log.status_code}
                              </span>
                            </td>

                            <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                              {log.ip_address || "-"}
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setSelectedLog(log)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                              >
                                <Eye className="h-3 w-3 text-slate-400" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* User Pagination */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Showing <span className="font-semibold text-slate-900 dark:text-white">{userLogs.length}</span> of{" "}
                    <span className="font-semibold text-slate-900 dark:text-white">{userLogsTotal.toLocaleString()}</span> entries
                    {userTotalPages > 1 && ` · Page ${userPage} of ${userTotalPages}`}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      disabled={userPage <= 1 || userLogsLoading}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Previous</span>
                    </button>

                    <span className="text-xs font-semibold px-2 text-slate-700 dark:text-slate-300">
                      {userPage} / {userTotalPages}
                    </span>

                    <button
                      onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                      disabled={userPage >= userTotalPages || userLogsLoading}
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 3: API USAGE BY ENDPOINT                           */}
      {/* ======================================================== */}
      {activeMode === "api-usage" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between">
            <form onSubmit={handleApiSearchSubmit} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={apiSearchInput}
                onChange={(e) => setApiSearchInput(e.target.value)}
                placeholder="Search endpoint path (e.g. /cards, /admin, /qb, /me)..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-20 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-amber-500"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-amber-700 transition"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap items-center gap-2">
              {/* Method Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={apiMethod}
                  onChange={(e) => setApiMethod(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                >
                  <option value="ALL">All Methods</option>
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>

              {/* Timeframe Filter */}
              <select
                value={apiTimeframe}
                onChange={(e) => setApiTimeframe(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                <option value="all">All Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>

              {/* Sort By Filter */}
              <div className="flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={apiSortBy}
                  onChange={(e) => setApiSortBy(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                >
                  <option value="calls-desc">Most Called (High → Low)</option>
                  <option value="calls-asc">Least Called (Low → High)</option>
                  <option value="errors">Most Errors (4xx/5xx)</option>
                  <option value="name">Endpoint Path (A → Z)</option>
                </select>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchApiUsage}
                disabled={apiUsageLoading}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700 disabled:opacity-70 dark:bg-amber-600 dark:hover:bg-amber-500"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${apiUsageLoading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Endpoints Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
                    <th className="py-3 px-4">Endpoint Path</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-4">Calls & Traffic Share</th>
                    <th className="py-3 px-3">Status Breakdown</th>
                    <th className="py-3 px-3">Unique Callers</th>
                    <th className="py-3 px-4">Last Invocated (IST)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {apiUsageLoading && sortedEndpoints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <RefreshCw className="mx-auto h-6 w-6 animate-spin text-amber-500 mb-2" />
                        <span>Aggregating endpoint usage from DB 3...</span>
                      </td>
                    </tr>
                  ) : sortedEndpoints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <BarChart3 className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-medium text-slate-600 dark:text-slate-300">No endpoint usage records found</p>
                        <p className="text-xs text-slate-400 mt-1">Try broadening your search or timeframe.</p>
                      </td>
                    </tr>
                  ) : (
                    sortedEndpoints.map((ep, idx) => {
                      const totalErrors = (ep.client_error_count || 0) + (ep.server_error_count || 0);
                      return (
                        <tr
                          key={`${ep.method}-${ep.endpoint}-${idx}`}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          {/* Endpoint */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                {ep.endpoint}
                              </span>
                              <button
                                onClick={() => handleCopyEndpoint(ep.endpoint)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                title="Copy endpoint path"
                              >
                                {copiedEndpoint === ep.endpoint ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Method */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md border ${getMethodBadge(
                                ep.method
                              )}`}
                            >
                              {ep.method}
                            </span>
                          </td>

                          {/* Calls & Traffic Share */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-900 dark:text-white text-xs min-w-[3.5rem]">
                                {ep.call_count.toLocaleString()}
                              </span>
                              <div className="flex-1 max-w-[120px] bg-slate-100 rounded-full h-1.5 dark:bg-slate-800 overflow-hidden">
                                <div
                                  className="bg-amber-500 h-1.5 rounded-full"
                                  style={{ width: `${Math.min(100, Math.max(3, ep.percentage))}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                {ep.percentage ? ep.percentage.toFixed(1) : 0}%
                              </span>
                            </div>
                          </td>

                          {/* Status Breakdown */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold">
                              <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                                {ep.success_count || 0} ok
                              </span>
                              {totalErrors > 0 && (
                                <span className="inline-block px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800">
                                  {totalErrors} err
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Unique Callers */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              <User className="h-3 w-3 text-slate-400" />
                              <span>{ep.unique_users || 0}</span>
                            </span>
                          </td>

                          {/* Last Invocated */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-medium text-slate-900 dark:text-white text-xs">
                              {timeAgo(ep.last_called_at)}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {formatISTDateTime(ep.last_called_at)}
                            </div>
                          </td>

                          {/* Action */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleViewInStream(ep.endpoint, ep.method)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                              title="Inspect calls in streaming mode"
                            >
                              <span>View Stream</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-xs text-slate-500 dark:text-slate-400">
              <div>
                Displaying <span className="font-semibold text-slate-900 dark:text-white">{sortedEndpoints.length}</span> endpoints
                {" · "}Total traffic: <span className="font-semibold text-slate-900 dark:text-white">{apiUsageTotalCalls.toLocaleString()}</span> calls recorded in DB 3
              </div>
              <div className="text-[11px] text-slate-400">
                Sorted by: {apiSortBy === "calls-desc" ? "Most Called" : apiSortBy === "calls-asc" ? "Least Called" : apiSortBy === "errors" ? "Most Errors" : "Endpoint Path"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DETAIL / PAYLOAD & RESPONSE INSPECTION MODAL            */}
      {/* ======================================================== */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md border ${getMethodBadge(
                    selectedLog.method
                  )}`}
                >
                  {selectedLog.method}
                </span>
                <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white break-all">
                  {selectedLog.endpoint}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md border ${getStatusBadge(
                    selectedLog.status_code
                  )}`}
                >
                  {selectedLog.status_code}
                </span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 shrink-0 ml-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-5 space-y-4">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-950">
                <div>
                  <span className="text-[11px] text-slate-400">Timestamp</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {formatISTDateTime(selectedLog.created_at)} ({timeAgo(selectedLog.created_at)})
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Client IP Address</span>
                  <p className="font-mono font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedLog.ip_address || "Unknown"}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">User / Actor</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {selectedLog.user_name || "Anonymous"} {selectedLog.roll_no ? `(${selectedLog.roll_no})` : ""}
                  </p>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Role & User UID</span>
                  <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                    {selectedLog.role || "none"} · {selectedLog.user_uid || "none"}
                  </p>
                </div>
              </div>

              {/* Query Parameters */}
              {selectedLog.query && (
                <div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    URL Query Parameters
                  </div>
                  <pre className="rounded-xl border border-slate-200 bg-slate-950 p-3 font-mono text-[11px] text-slate-200 overflow-x-auto dark:border-slate-800">
                    {selectedLog.query}
                  </pre>
                </div>
              )}

              {/* Payload Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-blue-500" />
                    <span>Request Payload</span>
                  </div>
                  {selectedLog.payload && selectedLog.payload !== "null" && (
                    <button
                      onClick={() => handleCopyPayload(formatPayload(selectedLog.payload))}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {copiedPayload ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedPayload ? "Copied" : "Copy Payload"}</span>
                    </button>
                  )}
                </div>
                <pre className="rounded-xl border border-slate-200 bg-slate-950 p-3 font-mono text-xs text-emerald-400 overflow-x-auto max-h-56 dark:border-slate-800 leading-relaxed select-text">
                  {formatPayload(selectedLog.payload)}
                </pre>
              </div>

              {/* Response Body */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-cyan-500" />
                    <span>Response Body</span>
                    <span className={`inline-block px-1.5 py-0.2 text-[10px] font-bold rounded border ${getStatusBadge(selectedLog.status_code)}`}>
                      HTTP {selectedLog.status_code}
                    </span>
                  </div>
                  {selectedLog.response && selectedLog.response !== "null" && (
                    <button
                      onClick={() => handleCopyResponse(formatPayload(selectedLog.response))}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
                    >
                      {copiedResponse ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedResponse ? "Copied" : "Copy Response"}</span>
                    </button>
                  )}
                </div>
                <pre className="rounded-xl border border-slate-200 bg-slate-950 p-3 font-mono text-xs text-cyan-300 overflow-x-auto max-h-64 dark:border-slate-800 leading-relaxed select-text">
                  {formatPayload(selectedLog.response)}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-slate-200 px-5 py-3 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <button
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-300 transition dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

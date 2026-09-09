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
  Globe,
  X,
  Loader,
} from "lucide-react";
import { getAuditLogs, clearAuditLogs } from "@/api/admin.js";

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
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
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

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const [activePayload, setActivePayload] = useState(null);
  const [copied, setCopied] = useState(false);

  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAuditLogs({
        page,
        limit,
        search,
        method: selectedMethod === "ALL" ? "" : selectedMethod,
        status: selectedStatus === "ALL" ? "" : selectedStatus,
      });
      if (data.success) {
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(data.error || "Failed to load audit logs");
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Error fetching audit logs");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, selectedMethod, selectedStatus]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleClearLogs = async () => {
    setClearing(true);
    try {
      const res = await clearAuditLogs();
      if (res.success) {
        setLogs([]);
        setTotal(0);
        setTotalPages(1);
        setClearModalOpen(false);
      } else {
        setError(res.error || "Failed to clear audit logs");
      }
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to clear logs");
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

  const stats = useMemo(() => {
    const postCount = logs.filter((l) => l.method === "POST").length;
    const putCount = logs.filter((l) => l.method === "PUT").length;
    const errorCount = logs.filter((l) => Number(l.status_code) >= 400).length;
    return { postCount, putCount, errorCount };
  }, [logs]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-purple-200/60 bg-gradient-to-r from-purple-900/10 via-indigo-900/5 to-slate-900/5 p-6 shadow-sm dark:border-purple-900/30 dark:from-purple-950/40 dark:via-indigo-950/20 dark:to-slate-950">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-600 p-2.5 text-white shadow-lg shadow-purple-600/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Audit Logs & Request Tracking
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                  Live History
                </span>
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Track all user requests, HTTP methods, payloads, IP addresses, and user details logged via middleware.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
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

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Filtered Logs</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{total.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Page POST Requests</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stats.postCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Page PUT Requests</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Code2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stats.putCount}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Errors (4xx / 5xx)</span>
            <div className="rounded-lg bg-rose-50 p-2 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stats.errorCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user name, roll no, IP, endpoint path, query, or payload content..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:border-purple-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-600/20 transition hover:bg-purple-700"
          >
            <Search className="h-4 w-4" />
            Search
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
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition border ${
                  selectedMethod === m
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            >
              <option value="ALL">All Status Codes</option>
              <option value="success">Success (2xx / 3xx)</option>
              <option value="error">Errors (4xx / 5xx)</option>
            </select>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none transition focus:border-purple-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
            >
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3.5">Time (IST)</th>
                <th className="px-4 py-3.5">Method</th>
                <th className="px-4 py-3.5">Endpoint Path & Query</th>
                <th className="px-4 py-3.5">User & Roll No</th>
                <th className="px-4 py-3.5">IP Address</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Payload</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400 font-sans">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader className="h-6 w-6 animate-spin text-purple-600" />
                      <span>Loading audit logs...</span>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400 font-sans">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <ShieldCheck className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-700 dark:text-slate-300">No audit logs found</p>
                      <p className="text-xs text-slate-500">Make HTTP requests or clear filters to view recent API traffic logs.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const hasUser = Boolean(log.user_name || log.roll_no || log.user_uid);
                  return (
                    <tr key={log.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      {/* Timestamp */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        {formatLogTime(log.created_at)}
                      </td>

                      {/* Method */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold ${getMethodBadgeStyle(log.method)}`}>
                          {log.method}
                        </span>
                      </td>

                      {/* Endpoint & Query */}
                      <td className="px-4 py-3 max-w-xs truncate text-slate-900 dark:text-slate-100 font-medium">
                        <span title={log.endpoint}>{log.endpoint}</span>
                        {log.query && (
                          <span className="block text-[11px] text-purple-600 dark:text-purple-400 truncate" title={`?${log.query}`}>
                            ?{log.query}
                          </span>
                        )}
                      </td>

                      {/* User details */}
                      <td className="px-4 py-3 font-sans">
                        {hasUser ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                              <span className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                                {log.user_name || "User"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {log.roll_no && (
                                <span className="inline-block rounded bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                                  {log.roll_no}
                                </span>
                              )}
                              {log.role && (
                                <span className="inline-block rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400 capitalize">
                                  {log.role}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            Guest / Anonymous
                          </span>
                        )}
                      </td>

                      {/* IP Address */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 text-[11px]">
                          <Globe className="h-3 w-3 text-slate-400" />
                          {log.ip_address}
                        </span>
                      </td>

                      {/* Status Code */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block rounded-md border px-2 py-0.5 text-[11px] font-bold ${getStatusBadgeStyle(log.status_code)}`}>
                          {log.status_code}
                        </span>
                      </td>

                      {/* Payload button */}
                      <td className="px-4 py-3 whitespace-nowrap text-right font-sans">
                        {log.payload ? (
                          <button
                            type="button"
                            onClick={() => setActivePayload(log.payload)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 transition hover:bg-purple-100 dark:border-purple-900/40 dark:bg-purple-950/50 dark:text-purple-300 dark:hover:bg-purple-950"
                          >
                            <Code2 className="h-3.5 w-3.5" />
                            View Payload
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/50 px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-900 dark:text-white">{logs.length > 0 ? (page - 1) * limit + 1 : 0}</span> to{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{Math.min(page * limit, total)}</span> of{" "}
            <span className="font-semibold text-slate-900 dark:text-white">{total}</span> logs
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 font-semibold text-slate-900 dark:text-white">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Payload Modal */}
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

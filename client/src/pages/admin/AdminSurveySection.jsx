import React, { useState, useEffect, useCallback } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Search,
  Trash2,
  Sparkles,
  BarChart3,
  Calendar,
  Mail,
  Loader2,
  MessageSquareQuote,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import api from "@/api/axios.js";
import { getAuthenticatedHeaders } from "@/api/axios.js";
import { haptics } from "@/utils/haptics.js";

export default function AdminSurveySection() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    yes_count: 0,
    no_count: 0,
    satisfaction_rate: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    total: 0,
    total_pages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all' | 'yes' | 'no' | 'has_feedback'
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [deletingId, setDeletingId] = useState(null);

  // Debounce search query by 350ms to avoid unnecessary network queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reset to page 1 when filter or limit changes
  const handleFilterChange = (filterId) => {
    haptics.selection();
    setSelectedFilter(filterId);
    setPage(1);
  };

  const handleLimitChange = (newLimit) => {
    haptics.selection();
    setLimit(Number(newLimit));
    setPage(1);
  };

  const fetchSurveyFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const headers = await getAuthenticatedHeaders();
      const params = {
        page,
        limit,
        search: debouncedSearch.trim() || undefined,
        liked:
          selectedFilter === "yes"
            ? "yes"
            : selectedFilter === "no"
            ? "no"
            : undefined,
        has_feedback: selectedFilter === "has_feedback" ? "true" : undefined,
      };

      const res = await api.get("/admin/survey/feedback", { params, headers });
      if (res?.data?.success) {
        setData(Array.isArray(res.data.data) ? res.data.data : []);
        if (res.data.summary) {
          setSummary(res.data.summary);
        }
        if (res.data.pagination) {
          setPagination(res.data.pagination);
        }
      }
    } catch (err) {
      console.error("Failed to load survey feedback", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, selectedFilter]);

  useEffect(() => {
    fetchSurveyFeedback();
  }, [fetchSurveyFeedback]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this survey response?")) {
      return;
    }
    haptics.action();
    setDeletingId(id);
    try {
      const headers = await getAuthenticatedHeaders();
      await api.delete(`/admin/survey/feedback/${id}`, { headers });
      fetchSurveyFeedback();
    } catch (err) {
      console.error("Failed to delete survey feedback", err);
      alert("Failed to delete response");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Just now";
    const d = new Date(dateStr);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Compute pagination range display numbers
  const totalItems = pagination.total || 0;
  const totalPages = Math.max(pagination.total_pages || 1, 1);
  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  // Generate page numbers for buttons with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-zinc-900 bg-white p-5 sm:p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-zinc-900 bg-blue-100 px-2.5 py-0.5 text-xs font-black uppercase text-blue-900 dark:border-white dark:bg-blue-900/60 dark:text-blue-100 shadow-[1px_1px_0px_#18181b] dark:shadow-[1px_1px_0px_#ffffff]">
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
            <span>UI Experience Survey</span>
          </div>
          <h2 className="mt-2 text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            User Interface Feedback
          </h2>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            Real-time student ratings and suggestions on the newly refreshed UI with server-side pagination.
          </p>
        </div>

        <button
          onClick={() => {
            haptics.selection();
            fetchSurveyFeedback();
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-900 bg-white px-4 py-2.5 text-xs sm:text-sm font-black text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:bg-zinc-100 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-blue-600" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Analytics Summary Cards (All-time metrics) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Total Responses */}
        <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total Responses
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
              {summary.total}
            </span>
            <span className="text-xs font-bold text-zinc-500">Votes</span>
          </div>
        </div>

        {/* Liked (Yes) */}
        <div className="rounded-xl border border-zinc-900 bg-emerald-50/50 p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-emerald-950/30 dark:shadow-[2px_2px_0px_#ffffff]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Liked (Yes)
            </span>
            <ThumbsUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {summary.yes_count}
            </span>
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-300">
              {summary.total > 0 ? Math.round((summary.yes_count / summary.total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Disliked (No) */}
        <div className="rounded-xl border border-zinc-900 bg-rose-50/50 p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-rose-950/30 dark:shadow-[2px_2px_0px_#ffffff]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-rose-800 dark:text-rose-300">
              Needs Work (No)
            </span>
            <ThumbsDown className="h-4 w-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              {summary.no_count}
            </span>
            <span className="text-xs font-black text-rose-700 dark:text-rose-300">
              {summary.total > 0 ? Math.round((summary.no_count / summary.total) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Overall Satisfaction */}
        <div className="rounded-xl border border-zinc-900 bg-blue-50/60 p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-blue-950/30 dark:shadow-[2px_2px_0px_#ffffff]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-blue-800 dark:text-blue-300">
              Approval Rate
            </span>
            <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {Math.round(summary.satisfaction_rate)}%
            </span>
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Positive</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-zinc-900 bg-white p-1.5 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
          {[
            { id: "all", label: `All (${summary.total})` },
            { id: "yes", label: `👍 Liked (${summary.yes_count})` },
            { id: "no", label: `👎 Disliked (${summary.no_count})` },
            { id: "has_feedback", label: `💬 Comments Only` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleFilterChange(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-black transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? "bg-blue-600 text-white border border-zinc-900 shadow-[1px_1px_0px_#18181b] dark:border-white dark:shadow-[1px_1px_0px_#ffffff]"
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input & Limit selector */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search responses or students..."
              className="w-full rounded-xl border border-zinc-900 bg-white py-2 pl-9 pr-3 text-xs font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] placeholder:text-zinc-400 focus:outline-none dark:border-white dark:bg-[#111827] dark:text-white dark:shadow-[2px_2px_0px_#ffffff]"
            />
          </div>

          {/* Items Per Page Selector */}
          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-900 bg-white px-2.5 py-1.5 text-xs font-bold text-zinc-700 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:text-zinc-300 dark:shadow-[2px_2px_0px_#ffffff]">
            <span className="hidden sm:inline text-zinc-500">Per page:</span>
            <select
              value={limit}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="bg-transparent font-black text-zinc-900 dark:text-white outline-none cursor-pointer"
            >
              <option value="10" className="dark:bg-[#111827]">10</option>
              <option value="25" className="dark:bg-[#111827]">25</option>
              <option value="50" className="dark:bg-[#111827]">50</option>
              <option value="100" className="dark:bg-[#111827]">100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Responses List */}
      {loading ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-zinc-900 bg-white p-8 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-xs sm:text-sm font-black text-zinc-600 dark:text-zinc-400">
            Loading survey responses...
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-2xl border border-zinc-900 bg-white p-8 text-center shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <MessageSquareQuote className="h-10 w-10 text-zinc-400" />
          <h3 className="mt-3 text-base font-black text-zinc-900 dark:text-white">
            No Survey Responses Found
          </h3>
          <p className="mt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 max-w-sm">
            {summary.total === 0
              ? "Students will be asked for feedback after 2 minutes of active usage. Responses will appear here in real-time."
              : "No responses match your search or selected filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {data.map((item) => {
            const isLiked = item.liked === "yes";
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-900 bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#18181b] transition-all dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff] ${
                        isLiked
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300"
                      }`}
                    >
                      {isLiked ? (
                        <ThumbsUp className="h-5 w-5 stroke-[2.2]" />
                      ) : (
                        <ThumbsDown className="h-5 w-5 stroke-[2.2]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white truncate">
                          {item.user_name || "Student"}
                        </h4>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-black uppercase shadow-[1px_1px_0px_#18181b] dark:shadow-[1px_1px_0px_#ffffff] ${
                            isLiked
                              ? "border-zinc-900 bg-emerald-500 text-white dark:border-white"
                              : "border-zinc-900 bg-rose-500 text-white dark:border-white"
                          }`}
                        >
                          {isLiked ? "👍 Likes New UI" : "👎 Needs Work"}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                        {item.user_email && item.user_email !== "anonymous@visitor" && (
                          <span className="flex items-center gap-1 font-mono">
                            <Mail className="h-3 w-3" />
                            {item.user_email}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white p-2 text-xs font-bold text-rose-600 shadow-[1px_1px_0px_#18181b] hover:bg-rose-50 hover:text-rose-700 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 dark:border-white dark:bg-zinc-800 dark:text-rose-400 dark:shadow-[1px_1px_0px_#ffffff] transition-all cursor-pointer"
                      title="Delete response"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Feedback Content if provided */}
                {item.feedback?.trim() ? (
                  <div className="mt-3.5 rounded-xl border border-zinc-900 bg-zinc-50 p-3.5 text-xs font-semibold leading-relaxed text-zinc-800 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800/80 dark:text-zinc-200 dark:shadow-[2px_2px_0px_#ffffff]">
                    <div className="flex items-start gap-2">
                      <MessageSquareQuote className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <p className="whitespace-pre-wrap">{item.feedback}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 text-[11px] font-semibold italic text-zinc-400 dark:text-zinc-500">
                    No additional comment provided.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Server-Side Pagination Bar */}
      {totalItems > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
          <div className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
            Showing <span className="font-black text-zinc-900 dark:text-white">{startItem}</span> to{" "}
            <span className="font-black text-zinc-900 dark:text-white">{endItem}</span> of{" "}
            <span className="font-black text-zinc-900 dark:text-white">{totalItems}</span> responses
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            {/* First Page */}
            <button
              onClick={() => {
                haptics.selection();
                setPage(1);
              }}
              disabled={page <= 1 || loading}
              className="rounded-lg border border-zinc-900 bg-white p-1.5 text-xs font-bold text-zinc-700 shadow-[1px_1px_0px_#18181b] hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-[1px_1px_0px_#ffffff]"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>

            {/* Prev Page */}
            <button
              onClick={() => {
                haptics.selection();
                setPage((p) => Math.max(p - 1, 1));
              }}
              disabled={page <= 1 || loading}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-2.5 py-1.5 text-xs font-bold text-zinc-700 shadow-[1px_1px_0px_#18181b] hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-[1px_1px_0px_#ffffff]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {getPageNumbers().map((p, idx) =>
                p === "..." ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-xs font-bold text-zinc-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={`page-${p}`}
                    onClick={() => {
                      haptics.selection();
                      setPage(p);
                    }}
                    disabled={loading}
                    className={`min-w-8 rounded-lg px-2 py-1.5 text-xs font-black transition-all cursor-pointer ${
                      page === p
                        ? "border border-zinc-900 bg-blue-600 text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]"
                        : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            {/* Next Page */}
            <button
              onClick={() => {
                haptics.selection();
                setPage((p) => Math.min(p + 1, totalPages));
              }}
              disabled={page >= totalPages || loading}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-2.5 py-1.5 text-xs font-bold text-zinc-700 shadow-[1px_1px_0px_#18181b] hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-[1px_1px_0px_#ffffff]"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => {
                haptics.selection();
                setPage(totalPages);
              }}
              disabled={page >= totalPages || loading}
              className="rounded-lg border border-zinc-900 bg-white p-1.5 text-xs font-bold text-zinc-700 shadow-[1px_1px_0px_#18181b] hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-[1px_1px_0px_#ffffff]"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

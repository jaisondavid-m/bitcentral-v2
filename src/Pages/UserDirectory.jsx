import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  User,
  Mail,
  Hash,
  Copy,
  Check,
  RefreshCw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Users,
  Building2,
  GraduationCap,
  Sparkles,
  X,
  Filter,
  UserCheck,
  Code2
} from "lucide-react";
import api, { getAuthenticatedHeaders } from "../api/axios.js";

// Helper function to derive role based on specified rules:
// 1. Tester: user_id or id contains "test" (case-insensitive)
// 2. Student: email ends with @bitsathy.ac.in / @bitsathy.in AND username contains .<dept><year> pattern (e.g. .cs25)
// 3. Faculty: email ends with @bitsathy.ac.in / @bitsathy.in without student pattern (e.g. sathishv@bitsathy.ac.in)
// 4. External: all others
export const getUserRole = (user) => {
  const userId = (user.user_id || "").toLowerCase();
  const id = (user.id || "").toLowerCase();
  const email = (user.email || "").trim().toLowerCase();

  // Rule 1: Tester
  if (userId.includes("test") || id.includes("test")) {
    return {
      role: "Tester",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    };
  }

  // Check institutional email
  if (email.endsWith("@bitsathy.ac.in") || email.endsWith("@bitsathy.in")) {
    const handle = email.split("@")[0] || "";
    // Rule 2: Student (.cs25, .ad25, .mb25, .ee25, .ei24, etc.)
    if (/\.[a-z]{2,6}\d{2}/i.test(handle)) {
      return {
        role: "Student",
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      };
    }
    // Rule 3: Faculty (no .dept_year in username)
    return {
      role: "Faculty",
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    };
  }

  // Rule 4: External
  return {
    role: "External",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  };
};

export default function UserDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // ALL, Student, Faculty, Tester, External
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortBy, setSortBy] = useState("name"); // name, user_id, id, email, role
  const [sortOrder, setSortOrder] = useState("asc"); // asc, desc
  const [copiedText, setCopiedText] = useState(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch tracker users
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["tracker-users", debouncedSearch],
    queryFn: async () => {
      const headers = await getAuthenticatedHeaders().catch(() => ({}));
      const res = await api.get("/tracker-users", {
        params: { q: debouncedSearch },
        headers,
      });
      return res.data;
    },
    staleTime: 2 * 60 * 1000,
    keepPreviousData: true,
  });

  const rawUsers = useMemo(() => responseData?.data || [], [responseData]);

  // Enrich raw users with computed role information
  const enrichedUsers = useMemo(() => {
    return rawUsers.map((u) => {
      const roleInfo = getUserRole(u);
      return {
        ...u,
        computedRole: roleInfo.role,
        badgeClass: roleInfo.badgeClass,
      };
    });
  }, [rawUsers]);

  // Role Statistics Summary
  const roleStats = useMemo(() => {
    const stats = { Student: 0, Faculty: 0, Tester: 0, External: 0, Total: enrichedUsers.length };
    enrichedUsers.forEach((u) => {
      if (stats[u.computedRole] !== undefined) {
        stats[u.computedRole]++;
      }
    });
    return stats;
  }, [enrichedUsers]);

  // Filter by Role
  const filteredUsers = useMemo(() => {
    if (roleFilter === "ALL") return enrichedUsers;
    return enrichedUsers.filter((u) => u.computedRole === roleFilter);
  }, [enrichedUsers, roleFilter]);

  // Client-side Sorting
  const sortedUsers = useMemo(() => {
    const list = [...filteredUsers];
    list.sort((a, b) => {
      let valA = "";
      let valB = "";
      if (sortBy === "role") {
        valA = a.computedRole.toLowerCase();
        valB = b.computedRole.toLowerCase();
      } else {
        valA = (a[sortBy] || "").toString().toLowerCase();
        valB = (b[sortBy] || "").toString().toLowerCase();
      }
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredUsers, sortBy, sortOrder]);

  // Pagination calculation
  const totalItems = sortedUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedUsers.slice(start, start + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  // Copy to clipboard helper
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(`${label}: ${text}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent)]" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Public Directory Explorer
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">User Directory</h1>
              <p className="mt-1 text-sm sm:text-base text-blue-100 max-w-2xl">
                Browse and search registered records across User ID, ID, Name, or Email. Categorized into Students, Faculty, Testers, and External users.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium text-sm transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {copiedText && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium animate-bounce border border-slate-700 dark:border-slate-200">
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Copied {copiedText}</span>
          </div>
        )}

        {/* Role Metrics Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Total */}
          <button
            onClick={() => { setRoleFilter("ALL"); setCurrentPage(1); }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              roleFilter === "ALL"
                ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-[1.02]"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold opacity-80 mb-1">
              <span>All Users</span>
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black">{roleStats.Total}</div>
          </button>

          {/* Students */}
          <button
            onClick={() => { setRoleFilter("Student"); setCurrentPage(1); }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              roleFilter === "Student"
                ? "bg-emerald-600 text-white border-emerald-600 shadow-lg scale-[1.02]"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-400"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold opacity-80 mb-1">
              <span>Students</span>
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black">{roleStats.Student}</div>
          </button>

          {/* Faculty */}
          <button
            onClick={() => { setRoleFilter("Faculty"); setCurrentPage(1); }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              roleFilter === "Faculty"
                ? "bg-purple-600 text-white border-purple-600 shadow-lg scale-[1.02]"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-400"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold opacity-80 mb-1">
              <span>Faculty</span>
              <Building2 className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black">{roleStats.Faculty}</div>
          </button>

          {/* Testers */}
          <button
            onClick={() => { setRoleFilter("Tester"); setCurrentPage(1); }}
            className={`p-4 rounded-2xl border text-left transition-all ${
              roleFilter === "Tester"
                ? "bg-amber-600 text-white border-amber-600 shadow-lg scale-[1.02]"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-400"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold opacity-80 mb-1">
              <span>Testers</span>
              <Code2 className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black">{roleStats.Tester}</div>
          </button>

          {/* External */}
          <button
            onClick={() => { setRoleFilter("External"); setCurrentPage(1); }}
            className={`p-4 rounded-2xl border text-left transition-all col-span-2 sm:col-span-1 ${
              roleFilter === "External"
                ? "bg-slate-700 text-white border-slate-700 shadow-lg scale-[1.02]"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            <div className="flex items-center justify-between text-xs font-semibold opacity-80 mb-1">
              <span>External</span>
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="text-xl sm:text-2xl font-black">{roleStats.External}</div>
          </button>
        </div>

        {/* Controls Bar: Search & Filters */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search anything like user_id, id, name, or email..."
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort & Page Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Role Filter Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 hidden sm:inline-block" />
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Roles ({roleStats.Total})</option>
                  <option value="Student">Student ({roleStats.Student})</option>
                  <option value="Faculty">Faculty ({roleStats.Faculty})</option>
                  <option value="Tester">Tester ({roleStats.Tester})</option>
                  <option value="External">External ({roleStats.External})</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:inline-block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="user_id">Sort by User ID</option>
                  <option value="id">Sort by ID</option>
                  <option value="email">Sort by Email</option>
                  <option value="role">Sort by Role</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-colors"
                  title="Toggle Sort Direction"
                >
                  {sortOrder === "asc" ? "↑ ASC" : "↓ DESC"}
                </button>
              </div>

              {/* Page Size */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10 / page</option>
                <option value={25}>25 / page</option>
                <option value={50}>50 / page</option>
                <option value={100}>100 / page</option>
              </select>
            </div>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>
                Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems} entries
              </span>
              {roleFilter !== "ALL" && (
                <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md text-[11px] font-medium border border-purple-200 dark:border-purple-800">
                  Role: {roleFilter}
                </span>
              )}
              {debouncedSearch && (
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md text-[11px] font-medium border border-blue-200 dark:border-blue-800">
                  Query: "{debouncedSearch}"
                </span>
              )}
            </div>
            <div>Page {currentPage} of {totalPages}</div>
          </div>
        </div>

        {/* Content Section: Loading / Error / Data */}
        {isLoading ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center space-y-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading user directory...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-semibold text-red-800 dark:text-red-300">Failed to load data</h3>
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 max-w-md mx-auto">
              {error?.response?.data?.error || error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              Retry
            </button>
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No users found</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No matching user records found. Try clearing your search query or selecting "All Roles".
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-all"
                >
                  Clear Search
                </button>
              )}
              {roleFilter !== "ALL" && (
                <button
                  onClick={() => setRoleFilter("ALL")}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-semibold transition-all"
                >
                  Reset Role Filter
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px] font-bold tracking-wider">
                      <th className="py-3.5 px-4 sm:px-6">User</th>
                      <th className="py-3.5 px-4">User ID</th>
                      <th className="py-3.5 px-4">ID</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4 text-right">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {paginatedUsers.map((user, idx) => (
                      <tr
                        key={user.id || idx}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Name + Initial Avatar */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md shrink-0">
                              {(user.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {user.name || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* User ID */}
                        <td className="py-4 px-4">
                          {user.user_id ? (
                            <div className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                              <span>{user.user_id}</span>
                              <button
                                onClick={() => handleCopy(user.user_id, "User ID")}
                                className="text-slate-400 hover:text-blue-500 transition-colors"
                                title="Copy User ID"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 text-xs italic">-</span>
                          )}
                        </td>

                        {/* ID */}
                        <td className="py-4 px-4">
                          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-200/50 dark:border-blue-900/50">
                            <span>{user.id || "N/A"}</span>
                            {user.id && (
                              <button
                                onClick={() => handleCopy(user.id, "ID")}
                                className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                                title="Copy ID"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-4 px-4">
                          {user.email ? (
                            <div className="flex items-center gap-2">
                              <a
                                href={`mailto:${user.email}`}
                                className="text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-[220px]"
                              >
                                {user.email}
                              </a>
                              <button
                                onClick={() => handleCopy(user.email, "Email")}
                                className="text-slate-400 hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100"
                                title="Copy Email"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 text-xs italic">-</span>
                          )}
                        </td>

                        {/* Role Category Badge */}
                        <td className="py-4 px-4 text-right">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${user.badgeClass}`}>
                            {user.computedRole}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {paginatedUsers.map((user, idx) => (
                <div
                  key={user.id || idx}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                          {user.name || "N/A"}
                        </h3>
                        <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${user.badgeClass}`}>
                          {user.computedRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">User ID</span>
                      <div className="flex items-center gap-1 font-mono mt-0.5 text-slate-700 dark:text-slate-300">
                        <span className="truncate">{user.user_id || "-"}</span>
                        {user.user_id && (
                          <button
                            onClick={() => handleCopy(user.user_id, "User ID")}
                            className="text-slate-400 hover:text-blue-500"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">ID</span>
                      <div className="flex items-center gap-1 font-mono mt-0.5 text-blue-600 dark:text-blue-400 font-bold">
                        <span className="truncate">{user.id || "-"}</span>
                        {user.id && (
                          <button
                            onClick={() => handleCopy(user.id, "ID")}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {user.email && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                      <a
                        href={`mailto:${user.email}`}
                        className="text-slate-600 dark:text-slate-300 hover:text-blue-600 truncate max-w-[220px]"
                      >
                        {user.email}
                      </a>
                      <button
                        onClick={() => handleCopy(user.email, "Email")}
                        className="p-1 text-slate-400 hover:text-blue-500"
                        title="Copy Email"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Page <span className="font-bold text-slate-800 dark:text-slate-200">{currentPage}</span> of{" "}
                  <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = currentPage;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white shadow-md"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

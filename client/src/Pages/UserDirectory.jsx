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
  X,
  Filter,
  GraduationCap,
  Building2,
  Code2,
  UserCheck,
  Eye,
  ExternalLink
} from "lucide-react";
import api, { getAuthenticatedHeaders } from "../api/axios.js";
import StudentReportModal from "../Component/StudentReportModal.jsx";

// Role calculation rule helper:
// user_id = Roll Number
// id = User ID
export const getUserRole = (user) => {
  const rollNo = (user.user_id || "").toLowerCase(); // user_id is Roll Number
  const userId = (user.id || "").toLowerCase();       // id is User ID
  const email = (user.email || "").trim().toLowerCase();

  // 1. Tester: Roll Number (user_id) or User ID (id) contains "test"
  if (rollNo.includes("test") || userId.includes("test")) {
    return {
      role: "Tester",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      icon: Code2,
    };
  }

  // Institutional email checks
  if (email.endsWith("@bitsathy.ac.in") || email.endsWith("@bitsathy.in")) {
    const handle = email.split("@")[0] || "";
    // 2. Student: contains .<dept><year> pattern (e.g. .cs25)
    if (/\.[a-z]{2,6}\d{2}/i.test(handle)) {
      return {
        role: "Student",
        badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        icon: GraduationCap,
      };
    }
    // 3. Faculty / Staff
    return {
      role: "Faculty",
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      icon: Building2,
    };
  }

  // 4. External
  return {
    role: "External",
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: UserCheck,
  };
};

export default function UserDirectory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [sortBy, setSortBy] = useState("name"); // name, user_id, id, email, role
  const [sortOrder, setSortOrder] = useState("asc");
  const [copiedText, setCopiedText] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

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
        RoleIcon: roleInfo.icon,
      };
    });
  }, [rawUsers]);

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

        {/* Toast Notification */}
        {copiedText && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-bounce border border-slate-700 dark:border-slate-200">
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>Copied {copiedText}</span>
          </div>
        )}

        {/* Toolbar: Search, Filters, Refresh */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Roll Number, User ID, Name, or Email..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
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

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
              {/* Role Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="dark:bg-slate-800">All Roles</option>
                  <option value="Student" className="dark:bg-slate-800">Students</option>
                  <option value="Faculty" className="dark:bg-slate-800">Faculty</option>
                  <option value="Tester" className="dark:bg-slate-800">Testers</option>
                  <option value="External" className="dark:bg-slate-800">External</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="name" className="dark:bg-slate-800">Sort by Name</option>
                  <option value="user_id" className="dark:bg-slate-800">Sort by Roll Number</option>
                  <option value="id" className="dark:bg-slate-800">Sort by User ID</option>
                  <option value="email" className="dark:bg-slate-800">Sort by Email</option>
                  <option value="role" className="dark:bg-slate-800">Sort by Role</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-1.5 py-0.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>

              {/* Page Size */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value={12} className="dark:bg-slate-800">12 / page</option>
                <option value={24} className="dark:bg-slate-800">24 / page</option>
                <option value={48} className="dark:bg-slate-800">48 / page</option>
                <option value={96} className="dark:bg-slate-800">96 / page</option>
              </select>

              {/* Refresh Button */}
              <button
                onClick={() => refetch()}
                disabled={isFetching}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 transition-all disabled:opacity-50"
                title="Refresh user list"
              >
                <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>
                Showing {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} of {totalItems} users
              </span>
              {roleFilter !== "ALL" && (
                <span className="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md text-[11px] font-semibold border border-purple-200/50 dark:border-purple-800">
                  Role: {roleFilter}
                </span>
              )}
            </div>
            <div>Page {currentPage} of {totalPages}</div>
          </div>
        </div>

        {/* Content Section: Loading / Error / User Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-2xl p-8 text-center space-y-3">
            <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base font-semibold text-red-800 dark:text-red-300">Failed to load users</h3>
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 max-w-md mx-auto">
              {error?.response?.data?.error || error?.message || "An error occurred while communicating with the database."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
            >
              Retry Connection
            </button>
          </div>
        ) : paginatedUsers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3 shadow-sm">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300">No matching users found</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              No user records matched your current query or role filter.
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
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* User Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {paginatedUsers.map((user, idx) => {
                const RoleIcon = user.RoleIcon || User;
                return (
                  <div
                    key={user.id || idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 hover:border-blue-400/50 dark:hover:border-blue-500/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top gradient glow accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-4">
                      {/* Avatar, Name, Role Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0 group-hover:scale-105 transition-transform">
                            {(user.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" title={user.name}>
                              {user.name || "Unnamed User"}
                            </h3>
                            <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${user.badgeClass}`}>
                              <RoleIcon className="w-3 h-3" />
                              {user.computedRole}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details Box: Roll Number (user_id) & User ID (id) */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 text-xs">
                        {/* Roll Number (user_id) */}
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Roll Number</span>
                          <div className="flex items-center justify-between gap-1 mt-0.5 font-mono text-slate-700 dark:text-slate-300">
                            <span className="truncate font-semibold">{user.user_id || "-"}</span>
                            {user.user_id && (
                              <button
                                onClick={() => handleCopy(user.user_id, "Roll Number")}
                                className="text-slate-400 hover:text-blue-500 transition-colors p-0.5 shrink-0"
                                title="Copy Roll Number"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* User ID (id) */}
                        <div className="min-w-0 border-l border-slate-200/60 dark:border-slate-700/60 pl-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">User ID</span>
                          <div className="flex items-center justify-between gap-1 mt-0.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                            <span className="truncate">{user.id || "-"}</span>
                            {user.id && (
                              <button
                                onClick={() => handleCopy(user.id, "User ID")}
                                className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors p-0.5 shrink-0"
                                title="Copy User ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Email address */}
                    {user.email ? (
                      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1.5 min-w-0 text-slate-600 dark:text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <a
                            href={`mailto:${user.email}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors font-medium"
                            title={user.email}
                          >
                            {user.email}
                          </a>
                        </div>
                        <button
                          onClick={() => handleCopy(user.email, "Email")}
                          className="p-1 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                          title="Copy Email"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 italic">
                        No email available
                      </div>
                    )}

                    {/* View Details Action Button */}
                    <button
                      onClick={() => {
                        const sId = user.id || user.user_id;
                        if (sId) {
                          window.open(`/student-report/${encodeURIComponent(sId)}`, "_blank");
                        } else {
                          setSelectedStudentId(user.id || user.user_id);
                        }
                      }}
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm group-hover:border-indigo-400 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Full Details Page</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-sm mt-6">
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

                  <div className="flex items-center gap-1 px-1">
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
                          className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${currentPage === pageNum
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
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

        {/* Student Report Modal */}
        {selectedStudentId && (
          <StudentReportModal
            studentId={selectedStudentId}
            onClose={() => setSelectedStudentId(null)}
          />
        )}
      </div>
    </div>
  );
}

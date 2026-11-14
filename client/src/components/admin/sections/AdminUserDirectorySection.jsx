import React, { useState, useEffect, useCallback } from "react";
import {
  Contact,
  Search,
  RefreshCw,
  Loader,
  ChevronLeft,
  ChevronRight,
  X,
  User,
} from "lucide-react";
import { listTrackerUsers } from "@/api/admin.js";
import { normalizeError } from "@/utils/adminUtils.js";
import AdminBanner from "@/components/admin/AdminBanner.jsx";

/* -- Mobile Cards View for User Directory -- */
function TrackerUserMobileView({ users, onSelectUser }) {
  return (
    <div className="space-y-3 sm:hidden">
      {users.map((u, index) => (
        <div
          key={u.id || u.user_id || index}
          onClick={() => onSelectUser(u)}
          className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2 mb-2 dark:border-zinc-800">
            <span className="font-mono text-xs font-black text-blue-600 dark:text-blue-400">
              {u.user_id || "-"}
            </span>
            <span className="rounded-md border border-zinc-900 bg-zinc-100 px-1.5 py-0.2 text-[10px] font-black uppercase text-zinc-700 dark:border-white dark:bg-zinc-800 dark:text-zinc-200">
              {u.batch || "No Batch"}
            </span>
          </div>

          <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-50 truncate">
            {u.name || "-"}
          </h4>

          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Tracker ID</span>
              <p className="font-mono font-semibold text-zinc-700 dark:text-zinc-300 truncate">{u.id || "-"}</p>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Phone</span>
              <p className="font-mono font-semibold text-zinc-700 dark:text-zinc-300 truncate">{u.phone || "-"}</p>
            </div>
            <div className="col-span-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Email</span>
              <p className="font-semibold text-zinc-700 dark:text-zinc-300 truncate">{u.email || "-"}</p>
            </div>
            {u.department && (
              <div className="col-span-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Department</span>
                <p className="font-semibold text-zinc-700 dark:text-zinc-300 truncate">{u.department}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* -- User Directory Section -- */
export default function AdminUserDirectorySection() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
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
    <section className="rounded-2xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-900 p-5 dark:border-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              User Directory
            </h2>
            <span className="rounded-md border border-zinc-900 bg-blue-50 px-2 py-0.5 text-xs font-black text-blue-700 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-300 dark:shadow-[1px_1px_0px_#ffffff]">
              {total.toLocaleString()} records
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Flexible search across tracker users data (user_id, id, name, email, batch, phone, department).
          </p>
        </div>

        <button
          type="button"
          onClick={loadUsers}
          disabled={isLoadingUsers}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoadingUsers ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          <span>{isLoadingUsers ? "Loading..." : "Refresh"}</span>
        </button>
      </div>

      <div className="p-5 space-y-4">
        {banner.message && (
          <AdminBanner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flexible: user_id, tracker id, name, email, batch, phone, department..."
            className="w-full rounded-xl border border-zinc-900 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm font-semibold text-zinc-900 shadow-[2px_2px_0px_#18181b] placeholder:text-zinc-400 focus:outline-none dark:border-white dark:bg-[#111827] dark:text-zinc-50 dark:shadow-[2px_2px_0px_#ffffff]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Table / Content */}
        {isLoadingUsers ? (
          <div className="flex h-48 items-center justify-center">
            <Loader className="h-7 w-7 animate-spin text-blue-600" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-6 dark:border-zinc-700">
            <p className="text-sm font-black text-zinc-700 dark:text-zinc-300">No tracker users found</p>
            <p className="mt-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
              Try adjusting your search terms or filter criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile View */}
            <TrackerUserMobileView users={users} onSelectUser={setSelectedUser} />

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto rounded-xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
              <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                <thead className="bg-zinc-100 dark:bg-zinc-800 text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                  <tr>
                    <th className="px-4 py-3 text-left font-black">#</th>
                    <th className="px-4 py-3 text-left font-black">User ID</th>
                    <th className="px-4 py-3 text-left font-black">ID</th>
                    <th className="px-4 py-3 text-left font-black">Name</th>
                    <th className="px-4 py-3 text-left font-black">Email</th>
                    <th className="px-4 py-3 text-left font-black">Batch</th>
                    <th className="px-4 py-3 text-left font-black">Phone</th>
                    <th className="px-4 py-3 text-left font-black">Department</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-[#111827]">
                  {users.map((u, index) => {
                    const rowNum = (page - 1) * pageSize + index + 1;
                    return (
                      <tr
                        key={u.id || u.user_id || index}
                        onClick={() => setSelectedUser(u)}
                        className="cursor-pointer transition-colors hover:bg-blue-50/60 dark:hover:bg-zinc-800/60"
                      >
                        <td className="px-4 py-3 text-xs font-black text-zinc-400 dark:text-zinc-500">{rowNum}</td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                          {u.user_id || "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-300">
                          {u.id || "-"}
                        </td>
                        <td className="px-4 py-3 font-bold text-zinc-900 dark:text-zinc-50">
                          {u.name || "-"}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
                          {u.email || "-"}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {u.batch ? (
                            <span className="rounded-md border border-zinc-900 bg-zinc-100 px-1.5 py-0.2 text-[10px] font-black uppercase text-zinc-700 dark:border-white dark:bg-zinc-800 dark:text-zinc-200">
                              {u.batch}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs font-mono font-semibold text-zinc-600 dark:text-zinc-300">
                          {u.phone || "-"}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                          {u.department || "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <span>
                  Showing{" "}
                  <span className="font-black text-zinc-900 dark:text-zinc-50">
                    {filteredTotal === 0 ? 0 : (page - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-black text-zinc-900 dark:text-zinc-50">
                    {Math.min(page * pageSize, filteredTotal)}
                  </span>{" "}
                  of{" "}
                  <span className="font-black text-zinc-900 dark:text-zinc-50">
                    {filteredTotal.toLocaleString()}
                  </span>{" "}
                  records {batchFilter || debouncedSearch || deptFilter ? `(filtered from ${total.toLocaleString()})` : ""}
                </span>

                <div className="flex items-center gap-1.5">
                  <span>Per page:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="rounded-lg border border-zinc-900 bg-white px-2 py-1 text-xs font-black text-zinc-800 outline-none shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:text-zinc-100 dark:shadow-[1.5px_1.5px_0px_#ffffff]"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={250}>250</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || isLoadingUsers}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[1.5px_1.5px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>

                <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 px-1">
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoadingUsers}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[1.5px_1.5px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-40"
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff] animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
                  {selectedUser.name || "Student Details"}
                </h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-bold mt-0.5">
                  User ID: {selectedUser.user_id || "-"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg border border-zinc-900 p-1 text-zinc-600 hover:bg-zinc-100 dark:border-white dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="font-bold text-zinc-500 dark:text-zinc-400">User ID</span>
                <span className="col-span-2 font-mono font-black text-blue-600 dark:text-blue-400">{selectedUser.user_id || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="font-bold text-zinc-500 dark:text-zinc-400">Tracker ID</span>
                <span className="col-span-2 font-mono font-bold text-zinc-800 dark:text-zinc-200">{selectedUser.id || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="font-bold text-zinc-500 dark:text-zinc-400">Name</span>
                <span className="col-span-2 font-black text-zinc-900 dark:text-zinc-50">{selectedUser.name || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="font-bold text-zinc-500 dark:text-zinc-400">Email</span>
                <span className="col-span-2 font-semibold text-zinc-800 dark:text-zinc-200">{selectedUser.email || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="font-bold text-zinc-500 dark:text-zinc-400">Batch</span>
                <span className="col-span-2 font-bold text-zinc-800 dark:text-zinc-200">{selectedUser.batch || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 border-b border-zinc-100 pb-2 dark:border-zinc-800">
                <span className="font-bold text-zinc-500 dark:text-zinc-400">Phone</span>
                <span className="col-span-2 font-mono font-bold text-zinc-800 dark:text-zinc-200">{selectedUser.phone || "-"}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="font-bold text-zinc-500 dark:text-zinc-400">Department</span>
                <span className="col-span-2 font-bold text-zinc-800 dark:text-zinc-200">{selectedUser.department || "-"}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-lg border border-zinc-900 bg-white px-4 py-2 text-xs font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
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

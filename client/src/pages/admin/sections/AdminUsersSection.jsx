import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Users,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  UserMinus,
  Loader,
  RefreshCw,
  X,
  Zap,
} from "lucide-react";
import {
  listAdminUsers,
  updateUsers,
  deleteAdminUser,
  deleteAdminUsersBatch,
  setAdminUserBlocked,
  addAdmin,
  removeAdmin,
} from "@/api/admin.js";
import {
  normalizeError,
  formatDateTime,
  isSeenToday,
  formatLastSeen,
  formatBlockedAt,
} from "../utils/adminUtils.js";
import AdminBanner from "../components/AdminBanner.jsx";
import AdminConfirmModal from "../components/AdminConfirmModal.jsx";

/* -- Mobile User Card -- */
function UserCard({
  userItem,
  onDelete,
  onToggleBlock,
  deletingUid,
  isSuper,
  onToggleAdmin,
  adminActionUid,
  isSelected,
  onToggleSelect,
}) {
  const [expanded, setExpanded] = useState(false);
  const isBlocked = Boolean(userItem.isBlocked);
  const activeToday = isSeenToday(userItem.lastSeenAt);

  return (
    <div
      className={`rounded-xl border border-zinc-900 bg-white p-3.5 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff] transition-all ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={Boolean(isSelected)}
          onChange={() => onToggleSelect(userItem.uid)}
          className="h-4 w-4 rounded border-zinc-900 text-blue-600 focus:ring-blue-500 dark:border-white"
        />
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left cursor-pointer"
        >
          {userItem.photoURL ? (
            <img
              src={userItem.photoURL}
              alt={userItem.displayName || userItem.email || "User"}
              className="h-10 w-10 shrink-0 rounded-full border border-zinc-900 object-cover dark:border-white"
              loading="lazy"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-zinc-900 bg-blue-50 text-sm font-black text-blue-600 dark:border-white dark:bg-zinc-800 dark:text-blue-400">
              {(userItem.displayName || userItem.email || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-black text-zinc-900 dark:text-zinc-50">
                {userItem.displayName || userItem.email || userItem.uid}
              </p>
              {userItem.dept_code && (
                <span className="rounded-md border border-zinc-900 bg-blue-50 px-1.5 py-0.2 text-[9px] font-black uppercase text-blue-700 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-300 dark:shadow-[1px_1px_0px_#ffffff]">
                  {userItem.dept_code}
                </span>
              )}
              {activeToday && (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
              )}
            </div>
            <p className="truncate text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {userItem.email || userItem.uid}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {activeToday && (
              <span className="hidden xs:inline-flex items-center rounded-md border border-zinc-900 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-black text-emerald-800 dark:border-white dark:bg-emerald-950 dark:text-emerald-200">
                Active today
              </span>
            )}
            {isBlocked && (
              <span className="inline-flex items-center rounded-md border border-zinc-900 bg-rose-50 px-1.5 py-0.5 text-[10px] font-black text-rose-800 dark:border-white dark:bg-rose-950 dark:text-rose-200">
                Blocked
              </span>
            )}
            {expanded ? <ChevronUp className="h-4 w-4 text-zinc-600 dark:text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />}
          </div>
        </button>
      </div>

      {expanded && (
        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-3 pt-3 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Last seen</p>
              <p className={`mt-0.5 font-bold ${activeToday ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-800 dark:text-zinc-200"}`}>
                {formatLastSeen(userItem.lastSeenAt)}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Role</p>
              <p className="mt-0.5 font-bold uppercase text-zinc-800 dark:text-zinc-200">
                {userItem.role || (userItem.isAdmin ? "admin" : "user")}
              </p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Created at</p>
              <p className="mt-0.5 text-zinc-700 dark:text-zinc-300 font-semibold">{formatDateTime(userItem.creationTime)}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Last sign in</p>
              <p className="mt-0.5 text-zinc-700 dark:text-zinc-300 font-semibold">{formatDateTime(userItem.lastSignInTime)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onToggleAdmin(userItem)}
              disabled={adminActionUid === userItem.uid}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[1.5px_1.5px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
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
            <button
              type="button"
              onClick={() => onToggleBlock(userItem.uid, !isBlocked)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-900 px-3 py-1.5 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff] transition-all cursor-pointer ${
                isBlocked ? "bg-emerald-600" : "bg-amber-600"
              }`}
            >
              <span>{isBlocked ? "Unblock" : "Block"}</span>
            </button>
            <button
              type="button"
              onClick={() => onDelete(userItem.uid)}
              disabled={deletingUid === userItem.uid}
              className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-900 bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
            >
              {deletingUid === userItem.uid ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              <span>Delete user permanently</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -- Desktop User Table -- */
function UserTable({
  users,
  onDelete,
  onToggleBlock,
  deletingUid,
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
    <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
      <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
        <thead className="bg-zinc-100 dark:bg-zinc-800 text-[11px] font-black uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
          <tr>
            <th className="w-10 px-4 py-3 text-center">
              <input
                type="checkbox"
                checked={allPageSelected}
                ref={(el) => {
                  if (el) el.indeterminate = somePageSelected;
                }}
                onChange={onToggleSelectAll}
                className="h-4 w-4 rounded border-zinc-900 text-blue-600 focus:ring-blue-500 dark:border-white"
                title="Select all on current page"
              />
            </th>
            <th className="px-4 py-3 text-left font-black">#</th>
            <th className="px-4 py-3 text-left font-black">User</th>
            <th className="px-4 py-3 text-left font-black">Last Seen</th>
            <th className="px-4 py-3 text-left font-black">Last Sign In</th>
            <th className="px-4 py-3 text-left font-black">Created At</th>
            <th className="px-4 py-3 text-left font-black">Role</th>
            <th className="px-4 py-3 text-left font-black">Status</th>
            <th className="px-4 py-3 text-right font-black">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-[#111827]">
          {users.map((userItem, index) => {
            const rowNumber = (page - 1) * pageSize + index + 1;
            const isBlocked = Boolean(userItem.isBlocked);
            const isSelected = selectedUids.has(userItem.uid);
            const activeToday = isSeenToday(userItem.lastSeenAt);

            return (
              <tr
                key={userItem.uid}
                className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60 ${
                  isSelected ? "bg-blue-50/70 dark:bg-blue-950/40" : ""
                }`}
              >
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelectUser(userItem.uid)}
                    className="h-4 w-4 rounded border-zinc-900 text-blue-600 focus:ring-blue-500 dark:border-white"
                  />
                </td>

                <td className="px-4 py-3 text-xs font-black text-zinc-400 dark:text-zinc-500">{rowNumber}</td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    {userItem.photoURL ? (
                      <img
                        src={userItem.photoURL}
                        alt={userItem.displayName || userItem.email || "User"}
                        className="h-8 w-8 shrink-0 rounded-full border border-zinc-900 object-cover dark:border-white"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-900 bg-blue-50 text-xs font-black text-blue-600 dark:border-white dark:bg-zinc-800 dark:text-blue-400">
                        {(userItem.displayName || userItem.email || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 max-w-[220px]">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-50">
                          {userItem.displayName || "No Name"}
                        </p>
                        {userItem.dept_code && (
                          <span className="rounded-md border border-zinc-900 bg-blue-50 px-1 py-0.2 text-[9px] font-black uppercase text-blue-700 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-300 dark:shadow-[1px_1px_0px_#ffffff]">
                            {userItem.dept_code}
                          </span>
                        )}
                        {activeToday && (
                          <span className="relative flex h-2 w-2 shrink-0" title="Active today">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                        {userItem.email || userItem.uid}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-3">
                  {userItem.lastSeenAt ? (
                    activeToday ? (
                      <span className="inline-flex items-center gap-1 rounded-md border border-zinc-900 bg-emerald-50 px-2 py-0.5 text-xs font-black text-emerald-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-emerald-950 dark:text-emerald-200 dark:shadow-[1px_1px_0px_#ffffff]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {formatLastSeen(userItem.lastSeenAt)}
                      </span>
                    ) : (
                      <span className="font-semibold text-xs text-zinc-600 dark:text-zinc-300">
                        {formatLastSeen(userItem.lastSeenAt)}
                      </span>
                    )
                  ) : (
                    <span className="text-xs text-zinc-400">-</span>
                  )}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  {formatDateTime(userItem.lastSignInTime)}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  {formatDateTime(userItem.creationTime)}
                </td>

                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-md border border-zinc-900 px-2 py-0.5 text-xs font-black shadow-[1px_1px_0px_#18181b] dark:border-white dark:shadow-[1px_1px_0px_#ffffff] ${
                      userItem.role === "admin" || userItem.isAdmin
                        ? "bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-200"
                        : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {userItem.isAdmin ? "admin" : userItem.role || "user"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-4 py-3">
                  {isBlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-zinc-900 bg-rose-100 px-2 py-0.5 text-xs font-black text-rose-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-rose-950 dark:text-rose-200 dark:shadow-[1px_1px_0px_#ffffff]">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                      Blocked
                    </span>
                  ) : activeToday ? (
                    <span className="inline-flex items-center gap-1 rounded-md border border-zinc-900 bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-emerald-950 dark:text-emerald-200 dark:shadow-[1px_1px_0px_#ffffff]">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-xs font-bold text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                      Normal
                    </span>
                  )}
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleAdmin(userItem)}
                      disabled={adminActionUid === userItem.uid}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-2 py-1 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[1.5px_1.5px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {adminActionUid === userItem.uid ? (
                        <Loader className="h-3 w-3 animate-spin" />
                      ) : userItem.isAdmin ? (
                        <UserMinus className="h-3 w-3" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                      <span>{userItem.isAdmin ? "Depromote" : "Promote"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleBlock(userItem.uid, !userItem.isBlocked)}
                      className={`inline-flex items-center gap-1 rounded-lg border border-zinc-900 px-2 py-1 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff] transition-all cursor-pointer ${
                        userItem.isBlocked ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-600 hover:bg-amber-700"
                      }`}
                    >
                      <span>{userItem.isBlocked ? "Unblock" : "Block"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(userItem.uid)}
                      disabled={deletingUid === userItem.uid}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-rose-600 px-2 py-1 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
                    >
                      {deletingUid === userItem.uid ? <Loader className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
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

/* -- Main Users Section -- */
export default function AdminUsersSection({ isSuper }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalBlocked, setTotalBlocked] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [batchCounts, setBatchCounts] = useState({});
  const [deptCounts, setDeptCounts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
        department: deptFilter,
        status: statusFilter,
      });
      setUsers(result.users || []);
      setTotal(result.total || 0);
      setActiveToday(result.activeToday || 0);
      setTotalAdmins(result.totalAdmins || 0);
      setTotalBlocked(result.totalBlocked || 0);
      setFilteredTotal(result.filteredTotal || 0);
      setTotalPages(result.totalPages || 1);
      setBatchCounts(result.batchCounts || {});
      setDeptCounts(result.deptCounts || {});
    } catch (error) {
      setUsers([]);
      setBanner({ type: "error", message: normalizeError(error, "Failed to load users") });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [page, pageSize, debouncedSearch, batchFilter, deptFilter, statusFilter]);

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

  const availableDepts = useMemo(() => {
    const priorityCodes = ["cs", "ec", "it", "ad", "ee", "ei", "cd", "al", "cb", "bt", "ct", "me", "mz", "ce", "bm", "ae", "ag", "ft", "tx", "fd", "se", "others"];
    const list = [];
    const seen = new Set();

    priorityCodes.forEach((code) => {
      const cnt = deptCounts[code] || 0;
      if (cnt > 0 || code === "cs" || code === "ec" || code === "it") {
        list.push({
          code,
          label: code === "others" ? "others" : code.toUpperCase(),
          count: cnt,
        });
        seen.add(code);
      }
    });

    Object.keys(deptCounts).forEach((code) => {
      if (!seen.has(code) && deptCounts[code] > 0) {
        list.push({
          code,
          label: code === "others" ? "others" : code.toUpperCase(),
          count: deptCounts[code],
        });
        seen.add(code);
      }
    });

    return list;
  }, [deptCounts]);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            setStatusFilter("all");
            setPage(1);
          }}
          className={`flex items-center justify-between rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] transition-all cursor-pointer text-left ${
            statusFilter === "all" ? "ring-2 ring-blue-600" : ""
          }`}
        >
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Total Users
            </span>
            <div className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              {total.toLocaleString()}
            </div>
            <p className="mt-0.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">All registered accounts</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[2px_2px_0px_#ffffff]">
            <Users className="h-5 w-5 stroke-[2.2]" />
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter(statusFilter === "active_today" ? "all" : "active_today");
            setPage(1);
          }}
          className={`flex items-center justify-between rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] transition-all cursor-pointer text-left ${
            statusFilter === "active_today" ? "ring-2 ring-emerald-600" : ""
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Active Today
              </span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {activeToday.toLocaleString()}
              </span>
              {total > 0 && (
                <span className="rounded-md border border-zinc-900 bg-emerald-100 px-1.5 py-0.2 text-[10px] font-black text-emerald-800 dark:border-white dark:bg-emerald-950 dark:text-emerald-200">
                  {Math.round((activeToday / total) * 100)}%
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Active today in system</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-900 bg-emerald-50 text-emerald-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-emerald-400 dark:shadow-[2px_2px_0px_#ffffff]">
            <Zap className="h-5 w-5 stroke-[2.2]" />
          </div>
        </button>
      </div>

      {/* Main Container */}
      <section className="rounded-2xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-zinc-900 p-5 dark:border-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                User Accounts
              </h2>
              <span className="rounded-md border border-zinc-900 bg-blue-50 px-2 py-0.5 text-xs font-black text-blue-700 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-300 dark:shadow-[1px_1px_0px_#ffffff]">
                {total.toLocaleString()} users
              </span>
            </div>
            <p className="mt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Manage student & faculty authentication records, privilege levels, and security blocks.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onUpdateUsers}
              disabled={isUpdatingUsers}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
            >
              {isUpdatingUsers ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              <span>{isUpdatingUsers ? "Syncing..." : "Sync Users"}</span>
            </button>
            <button
              type="button"
              onClick={loadUsers}
              disabled={isLoadingUsers}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingUsers ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {banner.message && (
            <AdminBanner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
          )}

          <AdminConfirmModal
            open={Boolean(confirmation)}
            title={
              confirmation?.type === "delete"
                ? "Delete this user?"
                : confirmation?.type === "batchDelete"
                  ? `Delete ${confirmation?.count} selected users?`
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
            tone={confirmation?.type === "admin" && !confirmation?.isAdmin ? "success" : "danger"}
            busy={isConfirming || Boolean(deletingUid) || Boolean(adminActionUid)}
            onConfirm={
              confirmation?.type === "delete" || confirmation?.type === "batchDelete"
                ? onConfirmDelete
                : confirmation?.type === "block"
                  ? onConfirmBlock
                  : onConfirmAdminToggle
            }
            onCancel={closeConfirmation}
          />

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { key: "all", label: "All Users", count: total },
                { key: "active_today", label: "Active Today", count: activeToday, hasDot: true },
                { key: "admins", label: "Admins", count: totalAdmins },
                { key: "blocked", label: "Blocked", count: totalBlocked },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setStatusFilter(tab.key);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    statusFilter === tab.key
                      ? "border-zinc-900 bg-blue-600 text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]"
                      : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-white"
                  }`}
                >
                  {tab.hasDot && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  <span>{tab.label}</span>
                  <span className="rounded-md bg-white/20 px-1.5 py-0.2 text-[10px] font-black">
                    {tab.count.toLocaleString()}
                  </span>
                </button>
              ))}
            </div>

            {(batchFilter || deptFilter || statusFilter !== "all" || debouncedSearch) && (
              <button
                type="button"
                onClick={() => {
                  setBatchFilter("");
                  setDeptFilter("");
                  setStatusFilter("all");
                  setSearchQuery("");
                  setPage(1);
                }}
                className="text-xs font-black text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Batch Filter */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-0.5">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-400 mr-1 shrink-0">Batch:</span>
                <button
                  type="button"
                  onClick={() => {
                    setBatchFilter("");
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    batchFilter === ""
                      ? "border-zinc-900 bg-blue-600 text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]"
                      : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-white"
                  }`}
                >
                  <span>All</span>
                </button>
                {allowedBatches.map((label) => {
                  const count = batchCounts[label] || 0;
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        setBatchFilter(batchFilter === label ? "" : label);
                        setPage(1);
                      }}
                      className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                        batchFilter === label
                          ? "border-zinc-900 bg-blue-600 text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]"
                          : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-white"
                      }`}
                    >
                      <span>{label}</span>
                      <span className="rounded bg-black/10 dark:bg-white/10 px-1 py-0.2 text-[10px] font-black">
                        {count.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative lg:w-80 shrink-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, UID..."
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
            </div>

            {/* Department Filter */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-400 mr-1 shrink-0">Dept:</span>
              <button
                type="button"
                onClick={() => {
                  setDeptFilter("");
                  setPage(1);
                }}
                className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                  deptFilter === ""
                    ? "border-zinc-900 bg-blue-600 text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]"
                    : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-white"
                }`}
              >
                <span>All</span>
              </button>
              {availableDepts.map((d) => (
                <button
                  key={d.code}
                  type="button"
                  onClick={() => {
                    setDeptFilter(deptFilter === d.code ? "" : d.code);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    deptFilter === d.code
                      ? "border-zinc-900 bg-blue-600 text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]"
                      : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-white"
                  }`}
                >
                  <span>{d.label}</span>
                  {d.count > 0 && (
                    <span className="rounded bg-black/10 dark:bg-white/10 px-1 py-0.2 text-[10px] font-black">
                      {d.count.toLocaleString()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Selection Action Bar */}
          {selectedUids.size > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-900 bg-blue-50 px-4 py-3 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-blue-950 dark:shadow-[2px_2px_0px_#ffffff]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-black text-blue-900 dark:text-blue-100">
                  {selectedUids.size} user{selectedUids.size === 1 ? "" : "s"} selected
                </span>
                <button
                  type="button"
                  onClick={onToggleSelectAllOnPage}
                  className="text-xs font-black text-blue-700 hover:underline dark:text-blue-300 cursor-pointer"
                >
                  {users.length > 0 && users.every((u) => selectedUids.has(u.uid)) ? "Deselect page" : "Select all on page"}
                </button>
                {users.some((u) => u.email && !u.email.toLowerCase().endsWith("@bitsathy.ac.in")) && (
                  <button
                    type="button"
                    onClick={selectNonBitsathyUsers}
                    className="rounded-md border border-zinc-900 bg-amber-400 px-2 py-0.5 text-xs font-black text-zinc-900 shadow-[1px_1px_0px_#18181b] cursor-pointer"
                  >
                    Select non-@bitsathy
                  </button>
                )}
                <button
                  type="button"
                  onClick={clearSelection}
                  className="text-xs font-bold text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 cursor-pointer"
                >
                  Clear selection
                </button>
              </div>

              <button
                type="button"
                onClick={onBatchDeleteClick}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete ({selectedUids.size})</span>
              </button>
            </div>
          )}

          {/* Table / Cards content */}
          {isLoadingUsers ? (
            <div className="flex h-56 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-900 bg-white dark:border-white dark:bg-[#111827]">
              <Loader className="h-7 w-7 animate-spin text-blue-600" />
              <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Loading user accounts...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-6 text-center dark:border-zinc-700">
              <Users className="h-8 w-8 text-zinc-300 dark:text-zinc-600 mb-2" />
              <p className="text-sm font-black text-zinc-700 dark:text-zinc-300">No users found</p>
              <p className="mt-1 text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                Try adjusting your search query, status tab, or batch filter.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile View */}
              <div className="space-y-3 sm:hidden">
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

              {/* Desktop View */}
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

              {/* Pagination Footer */}
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
                    users {batchFilter || deptFilter || statusFilter !== "all" || debouncedSearch ? `(filtered from ${total.toLocaleString()})` : ""}
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
      </section>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Pin,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Shield,
  Layers,
  MapPin,
  Calendar,
  ExternalLink,
  Phone,
  User,
  Filter,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import {
  getAdminLostFound,
  toggleAdminLostFoundPin,
  updateLostFoundStatus,
  deleteLostFoundItem,
} from "@/api/lostFound.js";
import { STATUS_LABELS } from "@/data/campusLocations.js";

export default function AdminLostFoundSection() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({
    total_items: 0,
    active_lost: 0,
    active_found: 0,
    resolved_count: 0,
    total_claims: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg, type = "success") => {
    setToastMsg({ msg, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminLostFound({
        q: searchQuery,
        type: typeFilter,
        status: statusFilter,
      });
      if (res?.success) {
        setItems(res.data || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, typeFilter, statusFilter]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Handle Pin Toggle
  const handleTogglePin = async (item) => {
    try {
      const res = await toggleAdminLostFoundPin(item.id);
      if (res?.success) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === item.id ? { ...it, is_pinned: res.is_pinned } : it
          )
        );
        showToast(res.is_pinned ? "Item pinned to top 📌" : "Item unpinned");
      }
    } catch (e) {
      showToast("Error updating pin status", "error");
    }
  };

  // Handle Status Update
  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const res = await updateLostFoundStatus(itemId, newStatus);
      if (res?.success) {
        setItems((prev) =>
          prev.map((it) => (it.id === itemId ? { ...it, status: newStatus } : it))
        );
        showToast(`Status updated to ${newStatus}`);
        if (selectedItem?.id === itemId) {
          setSelectedItem((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (e) {
      showToast("Error changing status", "error");
    }
  };

  // Handle Delete
  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to permanently delete this listing?")) return;
    try {
      const res = await deleteLostFoundItem(itemId);
      if (res?.success) {
        setItems((prev) => prev.filter((it) => it.id !== itemId));
        if (selectedItem?.id === itemId) setSelectedItem(null);
        showToast("Item listing deleted");
      }
    } catch (e) {
      showToast("Error deleting item", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div
          className={`fixed top-18 right-6 z-50 flex items-center gap-2 rounded-2xl px-4 py-2.5 shadow-xl text-white text-xs font-bold ${
            toastMsg.type === "error" ? "bg-rose-600" : "bg-emerald-600"
          }`}
        >
          <span>{toastMsg.msg}</span>
        </div>
      )}

      {/* Header & Stats Cards */}
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Campus Lost & Found Moderation
            </h2>
            <p className="text-xs text-slate-500">
              Audit campus lost/found listings, pin priority notices, and moderate claims.
            </p>
          </div>
          <button
            onClick={fetchAdminData}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-500" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Items</span>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {stats.total_items}
            </div>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 shadow-xs dark:border-rose-950 dark:bg-rose-950/20">
            <span className="text-[11px] font-bold text-rose-500 uppercase">Active Lost</span>
            <div className="mt-1 text-2xl font-black text-rose-600 dark:text-rose-400">
              {stats.active_lost}
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-xs dark:border-emerald-950 dark:bg-emerald-950/20">
            <span className="text-[11px] font-bold text-emerald-500 uppercase">Active Found</span>
            <div className="mt-1 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.active_found}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 shadow-xs dark:border-blue-950 dark:bg-blue-950/20">
            <span className="text-[11px] font-bold text-blue-500 uppercase">Resolved</span>
            <div className="mt-1 text-2xl font-black text-blue-600 dark:text-blue-400">
              {stats.resolved_count}
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, student name, roll no, or location..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">All Types</option>
            <option value="lost">Lost Only</option>
            <option value="found">Found Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold dark:border-slate-700 dark:bg-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="claimed">Claimed</option>
            <option value="handed_over">At Security</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Moderation Items Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/50">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Location & Date</th>
                <th className="px-4 py-3">Reported By</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-slate-400 font-semibold">
                    No listings found matching the filters.
                  </td>
                </tr>
              ) : (
                items.map((item) => {
                  const isLost = item.item_type === "lost";
                  const statusInfo = STATUS_LABELS[item.status] || STATUS_LABELS.active;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Item details */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.images && item.images.length > 0 ? (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800 shrink-0">
                              <Layers className="h-5 w-5" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                                {item.title}
                              </span>
                              {item.is_pinned && (
                                <Pin className="h-3 w-3 text-amber-500 fill-current shrink-0" />
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 capitalize">
                              {item.category.replace("_", " ")}
                              {item.matched_roll_number ? ` • Roll: ${item.matched_roll_number}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-black uppercase ${
                            isLost
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          }`}
                        >
                          {item.item_type}
                        </span>
                      </td>

                      {/* Location & Date */}
                      <td className="px-4 py-3">
                        <div className="text-slate-700 dark:text-slate-300 font-medium">
                          {item.location_campus}
                        </div>
                        <div className="text-[10px] text-slate-400">{item.date_occurred}</div>
                      </td>

                      {/* Reporter */}
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.user_name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {item.user_roll_no || item.user_email}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className={`rounded-xl px-2 py-1 text-[11px] font-bold border ${statusInfo.bg}`}
                        >
                          <option value="active">Active</option>
                          <option value="claimed">Claimed</option>
                          <option value="handed_over">At Security</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleTogglePin(item)}
                            className={`rounded-lg p-1.5 transition ${
                              item.is_pinned
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                            }`}
                            title={item.is_pinned ? "Unpin item" : "Pin item to top"}
                          >
                            <Pin className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => setSelectedItem(item)}
                            className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950 transition"
                            title="View full details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950 transition"
                            title="Delete listing"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-lg px-2.5 py-0.5 text-xs font-black uppercase ${
                    selectedItem.item_type === "lost"
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {selectedItem.item_type}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">
                  {selectedItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Images */}
            {selectedItem.images && selectedItem.images.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {selectedItem.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    className="h-28 w-28 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                  />
                ))}
              </div>
            )}

            <div className="mt-4 space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <b className="text-slate-900 dark:text-white">Description:</b>
                <p className="mt-0.5">{selectedItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <b className="text-slate-900 dark:text-white">Location:</b>
                  <p>{selectedItem.location_campus}</p>
                </div>
                <div>
                  <b className="text-slate-900 dark:text-white">Date Occurred:</b>
                  <p>{selectedItem.date_occurred} {selectedItem.time_occurred}</p>
                </div>
              </div>

              {selectedItem.secret_question && (
                <div>
                  <b className="text-slate-900 dark:text-white">Verification Hint:</b>
                  <p>{selectedItem.secret_question}</p>
                </div>
              )}

              <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <b className="text-slate-900 dark:text-white">Reporter Info:</b>
                <p className="mt-1">
                  Name: {selectedItem.user_name} | Email: {selectedItem.user_email}
                </p>
                {selectedItem.user_roll_no && <p>Roll No: {selectedItem.user_roll_no}</p>}
                {selectedItem.contact_phone && <p>Phone: {selectedItem.contact_phone}</p>}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
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

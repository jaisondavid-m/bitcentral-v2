import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Shield,
  ShieldAlert,
  Flag,
  UserX,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Lock,
  MessageSquare,
  Users,
  RefreshCw,
  Clock,
  Filter,
  User,
} from "lucide-react";
import {
  getAdminHelpStats,
  getAdminHelpRooms,
  getAdminHelpRoomByID,
  deleteAdminHelpMessage,
  closeAdminHelpRoom,
  getAdminHelpReports,
  actionAdminHelpReport,
  getAdminHelpRestrictions,
  updateAdminHelpRestriction,
} from "@/api/help.js";

export default function AdminHelpPage() {
  const [activeTab, setActiveTab] = useState("rooms"); // "rooms" | "reports" | "restrictions"

  // Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Rooms state
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loadingRoomDetail, setLoadingRoomDetail] = useState(false);

  // Reports state
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // Restrictions state
  const [restrictions, setRestrictions] = useState([]);
  const [loadingRestrictions, setLoadingRestrictions] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banForm, setBanForm] = useState({ target_uid: "", status: "BLOCKED", reason: "" });
  const [submittingBan, setSubmittingBan] = useState(false);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await getAdminHelpStats();
      if (data && data.data) setStats(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const data = await getAdminHelpRooms();
      if (data && data.data) setRooms(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const data = await getAdminHelpReports();
      if (data && data.data) setReports(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchRestrictions = async () => {
    setLoadingRestrictions(true);
    try {
      const data = await getAdminHelpRestrictions();
      if (data && data.data) setRestrictions(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRestrictions(false);
    }
  };

  useEffect(() => {
    fetchStats();
    if (activeTab === "rooms") fetchRooms();
    else if (activeTab === "reports") fetchReports();
    else if (activeTab === "restrictions") fetchRestrictions();
  }, [activeTab]);

  const openRoomDetail = async (roomId) => {
    setLoadingRoomDetail(true);
    try {
      const data = await getAdminHelpRoomByID(roomId);
      if (data && data.data) setSelectedRoom(data.data);
    } catch (err) {
      alert("Failed to load room transcript");
    } finally {
      setLoadingRoomDetail(false);
    }
  };

  const handleCloseRoom = async (roomId) => {
    if (!confirm("Are you sure you want to close this help request room?")) return;
    try {
      await closeAdminHelpRoom(roomId);
      if (selectedRoom) setSelectedRoom((prev) => ({ ...prev, status: "CLOSED" }));
      fetchRooms();
    } catch (err) {
      alert(err.message || "Failed to close room");
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!confirm("Are you sure you want to remove this message?")) return;
    try {
      await deleteAdminHelpMessage(msgId);
      if (selectedRoom) {
        setSelectedRoom((prev) => ({
          ...prev,
          messages: prev.messages.map((m) => (m.id === msgId ? { ...m, is_removed: true } : m)),
        }));
      }
    } catch (err) {
      alert(err.message || "Failed to remove message");
    }
  };

  const handleActionReport = async (reportId, action) => {
    try {
      await actionAdminHelpReport(reportId, action);
      fetchReports();
      fetchStats();
    } catch (err) {
      alert(err.message || "Failed to update report");
    }
  };

  const handleBanSubmit = async (e) => {
    e.preventDefault();
    setSubmittingBan(true);
    try {
      await updateAdminHelpRestriction(banForm);
      setShowBanModal(false);
      setBanForm({ target_uid: "", status: "BLOCKED", reason: "" });
      fetchRestrictions();
      fetchStats();
      alert("Help restriction updated.");
    } catch (err) {
      alert(err.message || "Failed to update ban");
    } finally {
      setSubmittingBan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-semibold text-blue-400 uppercase">
            <Shield className="w-3.5 h-3.5" /> Moderation Control Panel
          </div>
          <h2 className="text-2xl font-black mt-2">BIT Help Administration</h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Review help requests, inspect student identities, audit reports, and enforce BIT Help bans.
          </p>
        </div>

        <button
          onClick={() => {
            fetchStats();
            if (activeTab === "rooms") fetchRooms();
            else if (activeTab === "reports") fetchReports();
            else fetchRestrictions();
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Doubts</span>
          <p className="text-2xl font-extrabold text-blue-600 mt-1">{stats?.total_requests ?? "-"}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Active Doubts</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats?.active_requests ?? "-"}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Total Messages</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">{stats?.total_messages ?? "-"}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase">Pending Reports</span>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats?.pending_reports ?? "-"}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Restricted Users</span>
          <p className="text-2xl font-extrabold text-red-600 mt-1">{stats?.restricted_users ?? "-"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("rooms")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "rooms"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          All Requests & Transcripts
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
            activeTab === "reports"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          User Reports
          {stats?.pending_reports > 0 && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px]">
              {stats.pending_reports}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("restrictions")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "restrictions"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          BIT Help Bans & Restrictions
        </button>
      </div>

      {/* TAB 1: ROOMS & TRANSCRIPTS */}
      {activeTab === "rooms" && (
        <div>
          {loadingRooms ? (
            <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800">
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Doubt Title</th>
                      <th className="p-3.5">Real Creator Identity (Admin Only)</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                    {rooms.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-3.5 font-bold text-blue-600 dark:text-blue-400">{r.category}</td>
                        <td className="p-3.5 font-medium max-w-xs truncate">{r.title}</td>
                        <td className="p-3.5">
                          <div className="font-bold text-slate-900 dark:text-slate-100">{r.creator?.name || "Unknown"}</div>
                          <div className="text-[11px] text-slate-400">
                            {r.creator?.register_no ? `Reg: ${r.creator.register_no} | ` : ""}
                            {r.creator?.email}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              r.status === "OPEN"
                                ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-600"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => openRoomDetail(r.id)}
                            className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold rounded-lg hover:bg-blue-100"
                          >
                            View Chat Transcript
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REPORTS */}
      {activeTab === "reports" && (
        <div>
          {loadingReports ? (
            <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ) : reports.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
              No reports submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-600 uppercase">
                        {rep.reason}
                      </span>
                      <span className="text-xs font-bold text-slate-500">Target: {rep.target_type} ({rep.target_id})</span>
                    </div>
                    {rep.snippet && <p className="text-xs italic text-slate-600 dark:text-slate-300">"{rep.snippet}"</p>}
                    <div className="text-[11px] text-slate-400">
                      Reported by: <strong>{rep.reporter?.name}</strong> ({rep.reporter?.email}) • Status:{" "}
                      <strong className="uppercase">{rep.status}</strong>
                    </div>
                  </div>

                  {rep.status === "PENDING" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleActionReport(rep.id, "ACTIONED")}
                        className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                      >
                        Action & Resolve
                      </button>
                      <button
                        onClick={() => handleActionReport(rep.id, "DISMISSED")}
                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BANS & RESTRICTIONS */}
      {activeTab === "restrictions" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setShowBanModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
            >
              + Ban / Restrict Student from Help System
            </button>
          </div>

          {loadingRestrictions ? (
            <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/60 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3.5">Student Details</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Reason</th>
                    <th className="p-3.5">Restricted On</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {restrictions.map((r) => (
                    <tr key={r.id}>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{r.user?.name || "UID: " + r.user?.uid}</div>
                        <div className="text-[11px] text-slate-400">{r.user?.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.status === "BLOCKED" ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{r.reason || "No reason specified"}</td>
                      <td className="p-3.5 text-slate-400">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        {r.status !== "ACTIVE" && (
                          <button
                            onClick={async () => {
                              if (confirm("Unban this user from BIT Help?")) {
                                await updateAdminHelpRestriction({ target_uid: r.user.uid, status: "ACTIVE", reason: "Unbanned by admin" });
                                fetchRestrictions();
                              }
                            }}
                            className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg font-bold text-xs"
                          >
                            Unban
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ROOM DETAIL / TRANSCRIPT MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase">{selectedRoom.category}</span>
                <h3 className="font-bold text-lg">{selectedRoom.title}</h3>
                <div className="text-xs text-slate-500">
                  Real Author: <strong>{selectedRoom.creator?.name}</strong> ({selectedRoom.creator?.email} | Reg: {selectedRoom.creator?.register_no})
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selectedRoom.status === "OPEN" && (
                  <button onClick={() => handleCloseRoom(selectedRoom.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-bold">
                    Close Room
                  </button>
                )}
                <button onClick={() => setSelectedRoom(null)} className="p-2 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs leading-relaxed">
                <strong>Post Content:</strong>
                <p className="mt-1 whitespace-pre-wrap">{selectedRoom.content}</p>
              </div>

              <h4 className="font-bold text-xs uppercase text-slate-400">Full Message History ({selectedRoom.messages?.length || 0})</h4>
              {selectedRoom.messages?.map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-blue-600">
                      {m.anon_label} → Real Sender: {m.sender?.name} ({m.sender?.email} | Reg: {m.sender?.register_no})
                    </span>
                    {!m.is_removed && (
                      <button onClick={() => handleDeleteMessage(m.id)} className="text-red-500 hover:underline">
                        Delete Message
                      </button>
                    )}
                  </div>
                  {m.is_removed ? (
                    <span className="text-slate-400 italic">[Message removed by moderator]</span>
                  ) : (
                    <p className="text-slate-800 dark:text-slate-200">{m.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BAN MODAL */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-red-600">Ban / Restrict User from BIT Help</h3>
            <form onSubmit={handleBanSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Target Student Firebase UID or Email</label>
                <input
                  type="text"
                  required
                  placeholder="Enter user UID or email..."
                  value={banForm.target_uid}
                  onChange={(e) => setBanForm((prev) => ({ ...prev, target_uid: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Status</label>
                <select
                  value={banForm.status}
                  onChange={(e) => setBanForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  <option value="BLOCKED">BLOCKED (Permanent Help Ban)</option>
                  <option value="TEMPORARY_BLOCK">TEMPORARY_BLOCK</option>
                  <option value="ACTIVE">ACTIVE (Unban)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Reason</label>
                <textarea
                  rows={3}
                  placeholder="Reason for restriction..."
                  value={banForm.reason}
                  onChange={(e) => setBanForm((prev) => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowBanModal(false)} className="px-4 py-2 text-slate-500 font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={submittingBan} className="px-5 py-2 bg-red-600 text-white font-bold rounded-xl">
                  Submit Restriction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

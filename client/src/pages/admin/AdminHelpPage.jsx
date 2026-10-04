import React, { useState, useEffect, useMemo } from "react";
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
  Trash2,
  Lock,
  MessageSquare,
  Users,
  RefreshCw,
  Clock,
  Filter,
  User,
  CornerDownRight,
} from "lucide-react";
import {
  getAdminHelpStats,
  getAdminHelpMessages,
  deleteAdminHelpMessage,
  adminBlockHelpUserMessage,
  getAdminHelpReports,
  actionAdminHelpReport,
  getAdminHelpRestrictions,
  updateAdminHelpRestriction,
} from "@/api/help.js";

export default function AdminHelpPage() {
  const [activeTab, setActiveTab] = useState("messages"); // "messages" | "reports" | "restrictions"

  // Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Messages state (Single Feed & Threads)
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "main" | "replies"

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

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const data = await getAdminHelpMessages();
      if (data && data.data) setMessages(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
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
    if (activeTab === "messages") fetchMessages();
    else if (activeTab === "reports") fetchReports();
    else if (activeTab === "restrictions") fetchRestrictions();
  }, [activeTab]);

  const handleDeleteMessage = async (msgId) => {
    if (!confirm("Are you sure you want to remove this message?")) return;
    try {
      await deleteAdminHelpMessage(msgId);
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, is_removed: true } : m)));
    } catch (err) {
      alert(err.message || "Failed to remove message");
    }
  };

  const handleAdminBlockUser = async (msgId) => {
    if (
      !confirm(
        "Are you sure you want to block this user from BIT Help? They will be permanently banned from sending future messages. This message will be deleted, but their previous past messages will remain safe."
      )
    )
      return;
    try {
      await adminBlockHelpUserMessage(msgId, "Blocked by Admin from Help Moderation Page");
      alert("User banned from BIT Help chat and message deleted.");
      setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, is_removed: true } : m)));
      fetchStats();
    } catch (err) {
      alert(err.message || "Failed to block user");
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      await actionAdminHelpReport(reportId, action);
      setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: action } : r)));
      fetchStats();
    } catch (err) {
      alert(err.message || "Failed to update report");
    }
  };

  const handleSaveRestriction = async (e) => {
    e.preventDefault();
    if (!banForm.target_uid.trim()) {
      alert("Student UID / Google ID is required");
      return;
    }
    setSubmittingBan(true);
    try {
      await updateAdminHelpRestriction(banForm);
      setShowBanModal(false);
      setBanForm({ target_uid: "", status: "BLOCKED", reason: "" });
      alert("BIT Help restriction updated successfully.");
      fetchRestrictions();
      fetchStats();
    } catch (err) {
      alert(err.message || "Failed to update restriction");
    } finally {
      setSubmittingBan(false);
    }
  };

  // Filter messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      if (filterType === "main" && m.parent_id) return false;
      if (filterType === "replies" && !m.parent_id) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchContent = m.content?.toLowerCase().includes(q);
      const matchAnon = m.anon_label?.toLowerCase().includes(q);
      const matchName = m.sender?.name?.toLowerCase().includes(q);
      const matchEmail = m.sender?.email?.toLowerCase().includes(q);
      const matchRoll = m.sender?.register_no?.toLowerCase().includes(q);

      return matchContent || matchAnon || matchName || matchEmail || matchRoll;
    });
  }, [messages, searchQuery, filterType]);

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Clean Page Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" /> BIT Help Moderation
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Inspect all messages, view unmasked student identities, audit reports, and manage bans.
          </p>
        </div>
        <button
          onClick={() => {
            fetchStats();
            if (activeTab === "messages") fetchMessages();
            else if (activeTab === "reports") fetchReports();
            else if (activeTab === "restrictions") fetchRestrictions();
          }}
          className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Total Messages</span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100">{loadingStats ? "-" : stats?.total_messages || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Main Doubts</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{loadingStats ? "-" : stats?.total_requests || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Thread Replies</span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{loadingStats ? "-" : stats?.active_requests || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Pending Reports</span>
          <p className="text-2xl font-black text-amber-500">{loadingStats ? "-" : stats?.pending_reports || 0}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Restricted Users</span>
          <p className="text-2xl font-black text-red-600 dark:text-red-400">{loadingStats ? "-" : stats?.restricted_users || 0}</p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === "messages"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          Live Feed & Messages
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer relative ${
            activeTab === "reports"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          User Reports
          {stats?.pending_reports > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
              {stats.pending_reports}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("restrictions")}
          className={`px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === "restrictions"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          BIT Help Bans & Restrictions
        </button>
      </div>

      {/* TAB 1: LIVE FEED & MESSAGES */}
      {activeTab === "messages" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search messages by content, anonymous label, name, email, or roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold shrink-0">Type:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-semibold focus:outline-none"
              >
                <option value="all">All Messages</option>
                <option value="main">Main Feed Posts Only</option>
                <option value="replies">Thread Replies Only</option>
              </select>
            </div>
          </div>

          {/* Messages Feed List */}
          {loadingMessages ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading message feed...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No messages found.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border ${
                    m.is_removed
                      ? "border-red-200 dark:border-red-950/60 opacity-60"
                      : "border-slate-200 dark:border-slate-800"
                  } space-y-3 shadow-sm transition-all`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          m.parent_id
                            ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300"
                            : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                        }`}
                      >
                        {m.parent_id ? "Thread Reply" : "Main Feed Doubt"}
                      </span>
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" /> {m.anon_label}
                      </span>
                      {m.is_removed && (
                        <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-600 text-[10px] font-extrabold">
                          REMOVED
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {new Date(m.created_at).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </span>
                  </div>

                  {/* Message Content */}
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {m.content}
                  </p>

                  {/* Real Student Identity Box (Admin Unmasked) & Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                        {m.sender?.name ? m.sender.name.charAt(0) : "S"}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {m.sender?.name || "Unknown Student"}
                          {m.sender?.register_no && (
                            <span className="ml-2 font-mono text-[11px] text-blue-600 dark:text-blue-400">
                              ({m.sender.register_no})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{m.sender?.email || "No email on record"}</div>
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {!m.is_removed && (
                        <>
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/50 dark:text-slate-300 dark:hover:text-red-400 font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                            title="Delete Message"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                          <button
                            onClick={() => handleAdminBlockUser(m.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white dark:bg-red-950/60 dark:hover:bg-red-600 dark:text-red-300 font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                            title="Block User from BIT Help"
                          >
                            <UserX className="w-3.5 h-3.5" /> Block & Ban User
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: USER REPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          {loadingReports ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading user reports...</div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No user flag reports found.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Report #{r.id} • Reason: {r.reason}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        r.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : r.status === "ACTIONED"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>

                  {r.target_content && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Reported Message Content:</span>
                      <p className="text-xs text-slate-800 dark:text-slate-200">{r.target_content}</p>
                      {r.target_user?.name && (
                        <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold block pt-1">
                          Author: {r.target_user.name} ({r.target_user.email})
                        </span>
                      )}
                    </div>
                  )}

                  {r.details && (
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <strong>Reporter Notes:</strong> {r.details}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Reported by: <strong>{r.reporter?.name || "Student"}</strong> ({r.reporter?.email})
                    </span>

                    {r.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReportAction(r.id, "DISMISSED")}
                          className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleReportAction(r.id, "ACTIONED")}
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Mark Actioned
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BANS & RESTRICTIONS */}
      {activeTab === "restrictions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">BIT Help Bans & Restrictions</h3>
              <p className="text-xs text-slate-400">Restricted students are blocked from posting or replying in BIT Help.</p>
            </div>
            <button
              onClick={() => setShowBanModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <UserX className="w-4 h-4" /> Add User Ban
            </button>
          </div>

          {loadingRestrictions ? (
            <div className="py-12 text-center text-slate-400 text-xs">Loading restrictions list...</div>
          ) : restrictions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              No active student restrictions.
            </div>
          ) : (
            <div className="space-y-3">
              {restrictions.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {res.user?.name || "Student"}
                      </span>
                      {res.user?.register_no && (
                        <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">
                          ({res.user.register_no})
                        </span>
                      )}
                      <span className="px-2 py-0.2 rounded bg-red-100 text-red-700 font-black text-[10px] uppercase">
                        {res.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{res.user?.email}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Reason:</strong> {res.reason}
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      if (!confirm(`Unban ${res.user?.name || "this student"} from BIT Help?`)) return;
                      try {
                        await updateAdminHelpRestriction({ target_uid: res.user.uid, status: "ACTIVE", reason: "Unbanned by admin" });
                        alert("User restriction removed.");
                        fetchRestrictions();
                        fetchStats();
                      } catch (err) {
                        alert(err.message || "Failed to unban user");
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/60 dark:text-slate-200 dark:hover:text-emerald-300 font-bold text-xs transition-all cursor-pointer shrink-0"
                  >
                    Unban Student
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BAN MODAL */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" /> Restrict Student from BIT Help
            </h3>

            <form onSubmit={handleSaveRestriction} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase mb-1">Student UID / Google ID</label>
                <input
                  type="text"
                  placeholder="Enter student UID..."
                  value={banForm.target_uid}
                  onChange={(e) => setBanForm({ ...banForm, target_uid: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Restriction Type</label>
                <select
                  value={banForm.status}
                  onChange={(e) => setBanForm({ ...banForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                >
                  <option value="BLOCKED">BLOCKED (Permanent Help Ban)</option>
                  <option value="TEMPORARY_BLOCK">TEMPORARY_BLOCK</option>
                  <option value="ACTIVE">ACTIVE (Unban / Normal)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase mb-1">Reason</label>
                <textarea
                  rows={3}
                  placeholder="Reason for restriction..."
                  value={banForm.reason}
                  onChange={(e) => setBanForm({ ...banForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBanModal(false)}
                  className="px-4 py-2 font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBan}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Save Ban Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

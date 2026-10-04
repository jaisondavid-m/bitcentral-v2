import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  Shield,
  ShieldAlert,
  Send,
  Lock,
  Flag,
  UserX,
  X,
  RefreshCw,
  AlertCircle,
  MessageCircle,
  Search,
  CornerDownRight,
  Trash2,
  CheckCircle2,
  User,
  Users,
} from "lucide-react";
import {
  getAdminHelpStats,
  getAdminHelpMessages,
  postHelpMessage,
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
  const [newMsg, setNewMsg] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const feedContainerRef = useRef(null);

  // Active Thread State (Slack/WhatsApp style side drawer)
  const [activeThreadParent, setActiveThreadParent] = useState(null);
  const [threadInput, setThreadInput] = useState("");
  const [sendingThreadMsg, setSendingThreadMsg] = useState(false);
  const threadContainerRef = useRef(null);

  // Toast notification state
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Custom Confirmation Modals State (No window.confirm or alert)
  const [deleteModal, setDeleteModal] = useState({ show: false, msgId: null, isThread: false });
  const [blockModal, setBlockModal] = useState({
    show: false,
    msgId: null,
    studentName: "",
    studentReg: "",
    studentEmail: "",
    isThread: false,
  });

  // Reports state
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);

  // Restrictions state
  const [restrictions, setRestrictions] = useState([]);
  const [loadingRestrictions, setLoadingRestrictions] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banForm, setBanForm] = useState({ target_uid: "", status: "BLOCKED", reason: "" });
  const [submittingBan, setSubmittingBan] = useState(false);

  // Mobile Keyboard Height Handling
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const handleViewportChange = () => {
      const vv = window.visualViewport;
      const heightDiff = window.innerHeight - vv.height;
      if (heightDiff > 80) {
        setKeyboardHeight(heightDiff);
      } else {
        setKeyboardHeight(0);
      }
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);
    return () => {
      window.visualViewport.removeEventListener("resize", handleViewportChange);
      window.visualViewport.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  const scrollToBottom = (behavior = "smooth") => {
    if (feedContainerRef.current) {
      feedContainerRef.current.scrollTo({
        top: feedContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const scrollThreadToBottom = (behavior = "smooth") => {
    if (threadContainerRef.current) {
      threadContainerRef.current.scrollTo({
        top: threadContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

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

  const fetchMessages = async (showLoading = true) => {
    if (showLoading) setLoadingMessages(true);
    try {
      const data = await getAdminHelpMessages();
      if (data && data.data) setMessages(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      if (showLoading) setLoadingMessages(false);
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

  useLayoutEffect(() => {
    if (messages.length > 0 && activeTab === "messages") {
      scrollToBottom("instant");
    }
  }, [messages.length, activeTab]);

  // Main feed messages (parent_id is empty)
  const mainFeedMessages = useMemo(() => {
    return messages.filter((m) => !m.parent_id);
  }, [messages]);

  // Filter main feed by search query
  const filteredMainFeed = useMemo(() => {
    if (!searchQuery.trim()) return mainFeedMessages;
    const q = searchQuery.toLowerCase();
    return mainFeedMessages.filter(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        (m.anon_label && m.anon_label.toLowerCase().includes(q)) ||
        (m.sender?.name && m.sender.name.toLowerCase().includes(q)) ||
        (m.sender?.email && m.sender.email.toLowerCase().includes(q)) ||
        (m.sender?.register_no && m.sender.register_no.toLowerCase().includes(q))
    );
  }, [mainFeedMessages, searchQuery]);

  // Thread replies for active parent message
  const activeThreadReplies = useMemo(() => {
    if (!activeThreadParent) return [];
    return messages.filter((m) => m.parent_id === activeThreadParent.id);
  }, [messages, activeThreadParent]);

  useLayoutEffect(() => {
    if (activeThreadReplies.length > 0 && activeThreadParent) {
      scrollThreadToBottom("instant");
    }
  }, [activeThreadReplies.length, activeThreadParent]);

  // Handle Admin Post Main Feed Message
  const handleSendMainMsg = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || sendingMsg) return;
    setSendingMsg(true);
    try {
      const res = await postHelpMessage(newMsg.trim(), "");
      if (res && res.data) {
        setNewMsg("");
        fetchMessages(false);
        fetchStats();
        showToast("Message posted to chat feed");
        setTimeout(() => scrollToBottom("smooth"), 100);
      }
    } catch (err) {
      showToast(err.message || "Failed to post message");
    } finally {
      setSendingMsg(false);
    }
  };

  // Handle Admin Post Thread Reply
  const handleSendThreadMsg = async (e) => {
    e.preventDefault();
    if (!threadInput.trim() || sendingThreadMsg || !activeThreadParent) return;
    setSendingThreadMsg(true);
    try {
      const res = await postHelpMessage(threadInput.trim(), activeThreadParent.id);
      if (res && res.data) {
        setThreadInput("");
        fetchMessages(false);
        fetchStats();
        showToast("Thread reply posted");
        setTimeout(() => scrollThreadToBottom("smooth"), 100);
      }
    } catch (err) {
      showToast(err.message || "Failed to send thread reply");
    } finally {
      setSendingThreadMsg(false);
    }
  };

  // Open Delete Modal
  const openDeletePrompt = (msgId, isThread = false) => {
    setDeleteModal({ show: true, msgId, isThread });
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteModal.msgId) return;
    try {
      await deleteAdminHelpMessage(deleteModal.msgId);
      setMessages((prev) => prev.map((m) => (m.id === deleteModal.msgId ? { ...m, is_removed: true } : m)));
      showToast("Message deleted");
      fetchStats();
    } catch (err) {
      showToast(err.message || "Failed to remove message");
    } finally {
      setDeleteModal({ show: false, msgId: null, isThread: false });
    }
  };

  // Open Block & Ban Modal
  const openBlockPrompt = (msg, isThread = false) => {
    setBlockModal({
      show: true,
      msgId: msg.id,
      studentName: msg.sender?.name || "Student",
      studentReg: msg.sender?.register_no || "",
      studentEmail: msg.sender?.email || "",
      isThread,
    });
  };

  // Confirm Block & Ban Action
  const handleConfirmBlock = async () => {
    if (!blockModal.msgId) return;
    try {
      await adminBlockHelpUserMessage(blockModal.msgId, "Blocked by Admin from Help Moderation Page");
      setMessages((prev) => prev.map((m) => (m.id === blockModal.msgId ? { ...m, is_removed: true } : m)));
      showToast(`User ${blockModal.studentName} banned from BIT Connect`);
      fetchStats();
    } catch (err) {
      showToast(err.message || "Failed to block user");
    } finally {
      setBlockModal({ show: false, msgId: null, studentName: "", studentReg: "", studentEmail: "", isThread: false });
    }
  };

  const handleReportAction = async (reportId, action) => {
    try {
      await actionAdminHelpReport(reportId, action);
      setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status: action } : r)));
      fetchStats();
      showToast(`Report ${action.toLowerCase()}`);
    } catch (err) {
      showToast(err.message || "Failed to update report");
    }
  };

  const handleSaveRestriction = async (e) => {
    e.preventDefault();
    if (!banForm.target_uid.trim()) return;
    setSubmittingBan(true);
    try {
      await updateAdminHelpRestriction(banForm);
      setShowBanModal(false);
      setBanForm({ target_uid: "", status: "BLOCKED", reason: "" });
      showToast("Student restriction updated");
      fetchRestrictions();
      fetchStats();
    } catch (err) {
      showToast(err.message || "Failed to update restriction");
    } finally {
      setSubmittingBan(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors relative pb-28 sm:pb-32">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl border border-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. FIXED TOP HEADER BAR (Matching Student Help Layout) */}
      <div className="sticky top-0 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-sm z-20 space-y-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" /> BIT Connect Admin
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
              Moderator Panel
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchStats();
                if (activeTab === "messages") fetchMessages();
                else if (activeTab === "reports") fetchReports();
                else if (activeTab === "restrictions") fetchRestrictions();
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Header Tabs Navigation */}
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "messages"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Live Feed ({stats?.total_messages || 0})
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer relative ${
                activeTab === "reports"
                  ? "bg-blue-600 text-white shadow-sm"
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
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === "restrictions"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Bans & Restrictions ({stats?.restricted_users || 0})
            </button>
          </div>
        </div>

        {/* Search Input Bar in Header */}
        {activeTab === "messages" && (
          <div className="max-w-4xl mx-auto relative pt-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by content, anonymous handle, student name, email, or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. TAB 1: LIVE CHAT FEED (Identical to Student Help Feed) */}
      {activeTab === "messages" && (
        <div ref={feedContainerRef} className="flex-1 p-3 sm:p-4 space-y-3 max-w-4xl w-full mx-auto">
          {loadingMessages ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
              ))}
            </div>
          ) : filteredMainFeed.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
                {searchQuery ? "No messages found matching search query." : "No posts in help chat feed yet."}
              </p>
            </div>
          ) : (
            filteredMainFeed.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border ${
                  m.is_removed
                    ? "border-red-200 dark:border-red-950/60 opacity-60"
                    : "border-slate-200 dark:border-slate-800 shadow-sm"
                } space-y-2.5 transition-all`}
              >
                {/* Message Header (Anon Label + Timestamp + Unmasked Identity) */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                      <Lock className="w-3 h-3" />
                      <span>{m.anon_label}</span>
                    </span>

                    {/* Admin Unmasked Identity Badge */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{m.sender?.name || "Student"}</span>
                      {m.sender?.register_no && (
                        <span className="font-mono text-blue-600 dark:text-blue-400">({m.sender.register_no})</span>
                      )}
                    </span>

                    {m.is_removed && (
                      <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-600 text-[10px] font-extrabold">
                        DELETED
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>

                {/* Message Content Body */}
                <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {m.content}
                </p>

                {/* Footer Actions Row (Thread Button + Icon-only Admin Actions) */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setActiveThreadParent(m)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold text-xs transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{m.reply_count > 0 ? `${m.reply_count} Replies` : "Reply in thread"}</span>
                  </button>

                  {/* Icon-Only Action Buttons for Admin (No Text Labels) */}
                  <div className="flex items-center gap-1">
                    {!m.is_removed && (
                      <>
                        <button
                          onClick={() => openDeletePrompt(m.id, false)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openBlockPrompt(m, false)}
                          className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-950 transition-colors cursor-pointer"
                          title="Block & Ban Student"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* FLOATING BOTTOM INPUT BAR (Matching Student Help Page) */}
      {activeTab === "messages" && (
        <div
          className="fixed bottom-3 sm:bottom-6 left-0 right-0 z-30 px-3 sm:px-4 max-w-4xl mx-auto w-full transition-all duration-200 pointer-events-none"
          style={keyboardHeight > 0 ? { bottom: `${keyboardHeight + 8}px` } : {}}
        >
          <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-2 sm:p-2.5 rounded-3xl shadow-2xl shadow-blue-900/15 dark:shadow-black/60 space-y-2">
            <form onSubmit={handleSendMainMsg} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Post an official response or doubt as admin..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onFocus={() => setTimeout(() => scrollToBottom("smooth"), 150)}
                maxLength={1500}
                className="flex-1 px-4 py-2.5 sm:py-3 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={sendingMsg || !newMsg.trim()}
                className="p-3 sm:px-6 sm:py-3 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SLACK / WHATSAPP THREAD OVERLAY DRAWER */}
      <AnimatePresence>
        {activeThreadParent && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xl h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
            >
              {/* Thread Top Bar */}
              <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveThreadParent(null)}
                    className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
                    <MessageSquare className="w-4 h-4 text-blue-600" /> Thread Discussion
                  </h3>
                </div>
              </div>

              {/* Scrollable Thread Messages Area */}
              <div
                ref={threadContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
              >
                {/* Parent Question Card */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> {activeThreadParent.anon_label}
                      <span className="ml-2 font-normal text-slate-600 dark:text-slate-400">
                        ({activeThreadParent.sender?.name || "Student"})
                      </span>
                    </span>
                    <span>
                      {new Date(activeThreadParent.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">
                    {activeThreadParent.content}
                  </p>
                </div>

                <div className="text-[11px] font-bold uppercase text-slate-400 pt-1 flex items-center gap-1">
                  <CornerDownRight className="w-3 h-3" /> Replies ({activeThreadReplies.length})
                </div>

                {/* Thread Replies List */}
                {activeThreadReplies.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">No replies in this thread yet.</div>
                ) : (
                  activeThreadReplies.map((r) => (
                    <div key={r.id} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-700 dark:text-slate-300">{r.anon_label}</span>
                          <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                            {r.sender?.name || "Student"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400">
                            {new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>

                          {/* Icon-Only Admin Actions */}
                          {!r.is_removed && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => openDeletePrompt(r.id, true)}
                                className="p-1 rounded text-slate-400 hover:text-red-600 cursor-pointer"
                                title="Delete Reply"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openBlockPrompt(r, true)}
                                className="p-1 rounded text-red-500 hover:text-red-700 cursor-pointer"
                                title="Block & Ban Student"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {r.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Thread Reply Input Bar */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <form onSubmit={handleSendThreadMsg} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Reply to this thread as admin..."
                    value={threadInput}
                    onChange={(e) => setThreadInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    type="submit"
                    disabled={sendingThreadMsg || !threadInput.trim()}
                    className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-all cursor-pointer shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. TAB 2: USER REPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-4 max-w-4xl mx-auto w-full p-4">
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
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Reported Content:</span>
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
                      <strong>Notes:</strong> {r.details}
                    </p>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Reporter: <strong>{r.reporter?.name || "Student"}</strong> ({r.reporter?.email})
                    </span>

                    {r.status === "PENDING" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReportAction(r.id, "DISMISSED")}
                          className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleReportAction(r.id, "ACTIONED")}
                          className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
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

      {/* 4. TAB 3: BANS & RESTRICTIONS */}
      {activeTab === "restrictions" && (
        <div className="space-y-4 max-w-4xl mx-auto w-full p-4">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">BIT Connect Restrictions</h3>
              <p className="text-xs text-slate-400">Manage students restricted from posting or replying in BIT Connect.</p>
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
                      try {
                        await updateAdminHelpRestriction({ target_uid: res.user.uid, status: "ACTIVE", reason: "Unbanned by admin" });
                        showToast(`Unbanned ${res.user?.name || "student"}`);
                        fetchRestrictions();
                        fetchStats();
                      } catch (err) {
                        showToast(err.message || "Failed to unban user");
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

      {/* CUSTOM CONFIRM DELETE MODAL (No window.confirm) */}
      <AnimatePresence>
        {deleteModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-sm w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Delete Message</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Are you sure you want to remove this message?</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteModal({ show: false, msgId: null, isThread: false })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Delete Message
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CUSTOM CONFIRM BLOCK & BAN MODAL (No window.confirm) */}
      <AnimatePresence>
        {blockModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                  <UserX className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Block & Ban Student</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Ban <strong className="text-slate-900 dark:text-slate-100">{blockModal.studentName}</strong>{" "}
                    {blockModal.studentReg ? `(${blockModal.studentReg})` : blockModal.studentEmail} from BIT Connect?
                  </p>
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-2 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-900/40 leading-relaxed">
                    This student will be permanently banned from sending future messages. This message will be deleted, but past previous messages remain safe.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setBlockModal({ show: false, msgId: null, studentName: "", studentReg: "", studentEmail: "", isThread: false })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBlock}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Block & Ban Student
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANUAL BAN MODAL */}
      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" /> Restrict Student from BIT Connect
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
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold cursor-pointer"
                >
                  Save Restriction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

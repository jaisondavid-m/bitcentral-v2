import React, { useState, useEffect, useMemo, useRef, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  ShieldCheck,
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
  Info,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/context/StudentContext.jsx";
import { haptics } from "@/utils/haptics.js";
import {
  getHelpFeed,
  postHelpMessage,
  deleteHelpMessage,
  submitHelpReport,
  blockHelpUser,
  adminBlockHelpUserMessage,
} from "@/api/help.js";

export default function Help() {
  const { user } = useAuth();
  const userRole = (user?.role || "").toLowerCase().trim();
  const isAdmin = userRole === "admin" || userRole === "superadmin" || userRole === "super_admin";

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  // Feed & Thread state
  const [messages, setMessages] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [errorFeed, setErrorFeed] = useState(null);
  const [newMsg, setNewMsg] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgError, setMsgError] = useState(null);
  const feedContainerRef = useRef(null);

  // Active Thread State (Slack-style side drawer)
  const [activeThreadParent, setActiveThreadParent] = useState(null);
  const [threadReplies, setThreadReplies] = useState([]);
  const [loadingThread, setLoadingThread] = useState(false);
  const [threadInput, setThreadInput] = useState("");
  const [sendingThreadMsg, setSendingThreadMsg] = useState(false);
  const threadContainerRef = useRef(null);

  // Report & Block Modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTarget, setReportTarget] = useState({ type: "", id: "" });
  const [reportReason, setReportReason] = useState("Abuse");
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockTargetLabel, setBlockTargetLabel] = useState("");
  const [submittingBlock, setSubmittingBlock] = useState(false);

  // Mobile Visual Viewport & Keyboard Height Handling
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) return;

    const handleViewportChange = () => {
      const vv = window.visualViewport;
      const kHeight = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));

      if (kHeight > 60) {
        setKeyboardHeight(kHeight);
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      } else {
        setKeyboardHeight(0);
      }
    };

    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange);

    return () => {
      window.visualViewport.removeEventListener("resize", handleViewportChange);
      window.visualViewport.removeEventListener("scroll", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange);
    };
  }, []);

  const handleInputFocus = () => {
    setTimeout(() => {
      if (window.scrollY !== 0) {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      scrollToBottom("smooth");
    }, 100);
  };

  // Live PII Detection
  const piiRegex = /(?:\+?91[\-\s]?)?[6-9]\d{9}|\b(7376|2[0-9])[A-Z0-9]{4,10}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b(dm me|contact me|whatsapp me|call me|text me|ping me|mail me)\b/i;
  const hasPiiInMain = useMemo(() => piiRegex.test(newMsg), [newMsg]);
  const hasPiiInThread = useMemo(() => piiRegex.test(threadInput), [threadInput]);

  // Scroll feed to bottom (WhatsApp style - latest message visible)
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

  // Load Main Feed Messages
  const fetchFeed = async (showLoading = true) => {
    if (showLoading) setLoadingFeed(true);
    setErrorFeed(null);
    try {
      const res = await getHelpFeed("");
      if (res && res.data) {
        setMessages(res.data);
      }
    } catch (err) {
      setErrorFeed(err.message || "Failed to load chat feed");
    } finally {
      if (showLoading) setLoadingFeed(false);
    }
  };

  // Filter messages by search query
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        (m.anon_label && m.anon_label.toLowerCase().includes(q))
    );
  }, [messages, searchQuery]);

  // Load Thread Replies for a specific parent message
  const openThread = async (parentMsg) => {
    haptics.light();
    setActiveThreadParent(parentMsg);
    setLoadingThread(true);
    try {
      const res = await getHelpFeed(parentMsg.id);
      if (res && res.data) {
        setThreadReplies(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingThread(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // Auto scroll to bottom when main feed loads or updates
  useLayoutEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("instant");
    }
  }, [messages.length]);

  // Auto scroll to bottom when thread updates
  useLayoutEffect(() => {
    if (threadReplies.length > 0 && activeThreadParent) {
      scrollThreadToBottom("instant");
    }
  }, [threadReplies.length, activeThreadParent]);

  // Handle Post Main Message
  const handleSendMainMsg = async (e) => {
    e.preventDefault();
    if (!newMsg.trim() || sendingMsg) return;
    if (hasPiiInMain) {
      setMsgError("Sharing phone numbers, emails, roll numbers, or contact requests is not allowed.");
      return;
    }

    haptics.action();
    setSendingMsg(true);
    setMsgError(null);
    try {
      const res = await postHelpMessage(newMsg.trim(), "");
      if (res && res.data) {
        setMessages((prev) => [...prev, res.data]);
        setNewMsg("");
        haptics.success();
        setTimeout(() => scrollToBottom("smooth"), 100);
      }
    } catch (err) {
      haptics.error();
      setMsgError(err.message || "Failed to post message");
    } finally {
      setSendingMsg(false);
    }
  };

  // Handle Post Thread Reply
  const handleSendThreadMsg = async (e) => {
    e.preventDefault();
    if (!threadInput.trim() || sendingThreadMsg || !activeThreadParent) return;
    if (hasPiiInThread) {
      alert("Sharing phone numbers, emails, roll numbers, or contact requests is not allowed.");
      return;
    }

    haptics.action();
    setSendingThreadMsg(true);
    try {
      const res = await postHelpMessage(threadInput.trim(), activeThreadParent.id);
      if (res && res.data) {
        setThreadReplies((prev) => [...prev, res.data]);
        setThreadInput("");
        haptics.success();
        // Update reply count in main feed list
        setMessages((prev) =>
          prev.map((m) => (m.id === activeThreadParent.id ? { ...m, reply_count: (m.reply_count || 0) + 1 } : m))
        );
        setTimeout(() => scrollThreadToBottom("smooth"), 100);
      }
    } catch (err) {
      haptics.error();
      alert(err.message || "Failed to send thread reply");
    } finally {
      setSendingThreadMsg(false);
    }
  };

  // Submit Report
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    haptics.action();
    setSubmittingReport(true);
    try {
      await submitHelpReport({
        targetType: reportTarget.type,
        targetId: reportTarget.id,
        reason: reportReason,
        details: reportDetails,
      });
      setShowReportModal(false);
      setReportDetails("");
      haptics.success();
      alert("Report submitted to moderators.");
    } catch (err) {
      haptics.error();
      alert(err.message || "Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  // Delete My Message
  const handleDeleteMyMessage = async (msgId, isThreadReply = false) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    haptics.action();
    try {
      await deleteHelpMessage(msgId);
      haptics.success();
      if (isThreadReply) {
        setThreadReplies((prev) => prev.filter((m) => m.id !== msgId));
        if (activeThreadParent) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === activeThreadParent.id
                ? { ...m, reply_count: Math.max(0, (m.reply_count || 1) - 1) }
                : m
            )
          );
        }
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        if (activeThreadParent && activeThreadParent.id === msgId) {
          setActiveThreadParent(null);
        }
      }
    } catch (err) {
      haptics.error();
      alert(err.message || "Failed to delete message");
    }
  };

  // Admin Block & Ban User (Deletes clicked message & bans user from future messaging, leaving past messages intact)
  const handleAdminBlockUser = async (msgId, isThreadReply = false) => {
    if (
      !window.confirm(
        "Are you sure you want to block this user from BIT Connect? They will be permanently banned from sending future messages. This message will be deleted, but their previous past messages will remain safe."
      )
    ) {
      return;
    }
    haptics.action();
    try {
      await adminBlockHelpUserMessage(msgId, "Blocked by Admin from chat message");
      haptics.success();
      alert("User has been permanently blocked from BIT Connect and message deleted.");
      if (isThreadReply) {
        setThreadReplies((prev) => prev.filter((m) => m.id !== msgId));
        if (activeThreadParent) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === activeThreadParent.id
                ? { ...m, reply_count: Math.max(0, (m.reply_count || 1) - 1) }
                : m
            )
          );
        }
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
        if (activeThreadParent && activeThreadParent.id === msgId) {
          setActiveThreadParent(null);
        }
      }
    } catch (err) {
      haptics.error();
      alert(err.message || "Failed to block user");
    }
  };

  // Block User
  const handleBlockUserSubmit = async () => {
    if (!blockTargetLabel) return;
    haptics.action();
    setSubmittingBlock(true);
    try {
      await blockHelpUser("main", blockTargetLabel);
      setShowBlockModal(false);
      haptics.success();
      alert(`Blocked ${blockTargetLabel}. Messages from this user are now hidden.`);
      fetchFeed(false);
    } catch (err) {
      haptics.error();
      alert(err.message || "Failed to block user");
    } finally {
      setSubmittingBlock(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors relative pb-28 sm:pb-32">
      
      {/* 1. FIXED TOP HEADER BAR */}
      <div className="sticky top-0 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-2.5 shadow-sm z-20 space-y-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center gap-2">
              BIT Connect
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              <Lock className="w-3 h-3" /> Anonymous
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Privacy Info"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={() => fetchFeed(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title="Refresh Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input Bar in Header */}
        <div className="max-w-4xl mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search doubts or chat messages..."
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

        {/* Expandable Privacy Disclaimer Info */}
        <AnimatePresence>
          {showPrivacyInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-4xl mx-auto overflow-hidden"
            >
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/50 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Your identity is kept private from classmates. BIT Central retains account identity privately for abuse prevention.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. SCROLLABLE CENTER MESSAGE FEED */}
      <div
        ref={feedContainerRef}
        className="flex-1 p-3 sm:p-4 space-y-3 max-w-4xl w-full mx-auto transition-all duration-200"
        style={{
          paddingBottom: keyboardHeight > 0 ? `${keyboardHeight + 96}px` : undefined,
        }}
      >
        {loadingFeed ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-800/60 animate-pulse" />
            ))}
          </div>
        ) : errorFeed ? (
          <div className="p-6 text-center text-red-500 bg-white dark:bg-slate-900 rounded-2xl border border-red-200 text-xs">
            {errorFeed}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">
              {searchQuery ? "No messages found matching your search." : "No posts in the help chat feed yet."}
            </p>
            <p className="text-slate-400 text-[11px]">Type a doubt in the floating input bar below to start the conversation!</p>
          </div>
        ) : (
          filteredMessages.map((m) => (
            <div
              key={m.id}
              className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border ${
                m.is_mine
                  ? "border-blue-200 dark:border-blue-900/60 shadow-sm"
                  : "border-slate-200 dark:border-slate-800"
              } space-y-2.5 transition-all`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-600 dark:text-blue-400">
                  <Lock className="w-3 h-3" />
                  <span>{m.anon_label}</span>
                  {m.is_mine && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-extrabold">
                      YOU
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400">
                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {/* Message Body */}
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {m.content}
              </p>

              {/* Footer Actions / Thread Replies Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => openThread(m)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold text-xs transition-all cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{m.reply_count > 0 ? `${m.reply_count} Replies` : "Reply in thread"}</span>
                </button>

                <div className="flex items-center gap-2 text-slate-400">
                  {m.is_mine || isAdmin ? (
                    <button
                      onClick={() => handleDeleteMyMessage(m.id, false)}
                      className="hover:text-red-500 p-1 transition-colors cursor-pointer text-slate-400"
                      title={isAdmin && !m.is_mine ? "Delete Message (Admin)" : "Delete My Message"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : null}
                  {!m.is_mine && (
                    <button
                      onClick={() => {
                        setReportTarget({ type: "MESSAGE", id: m.id });
                        setShowReportModal(true);
                      }}
                      className="hover:text-amber-500 p-1 cursor-pointer text-slate-400"
                      title="Report Message"
                    >
                      <Flag className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {isAdmin && !m.is_mine && (
                    <button
                      onClick={() => handleAdminBlockUser(m.id, false)}
                      className="hover:text-red-600 p-1 cursor-pointer text-red-500"
                      title="Block & Ban User (Admin Only)"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 3. FLOATING BOTTOM INPUT CARD (Keyboard & Mobile Friendly) */}
      <div
        className="fixed bottom-3 sm:bottom-6 left-0 right-0 z-30 px-3 sm:px-4 max-w-4xl mx-auto w-full transition-all duration-200 pointer-events-none"
        style={{
          bottom: keyboardHeight > 0 ? `${keyboardHeight + 8}px` : "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="pointer-events-auto bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-2 sm:p-2.5 rounded-3xl shadow-2xl shadow-blue-900/15 dark:shadow-black/60 space-y-2">
          {msgError && (
            <div className="p-2 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 text-red-600 text-xs">
              {msgError}
            </div>
          )}

          {hasPiiInMain && (
            <div className="p-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-700 dark:text-amber-400 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Please remove contact numbers, emails, or roll numbers before sending.</span>
            </div>
          )}

          <form onSubmit={handleSendMainMsg} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a doubt or send a message anonymously..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onFocus={handleInputFocus}
              maxLength={1500}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={sendingMsg || !newMsg.trim() || hasPiiInMain}
              className="p-3 sm:px-6 sm:py-3 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* SLACK / WHATSAPP THREAD OVERLAY DRAWER */}
      <AnimatePresence>
        {activeThreadParent && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-white dark:bg-slate-900 w-full max-w-xl h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-200"
              style={{
                paddingBottom: keyboardHeight > 0 ? `${keyboardHeight}px` : undefined,
              }}
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

              {/* Scrollable Thread Messages Area (Chronological ASC - latest at bottom) */}
              <div
                ref={threadContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
              >
                {/* Parent Question Card */}
                <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-300">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> {activeThreadParent.anon_label}
                    </span>
                    <span>{new Date(activeThreadParent.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-slate-900 dark:text-slate-100 text-sm leading-relaxed whitespace-pre-wrap">
                    {activeThreadParent.content}
                  </p>
                </div>

                <div className="text-[11px] font-bold uppercase text-slate-400 pt-1 flex items-center gap-1">
                  <CornerDownRight className="w-3 h-3" /> Replies ({threadReplies.length})
                </div>

                {/* Thread Replies List */}
                {loadingThread ? (
                  <div className="py-6 text-center text-slate-400 text-xs">Loading replies...</div>
                ) : threadReplies.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">No replies in this thread yet. Be the first to help!</div>
                ) : (
                  threadReplies.map((r) => (
                    <div
                      key={r.id}
                      className={`flex flex-col ${r.is_mine ? "items-end" : "items-start"} space-y-1`}
                    >
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{r.anon_label}</span>
                        <span>•</span>
                        <span>{new Date(r.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {(r.is_mine || isAdmin) && (
                          <button
                            onClick={() => handleDeleteMyMessage(r.id, true)}
                            className="hover:text-red-500 text-slate-400 ml-1 transition-colors cursor-pointer"
                            title={isAdmin && !r.is_mine ? "Delete Reply (Admin)" : "Delete My Reply"}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        {isAdmin && !r.is_mine && (
                          <button
                            onClick={() => handleAdminBlockUser(r.id, true)}
                            className="hover:text-red-600 text-red-500 ml-1 transition-colors cursor-pointer"
                            title="Block & Ban User (Admin Only)"
                          >
                            <UserX className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <div
                        className={`p-3 rounded-2xl max-w-[90%] text-sm leading-relaxed whitespace-pre-wrap ${
                          r.is_mine
                            ? "bg-blue-600 text-white rounded-tr-none shadow-sm"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700/60"
                        }`}
                      >
                        {r.content}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Thread Fixed Bottom Input */}
              <form
                onSubmit={handleSendThreadMsg}
                className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 pb-safe"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Reply to thread anonymously..."
                    value={threadInput}
                    onChange={(e) => setThreadInput(e.target.value)}
                    onFocus={() => {
                      setTimeout(() => {
                        if (window.scrollY !== 0) window.scrollTo({ top: 0, behavior: "instant" });
                        scrollThreadToBottom("smooth");
                      }, 100);
                    }}
                    maxLength={1500}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                  <button
                    type="submit"
                    disabled={sendingThreadMsg || !threadInput.trim() || hasPiiInThread}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REPORT MODAL */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md space-y-4"
            >
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Flag className="w-5 h-5 text-amber-500" /> Report Content
              </h3>

              <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  >
                    <option value="Abuse">Abuse or Misbehavior</option>
                    <option value="Harassment">Harassment / Bullying</option>
                    <option value="Personal information">Personal Information Shared</option>
                    <option value="Spam">Spam / Advertising</option>
                    <option value="Threat">Threat / Violence</option>
                    <option value="Sexual content">Sexual Content</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Details (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Provide additional details..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 font-semibold text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* BLOCK MODAL */}
      <AnimatePresence>
        {showBlockModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md space-y-4"
            >
              <h3 className="text-lg font-bold flex items-center gap-2 text-red-600">
                <UserX className="w-5 h-5" /> Block {blockTargetLabel}?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Blocking this participant hides their posts and replies from your feed. Real identities remain completely private.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBlockModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBlockUserSubmit}
                  disabled={submittingBlock}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
                >
                  Confirm Block
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

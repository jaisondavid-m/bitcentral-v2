import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, ShieldCheck, User, Sparkles, Loader2, LogIn } from "lucide-react";
import { sendFeedbackMessage, getFeedbackMessages } from "../api/feedback.js";
import { useNavigate } from "react-router-dom";

export default function FloatingFeedbackButton() {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasUnreadAdminMsg, setHasUnreadAdminMsg] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const fetchMessages = async (markRead = false) => {
    if (!user) return;
    try {
      const data = await getFeedbackMessages(markRead);
      if (Array.isArray(data)) {
        setMessages(data);
        // Check if there are any unread admin messages
        const unread = data.some((m) => m.sender_type === "admin" && !m.is_read_by_user);
        setHasUnreadAdminMsg(unread);
      }
    } catch (err) {
      // Ignore errors silently
    }
  };

  useEffect(() => {
    if (user && isOpen) {
      setLoading(true);
      fetchMessages(true).finally(() => setLoading(false));

      const interval = setInterval(() => fetchMessages(true), 4000);
      return () => clearInterval(interval);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (user && !isOpen) {
      fetchMessages(false);
      const interval = setInterval(() => fetchMessages(false), 8000);
      return () => clearInterval(interval);
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const msgText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const displayName = user?.displayName || user?.email?.split("@")[0] || "Student";
      const sent = await sendFeedbackMessage(msgText, displayName);
      if (sent) {
        setMessages((prev) => [...prev, sent]);
      } else {
        await fetchMessages(isOpen);
      }
    } catch (err) {
      // Revert if failed
      setNewMessage(msgText);
    } finally {
      setSending(false);
    }
  };

  const handleButtonClick = () => {
    const nextOpen = !isOpen;
    setIsOpen(nextOpen);
    if (nextOpen) {
      setHasUnreadAdminMsg(false);
      fetchMessages(true);
    }
  };

  return (
    <>
      {/* Motivational Toast Pill when Admin replies */}
      <AnimatePresence>
        {hasUnreadAdminMsg && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={handleButtonClick}
            className="fixed bottom-22 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/40 hover:from-red-700 hover:to-rose-700 transition-all cursor-pointer border border-red-400/50 group"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
            </span>
            <span>Admin replied to you! Tap to read</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300 animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={handleButtonClick}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full text-white shadow-xl transition-all cursor-pointer border ${
          hasUnreadAdminMsg
            ? "bg-blue-600 shadow-red-500/40 border-red-500/60 ring-4 ring-red-500/30 animate-pulse"
            : "bg-blue-600 shadow-blue-600/30 hover:bg-blue-700 border-blue-400/40"
        }`}
        aria-label="Open Feedback Chat"
      >
        <MessageSquare className="h-6 w-6" />

        {/* Small Red Circle Indicator Badge */}
        {hasUnreadAdminMsg && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white dark:border-slate-900 text-[10px] font-black text-white items-center justify-center shadow-md">
              !
            </span>
          </span>
        )}
      </motion.button>

      {/* Chat Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[80vh] flex flex-col rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="rounded-full bg-white/20 p-2 text-white backdrop-blur-md">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    BIT-CENTRAL Support
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                  </h3>
                  <p className="text-[11px] text-blue-100 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Direct Admin Line
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60 dark:bg-slate-950/40">
              {!user ? (
                /* Unauthenticated view */
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                  <div className="rounded-full bg-blue-50 p-4 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                    <User className="h-8 w-8" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Sign in to chat with Admins
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Have a query, bug report, or feature request? Log in with your BIT student account to start a direct chat.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/login");
                    }}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all cursor-pointer mt-2"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Go to Login</span>
                  </button>
                </div>
              ) : loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 text-slate-400 dark:text-slate-500">
                  <MessageSquare className="h-10 w-10 stroke-1" />
                  <p className="text-xs font-medium">No messages yet.</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[200px]">
                    Type your message below to send feedback or report an issue directly to admins.
                  </p>
                </div>
              ) : (
                messages.map((msg, idx) => {
                  const isAdmin = msg.sender_type === "admin";
                  const timeStr = msg.created_at
                    ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "";

                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}
                    >
                      <div className="flex items-center gap-1 mb-1 px-1">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {isAdmin ? "Admin" : msg.sender_name || "You"}
                        </span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500">
                          {timeStr}
                        </span>
                      </div>

                      <div
                        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                          isAdmin
                            ? "bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs dark:bg-slate-800 dark:text-white dark:border-slate-700"
                            : "bg-blue-600 text-white rounded-tr-xs"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            {user && (
              <form
                onSubmit={handleSend}
                className="p-3 bg-white border-t border-slate-100 dark:bg-slate-900 dark:border-slate-800 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type feedback or request..."
                  className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/50"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="rounded-xl bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

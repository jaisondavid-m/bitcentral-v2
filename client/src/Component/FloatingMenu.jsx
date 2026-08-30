import React, { useState, useEffect, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  X,
  Home,
  Sparkles,
  Send,
  ShieldCheck,
  User,
  Loader2,
  LogIn,
  MessageSquare,
} from "lucide-react";
import { BiSupport, BiDonateHeart } from "react-icons/bi";
import { sendFeedbackMessage, getFeedbackMessages } from "../api/feedback.js";
import { useNavigate, useLocation } from "react-router-dom";

export default function FloatingMenu() {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Feedback Chat state
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [hasUnreadAdminMsg, setHasUnreadAdminMsg] = useState(false);
  const messagesEndRef = useRef(null);

  // Hover states for sub-buttons
  const [hoveredBtn, setHoveredBtn] = useState(null);

  const fetchMessages = async (markRead = false) => {
    if (!user) return;
    try {
      const data = await getFeedbackMessages(markRead);
      if (Array.isArray(data)) {
        setMessages(data);
        const unread = data.some(
          (m) => m.sender_type === "admin" && !m.is_read_by_user
        );
        setHasUnreadAdminMsg(unread);
      }
    } catch (err) {
      // Ignore errors silently
    }
  };

  useEffect(() => {
    if (user && isChatOpen) {
      setLoading(true);
      fetchMessages(true).finally(() => setLoading(false));
    }
  }, [user, isChatOpen]);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const msgText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const displayName =
        user?.displayName || user?.email?.split("@")[0] || "Student";
      const sent = await sendFeedbackMessage(msgText, displayName);
      if (sent) {
        setMessages((prev) => [...prev, sent]);
      } else {
        await fetchMessages(isChatOpen);
      }
    } catch (err) {
      setNewMessage(msgText);
    } finally {
      setSending(false);
    }
  };

  // Do not render floating menu if user is not logged in
  if (!user) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    if (isChatOpen) setIsChatOpen(false);
  };

  const handleOpenChat = () => {
    setIsMenuOpen(false);
    setIsChatOpen(true);
    setHasUnreadAdminMsg(false);
    fetchMessages(true);
  };

  const handleGoHome = () => {
    setIsMenuOpen(false);
    navigate("/home");
  };

  const handleSupportDev = () => {
    setIsMenuOpen(false);
    navigate("/support-dev");
  };

  return (
    <>
      {/* Motivational Toast Pill when Admin replies */}
      <AnimatePresence>
        {hasUnreadAdminMsg && !isChatOpen && !isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            onClick={handleOpenChat}
            className="fixed bottom-[5.75rem] right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/40 hover:from-red-700 hover:to-rose-700 transition-all cursor-pointer border border-red-400/50 group"
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

      {/* Sub-buttons overlay when menu is open */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-39 bg-slate-950/20 dark:bg-slate-950/50 backdrop-blur-[3px]"
            />

            {/* Menu options container stacked neatly above main FAB */}
            <div className="fixed bottom-[5.75rem] right-6 z-40 flex flex-col items-end gap-3.5 pointer-events-auto">
              {/* 3. Support Developer Button (Top) */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                transition={{ duration: 0.18, delay: 0.1 }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleSupportDev}
              >
                <span className="rounded-full bg-white/95 text-slate-800 border border-slate-200/90 shadow-xl backdrop-blur-md dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-700/70 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                  Support Developer ❤️
                </span>

                <div className="w-14 flex items-center justify-center shrink-0">
                  <button
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-white/95 border border-slate-200/90 shadow-lg backdrop-blur-md group-hover:border-rose-500/80 group-hover:bg-rose-50 dark:bg-slate-900/95 dark:border-slate-700/80 dark:group-hover:bg-slate-800 group-hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label="Support Developer"
                  >
                    <BiDonateHeart className="h-5 w-5 text-rose-500 dark:text-rose-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors" />
                  </button>
                </div>
              </motion.div>

              {/* 2. Feedback / Chat Support Button (Middle) */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                transition={{ duration: 0.18, delay: 0.05 }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleOpenChat}
              >
                <span className="rounded-full bg-white/95 text-slate-800 border border-slate-200/90 shadow-xl backdrop-blur-md dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-700/70 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                  Help & Feedback 🎧
                </span>

                <div className="w-14 flex items-center justify-center shrink-0">
                  <button
                    className="relative flex items-center justify-center h-12 w-12 rounded-full bg-white/95 border border-slate-200/90 shadow-lg backdrop-blur-md group-hover:border-blue-500/80 group-hover:bg-blue-50 dark:bg-slate-900/95 dark:border-slate-700/80 dark:group-hover:bg-slate-800 group-hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label="Admin Feedback"
                  >
                    <BiSupport className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors" />
                    {hasUnreadAdminMsg && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-black shadow-md">
                        !
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>

              {/* 1. Home Button (Bottom-most above main fab) */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                transition={{ duration: 0.18, delay: 0 }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleGoHome}
              >
                <span className="rounded-full bg-white/95 text-slate-800 border border-slate-200/90 shadow-xl backdrop-blur-md dark:bg-slate-900/95 dark:text-slate-100 dark:border-slate-700/70 px-3.5 py-1.5 text-xs font-bold whitespace-nowrap group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
                  Home Page 🏠
                </span>

                <div className="w-14 flex items-center justify-center shrink-0">
                  <button
                    className="flex items-center justify-center h-12 w-12 rounded-full bg-white/95 border border-slate-200/90 shadow-lg backdrop-blur-md group-hover:border-indigo-500/80 group-hover:bg-indigo-50 dark:bg-slate-900/95 dark:border-slate-700/80 dark:group-hover:bg-slate-800 group-hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    aria-label="Go to Home"
                  >
                    <Home className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors" />
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main Trigger FAB Button */}
      <motion.button
        onClick={toggleMenu}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full text-white bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl shadow-blue-600/35 border border-blue-400/30 hover:from-blue-700 hover:to-indigo-800 transition-all cursor-pointer group"
        aria-label="Toggle Quick Navigation Menu"
      >
        {/* Subtle Ping Ring */}
        {hasUnreadAdminMsg && !isMenuOpen && (
          <span className="absolute -inset-0.5 rounded-full bg-red-500/40 animate-ping opacity-60 pointer-events-none" />
        )}

        {/* Rotating Icon */}
        <motion.div
          animate={{ rotate: isMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <LayoutGrid className="h-6 w-6 text-white" />
        </motion.div>

        {/* Unread Badge Indicator on main FAB */}
        {hasUnreadAdminMsg && !isMenuOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 border-2 border-white text-[10px] font-black text-white shadow-md">
            !
          </span>
        )}
      </motion.button>

      {/* Chat Drawer Overlay */}
      <AnimatePresence>
        {isChatOpen && (
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
                    <BiSupport className="h-5 w-5" />
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
                onClick={() => setIsChatOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60 dark:bg-slate-950/40">
              {loading ? (
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
                    ? new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "";

                  return (
                    <div
                      key={msg.id || idx}
                      className={`flex flex-col ${
                        isAdmin ? "items-start" : "items-end"
                      }`}
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
            </div>

            {/* Input Footer */}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

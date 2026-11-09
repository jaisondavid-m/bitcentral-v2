import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/StudentContext.jsx";
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
  Users,
} from "lucide-react";
import { BiSupport, BiDonateHeart } from "react-icons/bi";
import { sendFeedbackMessage, getFeedbackMessages } from "@/api/feedback.js";
import { useNavigate, useLocation } from "react-router-dom";
import { haptics } from "@/utils/haptics.js";


export default function FloatingMenu() {
  const { user } = useAuth();
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
  const isFetchingRef = useRef(false);

  const fetchMessages = async (markRead = false) => {
    if (!user || isFetchingRef.current) return;
    isFetchingRef.current = true;
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
      console.error("Failed to fetch feedback messages", err);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const userIdentifier = user?.email || user?.uid || user?.roll_no || "";

  useEffect(() => {
    if (userIdentifier && isChatOpen) {
      setLoading(true);
      fetchMessages(true).finally(() => setLoading(false));
    }
  }, [userIdentifier, isChatOpen]);

  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (isChatOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isChatOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    haptics.action();
    const msgText = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      const displayName =
        user?.display_name || user?.displayName || user?.name || user?.roll_no || "Student";
      const sent = await sendFeedbackMessage(msgText, displayName);
      haptics.success();
      if (sent) {
        setMessages((prev) => [...prev, sent]);
      } else {
        await fetchMessages(isChatOpen);
      }
    } catch (err) {
      haptics.error();
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
    haptics.light();
    setIsMenuOpen((prev) => !prev);
    if (isChatOpen) setIsChatOpen(false);
  };

  const handleOpenChat = () => {
    haptics.light();
    setIsMenuOpen(false);
    setIsChatOpen(true);
    setHasUnreadAdminMsg(false);
  };

  const handleGoHome = () => {
    haptics.light();
    setIsMenuOpen(false);
    navigate("/home");
  };

  const handleFacultyDirectory = () => {
    haptics.light();
    setIsMenuOpen(false);
    navigate("/faculty-directory");
  };

  const handleSupportDev = () => {
    haptics.light();
    setIsMenuOpen(false);
    navigate("/support-dev");
  };

  const isHelpPage = location.pathname === "/help";

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
            className={`fixed ${isHelpPage ? "bottom-[11.5rem] sm:bottom-[12.5rem]" : "bottom-[5.25rem]"} right-6 z-40 flex items-center gap-2 rounded-lg border border-zinc-900 bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2.5px_2.5px_0px_#18181b] hover:bg-rose-700 dark:border-zinc-100 dark:shadow-[2.5px_2.5px_0px_#fafafa] transition-all cursor-pointer group`}
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
              className="fixed inset-0 z-39 bg-black/40 backdrop-blur-xs"
            />

            {/* Menu options container stacked neatly above main FAB */}
            <div className={`fixed ${isHelpPage ? "bottom-[11.5rem] sm:bottom-[12.5rem]" : "bottom-20"} right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto`}>
              {/* 3. Support Developer Button (Top) */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                transition={{ duration: 0.18, delay: 0.1 }}
                className="flex items-center gap-2.5 cursor-pointer group"
                onClick={handleSupportDev}
              >
                <span className="rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-50 dark:shadow-[2px_2px_0px_#fafafa] whitespace-nowrap group-hover:bg-rose-50 dark:group-hover:bg-zinc-800 transition-colors">
                  Support Developer ❤️
                </span>

                <div className="w-12 flex items-center justify-center shrink-0">
                  <button
                    className="flex items-center justify-center h-10 w-10 rounded-lg border border-zinc-900 bg-white shadow-[2px_2px_0px_#18181b] hover:bg-rose-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 dark:border-zinc-100 dark:bg-zinc-800 dark:shadow-[2px_2px_0px_#fafafa] dark:hover:shadow-[3px_3px_0px_#fafafa] transition-all cursor-pointer"
                    aria-label="Support Developer"
                  >
                    <BiDonateHeart className="h-5 w-5 text-rose-500 dark:text-rose-400 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </motion.div>

              {/* 2. Feedback / Chat Support Button (Middle) */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.8 }}
                transition={{ duration: 0.18, delay: 0.05 }}
                className="flex items-center gap-2.5 cursor-pointer group"
                onClick={handleOpenChat}
              >
                <span className="rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-50 dark:shadow-[2px_2px_0px_#fafafa] whitespace-nowrap group-hover:bg-blue-50 dark:group-hover:bg-zinc-800 transition-colors">
                  Help & Feedback 🎧
                </span>

                <div className="w-12 flex items-center justify-center shrink-0">
                  <button
                    className="relative flex items-center justify-center h-10 w-10 rounded-lg border border-zinc-900 bg-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 dark:border-zinc-100 dark:bg-zinc-800 dark:shadow-[2px_2px_0px_#fafafa] dark:hover:shadow-[3px_3px_0px_#fafafa] transition-all cursor-pointer"
                    aria-label="Admin Feedback"
                  >
                    <BiSupport className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                    {hasUnreadAdminMsg && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-md border border-zinc-900 bg-rose-600 text-white text-[9px] font-black dark:border-zinc-100">
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
                className="flex items-center gap-2.5 cursor-pointer group"
                onClick={handleGoHome}
              >
                <span className="rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] dark:border-zinc-100 dark:bg-zinc-900 dark:text-zinc-50 dark:shadow-[2px_2px_0px_#fafafa] whitespace-nowrap group-hover:bg-blue-50 dark:group-hover:bg-zinc-800 transition-colors">
                  Home Page 🏠
                </span>

                <div className="w-12 flex items-center justify-center shrink-0">
                  <button
                    className="flex items-center justify-center h-10 w-10 rounded-lg border border-zinc-900 bg-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-50 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 dark:border-zinc-100 dark:bg-zinc-800 dark:shadow-[2px_2px_0px_#fafafa] dark:hover:shadow-[3px_3px_0px_#fafafa] transition-all cursor-pointer"
                    aria-label="Go to Home"
                  >
                    <Home className="h-5 w-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
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
        whileTap={{ scale: 0.95 }}
        className={`fixed ${isHelpPage ? "bottom-28 sm:bottom-32" : "bottom-6"} right-6 z-40 flex items-center justify-center h-12 w-12 rounded-xl text-white bg-blue-600 border border-zinc-900 shadow-[3px_3px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#18181b] dark:border-zinc-100 dark:shadow-[3px_3px_0px_#fafafa] dark:hover:shadow-[4px_4px_0px_#fafafa] transition-all cursor-pointer group`}
        aria-label="Toggle Quick Navigation Menu"
      >
        {/* Subtle Ping Ring */}
        {hasUnreadAdminMsg && !isMenuOpen && (
          <span className="absolute -inset-0.5 rounded-xl bg-rose-500/40 animate-ping opacity-60 pointer-events-none" />
        )}

        {/* Rotating Icon */}
        <motion.div
          animate={{ rotate: isMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isMenuOpen ? <X className="h-5 w-5 text-white" /> : <LayoutGrid className="h-5 w-5 text-white" />}
        </motion.div>

        {/* Unread Badge Indicator on main FAB */}
        {hasUnreadAdminMsg && !isMenuOpen && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-md bg-rose-600 border border-zinc-900 text-[10px] font-black text-white shadow-none dark:border-zinc-100">
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
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] max-h-[80vh] flex flex-col rounded-xl border border-zinc-900 bg-white shadow-[6px_6px_0px_#18181b] dark:border-zinc-100 dark:bg-zinc-900 dark:shadow-[6px_6px_0px_#fafafa] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-zinc-900 bg-blue-600 text-white shrink-0 dark:border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="rounded-lg border border-zinc-900 bg-white text-blue-600 p-1.5 shadow-[1.5px_1.5px_0px_#18181b] dark:border-zinc-100">
                    <BiSupport className="h-4.5 w-4.5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border border-zinc-900 dark:border-zinc-100" />
                </div>
                <div>
                  <h3 className="font-black text-sm leading-tight flex items-center gap-1.5">
                    BIT-CENTRAL Support
                    <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
                  </h3>
                  <p className="text-[11px] font-semibold text-blue-100 flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Direct Admin Line
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded-lg border border-zinc-900 bg-white/20 p-1 text-white hover:bg-white/30 transition-colors cursor-pointer dark:border-zinc-100"
                aria-label="Close Chat"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Body */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50 dark:bg-zinc-950">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2 text-zinc-400 dark:text-zinc-500">
                  <MessageSquare className="h-10 w-10 stroke-1" />
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">No messages yet.</p>
                  <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 max-w-[200px]">
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
                        <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                          {isAdmin ? "Admin" : msg.sender_name || "You"}
                        </span>
                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500">
                          {timeStr}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] rounded-lg px-3.5 py-2 text-xs font-medium leading-relaxed ${
                          isAdmin
                            ? "bg-white text-zinc-900 border border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] dark:bg-zinc-800 dark:text-white dark:border-zinc-700 dark:shadow-none"
                            : "bg-blue-600 text-white border border-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] dark:border-zinc-100"
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
              className="p-3 bg-white border-t border-zinc-900 dark:bg-zinc-900 dark:border-zinc-100 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type feedback or request..."
                className="flex-1 rounded-lg border border-zinc-900 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-blue-600"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="rounded-lg border border-zinc-900 bg-blue-600 p-2 text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 dark:border-zinc-100 dark:shadow-[2px_2px_0px_#fafafa] transition-all cursor-pointer"
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

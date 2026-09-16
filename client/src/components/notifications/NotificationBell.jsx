import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  X,
  Sparkles,
  AlertTriangle,
  GraduationCap,
  CalendarDays,
  Info,
  Zap,
  ExternalLink,
  ChevronRight,
  Inbox,
  Clock,
  Trash2,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  dismissNotification,
} from "@/api/notifications.js";
import { useAuth } from "@/context/StudentContext.jsx";

function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 45) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172800) return "Yesterday";
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

function getNotificationIcon(type, priority) {
  if (priority === "urgent" || type === "alert") {
    return {
      icon: AlertTriangle,
      bg: "bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-900/60",
    };
  }
  switch (type) {
    case "announcement":
      return {
        icon: Sparkles,
        bg: "bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900/60",
      };
    case "exam":
      return {
        icon: GraduationCap,
        bg: "bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-900/60",
      };
    case "leave":
      return {
        icon: CalendarDays,
        bg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
      };
    case "update":
      return {
        icon: Zap,
        bg: "bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 border-purple-200 dark:border-purple-900/60",
      };
    default:
      return {
        icon: Info,
        bg: "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 border-sky-200 dark:border-sky-900/60",
      };
  }
}

export default function NotificationBell({ className = "" }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const modalRef = useRef(null);

  // Fetch notifications
  const fetchNotifs = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    try {
      const res = await getUserNotifications();
      if (res?.success && Array.isArray(res?.data)) {
        setNotifications(res.data);
        setUnreadCount(res.unread_count || 0);
      }
    } catch (e) {
      // Ignore silently
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  // Polling every 60s
  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(() => {
      fetchNotifs(true);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifs]);

  // Handle click outside & escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filtered notifications
  const filteredList = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((n) => !n.is_read);
    }
    if (activeTab === "broadcast") {
      return notifications.filter((n) => n.target_type === "all");
    }
    if (activeTab === "direct") {
      return notifications.filter((n) => n.target_type !== "all");
    }
    return notifications;
  }, [notifications, activeTab]);

  // Mark single as read
  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await markNotificationAsRead(id);
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
    await markAllNotificationsAsRead();
  };

  // Dismiss notification
  const handleDismiss = async (id, e) => {
    if (e) e.stopPropagation();
    const target = notifications.find((n) => n.id === id);
    if (target && !target.is_read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await dismissNotification(id);
  };

  // Handle Action CTA click
  const handleActionClick = async (notif) => {
    if (!notif.is_read) {
      await handleMarkAsRead(notif.id);
    }
    setIsOpen(false);
    if (notif.link_url) {
      if (notif.link_url.startsWith("http")) {
        window.open(notif.link_url, "_blank", "noopener,noreferrer");
      } else {
        navigate(notif.link_url);
      }
    }
  };

  return (
    <div className={`relative ${className}`} ref={modalRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchNotifs(true);
        }}
        className="relative flex items-center justify-center h-9 w-9 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label="Open notifications"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-blue-600 dark:ring-black animate-in zoom-in duration-200">
            {unreadCount > 99 ? "99+" : unreadCount}
            <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75" />
          </span>
        )}
      </button>

      {/* Popover Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Card Flyout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="fixed inset-x-3 top-16 z-50 mx-auto max-w-md rounded-3xl border border-slate-200/90 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[420px] sm:max-w-none text-left"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span>Mark all read</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:text-slate-500 dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 pt-3 pb-2">
                {[
                  { key: "all", label: "All" },
                  { key: "unread", label: `Unread (${unreadCount})` },
                  { key: "broadcast", label: "Announcements" },
                  { key: "direct", label: "Direct" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold transition ${
                      activeTab === tab.key
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Notification List Scroll Area */}
              <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 pr-1 -mr-1">
                {loading && notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                    <p className="mt-2 text-xs font-semibold text-slate-500">Checking for updates...</p>
                  </div>
                ) : filteredList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {activeTab === "unread"
                        ? "All caught up! 🎉"
                        : "No notifications right now"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {activeTab === "unread"
                        ? "You have read all your notifications."
                        : "Campus broadcasts and updates will appear here."}
                    </p>
                  </div>
                ) : (
                  filteredList.map((notif) => {
                    const { icon: IconComponent, bg: iconBg } = getNotificationIcon(
                      notif.type,
                      notif.priority
                    );
                    const isUnread = !notif.is_read;

                    return (
                      <div
                        key={notif.id}
                        onClick={() => handleActionClick(notif)}
                        className={`group relative flex items-start gap-3 p-3 transition-colors cursor-pointer rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                          isUnread
                            ? "bg-blue-50/40 dark:bg-blue-950/20"
                            : "opacity-85 hover:opacity-100"
                        }`}
                      >
                        {/* Type Icon */}
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${iconBg} shadow-2xs mt-0.5`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <h4
                                className={`text-xs font-bold truncate ${
                                  isUnread
                                    ? "text-slate-900 dark:text-white"
                                    : "text-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {notif.title}
                              </h4>
                              {isUnread && (
                                <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                              {formatRelativeTime(notif.created_at)}
                            </span>
                          </div>

                          <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>

                          {/* Action CTA link if provided */}
                          {notif.link_url && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 group-hover:underline">
                              <span>{notif.link_text || "View details"}</span>
                              <ChevronRight className="h-3 w-3" />
                            </div>
                          )}
                        </div>

                        {/* Dismiss & Read Actions on Hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isUnread && (
                            <button
                              onClick={(e) => handleMarkAsRead(notif.id, e)}
                              className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/80 hover:text-slate-700 dark:hover:bg-slate-700"
                              title="Mark as read"
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDismiss(notif.id, e)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                            title="Dismiss"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  BIT-CENTRAL Live Dispatch
                </span>
                <span>{notifications.length} total messages</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

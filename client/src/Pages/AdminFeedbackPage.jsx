import React, { useState, useEffect, useRef } from "react";
import {
  getAdminFeedbackConversations,
  getAdminFeedbackMessages,
  sendAdminFeedbackReply,
} from "../api/feedback.js";
import {
  MessageSquare,
  Search,
  RefreshCw,
  Send,
  User,
  Loader2,
  Inbox,
  Sparkles,
} from "lucide-react";

export default function AdminFeedbackPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const fetchConversations = async () => {
    try {
      const data = await getAdminFeedbackConversations();
      if (Array.isArray(data)) {
        setConversations(data);
      }
    } catch (err) {
      // Ignore or log error
    } finally {
      setLoadingConvs(false);
    }
  };

  const fetchMessagesForUser = async (userUid) => {
    if (!userUid) return;
    try {
      const data = await getAdminFeedbackMessages(userUid);
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      // Ignore
    } finally {
      setLoadingMsgs(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedUser?.user_uid) {
      setLoadingMsgs(true);
      fetchMessagesForUser(selectedUser.user_uid);
      const interval = setInterval(() => fetchMessagesForUser(selectedUser.user_uid), 4000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectUser = (conv) => {
    setSelectedUser(conv);
    // Optimistically update unread count in state
    setConversations((prev) =>
      prev.map((c) => (c.user_uid === conv.user_uid ? { ...c, unread_count: 0 } : c))
    );
  };

  const handleSendReply = async (textToSend) => {
    const text = (textToSend || replyText).trim();
    if (!text || !selectedUser || sending) return;

    setReplyText("");
    setSending(true);

    try {
      const sent = await sendAdminFeedbackReply(selectedUser.user_uid, text);
      if (sent) {
        setMessages((prev) => [...prev, sent]);
        // Update conversation last message in list
        setConversations((prev) =>
          prev.map((c) =>
            c.user_uid === selectedUser.user_uid
              ? { ...c, last_message: text, last_activity: new Date().toISOString() }
              : c
          )
        );
      } else {
        await fetchMessagesForUser(selectedUser.user_uid);
      }
    } catch (err) {
      setReplyText(text);
    } finally {
      setSending(false);
    }
  };

  const quickReplies = [
    "Updated and fixed the issue! 👍",
    "Thanks for reporting! We are investigating now. 🔍",
    "This issue is now resolved. Please check! ✅",
    "Thank you for your valuable feedback! ❤️",
  ];

  const filteredConversations = conversations.filter(
    (c) =>
      (c.user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.user_email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.last_message || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 dark:bg-black dark:text-white flex flex-col">
      {/* Header Bar */}
      <div className="border-b border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white flex items-center gap-2">
              <span>User Feedback & Support Chats</span>
              {totalUnread > 0 && (
                <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white animate-pulse">
                  {totalUnread} New
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct communication line with BIT-CENTRAL students & users
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setLoadingConvs(true);
            fetchConversations();
          }}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${loadingConvs ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left Column: Conversations List */}
        <div className="md:col-span-4 lg:col-span-4 border-r border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900/60 flex flex-col h-full">
          {/* Search Box */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search students or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200/80 pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {loadingConvs ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 dark:text-slate-500">
                <Inbox className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No feedback conversations found.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedUser?.user_uid === conv.user_uid;
                const timeStr = conv.last_activity
                  ? new Date(conv.last_activity).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "";

                return (
                  <div
                    key={conv.user_uid}
                    onClick={() => handleSelectUser(conv)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                      isSelected
                        ? "bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600 dark:border-blue-500"
                        : ""
                    }`}
                  >
                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-2 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                      <User className="h-4 w-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {conv.user_name || "Student"}
                        </h4>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                          {timeStr}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {conv.user_email}
                      </p>

                      <p className="text-xs text-slate-700 dark:text-slate-300 truncate mt-1 italic font-medium">
                        "{conv.last_message}"
                      </p>
                    </div>

                    {conv.unread_count > 0 && (
                      <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-extrabold text-white shrink-0">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Chat Transcript */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col bg-slate-50/50 dark:bg-black h-full">
          {!selectedUser ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400 dark:text-slate-500 space-y-3">
              <MessageSquare className="h-12 w-12 stroke-1 opacity-40 text-blue-500" />
              <div>
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No Conversation Selected
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm">
                  Select a student conversation from the left panel to inspect messages and send responses.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Selected User Header */}
              <div className="p-4 border-b border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-50 dark:bg-blue-950/60 p-2 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedUser.user_name || "Student"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedUser.user_email} • UID:{" "}
                      <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        {selectedUser.user_uid}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Transcript */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70 dark:bg-slate-950/40">
                {loadingMsgs ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 py-8">No message transcript.</p>
                ) : (
                  messages.map((m, idx) => {
                    const isAdmin = m.sender_type === "admin";
                    const timeStr = m.created_at
                      ? new Date(m.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "";

                    return (
                      <div
                        key={m.id || idx}
                        className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {isAdmin ? "Admin (You)" : m.sender_name || "Student"}
                          </span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-500">{timeStr}</span>
                        </div>

                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                            isAdmin
                              ? "bg-blue-600 text-white rounded-tr-xs"
                              : "bg-white text-slate-900 border border-slate-200/80 rounded-tl-xs dark:bg-slate-800 dark:text-white dark:border-slate-700"
                          }`}
                        >
                          {m.message}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Pills */}
              <div className="p-2.5 border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] shrink-0">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 whitespace-nowrap pl-1">
                  Quick Reply:
                </span>
                {quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendReply(qr)}
                    disabled={sending}
                    className="rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 px-3 py-1 text-[11px] text-slate-700 font-medium whitespace-nowrap dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-950/60 dark:hover:border-blue-500 dark:border-slate-700 transition-all cursor-pointer"
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendReply();
                }}
                className="p-3.5 border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type admin response (e.g. Updated and fixed the issue!)..."
                  className="flex-1 rounded-xl bg-slate-50 border border-slate-200/80 px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/40"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || sending}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

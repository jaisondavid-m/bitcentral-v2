import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  Utensils, 
  Award, 
  BookOpen, 
  Search, 
  Calendar, 
  RefreshCw,
  Cpu,
  ChevronDown
} from "lucide-react";
import { sendChatMessage } from "@/api/chat";

const QUICK_PROMPTS = [
  { label: "Today's Mess Menu 🍱", prompt: "What is today's boys mess menu?", icon: Utensils },
  { label: "Check Reward Points 🏆", prompt: "Check reward points balance for 7376231CS106", icon: Award },
  { label: "Search Faculty Phone 📞", prompt: "Search contact details of CSE faculty", icon: Search },
  { label: "Exam Hall Location 📍", prompt: "What is my exam hall location?", icon: BookOpen },
  { label: "Upcoming Leaves 🌴", prompt: "Show upcoming college leaves and holidays", icon: Calendar },
];

export default function AIChatAssistant({ isOpen, onClose, currentRollNo = "" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm **BitBot**, your AI assistant powered by **Google Gemini 2.0 Flash** on BitCentral's MCP Server. How can I help you today?",
      toolsUsed: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend) => {
    const queryText = (textToSend || input).trim();
    if (!queryText || isLoading) return;

    const userMessage = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Format previous messages for context
    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role, content: m.content }));

    const res = await sendChatMessage({
      message: queryText,
      history,
      rollNo: currentRollNo,
    });

    setIsLoading(false);

    if (res.success) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.message,
          toolsUsed: res.tools_used || [],
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.message || `⚠️ ${res.error || "Something went wrong"}`,
          isError: true,
        },
      ]);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content: "Chat history cleared. How can I assist you now?",
        toolsUsed: [],
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full sm:max-w-lg h-[90vh] sm:h-[650px] bg-slate-900/95 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-wide">BitBot AI</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Cpu className="w-3 h-3" /> Qwen2.5 1.5B
                </span>
              </div>
              <p className="text-xs text-slate-400">Powered by BitCentral MCP Server</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-purple-600/30 text-purple-400 border border-purple-500/30"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              <div className={`max-w-[82%] space-y-1.5`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20"
                      : msg.isError
                      ? "bg-rose-950/40 border border-rose-800/60 text-rose-200 rounded-tl-none"
                      : "bg-slate-800/80 border border-slate-700/60 text-slate-200 rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Show tools executed */}
                {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.toolsUsed.map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono"
                      >
                        ⚡ MCP Tool: {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl rounded-tl-none bg-slate-800/80 border border-slate-700/60 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                Qwen2.5 1.5B querying BitCentral tools...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 py-2 bg-slate-900/90 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
          {QUICK_PROMPTS.map((promptObj, pIdx) => {
            const Icon = promptObj.icon;
            return (
              <button
                key={pIdx}
                onClick={() => handleSend(promptObj.prompt)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-800/90 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700/80 text-slate-300 hover:text-indigo-200 whitespace-nowrap transition-all duration-150 flex-shrink-0"
              >
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
                {promptObj.label}
              </button>
            );
          })}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask BitBot about mess menu, points, faculty, exam halls..."
            disabled={isLoading}
            className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-md shadow-indigo-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

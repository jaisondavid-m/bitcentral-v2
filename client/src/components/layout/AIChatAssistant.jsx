import React, { useState, useRef, useEffect } from "react";
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  RefreshCw,
  Cpu
} from "lucide-react";
import { sendChatMessage } from "@/api/chat";



function parseInlineFormatting(str) {
  if (!str) return null;
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  const parts = str.split(regex);

  return parts.map((part, pIdx) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return (
        <strong key={pIdx} className="font-bold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={pIdx} className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          {part.slice(1, -1)}
        </code>
      );
    }

    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      return (
        <a
          key={pIdx}
          href={linkMatch[2]}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-700 font-semibold"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

function renderFormattedMessage(text) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Markdown Table block detection (| Col 1 | Col 2 |)
    if (trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.includes("|")) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0];
        const dataRows = tableLines.slice(1).filter((l) => !/^\|[\s\-:|]+\|$/.test(l));

        const headers = headerRow
          .split("|")
          .slice(1, -1)
          .map((h) => h.trim());

        elements.push(
          <div key={`table-${i}`} className="my-2.5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs bg-white dark:bg-slate-900">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700">
                  {headers.map((h, hIdx) => (
                    <th key={hIdx} className="px-3 py-2 font-bold tracking-tight">
                      {parseInlineFormatting(h)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {dataRows.map((rowStr, rIdx) => {
                  const cells = rowStr
                    .split("|")
                    .slice(1, -1)
                    .map((c) => c.trim());
                  return (
                    <tr
                      key={rIdx}
                      className="transition-colors hover:bg-blue-50/40 dark:hover:bg-slate-800/50 odd:bg-white even:bg-slate-50/40 dark:odd:bg-slate-900 dark:even:bg-slate-900/60"
                    >
                      {cells.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-1.5 text-slate-700 dark:text-slate-200 align-top">
                          {parseInlineFormatting(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    }

    // Horizontal Divider
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      elements.push(<hr key={i} className="my-2.5 border-slate-200 dark:border-slate-800" />);
      i++;
      continue;
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      elements.push(
        <h4 key={i} className="font-bold text-sm mt-3 mb-1 text-slate-900 dark:text-white">
          {parseInlineFormatting(trimmed.slice(4))}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ")) {
      elements.push(
        <h3 key={i} className="font-extrabold text-base mt-3.5 mb-1.5 text-slate-900 dark:text-white">
          {parseInlineFormatting(trimmed.slice(3))}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(
        <h2 key={i} className="font-black text-lg mt-4 mb-2 text-slate-900 dark:text-white">
          {parseInlineFormatting(trimmed.slice(2))}
        </h2>
      );
      i++;
      continue;
    }

    // Bullet list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5 pl-1">
          <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
          <span className="flex-1 text-slate-700 dark:text-slate-200 leading-normal">
            {parseInlineFormatting(trimmed.slice(2))}
          </span>
        </div>
      );
      i++;
      continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex items-start gap-2 my-0.5 pl-1">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-[11px] shrink-0 mt-0.5 bg-blue-50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded">
            {numMatch[1]}.
          </span>
          <span className="flex-1 text-slate-700 dark:text-slate-200 leading-normal">
            {parseInlineFormatting(numMatch[2])}
          </span>
        </div>
      );
      i++;
      continue;
    }

    // Paragraph
    if (trimmed === "") {
      elements.push(<div key={i} className="h-1.5" />);
    } else {
      elements.push(
        <p key={i} className="my-0.5 text-slate-700 dark:text-slate-200 leading-relaxed">
          {parseInlineFormatting(line)}
        </p>
      );
    }
    i++;
  }

  return elements;
}

export default function AIChatAssistant({ isOpen, onClose, currentRollNo = "" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm **BitBot**, your AI assistant powered by **Google Gemini AI** on BitCentral's MCP Server. How can I help you today?",
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
      const errorText = res.error || res.message || "⚠️ Unable to connect to BitBot AI service.";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorText,
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
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/40 backdrop-blur-xs transition-all duration-300">
      <div className="w-full sm:max-w-lg h-[90vh] sm:h-[650px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="px-4 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white tracking-wide">BitBot AI</h3>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white border border-white/30">
                  <Cpu className="w-3 h-3" /> Gemini 2.0 Flash
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium">BitCentral MCP Server</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Clear Chat History"
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/80 dark:bg-slate-950/60 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === "user"
                    ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white"
                    : "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              <div className="max-w-[82%] space-y-1.5">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-xs shadow-md shadow-blue-500/20"
                      : msg.isError
                      ? "bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-200 rounded-tl-xs shadow-xs"
                      : "bg-white text-slate-800 border border-slate-200/90 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700/80 rounded-tl-xs shadow-xs"
                  }`}
                >
                  {renderFormattedMessage(msg.content)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="px-4 py-2.5 rounded-2xl rounded-tl-xs bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-xs font-medium flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                BitBot AI querying tools & database...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>



        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask BitBot about mess menu, points, faculty, exam halls..."
            disabled={isLoading}
            className="flex-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700/80 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-md shadow-blue-500/25 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}

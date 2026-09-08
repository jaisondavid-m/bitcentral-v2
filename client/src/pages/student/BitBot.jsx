import React, { useState, useRef } from "react";
import { Bot, Send, Sparkles, User, RefreshCw, Cpu, ArrowLeft } from "lucide-react";
import { sendChatMessage } from "@/api/chat";
import { useAuth } from "@/context/StudentContext.jsx";
import { useNavigate } from "react-router-dom";

/* ─── inline markdown ─── */
function parseInline(str) {
  if (!str) return null;
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  return str.split(regex).map((part, i) => {
    if (!part) return null;
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4)
      return <strong key={i} className="font-semibold text-inherit">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2)
      return <code key={i} className="font-mono text-xs bg-black/10 px-1.5 py-0.5 rounded">{part.slice(1, -1)}</code>;
    const lm = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (lm) return <a key={i} href={lm[2]} target="_blank" rel="noreferrer" className="underline opacity-80 hover:opacity-100">{lm[1]}</a>;
    return part;
  });
}

function renderMessage(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const els = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    if (t.startsWith("|") && t.endsWith("|")) {
      const tl = [];
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        tl.push(lines[i].trim()); i++;
      }
      if (tl.length >= 2) {
        const headers = tl[0].split("|").slice(1, -1).map(h => h.trim());
        const rows = tl.slice(1).filter(l => !/^\|[\s\-:|]+\|$/.test(l));
        els.push(
          <div key={`t${i}`} className="my-2 overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead><tr className="bg-slate-50 border-b border-slate-200">
                {headers.map((h, hi) => <th key={hi} className="px-3 py-2 font-semibold text-slate-600">{parseInline(h)}</th>)}
              </tr></thead>
              <tbody>{rows.map((r, ri) => {
                const cells = r.split("|").slice(1, -1).map(c => c.trim());
                return <tr key={ri} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  {cells.map((c, ci) => <td key={ci} className="px-3 py-2 text-slate-600">{parseInline(c)}</td>)}
                </tr>;
              })}</tbody>
            </table>
          </div>
        ); continue;
      }
    }

    if (t === "---" || t === "***" || t === "___") { els.push(<hr key={i} className="my-2 border-slate-200" />); i++; continue; }
    if (t.startsWith("### ")) { els.push(<h4 key={i} className="font-semibold text-sm mt-2.5 mb-0.5 text-slate-800">{parseInline(t.slice(4))}</h4>); i++; continue; }
    if (t.startsWith("## "))  { els.push(<h3 key={i} className="font-bold text-base mt-3 mb-1 text-slate-800">{parseInline(t.slice(3))}</h3>); i++; continue; }
    if (t.startsWith("# "))   { els.push(<h2 key={i} className="font-bold text-lg mt-3 mb-1 text-slate-800">{parseInline(t.slice(2))}</h2>); i++; continue; }
    if (t.startsWith("- ") || t.startsWith("* ")) {
      els.push(
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="text-slate-400 shrink-0 mt-0.5 text-xs font-bold">•</span>
          <span className="flex-1 text-slate-700 leading-relaxed">{parseInline(t.slice(2))}</span>
        </div>
      ); i++; continue;
    }
    const nm = t.match(/^(\d+)\.\s+(.*)/);
    if (nm) {
      els.push(
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="text-slate-400 text-xs font-bold shrink-0 mt-0.5">{nm[1]}.</span>
          <span className="flex-1 text-slate-700 leading-relaxed">{parseInline(nm[2])}</span>
        </div>
      ); i++; continue;
    }
    if (t === "") { els.push(<div key={i} className="h-1" />); }
    else { els.push(<p key={i} className="my-0.5 text-slate-700 leading-relaxed">{parseInline(line)}</p>); }
    i++;
  }
  return els;
}

/* ─── page ─── */
export default function BitBot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const rollNo = user?.roll_no || user?.rollNo || "";

  const [messages, setMessages] = useState([{
    role: "assistant",
    content: "👋 Hi! I'm **BitBot**, your AI assistant powered by **Google Gemini AI** on BitCentral's MCP Server. How can I help you today?",
  }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || isLoading) return;
    setMessages(p => [...p, { role: "user", content: q }]);
    setInput("");
    setIsLoading(true);

    const history = messages
      .filter(m => m.role === "user" || m.role === "assistant")
      .map(m => ({ role: m.role, content: m.content }));

    const res = await sendChatMessage({ message: q, history, rollNo });
    setIsLoading(false);

    if (res.success) {
      setMessages(p => [...p, { role: "assistant", content: res.message, toolsUsed: res.tools_used || [] }]);
    } else {
      setMessages(p => [...p, {
        role: "assistant",
        content: res.error || res.message || "⚠️ Something went wrong.",
        isError: true,
      }]);
    }
  };

  const clearHistory = () => setMessages([{
    role: "assistant", content: "Chat cleared. How can I help you?",
  }]);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-slate-900">BitBot AI</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                  <Cpu className="w-2.5 h-2.5" /> Gemini 2.0 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">BitCentral MCP Server</p>
            </div>
          </div>
        </div>

        <button
          onClick={clearHistory}
          title="Clear chat"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* ── Messages ── */}
      <main className="flex-1 px-4 sm:px-6 py-6 max-w-2xl w-full mx-auto space-y-5 pb-24">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>

            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 ${
              msg.role === "user"
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-400 border border-slate-200"
            }`}>
              {msg.role === "user"
                ? <User className="w-3 h-3" />
                : <Sparkles className="w-3 h-3" />}
            </div>

            <div className={`max-w-[78%] sm:max-w-[72%] px-4 py-3 rounded-xl text-sm ${
              msg.role === "user"
                ? "bg-blue-600 text-white rounded-tr-sm"
                : msg.isError
                ? "bg-red-50 border border-red-200 text-red-600 rounded-tl-sm"
                : "bg-slate-50 border border-slate-200 rounded-tl-sm"
            }`}>
              {msg.role === "user"
                ? <p className="leading-relaxed text-white">{msg.content}</p>
                : renderMessage(msg.content)
              }
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 bg-slate-100 border border-slate-200">
              <Sparkles className="w-3 h-3 text-slate-400 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-slate-50 border border-slate-200 text-xs text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Thinking...
            </div>
          </div>
        )}
      </main>

      {/* ── Input ── */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 sm:px-6 py-3">
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2 max-w-2xl mx-auto"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all bg-white"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-9 h-9 shrink-0 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}

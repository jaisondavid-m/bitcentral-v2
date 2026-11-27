import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/StudentContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";
import {
  Loader2, AlertCircle, MapPin, BookOpen,
  Clock, CalendarDays, GraduationCap, Building2, Search, Mail, Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function formatExamTime(t) {
  if (!t) return "";
  const times = t.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\b/gi);
  if (times && times.length >= 2) {
    return `${times[0].toUpperCase()} : ${times[1].toUpperCase()}`;
  }
  return t
    .replace(/\s*\?\s*/g, " : ")
    .replace(/\s*[–—]\s*/g, " : ")
    .replace(/\s*-\s*/g, " : ");
}

function examEndTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [dd, mm, yy] = dateStr.split("-");
  const times = timeStr.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\b/gi);
  if (!times || times.length === 0) return null;
  const endPart = times[1] || times[0];
  const [timePart, meridiem] = endPart.split(/\s+/);
  if (!timePart || !meridiem) return null;
  const [hh, min] = timePart.split(":").map(Number);
  let h = hh;
  if (meridiem.toUpperCase() === "PM" && hh !== 12) h = hh + 12;
  if (meridiem.toUpperCase() === "AM" && hh === 12) h = 0;
  return new Date(`${yy}-${mm}-${dd}T${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:00`);
}
function isExamOver(s) { const e = examEndTime(s.date, s.time); return e ? e < new Date() : false; }

function fmt(dateStr) {
  const [d, m, y] = dateStr.split("-");
  const date = new Date(`${y}-${m}-${d}`);
  return {
    weekday: date.toLocaleDateString("en-GB", { weekday: "long" }),
    short: date.toLocaleDateString("en-GB", { weekday: "short" }),
    day: d, month: date.toLocaleDateString("en-GB", { month: "short" }), year: y,
  };
}
function daysUntil(dateStr) {
  const [d, m, y] = dateStr.split("-");
  const exam = new Date(`${y}-${m}-${d}`); exam.setHours(0, 0, 0, 0);
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const diff = Math.round((exam - now) / 86400000);
  if (diff === 0) return { label: "Today", urgent: true };
  if (diff === 1) return { label: "Tomorrow", urgent: true };
  if (diff <= 3) return { label: `In ${diff} days`, urgent: true };
  return { label: `In ${diff} days`, urgent: false };
}


// ═══════════════════════════════════════════════════════════════════════════════
// UI — pure white + blue light mode, full dark mode, no slate in light
// ═══════════════════════════════════════════════════════════════════════════════

function SessionPill({ session }) {
  const fn = session === "FN";
  return (
    <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-bold
      ${fn
        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
        : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${fn ? "bg-blue-500" : "bg-violet-500"}`} />
      {fn ? "Forenoon" : "Afternoon"}
    </span>
  );
}

function ArrearPill() {
  return (
    <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5
      text-[11px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
      Arrear
    </span>
  );
}

function UrgentPill({ label }) {
  return (
    <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5
      text-[11px] font-bold text-red-600
      dark:bg-red-900/20 dark:text-red-400">
      {label}
    </span>
  );
}

function getExamCountdown(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [dd, mm, yy] = dateStr.split("-");

  const parseSingleTime = (tp) => {
    if (!tp) return null;
    const parts = tp.trim().split(" ");
    if (parts.length < 2) return null;
    const [timeVal, meridiem] = parts;
    const [hh, min] = timeVal.split(":").map(Number);
    if (isNaN(hh) || isNaN(min)) return null;
    let h = hh;
    if (meridiem.toUpperCase() === "PM" && hh !== 12) h += 12;
    if (meridiem.toUpperCase() === "AM" && hh === 12) h = 0;
    return new Date(`${yy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:00`);
  };

  const times = timeStr.match(/\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)\b/gi);
  const startTime = times && times[0] ? parseSingleTime(times[0]) : null;
  let endTime = times && times[1] ? parseSingleTime(times[1]) : null;
  if (startTime && !endTime) {
    endTime = new Date(startTime.getTime() + 3 * 60 * 60 * 1000);
  }

  const now = new Date();

  if (!startTime) return null;

  if (endTime && now > endTime) {
    return { label: "Completed", isOver: true, isOngoing: false };
  }

  if (startTime && endTime && now >= startTime && now <= endTime) {
    return { label: "Ongoing", isOver: false, isOngoing: true };
  }

  const diffMs = startTime - now;
  if (diffMs <= 0) return { label: "Starting...", isOver: false, isOngoing: true };

  const totalMins = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMins / (60 * 24));
  const hours = Math.floor((totalMins % (60 * 24)) / 60);
  const mins = totalMins % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${mins}m`);

  return {
    label: `In ${parts.join(" ")}`,
    days,
    hours,
    mins,
    isOver: false,
    isOngoing: false,
    isUrgent: days === 0,
  };
}

function ExamCard({ session: s, registerNo }) {
  const navigate = useNavigate();
  const dt = fmt(s.date);
  const countdown = getExamCountdown(s.date, s.time);
  const arr = s.is_arrear;

  return (
    <div className={`flex overflow-hidden rounded-xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b]
      transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5
      dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]`}>

      {/* Date sidebar — narrower on mobile */}
      <div className={`flex w-[68px] shrink-0 flex-col items-center justify-center gap-0.5 py-3 border-r border-zinc-900 dark:border-white
        ${arr ? "bg-amber-100 dark:bg-amber-950/60" : "bg-blue-100 dark:bg-blue-950/60"}`}>
        <span className={`text-[9px] font-black uppercase tracking-[0.14em]
          ${arr ? "text-amber-800 dark:text-amber-400" : "text-blue-800 dark:text-blue-300"}`}>
          {dt.short}
        </span>
        <span className={`text-[26px] font-black leading-none tabular-nums
          ${arr ? "text-amber-950 dark:text-amber-200" : "text-blue-950 dark:text-blue-100"}`}>
          {dt.day}
        </span>
        <span className={`text-[10px] font-bold leading-tight text-center
          ${arr ? "text-amber-800 dark:text-amber-400" : "text-blue-800 dark:text-blue-300"}`}>
          {dt.month} {dt.year}
        </span>
      </div>

      {/* Content — tighter padding */}
      <div className="flex flex-1 flex-col gap-2 px-3 py-2.5 min-w-0">

        {/* Row 1: session pill + hall badge on same line */}
        <div className="flex items-start justify-between gap-1.5">
          {/* Left: pills */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0 pt-0.5">
            <span className={`inline-flex items-center gap-1 rounded-md border border-zinc-900 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider dark:border-white
              ${s.session === "FN"
                ? "bg-blue-100 text-blue-900 dark:bg-blue-900/60 dark:text-blue-100 shadow-[1px_1px_0px_#18181b] dark:shadow-[1px_1px_0px_#ffffff]"
                : "bg-violet-100 text-violet-900 dark:bg-violet-900/60 dark:text-violet-100 shadow-[1px_1px_0px_#18181b] dark:shadow-[1px_1px_0px_#ffffff]"}`}>
              {s.session === "FN" ? "Forenoon" : "Afternoon"}
            </span>
            {arr && (
              <span className="inline-flex items-center rounded-md border border-zinc-900 bg-amber-100 px-2 py-0.5 text-[10px] font-black text-amber-900 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-amber-900/60 dark:text-amber-200 dark:shadow-[1px_1px_0px_#ffffff]">
                Arrear
              </span>
            )}
          </div>

          {/* Right: hall badge & members button */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <div className={`flex items-center gap-1 rounded-lg border border-zinc-900 px-2.5 py-1 shrink-0 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]
              ${arr
                ? "bg-amber-100 dark:bg-amber-950/60"
                : "bg-blue-100 dark:bg-blue-950/60"}`}>
              <MapPin className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-black text-zinc-600 dark:text-zinc-400">
                Hall
              </span>
              <span className="text-base font-black leading-none text-zinc-900 dark:text-white">
                {s.hall_no}
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(
                  `/exam-hall/members?hall=${encodeURIComponent(s.hall_no)}&date=${encodeURIComponent(s.date)}&session=${encodeURIComponent(s.session || "")}&time=${encodeURIComponent(s.time || "")}${registerNo ? `&student=${encodeURIComponent(registerNo)}` : ""}`
                );
              }}
              className="inline-flex items-center gap-1 rounded-md border border-zinc-900 bg-blue-50 px-2 py-0.5 text-[10px] font-black text-blue-700 shadow-[1px_1px_0px_#18181b] hover:bg-blue-100 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-blue-300 dark:shadow-[1px_1px_0px_#ffffff] transition-all cursor-pointer"
              title={`View all students seated in ${s.hall_no}`}
            >
              <Users className="h-2.5 w-2.5" />
              <span>View Hall Members</span>
            </button>
          </div>
        </div>

        {/* Block location — single line, truncated */}
        {s.block && (
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3 shrink-0 text-blue-200 dark:text-blue-800" />
            <span className="truncate text-[10px] text-blue-400 dark:text-blue-600">{s.block}</span>
          </div>
        )}

        {/* Row 2: course code + name */}
        <div className="flex items-start gap-1.5 min-w-0">
          <BookOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-200 dark:text-blue-800" />
          <div className="min-w-0 flex flex-col gap-0.5">
            <span className="font-mono text-[11px] font-bold text-blue-400 dark:text-blue-500">
              {s.course_code}
            </span>
            <span className="text-[13px] font-semibold leading-snug text-blue-900 dark:text-blue-100">
              {s.course_name}
            </span>
          </div>
        </div>

        {/* Row 3: time + countdown */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 shrink-0 text-blue-200 dark:text-blue-800" />
            <span className="text-[11px] text-blue-500 dark:text-blue-400">{formatExamTime(s.time)}</span>
          </div>
          {countdown && (
            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold shrink-0
              ${countdown.isOngoing
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 animate-pulse"
                : countdown.isUrgent
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                : countdown.isOver
                ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                : "bg-blue-100/70 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"}`}>
              {countdown.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ExamHallDownload() {
  const navigate = useNavigate();
  const { profile, student } = useAuth();
  // Use the app-wide theme from ThemeContext (controlled by Navbar toggle)
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noExams, setNoExams] = useState(false);
  const defaultInitialRoll =
    profile?.register_no ||
    profile?.registerNo ||
    student?.register_no ||
    student?.registerNo ||
    profile?.roll_no ||
    profile?.rollNo ||
    "7376251CS221";

  const [registerNo, setRegisterNo] = useState(defaultInitialRoll);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    const roll =
      profile?.register_no ||
      profile?.registerNo ||
      student?.register_no ||
      student?.registerNo ||
      profile?.roll_no ||
      profile?.rollNo ||
      student?.roll_no ||
      student?.rollNo ||
      "7376251CS221";
    if (!roll) return;
    hasFetched.current = true;
    setRegisterNo(roll);
    setLoading(true);
    setNoExams(false);
    api.get("/exam-hall/all", { params: { registerNo: roll } })
      .then(res => {
        const data = res.data;
        if (!data.success || !data.sessions?.length) {
          setNoExams(true);
          return;
        }
        const up = data.sessions;
        if (up.length === 0) {
          setNoExams(true);
        } else {
          setSessions(up);
        }
      })
      .catch((err) => {
        if (
          err.response?.status === 404 ||
          err.response?.data?.message?.includes("no exam sessions found") ||
          (err.response?.data && !err.response.data.success)
        ) {
          setNoExams(true);
        } else {
          setError("Could not reach the server. Try again.");
        }
      })
      .finally(() => setLoading(false));
  }, [profile, student]);

  const sorted = sessions
    ? [...sessions].sort((a, b) => {
      const ms = d => { const [dd, mm, yy] = d.split("-"); return new Date(`${yy}-${mm}-${dd}`).getTime(); };
      const d = ms(a.date) - ms(b.date);
      return d !== 0 ? d : (a.session === "FN" ? -1 : 1);
    })
    : [];

  const activeSessions = sorted.filter(s => {
    const cd = getExamCountdown(s.date, s.time);
    return !cd?.isOver;
  });

  const nC = activeSessions.filter(s => !s.is_arrear).length;
  const nA = activeSessions.filter(s => s.is_arrear).length;

  const grouped = activeSessions.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});

  return (
    <div className={isDark ? "dark" : ""}>
      {/* light: very pale blue-white bg  |  dark: deep navy bg */}
      <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] px-4 py-8 dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* ── Header card ── */}
          <div className="overflow-hidden rounded-2xl bg-white p-4 border border-zinc-900 shadow-[3px_3px_0px_#18181b] dark:bg-[#111827] dark:border-white dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-zinc-900 bg-blue-600 text-white shadow-[2px_2px_0px_#18181b] dark:border-white">
                  <span className="text-[12px] font-black leading-none text-white">BIT</span>
                  <span className="text-[7px] font-bold leading-none text-blue-200">SATHY</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                    <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
                      Exam Hall Schedule
                    </h1>
                  </div>
                  <p className="mt-0.5 font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                    {registerNo || "Register No not found"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/exam-hall-manual")}
                  className="rounded-xl border border-zinc-900 bg-white px-3.5 py-1.5 text-xs font-black text-blue-600 shadow-[2px_2px_0px_#18181b] hover:bg-blue-50 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[2px_2px_0px_#ffffff] transition-all shrink-0"
                >
                  Manual Search
                </button>
              </div>
            </div>
          </div>

          {/* ── Loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
              <p className="text-sm text-blue-400">Fetching your schedule…</p>
            </div>
          )}

          {/* ── Register No Not Found / Not signed in ── */}
          {!loading && !sessions && !error && !noExams && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border
              border-dashed border-blue-200 bg-white px-4 py-14 text-center
              dark:border-blue-900/40 dark:bg-[#0F1C33]">
              <CalendarDays className="h-10 w-10 text-blue-300 dark:text-blue-600" />
              <div className="max-w-xs space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Register Number Not Found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No registered profile detected. You can search your exam hall manually using your register number.
                </p>
              </div>
              <button
                onClick={() => navigate("/exam-hall-manual")}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                Go to Manual Search
              </button>
            </div>
          )}

          {/* ── No Exams Scheduled ── */}
          {!loading && !sessions && !error && noExams && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border
              border-dashed border-blue-200 bg-white px-4 py-14 text-center
              dark:border-blue-900/40 dark:bg-[#0F1C33]">
              <CalendarDays className="h-10 w-10 text-blue-300 dark:text-blue-600" />
              <div className="max-w-xs space-y-1">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No exams are scheduled for you
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  There are currently no examinations scheduled for your register number {registerNo ? `(${registerNo})` : ""}.
                </p>
              </div>
              <button
                onClick={() => navigate("/exam-hall-manual")}
                className="mt-2 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600 cursor-pointer"
              >
                <Search className="h-3.5 w-3.5" />
                Search Another Register No
              </button>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="flex flex-col gap-3 rounded-2xl border border-red-100
              bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
              <div className="flex items-center justify-between border-t border-red-200/60 pt-3 dark:border-red-800/40">
                <span className="text-xs font-medium text-red-600 dark:text-red-400">
                  Want to search manually?
                </span>
                <button
                  onClick={() => navigate("/exam-hall-manual")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-700 transition-colors hover:bg-red-200 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900 cursor-pointer"
                >
                  <Search className="h-3 w-3" />
                  Manual Search
                </button>
              </div>
            </div>
          )}

          {/* ── Schedule ── */}
          {sessions && (
            <div className="space-y-5">
              {activeSessions.length > 0 ? (
                /* Exam cards grouped by date */
                Object.entries(grouped).map(([date, exams]) => {
                  const dt = fmt(date);
                  return (
                    <div key={date}>
                      <div className="mb-2.5 flex items-center gap-3">
                        <span className="whitespace-nowrap text-[11px] font-bold uppercase
                          tracking-widest text-blue-400 dark:text-blue-600">
                          {dt.weekday}, {dt.day} {dt.month} {dt.year}
                        </span>
                        <div className="h-px flex-1 bg-blue-100 dark:bg-blue-900/30" />
                      </div>
                      <div className="space-y-2.5">
                        {exams.map((s, i) => (
                          <ExamCard
                            key={`${s.course_code}-${s.session}-${i}`}
                            session={s}
                            registerNo={registerNo}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-blue-200 bg-white px-4 py-14 text-center dark:border-blue-900/40 dark:bg-[#0F1C33]">
                  <CalendarDays className="h-10 w-10 text-blue-300 dark:text-blue-600" />
                  <div className="max-w-xs space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      All Exams Completed
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      You have completed all scheduled examinations.
                    </p>
                  </div>
                </div>
              )}

              </div>
            )}

            {/* ── Notice Banner ── */}
            <div className="rounded-xl border border-blue-100 bg-white p-3.5 shadow-sm dark:border-blue-900/30 dark:bg-[#0F1C33]">
              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  If your data or department student lab schedule is not found or is showing any incorrect data, please email your department Laboratory Schedule PDF to{" "}
                  <a
                    href="mailto:jaisondavidm.cs25@bitsathy.ac.in?subject=Laboratory%20Schedule%20PDF%20Submission"
                    className="font-semibold text-blue-600 underline underline-offset-2 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    jaisondavidm.cs25@bitsathy.ac.in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
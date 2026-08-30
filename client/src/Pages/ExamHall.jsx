import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/StudentContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  Loader2, AlertCircle, MapPin, BookOpen,
  Clock, CalendarDays, FileDown, GraduationCap, Building2, Search, ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
// PDF Generation Helper
// ═══════════════════════════════════════════════════════════════════════════════

async function generatePDF(registerNo, sessions) {
  return new Promise((resolve, reject) => {
    function build() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      const PW = 297, PH = 210;
      const ML = 12, MR = 12;
      const CW = PW - ML - MR; // 273mm

      const N = [15, 40, 80];
      const NM = [22, 75, 150];
      const BL = [41, 120, 210];
      const SK = [235, 243, 255];
      const OF = [248, 250, 253];
      const W = [255, 255, 255];
      const BD = [200, 215, 235];
      const IK = [20, 30, 50];
      const SB = [80, 100, 130];
      const MT = [155, 175, 200];
      const AM = [175, 95, 0];
      const AB = [255, 243, 220];
      const AB2 = [255, 249, 235];
      const FT = [30, 80, 210];
      const FB = [220, 235, 255];
      const AT2 = [100, 50, 200];
      const AG = [238, 230, 255];

      const F = c => doc.setFillColor(...c);
      const T = c => doc.setTextColor(...c);
      const D = c => doc.setDrawColor(...c);
      const R = (x, y, w, h, s = "F") => doc.rect(x, y, w, h, s);
      const RR = (x, y, w, h, r, s = "F") => doc.roundedRect(x, y, w, h, r, r, s);
      const L = (x1, y1, x2, y2) => doc.line(x1, y1, x2, y2);

      const sorted = [...sessions].sort((a, b) => {
        const ms = d => { const [dd, mm, yy] = d.split("-"); return new Date(`${yy}-${mm}-${dd}`).getTime(); };
        const diff = ms(a.date) - ms(b.date);
        return diff !== 0 ? diff : (a.session === "FN" ? -1 : 1);
      });
      const nT = sorted.length, nC = sorted.filter(s => !s.is_arrear).length, nA = nT - nC;
      const genDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });

      const C = [
        { lbl: "Date & Day", x: ML, w: 28 },
        { lbl: "Sess.", x: ML + 28, w: 14 },
        { lbl: "Hall", x: ML + 42, w: 18 },
        { lbl: "Block / Location", x: ML + 60, w: 50 },
        { lbl: "Exam Time", x: ML + 110, w: 38 },
        { lbl: "Code", x: ML + 148, w: 22 },
        { lbl: "Subject", x: ML + 170, w: 103 },
      ];

      F(N); R(0, 0, PW, 36);
      F(BL); R(0, 33, PW, 3);

      F(NM); RR(ML, 5, 22, 24, 2);
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); T(W);
      doc.text("BIT", ML + 11, 14, { align: "center" });
      doc.setFontSize(5.5); T(FB);
      doc.text("SATHY", ML + 11, 19, { align: "center" });
      doc.setFontSize(4.5); T(MT);
      doc.text("AUTONOMOUS", ML + 11, 23.5, { align: "center" });

      doc.setFont("helvetica", "bold"); doc.setFontSize(13); T(W);
      doc.text("Bannari Amman Institute of Technology", ML + 26, 13);
      doc.setFont("helvetica", "normal"); doc.setFontSize(7); T(FB);
      doc.text("Sathyamangalam  ·  Autonomous Institution  ·  Anna University", ML + 26, 19.5);
      doc.setFont("helvetica", "bold"); doc.setFontSize(15); T(W);
      doc.text("Semester Examination Hall Schedule", ML + 26, 29);

      doc.setFont("helvetica", "bold"); doc.setFontSize(8); T([120, 190, 255]);
      doc.text("bitcentral", PW - MR, 12, { align: "right" });
      doc.setFont("helvetica", "normal"); doc.setFontSize(6); T(MT);
      doc.text("bitcentral.bitsathy.in", PW - MR, 18, { align: "right" });

      F(OF); R(0, 36, PW, 18);
      D(BD); doc.setLineWidth(0.3); L(0, 54, PW, 54);

      doc.setFont("helvetica", "bold"); doc.setFontSize(11); T(N);
      doc.text(registerNo, ML + 2, 46);
      doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); T(SB);
      doc.text("Register Number", ML + 2, 51);

      F(BD); R(ML + 52, 38, 0.3, 14);

      [{ v: String(nT), l: "Total Exams", c: BL }, { v: String(nC), l: "Current Sem", c: NM }, { v: String(nA), l: "Arrear", c: AM }]
        .forEach(({ v, l, c }, i) => {
          const sx = ML + 58 + i * 36;
          doc.setFont("helvetica", "bold"); doc.setFontSize(12); T(c); doc.text(v, sx, 46);
          doc.setFont("helvetica", "normal"); doc.setFontSize(6); T(SB); doc.text(l, sx, 51);
        });

      doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); T(SB);
      doc.text("Generated on", PW - MR, 46, { align: "right" });
      doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); T(IK);
      doc.text(genDate, PW - MR, 51, { align: "right" });

      let y = 61;
      doc.setFont("helvetica", "bold"); doc.setFontSize(7); T(BL);
      doc.text("UPCOMING EXAMINATIONS", ML, y - 1);

      F(N); R(ML, y, CW, 8);
      doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); T([210, 228, 255]);
      C.forEach(col => doc.text(col.lbl, col.x + 2, y + 5.5));
      y += 8;

      const RH = 18;
      const cy = (rowTop, fpt) => rowTop + RH / 2 + fpt * 0.18;

      const footer = () => {
        F(N); R(0, PH - 10, PW, 10);
        F(BL); R(0, PH - 11, PW, 1);
        doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); T(W);
        doc.text("BIT Sathy — Semester Examinations", ML, PH - 4);
        doc.setFont("helvetica", "normal"); doc.setFontSize(6); T([140, 185, 255]);
        doc.text("bitcentral.bitsathy.in", ML, PH - 0.8);
        doc.setFont("helvetica", "normal"); doc.setFontSize(6); T([180, 210, 255]);
        doc.text("Created by Jaison David M", PW / 2, PH - 4, { align: "center" });
        doc.setFont("helvetica", "normal"); doc.setFontSize(5.5); T([100, 170, 255]);
        doc.text("linkedin.com/in/jaison-david-m-a14072360", PW / 2, PH - 0.8, { align: "center" });
      };

      sorted.forEach((s, idx) => {
        if (y + RH > PH - 14) {
          footer();
          const pg = doc.internal.getNumberOfPages();
          doc.setFont("helvetica", "normal"); doc.setFontSize(6); T(MT);
          doc.text(`Page ${pg}`, PW - MR, PH - 4, { align: "right" });
          doc.addPage();
          y = 14;
          F(N); R(ML, y, CW, 8);
          doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); T([210, 228, 255]);
          C.forEach(col => doc.text(col.lbl, col.x + 2, y + 5.5));
          y += 8;
        }

        const even = idx % 2 === 0;
        const bg = s.is_arrear ? (even ? AB : AB2) : (even ? SK : OF);
        F(bg); R(ML, y, CW, RH);
        F(s.is_arrear ? AM : N); R(ML, y, 3, RH);
        D(BD); doc.setLineWidth(0.2); L(ML, y + RH, ML + CW, y + RH);

        D([215, 228, 248]); doc.setLineWidth(0.15);
        [C[1], C[2], C[3], C[4], C[5], C[6]].forEach(col => L(col.x, y, col.x, y + RH));

        const [dd, mm, yy] = s.date.split("-");
        const wd = new Date(`${yy}-${mm}-${dd}`).toLocaleDateString("en-GB", { weekday: "short" });
        doc.setFont("helvetica", "bold"); doc.setFontSize(9); T(s.is_arrear ? AM : N);
        doc.text(`${dd}/${mm}/${yy.slice(2)}`, C[0].x + 3, cy(y, 9) - 2);
        doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); T(SB);
        doc.text(wd, C[0].x + 3, cy(y, 6.5) + 3);

        const fn = s.session === "FN";
        const pillW = 11, pillH = 7;
        const pillX = C[1].x + (C[1].w - pillW) / 2;
        const pillY = y + (RH - pillH) / 2;
        F(fn ? FB : AG); RR(pillX, pillY, pillW, pillH, 2);
        doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); T(fn ? FT : AT2);
        doc.text(s.session, pillX + pillW / 2, pillY + pillH / 2 + 2, { align: "center" });

        doc.setFont("helvetica", "bold"); doc.setFontSize(12); T(s.is_arrear ? AM : N);
        doc.text(s.hall_no, C[2].x + 2, cy(y, 12));

        doc.setFont("helvetica", "normal"); doc.setFontSize(6.8); T(IK);
        const blLines = doc.splitTextToSize(s.block || "—", C[3].w - 3);
        const blSlice = blLines.slice(0, 3);
        const lineH = 6.8 * 0.352 * 1.45;
        const blBlockH = blSlice.length * lineH;
        const blStart = y + (RH - blBlockH) / 2 + lineH * 0.7;
        doc.text(blSlice, C[3].x + 2, blStart, { lineHeightFactor: 1.45 });

        const tp = s.time.split("–");
        const start = (tp[0] || s.time).trim();
        const end = tp[1] ? ("– " + tp[1].trim()) : "";
        if (end) {
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); T(IK);
          doc.text(start, C[4].x + 2, y + RH / 2 - 0.5);
          doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); T(SB);
          doc.text(end, C[4].x + 2, y + RH / 2 + 4.5);
        } else {
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); T(IK);
          doc.text(start, C[4].x + 2, cy(y, 7.5));
        }

        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); T(SB);
        doc.text(s.course_code, C[5].x + 2, cy(y, 7.5));

        doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); T(IK);
        const subLines = doc.splitTextToSize(s.course_name, C[6].w - 4);
        const subSlice = subLines.slice(0, 3);
        const subLineH = 7.5 * 0.352 * 1.4;
        const subBlockH = subSlice.length * subLineH;
        const subStart = y + (RH - subBlockH) / 2 + subLineH * 0.7;
        doc.text(subSlice, C[6].x + 2, subStart, { lineHeightFactor: 1.4 });

        if (s.is_arrear) {
          const bx = PW - MR - 14;
          const by = y + (RH - 7) / 2;
          F(AB); RR(bx, by, 12, 7, 1.5);
          doc.setFont("helvetica", "bold"); doc.setFontSize(5.5); T(AM);
          doc.text("ARREAR", bx + 6, by + 4.5, { align: "center" });
        }

        y += RH;
      });

      D(N); doc.setLineWidth(0.5); L(ML, y, ML + CW, y);

      y += 7;
      if (y + 12 > PH - 14) { footer(); doc.addPage(); y = 14; }
      doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); T(SB);
      doc.text("LEGEND", ML, y + 4);
      [{ c: N, l: "Current semester" }, { c: AM, l: "Arrear exam" }, { c: FT, l: "FN — Forenoon" }, { c: AT2, l: "AN — Afternoon" }]
        .forEach(({ c, l }, i) => {
          const lx = ML + 18 + i * 52;
          F(c); RR(lx, y, 4.5, 4.5, 1);
          doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); T(IK);
          doc.text(l, lx + 6.5, y + 4);
        });

      const tot = doc.internal.getNumberOfPages();
      for (let p = 1; p <= tot; p++) {
        doc.setPage(p); footer();
        doc.setFont("helvetica", "normal"); doc.setFontSize(6); T(MT);
        doc.text(`Page ${p} of ${tot}`, PW - MR, PH - 4, { align: "right" });
      }

      doc.save(`exam-schedule-${registerNo}.pdf`);
      resolve();
    }

    if (window.jspdf) build();
    else {
      const sc = document.createElement("script");
      sc.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
      sc.onload = build;
      sc.onerror = () => reject(new Error("jsPDF load failed"));
      document.head.appendChild(sc);
    }
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// UI Components
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

function getExamCountdown(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const [dd, mm, yy] = dateStr.split("-");
  const startPart = (timeStr.split("–")[0] ?? timeStr.split("-")[0] ?? "").trim();
  const endPart = (timeStr.split("–")[1] ?? timeStr.split("-")[1] ?? "").trim();

  const parseTime = (tp) => {
    if (!tp) return null;
    const parts = tp.split(" ");
    if (parts.length < 2) return null;
    const [timeVal, meridiem] = parts;
    const [hh, min] = timeVal.split(":").map(Number);
    if (isNaN(hh) || isNaN(min)) return null;
    let h = hh;
    if (meridiem.toUpperCase() === "PM" && hh !== 12) h += 12;
    if (meridiem.toUpperCase() === "AM" && hh === 12) h = 0;
    return new Date(`${yy}-${mm}-${dd}T${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}:00`);
  };

  const startTime = parseTime(startPart);
  const endTime = parseTime(endPart);
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

function ExamCard({ session: s }) {
  const dt = fmt(s.date);
  const countdown = getExamCountdown(s.date, s.time);
  const arr = s.is_arrear;

  return (
    <div className={`flex overflow-hidden rounded-xl border bg-white shadow-sm
      transition-all duration-200 hover:shadow-md hover:-translate-y-px
      dark:bg-[#0F1C33]
      ${arr
        ? "border-amber-200 dark:border-amber-800/40"
        : "border-blue-100 dark:border-blue-900/30"}`}>

      <div className={`flex w-[68px] shrink-0 flex-col items-center justify-center gap-0.5 py-3
        ${arr ? "bg-amber-50 dark:bg-amber-900/20" : "bg-blue-50 dark:bg-[#0A1628]"}`}>
        <span className={`text-[8px] font-bold uppercase tracking-[0.14em]
          ${arr ? "text-amber-400 dark:text-amber-500" : "text-blue-300 dark:text-blue-600"}`}>
          {dt.short}
        </span>
        <span className={`text-[26px] font-black leading-none tabular-nums
          ${arr ? "text-amber-700 dark:text-amber-300" : "text-blue-700 dark:text-blue-200"}`}>
          {dt.day}
        </span>
        <span className={`text-[10px] font-semibold leading-tight text-center
          ${arr ? "text-amber-500 dark:text-amber-500" : "text-blue-400 dark:text-blue-500"}`}>
          {dt.month} {dt.year}
        </span>
      </div>

      <div className={`w-px self-stretch
        ${arr ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`} />

      <div className="flex flex-1 flex-col gap-2 px-3 py-2.5 min-w-0">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex flex-wrap items-center gap-1 min-w-0">
            <SessionPill session={s.session} />
            {arr && <ArrearPill />}
          </div>

          <div className={`flex items-center gap-1 rounded-lg px-2 py-1 shrink-0
            ${arr
              ? "bg-amber-50 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:ring-amber-700/50"
              : "bg-blue-50 ring-1 ring-blue-200 dark:bg-blue-900/20 dark:ring-blue-700/50"}`}>
            <MapPin className={`h-3 w-3 shrink-0 ${arr ? "text-amber-400" : "text-blue-400"}`} />
            <span className={`text-xs font-medium ${arr ? "text-amber-300" : "text-blue-300"} dark:opacity-60`}>
              Hall
            </span>
            <span className={`text-base font-black leading-none
              ${arr ? "text-amber-700 dark:text-amber-300" : "text-blue-700 dark:text-blue-200"}`}>
              {s.hall_no}
            </span>
          </div>
        </div>

        {s.block && (
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3 shrink-0 text-blue-200 dark:text-blue-800" />
            <span className="truncate text-[10px] text-blue-400 dark:text-blue-600">{s.block}</span>
          </div>
        )}

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

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 shrink-0 text-blue-200 dark:text-blue-800" />
            <span className="text-[11px] text-blue-500 dark:text-blue-400">{s.time}</span>
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

// ═══════════════════════════════════════════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════════════════════════════════════════

const ExamHall = () => {
  const navigate = useNavigate();
  const { profile, student } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [registerNo, setRegisterNo] = useState("");
  const [sessions, setSessions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchedRegNo, setSearchedRegNo] = useState("");

  const hasAppliedDefaultRegisterNo = useRef(false);

  useEffect(() => {
    if (hasAppliedDefaultRegisterNo.current) return;
    const defaultRollNo =
      profile?.roll_no ||
      profile?.rollNo ||
      student?.roll_no ||
      student?.rollNo ||
      "";

    if (defaultRollNo) {
      setRegisterNo(defaultRollNo);
      hasAppliedDefaultRegisterNo.current = true;
    }
  }, [profile, student]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const query = registerNo.trim();
    if (!query) return;

    setLoading(true);
    setError("");
    setSessions(null);
    setSearchedRegNo(query);

    api.get("/exam-hall/all", { params: { registerNo: query } })
      .then((res) => {
        const data = res.data;
        if (!data.success || !data.sessions?.length) {
          setError(`No exam schedule found for register number "${query}".`);
          return;
        }
        setSessions(data.sessions);
      })
      .catch(() => setError("Could not reach the server. Please try again."))
      .finally(() => setLoading(false));
  };

  const handleDownloadPdf = async () => {
    if (!sessions || !searchedRegNo) return;
    setPdfLoading(true);
    try {
      await generatePDF(searchedRegNo, sessions);
    } catch (err) {
      console.error(err);
    } finally {
      setPdfLoading(false);
    }
  };

  const sorted = sessions
    ? [...sessions].sort((a, b) => {
        const ms = d => { const [dd, mm, yy] = d.split("-"); return new Date(`${yy}-${mm}-${dd}`).getTime(); };
        const d = ms(a.date) - ms(b.date);
        return d !== 0 ? d : (a.session === "FN" ? -1 : 1);
      })
    : [];

  const nC = sessions?.filter(s => !s.is_arrear).length ?? 0;
  const nA = sessions?.filter(s => s.is_arrear).length ?? 0;

  const grouped = sorted.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = [];
    acc[s.date].push(s);
    return acc;
  }, {});

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-[#EEF4FF] px-4 py-8 dark:bg-[#080F1E]">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* ── Header card ── */}
          <div className="overflow-hidden rounded-2xl bg-white p-4 border border-blue-100 shadow-sm dark:bg-[#0F1C33] dark:border-blue-900/30">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-600 shadow-sm">
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
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    Manual Search
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate("/exam-hall")}
                className="inline-flex items-center gap-1 rounded-xl bg-white border border-blue-500 px-3.5 py-1.5 text-xs font-bold text-blue-600 shadow-sm transition-all hover:bg-blue-50 hover:border-blue-600 hover:scale-[1.02] active:scale-[0.98] cursor-pointer dark:bg-slate-900 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-slate-800 shrink-0"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Auto Search
              </button>
            </div>
          </div>

          {/* ── Search Input Card ── */}
          <form onSubmit={handleSearch} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/30 dark:bg-[#0F1C33]">
            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                Register number
              </label>
              <input
                type="text"
                value={registerNo}
                onChange={(e) => setRegisterNo(e.target.value)}
                placeholder="e.g. 7376251CS221"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm
                  text-slate-800 outline-none ring-0 transition-all
                  placeholder:text-slate-300
                  focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                  dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100
                  dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
              />
            </div>

            <button
              type="submit"
              disabled={!registerNo.trim() || loading}
              className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2
                ${!registerNo.trim() || loading
                  ? "cursor-not-allowed bg-blue-100 text-blue-300 dark:bg-slate-800 dark:text-slate-600"
                  : "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] dark:bg-blue-500 dark:hover:bg-blue-600"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  Searching schedule...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search hall
                </>
              )}
            </button>
          </form>

          {/* ── Loading ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
              <p className="text-sm text-blue-400">Fetching exam schedule for "{searchedRegNo}"…</p>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100
              bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/10">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* ── Idle hint ── */}
          {!sessions && !loading && !error && (
            <p className="py-2 text-center text-xs text-slate-400 dark:text-slate-600">
              Enter your details above and search
            </p>
          )}

          {/* ── Schedule Results ── */}
          {sessions && sorted.length > 0 && (
            <div className="space-y-5">
              {/* Exam cards grouped by date */}
              {Object.entries(grouped).map(([date, exams]) => {
                const dt = fmt(date);
                return (
                  <div key={date} className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <span className="whitespace-nowrap text-[11px] font-bold uppercase tracking-widest text-blue-400 dark:text-blue-600">
                        {dt.weekday}, {dt.day} {dt.month} {dt.year}
                      </span>
                      <div className="h-px w-full bg-blue-100 dark:bg-blue-900/30" />
                    </div>

                    <div className="space-y-2.5">
                      {exams.map((s, idx) => (
                        <ExamCard key={idx} session={s} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ExamHall;
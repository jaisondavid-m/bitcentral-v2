import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/StudentContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import {
  Loader2, AlertCircle, MapPin, BookOpen,
  Clock, CalendarDays, FileDown, GraduationCap, Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://api.bitcentral.bitsathy.in";
const CREATOR_LINKEDIN = "https://www.linkedin.com/in/jaison-david-m-a14072360/";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function examEndTime(dateStr, timeStr) {
  const [dd, mm, yy] = dateStr.split("-");
  const endPart = (timeStr.split("–")[1] ?? timeStr.split("-")[1] ?? "").trim();
  const [timePart, meridiem] = endPart.split(" ");
  if (!timePart || !meridiem) return null;
  const [hh, min] = timePart.split(":").map(Number);
  let h = hh;
  if (meridiem === "PM" && hh !== 12) h = hh + 12;
  if (meridiem === "AM" && hh === 12) h = 0;
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
// PDF — landscape A4, all content vertically centered per row
// ═══════════════════════════════════════════════════════════════════════════════

async function generatePDF(registerNo, sessions) {
  return new Promise((resolve, reject) => {
    function build() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

      const PW = 297, PH = 210;
      const ML = 12, MR = 12;
      const CW = PW - ML - MR; // 273mm

      // ── Colours ────────────────────────────────────────────────────────────
      const N = [15, 40, 80];   // navy
      const NM = [22, 75, 150];   // mid-navy
      const BL = [41, 120, 210];   // blue
      const SK = [235, 243, 255];  // sky (even row)
      const OF = [248, 250, 253];  // off-white (odd row)
      const W = [255, 255, 255];
      const BD = [200, 215, 235];  // border/divider
      const IK = [20, 30, 50];   // ink (dark text)
      const SB = [80, 100, 130];   // sub text
      const MT = [155, 175, 200];  // muted
      const AM = [175, 95, 0];  // amber
      const AB = [255, 243, 220];  // amber bg even
      const AB2 = [255, 249, 235];  // amber bg odd
      const FT = [30, 80, 210];   // FN text
      const FB = [220, 235, 255];  // FN bg
      const AT2 = [100, 50, 200];  // AN text
      const AG = [238, 230, 255];  // AN bg

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

      // ── Columns — must sum to CW (273mm) ──────────────────────────────────
      // Date(28) | Sess(14) | Hall(18) | Block(50) | Time(38) | Code(22) | Subject(103)
      const C = [
        { lbl: "Date & Day", x: ML, w: 28 },
        { lbl: "Sess.", x: ML + 28, w: 14 },
        { lbl: "Hall", x: ML + 42, w: 18 },
        { lbl: "Block / Location", x: ML + 60, w: 50 },
        { lbl: "Exam Time", x: ML + 110, w: 38 },
        { lbl: "Code", x: ML + 148, w: 22 },
        { lbl: "Subject", x: ML + 170, w: 103 },
      ];

      // ── HEADER BAND ──────────────────────────────────────────────────────
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

      // ── INFO STRIP ────────────────────────────────────────────────────────
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

      // ── TABLE ─────────────────────────────────────────────────────────────
      let y = 61;
      doc.setFont("helvetica", "bold"); doc.setFontSize(7); T(BL);
      doc.text("UPCOMING EXAMINATIONS", ML, y - 1);

      // Column header row
      F(N); R(ML, y, CW, 8);
      doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); T([210, 228, 255]);
      // Vertically center header labels (baseline at y+5.5 centres 6.5pt text in 8mm band)
      C.forEach(col => doc.text(col.lbl, col.x + 2, y + 5.5));
      y += 8;

      // ── ROW DRAWING ───────────────────────────────────────────────────────
      const RH = 18; // row height in mm

      // Helper: draw a single text line vertically centred in the row
      // fontPt=font size, the baseline is placed so the glyph sits on MID
      // jsPDF baseline is ~72% from top of cap height; for centering:
      //   baseline = rowTop + rowH/2 + fontPt*0.352/2  (≈ half-ascent)
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
        // left accent stripe
        F(s.is_arrear ? AM : N); R(ML, y, 3, RH);
        // bottom hairline
        D(BD); doc.setLineWidth(0.2); L(ML, y + RH, ML + CW, y + RH);

        // vertical column separator lines (subtle)
        D([215, 228, 248]); doc.setLineWidth(0.15);
        [C[1], C[2], C[3], C[4], C[5], C[6]].forEach(col => L(col.x, y, col.x, y + RH));

        // ── DATE  (bold date + small weekday below, both centred) ────────────
        const [dd, mm, yy] = s.date.split("-");
        const wd = new Date(`${yy}-${mm}-${dd}`).toLocaleDateString("en-GB", { weekday: "short" });
        // date string centred in col width
        const dateCX = C[0].x + 3 + C[0].w / 2 - 3; // approx left-padded centre
        doc.setFont("helvetica", "bold"); doc.setFontSize(9); T(s.is_arrear ? AM : N);
        doc.text(`${dd}/${mm}/${yy.slice(2)}`, C[0].x + 3, cy(y, 9) - 2);
        doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); T(SB);
        doc.text(wd, C[0].x + 3, cy(y, 6.5) + 3);

        // ── SESSION pill (centred in column) ─────────────────────────────────
        const fn = s.session === "FN";
        const pillW = 11, pillH = 7;
        const pillX = C[1].x + (C[1].w - pillW) / 2;
        const pillY = y + (RH - pillH) / 2;
        F(fn ? FB : AG); RR(pillX, pillY, pillW, pillH, 2);
        doc.setFont("helvetica", "bold"); doc.setFontSize(6.5); T(fn ? FT : AT2);
        doc.text(s.session, pillX + pillW / 2, pillY + pillH / 2 + 2, { align: "center" });

        // ── HALL — big, centred ───────────────────────────────────────────────
        doc.setFont("helvetica", "bold"); doc.setFontSize(12); T(s.is_arrear ? AM : N);
        doc.text(s.hall_no, C[2].x + 2, cy(y, 12));

        // ── BLOCK — wrap, vertically centred block of text ───────────────────
        doc.setFont("helvetica", "normal"); doc.setFontSize(6.8); T(IK);
        const blLines = doc.splitTextToSize(s.block || "—", C[3].w - 3);
        const blSlice = blLines.slice(0, 3);
        const lineH = 6.8 * 0.352 * 1.45; // approx mm per line
        const blBlockH = blSlice.length * lineH;
        const blStart = y + (RH - blBlockH) / 2 + lineH * 0.7;
        doc.text(blSlice, C[3].x + 2, blStart, { lineHeightFactor: 1.45 });

        // ── TIME — start on top half, end on bottom half, centred ────────────
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

        // ── CODE — centred ────────────────────────────────────────────────────
        doc.setFont("helvetica", "bold"); doc.setFontSize(7.5); T(SB);
        doc.text(s.course_code, C[5].x + 2, cy(y, 7.5));

        // ── SUBJECT — wrap, vertically centred ───────────────────────────────
        doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); T(IK);
        const subLines = doc.splitTextToSize(s.course_name, C[6].w - 4);
        const subSlice = subLines.slice(0, 3);
        const subLineH = 7.5 * 0.352 * 1.4;
        const subBlockH = subSlice.length * subLineH;
        const subStart = y + (RH - subBlockH) / 2 + subLineH * 0.7;
        doc.text(subSlice, C[6].x + 2, subStart, { lineHeightFactor: 1.4 });

        // Arrear badge inside subject column end
        if (s.is_arrear) {
          const bx = PW - MR - 14;
          const by = y + (RH - 7) / 2;
          F(AB); RR(bx, by, 12, 7, 1.5);
          doc.setFont("helvetica", "bold"); doc.setFontSize(5.5); T(AM);
          doc.text("ARREAR", bx + 6, by + 4.5, { align: "center" });
        }

        y += RH;
      });

      // table bottom border
      D(N); doc.setLineWidth(0.5); L(ML, y, ML + CW, y);

      // ── LEGEND ───────────────────────────────────────────────────────────
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

      // FOOTER all pages
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

function ExamCard({ session: s }) {
  const dt = fmt(s.date);
  const cd = daysUntil(s.date);
  const arr = s.is_arrear;

  return (
    <div className={`flex overflow-hidden rounded-xl border bg-white shadow-sm
      transition-all duration-200 hover:shadow-md hover:-translate-y-px
      dark:bg-[#0F1C33]
      ${arr
        ? "border-amber-200 dark:border-amber-800/40"
        : "border-blue-100 dark:border-blue-900/30"}`}>

      {/* Date sidebar — narrower on mobile */}
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

      {/* Divider */}
      <div className={`w-px self-stretch
        ${arr ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`} />

      {/* Content — tighter padding */}
      <div className="flex flex-1 flex-col gap-2 px-3 py-2.5 min-w-0">

        {/* Row 1: session pill + hall badge on same line */}
        <div className="flex items-center justify-between gap-1.5">
          {/* Left: pills */}
          <div className="flex flex-wrap items-center gap-1 min-w-0">
            <SessionPill session={s.session} />
            {arr && <ArrearPill />}
            {cd.urgent && <UrgentPill label={cd.label} />}
          </div>

          {/* Right: hall badge — compact */}
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
            <span className="text-[11px] text-blue-500 dark:text-blue-400">{s.time}</span>
          </div>
          {!cd.urgent && (
            <span className="text-[10px] font-medium text-blue-200 dark:text-blue-800 shrink-0">
              {cd.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CreatorCredit() {
  return (
    <a href={CREATOR_LINKEDIN} target="_blank" rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border
        border-blue-100 bg-white px-4 py-2 text-xs shadow-sm transition-all
        hover:border-blue-300 hover:bg-blue-50 hover:shadow-md
        dark:border-blue-900/40 dark:bg-[#0F1C33]
        dark:hover:border-blue-700 dark:hover:bg-blue-950">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-[#0A66C2]" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853
          0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9
          1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337
          7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782
          13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0
          23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774
          23.2 0 22.222 0h.003z"/>
      </svg>
      <span className="text-blue-400 dark:text-blue-500">
        Created by{" "}
        <strong className="font-semibold text-blue-700 group-hover:text-blue-800
          dark:text-blue-300 dark:group-hover:text-blue-200">
          Jaison David M
        </strong>
      </span>
    </a>
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
  const [pdfLoading, setPdfLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerNo, setRegisterNo] = useState("");
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    const roll = profile?.roll_no || profile?.rollNo || student?.roll_no || student?.rollNo || "";
    if (!roll) return;
    hasFetched.current = true;
    setRegisterNo(roll);
    setLoading(true);
    fetch(`${API_BASE}/exam-hall/all?registerNo=${roll}`)
      .then(r => r.json())
      .then(data => {
        if (!data.success || !data.sessions?.length) { setError("No exam schedule found."); return; }
        const up = data.sessions.filter(s => !isExamOver(s));
        up.length === 0 ? setError("All exams done — nothing upcoming.") : setSessions(up);
      })
      .catch(() => setError("Could not reach the server. Try again."))
      .finally(() => setLoading(false));
  }, [profile, student]);

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
      {/* light: very pale blue-white bg  |  dark: deep navy bg */}
      <div className="min-h-screen bg-[#EEF4FF] px-4 py-8 dark:bg-[#080F1E]">
        <div className="mx-auto max-w-2xl space-y-6">

          {/* ── BIT Header card ── */}
          <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-blue-100 dark:ring-blue-900/30">
            <div className="flex items-center gap-3 bg-blue-600 dark:bg-[#0F2850] px-5 py-4">
              <div
                className="flex h-11 w-11 shrink-0 flex-col items-center
      justify-center rounded-xl bg-blue-600"
              >
                <span className="text-[12px] font-black leading-none text-white">BIT</span>
                <span className="text-[7px] font-bold leading-none text-blue-200">SATHY</span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">
                  Bannari Amman Institute of Technology
                </p>
                <p className="text-[11px] text-blue-300">
                  Semester Examinations
                </p>
              </div>

              <button
                onClick={() => navigate("/exam-hall-manual")}
                className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold text-white
      backdrop-blur transition hover:bg-white/20"
              >
                Manual Search
              </button>
            </div>

            <div className="bg-white px-5 py-3.5 dark:bg-[#0F1C33]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-blue-400" />
                    <h1 className="text-base font-bold text-blue-900 dark:text-blue-100">
                      Exam Hall Schedule
                    </h1>
                  </div>

                  {registerNo && (
                    <p className="mt-0.5 font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {registerNo}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigate("/exam-hall-manual")}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                >
                  Can't find hall?
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

          {/* ── Not signed in ── */}
          {!loading && !sessions && !error && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border
              border-dashed border-blue-200 bg-white py-20
              dark:border-blue-900/40 dark:bg-[#0F1C33]">
              <CalendarDays className="h-8 w-8 text-blue-200 dark:text-blue-700" />
              <p className="text-sm text-blue-400 dark:text-blue-500">
                Sign in to view your exam schedule
              </p>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100
              bg-red-50 px-4 py-3.5 dark:border-red-900/30 dark:bg-red-900/10">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* ── Schedule ── */}
          {sessions && sorted.length > 0 && (
            <div className="space-y-5">

              {/* Stats + Download */}


              {/* Exam cards grouped by date */}
              {Object.entries(grouped).map(([date, exams]) => {
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
                        <ExamCard key={`${s.course_code}-${s.session}-${i}`} session={s} />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Creator credit */}
              <div className="flex justify-center pt-2 pb-4">
                <CreatorCredit />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from "react";
import {
  X,
  Calculator,
  Loader2,
  RefreshCw,
  Sparkles,
  AlertCircle,
  BookOpen,
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileText,
  Info,
  TrendingUp,
  Copy,
  Check,
} from "lucide-react";
import { haptics } from "@/utils/haptics.js";

// Helper to determine target reward points per evaluation period based on batch / period
function getPeriodTargetPoints(periodKey, rollNo) {
  const clean = String(rollNo || "").trim().toUpperCase().replace(/\s+/g, "");
  const p = String(periodKey || "").toUpperCase();

  const isBatch24 = clean.startsWith("737624") || /^24[A-Z]/i.test(clean) || clean.includes("737624");
  if (isBatch24) {
    if (p.includes("IP-1") || p.includes("IP1")) return "495.00";
    if (p.includes("IP-2") || p.includes("IP2")) return "495.00";
    if (p.includes("TOTAL")) return "990.00";
    return "990.00";
  }

  // Default standard target (Batch 22 & 25): IP-1: 672.00 | IP-2: 612.00 | Total: 1284.00
  if (p.includes("IP-1") || p.includes("IP1")) return "672.00";
  if (p.includes("IP-2") || p.includes("IP2")) return "612.00";
  if (p.includes("TOTAL")) return "1284.00";
  return null;
}

export default function InternalMarksConversionModal({
  open,
  onClose,
  student,
  data,
  loading,
  error,
  onRefresh,
}) {
  const [showRawText, setShowRawText] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);

  React.useEffect(() => {
    if (open && error) {
      haptics.error();
    }
  }, [open, error]);

  if (!open) return null;

  const rollNo = String(
    student?.roll_no || student?.user_id || student?.reg_no || data?.roll_no || ""
  ).trim();
  const studentName = student?.student_name || "Student";
  const subjects = data?.subjects || [];
  const hasParsedSubjects = subjects.length > 0;
  const overall = data?.overall || null;

  const totalEarnedMarks = parseFloat(overall?.totalInternalMarks) || 0;
  const totalMaxMarks =
    overall?.maxMarks || (subjects.length > 0 ? subjects.length * 30 : 0);
  const completionPercentage =
    totalMaxMarks > 0
      ? Math.min(100, Math.round((totalEarnedMarks / totalMaxMarks) * 100))
      : overall?.percentage || 0;

  const handleCopyRaw = (e) => {
    e.stopPropagation();
    if (!data?.raw) return;
    navigator.clipboard.writeText(data.raw);
    setCopiedRaw(true);
    haptics.light();
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/75 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="
          w-full sm:max-w-3xl rounded-t-3xl sm:rounded-3xl
          bg-white border border-slate-200/90 dark:bg-slate-900 dark:border-slate-800
          shadow-2xl shadow-slate-950/20 dark:shadow-black/70
          max-h-[92dvh] sm:max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-5 sm:px-6 py-4 shrink-0 bg-slate-50/70 dark:bg-slate-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 shrink-0">
              <Calculator className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                <span>Internal Mark Conversion</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  <Sparkles className="h-3 w-3" />
                  Innovative Practice (IP)
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {studentName} · <span className="font-mono font-semibold">{rollNo}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onRefresh && (
              <button
                type="button"
                onClick={(e) => {
                  haptics.action();
                  onRefresh(e);
                }}
                disabled={loading}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh conversion from server"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-indigo-500" : ""}`} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                haptics.light();
                onClose(e);
              }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center animate-pulse">
                  <Calculator className="h-7 w-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <Loader2 className="h-6 w-6 animate-spin text-purple-600 absolute -top-1 -right-1" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Extracting internal marks…
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Analyzing Innovative Practice (IP) conversion & reward points
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                <span>Failed to fetch internal mark conversion</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{error}</p>
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-rose-700 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Try Again</span>
                </button>
              )}
            </div>
          ) : !data || (!hasParsedSubjects && !data.raw) ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-slate-400">
              <span className="text-3xl font-light">—</span>
              <span className="text-xs">No internal marks records available for {rollNo}.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 1. OVERALL SUMMARY KPI DASHBOARD */}
              {overall && (overall.totalInternalMarks || overall.totalRewardPoints) && (
                <div className="rounded-2xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-purple-950/20 p-4 sm:p-5 shadow-xs space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                        Overall Performance Summary
                      </span>
                    </div>

                    {completionPercentage === 100 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300/70 dark:border-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                        100% Full Marks
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {completionPercentage}% Achieved
                      </span>
                    )}
                  </div>

                  {/* 3 KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* KPI 1: Total Internal Marks */}
                    <div className="flex flex-col justify-between p-3.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Total Internal Marks
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5 font-mono">
                          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {overall.totalInternalMarks || "0.00"}
                          </span>
                          {totalMaxMarks > 0 && (
                            <span className="text-xs text-slate-400 font-medium">
                              / {totalMaxMarks}.00
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Internal marks period breakdown */}
                      {overall.internalMarksBreakdown?.periods &&
                        Object.keys(overall.internalMarksBreakdown.periods).length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-1.5">
                            {Object.entries(overall.internalMarksBreakdown.periods).map(([pk, pv]) => (
                              <span
                                key={pk}
                                className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/60"
                              >
                                {pk}: <span className="font-bold">{pv}m</span>
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* KPI 2: Total Reward Points Redeemed */}
                    <div className="flex flex-col justify-between p-3.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Total RP Redeemed
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5 font-mono">
                          <span className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            {overall.totalRewardPoints || "0.00"}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">pts</span>
                        </div>
                      </div>

                      {/* Reward points period breakdown */}
                      {overall.rewardPointsBreakdown?.periods &&
                        Object.keys(overall.rewardPointsBreakdown.periods).length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap items-center gap-1.5">
                            {Object.entries(overall.rewardPointsBreakdown.periods).map(([pk, pv]) => (
                              <span
                                key={pk}
                                className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60"
                              >
                                {pk}: <span className="font-bold">{pv}</span>
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    {/* KPI 3: Evaluated Subjects */}
                    <div className="flex flex-col justify-between p-3.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Evaluated Subjects
                        </span>
                        <div className="mt-1 flex items-baseline gap-1.5 font-mono">
                          <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">
                            {overall.totalSubjects || subjects.length || "0"}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            {overall.rewardPointsBreakdown?.category?.split(":")[0]?.trim() || "Theory Subjects"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Award className="h-3 w-3 text-amber-500" />
                          Max 30 internal marks / subject
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Overall Progress Bar */}
                  {totalMaxMarks > 0 && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                        <span>Overall Conversion Progress</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {totalEarnedMarks} / {totalMaxMarks} Marks ({completionPercentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-500"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. SUBJECT-BY-SUBJECT BREAKDOWN */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Theory Subjects Breakdown ({subjects.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    IP-1 (15m) + IP-2 (15m) = 30m
                  </span>
                </div>

                {subjects.map((sub, idx) => {
                  const subjectTotalMarks =
                    sub.totalMarks ||
                    parseFloat(sub.internalMarks?.Total || sub.internalMarks?.total || "0") ||
                    0;
                  const isSubjectFullMarks = subjectTotalMarks >= 30;

                  // Get periods (IP-1, IP-2)
                  const periodKeys = Array.from(
                    new Set([
                      ...Object.keys(sub.rewardPoints || {}),
                      ...Object.keys(sub.internalMarks || {}),
                    ])
                  ).filter((k) => k.toLowerCase() !== "total");

                  return (
                    <div
                      key={sub.code || idx}
                      className="
                        rounded-2xl border border-slate-300/80 dark:border-slate-700/80
                        bg-slate-50/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900
                        hover:border-indigo-300 dark:hover:border-indigo-700/70
                        shadow-2xs transition-all overflow-hidden
                      "
                    >
                      {/* Subject Card Header */}
                      <div className="flex items-center justify-between px-4 py-3 bg-white/70 dark:bg-slate-800/60 border-b border-slate-200/70 dark:border-slate-800">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/70 dark:border-indigo-800/80 text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono shrink-0">
                            #{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                              {sub.code}
                            </span>
                            {sub.category && (
                              <span className="ml-2 text-[10px] text-slate-500 dark:text-slate-400 font-sans hidden xs:inline">
                                {sub.category}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Subject Total Marks Pill */}
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`
                              inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold
                              ${
                                isSubjectFullMarks
                                  ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300/80 dark:border-emerald-700/80 shadow-2xs"
                                  : "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-900 dark:text-indigo-200 border border-indigo-200/80 dark:border-indigo-800"
                              }
                            `}
                          >
                            <Award className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <span>
                              Total: {subjectTotalMarks.toFixed(2)} / 30.00
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Evaluation Period Columns (IP-1 & IP-2) */}
                      <div className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {periodKeys.map((pKey) => {
                          const rpVal = sub.rewardPoints?.[pKey] || "0.00";
                          const imVal = sub.internalMarks?.[pKey] || "0.00";
                          const rpTarget = getPeriodTargetPoints(pKey, rollNo);
                          const isFullMark = parseFloat(imVal) >= 15;

                          return (
                            <div
                              key={pKey}
                              className="flex flex-col justify-between p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs space-y-2.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800/60">
                                  {pKey} Evaluation
                                </span>

                                <span
                                  className={`inline-flex items-center gap-1 text-xs font-mono font-bold px-2 py-0.5 rounded-md border ${
                                    isFullMark
                                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300/70 dark:border-emerald-800/60"
                                      : "bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                                  }`}
                                >
                                  {imVal} / 15.00
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1 border-t border-slate-100 dark:border-slate-700/50">
                                <div>
                                  <span className="text-[10px] text-slate-400 font-sans block">
                                    RP Redeemed
                                  </span>
                                  <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {rpVal}
                                    {rpTarget && (
                                      <span className="text-[10px] text-slate-400 font-normal">
                                        {" "}/ {rpTarget}
                                      </span>
                                    )}
                                  </span>
                                </div>

                                <div className="text-right">
                                  <span className="text-[10px] text-slate-400 font-sans block">
                                    Internal Mark
                                  </span>
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {imVal} Marks
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Subject Footer Strip: Total RP & Internal Marks */}
                      {(sub.rewardPoints?.Total || sub.internalMarks?.Total) && (
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-100/70 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800 text-[11px] font-mono">
                          <span className="text-slate-500 dark:text-slate-400">
                            Subject RP Total:{" "}
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {sub.rewardPoints?.Total || sub.totalPoints || "0.00"} RP
                            </span>
                          </span>

                          <span className="font-bold text-emerald-700 dark:text-emerald-400">
                            Internal Score: {sub.internalMarks?.Total || sub.totalMarks || "0.00"} / 30.00
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 3. INNOVATIVE PRACTICE (IP) CONVERSION CRITERIA CALLOUT */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-3.5 sm:p-4 text-xs text-slate-600 dark:text-slate-400 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                  <Info className="h-4 w-4 text-indigo-500 shrink-0" />
                  <span>How Innovative Practice (IP) Conversion Works</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Each theory subject awards up to <strong className="text-slate-900 dark:text-white">30 internal marks</strong> through Innovative Practice. Marks are evaluated in two cycles:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[10.5px]">
                  <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">IP-1 Cycle:</span> Max 15 internal marks (Target: ~672 RP)
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-purple-600 dark:text-purple-400">IP-2 Cycle:</span> Max 15 internal marks (Target: ~612 RP)
                  </div>
                </div>
              </div>

              {/* 4. COLLAPSIBLE RAW SUMMARY ACCORDION */}
              {data.raw && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      haptics.light();
                      setShowRawText(!showRawText);
                    }}
                    className="flex w-full items-center justify-between px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-3.5 w-3.5 text-slate-400" />
                      <span>View Raw Summary Output</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {showRawText ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {showRawText && (
                    <div className="border-t border-slate-100 dark:border-slate-800 p-3 sm:p-4 bg-slate-950 text-slate-200 relative">
                      <button
                        type="button"
                        onClick={handleCopyRaw}
                        className="absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-200 border border-slate-700 transition cursor-pointer"
                      >
                        {copiedRaw ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <pre className="text-[11px] font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto select-all pr-14">
                        {data.raw}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-3.5 shrink-0 bg-slate-50/70 dark:bg-slate-900/60 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-mono">
              {subjects.length > 0 ? `${subjects.length} subjects evaluated` : "Innovative Practice"}
            </span>
            {totalEarnedMarks > 0 && (
              <>
                <span>·</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {totalEarnedMarks} total marks
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

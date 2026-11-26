import React from "react";
import {
  X,
  Calculator,
  Loader2,
  RefreshCw,
  Sparkles,
  AlertCircle,
  BookOpen,
  Award,
} from "lucide-react";
import { haptics } from "@/utils/haptics.js";

export default function InternalMarksConversionModal({
  open,
  onClose,
  student,
  data,
  loading,
  error,
  onRefresh,
}) {
  React.useEffect(() => {
    if (open && error) {
      haptics.error();
    }
  }, [open, error]);

  if (!open) return null;

  const formatScore = (val) => {
    if (val === null || val === undefined || val === "") return "0";
    const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return String(val);
    return num % 1 === 0 ? num.toFixed(0) : num.toFixed(2);
  };

  const rollNo = String(
    student?.roll_no || student?.user_id || student?.reg_no || data?.roll_no || ""
  ).trim();
  const studentName = student?.student_name || data?.studentName || "Student";
  const subjects = (data?.subjects || []).filter((s) => s && s.code);
  const hasParsedSubjects = subjects.length > 0;
  const overall = data?.overall || null;
  const totalEarnedMarks =
    parseFloat(overall?.totalInternalMarks || overall?.total_internal_marks) ||
    subjects.reduce((sum, s) => sum + (s.totalMarks || s.mark || 0), 0);

  // Check if any subject actually has IP redemption / breakdown data
  const hasAnyIPData = subjects.some(
    (s) =>
      (s.ip1Points && s.ip1Points > 0) ||
      (s.ip2Points && s.ip2Points > 0) ||
      (s.ip1Marks && s.ip1Marks > 0) ||
      (s.ip2Marks && s.ip2Marks > 0) ||
      (s.ip1_points && s.ip1_points > 0) ||
      (s.ip2_points && s.ip2_points > 0) ||
      (s.ip1_marks && s.ip1_marks > 0) ||
      (s.ip2_marks && s.ip2_marks > 0)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/75 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="
          w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl
          bg-white border border-slate-200/90 dark:bg-slate-900 dark:border-slate-800
          shadow-2xl shadow-slate-950/20 dark:shadow-black/70
          max-h-[92dvh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200
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
                <span>{hasAnyIPData ? "Internal Mark Conversion" : "Internal Marks"}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  <Sparkles className="h-3 w-3" />
                  {hasAnyIPData ? "IP" : "Marks"}
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
        <div className="overflow-y-auto flex-1 p-4 sm:p-5">
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
                  Analyzing Innovative Practice (IP) conversion
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-5 text-xs text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                <span>Failed to fetch internal mark conversion</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">
                {typeof error === "string" ? error : error?.message || error?.details || JSON.stringify(error)}
              </p>
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
            <div className="space-y-2.5">
              <div className="flex items-center justify-between px-1 pb-1">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Evaluated Subjects ({subjects.length})</span>
                </h4>
                {totalEarnedMarks > 0 && (
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Total: {formatScore(totalEarnedMarks)} marks
                  </span>
                )}
              </div>

              {subjects.map((sub, idx) => {
                const subjectTotalMarks =
                  sub.totalMarks !== undefined
                    ? sub.totalMarks
                    : parseFloat(sub.internalMarks?.Total || sub.internalMarks?.total || "0") ||
                      0;

                // Find valid period keys (IP-1, IP-2, etc.) that actually contain non-zero points or marks
                const rawKeys = Array.from(
                  new Set([
                    ...Object.keys(sub.rewardPoints || {}),
                    ...Object.keys(sub.internalMarks || {}),
                    ...(sub.ip1Points > 0 || sub.ip1Marks > 0 || sub.ip1_points > 0 || sub.ip1_marks > 0 ? ["IP-1"] : []),
                    ...(sub.ip2Points > 0 || sub.ip2Marks > 0 || sub.ip2_points > 0 || sub.ip2_marks > 0 ? ["IP-2"] : []),
                  ])
                ).filter((k) => k.toLowerCase() !== "total");

                const activePeriods = rawKeys
                  .map((pKey) => {
                    const rawRp =
                      pKey === "IP-1"
                        ? (sub.ip1Points ?? sub.ip1_points ?? sub.rewardPoints?.["IP-1"])
                        : pKey === "IP-2"
                        ? (sub.ip2Points ?? sub.ip2_points ?? sub.rewardPoints?.["IP-2"])
                        : sub.rewardPoints?.[pKey];

                    const rawIm =
                      pKey === "IP-1"
                        ? (sub.ip1Marks ?? sub.ip1_marks ?? sub.internalMarks?.["IP-1"])
                        : pKey === "IP-2"
                        ? (sub.ip2Marks ?? sub.ip2_marks ?? sub.internalMarks?.["IP-2"])
                        : sub.internalMarks?.[pKey];

                    const rpNum = parseFloat(String(rawRp ?? "0").replace(/[^0-9.-]/g, "")) || 0;
                    const imNum = parseFloat(String(rawIm ?? "0").replace(/[^0-9.-]/g, "")) || 0;

                    return {
                      key: pKey,
                      rpNum,
                      imNum,
                      hasData: rpNum > 0 || imNum > 0,
                    };
                  })
                  .filter((p) => p.hasData);

                return (
                  <div
                    key={sub.code || idx}
                    className="
                      p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800
                      bg-white dark:bg-slate-900/90 shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800/60
                      transition flex flex-col gap-2.5
                    "
                  >
                    {/* Top Row: Subject Code & Given Internal Mark */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400 font-mono shrink-0">
                          #{idx + 1}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white tracking-wide truncate">
                            {sub.code}
                          </span>
                          {sub.category && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                              {sub.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 font-mono shrink-0">
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {formatScore(subjectTotalMarks)}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">marks</span>
                      </div>
                    </div>

                    {/* Breakdown: Show ONLY active periods that actually have redeemed points or marks */}
                    {activePeriods.length > 0 && (
                      <div className={`grid gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 ${activePeriods.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                        {activePeriods.map((period) => (
                          <div
                            key={period.key}
                            className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800/70 text-xs font-mono"
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                                {period.key}:
                              </span>
                              {period.rpNum > 0 && (
                                <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                                  {formatScore(period.rpNum)} RP
                                </span>
                              )}
                            </div>

                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11.5px] shrink-0">
                              {formatScore(period.imNum)} marks
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-3.5 shrink-0 bg-slate-50/70 dark:bg-slate-900/60 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-mono">
            {subjects.length > 0
              ? `${subjects.length} subjects evaluated`
              : "Internal Marks"}
          </span>

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

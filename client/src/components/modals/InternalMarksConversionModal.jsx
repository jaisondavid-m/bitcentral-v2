import React from "react";
import {
  X,
  Calculator,
  Loader2,
  RefreshCw,
  Sparkles,
  AlertCircle,
  BookOpen,
} from "lucide-react";

export default function InternalMarksConversionModal({
  open,
  onClose,
  student,
  data,
  loading,
  error,
  onRefresh,
}) {
  if (!open) return null;

  const rollNo = String(student?.roll_no || "").trim();
  const studentName = student?.student_name || "Student";
  const hasParsedSubjects = Boolean(data?.subjects && data.subjects.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4"
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
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-5 sm:px-6 py-4 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Calculator className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                <span>Internal Mark Conversion</span>
                <span className="hidden xs:inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  <Sparkles className="h-3 w-3" />
                  IP
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {studentName} · <span className="font-mono">{rollNo}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh conversion"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-5 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center animate-pulse">
                  <Calculator className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <Loader2 className="h-5 w-5 animate-spin text-purple-600 absolute -top-1 -right-1" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Extracting internal marks…
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Calculating Innovative Practice (IP) conversion
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
            <div className="space-y-2.5">
              {data.subjects.map((sub, idx) => {
                // Filter out 'Total' keys completely
                const filteredRewardEntries = Object.entries(sub.rewardPoints || {}).filter(
                  ([key]) => key.toLowerCase() !== "total"
                );
                const filteredInternalEntries = Object.entries(sub.internalMarks || {}).filter(
                  ([key]) => key.toLowerCase() !== "total"
                );

                return (
                  <div
                    key={sub.code || idx}
                    className="
                      flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl
                      border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900/90
                      shadow-2xs hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all
                    "
                  >
                    {/* Subject Header */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                        #{idx + 1}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                          {sub.code}
                        </span>
                      </div>
                    </div>

                    {/* Metrics row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 sm:max-w-md">
                      {/* Reward Points Redeemed */}
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                          Reward Points Redeemed
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {filteredRewardEntries.length > 0 ? (
                            filteredRewardEntries.map(([key, val]) => (
                              <span
                                key={key}
                                className="inline-flex items-center gap-1 font-mono font-bold text-slate-800 dark:text-slate-200 text-xs"
                              >
                                <span className="text-[10px] text-slate-400 font-medium">{key}:</span>
                                <span>{val}</span>
                              </span>
                            ))
                          ) : (
                            <span className="font-mono text-slate-400">—</span>
                          )}
                        </div>
                      </div>

                      {/* Internal Marks Received */}
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100/80 dark:border-emerald-900/40 text-[11px]">
                        <span className="text-emerald-800 dark:text-emerald-300 font-semibold">
                          Internal Marks Received
                        </span>
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {filteredInternalEntries.length > 0 ? (
                            filteredInternalEntries.map(([key, val]) => (
                              <span
                                key={key}
                                className="inline-flex items-center gap-1 font-mono font-bold text-emerald-950 dark:text-emerald-200 text-xs"
                              >
                                <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400 font-medium">{key}:</span>
                                <span>{val}</span>
                              </span>
                            ))
                          ) : (
                            <span className="font-mono text-emerald-400">—</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-3 shrink-0 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-400">
          <span>{data?.subjects?.length ? `${data.subjects.length} subjects found` : "Innovative Practice Conversion"}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

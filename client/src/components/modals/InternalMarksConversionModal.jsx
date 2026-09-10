import React, { useState } from "react";
import {
  X,
  Award,
  BookOpen,
  Calculator,
  Check,
  Copy,
  FileText,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Layers,
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
  const [viewRaw, setViewRaw] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const rollNo = String(student?.roll_no || "").trim();
  const studentName = student?.student_name || "Student";

  const handleCopy = () => {
    if (!data?.raw) return;
    navigator.clipboard.writeText(data.raw);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasParsedSubjects = Boolean(data?.subjects && data.subjects.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="
          w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl
          bg-white border border-slate-200/90 dark:bg-slate-900 dark:border-slate-800
          shadow-2xl shadow-slate-950/20 dark:shadow-black/70
          max-h-[92dvh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-6 py-4 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Calculator className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                <span>Internal Mark Conversion</span>
                <span className="hidden xs:inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  <Sparkles className="h-3 w-3" />
                  IP Engine
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
                title="Refresh from Hugging Face Space"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            )}

            {data?.raw && (
              <button
                type="button"
                onClick={handleCopy}
                className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Copy raw text summary"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
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
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
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
                  Calculating Innovative Practice (IP) conversion via Hugging Face Space
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
            <>
              {/* Top Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Total Internal Marks */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:border-emerald-900/60 dark:from-emerald-950/40 dark:to-teal-950/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20 shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Total Internal Marks
                    </p>
                    <p className="text-base font-extrabold text-emerald-900 dark:text-emerald-200 tabular-nums">
                      {data.overall?.totalInternalMarks || "—"}
                    </p>
                  </div>
                </div>

                {/* Total Reward Points */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50 to-blue-50/60 dark:border-indigo-900/60 dark:from-indigo-950/40 dark:to-blue-950/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20 shrink-0">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                      Total Reward Points
                    </p>
                    <p className="text-base font-extrabold text-indigo-900 dark:text-indigo-200 tabular-nums">
                      {data.overall?.totalRewardPoints || "—"}
                    </p>
                  </div>
                </div>

                {/* Total Subjects */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-purple-200/80 bg-gradient-to-br from-purple-50 to-pink-50/60 dark:border-purple-900/60 dark:from-purple-950/40 dark:to-pink-950/20">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md shadow-purple-600/20 shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                      Total Subjects
                    </p>
                    <p className="text-base font-extrabold text-purple-900 dark:text-purple-200 tabular-nums">
                      {data.overall?.totalSubjects || data.subjects?.length || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* View Switcher Bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-500" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Subject Breakdown ({data.subjects?.length || 0})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setViewRaw(!viewRaw)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  <FileText className="h-3 w-3" />
                  <span>{viewRaw ? "Structured View" : "Raw Output"}</span>
                </button>
              </div>

              {!viewRaw && hasParsedSubjects ? (
                /* Subject Cards Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {data.subjects.map((sub, idx) => {
                    const internalTotal = sub.internalMarks?.Total || sub.internalMarks?.["IP-1"] || "—";
                    const rewardTotal = sub.rewardPoints?.Total || sub.rewardPoints?.["IP-1"] || "—";

                    return (
                      <div
                        key={sub.code || idx}
                        className="
                          flex flex-col justify-between p-4 rounded-2xl
                          border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-900/90
                          shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800/80 transition-all
                        "
                      >
                        {/* Subject Top Bar */}
                        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                              #{idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                              {sub.code}
                            </span>
                          </div>

                          <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
                            <span>{internalTotal}</span>
                            <span className="text-[9px] font-normal text-emerald-600 dark:text-emerald-400">marks</span>
                          </div>
                        </div>

                        {/* Subject Metrics Details */}
                        <div className="grid grid-cols-2 gap-2 pt-3 text-[11px]">
                          {/* Reward Points Column */}
                          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                              Reward Points
                            </span>
                            {Object.entries(sub.rewardPoints).length > 0 ? (
                              Object.entries(sub.rewardPoints).map(([key, val]) => (
                                <div key={key} className="flex justify-between text-slate-700 dark:text-slate-300">
                                  <span className="text-slate-500">{key}:</span>
                                  <span className="font-semibold font-mono">{val}</span>
                                </div>
                              ))
                            ) : (
                              <p className="font-mono text-slate-700 dark:text-slate-300">{rewardTotal}</p>
                            )}
                          </div>

                          {/* Internal Marks Column */}
                          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                              Internal Marks
                            </span>
                            {Object.entries(sub.internalMarks).length > 0 ? (
                              Object.entries(sub.internalMarks).map(([key, val]) => (
                                <div key={key} className="flex justify-between text-emerald-900 dark:text-emerald-200">
                                  <span className="text-emerald-700 dark:text-emerald-400">{key}:</span>
                                  <span className="font-bold font-mono">{val}</span>
                                </div>
                              ))
                            ) : (
                              <p className="font-mono font-bold text-emerald-900 dark:text-emerald-200">{internalTotal}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Raw Monospace Text View */
                <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                  {data.raw}
                </div>
              )}

              {/* Overall Summary Card */}
              {data.overall?.breakdown && data.overall.breakdown.length > 0 && (
                <div className="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/50 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>IP Component Breakdown</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.overall.breakdown.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-lg bg-white dark:bg-slate-800 px-3 py-1 text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-3.5 shrink-0 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-400">
          <span>Powered by Gradio IP Extraction Engine</span>
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

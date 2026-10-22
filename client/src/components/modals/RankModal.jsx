import React, { useState } from "react";
import {
  Trophy,
  X,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Medal,
  Award,
  Crown,
  Users,
  GraduationCap,
  Building2,
  Globe,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { haptics } from "@/utils/haptics.js";

function formatPoints(num) {
  if (num == null || isNaN(num)) return "0.00";
  return Number(num).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getRankBadgeColor(rank) {
  if (rank === 1) {
    return {
      bg: "bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20",
      border: "border-amber-300 dark:border-amber-500/50",
      ring: "ring-2 ring-amber-400/50",
      icon: Crown,
      iconColor: "text-amber-500",
    };
  }
  if (rank === 2) {
    return {
      bg: "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-900 font-bold",
      border: "border-slate-300 dark:border-slate-600",
      ring: "ring-2 ring-slate-300/50",
      icon: Medal,
      iconColor: "text-slate-400",
    };
  }
  if (rank === 3) {
    return {
      bg: "bg-gradient-to-r from-amber-700 to-amber-800 text-white font-bold",
      border: "border-amber-600 dark:border-amber-700/60",
      ring: "ring-2 ring-amber-700/40",
      icon: Award,
      iconColor: "text-amber-600",
    };
  }
  return {
    bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-800",
    ring: "",
    icon: Trophy,
    iconColor: "text-slate-400",
  };
}

export default function RankModal({
  open,
  onClose,
  student,
  data,
  loading,
  error,
  onRefresh,
}) {
  const [metric, setMetric] = useState("balance"); // "balance" or "cumulative"

  React.useEffect(() => {
    if (open && error) {
      haptics.error();
    } else if (open && data) {
      haptics.light();
    }
  }, [open, error, data]);

  if (!open) return null;

  const studentInfo = data?.student || student || {};
  const rollNo = String(studentInfo.roll_no || "").trim();
  const studentName = studentInfo.student_name || "Student";
  const deptName = studentInfo.department || studentInfo.tab || "Department";
  const yearText = studentInfo.year || studentInfo.normalized_year || "Year";

  const ranks = metric === "cumulative" ? data?.cumulative_ranks : data?.ranks;
  const deptYearRank = ranks?.dept_year;
  const deptRank = ranks?.dept;
  const yearRank = ranks?.year;
  const collegeRank = ranks?.college;

  const currentPoints =
    metric === "cumulative"
      ? Number(studentInfo.cumulative_points || student?.cumulative_reward_points || 0)
      : Number(studentInfo.balance_points || student?.balance_points || 0);

  const toppers = data?.toppers || [];

  const rankCards = [
    {
      id: "dept_year",
      title: "Dept & Year Rank",
      subtitle: deptYearRank?.scope || `${yearText} Year • ${studentInfo.tab || deptName}`,
      stat: deptYearRank,
      icon: GraduationCap,
      color: "amber",
      gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
      borderColor: "border-amber-200/80 dark:border-amber-900/60",
      accentBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
      badgeText: "Most Relevant",
      featured: true,
    },
    {
      id: "dept",
      title: "Department Rank",
      subtitle: deptRank?.scope || `All ${studentInfo.tab || deptName}`,
      stat: deptRank,
      icon: Building2,
      color: "indigo",
      gradient: "from-indigo-500/10 via-blue-500/5 to-transparent",
      borderColor: "border-indigo-200/80 dark:border-indigo-900/60",
      accentBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60",
      featured: false,
    },
    {
      id: "year",
      title: "Year-wise Rank",
      subtitle: yearRank?.scope || `All ${yearText} Year`,
      stat: yearRank,
      icon: Users,
      color: "purple",
      gradient: "from-purple-500/10 via-fuchsia-500/5 to-transparent",
      borderColor: "border-purple-200/80 dark:border-purple-900/60",
      accentBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
      featured: false,
    },
    {
      id: "college",
      title: "College Overall Rank",
      subtitle: collegeRank?.scope || "All Departments & Years",
      stat: collegeRank,
      icon: Globe,
      color: "emerald",
      gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      borderColor: "border-emerald-200/80 dark:border-emerald-900/60",
      accentBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
      featured: false,
    },
  ];

  // Compare with dept & year average
  const avgDiff = deptYearRank?.avgScore
    ? Math.round(currentPoints - deptYearRank.avgScore)
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4"
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
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-5 sm:px-6 py-4 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 text-white shadow-md shadow-amber-500/25 shrink-0">
              <Trophy className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                <span>Reward Points Rank</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  <Sparkles className="h-3 w-3" />
                  Live Rank
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {studentName} · <span className="font-mono">{rollNo}</span>
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
                title="Refresh ranks from Google Sheets"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                haptics.light();
                onClose(e);
              }}
              className="rounded-xl border border-slate-200 dark:border-slate-700 p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
              <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Calculating ranks across Google Sheets…
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Parsing department tabs and computing year standings
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0" />
                <h4 className="text-sm font-semibold">Unable to calculate ranks</h4>
              </div>
              <p className="text-xs leading-relaxed text-red-600 dark:text-red-400">
                {error}
              </p>
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-red-700 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  Retry Calculation
                </button>
              )}
            </div>
          ) : !data ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-slate-400">
              <Trophy className="h-8 w-8 text-slate-300 dark:text-slate-600" />
              <p className="text-xs">No rank data available.</p>
            </div>
          ) : (
            <>
              {/* Metric Switcher Tab */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
                <div className="inline-flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => {
                      haptics.light();
                      setMetric("balance");
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      metric === "balance"
                        ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    Balance Points Rank
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      haptics.light();
                      setMetric("cumulative");
                    }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      metric === "cumulative"
                        ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    Earned Points Rank
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Your Score:
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatPoints(currentPoints)} RP
                  </span>
                </div>
              </div>

              {/* Rank Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {rankCards.map((card) => {
                  const Icon = card.icon;
                  const stat = card.stat;
                  const rank = stat?.rank || 0;
                  const total = stat?.total || 0;
                  const percentile = stat?.percentile ?? 0;

                  return (
                    <div
                      key={card.id}
                      className={`
                        relative flex flex-col justify-between overflow-hidden rounded-2xl border
                        bg-gradient-to-br ${card.gradient} bg-white dark:bg-slate-900/90
                        ${card.borderColor} p-4 sm:p-4.5 transition-all hover:shadow-md
                        ${card.featured ? "ring-1 ring-amber-400/40 dark:ring-amber-500/30" : ""}
                      `}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg border ${card.accentBg}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                              {card.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              {card.subtitle}
                            </p>
                          </div>
                        </div>

                        {card.badgeText && (
                          <span className="rounded-full bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60">
                            {card.badgeText}
                          </span>
                        )}
                      </div>

                      {/* Rank Number Display */}
                      <div className="my-3 flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                            #{rank > 0 ? rank : "—"}
                          </span>
                          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            of {total > 0 ? total.toLocaleString() : "—"} students
                          </span>
                        </div>

                        {rank > 0 && (
                          <div className="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                            <Sparkles className="h-3 w-3 text-amber-500" />
                            <span>Top {Math.max(0.1, (100 - percentile).toFixed(1))}%</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom context / progress */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Cohort Top:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                          {stat?.top_score ? formatPoints(stat.top_score) : "—"} RP
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Performance Insights Banner */}
              {deptYearRank && (
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Department & Year Standing Insights
                      </span>
                    </div>

                    {avgDiff !== null && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          avgDiff >= 0
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                        }`}
                      >
                        {avgDiff >= 0 ? `+${avgDiff.toLocaleString()} RP above average` : `${Math.abs(avgDiff).toLocaleString()} RP below average`}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-700/60 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 py-2.5">
                    <div className="text-center px-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Your Points
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                        {formatPoints(currentPoints)}
                      </p>
                    </div>
                    <div className="text-center px-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Dept Average
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                        {deptYearRank.avg_score ? formatPoints(deptYearRank.avg_score) : "—"}
                      </p>
                    </div>
                    <div className="text-center px-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Dept Highest
                      </p>
                      <p className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 font-mono mt-0.5">
                        {deptYearRank.top_score ? formatPoints(deptYearRank.top_score) : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Toppers Mini Section */}
              {toppers.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Crown className="h-3.5 w-3.5 text-amber-500" />
                      <span>Top Performers in {deptYearRank?.scope || "Dept & Year"}</span>
                    </h4>
                    <span className="text-[11px] text-slate-400 font-medium">Balance RP</span>
                  </div>

                  <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-2xs">
                    {toppers.map((t) => {
                      const badge = getRankBadgeColor(t.rank);
                      const isTargetStudent =
                        String(t.roll_no).toUpperCase().replace(/\s+/g, "") ===
                        String(rollNo).toUpperCase().replace(/\s+/g, "");

                      return (
                        <div
                          key={t.roll_no}
                          className={`flex items-center justify-between px-3.5 py-2.5 transition-colors ${
                            isTargetStudent
                              ? "bg-amber-50/70 dark:bg-amber-950/30"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs ${badge.bg}`}
                            >
                              {t.rank}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-900 dark:text-white truncate flex items-center gap-1.5">
                                <span>{t.student_name}</span>
                                {isTargetStudent && (
                                  <span className="rounded-sm bg-amber-500 px-1 py-0.2 text-[9px] font-bold text-slate-950">
                                    YOU
                                  </span>
                                )}
                              </p>
                              <p className="text-[10px] font-mono text-slate-400 truncate">
                                {t.roll_no}
                              </p>
                            </div>
                          </div>

                          <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                            {formatPoints(t.balance_points)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

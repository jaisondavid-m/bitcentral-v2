import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, MapPin, User, Loader2, X, ChevronRight } from "lucide-react";
import api from "../api/axios.js";

const Meta = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-2">
    <Icon
      className="mt-px h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-500"
      strokeWidth={1.6}
    />
    <span className="text-[12px] leading-snug text-slate-600 dark:text-slate-400">
      {children}
    </span>
  </div>
);

export default function RpCard({ student }) {
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [points, setPoints]   = useState([]);
  const pointsCache = React.useRef(new Map());

  if (!student) return null;

  const rollNo = String(student.roll_no || "").trim();

  const parseNumeric = (value) => {
    if (typeof value === "number") return value;
    if (value == null) return Number.NaN;
    const normalized = String(value).replace(/,/g, "").trim();
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  };

  const studentPoints = parseNumeric(student?.balance_points);

  const { data: averages = {}, isFetching: isAveragesLoading } = useQuery({
    queryKey: ["rp-averages"],
    queryFn: async () => {
      const res = await api.get("/averages");
      return res?.data?.averages || {};
    },
    enabled: open,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const resolveYearKey = (year) => {
    const value = String(year || "").trim().toLowerCase();
    if (value.startsWith("4") || value.startsWith("iv")) return "year_4";
    if (value.startsWith("3") || value.startsWith("iii")) return "year_3";
    if (value.startsWith("2") || value.startsWith("ii")) return "year_2";
    if (value.startsWith("1") || value.startsWith("i")) return "year_1";
    return "";
  };

  const yearKey = resolveYearKey(student.year);
  const yearAverage = yearKey ? parseNumeric(averages?.[yearKey]) : Number.NaN;
  const averageDelta = Number.isFinite(yearAverage) && Number.isFinite(studentPoints)
    ? Math.round(studentPoints - yearAverage)
    : null;

  let averageMessage = null;
  let averageTone = "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-300";
  if (Number.isFinite(yearAverage) && averageDelta !== null) {
    if (averageDelta > 0) {
      averageMessage = `You are ${averageDelta} points higher than average.`;
      averageTone = "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300";
    } else if (averageDelta < 0) {
      averageMessage = `You are ${Math.abs(averageDelta)} points below average.`;
      averageTone = "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300";
    } else {
      averageMessage = "You are exactly at the year average.";
      averageTone = "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300";
    }
  }

  const fetchPoints = async () => {
    setOpen(true);
    setLoading(true);
    setError("");
    setPoints([]);
    if (pointsCache.current.has(rollNo)) {
      const cached = pointsCache.current.get(rollNo);
      setPoints(cached);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/rewards", { params: { roll_no: rollNo } });
      const d   = res?.data;
      const data = Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
      
      // Store in cache
      pointsCache.current.set(rollNo, data);
      setPoints(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Card */}
      <article className="
        group flex flex-col overflow-hidden rounded-2xl
        bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800
        transition-all duration-200
        hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-px
        hover:shadow-lg hover:shadow-slate-900/10 dark:hover:shadow-black/30
      ">
        <div className="flex flex-col gap-4 p-5">

          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-[13.5px] font-semibold text-slate-900 dark:text-white leading-tight">
                {student.student_name}
              </h3>
              <p className="mt-0.5 font-mono text-[11px] font-medium text-slate-600 dark:text-slate-400">
                {rollNo}
              </p>
            </div>
            <span className="shrink-0 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400">
              {student.tab}
            </span>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800" />

          {/* Meta */}
          <div className="space-y-2">
            <Meta icon={GraduationCap}>{student.year} Year&nbsp;&bull;&nbsp;{student.course_code}</Meta>
            <Meta icon={MapPin}>{student.department}</Meta>
            <Meta icon={User}>Mentor: {student.mentor_name}</Meta>
          </div>

          {/* Points */}
          <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 border border-slate-200 dark:divide-slate-800 dark:bg-slate-800/60 dark:border-slate-800">
            {[
              { label: "Earned",   value: student.cumulative_reward_points, color: "text-slate-900 dark:text-white" },
              { label: "Balance",  value: student.balance_points,           color: "text-amber-400" },
              { label: "Redeemed", value: student.redeemed_points,          color: "text-emerald-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-1 py-3">
                <span className="text-[9px] font-semibold uppercase tracking-widest text-slate-500">
                  {label}
                </span>
                <span className={`text-sm font-bold tabular-nums ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={fetchPoints}
            className="
              flex w-full items-center justify-between
              rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700
              px-4 py-2.5 text-[12px] font-medium text-slate-700 dark:text-slate-300
              transition-colors hover:bg-slate-200 dark:hover:bg-slate-700/70 hover:text-slate-900 dark:hover:text-white active:scale-[.98]
            "
          >
            <span>View detailed points</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" strokeWidth={2} />
          </button>
        </div>
      </article>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="
              w-full sm:max-w-3xl rounded-t-2xl sm:rounded-2xl
              bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-2xl shadow-slate-900/20 dark:shadow-black/60
              max-h-[92dvh] sm:max-h-[80vh] flex flex-col overflow-hidden
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4 shrink-0">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-slate-900 dark:text-white">Reward points breakdown</p>
                <p className="mt-0.5 text-[11px] text-slate-500 truncate">
                  {student.student_name}&nbsp;&bull;&nbsp;{rollNo}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-auto flex-1 p-5">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-xs">Fetching points…</span>
                </div>
              ) : error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400">
                  {error}
                </div>
              ) : points.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-20 text-slate-500 dark:text-slate-600">
                  <span className="text-3xl font-light">—</span>
                  <span className="text-xs">No records found for this roll number.</span>
                </div>
              ) : (
                <>
                  {yearKey && (
                    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${averageTone}`}>
                      {isAveragesLoading ? (
                        <span className="inline-flex items-center gap-2 text-xs font-medium">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Checking year average...
                        </span>
                      ) : averageMessage ? (
                        <>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] opacity-70">
                            Year average
                          </p>
                          <p className="mt-1 font-medium">{averageMessage}</p>
                        </>
                      ) : (
                        <p className="text-xs font-medium">Year average is not available.</p>
                      )}
                    </div>
                  )}

                  {/* Mobile cards */}
                  <div className="space-y-2 sm:hidden">
                    {points.map((e, i) => (
                      <div
                        key={`${e?.date}-${e?.activity_name}-${i}`}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[12px] font-medium text-slate-800 dark:text-slate-200 leading-snug flex-1">
                            {e?.activity_name || "—"}
                          </span>
                          <span className="shrink-0 text-sm font-semibold text-emerald-400 tabular-nums">
                            +{e?.reward_points || "0"}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {e?.activity_type && (
                            <span className="rounded-full bg-slate-100 px-2 py-px text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              {e.activity_type}
                            </span>
                          )}
                          {e?.date && (
                            <span className="text-[10px] text-slate-500">{e.date}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop table */}
                  <div className="hidden sm:block rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100 dark:bg-slate-800/60">
                          {["Date", "Activity type", "Activity name", "Points"].map((h) => (
                            <th key={h} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-500 last:text-right">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800/70">
                        {points.map((e, i) => (
                          <tr key={`${e?.date}-${e?.activity_name}-${i}`} className="text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-slate-500">{e?.date || "—"}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">{e?.activity_type || "—"}</td>
                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{e?.activity_name || "—"}</td>
                            <td className="px-4 py-3 text-right font-semibold text-emerald-400 tabular-nums">
                              +{e?.reward_points || "0"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
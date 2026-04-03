import React, { useMemo, useState } from "react";
import { GraduationCap, MapPin, User, Loader2, X, Sparkles } from "lucide-react";
import api from "../api/axios.js";

function RpCard({ student }) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [detailedPoints, setDetailedPoints] = useState([]);

  if (!student) return null;

  const balance = Number(student.balance_points) || 0;
  const isHighPerformer = balance >= 300;
  const rollNo = String(student.roll_no || "").trim();
  

  const handleOpenDetailedPoints = async () => {
    if (!rollNo) {
      setDetailsError("Roll number is missing for this student.");
      setIsDetailsModalOpen(true);
      return;
    }

    setIsDetailsModalOpen(true);
    setIsLoadingDetails(true);
    setDetailsError("");
    setDetailedPoints([]);

    try {
      const response = await api.get("/rewards", {
        params: { roll_no: rollNo },
      });

      const payload = response?.data;
      const rows = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setDetailedPoints(rows);
    } catch (error) {
      setDetailsError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load detailed points. Please try again."
      );
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  return (
    <>
      <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-500/50">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/80 to-indigo-500/0 opacity-0 transition-opacity group-hover:opacity-100" />

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          {/* Top Header */}
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="truncate font-bold leading-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 text-sm sm:text-base">
                {student.student_name}
              </h3>
              <p className="font-mono text-[11px] font-semibold tracking-wider text-indigo-600 dark:text-indigo-400">
                {student.roll_no}
              </p>
            </div>
            <div className="shrink-0 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-600 dark:text-slate-300 whitespace-nowrap">
                {student.tab}
              </span>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="mb-4 space-y-2">
            <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400">
              <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-[1.5]" />
              <span className="text-xs font-medium leading-snug">
                {student.year} Year • {student.course_code}
              </span>
            </div>
            <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-[1.5]" />
              <span className="text-xs font-medium leading-snug break-words">{student.department}</span>
            </div>
            <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-400">
              <User className="mt-0.5 h-3.5 w-3.5 shrink-0 stroke-[1.5]" />
              <span className="text-xs font-medium leading-snug break-words">
                Mentor: {student.mentor_name}
              </span>
            </div>
          </div>

          {/* Points Summary */}
          <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5 dark:border-slate-800 dark:bg-slate-800/45">
            <div className="rounded-lg py-2.5 text-center">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Earned</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                {student.cumulative_reward_points}
              </p>
            </div>
            <div className="rounded-lg border-x border-slate-200 py-2.5 text-center dark:border-slate-700">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Balance</p>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {student.balance_points}
              </p>
            </div>
            <div className="rounded-lg py-2.5 text-center">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400 leading-none">Redeemed</p>
              <p
                className={`text-sm font-black tabular-nums ${
                  isHighPerformer
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-indigo-600 dark:text-indigo-400"
                }`}
              >
                {student.redeemed_points}
              </p>
            </div>
          </div>

          {/* Centered CTA Button */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleOpenDetailedPoints}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 transition-all hover:bg-indigo-100 hover:border-indigo-300 active:scale-95 dark:border-indigo-900/70 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/70"
            >
              <Sparkles className="h-3 w-3" />
              View Detailed Points
            </button>
          </div>
        </div>
      </article>

      {/* Modal */}
      {isDetailsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:px-4 sm:py-6"
          onClick={closeDetailsModal}
        >
          <div
            className="w-full sm:max-w-4xl rounded-t-2xl sm:rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950 max-h-[92dvh] sm:max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-4 py-3.5 dark:border-slate-800 shrink-0">
              <div className="min-w-0 flex-1 pr-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Detailed Reward Points</h3>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400 truncate">
                  {student.student_name} • {rollNo}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetailsModal}
                className="shrink-0 rounded-md border border-slate-200 p-1.5 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-auto flex-1 p-4">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-600 dark:text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading detailed points...</span>
                </div>
              ) : detailsError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300">
                  {detailsError}
                </div>
              ) : detailedPoints.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                  No detailed points found for this roll number.
                </div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="space-y-2 sm:hidden">
                    {detailedPoints.map((entry, index) => (
                      <div
                        key={`${entry?.date || "date"}-${entry?.activity_name || "activity"}-${index}`}
                        className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/40"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug flex-1">
                            {entry?.activity_name || "-"}
                          </span>
                          <span className="shrink-0 text-sm font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                            +{entry?.reward_points || "0"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {entry?.activity_type && (
                            <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                              {entry.activity_type}
                            </span>
                          )}
                          {entry?.date && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-500">
                              {entry.date}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
                    <table className="min-w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        <tr>
                          <th className="px-3 py-2.5 font-semibold">Date</th>
                          <th className="px-3 py-2.5 font-semibold">Activity Type</th>
                          <th className="px-3 py-2.5 font-semibold">Activity Name</th>
                          <th className="px-3 py-2.5 text-right font-semibold">Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailedPoints.map((entry, index) => (
                          <tr
                            key={`${entry?.date || "date"}-${entry?.activity_name || "activity"}-${index}`}
                            className="border-t border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                          >
                            <td className="px-3 py-2 whitespace-nowrap">{entry?.date || "-"}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{entry?.activity_type || "-"}</td>
                            <td className="px-3 py-2">{entry?.activity_name || "-"}</td>
                            <td className="px-3 py-2 text-right font-semibold text-indigo-600 dark:text-indigo-400 tabular-nums">
                              {entry?.reward_points || "0"}
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

export default RpCard;
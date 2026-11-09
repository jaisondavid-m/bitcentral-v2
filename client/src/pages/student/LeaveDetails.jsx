import React, { useState, useMemo } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ChevronRight, AlertCircle, RotateCcw } from "lucide-react";
import api from "@/api/axios.js";
import { haptics } from "@/utils/haptics.js";

const leaveQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function LeaveDetailsContent() {
  const [expandedId, setExpandedId] = useState(null);

  const {
    data: leaves = [],
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["leaves"],
    queryFn: async () => {
      const res = await api.get("/leaves");
      return res.data?.data || [];
    },
  });

  const sortedLeaves = useMemo(() => {
    return [...leaves].sort((a, b) => new Date(a.from_date) - new Date(b.from_date));
  }, [leaves]);

  const categorizedLeaves = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const current = [];
    const upcoming = [];
    const past = [];

    sortedLeaves.forEach((leave) => {
      const from = new Date(leave.from_date);
      const to = new Date(leave.to_date);

      if (today >= from && today <= to) {
        current.push(leave);
      } else if (from > today) {
        upcoming.push(leave);
      } else {
        past.push(leave);
      }
    });

    past.sort((a, b) => new Date(b.from_date) - new Date(a.from_date));

    return { current, upcoming, past };
  }, [sortedLeaves]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", { weekday: "long" });
  };

  const getDurationDays = (from, to, fromHalfDay, toHalfDay) => {
    const diffTime = Math.abs(new Date(to) - new Date(from));
    let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    if (fromHalfDay === "AN") {
      days -= 0.5;
    }
    if (toHalfDay === "FN") {
      days -= 0.5;
    }
    return Math.max(0.5, days);
  };

  const LeaveCard = ({ leave, category }) => {
    const isExpanded = expandedId === leave.from_date;
    const duration = getDurationDays(leave.from_date, leave.to_date, leave.from_half_day, leave.to_half_day);
    const isCurrent = category === "current";
    const isUpcoming = category === "upcoming";

    const categoryBadgeStyle = {
      current: "bg-emerald-500 text-white",
      upcoming: "bg-blue-600 text-white",
      past: "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200",
    };

    const categoryLabel = {
      current: "Ongoing",
      upcoming: "Upcoming",
      past: "Past",
    };

    return (
      <div
        className={`group relative transition-all rounded-xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] ${
          isCurrent ? "ring-2 ring-emerald-500/50" : ""
        }`}
      >
        <button
          onClick={() => {
            haptics.selection();
            setExpandedId(isExpanded ? null : leave.from_date);
          }}
          className="w-full p-4 text-left transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center rounded-md border border-zinc-900 dark:border-white px-2 py-0.5 text-xs font-black shadow-[1.5px_1.5px_0px_#18181b] dark:shadow-[1.5px_1.5px_0px_#ffffff] ${categoryBadgeStyle[category]}`}>
                  {categoryLabel[category]}
                </span>
                {isCurrent && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />}
              </div>

              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-50 truncate">
                {leave.name}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                <Calendar className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                <span>
                  {formatDate(leave.from_date)}{leave.from_half_day ? ` (${leave.from_half_day})` : ""}{leave.to_half_day ? ` → ${formatDate(leave.to_date)} (${leave.to_half_day})` : ""} {(duration > 1 || duration === 0.5) && `• ${duration} ${duration === 1 ? "day" : "days"}`}
                </span>
              </div>
            </div>

            <ChevronRight
              className={`w-5 h-5 text-zinc-700 dark:text-zinc-300 shrink-0 transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-zinc-900 dark:border-white px-4 py-3 bg-blue-50/50 dark:bg-zinc-800/40 rounded-b-lg space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">From</p>
                <p className="text-zinc-900 dark:text-zinc-50 font-black">{formatDate(leave.from_date)}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">{getDayName(leave.from_date)}</p>
              </div>
              <div>
                <p className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">To</p>
                <p className="text-zinc-900 dark:text-zinc-50 font-black">{formatDate(leave.to_date)}</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold">{getDayName(leave.to_date)}</p>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-900 bg-white p-3 dark:border-white dark:bg-zinc-900">
              <p className="text-xs font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Duration</p>
              <p className="text-base sm:text-lg font-black text-blue-600 dark:text-blue-400">
                {duration} {duration === 1 ? "day" : "days"}
              </p>
            </div>

            {leave.from_half_day === "AN" && (
              <div className="rounded-lg border border-zinc-900 bg-amber-50 p-2.5 flex items-center gap-2 dark:border-white dark:bg-amber-950/40">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <p className="text-xs text-amber-900 dark:text-amber-200 font-bold">
                  Leave starts Afternoon (AN) — First half day is College (CLG)
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const errorMessage = error
    ? error?.response?.data?.message || error?.message || "Failed to fetch leaves"
    : "";

  if (error && !isPending) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8fafc] px-4 dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-zinc-900 bg-white p-8 text-center shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-900 bg-rose-50 text-rose-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-rose-950/50 dark:text-rose-400 dark:shadow-[2px_2px_0px_#ffffff]">
            <AlertCircle className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Failed to Load Schedule</h2>
          <p className="mt-1.5 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] py-6 sm:py-10 dark:bg-[#090d16] transition-colors">
        <div className="mx-auto max-w-4xl px-3 sm:px-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 animate-pulse shadow-[2px_2px_0px_#18181b]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const hasAnyLeaves =
    categorizedLeaves.current.length > 0 ||
    categorizedLeaves.upcoming.length > 0 ||
    categorizedLeaves.past.length > 0;

  if (!hasAnyLeaves) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f8fafc] px-4 dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-zinc-900 bg-white p-8 text-center shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[2px_2px_0px_#ffffff]">
            <Calendar className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">No Leaves Recorded</h2>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">There are currently no leaves scheduled on your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] py-6 sm:py-10 dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors">
      <div className="mx-auto max-w-4xl px-3 sm:px-6">
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Leave Schedule</h1>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">Track current, upcoming, and past official leaves.</p>
          </div>
          <span className="inline-flex items-center rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-white dark:shadow-[2px_2px_0px_#ffffff]">
            {leaves.length} records
          </span>
        </div>

        {categorizedLeaves.current.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Currently On Leave
            </h2>
            <div className="space-y-3.5">
              {categorizedLeaves.current.map((leave) => (
                <LeaveCard key={leave.from_date} leave={leave} category="current" />
              ))}
            </div>
          </div>
        )}

        {categorizedLeaves.upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Upcoming Leaves
            </h2>
            <div className="space-y-3.5">
              {categorizedLeaves.upcoming.map((leave) => (
                <LeaveCard key={leave.from_date} leave={leave} category="upcoming" />
              ))}
            </div>
          </div>
        )}

        {categorizedLeaves.past.length > 0 && (
          <div className="mt-10 pt-6 border-t border-zinc-900/20 dark:border-white/20">
            <h2 className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
              Past Leave History
            </h2>
            <div className="space-y-3.5">
              {categorizedLeaves.past.map((leave) => (
                <LeaveCard key={leave.from_date} leave={leave} category="past" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LeaveDetails() {
  return (
    <QueryClientProvider client={leaveQueryClient}>
      <LeaveDetailsContent />
    </QueryClientProvider>
  );
}

export default LeaveDetails;

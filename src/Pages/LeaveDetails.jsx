import React, { useEffect, useState, useMemo } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ChevronRight, AlertCircle } from "lucide-react";
import api from "../api/axios.js";

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

  const getDurationDays = (from, to) => {
    const diffTime = Math.abs(new Date(to) - new Date(from));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const LeaveCard = ({ leave, category }) => {
    const isExpanded = expandedId === leave.from_date;
    const duration = getDurationDays(leave.from_date, leave.to_date);
    const isCurrent = category === "current";
    const isUpcoming = category === "upcoming";

    const categoryBadgeStyle = {
      current: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
      upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
      past: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    };

    const categoryLabel = {
      current: "Ongoing",
      upcoming: "Upcoming",
      past: "Past",
    };

    return (
      <div
        className={`group relative transition-all duration-300 rounded-lg border backdrop-blur-sm ${
          isCurrent
            ? "border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-green-50/50 dark:border-emerald-800/50 dark:from-emerald-950/40 dark:to-green-950/30 shadow-md"
            : isUpcoming
            ? "border-blue-200/60 bg-gradient-to-br from-blue-50/60 to-cyan-50/40 dark:border-blue-800/40 dark:from-blue-950/30 dark:to-cyan-950/20 hover:border-blue-300 dark:hover:border-blue-700"
            : "border-gray-200/40 bg-gradient-to-br from-gray-50/40 to-gray-100/30 dark:border-gray-700/30 dark:from-gray-900/20 dark:to-gray-800/20"
        }`}
      >
        {isCurrent && (
          <div className="absolute inset-0 rounded-lg bg-emerald-500/5 animate-pulse pointer-events-none" />
        )}

        <button
          onClick={() => setExpandedId(isExpanded ? null : leave.from_date)}
          className="w-full p-4 text-left transition-colors hover:bg-white/30 dark:hover:bg-white/5 rounded-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${categoryBadgeStyle[category]}`}>
                  {categoryLabel[category]}
                </span>
                {isCurrent && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
              </div>

              <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                {leave.name}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {formatDate(leave.from_date)} {duration > 1 && `• ${duration} days`}
                </span>
              </div>
            </div>

            <ChevronRight
              className={`w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0 transition-transform duration-300 ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          </div>
        </button>

        {isExpanded && (
          <div className="border-t border-gray-200/50 dark:border-gray-700/30 px-4 py-3 bg-white/50 dark:bg-white/5 rounded-b-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">From</p>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(leave.from_date)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getDayName(leave.from_date)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">To</p>
                <p className="text-gray-900 dark:text-white font-medium">{formatDate(leave.to_date)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{getDayName(leave.to_date)}</p>
              </div>
            </div>

            <div className="bg-gray-100/50 dark:bg-gray-800/30 rounded px-3 py-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Duration</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {duration} {duration === 1 ? "day" : "days"}
              </p>
            </div>

            {leave.remarks && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Remarks</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{leave.remarks}</p>
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
      <div className="flex min-h-screen items-center justify-center dark:bg-black bg-gray-50">
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-lg font-semibold text-red-600 dark:text-red-400">{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white text-sm font-medium transition-colors hover:bg-blue-700 dark:hover:bg-blue-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-4 sm:py-8">
        <div className="mx-auto max-w-4xl px-3 sm:px-6">
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
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
      <div className="flex min-h-screen items-center justify-center dark:bg-black bg-gray-50">
        <div className="text-center px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
            <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">No Leaves</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">No leave information available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 dark:bg-black">
      <div className="mx-auto max-w-4xl px-3 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Leave Schedule</h1>
        </div>

        {categorizedLeaves.current.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Currently On Leave
            </h2>
            <div className="space-y-3">
              {categorizedLeaves.current.map((leave) => (
                <LeaveCard key={leave.from_date} leave={leave} category="current" />
              ))}
            </div>
          </div>
        )}

        {categorizedLeaves.upcoming.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Upcoming
            </h2>
            <div className="space-y-3">
              {categorizedLeaves.upcoming.map((leave) => (
                <LeaveCard key={leave.from_date} leave={leave} category="upcoming" />
              ))}
            </div>
          </div>
        )}

        {categorizedLeaves.past.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              Past Leaves
            </h2>
            <div className="rounded-lg border border-red-200 bg-gradient-to-br from-red-50/60 to-red-100/40 dark:border-red-900/40 dark:from-red-950/20 dark:to-red-900/10 p-4">
              <div className="space-y-3">
                {categorizedLeaves.past.map((leave) => (
                  <LeaveCard key={leave.from_date} leave={leave} category="past" />
                ))}
              </div>
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
import React, { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { BarChart3, Loader2, Medal, RefreshCw, UserSearch, X } from "lucide-react";
import api from "../api/axios.js";
import SearchBar from "../Component/SearchBar.jsx";
import RpCard from "../Component/RpCard.jsx";
import Leaderboard from "../Component/Leaderboard.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function findCachedAncestor(cache, query) {
  for (let i = query.length - 1; i >= 1; i--) {
    const prefix = query.slice(0, i);
    if (cache.has(prefix)) return { key: prefix, data: cache.get(prefix) };
  }
  return null;
}

function filterStudents(students, query) {
  const q = query.toLowerCase();
  return students.filter((s) =>
    [s.student_name, s.roll_no, s.department, s.mentor_name, s.tab]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(q))
  );
}

function RpCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />
        <div className="space-y-2">
          <div className="h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-4/6 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-3/6 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800/80" />
      </div>
    </article>
  );
}

function RpsiteContent() {
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAverages, setShowAverages] = useState(false);
  const resultCache = useRef(new Map());

  const updateQuery = useRef(
    debounce((value) => setDebouncedQuery(value), 300)
  ).current;

  // Auto-load from saved register no
  useEffect(() => {
    const key = Object.keys(localStorage).find((k) =>
      k.startsWith("home-register-no-")
    );
    if (!key) return;
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved?.registerNo) {
        const reg = saved.registerNo.trim();
        setSearch(reg);
        setDebouncedQuery(reg);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    return () => {
      updateQuery.cancel();
    };
  }, [updateQuery]);

  const handleSearchChange = (value) => {
    setSearch(value);
    updateQuery(value.trim());
  };

  const { data: students = [], isLoading, isFetching } = useQuery({
    queryKey: ["rp-search", debouncedQuery],
    queryFn: async ({ signal }) => {
      if (!debouncedQuery) return [];

      if (resultCache.current.has(debouncedQuery)) {
        return resultCache.current.get(debouncedQuery);
      }

      const ancestor = findCachedAncestor(resultCache.current, debouncedQuery);

      if (ancestor) {
        const filtered = filterStudents(ancestor.data, debouncedQuery);
        resultCache.current.set(debouncedQuery, filtered);
        return filtered;
      }

      const res = await api.get("/search", {
        params: { q: debouncedQuery },
        signal,
      });

      const data = res.data?.data ?? [];
      resultCache.current.set(debouncedQuery, data);
      return data;
    },
    enabled: !!debouncedQuery,
    keepPreviousData: true,
  });

  const { data: averagePoints = {}, isFetching: isAverageFetching } = useQuery({
    queryKey: ["rp-averages"],
    queryFn: async () => {
      const res = await api.get("/averages");
      return res?.data?.averages || {};
    },
    enabled: showAverages,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const hasSearchText = search.trim().length > 0;
  const isDebouncing = hasSearchText && search.trim() !== debouncedQuery;
  const isSearching = hasSearchText && (isDebouncing || isFetching);
  const showSkeletonGrid =
    hasSearchText && (isLoading || isSearching) && students.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/20 dark:bg-[#020617] dark:text-slate-200 dark:selection:bg-indigo-500/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/40 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="shrink-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Reward <span className="text-indigo-500">Points</span>
              </h1>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:max-w-3xl lg:justify-end">
              <div className="w-full sm:min-w-70 sm:flex-1 lg:max-w-sm">
                <SearchBar
                  search={search}
                  setSearch={handleSearchChange}
                  isSearching={isSearching}
                  placeholder="Search By Name or Register No"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowLeaderboard(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition-all hover:-translate-y-px hover:border-indigo-300 hover:bg-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                <Medal className="h-4 w-4" />
                Leaderboard
              </button>
              <button
                type="button"
                onClick={() => setShowAverages(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                <BarChart3 className="h-4 w-4" />
                Average RP
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-80">
          {showSkeletonGrid ? (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Searching students...
              </div>
              <div className="grid items-stretch gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <RpCardSkeleton key={`rp-skeleton-${index}`} />
                ))}
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="mb-3 h-6 w-6 animate-spin text-indigo-500" />
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Fetching Records…
              </p>
            </div>
          ) : students.length > 0 ? (
            <div className="space-y-3">
              {isSearching && (
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Updating results...
                </div>
              )}
              <div className="animate-in fade-in slide-in-from-bottom-2 grid items-stretch gap-3.5 duration-500 sm:grid-cols-2 lg:grid-cols-3">
                {students.map((student) => (
                  <RpCard key={student.roll_no} student={student} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-14 dark:border-slate-800 dark:bg-slate-900/25">
              <UserSearch className="mb-3 h-9 w-9 text-slate-500 dark:text-slate-600" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Search for a student to view point breakdown
              </p>
            </div>
          )}
        </main>
      </div>

      {showLeaderboard && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 px-0 py-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setShowLeaderboard(false)}
        >
          <div
            className="relative flex h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl border border-slate-200 bg-slate-50 shadow-2xl shadow-slate-950/50 dark:border-slate-800 dark:bg-[#020617] sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="h-full overflow-auto p-3 sm:p-5">
              <Leaderboard onClose={() => setShowLeaderboard(false)} />
            </div>
          </div>
        </div>
      )}

      {showAverages && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/70 px-0 py-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setShowAverages(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/40 dark:border-slate-800 dark:bg-slate-950 sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Average RP
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
                  Year-wise averages
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAverages(false)}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close averages modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              {isAverageFetching ? (
                <div className="flex items-center justify-center py-10 text-slate-500 dark:text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["I", averagePoints?.year_1],
                    ["II", averagePoints?.year_2],
                    ["III", averagePoints?.year_3],
                    ["IV", averagePoints?.year_4],
                  ].map(([year, value]) => (
                    <div
                      key={year}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center dark:border-slate-800 dark:bg-slate-900/70"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                        Year {year}
                      </p>
                      <p className="mt-1 text-lg font-extrabold tabular-nums text-slate-900 dark:text-white">
                        {value ?? "0"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Rpsite() {
  return (
    <QueryClientProvider client={queryClient}>
      <RpsiteContent />
    </QueryClientProvider>
  );
}
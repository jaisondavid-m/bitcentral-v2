import React, { useEffect, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { BarChart3, Loader2, Medal, RefreshCw, UserSearch, X } from "lucide-react";
import api from "@/api/axios.js";
import SearchBar from "@/components/common/SearchBar.jsx";
import RpCard from "@/components/cards/RpCard.jsx";
import Leaderboard from "@/components/features/Leaderboard.jsx";
import { useAuth } from "@/context/StudentContext.jsx";
import { haptics } from "@/utils/haptics.js";

function countSearchableCharacters(value) {
  return Array.from(value).filter((character) => /[a-z0-9]/i.test(character)).length;
}

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
    [s.student_name, s.roll_no, s.register_no, s.department, s.mentor_name, s.tab]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(q))
  );
}

function RpCardSkeleton() {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-4/6 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-3/6 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-20 rounded-xl bg-blue-50 dark:bg-zinc-800/80" />
      </div>
    </article>
  );
}

function RpsiteContent() {
  const { student, profile } = useAuth();
  const defaultInitial =
    profile?.register_no ||
    profile?.registerNo ||
    student?.register_no ||
    student?.registerNo ||
    profile?.roll_no ||
    profile?.rollNo ||
    "7376251CS221";

  const [search, setSearch] = useState(defaultInitial);
  const [debouncedQuery, setDebouncedQuery] = useState(defaultInitial.trim());
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showAverages, setShowAverages] = useState(false);
  const resultCache = useRef(new Map());
  const hasAppliedDefaultSearch = useRef(false);

  const updateQuery = useRef(
    debounce((value) => setDebouncedQuery(value), 300)
  ).current;

  useEffect(() => {
    return () => {
      updateQuery.cancel();
    };
  }, [updateQuery]);

  useEffect(() => {
    if (hasAppliedDefaultSearch.current) return;

    const defaultRollNo =
      profile?.register_no ||
      profile?.registerNo ||
      student?.register_no ||
      student?.registerNo ||
      profile?.roll_no ||
      profile?.rollNo ||
      student?.roll_no ||
      student?.rollNo ||
      "7376251CS221";
    if (!defaultRollNo) return;

    if (search.trim() && search.trim() !== "7376251CS221") {
      hasAppliedDefaultSearch.current = true;
      return;
    }

    hasAppliedDefaultSearch.current = true;
    setSearch(defaultRollNo);
    setDebouncedQuery(defaultRollNo.trim());
  }, [profile, student, search]);

  const handleSearchChange = (value) => {
    setSearch(value);
    updateQuery(value.trim());
  };

  const searchText = search.trim();
  const debouncedSearchText = debouncedQuery.trim();
  const hasSearchText = searchText.length > 0;
  const hasMinimumSearchLength = countSearchableCharacters(searchText) >= 3;
  const canSearch = countSearchableCharacters(debouncedSearchText) >= 3;

  const { data: students = [], isLoading, isFetching } = useQuery({
    queryKey: ["rp-search", debouncedQuery],
    queryFn: async ({ signal }) => {
      if (!canSearch) return [];

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
    enabled: canSearch,
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

  const isDebouncing = hasSearchText && searchText !== debouncedSearchText;
  const isSearching = hasMinimumSearchLength && (isDebouncing || isFetching);
  const showSearchHint = hasSearchText && !hasMinimumSearchLength;
  const visibleStudents = hasMinimumSearchLength ? students : [];
  const showSkeletonGrid =
    hasMinimumSearchLength && (isLoading || isSearching) && visibleStudents.length === 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-6 rounded-2xl border border-zinc-900 bg-white p-4 shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[4px_4px_0px_#ffffff] sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div className="shrink-0">
              <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
                Reward <span className="text-blue-600 dark:text-blue-400">Points</span>
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
                onClick={() => {
                  haptics.light();
                  setShowLeaderboard(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-blue-600 px-4 py-3 text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
              >
                <Medal className="h-4 w-4" />
                Leaderboard
              </button>
              <button
                type="button"
                onClick={() => {
                  haptics.light();
                  setShowAverages(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-white px-4 py-3 text-sm font-black text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:bg-zinc-100 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
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
          ) : showSearchHint ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-14 dark:border-slate-800 dark:bg-slate-900/25">
              <UserSearch className="mb-3 h-9 w-9 text-slate-500 dark:text-slate-600" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter at least 3 letters or digits to search
              </p>
            </div>
          ) : visibleStudents.length > 0 ? (
            <div className="space-y-3">
              {isSearching && (
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Updating results...
                </div>
              )}
              <div className="animate-in fade-in slide-in-from-bottom-2 grid items-stretch gap-3.5 duration-500 sm:grid-cols-2 lg:grid-cols-3">
                {visibleStudents.map((student) => (
                  <RpCard key={student.roll_no} student={student} />
                ))}
              </div>
            </div>
          ) : hasSearchText ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-14 dark:border-slate-800 dark:bg-slate-900/25">
              <UserSearch className="mb-3 h-9 w-9 text-slate-500 dark:text-slate-600" />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No student found for that search
              </p>
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-0 py-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setShowLeaderboard(false)}
        >
          <div
            className="relative flex h-[92dvh] w-full max-w-6xl flex-col overflow-hidden rounded-t-2xl border border-zinc-900 bg-white shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff] sm:rounded-2xl"
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
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-0 py-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setShowAverages(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl border border-zinc-900 bg-white shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff] sm:rounded-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Average RP
                </p>
                <h2 className="mt-1 text-lg font-black text-zinc-900 dark:text-white">
                  Year-wise averages
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAverages(false)}
                className="rounded-lg border border-zinc-900 p-1.5 text-zinc-600 hover:bg-zinc-100 dark:border-white dark:text-zinc-300 dark:hover:bg-zinc-800 shadow-[1px_1px_0px_#18181b] dark:shadow-[1px_1px_0px_#ffffff] cursor-pointer"
                aria-label="Close averages modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              {isAverageFetching ? (
                <div className="flex items-center justify-center py-10 text-zinc-500 dark:text-zinc-400">
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
                      className="rounded-xl border border-zinc-900 bg-blue-50/50 px-3 py-3 text-center shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:shadow-[2px_2px_0px_#ffffff]"
                    >
                      <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Year {year}
                      </p>
                      <p className="mt-1 text-lg font-black tabular-nums text-zinc-900 dark:text-white">
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
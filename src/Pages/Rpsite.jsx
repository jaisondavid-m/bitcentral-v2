import React, { useCallback, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { RefreshCw, UserSearch } from "lucide-react";
import api from "../api/axios.js";
import SearchBar from "../Component/SearchBar.jsx";
import RpCard from "../Component/RpCard.jsx";

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

function RpsiteContent() {
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const resultCache = useRef(new Map());

  const updateQuery = useCallback(
    debounce((value) => setDebouncedQuery(value), 300),
    []
  );

  const handleSearchChange = (value) => {
    setSearch(value);
    updateQuery(value.trim());
  };

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["rp-search", debouncedQuery],
    queryFn: async ({ signal }) => {
      if (!debouncedQuery) return [];

      // 1️⃣ Exact cache hit — free
      if (resultCache.current.has(debouncedQuery)) {
        return resultCache.current.get(debouncedQuery);
      }

      // 2️⃣ Ancestor cache hit — filter locally, no network call
      const ancestor = findCachedAncestor(resultCache.current, debouncedQuery);
      if (ancestor) {
        const filtered = filterStudents(ancestor.data, debouncedQuery);
        resultCache.current.set(debouncedQuery, filtered);
        return filtered;
      }

      // 3️⃣ Nothing cached — real API call
      const res = await api.get("/search", {
        params: { q: debouncedQuery },
        signal,
      });

      const data = res.data?.data ?? [];
      resultCache.current.set(debouncedQuery, data);
      return data;
    },
    enabled: !!debouncedQuery,
    placeholderData: (prev) => prev,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/20 dark:bg-[#020617] dark:text-slate-200 dark:selection:bg-indigo-500/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="shrink-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Reward <span className="text-indigo-500">Points</span>
            </h1>
          </div>
          <div className="w-full md:ml-auto md:max-w-sm">
            <SearchBar search={search} setSearch={handleSearchChange} />
          </div>
        </header>

        <main className="min-h-80">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="mb-3 h-6 w-6 animate-spin text-indigo-500" />
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Fetching Records…
              </p>
            </div>
          ) : students.length > 0 ? (
            <div className="grid items-stretch animate-in gap-3.5 duration-500 fade-in slide-in-from-bottom-2 sm:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <RpCard key={student.roll_no} student={student} />
              ))}
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
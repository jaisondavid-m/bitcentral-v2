import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { RefreshCw, Trophy, UserSearch } from "lucide-react";
import api from "../api/axios.js";
import SearchBar from "../Component/SearchBar.jsx";
import RpCard from "../Component/RpCard.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1 * 60 * 1000, refetchOnWindowFocus: false, retry: 1 },
  },
});

function RpsiteContent() {
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(search.trim()), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: results, isLoading } = useQuery({
    queryKey: ["rp-search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return null;
      const res = await api.get("/search", { params: { q: debouncedQuery } });
      return res.data;
    },
    enabled: !!debouncedQuery,
  });

  const students = results?.data || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/20 dark:bg-[#020617] dark:text-slate-200 dark:selection:bg-indigo-500/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        
        {/* Header & Search - Inline Row */}
        <header className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="shrink-0">
            <div className="mb-1.5 flex items-center gap-2">
              <div className="h-1.5 w-6 bg-indigo-500 rounded-full" />
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-indigo-500 dark:text-indigo-400">Analytics</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Reward <span className="text-indigo-500">Points</span>
            </h1>
          </div>

          <div className="w-full max-w-sm">
            <SearchBar search={search} setSearch={setSearch} />
          </div>
        </header>

        {/* Results Area */}
        <main className="min-h-80">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw className="h-6 w-6 animate-spin text-indigo-500 mb-3" />
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Fetching Records...</p>
            </div>
          ) : students.length > 0 ? (
            <div className="grid animate-in gap-3.5 duration-500 fade-in slide-in-from-bottom-2 sm:grid-cols-2 lg:grid-cols-3">
              {students.map((student) => (
                <RpCard key={student.roll_no} student={student} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-14 dark:border-slate-800 dark:bg-slate-900/25">
              <UserSearch className="mb-3 h-9 w-9 text-slate-500 dark:text-slate-600" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Search for a student to view point breakdown</p>
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
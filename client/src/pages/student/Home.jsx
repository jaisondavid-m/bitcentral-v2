import React, { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import api from "@/api/axios.js";
import { Card } from "@/components/cards/HomeCard.jsx";
import { HomeCardSkeleton } from "@/components/cards/HomeCardSkeleton.jsx";
import SearchBar from "@/components/common/SearchBar.jsx";
import Fuse from "fuse.js";
import { useAuth } from "@/context/StudentContext.jsx";
import { AlertTriangle, Compass, RotateCcw, SearchX } from "lucide-react";

const homeQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function HomeContent() {
  const { user, profile } = useAuth();
  const [search, setSearch] = useState("");

  const {
    data: cards = [],
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["home-cards"],
    queryFn: async () => {
      const res = await api.get("/cards");
      return res?.data?.data || [];
    },
  });

  const fuse = useMemo(() => {
    return new Fuse(cards, {
      keys: [
        { name: "name", weight: 0.5 },
        { name: "btntext", weight: 0.2 },
        { name: "keywords", weight: 0.3 },
      ],
      threshold: 0.35,
      includeScore: true,
    });
  }, [cards]);

  const filteredCards = useMemo(() => {
    if (!search.trim()) return cards;
    return fuse.search(search).map((res) => res.item);
  }, [cards, search, fuse]);

  const errorMessage = error
    ? error?.response?.data?.message || error?.message || "Failed to fetch campus resources"
    : "";

  if (error && !isPending) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 flex items-center justify-center p-4 transition-colors">
        <div className="mx-auto max-w-md w-full rounded-2xl border border-zinc-900 bg-white p-6 sm:p-8 text-center shadow-[4px_4px_0px_#18181b] dark:border-zinc-100 dark:bg-[#111827] dark:shadow-[4px_4px_0px_#fafafa]">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-900 bg-rose-50 text-rose-600 shadow-[2px_2px_0px_#18181b] dark:border-zinc-100 dark:bg-rose-950/50 dark:text-rose-400 dark:shadow-[2px_2px_0px_#fafafa]">
            <AlertTriangle className="h-6 w-6 stroke-[2.2]" />
          </div>
          <h2 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-50">
            Failed to Load Portals
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            {errorMessage}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-zinc-100 dark:shadow-[2px_2px_0px_#fafafa] transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors py-4 sm:py-8">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Search Bar Section */}
        <section className="mb-6 sm:mb-8 my-2" aria-label="Search resources">
          <SearchBar
            search={search}
            setSearch={setSearch}
            placeholder="Search portals, marks, services, wifi..."
          />
        </section>

        {/* Cards Grid */}
        {isPending ? (
          <section
            className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6"
            aria-label="Loading resources"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <HomeCardSkeleton key={index} />
            ))}
          </section>
        ) : filteredCards.length > 0 ? (
          <section
            className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-5 lg:gap-6"
            aria-label="Available resources"
          >
            {filteredCards.map((card, index) => (
              <Card
                key={card.id || index}
                id={card.id}
                name={card.name}
                description={card.description}
                link={card.link}
                img={card.img}
                icon={card.icon}
                btntext={card.btntext}
              />
            ))}
          </section>
        ) : (
          <div className="py-12 text-center">
            <div className="mx-auto max-w-md rounded-2xl border border-zinc-900 bg-white p-8 shadow-[4px_4px_0px_#18181b] dark:border-zinc-100 dark:bg-[#111827] dark:shadow-[4px_4px_0px_#fafafa]">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[2px_2px_0px_#18181b] dark:border-zinc-100 dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[2px_2px_0px_#fafafa]">
                <SearchX className="h-6 w-6 stroke-[2.2]" />
              </div>
              <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
                No Services Found
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                We couldn&apos;t find any portal matching &ldquo;{search}&rdquo;. Try another search term.
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-zinc-100 dark:shadow-[2px_2px_0px_#fafafa] transition-all cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Home() {
  return (
    <QueryClientProvider client={homeQueryClient}>
      <HomeContent />
    </QueryClientProvider>
  );
}

export default Home;

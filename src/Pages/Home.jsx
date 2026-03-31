import React, { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { Card } from "../Component/HomeCard.jsx";
import { HomeCardSkeleton } from "../Component/Skeltons/HomeCardSkeleton.jsx";
import SearchBar from "../Component/SearchBar.jsx";

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

  const filteredCards = useMemo(() => cards.filter((card) => {
    const query = search.toLowerCase().trim();
    return (
      card.name.toLowerCase().includes(query) ||
      card.keywords.some((k) => k.toLowerCase().includes(query))
    );
  }), [cards, search]);

  const errorMessage = error ? error?.response?.data?.message || error?.message || "Failed to fetch cards" : "";

  if (error && !isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-black">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">{errorMessage}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 dark:bg-black">
      <div className="mx-auto max-w-7xl px-3 sm:px-6">
        <SearchBar search={search} setSearch={setSearch} />
        {isPending ? (
          <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {[1,2,3,4,5,6,7,8].map((_, index) => (
              <HomeCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {filteredCards.map((card, index) => (
              <Card key={card.id || index} name={card.name} link={card.link} img={card.img} btntext={card.btntext} />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-base text-gray-500 sm:text-lg dark:text-slate-300">No Site Found</p>
            {search && (
              <p className="mt-2 text-xs text-gray-400 sm:text-sm dark:text-slate-400">Try adjusting your search</p>
            )}
          </div>
        )}
      </div>
    </div>
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
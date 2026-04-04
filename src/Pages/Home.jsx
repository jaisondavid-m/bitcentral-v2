import React, { useMemo, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { Card } from "../Component/HomeCard.jsx";
import { HomeCardSkeleton } from "../Component/HomeCardSkeleton.jsx";
import SearchBar from "../Component/SearchBar.jsx";
import Fuse from "fuse.js";
import { useAuth } from "../context/StudentContext.jsx";

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
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  // Register No modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerNoInput, setRegisterNoInput] = useState("");
  const [registerNoError, setRegisterNoError] = useState("");

  const registerStoreKey = user?.uid ? `home-register-no-${user.uid}` : "";
  const registerPromptDateKey = user?.uid ? `home-register-prompt-date-${user.uid}` : "";

  useEffect(() => {
    if (!user?.uid) return;

    const saved = localStorage.getItem(registerStoreKey);
    if (saved) return; // already saved, never prompt again

    const today = new Date().toISOString().slice(0, 10);
    const lastPrompt = localStorage.getItem(registerPromptDateKey);

    if (lastPrompt !== today) {
      setShowRegisterModal(true);
      localStorage.setItem(registerPromptDateKey, today);
    }
  }, [user?.uid, registerStoreKey, registerPromptDateKey]);

  const onSaveRegisterNo = (e) => {
    e.preventDefault();
    const value = registerNoInput.trim();
    if (!value) {
      setRegisterNoError("Register No is required.");
      return;
    }
    localStorage.setItem(registerStoreKey, JSON.stringify({ registerNo: value, savedAt: Date.now() }));
    setRegisterNoError("");
    setShowRegisterModal(false);
  };

  const onRemindLater = () => {
    setRegisterNoError("");
    setShowRegisterModal(false);
  };

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
    ? error?.response?.data?.message || error?.message || "Failed to fetch cards"
    : "";

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
    <>
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-5 shadow-xl dark:border-blue-900 dark:bg-slate-950">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Student Identity</h2>
            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-slate-200">Please enter your Register No.</p>

            <form onSubmit={onSaveRegisterNo} className="mt-4 space-y-3">
              <input
                type="text"
                value={registerNoInput}
                onChange={(e) => setRegisterNoInput(e.target.value)}
                placeholder="Register No"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
              />
              {registerNoError && <p className="text-xs text-red-600">{registerNoError}</p>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onRemindLater}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Later
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 py-4 sm:py-8 dark:bg-black">
        <div className="mx-auto max-w-7xl px-3 sm:px-6">
          <div className="mb-8">
            <SearchBar search={search} setSearch={setSearch} />
          </div>

          {isPending ? (
            <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                <HomeCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredCards.length > 0 ? (
            <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
              {filteredCards.map((card, index) => (
                <Card
                  key={card.id || index}
                  name={card.name}
                  link={card.link}
                  img={card.img}
                  btntext={card.btntext}
                />
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
    </>
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
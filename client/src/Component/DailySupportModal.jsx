import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Sparkles, Trophy, Users } from "lucide-react";
import { getSponsorsLeaderboard } from "../api/axios.js";
import { processLeaderboardData } from "../utils/sponsorUtils.js";

const STORAGE_KEY = "bitcentral_support_modal_last_shown";
const SHOW_DELAY_MS = 7000; // 7 seconds delay

export default function DailySupportModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [topDonors, setTopDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Do not display if user is already on support-dev page
    if (location.pathname === "/support-dev") {
      return;
    }

    // Safely check localStorage for last shown date
    let lastShown = null;
    try {
      lastShown = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // Storage access blocked or restricted
    }

    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format in local time
    if (lastShown === todayStr) {
      return;
    }

    // Timer delay (7 seconds) before displaying modal
    const timer = setTimeout(async () => {
      // Re-verify pathname in case user navigated during delay
      if (window.location.pathname === "/support-dev") return;

      try {
        setLoading(true);
        const data = await getSponsorsLeaderboard();
        if (data?.success && Array.isArray(data.sponsors)) {
          const sorted = processLeaderboardData(data.sponsors);
          setTopDonors(sorted.slice(0, 3));
        }
      } catch (err) {
        setTopDonors([]);
      } finally {
        setLoading(false);
      }

      // Mark modal as shown today
      try {
        localStorage.setItem(STORAGE_KEY, todayStr);
      } catch (e) {
        // Storage write failed
      }

      setIsOpen(true);
    }, SHOW_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  // Lock/restore body scroll when modal toggles
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBecomeSupporter = () => {
    setIsOpen(false);
    navigate("/support-dev");
  };

  if (!isOpen) return null;

  // Podium order: [Rank 2 (Silver), Rank 1 (Gold - Center), Rank 3 (Bronze)]
  const rank1 = topDonors[0];
  const rank2 = topDonors[1];
  const rank3 = topDonors[2];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white z-10 my-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-modal-title"
        >
          {/* Top Decorative Banner Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-blue-600" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="text-center pt-2 space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60">
              <Sparkles className="h-3.5 w-3.5 fill-current text-rose-500" />
              Community Supported
            </span>

            <h2
              id="support-modal-title"
              className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2 flex-wrap"
            >
              <span>❤️ The Backbone of</span>{" "}
              <span className="text-blue-600 dark:text-blue-400">BIT-CENTRAL</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              BIT-CENTRAL is built and maintained for students. These supporters are helping us keep it running and continue developing new features.
            </p>
          </div>

          {/* Top 3 Donors Showcase */}
          <div className="mt-6 mb-6">
            <div className="text-center mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1">
                <Trophy className="h-3.5 w-3.5 text-amber-500" /> Top Patrons & Contributors
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-8 space-x-3">
                <div className="h-16 w-full rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              </div>
            ) : topDonors.length === 0 ? (
              <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
                <Users className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600 mb-1" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Be the first to join the leaderboards!</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 items-end pt-2">
                {/* 🥈 #2 Supporter (Left) */}
                <div className="flex flex-col items-center">
                  {rank2 ? (
                    <div className="w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-100/80 to-white p-2 sm:p-3 text-center shadow-sm dark:border-slate-700/80 dark:from-slate-800/60 dark:to-slate-900 transition-all hover:scale-[1.02]">
                      <span className="inline-block rounded-md bg-slate-200 px-1.5 sm:px-2 py-0.5 text-[10px] font-black text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                        🥈 #2
                      </span>
                      <p className="mt-1 text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 break-words leading-tight flex items-center justify-center min-h-[32px] sm:min-h-[36px] text-center px-0.5" title={rank2.name}>
                        {rank2.name}
                      </p>
                      <p className="mt-0.5 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{Number(rank2.amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full rounded-2xl border border-dashed border-slate-200 p-3 text-center dark:border-slate-800 opacity-40">
                      <span className="text-[10px] font-bold text-slate-400">🥈 #2</span>
                      <p className="text-[11px] text-slate-400 italic">Open spot</p>
                    </div>
                  )}
                </div>

                {/* 🥇 #1 Top Supporter (Center - Elevated) */}
                <div className="flex flex-col items-center -mt-3">
                  {rank1 ? (
                    <div className="w-full rounded-2xl border-2 border-amber-400/90 bg-gradient-to-b from-amber-500/10 via-amber-100/40 to-white p-2 sm:p-3.5 text-center shadow-md dark:border-amber-500/80 dark:from-amber-950/50 dark:to-slate-900 transition-all hover:scale-[1.03] relative">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-1.5 sm:px-2.5 py-0.5 text-[8px] sm:text-[10px] font-black text-white shadow-sm flex items-center gap-0.5 whitespace-nowrap">
                        🥇 <span className="hidden sm:inline">TOP SUPPORTER</span><span className="sm:hidden">#1 TOP</span>
                      </span>
                      <p className="mt-2 text-xs sm:text-sm font-black text-slate-950 dark:text-white break-words leading-tight flex items-center justify-center min-h-[32px] sm:min-h-[36px] text-center px-0.5" title={rank1.name}>
                        {rank1.name}
                      </p>
                      <p className="mt-0.5 text-xs font-black text-emerald-600 dark:text-emerald-400">
                        ₹{Number(rank1.amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full rounded-2xl border border-dashed border-amber-300 p-4 text-center dark:border-amber-900/60 opacity-60">
                      <span className="text-xs font-bold text-amber-500">🥇 #1</span>
                      <p className="text-xs text-slate-400 italic">Open spot</p>
                    </div>
                  )}
                </div>

                {/* 🥉 #3 Supporter (Right) */}
                <div className="flex flex-col items-center">
                  {rank3 ? (
                    <div className="w-full rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/50 to-white p-2 sm:p-3 text-center shadow-sm dark:border-amber-900/40 dark:from-amber-950/30 dark:to-slate-900 transition-all hover:scale-[1.02]">
                      <span className="inline-block rounded-md bg-amber-700 px-1.5 sm:px-2 py-0.5 text-[10px] font-black text-white">
                        🥉 #3
                      </span>
                      <p className="mt-1 text-[11px] sm:text-xs font-bold text-slate-900 dark:text-slate-100 break-words leading-tight flex items-center justify-center min-h-[32px] sm:min-h-[36px] text-center px-0.5" title={rank3.name}>
                        {rank3.name}
                      </p>
                      <p className="mt-0.5 text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{Number(rank3.amount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ) : (
                    <div className="w-full rounded-2xl border border-dashed border-slate-200 p-3 text-center dark:border-slate-800 opacity-40">
                      <span className="text-[10px] font-bold text-slate-400">🥉 #3</span>
                      <p className="text-[11px] text-slate-400 italic">Open spot</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Call to Action Section */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 p-4 border border-slate-100 dark:from-slate-800/80 dark:to-slate-900 dark:border-slate-800 text-center space-y-3">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                Want to become part of the backbone? ❤️
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                Your support helps BIT-CENTRAL cover hosting, servers, domain costs, and future development.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleBecomeSupporter}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.99] transition-all cursor-pointer"
              >
                <Heart className="h-4 w-4 fill-current text-white" />
                <span>Become a Supporter</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

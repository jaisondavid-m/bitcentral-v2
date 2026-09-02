import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Sparkles, Trophy, GraduationCap, Crown, Users } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/config/firebase.js";
import { getSponsorsLeaderboard } from "@/api/axios.js";
import { processLeaderboardData } from "@/utils/sponsorUtils.js";

const STORAGE_KEY = "bitcentral_support_modal_last_shown";
const SHOW_DELAY_MS = 7000; // 7 seconds delay

export default function DailySupportModal() {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [topDonor, setTopDonor] = useState(null);
  const [topDepartment, setTopDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Do not display if user is not logged in or is already on support-dev page
    if (!user || location.pathname === "/support-dev") {
      return;
    }

    // Safely check localStorage for last shown timestamp
    let lastShown = null;
    try {
      lastShown = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // Storage access blocked or restricted
    }

    const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    if (lastShown) {
      const lastShownTime = Number(lastShown);
      if (!isNaN(lastShownTime)) {
        if (Date.now() - lastShownTime < THREE_DAYS_MS) {
          return;
        }
      } else {
        // Backward compatibility for existing YYYY-MM-DD date strings
        const parsedDate = new Date(lastShown).getTime();
        if (!isNaN(parsedDate) && Date.now() - parsedDate < THREE_DAYS_MS) {
          return;
        }
      }
    }

    // Timer delay (7 seconds) before displaying modal
    const timer = setTimeout(async () => {
      // Re-verify pathname in case user navigated during delay
      if (window.location.pathname === "/support-dev") return;

      try {
        setLoading(true);
        const data = await getSponsorsLeaderboard();
        if (data?.success) {
          if (Array.isArray(data.sponsors)) {
            const sorted = processLeaderboardData(data.sponsors);
            setTopDonor(sorted[0] || null);
          }
          if (Array.isArray(data.department_leaderboard)) {
            const depts = data.department_leaderboard;
            const top = depts.find((d) => Number(d.total_amount || 0) > 0) || depts[0] || null;
            setTopDepartment(top);
          }
        }
      } catch (err) {
        setTopDonor(null);
        setTopDepartment(null);
      } finally {
        setLoading(false);
      }

      // Mark modal as shown with current timestamp
      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } catch (e) {
        // Storage write failed
      }

      setIsOpen(true);
    }, SHOW_DELAY_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [user, location.pathname]);

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
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 16 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white z-10 my-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-modal-title"
        >
          {/* Ambient Decorative Background Light */}
          <div className="pointer-events-none absolute -top-24 -left-20 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10" />
          <div className="pointer-events-none absolute -top-24 -right-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-500/10" />

          {/* Top Decorative Banner Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-blue-600" />

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
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-bold text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 fill-current text-rose-500" />
              Community Supported
            </span>

            <h2
              id="support-modal-title"
              className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2 flex-wrap"
            >
              <span>❤️ The Backbone of</span>{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
                BIT-CENTRAL
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              BIT-CENTRAL is built and maintained for students. These supporters and departments keep it running for everyone.
            </p>
          </div>

          {/* Top Donors & Department Showcase (2 Cards Grid) */}
          <div className="mt-6 mb-6">
            <div className="text-center mb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-500" /> Top Patrons & Department
              </span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
                <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                <div className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                {/* 🥇 Top Supporter Card */}
                <div className="group relative rounded-2xl border-2 border-amber-400/80 bg-gradient-to-b from-amber-500/10 via-amber-50/50 to-white p-4 text-center shadow-md dark:border-amber-500/70 dark:from-amber-950/40 dark:via-slate-900 dark:to-slate-900 transition-all hover:scale-[1.02] flex flex-col justify-between">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-0.5 text-[10px] font-black text-white shadow-sm flex items-center gap-1 whitespace-nowrap">
                    <Crown className="h-3 w-3 fill-amber-200 text-amber-200" />
                    <span>TOP DONOR</span>
                  </div>

                  <div className="pt-2">
                    {topDonor ? (
                      <>
                        <h3
                          className="text-sm font-black text-slate-900 dark:text-white break-words leading-tight flex items-center justify-center min-h-[36px] text-center px-1"
                          title={topDonor.name}
                        >
                          {topDonor.name}
                        </h3>
                        {topDonor.department_display && (
                          <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {topDonor.department_display}
                          </span>
                        )}
                        <p className="mt-2 text-base font-black text-emerald-600 dark:text-emerald-400">
                          ₹{Number(topDonor.amount || 0).toLocaleString("en-IN")}
                        </p>
                      </>
                    ) : (
                      <div className="py-2 text-center">
                        <Users className="h-6 w-6 mx-auto text-amber-400/60 mb-1" />
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Donor Yet</p>
                        <p className="text-[10px] text-slate-400 italic">Be the first to donate!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 🎓 Top Department Card */}
                <div className="group relative rounded-2xl border-2 border-indigo-400/80 bg-gradient-to-b from-indigo-500/10 via-indigo-50/50 to-white p-4 text-center shadow-md dark:border-indigo-500/70 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900 transition-all hover:scale-[1.02] flex flex-col justify-between">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 px-3 py-0.5 text-[10px] font-black text-white shadow-sm flex items-center gap-1 whitespace-nowrap">
                    <GraduationCap className="h-3 w-3 text-indigo-100" />
                    <span>TOP DEPARTMENT</span>
                  </div>

                  <div className="pt-2">
                    {topDepartment ? (
                      <>
                        <h3
                          className="text-sm font-black text-slate-900 dark:text-white break-words leading-tight flex items-center justify-center min-h-[36px] text-center px-1"
                          title={topDepartment.full_name || topDepartment.display_name || topDepartment.name}
                        >
                          {topDepartment.display_name || topDepartment.name}
                        </h3>
                        <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-900/50">
                          {topDepartment.total_supporters || 0} Supporter{(topDepartment.total_supporters || 0) !== 1 ? "s" : ""}
                        </span>
                        <p className="mt-2 text-base font-black text-emerald-600 dark:text-emerald-400">
                          ₹{Number(topDepartment.total_amount || 0).toLocaleString("en-IN")}
                        </p>
                      </>
                    ) : (
                      <div className="py-2 text-center">
                        <GraduationCap className="h-6 w-6 mx-auto text-indigo-400/60 mb-1" />
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No Department Yet</p>
                        <p className="text-[10px] text-slate-400 italic">Represent your department!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Call to Action Section */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/60 p-4 border border-slate-200/60 dark:from-slate-800/80 dark:to-slate-900 dark:border-slate-800 text-center space-y-3">
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
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] transition-all cursor-pointer"
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


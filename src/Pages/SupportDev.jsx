import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  Server,
  Code2,
  Users,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { BiDonateHeart } from "react-icons/bi";
import { FaHandHoldingHeart } from "react-icons/fa6";
import PublicNav from "../Component/PublicNav.jsx";
import PublicFooter from "../Component/PublicFooter.jsx";
import Navbar from "../Component/NavBar.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";
import { getSponsorsLeaderboard } from "../api/axios.js";

const RAZORPAY_PAGE_URL = "https://pages.razorpay.com/X8K4y93";

export default function SupportDev() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState({
    total_raised: 0,
    total_supporters: 0,
    sponsors: [],
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getSponsorsLeaderboard();
        if (data?.success && Array.isArray(data.sponsors)) {
          const sorted = [...data.sponsors].sort(
            (a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0)
          );
          setLeaderboard({
            ...data,
            sponsors: sorted,
          });
        }
      } catch (err) {
        setLeaderboard({ total_raised: 0, total_supporters: 0, sponsors: [] });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleProceedToPayment = () => {
    window.open(RAZORPAY_PAGE_URL, "_blank", "noopener,noreferrer");
  };

  const formattedTotal = Number(leaderboard.total_raised || 0).toLocaleString("en-IN");

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#f2f6ff] text-slate-900 transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Top Navigation */}
      <div className="shrink-0">
        {user ? <Navbar /> : <PublicNav />}
      </div>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl grid gap-8 lg:grid-cols-12 lg:items-center">

          {/* Left Column: Hero, Features, Stats & Donate CTA */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Pill Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
              <BiDonateHeart className="h-4 w-4 text-rose-500" />
              Student-built · Free forever
            </span>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white flex items-center flex-wrap gap-2">
                <span>Keep BIT-CENTRAL</span>{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  Running
                </span>
                <FaHandHoldingHeart className="h-8 w-8 text-rose-500 inline-block shrink-0 ml-1" />
              </h1>

              <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
                BIT-CENTRAL provides free question banks, answer keys, exam hall finders, and mess schedules for the BIT Sathy community. Help us keep it running.
              </p>
            </div>

            {/* 3 Feature Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400 w-fit">
                  <Server className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Cloud Server</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">High speed delivery</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-400 dark:bg-blue-950 w-fit">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">100% Ad-Free</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Clean student UX</p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-400 dark:bg-blue-950 w-fit">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">Active R&D</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">New campus tools</p>
              </div>
            </div>

            {/* 2 Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-blue-100/90 to-blue-50/80 p-5 border border-blue-200/60 dark:from-blue-950/60 dark:to-slate-900 dark:border-blue-900/60">
                <div className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
                  3,000+
                </div>
                <div className="mt-1 text-xs font-semibold text-blue-600/80 dark:text-blue-400/80">
                  Students Served
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-blue-100/90 to-blue-50/80 p-5 border border-blue-200/60 dark:from-blue-950/60 dark:to-slate-900 dark:border-blue-900/60">
                <div className="text-2xl sm:text-3xl font-black text-blue-700 dark:text-blue-300">
                  ₹{formattedTotal}
                </div>
                <div className="mt-1 text-xs font-semibold text-blue-600/80 dark:text-blue-400/80">
                  Raised by Community
                </div>
              </div>
            </div>

            {/* Main Action Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleProceedToPayment}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/25 transition-all duration-300 hover:bg-blue-700 active:scale-[0.99] cursor-pointer"
              >
                <Heart className="h-5 w-5 fill-current text-white group-hover:scale-110 transition-transform" />
                <span>Donate & Keep Us Running</span>
                <ArrowRight className="h-4 w-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-slate-400" />
                Secure 256-bit SSL · UPI, GPay, PhonePe, Cards
              </p>
            </div>
          </motion.div>

          {/* Right Column: Top Donors Leaderboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
              
              {/* Leaderboard Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>Top Donors</span>
                </div>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                  Top 10 Supporters
                </span>
              </div>

              {/* List / Skeleton Loading / Empty State */}
              <div className="mt-3.5 space-y-2 max-h-[480px] min-h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-start">
                {loading ? (
                  /* Skeleton Loading State */
                  Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-xl bg-slate-100/70 p-3 dark:bg-slate-800/50 animate-pulse"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-8 rounded bg-slate-200 dark:bg-slate-700"></div>
                        <div className="h-4 w-28 rounded bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                      <div className="h-4 w-12 rounded bg-slate-200 dark:bg-slate-700"></div>
                    </div>
                  ))
                ) : leaderboard.sponsors.length === 0 ? (
                  /* Empty State (No Donors Yet) */
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
                    <div className="rounded-full bg-rose-50 p-3 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400">
                      <Heart className="h-6 w-6 fill-current animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Be the first patron! 🚀
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px] mx-auto">
                        Your support keeps open student infrastructure running.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Real Donors List */
                  leaderboard.sponsors.slice(0, 10).map((sponsor, idx) => {
                    const rank = idx + 1;
                    let rowStyle = "bg-slate-50/80 hover:bg-slate-100 dark:bg-slate-950/60 dark:hover:bg-slate-950 border border-transparent";
                    let badgeStyle = "text-slate-400 font-bold px-2 text-[11px]";
                    let badgeContent = `#${rank}`;

                    if (rank === 1) {
                      rowStyle = "border border-amber-300/80 bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-yellow-50/30 dark:border-amber-700/60 dark:from-amber-950/40 dark:to-slate-900 shadow-sm";
                      badgeStyle = "bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black px-2.5 py-0.5 rounded-lg shadow-xs text-xs";
                      badgeContent = "🥇 #1";
                    } else if (rank === 2) {
                      rowStyle = "border border-slate-300/80 bg-gradient-to-r from-slate-200/40 via-slate-100/50 to-slate-50/30 dark:border-slate-700/60 dark:from-slate-800/40 dark:to-slate-900 shadow-xs";
                      badgeStyle = "bg-slate-300 text-slate-900 dark:bg-slate-700 dark:text-slate-100 font-bold px-2.5 py-0.5 rounded-lg shadow-xs text-xs";
                      badgeContent = "🥈 #2";
                    } else if (rank === 3) {
                      rowStyle = "border border-orange-300/70 bg-gradient-to-r from-orange-100/30 via-orange-50/40 to-amber-50/20 dark:border-amber-900/50 dark:from-orange-950/30 dark:to-slate-900 shadow-xs";
                      badgeStyle = "bg-amber-700 text-white font-bold px-2 py-0.5 rounded-lg shadow-xs text-xs";
                      badgeContent = "🥉 #3";
                    }

                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between rounded-xl p-2.5 text-xs transition-all duration-200 ${rowStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`inline-flex items-center justify-center ${badgeStyle}`}>
                            {badgeContent}
                          </span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-[150px]">
                            {sponsor.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                            ₹{Number(sponsor.amount || 0).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}

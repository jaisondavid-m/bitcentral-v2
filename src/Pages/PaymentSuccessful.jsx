import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Sparkles,
  Award,
  Share2,
  Home,
  Quote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PublicNav from "../Component/PublicNav.jsx";
import Navbar from "../Component/NavBar.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";

const PROUD_QUOTES = [
  {
    quote: "Generosity isn't about the amount; it's about the impact. You are directly powering the academic success of thousands of BITSians.",
    author: "BIT-CENTRAL Community",
    category: "Impact & Growth",
  },
  {
    quote: "True heroes don't wear capes — they build and sustain open infrastructure for fellow students.",
    author: "Jaison David M",
    category: "Community Honor",
  },
  {
    quote: "Knowledge increases by sharing, but infrastructure survives by caring. Thank you for keeping BIT-CENTRAL alive and thriving!",
    author: "Academic Resource Hub",
    category: "Empowerment",
  },
  {
    quote: "Behind every student acing their exams late at night is a supporter like you who ensured the resources stayed online.",
    author: "BITS Student Portal",
    category: "Gratitude",
  },
  {
    quote: "No act of kindness, no matter how small, is ever wasted. You stand tall today as a pillar of the BIT Sathy tech community!",
    author: "Developer's Desk",
    category: "Legacy",
  },
];

export default function PaymentSuccessful() {
  const [user] = useAuthState(auth);
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % PROUD_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = () => {
    const shareText = "I just supported BIT-CENTRAL — the open academic resource portal for BIT Sathy students! 🚀 Keep student infrastructure strong!";
    if (navigator.share) {
      navigator.share({
        title: "BIT-CENTRAL Supporter",
        text: shareText,
        url: window.location.origin + "/support-dev",
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText + " " + window.location.origin + "/support-dev");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-between overflow-hidden bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-black dark:text-white">
      {/* Top Navigation */}
      <div className="shrink-0">
        {user ? <Navbar /> : <PublicNav />}
      </div>

      {/* Main Centered Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Glowing Background Radial Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[480px] w-[480px] rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-blue-500/20 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/90 text-center"
        >
          {/* Success Checkmark & Badge */}
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25"
            >
              <CheckCircle2 className="h-10 w-10" />
            </motion.div>

            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 fill-current text-amber-400" />
              Contribution Received & Verified
            </span>

            <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              Thank You for Being a{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-blue-400">
                Champion Supporter!
              </span>
            </h1>
          </div>

          {/* Inspirational Proud Quote Rotator */}
          <div className="my-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-slate-800/80 dark:bg-slate-950/60 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5 dark:border-slate-800/60 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1.5">
                <Quote className="h-4 w-4" /> Words of Pride
              </span>
              <span className="text-[11px] font-normal text-slate-400">
                {activeQuoteIndex + 1} / {PROUD_QUOTES.length}
              </span>
            </div>

            <div className="my-4 min-h-[90px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeQuoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <blockquote className="text-base sm:text-lg font-semibold italic text-slate-900 dark:text-white leading-relaxed">
                    "{PROUD_QUOTES[activeQuoteIndex].quote}"
                  </blockquote>
                  <cite className="mt-2 block not-italic text-xs font-bold text-slate-500 dark:text-slate-400">
                    — {PROUD_QUOTES[activeQuoteIndex].author}
                  </cite>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-800/60">
              <button
                onClick={() => setActiveQuoteIndex((prev) => (prev - 1 + PROUD_QUOTES.length) % PROUD_QUOTES.length)}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>

              <div className="flex gap-1">
                {PROUD_QUOTES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveQuoteIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeQuoteIndex === idx ? "w-4 bg-emerald-500" : "w-1.5 bg-slate-300 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setActiveQuoteIndex((prev) => (prev + 1) % PROUD_QUOTES.length)}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Patron Badge & Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              {copied ? "Copied Link!" : "Share Your Support"}
            </button>

            <Link
              to="/home"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              Return to Student Home
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 py-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
        Official BIT-CENTRAL Verified Patron Certificate • 2026
      </footer>
    </div>
  );
}

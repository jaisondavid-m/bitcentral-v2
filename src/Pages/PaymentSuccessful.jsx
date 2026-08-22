import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Heart,
  Sparkles,
  Award,
  Share2,
  Home,
  ArrowRight,
  Quote,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  BookOpen,
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
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-black dark:text-white">
      {user ? <Navbar /> : <PublicNav />}

      {/* Hero Celebration Banner */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 px-4 py-16 dark:border-slate-800 dark:from-emerald-950/40 dark:via-black dark:to-slate-950 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -z-10 h-96 w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.2),transparent)] dark:bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3),transparent)]"></div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-4 text-white shadow-xl shadow-emerald-500/20"
          >
            <CheckCircle2 className="h-14 w-14" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 fill-current text-amber-400" />
              Contribution Received & Verified
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-950 dark:text-white">
              Thank You for Being a{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-blue-400">
                Champion Supporter!
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Your donation has successfully processed through Razorpay. You have made a real difference for the entire BIT Sathy student community!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Inspirational Quotes Carousel / Donator Honor Wall */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900/90"
        >
          {/* Background Decorative Accents */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/20"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/20"></div>

          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Quote className="h-5 w-5" />
              Words of Pride & Appreciation
            </div>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Quote {activeQuoteIndex + 1} of {PROUD_QUOTES.length}
            </span>
          </div>

          <div className="my-8 min-h-[160px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeQuoteIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center max-w-2xl"
              >
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300 mb-3">
                  {PROUD_QUOTES[activeQuoteIndex].category}
                </span>

                <blockquote className="text-xl sm:text-2xl font-semibold italic leading-relaxed text-slate-900 dark:text-white">
                  "{PROUD_QUOTES[activeQuoteIndex].quote}"
                </blockquote>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-0.5 w-6 bg-emerald-500"></div>
                  <cite className="not-italic text-sm font-bold text-slate-600 dark:text-slate-300">
                    — {PROUD_QUOTES[activeQuoteIndex].author}
                  </cite>
                  <div className="h-0.5 w-6 bg-emerald-500"></div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
            <button
              onClick={() => setActiveQuoteIndex((prev) => (prev - 1 + PROUD_QUOTES.length) % PROUD_QUOTES.length)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Previous Quote
            </button>

            <div className="flex gap-1.5">
              {PROUD_QUOTES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveQuoteIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeQuoteIndex === idx ? "w-6 bg-emerald-500" : "w-2 bg-slate-300 dark:bg-slate-700"
                  }`}
                  aria-label={`Go to quote ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => setActiveQuoteIndex((prev) => (prev + 1) % PROUD_QUOTES.length)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              Next Quote <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Patron Badge & Details Card */}
      <section className="mx-auto max-w-4xl px-4 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-6 md:grid-cols-12 md:items-center">
            
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <Award className="h-5 w-5" />
                <span>BIT-CENTRAL Verified Patron Certificate</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                You are officially registered in our community heart!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Your support covers server upkeep, continuous feature updates, and ad-free access for your peers. Wear your pride with honor!
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3">
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors cursor-pointer"
              >
                <Share2 className="h-4 w-4" />
                {copied ? "Copied Link!" : "Share Your Support"}
              </button>

              <Link
                to="/home"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Home className="h-4 w-4" />
                Return to Student Home
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="mx-auto max-w-4xl px-4 py-8 mb-12">
        <div className="grid gap-4 sm:grid-cols-3">
          <Link
            to="/semester"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 hover:border-blue-500 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-blue-400 transition-all shadow-sm"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" /> Question Banks
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/developer"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 hover:border-indigo-500 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-indigo-400 transition-all shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4 text-indigo-500" /> Developer Profile
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/support-dev"
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-900 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:border-emerald-400 transition-all shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500" /> Support Page
            </span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

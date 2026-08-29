import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  ShieldCheck,
  Heart,
  Medal,
  Check,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";
import { getVerifiedCertificate } from "../api/axios.js";

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
  const { id } = useParams();

  const [activeQuoteIndex, setActiveQuoteIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const [loadingCert, setLoadingCert] = useState(!!id);
  const [certData, setCertData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (id) {
      setLoadingCert(true);
      getVerifiedCertificate(id).then((res) => {
        if (isMounted) {
          setCertData(res);
          setLoadingCert(false);
        }
      });
    } else {
      setLoadingCert(false);
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveQuoteIndex((prev) => (prev + 1) % PROUD_QUOTES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Resolved Display Values from backend certificate verification
  const isVerified = certData?.verified === true;
  const donorName = isVerified
    ? certData.name
    : user?.displayName || user?.email?.split("@")[0] || "BITSian Patron";
  const amountDisplay = isVerified && certData.amount ? `₹${Number(certData.amount).toLocaleString("en-IN")}` : "";
  const certIdDisplay = isVerified ? certData.certificate_id : id || "BIT-PATRON-VERIFIED";
  const rankDisplay = isVerified && certData.rank ? `#${certData.rank}` : null;
  const dateDisplay = isVerified && certData.date ? certData.date : new Date().toISOString().split("T")[0];

  const handleShare = () => {
    const certIdToShare = certIdDisplay;
    const shareUrl = `${window.location.origin}/payment-successful/${encodeURIComponent(certIdToShare)}`;
    const shareText = `Check out ${donorName}'s Verified BIT-CENTRAL Patron Certificate (${certIdToShare}) supporting BIT Sathy open student infrastructure! 🚀`;

    if (navigator.share) {
      navigator
        .share({
          title: `${donorName}'s Verified BIT-CENTRAL Certificate`,
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText + " " + shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-black dark:text-white">

      {/* Main Centered Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative my-4">
        {/* Glowing Background Radial Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-blue-500/20 blur-3xl"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl rounded-3xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/95 text-center space-y-6"
        >
          {loadingCert ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                Verifying Patron Certificate with Razorpay records...
              </p>
            </div>
          ) : id && !isVerified ? (
            /* UNVERIFIED / TAMPERED WARNING CARD */
            <div className="py-8 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400">
                <ShieldAlert className="h-10 w-10" />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/60 dark:text-amber-300">
                Unverified Certificate ID
              </span>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Certificate Could Not Be Verified
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                The Certificate ID <code className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold text-rose-500">{id}</code> could not be matched against official Razorpay payment records.
              </p>

              <div className="pt-4">
                <Link
                  to="/support-dev"
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white transition-colors"
                >
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  <span>Support BIT-CENTRAL or View Official Leaderboard</span>
                </Link>
              </div>
            </div>
          ) : (
            /* VERIFIED OFFICIAL DIGITAL CERTIFICATE */
            <>
              {/* Success Header Badge */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/25"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.div>

                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5 fill-current text-amber-400" />
                  Official Verified Patron Certificate
                </span>

                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                  Thank You, <span className="text-emerald-600 dark:text-emerald-400">{donorName}</span>!
                </h1>
              </div>

              {/* DIGITAL CERTIFICATE CARD */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-400/80 bg-gradient-to-b from-emerald-50/70 via-white to-teal-50/50 p-6 shadow-md dark:border-emerald-600/60 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30">
                {/* Corner Decorative Ornaments */}
                <div className="absolute top-2 left-2 text-emerald-500/40">
                  <Award className="h-6 w-6" />
                </div>
                <div className="absolute top-2 right-2 text-emerald-500/40">
                  <Medal className="h-6 w-6" />
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> BIT-CENTRAL COMMUNITY HONOR ROLL
                  </span>

                  <h2 className="text-xl sm:text-2xl font-black tracking-wide text-slate-900 dark:text-white uppercase">
                    CERTIFICATE OF APPRECIATION
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                    This digital certificate proudly certifies that
                  </p>

                  <div className="py-1">
                    <span className="text-xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-wide underline decoration-emerald-400/50 decoration-2 underline-offset-4">
                      {donorName}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                    has contributed {amountDisplay ? <strong className="text-emerald-600 dark:text-emerald-300 font-black text-base px-1">{amountDisplay}</strong> : "generously "} 
                    to support free student infrastructure, high-speed servers, and open campus tools for the BIT Sathy community.
                  </p>

                  {rankDisplay && (
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        Leaderboard Rank: {rankDisplay}
                      </span>
                    </div>
                  )}

                  {/* Official Seal & Verification Footer */}
                  <div className="mt-5 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-between flex-wrap gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                      <Check className="h-4 w-4 rounded-full bg-emerald-500 text-white p-0.5" />
                      <span>Verified Patron Record • {dateDisplay}</span>
                    </div>
                    <span className="font-mono text-[10px] bg-emerald-100/80 dark:bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-800 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-800">
                      ID: {certIdDisplay}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inspirational Quote Rotator */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800/80 dark:bg-slate-950/60 relative overflow-hidden text-left">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-800/60 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <span className="flex items-center gap-1.5">
                    <Quote className="h-4 w-4" /> Community Recognition
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    {activeQuoteIndex + 1} / {PROUD_QUOTES.length}
                  </span>
                </div>

                <div className="my-3 min-h-[60px] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeQuoteIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="w-full"
                    >
                      <blockquote className="text-xs sm:text-sm font-semibold italic text-slate-800 dark:text-slate-200 leading-relaxed">
                        "{PROUD_QUOTES[activeQuoteIndex].quote}"
                      </blockquote>
                      <cite className="mt-1 block not-italic text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        — {PROUD_QUOTES[activeQuoteIndex].author}
                      </cite>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-2 dark:border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => setActiveQuoteIndex((prev) => (prev - 1 + PROUD_QUOTES.length) % PROUD_QUOTES.length)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </button>

                  <div className="flex gap-1">
                    {PROUD_QUOTES.map((_, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setActiveQuoteIndex(idx)}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          activeQuoteIndex === idx ? "w-4 bg-emerald-500" : "w-1.5 bg-slate-300 dark:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveQuoteIndex((prev) => (prev + 1) % PROUD_QUOTES.length)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Share & Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm py-3 px-5 shadow-md shadow-emerald-600/20 transition-all duration-200 cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{copied ? "Certificate Link Copied!" : "Share Certificate"}</span>
                </button>

                <Link
                  to="/support-dev"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                  <span>View Leaderboard</span>
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 py-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
        Official BIT-CENTRAL Digital Verified Patron Certificate • 2026
      </footer>
    </div>
  );
}



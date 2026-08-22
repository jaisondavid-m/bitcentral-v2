import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  Coffee,
  Sparkles,
  ShieldCheck,
  Server,
  Code,
  Zap,
  ExternalLink,
  Award,
  ArrowRight,
  CheckCircle2,
  Lock,
} from "lucide-react";
import PublicNav from "../Component/PublicNav.jsx";
import Navbar from "../Component/NavBar.jsx";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";

const RAZORPAY_PAGE_URL = "https://pages.razorpay.com/X8K4y93";

const SUPPORT_TIERS = [
  {
    amount: "50",
    label: "Coffee Boost ☕",
    description: "Keep the developer energized during late-night question paper updates.",
    icon: Coffee,
    popular: false,
    color: "from-amber-500 to-orange-600",
  },
  {
    amount: "100",
    label: "Server Fuel ⚡",
    description: "Covers daily cloud server & PDF bandwidth costs for fellow students.",
    icon: Server,
    popular: true,
    color: "from-blue-500 to-indigo-600",
  },
  {
    amount: "250",
    label: "Domain & DB Supporter 🌐",
    description: "Helps maintain high-availability database and domain renewals.",
    icon: Zap,
    popular: false,
    color: "from-purple-500 to-pink-600",
  },
  {
    amount: "500",
    label: "Platform Legend 🏆",
    description: "Powers new feature research, automated tools, and long-term maintenance.",
    icon: Award,
    popular: false,
    color: "from-emerald-500 to-teal-600",
  },
];

const FUNDING_REASONS = [
  {
    title: "Server & Storage Hosting",
    description: "High-speed cloud hosting for hundreds of semester question papers, answer keys, and exam PDFs.",
    icon: Server,
  },
  {
    title: "Domain & SSL Infrastructure",
    description: "Keeping BIT-CENTRAL secure, encrypted, fast, and accessible 24/7 with zero downtime.",
    icon: ShieldCheck,
  },
  {
    title: "Continuous Feature R&D",
    description: "Building new student tools like Exam Hall seat finders, Mess schedules, and automatic seating plans.",
    icon: Code,
  },
  {
    title: "100% Free & Ad-Free Portal",
    description: "Keeping the portal completely clean, ad-free, and distraction-free for all BIT Sathy students.",
    icon: Heart,
  },
];

export default function SupportDev() {
  const [user] = useAuthState(auth);
  const [selectedTier, setSelectedTier] = useState("100");

  const handleProceedToPayment = () => {
    window.open(RAZORPAY_PAGE_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-black dark:text-white">
      {user ? <Navbar /> : <PublicNav />}

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 px-4 py-16 dark:border-slate-800 dark:from-slate-950 dark:via-black dark:to-slate-950 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -z-10 h-96 w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent)] dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.25),transparent)]"></div>

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/60 dark:text-blue-300">
              <Heart className="h-3.5 w-3.5 fill-current text-rose-500" />
              Support BIT-CENTRAL Developer
            </span>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-950 dark:text-white">
              Power the Future of{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
                BIT-CENTRAL
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              BIT-CENTRAL is a student-built, non-profit platform bringing academic resources, question banks, mess menus, and campus utilities into one place for BIT Sathy students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Contribution Area */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          
          {/* Left Column: Tiers & Razorpay Action */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    Select Support Tier
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Choose an amount or enter custom amount on Razorpay
                  </p>
                </div>
                <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  Razorpay Verified
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {SUPPORT_TIERS.map((tier) => {
                  const Icon = tier.icon;
                  const isSelected = selectedTier === tier.amount;
                  return (
                    <div
                      key={tier.amount}
                      onClick={() => setSelectedTier(tier.amount)}
                      className={`relative cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/60 ring-2 ring-blue-500 dark:border-blue-500 dark:bg-blue-950/40"
                          : "border-slate-200 bg-slate-50/50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-3 right-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                          Most Popular
                        </span>
                      )}

                      <div className="flex items-start justify-between">
                        <div className={`rounded-lg bg-gradient-to-br ${tier.color} p-2.5 text-white shadow-md`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-black text-slate-950 dark:text-white">
                          ₹{tier.amount}
                        </span>
                      </div>

                      <h3 className="mt-3 font-bold text-slate-900 dark:text-white text-sm">
                        {tier.label}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {tier.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2.5 dark:border-slate-800/80">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {isSelected ? "Selected Tier" : "Click to select"}
                        </span>
                        <CheckCircle2
                          className={`h-4 w-4 ${
                            isSelected
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={handleProceedToPayment}
                  className="group relative flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-all duration-300 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 hover:shadow-blue-500/25 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
                >
                  <Heart className="h-5 w-5 fill-current text-rose-300 group-hover:scale-110 transition-transform" />
                  <span>Proceed with Razorpay (₹{selectedTier} or Custom)</span>
                  <ExternalLink className="h-4 w-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-emerald-500" /> Secure 256-bit SSL
                  </span>
                  <span>•</span>
                  <span>UPI, GPay, Cards & NetBanking</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Why Support Matters */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900/90">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Where Your Contribution Goes
              </h2>

              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Every contribution directly fuels the technical infrastructure powering BIT-CENTRAL:
              </p>

              <div className="mt-5 space-y-4">
                {FUNDING_REASONS.map((reason, idx) => {
                  const Icon = reason.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3.5 rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 dark:border-slate-800/80 dark:bg-slate-950/60"
                    >
                      <div className="rounded-lg bg-blue-100 p-2 text-blue-700 dark:bg-blue-950 dark:text-blue-300 shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                          {reason.title}
                        </h3>
                        <p className="mt-0.5 text-[11px] text-slate-600 dark:text-slate-400 leading-normal">
                          {reason.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 dark:from-blue-950/40 dark:to-indigo-950/40 border border-blue-100 dark:border-blue-900/40">
                <p className="text-xs text-slate-700 dark:text-slate-300 italic text-center">
                  "Built with ❤️ by Jaison David M for the BIT Sathy student community."
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Redirect Note Section */}
      <section className="mx-auto max-w-4xl px-4 py-8 text-center">
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <p>
            After completing payment on Razorpay, you will be automatically redirected to our{" "}
            <Link
              to="/payment-successful"
              className="font-bold text-blue-600 hover:underline dark:text-blue-400 inline-flex items-center gap-1"
            >
              Payment Successful Honor Page <ArrowRight className="h-3 w-3" />
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

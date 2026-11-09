import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, Clock, Compass, FileText, Filter, GraduationCap, HelpCircle, Layers, Search, ShieldCheck } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import { GUIDE_CATEGORIES, GUIDES_DATA } from "@/content/guidesData.js";

export default function GuidesIndex() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = GUIDES_DATA.filter((guide) => {
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />

      {/* Hero Section */}
      <section className="border-b border-zinc-900 bg-white dark:border-white dark:bg-[#111827]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            <span>BIT Sathy Public Knowledge Hub</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-zinc-900 dark:text-white">
            BIT Student Guides & Campus Knowledge Base
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            Explore authentic, practical guides written for Bannari Amman Institute of Technology (BIT Sathy) students. From campus block navigation and semester examination rules to question bank preparation, mess schedules, and Wi-Fi configuration.
          </p>

          {/* Search & Category Bar */}
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-zinc-500" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides by title, category, exam, mess, attendance..."
                className="w-full rounded-xl border border-zinc-900 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-zinc-900 placeholder-zinc-400 shadow-[2px_2px_0px_#18181b] focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500 dark:shadow-[2px_2px_0px_#ffffff]"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-black text-zinc-600 dark:text-zinc-400">
                <Filter className="h-3.5 w-3.5" /> Filter:
              </span>
              {GUIDE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-black transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "border border-zinc-900 bg-blue-600 text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]"
                      : "border border-zinc-900 bg-white text-zinc-800 shadow-[1px_1px_0px_#18181b] hover:bg-zinc-100 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[1px_1px_0px_#ffffff]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guide Cards Grid */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 dark:border-white">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">
            Available Guides ({filteredGuides.length})
          </h2>
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">Public & Crawlable Documentation</span>
        </div>

        {filteredGuides.length === 0 ? (
          <div className="mt-8 rounded-xl border border-zinc-900 bg-white p-8 text-center shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <HelpCircle className="mx-auto h-8 w-8 text-zinc-400" />
            <p className="mt-2 text-sm font-black text-zinc-900 dark:text-white">No guides matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-3 text-xs font-black text-blue-600 hover:underline dark:text-blue-400 cursor-pointer"
            >
              Reset search & filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map((guide) => (
              <article
                key={guide.slug}
                className="flex flex-col justify-between rounded-xl border border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-md border border-zinc-900 bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-900 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-blue-900/60 dark:text-blue-100 dark:shadow-[1px_1px_0px_#ffffff]">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-zinc-500 dark:text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-black text-zinc-900 leading-snug dark:text-white">
                    <Link to={`/guides/${guide.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {guide.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600 line-clamp-3 dark:text-zinc-300">
                    {guide.shortDescription}
                  </p>
                </div>

                <div className="mt-6 border-t border-zinc-200 pt-4 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Updated {guide.lastUpdated}</span>
                  <Link
                    to={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Read Guide
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Public vs Protected Notice Callout */}
      <section className="border-t border-zinc-900 bg-white py-12 dark:border-white dark:bg-[#111827]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-zinc-900 bg-blue-50/50 p-6 shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-zinc-900 dark:shadow-[4px_4px_0px_#ffffff]">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Looking for Student Portal Utilities?
                </h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-2xl">
                  Public guides explain features, rules, and procedures. To use live personal utilities (Exam Seat Allotment lookup, Biometric Punch logs, live Mess Menu updates, and Question Bank PDF files), log in with your BIT Sathy Google account.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-900 bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all flex-shrink-0 cursor-pointer"
              >
                Sign In to Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

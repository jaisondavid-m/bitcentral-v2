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
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            <span>BIT Sathy Public Knowledge Hub</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
            BIT Student Guides & Campus Knowledge Base
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
            Explore authentic, practical guides written for Bannari Amman Institute of Technology (BIT Sathy) students. From campus block navigation and semester examination rules to question bank preparation, mess schedules, and Wi-Fi configuration.
          </p>

          {/* Search & Category Bar */}
          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guides by title, category, exam, mess, attendance..."
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Filter className="h-3.5 w-3.5" /> Filter:
              </span>
              {GUIDE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200/80 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
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
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Available Guides ({filteredGuides.length})
          </h2>
          <span className="text-xs text-slate-500">Public & Crawlable Documentation</span>
        </div>

        {filteredGuides.length === 0 ? (
          <div className="mt-8 rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-950">
            <HelpCircle className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No guides matching "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-3 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Reset search & filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGuides.map((guide) => (
              <article
                key={guide.slug}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs transition-all hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-500"
              >
                <div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Clock className="h-3.5 w-3.5" />
                      {guide.readTime}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-slate-950 leading-snug dark:text-white">
                    <Link to={`/guides/${guide.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                      {guide.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 line-clamp-3 dark:text-slate-300">
                    {guide.shortDescription}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-900 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Updated {guide.lastUpdated}</span>
                  <Link
                    to={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
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
      <section className="bg-white py-12 dark:bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/50 dark:bg-blue-950/30">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  Looking for Student Portal Utilities?
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300 max-w-2xl">
                  Public guides explain features, rules, and procedures. To use live personal utilities (Exam Seat Allotment lookup, Biometric Punch logs, live Mess Menu updates, and Question Bank PDF files), log in with your BIT Sathy Google account.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 flex-shrink-0"
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

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Terminal,
  X,
  CheckCircle2,
} from "lucide-react";
import { dsaExperiments } from "@/content/dsaExperiments.js";

export default function DSAPage() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentExp = dsaExperiments[currentIndex] || dsaExperiments[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search input when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  // Filter experiments for searchable select
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return dsaExperiments;
    const q = searchQuery.toLowerCase().trim();
    return dsaExperiments.filter((exp) => {
      return (
        exp.expNumber.includes(q) ||
        `exp ${exp.expNumber}`.includes(q) ||
        exp.shortTitle.toLowerCase().includes(q) ||
        exp.title.toLowerCase().includes(q) ||
        exp.badge.toLowerCase().includes(q) ||
        exp.aim.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const handleSelectExp = (idx) => {
    setCurrentIndex(idx);
    setIsDropdownOpen(false);
    setSearchQuery("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentExp.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-linear-to-b from-blue-50 via-sky-50 to-slate-100 px-2.5 py-3 sm:px-4 sm:py-6 md:px-6 dark:from-[#090b16] dark:via-[#0f172a] dark:to-[#04050b]">
      <div className="mx-auto w-full max-w-4xl min-w-0 space-y-3 sm:space-y-4">
        
        {/* Top Navigation Bar: Mobile Responsive */}
        <div className="w-full max-w-full min-w-0 rounded-2xl border border-blue-200/70 bg-white/95 p-3 shadow-xs backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:p-4">
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between min-w-0">
            
            {/* Left: Back & Title */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 truncate dark:text-white">
                  DSA Lab Experiments
                </h1>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 sm:text-xs truncate">
                  Data Structures-I • Exp {currentIndex + 1} of {dsaExperiments.length}
                </p>
              </div>
            </div>

            {/* Right: Searchable Select + Prev/Next Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto min-w-0">
              
              {/* Previous Button */}
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-xs transition hover:bg-slate-100 active:scale-95 disabled:opacity-35 disabled:pointer-events-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Previous Experiment"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Searchable Select Trigger */}
              <div className="relative flex-1 min-w-0 sm:w-72 md:w-80" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex w-full min-w-0 items-center justify-between gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 sm:px-3 py-2 text-left text-xs font-semibold text-slate-800 shadow-xs outline-none transition hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-blue-500 dark:focus:ring-blue-900"
                >
                  <span className="truncate flex-1 min-w-0">
                    Exp {currentExp.expNumber}: {currentExp.shortTitle}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${
                      isDropdownOpen ? "rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {/* Mobile Backdrop */}
                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] sm:hidden"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                )}

                {/* Floating Searchable Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="fixed inset-x-3 top-20 z-50 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-1.5 sm:w-full sm:min-w-[340px] rounded-2xl sm:rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                    
                    {/* Search Input inside dropdown */}
                    <div className="relative mb-2">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search experiment (e.g. stack, bfs, linked list)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filtered Experiments List */}
                    <div className="max-h-[60vh] sm:max-h-64 overflow-y-auto space-y-1 overscroll-contain">
                      {filteredList.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400 italic">
                          No experiment matches "{searchQuery}"
                        </div>
                      ) : (
                        filteredList.map((exp) => {
                          const originalIdx = dsaExperiments.findIndex((e) => e.id === exp.id);
                          const isSelected = originalIdx === currentIndex;
                          return (
                            <button
                              key={exp.id}
                              type="button"
                              onClick={() => handleSelectExp(originalIdx)}
                              className={`flex w-full items-start justify-between gap-2 rounded-xl sm:rounded-lg p-2.5 sm:p-2 text-left text-xs transition active:scale-[0.99] ${
                                isSelected
                                  ? "bg-blue-50 font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                              }`}
                            >
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="font-bold shrink-0">Exp {exp.expNumber}:</span>
                                  <span className="truncate">{exp.shortTitle}</span>
                                </div>
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                  {exp.badge}
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Next Button */}
              <button
                type="button"
                disabled={currentIndex === dsaExperiments.length - 1}
                onClick={() => {
                  setCurrentIndex((prev) => Math.min(dsaExperiments.length - 1, prev + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-xs transition hover:bg-slate-100 active:scale-95 disabled:opacity-35 disabled:pointer-events-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Next Experiment"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Experiment Content Card: Constrained & Mobile Safe */}
        <article className="w-full max-w-full min-w-0 overflow-hidden rounded-2xl border border-blue-200/70 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900/90">
          
          {/* Card Header with Badges & Title */}
          <div className="border-b border-slate-100 bg-slate-50/70 p-3 sm:p-5 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-wider">
                  Exp. No: {currentExp.expNumber}
                </span>
                <span className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {currentExp.badge}
                </span>
                {currentExp.courseOutcome && (
                  <span className="rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/40 dark:text-purple-300">
                    {currentExp.courseOutcome}
                  </span>
                )}
              </div>
              <h2 className="text-xs sm:text-base md:text-lg font-bold text-slate-900 dark:text-white leading-snug break-words">
                {currentExp.title}
              </h2>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-5 p-3 sm:p-5 min-w-0">
            
            {/* AIM */}
            <section aria-labelledby="aim-heading" className="min-w-0">
              <h3 id="aim-heading" className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Aim
              </h3>
              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 break-words">
                {currentExp.aim}
              </p>
            </section>
            {/* ALGORITHM */}
            <section aria-labelledby="algo-heading" className="min-w-0">
              <h3 id="algo-heading" className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Algorithm
              </h3>
              <div className="mt-1.5 rounded-xl border border-slate-200 bg-slate-50/60 p-2.5 sm:p-3.5 dark:border-slate-800 dark:bg-slate-900/40 min-w-0">
                <ol className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 min-w-0">
                  {currentExp.algorithm.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2 min-w-0">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 font-mono text-[11px] font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5 break-words flex-1 min-w-0 whitespace-pre-line">
                        {step.replace(/^\d+\.\s*/, "")}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* PYTHON PROGRAM */}
            <section aria-labelledby="code-heading" className="min-w-0">
              <div className="mb-2 flex items-center justify-between min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <Terminal className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 id="code-heading" className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white truncate">
                    Python Program
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 active:scale-95 transition dark:text-blue-400 dark:hover:bg-blue-950/60"
                  aria-label="Copy Python code"
                >
                  {copiedCode ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Box Container: Clean light theme with horizontal scroll to preserve straight Python lines */}
              <div className="w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 shadow-sm">
                <div className="w-full max-w-full overflow-x-auto p-3 sm:p-4 text-slate-800 dark:text-slate-100 overscroll-x-contain touch-pan-x">
                  <pre className="whitespace-pre font-mono text-xs sm:text-[13px] leading-relaxed w-max min-w-full">
                    <code>{currentExp.code}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* SAMPLE OUTPUT */}
            {currentExp.sampleOutput && (
              <section aria-labelledby="output-heading" className="min-w-0">
                <h3 id="output-heading" className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Sample Output
                </h3>
                <div className="w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-3.5 text-slate-800 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200 shadow-sm overscroll-x-contain touch-pan-x">
                  <pre className="whitespace-pre font-mono text-xs sm:text-[13px] leading-relaxed w-max min-w-full">{currentExp.sampleOutput}</pre>
                </div>
              </section>
            )}

            {/* RESULT */}
            {currentExp.result && (
              <section aria-labelledby="result-heading" className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 sm:p-3.5 dark:border-emerald-900/50 dark:bg-emerald-950/20 min-w-0">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h3 id="result-heading" className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Result
                  </h3>
                </div>
                <p className="mt-1 whitespace-pre-line text-xs sm:text-sm leading-relaxed text-emerald-950 dark:text-emerald-200 break-words">
                  {currentExp.result}
                </p>
              </section>
            )}

          </div>

          {/* Bottom Quick-Step Bar for Mobile Navigation */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-900/60 min-w-0">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex((prev) => Math.max(0, prev - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-100 active:scale-95 disabled:opacity-35 disabled:pointer-events-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <ChevronLeft className="h-4 w-4 shrink-0" />
              <span>Prev</span>
            </button>

            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
              {currentIndex + 1} of {dsaExperiments.length}
            </span>

            <button
              type="button"
              disabled={currentIndex === dsaExperiments.length - 1}
              onClick={() => {
                setCurrentIndex((prev) => Math.min(dsaExperiments.length - 1, prev + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-100 active:scale-95 disabled:opacity-35 disabled:pointer-events-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </button>
          </div>

        </article>

      </div>
    </div>
  );
}

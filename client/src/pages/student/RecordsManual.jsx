import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Code2,
  ChevronRight,
  GraduationCap,
  Sparkles,
  Layers,
  Cpu,
} from "lucide-react";

export default function RecordsManual() {
  const navigate = useNavigate();

  const manuals = [
    {
      id: "dsa",
      title: "DSA Lab Manual",
      subtitle: "Data Structures-I",
      department: "Department of Computer Science and Engineering",
      experimentsCount: "6 Verified Experiments",
      topics: "Stack, Queue, Singly Linked List, Hash Map, Grade Sorting, BFS/DFS",
      route: "/dsa",
      gradient: "from-blue-600 to-indigo-600",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      icon: Layers,
    },
    {
      id: "ppl",
      title: "PPL Lab Manual",
      subtitle: "Principles of Programming Lab",
      department: "Department of Artificial Intelligence and Machine Learning",
      experimentsCount: "7 Verified Experiments",
      topics: "Shopping Cart, Pocket Bazaar, Vacation Decider, Temp Monitor, Auth, Math Quiz, Maze Solver",
      route: "/ppl",
      gradient: "from-purple-600 to-pink-600",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      icon: Cpu,
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-linear-to-b from-blue-50 via-sky-50 to-slate-100 px-3 py-4 sm:px-6 sm:py-8 dark:from-[#090b16] dark:via-[#0f172a] dark:to-[#04050b]">
      <div className="mx-auto w-full max-w-4xl min-w-0 space-y-4 sm:space-y-6">
        
        {/* Top Header Card */}
        <div className="w-full rounded-2xl border border-blue-200/70 bg-white/95 p-4 sm:p-5 shadow-xs backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate dark:text-white">
                  Lab Records & Manuals
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                Official laboratory manuals, verified Python programs, and observation records
              </p>
            </div>
          </div>
        </div>

        {/* 2 Manual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0">
          {manuals.map((manual) => {
            const Icon = manual.icon;
            return (
              <div
                key={manual.id}
                onClick={() => navigate(manual.route)}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 cursor-pointer min-w-0"
              >
                {/* Top content */}
                <div className="space-y-3 min-w-0">
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-950/60 dark:group-hover:text-blue-400 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-bold ${manual.badgeColor}`}>
                      {manual.experimentsCount}
                    </span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {manual.title}
                    </h2>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {manual.subtitle}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {manual.department}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Topics: </span>
                      {manual.topics}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-5 mt-4 min-w-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(manual.route);
                    }}
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-600 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    <span>View Now</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

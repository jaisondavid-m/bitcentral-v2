import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";

export default function RecordsManual() {
  const navigate = useNavigate();

  const manuals = [
    {
      id: "dsa",
      title: "DSA Lab Manual",
      route: "/dsa",
    },
    {
      id: "ppl",
      title: "PPL Lab Manual",
      route: "/ppl",
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-linear-to-b from-blue-50 via-sky-50 to-slate-100 px-3 py-4 sm:px-6 sm:py-8 dark:from-[#090b16] dark:via-[#0f172a] dark:to-[#04050b]">
      <div className="mx-auto w-full max-w-2xl min-w-0 space-y-4 sm:space-y-6">
        
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
            </div>
          </div>
        </div>

        {/* 2 Manual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-w-0">
          {manuals.map((manual) => (
            <div
              key={manual.id}
              onClick={() => navigate(manual.route)}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition dark:border-slate-800 dark:bg-slate-900 cursor-pointer min-w-0"
            >
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6">
                {manual.title}
              </h2>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(manual.route);
                }}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 px-4 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700 active:scale-[0.98]"
              >
                <span>View</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

import React from "react";
import { ChevronRight, FileText } from "lucide-react";

export default function SubjectCard({ subject, onOpenDetails, dark = false }) {
  const code = subject?.code || subject?.subject_code || "";
  const name = subject?.name || subject?.subject_name || "";
  const semqbwithans = subject?.semqbwithans || subject?.sem_qb_with_ans || "";
  const qb1 = subject?.qb1 || "";
  const qb2 = subject?.qb2 || "";
  const ak1 = subject?.ak1 || "";
  const ak2 = subject?.ak2 || "";

  const totalLinks = [qb1, qb2, ak1, ak2, semqbwithans].filter(Boolean).length;

  return (
    <div
      onClick={() => onOpenDetails?.(subject)}
      className={`group relative flex flex-col justify-between rounded-2xl border ${
        dark
          ? "border-slate-800 bg-slate-900/90 hover:border-blue-500/50 shadow-black/20"
          : "border-slate-200/80 bg-white hover:border-blue-300 shadow-blue-100/30"
      } p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer`}
    >
      <div>
        {/* Top bar: Code & Links count */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <FileText className="h-4 w-4" />
            </div>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
              {code}
            </span>
          </div>

          <span
            className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              dark
                ? "border-slate-700 bg-slate-800 text-slate-300"
                : "border-blue-200 bg-blue-50 text-blue-700"
            }`}
          >
            {totalLinks} link{totalLinks !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Subject Title */}
        <h3 className="mt-3 text-base font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
          {name}
        </h3>
      </div>

      {/* Bottom Footer: View details button */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
          Click for materials
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails?.(subject);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-blue-500/20 transition hover:bg-blue-700"
        >
          View details
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
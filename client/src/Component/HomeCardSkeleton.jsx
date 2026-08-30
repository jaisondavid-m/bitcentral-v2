import React from "react";

export function HomeCardSkeleton() {
  return (
    <div className="flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-sm animate-pulse dark:border-slate-800 dark:bg-slate-950">
      <div className="w-full max-w-[200px] sm:max-w-[210px] aspect-square mx-auto overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800 mb-2.5 shrink-0"></div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <div className="h-4.5 bg-slate-200 rounded-md w-3/4 dark:bg-slate-800"></div>
          <div className="mt-1 h-3 bg-slate-100 rounded w-full dark:bg-slate-900"></div>
        </div>
        <div className="mt-3 h-9 bg-slate-200 rounded-xl w-full dark:bg-slate-800"></div>
      </div>
    </div>
  );
}
import React from 'react';

function MealCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl animate-pulse dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3 dark:border-slate-700 dark:bg-slate-800 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div>
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-2 h-3 w-32 rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
        <div className="h-6 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
      </div>

      <div className="px-4 py-2.5 sm:px-5">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex items-center gap-2.5 border-b border-slate-100 py-2.5 last:border-0 dark:border-slate-800">
            <div className="h-5 w-5 rounded-full bg-slate-200 dark:bg-slate-700 sm:h-6 sm:w-6" />
            <div className="h-4 rounded bg-slate-200 dark:bg-slate-700" style={{ width: `${58 + ((i * 9) % 35)}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MealCardSkeleton;

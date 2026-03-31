import React from 'react';

export function MealCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden animate-pulse dark:border-blue-900 dark:bg-slate-950">
    
      <div className="px-4 py-3 border-b border-slate-200 dark:border-blue-900">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-slate-200 rounded dark:bg-slate-800"></div>
          <div className="h-5 bg-slate-200 rounded w-24 dark:bg-slate-800"></div>
        </div>
      </div>

      <div className="p-4 space-y-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="flex items-start gap-2">
            <div className="h-1.5 w-1.5 bg-slate-200 rounded-full mt-1.5 shrink-0 dark:bg-slate-800"></div>
            <div className="h-4 bg-slate-200 rounded flex-1 w-[70%] dark:bg-slate-800"></div>
          </div>
        ))}
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-blue-900">
          <div className="h-3 bg-slate-200 rounded w-16 mx-auto dark:bg-slate-800"></div>
        </div>
      </div>
    </div>
  );
}

export function MessMenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((card) => (
        <MealCardSkeleton key={card} />
      ))}
    </div>
  );
}
import React from 'react';

export function MealCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-slate-200 rounded-lg w-24"></div>
        <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
      </div>

      {/* Time range skeleton */}
      <div className="h-4 bg-slate-200 rounded w-32 mb-6"></div>

      {/* Menu items skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex items-start gap-2">
            <div className="h-2 w-2 bg-slate-200 rounded-full mt-1.5 flex-shrink-0"></div>
            <div className="h-4 bg-slate-200 rounded flex-1" style={{ width: `${60 + Math.random() * 40}%` }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MessMenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((card) => (
        <MealCardSkeleton key={card} />
      ))}
    </div>
  );
}
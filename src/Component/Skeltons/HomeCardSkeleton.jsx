import React from "react";

export function HomeCardSkeleton() {
  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm sm:rounded-xl animate-pulse">
      <div className="hidden sm:block aspect-video w-full overflow-hidden bg-slate-200">
        <div className="h-full w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
      
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="mb-2 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
        <div className="flex-1" />
        <div className="mt-2 sm:mt-3 h-8 sm:h-10 bg-slate-200 rounded-lg sm:rounded-xl w-full"></div>
      </div>
    </div>
  );
}
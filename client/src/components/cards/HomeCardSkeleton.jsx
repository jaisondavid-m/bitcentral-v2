import React from "react";

export function HomeCardSkeleton() {
  return (
    <div className="flex flex-col justify-between h-full overflow-hidden rounded-xl sm:rounded-2xl border border-zinc-900 bg-white p-3.5 sm:p-4.5 md:p-5 shadow-[2px_2px_0px_#18181b] animate-pulse dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
      <div>
        {/* Desktop image placeholder */}
        <div className="hidden sm:block w-full h-40 sm:h-44 md:h-48 lg:h-52 mx-auto rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 mb-3 sm:mb-3.5 shrink-0"></div>

        {/* Title & description placeholders */}
        <div className="space-y-1.5">
          <div className="h-4 sm:h-5 bg-zinc-200 dark:bg-zinc-800 rounded-md w-3/4"></div>
          <div className="hidden sm:block h-3 bg-zinc-100 dark:bg-zinc-800/60 rounded w-full"></div>
        </div>
      </div>

      {/* Button placeholder */}
      <div className="mt-3 sm:mt-4 h-8 sm:h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg sm:rounded-xl border border-zinc-300 dark:border-zinc-700 w-full"></div>
    </div>
  );
}

export default HomeCardSkeleton;

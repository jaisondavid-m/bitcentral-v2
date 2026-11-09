import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

function NotFound() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#f8fafc] px-4 py-12 dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors">
      <div className="mx-auto max-w-md w-full rounded-2xl border border-zinc-900 bg-white p-8 text-center shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[4px_4px_0px_#ffffff]">
        {/* Stamp */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-zinc-900 bg-blue-50 text-blue-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[2px_2px_0px_#ffffff]">
          <Compass className="h-7 w-7" />
        </div>

        <h1 className="text-6xl sm:text-7xl font-black text-zinc-900 dark:text-white tracking-tight">
          404
        </h1>
        <p className="mt-2 text-lg sm:text-xl font-black text-blue-600 dark:text-blue-400">
          Page Not Found
        </p>

        <p className="mt-3 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
          Please check the URL or return to the student hub.
        </p>

        <div className="mt-6">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-900 bg-blue-600 px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all"
          >
            <Home className="h-4 w-4" />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;

import React from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

export default function AdminBanner({ banner, onDismiss }) {
  if (!banner || !banner.message) return null;

  const isError = banner.type === "error";

  return (
    <div
      role="alert"
      className={`flex items-center justify-between gap-3 rounded-xl border border-zinc-900 p-3.5 sm:p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all ${
        isError
          ? "bg-rose-50 text-rose-900 dark:bg-rose-950/70 dark:text-rose-200"
          : "bg-emerald-50 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-200"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {isError ? (
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 stroke-[2.2]" />
        ) : (
          <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 stroke-[2.2]" />
        )}
        <p className="text-xs sm:text-sm font-bold truncate">{banner.message}</p>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-lg p-1 text-zinc-600 hover:text-zinc-900 hover:bg-black/5 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

import React, { useEffect } from "react";
import { LogOut, X, Loader2 } from "lucide-react";
import { haptics } from "@/utils/haptics.js";

export default function LogoutConfirmModal({ open, onClose, onConfirm, isLoading = false }) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, isLoading]);

  if (!open) return null;

  const handleConfirm = () => {
    haptics.action();
    onConfirm();
  };

  const handleCancel = () => {
    haptics.selection();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity duration-200"
      onClick={() => {
        if (!isLoading) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-2xl border border-zinc-900 bg-white p-6 shadow-[5px_5px_0px_#18181b] transition-all dark:border-white dark:bg-[#111827] dark:shadow-[5px_5px_0px_#ffffff] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="absolute right-4 top-4 rounded-lg border border-zinc-900 bg-white p-1.5 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-900 bg-rose-50 text-rose-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-rose-950/60 dark:text-rose-400 dark:shadow-[2px_2px_0px_#ffffff]">
          <LogOut className="h-7 w-7 stroke-[2.2]" />
        </div>

        {/* Title & Body */}
        <h2 id="logout-modal-title" className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
          Confirm Sign Out
        </h2>
        <p className="mt-2 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Are you sure you want to log out of BIT Central? You will need to sign in again to access student services.
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-zinc-900 bg-white py-2.5 sm:py-3 text-xs sm:text-sm font-black text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:bg-zinc-100 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-900 bg-rose-600 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-rose-700 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 stroke-[2.5]" />
                <span>Log Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


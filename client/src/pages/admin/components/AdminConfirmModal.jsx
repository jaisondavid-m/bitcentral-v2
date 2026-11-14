import React from "react";
import { Loader, X, AlertTriangle } from "lucide-react";

export default function AdminConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  busy = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  const isDanger = tone === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-xs"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-md rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-900 shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff] ${
                isDanger
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400"
                  : "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400"
              }`}
            >
              <AlertTriangle className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 id="confirm-modal-title" className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-zinc-900 p-1 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:border-white dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300 leading-relaxed mb-6">
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-zinc-900 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex items-center gap-2 rounded-lg border border-zinc-900 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-60 ${
              isDanger
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {busy && <Loader className="h-4 w-4 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

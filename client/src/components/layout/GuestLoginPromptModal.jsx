import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/StudentContext.jsx";
import { Sparkles, Mail, ArrowRight, X, ShieldCheck, Loader2 } from "lucide-react";
import { clearGuestSession } from "@/services/guestSession.js";
import { logout, signInWithGoogle } from "@/config/auth.js";

const GUEST_PROMPT_LAST_SHOWN_KEY = "bitcentral_guest_prompt_last_shown";
const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function GuestLoginPromptModal() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    // Only target guest users
    if (!user?.isGuest) {
      setOpen(false);
      return;
    }

    try {
      const lastShownStr = localStorage.getItem(GUEST_PROMPT_LAST_SHOWN_KEY);
      const now = Date.now();

      if (lastShownStr) {
        const lastShown = Number(lastShownStr);
        if (!Number.isNaN(lastShown) && now - lastShown < ONE_DAY_MS) {
          // Shown within the last 24 hours
          return;
        }
      }

      // Small 1.2s delay for a smoother page entrance before popping up
      const timer = setTimeout(() => {
        setOpen(true);
        // Mark as shown today
        localStorage.setItem(GUEST_PROMPT_LAST_SHOWN_KEY, String(now));
      }, 1200);

      return () => clearTimeout(timer);
    } catch {
      // Fallback
    }
  }, [user]);

  const handleDismiss = () => {
    setOpen(false);
    try {
      localStorage.setItem(GUEST_PROMPT_LAST_SHOWN_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  const handleLoginClick = async () => {
    try {
      setIsSigningIn(true);
      clearGuestSession();
      await logout();
      const res = await signInWithGoogle();
      handleDismiss();
      if (res?.user) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.warn("Google sign-in from guest prompt failed:", err);
      handleDismiss();
      navigate("/login");
    } finally {
      setIsSigningIn(false);
    }
  };

  if (!open || !user?.isGuest) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleDismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white p-6 shadow-2xl shadow-blue-950/30 transition-all dark:border-slate-800 dark:bg-slate-950 dark:shadow-slate-950/50 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Ambient Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-200"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center justify-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30">
            <Mail className="h-8 w-8" />
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Guest Account Active
          </span>

          <h3 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white">
            Unlock Full Experience
          </h3>

          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            For a better personalized experience, access to complete question banks, biometrics, attendance details, and student rewards, please log in with your official{" "}
            <strong className="font-semibold text-blue-600 dark:text-blue-400">@bitsathy.in</strong> email ID.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            disabled={isSigningIn}
            onClick={handleLoginClick}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.02] hover:shadow-blue-600/40 active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Login with BIT Sathy Mail
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            Continue as Guest (Remind Me Tomorrow)
          </button>
        </div>
      </div>
    </div>
  );
}

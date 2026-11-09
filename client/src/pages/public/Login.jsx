import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "@/config/auth.js";
import { isAllowedEmail } from "@/services/authRules.js";
import { AlertCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext.jsx";
import { useAuth } from "@/context/StudentContext.jsx";

function Login() {
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, accessDeniedMessage } = useAuth();

  useEffect(() => {
    if (location.state?.error === "unauthorized") {
      setError("Only @bitsathy.ac.in email accounts are allowed to sign in.");
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (accessDeniedMessage) {
      setError(accessDeniedMessage);
    }
  }, [accessDeniedMessage]);

  useEffect(() => {
    if (user && isAllowedEmail(user.email)) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      setError("");
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      console.log(err);
      setError(err?.message || "Sign in failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const isLoading = loading || isSigningIn;

  return (
    <main className="min-h-screen bg-[#f0f7ff] flex items-center justify-center px-4 dark:bg-[#090d16] text-[#0a0a0a] dark:text-[#f8fafc]">
      <button
        type="button"
        onClick={toggleTheme}
        className="fixed right-5 top-5 z-20 inline-flex items-center gap-2 rounded-lg border border-[#0a0a0a] bg-white px-3.5 py-2 text-xs font-bold text-[#0a0a0a] shadow-[3px_3px_0px_#0a0a0a] transition hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#0a0a0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:border-white dark:bg-[#111827] dark:text-white dark:shadow-[3px_3px_0px_#ffffff]"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {theme === "dark" ? "Light" : "Dark"}
      </button>

      <div className="w-full max-w-md overflow-hidden rounded-xl border border-[#0a0a0a] bg-white shadow-[6px_6px_0px_#0a0a0a] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff]">
        <div className="border-b border-[#0a0a0a] bg-[#3b82f6] px-6 py-6 text-center text-white dark:border-white">
          <span className="inline-block rounded-md border border-[#0a0a0a] bg-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-[#0a0a0a] shadow-[2px_2px_0px_#0a0a0a]">
            Student Portal
          </span>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white">BIT Central</h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-blue-100">By student · For students</p>
        </div>

        <div className="px-6 py-7">
          <div className="mb-6 rounded-lg border border-[#0a0a0a] bg-[#dbeafe] p-3 text-center dark:border-white dark:bg-[#1e293b]">
            <p className="text-xs font-bold text-[#1e3a8a] dark:text-[#93c5fd]">
              Institutional Access Only
            </p>
            <p className="mt-0.5 text-xs text-[#1e3a8a]/80 dark:text-[#cbd5e1]">
              Sign in with your <span className="font-extrabold text-[#1e3a8a] underline dark:text-white">@bitsathy.ac.in</span> account
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-[#0a0a0a] bg-[#fecaca] p-3.5 shadow-[3px_3px_0px_#0a0a0a] dark:border-white dark:bg-[#7f1d1d] dark:shadow-[3px_3px_0px_#ffffff]">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-[#991b1b] dark:text-[#fca5a5] mt-0.5" />
                <p className="text-xs font-bold text-[#7f1d1d] dark:text-white leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <button
            disabled={isLoading}
            onClick={handleSignIn}
            className={`flex w-full items-center justify-center gap-3 rounded-lg border border-[#0a0a0a] px-5 py-3.5 text-sm font-extrabold text-white transition-all dark:border-white ${
              isLoading
                ? "cursor-not-allowed bg-blue-300 opacity-70"
                : "bg-[#3b82f6] shadow-[4px_4px_0px_#0a0a0a] hover:bg-[#1d4ed8] hover:translate-x-[-1.5px] hover:translate-y-[-1.5px] hover:shadow-[5px_5px_0px_#0a0a0a] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none dark:shadow-[4px_4px_0px_#ffffff]"
            }`}
          >
            {isLoading ? (
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
            ) : (
              <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="h-5 w-5" />
            )}
            <span>{isLoading ? "Checking authentication..." : "Continue with Google"}</span>
          </button>

          <p className="mt-6 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wide dark:text-gray-400">
            Secure Single Sign-On (OAuth 2.0)
          </p>

          {accessDeniedMessage && (
            <p className="mt-3 text-center text-xs font-bold text-red-600 dark:text-red-400">
              Contact support@bitsathy.in for account assistance.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default Login;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../Authentication/firebase.js";
import { isAllowedEmail } from "../Authentication/authRules.js";
import { AlertCircle, LogIn, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { activateGuestSession, isGuestLoginEnabled } from "../Authentication/guestSession.js";
import { useAuth } from "../context/StudentContext.jsx";

function Login() {
  const { theme, toggleTheme } = useTheme();
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (location.state?.error === "unauthorized") {
      setError("Only @bitsathy.ac.in email accounts are allowed to sign in.");
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  useEffect(() => {
    if (user && isAllowedEmail(user.email)) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      setError("");
      await signInWithGoogle();
    } catch (err) {
      console.log(err);
      setError("Sign in failed. Please try again.");
    }
  };

  const handleGuestLogin = () => {
    setError("");
    activateGuestSession();
    navigate("/home", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center dark:bg-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 dark:bg-black">
      <button
        type="button"
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full border border-blue-300 bg-white/90 px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {theme === "dark" ? "Light" : "Dark"}
      </button>
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-blue-500 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950 dark:shadow-blue-950/40">

        <div className="bg-blue-600 px-6 py-6 text-center">
          <h1 className="text-2xl font-semibold text-white">BIT Central</h1>
          <p className="mt-1 text-sm text-blue-100">By student · For students</p>
        </div>
        
        <div className="px-6 py-7">
          <p className="mb-6 text-center text-sm text-gray-600 dark:text-slate-300">
            Only{" "}
            <span className="font-medium text-blue-600">@bitsathy.ac.in</span>{" "}
            email accounts are allowed
          </p>
          
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <button disabled={loading} onClick={handleSignIn} className={`flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${ loading ? "cursor-not-allowed bg-blue-300 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
            <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="h-5 w-5 rounded-full"/>
            {loading ? "Initializing..." : "Sign in with Google"}
          </button>

          {isGuestLoginEnabled && (
            <button
              type="button"
              onClick={handleGuestLogin}
              className="mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200 dark:hover:bg-blue-950"
            >
              <LogIn className="h-5 w-5" />
              Continue as Guest
            </button>
          )}
          
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-slate-400">Secure authentication powered by Google</p>

          {isGuestLoginEnabled && (
            <p className="mt-3 text-center text-[11px] text-blue-500 dark:text-blue-300">
              Guest login is enabled temporarily through the environment flag.
            </p>
          )}

        </div>
      </div>
    </div>
  );
}

export default Login;
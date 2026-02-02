import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle } from "../Authentication/firebase.js";

function Login() {
  const [disabled, setDisabled] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisabled(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Check if redirected due to unauthorized email
  useEffect(() => {
    if (location.state?.error === "unauthorized") {
      setError("Only @bitsathy.ac.in email accounts are allowed to sign in.");
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Redirect if already logged in with valid email
  useEffect(() => {
    if (user && user.email?.endsWith("@bitsathy.ac.in")) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleSignIn = async () => {
    try {
      setError(""); // Clear any previous errors
      await signInWithGoogle();
    } catch (err) {
      if (err.message === "Unauthorized email domain") {
        setError("Only @bitsathy.ac.in email accounts are allowed to sign in.");
      } else if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setError("Sign in failed. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-blue-500 bg-white shadow-sm">

        <div className="bg-blue-600 px-6 py-6 text-center">
          <h1 className="text-2xl font-semibold text-white">BIT Central</h1>
          <p className="mt-1 text-sm text-blue-100">By student · For students</p>
        </div>
        
        <div className="px-6 py-7">
          <p className="mb-6 text-center text-sm text-gray-600">
            Only{" "}
            <span className="font-medium text-blue-600">@bitsathy.ac.in</span>{" "}
            email accounts are allowed
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <button 
            disabled={disabled} 
            onClick={!disabled ? handleSignIn : undefined} 
            className={`flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
              disabled 
                ? "cursor-not-allowed bg-blue-300 text-white" 
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <img 
              src="https://img.icons8.com/?size=96&id=17949&format=png" 
              alt="Google" 
              className="h-5 w-5 bg-white rounded-full p-0.5"
            />
            {disabled ? "Initializing..." : "Sign in with Google"}
          </button>
          
          <p className="mt-6 text-center text-xs text-gray-400">
            Secure authentication powered by Google
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
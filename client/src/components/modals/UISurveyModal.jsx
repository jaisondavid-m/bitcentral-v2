import React, { useState, useEffect, useRef } from "react";
import { ThumbsUp, ThumbsDown, X, Send, Sparkles, AlertCircle, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import api from "@/api/axios.js";
import { useAuth } from "@/context/StudentContext.jsx";
import { haptics } from "@/utils/haptics.js";

const SURVEY_KEY = "ui_survey_feedback_done";
const USAGE_KEY = "ui_survey_usage_seconds";
const TWO_MINUTES_SECONDS = 120; // 2 minutes of active usage

export default function UISurveyModal() {
  const { user, profile, student } = useAuth();
  const [open, setOpen] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [previousSubmission, setPreviousSubmission] = useState(null);

  const [liked, setLiked] = useState(null); // 'yes' | 'no' | null
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Dismissal countdown state (for first-time survey closure)
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const countdownTimerRef = useRef(null);

  // 1. Two-minute passive usage tracker (NO network calls or polling during usage)
  useEffect(() => {
    // If already recorded as done in localStorage, do not track
    if (localStorage.getItem(SURVEY_KEY) === "true") {
      return;
    }

    const interval = setInterval(() => {
      // Check again in case it was completed in another tab
      if (localStorage.getItem(SURVEY_KEY) === "true") {
        clearInterval(interval);
        return;
      }

      const currentUsage = parseInt(localStorage.getItem(USAGE_KEY) || "0", 10);
      const nextUsage = currentUsage + 1;
      localStorage.setItem(USAGE_KEY, nextUsage.toString());

      if (nextUsage >= TWO_MINUTES_SECONDS) {
        clearInterval(interval);
        setOpen(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 2. While loading the modal, check the secure survey finished status endpoint
  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    setIsCheckingStatus(true);

    api
      .get("/survey/status")
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.success && res.data?.submitted) {
          setAlreadySubmitted(true);
          setPreviousSubmission(res.data);
          // Sync with local storage
          localStorage.setItem(SURVEY_KEY, "true");
        }
      })
      .catch((err) => {
        console.error("Survey status verification error:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingStatus(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [open]);

  // 3. Countdown timer when user attempts to close without submitting
  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => {
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
    };
  }, [isCountingDown, countdown]);

  const handleAttemptClose = () => {
    haptics.selection();
    if (!isCountingDown) {
      // First attempt: trigger the 3-second countdown
      setIsCountingDown(true);
      setCountdown(3);
      return;
    }

    // If countdown already completed (0s), allow closing
    if (countdown === 0) {
      localStorage.setItem(SURVEY_KEY, "true");
      setOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!liked) return;

    haptics.action();
    setIsSubmitting(true);
    setErrorMessage("");

    const userName =
      profile?.name ||
      student?.name ||
      user?.displayName ||
      (user?.email ? user.email.split("@")[0] : "Student");

    try {
      await api.post("/survey/feedback", {
        liked,
        feedback: feedback.trim(),
        user_name: userName,
      });

      setSubmitted(true);
      localStorage.setItem(SURVEY_KEY, "true");

      setTimeout(() => {
        setOpen(false);
      }, 1800);
    } catch (err) {
      console.error("Survey submission error:", err);
      setErrorMessage("Could not submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-900 bg-white p-6 shadow-[5px_5px_0px_#18181b] transition-all dark:border-white dark:bg-[#111827] dark:shadow-[5px_5px_0px_#ffffff]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        {!submitted && !isCheckingStatus && (
          <button
            type="button"
            onClick={alreadySubmitted ? () => setOpen(false) : handleAttemptClose}
            disabled={!alreadySubmitted && isCountingDown && countdown > 0}
            className={`absolute right-4 top-4 rounded-lg border border-zinc-900 bg-zinc-50 p-1.5 text-zinc-600 shadow-[1px_1px_0px_#18181b] hover:bg-zinc-100 hover:text-zinc-900 dark:border-white dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:text-white transition-all ${
              !alreadySubmitted && isCountingDown && countdown > 0 ? "cursor-not-allowed opacity-40" : "cursor-pointer"
            }`}
            aria-label="Close survey"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* 1. Loading State while checking the endpoint */}
        {isCheckingStatus ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-900 bg-blue-50 text-blue-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-blue-950/60 dark:text-blue-300 dark:shadow-[2px_2px_0px_#ffffff]">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
            <h4 className="text-sm font-black text-zinc-900 dark:text-white">Loading survey...</h4>
            <p className="mt-0.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">Verifying session status</p>
          </div>
        ) : submitted ? (
          /* 2. Newly Submitted Thank You State */
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-900 bg-emerald-100 text-emerald-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-emerald-950/60 dark:text-emerald-400 dark:shadow-[2px_2px_0px_#ffffff]">
              <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white">
              Thank You for Your Feedback!
            </h3>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              Your response has been securely recorded to help us improve BIT Central.
            </p>
          </div>
        ) : alreadySubmitted ? (
          /* 3. Already Submitted Screen (e.g. from other device or cleared localStorage) */
          <div className="py-2 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-900 bg-emerald-100 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-emerald-900 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-emerald-900/60 dark:text-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Survey Completed
            </div>

            <div className="mx-auto my-3.5 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-900 bg-emerald-100 text-emerald-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-emerald-950/60 dark:text-emerald-400 dark:shadow-[2px_2px_0px_#ffffff]">
              <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
            </div>

            <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
              Survey Already Submitted!
            </h3>
            <p className="mt-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 max-w-xs mx-auto">
              You have already shared feedback for this UI from your account. Thank you for helping us improve BIT Central!
            </p>

            {previousSubmission?.liked && (
              <div className="mt-3.5 inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <span>Your vote:</span>
                <span className="font-black text-zinc-900 dark:text-white">
                  {previousSubmission.liked === "yes" ? "👍 Liked it!" : "👎 Needs work"}
                </span>
              </div>
            )}

            {/* Below that: Submit another survey for new survey */}
            <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setOpen(false);
                }}
                className="rounded-xl border border-zinc-900 bg-white px-4 py-2.5 text-xs font-black text-zinc-700 shadow-[2px_2px_0px_#18181b] hover:bg-zinc-100 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setAlreadySubmitted(false);
                  setLiked(null);
                  setFeedback("");
                  setSubmitted(false);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Submit Another Survey</span>
              </button>
            </div>
          </div>
        ) : (
          /* 4. Normal Survey Form */
          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-900 bg-blue-100 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-blue-900 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-blue-900/60 dark:text-blue-100">
                <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-300" />
                Quick Survey
              </span>
            </div>

            {/* Question */}
            <h3 className="mt-3 text-lg sm:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
              Do you like this User Interface?
            </h3>
            <p className="mt-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
              We recently refreshed BIT Central. Tap below to let us know your impression!
            </p>

            {/* Yes / No Choice Buttons */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setLiked("yes");
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  liked === "yes"
                    ? "border border-zinc-900 bg-emerald-500 text-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:shadow-[3px_3px_0px_#ffffff]"
                    : "border border-zinc-900 bg-white text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:bg-emerald-50 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${liked === "yes" ? "stroke-[2.5]" : ""}`} />
                <span>Yes, like it!</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  haptics.selection();
                  setLiked("no");
                }}
                className={`flex items-center justify-center gap-2 rounded-xl py-3 px-3 text-xs sm:text-sm font-black transition-all cursor-pointer ${
                  liked === "no"
                    ? "border border-zinc-900 bg-rose-500 text-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:shadow-[3px_3px_0px_#ffffff]"
                    : "border border-zinc-900 bg-white text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:bg-rose-50 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <ThumbsDown className={`h-4 w-4 ${liked === "no" ? "stroke-[2.5]" : ""}`} />
                <span>No, needs work</span>
              </button>
            </div>

            {/* Optional Feedback Input */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Any comments or suggestions? <span className="font-normal text-zinc-400">(Optional)</span>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts, suggestions, or bugs..."
                rows={3}
                className="w-full rounded-xl border border-zinc-900 bg-zinc-50 p-3 text-xs font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] placeholder:text-zinc-400 focus:bg-white focus:outline-none dark:border-white dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-zinc-900 dark:shadow-[2px_2px_0px_#ffffff] caret-zinc-900 dark:caret-white resize-none"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 p-2.5 text-xs font-bold text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Countdown Notice when closing attempted */}
            {isCountingDown && (
              <div className="mt-3.5 rounded-xl border border-amber-500/80 bg-amber-50 p-3 text-xs font-bold text-amber-900 dark:border-amber-400/80 dark:bg-amber-950/50 dark:text-amber-200 shadow-[2px_2px_0px_#b45309] animate-in fade-in duration-150">
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none">💬</span>
                  <div className="flex-1">
                    <p className="font-black">User feedback is essential to develop our site!</p>
                    <p className="mt-0.5 text-[11px] opacity-90">
                      {countdown > 0
                        ? `Close button enabled in ${countdown}s...`
                        : "You can now close or submit your response."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={handleAttemptClose}
                disabled={isCountingDown && countdown > 0}
                className="rounded-xl border border-zinc-900 bg-white px-4 py-2.5 text-xs font-black text-zinc-700 shadow-[2px_2px_0px_#18181b] hover:bg-zinc-100 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 dark:border-white dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
              >
                {isCountingDown && countdown > 0 ? `Skip (${countdown}s)` : "Skip"}
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!liked || isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

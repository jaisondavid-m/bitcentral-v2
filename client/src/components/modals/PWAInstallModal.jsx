import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, PlusSquare, Download, Smartphone, Sparkles, CheckCircle2 } from "lucide-react";
import { haptics } from "@/utils/haptics.js";

const STORAGE_KEY = "bitcentral_pwa_install_last_shown";
const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true ||
    document.referrer.includes("android-app://")
  );
}

function getDeviceInfo() {
  if (typeof window === "undefined") return { isIOS: false, isAndroid: false, isMobile: false };
  const ua = window.navigator.userAgent || "";
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isMobile = isIOS || isAndroid || /Mobi|Tablet|Android/i.test(ua);
  return { isIOS, isAndroid, isMobile };
}

export default function PWAInstallModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [device, setDevice] = useState({ isIOS: false, isAndroid: false, isMobile: false });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone PWA mode
    if (isStandalone()) {
      return;
    }

    const devInfo = getDeviceInfo();
    setDevice(devInfo);

    // Listen for Android / Chrome browser install prompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setInstalled(true);
      setIsOpen(false);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 2. Check frequency (Only show weekly once)
    let lastShown = null;
    try {
      lastShown = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // Storage access blocked or restricted
    }

    if (lastShown) {
      const lastShownTime = Number(lastShown);
      if (!isNaN(lastShownTime) && Date.now() - lastShownTime < WEEK_IN_MS) {
        return () => {
          window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
          window.removeEventListener("appinstalled", handleAppInstalled);
        };
      }
    }

    // 3. Delay showing prompt by 4 seconds after page load for non-intrusive UX
    const timer = setTimeout(() => {
      // Record timestamp when shown
      try {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      } catch (e) {}

      setIsOpen(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleClose = () => {
    haptics.light();
    setIsOpen(false);
  };

  const handleAndroidInstall = async () => {
    haptics.action();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        setInstalled(true);
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      // If browser doesn't support deferred prompt or already triggered, guide user to browser menu
      alert("Tap your browser menu (⋮ or ⋯) and select 'Install App' or 'Add to Home Screen'.");
    }
  };

  if (!isOpen || installed || isStandalone()) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md cursor-pointer"
          aria-hidden="true"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-[390px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white z-10 my-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pwa-modal-title"
        >
          {/* Top Decorative Banner Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close install prompt"
          >
            <X className="h-4 w-4" />
          </button>

          {/* App Logo & Header Header */}
          <div className="text-center pt-2 space-y-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-700 to-indigo-700 shadow-xl shadow-blue-500/30 text-white border border-blue-400/30">
              <img
                src="/CardImgs/cropped_circle_image.png"
                alt="BIT Central"
                className="h-10 w-10 object-contain rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <Smartphone className="h-7 w-7 text-white hidden" />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
                <Sparkles className="h-3 w-3 fill-current text-blue-500" />
                BIT Central Web App
              </span>

              <h2
                id="pwa-modal-title"
                className="mt-1 text-lg font-black text-slate-900 dark:text-white"
              >
                {device.isIOS ? "Add to Home Screen" : "Install BIT Central App"}
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                {device.isIOS
                  ? "Install BIT Central on your iPhone for 1-tap fast access & full screen experience!"
                  : "Get the official BIT Central app on your device for fast access and smooth experience!"}
              </p>
            </div>
          </div>

          {/* Device-Specific Content */}
          <div className="mt-4 mb-3">
            {device.isIOS ? (
              /* iOS Instructions */
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 border-b border-slate-200/60 dark:border-slate-700/60 pb-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white">
                    iOS
                  </span>
                  <span>Safari / Chrome Instructions</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      1
                    </span>
                    <p className="leading-snug pt-0.5">
                      Tap the <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1 px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-[11px]"><Share className="h-3 w-3 text-blue-600 dark:text-blue-400" /> Share</strong> button in your browser bar.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      2
                    </span>
                    <p className="leading-snug pt-0.5">
                      Scroll down and tap <strong className="text-slate-900 dark:text-white inline-flex items-center gap-1 px-1 py-0.5 rounded bg-slate-200/70 dark:bg-slate-700 text-[11px]"><PlusSquare className="h-3 w-3 text-blue-600 dark:text-blue-400" /> Add to Home Screen</strong>.
                    </p>
                  </div>

                  <div className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold text-xs">
                      3
                    </span>
                    <p className="leading-snug pt-0.5">
                      Tap <strong className="text-blue-600 dark:text-blue-400">Add</strong> in the top right corner. Done! 🎉
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Android / Desktop Install Action */
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80 dark:bg-slate-800/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Fast 1-tap installation</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                    App installs directly onto your phone screen without downloading heavy files.
                  </p>
                </div>

                <button
                  onClick={handleAndroidInstall}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:from-blue-700 hover:to-indigo-800 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4 text-white" />
                  <span>Install App Now</span>
                </button>
              </div>
            )}
          </div>

          {/* Dismiss Actions */}
          <div className="text-center pt-1">
            <button
              onClick={handleClose}
              className="w-full py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Maybe later (Remind next week)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

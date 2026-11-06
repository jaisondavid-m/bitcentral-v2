import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function NetworkStatusToast() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [showToast, setShowToast] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowToast(true);
      // Automatically invalidate and refetch queries when network returns
      queryClient.invalidateQueries();
      const timer = setTimeout(() => setShowToast(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowToast(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queryClient]);

  if (!showToast && isOnline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none px-4 w-full max-w-sm"
        role="status"
        aria-live="polite"
      >
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-full shadow-lg border backdrop-blur-md text-sm font-medium ${
            isOnline
              ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-200"
              : "bg-amber-950/90 border-amber-500/30 text-amber-200"
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Back online. Syncing campus updates...</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
              <span>You are offline. Showing cached resources.</span>
            </>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


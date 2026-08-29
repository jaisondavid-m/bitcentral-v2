import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";

export default function FloatingHomeButton() {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Do not display if user is not logged in or is already on home page
  if (!user || location.pathname === "/home" || location.pathname === "/") {
    return null;
  }

  const handleClick = () => {
    navigate("/home");
  };

  return (
    <>
      {/* Desktop Hover Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="hidden sm:flex fixed bottom-6 right-[5.5rem] z-40 items-center gap-1.5 rounded-full bg-slate-900/90 text-white px-3.5 py-1.5 text-xs font-bold shadow-xl border border-slate-700/60 backdrop-blur-md whitespace-nowrap pointer-events-none"
          >
            <Home className="h-3.5 w-3.5 text-blue-400" />
            <span>Go to Home Page</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-xl shadow-blue-600/30 border border-blue-300/40 hover:shadow-blue-600/50 transition-all cursor-pointer group"
        aria-label="Go to Home Page"
      >
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute -inset-0.5 rounded-full bg-blue-500/30 animate-ping opacity-30 pointer-events-none" />

        {/* Home Icon */}
        <Home className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />
      </motion.button>
    </>
  );
}

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BiDonateHeart } from "react-icons/bi";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";

export default function FloatingSupportButton() {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  // Do not display if user is not logged in or is already on support-dev page
  if (!user || location.pathname === "/support-dev") {
    return null;
  }

  const handleClick = () => {
    navigate("/support-dev");
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
            className="hidden sm:flex fixed bottom-[6rem] right-[5.5rem] z-40 items-center gap-1.5 rounded-full bg-slate-900/90 text-white px-3.5 py-1.5 text-xs font-bold shadow-xl border border-slate-700/60 backdrop-blur-md whitespace-nowrap pointer-events-none"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span>Support BIT-CENTRAL</span>
            <span className="text-rose-400">❤️</span>
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
        className="fixed bottom-[5.75rem] right-6 z-40 flex items-center justify-center h-14 w-14 rounded-full text-white bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 shadow-xl shadow-rose-500/30 border border-rose-300/40 hover:shadow-rose-500/50 transition-all cursor-pointer group"
        aria-label="Support BIT-CENTRAL / Donate"
      >
        {/* Subtle Ambient Pulse Ring */}
        <span className="absolute -inset-0.5 rounded-full bg-rose-500/30 animate-ping opacity-40 pointer-events-none" />

        {/* Support Icon */}
        <BiDonateHeart className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-200" />

        {/* Small Gold Sparkle Badge Indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md">
          <Sparkles className="h-2.5 w-2.5 fill-slate-950" />
        </span>
      </motion.button>
    </>
  );
}

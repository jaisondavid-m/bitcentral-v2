import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-900 text-slate-300 dark:bg-slate-950 transition-colors duration-300 mt-auto">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-md">
              B
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base tracking-tight">BIT CENTRAL</h3>
              <p className="text-xs text-slate-400">Student Resource & Portal Guide for BIT Sathy</p>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-400">
            <Link to="/home" className="hover:text-white transition-colors">Home</Link>
            <Link to="/user-directory" className="hover:text-white transition-colors">User Directory</Link>
            <Link to="/semester" className="hover:text-white transition-colors">Question Bank</Link>
            <Link to="/leavedetails" className="hover:text-white transition-colors">Leave Logs</Link>
            <Link to="/mess" className="hover:text-white transition-colors">Mess Menu</Link>
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>

          {/* Contact Details */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
            <a href="mailto:developer@bitsathy.in" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>developer@bitsathy.in</span>
            </a>
            <span>•</span>
            <div className="flex items-center gap-1.5 font-mono">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 98437 77817</span>
            </div>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-slate-800/80 mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} BIT Central. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Bannari Amman Institute of Technology
          </p>
        </div>
      </div>
    </footer>
  );
}
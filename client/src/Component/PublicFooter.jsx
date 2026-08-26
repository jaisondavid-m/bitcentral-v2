import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Mail, Heart } from "lucide-react";
import { developerProfile } from "../content/publicContent.js";

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 font-bold text-slate-950 dark:text-white" aria-label="BIT Central home">
              <img src="/CardImgs/cropped_circle_image.png" alt="BIT Central logo" className="h-9 w-9 rounded-lg" width="36" height="36" />
              <span className="text-lg">BIT Central</span>
            </Link>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Student portal for Bannari Amman Institute of Technology. Academic resources, question banks, answer keys, mess menu updates, and campus tools in one place.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Developed by {developerProfile.name} for the BIT Sathy community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-950 dark:text-white">Navigation</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">About Portal</Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-blue-600 dark:hover:text-blue-400">Portal Features</Link>
              </li>
              <li>
                <Link to="/developer" className="hover:text-blue-600 dark:hover:text-blue-400">Developer Profile</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-600 dark:hover:text-blue-400">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/support-dev" className="inline-flex items-center gap-1.5 hover:text-rose-600 dark:hover:text-rose-400">
                  Support Dev <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-950 dark:text-white">Trust & Policies</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">Contact & Feedback</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-600 dark:hover:text-blue-400">Institutional Login</Link>
              </li>
            </ul>
          </div>

          {/* Institution Info */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-950 dark:text-white">Institution & Support</h3>
            <a
              href="https://www.bitsathy.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              <GraduationCap className="h-4 w-4 text-blue-600" aria-hidden="true" />
              BIT Sathy Official Site
            </a>
            <a
              href="mailto:developer@bitsathy.in"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
            >
              <Mail className="h-4 w-4 text-blue-600" aria-hidden="true" />
              developer@bitsathy.in
            </a>
            <p className="text-xs leading-5 text-slate-500 dark:text-slate-500">
              Disclaimer: BIT Central is a student-focused web portal for Bannari Amman Institute of Technology students. Institutional announcements remain the official authority.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-500">
          <p>© {new Date().getFullYear()} BIT Central. All rights reserved. Built for Bannari Amman Institute of Technology community.</p>
        </div>
      </div>
    </footer>
  );
}

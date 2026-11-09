import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-zinc-900 bg-blue-600 text-white transition-colors dark:border-white dark:bg-blue-950">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand stamp & copyright */}
          <div className="flex flex-col items-center gap-2 text-center md:items-start md:text-left">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md border border-zinc-900 bg-white px-2.5 py-0.5 text-xs font-black text-blue-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
                BIT-CENTRAL
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Official Student Hub
              </span>
            </div>
            <p className="text-xs font-semibold text-blue-100/90">
              © {new Date().getFullYear()} BIT Central. Built for the BIT Sathy community.
            </p>
          </div>

          {/* Useful links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
            <Link
              to="/privacy-policy"
              className="text-white hover:text-blue-100 hover:underline underline-offset-4 decoration-2 decoration-white transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-blue-300" aria-hidden="true">•</span>
            <Link
              to="/terms"
              className="text-white hover:text-blue-100 hover:underline underline-offset-4 decoration-2 decoration-white transition-colors"
            >
              Terms of Service
            </Link>
            <span className="text-blue-300" aria-hidden="true">•</span>
            <Link
              to="/about"
              className="text-white hover:text-blue-100 hover:underline underline-offset-4 decoration-2 decoration-white transition-colors"
            >
              About
            </Link>
            <span className="text-blue-300" aria-hidden="true">•</span>
            <Link
              to="/guides"
              className="text-white hover:text-blue-100 hover:underline underline-offset-4 decoration-2 decoration-white transition-colors"
            >
              Guides
            </Link>
          </div>

          {/* Contact tags */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="mailto:developer@bitsathy.in"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#18181b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-white dark:bg-zinc-900 dark:text-white dark:shadow-[2px_2px_0px_#ffffff] transition-all"
            >
              <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              developer@bitsathy.in
            </a>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-900 dark:text-white dark:shadow-[2px_2px_0px_#ffffff]">
              <Phone className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              +91 98437 77817
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

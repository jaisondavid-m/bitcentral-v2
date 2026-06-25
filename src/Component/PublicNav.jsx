import React from "react";
import { Link, NavLink } from "react-router-dom";
import { LogIn } from "lucide-react";
import { publicLinks } from "../content/publicContent.js";

export default function PublicNav() {
  return (
    <header className="border-b border-slate-200 bg-white/95 text-slate-900 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 dark:text-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8" aria-label="Public navigation">
        <Link to="/" className="flex items-center gap-3 font-bold" aria-label="BIT Central public home">
          <img src="/CardImgs/cropped_circle_image.png" alt="BIT Central logo" className="h-10 w-10 rounded-lg" width="40" height="40" />
          <span>BIT Central</span>
        </Link>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {publicLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950"
          >
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
}

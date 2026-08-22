import React, { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { auth, logout } from "../Authentication/firebase.js";
import {
  LogOut,
  Moon,
  Sun,
  X,
  ChevronDown,
  User,
  Users,
  Home,
  BookOpen,
  Calendar,
  Utensils,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Compass,
  FileCheck2,
  Layers,
  Menu
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Navbar() {
  const [user] = useAuthState(auth);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // Close mobile drawer and dropdowns automatically on route navigation
  useEffect(() => {
    setIsMobileOpen(false);
    setIsToolsOpen(false);
  }, [location.pathname]);

  // Click outside listener for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAdmin = useMemo(() => {
    const adminUID = import.meta.env.VITE_ADMIN_FIREBASE_UID?.trim();
    return Boolean(adminUID && user?.uid === adminUID);
  }, [user?.uid]);

  const academicTools = [
    { to: "/user-directory", label: "User Directory", icon: Users, desc: "Search BIT Sathy students & staff" },
    { to: "/semester", label: "Question Bank & Resources", icon: BookOpen, desc: "Access course materials & QB" },
    { to: "/exam-hall", label: "Exam Hall Seating", icon: GraduationCap, desc: "Find seating arrangements" },
    { to: "/leavedetails", label: "Leave & Gate Pass", icon: Calendar, desc: "Track leave approvals & logs" },
    { to: "/mess", label: "Mess Menu", icon: Utensils, desc: "Daily dining menu updates" },
    { to: "/pcdp", label: "PCDP Portal", icon: Layers, desc: "Placement & career development" },
    { to: "/apsite", label: "AP Site", icon: FileCheck2, desc: "Academic performance resources" },
    { to: "/findmyway", label: "Campus Map & Navigation", icon: Compass, desc: "Locate blocks & venues" },
  ];

  const isActive = (path) => {
    if (path === "/home") return location.pathname === "/home";
    if (path === "/admin") return location.pathname.startsWith("/admin");
    return location.pathname.startsWith(path);
  };

  const isToolsActive = useMemo(() => {
    return academicTools.some((tool) => location.pathname.startsWith(tool.to));
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const userInitial = (user?.displayName || user?.email || "S").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 left-0 right-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* Left Brand Logo */}
          <Link
            to="/home"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="Go to Home Page"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all duration-200">
              B
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  BIT CENTRAL
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60">
                  v3
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase -mt-0.5">
                Student Portal
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/home"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/home")
                  ? "bg-slate-100 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/user-directory"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/user-directory") || location.pathname.startsWith("/student-report")
                  ? "bg-slate-100 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Directory</span>
            </Link>

            {/* Academic Tools Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isToolsActive || isToolsOpen
                    ? "bg-slate-100 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Academic Services</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {isToolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-100 dark:border-slate-800/80 mb-1">
                      BIT Student Portals & Tools
                    </div>
                    <div className="space-y-0.5 max-h-[380px] overflow-y-auto no-scrollbar">
                      {academicTools.map((tool) => {
                        const Icon = tool.icon;
                        const isToolSelected = location.pathname.startsWith(tool.to);
                        return (
                          <Link
                            key={tool.to}
                            to={tool.to}
                            onClick={() => setIsToolsOpen(false)}
                            className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                              isToolSelected
                                ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <div className={`p-2 rounded-lg shrink-0 ${isToolSelected ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="font-bold text-xs block truncate">{tool.label}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">{tool.desc}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/about"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive("/about")
                  ? "bg-slate-100 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>About</span>
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive("/admin")
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2 text-xs font-bold"
              aria-label="Toggle dark/light theme"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
              <span className="hidden sm:inline font-semibold">{theme === "dark" ? "Light" : "Dark"}</span>
            </button>

            {/* User Profile Button */}
            <Link
              to="/profile"
              className={`flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all ${
                isActive("/profile")
                  ? "bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                  : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
              title="View Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                {userInitial}
              </div>
              <span className="hidden md:inline font-bold text-xs truncate max-w-[120px]">
                {user?.displayName || "My Profile"}
              </span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200/60 dark:border-red-800/60 text-xs font-bold transition-all flex items-center justify-center shrink-0"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 lg:hidden hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle mobile menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 lg:hidden flex flex-col justify-between"
            >
              <div className="p-5 space-y-6 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      B
                    </div>
                    <span className="font-extrabold text-slate-900 dark:text-white text-base">BIT CENTRAL</span>
                  </div>
                  <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Primary Nav Links */}
                <div className="space-y-1">
                  <Link
                    to="/home"
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive("/home")
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Home className="w-4 h-4" />
                    <span>Home Page</span>
                  </Link>

                  <Link
                    to="/user-directory"
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive("/user-directory") || location.pathname.startsWith("/student-report")
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>User Directory</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive("/profile")
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/about"
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                      isActive("/about")
                        ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>About BIT Central</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                </div>

                {/* Academic Tools Subcategory */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="px-4 py-2 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Academic Portals & Services
                  </div>
                  <div className="space-y-1 mt-1">
                    {academicTools.map((tool) => {
                      const Icon = tool.icon;
                      const isSel = location.pathname.startsWith(tool.to);
                      return (
                        <Link
                          key={tool.to}
                          to={tool.to}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            isSel
                              ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                          <span className="truncate">{tool.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50 dark:bg-slate-900/50">
                <button
                  onClick={toggleTheme}
                  className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{theme}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Account</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
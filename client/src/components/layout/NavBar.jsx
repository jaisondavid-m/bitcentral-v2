import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/config/auth.js";
import { LogOut, Menu, Moon, Star, Sun, X } from "lucide-react";
import { useAuth } from "@/context/StudentContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";
import NotificationBell from "@/components/notifications/NotificationBell.jsx";
import LogoutConfirmModal from "@/components/modals/LogoutConfirmModal.jsx";
import { haptics } from "@/utils/haptics.js";

function Navbar() {
  const { user, profile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isAdmin = useMemo(() => {
    const role = (user?.role || profile?.role || "").toLowerCase().trim();
    return Boolean(
      role === "admin" ||
      role === "superadmin" ||
      role === "super_admin" ||
      user?.isAdmin === true
    );
  }, [user, profile]);

  const navItems = [
    { to: "/home", label: "Home" },
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
    { to: "/profile", label: "My Profile" },
    { to: "/about", label: "About" }
  ];

  const isActiveNavItem = (item) => {
    if (item.to === "/admin") return location.pathname.startsWith("/admin");
    return location.pathname === item.to;
  };

  const handleOpenLogout = () => {
    haptics.selection();
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      setIsOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleToggleTheme = () => {
    haptics.selection();
    toggleTheme();
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 z-40 bg-blue-600 dark:bg-blue-950 border-b border-zinc-900 dark:border-white transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
          <div className="flex h-16 items-center justify-between">
            {/* Brand on Left */}
            <Link
              to="/home"
              className="group flex items-center gap-2.5 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 shrink-0"
              aria-label="BIT Central home"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-white text-blue-600 shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all">
                <Star className="h-4.5 w-4.5 fill-current text-blue-600" />
              </span>
              <span className="text-lg md:text-xl font-black tracking-tight text-white">
                BIT-CENTRAL
              </span>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-2">
              {navItems.map((item) => {
                const active = isActiveNavItem(item);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`inline-flex items-center justify-center h-9 px-4 rounded-lg text-xs font-bold transition-all ${
                      active
                        ? "bg-white text-blue-700 border border-zinc-900 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-white dark:text-blue-900 dark:shadow-[2px_2px_0px_#ffffff]"
                        : "text-white border border-transparent hover:border-zinc-900 hover:bg-white/20 hover:text-white hover:shadow-[2px_2px_0px_#18181b] dark:hover:border-white dark:hover:bg-white/15 dark:hover:shadow-[2px_2px_0px_#ffffff]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Utility actions on Right */}
            <div className="hidden lg:flex items-center gap-2">
              <NotificationBell />

              <button
                onClick={handleToggleTheme}
                className="inline-flex items-center justify-center h-9 px-3 rounded-lg text-xs font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-900 border border-zinc-900 dark:border-white shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-transform gap-1.5 cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-3.5 w-3.5 text-amber-400" /> : <Moon className="h-3.5 w-3.5 text-blue-600" />}
                <span>{theme === "dark" ? "Light" : "Dark"}</span>
              </button>

              <button
                onClick={handleOpenLogout}
                className="inline-flex items-center justify-center h-9 px-3 rounded-lg text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 border border-zinc-900 dark:border-white shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#ffffff] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all gap-1.5 cursor-pointer"
                aria-label="Logout"
                title="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <NotificationBell />
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
                className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-zinc-900 bg-white text-blue-600 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-900 dark:text-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
              >
                {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 flex w-76 max-w-[85vw] flex-col border-l border-zinc-900 bg-white shadow-[-4px_0px_0px_#18181b] dark:border-white dark:bg-[#090d16] dark:shadow-[-4px_0px_0px_#ffffff] lg:hidden"
            >
              <div className="relative flex flex-col h-full justify-between">
                <div>
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between border-b border-zinc-900 bg-blue-600 px-5 py-4 text-white dark:border-white dark:bg-blue-950">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-900 bg-white text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                        <Star className="h-3.5 w-3.5 fill-current text-blue-600" />
                      </span>
                      <h2 className="text-sm font-black uppercase tracking-wider text-white">
                        Menu
                      </h2>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-white text-zinc-900 shadow-[2px_2px_0px_#18181b] hover:bg-rose-50 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-colors cursor-pointer"
                      aria-label="Close menu"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Drawer Navigation */}
                  <nav className="px-5 py-5">
                    <ul className="space-y-2.5">
                      <li>
                        <button
                          onClick={toggleTheme}
                          className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-900 bg-zinc-50 px-3.5 py-2.5 text-xs font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] hover:bg-blue-50 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all"
                        >
                          <span className="inline-flex items-center gap-2">
                            {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-600" />}
                            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
                          </span>
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase">Theme</span>
                        </button>
                      </li>

                      {navItems.map((item) => {
                        const active = isActiveNavItem(item);
                        return (
                          <li key={item.to}>
                            <Link
                              to={item.to}
                              onClick={() => setIsOpen(false)}
                              className={`block rounded-lg px-3.5 py-2.5 text-sm font-bold transition-all ${
                                active
                                  ? "border border-zinc-900 bg-blue-600 text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]"
                                  : "border border-transparent text-zinc-800 hover:border-zinc-900 hover:bg-blue-50 hover:shadow-[2px_2px_0px_#18181b] dark:text-zinc-200 dark:hover:border-white dark:hover:bg-zinc-800 dark:hover:shadow-[2px_2px_0px_#ffffff]"
                              }`}
                            >
                              {item.label}
                            </Link>
                          </li>
                        );
                      })}

                      <li className="pt-2">
                        <button
                          onClick={handleOpenLogout}
                          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-900 bg-rose-600 px-3.5 py-2.5 text-sm font-bold text-white shadow-[2px_2px_0px_#18181b] hover:bg-rose-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>

                {/* Drawer Footer */}
                <div className="border-t border-zinc-200 bg-zinc-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
                  <div className="text-center text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                    BIT-CENTRAL © {new Date().getFullYear()}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LogoutConfirmModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
    </>
  );
}

export default Navbar;

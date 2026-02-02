import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Hamburger from "hamburger-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../Authentication/firebase.js";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { to: "/home", label: "Home" },
    { to: "/rpsite", label: "RP Site" },
    { to: "/profile", label: "My Profile" },
    { to: "/about", label: "About" }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-40">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 opacity-90">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,180,255,0.3),transparent)] animate-pulse"></div>
          </div>
          
          <div className="absolute inset-0 backdrop-blur-md bg-white/10 border-b border-white/20"></div>
          
          <div className="relative max-w-7xl mx-auto">
            <div className="flex items-center justify-between px-4 py-3 md:px-6 lg:px-8">
              <div className="flex items-center gap-2 md:gap-3">
                <svg className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">BIT-CENTRAL</h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:block">
                <ul className="flex items-center gap-6">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <Link to={item.to} className={`text-sm font-medium transition-all duration-300 ${location.pathname === item.to ? "text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30" : "text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full"}`}>
                        {item.label}
                      </Link>
                    </li>
                  ))}

                  {/* Desktop Logout Button */}
                  <li>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-white/90 hover:text-white hover:bg-red-500/20 px-4 py-2 rounded-full border border-white/20 hover:border-red-400/40 transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                      </svg>
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Hamburger toggled={isOpen} toggle={setIsOpen} color="#ffffff" size={20}/>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 lg:hidden"
            >
              <div className="relative h-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,180,255,0.4),transparent)]"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(60,140,255,0.3),transparent)]"></div>
                </div>
                
                <div className="absolute inset-0 backdrop-blur-xl bg-white/10 border-l border-white/20"></div>
                
                <div className="relative flex flex-col h-full">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
                    <h2 className="text-lg font-semibold text-white drop-shadow-lg">Menu</h2>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex-1 px-6 py-6">
                    <ul className="space-y-3">
                      {navItems.map((item) => (
                        <li key={item.to}>
                          <Link to={item.to} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${ location.pathname === item.to ? "bg-white/25 backdrop-blur-md text-white border border-white/30 shadow-lg" : "text-white/90 hover:bg-white/15 hover:text-white border border-transparent" }`}>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                      
                      {/* Mobile Logout Button */}
                      <li className="pt-3">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white hover:text-white bg-blue-500/20 hover:bg-red-500/30 border border-white hover:border-white transition-all duration-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                          </svg>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </nav>

                  <div className="px-6 py-4 border-t border-white/20">
                    <div className="text-xs text-white/60 text-center">BIT-CENTRAL © 2026</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
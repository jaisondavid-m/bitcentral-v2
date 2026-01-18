import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Hamburger from "hamburger-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/home", label: "Home" },
    { to: "/rpsite", label: "RP Site" },
    { to: "/profile", label: "My Profile" },
    { to: "/about", label: "About" }
  ];

  const activeIndex = navItems.findIndex(item => location.pathname === item.to);

  return (
    <>
      <div className="sticky top-0 left-0 right-0 z-40">
        <div>
          <div className="relative overflow-hidden backdrop-blur-xl bg-blue-600/90 shadow-2xl border border-white/20">
            <div className="relative flex items-center justify-between px-4 py-3 md:px-8 md:py-4 lg:px-12 lg:py-5">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-white drop-shadow-lg">
                BIT-CENTRAL
              </h1>
              
              <div className="hidden lg:flex">
                <div className="relative bg-white/10 backdrop-blur-md rounded-full p-1.5 border border-white/20">
                  {activeIndex !== -1 && (
                    <motion.div
                      className="absolute inset-y-1.5 bg-white/30 backdrop-blur-lg rounded-full border border-white/40"
                      initial={false}
                      animate={{
                        left: `${activeIndex * 25}%`,
                        width: `${100 / navItems.length}%`
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                        mass: 0.8
                      }}
                      style={{ paddingLeft: '6px', paddingRight: '6px' }}
                    />
                  )}
                  <ul className="relative flex gap-2">
                    {navItems.map((item, index) => (
                      <NavLink 
                        key={item.to} 
                        to={item.to} 
                        isActive={location.pathname === item.to}
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:hidden relative">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
                  <Hamburger toggled={isOpen} toggle={setIsOpen} color="white" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              key="mobile-menu"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                mass: 0.8
              }}
              className="fixed inset-x-0 bottom-0 z-50 pb-safe"
            >
              <div className="mx-2 mb-2">
                <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl bg-blue-600/95 shadow-2xl border border-white/20">
                  <div className="flex justify-center pt-3 pb-2">
                    <div className="w-10 h-1 bg-white/30 rounded-full"></div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20 hover:bg-white/20 transition-colors"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="px-6 pt-8 pb-8 space-y-3">
                    <MobileNavLink to="/home" onClick={() => setIsOpen(false)} delay={0.1} isActive={location.pathname === "/home"}>
                      <HomeIcon />
                      Home
                    </MobileNavLink>
                    <MobileNavLink to="/rpsite" onClick={() => setIsOpen(false)} delay={0.15} isActive={location.pathname === "/rpsite"}>
                      <SiteIcon />
                      RP Site
                    </MobileNavLink>
                    <MobileNavLink to="/profile" onClick={() => setIsOpen(false)} delay={0.2} isActive={location.pathname === "/profile"}>
                      <ProfileIcon />
                      My Profile
                    </MobileNavLink>
                    <MobileNavLink to="/about" onClick={() => setIsOpen(false)} delay={0.25} isActive={location.pathname === "/about"}>
                      <AboutIcon />
                      About
                    </MobileNavLink>
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

function NavLink({ to, children, isActive }) {
  return (
    <li className="list-none relative z-10">
      <Link
        to={to}
        className={`block px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
          isActive ? 'text-white' : 'text-white'
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

function MobileNavLink({ to, children, onClick, delay, isActive }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-4 px-5 py-4 text-lg font-semibold backdrop-blur-md rounded-2xl border transition-all duration-300 active:scale-95 ${
          isActive 
            ? 'text-white bg-white/25 border-white/30' 
            : 'text-white/80 bg-white/10 border-white/20 hover:bg-white/20 active:bg-white/30'
        }`}
      >
        {children}
      </Link>
    </motion.div>
  );
}

function HomeIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function SiteIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function AboutIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default Navbar;
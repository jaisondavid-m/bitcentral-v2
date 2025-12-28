// Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Hamburger from "hamburger-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Navbar */}
      <div className="sticky top-0 items-center flex justify-between w-screen py-2 px-5 md:p-10 lg:h-20 lg:px-36 lg:py-5 bg-blue-600 text-white shadow-lg z-40">
        <h1 className="text-2xl justify-center items-center lg:text-4xl font-bold">BIT-CENTRAL</h1>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-8 font-bold text-xl">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/rpsite">RP Site</Link></li>
          <li><Link to="/profile">My Profile</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>

        {/* Mobile Hamburger */}
        <div className="lg:hidden">
          <Hamburger toggled={isOpen} toggle={setIsOpen} color="white" />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed inset-0 bg-blue-700 text-white flex flex-col items-center py-20 z-50"
          >
            <div className="absolute top-5 right-5">
              <Hamburger toggled={isOpen} toggle={setIsOpen} color="white" />
            </div>

            <div className="flex flex-col items-center gap-8 mt-10 text-3xl font-bold">
              <Link className="underline" to="/home" onClick={() => setIsOpen(false)}>Home</Link>
              <Link className="underline" to="/rpsite" onClick={() => setIsOpen(false)}>RP Site</Link>
              <Link className="underline" to="/profile" onClick={() => setIsOpen(false)}>My Profile</Link>
              <Link className="underline" to="/about" onClick={() => setIsOpen(false)}>About</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;

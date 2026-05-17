import React from "react";
import { Link } from "react-router-dom";
import { HashLink as HashLink } from 'react-router-hash-link';

export default function Footer(){
  return (
    <footer className="border-t border-white bg-blue-600 dark:border-blue-900 dark:bg-black">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          
          <p className="text-sm text-white">© {new Date().getFullYear()} BIT CENTRAL . All rights reserved.</p>
          
          <div className="flex gap-6 text-sm text-white">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:developer@bitsathy.in" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="text-xs text-blue-100 sm:text-right">
            <p>developer@bitsathy.in</p>
            <p>+91 98437 77817</p>
          </div>
          
        </div>
      </div>
    </footer>
  );
};
import React from "react";
import { HashLink as Link } from 'react-router-hash-link';

export default function Footer(){
  return (
    <footer className="border-t border-white bg-blue-600">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
          
          <p className="text-sm text-white">
            © {new Date().getFullYear()} BIT CENTRAL . All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm text-white">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <Link to="/about#contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          
        </div>
      </div>
    </footer>
  );
};
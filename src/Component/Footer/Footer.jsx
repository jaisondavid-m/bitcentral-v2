import React from "react";
import { HashLink as Link } from 'react-router-hash-link';

export default function Footer(){
  return (
    <footer className="bg-blue-700 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        

        <p className="text-sm">
          © {new Date().getFullYear()} BIT CENTRAL . All rights reserved.
        </p>
        
        <div className="flex gap-6 text-sm">
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <Link to="/about#contact" className="hover:text-white transition">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

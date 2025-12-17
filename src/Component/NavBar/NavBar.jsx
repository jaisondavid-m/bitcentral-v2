// Navbar.jsx
import React, { useState } from "react";
import { Await, Link,useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const Navigate=useNavigate();

 

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          <h1 className="text-2xl font-bold">BIT-CENTRAL</h1>

          <ul className="hidden md:flex space-x-6">
            <li><Link to="/home" className="hover:text-gray-200">Home</Link></li>
            <li><Link to="/rpsite" className="hover:text-gray-200">RP SITE</Link></li>
            <li><Link to="/about" className="hover:text-gray-200">About</Link></li>
          </ul>

          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            {open?"X":"☰"}
          </button>
        </div>
        {open && (
          <ul className="md:hidden flex flex-col space-y-2 pb-3">
            <li><Link to="/home" className="block hover:bg-blue-700 p-2 rounded" onClick={() => setOpen(!open)}>Home</Link></li>
            <li><Link to="/rpsite" className="block hover:bg-blue-700 p-2 rounded" onClick={() => setOpen(!open)}>RP SITE</Link></li>
            <li><Link to="/about" className="block hover:bg-blue-700 p-2 rounded" onClick={() => setOpen(!open)}>About</Link></li>
          </ul>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
import { Outlet } from "react-router-dom";
import Navbar from "../Component/NavBar.jsx";
import Footer from "../Component/Footer.jsx";

function ProtectedLayout() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-blue-600 focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white shadow-xl"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" role="main" className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ProtectedLayout;

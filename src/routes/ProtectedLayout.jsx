import { Outlet } from "react-router-dom";
import Navbar from "../Component/NavBar.jsx";
import Footer from "../Component/Footer.jsx";

function ProtectedLayout() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-blue-700"
      >
        Skip to main content
      </a>
      <Navbar />
      <div id="main-content" role="main">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default ProtectedLayout;

import { Outlet } from "react-router-dom";
import Navbar from "../Component/NavBar.jsx";
import Footer from "../Component/Footer.jsx";

function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default ProtectedLayout;

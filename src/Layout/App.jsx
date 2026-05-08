import React , { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Login from "../Pages/Login.jsx";
import Dashboard from "../Pages/Dashboard.jsx";
import AdminDashboard from "../Pages/AdminDashboard.jsx";
import Home from "../Pages/Home.jsx";
import About from "../Pages/About.jsx";
import Rpsite from "../Pages/Rpsite.jsx";
import Semester from "../Pages/Semester.jsx";
import MessMenu from "../Pages/MessMenu.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import ProtectedLayout from "../routes/ProtectedLayout.jsx";
import PCDP from "../Pages/PCDP.jsx";
import NotFound from "../Pages/NotFound.jsx";
import LeaveDetails from "../Pages/LeaveDetails.jsx";
import ExamHall from "../Pages/ExamHall.jsx";
import S2 from "../Pages/S2.jsx";

function App() {
  const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE;
  useEffect(() => {
    // Disable right click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
      }

      // Ctrl+Shift+I/J/C
      if (
        e.ctrlKey &&
        e.shiftKey &&
        ["I", "J", "C"].includes(e.key)
      ) {
        e.preventDefault();
      }

      // Ctrl+U (view source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path={`/${ADMIN_ROUTE}`} element={<AdminDashboard />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/rpsite" element={<Rpsite />} />
          <Route path="/pcdp" element={<PCDP />} />
          <Route path="/exam-hall" element={<ExamHall />} />
          {/* <Route path="/apsite" element={<Apsite />} /> */}
          <Route path="/leavedetails" element={<LeaveDetails />} />
          <Route path="/semester" element={<S2 />} />
          <Route path="/mess" element={<MessMenu />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </>
  );
}

export default App;
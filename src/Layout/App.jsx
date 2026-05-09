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
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();

    // F12
    if (key === "f12") {
      e.preventDefault();
      return false;
    }

    // Ctrl + Shift + I/J/C
    if (
      e.ctrlKey &&
      e.shiftKey &&
      ["i", "j", "c"].includes(key)
    ) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl + U
    if (e.ctrlKey && key === "u") {
      e.preventDefault();
      return false;
    }

    // Ctrl + S
    if (e.ctrlKey && key === "s") {
      e.preventDefault();
      return false;
    }
  };

  document.addEventListener("contextmenu", handleContextMenu);
  window.addEventListener("keydown", handleKeyDown, true);

  return () => {
    document.removeEventListener("contextmenu", handleContextMenu);
    window.removeEventListener("keydown", handleKeyDown, true);
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
import React, { useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Login from "../Pages/Login.jsx";
import Dashboard from "../Pages/Dashboard.jsx";
import AdminDashboard, { AdminQBPage, AdminUsersPage } from "../Pages/AdminDashboard.jsx";
import Home from "../Pages/Home.jsx";
import About from "../Pages/About.jsx";
import PrivacyPolicy from "../Pages/PrivacyPolicy.jsx";
import Terms from "../Pages/Terms.jsx";
import Rpsite from "../Pages/Rpsite.jsx";
import Semester from "../Pages/Semester.jsx";
import MessMenu from "../Pages/MessMenu.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import AdminRoute from "../routes/AdminRoute.jsx";
import ProtectedLayout from "../routes/ProtectedLayout.jsx";
import PCDP from "../Pages/PCDP.jsx";
import NotFound from "../Pages/NotFound.jsx";
import LeaveDetails from "../Pages/LeaveDetails.jsx";
import ExamHall from "../Pages/ExamHall.jsx";
import S2 from "../Pages/S2.jsx";
import FullScreenLoader from "../Component/FullScreenLoader.jsx";
import { useAuth } from "../context/StudentContext.jsx";

function App() {
  const { loading } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = (e.key || "").toLowerCase();

      // Block F12
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Block Ctrl/Cmd + Shift + [I/J/C/K]
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === "i" || key === "j" || key === "c" || key === "k")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Block Ctrl/Cmd + U (view source) and Ctrl/Cmd + S (save)
      if ((e.ctrlKey || e.metaKey) && (key === "u" || key === "s")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleContext = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Best-effort devtools detection by measuring window sizes
    const checkDevTools = () => {
      try {
        const threshold = 160; // heuristic
        const widthDiff = window.outerWidth - window.innerWidth;
        const heightDiff = window.outerHeight - window.innerHeight;
        if (widthDiff > threshold || heightDiff > threshold) {
          // Notify user (do not force-close tab)
          // eslint-disable-next-line no-alert
          alert("Developer tools detected. Please close it to continue.");
        }
      } catch (err) {
        // ignore
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("contextmenu", handleContext, true);
    window.addEventListener("resize", checkDevTools);
    const intervalId = setInterval(checkDevTools, 1500);

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("contextmenu", handleContext, true);
      window.removeEventListener("resize", checkDevTools);
      clearInterval(intervalId);
    };
  }, []);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
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
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/qb"
            element={
              <AdminRoute>
                <AdminQBPage />
              </AdminRoute>
            }
          />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/rpsite" element={<Rpsite />} />
          <Route path="/pcdp" element={<PCDP />} />
          <Route path="/exam-hall" element={<ExamHall />} />
          {/* <Route path="/apsite" element={<Apsite />} /> */}
          <Route path="/leavedetails" element={<LeaveDetails />} />
          <Route path="/semester" element={<Semester />} />
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
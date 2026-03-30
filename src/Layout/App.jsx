import { Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Login from "../Pages/Login.jsx";
import Dashboard from "../Pages/Dashboard.jsx";
import AdminDashboard from "../Pages/AdminDashboard.jsx";
import Home from "../Pages/Home.jsx";
import About from "../Pages/About.jsx";
import Rpsite from "../Pages/Rpsite.jsx";
import Semester from "../Pages/Semester.jsx";
import MessMenu from "../Pages/Mess.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import ProtectedLayout from "../routes/ProtectedLayout.jsx";
import NotFound from "../Pages/NotFound.jsx";
import Apsite from "../Pages/Apsite.jsx";

function App() {
  const ADMIN_ROUTE = import.meta.env.VITE_ADMIN_ROUTE;
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
          <Route path="/apsite" element={<Apsite />} />
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
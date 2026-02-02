import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "../Authentication/firebase.js";
import Login from "../Pages/Login.jsx";
import Dashboard from "../Pages/Dashboard.jsx";
import Home from "../Pages/Home.jsx";
import About from "../Pages/About.jsx";
import Rpsite from "../Pages/Rpsite.jsx";
import Semester from "../Pages/Semester.jsx";
import MessMenu from "../Pages/Mess.jsx";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";
import ProtectedLayout from "../routes/ProtectedLayout.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setUser);
    return unsub;
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
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/rpsite" element={<Rpsite />} />
        <Route path="/semester" element={<Semester />} />
        <Route path="/mess" element={<MessMenu />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;

import React from "react";
import { logout } from "../../Authentication/firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Authentication/firebase.js";
import profile from "/CardImgs/profile.jpg?url";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const [user] = useAuthState(auth);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        
        {/* Header */}
        <div className="text-center mb-6">
          <img
            src={user.photoURL || profile}
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full border"
          />
          <h1 className="mt-4 text-2xl font-semibold text-gray-800">
            {user.displayName}
          </h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Email Verified</span>
            <span>{user.emailVerified ? "Yes ✅" : "No ❌"}</span>
          </div>

          <div className="flex justify-between">
            <span>First Login</span>
            <span>
              {new Date(Number(user.metadata.createdAt)).toLocaleDateString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Last Login</span>
            <span>
              {new Date(Number(user.metadata.lastLoginAt)).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-6 w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

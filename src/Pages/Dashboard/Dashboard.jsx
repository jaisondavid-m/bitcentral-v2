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
    <div className="mt-10 lg:mt-20 md:mt-16  bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-blue-700 bg-white rounded-xl shadow-md p-6">
        
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
              {new Date(Number(user.metadata.createdAt)).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                })}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Last Login</span>
            <span>
              {new Date(Number(user.metadata.lastLoginAt)).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                })}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="mt-6 w-full py-2 rounded-lg border border-blue-700 text-gray-700 hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

import React, { useState } from "react";
import { logout } from "../Authentication/firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";
import profile from "/CardImgs/profile.jpg?url";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  
  const departmentMap = {
    cs: "Computer Science and Engineering",
    ad: "Artificial Intelligence & Data Science",
    al: "Artificial Intelligence & Machine Learning",
    ec: "Electronics and Communication Engineering",
    ee: "Electrical and Electronics Engineering",
    ct: "Computer Technology",
    bt: "Biotechnology",
    cb: "Computer Science and Business Systems",
    mz: "Mechatronics",
    it: "Information Technology",
  };

  // Decode college email
  const decodeCollegeEmail = (email) => {
    if (user && !user.email?.endsWith("@bitsathy.ac.in")) {
    alert("Please login using your BITSATHY college email.");
    logout();
  }
    const usernamePart = email.split("@")[0];
    const parts = usernamePart.split(".");
    if (parts.length < 2) return null;
    const deptYear = parts[1];
    const deptCode = deptYear.slice(0, 2);
    const yearCode = deptYear.slice(2);
    const department = departmentMap[deptCode] || "Unknown Department";
    const startYear = 2000 + Number(yearCode);
    const endYear = startYear + 4;
    localStorage.setItem("batchYear", yearCode-24);
    return {
      department,
      batch: `${startYear} - ${endYear}`,
    };
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isBitsathyEmail = user.email?.endsWith("@bitsathy.ac.in");
  const decodedInfo = decodeCollegeEmail(user.email);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        
        {/* Profile Card */}
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="bg-blue-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={user.photoURL || profile}
                  alt="Profile"
                  className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md sm:h-24 sm:w-24"
                />
                {user.emailVerified && (
                  <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 shadow-md ring-4 ring-white">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">
                  {user.displayName || "User"}
                </h1>
                <p className="break-all text-sm text-white/90 sm:text-base">
                  {user.email}
                </p>
              </div>
              
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {!isBitsathyEmail && (
          <div className="mb-6 overflow-hidden rounded-lg border border-yellow-200 bg-yellow-50">
            <div className="flex items-start gap-3 px-5 py-4 sm:items-center sm:gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="flex-1 text-sm font-medium text-yellow-800 sm:text-base">
                Please use your BITSATHY college email for a better experience.
              </p>
            </div>
          </div>
        )}

        {/* Info Cards Grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">

          {/* Department Card */}
          {decodedInfo && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Department
                </h3>
                <div className="rounded-full bg-blue-100 p-2">
                  <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <p className="text-base font-bold leading-tight text-blue-900 sm:text-lg">
                {decodedInfo.department}
              </p>
            </div>
          )}

          {/* Batch Card */}
          {decodedInfo && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Batch
                </h3>
                <div className="rounded-full bg-blue-100 p-2">
                  <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-xl font-bold text-blue-900">
                {decodedInfo.batch}
              </p>
            </div>
          )}

          {/* First Login Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                First Login
              </h3>
              <div className="rounded-full bg-blue-100 p-2">
                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-xl font-bold text-blue-900">
              {new Date(Number(user.metadata.createdAt)).toLocaleDateString(
                "en-GB",
                { day: "2-digit", month: "short", year: "numeric" }
              )}
            </p>
          </div>

          {/* Last Login Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Last Login
              </h3>
              <div className="rounded-full bg-blue-100 p-2">
                <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-xl font-bold text-blue-900">
              {new Date(Number(user.metadata.lastLoginAt)).toLocaleDateString(
                "en-GB",
                { day: "2-digit", month: "short", year: "numeric" }
              )}
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
          >
            {isLoggingOut ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Logout
              </span>
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
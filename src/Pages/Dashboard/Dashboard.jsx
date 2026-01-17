import React, { useState } from "react";
import { logout } from "../../Authentication/firebase.js";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../Authentication/firebase.js";
import profile from "/CardImgs/profile.jpg?url";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Department mapping
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
    if (!email || !email.endsWith("@bitsathy.ac.in")) return null;
    const usernamePart = email.split("@")[0];
    const parts = usernamePart.split(".");
    if (parts.length < 2) return null;
    const deptYear = parts[1];
    const deptCode = deptYear.slice(0, 2);
    const yearCode = deptYear.slice(2);
    const department = departmentMap[deptCode] || "Unknown Department";
    const startYear = 2000 + Number(yearCode);
    const endYear = startYear + 4;
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header Card */}
        <div className="mb-6 overflow-hidden rounded-3xl bg-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:shadow-[0_20px_60px_rgba(59,130,246,0.3)] sm:rounded-[2.5rem]" style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.95) 100%)',
          border: '1px solid rgba(59,130,246,0.1)'
        }}>
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 px-6 py-8 sm:px-8 sm:py-12">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
            
            {/* Decorative circles */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"></div>
            
            <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              {/* Profile Image */}
              <div className="group relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 opacity-75 blur-xl group-hover:opacity-100"></div>
                <div className="relative rounded-full bg-gradient-to-br from-white/30 to-white/10 p-1 shadow-2xl backdrop-blur-sm">
                  <img
                    src={user.photoURL || profile}
                    alt="Profile"
                    className="h-24 w-24 rounded-full border-4 border-white/50 object-cover shadow-xl transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-28"
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                </div>
                {user.emailVerified && (
                  <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg ring-4 ring-white/50">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-2 text-2xl font-bold text-white drop-shadow-lg sm:text-3xl lg:text-4xl">
                  {user.displayName || "User"}
                </h1>
                <p className="break-all text-sm text-white/95 drop-shadow-md sm:text-base">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        {!isBitsathyEmail && (
          <div className="mb-6 overflow-hidden rounded-2xl shadow-xl sm:rounded-3xl" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(254,243,199,0.95) 100%)',
            border: '1px solid rgba(251,191,36,0.2)'
          }}>
            <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-yellow-500">
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
              <div className="relative flex items-start gap-3 px-5 py-4 sm:items-center sm:gap-4 sm:px-6">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/40 shadow-lg backdrop-blur-sm sm:h-10 sm:w-10">
                  <svg className="h-5 w-5 text-white drop-shadow-md sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="flex-1 text-sm font-medium text-white drop-shadow-md sm:text-base">
                  Please use your BITSATHY college email for a better experience.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards Grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:gap-6">

          {/* Department Card */}
          {decodedInfo && (
            <div className="group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)] sm:rounded-3xl" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.9) 100%)',
              border: '1px solid rgba(59,130,246,0.15)'
            }}>
              <div className="relative overflow-hidden p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                <div className="relative mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600/70">
                    Department
                  </h3>
                  <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-2 shadow-lg backdrop-blur-sm">
                    <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <p className="relative text-lg font-bold leading-tight text-blue-900 sm:text-xl">
                  {decodedInfo.department}
                </p>
              </div>
            </div>
          )}

          {/* Batch Card */}
          {decodedInfo && (
            <div className="group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)] sm:rounded-3xl" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.9) 100%)',
              border: '1px solid rgba(59,130,246,0.15)'
            }}>
              <div className="relative overflow-hidden p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                <div className="relative mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600/70">
                    Batch
                  </h3>
                  <div className="rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 p-2 shadow-lg backdrop-blur-sm">
                    <svg className="h-5 w-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="relative text-2xl font-bold text-cyan-600">
                  {decodedInfo.batch}
                </p>
              </div>
            </div>
          )}

          {/* First Login Card */}
          <div className="group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)] sm:rounded-3xl" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.9) 100%)',
            border: '1px solid rgba(59,130,246,0.15)'
          }}>
            <div className="relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
              <div className="relative mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600/70">
                  First Login
                </h3>
                <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 p-2 shadow-lg backdrop-blur-sm">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="relative text-2xl font-bold text-blue-600">
                {new Date(Number(user.metadata.createdAt)).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "short", year: "numeric" }
                )}
              </p>
            </div>
          </div>

          {/* Last Login Card */}
          <div className="group overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(59,130,246,0.25)] sm:rounded-3xl" style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(239,246,255,0.9) 100%)',
            border: '1px solid rgba(59,130,246,0.15)'
          }}>
            <div className="relative overflow-hidden p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
              <div className="relative mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600/70">
                  Last Login
                </h3>
                <div className="rounded-full bg-gradient-to-br from-cyan-100 to-cyan-200 p-2 shadow-lg backdrop-blur-sm">
                  <svg className="h-5 w-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="relative text-2xl font-bold text-cyan-600">
                {new Date(Number(user.metadata.lastLoginAt)).toLocaleDateString(
                  "en-GB",
                  { day: "2-digit", month: "short", year: "numeric" }
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group relative w-full lg:w-[50%] overflow-hidden rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(59,130,246,0.4)] disabled:cursor-not-allowed disabled:opacity-70 sm:rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r lg:w- from-blue-600 to-blue-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center justify-center gap-3  px-6 py-4">
                {isLoggingOut ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-base font-semibold text-white drop-shadow-md sm:text-lg">Logging out...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-semibold text-white drop-shadow-md sm:text-lg">Logout</span>
                  </>
                )}
              </div>
            </button>
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
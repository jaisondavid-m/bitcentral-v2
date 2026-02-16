import React, { useState } from "react";
import { logout } from "../Authentication/firebase.js";
import { useAuth } from "../context/StudentContext.jsx";
import { Navigate } from "react-router-dom";
import profile from "../assets/profile.jpg";
import { Loader , CheckCircle , AlertTriangle , GraduationCap , Calendar , Clock , LogOut } from "lucide-react";

function Dashboard() {
  const { user, student, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isBitsathyEmail = user.email?.endsWith("@bitsathy.ac.in");

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
          <div className="bg-blue-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              
              <div className="relative">
                <img src={user.photoURL || profile} alt="Profile" className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md sm:h-24 sm:w-24"/>
                {user.emailVerified && (
                  <div className="absolute bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 shadow-md ring-1 ring-white">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">{user.displayName || "User"}</h1>
                <p className="break-all text-sm text-white/90 sm:text-base">{user.email}</p>
              </div>
              
            </div>
          </div>
        </div>
        
        {!isBitsathyEmail && (
          <div className="mb-6 overflow-hidden rounded-lg border border-yellow-200 bg-yellow-50">
            <div className="flex items-start gap-3 px-5 py-4 sm:items-center sm:gap-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <p className="flex-1 text-sm font-medium text-yellow-800 sm:text-base">Please use your BITSATHY college email for a better experience.</p>
            </div>
          </div>
        )}
        
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {student && (
            <>
              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Department</h3>
                  <div className="rounded-full bg-blue-100 p-2">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-base font-bold leading-tight text-blue-900 sm:text-lg">{student.department}</p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Batch</h3>
                  <div className="rounded-full bg-blue-100 p-2">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xl font-bold text-blue-900">{student.batch}</p>
              </div>
            </>
          )}
          
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">First Login</h3>
              <div className="rounded-full bg-blue-100 p-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-blue-900">
              {new Date(Number(user.metadata.createdAt)).toLocaleDateString("en-GB",{ day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Last Login</h3>
              <div className="rounded-full bg-blue-100 p-2">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xl font-bold text-blue-900">
              {new Date(Number(user.metadata.lastLoginAt)).toLocaleDateString("en-GB",{ day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button onClick={handleLogout} disabled={isLoggingOut}
            className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
          >
            {isLoggingOut ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="h-5 w-5 animate-spin" />Logging out...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogOut className="h-5 w-5" />Logout
              </span>
            )}
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default Dashboard;
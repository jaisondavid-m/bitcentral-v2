import React, { useState, useEffect } from "react";
import { logout } from "../Authentication/firebase.js";
import { useAuth } from "../context/StudentContext.jsx";
import { Navigate } from "react-router-dom";
import profile from "../assets/profile.jpg";
import { Loader, CheckCircle, AlertTriangle, GraduationCap, Calendar, Clock, LogOut, Hash } from "lucide-react";

function Dashboard() {
  const { user, student, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [savedRegisterNo, setSavedRegisterNo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [registerNoInput, setRegisterNoInput] = useState("");
  const [registerNoError, setRegisterNoError] = useState("");

  const registerStoreKey = user?.uid ? `home-register-no-${user.uid}` : "";

  useEffect(() => {
    if (!registerStoreKey) return;
    try {
      const saved = localStorage.getItem(registerStoreKey);
      if (saved) setSavedRegisterNo(JSON.parse(saved));
    } catch {
      setSavedRegisterNo(null);
    }
  }, [registerStoreKey]);

  const onOpenEdit = () => {
    setRegisterNoInput(savedRegisterNo?.registerNo || "");
    setRegisterNoError("");
    setShowEditModal(true);
  };

  const onSaveRegisterNo = (e) => {
    e.preventDefault();
    const value = registerNoInput.trim();
    if (!value) {
      setRegisterNoError("Register No is required.");
      return;
    }
    const updated = { registerNo: value, savedAt: Date.now() };
    localStorage.setItem(registerStoreKey, JSON.stringify(updated));
    setSavedRegisterNo(updated);
    setRegisterNoError("");
    setShowEditModal(false);
  };

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600 dark:text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  const isBitsathyEmail = user.email?.endsWith("@bitsathy.ac.in");

  return (
    <>
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-5 shadow-xl dark:border-blue-900 dark:bg-slate-950">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
              Student Identity
            </h2>
            <p className="mt-1 text-sm font-medium text-gray-700 dark:text-slate-200">
              {savedRegisterNo ? "Edit your Register No." : "Enter your Register No."}
            </p>

            <form onSubmit={onSaveRegisterNo} className="mt-4 space-y-3">
              <input
                type="text"
                value={registerNoInput}
                onChange={(e) => setRegisterNoInput(e.target.value)}
                placeholder="Register No"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
              />
              {registerNoError && <p className="text-xs text-red-600">{registerNoError}</p>}

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setRegisterNoError(""); setShowEditModal(false); }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 dark:bg-black">
        <div className="mx-auto max-w-4xl">

          {/* Profile Header */}
          <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
            <div className="bg-blue-600 px-6 py-8 sm:px-8">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <div className="relative">
                  <img src={user.photoURL || profile} alt="Profile" className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md sm:h-24 sm:w-24" />
                  {user.emailVerified && (
                    <div className="absolute -right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 shadow-md ring-1 ring-white">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">{user.displayName || "User"}</h1>
                  <p className="break-all text-sm text-white/90 sm:text-base">{user.email}</p>
                  {savedRegisterNo && (
                    <p className="mt-1 text-sm font-semibold text-white/80 sm:text-base">
                      Reg No: {savedRegisterNo.registerNo}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Warning */}
          {!isBitsathyEmail && (
            <div className="mb-6 overflow-hidden rounded-lg border border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30">
              <div className="flex items-start gap-3 px-5 py-4 sm:items-center sm:gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <p className="flex-1 text-sm font-medium text-yellow-800 sm:text-base dark:text-yellow-300">
                  Please use your BITSATHY college email for a better experience.
                </p>
              </div>
            </div>
          )}

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {/* Department & Batch */}
            {student && (
              <>
                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Department</h3>
                    <div className="rounded-full bg-blue-100 p-2">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-base font-bold leading-tight text-blue-900 sm:text-lg dark:text-blue-300">{student.department}</p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Batch</h3>
                    <div className="rounded-full bg-blue-100 p-2">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-xl font-bold text-blue-900 dark:text-blue-300">{student.batch}</p>
                </div>
              </>
            )}

            {/* First & Last Login */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">First Login</h3>
                <div className="rounded-full bg-blue-100 p-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
                {new Date(Number(user.metadata.createdAt)).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Last Login</h3>
                <div className="rounded-full bg-blue-100 p-2">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
                {new Date(Number(user.metadata.lastLoginAt)).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* Logout */}
          <div className="flex justify-center">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[200px] dark:border-blue-900 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              {isLoggingOut ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="h-5 w-5 animate-spin" /> Logging out...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogOut className="h-5 w-5" /> Logout
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default Dashboard;
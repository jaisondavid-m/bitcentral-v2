import React, { useState, useEffect } from "react";
import { logout } from "../Authentication/firebase.js";
import { useAuth, decodeCollegeEmail } from "../context/StudentContext.jsx";
import { Navigate } from "react-router-dom";
import profileAvatar from "../assets/profile.jpg";
import { getV2Profile } from "../api/axios.js";
import {
  Loader,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  Calendar,
  Clock,
  LogOut,
  Phone,
  Hash,
  Building2,
} from "lucide-react";

function ProfileV2() {
  const { user, student, profile, loading: authLoading } = useAuth();
  const [profileV2, setProfileV2] = useState(null);
  const [fetchingProfile, setFetchingProfile] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadV2Profile() {
      if (!user) {
        setFetchingProfile(false);
        return;
      }

      try {
        setFetchingProfile(true);
        const data = await getV2Profile();
        if (isMounted) {
          setProfileV2(data);
        }
      } catch (error) {
        console.error("Failed to load v2 profile:", error);
      } finally {
        if (isMounted) {
          setFetchingProfile(false);
        }
      }
    }

    if (!authLoading) {
      loadV2Profile();
    }

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  const formatAuthDate = (value) => {
    if (value == null || value === "") {
      return "-";
    }

    const numericValue = Number(value);
    const timestamp = Number.isFinite(numericValue) ? numericValue : Date.parse(value);

    if (!Number.isFinite(timestamp)) {
      return value;
    }

    return new Date(timestamp).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  if (authLoading || fetchingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600 dark:text-slate-300">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  const isBitsathyEmail = user.email?.endsWith("@bitsathy.ac.in");

  // Fallback decoded email info
  const decoded = decodeCollegeEmail(user?.email);

  // Robust field mapping supporting tracker_users, /me profile, student context, and email decoding
  const name =
    profileV2?.name ||
    profileV2?.display_name ||
    profile?.display_name ||
    user?.displayName ||
    "User";

  const email = profileV2?.email || profile?.email || user?.email || "";

  const avatarUrl =
    profileV2?.photo_url ||
    profile?.photo_url ||
    user?.photoURL ||
    profileAvatar;

  const registerNo =
    profileV2?.register_no ||
    profileV2?.roll_no ||
    profileV2?.user_id ||
    profile?.roll_no ||
    student?.roll_no ||
    student?.rollNo ||
    "-";

  const userId =
    profileV2?.user_id ||
    profileV2?.uid ||
    profile?.uid ||
    user?.uid ||
    "-";

  const department =
    profileV2?.department ||
    student?.department ||
    decoded?.department ||
    "-";

  const batch =
    profileV2?.batch ||
    student?.batch ||
    decoded?.batch ||
    "-";

  const phone =
    profileV2?.phone ||
    profile?.phone ||
    "-";

  const creationTime =
    profileV2?.creation_time ||
    profile?.creation_time ||
    user?.metadata?.createdAt ||
    user?.metadata?.creationTime ||
    "";

  const lastSignInTime =
    profileV2?.last_sign_in_time ||
    profile?.last_sign_in_time ||
    user?.metadata?.lastLoginAt ||
    user?.metadata?.lastSignInTime ||
    "";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8 dark:bg-black">
      <div className="mx-auto max-w-4xl">
        {/* Profile Header Banner */}
        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
          <div className="bg-blue-600 px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md sm:h-24 sm:w-24"
                />
                {user.emailVerified && (
                  <div className="absolute -right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-green-500 shadow-md ring-1 ring-white">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-2xl font-bold text-white sm:text-3xl">{name}</h1>
                <p className="break-all text-sm text-white/90 sm:text-base">{email}</p>
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

        {/* Details Grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {/* Register No */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Register No
              </h3>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950/60">
                <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-base font-bold leading-tight text-blue-900 sm:text-lg dark:text-blue-300">
              {registerNo}
            </p>
          </div>

          {/* User ID */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                User ID
              </h3>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950/60">
                <Hash className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-base font-bold leading-tight text-blue-900 sm:text-lg dark:text-blue-300">
              {userId}
            </p>
          </div>

          {/* Department */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Department
              </h3>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950/60">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-base font-bold leading-tight text-blue-900 sm:text-lg dark:text-blue-300">
              {department}
            </p>
          </div>

          {/* Batch */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Batch
              </h3>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950/60">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-300">{batch}</p>
          </div>

          {/* Phone */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Phone
              </h3>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950/60">
                <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-300">{phone}</p>
          </div>

          {/* Creation Time / First Login */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                First Login
              </h3>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950/60">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
              {formatAuthDate(creationTime)}
            </p>
          </div>

          {/* Last Sign-In Time */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-blue-900 dark:bg-slate-950">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                Last Login
              </h3>
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-950/60">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-300">
              {formatAuthDate(lastSignInTime)}
            </p>
          </div>
        </div>

        {/* Logout Button */}
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
    </main>
  );
}

export default ProfileV2;

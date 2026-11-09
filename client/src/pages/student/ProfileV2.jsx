import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  Hash,
  Loader,
  LogOut,
  Phone,
  Home,
} from "lucide-react";
import profileAvatar from "@/assets/profile.jpg";
import { logout } from "@/config/auth.js";
import { useAuth } from "@/context/StudentContext.jsx";
import { haptics } from "@/utils/haptics.js";
import LogoutConfirmModal from "@/components/modals/LogoutConfirmModal.jsx";

function formatAuthDate(dateValue) {
  if (!dateValue) return "-";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ProfileV2() {
  const { user, profile, student } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const profileV2 = user?.profileV2 || {};
  const isBitsathyEmail = user.email?.endsWith("@bitsathy.ac.in");

  const name =
    profileV2?.name ||
    profile?.name ||
    student?.name ||
    user?.displayName ||
    "User";

  const email = profileV2?.email || profile?.email || user?.email || "-";

  const registerNo =
    profile?.register_no ||
    student?.register_no ||
    "-";

  const userId =
    profile?.roll_no ||
    student?.roll_no ||
    profile?.user_id ||
    student?.user_id ||
    "-";

  const department =
    profileV2?.department ||
    profile?.department ||
    student?.department ||
    "-";

  const batch =
    profileV2?.batch ||
    profile?.batch ||
    student?.batch ||
    "-";

  const phone =
    profileV2?.phone ||
    profile?.phone ||
    profile?.phone_no ||
    student?.phone ||
    student?.phone_no ||
    "-";

  const rawResident =
    profile?.resident ||
    student?.resident ||
    "";
  const resident =
    rawResident === "H"
      ? "Hosteller"
      : rawResident === "D"
      ? "Day Scholar"
      : rawResident || "-";

  const avatarUrl =
    profileV2?.photo_url ||
    profile?.photo_url ||
    user?.photoURL ||
    profileAvatar;

  const handleOpenLogout = () => {
    haptics.selection();
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  const creationTime =
    profileV2?.creation_time ||
    profile?.creation_time ||
    user?.metadata?.creationTime ||
    user?.metadata?.createdAt ||
    "";

  const lastSignInTime =
    profileV2?.last_sign_in_time ||
    profile?.last_sign_in_time ||
    user?.metadata?.lastLoginAt ||
    user?.metadata?.lastSignInTime ||
    "";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] px-4 py-6 sm:px-6 lg:px-8 dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors">
      <div className="mx-auto max-w-4xl">
        {/* Profile Header Banner */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-zinc-900 bg-blue-600 shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-blue-950 dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-[2px_2px_0px_#18181b] sm:h-24 sm:w-24"
                />
                {user.emailVerified && (
                  <div className="absolute -right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 shadow-sm border-2 border-white">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="mb-1 text-2xl font-black text-white sm:text-3xl tracking-tight">{name}</h1>
                <p className="break-all text-sm font-semibold text-blue-100 sm:text-base">{email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Warning */}
        {!isBitsathyEmail && (
          <div className="mb-6 overflow-hidden rounded-xl border border-zinc-900 bg-amber-50 p-4 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-amber-950/40 dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-900 bg-amber-400 text-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <p className="flex-1 text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                Please use your BITSATHY college email for a better experience.
              </p>
            </div>
          </div>
        )}

        {/* Details Grid */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          {/* Register No */}
          <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Register No
              </h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
              {registerNo}
            </p>
          </div>

          {/* User ID */}
          <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                User ID
              </h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                <Hash className="h-5 w-5" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
              {userId}
            </p>
          </div>

          {/* Department */}
          <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Department
              </h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
              {department}
            </p>
          </div>

          {/* Batch */}
          <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Batch
              </h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">{batch}</p>
          </div>

          {/* Phone */}
          <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Phone
              </h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                <Phone className="h-5 w-5" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">{phone}</p>
          </div>

          {/* Resident (Hosteller / Day Scholar) */}
          <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Resident
              </h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                <Home className="h-5 w-5" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">{resident}</p>
          </div>

          {/* First Login */}
          <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                First Login
              </h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
              {formatAuthDate(creationTime)}
            </p>
          </div>

          {/* Last Login */}
          <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 sm:col-span-2 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Last Login
              </h3>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
              {formatAuthDate(lastSignInTime)}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleOpenLogout}
            disabled={isLoggingOut}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-900 bg-rose-600 px-8 py-3 text-sm font-black text-white shadow-[3px_3px_0px_#18181b] hover:bg-rose-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 dark:border-white dark:shadow-[3px_3px_0px_#ffffff] transition-all cursor-pointer"
          >
            {isLoggingOut ? (
              <>
                <Loader className="h-4 w-4 animate-spin stroke-[2.5]" />
                <span>Logging out...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 stroke-[2.5]" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      </div>

      <LogoutConfirmModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
      />
    </main>
  );
}

export default ProfileV2;

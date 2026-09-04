import React, { useEffect, useMemo, useState } from "react";
import { getFacultyDirectory } from "@/api/axios.js";
import {
  AlertCircle,
  Building2,
  Check,
  Copy,
  Mail,
  Phone,
  PhoneCall,
  Search,
  Users,
  X,
} from "lucide-react";

function getInitials(name = "") {
  if (!name) return "FC";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getAvatarColor(name = "") {
  const colors = [
    "bg-blue-600 dark:bg-blue-700",
    "bg-purple-600 dark:bg-purple-700",
    "bg-indigo-600 dark:bg-indigo-700",
    "bg-emerald-600 dark:bg-emerald-700",
    "bg-cyan-600 dark:bg-cyan-700",
    "bg-rose-600 dark:bg-rose-700",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function FacultyDirectory() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [activeCallModal, setActiveCallModal] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDirectory() {
      setLoading(true);
      try {
        const res = await getFacultyDirectory();
        if (res?.success && Array.isArray(res.data) && !cancelled) {
          setFaculty(res.data);
        }
      } catch (err) {
        console.error("Failed to load faculty directory", err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDirectory();
    return () => {
      cancelled = true;
    };
  }, []);

  // Handle escape key to close call modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && activeCallModal) {
        setActiveCallModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCallModal]);

  const handleCopyPhone = (phone, id) => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredFaculty = useMemo(() => {
    return faculty.filter((member) => {
      const nameMatch = member.name?.toLowerCase().includes(search.toLowerCase());
      const emailMatch = member.email?.toLowerCase().includes(search.toLowerCase());
      const phoneMatch = member.phone?.includes(search);
      const deptMatch = member.department?.toLowerCase().includes(search.toLowerCase());
      return !search || nameMatch || emailMatch || phoneMatch || deptMatch;
    });
  }, [faculty, search]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Simple Page Title */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Faculty Directory
          </h1>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {filteredFaculty.length} Members
          </span>
        </div>

        {/* Search Bar Only */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, department, or phone number..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm font-medium text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
            />
          </div>
        </div>

        {/* Faculty Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <Users className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
            <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
              No Faculty Contacts Found
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFaculty.map((member) => {
              const avatarColor = getAvatarColor(member.name);
              const initials = getInitials(member.name);
              const isCopied = copiedId === member.id;

              return (
                <div
                  key={member.id || member.email}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
                >
                  <div>
                    <div className="flex items-start gap-4">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                          className="h-14 w-14 rounded-2xl object-cover shadow-inner"
                        />
                      ) : null}
                      <div
                        style={{ display: member.photo_url ? "none" : "flex" }}
                        className={`h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-sm ${avatarColor}`}
                      >
                        {initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {member.name}
                        </h3>
                        <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                          <Building2 className="h-3 w-3" />
                          <span className="truncate">{member.department || "Faculty"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 truncate text-xs text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                      >
                        <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{member.email}</span>
                      </a>

                      {member.phone && (
                        <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                          <div className="flex items-center gap-2 font-mono font-medium">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            <span>{member.phone}</span>
                          </div>
                          <button
                            onClick={() => handleCopyPhone(member.phone, member.id)}
                            title="Copy phone number"
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {member.phone && (
                    <div className="mt-4 pt-2">
                      <button
                        onClick={() => setActiveCallModal(member)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 py-2.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        Call Faculty
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Big Confirmation Call Modal */}
        {activeCallModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-md transition-all animate-in fade-in duration-200"
            onClick={() => setActiveCallModal(null)}
          >
            <div
              className="relative w-full max-w-md scale-100 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveCallModal(null)}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Faculty Big Picture & Details */}
              <div className="flex flex-col items-center text-center">
                {activeCallModal.photo_url ? (
                  <img
                    src={activeCallModal.photo_url}
                    alt={activeCallModal.name}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                    className="h-28 w-28 rounded-3xl object-cover shadow-lg ring-4 ring-blue-500/20"
                  />
                ) : null}
                <div
                  style={{ display: activeCallModal.photo_url ? "none" : "flex" }}
                  className={`h-28 w-28 items-center justify-center rounded-3xl text-3xl font-bold text-white shadow-lg ring-4 ring-blue-500/20 ${getAvatarColor(
                    activeCallModal.name
                  )}`}
                >
                  {getInitials(activeCallModal.name)}
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                  {activeCallModal.name}
                </h2>

                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{activeCallModal.department || "Faculty & Staff"}</span>
                </div>

                {activeCallModal.job_title && activeCallModal.job_title !== "Faculty / Staff" && (
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {activeCallModal.job_title}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{activeCallModal.email}</span>
                </div>

                {/* Big Phone Number Box */}
                <div className="mt-6 flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-600/10 p-2 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Phone Number
                      </div>
                      <div className="font-mono text-base font-bold text-slate-900 dark:text-white">
                        {activeCallModal.phone}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyPhone(activeCallModal.phone, activeCallModal.id)}
                    title="Copy phone number"
                    className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    {copiedId === activeCallModal.id ? (
                      <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Confirmation Notice */}
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-left text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/50">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <span>
                    Please confirm before placing the call. Only contact faculty during official working hours for academic queries.
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex w-full gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveCallModal(null)}
                    className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <a
                    href={`tel:${activeCallModal.phone}`}
                    onClick={() => setActiveCallModal(null)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <PhoneCall className="h-4 w-4" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

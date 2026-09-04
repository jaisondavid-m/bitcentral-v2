import React, { useEffect, useMemo, useState } from "react";
import { getFacultyDirectory } from "@/api/axios.js";
import {
  Building2,
  Check,
  Copy,
  Mail,
  Phone,
  PhoneCall,
  Search,
  UserCheck,
  Users,
} from "lucide-react";

const DEPARTMENTS = [
  { id: "all", label: "All Departments" },
  { id: "Computer Science", label: "CSE" },
  { id: "Electronics", label: "ECE" },
  { id: "Electrical", label: "EEE" },
  { id: "Mechanical", label: "MECH" },
  { id: "AI & Data Science", label: "AI & DS" },
  { id: "AI & Machine Learning", label: "AI & ML" },
  { id: "Biotechnology", label: "BIOTECH" },
  { id: "Information Technology", label: "IT" },
  { id: "Computer Technology", label: "CT" },
];

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
  const [selectedDept, setSelectedDept] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

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
      const matchesSearch = !search || nameMatch || emailMatch || phoneMatch || deptMatch;

      const matchesDept =
        selectedDept === "all" ||
        member.department?.toLowerCase().includes(selectedDept.toLowerCase());

      return matchesSearch && matchesDept;
    });
  }, [faculty, search, selectedDept]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header section */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white shadow-xl dark:from-slate-900 dark:via-blue-950 dark:to-slate-900 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 backdrop-blur-md">
                <Users className="h-3.5 w-3.5" />
                <span>Verified Contacts</span>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Faculty & Staff Directory
              </h1>
              <p className="mt-2 text-sm text-blue-100 max-w-2xl">
                Access official directory contacts for department faculty and staff. Phone numbers updated automatically every 24 hours.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md">
              <UserCheck className="h-6 w-6 text-blue-200" />
              <div>
                <div className="text-2xl font-bold">{filteredFaculty.length}</div>
                <div className="text-xs text-blue-100">Faculty Members</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Department Filters */}
        <div className="mb-8 space-y-4">
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

          <div className="flex flex-wrap items-center gap-2">
            {DEPARTMENTS.map((dept) => {
              const active = selectedDept === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDept(dept.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 dark:bg-blue-600"
                      : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {dept.label}
                </button>
              );
            })}
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
              Try adjusting your search terms or department filter.
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
                      <a
                        href={`tel:${member.phone}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950 transition-colors"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        Call Faculty
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState, useRef } from "react";
import { getFacultyDirectory } from "@/api/axios.js";
import {
  AlertCircle,
  Building2,
  Check,
  ChevronDown,
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

function SearchableDeptDropdown({
  departments,
  selected,
  onSelect,
  placeholder = "Search department...",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredDepts = useMemo(() => {
    if (!query.trim()) return departments;
    const q = query.toLowerCase().trim();
    return departments.filter((d) => d.name.toLowerCase().includes(q));
  }, [departments, query]);

  const currentDept = departments.find((d) => d.id === selected) || departments[0];

  return (
    <div className="relative w-full sm:w-72 shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-left text-sm font-semibold text-slate-800 shadow-xs transition-all hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800/80 cursor-pointer"
      >
        <div className="flex items-center gap-2.5 truncate">
          <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="truncate">
            {selected && selected !== "ALL" ? currentDept?.name : "All Departments"}
          </span>
          {currentDept?.count !== undefined && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 shrink-0">
              {currentDept.count}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {selected && selected !== "ALL" && (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect("ALL");
              }}
              title="Clear department filter"
              className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-full min-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
          <div className="relative mb-2 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-950">
            <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {filteredDepts.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400 italic">
                No matching departments found
              </div>
            ) : (
              filteredDepts.map((dept) => {
                const isSelected = (selected || "ALL") === dept.id;
                return (
                  <button
                    key={dept.id}
                    type="button"
                    onClick={() => {
                      onSelect(dept.id);
                      setIsOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold shadow-xs"
                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <span className="truncate pr-2">{dept.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                          isSelected
                            ? "bg-blue-700 text-white"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {dept.count}
                      </span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FacultyDirectory() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
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

  const departmentOptions = useMemo(() => {
    const counts = {};
    faculty.forEach((member) => {
      const dept = (member.department || "Other").trim();
      if (dept) {
        counts[dept] = (counts[dept] || 0) + 1;
      }
    });

    const list = Object.entries(counts)
      .map(([name, count]) => ({
        id: name,
        name: name,
        count: count,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return [
      { id: "ALL", name: "All Departments", count: faculty.length },
      ...list,
    ];
  }, [faculty]);

  const filteredFaculty = useMemo(() => {
    const q = search.toLowerCase().trim();
    return faculty.filter((member) => {
      // Department filter
      if (selectedDepartment && selectedDepartment !== "ALL") {
        const memberDept = (member.department || "Other").trim().toLowerCase();
        if (memberDept !== selectedDepartment.toLowerCase()) {
          return false;
        }
      }

      // Search filter
      if (!q) return true;
      const nameMatch = member.name?.toLowerCase().includes(q);
      const emailMatch = member.email?.toLowerCase().includes(q);
      const phoneMatch = member.phone?.includes(q);
      const deptMatch = member.department?.toLowerCase().includes(q);
      const jobMatch = member.job_title?.toLowerCase().includes(q);
      return nameMatch || emailMatch || phoneMatch || deptMatch || jobMatch;
    });
  }, [faculty, search, selectedDepartment]);

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-4 dark:bg-slate-950 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Title & Count */}
        <div className="mb-3.5 flex items-center justify-between sm:mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Faculty Directory
          </h1>
          <span className="rounded-full bg-slate-200/80 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:bg-transparent sm:p-0 sm:text-sm sm:text-slate-500 dark:sm:text-slate-400">
            {selectedDepartment !== "ALL" || search
              ? `${filteredFaculty.length} / ${faculty.length}`
              : `${filteredFaculty.length} Members`}
          </span>
        </div>

        {/* Search & Searchable Department Dropdown Filter */}
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 sm:left-4 sm:h-5 sm:w-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, department, or phone..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs font-medium text-slate-900 shadow-2xs transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500 sm:rounded-2xl sm:py-3.5 sm:pl-12 sm:pr-10 sm:text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>

          <SearchableDeptDropdown
            departments={departmentOptions}
            selected={selectedDepartment}
            onSelect={setSelectedDepartment}
            placeholder="Search departments..."
          />
        </div>

        {/* Faculty Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-slate-200 bg-white p-3.5 dark:border-slate-800 dark:bg-slate-900 sm:rounded-2xl sm:p-5"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800 sm:h-14 sm:w-14 sm:rounded-2xl" />
                  <div className="flex-1 space-y-1.5 sm:space-y-2">
                    <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-slate-800 sm:h-4" />
                    <div className="h-2.5 w-1/2 rounded bg-slate-200 dark:bg-slate-800 sm:h-3" />
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 sm:mt-4 sm:space-y-2">
                  <div className="h-2.5 w-full rounded bg-slate-200 dark:bg-slate-800 sm:h-3" />
                  <div className="h-2.5 w-2/3 rounded bg-slate-200 dark:bg-slate-800 sm:h-3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredFaculty.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900 sm:rounded-3xl sm:p-12">
            <Users className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-600 sm:h-12 sm:w-12" />
            <h3 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white sm:mt-4 sm:text-base">
              No Faculty Contacts Found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
              Try adjusting your search query or department filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFaculty.map((member) => {
              const avatarColor = getAvatarColor(member.name);
              const initials = getInitials(member.name);
              const isCopied = copiedId === member.id;

              return (
                <div
                  key={member.id || member.email}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs transition-all hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 sm:rounded-2xl sm:p-5 sm:hover:-translate-y-1 sm:hover:shadow-md"
                >
                  <div>
                    <div className="flex items-start gap-3 sm:gap-4">
                      {member.photo_url ? (
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                          className="h-11 w-11 rounded-xl object-cover shadow-inner sm:h-14 sm:w-14 sm:rounded-2xl"
                        />
                      ) : null}
                      <div
                        style={{ display: member.photo_url ? "none" : "flex" }}
                        className={`h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-xs sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg ${avatarColor}`}
                      >
                        {initials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors sm:text-base">
                          {member.name}
                        </h3>
                        <div className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 sm:mt-1 sm:text-xs">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span className="truncate">{member.department || "Faculty"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 space-y-1.5 border-t border-slate-100 pt-2.5 dark:border-slate-800/80 sm:mt-4 sm:space-y-2 sm:pt-3">
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 truncate text-[11px] text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors sm:text-xs"
                      >
                        <Mail className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{member.email}</span>
                      </a>

                      {member.phone && (
                        <div className="flex items-center justify-between text-[11px] text-slate-700 dark:text-slate-300 sm:text-xs">
                          <div className="flex items-center gap-2 font-mono font-medium">
                            <Phone className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                            <span>{member.phone}</span>
                          </div>
                          <button
                            onClick={() => handleCopyPhone(member.phone, member.id)}
                            title="Copy phone number"
                            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
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
                    <div className="mt-2.5 pt-1 sm:mt-4 sm:pt-2">
                      <button
                        onClick={() => setActiveCallModal(member)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-2 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60 transition-all cursor-pointer active:scale-[0.98] sm:rounded-xl sm:py-2.5 sm:text-xs"
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

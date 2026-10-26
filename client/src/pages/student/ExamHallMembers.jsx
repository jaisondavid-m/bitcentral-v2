import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/StudentContext.jsx";
import { useTheme } from "@/context/ThemeContext.jsx";
import {
  ArrowLeft,
  Search,
  MapPin,
  Building2,
  CalendarDays,
  Clock,
  BookOpen,
  Users,
  Copy,
  Check,
  GraduationCap,
  Loader2,
  AlertCircle,
  Filter,
  Sparkles
} from "lucide-react";
import api from "@/api/axios.js";

// Helper to format date string "DD-MM-YYYY" into a readable display
function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
  const [d, m, y] = parts;
  const dateObj = new Date(`${y}-${m}-${d}`);
  if (isNaN(dateObj.getTime())) return dateStr;
  return dateObj.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

const ExamHallMembers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDark } = useTheme();

  const hallParam = searchParams.get("hall") || searchParams.get("hallNo") || "";
  const dateParam = searchParams.get("date") || "";
  const sessionParam = searchParams.get("session") || "";
  const timeParam = searchParams.get("time") || "";
  const targetStudentParam = searchParams.get("student") || "";

  // Target student can be passed in query or taken from user auth profile
  const currentUserRegNo = (
    targetStudentParam ||
    user?.roll_no ||
    user?.user_id ||
    user?.register_no ||
    ""
  ).trim().toUpperCase();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hallData, setHallData] = useState(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState("ALL");
  const [copiedRegNo, setCopiedRegNo] = useState("");

  // Load hall members data
  useEffect(() => {
    if (!hallParam) {
      setError("No hall specified. Please select a hall from your exam schedule.");
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError("");

    api
      .get("/exam-hall/members", {
        params: {
          hall: hallParam,
          date: dateParam,
          session: sessionParam,
          time: timeParam
        }
      })
      .then((res) => {
        if (!isMounted) return;
        if (res.data?.success) {
          setHallData(res.data);
        } else {
          setError(res.data?.message || "No students found for this hall.");
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        const msg =
          err.response?.data?.message ||
          "Could not retrieve hall members. Please try again.";
        setError(msg);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [hallParam, dateParam, sessionParam, timeParam]);

  // Copy single register number
  const handleCopyRegNo = (regNo) => {
    navigator.clipboard?.writeText(regNo);
    setCopiedRegNo(regNo);
    setTimeout(() => setCopiedRegNo(""), 2000);
  };

  // Filter members based on search and course filter
  const filteredMembers = useMemo(() => {
    if (!hallData?.members) return [];
    let list = hallData.members;

    if (selectedCourseFilter !== "ALL") {
      list = list.filter(
        (m) => m.course_code?.toUpperCase() === selectedCourseFilter.toUpperCase()
      );
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter((m) => {
      const reg = (m.register_no || "").toLowerCase();
      const name = (m.name || "").toLowerCase();
      const code = (m.course_code || "").toLowerCase();
      const course = (m.course_name || "").toLowerCase();
      const dept = (m.department || "").toLowerCase();
      return (
        reg.includes(q) ||
        name.includes(q) ||
        code.includes(q) ||
        course.includes(q) ||
        dept.includes(q)
      );
    });
  }, [hallData, selectedCourseFilter, searchQuery]);

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-[#EEF4FF] px-4 py-6 md:py-8 dark:bg-[#080F1E] text-slate-800 dark:text-slate-100 transition-colors">
        <div className="mx-auto max-w-5xl space-y-4">
          {/* ── Top Navigation & Title Bar ── */}
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white p-4 shadow-sm dark:border-blue-900/30 dark:bg-[#0F1C33]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-xs transition-all hover:bg-blue-50 active:scale-95 cursor-pointer dark:border-blue-800/60 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Schedule</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-600 shadow-xs">
                  <span className="text-[11px] font-black leading-none text-white">BIT</span>
                  <span className="text-[6.5px] font-bold leading-none text-blue-200">SATHY</span>
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    Hall Members
                  </h1>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    Venue seating roster & exam details
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Loading State ── */}
          {loading && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-blue-100 bg-white py-20 dark:border-blue-900/30 dark:bg-[#0F1C33]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Loading students seated in {hallParam || "hall"}...
              </p>
            </div>
          )}

          {/* ── Error State ── */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-200 bg-white p-8 text-center dark:border-red-900/40 dark:bg-[#0F1C33]">
              <div className="rounded-full bg-red-50 p-3 dark:bg-red-950/40">
                <AlertCircle className="h-7 w-7 text-red-500 dark:text-red-400" />
              </div>
              <div className="max-w-md space-y-1">
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                  Hall Seating Not Found
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/exam-hall")}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
              >
                Go to Exam Hall
              </button>
            </div>
          )}

          {/* ── Hall Details & Members View ── */}
          {!loading && hallData && (
            <>
              {/* Hall Overview Card */}
              <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-blue-900/30 dark:bg-[#0F1C33] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-50 pb-4 dark:border-blue-900/20">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-sm font-black text-white shadow-xs tracking-wide">
                        <MapPin className="h-3.5 w-3.5" />
                        Hall {hallData.hall_no}
                      </span>
                      {hallData.block && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          <Building2 className="h-3 w-3" />
                          {hallData.block}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-600 dark:text-slate-300">
                      {hallData.date && (
                        <span className="inline-flex items-center gap-1 font-medium">
                          <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
                          {formatDisplayDate(hallData.date)}
                        </span>
                      )}
                      {hallData.session && (
                        <span className="rounded-md bg-blue-100/70 px-2 py-0.5 text-[11px] font-bold text-blue-800 dark:bg-blue-900/60 dark:text-blue-200">
                          {hallData.session === "FN" ? "Forenoon" : "Afternoon"}
                        </span>
                      )}
                      {hallData.time && (
                        <span className="inline-flex items-center gap-1 font-mono font-medium text-slate-600 dark:text-slate-400">
                          <Clock className="h-3.5 w-3.5 text-blue-500" />
                          {hallData.time}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                        Seated Students
                      </span>
                      <span className="text-2xl font-black text-blue-700 dark:text-blue-300">
                        {hallData.total_students}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Courses Breakdown Chips */}
                {hallData.courses?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Exams in this Hall
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {hallData.courses.map((c, idx) => {
                        const isSelected = selectedCourseFilter === c.course_code;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() =>
                              setSelectedCourseFilter(isSelected ? "ALL" : c.course_code)
                            }
                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer border ${
                              isSelected
                                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                                : "bg-blue-50/70 border-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/40"
                            }`}
                          >
                            <BookOpen className="h-3 w-3" />
                            <span className="font-mono font-bold">{c.course_code}</span>
                            <span className="opacity-90 max-w-[180px] sm:max-w-[260px] truncate text-[11px]">
                              {c.course_name}
                            </span>
                            <span
                              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-blue-200/60 text-blue-900 dark:bg-blue-800/60 dark:text-blue-200"
                              }`}
                            >
                              {c.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* ── Search & Filter Bar ── */}
              <div className="rounded-2xl border border-blue-100 bg-white p-3.5 shadow-sm dark:border-blue-900/30 dark:bg-[#0F1C33] space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search register no, subject code, or department..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/30"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {selectedCourseFilter !== "ALL" && (
                    <button
                      type="button"
                      onClick={() => setSelectedCourseFilter("ALL")}
                      className="rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer border bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 shrink-0"
                    >
                      Show All ({hallData.total_students})
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-0.5">
                  <span>
                    Showing <strong className="text-slate-800 dark:text-slate-200">{filteredMembers.length}</strong>{" "}
                    of {hallData.total_students} students
                  </span>
                  {selectedCourseFilter !== "ALL" && (
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                      Filtered by: {selectedCourseFilter}
                    </span>
                  )}
                </div>
              </div>

              {/* ── Student Members Grid (Compact & Ordered) ── */}
              {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
                  {filteredMembers.map((member) => {
                    const isCurrentUser =
                      currentUserRegNo &&
                      member.register_no?.toUpperCase() === currentUserRegNo;
                    const isCopied = copiedRegNo === member.register_no;

                    return (
                      <div
                        key={member.register_no}
                        onClick={() => handleCopyRegNo(member.register_no)}
                        title={`Click to copy ${member.register_no}${member.course_name ? ` • ${member.course_name}` : ""}`}
                        className={`group relative flex flex-col justify-between rounded-xl border p-2.5 shadow-2xs transition-all duration-150 hover:shadow-xs hover:-translate-y-0.5 cursor-pointer select-none ${
                          isCurrentUser
                            ? "border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/40 dark:border-blue-400 dark:bg-blue-950/40"
                            : "border-blue-100/90 bg-white hover:border-blue-300 dark:border-blue-900/40 dark:bg-[#0F1C33] dark:hover:border-blue-800"
                        }`}
                      >
                        {/* Top: Seat Number & Course Code */}
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="flex h-4.5 min-w-[20px] items-center justify-center rounded bg-blue-100/80 px-1 text-[10px] font-black text-blue-700 dark:bg-blue-900/60 dark:text-blue-200">
                            #{member.seat_no}
                          </span>
                          <span className="rounded bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                            {member.course_code}
                          </span>
                        </div>

                        {/* Middle: Register Number & Copy icon */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-xs sm:text-[13px] font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
                            {member.register_no}
                          </span>
                          <span className="shrink-0 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {isCopied ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </span>
                        </div>

                        {/* Bottom: Student Name */}
                        <div className="mt-1 flex items-center justify-between gap-1 border-t border-slate-100 dark:border-blue-900/20 pt-1">
                          <span
                            className="truncate text-[11px] font-semibold text-slate-600 dark:text-slate-300 capitalize"
                            title={member.name || member.department}
                          >
                            {member.name ? member.name.toLowerCase() : member.department || "-"}
                          </span>
                          {isCurrentUser && (
                            <span className="rounded bg-blue-600 px-1 py-0.2 text-[9px] font-bold text-white shrink-0">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-blue-200 bg-white p-12 text-center dark:border-blue-900/40 dark:bg-[#0F1C33]">
                  <Search className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                  <div className="max-w-xs space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      No matching students found
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No students match your query "{searchQuery}". Try searching by another register number or clear the filter.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCourseFilter("ALL");
                    }}
                    className="mt-1 rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 cursor-pointer dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamHallMembers;

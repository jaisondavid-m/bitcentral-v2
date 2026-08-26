import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  Award,
  Calendar,
  Layers,
  ArrowUpDown,
  FileCheck2,
  Sparkles,
  ShieldCheck,
  User,
  Copy,
  Check,
  AlertCircle
} from "lucide-react";
import api, { getAuthenticatedHeaders } from "../api/axios.js";
import { useAuth } from "../context/StudentContext.jsx";

// Fallback dataset provided by user for ID 2025UCS1023 to ensure instant preview & offline support
const FALLBACK_ASSESSMENT_DATA = [
  { attendance: "Present", course_name: "Ist Year Mock Test", date: "2025-09-10", start_time: "08:45:00", end_time: "09:45:00", result: "Not Cleared", status: "1", venue: "Vedhanayagam Auditorium" },
];

export default function PSAssessmentHistory() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { student, profile, user } = useAuth() || {};

  // Extract User ID (e.g. 2025UCS1023) from query params or auth profile (user_id), ignoring register_no / roll_no
  const defaultUserId =
    searchParams.get("id") ||
    searchParams.get("user_id") ||
    profile?.user_id ||
    profile?.data?.user_id ||
    student?.user_id ||
    student?.userId ||
    profile?.roll_no ||
    student?.roll_no ||
    "";

  const [userIdInput, setUserIdInput] = useState(defaultUserId);
  const [activeUserId, setActiveUserId] = useState(defaultUserId);

  // Filters & controls
  const [searchTerm, setSearchTerm] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL"); // ALL | Cleared | Not Cleared
  const [attendanceFilter, setAttendanceFilter] = useState("ALL"); // ALL | Present | Absent
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | name
  const [copiedId, setCopiedId] = useState(false);

  // Fetch from PS API via backend proxy (/ps/assessments?id=2025UCS1023)
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["ps-assessment-history", activeUserId],
    queryFn: async () => {
      try {
        const headers = await getAuthenticatedHeaders().catch(() => ({}));
        const res = await api.get("/ps/assessments", {
          params: activeUserId ? { id: activeUserId } : {},
          headers,
        });
        return res.data;
      } catch (err) {
        console.warn("Backend API fetch failed, falling back to local dataset if available.", err);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Parse assessment details from filtered response or fallback dataset
  const parsedData = apiResponse || {};
  const studentBasic = parsedData.student || parsedData.data?.basic || {
    name: activeUserId === "2025UCS1023" ? "JAISON DAVID M" : "Student",
    id: activeUserId,
    department: "Computer Science and Engineering",
    batch: "2025 - 2029"
  };

  // Derive student batch start year (e.g. 2025 for 2025UCS1023) to filter legacy/dummy records
  const studentStartYear = useMemo(() => {
    if (activeUserId && /^20\d{2}/.test(activeUserId)) {
      return parseInt(activeUserId.slice(0, 4), 10);
    }
    const batchStr = studentBasic?.batch || student?.batch;
    if (batchStr) {
      const match = batchStr.match(/20\d{2}/);
      if (match) return parseInt(match[0], 10);
    }
    return null;
  }, [activeUserId, studentBasic, student]);

  const rawAssessmentList = useMemo(() => {
    const listFromApi = parsedData.assessments || parsedData.data?.personalized_skills?.assessment_data || parsedData.data?.personalized_skills?.assessment_logs;
    let list = [];
    if (listFromApi && Array.isArray(listFromApi) && listFromApi.length > 0) {
      list = listFromApi;
    } else if (activeUserId === "2025UCS1023" || !listFromApi) {
      list = FALLBACK_ASSESSMENT_DATA;
    }

    // Filter out dummy/legacy assessments dated before student's start year (e.g. 2023 for a 2025 student)
    if (studentStartYear) {
      list = list.filter((item) => {
        if (!item.date) return true;
        const itemYear = new Date(item.date).getFullYear();
        return isNaN(itemYear) || itemYear >= studentStartYear;
      });
    }

    return list;
  }, [parsedData, activeUserId, studentStartYear]);

  // Apply search, filters & sorting
  const filteredAssessments = useMemo(() => {
    let list = [...rawAssessmentList];

    // Filter by Result
    if (resultFilter !== "ALL") {
      list = list.filter((item) => (item.result || "").toLowerCase() === resultFilter.toLowerCase());
    }

    // Filter by Attendance
    if (attendanceFilter !== "ALL") {
      list = list.filter((item) => (item.attendance || "").toLowerCase() === attendanceFilter.toLowerCase());
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (item) =>
          (item.course_name || "").toLowerCase().includes(q) ||
          (item.venue || "").toLowerCase().includes(q) ||
          (item.date || "").includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.date || 0) - new Date(a.date || 0);
      } else if (sortBy === "oldest") {
        return new Date(a.date || 0) - new Date(b.date || 0);
      } else if (sortBy === "name") {
        return (a.course_name || "").localeCompare(b.course_name || "");
      }
      return 0;
    });

    return list;
  }, [rawAssessmentList, resultFilter, attendanceFilter, searchTerm, sortBy]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = rawAssessmentList.length;
    const cleared = rawAssessmentList.filter((item) => item.result === "Cleared").length;
    const notCleared = rawAssessmentList.filter((item) => item.result === "Not Cleared").length;
    const presentCount = rawAssessmentList.filter((item) => item.attendance === "Present").length;
    const absentCount = rawAssessmentList.filter((item) => item.attendance === "Absent").length;
    const passRate = total > 0 ? ((cleared / total) * 100).toFixed(1) : "0.0";

    return { total, cleared, notCleared, presentCount, absentCount, passRate };
  }, [rawAssessmentList]);

  // Handle User ID Change form submit
  const handleUserIdSubmit = (e) => {
    e.preventDefault();
    if (userIdInput.trim()) {
      setActiveUserId(userIdInput.trim());
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(activeUserId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">



        {/* Analytics Summary Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Total Tests
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats.total}
            </div>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-500" />
              Assessments logged
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
              Cleared
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.cleared}
            </div>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Passed modules
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Clearance Rate
            </span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {stats.passRate}%
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, stats.passRate))}%` }}
              />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Absent
            </span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats.absentCount}
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-300 font-medium">
              Missed slots
            </span>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

            {/* Title & Record count */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Assessment Logs
                </h2>
              </div>
            </div>
          </div>

          {/* Search and Filters Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search course name or venue..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Result Filter (hidden in mobile view) */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-400 shrink-0 font-medium">Result:</span>
              <select
                value={resultFilter}
                onChange={(e) => setResultFilter(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer w-full"
              >
                <option value="ALL" className="bg-white dark:bg-slate-900">All Results</option>
                <option value="Cleared" className="bg-white dark:bg-slate-900">Cleared Only</option>
                <option value="Not Cleared" className="bg-white dark:bg-slate-900">Not Cleared Only</option>
              </select>
            </div>

            {/* Attendance Filter (hidden in mobile view) */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs">
              <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-400 shrink-0 font-medium">Attendance:</span>
              <select
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer w-full"
              >
                <option value="ALL" className="bg-white dark:bg-slate-900">All Attendance</option>
                <option value="Present" className="bg-white dark:bg-slate-900">Present Only</option>
                <option value="Absent" className="bg-white dark:bg-slate-900">Absent Only</option>
              </select>
            </div>

            {/* Sort By (hidden in mobile view) */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-400 shrink-0 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer w-full"
              >
                <option value="newest" className="bg-white dark:bg-slate-900">Newest First</option>
                <option value="oldest" className="bg-white dark:bg-slate-900">Oldest First</option>
                <option value="name" className="bg-white dark:bg-slate-900">Course Name</option>
              </select>
            </div>

          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-xs">
            <RefreshCw className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Fetching assessment history for ID <span className="font-mono text-blue-600">{activeUserId}</span>...
            </p>
          </div>
        )}

        {/* Zero Results State */}
        {!isLoading && filteredAssessments.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-xs">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Assessment Records Found</h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              No assessment logs match your active filters or User ID <code className="font-bold text-blue-600">{activeUserId}</code>. Try clearing your search query or switching filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setResultFilter("ALL");
                setAttendanceFilter("ALL");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* ASSESSMENT RECORDS LIST */}
        {!isLoading && filteredAssessments.length > 0 && (
          <>
            {/* MOBILE CARDS VIEW (Visible only on mobile screens < md) */}
            <div className="grid grid-cols-1 gap-4 block md:hidden">
              {filteredAssessments.map((item, index) => {
                const isCleared = item.result === "Cleared";
                const isPresent = item.attendance === "Present";

                return (
                  <div
                    key={index}
                    className={`group relative bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-xs transition-all duration-300 hover:shadow-md flex flex-col justify-between space-y-4 ${isCleared
                        ? "border-slate-200/90 dark:border-slate-800 hover:border-emerald-400/80 dark:hover:border-emerald-500/50"
                        : "border-slate-200/90 dark:border-slate-800 hover:border-rose-400/80 dark:hover:border-rose-500/50"
                      }`}
                  >
                    {/* Top Bar: Result Badge & Attendance */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border shadow-2xs ${isCleared
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
                            : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800"
                          }`}
                      >
                        {isCleared ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        )}
                        <span>{item.result}</span>
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${isPresent
                            ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900"
                          }`}
                      >
                        <span>{item.attendance}</span>
                      </span>
                    </div>

                    {/* Course Name */}
                    <div className="space-y-1 flex-1">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                        {item.course_name}
                      </h3>
                    </div>

                    {/* Details Grid: Timing & Venue */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                      {/* Date & Time */}
                      <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                          <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">{item.date}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{item.start_time} - {item.end_time}</span>
                        </div>
                      </div>

                      {/* Venue Location */}
                      <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                        <span className="font-medium truncate" title={item.venue}>
                          {item.venue}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DESKTOP TABLE VIEW (Visible on desktop/tablet screens >= md) */}
            <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
              <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Course Name</th>
                      <th className="p-3.5">Result Status</th>
                      <th className="p-3.5">Attendance</th>
                      <th className="p-3.5">Test Timing</th>
                      <th className="p-3.5">Venue Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {filteredAssessments.map((item, idx) => {
                      const isCleared = item.result === "Cleared";
                      const isPresent = item.attendance === "Present";
                      return (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-3.5 font-mono text-slate-700 dark:text-slate-300 font-semibold whitespace-nowrap">
                            {item.date}
                          </td>
                          <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">
                            {item.course_name}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-extrabold text-[11px] border ${isCleared
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800"
                                  : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800"
                                }`}
                            >
                              {isCleared ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              {item.result}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-md font-bold text-[11px] border ${isPresent
                                  ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900"
                                  : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900"
                                }`}
                            >
                              {item.attendance}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {item.start_time} - {item.end_time}
                          </td>
                          <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                              <span>{item.venue}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

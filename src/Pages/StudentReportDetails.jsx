import React, { useState, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  BookOpen,
  TrendingUp,
  FileText,
  ShieldAlert,
  Loader2,
  Activity,
  Layers,
  MapPin,
  Sparkles,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  Zap,
  ChevronRight,
  BarChart3,
  Fingerprint,
  FileCheck2,
  LogOut,
  LogIn
} from "lucide-react";
import api, { getAuthenticatedHeaders } from "../api/axios.js";

export default function StudentReportDetails() {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Support both /student-report/:id and /student-report?id=2024UAD1032
  const studentId = paramId || searchParams.get("id") || "";

  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL"); // ALL, Cleared, Not Cleared
  const [leaveSearch, setLeaveSearch] = useState("");
  const [bioSearch, setBioSearch] = useState("");
  const [copiedText, setCopiedText] = useState(null);

  // Fetch student report details from proxy endpoint
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["student-report-page", studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const headers = await getAuthenticatedHeaders().catch(() => ({}));
      const res = await api.get("/ps/student-report/details", {
        params: { id: studentId },
        headers,
      });
      return res.data;
    },
    enabled: !!studentId,
    staleTime: 5 * 60 * 1000,
  });

  const data = responseData?.data || responseData || {};
  const basic = data.basic || {};
  const personalized = data.personalized_skills || {};
  const points = data.points || {};
  const academics = data.academics || {};

  // Extract arrays across possible locations in data structure
  const leaveList = useMemo(() => data.leave || academics.leave || basic.leave || [], [data, academics, basic]);
  const biometricList = useMemo(() => data.biometric || academics.biometric || basic.biometric || [], [data, academics, basic]);
  const attendanceList = useMemo(() => academics.attendance || academics.rows || data.attendance || [], [academics, data]);
  const coursesList = useMemo(() => personalized.courses || personalized.ps_course || [], [personalized]);
  const assessmentList = useMemo(() => personalized.assessment_data || personalized.assessment_logs || [], [personalized]);

  const attendanceObj = basic.attendance || academics.summary || {};
  const attendancePct = parseFloat(basic.attendance_percentage || attendanceObj.attendance_percentage || "0").toFixed(1);

  // Assessment logs filtering
  const filteredAssessments = useMemo(() => {
    let list = assessmentList;
    if (resultFilter !== "ALL") {
      list = list.filter((item) => item.result === resultFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (item) =>
          (item.course_name || "").toLowerCase().includes(q) ||
          (item.venue || "").toLowerCase().includes(q) ||
          (item.date || "").includes(q)
      );
    }
    return list;
  }, [assessmentList, resultFilter, searchTerm]);

  // Leave records filtering
  const filteredLeaves = useMemo(() => {
    if (!leaveSearch.trim()) return leaveList;
    const q = leaveSearch.toLowerCase();
    return leaveList.filter(
      (lv) =>
        (lv.leave_type || lv.type || "").toLowerCase().includes(q) ||
        (lv.remarks || "").toLowerCase().includes(q) ||
        (lv.from_date || "").includes(q) ||
        (lv.to_date || "").includes(q)
    );
  }, [leaveList, leaveSearch]);

  // Biometric records filtering
  const filteredBiometrics = useMemo(() => {
    if (!bioSearch.trim()) return biometricList;
    const q = bioSearch.toLowerCase();
    return biometricList.filter(
      (bio) =>
        (bio.device_name || "").toLowerCase().includes(q) ||
        (bio.date || "").includes(q) ||
        (bio.time || "").includes(q)
    );
  }, [biometricList, bioSearch]);

  // Copy helper
  const handleCopy = (text, label) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(`${label}: ${text}`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Print helper
  const handlePrint = () => {
    window.print();
  };

  if (!studentId) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-800">No Student ID Provided</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
          Please select a valid student card from the User Directory page or provide a valid student ID in the URL.
        </p>
        <button
          onClick={() => navigate("/user-directory")}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-all shadow-md"
        >
          Back to User Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Copy Notification Toast */}
        {copiedText && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-bounce">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Copied {copiedText}</span>
          </div>
        )}

        {/* Top Header Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/user-directory")}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200/60"
              title="Back to User Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                <span className="hover:underline cursor-pointer" onClick={() => navigate("/user-directory")}>
                  User Directory
                </span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-blue-600 font-semibold">Student Detailed Report</span>
              </div>
              <h1 className="text-lg font-bold text-slate-900">
                {basic.name ? `${basic.name} (${studentId})` : `Report for ${studentId}`}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/60 transition-all text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
              title="Refresh Report Data"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-bold transition-all flex items-center gap-2 shadow-xs"
              title="Print Student Report"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-xs animate-pulse">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <h3 className="text-base font-semibold text-slate-700">Loading Student Report...</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Fetching details from PS App server for student <code className="font-bold text-blue-600">{studentId}</code>
            </p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center space-y-4 shadow-xs">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-bold text-red-800">Unable to Fetch Student Report</h3>
            <p className="text-xs sm:text-sm text-red-600 max-w-md mx-auto">
              {error?.response?.data?.message || error?.message || "An error occurred while connecting to the PS report server."}
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => refetch()}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Retry Request
              </button>
              <button
                onClick={() => navigate("/user-directory")}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Back to User Directory
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Student Profile Hero Header Card (100% White Light Theme) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                {/* Left Profile Info */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {basic.profile_url ? (
                    <img
                      src={basic.profile_url}
                      alt={basic.name || "Student"}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-blue-50/80 shadow-md shrink-0 bg-slate-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-blue-600 text-white font-black text-3xl flex items-center justify-center ring-4 ring-blue-50 shadow-md shrink-0">
                      {(basic.name || "S").charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                        {basic.name || studentId}
                      </h1>
                      {basic.status && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
                          {basic.status}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1.5 text-blue-700 font-bold">
                        <GraduationCap className="w-4 h-4 text-blue-600" />
                        {basic.department || "Department N/A"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>Batch: <strong className="text-slate-900">{basic.batch || "N/A"}</strong></span>
                      <span className="text-slate-300">•</span>
                      <span>Year: <strong className="text-slate-900">{basic.year || "N/A"}</strong></span>
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-xs font-mono pt-1">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-sans font-bold">Student ID</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-900 font-bold text-sm">{basic.id || studentId}</strong>
                          <button onClick={() => handleCopy(basic.id || studentId, "Student ID")} className="text-slate-400 hover:text-blue-600">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-sans font-bold">Roll Number</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-900 font-bold text-sm">{basic.roll_no || basic.user_id || "-"}</strong>
                          <button onClick={() => handleCopy(basic.roll_no || basic.user_id, "Roll Number")} className="text-slate-400 hover:text-blue-600">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-sans font-bold">Faculty Mentor</span>
                        <strong className="text-slate-900 font-bold text-sm truncate block">{basic.mentor || "N/A"}</strong>
                      </div>
                    </div>

                    {basic.email && (
                      <div className="flex items-center gap-2 pt-1 text-xs font-medium text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        <a href={`mailto:${basic.email}`} className="text-blue-600 hover:underline font-semibold">
                          {basic.email}
                        </a>
                        {basic.phone && (
                          <>
                            <span className="text-slate-300">•</span>
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-slate-800 font-mono font-bold">{basic.phone}</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Stat Widget Gauge */}
                <div className="flex items-center gap-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 w-full lg:w-auto shrink-0 justify-around lg:justify-start">
                  <div className="text-center space-y-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Overall Attendance
                    </span>
                    <div className="text-3xl sm:text-4xl font-black tracking-tight text-emerald-600">
                      {attendancePct}%
                    </div>
                    <div className="w-36 bg-slate-200 h-2.5 rounded-full overflow-hidden mx-auto mt-2">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(0, attendancePct))}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-600 pt-1 flex justify-between font-medium">
                      <span>Present: <strong className="text-slate-900">{attendanceObj.present || attendanceObj.present_days || "0"}d</strong></span>
                      <span>Absent: <strong className="text-slate-900">{attendanceObj.absent || attendanceObj.absent_days || "0"}d</strong></span>
                    </div>
                  </div>

                  <div className="hidden sm:block border-l border-slate-200 h-20" />

                  <div className="hidden sm:flex flex-col justify-between text-xs space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Leaves</span>
                      <strong className="text-blue-700 text-sm font-extrabold">{leaveList.length} Records</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Biometric Punches</span>
                      <strong className="text-emerald-700 text-sm font-extrabold">{biometricList.length} Logs</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex items-center gap-2 border-t border-slate-100 pt-5 overflow-x-auto no-scrollbar">
                {[
                  { id: "overview", label: "Overview & Academics", icon: Activity },
                  { id: "skills", label: "Personalized Skills & Courses", icon: BookOpen },
                  { id: "points", label: "Points & Leaderboard Ranks", icon: Award },
                  { id: "leaves", label: `Leaves (${leaveList.length}) & Biometrics (${biometricList.length})`, icon: Calendar },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB CONTENT SECTIONS */}

            {/* TAB 1: OVERVIEW & ACADEMICS */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* 4 Summary Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Faculty Mentor</span>
                    <p className="text-base font-bold text-slate-900 truncate" title={basic.mentor}>
                      {basic.mentor || "Not Assigned"}
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Student Role / Type</span>
                    <p className="text-base font-bold text-slate-900 truncate" title={basic.role}>
                      {basic.role || "Student"}
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone</span>
                    <p className="text-base font-bold text-slate-900 font-mono">
                      {basic.phone || "N/A"}
                    </p>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Last Login Time</span>
                    <p className="text-base font-bold text-slate-900 font-mono">
                      {basic.last_login || "-"}
                    </p>
                  </div>
                </div>

                {/* Academics Attendance Table */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Daily Academics Attendance Logs
                      </h3>
                      <p className="text-xs text-slate-500">
                        Detailed session status breakdown (Sessions 1 through 7)
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 shrink-0">
                      Total {attendanceList.length} Recorded Days
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px] tracking-wider">
                        <tr>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5">Overall Session</th>
                          <th className="p-3.5">Session Breakdown (1 to 7)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {attendanceList.map((row, i) => {
                          const isPresent = row.status === "Present" || row.overall === "Present";
                          const isHalfDay = row.overall?.includes("Half Day");
                          return (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3.5 font-mono font-semibold text-slate-900">{row.date}</td>
                              <td className="p-3.5">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] border ${
                                  isPresent
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : isHalfDay
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}>
                                  {isPresent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                  {row.status || row.overall || "N/A"}
                                </span>
                              </td>
                              <td className="p-3.5 text-slate-600">{row.overall || "-"}</td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-1.5 font-mono">
                                  {(row.sessions || []).map((s, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] shadow-xs ${
                                        s === "P"
                                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                          : "bg-red-100 text-red-800 border border-red-200"
                                      }`}
                                      title={`Session ${sIdx + 1}: ${s === "P" ? "Present" : "Absent"}`}
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PERSONALIZED SKILLS & COURSES */}
            {activeTab === "skills" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Metrics Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Assessments</span>
                    <span className="text-3xl font-black text-slate-900 mt-1 block">
                      {personalized.summary?.assessments || assessmentList.length}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cleared Assessments</span>
                    <span className="text-3xl font-black text-emerald-600 mt-1 block">
                      {personalized.summary?.cleared || assessmentList.filter(a => a.result === "Cleared").length}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs text-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Courses</span>
                    <span className="text-3xl font-black text-blue-600 mt-1 block">
                      {personalized.summary?.registered || coursesList.length}
                    </span>
                  </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Assessment History ({filteredAssessments.length})
                    </h3>

                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search Input */}
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search course name or venue..."
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>

                      {/* Result Filter */}
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium">
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <select
                          value={resultFilter}
                          onChange={(e) => setResultFilter(e.target.value)}
                          className="bg-transparent text-slate-700 focus:outline-none cursor-pointer"
                        >
                          <option value="ALL">All Results</option>
                          <option value="Cleared">Cleared Only</option>
                          <option value="Not Cleared">Not Cleared Only</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Assessment Records Table */}
                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px] tracking-wider sticky top-0 z-10">
                        <tr>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Course Name</th>
                          <th className="p-3.5">Result Status</th>
                          <th className="p-3.5">Timing</th>
                          <th className="p-3.5">Venue Location</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredAssessments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                              No assessment records match your current search/filter.
                            </td>
                          </tr>
                        ) : (
                          filteredAssessments.map((item, idx) => {
                            const isCleared = item.result === "Cleared";
                            return (
                              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3.5 font-mono text-slate-700 whitespace-nowrap">{item.date}</td>
                                <td className="p-3.5 font-bold text-slate-900">{item.course_name}</td>
                                <td className="p-3.5">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[11px] border ${
                                    isCleared
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-red-50 text-red-700 border-red-200"
                                  }`}>
                                    {isCleared ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                    {item.result}
                                  </span>
                                </td>
                                <td className="p-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                                  {item.start_time} - {item.end_time}
                                </td>
                                <td className="p-3.5 text-slate-700 flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {item.venue}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Courses Progress Cards */}
                {coursesList.length > 0 && (
                  <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-600" />
                      Courses Clearance Progress ({coursesList.length})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
                      {coursesList.map((crs, idx) => {
                        const cleared = parseInt(crs.cleared || crs.levels_cleared || "0");
                        const total = parseInt(crs.levels || "1");
                        const pct = Math.min(100, Math.round((cleared / (total || 1)) * 100));
                        return (
                          <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-xs text-slate-900 truncate" title={crs.course_name || crs.name}>
                                {crs.course_name || crs.name}
                              </span>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
                                {crs.category}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                              <span>Levels Cleared: <strong className="text-slate-900">{cleared} / {total}</strong></span>
                              <span className="text-blue-600 font-bold">{pct}%</span>
                            </div>

                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: POINTS & LEADERBOARD RANKS */}
            {activeTab === "points" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Wallets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(points.wallets || []).map((w) => (
                    <div key={w.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-2 relative overflow-hidden">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{w.name}</span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl sm:text-4xl font-black text-indigo-600">
                          {parseFloat(w.points || "0").toLocaleString()}
                        </span>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                          Rank #{w.rank || "N/A"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Ranks Grid */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    Category Ranks Breakdown
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(points.ranks || []).map((rk, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                          <span className="truncate pr-2" title={rk.category_name}>{rk.category_name}</span>
                          <span className="text-amber-600 shrink-0 font-extrabold">#{rk.rank_position}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-1">
                          <span>Points: <strong>{parseFloat(rk.points || "0").toFixed(0)}</strong></span>
                          <span>Total Users: <strong>{rk.total_users}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Points Transactions History ({(points.transactions || []).length})
                  </h3>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px] tracking-wider sticky top-0 z-10">
                        <tr>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Title & Description</th>
                          <th className="p-3.5">Category</th>
                          <th className="p-3.5">Points Earned</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {(points.transactions || []).map((tx, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">{tx.date}</td>
                            <td className="p-3.5">
                              <div className="font-bold text-slate-900">{tx.title}</div>
                              <div className="text-[11px] text-slate-500 truncate max-w-sm">{tx.description}</div>
                            </td>
                            <td className="p-3.5 text-slate-700">{tx.category_name}</td>
                            <td className="p-3.5 font-bold font-mono text-emerald-600 text-sm whitespace-nowrap">
                              +{parseFloat(tx.points || "0").toFixed(1)} {tx.points_name}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: LEAVES & BIOMETRICS */}
            {activeTab === "leaves" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Leaves & Gate Out Table Section */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <FileCheck2 className="w-5 h-5 text-blue-600" />
                        Leave & Gate Pass Requests ({filteredLeaves.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Official leave applications, reasons, durations, and gate logs
                      </p>
                    </div>

                    {/* Search Leave Input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={leaveSearch}
                        onChange={(e) => setLeaveSearch(e.target.value)}
                        placeholder="Search leave reason or date..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[10px] tracking-wider sticky top-0 z-10">
                        <tr>
                          <th className="p-3.5">Leave Type</th>
                          <th className="p-3.5">From - To Date</th>
                          <th className="p-3.5">Duration</th>
                          <th className="p-3.5">Remarks / Reason</th>
                          <th className="p-3.5">Gate Out / In Timestamps</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredLeaves.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                              No leave records found.
                            </td>
                          </tr>
                        ) : (
                          filteredLeaves.map((lv, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3.5">
                                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-200 whitespace-nowrap">
                                  {lv.leave_type || lv.type || "Leave"}
                                </span>
                              </td>
                              <td className="p-3.5 font-mono text-slate-800 whitespace-nowrap">
                                <span className="font-semibold">{lv.from_date || lv.from_leave}</span> <br />
                                <span className="text-slate-400 text-[11px]">to {lv.to_date || lv.to_leave}</span>
                              </td>
                              <td className="p-3.5 font-bold text-slate-900 whitespace-nowrap">
                                {lv.duration || "1"} days
                              </td>
                              <td className="p-3.5 text-slate-700 max-w-xs">{lv.remarks || "-"}</td>
                              <td className="p-3.5 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                                <div className="flex items-center gap-1 text-slate-800">
                                  <LogOut className="w-3 h-3 text-amber-600" />
                                  <span>Out: <strong>{lv.gate_out && lv.gate_out !== "-" ? lv.gate_out : "-"}</strong></span>
                                </div>
                                <div className="flex items-center gap-1 text-slate-800 mt-0.5">
                                  <LogIn className="w-3 h-3 text-emerald-600" />
                                  <span>In: <strong>{lv.gate_in && lv.gate_in !== "-" ? lv.gate_in : "-"}</strong></span>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Biometrics Punch Grid & Search */}
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                        <Fingerprint className="w-5 h-5 text-emerald-600" />
                        Biometric Fingerprint Punch Logs ({filteredBiometrics.length})
                      </h3>
                      <p className="text-xs text-slate-500">
                        Attendance punch logs recorded across campus biometrics devices & gates
                      </p>
                    </div>

                    {/* Biometrics Search Input */}
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={bioSearch}
                        onChange={(e) => setBioSearch(e.target.value)}
                        placeholder="Filter by device or date..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {filteredBiometrics.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 italic bg-slate-50 rounded-2xl border border-slate-200">
                      No biometric log entries found matching filter.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1">
                      {filteredBiometrics.map((bio, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 transition-all"
                        >
                          <div className="space-y-0.5 min-w-0 pr-2">
                            <span className="font-bold text-slate-900 block truncate" title={bio.device_name}>
                              {bio.device_name}
                            </span>
                            <span className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {bio.date}
                            </span>
                          </div>
                          <span className="font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-xl text-xs border border-emerald-200 shrink-0">
                            {bio.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

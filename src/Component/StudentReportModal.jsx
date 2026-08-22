import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  X,
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
  ChevronRight
} from "lucide-react";
import api, { getAuthenticatedHeaders } from "../api/axios.js";

export default function StudentReportModal({ studentId, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch report details
  const {
    data: reportData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["student-report-details", studentId],
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

  if (!studentId) return null;

  const data = reportData?.data || reportData || {};
  const basic = data.basic || {};
  const personalized = data.personalized_skills || {};
  const points = data.points || {};
  const academics = data.academics || {};

  const attendanceObj = basic.attendance || academics.summary || {};
  const attendancePct = parseFloat(basic.attendance_percentage || attendanceObj.attendance_percentage || "0").toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shrink-0">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {isLoading ? (
            <div className="flex items-center gap-4 animate-pulse py-4">
              <div className="w-20 h-20 rounded-2xl bg-white/10 shrink-0" />
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-white/10 rounded w-1/3" />
                <div className="h-4 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ) : isError ? (
            <div className="py-4 text-center space-y-2">
              <ShieldAlert className="w-10 h-10 text-red-400 mx-auto" />
              <p className="text-sm font-semibold text-red-200">
                Failed to load student report details
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
              {/* Student Profile Info */}
              <div className="flex items-center gap-5">
                {basic.profile_url ? (
                  <img
                    src={basic.profile_url}
                    alt={basic.name || "Student"}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg shrink-0 bg-slate-800"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-2xl flex items-center justify-center ring-4 ring-white/10 shadow-lg shrink-0">
                    {(basic.name || "S").charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                      {basic.name || studentId}
                    </h2>
                    {basic.status && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {basic.status}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-indigo-200/90 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-indigo-400" />
                      {basic.department || "N/A"}
                    </span>
                    <span>•</span>
                    <span>Batch: {basic.batch || "N/A"}</span>
                    <span>•</span>
                    <span>Year: {basic.year || "N/A"}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300 pt-1 font-mono">
                    <span>ID: <strong className="text-white">{basic.id || studentId}</strong></span>
                    <span>Roll: <strong className="text-white">{basic.roll_no || basic.user_id || "-"}</strong></span>
                    {basic.email && (
                      <a
                        href={`mailto:${basic.email}`}
                        className="text-blue-300 hover:underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        {basic.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Attendance Pill Metric */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 min-w-[200px] shrink-0 text-center space-y-1">
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider block">
                  Overall Attendance
                </span>
                <div className="text-3xl font-black tracking-tight text-emerald-400">
                  {attendancePct}%
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, attendancePct))}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-300 pt-1 flex justify-between font-medium">
                  <span>Present: {attendanceObj.present || attendanceObj.present_days || "0"}d</span>
                  <span>Absent: {attendanceObj.absent || attendanceObj.absent_days || "0"}d</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          {!isLoading && !isError && (
            <div className="flex items-center gap-2 mt-6 border-t border-white/10 pt-4 overflow-x-auto no-scrollbar">
              {[
                { id: "overview", label: "Overview & Academics", icon: Activity },
                { id: "skills", label: "Personalized Skills", icon: BookOpen },
                { id: "points", label: "Points & Ranks", icon: Award },
                { id: "leaves", label: "Leaves & Biometrics", icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-white text-slate-900 shadow-md"
                        : "bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-950 space-y-6">
          {isLoading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Fetching student report data...
              </p>
            </div>
          ) : isError ? (
            <div className="py-12 text-center space-y-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {error?.response?.data?.message || error?.message || "Could not retrieve student details."}
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW & ACADEMICS */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Basic Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Mentor</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {basic.mentor || "Not Assigned"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Role / Group</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {basic.role || "Student"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Phone</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {basic.phone || "N/A"}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Last Login</span>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                        {basic.last_login || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Attendance Log Table */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        Academics Attendance Log
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {(academics.attendance || []).length} Records
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold text-[10px]">
                          <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Overall</th>
                            <th className="p-3">Sessions (1 - 7)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                          {(academics.attendance || []).slice(0, 15).map((row, i) => {
                            const isPresent = row.status === "Present" || row.overall === "Present";
                            const isHalfDay = row.overall?.includes("Half Day");
                            return (
                              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-3 font-mono font-semibold text-slate-800 dark:text-slate-200">{row.date}</td>
                                <td className="p-3">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[11px] ${
                                    isPresent
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                      : isHalfDay
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                      : "bg-red-500/10 text-red-600 dark:text-red-400"
                                  }`}>
                                    {isPresent ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                    {row.status || row.overall || "N/A"}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-600 dark:text-slate-400">{row.overall || "-"}</td>
                                <td className="p-3">
                                  <div className="flex items-center gap-1 font-mono text-[11px]">
                                    {(row.sessions || []).map((s, sIdx) => (
                                      <span
                                        key={sIdx}
                                        className={`w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] ${
                                          s === "P"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                                            : "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400"
                                        }`}
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

              {/* TAB 2: PERSONALIZED SKILLS */}
              {activeTab === "skills" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Skills Summary Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Assessments</span>
                      <span className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-1 block">
                        {personalized.summary?.assessments || "0"}
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Cleared Assessments</span>
                      <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                        {personalized.summary?.cleared || "0"}
                      </span>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Courses</span>
                      <span className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1 block">
                        {personalized.summary?.registered || "0"}
                      </span>
                    </div>
                  </div>

                  {/* Assessments Table */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-500" />
                        Assessment Records
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {(personalized.assessment_data || []).length} Records
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold text-[10px]">
                          <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Course Name</th>
                            <th className="p-3">Result</th>
                            <th className="p-3">Timing</th>
                            <th className="p-3">Venue</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                          {(personalized.assessment_data || []).map((item, idx) => {
                            const isCleared = item.result === "Cleared";
                            return (
                              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-3 font-mono text-slate-700 dark:text-slate-300">{item.date}</td>
                                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{item.course_name}</td>
                                <td className="p-3">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${
                                    isCleared
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                  }`}>
                                    {isCleared ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                    {item.result}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                                  {item.start_time} - {item.end_time}
                                </td>
                                <td className="p-3 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  {item.venue}
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

              {/* TAB 3: POINTS & RANKS */}
              {activeTab === "points" && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Wallets */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(points.wallets || []).map((w) => (
                      <div key={w.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{w.name}</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                            {parseFloat(w.points || "0").toLocaleString()}
                          </span>
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            Rank #{w.rank || "N/A"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ranks Breakdown */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      Category Ranks
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {(points.ranks || []).map((rk, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
                            <span className="truncate" title={rk.category_name}>{rk.category_name}</span>
                            <span className="text-amber-500 shrink-0">#{rk.rank_position}</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            <span>Points: {parseFloat(rk.points || "0").toFixed(0)}</span>
                            <span>Total Users: {rk.total_users}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      Recent Points Transactions
                    </h3>

                    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold text-[10px]">
                          <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Title / Description</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                          {(points.transactions || []).slice(0, 15).map((tx, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">{tx.date}</td>
                              <td className="p-3">
                                <div className="font-bold text-slate-900 dark:text-slate-100">{tx.title}</div>
                                <div className="text-[11px] text-slate-500 truncate max-w-sm">{tx.description}</div>
                              </td>
                              <td className="p-3 text-slate-600 dark:text-slate-400">{tx.category_name}</td>
                              <td className="p-3 font-bold font-mono text-emerald-600 dark:text-emerald-400">
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
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* Leaves Table */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      Leave & Onduty Records
                    </h3>

                    <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase font-semibold text-[10px]">
                          <tr>
                            <th className="p-3">Type</th>
                            <th className="p-3">From - To</th>
                            <th className="p-3">Duration</th>
                            <th className="p-3">Remarks</th>
                            <th className="p-3">Gate Times</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                          {(academics.leave || []).map((lv, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px]">
                                  {lv.leave_type || lv.type}
                                </span>
                              </td>
                              <td className="p-3 font-mono text-slate-700 dark:text-slate-300">
                                {lv.from_date} <br />
                                <span className="text-slate-400">to {lv.to_date}</span>
                              </td>
                              <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{lv.duration} days</td>
                              <td className="p-3 text-slate-600 dark:text-slate-400">{lv.remarks || "-"}</td>
                              <td className="p-3 font-mono text-[11px] text-slate-500">
                                Out: {lv.gate_out || "-"} <br />
                                In: {lv.gate_in || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Biometric Scans */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      Recent Biometric Logs
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {(academics.biometric || []).slice(0, 18).map((bio, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{bio.device_name}</span>
                            <span className="text-slate-400 font-mono text-[11px]">{bio.date}</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md text-[11px]">
                            {bio.time}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

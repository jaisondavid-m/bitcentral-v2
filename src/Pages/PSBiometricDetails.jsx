import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Fingerprint,
  Calendar,
  Clock,
  Search,
  RefreshCw,
  Building,
  LoaderCircle
} from "lucide-react";
import api, { getAuthenticatedHeaders } from "../api/axios";
import { useAuth } from "../context/StudentContext";

export default function PSBiometricDetails() {
  const { rollNo: studentRollNo } = useAuth();
  const activeUserId = studentRollNo || "2025UCS1023";
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: apiResponse,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["ps-biometric-details", activeUserId],
    queryFn: async () => {
      try {
        const headers = await getAuthenticatedHeaders().catch(() => ({}));
        const res = await api.get("/ps/biometrics", {
          params: activeUserId ? { id: activeUserId } : {},
          headers,
        });
        return res.data;
      } catch (err) {
        console.warn("Biometric API fetch failed.", err);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const biometricLogs = useMemo(() => {
    const list = apiResponse?.biometric;
    if (list && Array.isArray(list)) {
      return list;
    }
    return [];
  }, [apiResponse]);

  const uniqueDaysCount = useMemo(() => {
    const valid = biometricLogs.filter(b => b.date && b.date !== "-");
    return new Set(valid.map(b => b.date)).size;
  }, [biometricLogs]);

  const uniqueDevicesCount = useMemo(() => {
    const valid = biometricLogs.filter(b => b.device_name && b.device_name !== "Loading..");
    return new Set(valid.map(b => b.device_name)).size;
  }, [biometricLogs]);

  const filteredBiometricLogs = useMemo(() => {
    if (!searchTerm.trim()) return biometricLogs;
    const q = searchTerm.toLowerCase();
    return biometricLogs.filter(
      (b) =>
        b.device_name?.toLowerCase().includes(q) ||
        b.date?.includes(q) ||
        b.time?.includes(q)
    );
  }, [biometricLogs, searchTerm]);

  // Group logs by Date to make different dates distinct
  const groupedLogs = useMemo(() => {
    const map = new Map();
    filteredBiometricLogs.forEach((item) => {
      const d = item.date || "Unknown Date";
      if (!map.has(d)) {
        map.set(d, []);
      }
      map.get(d).push(item);
    });
    return Array.from(map.entries());
  }, [filteredBiometricLogs]);

  // Loading state screen
  if (isLoading || (isFetching && !apiResponse)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <LoaderCircle className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                Fetching Biometric Logs...
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 shadow-xs animate-pulse space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-6 shadow-xs animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">

        {/* Top Actions & Refresh Bar */}
        <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
              <Fingerprint className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Biometric Logs
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Fingerprint scan records & device history
              </p>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all border border-slate-200 dark:border-slate-700 disabled:opacity-50 flex items-center gap-1.5 text-xs font-semibold shrink-0"
            title="Refresh Scans"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Stats Summary Cards (Biometric Metrics Only) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Total Scans
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
              {biometricLogs.filter(b => b.date !== "-").length}
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Punch-in records
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Active Days
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {uniqueDaysCount}
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Scanned dates
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
              Devices Used
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400">
              {uniqueDevicesCount}
            </div>
            <span className="text-[10px] text-slate-400 font-medium block">
              Scanner units
            </span>
          </div>
        </div>

        {/* Search Bar Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-xs">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by date or device name..."
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Grouped Biometric Scans Container */}
        <div className="space-y-4">
          {groupedLogs.map(([dateString, logsForDate]) => (
            <div
              key={dateString}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xs"
            >
              {/* Date Header */}
              <div className="px-4 sm:px-6 py-3 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    {dateString}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
                  {logsForDate.length} {logsForDate.length === 1 ? "Scan" : "Scans"}
                </span>
              </div>

              {/* Items for this Date */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {logsForDate.map((item, idx) => {
                  return (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                          <Building className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.device_name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-[11px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                        <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        <span className="font-mono">{item.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {groupedLogs.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-12 text-center text-slate-400 text-xs shadow-xs">
              {searchTerm ? `No biometric records match "${searchTerm}".` : "No biometric logs available."}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

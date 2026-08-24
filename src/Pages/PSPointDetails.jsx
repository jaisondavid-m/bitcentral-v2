import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Award,
  TrendingUp,
  Search,
  Sparkles,
  RefreshCw,
  Trophy,
  Wallet,
  Star,
  CheckCircle2
} from "lucide-react";
import api, { getAuthenticatedHeaders } from "../api/axios";
import { useAuth } from "../context/StudentContext";

const FALLBACK_WALLETS = [
  {
    id: "1",
    name: "Activity Points",
    points: "0",
    points_name: "Activity Points",
    rank: "-",
    total_points: "0"
  },
  {
    id: "6",
    name: "Opportunity Points",
    points: "0",
    points_name: "Opportunity Points",
    rank: "-",
    total_points: "0"
  },
  {
    id: "5",
    name: "Responsive Score",
    points: "0",
    points_name: "Responsive Score",
    rank: "-",
    total_points: "0"
  }
];

export default function PSPointDetails() {
  const { rollNo: studentRollNo } = useAuth();
  const activeUserId = studentRollNo || "2025UCS1023";
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["ps-points-details", activeUserId],
    queryFn: async () => {
      try {
        const headers = await getAuthenticatedHeaders().catch(() => ({}));
        const res = await api.get("/ps/points", {
          params: activeUserId ? { id: activeUserId } : {},
          headers,
        });
        return res.data;
      } catch (err) {
        console.warn("Points API fetch failed, using local dataset fallback.", err);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const studentBasic = apiResponse?.student || {
    name: activeUserId === "2025UCS1023" ? "JAISON DAVID M" : "Student",
    id: activeUserId,
    department: "Computer Science and Engineering",
    batch: "2025 - 2029"
  };

  const walletList = useMemo(() => {
    const list = apiResponse?.wallets;
    if (list && Array.isArray(list) && list.length > 0) {
      return list;
    }
    return FALLBACK_WALLETS;
  }, [apiResponse]);

  const filteredWallets = useMemo(() => {
    if (!searchTerm.trim()) return walletList;
    const q = searchTerm.toLowerCase();
    return walletList.filter(
      (w) =>
        w.name?.toLowerCase().includes(q) ||
        w.points_name?.toLowerCase().includes(q)
    );
  }, [walletList, searchTerm]);

  const totalSum = useMemo(() => {
    return walletList.reduce((acc, w) => acc + (parseFloat(w.points) || 0), 0);
  }, [walletList]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Wallet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {walletList.map((wallet) => {
            const pointsVal = parseFloat(wallet.points || 0);
            return (
              <div
                key={wallet.id || wallet.name}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all space-y-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {wallet.name || wallet.points_name}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">Points</span>
                    <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                      {pointsVal.toFixed(2)}
                    </span>
                  </div>

                  {wallet.rank && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-medium block uppercase tracking-wider">
                        Rank
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 inline-block">
                        #{wallet.rank}
                      </span>
                    </div>
                  )}
                </div>

                
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from "react";
import { Filter, Loader2, Trophy, X, ChevronDown, Check } from "lucide-react";
import api from "@/api/axios.js";
import { useAuth } from "@/context/StudentContext";

const YEARS = ["I", "II", "III", "IV"];

const DEPARTMENTS = [
    { code: "", name: "All Departments" },
    { code: "CSE", name: "Computer Science & Engineering" },
    { code: "IT", name: "Information Technology" },
    { code: "AI&DS", name: "AI & Data Science" },
    { code: "AIML", name: "AI & Machine Learning" },
    { code: "AGRI", name: "Agricultural Engineering" },
    { code: "ECE", name: "Electronics & Communication" },
    { code: "EEE", name: "Electrical & Electronics" },
    { code: "MTRS", name: "Mechatronics" },
    { code: "EIE", name: "Electronics & Instrumentation" },
    { code: "BT", name: "Biotechnology" },
    { code: "MECH", name: "Mechanical Engineering" },
    { code: "CIVIL", name: "Civil Engineering" },
    { code: "CSBS", name: "CS & Business Systems" },
    { code: "CSD", name: "CS & Design" },
    { code: "CT", name: "Computer Technology" },
    { code: "FT", name: "Fashion Technology" },
    { code: "ISE", name: "Information Science & Engineering" },
    { code: "BIOMEDICAL", name: "Biomedical Engineering" },
];

function getRankClass(index) {
    if (index === 0) return "bg-gradient-to-br from-amber-300 to-orange-500 text-slate-950";
    if (index === 1) return "bg-gradient-to-br from-slate-200 to-slate-400 text-slate-950";
    if (index === 2) return "bg-gradient-to-br from-blue-500 to-cyan-500 text-white";
    return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
}

export default function Leaderboard({ onClose }) {
    const { student } = useAuth();
    const [draftYear, setDraftYear] = useState("");
    const [draftDept, setDraftDept] = useState("");
    const [students, setStudents] = useState(null);
    const [averages, setAverages] = useState({});
    const [avgLoading, setAvgLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [applied, setApplied] = useState(false);
    const [appliedYear, setAppliedYear] = useState("");
    const [appliedDept, setAppliedDept] = useState("");
    const [deptOpen, setDeptOpen] = useState(false);
    const [deptSearch, setDeptSearch] = useState("");
    const selectedDept = DEPARTMENTS.find((d) => d.code === draftDept);

    const canApply = Boolean(draftYear || draftDept);

    useEffect(() => {
        const fetchAverages = async () => {
            setAvgLoading(true);
            try {
                const res = await api.get("/averages");
                setAverages(res?.data?.averages || {});
            } catch {
                setAverages({});
            } finally {
                setAvgLoading(false);
            }
        };

        fetchAverages();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (student?.batch) {
            let yearToSet = "";
            if (student.batch.includes("2025")) {
                yearToSet = "II";
            } else if (student.batch.includes("2024")) {
                yearToSet = "III";
            } else if (student.batch.includes("2023")) {
                yearToSet = "IV";
            }

            if (yearToSet) {
                setDraftYear(yearToSet);
                setAppliedYear(yearToSet);
                setApplied(true);
                setLoading(true);

                // Fetch leaderboard for default year
                const fetchDefaultLeaderboard = async () => {
                    try {
                        const res = await api.get(`/top10?year=${yearToSet}`);
                        setStudents(res?.data?.data || []);
                    } catch {
                        setStudents([]);
                    } finally {
                        setLoading(false);
                    }
                };

                fetchDefaultLeaderboard();
            }
        }
    }, [student?.batch]);

    const handleApply = async () => {
        setLoading(true);
        setApplied(true);
        setAppliedYear(draftYear);
        setAppliedDept(draftDept);

        try {
            const params = new URLSearchParams();
            if (draftYear) params.append("year", draftYear);
            if (draftDept) params.append("dept", draftDept);

            const res = await api.get(`/top10?${params.toString()}`);
            setStudents(res?.data?.data || []);
        } catch {
            setStudents([]);
        } finally {
            setLoading(false);
            setShowFilters(false);
        }
    };

    const handleReset = () => {
        setDraftYear("");
        setDraftDept("");
        setApplied(false);
        setAppliedYear("");
        setAppliedDept("");
        setStudents(null);
    };
    const filteredDepartments = useMemo(() => {
        if (!deptSearch) return DEPARTMENTS;

        const search = deptSearch.toLowerCase();

        return [...DEPARTMENTS]
            .filter((d) => d.name.toLowerCase().includes(search))
            .sort((a, b) => {
                const aName = a.name.toLowerCase();
                const bName = b.name.toLowerCase();
                
                if (aName === search) return -1;
                if (bName === search) return 1;

                const aStarts = aName.startsWith(search);
                const bStarts = bName.startsWith(search);

                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return aName.length - bName.length;
            });
    }, [deptSearch]);

    const appliedDeptName =
        DEPARTMENTS.find((d) => d.code === appliedDept)?.name || "All Departments";

    const summary = useMemo(() => {
        if (!applied) return "No filters applied";
        return `${appliedYear ? `Year ${appliedYear}` : "All Years"} • ${appliedDeptName}`;
    }, [applied, appliedYear, appliedDeptName]);

    const averageItems = useMemo(
        () => [
            { key: "year_1", label: "I", value: averages?.year_1 ?? "0" },
            { key: "year_2", label: "II", value: averages?.year_2 ?? "0" },
            { key: "year_3", label: "III", value: averages?.year_3 ?? "0" },
            { key: "year_4", label: "IV", value: averages?.year_4 ?? "0" },
        ],
        [averages]
    );

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-zinc-900 bg-white text-zinc-900 shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:text-zinc-50 dark:shadow-[4px_4px_0px_#ffffff]">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-900 bg-blue-50/70 px-5 py-4 dark:border-white dark:bg-zinc-800/80 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-900 bg-blue-600 text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 hidden lg:block">
                        <h2 className="truncate text-xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
                            Leaderboard
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowFilters((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-900 bg-white px-3 py-2 text-sm font-bold text-blue-700 shadow-[2px_2px_0px_#18181b] hover:bg-blue-50 dark:border-white dark:bg-zinc-800 dark:text-blue-300 dark:shadow-[2px_2px_0px_#ffffff] lg:hidden cursor-pointer"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-900 bg-white text-zinc-700 shadow-[2px_2px_0px_#18181b] hover:bg-blue-50 hover:text-blue-700 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[2px_2px_0px_#ffffff] cursor-pointer"
                            aria-label="Close leaderboard"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className={`${showFilters ? "block" : "hidden lg:block"} space-y-4`}>
                    <div className="rounded-xl border border-zinc-900 bg-blue-50/40 p-4 dark:border-white dark:bg-zinc-800/60 shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#ffffff]">
                        <p className="mb-2 text-[11px] font-black uppercase tracking-[0.24em] text-zinc-600 dark:text-zinc-300">
                            Year
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {YEARS.map((y) => {
                                const active = draftYear === y;
                                return (
                                    <button
                                        key={y}
                                        onClick={() => setDraftYear(y === draftYear ? "" : y)}
                                        className={`rounded-lg px-3 py-2 text-sm font-black transition-all cursor-pointer ${active
                                            ? "bg-blue-600 text-white border border-zinc-900 dark:border-white shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#ffffff]"
                                            : "border border-zinc-900 bg-white text-zinc-800 hover:bg-blue-50 dark:border-white dark:bg-zinc-800 dark:text-zinc-200"
                                            }`}
                                    >
                                        Year {y}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-900 bg-blue-50/40 p-4 dark:border-white dark:bg-zinc-800/60 shadow-[2px_2px_0px_#18181b] dark:shadow-[2px_2px_0px_#ffffff]">
                        <label className="mb-2 block text-[11px] font-black uppercase tracking-[0.24em] text-zinc-600 dark:text-zinc-300">
                            Department
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDeptOpen((v) => !v)}
                                className="w-full flex items-center justify-between rounded-lg border border-zinc-900 bg-white px-3 py-2 text-sm font-bold text-zinc-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                            >
                                <span className="truncate">
                                    {selectedDept?.name || "All Departments"}
                                </span>
                                <ChevronDown
                                    className={`h-4 w-4 transition ${deptOpen ? "rotate-180" : ""}`}
                                />
                            </button>

                            {/* Dropdown */}
                            {deptOpen && (
                                <div className="absolute z-50 mt-2 w-full rounded-xl border border-zinc-900 bg-white shadow-[4px_4px_0px_#18181b] dark:bg-[#111827] dark:border-white dark:shadow-[4px_4px_0px_#ffffff] animate-in fade-in zoom-in-95 overflow-hidden">
                                    {/* Search */}
                                    <input
                                        placeholder="Search department..."
                                        onChange={(e) => setDeptSearch(e.target.value)}
                                        className="w-full border-b border-zinc-900 px-3 py-2 text-sm font-bold outline-none dark:bg-zinc-800 dark:border-white text-zinc-900 dark:text-white"
                                    />

                                    {/* Options */}
                                    <div className="max-h-60 overflow-y-auto">
                                        {filteredDepartments.map((d) => (
                                            <button
                                                key={d.code || "__all"}
                                                onClick={() => {
                                                    setDraftDept(d.code);
                                                    setDeptOpen(false);
                                                }}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold transition cursor-pointer ${draftDept === d.code
                                                    ? "bg-blue-600 text-white font-black"
                                                    : "text-zinc-700 hover:bg-blue-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
                                                    }`}
                                            >
                                                {d.name}
                                                {draftDept === d.code && <Check className="h-4 w-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-4 space-y-2">
                            <button
                                onClick={handleApply}
                                disabled={!canApply || loading}
                                className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-900 bg-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
                            >
                                Show Results
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full rounded-xl border border-zinc-900 bg-white px-4 py-2.5 text-sm font-bold text-zinc-700 shadow-[2px_2px_0px_#18181b] hover:bg-blue-50 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:text-blue-300">Year</p>
                            <p className="mt-1 text-base font-black text-zinc-900 dark:text-white">{applied ? (appliedYear ? `Year ${appliedYear}` : "All") : "—"}</p>
                        </div>
                        <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:text-blue-300">Department</p>
                            <p className="mt-1 truncate text-base font-black text-zinc-900 dark:text-white">{applied ? appliedDeptName : "—"}</p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-blue-700 dark:text-blue-300">
                                Year Averages
                            </p>
                            {avgLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-300" />}
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {averageItems.map((item) => (
                                <div
                                    key={item.key}
                                    className="rounded-lg border border-zinc-900 bg-blue-50/70 px-2 py-2 text-center dark:border-white dark:bg-zinc-800/80 shadow-[1px_1px_0px_#18181b] dark:shadow-[1px_1px_0px_#ffffff]"
                                >
                                    <p className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400">Year {item.label}</p>
                                    <p className="mt-0.5 text-sm font-black tabular-nums text-zinc-900 dark:text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
                            <div className="flex flex-col items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <p className="text-sm">Fetching leaderboard...</p>
                            </div>
                        </div>
                    ) : !applied ? (
                        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-900 bg-white p-6 text-center text-sm font-bold text-zinc-600 dark:border-white dark:bg-[#111827] dark:text-zinc-400">
                            Select a year or department and press Show Results.
                        </div>
                    ) : students?.length === 0 ? (
                        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-dashed border-zinc-900 bg-white p-6 text-center text-sm font-bold text-zinc-600 dark:border-white dark:bg-[#111827] dark:text-zinc-400">
                            No students found for this filter.
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3 sm:hidden">
                                {students.map((s, i) => (
                                    <article key={`${s.roll_no}-${i}`} className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-900 text-sm font-black shadow-[1px_1px_0px_#18181b] ${getRankClass(i)}`}>
                                                    {i + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-black text-zinc-900 dark:text-white">{s.student_name}</p>
                                                    <p className="mt-1 font-mono text-[11px] font-bold tracking-wide text-zinc-500 dark:text-zinc-400">{s.roll_no}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-black tabular-nums text-blue-600 dark:text-blue-400">{s.balance_points}</p>
                                        </div>
                                        <p className="mt-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400">{s.department}</p>
                                    </article>
                                ))}
                            </div>

                            <div className="hidden rounded-xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] sm:block overflow-hidden">
                                <div className="max-h-105 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600">
                                    <table className="w-full text-left">
                                        <thead className="bg-blue-50/70 border-b border-zinc-900 dark:bg-zinc-800/80 dark:border-white sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-zinc-900 dark:text-white">Rank</th>
                                                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-zinc-900 dark:text-white">Student</th>
                                                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-zinc-900 dark:text-white">Roll No</th>
                                                <th className="px-4 py-3 text-[11px] font-black uppercase tracking-[0.24em] text-zinc-900 dark:text-white">Department</th>
                                                <th className="px-4 py-3 text-right text-[11px] font-black uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                            {students.map((s, i) => (
                                                <tr key={`${s.roll_no}-${i}`} className="transition-colors hover:bg-blue-50/40 dark:hover:bg-zinc-800/40">
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 text-xs font-black shadow-[1px_1px_0px_#18181b] ${getRankClass(i)}`}>
                                                            {i + 1}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-bold text-zinc-900 dark:text-white">{s.student_name}</td>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-600 dark:text-zinc-400">{s.roll_no}</td>
                                                    <td className="px-4 py-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">{s.department}</td>
                                                    <td className="px-4 py-3 text-right text-sm font-black tabular-nums text-blue-600 dark:text-blue-400">{s.balance_points}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

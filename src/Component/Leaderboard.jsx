import React, { useEffect, useMemo, useState } from "react";
import { Filter, Loader2, Trophy, X, ChevronDown, Check } from "lucide-react";
import api from "../api/axios.js";

const YEARS = ["I", "II", "III", "IV"];

const DEPARTMENTS = [
    { code: "", name: "All Departments" },
    { code: "CSE", name: "Computer Science & Engineering" },
    { code: "IT", name: "Information Technology" },
    { code: "AIDS", name: "AI & Data Science" },
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
    const [draftYear, setDraftYear] = useState("");
    const [draftDept, setDraftDept] = useState("");
    const [students, setStudents] = useState(null);
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
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

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

    return (
        <div className="w-full overflow-hidden rounded-3xl border border-blue-100 bg-white text-slate-900 shadow-2xl shadow-blue-900/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
            <div className="flex items-start justify-between gap-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-white px-5 py-4 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20 dark:from-blue-500 dark:to-blue-700">
                        <Trophy className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 hidden lg:block">
                        <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                            Leaderboard
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowFilters((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800 lg:hidden"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-white text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            aria-label="Close leaderboard"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[300px_minmax(0,1fr)]">
                <aside className={`${showFilters ? "block" : "hidden lg:block"} space-y-4`}>
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Year
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {YEARS.map((y) => {
                                const active = draftYear === y;
                                return (
                                    <button
                                        key={y}
                                        onClick={() => setDraftYear(y === draftYear ? "" : y)}
                                        className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${active
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                                            : "border border-blue-100 bg-white text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                                            }`}
                                    >
                                        Year {y}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/70">
                        <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                            Department
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDeptOpen((v) => !v)}
                                className="w-full flex items-center justify-between rounded-xl border border-blue-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition hover:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
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
                                <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg dark:bg-slate-900 dark:border-slate-700 animate-in fade-in zoom-in-95">

                                    {/* Search */}
                                    <input
                                        placeholder="Search department..."
                                        onChange={(e) => setDeptSearch(e.target.value)}
                                        className="w-full border-b border-slate-200 px-3 py-2 text-sm outline-none dark:bg-slate-900 dark:border-slate-700"
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
                                                className={`w-full flex items-center justify-between px-3 py-2 text-sm transition ${draftDept === d.code
                                                    ? "bg-blue-50 text-blue-600 dark:bg-slate-800"
                                                    : "text-slate-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800"
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
                                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 disabled:text-white dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:bg-slate-700 dark:disabled:text-slate-400"
                            >
                                Show Results
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </aside>

                <main className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-blue-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-700/70 dark:text-blue-300/70">Year</p>
                            <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{applied ? (appliedYear ? `Year ${appliedYear}` : "All") : "—"}</p>
                        </div>
                        <div className="rounded-2xl border border-blue-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/70">
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-700/70 dark:text-blue-300/70">Department</p>
                            <p className="mt-1 truncate text-base font-bold text-slate-900 dark:text-white">{applied ? appliedDeptName : "—"}</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex min-h-[16rem] items-center justify-center rounded-3xl border border-blue-100 bg-white dark:border-slate-800 dark:bg-slate-900/60">
                            <div className="flex flex-col items-center gap-2 text-blue-700 dark:text-blue-300">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <p className="text-sm">Fetching leaderboard...</p>
                            </div>
                        </div>
                    ) : !applied ? (
                        <div className="flex min-h-[16rem] items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-white p-6 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                            Select a year or department and press Show Results.
                        </div>
                    ) : students?.length === 0 ? (
                        <div className="flex min-h-[16rem] items-center justify-center rounded-3xl border border-dashed border-blue-200 bg-white p-6 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
                            No students found for this filter.
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3 sm:hidden">
                                {students.map((s, i) => (
                                    <article key={`${s.roll_no}-${i}`} className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-start gap-3">
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${getRankClass(i)}`}>
                                                    {i + 1}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{s.student_name}</p>
                                                    <p className="mt-1 text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400">{s.roll_no}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold tabular-nums text-blue-700 dark:text-blue-300">{s.balance_points}</p>
                                        </div>
                                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{s.department}</p>
                                    </article>
                                ))}
                            </div>

                            <div className="hidden rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:block">
    
    <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-slate-700">
        
        <table className="w-full text-left">
                                        <thead className="bg-blue-50 dark:bg-slate-900 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Rank</th>
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Student</th>
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Roll No</th>
                                                <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Department</th>
                                                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-blue-300">Points</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {students.map((s, i) => (
                                                <tr key={`${s.roll_no}-${i}`} className="border-t border-blue-100 transition-colors hover:bg-blue-50/60 dark:border-slate-800 dark:hover:bg-slate-800/40">
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold ${getRankClass(i)}`}>
                                                            {i + 1}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">{s.student_name}</td>
                                                    <td className="px-4 py-3 font-mono text-sm text-slate-500 dark:text-slate-400">{s.roll_no}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{s.department}</td>
                                                    <td className="px-4 py-3 text-right text-sm font-bold tabular-nums text-blue-700 dark:text-blue-300">{s.balance_points}</td>
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

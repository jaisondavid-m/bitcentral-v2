import React, { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { useAuth } from "../context/StudentContext.jsx";

const COURSE_LABELS = {
  // Current
  "22HS006": "Tamil and Technology",
  "24MB201": "",
  "24IS21":  "",
  "24CS21":  "",
  "22GE004": "",
  "24MB202": "",
  "24CS22":  "",
  "24IS22":  "",
  "22GE003": "Basics of Electrical Engineering",
  "22CD206": "",
  "22CT206": "",
  "24MB203": "",
  "22AI206": "Digital Computer Electronics",
  "22CS206": "Digital Computer Electronics",
  "22IT206": "Digital Computer Electronics",
  "22IS206": "",
  "24CS23":  "",
  "22AM206": "",
  "22MA201": "Engineering Mathematics II",
  // Arrear
  "22MA101": "Engineering Mathematics I",
  "22CB101": "",
  "24MB101": "",
  "22HS003": "",
  "24MB102": "",
  "22HS001": "",
  "24MB104": "",
  "22CH103": "",
  "22CB103": "",
  "24MB103": "",
  "22PH102": "",
  "22CB102": "",
  "24MB105": "",
  "22CB106": "",
  "24MB106": "",
};

const CURRENT_CODES = ["22HS006", "24MB201", "24IS21", "24CS21", "22GE004", "24MB202", "24CS22", "24IS22", "22GE003", "22CD206", "22CT206", "24MB203", "22AI206", "22CS206", "22IT206", "22IS206", "24CS23", "22AM206", "22MA201"];
const ARREAR_CODES  = ["22MA101", "22CB101", "24MB101", "22HS003", "24MB102", "22HS001", "24MB104", "22CH103", "22CB103", "24MB103", "22PH102", "22CB102", "24MB105", "22CB106", "24MB106"];

const ExamHall = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab]           = useState("current");
  const [courseSearch, setCourseSearch]     = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showDropdown, setShowDropdown]     = useState(false);
  const [focusedIndex, setFocusedIndex]     = useState(-1);
  const wrapperRef = useRef(null);

  const [registerNo, setRegisterNo] = useState(() => {
    if (!user?.uid) return "";
    const saved = JSON.parse(
      localStorage.getItem(`home-register-no-${user.uid}`) || "{}"
    );
    return saved.registerNo || "";
  });

  const courseCodes = activeTab === "current" ? CURRENT_CODES : ARREAR_CODES;
  const finalCourse = selectedCourse || courseSearch;

  const switchTab = (tab) => {
    setActiveTab(tab);
    setCourseSearch("");
    setSelectedCourse("");
    setShowDropdown(false);
    setFocusedIndex(-1);
  };

  const clearCourse = () => {
    setCourseSearch("");
    setSelectedCourse("");
    setShowDropdown(false);
    setFocusedIndex(-1);
  };

  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return courseCodes;
    const q = courseSearch.trim().toUpperCase();
    const matches = courseCodes.filter((c) => {
      const label = (COURSE_LABELS[c] || "").toUpperCase();
      return c.includes(q) || label.includes(q);
    });
    if (!courseCodes.includes(q)) return [...matches, q];
    return matches;
  }, [courseSearch, courseCodes]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!showDropdown) setShowDropdown(true);
      setFocusedIndex((i) => Math.min(i + 1, filteredCourses.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && filteredCourses[focusedIndex]) {
        const code = filteredCourses[focusedIndex];
        setSelectedCourse(code);
        setCourseSearch(code);
        setShowDropdown(false);
        setFocusedIndex(-1);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setFocusedIndex(-1);
    }
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["exam-hall", registerNo, finalCourse, activeTab],
    queryFn: async () => {
      const res = await api.get("/exam-hall", {
        params: { registerNo, courseCode: finalCourse.toUpperCase(), type: activeTab },
      });
      return res.data;
    },
    enabled: false,
  });

  const handleSearch = () => {
    if (!registerNo || !finalCourse) return;
    refetch();
  };

  const placeholder = activeTab === "current" ? "e.g. 22HS201" : "e.g. 19CS101";

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-sm">

        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          {/* Icon badge */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-slate-800 dark:text-slate-100">
              Exam hall finder
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              BIT Sathy · Semester exams
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">

          {/* Tabs */}
          <div className="mb-5 flex rounded-xl bg-blue-50 p-1 dark:bg-slate-800">
            {["current", "arrear"].map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-sm font-medium capitalize transition-all duration-150
                  ${activeTab === tab
                    ? "bg-white text-blue-700 shadow-sm dark:bg-slate-700 dark:text-blue-300"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Register Number */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Register number
            </label>
            <input
              type="text"
              value={registerNo}
              onChange={(e) => setRegisterNo(e.target.value)}
              placeholder="e.g. 7376251CS221"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm
                text-slate-800 outline-none ring-0 transition-all
                placeholder:text-slate-300
                focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100
                dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            />
          </div>

          {/* Course Code */}
          <div ref={wrapperRef} className="relative mb-5">
            <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
              Course code
            </label>

            <div className="relative">
              <input
                type="text"
                value={selectedCourse || courseSearch}
                placeholder={placeholder}
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={showDropdown}
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setCourseSearch(e.target.value);
                  setSelectedCourse("");
                  setShowDropdown(true);
                  setFocusedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm
                  text-slate-800 outline-none ring-0 transition-all
                  placeholder:text-slate-300
                  focus:border-blue-400 focus:ring-2 focus:ring-blue-100
                  dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100
                  dark:placeholder:text-slate-600 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
              />
              {(courseSearch || selectedCourse) && (
                <button
                  aria-label="Clear course"
                  onClick={clearCourse}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded text-slate-300
                    hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <ul
                role="listbox"
                aria-label="Course suggestions"
                className="absolute z-20 mt-1.5 max-h-44 w-full overflow-y-auto rounded-xl border
                  border-slate-100 bg-white py-1 shadow-md
                  dark:border-slate-700 dark:bg-slate-800"
              >
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((code, idx) => {
                    const q = courseSearch.trim();
                    const matchIdx = q ? code.indexOf(q) : -1;
                    return (
                      <li
                        key={code}
                        role="option"
                        aria-selected={focusedIndex === idx}
                        onMouseEnter={() => setFocusedIndex(idx)}
                        onClick={() => {
                          setSelectedCourse(code);
                          setCourseSearch(code);
                          setShowDropdown(false);
                          setFocusedIndex(-1);
                        }}
                        className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors
                          ${focusedIndex === idx
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-200 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
                          }`}
                      >
                        <span className="flex flex-col">
                          <span>
                            {matchIdx !== -1 && courseCodes.includes(code) ? (
                              <>
                                {code.slice(0, matchIdx)}
                                <span className="rounded bg-yellow-100 font-medium dark:bg-yellow-900/50">
                                  {code.slice(matchIdx, matchIdx + q.length)}
                                </span>
                                {code.slice(matchIdx + q.length)}
                              </>
                            ) : code}
                          </span>
                          {COURSE_LABELS[code] && (() => {
                            const label = COURSE_LABELS[code];
                            const lq = courseSearch.trim();
                            const li = label.toUpperCase().indexOf(lq.toUpperCase());
                            if (lq && li !== -1) {
                              return (
                                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                  {label.slice(0, li)}
                                  <span className="rounded bg-yellow-100 font-medium dark:bg-yellow-900/50">
                                    {label.slice(li, li + lq.length)}
                                  </span>
                                  {label.slice(li + lq.length)}
                                </span>
                              );
                            }
                            return (
                              <span className="text-[11px] text-slate-400 dark:text-slate-500">
                                {label}
                              </span>
                            );
                          })()}
                        </span>
                        {!courseCodes.includes(code) && (
                          <span className="ml-2 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px]
                            font-medium text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            custom
                          </span>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <li className="px-3 py-2 text-sm text-slate-400 dark:text-slate-500">
                    No matches — press Search to use this code
                  </li>
                )}
              </ul>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            disabled={!registerNo || !finalCourse || isLoading}
            className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-all
              ${!registerNo || !finalCourse || isLoading
                ? "cursor-not-allowed bg-blue-100 text-blue-300 dark:bg-slate-700 dark:text-slate-500"
                : "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] dark:bg-blue-500 dark:hover:bg-blue-600"
              }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Searching...
              </span>
            ) : (
              "Search hall"
            )}
          </button>
        </div>

        {/* Result area — outside the card */}
        <div className="mt-4">
          {!data && !isLoading && !error && (
            <p className="py-2 text-center text-xs text-slate-400 dark:text-slate-600">
              Enter your details above and search
            </p>
          )}

          {data?.success && (
            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-0.5 text-[10px] font-medium uppercase tracking-widest text-blue-400 dark:text-blue-500">
                    Hall number
                  </p>
                  <p className="text-5xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                    {data.hallNo}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-700">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 dark:text-slate-500">Course</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{data.courseCode}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 dark:text-slate-500">Register no.</span>
                    <span className="font-medium text-slate-700 dark:text-slate-200">{registerNo}</span>
                  </div>
                  {data.room && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 dark:text-slate-500">Room</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">{data.room}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5
              dark:border-red-900/40 dark:bg-red-900/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="mt-0.5 h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-red-600 dark:text-red-400">
                No hall found. Check your register number and course code.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ExamHall;
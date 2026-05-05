import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { useAuth } from "../context/StudentContext.jsx";
import Fuse from "fuse.js";

// List of course codes provided
const COURSE_CODES = [
  "22CB604", "22AM006", "22AI036", "22BT004", "22MC011", "22CS012", "22ME041", "22IS024", "22CD012", "22IT012", "22AM035",
  "22CS501", "22EC501", "22BT501", "22IT501", "22BM501", "22CT501", "22AG501", "22CE501", "22IS501", "22CD501", "22FD501", "22TT501", "22AI501", "22EE501", "22ME501", "22MC501",
  "22IT007", "22CB406", "22IS019", "22CD007", "22CS007", "22CT007",
  "22CS301", "22IT301", "22MC301", "22EC301", "22EE301", "22EI301", "22BT301", "22AI301", "22AM301", "22CB301", "22ME301", "22BM301", "22CT301", "22CE301", "22IS301", "22CD301", "22FD301", "22FT301", "22TT301", "22AG301"
];

const ExamHall = () => {
  const { user } = useAuth();
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // 1. Get Register No from LocalStorage (from your Home.jsx logic)
  const registerStoreKey = user?.uid ? `home-register-no-${user.uid}` : "";
  const savedData = JSON.parse(localStorage.getItem(registerStoreKey) || "{}");
  const registerNo = savedData.registerNo || "";

  // 2. Fuzzy Search for Course Codes
  const fuse = useMemo(() => new Fuse(COURSE_CODES, { threshold: 0.3 }), []);
  const filteredCourses = useMemo(() => {
    return courseSearch.trim() === "" ? COURSE_CODES : fuse.search(courseSearch).map(r => r.item);
  }, [courseSearch, fuse]);

  // 3. Fetch Exam Hall Data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["exam-hall", registerNo, selectedCourse],
    queryFn: async () => {
      if (!registerNo || !selectedCourse) return null;
      const res = await api.get(`/exam-hall`, {
        params: { registerNo, courseCode: selectedCourse }
      });
      return res.data;
    },
    enabled: !!(registerNo && selectedCourse),
  });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 dark:bg-black">
      <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-blue-900/50 dark:bg-slate-950">
        <h1 className="mb-6 text-xl font-bold text-gray-800 dark:text-white">Exam Hall Finder</h1>

        {/* Register No Display (Read Only) */}
        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">Register Number</label>
          <input
            type="text"
            readOnly
            value={registerNo || "Not set in profile"}
            className="mt-1 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 outline-none dark:bg-slate-900 dark:text-slate-300"
          />
        </div>

        {/* Searchable Course Code Dropdown */}
        <div className="relative mb-6">
          <label className="block text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">Course Code</label>
          <input
            type="text"
            placeholder="Search Course (e.g. 22CB604)"
            value={selectedCourse || courseSearch}
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setCourseSearch(e.target.value);
              setSelectedCourse("");
              setShowDropdown(true);
            }}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-blue-900 dark:bg-slate-900 dark:text-white"
          />

          {showDropdown && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-blue-900 dark:bg-slate-900">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((code) => (
                  <li
                    key={code}
                    onClick={() => {
                      setSelectedCourse(code);
                      setCourseSearch(code);
                      setShowDropdown(false);
                    }}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-blue-900/30"
                  >
                    {code}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-gray-400">No course found</li>
              )}
            </ul>
          )}
        </div>

        {/* Result Area */}
        <div className="min-h-[120px] rounded-xl bg-blue-50/50 p-4 dark:bg-blue-900/10">
          {isLoading && (
            <div className="flex flex-col items-center justify-center space-y-2 py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-xs text-blue-600">Fetching seating details...</p>
            </div>
          )}

          {!selectedCourse && !isLoading && (
            <p className="text-center text-sm text-gray-500 dark:text-slate-400">Select a course to view your hall.</p>
          )}

          {data?.success && (
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">Your Allotted Hall</span>
              <h2 className="mt-2 text-4xl font-black text-gray-900 dark:text-white">{data.hallNo}</h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">Course: {data.courseCode}</p>
            </div>
          )}

          {error && (
            <div className="text-center">
              <p className="text-sm font-medium text-red-500">Hall information not found.</p>
              <button onClick={() => refetch()} className="mt-2 text-xs text-blue-600 underline">Try again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamHall;
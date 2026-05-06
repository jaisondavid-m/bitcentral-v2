import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { useAuth } from "../context/StudentContext.jsx";
import Fuse from "fuse.js";

const COURSE_CODES = []string{

	// 08-05-2026 FN
	"22CS034", "22EC003", "22IT039", "22AI029", "22BT013",
	"22FD035", "22CT038", "22IS041", "22EE011", "22CD022",
	"22BM022", "22MC027", "22AG016", "22EI009", "22ME020",
	"22CB030", "22CBH03", "22CE015", "22ECH09", "22ME027",
	"22FDH03", "22AGH21", "22CSH03", "22AMM44", "22EEH15",
	"22MEH38", "22BMH34", "22ISH27", "22CDH31", "22BMM34",
	"22BTH30", "22AIH09", "22CEH01", "22ITM48", "22EIH04",
	"22MCH03", "22FTH15", "22ITH03", "22CTH03", "22AMH32",

	// 08-05-2026 AN
	"22EC503", "22IT503", "22CS503", "22CT503", "22AG503",
	"22MC503", "22AI503", "22CE503", "22BM503", "22CD503",
	"22BT503", "22CB503", "22EE503", "22ME503", "22IS503",
	"22FD503", "22AM503",

	// 09-05-2026 FN
	"22CS401", "22EC401", "22IT401", "22AI401", "22AM401",
	"22EE401", "22BT401", "22AL401", "22CE401", "22MC401",
	"22BM401", "22CD401", "22FD401", "22TT401", "22CT401",
	"22AG401", "22IS401", "22CB401", "22ME401", "22EI401",

	// 09-05-2026 AN
	"22EC303", "22AI303", "22EE303", "22MC303", "22IT303",
	"22AM303", "22CS303", "22ME303", "22EI303", "22BT303",
	"22CE303", "22IS303", "22CD303", "22FD303", "22BM303",
	"22CT303", "22AG303", "22CB303",
}


const ExamHall = () => {
  const { user } = useAuth();
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [registerNo, setRegisterNo] = useState(() => {
    if (!user?.uid) return "";
    const savedData = JSON.parse(localStorage.getItem(`home-register-no-${user.uid}`) || "{}");
    return savedData.registerNo || "";
  });

  const fuse = useMemo(() => new Fuse(COURSE_CODES, { threshold: 0.3 }), []);
  const filteredCourses = useMemo(() => {
    return courseSearch.trim() === ""
      ? COURSE_CODES
      : fuse.search(courseSearch).map(r => r.item);
  }, [courseSearch, fuse]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["exam-hall", registerNo, selectedCourse],
    queryFn: async () => {
      const res = await api.get(`/exam-hall`, {
        params: { registerNo, courseCode: selectedCourse }
      });
      return res.data;
    },
    enabled: false, // 🔥 manual trigger
  });

  const handleSearch = () => {
    if (!registerNo || !selectedCourse) return;
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-10 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto max-w-md rounded-3xl border border-blue-100 bg-white p-7 shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
        
        {/* Title */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200">
            Exam Hall Finder
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Search your exam hall by register number and course code.
          </p>
          <div className="mx-auto mt-4 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-200">
            It is 99.99% accurate
          </div>
        </div>

        {/* Register No */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-blue-600 dark:text-blue-300">
            Register Number
          </label>
          <input
            type="text"
            value={registerNo}
            onChange={(e) => setRegisterNo(e.target.value)}
            placeholder="7376251CS221"
            className="mt-1 w-full rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>

        {/* Course Dropdown */}
        <div className="relative mb-5">
          <label className="text-xs font-semibold text-blue-600 dark:text-blue-300">
            Course Code
          </label>
          <input
            type="text"
            value={selectedCourse || courseSearch}
            placeholder="Search course..."
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setCourseSearch(e.target.value);
              setSelectedCourse("");
              setShowDropdown(true);
            }}
            className="mt-1 w-full rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />

          {showDropdown && (
            <ul className="absolute z-10 mt-1 max-h-44 w-full overflow-y-auto rounded-xl border border-blue-100 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((code) => (
                  <li
                    key={code}
                    onClick={() => {
                      setSelectedCourse(code);
                      setCourseSearch(code);
                      setShowDropdown(false);
                    }}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    {code}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-gray-400">
                  No course found
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!registerNo || !selectedCourse || isLoading}
          className="w-full rounded-xl bg-blue-600 py-2 text-white font-semibold shadow-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search Hall"}
        </button>

        {/* Result */}
        <div className="mt-6 rounded-2xl bg-blue-50 p-5 text-center dark:bg-slate-950/80">
          {!data && !isLoading && !error && (
              <p className="text-sm text-blue-500 dark:text-blue-300">
                Enter details and click search to view the latest exam hall assignment.
              </p>
          )}

          {isLoading && (
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-xs text-blue-600">
                Fetching details...
              </p>
            </div>
          )}

          {data?.success && (
            <>
              <p className="text-xs text-blue-500 uppercase font-bold dark:text-blue-300">
                Your Hall
              </p>
              <h2 className="text-5xl font-black text-blue-700 mt-2 dark:text-blue-200">
                {data.hallNo}
              </h2>
              <p className="text-xs text-gray-500 mt-1 dark:text-slate-400">
                {data.courseCode}
              </p>
            </>
          )}

          {error && (
            <>
              <p className="text-red-500 text-sm">
                Hall not found. Please verify your register number and course code.
              </p>
              <button
                onClick={handleSearch}
                className="text-xs text-blue-600 underline mt-2 dark:text-blue-300"
              >
                Retry
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamHall;
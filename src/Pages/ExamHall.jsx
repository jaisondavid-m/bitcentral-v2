import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { useAuth } from "../context/StudentContext.jsx";
import Fuse from "fuse.js";

const COURSE_CODES = [
	// 04-05-2026 FN
	// "22CB604", "22AM006", "22AI036", "22BT004", "22MC011",
	// "22CS012", "22ME041", "22IS024", "22CD012", "22IT012", "22AM035",

	// // 04-05-2026 AN
	// "22CS501", "22EC501", "22BT501", "22IT501", "22BM501",
	// "22CT501", "22AG501", "22CE501", "22IS501", "22CD501",
	// "22FD501", "22TT501", "22AI501", "22EE501", "22ME501", "22MC501",

	// 05-05-2026 FN
	// "22IT007", "22CB406", "22IS019", "22CD007", "22CS007", "22CT007",

	// 05-05-2026 AN
	// "22CS301", "22IT301", "22MC301", "22EC301", "22EE301",
	// "22EI301", "22BT301", "22AI301", "22AM301", "22CB301",
	// "22ME301", "22BM301", "22CT301", "22CE301", "22IS301",
	// "22CD301", "22FD301", "22FT301", "22TT301", "22AG301",

	// 07-05-2026 FN
	"22HS008",

	// 07-05-2026 AN
	"22EC302", "22IT302", "22EE302", "22CS302", "22ME302",
	"22AM302", "22CE302", "22CD302", "22MC302", "22AG302",
	"22EI302", "22BM302", "22IS302", "22AI302", "22CB302",
	"22CT302", "22FD302", "22FT302", "22TT302",
]

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
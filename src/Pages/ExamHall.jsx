import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { useAuth } from "../context/StudentContext.jsx";

const COURSE_CODES = [
  // Core / Regular
  "22CS034","22EC003","22IT039","22AI029","22BT013",
  "22FD035","22CT038","22IS041","22EE011","22CD022",
  "22BM022","22MC027","22AG016","22EI009","22ME020",
  "22CB030","22CBH03","22CE015","22ECH09","22ME027",
  "22FDH03","22AGH21","22CSH03","22AMM44","22EEH15",
  "22MEH38","22BMH34","22ISH27","22CDH31","22BMM34",
  "22BTH30","22AIH09","22CEH01","22ITM48","22EIH04",
  "22MCH03","22FTH15","22ITH03","22CTH03","22AMH32",

  // 500 series
  "22EC503","22IT503","22CS503","22CT503","22AG503",
  "22MC503","22AI503","22CE503","22BM503","22CD503",
  "22BT503","22CB503","22EE503","22ME503","22IS503",
  "22FD503","22AM503",

  // 400 series
  "22CS401","22EC401","22IT401","22AI401","22AM401",
  "22EE401","22BT401","22AL401","22CE401","22MC401",
  "22BM401","22CD401","22FD401","22TT401","22CT401",
  "22AG401","22IS401","22CB401","22ME401","22EI401",

  // 300 series (existing)
  "22EC303","22AI303","22EE303","22MC303","22IT303",
  "22AM303","22CS303","22ME303","22EI303","22BT303",
  "22CE303","22IS303","22CD303","22FD303","22BM303",
  "22CT303","22AG303","22CB303",
  "22HS008",

  // 300 series (AN exam set)
  "22EC302","22IT302","22EE302","22CS302","22ME302",
  "22AM302","22CE302","22CD302","22MC302","22AG302",
  "22EI302","22BT302",

  // Additional found variations (including PDF source)
  "22AL302",
  "22AI303", // From PDF: B.Tech AD[span_0](start_span)[span_0](end_span)
  "22IS303"  // From PDF: B.E. SE (Correction from '221S303' typo in PDF)[span_1](start_span)[span_1](end_span)
];


const ExamHall = () => {
  const { user } = useAuth();

  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [registerNo, setRegisterNo] = useState(() => {
    if (!user?.uid) return "";
    const savedData = JSON.parse(
      localStorage.getItem(`home-register-no-${user.uid}`) || "{}"
    );
    return savedData.registerNo || "";
  });

  // 🔥 final course (manual OR selected)
  const finalCourse = selectedCourse || courseSearch;

const filteredCourses = useMemo(() => {
  if (!courseSearch.trim()) return COURSE_CODES;

  const filtered = COURSE_CODES.filter((code) =>
    code.includes(courseSearch)
  );

  if (!COURSE_CODES.includes(courseSearch)) {
    return [courseSearch, ...filtered]; // 👈 add custom on top
  }

  return filtered;
}, [courseSearch]);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["exam-hall", registerNo, finalCourse],
    queryFn: async () => {
      const res = await api.get(`/exam-hall`, {
        params: { registerNo, courseCode: finalCourse },
      });
      return res.data;
    },
    enabled: false, // important
  });

  const handleSearch = () => {
    if (!registerNo || !finalCourse) return;
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
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm"
          />
        </div>

        {/* Course Input */}
        <div className="relative mb-5">
          <label className="text-xs font-semibold text-blue-600">
            Course Code
          </label>

          <input
            type="text"
            value={selectedCourse || courseSearch}
            placeholder="Search or type manually..."
            onFocus={() => setShowDropdown(true)}
            onChange={(e) => {
              setCourseSearch(e.target.value.toUpperCase());
              setSelectedCourse("");
              setShowDropdown(true);
            }}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm"
          />

          {/* Dropdown */}
          {showDropdown && (
            <ul className="absolute z-10 mt-1 max-h-44 w-full overflow-y-auto rounded-xl border bg-white shadow-lg">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((code) => (
                  <li
                    key={code}
                    onClick={() => {
                      setSelectedCourse(code);
                      setCourseSearch(code);
                      setShowDropdown(false);
                    }}
                    className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                  >
                    {code}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-gray-400">
                  No match — press search to use manually
                </li>
              )}
            </ul>
          )}

          {/* Manual hint */}
          {courseSearch && !COURSE_CODES.includes(courseSearch) && (
            <p className="text-xs text-orange-500 mt-1">
              Using custom course code
            </p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleSearch}
          disabled={!registerNo || !finalCourse || isLoading}
          className="w-full rounded-xl bg-blue-600 py-2 text-white font-semibold"
        >
          {isLoading ? "Searching..." : "Search Hall"}
        </button>

        {/* Result */}
        <div className="mt-6 text-center">
          {!data && !isLoading && !error && (
            <p className="text-sm text-blue-500">
              Enter details and search
            </p>
          )}

          {isLoading && <p>Loading...</p>}

          {data?.success && (
            <>
              <h2 className="text-5xl font-black text-blue-700">
                {data.hallNo}
              </h2>
              <p>{data.courseCode}</p>
            </>
          )}

          {error && (
            <p className="text-red-500 text-sm">
              Hall not found
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamHall;
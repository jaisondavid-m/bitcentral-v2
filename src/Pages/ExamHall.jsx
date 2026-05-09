import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { useAuth } from "../context/StudentContext.jsx";

const COURSE_CODES = [
	// 6xx series (6th semester)
	"22AI601", "22AG601", "22AM601", "22BM601", "22BT601", "22CB601", "22CD601", "22CE601", "22CS601", "22CT601", "22EC601", "22EE601", "22EI601", "22FD601", "22FT601", "22IS601", "22IT601", "22MC601", "22ME601",
	"22AI602", "22AG602", "22AM602", "22BM602", "22BT602", "22CB602", "22CD602", "22CE602", "22CS602", "22CT602", "22EC602", "22EE602", "22EI602", "22FD602", "22FT602", "22IS602", "22IT602", "22MC602", "22ME602",
	"22AI603", "22AG603", "22AM603", "22BM603", "22BT603", "22CB603", "22CD603", "22CE603", "22CS603", "22CT603", "22EC603", "22EE603", "22EI603", "22FD603", "22FT603", "22IS603", "22IT603", "22MC603", "22ME603",

	// 5xx series (5th semester)
	"22AI504", "22AG504", "22AM504", "22BM504", "22BT504", "22CB504", "22CD504", "22CE504", "22CS504", "22CT504", "22EC504", "22EE504", "22EI504", "22FD504", "22IS504", "22IT504", "22MC504", "22ME504",

	// 4xx series (4th semester)
	"22AI402", "22AI403", "22AI404",
	"22AG402", "22AG403", "22AG404",
	"22AM402", "22AM403", "22AM404",
	"22BM402", "22BM403", "22BM404",
	"22BT402", "22BT403", "22BT404",
	"22CB402", "22CB403", "22CB404",
	"22CD402", "22CD403", "22CD404",
	"22CE402", "22CE403", "22CE404",
	"22CS402", "22CS403", "22CS404",
	"22CT402", "22CT403", "22CT404",
	"22EC402", "22EC403", "22EC404",
	"22EE402", "22EE403", "22EE404",
	"22EI402", "22EI403", "22EI404",
	"22FD402", "22FD403", "22FD404",
	"22FT402",
	"22IS402", "22IS403", "22IS404",
	"22IT402", "22IT403", "22IT404",
	"22MC402", "22MC403", "22MC404",
	"22ME402", "22ME403", "22ME404",
	"22TT402",

	// 3xx series (3rd semester)
	"22AI304", "22AG304", "22AM304", "22BM304", "22BT304", "22CB304", "22CD304", "22CE304", "22CS304", "22EC304", "22EE304", "22EI304", "22FD304", "22IS304", "22IT304", "22MC304", "22ME304",
	"22AI305", "22AG305", "22AM305", "22BM305", "22BT305", "22CB305", "22CD305", "22CE305", "22CS305", "22CT305", "22EC305", "22EE305", "22EI305", "22FD305", "22IS305", "22IT305", "22MC305", "22ME305",

	// Elective / misc codes
	"22AI019", "22AG010", "22AG015", "22AM010", "22AM018",
	"22BM008", "22BM020",
	"22BT001", "22BT002",
	"22CB014", "22CB015",
	"22CD001", "22CD016",
	"22CE002", "22CE003",
	"22CS016",
	"22CT016",
	"22EC002", "22EC007", "22EC044",
	"22EE019", "22EE037",
	"22EI015",
	"22FD014", "22FD017",
	"22FT019",
	"22IS002", "22IS010",
	"22IT016", "22IT031",
	"22MC009", "22MC015",
	"22ME005", "22ME009",
]

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
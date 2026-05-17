import React, { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { useAuth } from "../context/StudentContext.jsx";

const COURSE_CODES = [
  // 23-05-2026 FN
  "22OEE01", "22OME03", "22OBT01", "22OEC03",

  // 23-05-2026 AN
  "22CE702", "22CS702", "22EC702", "22EE702", "22MC702", "22CD702",
  "22FD702", "22IT702", "22AG702", "22ME702", "22BM702", "22IS702",
  "22CT702", "22AM702",

  // 18-05 FN
  "22EC046", "22AI049", "22CS035", "22EC015", "22BT042", "22IT019",
  "22CT019", "22AI020", "22CB008", "22ME010", "22EE020", "22MC007",
  "22EI016", "22IS013", "22BM005", "22AG008", "22CE016", "22FD040",
  "22BT036", "22FT007",

  // 18-05 AN
  "22CE007", "22EC013", "22MC025", "22BM028", "22IS015", "22FD025",
  "22IT021", "22AI027", "22AG026", "22ME012", "22AM026",

  // 19-05 FN
  "22CS405", "22EC405", "22IT405", "22AI405", "22EE405", "22AM405",
  "22BT405", "22CE405", "22MC405", "22IS405", "22CD405", "22FD405",
  "22TT405", "22BM405", "22CT405", "22AG405", "22ME405", "22CB405",
  "22EI405",

  // 19-05 AN
  "22HS004", "22CD003", "22AI028",

  // 20-05 FN
  "22CS031", "22EC004", "22CS002", "22IT002", "22AM014", "22CD019",
  "22BT046", "22AI032", "22EE035", "22CT025", "22CB021", "22EI017",
  "22IS001", "22AI025", "22BM031", "22MC026", "22CE020", "22FT022",
  "22IT025", "22IT020", "22EC006", "22ME013", "22FD008", "22AG001",
  "22CS025", "22ME058",

  // 06-05 AN
  "22CE008", "22CS026", "22EC021", "22EC043", "22ME031", "22MC028",
  "22BM044", "22BT015", "22FD030", "22AG029",

  // 07-05 FN
  "22CS008", "22IT008", "22EC001", "22AI002", "22BT003", "22EE007",
  "22MC013", "22ME001", "22AM027", "22EC040", "22AI043", "22BT012",
  "22AG040", "22CT008", "22EE033", "22CS039", "22CD008", "22CB031",
  "22AM002", "22IS020",

  // 08-05 AN
  "22CS701", "22EC701", "22ME701", "22CD701", "22AM701", "22CE701",
  "22EE701", "22MC701", "22BM701", "22FT701", "22IT701", "22AG701",
  "22IS701", "22HS005",

  // 09-05 FN
  "22OCS01", "22AM034", "22OBM01", "22OME04", "22FD009", "22BT010",
  "22AI035", "22CS040", "22EI018", "22AG017", "22ME021", "22CT040",
  "22CB028", "22OCE02", "22IS006", "22CE026", "22IT050", "22ME028",
  "22CD014", "22BT040", "22FT028", "22OEI01",

  // 10-05 AN
  "22CE013", "22CS030", "22EC026", "22FD038", "22AI037", "22AG044",
];

const ExamHall = () => {
  const { user } = useAuth();

  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const [modalSearch, setModalSearch] = useState("");

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

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
        setFocusedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // keyboard navigation for dropdown
  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
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
      } else {
        // allow form submit via Search button
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setFocusedIndex(-1);
    }
  };

  // modal filtered list
  const modalFiltered = useMemo(() => {
    const q = modalSearch.trim().toUpperCase();
    if (!q) return COURSE_CODES;
    return COURSE_CODES.filter((c) => c.includes(q));
  }, [modalSearch]);

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
        <div ref={wrapperRef} className="relative mb-5">
          <label className="text-xs font-semibold text-blue-600">
            Course Code
          </label>

          <input
            type="text"
            value={selectedCourse || courseSearch}
            placeholder="e.g. 22CS601"
            onFocus={() => {
              setShowDropdown(true);
              setShowModal(false);
            }}
             onKeyDown={(e) => {
               if (e.key === "Enter") {
                 handleSearch();
               } else {
                 handleKeyDown(e);
               }
             }}
            onChange={(e) => {
              setCourseSearch(e.target.value.toUpperCase());
              setSelectedCourse("");
              setShowDropdown(true);
              setFocusedIndex(-1);
            }}
            aria-autocomplete="list"
            aria-expanded={showDropdown}
            className="mt-1 w-full rounded-xl border px-4 py-2 text-sm pr-10"
          />

          {/* clear button */}
          {(courseSearch || selectedCourse) && (
            <button
              aria-label="Clear course input"
              onClick={() => {
                setCourseSearch("");
                setSelectedCourse("");
                setShowDropdown(false);
                setFocusedIndex(-1);
              }}
              className="absolute right-3 top-9 text-sm text-slate-500 hover:text-slate-800"
            >
              ✕
            </button>
          )}

          {/* open full list button */}
          <button
            aria-label="Open course list"
            onClick={() => setShowModal(true)}
            className="absolute right-10 top-10 text-slate-500 hover:text-slate-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* selected pill */}
          {finalCourse && (
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                {finalCourse}
                <button aria-label="Edit course" onClick={() => setShowModal(true)} className="text-blue-600">✎</button>
              </span>
            </div>
          )}

          {/* Dropdown */}
          {showDropdown && (
            <ul
              role="listbox"
              aria-label="Course suggestions"
              className="absolute z-10 mt-1 max-h-44 w-full overflow-y-auto rounded-xl border bg-white shadow-lg"
            >
              {filteredCourses.length > 0 ? (
                filteredCourses.map((code, idx) => (
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
                    className={`cursor-pointer px-4 py-2 ${focusedIndex === idx ? "bg-blue-50 font-semibold" : "hover:bg-blue-50"}`}
                  >
                    {/* highlight match */}
                    {(() => {
                      const q = courseSearch.trim();
                      if (!q) return code;
                      const i = code.indexOf(q);
                      if (i === -1) return code;
                      return (
                        <>
                          {code.slice(0, i)}
                          <span className="bg-yellow-100">{code.slice(i, i + q.length)}</span>
                          {code.slice(i + q.length)}
                        </>
                      );
                    })()}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-gray-400">
                  No suggestions — press Search to use this code
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

          {/* Modal popup for full selection */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
              <div className="relative z-10 max-w-lg w-full rounded-xl bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Select Course</h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-500">✕</button>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <input
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="Filter courses or type custom code"
                    className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      const code = modalSearch.trim().toUpperCase();
                      if (!code) return;
                      setSelectedCourse(code);
                      setCourseSearch(code);
                      setShowModal(false);
                    }}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white"
                  >
                    Use
                  </button>
                </div>

                <div className="mt-3 max-h-56 overflow-y-auto rounded-md border">
                  {modalFiltered.length > 0 ? (
                    modalFiltered.map((code) => (
                      <div
                        key={code}
                        onClick={() => {
                          setSelectedCourse(code);
                          setCourseSearch(code);
                          setShowModal(false);
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-50"
                      >
                        {code}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-400">No results</div>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-500">Click a code to select, or type a custom code above and press Use.</p>
              </div>
            </div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleSearch}
          disabled={!registerNo || !finalCourse || isLoading}
          className={`w-full rounded-xl py-2 text-white font-semibold ${(!registerNo || !finalCourse || isLoading) ? 'bg-blue-400 opacity-80 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              Searching...
            </span>
          ) : (
            'Search Hall'
          )}
        </button>

        {/* Result */}
        <div className="mt-6 text-center">
          {!data && !isLoading && !error && (
            <p className="text-sm text-blue-500">
              Enter details and search
            </p>
          )}

          {/* {isLoading && <p>Loading...</p>} */}

          {data?.success && (
            <div className="mx-auto max-w-sm rounded-2xl border bg-white p-5 shadow-md">
              <h2 className="text-4xl font-extrabold text-blue-700">{data.hallNo}</h2>
              <p className="mt-2 text-sm text-slate-600">Course: <span className="font-medium">{data.courseCode}</span></p>
              {data.room && <p className="mt-1 text-sm text-slate-500">Room: {data.room}</p>}
            </div>
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
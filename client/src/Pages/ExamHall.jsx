import React, { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios.js";
import { useAuth } from "../context/StudentContext.jsx";

const COURSE_LABELS = {
  "22HS004": "HUMAN VALUES AND ETHICS",
  "22HS005": "SOFT SKILLS AND EFFECTIVE COMMUNICATION",
  "22AG301": "NUMERICAL METHODS AND STATISTICS",
  "22AI301": "PROBABILITY AND STATISTICS",
  "22AM301": "PROBABILITY AND STATISTICS",
  "22BT301": "FOURIER SERIES, TRANSFORMS AND BIOSTATISTICS",
  "22CS301": "PROBABILITY, STATISTICS AND QUEUING THEORY",
  "22IT301": "PROBABILITY, STATISTICS AND QUEUING THEORY",
  "22EC301": "PROBABILITY, STATISTICS AND RANDOM PROCESS",
  "22EE301": "COMPLEX INTEGRATION, TRANSFORMS AND PARTIAL DIFFERENTIAL EQUATIONS",
  "22EI301": "TRANSFORMS AND PARTIAL DIFFERENTIAL EQUATIONS",
  "22MC301": "TRANSFORMS AND PARTIAL DIFFERENTIAL EQUATIONS",
  "22ME301": "ENGINEERING MATHEMATICS III",
  "22AG302": "SOIL SCIENCE AND ENGINEERING",
  "22AI302": "DATA STRUCTURES I",
  "22AM302": "DATA STRUCTURES I",
  "22CS302": "DATA STRUCTURES I",
  "22IT302": "DATA STRUCTURES I",
  "22BT302": "BIOCHEMISTRY",
  "22EC302": "CIRCUIT ANALYSIS",
  "22EE302": "CIRCUIT ANALYSIS",
  "22EI302": "ELECTRICAL CIRCUITS AND MACHINES",
  "22MC302": "ELECTRICAL CIRCUITS AND MACHINES",
  "22ME302": "ELECTRIC MACHINES AND DRIVES",
  "22AG303": "ENGINEERING THERMODYNAMICS",
  "22BT303": "ENGINEERING THERMODYNAMICS",
  "22ME303": "ENGINEERING THERMODYNAMICS",
  "22AI303": "COMPUTER ORGANIZATION AND ARCHITECTURE",
  "22AM303": "COMPUTER ORGANIZATION AND ARCHITECTURE",
  "22CS303": "COMPUTER ORGANIZATION AND ARCHITECTURE",
  "22IT303": "COMPUTER ORGANIZATION AND ARCHITECTURE",
  "22EC303": "DIGITAL LOGIC CIRCUIT DESIGN",
  "22EI303": "DIGITAL LOGIC CIRCUIT DESIGN",
  "22MC303": "DIGITAL LOGIC CIRCUIT DESIGN",
  "22EE303": "ELECTRICAL MACHINES I",
  "22AG304": "FLUID MECHANICS AND MACHINERY",
  "22ME304": "FLUID MECHANICS AND MACHINERY",
  "22MC304": "FLUID MECHANICS AND MACHINERY",
  "22AI304": "PRINCIPLES OF PROGRAMMING LANGUAGES",
  "22AM304": "PRINCIPLES OF PROGRAMMING LANGUAGES",
  "22CS304": "PRINCIPLES OF PROGRAMMING LANGUAGES",
  "22IT304": "PRINCIPLES OF PROGRAMMING LANGUAGES",
  "22BT304": "MICROBIOLOGY",
  "22EC304": "ANALOG ELECTRONICS AND INTEGRATED CIRCUITS",
  "22EE304": "ANALOG CIRCUITS AND SYSTEMS",
  "22EI304": "FLUID MECHANICS AND THERMODYNAMICS",
  "22AG305": "SURVEYING AND LEVELLING",
  "22AI305": "SOFTWARE ENGINEERING",
  "22AM305": "SOFTWARE ENGINEERING",
  "22CS305": "SOFTWARE ENGINEERING",
  "22IT305": "SOFTWARE ENGINEERING",
  "22BT305": "PROCESS CALCULATIONS AND UNIT OPERATIONS",
  "22EC305": "DATA STRUCTURES AND ALGORITHMS",
  "22EE305": "DATA STRUCTURES AND ALGORITHMS",
  "22EI305": "DATA STRUCTURES AND ALGORITHMS",
  "22ME305": "ENGINEERING MECHANICS",
  "22MC305": "ENGINEERING MECHANICS",
  "22HS505": "BUSINESS COMMUNICATION AND VALUE SCIENCE – III",
  "22AGH13": "REFRIGERATION AND COLD STORAGE",
  "22AIH13": "CYBER SECURITY",
  "22AMH13": "CYBER SECURITY",
  "22AGM13": "REFRIGERATION AND COLD STORAGE",
  "22BTH28": "ANIMAL PHYSIOLOGY AND METABOLISM",
  "22AIM43": "PYTHON FOR DATA SCIENCE",
  "22CSH30": "KNOWLEDGE ENGINEERING",
  "22EEH13": "ELECTRIC VEHICLE ARCHITECTURE",
  "22ECH07": "IOT PROTOCOLS AND INDUSTRIAL SENSORS",
  "22EIH02": "IOT PROTOCOLS AND INDUSTRIAL SENSORS",
  "22ITM07": "AGILE SOFTWARE DEVELOPMENT",
  "22CSM07": "AGILE SOFTWARE DEVELOPMENT",
  "22ITH50": "IT INFRASTRUCTURE DESIGN",
  "22MEH36": "TOOL AND DIE DESIGN",
  "22MCH01": "MODELLING OF INDUSTRIAL ROBOTS",
  "22AGH16": "FOOD SAFETY MANAGEMENT SYSTEMS",
  "22AIH08": "CLOUD SERVICES AND DATA MANAGEMENT",
  "22AMH08": "CLOUD SERVICES AND DATA MANAGEMENT",
  "22AGM16": "FOOD SAFETY MANAGEMENT SYSTEMS",
  "22BTH29": "ANIMAL HEALTH AND NUTRITION",
  "22AIM45": "FUNDAMENTALS OF MACHINE LEARNING",
  "22CSH31": "SOFT COMPUTING",
  "22EEH14": "DESIGN OF MOTOR AND POWER CONVERTERS FOR ELECTRIC VEHICLES",
  "22ECH08": "IOT PROCESSORS",
  "22EIH03": "IOT PROCESSORS",
  "22ITM08": "UI AND UX DESIGN",
  "22CSM08": "UI AND UX DESIGN",
  "22ITH51": "DATA CENTRE DESIGN",
  "22MEH37": "GEOMETRIC MODELLING",
  "22MCH02": "ROBOT CONTROL USING ROS",
  "22AG501": "TRACTOR AND FARM ENGINES",
  "22AI501": "ARTIFICIAL INTELLIGENCE",
  "22AM501": "ARTIFICIAL INTELLIGENCE",
  "22BT501": "GENETIC ENGINEERING",
  "22CB501": "COMPILER DESIGN",
  "22CS501": "THEORY OF COMPUTATION",
  "22EE501": "POWER SYSTEM ANALYSIS",
  "22EC501": "DIGITAL COMMUNICATION",
  "22EI501": "INDUSTRIAL INSTRUMENTATION",
  "22IT501": "PRINCIPLES OF COMMUNICATION",
  "22ME501": "MECHATRONICS",
  "22MC501": "ROBOTICS AND MACHINE VISION",
  "22AG502": "UNIT OPERATIONS IN AGRICULTURAL PROCESS ENGINEERING",
  "22AI502": "COMPUTER NETWORKS",
  "22CS502": "COMPUTER NETWORKS",
  "22IT502": "COMPUTER NETWORKS",
  "22AM502": "BIG DATA TECHNOLOGIES",
  "22BT502": "BIOPROCESS ENGINEERING",
  "22CB502": "BUSINESS STRATEGY",
  "22EE502": "POWER ELECTRONICS",
  "22EC502": "DIGITAL SIGNAL PROCESSING",
  "22EI502": "ELECTRONIC INSTRUMENTATION AND MEASUREMENTS",
  "22ME502": "DESIGN OF MACHINE ELEMENTS",
  "22MC502": "MANUFACTURING TECHNOLOGY",
  "22AG503": "SOIL AND WATER CONSERVATION ENGINEERING",
  "22AI503": "MACHINE LEARNING",
  "22AM503": "MACHINE LEARNING",
  "22BT503": "ANIMAL TISSUE CULTURE",
  "22CB503": "SOFTWARE DESIGN WITH UML",
  "22CS503": "MACHINE LEARNING ESSENTIALS",
  "22EE503": "OPTIMIZATION IN ENGINEERING DESIGN",
  "22EC503": "TRANSMISSION LINES AND ANTENNAS",
  "22EI503": "INTERNET OF THINGS",
  "22IT503": "INFORMATION CODING TECHNIQUES",
  "22ME503": "THERMAL ENGINEERING",
  "22MC503": "THERMODYNAMICS AND HEAT TRANSFER",
  "22AG504": "RENEWABLE ENERGY SOURCES",
  "22AI504": "CLOUD COMPUTING",
  "22AM504": "CLOUD COMPUTING",
  "22BT504": "BIOINFORMATICS",
  "22CB504": "FINANCIAL AND COST ACCOUNTING",
  "22CS504": "FREE OPEN SOURCE SOFTWARE",
  "22EE504": "CONTROL SYSTEMS",
  "22EI504": "CONTROL SYSTEMS",
  "22EC504": "INTERNET OF THINGS AND APPLICATIONS",
  "22IT504": "INTERNET OF THINGS",
  "22ME504": "MACHINING AND METROLOGY",
  "22MC504": "CONTROL SYSTEMS ENGINEERING",
  "22AG026": "SOIL FERTILITY AND NUTRIENT MANAGEMENT",
  "22AI028": "BIG DATA ANALYTICS",
  "22AI019": "ROBOTIC PROCESS AUTOMATION",
  "22AM019": "ROBOTIC PROCESS AUTOMATION",
  "22AM026": "E COMMERCE AND WEB DEVELOPMENT",
  "22BT002": "INDUSTRIAL MICROBIOLOGY",
  "22BT010": "FOOD PROCESS AND TECHNOLOGY",
  "22CB012": "SOFTWARE TESTING AND AUTOMATION",
  "22CS010": "APP DEVELOPMENT",
  "22IT010": "APP DEVELOPMENT",
  "22CS001": "EXPLORATORY DATA ANALYSIS",
  "22CS025": "MULTIMEDIA AND ANIMATION",
  "22IT025": "MULTIMEDIA AND ANIMATION",
  "22EE019": "SOLAR ENERGY CONVERSION SYSTEMS",
  "22EC002": "COMMUNICATION PROTOCOLS AND STANDARDS",
  "22EC037": "SOFT COMPUTING TECHNIQUES",
  "22EI015": "VIRTUAL INSTRUMENTATION",
  "22ME012": "WELDING TECHNOLOGY",
  "22ME002": "COMPOSITE MATERIALS AND MECHANICS",
  "22MC015": "AUTOMOTIVE INFOTRONICS",
  "22OBT01": "BIOFUELS",
  "22OEE02": "ELECTRICAL SAFETY",
  "22OME02": "INDUSTRIAL PROCESS ENGINEERING",
  "22OCB01": "INTERNATIONAL BUSINESS MANAGEMENT",
  "22OEI02": "SENSOR TECHNOLOGY",
  "22OME01": "DIGITAL MANUFACTURING",
  "22OAG01": "RAINWATER HARVESTING TECHNIQUES",
  "22OEC03": "PRINCIPLES OF COMMUNICATION SYSTEMS",
  "22OCS02": "JAVA FUNDAMENTALS",
  "22OAI01": "FUNDAMENTALS OF DATA SCIENCE",
  "22OIT06": "CLOUD INFRASTRUCTURE",
  "22HS006": "TAMILS AND TECHNOLOGY",
  "22MA101": "ENGINEERING MATHEMATICS I",
  "22CB101": "",
  "24MB101": "",
  "22GE004": "BASICS OF ELECTRONICS ENGINEERING",
  "24MB202": "",
  "24CS22": "",
  "24IS22": "",
  "22HS003": "HERITAGE OF TAMILS",
  "24MB102": "",
  "22HS001": "FOUNDATIONAL ENGLISH",
  "24MB104": "",
  "22GE003": "BASICS OF ELECTRICAL ENGINEERING",
  "22CH103": "ENGINEERING CHEMISTRY I",
  "22CB103": "",
  "24MB103": "",
  "22CD206": "",
  "22CT206": "",
  "24MB203": "",
  "22AI206": "DIGITAL COMPUTER ELECTRONICS",
  "22CS206": "DIGITAL COMPUTER ELECTRONICS",
  "22IT206": "DIGITAL COMPUTER ELECTRONICS",
  "22AM206": "DIGITAL COMPUTER ELECTRONICS",
  "22IS206": "",
  "24IS23": "",
  "24CS23": "",
  "22MA201": "ENGINEERING MATHEMATICS II",
  "24MB205": "",
  "24CS54": "",
  "24IS55": "",
  "22PH102": "ENGINEERING PHYSICS",
  "22CB102": "",
  "24MB105": "",
  "22PH202": "ELECTROMAGNETISM AND MODERN PHYSICS",
  "24MB206": "",
  "22CB201": "",
  "24CS58": "",
  "22CB106": "",
  "24MB106": "",
  "22CH203": "ENGINEERING CHEMISTRY II",
  "22CB205": "",
  "24CS57": "",
  "24IS63": "",
  "22GE001": "FUNDAMENTALS OF COMPUTING",
  "22CB104": "",
  "22GE002": "COMPUTATIONAL PROBLEM SOLVING",
  "22CB203": "",
  "24CS69": "",
  "22HS201": "COMMUNICATIVE ENGLISH II",
  "22CB204": "",
  "24CS21": "",
  "24IS21": "",
  "24CS24": "",
  "24IS24": "",
  "22CB202": "",
  "24MB204": "",
};

const CURRENT_CODES = ["22HS004", "22HS005", "22AG301", "22AI301", "22AM301", "22BT301", "22CS301", "22IT301", "22EC301", "22EE301", "22EI301", "22MC301", "22ME301", "22AG302", "22AI302", "22AM302", "22CS302", "22IT302", "22BT302", "22EC302", "22EE302", "22EI302", "22MC302", "22ME302", "22AG303", "22BT303", "22ME303", "22AI303", "22AM303", "22CS303", "22IT303", "22EC303", "22EI303", "22MC303", "22EE303", "22AG304", "22ME304", "22MC304", "22AI304", "22AM304", "22CS304", "22IT304", "22BT304", "22EC304", "22EE304", "22EI304", "22AG305", "22AI305", "22AM305", "22CS305", "22IT305", "22BT305", "22EC305", "22EE305", "22EI305", "22ME305", "22MC305", "22HS505", "22AGH13", "22AIH13", "22AMH13", "22AGM13", "22BTH28", "22AIM43", "22CSH30", "22EEH13", "22ECH07", "22EIH02", "22ITM07", "22CSM07", "22ITH50", "22MEH36", "22MCH01", "22AGH16", "22AIH08", "22AMH08", "22AGM16", "22BTH29", "22AIM45", "22CSH31", "22EEH14", "22ECH08", "22EIH03", "22ITM08", "22CSM08", "22ITH51", "22MEH37", "22MCH02", "22AG501", "22AI501", "22AM501", "22BT501", "22CB501", "22CS501", "22EE501", "22EC501", "22EI501", "22IT501", "22ME501", "22MC501", "22AG502", "22AI502", "22CS502", "22IT502", "22AM502", "22BT502", "22CB502", "22EE502", "22EC502", "22EI502", "22ME502", "22MC502", "22AG503", "22AI503", "22AM503", "22BT503", "22CB503", "22CS503", "22EE503", "22EC503", "22EI503", "22IT503", "22ME503", "22MC503", "22AG504", "22AI504", "22AM504", "22BT504", "22CB504", "22CS504", "22EE504", "22EI504", "22EC504", "22IT504", "22ME504", "22MC504", "22AG026", "22AI028", "22AI019", "22AM019", "22AM026", "22BT002", "22BT010", "22CB012", "22CS010", "22IT010", "22CS001", "22CS025", "22IT025", "22EE019", "22EC002", "22EC037", "22EI015", "22ME012", "22ME002", "22MC015", "22OBT01", "22OEE02", "22OME02", "22OCB01", "22OEI02", "22OME01", "22OAG01", "22OEC03", "22OCS02", "22OAI01", "22OIT06", "22HS006", "22MA101", "22CB101", "24MB101", "22GE004", "24MB202", "24CS22", "24IS22", "22HS003", "24MB102", "22HS001", "24MB104", "22GE003", "22CH103", "22CB103", "24MB103", "22CD206", "22CT206", "24MB203", "22AI206", "22CS206", "22IT206", "22AM206", "22IS206", "24IS23", "24CS23", "22MA201", "24MB205", "24CS54", "24IS55", "22PH102", "22CB102", "24MB105", "22PH202", "24MB206", "22CB201", "24CS58", "22CB106", "24MB106", "22CH203", "22CB205", "24CS57", "24IS63", "22GE001", "22CB104", "22GE002", "22CB203", "24CS69", "22HS201", "22CB204", "24CS21", "24IS21", "24CS24", "24IS24", "22CB202", "24MB204"];
const ARREAR_CODES = [];

const ExamHall = () => {
  const { user, profile, student } = useAuth();

  const [activeTab, setActiveTab] = useState("current");
  const [courseSearch, setCourseSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const [registerNo, setRegisterNo] = useState("");

  const hasAppliedDefaultRegisterNo = useRef(false);

  useEffect(() => {
    if (hasAppliedDefaultRegisterNo.current) return;

    const defaultRollNo =
      profile?.roll_no ||
      profile?.rollNo ||
      student?.roll_no ||
      student?.rollNo ||
      "";

    if (defaultRollNo) {
      setRegisterNo(defaultRollNo);
      hasAppliedDefaultRegisterNo.current = true;
    }
  }, [profile, student]);

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

    const matches = courseCodes.filter((code) => {
      const label = (COURSE_LABELS[code] || "").toUpperCase();
      return code.includes(q) || label.includes(q);
    });

    matches.sort((a, b) => {
      const labelA = (COURSE_LABELS[a] || "").toUpperCase();
      const labelB = (COURSE_LABELS[b] || "").toUpperCase();
      const aStarts = a.startsWith(q) || labelA.startsWith(q);
      const bStarts = b.startsWith(q) || labelB.startsWith(q);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

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

  useEffect(() => {
    if (!user?.uid || !registerNo) return;

    localStorage.setItem(
      `home-register-no-${user.uid}`,
      JSON.stringify({ registerNo })
    );
  }, [registerNo, user?.uid]);

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

  const placeholder = activeTab === "current" ? "e.g. 22HS006 (or) Tamil and Technolgy..." : "e.g.22HS006 (or) Tamil and Technolgy...";

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-12 dark:bg-slate-950">
      <div className="mx-auto max-w-sm">

        {/* Header */}
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white p-4 border border-blue-100 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          {/* BIT Sathy Logo Badge */}
          <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <span className="text-[12px] font-black leading-none text-white">BIT</span>
            <span className="text-[7px] font-bold leading-none text-blue-200">SATHY</span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-slate-900 dark:text-slate-100">
              Exam Hall Schedule
            </h1>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
              Manual Search
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">


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
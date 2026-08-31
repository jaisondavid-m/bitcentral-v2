import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "@/components/common/FullScreenLoader.jsx";
import FullscreenPdfModal from "@/components/modals/FullscreenPdfModal.jsx";
import SubjectCard from "@/components/cards/SubjectCard.jsx";
import api from "@/api/axios";
import { useAuth } from "@/context/StudentContext";
import SearchBar from "@/components/common/SearchBar.jsx";
import { BookOpen, FileText, ExternalLink, X, ChevronRight, Download } from "lucide-react";
import { useTheme } from "@/context/ThemeContext.jsx";

function normalizeSemesterYear(yearCode) {
  const year = Number(yearCode);
  if (!Number.isFinite(year)) return yearCode;
  return year < 100 ? 2000 + year : year;
}

const semesterCache = new Map();

async function fetchSubjects(yearCode, deptCode = "") {
  const semesterYear = normalizeSemesterYear(yearCode);
  const cacheKey = `${semesterYear}_${(deptCode || "ALL").toLowerCase()}`;

  if (semesterCache.has(cacheKey)) {
    return semesterCache.get(cacheKey);
  }

  const promise = (async () => {
    const params = new URLSearchParams();
    if (deptCode) params.set("dept", deptCode);
    const url = params.toString() ? `/semesters/${semesterYear}?${params.toString()}` : `/semesters/${semesterYear}`;
    const res = await api.get(url);
    return res.data.data || [];
  })();

  semesterCache.set(cacheKey, promise);

  try {
    const data = await promise;
    semesterCache.set(cacheKey, Promise.resolve(data));
    return data;
  } catch (err) {
    semesterCache.delete(cacheKey);
    throw err;
  }
}

function TabButton({ active, children, onClick, dark = false }) {
  const activeLight = "bg-blue-600 text-white shadow-sm hover:bg-blue-700";
  const inactiveLight = "border border-blue-100 bg-white text-blue-700 hover:bg-blue-50";
  const activeDark = "bg-blue-500 text-white shadow-sm hover:bg-blue-400";
  const inactiveDark = "border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800";

  const cls = active
    ? (dark ? activeDark : activeLight)
    : (dark ? inactiveDark : inactiveLight);

  return (
    <button type="button" onClick={onClick} className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${cls}`}>
      {children}
    </button>
  );
}

/* ─── Subject Details Modal ────────────────────────────────────────────────── */
function SubjectDetailsModal({ subject, onClose, onOpenPdf, dark = false }) {
  if (!subject) return null;

  const code = subject?.code || subject?.subject_code || "";
  const name = subject?.name || subject?.subject_name || "";
  const semqbwithans = subject?.semqbwithans || subject?.sem_qb_with_ans || "";
  const qb1 = subject?.qb1 || "";
  const qb2 = subject?.qb2 || "";
  const ak1 = subject?.ak1 || "";
  const ak2 = subject?.ak2 || "";

  const openLink = (url, label) => {
    if (!url) return;
    if (url.startsWith("/")) {
      window.location.href = url;
      return;
    }
    if (onOpenPdf) {
      onOpenPdf({ url, name: `${code} - ${label}` });
      return;
    }
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 px-4 py-6 backdrop-blur-md sm:px-6 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-50 my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5 dark:border-slate-800/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <BookOpen className="h-5.5 w-5.5" />
            </div>
            <div>
              <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {code}
              </span>
              <h3 className="mt-0.5 text-base font-extrabold text-slate-900 dark:text-slate-100">
                {name}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-4">
          {/* Section 1: Periodical Test 1 (PT-1) */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Periodical Test 1 (PT-1)
              </h4>
              <span className="text-[10px] font-bold text-slate-400">Unit 1 & 2</span>
            </div>

            {qb1 || ak1 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {qb1 && (
                  <button
                    type="button"
                    onClick={() => openLink(qb1, "PT-1 Question Bank")}
                    className="inline-flex items-center justify-between rounded-xl border border-blue-200 bg-white px-3.5 py-2.5 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-50 dark:border-blue-900/60 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-blue-950/50"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      Question Bank (QB1)
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </button>
                )}
                {ak1 && (
                  <button
                    type="button"
                    onClick={() => openLink(ak1, "PT-1 Answer Key")}
                    className="inline-flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-3.5 py-2.5 text-xs font-bold text-emerald-700 shadow-sm transition hover:bg-emerald-50 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/50"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      Answer Key (AK1)
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs italic text-slate-400">No PT-1 materials uploaded yet.</p>
            )}
          </div>

          {/* Section 2: Periodical Test 2 (PT-2) */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Periodical Test 2 (PT-2)
              </h4>
              <span className="text-[10px] font-bold text-slate-400">Unit 3 & 4</span>
            </div>

            {qb2 || ak2 ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {qb2 && (
                  <button
                    type="button"
                    onClick={() => openLink(qb2, "PT-2 Question Bank")}
                    className="inline-flex items-center justify-between rounded-xl border border-indigo-200 bg-white px-3.5 py-2.5 text-xs font-bold text-indigo-700 shadow-sm transition hover:bg-indigo-50 dark:border-indigo-900/60 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      Question Bank (QB2)
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </button>
                )}
                {ak2 && (
                  <button
                    type="button"
                    onClick={() => openLink(ak2, "PT-2 Answer Key")}
                    className="inline-flex items-center justify-between rounded-xl border border-amber-200 bg-white px-3.5 py-2.5 text-xs font-bold text-amber-700 shadow-sm transition hover:bg-amber-50 dark:border-amber-900/60 dark:bg-slate-900 dark:text-amber-300 dark:hover:bg-amber-950/50"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      Answer Key (AK2)
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-xs italic text-slate-400">No PT-2 materials uploaded yet.</p>
            )}
          </div>

          {/* Section 3: Semester-End Exam */}
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Semester-End Exam Bundle
              </h4>
              <span className="text-[10px] font-bold text-slate-400">Full Syllabus</span>
            </div>

            {semqbwithans ? (
              <button
                type="button"
                onClick={() => openLink(semqbwithans, "Semester QB & Answers")}
                className="flex w-full items-center justify-between rounded-xl border border-purple-200 bg-white px-4 py-3 text-xs font-bold text-purple-700 shadow-sm transition hover:bg-purple-50 dark:border-purple-900/60 dark:bg-slate-900 dark:text-purple-300 dark:hover:bg-purple-950/50"
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  Semester Question Bank & Answer Key Bundle
                </span>
                <ExternalLink className="h-4 w-4 opacity-60" />
              </button>
            ) : (
              <p className="text-xs italic text-slate-400">No semester bundle uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Semester Page ───────────────────────────────────────────────────────

export default function Semester() {
  const navigate = useNavigate();
  const { user, student } = useAuth();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePdf, setActivePdf] = useState(null);
  const [selectedSubjectDetails, setSelectedSubjectDetails] = useState(null);

  const filteredSubjects = useMemo(
    () =>
      subjects.filter((sub) => {
        const query = search.toLowerCase().trim();
        if (!query) return true;
        const code = (sub.code || sub.subject_code || "").toLowerCase();
        const name = (sub.name || sub.subject_name || "").toLowerCase();
        return code.includes(query) || name.includes(query);
      }),
    [subjects, search]
  );

  const visibleSubjects = filteredSubjects;

  useEffect(() => {
    const load = async () => {
      if (!student?.yearCode) {
        setError("Unable to determine your year. Please use a BITSATHY email.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const deptCode = student.deptCode || student.department || "";
        const subjectsData = await fetchSubjects(student.yearCode, deptCode);
        setSubjects(subjectsData);
      } catch (err) {
        console.error("Load error:", err);
        setError(err.response?.data?.message || "Server Down");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [student?.yearCode, student?.deptCode, student?.department, user]);

  if (loading) return <FullScreenLoader />;

  if (error) {
    return (
      <div className={`flex min-h-screen items-center justify-center text-red-500 ${isDark ? "bg-slate-900 text-red-400" : ""}`}>
        {error}
      </div>
    );
  }

  const containerBg = isDark ? "bg-gradient-to-b from-slate-900 via-black to-slate-900" : "bg-gradient-to-b from-blue-50 via-white to-blue-50";
  const cardBorder = isDark ? "border-slate-700" : "border-blue-100";
  const cardBg = isDark ? "bg-slate-900" : "bg-white";
  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`min-h-screen ${containerBg} px-4 py-6 sm:px-6 lg:px-8`}>
      <div className="mx-auto flex max-w-5xl flex-col gap-4">
        {/* Single Search Bar */}
        <div className={`rounded-2xl border ${cardBorder} ${cardBg} p-3.5 shadow-sm`}>
          <SearchBar isDark={isDark} search={search} setSearch={setSearch} placeholder="Search code or subject name..." />
        </div>

        {/* Subjects Grid */}
        <section className={`rounded-2xl border ${cardBorder} ${cardBg} p-4 shadow-sm sm:p-5`}>
          <div className="grid gap-4">
            {subjects.length === 0 ? (
              <div className={`rounded-2xl border border-dashed ${isDark ? "border-slate-700" : "border-blue-200"} ${isDark ? "bg-slate-900" : "bg-blue-50"} py-12 text-center text-sm ${mutedText}`}>
                No subjects configured for Year {student?.yearCode || "-"}
              </div>
            ) : visibleSubjects.length === 0 ? (
              <div className={`rounded-2xl border border-dashed ${isDark ? "border-slate-700" : "border-blue-200"} ${isDark ? "bg-slate-900" : "bg-blue-50"} py-12 text-center text-sm ${mutedText}`}>
                {search.trim() ? "No subjects match your search query." : "No subjects available under this filter."}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                {visibleSubjects.map((subject, index) => (
                  <SubjectCard
                    key={subject.code || subject.subject_code || index}
                    subject={subject}
                    onOpenDetails={(sub) => setSelectedSubjectDetails(sub)}
                    dark={isDark}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Subject Details Modal */}
      {selectedSubjectDetails && (
        <SubjectDetailsModal
          subject={selectedSubjectDetails}
          onClose={() => setSelectedSubjectDetails(null)}
          onOpenPdf={setActivePdf}
          dark={isDark}
        />
      )}

      {/* Fullscreen PDF Modal */}
      {activePdf && (
        <FullscreenPdfModal
          url={activePdf.url}
          name={activePdf.name}
          allowExternalActions={activePdf.allowExternalActions !== false}
          onClose={() => setActivePdf(null)}
        />
      )}
    </div>
  );
}
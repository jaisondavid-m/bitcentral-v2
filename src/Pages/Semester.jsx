import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../Component/FullScreenLoader";
import FullscreenPdfModal from "../Component/FullscreenPdfModal";
import SubjectCard from "../Component/SubjectCard";
import api from "../api/axios";
import { useAuth } from "../context/StudentContext";
import SearchBar from "../Component/SearchBar";
import { BookOpen } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

function normalizeSemesterYear(yearCode) {
  const year = Number(yearCode);
  if (!Number.isFinite(year)) return yearCode;
  return year < 100 ? 2000 + year : year;
}

const semesterCache = new Map();

async function fetchSubjects(yearCode) {
  const semesterYear = normalizeSemesterYear(yearCode);

  if (semesterCache.has(semesterYear)) {
    return semesterCache.get(semesterYear);
  }

  const promise = (async () => {
    const res = await api.get(`/semesters/${semesterYear}`);
    return res.data.data || [];
  })();

  semesterCache.set(semesterYear, promise);

  try {
    const data = await promise;
    semesterCache.set(semesterYear, Promise.resolve(data));
    return data;
  } catch (err) {
    semesterCache.delete(semesterYear);
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
    <button type="button" onClick={onClick} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${cls}`}>
      {children}
    </button>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Semester() {
  const navigate = useNavigate();
  const { user, student } = useAuth();

  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    try {
      window.localStorage.removeItem("semester-page-dark");
    } catch (err) {
      // ignore
    }
  }, []);

  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("semester");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activePdf, setActivePdf] = useState(null);

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

  const visibleSubjects = useMemo(
    () =>
      filteredSubjects.filter((sub) => {
        const qb1 = sub.qb1 || "";
        const qb2 = sub.qb2 || "";
        const ak1 = sub.ak1 || "";
        const ak2 = sub.ak2 || "";
        const semqbwithans = sub.semqbwithans || sub.sem_qb_with_ans || "";

        if (activeTab === "test1") return Boolean(qb1 || ak1);
        if (activeTab === "test2") return Boolean(qb2 || ak2);
        if (activeTab === "semester") return Boolean(semqbwithans);

        return Boolean(qb1 || qb2 || ak1 || ak2 || semqbwithans);
      }),
    [activeTab, filteredSubjects]
  );

  // For the semester tab, normalize the subject so SubjectCard only sees
  // semqbwithans mapped to qb1 (treated as "Question Bank"), with all other
  // link fields cleared out.
  const normalizedSubjects = useMemo(() => {
  if (activeTab !== "semester") return visibleSubjects;

  return visibleSubjects.map((sub) => {
    const semqbwithans = sub.semqbwithans || sub.sem_qb_with_ans || "";

    return {
      ...sub,
      semqbwithans,        // keep real semester field
      sem_qb_with_ans: semqbwithans,

      qb1: "",
      qb2: "",
      ak1: "",
      ak2: "",
    };
  });
}, [activeTab, visibleSubjects]);

  const tabMeta = {
    test1: {
      title: "PT-1 / Module Test 1",
      subtitle: "Question Bank and Answer Key",
      empty: "No Module Test 1 links are available for your year.",
      view: "test1",
    },
    test2: {
      title: "PT-2 / Module Test 2",
      subtitle: "Question Bank and Answer Key",
      empty: "No Module Test 2 links are available for your year.",
      view: "test2",
    },
    semester: {
      title: "Semester",
      subtitle: "Question Bank with Answers",
      empty: "No semester bundle is available for your year.",
      // Use "test1" view so SubjectCard renders qb1 as "Question Bank"
      view: "semester",
    },
  };

  const activeMeta = tabMeta[activeTab];

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
        const subjectsData = await fetchSubjects(student.yearCode);
        setSubjects(subjectsData);
      } catch (err) {
        console.error("Load error:", err);
        setError(err.response?.data?.message || "Server Down");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [student?.yearCode, user]);

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
    <div className={`min-h-screen ${containerBg} px-4 py-4 sm:px-6 lg:px-8`}>
      <div className="mx-auto flex max-w-5xl flex-col gap-3">
        <div className={`rounded-2xl border ${cardBorder} ${cardBg} shadow-sm ${isDark ? "shadow-black/20" : "shadow-blue-100/30"}`}>
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className={`flex items-center gap-2 text-lg font-bold ${isDark ? "text-slate-100" : "text-slate-900"} sm:text-xl`}>
                  <BookOpen className={`h-4 w-4 ${isDark ? "text-blue-300" : "text-blue-600"} sm:h-5 sm:w-5`} />
                  {activeMeta.title}
                </h1>
              </div>
              <p className={`mt-1 text-sm ${mutedText}`}>
                {activeMeta.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <TabButton dark={isDark} active={activeTab === "test1"} onClick={() => setActiveTab("test1")}>
            PT-1 / Module Test 1
          </TabButton>
          <TabButton dark={isDark} active={activeTab === "test2"} onClick={() => setActiveTab("test2")}>
            PT-2 / Module Test 2
          </TabButton>
          <TabButton dark={isDark} active={activeTab === "semester"} onClick={() => setActiveTab("semester")}>
            Semester
          </TabButton>
        </div>

        <div className={`flex flex-col gap-3 rounded-2xl border ${cardBorder} ${cardBg} p-3.5 shadow-sm sm:flex-row sm:items-center sm:justify-between`}>
          <div className="w-full max-w-sm">
            <SearchBar isDark={isDark} search={search} setSearch={setSearch} placeholder="Search code or subject name" />
          </div>
        </div>

        <section className={`rounded-2xl border ${cardBorder} ${cardBg} p-3.5 shadow-sm sm:p-4`}>
          <div className="grid gap-3">
            {subjects.length === 0 ? (
              <div className={`rounded-2xl border border-dashed ${isDark ? "border-slate-700" : "border-blue-200"} ${isDark ? "bg-slate-900" : "bg-blue-50"} py-12 text-center text-sm ${mutedText}`}>
                No subjects found for Year {student?.yearCode || "-"}
              </div>
            ) : normalizedSubjects.length === 0 ? (
              <div className={`rounded-2xl border border-dashed ${isDark ? "border-slate-700" : "border-blue-200"} ${isDark ? "bg-slate-900" : "bg-blue-50"} py-12 text-center text-sm ${mutedText}`}>
                {search.trim()
                  ? "No subjects match your search."
                  : activeMeta.empty}
              </div>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {normalizedSubjects.map((subject, index) => (
                  <SubjectCard
                    key={subject.code || subject.subject_code || index}
                    subject={subject}
                    view={activeMeta.view}
                    onOpenPdf={setActivePdf}
                    dark={isDark}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

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
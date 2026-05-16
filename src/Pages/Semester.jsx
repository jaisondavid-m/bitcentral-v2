import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../Component/FullScreenLoader";
import SubjectCard from "../Component/SubjectCard";
import api from "../api/axios";
import { useAuth } from "../context/StudentContext";
import SearchBar from "../Component/SearchBar";
import { ArrowRight, BookOpen } from "lucide-react";

async function fetchSubjects(yearCode) {
  const res = await api.get(`/semesters/${yearCode}`);
  return res.data.data || [];
}

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
          : "border border-blue-100 bg-white text-blue-700 hover:bg-blue-50"
      }`}
    >
      {children}
    </button>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Semester() {
  const navigate = useNavigate();
  const { user, student } = useAuth();

  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [activeTab, setActiveTab] = useState("test2");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const tabMeta = {
    test1: {
      title: "Module Test 1",
      subtitle: "QB1 and AK1 links",
      empty: "No Module Test 1 links are available for your year.",
      view: "test1",
    },
    test2: {
      title: "Module Test 2",
      subtitle: "QB2 and AK2 links",
      empty: "No Module Test 2 links are available for your year.",
      view: "test2",
    },
    semester: {
      title: "Semester",
      subtitle: "Full semester question paper with answers",
      empty: "No semester bundle is available for your year.",
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
      <div className="flex min-h-screen items-center justify-center text-red-500 dark:bg-black">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="rounded-3xl border border-blue-100 bg-white shadow-lg shadow-blue-100/40">
          <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <BookOpen className="h-5 w-5 text-blue-600" />
              {activeMeta.title}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {activeMeta.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/exam-hall")}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Find Your Exam Hall
            <ArrowRight className="h-4 w-4" />
          </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <TabButton active={activeTab === "test1"} onClick={() => setActiveTab("test1")}>
            Module Test 1
          </TabButton>
          <TabButton active={activeTab === "test2"} onClick={() => setActiveTab("test2")}>
            Module Test 2
          </TabButton>
          <TabButton active={activeTab === "semester"} onClick={() => setActiveTab("semester")}>
            Semester
          </TabButton>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Search by subject code or name.
          </p>
          <div className="w-full max-w-md">
            <SearchBar search={search} setSearch={setSearch} placeholder="Search code or subject name" />
          </div>
        </div>

        <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-4">
            {subjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 py-16 text-center text-sm text-slate-500">
                No subjects found for Year {student?.yearCode || "-"}
              </div>
            ) : filteredSubjects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50 py-16 text-center text-sm text-slate-500">
                No subjects match your search.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {filteredSubjects.map((subject, index) => (
                  <SubjectCard key={subject.code || subject.subject_code || index} subject={subject} view={activeMeta.view} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
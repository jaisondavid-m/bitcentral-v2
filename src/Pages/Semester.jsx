import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../Component/FullScreenLoader";
import SubjectCard from "../Component/SubjectCard";
import api from "../api/axios";
import { useAuth } from "../context/StudentContext";
import SearchBar from "../Component/SearchBar";
import { ChevronDown, ChevronUp } from "lucide-react";

// ─── fetch helpers ────────────────────────────────────────────────────────────

async function fetchSubjects(yearCode) {
  const res = await api.get(`/semesters/${yearCode}`);
  return res.data.data || [];
}

async function fetchQBAnswerKeys(semester) {
  const params = new URLSearchParams();
  if (semester) params.set("semester", semester);
  const res = await api.get(`/qb?${params}`);
  return res.data.data || [];
}

// ─── QB answer key display ────────────────────────────────────────────────────

function AnswerGrid({ answers }) {
  let parsed = {};
  try {
    parsed = typeof answers === "string" ? JSON.parse(answers) : answers;
  } catch {
    return null;
  }

  const entries = Object.entries(parsed).sort(
    ([a], [b]) => Number(a) - Number(b)
  );

  const OPTION_COLORS = {
    A: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    B: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    C: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    D: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
  };

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8">
      {entries.map(([q, a]) => (
        <div
          key={q}
          className={`flex items-center justify-between rounded border px-2 py-1 text-xs ${
            OPTION_COLORS[a] || "bg-gray-50 text-gray-600 border-gray-200 dark:bg-slate-800 dark:text-slate-300"
          }`}
        >
          <span className="opacity-60">{q}</span>
          <span className="font-bold">{a}</span>
        </div>
      ))}
    </div>
  );
}

function QBKeyCard({ qbKey }) {
  const [open, setOpen] = useState(false);

  let answerCount = 0;
  try {
    const parsed =
      typeof qbKey.answers === "string"
        ? JSON.parse(qbKey.answers)
        : qbKey.answers;
    answerCount = Object.keys(parsed).length;
  } catch {
    /* ignore */
  }

  return (
    <div className="rounded-lg border border-blue-100 bg-white dark:border-blue-900 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="rounded bg-blue-100 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {qbKey.subject_code}
          </span>
          <span className="text-sm font-medium text-gray-800 dark:text-slate-200">
            {qbKey.year} QB
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-slate-800 dark:text-slate-400">
            {answerCount}Q
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-blue-100 px-4 pb-4 pt-3 dark:border-blue-900">
          <p className="mb-2 text-xs text-gray-400 dark:text-slate-500">
            Answer key — for reference only, may contain errors
          </p>
          <AnswerGrid answers={qbKey.answers} />
        </div>
      )}
    </div>
  );
}

// ─── subject + its QB keys ────────────────────────────────────────────────────

function SubjectWithQBs({ subject, qbKeys }) {
  const matchingKeys = useMemo(() => {
    if (!qbKeys || qbKeys.length === 0) return [];
    const code = (subject.code || subject.subject_code || "").toLowerCase().trim();
    const name = (subject.name || subject.subject_name || "").toLowerCase().trim();

    return qbKeys.filter((qb) => {
      const qbCode = (qb.subject_code || "").toLowerCase().trim();
      const qbName = (qb.subject_name || "").toLowerCase().trim();
      return (
        (code && qbCode && qbCode === code) ||
        (name && qbName && qbName === name) ||
        (code && qbName && qbName.includes(code)) ||
        (name && qbCode && name.includes(qbCode))
      );
    });
  }, [subject, qbKeys]);

  return (
    <div className="flex flex-col gap-2">
      <SubjectCard subject={subject} />
      {matchingKeys.length > 0 && (
        <div className="ml-3 flex flex-col gap-1.5 border-l-2 border-blue-200 pl-3 dark:border-blue-900">
          {matchingKeys.map((qb) => (
            <QBKeyCard key={qb.id} qbKey={qb} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Semester() {
  const navigate = useNavigate();
  const { user, student } = useAuth();

  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [qbKeys, setQbKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // derive semester from yearCode if possible, else fetch all QBs
        const semester = student?.semester || null;

        const [subjectsData, qbData] = await Promise.allSettled([
          fetchSubjects(student.yearCode),
          fetchQBAnswerKeys(semester),
        ]);

        setSubjects(subjectsData.status === "fulfilled" ? subjectsData.value : []);

        if (qbData.status === "fulfilled") {
          setQbKeys(qbData.value);
        }

        if (subjectsData.status === "rejected") {
          throw subjectsData.reason;
        }
      } catch (err) {
        console.error("Load error:", err);
        setError(err.response?.data?.message || "Server Down");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  if (loading) return <FullScreenLoader />;

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500 dark:bg-black">
        {error}
      </div>
    );
  }

  const filteredSubjects = subjects.filter((sub) =>
    (sub.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-8 dark:bg-black">
      <div className="mx-auto max-w-2xl">
        <div className="mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-blue-800 dark:text-blue-300">
            Discourse Question Banks
          </h1>
          <p className="mt-1.5 text-xs text-gray-400 dark:text-slate-400">
            <span className="font-semibold text-gray-500 dark:text-slate-300">
              Disclaimer:
            </span>{" "}
            Answer keys are for reference only and may contain errors.
          </p>
        </div>

        <div className="mb-5 mt-3">
          <button
            onClick={() =>
              window.open("https://exam-hall-finder.vercel.app", "_blank")
            }
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Find Your Exam Hall
          </button>
        </div>

        <SearchBar search={search} setSearch={setSearch} />

        <div className="flex flex-col gap-3">
          {subjects.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400 dark:text-slate-400">
              No subjects found for Year {student?.yearCode || "-"}
            </div>
          ) : (
            filteredSubjects.map((sub, index) => (
              <SubjectWithQBs key={index} subject={sub} qbKeys={qbKeys} />
            ))
          )}
        </div>

        <button
          onClick={() => navigate("/")}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700"
        >
          ⬅ Home
        </button>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../Component/FullScreenLoader";
import SubjectCard from "../Component/SubjectCard";
import api from "../api/axios";
import { useAuth } from "../context/StudentContext";
import SearchBar from "../Component/SearchBar";

export default function Semester() {
  const navigate = useNavigate();
  const { user, student } = useAuth();
  const [search, setSearch] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const getSubjects = async () => {
      if (!student?.yearCode) {
        setError("Unable to determine your year. Please use a BITSATHY email.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/semesters/${student.yearCode}`);
        setSubjects(res.data.data);
      } catch (err) {
        console.error("Full error:", err);
        setError(err.response?.data?.message || "Server Down");
      } finally {
        setLoading(false);
      }
    };
    getSubjects();
  }, [user]);

  if (loading) return <FullScreenLoader />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }
  const filteredSubjects = subjects.filter((sub) => (sub.name || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-blue-800 tracking-tight">
            Discourse Question Banks
          </h1>
          <p className="mt-1.5 text-xs text-gray-400">
            <span className="font-semibold text-gray-500">Disclaimer:</span>{" "}
            Answer keys are for reference only and may contain errors.
          </p>
        </div>
        
        <div className="mb-5 mt-3">
          <button
            onClick={() =>
              window.open("https://exam-hall-finder.vercel.app", "_blank")
            }
            className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
          >
            Find Your Exam Hall
          </button>
        </div>
        <SearchBar search={search} setSearch={setSearch}/>

        {/* Subject Cards List */}
        <div className="flex flex-col gap-3">
          {subjects.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No subjects found for Year {selectedYear}
            </div>
          ) : (
            filteredSubjects.map((sub, index) => (
              <SubjectCard key={index} subject={sub} />
            ))
          )}
        </div>
        <button onClick={() => navigate("/")} className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all">⬅ Home</button>
      </div>
    </div>
  );
}
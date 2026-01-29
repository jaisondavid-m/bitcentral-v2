import React, { useEffect, useState } from "react";
import FullScreenLoader from "../../Component/Loader/FullScreenLoader";
import api from "../../api/axios";

export default function SemOne() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const res = await api.get("/subjects");
        setSubjects(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Server Down"
        );
      } finally {
        setLoading(false);
      }
    };

    getSubjects();
  }, []);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://bitcenteral.netlify.app/sem1mat"
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("Failed to copy link");
    }
  };

  if (loading) {
    return (
      <FullScreenLoader/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Discourse Question Banks</h1>
          <p className="mt-2 text-sm text-gray-500">
            <span className="font-medium">Disclaimer :</span> Answer keys are provided for reference only and may contain errors.
          </p>
          
          <div className="mt-4">
            <button onClick={() => window.open("https://exam-hall-finder.vercel.app", "_blank")}className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">
              Find Your Exam Hall
            </button>
          </div>
        </div>

        

        {/* Cards */}
        <div className="grid gap-6">
          {subjects.map((sub, index) => (
            <div
              key={index}
              className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Subject Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-800">
                  {sub.code}
                </h3>
                <p className="text-sm text-gray-600">{sub.name}</p>
              </div>

              {/* Semester QB */}
              <div className="mb-4">
                {sub.semqbwithans ? (
                  <a
                    href={sub.semqbwithans}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 text-sm rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                  >
                    Semester Model QB + AK
                  </a>
                ) : (
                  <span className="inline-block px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-400">
                    Semester Model QB (Soon)
                  </span>
                )}
              </div>

              {/* Discourse QBs */}
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Discourse Question Banks
              </p>

              <div className="flex flex-wrap gap-3 mb-3">
                {sub.qb1 ? (
                  <a
                    href={sub.qb1}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    QB 1
                  </a>
                ) : (
                  <span className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-400">
                    QB 1 (Soon)
                  </span>
                )}

                {sub.qb2 ? (
                  <a
                    href={sub.qb2}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                  >
                    QB 2
                  </a>
                ) : (
                  <span className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-400">
                    QB 2 (Soon)
                  </span>
                )}
              </div>

              {/* Answer Keys */}
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Answer Keys
              </p>

              <div className="flex flex-wrap gap-3">
                {sub.ak1 ? (
                  <a
                    href={sub.ak1}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    QB 1 Answer Key
                  </a>
                ) : (
                  <span className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-400">
                    (Soon)
                  </span>
                )}

                {sub.ak2 ? (
                  <a
                    href={sub.ak2}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    QB 2 Answer Key
                  </a>
                ) : (
                  <span className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-400">
                    (Soon)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showPopup && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative bg-white rounded-2xl w-[90%] max-w-sm sm:max-w-md p-4 sm:p-6 shadow-lg">

          <button onClick={() => setShowPopup(false)} aria-label="Close" className="absolute top-3 right-3 bg-red-500 cursor-pointer hover:bg-red-600 active:bg-red-700 text-white w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold shadow-md transition">✕</button>

          <h2 className="text-xl font-bold text-blue-700 mb-3">Share this link</h2>

          <p className="text-gray-700 mb-4 leading-relaxed">Please share this page link instead of the PDF file.</p>

          <a href="https://bitcenteral.netlify.app/sem1mat" target="_blank"rel="noreferrer" className="block text-blue-600 font-semibold break-all mb-4 hover:underline">
            https://bitcenteral.netlify.app/sem1mat
          </a>

          <p className="text-gray-700 mb-6">Thank you for your support ❤️</p>

          <div className="flex gap-3">
            <button onClick={copyLink} className="flex-1 bg-blue-600 cursor-pointer text-white py-2 rounded-lg hover:bg-blue-700 transition">
              {copied ? "Link Copied ✅" : "Copy Link"}
            </button>
            <button onClick={() => setShowPopup(false)} className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-800 cursor-pointer transition">Close</button>
          </div>
        </div>
      </div>
    )}  
    </div>
  );
}

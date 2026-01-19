import React, { useEffect, useState } from "react";

export default function SemOne() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://subject-api-dgl2.onrender.com/api/subjects")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch subjects");
        return res.json();
      })
      .then((data) => {
        setSubjects(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-600">
        Loading subjects...
      </div>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Discourse Question Banks
          </h1>
          <p className="text-blue-500 mt-1">
            Semester 1 · Answer keys will be added gradually
          </p>
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
    </div>
  );
}

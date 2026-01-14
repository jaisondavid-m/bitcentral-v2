import React from "react";

const subjects = [
  {
    code: "22MA101",
    name: "ENGINEERING MATHEMATICS I",
    qb1: "https://drive.google.com/file/d/1AMpdasHFaaQ_VnTO5uXVJsXhK0OD9tGW/view",
    qb2: "https://drive.google.com/file/d/1W7uvueoce4tlNBh8bUq0gcxVkLZhGkyq/view",
    ak1: "https://drive.google.com/file/d/1TR4pbAxI11iDocwf2CYWlXaJ8d3Upcx2/view?usp=drivesdk",
    ak2: "https://drive.google.com/file/d/1Scs9K2InJJBs-GsUJCJh_QpMhQjsfgMc/view?usp=drivesdk",
  },
  {
    code: "22GE003",
    name: "BASICS OF ELECTRICAL ENGINEERING",
    qb1: "https://drive.google.com/file/d/1qt63H55kH9ur3D9HmCJoBsvKBjFomaVM/view",
    qb2: "https://drive.google.com/file/d/1V1svxFy_fyBlh9eqV1mco1siJunKNegV/view",
    ak1: null,
    ak2: null,
  },
  {
    code: "22GE004",
    name: "BASICS OF ELECTRONICS ENGINEERING",
    qb1: "https://drive.google.com/file/d/1gAWZ8gWJ77lIPW7D2cIHymytV1U9WpuQ/view",
    qb2: "https://drive.google.com/file/d/1zZ7rqdTKPb2xz6pQihuOWhTO2fXSEG6z/view",
    ak1: null,
    ak2: null,
  },
  {
    code: "22PH102",
    name: "ENGINEERING PHYSICS",
    qb1: "https://drive.google.com/file/d/1Rz12cLYbCulYXFnTYkO7nYM5p_O43NBj/view",
    qb2: "https://drive.google.com/file/d/1ddivnmWnfv5YvWX5EwDVIq-GNhyIIMm3/view",
    ak1: "https://drive.google.com/file/d/153GAPcOqOvwaqETazPUJ2-D6SjAPD962/view?usp=drivesdk",
    ak2: "https://drive.google.com/file/d/1bM-10o00RoXj5kkihD7IvCI48P7G_lHu/view?usp=drivesdk",
  },
  {
    code: "22CH103",
    name: "ENGINEERING CHEMISTRY I",
    qb1: "https://drive.google.com/file/d/1xtuVorFFOlxQRRaWNcWwCUHS3QOgUliQ/view",
    qb2: "https://drive.google.com/file/d/1M3zgMJgS9jSUMQmHAN-ncPC7ACKqs1J-/view",
    ak1: "https://drive.google.com/file/d/19WAGbRig4f6g0EzfgnjprfjmVNaofMU_/view?usp=drivesdk",
    ak2: "https://drive.google.com/file/d/1X3CiBKEfTJMukwsQZ6uHpsaMPlplfKmg/view?usp=drivesdk",
  },
  {
    code: "22GE001",
    name: "FUNDAMENTALS OF COMPUTING",
    qb1: "https://drive.google.com/file/d/1BqOhmS4z8gMdvbnjQGMsACN68wuMZ0Nv/view",
    qb2: "https://drive.google.com/file/d/1dQzJ2WdmyskKTG0JdGrL_1aHIlaov1WR/view",
    ak1: null,
    ak2: null,
  },
  {
    code: "22HS002",
    name: "STARTUP MANAGEMENT",
    qb1: null,
    qb2: null,
    ak1: null,
    ak2: null,
  },
];


export default function SemOne() {
  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">
            Discourse Question Banks
          </h1>
          <p className="text-blue-500 mt-1">
            Semester 1 · Discourse Answer keys will be added later
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6">
          {subjects.map((sub, index) => (
            <div
              key={index}
              className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-blue-800">
                  {sub.code}
                </h3>
                <p className="text-sm text-gray-600">
                  {sub.name}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* QB 1 */}
                {sub.qb1 ? (
                  <a
                    href={sub.qb1}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    QB 1
                  </a>
                ) : (
                  <span className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                    QB 1 (Soon)
                  </span>
                )}

                {/* QB 2 */}
                {sub.qb2 ? (
                  <a
                    href={sub.qb2}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    QB 2
                  </a>
                ) : (
                  <span className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                    QB 2 (Soon)
                  </span>
                )}
                {/* Answer Key Heading */}
                <div className="w-full mt-2">
                  <p className="text-sm font-semibold text-gray-700">
                    Answer Key
                  </p>
                </div>

                {/* Answer Key 1 */}
                {sub.ak1 ? (
                  <a
                    href={sub.ak1}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    QB 1
                  </a>
                ) : (
                  <span className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
                    (Soon)
                  </span>
                )}

                {/* Answer Key 2 */}
                {sub.ak2 ? (
                  <a
                    href={sub.ak2}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    QB 2
                  </a>
                ) : (
                  <span className="px-4 py-2 text-sm rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
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

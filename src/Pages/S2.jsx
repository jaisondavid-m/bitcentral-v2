import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle } from 'lucide-react';

const subjects = [
    {
        id: 1,
        title: 'ENGINEERING MATHEMATICS II',
        qnLink: "https://drive.google.com/file/d/14pm-5TzQukSpTPAlwjIBj6HQgzKt7xj8/view?usp=drive_link",
        ansLink: null,
    },
    {
        id: 2,
        title: 'ELECTROMAGNETISM AND MODERN PHYSICS',
        qnLink: "https://drive.google.com/file/d/1Hq9Drh17Idq4BdYcL5Rn90hmbiV13ymv/view?usp=drive_link",
        ansLink: null,
    },
    {
        id: 3,
        title: 'ENGINEERING CHEMISTRY II',
        qnLink: "https://drive.google.com/file/d/10r9L3IE86gjYPoOWffESb6Ow74RjFS0-/view?usp=drive_link",
        ansLink: null,
    },
    {
        id: 4,
        title: 'COMPUTATIONAL PROBLEM SOLVING',
        qnLink: "https://drive.google.com/file/d/1yhpb1YJyvmPyRip4wab9C3rrCZjPWvw4/view?usp=drive_link",
        ansLink: null,
    },
    {
        id: 5,
        title: 'BASICS OF ELECTRONICS ENGINEERING',
        qnLink: "https://drive.google.com/file/d/141hs2eZcBMnlbQ-pxa7VQ4cTRwAtQJhi/view?usp=drive_link",
        ansLink: null,
    },
    {
        id: 6,
        title: 'BASICS OF ELECTRICAL ENGINEERING',
        qnLink: "https://drive.google.com/file/d/1QCv9M86ETZOyf1QMx8qMhIsnQ0_pwhHs/view?usp=drive_link",
        ansLink: null,
    },
    {
        id: 7,
        title: 'DIGITAL COMPUTER ELECTRONICS',
        qnLink: "https://drive.google.com/file/d/1tcz9pShc3Wq12MhhdoggPziJSPCW2bYR/view?usp=drive_link",
        ansLink: null,
    },
];

const LinkButton = ({ href, icon: Icon, label }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-600"
    >
      <Icon size={14} />
      {label}
    </a>
  );
};

function S2() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 dark:bg-black">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-800 tracking-tight dark:text-blue-300">Semester 2</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">Module test question banks and resources</p>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="bg-white border border-blue-100 rounded-lg p-4 shadow-sm hover:shadow-md transition dark:bg-slate-950 dark:border-blue-900"
            >
              <h2 className="text-sm font-bold text-blue-800 tracking-tight leading-snug dark:text-blue-300 mb-4">
                {sub.title}
              </h2>

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-2">Question Bank:</p>
                  {sub.qnLink ? (
                    <LinkButton href={sub.qnLink} icon={FileText} label="View" />
                  ) : (
                    <span className="inline-block px-3 py-1.5 text-xs font-semibold rounded-md text-gray-500 bg-gray-100 dark:text-slate-400 dark:bg-slate-900">
                      Coming soon
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-2">Answer Key:</p>
                  {sub.ansLink ? (
                    <LinkButton href={sub.ansLink} icon={CheckCircle} label="View" />
                  ) : (
                    <span className="inline-block px-3 py-1.5 text-xs font-semibold rounded-md text-gray-500 bg-gray-100 dark:text-slate-400 dark:bg-slate-900">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/")}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold shadow-lg hover:bg-blue-700 hover:scale-105 transition-all dark:bg-blue-700 dark:hover:bg-blue-600"
        >
          ⬅ Home
        </button>
      </div>
    </div>
  );
}

export default S2
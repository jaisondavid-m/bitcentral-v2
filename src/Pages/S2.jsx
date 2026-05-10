import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle } from 'lucide-react';
import FullscreenPdfModal from '../Component/FullscreenPdfModal'

const subjects = [
  {
    id: 6,
    title: 'BASICS OF ELECTRICAL ENGINEERING',
    qnLink: "https://drive.google.com/file/d/1QCv9M86ETZOyf1QMx8qMhIsnQ0_pwhHs/view?usp=drive_link",
    ansLink: "https://drive.google.com/file/d/1BMhQxiZvqEMdJe3CHGNl1B57ILUDGfRk/view?usp=sharing",
  },
  {
    id: 7,
    title: 'DIGITAL COMPUTER ELECTRONICS',
    qnLink: "https://drive.google.com/file/d/1tcz9pShc3Wq12MhhdoggPziJSPCW2bYR/view?usp=drive_link",
    ansLink: "https://drive.google.com/file/d/1USTm6Ok-LVnnWX_SQ1JohVUQyU40g9Jt/view?usp=drivesdk",
  },
  {
    id: 5,
    title: 'BASICS OF ELECTRONICS ENGINEERING',
    qnLink: "https://drive.google.com/file/d/141hs2eZcBMnlbQ-pxa7VQ4cTRwAtQJhi/view?usp=drive_link",
    ansLink: null,
  },
  {
    id: 1,
    title: 'ENGINEERING MATHEMATICS II',
    qnLink: "https://drive.google.com/file/d/14pm-5TzQukSpTPAlwjIBj6HQgzKt7xj8/view?usp=drive_link",
    ansLink: "https://drive.google.com/file/d/1lwfVGevvM4waDvA0JQfvKse0Q_WO79zo/view?usp=sharing",
  },
  {
    id: 2,
    title: 'ELECTROMAGNETISM AND MODERN PHYSICS',
    qnLink: "https://drive.google.com/file/d/1Hq9Drh17Idq4BdYcL5Rn90hmbiV13ymv/view?usp=drive_link",
    ansLink: "https://drive.google.com/file/d/16mmelkOgLzmqtVT1eZPwPvD_60GofTca/view?usp=sharing",
  },
  {
    id: 3,
    title: 'ENGINEERING CHEMISTRY II',
    qnLink: "https://drive.google.com/file/d/10r9L3IE86gjYPoOWffESb6Ow74RjFS0-/view?usp=drive_link",
    ansLink: "https://drive.google.com/file/d/10BA-r75MtJ_lHe9mz_9B9GoY5jbXQsrr/view?usp=drivesdk",
  },
  {
    id: 4,
    title: 'COMPUTATIONAL PROBLEM SOLVING',
    qnLink: "https://drive.google.com/file/d/1yhpb1YJyvmPyRip4wab9C3rrCZjPWvw4/view?usp=drive_link",
    ansLink: null,
  },
];

function S2() {
  const navigate = useNavigate();
  const [activePdf, setActivePdf] = useState(null)

  const toDrivePreview = (link) => {
    try {
      if (!link) return link
      const u = new URL(link)
      if (u.hostname.includes('drive.google.com')) {
        // try /d/:id/ style
        const m = link.match(/\/d\/([a-zA-Z0-9_-]+)/)
        const id = m ? m[1] : u.searchParams.get('id')
        if (id) return `https://drive.google.com/file/d/${id}/preview?rm=minimal`
      }
    } catch (e) {
      // not a full URL, fall back
    }
    return link
  }

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
                    <div className="flex items-center gap-2">
                      <button onClick={() => setActivePdf({ url: toDrivePreview(sub.qnLink), original: sub.qnLink, name: sub.title })} className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-600">
                        <FileText size={14} />
                        View
                      </button>
                      <a href={sub.qnLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200">Open in New tab</a>
                    </div>
                  ) : (
                    <span className="inline-block px-3 py-1.5 text-xs font-semibold rounded-md text-gray-500 bg-gray-100 dark:text-slate-400 dark:bg-slate-900">
                      Coming soon
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-slate-400 mb-2">Answer Key:</p>
                  <p className="text-[10px] text-gray-500 dark:text-slate-500 mb-2">Note: Based on my knowledge, may not be 100% accurate</p>
                  {sub.ansLink ? (
                    <button
                      onClick={() => setActivePdf({ url: toDrivePreview(sub.ansLink), name: `${sub.title} - Answer Key`, allowExternalActions: false })}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md text-white bg-blue-600 hover:bg-blue-700 transition dark:bg-blue-700 dark:hover:bg-blue-600"
                    >
                      <CheckCircle size={14} />
                      View
                    </button>
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
      {activePdf && (
        <FullscreenPdfModal
          url={activePdf.url}
          originalUrl={activePdf.original}
          name={activePdf.name}
          allowExternalActions={activePdf.allowExternalActions !== false}
          onClose={() => setActivePdf(null)}
        />
      )}
    </div>
  );
}

export default S2
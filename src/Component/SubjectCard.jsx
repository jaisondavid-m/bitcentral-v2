import React from "react";
import { useNavigate } from "react-router-dom";

const LinkButton = ({ href, label, onClick, onNavigate, dark = false }) => {
  const handleClick = () => {
    // Check if href is an internal route (starts with /)
    if (href.startsWith("/")) {
      onNavigate?.(href);
      return;
    }
    // Otherwise use the provided onClick or default to opening in new tab
    onClick ? onClick() : window.open(href, "_blank", "noreferrer");
  };

  const cls = dark
    ? "inline-block rounded-md bg-blue-500 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-400"
    : "inline-block rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700";

  return (
    <button type="button" onClick={handleClick} className={cls}>
      {label}
    </button>
  );
};

const Divider = ({ dark = false }) => <hr className={`my-2.5 ${dark ? "border-slate-700" : "border-blue-100"}`} />;

export default function SubjectCard({ subject, view = "all", onOpenPdf, dark = false }) {
  const navigate = useNavigate();
  const code = subject?.code || subject?.subject_code || "";
  const name = subject?.name || subject?.subject_name || "";
  const semqbwithans = subject?.semqbwithans || subject?.sem_qb_with_ans || "";
  const qb1 = subject?.qb1 || "";
  const qb2 = subject?.qb2 || "";
  const ak1 = subject?.ak1 || "";
  const ak2 = subject?.ak2 || "";

  const hasTest1 = qb1 || ak1;
  const hasTest2 = qb2 || ak2;
  const hasSemester = semqbwithans;
  const hasMaterials = semqbwithans || qb1 || qb2 || ak1 || ak2;

  const openPdf = (url, name, allowExternalActions = true, allowDownload = true) => {
    if (!url) return;
    // Check if url is an internal route
    if (url.startsWith("/")) {
      navigate(url);
      return;
    }
    if (onOpenPdf) {
      onOpenPdf({ url, name, allowExternalActions, allowDownload });
      return;
    }
    window.open(url, "_blank", "noreferrer");
  };

  const titleByView = {
    test1: "Module Test 1",
    test2: "Module Test 2",
    semester: "Semester",
    all: "All Materials",
  };

  const section =
    view === "test1"
      ? {
          label: titleByView.test1,
          links: [qb1 && { href: qb1, label: "QB1" }, ak1 && { href: ak1, label: "AK1" }].filter(Boolean),
        }
      : view === "test2"
      ? {
          label: titleByView.test2,
          links: [qb2 && { href: qb2, label: "QB2" }, ak2 && { href: ak2, label: "AK2" }].filter(Boolean),
        }
      : view === "semester"
      ? {
          label: titleByView.semester,
          links: [
            qb1 && { href: qb1, label: "QB1" },
            qb2 && { href: qb2, label: "QB2" },
            ak1 && { href: ak1, label: "AK1" },
            ak2 && { href: ak2, label: "AK2" },
            semqbwithans && { href: semqbwithans, label: "Semester QB + AK" },
          ].filter(Boolean),
        }
        : {
          label: titleByView.all,
          links: [
            qb1 && { href: qb1, label: "Question Bank" },
            qb2 && { href: qb2, label: "Question Bank" },
            ak1 && { href: ak1, label: "Answer Key" },
            ak2 && { href: ak2, label: "Answer Key" },
            semqbwithans && { href: semqbwithans, label: "Semester Question Bank + Answer Key" },
          ].filter(Boolean),
        };

  return (
    <div className={`rounded-2xl border ${dark ? "border-slate-700" : "border-blue-100"} ${dark ? "bg-slate-900" : "bg-white"} p-3.5 shadow-sm transition hover:shadow-md ${dark ? "hover:shadow-black/30" : "hover:shadow-blue-100/30"}`}>

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${dark ? "text-blue-300" : "text-blue-500"}`}>
            {section.label}
          </p>
          <h3 className={`mt-1 text-[15px] font-bold tracking-tight ${dark ? "text-slate-100" : "text-slate-900"}`}>{code}</h3>
          <p className={`mt-0.5 text-[11px] leading-snug ${dark ? "text-slate-400" : "text-slate-500"}`}>{name}</p>
        </div>

        {section.links.length > 0 && (
          <span className={`shrink-0 whitespace-nowrap rounded-full border ${dark ? "border-slate-700" : "border-blue-200"} ${dark ? "bg-slate-800 text-slate-200" : "bg-blue-50 text-blue-700"} px-2 py-0.5 text-[11px] font-semibold`}>
            {section.links.length} link{section.links.length > 1 ? "s" : ""}
          </span>
        )}
      </div>


      {!hasMaterials && (
        <>
          <Divider dark={dark} />
          <div className="py-3 text-center">
            <p className="text-xs italic text-gray-400">No materials added. Will be added soon.</p>
          </div>
        </>
      )}
      
      {view === "test1" && hasTest1 && (
        <>
          <Divider />
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-500">Module Test 1</p>
          <div className="flex flex-wrap gap-1.5">
            {qb1 && <LinkButton dark={dark} href={qb1} label="Question Bank" onNavigate={navigate} />}
            {ak1 && <LinkButton dark={dark} href={ak1} label="Answer Key" onNavigate={navigate} onClick={() => openPdf(ak1, `${code} - Answer Key`, true, false)} />}
          </div>
        </>
      )}
      
      {view === "test2" && hasTest2 && (
        <>
          <Divider />
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-500">Module Test 2</p>
          <div className="flex flex-wrap gap-1.5">
            {qb2 && <LinkButton dark={dark} href={qb2} label="Question Bank" onNavigate={navigate} />}
            {ak2 && <LinkButton dark={dark} href={ak2} label="Answer Key" onNavigate={navigate} onClick={() => openPdf(ak2, `${code} - Answer Key`, true, false)} />}
          </div>
        </>
      )}

      {view === "semester" && hasSemester && (
        <>
          <Divider />
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-500">Semester</p>
          <div className="flex flex-wrap gap-1.5">
            {qb1 && <LinkButton dark={dark} href={qb1} label="Question Bank" onNavigate={navigate} />}
            {qb2 && <LinkButton dark={dark} href={qb2} label="Question Bank" onNavigate={navigate} />}
            {ak1 && <LinkButton dark={dark} href={ak1} label="Answer Key" onNavigate={navigate} onClick={() => openPdf(ak1, `${code} - Answer Key`, true, false)} />}
            {ak2 && <LinkButton dark={dark} href={ak2} label="Answer Key" onNavigate={navigate} onClick={() => openPdf(ak2, `${code} - Answer Key`, true, false)} />}
            {semqbwithans && <LinkButton dark={dark} href={semqbwithans} label="Semester Question Bank + Answer Key" onNavigate={navigate} onClick={() => openPdf(semqbwithans, `${code} - Semester Question Bank + Answer Key`, true, false)} />}
          </div>
        </>
      )}

      {view === "all" && section.links.length > 0 && (
        <>
          <Divider />
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-500">All Materials</p>
          <div className="flex flex-wrap gap-1.5">
            {qb1 && <LinkButton dark={dark} href={qb1} label="Question Bank" onNavigate={navigate} />}
            {qb2 && <LinkButton dark={dark} href={qb2} label="Question Bank" onNavigate={navigate} />}
            {ak1 && <LinkButton dark={dark} href={ak1} label="Answer Key" onNavigate={navigate} />}
            {ak2 && <LinkButton dark={dark} href={ak2} label="Answer Key" onNavigate={navigate} />}
            {semqbwithans && <LinkButton dark={dark} href={semqbwithans} label="Semester Question Bank + Answer Key" onNavigate={navigate} />}
          </div>
        </>
      )}
    </div>
  );
}
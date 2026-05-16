import React from "react";

const LinkButton = ({ href, label }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-block rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700">
      {label}
    </a>
  );
};

const Divider = () => <hr className="my-3 border-blue-100" />;

export default function SubjectCard({ subject, view = "all" }) {
  const { code, name, semqbwithans, qb1, qb2, ak1, ak2 } = subject;

  const hasTest1 = qb1 || ak1;
  const hasTest2 = qb2 || ak2;
  const hasSemester = semqbwithans;
  const hasMaterials = semqbwithans || qb1 || qb2 || ak1 || ak2;

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
          links: semqbwithans ? [{ href: semqbwithans, label: "Semester QB + AK" }] : [],
        }
      : {
          label: titleByView.all,
          links: [
            qb1 && { href: qb1, label: "QB1" },
            qb2 && { href: qb2, label: "QB2" },
            ak1 && { href: ak1, label: "AK1" },
            ak2 && { href: ak2, label: "AK2" },
            semqbwithans && { href: semqbwithans, label: "Semester QB + AK" },
          ].filter(Boolean),
        };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-100/40">

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-500">
            {section.label}
          </p>
          <h3 className="mt-1 text-sm font-bold tracking-tight text-slate-900">{code}</h3>
          <p className="mt-0.5 text-xs leading-snug text-slate-500">{name}</p>
        </div>

        {section.links.length > 0 && (
          <span className="shrink-0 whitespace-nowrap rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            {section.links.length} link{section.links.length > 1 ? "s" : ""}
          </span>
        )}
      </div>


      {!hasMaterials && (
        <>
          <Divider />
          <div className="text-center py-4">
            <p className="text-xs italic text-gray-400">No materials added. Will be added soon.</p>
          </div>
        </>
      )}
      
      {view === "test1" && hasTest1 && (
        <>
          <Divider />
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-500">Module Test 1</p>
          <div className="flex flex-wrap gap-2">
            {qb1 && <LinkButton href={qb1} label="QB1" />}
            {ak1 && <LinkButton href={ak1} label="AK1" />}
          </div>
        </>
      )}
      
      {view === "test2" && hasTest2 && (
        <>
          <Divider />
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-500">Module Test 2</p>
          <div className="flex flex-wrap gap-2">
            {qb2 && <LinkButton href={qb2} label="QB2" />}
            {ak2 && <LinkButton href={ak2} label="AK2" />}
          </div>
        </>
      )}

      {view === "semester" && hasSemester && (
        <>
          <Divider />
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-500">Semester</p>
          <div className="flex flex-wrap gap-2">
            <LinkButton href={semqbwithans} label="Semester QB + AK" />
          </div>
        </>
      )}

      {view === "all" && section.links.length > 0 && (
        <>
          <Divider />
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-blue-500">All Materials</p>
          <div className="flex flex-wrap gap-2">
            {qb1 && <LinkButton href={qb1} label="QB1" />}
            {qb2 && <LinkButton href={qb2} label="QB2" />}
            {ak1 && <LinkButton href={ak1} label="AK1" />}
            {ak2 && <LinkButton href={ak2} label="AK2" />}
            {semqbwithans && <LinkButton href={semqbwithans} label="Semester QB + AK" />}
          </div>
        </>
      )}
    </div>
  );
}
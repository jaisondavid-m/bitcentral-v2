import React from "react";

const LinkButton = ({ href, label }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-block px-3 py-1.5 text-xs font-semibold rounded-md text-white transition bg-blue-600 hover:bg-blue-700">
      {label}
    </a>
  );
};

const Divider = () => <hr className="border-blue-100 my-3" />;

export default function SubjectCard({ subject }) {
  const { code, name, semqbwithans, qb1, qb2, ak1, ak2 } = subject;

  const hasDiscourse = qb1 || qb2;
  const hasAnswerKeys = ak1 || ak2;
  const hasMaterials = semqbwithans || qb1 || qb2 || ak1 || ak2;

  return (
    <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">

      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-blue-800 tracking-tight">{code}</h3>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{name}</p>
        </div>

        {semqbwithans && (
          <a href={semqbwithans} target="_blank" rel="noreferrer" className="shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full border border-blue-200 text-blue-600 hover:bg-blue-50 transition whitespace-nowrap">Model QB + AK</a>
        )}
      </div>


      {!hasMaterials && (
        <>
          <Divider />
          <div className="text-center py-4">
            <p className="text-xs text-gray-400 italic">No Materials Added. Will be added soon.</p>
          </div>
        </>
      )}
      
      {hasDiscourse && (
        <>
          <Divider />
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-400 mb-2">Discourse Question Banks</p>
          <div className="flex flex-wrap gap-2">
            {qb1 && <LinkButton href={qb1} label="Discourse-1" />}
            {qb2 && <LinkButton href={qb2} label="Discourse-2" />}
          </div>
        </>
      )}
      
      {hasAnswerKeys && (
        <>
          <Divider />
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-400 mb-2">Answer Keys</p>
          <div className="flex flex-wrap gap-2">
            {ak1 && <LinkButton href={ak1} label="Discourse-1" />}
            {ak2 && <LinkButton href={ak2} label="Discourse-2" />}
          </div>
        </>
      )}
    </div>
  );
}
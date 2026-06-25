import React from "react";
import { Link } from "react-router-dom";
import PublicNav from "../Component/PublicNav.jsx";
import FAQSection from "../Component/FAQSection.jsx";

export default function FAQ() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">BIT Central FAQ</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white">
          Questions and answers about BIT Central
        </h1>
        <p className="mt-5 leading-7 text-slate-700 dark:text-slate-300">
          Summary: BIT Central is a student portal for Bannari Amman Institute of Technology. It is useful for BIT Sathy students who need academic resources, question banks, answer keys, mess menu information, student services, and campus tools.
        </p>
      </section>
      <FAQSection />
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        <Link to="/contact" className="inline-flex rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          Ask a question
        </Link>
      </section>
    </main>
  );
}

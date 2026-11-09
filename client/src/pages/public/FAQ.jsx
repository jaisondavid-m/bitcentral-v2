import React from "react";
import { Link } from "react-router-dom";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import FAQSection from "@/components/features/FAQSection.jsx";

export default function FAQ() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 pt-12 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
          BIT Central FAQ
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          Questions and answers about BIT Central
        </h1>
        <p className="mt-4 text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
          Summary: BIT Central is a student portal for Bannari Amman Institute of Technology. It is useful for BIT Sathy students who need academic resources, question banks, answer keys, mess menu information, student services, and campus tools.
        </p>
      </section>
      <FAQSection />
      <section className="mx-auto max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
        <Link to="/contact" className="inline-flex rounded-xl border border-zinc-900 bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer">
          Ask a question
        </Link>
      </section>
      <PublicFooter />
    </main>
  );
}

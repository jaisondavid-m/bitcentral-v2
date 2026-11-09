import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import { benefitList, featureList } from "@/content/publicContent.js";

export default function Features() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
          BIT Central features
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          Academic resources, student services, and campus tools
        </h1>
        <p className="mt-4 max-w-3xl text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
          Summary: BIT Central helps BIT Sathy students reach question banks, answer keys, semester resources, mess menu updates, reward points access, exam hall tools, and campus services through one organized student portal.
        </p>
      </section>

      <section className="border-y border-zinc-900 bg-white py-12 dark:border-white dark:bg-[#111827]" aria-labelledby="feature-list-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="feature-list-heading" className="text-2xl font-black text-zinc-900 dark:text-white">
            Feature overview
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featureList.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-xl border border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-zinc-900 dark:shadow-[3px_3px_0px_#ffffff] transition-all">
                  <div className="rounded-lg border border-zinc-900 bg-blue-50 p-2 text-blue-600 dark:border-white dark:bg-blue-950 dark:text-blue-400 w-fit shadow-[1.5px_1.5px_0px_#18181b] dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-black text-zinc-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">{feature.summary}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="benefits-list-heading">
        <h2 id="benefits-list-heading" className="text-2xl font-black text-zinc-900 dark:text-white">
          Why students use BIT Central
        </h2>
        <ul className="mt-6 space-y-3">
          {benefitList.map((benefit) => (
            <li key={benefit} className="rounded-xl border border-zinc-900 bg-blue-50/40 p-4 text-sm font-bold leading-relaxed text-zinc-800 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-900 dark:text-zinc-200 dark:shadow-[2px_2px_0px_#ffffff]">
              {benefit}
            </li>
          ))}
        </ul>
        <Link to="/faq" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-zinc-900 bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer">
          Read FAQ
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
      <PublicFooter />
    </main>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PublicNav from "../Component/PublicNav.jsx";
import { benefitList, featureList } from "../content/publicContent.js";

export default function Features() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <PublicNav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">BIT Central features</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white">
          Academic resources, student services, and campus tools
        </h1>
        <p className="mt-5 max-w-3xl leading-7 text-slate-700 dark:text-slate-300">
          Summary: BIT Central helps BIT Sathy students reach question banks, answer keys, semester resources, mess menu updates, reward points access, exam hall tools, and campus services through one organized student portal.
        </p>
      </section>

      <section className="bg-white py-12 dark:bg-slate-950" aria-labelledby="feature-list-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="feature-list-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
            Feature overview
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureList.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <Icon className="h-7 w-7 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 leading-7 text-slate-700 dark:text-slate-300">{feature.summary}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="benefits-list-heading">
        <h2 id="benefits-list-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Why students use BIT Central
        </h2>
        <ul className="mt-6 space-y-3">
          {benefitList.map((benefit) => (
            <li key={benefit} className="rounded-lg border border-slate-200 bg-white p-4 leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              {benefit}
            </li>
          ))}
        </ul>
        <Link to="/faq" className="mt-8 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
          Read FAQ
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}

import React from "react";
import { faqs } from "../content/publicContent.js";

export default function FAQSection({ compact = false }) {
  const developerFaq = faqs.find((faq) => faq.question === "Who developed BIT Central?");
  const items = compact ? [...faqs.slice(0, 3), developerFaq].filter(Boolean) : faqs;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="faq-heading">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">Frequently Asked Questions</p>
        <h2 id="faq-heading" className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
          Clear answers about BIT Central
        </h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.question} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">{item.question}</h3>
            <p className="mt-2 leading-7 text-slate-700 dark:text-slate-300">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

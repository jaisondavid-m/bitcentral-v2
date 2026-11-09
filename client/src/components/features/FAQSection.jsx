import React from "react";
import { faqs } from "@/content/publicContent.js";

export default function FAQSection({ compact = false }) {
  const developerFaq = faqs.find((faq) => faq.question === "Who developed BIT Central?");
  const items = compact ? [...faqs.slice(0, 3), developerFaq].filter(Boolean) : faqs;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="faq-heading">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-md border border-zinc-900 bg-blue-100 px-2 py-0.5 text-xs font-black uppercase tracking-wider text-blue-900 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-blue-900/60 dark:text-blue-100 dark:shadow-[1px_1px_0px_#ffffff]">
          Frequently Asked Questions
        </div>
        <h2 id="faq-heading" className="mt-2 text-2xl font-black text-zinc-900 sm:text-3xl dark:text-white">
          Clear answers about BIT Central
        </h2>
      </div>
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.question} className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white">{item.question}</h3>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
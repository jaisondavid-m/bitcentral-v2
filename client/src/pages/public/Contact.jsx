import React from "react";
import { Link } from "react-router-dom";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import { contactMethods } from "@/content/publicContent.js";

export default function Contact() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
          Contact BIT Central
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          Feedback, updates, and public information
        </h1>
        <p className="mt-4 max-w-3xl text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
          Summary: Use this page to share feedback about BIT Central, suggest updates to academic resources, report missing question banks or answer keys, and find public information about Bannari Amman Institute of Technology.
        </p>
      </section>

      <section className="border-t border-zinc-900 bg-white py-12 dark:border-white dark:bg-[#111827]" aria-labelledby="contact-options-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="contact-options-heading" className="text-2xl font-black text-zinc-900 dark:text-white">
            Contact options
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a key={method.label} href={method.href} target={method.external ? "_blank" : undefined} rel={method.external ? "noopener noreferrer" : undefined} className="rounded-xl border border-zinc-900 bg-blue-50/40 p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-900 dark:shadow-[3px_3px_0px_#ffffff] transition-all">
                  <div className="rounded-lg border border-zinc-900 bg-blue-50 p-2 text-blue-600 dark:border-white dark:bg-blue-950 dark:text-blue-400 w-fit shadow-[1.5px_1.5px_0px_#18181b] dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="mt-3 block font-black text-zinc-900 dark:text-white">{method.label}</span>
                  <span className="mt-1 block text-sm font-semibold text-zinc-600 dark:text-zinc-300">{method.value}</span>
                </a>
              );
            })}
          </div>
          <p className="mt-8 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            For login, dashboard, mess menu, semester resources, and other protected tools, students should use their BIT Sathy institutional account.
          </p>
          <Link to="/login" className="mt-6 inline-flex rounded-xl border border-zinc-900 bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer">
            Login to student portal
          </Link>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

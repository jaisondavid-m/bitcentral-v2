import React from "react";
import { Link } from "react-router-dom";
import PublicNav from "../Component/PublicNav.jsx";
import PublicFooter from "../Component/PublicFooter.jsx";
import { contactMethods } from "../content/publicContent.js";

export default function Contact() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">Contact BIT Central</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white">
          Feedback, updates, and public information
        </h1>
        <p className="mt-5 max-w-3xl leading-7 text-slate-700 dark:text-slate-300">
          Summary: Use this page to share feedback about BIT Central, suggest updates to academic resources, report missing question banks or answer keys, and find public information about Bannari Amman Institute of Technology.
        </p>
      </section>

      <section className="bg-white py-12 dark:bg-slate-950" aria-labelledby="contact-options-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="contact-options-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
            Contact options
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a key={method.label} href={method.href} target={method.external ? "_blank" : undefined} rel={method.external ? "noopener noreferrer" : undefined} className="rounded-lg border border-slate-200 bg-slate-50 p-5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800">
                  <Icon className="h-6 w-6 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                  <span className="mt-3 block font-semibold text-slate-950 dark:text-white">{method.label}</span>
                  <span className="mt-1 block text-sm text-slate-700 dark:text-slate-300">{method.value}</span>
                </a>
              );
            })}
          </div>
          <p className="mt-8 leading-7 text-slate-700 dark:text-slate-300">
            For login, dashboard, mess menu, semester resources, and other protected tools, students should use their BIT Sathy institutional account.
          </p>
          <Link to="/login" className="mt-6 inline-flex rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Login to student portal
          </Link>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

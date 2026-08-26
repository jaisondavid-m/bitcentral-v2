import React from "react";
import { Link } from "react-router-dom";
import { Github, Globe, Linkedin } from "lucide-react";
import PublicNav from "../Component/PublicNav.jsx";
import PublicFooter from "../Component/PublicFooter.jsx";

export default function About() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">About BIT Central</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white">
          BIT Central is a student portal for BIT Sathy
        </h1>
        <p className="mt-5 max-w-3xl leading-7 text-slate-700 dark:text-slate-300">
          Summary: BIT Central helps students of Bannari Amman Institute of Technology find academic resources, question banks, answer keys, mess menu information, reward points access, exam hall tools, leave schedules, and campus resources from one web application.
        </p>
      </section>

      <section className="bg-white py-12 dark:bg-slate-950" aria-labelledby="mission-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="mission-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
            What BIT Central does
          </h2>
          <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
            BIT Central organizes important student information for the BIT Sathy community. The public pages explain the platform for students, parents, and search engines. The protected app gives signed-in students access to campus tools and resources connected to academic life at Bannari Amman Institute of Technology.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <article className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-950 dark:text-white">Who can use it?</h3>
              <p className="mt-2 leading-7 text-slate-700 dark:text-slate-300">
                Public pages are open to everyone. Protected student tools are intended for BIT Sathy students who sign in with an institutional Google account.
              </p>
            </article>
            <article className="rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-950 dark:text-white">What does it include?</h3>
              <p className="mt-2 leading-7 text-slate-700 dark:text-slate-300">
                Academic resources, question banks, answer keys, semester materials, mess menu updates, reward points links, exam hall support, and other campus service tools.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="developer-heading">
        <h2 id="developer-heading" className="text-2xl font-bold text-slate-950 dark:text-white">
          Developer and institution
        </h2>
        <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
          BIT Central was developed by Jaison David M, a CSE student at Bannari Amman Institute of Technology, Sathyamangalam. The application is built to improve access to student resources and campus information for the BIT Sathy community.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <a href="https://github.com/jaisondavid-m" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 bg-white p-5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
            <Github className="h-6 w-6 text-slate-800 dark:text-slate-100" aria-hidden="true" />
            <span className="mt-3 block font-semibold">GitHub</span>
            <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">@jaisondavid-m</span>
          </a>
          <a href="https://www.linkedin.com/in/jaison-david-m-a14072360/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 bg-white p-5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
            <Linkedin className="h-6 w-6 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <span className="mt-3 block font-semibold">LinkedIn</span>
            <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Jaison David M</span>
          </a>
          <a href="https://www.bitsathy.ac.in/" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-slate-200 bg-white p-5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
            <Globe className="h-6 w-6 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <span className="mt-3 block font-semibold">Institution</span>
            <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Bannari Amman Institute of Technology</span>
          </a>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/developer" className="rounded-md bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Developer details
          </Link>
          <Link to="/features" className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            View features
          </Link>
          <Link to="/faq" className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900">
            Read FAQ
          </Link>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

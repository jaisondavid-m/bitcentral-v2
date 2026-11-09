import React from "react";
import { Link } from "react-router-dom";
import { Github, Globe, Linkedin } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import Navbar from "@/components/layout/NavBar.jsx";
import Footer from "@/components/layout/Footer.jsx";
import { useAuth } from "@/context/StudentContext.jsx";
import { isAllowedEmail } from "@/services/authRules.js";

export default function About() {
  const { user } = useAuth();
  const isAuthenticated = Boolean(user && isAllowedEmail(user?.email));

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      {isAuthenticated ? <Navbar /> : <PublicNav />}

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
            About BIT Central
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            BIT Central is a student portal for BIT Sathy
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            Summary: BIT Central helps students of Bannari Amman Institute of Technology find academic resources, question banks, answer keys, mess menu information, reward points access, exam hall tools, leave schedules, and campus resources from one web application.
          </p>
        </section>

        <section className="border-y border-zinc-900 bg-white py-12 dark:border-white dark:bg-[#111827]" aria-labelledby="mission-heading">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h2 id="mission-heading" className="text-2xl font-black text-zinc-900 dark:text-white">
              What BIT Central does
            </h2>
            <p className="mt-3 text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
              BIT Central organizes important student information for the BIT Sathy community. The public pages explain the platform for students, parents, and search engines. The protected app gives signed-in students access to campus tools and resources connected to academic life at Bannari Amman Institute of Technology.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <article className="rounded-xl border border-zinc-900 bg-blue-50/40 p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-zinc-800/80 dark:shadow-[3px_3px_0px_#ffffff]">
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">Who can use it?</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
                  Public pages are open to everyone. Protected student tools are intended for BIT Sathy students who sign in with an institutional Google account.
                </p>
              </article>
              <article className="rounded-xl border border-zinc-900 bg-blue-50/40 p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-zinc-800/80 dark:shadow-[3px_3px_0px_#ffffff]">
                <h3 className="font-black text-lg text-zinc-900 dark:text-white">What does it include?</h3>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
                  Academic resources, question banks, answer keys, semester materials, mess menu updates, reward points links, exam hall support, and other campus service tools.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="developer-heading">
          <h2 id="developer-heading" className="text-2xl font-black text-zinc-900 dark:text-white">
            Developer and institution
          </h2>
          <p className="mt-3 text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            BIT Central was developed by Jaison David M, a CSE student at Bannari Amman Institute of Technology, Sathyamangalam. The application is built to improve access to student resources and campus information for the BIT Sathy community.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            <a href="https://github.com/jaisondavid-m" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-900 dark:shadow-[3px_3px_0px_#ffffff] transition-all">
              <Github className="h-6 w-6 text-zinc-900 dark:text-white" aria-hidden="true" />
              <span className="mt-3 block font-black text-zinc-900 dark:text-white">GitHub</span>
              <span className="mt-1 block text-xs font-bold text-zinc-500 dark:text-zinc-400">@jaisondavid-m</span>
            </a>
            <a href="https://www.linkedin.com/in/jaison-david-m-a14072360/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-900 dark:shadow-[3px_3px_0px_#ffffff] transition-all">
              <Linkedin className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="mt-3 block font-black text-zinc-900 dark:text-white">LinkedIn</span>
              <span className="mt-1 block text-xs font-bold text-zinc-500 dark:text-zinc-400">Jaison David M</span>
            </a>
            <a href="https://www.bitsathy.ac.in/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-900 dark:shadow-[3px_3px_0px_#ffffff] transition-all">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="mt-3 block font-black text-zinc-900 dark:text-white">Institution</span>
              <span className="mt-1 block text-xs font-bold text-zinc-500 dark:text-zinc-400">Bannari Amman Institute of Technology</span>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/developer" className="rounded-xl border border-zinc-900 bg-white px-5 py-2.5 text-xs sm:text-sm font-black text-zinc-900 shadow-[2px_2px_0px_#18181b] hover:bg-zinc-100 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer">
              Developer details
            </Link>
            <Link to="/features" className="rounded-xl border border-zinc-900 bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer">
              View features
            </Link>
            <Link to="/faq" className="rounded-xl border border-zinc-900 bg-white px-5 py-2.5 text-xs sm:text-sm font-black text-zinc-900 shadow-[2px_2px_0px_#18181b] hover:bg-zinc-100 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer">
              Read FAQ
            </Link>
          </div>
        </section>
      </main>

      {isAuthenticated ? <Footer /> : <PublicFooter />}
    </div>
  );
}

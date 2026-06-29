import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2, LogIn } from "lucide-react";
import PublicNav from "../Component/PublicNav.jsx";
import FAQSection from "../Component/FAQSection.jsx";
import { benefitList, contactMethods, developerProfile, featureList } from "../content/publicContent.js";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("visitedLogin") === "true") {
      navigate("/login", { replace: true });
    }
  }, [navigate])

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <PublicNav />

      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">
              Student portal for Bannari Amman Institute of Technology
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl dark:text-white">
              BIT Central
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
              BIT Central is a student portal for BIT Sathy that helps students find academic resources, question banks, answer keys, mess menu updates, exam utilities, reward points access, and campus service links from one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login" onClick={() => localStorage.setItem("visitedLogin", "true")} className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Login to BIT Central
              </Link>
              <Link to="/features" className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900">
                View Features
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="text-xl font-bold text-slate-950 dark:text-white">
              AI-friendly summary
            </h2>
            <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
              BIT Central is for students of Bannari Amman Institute of Technology, Sathyamangalam. The portal focuses on academic resources, semester materials, question banks, answer keys, mess menu information, student services, and campus tools. Public pages explain the platform; protected pages require BIT Sathy login.
            </p>
          </section>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="what-heading">
        <h2 id="what-heading" className="text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
          What is BIT Central?
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-700 dark:text-slate-300">
          BIT Central is a React and Vite web application built for the BIT Sathy student community. It organizes high-demand student resources such as academic PDFs, question banks, answer keys, mess menu updates, reward points links, exam hall support, leave schedules, and campus navigation tools.
        </p>
        <p className="mt-4 max-w-3xl leading-7 text-slate-700 dark:text-slate-300">
          BIT Central was developed by {developerProfile.name} for students of Bannari Amman Institute of Technology. The developer page explains the project creator, role, and institution details.
        </p>
        <Link to="/developer" className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900">
          Developer details
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      <section className="bg-white py-12 dark:bg-slate-950" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">Features</p>
              <h2 id="features-heading" className="mt-2 text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
                Student resources in one portal
              </h2>
            </div>
            <Link to="/features" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline dark:text-blue-300">
              Explore all features
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="benefits-heading">
        <h2 id="benefits-heading" className="text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
          Benefits for BIT Sathy students
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {benefitList.map((benefit) => (
            <p key={benefit} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 leading-7 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
              <CheckCircle2 className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
              {benefit}
            </p>
          ))}
        </div>
      </section>

      <FAQSection compact />

      <section className="bg-white py-12 dark:bg-slate-950" aria-labelledby="contact-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="contact-heading" className="text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
            Contact and feedback
          </h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-700 dark:text-slate-300">
            Students can use the public contact page to share feedback, suggest resource updates, or reach related public information about BIT Sathy.
          </p>
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
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Open Contact Page
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}

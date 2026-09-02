import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Building2, CalendarDays, CheckCircle2, Compass, GraduationCap, Lock, LogIn, ShieldCheck, Utensils } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import FAQSection from "@/components/features/FAQSection.jsx";
import FullScreenLoader from "@/components/common/FullScreenLoader.jsx";
import { benefitList, contactMethods, developerProfile, featureList, impactStats } from "@/content/publicContent.js";
import { GUIDES_DATA } from "@/content/guidesData.js";
import { useAuth } from "@/context/StudentContext.jsx";
import { isAllowedEmail } from "@/services/authRules.js";
import { hasValidAuthCookie } from "@/utils/cookieAuth.js";
import { Users } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const validCookieToken = hasValidAuthCookie();
    const isLoggedInUser = Boolean(user && isAllowedEmail(user.email));

    if (isLoggedInUser || validCookieToken) {
      navigate("/home", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <FullScreenLoader />;
  }

  const featuredGuides = GUIDES_DATA.slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">
              <GraduationCap className="h-4 w-4" />
              <span>Student Portal & Knowledge Hub</span>
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-950 sm:text-5xl dark:text-white">
              BIT Central
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
              BIT Central is a student-focused web portal and public knowledge hub for Bannari Amman Institute of Technology (BIT Sathy). It combines comprehensive campus guides, academic regulation breakdowns, exam hall procedures, and Wi-Fi setup guides with protected live student tools.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/guides"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-xs"
              >
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Explore Public Guides
              </Link>
              <Link
                to="/login"
                onClick={() => localStorage.setItem("visitedLogin", "true")}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Login to Portal
              </Link>
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900" aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              Portal Purpose & Structure
            </h2>
            <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300 text-sm">
              BIT Central solves the challenge of scattered academic materials and fragmented campus information for BIT Sathy students.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Public Guides (`/guides`):</strong> 100% crawlable, open-access campus guides, exam rules, question bank breakdowns, and first-year onboarding.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong>Protected Utilities:</strong> Authenticated exam seat lookup, individual biometric punch logs, live mess menus, and semester PDF downloads requiring `@bitsathy.ac.in` sign-in.</span>
              </li>
            </ul>
          </section>
        </div>
      </section>

      {/* Featured Knowledge Guides Section */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="guides-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">Knowledge Base</p>
            <h2 id="guides-heading" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
              Public BIT Sathy Student Guides
            </h2>
          </div>
          <Link to="/guides" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
            View All 10 Guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredGuides.map((guide) => (
            <article key={guide.slug} className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs hover:border-blue-400 dark:border-slate-800 dark:bg-slate-950">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                  {guide.category}
                </span>
                <h3 className="mt-3 font-bold text-base text-slate-950 line-clamp-2 dark:text-white">
                  <Link to={`/guides/${guide.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {guide.title}
                  </Link>
                </h3>
                <p className="mt-2 text-xs leading-5 text-slate-600 line-clamp-3 dark:text-slate-400">
                  {guide.shortDescription}
                </p>
              </div>
              <Link to={`/guides/${guide.slug}`} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline dark:text-blue-400">
                Read Guide <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* What is BIT Central Detailed Explanation */}
      <section className="bg-white py-12 dark:bg-slate-950" aria-labelledby="what-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="what-heading" className="text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
            What Problem Does BIT Central Solve?
          </h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-bold text-lg text-slate-950 dark:text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                Streamlining Academic & Campus Information
              </h3>
              <p className="mt-3 leading-7 text-sm text-slate-700 dark:text-slate-300">
                Students often spend substantial time locating exam venue allocations, previous year question banks, model answer key references, and daily hostel mess menu changes scattered across multiple notices. BIT Central organizes these essential utilities into a responsive single-window web app.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-bold text-lg text-slate-950 dark:text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-600" />
                Clear Boundary: Public Information vs Private Data
              </h3>
              <p className="mt-3 leading-7 text-sm text-slate-700 dark:text-slate-300">
                BIT Central ensures student privacy by keeping personal assessment records, individual attendance percentages, and specific exam seat allocations locked behind Google authentication, while maintaining 100% public access to explanatory guides, campus rules, and support documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BIT-CENTRAL in Numbers / Our Impact Section */}
      <section className="bg-slate-900 py-14 text-white dark:bg-slate-950 border-y border-slate-800" aria-labelledby="impact-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-blue-400 border border-blue-800/60">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Platform Adoption</span>
            </div>
            <h2 id="impact-heading" className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              {impactStats.title}
            </h2>
            <p className="mt-3 text-base text-slate-300">
              {impactStats.subtitle}
            </p>
          </div>

          {/* Primary Metric Hero Card */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-slate-800 bg-slate-800/60 p-8 text-center shadow-xl backdrop-blur-xs">
            <div className="text-5xl font-extrabold tracking-tight text-blue-400 sm:text-6xl">
              {impactStats.primaryStat}
            </div>
            <p className="mt-2 text-xl font-bold uppercase tracking-wide text-white">
              {impactStats.statLabel}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              {impactStats.description}
            </p>

            {/* Analytics Image Graph Display */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950 p-3 shadow-md">
              <img
                src="/statics/image.png"
                alt="BIT-CENTRAL Daily Active Users Analytics Chart displaying 1.4k daily active student traffic"
                className="mx-auto rounded-lg max-h-72 w-full object-contain"
                width="800"
                height="300"
                loading="lazy"
              />
              <p className="mt-2 text-xs font-medium text-slate-400">
                Verified Daily Active Student Usage Analytics Chart (1,400+ Daily Active Users)
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-slate-700/60 pt-4 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4 flex-shrink-0 text-emerald-400" aria-hidden="true" />
              <span>{impactStats.disclaimer}</span>
            </div>
          </div>

          {/* Metric Breakdown Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {impactStats.metrics.map((m) => (
              <div key={m.label} className="rounded-xl border border-slate-800 bg-slate-800/30 p-5 text-center">
                <div className="text-3xl font-bold text-white">{m.value}</div>
                <div className="mt-1 text-sm font-semibold text-blue-300">{m.label}</div>
                <p className="mt-2 text-xs leading-5 text-slate-400">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="features-heading">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">Overview</p>
            <h2 id="features-heading" className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
              Core Platform Capabilities
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
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{feature.summary}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-12 dark:bg-slate-950" aria-labelledby="benefits-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="benefits-heading" className="text-2xl font-bold text-slate-950 sm:text-3xl dark:text-white">
            Benefits for BIT Sathy Students
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {benefitList.map((benefit) => (
              <p key={benefit} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" aria-hidden="true" />
                {benefit}
              </p>
            ))}
          </div>
        </div>
      </section>

      <FAQSection compact />

      <PublicFooter />
    </main>
  );
}

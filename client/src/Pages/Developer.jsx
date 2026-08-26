import React from "react";
import { Github, Linkedin, Mail, Phone, UserRound } from "lucide-react";
import PublicNav from "../Component/PublicNav.jsx";
import PublicFooter from "../Component/PublicFooter.jsx";
import { developerProfile } from "../content/publicContent.js";

const developerLinks = [
  { label: "GitHub", href: "https://github.com/jaisondavid-m", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jaison-david-m-a14072360/", icon: Linkedin },
  { label: "Email", href: "mailto:developer@bitsathy.in", icon: Mail },
  { label: "Phone", href: "tel:+919843777817", icon: Phone },
];

export default function Developer() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">BIT Central developer</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white">
          BIT Central was developed by {developerProfile.name}
        </h1>
        <p className="mt-5 max-w-3xl leading-7 text-slate-700 dark:text-slate-300">
          Summary: {developerProfile.description}
        </p>
      </section>

      <section className="bg-white py-12 dark:bg-slate-950" aria-labelledby="developer-details-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900">
            <UserRound className="h-8 w-8 text-blue-700 dark:text-blue-300" aria-hidden="true" />
            <h2 id="developer-details-heading" className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">
              Developer details
            </h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400">Name</dt>
                <dd className="mt-1 font-semibold text-slate-950 dark:text-white">{developerProfile.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400">Role</dt>
                <dd className="mt-1 font-semibold text-slate-950 dark:text-white">{developerProfile.role}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold text-slate-500 dark:text-slate-400">Institution</dt>
                <dd className="mt-1 font-semibold text-slate-950 dark:text-white">{developerProfile.institution}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {developerLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} className="rounded-lg border border-slate-200 bg-white p-5 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-900">
                  <Icon className="h-6 w-6 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                  <span className="mt-3 block font-semibold text-slate-950 dark:text-white">{link.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

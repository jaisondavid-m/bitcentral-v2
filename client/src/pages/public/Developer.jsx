import React from "react";
import { Github, Linkedin, Mail, Phone, UserRound } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import { developerProfile } from "@/content/publicContent.js";

const developerLinks = [
  { label: "GitHub", href: "https://github.com/jaisondavid-m", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jaison-david-m-a14072360/", icon: Linkedin },
  { label: "Email", href: "mailto:developer@bitsathy.in", icon: Mail },
  { label: "Phone", href: "tel:+919843777817", icon: Phone },
];

export default function Developer() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
          BIT Central developer
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          BIT Central was developed by {developerProfile.name}
        </h1>
        <p className="mt-4 max-w-3xl text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
          Summary: {developerProfile.description}
        </p>
      </section>

      <section className="border-t border-zinc-900 bg-white py-12 dark:border-white dark:bg-[#111827]" aria-labelledby="developer-details-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-zinc-900 bg-blue-50/40 p-6 shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-zinc-900 dark:shadow-[4px_4px_0px_#ffffff]">
            <div className="rounded-lg border border-zinc-900 bg-blue-600 p-2 text-white w-fit shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]">
              <UserRound className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 id="developer-details-heading" className="mt-4 text-2xl font-black text-zinc-900 dark:text-white">
              Developer details
            </h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Name</dt>
                <dd className="mt-1 text-base font-black text-zinc-900 dark:text-white">{developerProfile.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Role</dt>
                <dd className="mt-1 text-base font-black text-zinc-900 dark:text-white">{developerProfile.role}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Institution</dt>
                <dd className="mt-1 text-base font-black text-zinc-900 dark:text-white">{developerProfile.institution}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {developerLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a key={link.label} href={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined} className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-900 dark:shadow-[3px_3px_0px_#ffffff] transition-all">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <span className="mt-3 block font-black text-zinc-900 dark:text-white">{link.label}</span>
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

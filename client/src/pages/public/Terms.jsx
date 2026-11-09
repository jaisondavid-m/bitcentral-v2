import React from "react";
import { Link } from "react-router-dom";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content:
      "By accessing or using BIT CENTRAL, you agree to these Terms of Service and to comply with all applicable laws and institutional policies. If you do not agree, you should not use the service.",
  },
  {
    title: "2. Use of the Service",
    content:
      "BIT CENTRAL is provided to support students and related institutional users. You agree to use the service only for lawful, appropriate, and authorized purposes and not to interfere with the operation or security of the platform.",
  },
  {
    title: "3. Account Responsibility",
    content:
      "If you sign in or otherwise access restricted features, you are responsible for maintaining the confidentiality of your account and for all activity that occurs under your access credentials.",
  },
  {
    title: "4. User Content and Conduct",
    content:
      "You must not upload, submit, or share content that is harmful, unlawful, misleading, abusive, infringing, or otherwise inappropriate. We may remove content or restrict access if we believe the Terms have been violated.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "The BIT CENTRAL name, branding, design, code, and original content are protected by applicable intellectual property laws. You may not reproduce or redistribute our materials without permission, except as allowed by law.",
  },
  {
    title: "6. Service Availability",
    content:
      "We aim to keep the platform available and accurate, but we do not guarantee uninterrupted operation, error-free content, or that all features will always be available.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "To the maximum extent permitted by law, BIT CENTRAL and its operators are not liable for indirect, incidental, special, or consequential damages arising from your use of the service.",
  },
  {
    title: "8. Changes to the Terms",
    content:
      "We may update these Terms at any time. Continued use of the service after changes are posted means you accept the revised Terms.",
  },
  {
    title: "9. Governing Contact",
    content:
      "For questions about these Terms, contact the BIT CENTRAL team through the site support options.",
  },
];

function Terms() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-900 bg-white p-8 shadow-[4px_4px_0px_#18181b] sm:p-10 dark:border-white dark:bg-[#111827] dark:shadow-[4px_4px_0px_#ffffff]">
          <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
            BIT CENTRAL
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">Effective date: May 17, 2026</p>
          <p className="mt-4 text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            Summary: These terms explain responsible use of BIT Central, including public information pages and protected student tools for academic resources, question banks, answer keys, mess menu information, and campus services.
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-black text-zinc-900 dark:text-white">{section.title}</h2>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">{section.content}</p>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-xl border border-zinc-900 bg-blue-50/40 p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-zinc-800/80 dark:shadow-[3px_3px_0px_#ffffff]">
            <h2 className="text-lg font-black text-zinc-900 dark:text-white">Contact Us</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
              Questions about these Terms can be sent to{" "}
              <a className="font-black text-blue-600 hover:underline dark:text-blue-400" href="mailto:developer@bitsathy.in">
                developer@bitsathy.in
              </a>{" "}
              or by phone at{" "}
              <a className="font-black text-blue-600 hover:underline dark:text-blue-400" href="tel:+919843777817">
                +91 98437 77817
              </a>.
            </p>
          </section>
          <nav className="mt-8 flex flex-wrap gap-4 text-xs font-black uppercase tracking-wider" aria-label="Related public pages">
            <Link className="text-blue-600 hover:underline dark:text-blue-400" to="/about">About</Link>
            <Link className="text-blue-600 hover:underline dark:text-blue-400" to="/features">Features</Link>
            <Link className="text-blue-600 hover:underline dark:text-blue-400" to="/faq">FAQ</Link>
            <Link className="text-blue-600 hover:underline dark:text-blue-400" to="/contact">Contact</Link>
          </nav>
        </div>
      </div>
      <PublicFooter />
    </main>
  );
}

export default Terms;

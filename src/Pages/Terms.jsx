import React from "react";
import { Link } from "react-router-dom";
import PublicNav from "../Component/PublicNav.jsx";

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
      "For questions about these Terms, contact the BIT CENTRAL team through the site or the official institutional support channel.",
  },
];

function Terms() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-black dark:text-slate-100">
      <PublicNav />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10 dark:bg-slate-950 dark:ring-slate-800">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            BIT CENTRAL
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-slate-500">Effective date: May 17, 2026</p>
          <p className="mt-6 text-base leading-7 text-slate-600">
            Summary: These terms explain responsible use of BIT Central, including public information pages and protected student tools for academic resources, question banks, answer keys, mess menu information, and campus services.
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{section.content}</p>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-lg bg-slate-100 p-6 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-950">Contact Us</h2>
            <p className="mt-2 leading-7 text-slate-600">
              Questions about these Terms can be sent to{" "}
              <a className="font-medium text-blue-700 hover:underline" href="mailto:developer@bitsathy.in">
                developer@bitsathy.in
              </a>{" "}
              or by phone at{" "}
              <a className="font-medium text-blue-700 hover:underline" href="tel:+919843777817">
                +91 98437 77817
              </a>.
            </p>
          </section>
          <nav className="mt-8 flex flex-wrap gap-3" aria-label="Related public pages">
            <Link className="font-medium text-blue-700 hover:underline" to="/about">About</Link>
            <Link className="font-medium text-blue-700 hover:underline" to="/features">Features</Link>
            <Link className="font-medium text-blue-700 hover:underline" to="/faq">FAQ</Link>
            <Link className="font-medium text-blue-700 hover:underline" to="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </main>
  );
}

export default Terms;

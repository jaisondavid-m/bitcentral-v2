import React from "react";
import { Link } from "react-router-dom";
import PublicNav from "../Component/PublicNav.jsx";

const sections = [
  {
    title: "1. Overview",
    content:
      "BIT CENTRAL respects your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have when using our website and related services.",
  },
  {
    title: "2. Information We Collect",
    content:
      "We may collect information you provide directly, such as your name, email address, department, batch, login activity, and any message you send through our contact channels. We may also collect limited technical information such as browser type, device information, IP address, and usage data for security, analytics, and service improvement.",
  },
  {
    title: "3. How We Use Information",
    content:
      "We use information to operate and maintain the platform, authenticate users, personalize your experience, respond to inquiries, improve performance, prevent abuse, and comply with legal obligations. We may also use aggregated data to understand general usage trends.",
  },
  {
    title: "4. Third-Party Services",
    content:
      "We may use third-party services for analytics and other site features. These services are governed by their own terms and privacy practices.",
  },
  {
    title: "5. Cookies",
    content:
      "Cookies and similar technologies may be used to keep you signed in, remember preferences, analyze traffic, and support advertising. You can control cookies through your browser settings, but some parts of the site may not function properly if cookies are disabled.",
  },
  {
    title: "6. Data Sharing",
    content:
      "We do not sell your personal information. We may share information with trusted service providers that help us run the platform, with legal authorities when required, or in connection with a merger, acquisition, or similar business event.",
  },
  {
    title: "7. Data Retention and Security",
    content:
      "We keep information only as long as necessary for the purposes described in this policy or as required by law. We use reasonable administrative, technical, and organizational safeguards, but no system is completely secure.",
  },
  {
    title: "8. Your Choices",
    content:
      "Depending on your location and applicable law, you may have rights to access, correct, delete, or restrict the use of your personal information. You may also opt out of certain advertising-related cookies through browser settings or Google ad preferences.",
  },
  {
    title: "9. Children's Privacy",
    content:
      "Our services are intended for students and related institutional users. We do not knowingly collect personal information from children without appropriate authorization where required by law.",
  },
  {
    title: "10. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. When we do, we will revise the effective date below and post the updated version on this page.",
  },
];

function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 dark:bg-black dark:text-slate-100">
      <PublicNav />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10 dark:bg-slate-950 dark:ring-slate-800">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            BIT CENTRAL
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-slate-500">Effective date: May 17, 2026</p>
          <p className="mt-6 text-base leading-7 text-slate-600">
            Summary: This policy explains what BIT Central may collect from students and visitors, how the student portal uses that information, and how users can contact the developer about privacy questions.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-600">
            BIT Central supports students of Bannari Amman Institute of Technology with academic resources, question banks, answer keys, mess menu information, and protected student tools.
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
              If you have questions about this Privacy Policy, contact the developer at{" "}
              <a className="font-medium text-blue-700 hover:underline" href="mailto:developer@bitsathy.in">
                developer@bitsathy.in
              </a>{" "}
              or call{" "}
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

export default PrivacyPolicy;

import React from "react";

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
    title: "4. Google AdSense and Third-Party Services",
    content:
      "We may use Google AdSense and related advertising technologies. Third-party vendors, including Google, may use cookies or similar technologies to serve ads based on your prior visits to this and other websites. Google\'s use of advertising cookies allows it and its partners to serve ads to our users based on their visits to our site and/or other sites on the Internet.",
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
    title: "9. Children\'s Privacy",
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
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            BIT CENTRAL
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-slate-500">Effective date: May 17, 2026</p>
          <p className="mt-6 text-base leading-7 text-slate-600">
            This policy is provided for users of BIT CENTRAL and is intended to clearly explain our
            privacy practices in a professional, easy-to-review format.
          </p>

          <div className="mt-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
                <p className="mt-2 leading-7 text-slate-600">{section.content}</p>
              </section>
            ))}
          </div>

          <section className="mt-10 rounded-2xl bg-slate-100 p-6">
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
        </div>
      </div>
    </main>
  );
}

export default PrivacyPolicy;

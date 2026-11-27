import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Mail, Send } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import { contactMethods } from "@/content/publicContent.js";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }
    // Prepare mailto fallback link for user convenience
    const mailtoSubject = encodeURIComponent(formData.subject.trim() || "Inquiry from BIT Central");
    const mailtoBody = encodeURIComponent(
      `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`
    );
    window.location.href = `mailto:developer@bitsathy.in?subject=${mailtoSubject}&body=${mailtoBody}`;
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
          Contact BIT Central
        </div>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
          Feedback, updates, and public information
        </h1>
        <p className="mt-4 max-w-3xl text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
          Summary: Use this page to share feedback about BIT Central, suggest updates to academic resources, report missing question banks or answer keys, and find public information about Bannari Amman Institute of Technology.
        </p>
      </section>

      <section className="border-t border-zinc-900 bg-white py-12 dark:border-white dark:bg-[#111827]" aria-labelledby="contact-options-heading">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 id="contact-options-heading" className="text-2xl font-black text-zinc-900 dark:text-white">
            Contact options
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <a key={method.label} href={method.href} target={method.external ? "_blank" : undefined} rel={method.external ? "noopener noreferrer" : undefined} className="rounded-xl border border-zinc-900 bg-blue-50/40 p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-900 dark:shadow-[3px_3px_0px_#ffffff] transition-all">
                  <div className="rounded-lg border border-zinc-900 bg-blue-50 p-2 text-blue-600 dark:border-white dark:bg-blue-950 dark:text-blue-400 w-fit shadow-[1.5px_1.5px_0px_#18181b] dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="mt-3 block font-black text-zinc-900 dark:text-white">{method.label}</span>
                  <span className="mt-1 block text-sm font-semibold text-zinc-600 dark:text-zinc-300">{method.value}</span>
                </a>
              );
            })}
          </div>

          {/* Interactive Direct Message Form */}
          <div className="mt-12 rounded-2xl border border-zinc-900 bg-[#f8fafc] p-6 sm:p-8 shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#0c1220] dark:shadow-[4px_4px_0px_#ffffff]">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                Send a direct message
              </h3>
            </div>
            <p className="mt-2 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400">
              Have a question regarding study resources, campus documentation, or Google AdSense compliance? Fill out the form below.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-xl border border-emerald-600 bg-emerald-50 p-5 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="font-bold text-sm">Thank you for your message!</p>
                </div>
                <p className="mt-1 text-xs">
                  Your inquiry has been prepared for developer@bitsathy.in. We usually respond within 24 to 48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-4 rounded-lg border border-emerald-900 bg-white px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-emerald-300 cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      autoComplete="name"
                      maxLength={80}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Kumar"
                      className="mt-1 w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2.5 text-sm font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white dark:bg-[#111827] dark:text-white dark:placeholder:text-zinc-500 dark:shadow-[2px_2px_0px_#ffffff]"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Your Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      autoComplete="email"
                      maxLength={100}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. alex@example.com"
                      className="mt-1 w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2.5 text-sm font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white dark:bg-[#111827] dark:text-white dark:placeholder:text-zinc-500 dark:shadow-[2px_2px_0px_#ffffff]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Subject *
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    maxLength={120}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Resource update or feedback inquiry"
                    className="mt-1 w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2.5 text-sm font-bold text-zinc-900 shadow-[2px_2px_0px_#18181b] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white dark:bg-[#111827] dark:text-white dark:placeholder:text-zinc-500 dark:shadow-[2px_2px_0px_#ffffff]"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    minLength={10}
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="mt-1 w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2.5 text-sm font-semibold text-zinc-900 shadow-[2px_2px_0px_#18181b] placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-white dark:bg-[#111827] dark:text-white dark:placeholder:text-zinc-500 dark:shadow-[2px_2px_0px_#ffffff]"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-900 bg-blue-600 px-6 py-2.5 text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

          <p className="mt-8 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            For login, dashboard, mess menu, semester resources, and other protected tools, students should use their BIT Sathy institutional account.
          </p>
          <Link to="/login" className="mt-6 inline-flex rounded-xl border border-zinc-900 bg-blue-600 px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer">
            Login to student portal
          </Link>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}

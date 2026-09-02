import { Link } from "react-router-dom";
import { AlertTriangle, Building2, CheckCircle2, GraduationCap, Info, Mail, ShieldAlert } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import { developerProfile } from "@/content/publicContent.js";

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      <PublicNav />

      {/* Header */}
      <section className="border-b border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" />
            <span>Legal Notice & Institutional Boundaries</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white">
            BIT Central Disclaimer
          </h1>
          <p className="mt-3 text-base text-slate-700 dark:text-slate-300">
            This disclaimer clarifies the operational status, non-official nature, and content accuracy policies of the BIT Central website.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            1. Independent Student Platform Status
          </h2>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            BIT Central (bitcentral.bitsathy.in) is an <strong>independent student platform</strong> created and maintained by <strong>{developerProfile.name}</strong> for the Bannari Amman Institute of Technology (BIT Sathy) student community. 
          </p>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            BIT Central is <strong>NOT</strong> an official website of Bannari Amman Institute of Technology, nor is it officially operated by or affiliated with the college administration or the Office of the Controller of Examinations (COE).
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            2. Official Authority & Circulars
          </h2>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            Official academic circulars, semester exam timetables, fee notifications, hall ticket issuances, and administrative policies issued directly by Bannari Amman Institute of Technology, its Principal, and the Controller of Examinations remain the <strong>sole and final authority</strong>.
          </p>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            Students and visitors should always verify critical examination dates, fee deadlines, and official announcements through official institutional channels (such as the official college website at <a href="https://www.bitsathy.ac.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline dark:text-blue-400">bitsathy.ac.in</a> or direct administrative notices).
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-emerald-600" />
            3. Descriptive Use of Names and Marks
          </h2>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            References to "Bannari Amman Institute of Technology", "BIT Sathy", "BIT Central", department names, subject codes (such as 22PH202 or 22HS006), and campus block designations are used solely for <strong>identification, educational, descriptive, and nominative fair-use purposes</strong> to help students locate relevant study guides and utilities.
          </p>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            All registered trademarks, institution names, logos, and official seals belong to their respective trademark owners.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-purple-600" />
            4. Limitation of Liability
          </h2>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            While every effort is made to maintain accurate guide content, syllabus summaries, and platform reliability, BIT Central makes no warranties regarding the absolute completeness or real-time synchronization of schedules. The developer and maintainers shall not be held liable for any direct or indirect consequences resulting from reliance on unofficial summaries.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-950">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600" />
            5. Contact for Legal or Content Inquiries
          </h2>
          <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">
            For questions, content updates, or feedback regarding this disclaimer, please contact the platform developer at:
          </p>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm">
            <p className="font-semibold text-slate-900 dark:text-white">{developerProfile.name}</p>
            <p className="text-slate-600 dark:text-slate-400">Developer of BIT Central</p>
            <p className="mt-2 text-blue-600 dark:text-blue-400 font-mono">
              <a href="mailto:developer@bitsathy.in">developer@bitsathy.in</a>
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

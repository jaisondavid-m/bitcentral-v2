import { Link } from "react-router-dom";
import { AlertTriangle, Building2, CheckCircle2, GraduationCap, Info, Mail, ShieldAlert } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import { developerProfile } from "@/content/publicContent.js";

export default function Disclaimer() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />

      {/* Header */}
      <section className="border-b border-zinc-900 bg-white py-12 dark:border-white dark:bg-[#111827]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-amber-500 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
            <AlertTriangle className="h-4 w-4" />
            <span>Legal Notice & Institutional Boundaries</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            BIT Central Disclaimer
          </h1>
          <p className="mt-3 text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            This disclaimer clarifies the operational status, non-official nature, and content accuracy policies of the BIT Central website.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="rounded-xl border border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            1. Independent Student Platform Status
          </h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            BIT Central (bitcentral.bitsathy.in) is an <strong>independent student platform</strong> created and maintained by <strong>{developerProfile.name}</strong> for the Bannari Amman Institute of Technology (BIT Sathy) student community. 
          </p>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            BIT Central is <strong>NOT</strong> an official website of Bannari Amman Institute of Technology, nor is it officially operated by or affiliated with the college administration or the Office of the Controller of Examinations (COE).
          </p>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            2. Official Authority & Circulars
          </h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            Official academic circulars, semester exam timetables, fee notifications, hall ticket issuances, and administrative policies issued directly by Bannari Amman Institute of Technology, its Principal, and the Controller of Examinations remain the <strong>sole and final authority</strong>.
          </p>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            Students and visitors should always verify critical examination dates, fee deadlines, and official announcements through official institutional channels (such as the official college website at <a href="https://www.bitsathy.ac.in/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline dark:text-blue-400">bitsathy.ac.in</a> or direct administrative notices).
          </p>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Info className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            3. Descriptive Use of Names and Marks
          </h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            References to "Bannari Amman Institute of Technology", "BIT Sathy", "BIT Central", department names, subject codes (such as 22PH202 or 22HS006), and campus block designations are used solely for <strong>identification, educational, descriptive, and nominative fair-use purposes</strong> to help students locate relevant study guides and utilities.
          </p>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            All registered trademarks, institution names, logos, and official seals belong to their respective trademark owners.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            4. Limitation of Liability
          </h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            While every effort is made to maintain accurate guide content, syllabus summaries, and platform reliability, BIT Central makes no warranties regarding the absolute completeness or real-time synchronization of schedules. The developer and maintainers shall not be held liable for any direct or indirect consequences resulting from reliance on unofficial summaries.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            5. Contact for Legal or Content Inquiries
          </h2>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            For questions, content updates, or feedback regarding this disclaimer, please contact the platform developer at:
          </p>
          <div className="mt-4 rounded-xl border border-zinc-900 bg-blue-50/50 p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:shadow-[2px_2px_0px_#ffffff] text-sm">
            <p className="font-black text-zinc-900 dark:text-white">{developerProfile.name}</p>
            <p className="font-semibold text-zinc-600 dark:text-zinc-400">Developer of BIT Central</p>
            <p className="mt-2 text-blue-600 dark:text-blue-400 font-mono font-bold">
              <a href="mailto:developer@bitsathy.in">developer@bitsathy.in</a>
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

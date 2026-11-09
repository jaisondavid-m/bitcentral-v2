import React from 'react';
import { Download, Smartphone } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa';

export default function PCDP() {
  const setupLink = 'psapp://onboard?org=bitsathy&url=https%3A%2F%2Fps.bitsathy.ac.in%2Fapi%2Fps_app_v2';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] px-4 py-8 dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors sm:px-6 lg:px-8">
      <main className="mx-auto max-w-4xl">
        <section className="rounded-2xl border border-zinc-900 bg-white p-6 shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[4px_4px_0px_#ffffff] sm:p-8">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
              <Smartphone className="h-3.5 w-3.5" />
              <span>PCDP App Setup</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
              Open the app with proper onboarding
            </h1>
            <p className="mx-auto mt-2 max-w-2xl text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Install the app first, fully close it, and then tap the setup link below so the app opens with the correct BIT Sathy organization configuration.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-900 bg-blue-50/50 p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-zinc-800/60 dark:shadow-[3px_3px_0px_#ffffff]">
              <div className="mb-2 inline-flex items-center rounded-md border border-zinc-900 bg-white px-2 py-0.5 text-xs font-black text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-900 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                STEP 1
              </div>
              <h2 className="text-base font-black text-zinc-900 dark:text-white">Install the app</h2>
              <p className="mt-1.5 text-xs font-semibold leading-relaxed text-zinc-600 dark:text-zinc-400">
                Download PCDP from Google Play or the App Store and finish the installation.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-blue-50/50 p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-zinc-800/60 dark:shadow-[3px_3px_0px_#ffffff]">
              <div className="mb-2 inline-flex items-center rounded-md border border-zinc-900 bg-white px-2 py-0.5 text-xs font-black text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-900 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                STEP 2
              </div>
              <h2 className="text-base font-black text-zinc-900 dark:text-white">Close the app</h2>
              <p className="mt-1.5 text-xs font-semibold leading-relaxed text-zinc-600 dark:text-zinc-400">
                Exit the app completely from your recent apps before opening the onboarding link.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-900 bg-blue-50/50 p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-zinc-800/60 dark:shadow-[3px_3px_0px_#ffffff]">
              <div className="mb-2 inline-flex items-center rounded-md border border-zinc-900 bg-white px-2 py-0.5 text-xs font-black text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-900 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                STEP 3
              </div>
              <h2 className="text-base font-black text-zinc-900 dark:text-white">Open setup link</h2>
              <p className="mt-1.5 text-xs font-semibold leading-relaxed text-zinc-600 dark:text-zinc-400">
                Come back here and tap the button below to launch the app with the correct setup.
              </p>
            </div>
          </div>

          <section className="mt-6 rounded-2xl border border-zinc-900 bg-blue-600 p-6 text-white shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-blue-950 dark:shadow-[4px_4px_0px_#ffffff] sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="inline-flex items-center rounded-md border border-zinc-900 bg-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider text-blue-700 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white">
                  Direct Configuration
                </span>
                <h2 className="mt-2 text-xl sm:text-2xl font-black text-white">Tap to open app properly</h2>
                <p className="mt-1.5 max-w-xl text-xs sm:text-sm font-semibold leading-relaxed text-blue-100">
                  This link sends the BIT Sathy organization ID and API endpoint to the app so onboarding is applied automatically.
                </p>
              </div>

              <a
                href={setupLink}
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-zinc-900 bg-white px-6 py-3.5 text-sm font-black text-zinc-900 shadow-[2px_2px_0px_#18181b] hover:bg-zinc-100 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-white dark:text-zinc-900 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <Download size={18} />
                Open Setup Link
              </a>
            </div>

            <div className="mt-4 rounded-xl border border-zinc-900/40 bg-blue-700/80 p-3 text-xs font-mono font-bold break-all text-blue-100 dark:border-white/30 dark:bg-blue-900/60">
              {setupLink}
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.ps_student"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-xl border border-zinc-900 bg-white px-6 py-3.5 text-sm font-black text-zinc-900 shadow-[3px_3px_0px_#18181b] hover:bg-blue-50 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-[#111827] dark:text-white dark:shadow-[3px_3px_0px_#ffffff] transition-all cursor-pointer"
            >
              <FaGoogle size={20} className="text-blue-600" />
              <span>Install from Google Play</span>
            </a>

            <a
              href="https://apps.apple.com/in/app/pcdp-app/id6742381503"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-xl border border-zinc-900 bg-white px-6 py-3.5 text-sm font-black text-zinc-900 shadow-[3px_3px_0px_#18181b] hover:bg-blue-50 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-[#111827] dark:text-white dark:shadow-[3px_3px_0px_#ffffff] transition-all cursor-pointer"
            >
              <FaApple size={22} />
              <span>Install from App Store</span>
            </a>
          </section>
        </section>
      </main>
    </div>
  );
}
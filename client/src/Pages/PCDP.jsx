import React from 'react';
import { Download } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa';

export default function PCDP() {
  const setupLink = 'psapp://onboard?org=bitsathy&url=https%3A%2F%2Fps.bitsathy.ac.in%2Fapi%2Fps_app_v2';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm shadow-slate-200/60 backdrop-blur sm:p-10">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              PCDP App Setup
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Open the app with the proper onboarding link
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              Install the app first, fully close it, and then tap the setup link below so the app opens with the correct organization configuration.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Step 1</div>
              <h2 className="text-lg font-bold text-slate-900">Install the app</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Download PCDP from Google Play or the App Store and finish the installation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Step 2</div>
              <h2 className="text-lg font-bold text-slate-900">Close the app</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Exit the app completely before opening the onboarding link.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Step 3</div>
              <h2 className="text-lg font-bold text-slate-900">Open the setup link</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Come back here and tap the button below to launch the app with the correct setup.
              </p>
            </div>
          </div>

          <section className="mt-8 rounded-3xl bg-slate-900 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Setup link</p>
                <h2 className="mt-2 text-2xl font-bold">Tap to open the app properly</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  This link sends the organization and API URL to the app so onboarding is applied correctly.
                </p>
              </div>

              <a
                href={setupLink}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                <Download size={20} />
                Open Setup Link
              </a>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs break-all text-slate-300">
              {setupLink}
            </div>
          </section>

          <section className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              href="https://play.google.com/store/apps/details?id=com.ps_student"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <FaGoogle size={22} />
              <span>Install from Google Play</span>
            </a>

            <a
              href="https://apps.apple.com/in/app/pcdp-app/id6742381503"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
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
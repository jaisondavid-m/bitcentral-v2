import React, { useState, useEffect } from "react";
import { Wifi, Copy, Check, Lock, ShieldAlert, KeyRound, Server, ChevronRight, HelpCircle, ExternalLink } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";

const wifiNetworks = [
  {
    name: "General Campus Wi-Fi",
    location: "Campus Buildings & Common Areas",
    password: "bitsathy",
    badge: "General Campus",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
    iconColor: "text-blue-600 dark:text-blue-400",
    description: "Default Wi-Fi password for general campus access points and common student zones.",
  },
  {
    name: "Sapphire Hostel",
    location: "Sapphire Hostel Block",
    password: "sapphire",
    badge: "Sapphire Hostel",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200",
    iconColor: "text-purple-600 dark:text-purple-400",
    description: "Default Wi-Fi password for Sapphire Hostel rooms and common halls.",
  },
  {
    name: "Ruby Hostel",
    location: "Ruby Hostel Block",
    password: "bitsathy",
    badge: "Ruby Hostel",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-200",
    iconColor: "text-rose-600 dark:text-rose-400",
    description: "Default Wi-Fi password for Ruby Hostel rooms and common areas.",
  },
  {
    name: "Emerald Hostel",
    location: "Emerald Hostel Block",
    password: "bitsathy",
    badge: "Emerald Hostel",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    description: "Default Wi-Fi password for Emerald Hostel rooms and floors.",
  },
];

const passwordSteps = [
  {
    step: "1",
    title: "Connect to Hostel Wi-Fi",
    detail: "Turn on Wi-Fi on your laptop or phone, select your hostel network (e.g. Sapphire, Ruby, Emerald), and enter the default password listed above.",
  },
  {
    step: "2",
    title: "Open Router Admin Page",
    detail: "Open any web browser (Chrome, Edge, Safari) and visit your router login IP address (typically 192.168.1.1 or 192.168.0.1, or campus portal 10.10.0.1).",
  },
  {
    step: "3",
    title: "Log in to Admin Settings",
    detail: "Enter the router username and password (usually default 'admin' / 'admin' or institutional admin credentials provided by hostel wardens).",
  },
  {
    step: "4",
    title: "Change WPA/WPA2 Passphrase",
    detail: "Navigate to Wireless > Wireless Security > Pre-Shared Key / Passphrase. Enter your new custom password and click Save & Apply.",
  },
  {
    step: "5",
    title: "Reconnect Devices",
    detail: "Forget the old network on your phone/laptop and reconnect using your newly updated password.",
  },
];

export default function WifiDetails() {
  const [copiedKey, setCopiedKey] = useState(null);
  const [isConnected, setIsConnected] = useState(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });

  useEffect(() => {
    const handleStatusChange = () => {
      setIsConnected(navigator.onLine);
    };

    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    if (typeof navigator !== "undefined" && navigator.connection) {
      navigator.connection.addEventListener("change", handleStatusChange);
    }

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
      if (typeof navigator !== "undefined" && navigator.connection) {
        navigator.connection.removeEventListener("change", handleStatusChange);
      }
    };
  }, []);

  const handleCopy = (password, key) => {
    navigator.clipboard.writeText(password);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />

      {/* Hero Header */}
      <section className="border-b border-zinc-900 bg-white py-12 dark:border-white dark:bg-[#111827]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-zinc-900 bg-blue-600 px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
                <Wifi className="h-4 w-4" />
                <span>Campus & Hostel Connectivity</span>
              </div>
              <h1 className="mt-3 text-3xl font-black text-zinc-900 sm:text-4xl dark:text-white">
                BIT Sathy Wi-Fi Passwords & Setup Guide
              </h1>
              <p className="mt-3 max-w-3xl text-sm sm:text-base font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
                Quick reference for default Wi-Fi passwords across BIT Sathy hostel blocks (Sapphire, Ruby, Emerald) and instructions on how to change your Wi-Fi password securely.
              </p>
            </div>

            {/* Wi-Fi Status & View Details Action */}
            {isConnected && (
              <div className="shrink-0 mt-4 md:mt-0">
                <div className="rounded-xl border border-zinc-900 bg-emerald-50 p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-emerald-950/40 dark:shadow-[3px_3px_0px_#ffffff]">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider mb-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    Connected to Wi-Fi
                  </div>
                  <a
                    href="http://1.1.11"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-900 bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-emerald-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
                  >
                    <span>View Details</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Network Cards Grid */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <KeyRound className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
            Default Wi-Fi Passwords
          </h2>
        </div>
        <p className="mt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          Click the copy button next to any password to copy it to your clipboard.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {wifiNetworks.map((net) => {
            const isCopied = copiedKey === net.name;
            return (
              <div
                key={net.name}
                className="flex flex-col justify-between rounded-xl border border-zinc-900 bg-white p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-block rounded-md border border-zinc-900 bg-blue-100 px-2.5 py-0.5 text-xs font-black text-blue-900 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-blue-900/60 dark:text-blue-100 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                        {net.badge}
                      </span>
                      <h3 className="mt-3 text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                        <Wifi className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        {net.name}
                      </h3>
                      <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1">{net.location}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">{net.description}</p>
                </div>

                <div className="mt-6 rounded-lg border border-zinc-900 bg-blue-50/60 p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800/80 dark:shadow-[2px_2px_0px_#ffffff]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block">Default Password</span>
                      <code className="text-lg font-mono font-black text-zinc-900 dark:text-white">{net.password}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(net.password, net.name)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-2 text-xs font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How to Change Password Guide */}
      <section className="border-t border-zinc-900 bg-white py-12 dark:border-white dark:bg-[#111827]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
              How to Change Your Wi-Fi Password
            </h2>
          </div>
          <p className="mt-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
            For security, it is highly recommended to change the default Wi-Fi password for your hostel room router.
          </p>

          <div className="mt-8 space-y-4">
            {passwordSteps.map((s) => (
              <div key={s.step} className="flex gap-4 rounded-xl border border-zinc-900 bg-slate-50 p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-zinc-800/60 dark:shadow-[3px_3px_0px_#ffffff]">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-900 bg-blue-600 font-black text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-black text-zinc-900 dark:text-white">{s.title}</h3>
                  <p className="mt-1 text-sm font-medium leading-6 text-zinc-600 dark:text-zinc-300">{s.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Support Note */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-zinc-900 bg-amber-50 p-6 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-amber-950/30 dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <h3 className="font-black text-amber-950 dark:text-amber-200">Important Security Reminders</h3>
              <ul className="mt-2 list-disc list-inside text-sm font-medium space-y-1 text-amber-900 dark:text-amber-300 leading-6">
                <li>Always use a strong password with letters, numbers, and special characters.</li>
                <li>Do not share router admin access credentials with unauthorized persons.</li>
                <li>If you forget your custom password, reset your router using the physical reset button for 10 seconds.</li>
                <li>For network speed issues or hostel port maintenance, contact BIT Sathy IT Support or Warden Office.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

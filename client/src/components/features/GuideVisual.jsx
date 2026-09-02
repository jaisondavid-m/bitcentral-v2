import React from "react";
import { Building2, Calendar, CheckCircle, Clock, MapPin, Search, ShieldCheck, UserCheck, Utensils, Wifi } from "lucide-react";

export default function GuideVisual({ type, caption, altText }) {
  if (type === "exam-hall") {
    return (
      <figure className="my-8 rounded-xl border border-slate-200 bg-slate-900 text-white shadow-lg overflow-hidden dark:border-slate-800">
        <div className="bg-slate-800/90 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs font-mono text-slate-300">BIT Central - Exam Hall Utility Interface</span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
            Live Preview Mockup
          </span>
        </div>
        <div className="p-6">
          <div className="mb-6 flex flex-wrap gap-4 items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Student Reg No</span>
              <p className="text-lg font-bold text-white font-mono">7376221CS101</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Exam Session</span>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1">
                <Clock className="h-4 w-4" /> Forenoon (09:30 AM - 12:30 PM)
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700/60">
              <span className="text-xs text-slate-400 block font-medium">Assigned Block</span>
              <p className="text-xl font-bold text-blue-400 flex items-center gap-2 mt-1">
                <Building2 className="h-5 w-5" /> SF Block (2nd Floor)
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700/60">
              <span className="text-xs text-slate-400 block font-medium">Room / Hall No</span>
              <p className="text-xl font-bold text-purple-400 flex items-center gap-2 mt-1">
                <MapPin className="h-5 w-5" /> Hall SF-204
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700/60">
              <span className="text-xs text-slate-400 block font-medium">Desk / Seat No</span>
              <p className="text-xl font-bold text-amber-400 flex items-center gap-2 mt-1">
                <UserCheck className="h-5 w-5" /> Desk Row B-12
              </p>
            </div>
          </div>
        </div>
        {caption && (
          <figcaption className="bg-slate-950 px-4 py-2 text-center text-xs text-slate-400 border-t border-slate-800">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (type === "mess-menu") {
    return (
      <figure className="my-8 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-3 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils className="h-5 w-5" />
            <span className="font-bold text-sm">Hostel Mess Menu Schedule - Daily Live Menu</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded font-mono">Sapphire & Ruby Hostels</span>
        </div>
        <div className="p-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Breakfast (07:15 - 08:45 AM)</span>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li>• Soft Idli & Crispy Medu Vada</li>
              <li>• Coconut Chutney & Sambar</li>
              <li>• Hot Tea / Coffee / Milk</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Lunch (12:15 - 01:45 PM)</span>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li>• Steamed Rice & Special Sambar</li>
              <li>• Poriyal, Kootu & Kara Kuzhambu</li>
              <li>• Fresh Curd & Appalam</li>
            </ul>
          </div>
          <div className="rounded-lg border border-purple-100 bg-purple-50/50 p-4 dark:border-purple-900/30 dark:bg-purple-950/20">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">Dinner (07:15 - 08:45 PM)</span>
            <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li>• Hot Soft Chapathi & Gravy</li>
              <li>• Lemon Rice & Potato Chips</li>
              <li>• Sweet Gulab Jamun</li>
            </ul>
          </div>
        </div>
        {caption && (
          <figcaption className="bg-slate-100 dark:bg-slate-950 px-4 py-2 text-center text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  if (type === "wifi-setup") {
    return (
      <figure className="my-8 rounded-xl border border-slate-200 bg-slate-900 text-white shadow-lg overflow-hidden dark:border-slate-800">
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-5 w-5 text-blue-400" />
            <span className="font-bold text-sm">BIT Campus Wi-Fi Configuration Helper</span>
          </div>
          <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">Setup Guide</span>
        </div>
        <div className="p-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-800/90 p-4 border border-slate-700">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Hostel Wi-Fi Credentials</span>
            <div className="mt-3 space-y-2 text-xs font-mono text-slate-300">
              <p><span className="text-slate-400">SSID:</span> Sapphire_Hostel_5G</p>
              <p><span className="text-slate-400">Default Key:</span> <code className="bg-slate-900 px-2 py-1 rounded text-emerald-300">bit@sapphire2026</code></p>
              <p><span className="text-slate-400">Security:</span> WPA2-Enterprise / PSK</p>
            </div>
          </div>
          <div className="rounded-lg bg-slate-800/90 p-4 border border-slate-700">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Password Change Portal</span>
            <div className="mt-3 space-y-1 text-xs text-slate-300">
              <p className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> Open 192.168.1.1 in browser</p>
              <p className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> Log in with default router admin</p>
              <p className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-400" /> Update WPA key & Save</p>
            </div>
          </div>
        </div>
        {caption && (
          <figcaption className="bg-slate-950 px-4 py-2 text-center text-xs text-slate-400 border-t border-slate-800">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Default fallback visual representation
  return (
    <figure className="my-8 rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">BIT Central Feature Demonstration Visual</p>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{altText || "Interactive feature illustration for BIT Sathy students."}</p>
      {caption && (
        <figcaption className="mt-4 text-xs font-medium text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

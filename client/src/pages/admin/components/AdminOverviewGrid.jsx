import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Shield, Activity } from "lucide-react";
import { ADMIN_TABS } from "./adminConstants.js";

export default function AdminOverviewGrid({ isSuper }) {
  return (
    <div className="space-y-6">
      {/* Overview Banner Card */}
      <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-blue-600 p-6 sm:p-8 text-white shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-blue-950 dark:shadow-[4px_4px_0px_#ffffff]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-white/60 bg-blue-700/60 dark:bg-blue-900/60 px-2.5 py-0.5 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Admin Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              System Administration
            </h1>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-blue-100 max-w-2xl leading-relaxed">
              Manage accounts, mess menus, college holiday schedules, student notifications, support feedback, cards, and security audit logs in one central control station.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {isSuper && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white bg-amber-400 px-3 py-1.5 text-xs font-black text-zinc-900 shadow-[2px_2px_0px_#18181b]">
                <Shield className="h-3.5 w-3.5 fill-current" />
                Super Admin
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white bg-emerald-500 px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#18181b]">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              {ADMIN_TABS.length} Modules Online
            </span>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ADMIN_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.key}
              to={tab.href}
              className="group flex flex-col justify-between rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff] group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-5 w-5 stroke-[2.2]" />
                  </div>
                  <span className="inline-flex items-center rounded-md border border-zinc-900 bg-zinc-100 px-2 py-0.5 text-[11px] font-black uppercase text-zinc-700 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-200 dark:shadow-[1px_1px_0px_#ffffff]">
                    {tab.badge}
                  </span>
                </div>

                <h2 className="text-base font-black text-zinc-900 dark:text-zinc-50 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tab.label}
                </h2>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {tab.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-zinc-200 pt-3 text-xs font-black text-zinc-700 dark:border-zinc-800 dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <span>Manage Module</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

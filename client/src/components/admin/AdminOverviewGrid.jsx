import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ADMIN_TABS } from "./adminConstants.js";

export default function AdminOverviewGrid() {
  return (
    <div className="space-y-6">
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

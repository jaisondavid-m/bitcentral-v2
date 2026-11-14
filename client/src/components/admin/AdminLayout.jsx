import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, ChevronRight } from "lucide-react";
import { ADMIN_TABS } from "./adminConstants.js";

export default function AdminLayout({ activeTab, isSuper, children }) {
  const activeItem = ADMIN_TABS.find((tab) => tab.key === activeTab) || ADMIN_TABS[0];
  const Icon = activeItem?.icon;
  const isOverview = activeTab === "overview";

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors pb-12">
      {/* Top Admin Sub-Header */}
      <div className="border-b border-zinc-900 bg-white dark:border-white dark:bg-[#111827] shadow-xs sticky top-16 z-30 transition-colors">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Left: Breadcrumbs & Title */}
            <div className="flex items-center gap-2.5 min-w-0">
              {!isOverview ? (
                <>
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-2.5 py-1.5 text-xs font-black text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all shrink-0 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 stroke-[2.5]" />
                    <span className="hidden sm:inline">Admin Hub</span>
                  </Link>

                  <ChevronRight className="h-4 w-4 text-zinc-400 shrink-0" />

                  <div className="flex items-center gap-2 min-w-0">
                    {Icon && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-900 bg-blue-50 text-blue-600 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-400 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
                        <Icon className="h-3.5 w-3.5 stroke-[2.2]" />
                      </div>
                    )}
                    <h1 className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-50 truncate tracking-tight">
                      {activeItem.label}
                    </h1>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-blue-600 text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]">
                    <ShieldCheck className="h-4.5 w-4.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h1 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                      Admin Command Center
                    </h1>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Quick Module Switcher Pill Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              <Link
                to="/admin"
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all shrink-0 ${
                  isOverview
                    ? "border-zinc-900 bg-blue-600 text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]"
                    : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:border-white dark:hover:bg-zinc-800"
                }`}
              >
                <span>Overview</span>
              </Link>
              {ADMIN_TABS.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <Link
                    key={tab.key}
                    to={tab.href}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? "border-zinc-900 bg-blue-600 text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]"
                        : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900 hover:bg-white dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:border-white dark:hover:bg-zinc-800"
                    }`}
                  >
                    <TabIcon className="h-3 w-3 stroke-[2.2]" />
                    <span>{tab.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}

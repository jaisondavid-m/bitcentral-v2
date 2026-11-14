import React from "react";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8fafc] dark:bg-[#090d16] text-zinc-900 dark:text-zinc-50 transition-colors pb-12">
      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}

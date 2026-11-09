import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, CheckCircle2, ChevronRight, Clock, HelpCircle, Info, Layers, List, ShieldCheck } from "lucide-react";
import PublicNav from "@/components/layout/PublicNav.jsx";
import PublicFooter from "@/components/layout/PublicFooter.jsx";
import GuideVisual from "@/components/features/GuideVisual.jsx";
import { GUIDES_DATA } from "@/content/guidesData.js";

// Utility function to simple parse basic markdown tables & lists into React nodes
function RenderSectionContent({ content, slug }) {
  if (!content) return null;

  const lines = content.split("\n");
  const parsedNodes = [];
  let inTable = false;
  let tableHeader = [];
  let tableRows = [];
  let currentList = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      parsedNodes.push(
        <ul key={`list-${key}`} className="my-4 space-y-2 pl-6 list-disc text-slate-700 dark:text-slate-300">
          {currentList.map((item, idx) => (
            <li key={idx} className="leading-7" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushTable = (key) => {
    if (tableRows.length > 0) {
      parsedNodes.push(
        <div key={`table-${key}`} className="my-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 uppercase text-xs text-slate-900 dark:bg-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
              <tr>
                {tableHeader.map((th, idx) => (
                  <th key={idx} className="px-4 py-3 font-bold" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(th.trim()) }} />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cell.trim()) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Table divider line | :--- | :--- |
    if (trimmed.startsWith("|") && trimmed.includes("---")) {
      inTable = true;
      return;
    }

    // Table header or data row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed.split("|").slice(1, -1);
      if (!inTable) {
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    } else if (inTable) {
      flushTable(idx);
    }

    // Bullet items
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(trimmed.substring(2));
      return;
    } else {
      flushList(idx);
    }

    // Headings inside section
    if (trimmed.startsWith("### ")) {
      parsedNodes.push(
        <h3 key={idx} className="mt-6 mb-3 text-xl font-bold text-slate-900 dark:text-white">
          {trimmed.replace("### ", "")}
        </h3>
      );
      return;
    }

    // Paragraph
    if (trimmed.length > 0) {
      parsedNodes.push(
        <p key={idx} className="my-4 leading-7 text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }} />
      );
    }
  });

  flushList("end");
  flushTable("end");

  return <div>{parsedNodes}</div>;
}

function formatInlineMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class='bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono text-xs'>$1</code>");
}

export default function GuideDetail() {
  const { slug } = useParams();
  const guide = GUIDES_DATA.find((g) => g.slug === slug);

  if (!guide) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
        <PublicNav />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-slate-400" />
          <h1 className="mt-4 text-3xl font-bold">Guide Not Found</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">The requested guide article does not exist or has been moved.</p>
          <Link to="/guides" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4" />
            Back to All Guides
          </Link>
        </div>
        <PublicFooter />
      </main>
    );
  }

  const relatedGuides = GUIDES_DATA.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-zinc-900 dark:bg-[#090d16] dark:text-zinc-50 transition-colors">
      <PublicNav />

      {/* Breadcrumb Navigation */}
      <section className="border-b border-zinc-900 bg-white py-3 dark:border-white dark:bg-[#111827]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/guides" className="hover:text-blue-600 dark:hover:text-blue-400">Guides</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-black text-zinc-900 dark:text-white truncate max-w-xs">{guide.title}</span>
          </nav>
        </div>
      </section>

      {/* Article Header */}
      <header className="border-b border-zinc-900 bg-white dark:border-white dark:bg-[#111827]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-md border border-zinc-900 bg-blue-100 px-2.5 py-1 text-xs font-black uppercase tracking-wider text-blue-900 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-blue-900/60 dark:text-blue-100 dark:shadow-[1px_1px_0px_#ffffff]">
              {guide.category}
            </span>
            <span className="flex items-center gap-1 font-bold text-zinc-500 dark:text-zinc-400">
              <Clock className="h-3.5 w-3.5" />
              {guide.readTime}
            </span>
            <span className="text-zinc-400">•</span>
            <span className="font-semibold text-zinc-500 dark:text-zinc-400">Updated {guide.lastUpdated}</span>
          </div>

          <h1 className="mt-4 text-3xl font-black leading-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-white">
            {guide.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg font-semibold leading-relaxed text-zinc-600 dark:text-zinc-300">
            {guide.shortDescription}
          </p>

          <div className="mt-6 flex items-center gap-3 border-t border-zinc-200 pt-4 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            <span>Written for <strong className="font-black text-zinc-900 dark:text-white">Bannari Amman Institute of Technology (BIT Sathy)</strong> Community</span>
            <span>•</span>
            <Link to="/developer" className="text-blue-600 font-bold hover:underline dark:text-blue-400">BIT Central Platform Guide</Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_260px]">
          {/* Main Article Body */}
          <article className="prose prose-slate max-w-none dark:prose-invert">
            {/* Table of Contents Box */}
            {guide.tableOfContents && guide.tableOfContents.length > 0 && (
              <nav className="mb-10 rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]" aria-label="Table of contents">
                <div className="flex items-center gap-2 font-black text-sm text-zinc-900 dark:text-white mb-3">
                  <List className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>In This Guide</span>
                </div>
                <ol className="space-y-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  {guide.tableOfContents.map((toc, idx) => (
                    <li key={toc.id}>
                      <a href={`#${toc.id}`} className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2 py-0.5">
                        <span className="text-zinc-400 font-mono">{idx + 1}.</span>
                        <span>{toc.title}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {/* Sections */}
            {guide.sections.map((sec, idx) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-20 my-8">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white border-b border-zinc-900 pb-2 dark:border-white">
                  {sec.h2}
                </h2>
                <RenderSectionContent content={sec.content} slug={guide.slug} />

                {/* Embed visual mockups on key sections */}
                {guide.slug === "exam-hall-finder" && idx === 1 && (
                  <GuideVisual
                    type="exam-hall"
                    caption="Figure 1: BIT Central Exam Hall Finder layout displaying Block name, Room number, and Seat assignment."
                    altText="BIT Central Exam Hall Finder user interface preview."
                  />
                )}

                {guide.slug === "mess-schedule" && idx === 1 && (
                  <GuideVisual
                    type="mess-menu"
                    caption="Figure 2: BIT Central Daily Hostel Mess Menu schedule for Breakfast, Lunch, and Dinner."
                    altText="BIT Central Mess Menu interface preview."
                  />
                )}

                {guide.slug === "first-year" && idx === 2 && (
                  <GuideVisual
                    type="wifi-setup"
                    caption="Figure 3: Campus Wi-Fi configuration and default router credential reference."
                    altText="BIT Sathy Wi-Fi Setup visual guide."
                  />
                )}
              </section>
            ))}

            {/* Disclaimer Box */}
            <div className="mt-12 rounded-xl border border-zinc-900 bg-amber-50 p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-amber-950/30 dark:shadow-[3px_3px_0px_#ffffff]">
              <div className="flex gap-3 text-xs text-amber-950 dark:text-amber-200">
                <Info className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-black">Independent Student Platform Disclaimer</p>
                  <p className="leading-relaxed font-medium">
                    BIT Central is an independent student platform built for the Bannari Amman Institute of Technology community. Official academic schedules, hall tickets, and circulars issued by the Controller of Examinations (COE) and college management remain the authoritative source. Read our full <Link to="/disclaimer" className="underline font-bold">Disclaimer</Link> and <Link to="/terms" className="underline font-bold">Terms of Service</Link>.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Portal CTA */}
            <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
              <h3 className="font-black text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Access Live Tools
              </h3>
              <p className="mt-2 text-xs font-semibold text-zinc-600 leading-relaxed dark:text-zinc-400">
                Sign in with your @bitsathy.ac.in account to access live exam hall allocations, biometric logs, and question banks.
              </p>
              <Link
                to="/login"
                className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-900 bg-blue-600 py-2.5 px-3 text-xs font-black text-white shadow-[2px_2px_0px_#18181b] hover:bg-blue-700 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
              >
                Login to BIT Central
              </Link>
            </div>

            {/* Quick Links */}
            <div className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
              <h3 className="font-black text-sm text-zinc-900 dark:text-white mb-3">Popular Guides</h3>
              <ul className="space-y-2 text-xs font-semibold">
                {GUIDES_DATA.map((g) => (
                  <li key={g.slug}>
                    <Link to={`/guides/${g.slug}`} className={`hover:text-blue-600 block py-1 truncate ${g.slug === guide.slug ? "font-black text-blue-600 dark:text-blue-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                      • {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Related Guides Section */}
        <section className="mt-16 border-t border-zinc-900 pt-10 dark:border-white">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6">Related Student Guides</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedGuides.map((rg) => (
              <article key={rg.slug} className="rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] transition-all">
                <span className="rounded-md border border-zinc-900 bg-blue-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-blue-900 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-blue-900/60 dark:text-blue-100 dark:shadow-[1px_1px_0px_#ffffff]">{rg.category}</span>
                <h3 className="mt-3 font-black text-sm text-zinc-900 dark:text-white line-clamp-2">
                  <Link to={`/guides/${rg.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {rg.title}
                  </Link>
                </h3>
                <p className="mt-2 text-xs font-semibold text-zinc-600 line-clamp-2 dark:text-zinc-400">{rg.shortDescription}</p>
                <Link to={`/guides/${rg.slug}`} className="mt-3 inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Read Guide <ArrowRight className="h-3 w-3" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>

      <PublicFooter />
    </main>
  );
}

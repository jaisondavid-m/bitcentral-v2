export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex items-center justify-center px-6 py-12">
      <section className="w-full max-w-xl rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-8 text-center shadow-sm md:p-10">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--text-secondary)]">BIT Central</p>
        <h1 className="mt-4 text-3xl font-semibold md:text-4xl">Under Construction</h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
          We are making improvements and will be back soon.
        </p>
      </section>
    </main>
  );
}

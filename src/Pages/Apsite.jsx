import { useMemo, useState } from "react";
import { AlertCircle, ArrowRight, Loader2, Search, Sparkles } from "lucide-react";

const PS_BREAKDOWN_URL = `${import.meta.env.VITE_API_BASE_URL}/ps/rewards/breakdown`;

function numberValue(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function formatRollNo(value) {
    return String(value || "").trim().toUpperCase();
}

function getBreakdownCategories(payload) {
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload)) return payload;
    return [];
}

function getSectionPriority(categoryName) {
    const normalized = String(categoryName || "").trim().toLowerCase();
    const priorities = {
        "personalized skills - technical": 0,
        "personalized skills - non technical": 1,
        "pbl training": 2,
        "academics (t, l)": 3,
    };

    return priorities[normalized] ?? 99;
}

function getOrderedCategories(payload) {
    return getBreakdownCategories(payload).slice().sort((left, right) => {
        const leftPriority = getSectionPriority(left?.category_name);
        const rightPriority = getSectionPriority(right?.category_name);
        if (leftPriority !== rightPriority) return leftPriority - rightPriority;
        return String(left?.category_name || "").localeCompare(String(right?.category_name || ""));
    });
}

function buildRequestUrl(userId) {
    const normalized = String(userId || "").trim().toLowerCase();
    if (!normalized) return null;

    const url = new URL(PS_BREAKDOWN_URL);
    url.searchParams.set("user_id", normalized);
    return url.toString();
}

function Apsite() {
    const [userId, setUserId] = useState("");
    const [submittedUserId, setSubmittedUserId] = useState("");
    const [payload, setPayload] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openSections, setOpenSections] = useState({});

    const totals = useMemo(() => {
        const categories = getBreakdownCategories(payload);
        return categories.reduce(
            (acc, category) => {
                acc.categories += 1;
                acc.earned += numberValue(category?.total_earned);
                acc.withheld += numberValue(category?.total_withheld);
                acc.sources += Array.isArray(category?.sources) ? category.sources.length : 0;
                return acc;
            },
            { categories: 0, earned: 0, withheld: 0, sources: 0 }
        );
    }, [payload]);

    const overallActivityPoints = totals.earned;

    const categories = useMemo(() => getOrderedCategories(payload), [payload]);

    const hasResults = categories.length > 0;

    function toggleSection(sectionName) {
        setOpenSections((current) => ({
            ...current,
            [sectionName]: !current[sectionName],
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const normalized = formatRollNo(userId);
        if (!normalized) {
            setError("Enter a valid user ID.");
            setPayload(null);
            setSubmittedUserId("");
            return;
        }

        const requestUrl = buildRequestUrl(normalized);
        if (!requestUrl) {
            setError("Unable to build request URL.");
            return;
        }

        setLoading(true);
        setError("");
        setSubmittedUserId(normalized);

        try {
            const response = await fetch(requestUrl, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            const text = await response.text();
            let data = null;

            try {
                data = text ? JSON.parse(text) : null;
            } catch {
                data = null;
            }

            if (!response.ok) {
                throw new Error(data?.message || `Request failed with status ${response.status}`);
            }

            if (!data?.success) {
                throw new Error(data?.message || "Unable to fetch reward breakdown");
            }

            setPayload(data);
            setOpenSections({});
        } catch (fetchError) {
            setPayload(null);
            setError(fetchError?.message || "Something went wrong while fetching the breakdown.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                    <div className="flex flex-col gap-4">
                        {/* <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              PS Activity Breakdown
            </div> */}

                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Activity Points lookup</h1>
                            <p className="mt-1 text-sm text-slate-500">Enter enrollment number and fetch the activity points breakdown.</p>
                        </div>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                            <strong>Notice:</strong> Activity points may sometimes be unavailable if the admin has not refreshed the authentication token, which expires every 3 hours.
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={userId}
                                    onChange={(event) => setUserId(event.target.value.toUpperCase())}
                                    placeholder="2025UCS1023"
                                    autoCapitalize="characters"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm font-semibold uppercase tracking-[0.14em] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                                {loading ? "Loading" : "Search"}
                            </button>
                        </form>

                        {error && (
                            <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                                <span>{error}</span>
                            </div>
                        )}

                        {hasResults && (
                            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Overall activity points</span>
                                <span className="text-xl font-black tracking-tight text-slate-900">{overallActivityPoints}</span>
                            </div>
                        )}
                    </div>
                </section>

                <section className="mt-4 space-y-3">
                    {!hasResults && !loading ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500 shadow-sm">
                            No breakdown loaded yet.
                        </div>
                    ) : (
                        categories.map((category, index) => {
                            const sources = Array.isArray(category?.sources) ? category.sources : [];
                            const categoryEarned = numberValue(category?.total_earned);
                            const sectionName = String(category?.category_name || "Unnamed category");
                            const isOpen = Boolean(openSections[sectionName]);
                            const previewItems = sources.slice(0, 2).map((source) => source?.points_from).filter(Boolean);
                            const previewText = previewItems.length > 0 ? previewItems.join(" • ") : "No preview available";

                            return (
                                <article key={`${sectionName}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => toggleSection(sectionName)}
                                        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                                    >
                                        <div className="min-w-0">
                                            <h3 className="truncate text-sm font-semibold text-slate-900">{sectionName}</h3>
                                            {/* <p className="mt-0.5 truncate text-xs text-slate-500">Preview: {previewText}</p> */}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">{categoryEarned} points</span>
                                            <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}>
                                                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4 text-slate-500" aria-hidden="true">
                                                    <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </div>
                                    </button>

                                    {isOpen && (
                                        <div className="border-t border-slate-100 px-4 py-3">

                                            <div className="overflow-x-auto">
                                                <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                                                    {/* <thead>
                            <tr className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                              <th className="border-b border-slate-100 px-0 py-2.5 font-semibold">Points from</th>
                              <th className="border-b border-slate-100 px-0 py-2.5 text-right font-semibold">Earned</th>
                            </tr>
                          </thead> */}
                                                    <tbody>
                                                        {sources.length > 0 ? (
                                                            sources.map((source, sourceIndex) => (
                                                                <tr key={`${sectionName}-${sourceIndex}`} className="border-b border-slate-50 last:border-b-0">
                                                                    <td className="max-w-[40rem] border-b border-slate-50 px-0 py-3 align-top text-slate-700">
                                                                        <p className="break-words leading-6">{source?.points_from || "-"}</p>
                                                                    </td>
                                                                    <td className="border-b border-slate-50 px-0 py-3 text-right align-top font-semibold text-slate-900">
                                                                        {numberValue(source?.earned)}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={2} className="px-0 py-5 text-center text-slate-500">No source rows.</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </article>
                            );
                        })
                    )}
                </section>
            </div>
        </main>
    );
}

export default Apsite;

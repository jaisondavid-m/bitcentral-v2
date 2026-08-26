import { useEffect, useMemo, useState } from "react";
import { Clock, Loader2, RefreshCw, ShieldCheck, Save, Search } from "lucide-react";
import { fetchPSRewardsBreakdown, getPSToken, savePSToken } from "../api/admin.js";

const ROTATION_WINDOW_MS = 3 * 60 * 60 * 1000;

function formatTimestamp(value) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleString();
}

function formatDuration(ms) {
  if (ms <= 0) return "due now";
  const totalMinutes = Math.max(1, Math.ceil(ms / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export default function AdminPSRewardsPage() {
  const [token, setToken] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const [savedBy, setSavedBy] = useState("");
  const [userId, setUserId] = useState("2025ucs1023");
  const [response, setResponse] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [savingToken, setSavingToken] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoadingToken(true);
      setError("");
      try {
        const result = await getPSToken();
        if (!mounted) return;
        const data = result?.data || {};
        setToken(data.token || "");
        setSavedAt(data.updated_at || "");
        setSavedBy(data.updated_by || "");
      } catch (err) {
        if (mounted) {
          setError(err?.response?.data?.message || err?.message || "Failed to load token");
        }
      } finally {
        if (mounted) setLoadingToken(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const rotationDeadline = useMemo(() => {
    if (!savedAt) return null;
    const parsed = new Date(savedAt).getTime();
    return Number.isNaN(parsed) ? null : parsed + ROTATION_WINDOW_MS;
  }, [savedAt]);

  const timeRemaining = rotationDeadline ? rotationDeadline - now : null;
  const rotationDue = rotationDeadline != null && timeRemaining <= 0;

  async function handleSaveToken() {
    const nextToken = token.trim();
    if (!nextToken) {
      setError("Token cannot be empty");
      return;
    }

    setSavingToken(true);
    setError("");
    try {
      const result = await savePSToken(nextToken);
      const data = result?.data || {};
      setToken(data.token || nextToken);
      setSavedAt(data.updated_at || new Date().toISOString());
      setSavedBy(data.updated_by || savedBy || "");
      setResponse(null);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to save token");
    } finally {
      setSavingToken(false);
    }
  }

  async function handleFetchBreakdown() {
    if (!userId.trim()) {
      setError("user_id is required");
      return;
    }

    setFetching(true);
    setError("");
    try {
      const result = await fetchPSRewardsBreakdown(userId.trim());
      setResponse(result);
    } catch (err) {
      setResponse(null);
      setError(err?.response?.data?.message || err?.message || "Failed to fetch breakdown");
    } finally {
      setFetching(false);
    }
  }

  const responseText = useMemo(() => {
    if (!response) return "";
    return JSON.stringify(response.data ?? response.body ?? response, null, 2);
  }, [response]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 dark:border-blue-900 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-slate-100">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            PS Rewards Breakdown
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
            Store the PS cookie token, then proxy the external breakdown request for any roll number.
          </p>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${rotationDue ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"}`}>
          <Clock className="h-3.5 w-3.5" />
          {rotationDue ? "Token rotation is due" : `Rotate token in ${formatDuration(timeRemaining ?? ROTATION_WINDOW_MS)}`}
        </div>
      </div>

      <div className="space-y-6 p-4 sm:p-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Cookie token</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Saved at {formatTimestamp(savedAt)}{savedBy ? ` by ${savedBy}` : ""}.
                </p>
              </div>
              {loadingToken && <Loader2 className="h-4 w-4 animate-spin text-slate-500" />}
            </div>

            <label className="mt-4 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              PS token
            </label>
            <textarea
              value={token}
              onChange={(event) => setToken(event.target.value)}
              rows={4}
              placeholder="Paste the PS cookie token here"
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/40"
            />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSaveToken}
                disabled={savingToken || loadingToken}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {savingToken ? "Saving..." : "Save token"}
              </button>
              <div className="rounded-xl border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
                The backend sends the request with Cookie: PS=token; to the PS API.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Fetch breakdown</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Load the JSON response for the fixed activity ID 1 and any roll number.
            </p>

            <div className="mt-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">User ID</span>
                <input
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  placeholder="2025ucs1023"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={handleFetchBreakdown}
              disabled={fetching || loadingToken}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {fetching ? "Fetching..." : "Fetch response"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-slate-100 shadow-sm dark:border-slate-800">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">Response preview</h3>
              <p className="mt-1 text-xs text-slate-400">The latest fetched payload appears here in raw JSON form.</p>
            </div>
            <button
              type="button"
              onClick={handleFetchBreakdown}
              disabled={fetching || loadingToken}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${fetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          <div className="mt-4 max-h-[32rem] overflow-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4">
            {responseText ? (
              <pre className="whitespace-pre-wrap break-words text-xs leading-6 text-slate-100">{responseText}</pre>
            ) : (
              <div className="flex min-h-56 items-center justify-center text-sm text-slate-500">
                Fetch a response to view the payload here.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
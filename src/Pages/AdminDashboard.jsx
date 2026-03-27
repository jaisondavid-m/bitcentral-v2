import { useEffect, useMemo, useState } from "react";
import { deleteAdminUser, getAdminUsageSummary, listAdminUsers } from "../api/admin.js";
import { AlertTriangle, Loader, RefreshCw, Search, Shield, Trash2, Users } from "lucide-react";

const ADMIN_SECRET_KEY = "admin-dashboard-secret";
const USERS_PAGE_SIZE = 1000;

function normalizeError(error, fallback) {
    return error?.response?.data?.message || error?.message || fallback;
}

function formatUsageLabel(label, period) {
    if (!label) return "";

    if (period === "monthly") {
        const [year, month] = label.split("-");
        return `${month}/${year?.slice(2) || ""}`;
    }

    return label.slice(5);
}

function parseNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

function normalizeUsageItem(item, fallbackLabel) {
    if (!item || typeof item !== "object") {
        return {
            label: fallbackLabel,
            signups: 0,
            activeUsers: 0,
        };
    }

    const label =
        item.label ??
        item.date ??
        item.day ??
        item.month ??
        item.bucket ??
        item.key ??
        fallbackLabel;
    return {
        label,
        signups: parseNumber(item.signups ?? item.newUsers ?? item.createdUsers ?? item.count),
        activeUsers: parseNumber(item.activeUsers ?? item.active ?? item.activeCount),
    };
}

function normalizeUsageSeries(source) {
    if (!source) return [];

    if (Array.isArray(source)) {
        return source
            .map((item, index) => normalizeUsageItem(item, String(index)))
            .filter((item) => item.label !== undefined && item.label !== null);
    }

    if (typeof source === "object") {
        return Object.entries(source)
            .map(([label, value]) => {
                if (value && typeof value === "object") {
                    return normalizeUsageItem(value, label);
                }

                return {
                    label,
                    signups: parseNumber(value),
                    activeUsers: 0,
                };
            })
            .filter((item) => item.label !== undefined && item.label !== null);
    }

    return [];
}

function normalizeUsageSummary(payload) {
    const source =
        payload?.data && typeof payload.data === "object" && !Array.isArray(payload.data) ? payload.data : payload;

    const dailySource = source?.dailyUsage ?? source?.daily ?? source?.usage?.dailyUsage ?? source?.usage?.daily;
    const monthlySource =
        source?.monthlyUsage ?? source?.monthly ?? source?.usage?.monthlyUsage ?? source?.usage?.monthly;

    const dailyUsage = normalizeUsageSeries(dailySource).sort((a, b) => String(a.label).localeCompare(String(b.label)));
    const monthlyUsage = normalizeUsageSeries(monthlySource).sort((a, b) =>
        String(a.label).localeCompare(String(b.label))
    );

    return { dailyUsage, monthlyUsage };
}

function formatDateTime(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleString();
}

function getCreatedTime(user) {
    return (
        user?.creationTime ||
        user?.createdAt ||
        user?.metadata?.creationTime ||
        user?.providerData?.[0]?.creationTime ||
        null
    );
}

function getLastLoginTime(user) {
    return user?.lastSignInTime || user?.lastLoginAt || user?.metadata?.lastSignInTime || null;
}

function UsageChart({ usage, period }) {
    const peak = useMemo(() => {
        if (!usage.length) return 1;
        return usage.reduce((max, item) => Math.max(max, item.signups, item.activeUsers), 1);
    }, [usage]);

    const chartWidth = useMemo(() => Math.max(usage.length * 30, 640), [usage.length]);

    const toHeight = (value) => {
        if (!value) return 0;
        const height = Math.round((value / peak) * 100);
        return Math.max(height, 4);
    };

    if (!usage.length) {
        return <p className="text-sm text-gray-500">No usage data available.</p>;
    }

    return (
        <div>
            <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    Signups
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    Active Users
                </span>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <div className="mb-2 text-right text-[11px] font-medium text-gray-500">Peak: {peak}</div>

                <div className="overflow-x-auto">
                    <div className="relative" style={{ width: `${chartWidth}px` }}>
                        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                            <span className="border-t border-dashed border-gray-200" />
                            <span className="border-t border-dashed border-gray-200" />
                            <span className="border-t border-dashed border-gray-200" />
                            <span className="border-t border-dashed border-gray-200" />
                        </div>

                        <div className="relative flex h-48 items-end gap-2">
                            {usage.map((item) => {
                                const signupsHeight = toHeight(item.signups);
                                const activeHeight = toHeight(item.activeUsers);

                                return (
                                    <div key={item.label} className="flex w-6 flex-shrink-0 items-end justify-center gap-1">
                                        <div
                                            className="w-2 rounded-t bg-blue-500"
                                            style={{ height: `${signupsHeight}%` }}
                                            title={`${item.label}: ${item.signups} signups`}
                                        />
                                        <div
                                            className="w-2 rounded-t bg-emerald-500"
                                            style={{ height: `${activeHeight}%` }}
                                            title={`${item.label}: ${item.activeUsers} active users`}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-2 flex gap-2 text-[10px] text-gray-500">
                            {usage.map((item, index) => {
                                const step = Math.max(1, Math.ceil(usage.length / 8));
                                return (
                                    <span key={item.label} className="w-6 flex-shrink-0 text-center">
                                        {index % step === 0 ? formatUsageLabel(item.label, period) : ""}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SecretPrompt({ value, onChange, onSubmit }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-900">Admin Secret Required</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Enter Admin secret header (x-admin-secret). This will be stored in localStorage and asked only once.
                </p>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                    <input
                        type="password"
                        value={value}
                        onChange={onChange}
                        placeholder="Enter x-admin-secret"
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring"
                        autoFocus
                        required
                    />

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                        Continue
                    </button>
                </form>
            </div>
        </div>
    );
}

function AdminDashboard() {
    const [adminSecret, setAdminSecret] = useState(() => localStorage.getItem(ADMIN_SECRET_KEY) || "");
    const [secretDraft, setSecretDraft] = useState("");
    const [needsSecret, setNeedsSecret] = useState(() => !localStorage.getItem(ADMIN_SECRET_KEY));

    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageTokens, setPageTokens] = useState([""]);
    const [nextPageToken, setNextPageToken] = useState("");
    const [usageSummary, setUsageSummary] = useState({ dailyUsage: [], monthlyUsage: [] });
    const [usagePeriod, setUsagePeriod] = useState("daily");
    const [isLoading, setIsLoading] = useState(false);
    const [deletingUid, setDeletingUid] = useState("");
    const [banner, setBanner] = useState({ type: "", message: "" });

    const usage = usagePeriod === "daily" ? usageSummary.dailyUsage || [] : usageSummary.monthlyUsage || [];
    const filteredUsers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return users;

        return users.filter((user) => {
            const email = (user.email || "").toLowerCase();
            const name = (user.displayName || "").toLowerCase();
            const uid = (user.uid || "").toLowerCase();
            return email.includes(q) || name.includes(q) || uid.includes(q);
        });
    }, [users, searchQuery]);

    useEffect(() => {
        if (adminSecret) {
            localStorage.setItem(ADMIN_SECRET_KEY, adminSecret);
        }
    }, [adminSecret]);

    const loadUsersPage = async ({ pageToken = "", page = 1 } = {}) => {
        const usersData = await listAdminUsers({
            adminSecret,
            maxResults: USERS_PAGE_SIZE,
            ...(pageToken ? { pageToken } : {}),
        });

        setUsers(usersData.users || []);
        setNextPageToken(usersData.nextPageToken || "");
        setPageNumber(page);
    };

    const loadDashboardData = async () => {
        if (!adminSecret) return;

        setIsLoading(true);
        setBanner({ type: "", message: "" });

        const [usersResult, usageResult] = await Promise.allSettled([
            loadUsersPage({ pageToken: "", page: 1 }),
            getAdminUsageSummary({ adminSecret }),
        ]);

        let errorMessage = "";

        if (usersResult.status === "rejected") {
            setUsers([]);
            setPageNumber(1);
            setPageTokens([""]);
            setNextPageToken("");
            errorMessage = normalizeError(usersResult.reason, "Failed to load users");
        }

        if (usageResult.status === "fulfilled") {
            setUsageSummary(normalizeUsageSummary(usageResult.value));
        } else {
            setUsageSummary({ dailyUsage: [], monthlyUsage: [] });
            errorMessage = errorMessage
                ? `${errorMessage}. ${normalizeError(usageResult.reason, "Failed to load usage")}`
                : normalizeError(usageResult.reason, "Failed to load usage");
        }

        if (errorMessage) {
            setBanner({ type: "error", message: errorMessage });
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (!adminSecret) return;
        loadDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminSecret]);

    const onSubmitSecret = (event) => {
        event.preventDefault();
        const trimmed = secretDraft.trim();

        if (!trimmed) {
            return;
        }

        setAdminSecret(trimmed);
        setNeedsSecret(false);
        setSecretDraft("");
    };

    const onDeleteUser = async (uid) => {
        const confirmed = window.confirm("Delete this user permanently?");
        if (!confirmed) return;

        setDeletingUid(uid);
        setBanner({ type: "", message: "" });

        try {
            await deleteAdminUser({ adminSecret, uid });
            setUsers((prev) => prev.filter((user) => user.uid !== uid));
            setBanner({ type: "success", message: "User deleted successfully" });
            const usageData = await getAdminUsageSummary({ adminSecret });
            setUsageSummary(normalizeUsageSummary(usageData));
        } catch (error) {
            setBanner({ type: "error", message: normalizeError(error, "Failed to delete user") });
        } finally {
            setDeletingUid("");
        }
    };

    const clearStoredSecret = () => {
        localStorage.removeItem(ADMIN_SECRET_KEY);
        setAdminSecret("");
        setNeedsSecret(true);
        setSecretDraft("");
        setUsers([]);
        setPageNumber(1);
        setPageTokens([""]);
        setNextPageToken("");
        setUsageSummary({ dailyUsage: [], monthlyUsage: [] });
    };

    const onNextPage = async () => {
        if (!nextPageToken || isLoading || !adminSecret) return;

        setIsLoading(true);
        setBanner({ type: "", message: "" });

        const targetToken = nextPageToken;

        try {
            await loadUsersPage({ pageToken: targetToken, page: pageNumber + 1 });
            setPageTokens((prev) => [...prev, targetToken]);
        } catch (error) {
            setBanner({ type: "error", message: normalizeError(error, "Failed to load next users page") });
        } finally {
            setIsLoading(false);
        }
    };

    const onPreviousPage = async () => {
        if (pageNumber <= 1 || isLoading || !adminSecret) return;

        const previousToken = pageTokens[pageNumber - 2] ?? "";

        setIsLoading(true);
        setBanner({ type: "", message: "" });

        try {
            await loadUsersPage({ pageToken: previousToken, page: pageNumber - 1 });
            setPageTokens((prev) => prev.slice(0, -1));
        } catch (error) {
            setBanner({ type: "error", message: normalizeError(error, "Failed to load previous users page") });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
            {needsSecret && (
                <SecretPrompt
                    value={secretDraft}
                    onChange={(event) => setSecretDraft(event.target.value)}
                    onSubmit={onSubmitSecret}
                />
            )}

            <div className="mx-auto max-w-5xl space-y-6">
                <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="bg-blue-600 px-6 py-7 sm:px-8">
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
                                    <Shield className="h-7 w-7" />
                                    Admin Dashboard
                                </h1>
                                <p className="mt-2 text-sm text-white/90">
                                    Full user list with quick usage analytics and row-level delete actions.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={loadDashboardData}
                                    disabled={isLoading || !adminSecret}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                    Refresh
                                </button>

                                <button
                                    type="button"
                                    onClick={clearStoredSecret}
                                    className="inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
                                >
                                    Change Secret
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Total Users</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">{users.length}</p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Loaded</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">Page {pageNumber}</p>
                            </div>
                        </div>

                        {banner.message && (
                            <div
                                className={`mt-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${banner.type === "error"
                                        ? "border-red-300 bg-red-50 text-red-700"
                                        : "border-emerald-300 bg-emerald-50 text-emerald-700"
                                    }`}
                            >
                                {banner.type === "error" ? (
                                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                ) : (
                                    <Users className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                )}
                                <span>{banner.message}</span>
                            </div>
                        )}
                    </div>
                </section>

                <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Usage Chart</h2>
                        <div className="inline-flex rounded-lg border border-gray-200 p-1">
                            <button
                                type="button"
                                onClick={() => setUsagePeriod("daily")}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${usagePeriod === "daily" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Daily
                            </button>
                            <button
                                type="button"
                                onClick={() => setUsagePeriod("monthly")}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${usagePeriod === "monthly" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex h-48 items-center justify-center text-gray-500">
                            <Loader className="h-5 w-5 animate-spin" />
                            <span className="ml-2 text-sm">Loading usage data...</span>
                        </div>
                    ) : (
                        <UsageChart usage={usage} period={usagePeriod} />
                    )}
                </section>

                <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onPreviousPage}
                                disabled={pageNumber <= 1 || isLoading}
                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Previous 1000
                            </button>
                            <button
                                type="button"
                                onClick={onNextPage}
                                disabled={!nextPageToken || isLoading}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Next 1000
                            </button>
                        </div>
                    </div>

                    <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                        <Search className="h-4 w-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search by email, name, or UID"
                            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                        />
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">S.No</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Photo</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Display Name</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Creation Time</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Last Login</th>
                                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Delete</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                            {isLoading ? "Loading users..." : "No users found for your search"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((userItem, index) => (
                                        <tr key={userItem.uid}>
                                            <td className="px-4 py-3 font-medium text-gray-700">
                                                {(pageNumber - 1) * USERS_PAGE_SIZE + index + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                {userItem.photoURL ? (
                                                    <img
                                                        src={userItem.photoURL}
                                                        alt={userItem.displayName || userItem.email || "User"}
                                                        className="h-9 w-9 rounded-full border border-gray-200 object-cover"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                                                        {(userItem.displayName || userItem.email || "U").charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-gray-700">{userItem.email || "-"}</td>
                                            <td className="px-4 py-3 text-gray-700">{userItem.displayName || "-"}</td>
                                            <td className="px-4 py-3 text-gray-700">{formatDateTime(getCreatedTime(userItem))}</td>
                                            <td className="px-4 py-3 text-gray-700">{formatDateTime(getLastLoginTime(userItem))}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteUser(userItem.uid)}
                                                    disabled={deletingUid === userItem.uid}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {deletingUid === userItem.uid ? (
                                                        <Loader className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminDashboard;

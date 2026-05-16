import { useEffect, useState, useMemo, useCallback } from "react";
import {
  deleteAdminUser,
  listAdminUsers,
  updateUsers,
  listQBAnswerKeys,
  createQBAnswerKey,
  updateQBAnswerKey,
  deleteQBAnswerKey,
} from "../api/admin.js";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Edit2,
  Loader,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Authentication/firebase.js";

function normalizeError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

const SEMESTER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];
const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

const EMPTY_QB_FORM = {
  semester: "",
  subject_code: "",
  subject_name: "",
  year: "",
  answers: "",
};

function Banner({ banner, onDismiss }) {
  if (!banner.message) return null;
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
        banner.type === "error"
          ? "border-red-300 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
      }`}
    >
      {banner.type === "error" ? (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span className="flex-1">{banner.message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-2 opacity-60 hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ─── QB Answer Key Form (Add / Edit) ─────────────────────────────────────────
function QBForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(initial || EMPTY_QB_FORM);
  const [answersRaw, setAnswersRaw] = useState(() => {
    if (!initial?.answers) return "";
    try {
      const parsed = JSON.parse(initial.answers);
      return Object.entries(parsed)
        .map(([q, a]) => `${q}:${a}`)
        .join("\n");
    } catch {
      return initial.answers;
    }
  });
  const [answersError, setAnswersError] = useState("");

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function parseAnswers(raw) {
    const lines = raw.split(/\n|,/).map((l) => l.trim()).filter(Boolean);
    const obj = {};
    for (const line of lines) {
      const parts = line.split(":");
      if (parts.length !== 2) return null;
      const [q, a] = parts.map((p) => p.trim());
      if (!q || !a) return null;
      obj[q] = a.toUpperCase();
    }
    return obj;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAnswersError("");
    const parsed = parseAnswers(answersRaw);
    if (!parsed || Object.keys(parsed).length === 0) {
      setAnswersError('Format each line as "1:A" or "2:B". Use one per line or comma-separated.');
      return;
    }
    onSubmit({ ...form, answers: JSON.stringify(parsed) });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Semester
          </label>
          <select
            value={form.semester}
            onChange={set("semester")}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Select semester</option>
            {SEMESTER_OPTIONS.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Exam year
          </label>
          <select
            value={form.year}
            onChange={set("year")}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Select year</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Subject code
          </label>
          <input
            type="text"
            value={form.subject_code}
            onChange={set("subject_code")}
            placeholder="e.g. CS301"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Subject name
          </label>
          <input
            type="text"
            value={form.subject_name}
            onChange={set("subject_name")}
            placeholder="e.g. Data Structures"
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
          Answer key{" "}
          <span className="font-normal text-gray-500">
            — one per line: <code className="rounded bg-gray-100 px-1 dark:bg-slate-800">1:A</code>, <code className="rounded bg-gray-100 px-1 dark:bg-slate-800">2:B</code> …
          </span>
        </label>
        <textarea
          value={answersRaw}
          onChange={(e) => setAnswersRaw(e.target.value)}
          rows={6}
          placeholder={"1:A\n2:C\n3:B\n4:D"}
          required
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 font-mono text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
        />
        {answersError && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">{answersError}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
          {isLoading ? "Saving…" : initial ? "Save changes" : "Add answer key"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}

// ─── Expandable Answers ───────────────────────────────────────────────────────
function AnswerKeyPreview({ answers }) {
  const [open, setOpen] = useState(false);
  let parsed = {};
  try {
    parsed = JSON.parse(answers);
  } catch {
    return <span className="text-xs text-gray-400">Invalid JSON</span>;
  }

  const entries = Object.entries(parsed);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
      >
        {entries.length} questions
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-2 grid max-h-52 grid-cols-4 gap-1 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-blue-900 dark:bg-slate-900 sm:grid-cols-6">
          {entries.map(([q, a]) => (
            <span
              key={q}
              className="flex items-center justify-between rounded border border-gray-200 bg-white px-2 py-1 text-xs dark:border-blue-900 dark:bg-slate-800"
            >
              <span className="text-gray-500 dark:text-slate-400">Q{q}</span>
              <span className="font-semibold text-gray-800 dark:text-slate-100">{a}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── QB Section ───────────────────────────────────────────────────────────────
function QBSection() {
  const [qbItems, setQbItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editItem, setEditItem] = useState(null); // null = not editing, object = editing
  const [showAddForm, setShowAddForm] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [filterSemester, setFilterSemester] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await listQBAnswerKeys({
        semester: filterSemester || undefined,
        year: filterYear || undefined,
      });
      setQbItems(result.data || []);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to load QB answer keys") });
    } finally {
      setIsLoading(false);
    }
  }, [filterSemester, filterYear]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return qbItems;
    return qbItems.filter(
      (item) =>
        item.subject_code.toLowerCase().includes(q) ||
        item.subject_name.toLowerCase().includes(q)
    );
  }, [qbItems, searchQuery]);

  // Group by semester
  const grouped = useMemo(() => {
    const map = {};
    for (const item of filtered) {
      const key = `Semester ${item.semester}`;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }
    return Object.entries(map).sort(([a], [b]) => {
      const numA = parseInt(a.replace("Semester ", ""));
      const numB = parseInt(b.replace("Semester ", ""));
      return numA - numB;
    });
  }, [filtered]);

  async function handleCreate(payload) {
    setIsSaving(true);
    setBanner({ type: "", message: "" });
    try {
      await createQBAnswerKey(payload);
      setBanner({ type: "success", message: "Answer key added successfully" });
      setShowAddForm(false);
      await load();
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to add answer key") });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(payload) {
    setIsSaving(true);
    setBanner({ type: "", message: "" });
    try {
      await updateQBAnswerKey(editItem.id, payload);
      setBanner({ type: "success", message: "Answer key updated successfully" });
      setEditItem(null);
      await load();
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to update answer key") });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this answer key permanently?")) return;
    setDeletingId(id);
    setBanner({ type: "", message: "" });
    try {
      await deleteQBAnswerKey(id);
      setQbItems((prev) => prev.filter((item) => item.id !== id));
      setBanner({ type: "success", message: "Answer key deleted" });
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete answer key") });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 dark:border-blue-900 dark:bg-slate-950">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-slate-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
            QB Answer Keys
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
            Semester-wise question bank answer keys
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowAddForm(true); setEditItem(null); }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add answer key
        </button>
      </div>

      {/* Banner */}
      {banner.message && (
        <div className="mb-4">
          <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
        </div>
      )}

      {/* Add form */}
      {showAddForm && !editItem && (
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-slate-200">
            Add new answer key
          </h3>
          <QBForm
            onSubmit={handleCreate}
            onCancel={() => setShowAddForm(false)}
            isLoading={isSaving}
          />
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        <select
          value={filterSemester}
          onChange={(e) => setFilterSemester(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">All semesters</option>
          {SEMESTER_OPTIONS.map((s) => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
        >
          <option value="">All years</option>
          {YEAR_OPTIONS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <div className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 dark:border-blue-900 dark:bg-slate-900">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject code or name"
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        </div>

        <button
          type="button"
          onClick={load}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      ) : grouped.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-blue-900 dark:bg-slate-900">
          <BookOpen className="h-7 w-7 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-slate-400">No answer keys found</p>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(([semLabel, items]) => (
            <div key={semLabel}>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
                {semLabel}
              </h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-blue-900">
                <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900">
                  <thead className="bg-gray-50 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">#</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Code</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Subject</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Year</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Answers</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Updated</th>
                      <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-blue-900 dark:bg-slate-950">
                    {items.map((item, idx) =>
                      editItem?.id === item.id ? (
                        <tr key={item.id}>
                          <td colSpan={7} className="px-4 py-4">
                            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-slate-900">
                              <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-slate-200">
                                Edit: {item.subject_code} — {item.subject_name}
                              </h4>
                              <QBForm
                                initial={editItem}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditItem(null)}
                                isLoading={isSaving}
                              />
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={item.id} className="transition hover:bg-gray-50 dark:hover:bg-slate-900">
                          <td className="px-4 py-3 font-medium text-gray-500 dark:text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700 dark:bg-slate-800 dark:text-slate-200">
                              {item.subject_code}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-slate-200">{item.subject_name}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-slate-300">{item.year}</td>
                          <td className="px-4 py-3">
                            <AnswerKeyPreview answers={item.answers} />
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-slate-400">
                            {formatDateTime(item.updated_at)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => { setEditItem(item); setShowAddForm(false); }}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-200"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                disabled={deletingId === item.id}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                              >
                                {deletingId === item.id ? (
                                  <Loader className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function AdminDashboard() {
  const [authUser] = useAuthState(auth);

  const [users, setUsers] = useState([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [deletingUid, setDeletingUid] = useState("");
  const [isUpdatingUsers, setIsUpdatingUsers] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });

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

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await listAdminUsers();
      setUsers(result.users || []);
      setUsersLoaded(true);
    } catch (error) {
      setUsers([]);
      setBanner({ type: "error", message: normalizeError(error, "Failed to load users") });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const onUpdateUsers = async () => {
    setIsUpdatingUsers(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await updateUsers();
      setBanner({ type: "success", message: result?.message || "Users updated successfully" });
      await loadUsers();
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to update users") });
    } finally {
      setIsUpdatingUsers(false);
    }
  };

  const onDeleteUser = async (uid) => {
    if (!window.confirm("Delete this user permanently?")) return;
    setDeletingUid(uid);
    setBanner({ type: "", message: "" });
    try {
      await deleteAdminUser({ uid });
      setUsers((prev) => prev.filter((user) => user.uid !== uid));
      setBanner({ type: "success", message: "User deleted successfully" });
    } catch (error) {
      setBanner({ type: "error", message: normalizeError(error, "Failed to delete user") });
    } finally {
      setDeletingUid("");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-sky-50 via-white to-slate-100 px-4 py-6 sm:px-6 lg:px-8 dark:from-black dark:via-slate-950 dark:to-black">
      <div className="pointer-events-none absolute -left-16 top-12 h-44 w-44 rounded-full bg-cyan-200/40 blur-3xl dark:bg-cyan-900/20" />
      <div className="pointer-events-none absolute -right-20 top-28 h-56 w-56 rounded-full bg-blue-300/35 blur-3xl dark:bg-blue-900/20" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-6">
        {/* ── Header card ── */}
        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-blue-900 dark:bg-slate-950">
          <div className="bg-linear-to-r from-sky-600 via-blue-600 to-indigo-600 px-6 py-7 sm:px-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-white sm:text-3xl">
                  <Shield className="h-7 w-7" />
                  Admin Dashboard
                </h1>
                <p className="mt-2 text-sm text-white/90">Manage users and QB answer keys.</p>
              </div>
              <button
                type="button"
                onClick={loadUsers}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-blue-900 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Total users</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {usersLoaded ? users.length : "-"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-blue-900 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Showing</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-slate-100">
                  {usersLoaded ? filteredUsers.length : "-"}
                </p>
              </div>
            </div>

            {banner.message && (
              <div className="mt-4">
                <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
              </div>
            )}
          </div>
        </section>

        {/* ── QB Answer Keys ── */}
        <QBSection />

        {/* ── Users ── */}
        <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 dark:border-blue-900 dark:bg-slate-950">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Users</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onUpdateUsers}
                disabled={isUpdatingUsers}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isUpdatingUsers ? <Loader className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {isUpdatingUsers ? "Updating…" : "Update users"}
              </button>
              <button
                type="button"
                onClick={loadUsers}
                disabled={isLoadingUsers}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingUsers ? <Loader className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
                {isLoadingUsers ? "Loading…" : usersLoaded ? "Reload users" : "Load users"}
              </button>
            </div>
          </div>

          {!usersLoaded ? (
            <div className="flex h-36 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-blue-900 dark:bg-slate-900">
              <Users className="h-8 w-8 text-gray-400 dark:text-slate-500" />
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Click <span className="font-semibold text-blue-600">Load users</span> to fetch the user list.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 dark:border-blue-900 dark:bg-slate-900">
                <Search className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by email, name, or UID"
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-slate-100 dark:placeholder:text-slate-500"
                />
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-blue-900">
                <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900">
                  <thead className="bg-gray-50 dark:bg-slate-900">
                    <tr>
                      {["#", "Photo", "Email", "Display name", "Created", "Last login", "Delete"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-slate-200">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:divide-blue-900 dark:bg-slate-950">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-slate-300">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((userItem, index) => (
                        <tr key={userItem.uid} className="transition hover:bg-gray-50 dark:hover:bg-slate-900">
                          <td className="px-4 py-3 font-medium text-gray-700 dark:text-slate-300">{index + 1}</td>
                          <td className="px-4 py-3">
                            {userItem.photoURL ? (
                              <img
                                src={userItem.photoURL}
                                alt={userItem.displayName || userItem.email || "User"}
                                className="h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-blue-900"
                                loading="lazy"
                              />
                            ) : (
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-slate-900 dark:text-slate-300">
                                {(userItem.displayName || userItem.email || "U").charAt(0).toUpperCase()}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.email || "-"}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{userItem.displayName || "-"}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{formatDateTime(userItem.creationTime)}</td>
                          <td className="px-4 py-3 text-gray-700 dark:text-slate-300">{formatDateTime(userItem.lastSignInTime)}</td>
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
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
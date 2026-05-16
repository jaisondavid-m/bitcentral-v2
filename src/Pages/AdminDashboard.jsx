import { useEffect, useState, useMemo, useCallback } from "react";
import {
  deleteAdminUser,
  listAdminUsers,
  updateUsers,
  listQBAnswerKeys,
  createQBAnswerKeysBatch,
  updateQBAnswerKey,
  deleteQBAnswerKey,
} from "../api/admin.js";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
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

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 6 }, (_, i) => CURRENT_YEAR - i);

const EMPTY_QB_FORM = {
  year: "",
  subject_code: "",
  subject_name: "",
  qb1: "",
  qb2: "",
  ak1: "",
  ak2: "",
  semqbwithans: "",
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

// ─── QB Subject Link Form (Edit single subject) ──────────────────────────────
function QBForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(initial || EMPTY_QB_FORM);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  function toNullable(value) {
    const trimmed = (value || "").trim();
    return trimmed ? trimmed : null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.year || !form.subject_code.trim() || !form.subject_name.trim()) {
      return;
    }
    onSubmit({
      year: Number(form.year),
      subject_code: form.subject_code.trim(),
      subject_name: form.subject_name.trim(),
      qb1: toNullable(form.qb1),
      qb2: toNullable(form.qb2),
      ak1: toNullable(form.ak1),
      ak2: toNullable(form.ak2),
      semqbwithans: toNullable(form.semqbwithans),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">
            Year
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

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">QB1 link</label>
          <input
            type="url"
            value={form.qb1 || ""}
            onChange={set("qb1")}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">QB2 link</label>
          <input
            type="url"
            value={form.qb2 || ""}
            onChange={set("qb2")}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">AK1 link</label>
          <input
            type="url"
            value={form.ak1 || ""}
            onChange={set("ak1")}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">AK2 link</label>
          <input
            type="url"
            value={form.ak2 || ""}
            onChange={set("ak2")}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-slate-300">Semester QB with answer link</label>
        <input
          type="url"
          value={form.semqbwithans || ""}
          onChange={set("semqbwithans")}
          placeholder="https://..."
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
        />
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

function LinkCell({ value }) {
  if (!value) {
    return <span className="text-xs text-gray-400">-</span>;
  }
  return (
    <a
      href={value}
      target="_blank"
      rel="noreferrer"
      className="text-xs font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-300"
    >
      Open
    </a>
  );
}

// ─── QB Handling Section (Year + Subject links) ──────────────────────────────
function QBSection() {
  const [qbItems, setQbItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editItem, setEditItem] = useState(null); // null = not editing, object = editing
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [batchRows, setBatchRows] = useState([{ subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [filterYear, setFilterYear] = useState(String(CURRENT_YEAR));
  const [searchQuery, setSearchQuery] = useState("");

  function toNullable(value) {
    const trimmed = (value || "").trim();
    return trimmed ? trimmed : null;
  }

  const load = useCallback(async () => {
    if (!filterYear) return;
    setIsLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await listQBAnswerKeys({
        year: filterYear || undefined,
      });
      setQbItems(result.data || []);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to load subjects") });
      setQbItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [filterYear]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return qbItems;
    return qbItems.filter(
      (item) =>
        (item.subject_code || "").toLowerCase().includes(q) ||
        (item.subject_name || "").toLowerCase().includes(q)
    );
  }, [qbItems, searchQuery]);

  async function handleCreateBatch() {
    const validRows = batchRows
      .map((row) => ({
        year: Number(filterYear),
        subject_code: row.subject_code.trim(),
        subject_name: row.subject_name.trim(),
        qb1: toNullable(row.qb1),
        qb2: toNullable(row.qb2),
        ak1: toNullable(row.ak1),
        ak2: toNullable(row.ak2),
        semqbwithans: toNullable(row.semqbwithans),
      }))
      .filter((row) => row.subject_code && row.subject_name);

    if (!filterYear || validRows.length === 0) {
      setBanner({ type: "error", message: "Select year and add at least one subject code + name" });
      return;
    }

    setIsSaving(true);
    setBanner({ type: "", message: "" });
    try {
      await createQBAnswerKeysBatch({ year: Number(filterYear), subjects: validRows });
      setBanner({ type: "success", message: "Subjects added successfully" });
      setShowBatchForm(false);
      setBatchRows([{ subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }]);
      await load();
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to add subjects") });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(payload) {
    setIsSaving(true);
    setBanner({ type: "", message: "" });
    try {
      await updateQBAnswerKey(editItem.id, payload);
      setBanner({ type: "success", message: "Subject updated successfully" });
      setEditItem(null);
      await load();
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to update subject") });
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this subject permanently?")) return;
    setDeletingId(id);
    setBanner({ type: "", message: "" });
    try {
      await deleteQBAnswerKey(id);
      setQbItems((prev) => prev.filter((item) => item.id !== id));
      setBanner({ type: "success", message: "Subject deleted" });
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete subject") });
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
            QB Handling
          </h2>
          <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
            Add multiple subjects for a year, then edit links later
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setShowBatchForm(true); setEditItem(null); }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add subjects (batch)
        </button>
      </div>

      {/* Banner */}
      {banner.message && (
        <div className="mb-4">
          <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
        </div>
      )}

      {/* Batch add form */}
      {showBatchForm && !editItem && (
        <div className="mb-5 rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-gray-800 dark:text-slate-200">
            Add subjects for year {filterYear || "-"}
          </h3>
          <div className="space-y-3">
            {batchRows.map((row, idx) => (
              <div key={idx} className="grid gap-2 rounded-lg border border-blue-200 bg-white p-3 sm:grid-cols-7 dark:border-blue-900 dark:bg-slate-950">
                <input
                  type="text"
                  value={row.subject_code}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, subject_code: e.target.value } : r)))}
                  placeholder="Code"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="text"
                  value={row.subject_name}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, subject_name: e.target.value } : r)))}
                  placeholder="Subject name"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="url"
                  value={row.qb1}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, qb1: e.target.value } : r)))}
                  placeholder="QB1"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="url"
                  value={row.qb2}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, qb2: e.target.value } : r)))}
                  placeholder="QB2"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="url"
                  value={row.ak1}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ak1: e.target.value } : r)))}
                  placeholder="AK1"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <input
                  type="url"
                  value={row.ak2}
                  onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ak2: e.target.value } : r)))}
                  placeholder="AK2"
                  className="rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={row.semqbwithans}
                    onChange={(e) => setBatchRows((prev) => prev.map((r, i) => (i === idx ? { ...r, semqbwithans: e.target.value } : r)))}
                    placeholder="Sem QB + Ans"
                    className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm outline-none ring-blue-500 focus:ring dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setBatchRows((prev) => prev.filter((_, i) => i !== idx))}
                    disabled={batchRows.length === 1}
                    className="rounded border border-red-300 px-2 py-1.5 text-xs font-semibold text-red-600 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setBatchRows((prev) => [...prev, { subject_code: "", subject_name: "", qb1: "", qb2: "", ak1: "", ak2: "", semqbwithans: "" }])}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-900 dark:bg-slate-950 dark:text-blue-300 dark:hover:bg-slate-900"
              >
                <Plus className="h-4 w-4" />
                Add row
              </button>
              <button
                type="button"
                onClick={handleCreateBatch}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              >
                {isSaving ? <Loader className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Save batch
              </button>
              <button
                type="button"
                onClick={() => setShowBatchForm(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-2">
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
      ) : filtered.length === 0 ? (
        <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-blue-900 dark:bg-slate-900">
          <BookOpen className="h-7 w-7 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-slate-400">No subjects found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-blue-900">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-blue-900">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">#</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Code</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Subject</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">QB1</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">QB2</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">AK1</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">AK2</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Sem + Ans</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Updated</th>
                <th className="px-4 py-2.5 text-left font-semibold text-gray-700 dark:text-slate-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-blue-900 dark:bg-slate-950">
              {filtered.map((item, idx) =>
                editItem?.id === item.id ? (
                  <tr key={item.id}>
                    <td colSpan={10} className="px-4 py-4">
                      <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900 dark:bg-slate-900">
                        <h4 className="mb-3 text-sm font-semibold text-gray-800 dark:text-slate-200">
                          Edit: {item.subject_code} - {item.subject_name}
                        </h4>
                        <QBForm
                          initial={{ ...editItem, year: String(editItem.year) }}
                          onSubmit={handleUpdate}
                          onCancel={() => setEditItem(null)}
                          isLoading={isSaving}
                        />
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={item.id} className="transition hover:bg-gray-50 dark:hover:bg-slate-900">
                    <td className="px-4 py-3 font-medium text-gray-500 dark:text-slate-400">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700 dark:bg-slate-800 dark:text-slate-200">
                        {item.subject_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-slate-200">{item.subject_name}</td>
                    <td className="px-4 py-3"><LinkCell value={item.qb1} /></td>
                    <td className="px-4 py-3"><LinkCell value={item.qb2} /></td>
                    <td className="px-4 py-3"><LinkCell value={item.ak1} /></td>
                    <td className="px-4 py-3"><LinkCell value={item.ak2} /></td>
                    <td className="px-4 py-3"><LinkCell value={item.semqbwithans} /></td>
                    <td className="px-4 py-3 text-gray-500 dark:text-slate-400">{formatDateTime(item.updated_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => { setEditItem(item); setShowBatchForm(false); }}
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
  const [activeTab, setActiveTab] = useState("qb");

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

        {/* Tabs: QB Handling / Users */}
        <div className="mb-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("qb")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "qb"
                ? "bg-blue-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            QB Handling
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              activeTab === "users"
                ? "bg-blue-600 text-white"
                : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-blue-900 dark:bg-slate-900 dark:text-slate-100"
            }`}
          >
            <Users className="h-4 w-4" />
            Users
          </button>
        </div>

        {activeTab === "qb" ? (
          <QBSection />
        ) : (
        /* ── Users ── */
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
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
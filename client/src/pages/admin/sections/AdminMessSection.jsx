import React, { useState, useEffect, useMemo, useCallback } from "react";
import api from "@/api/axios.js";
import {
  CalendarDays,
  Database,
  Plus,
  RefreshCw,
  Loader,
  Edit2,
  Trash2,
  Upload,
  Download,
  X,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  uploadMessMenuCsv,
  listMessMenuRows,
  updateMessMenuRow,
  deleteMessMenuRow,
  listMessClosures,
  createMessClosure,
  updateMessClosure,
  deleteMessClosure,
} from "@/api/admin.js";
import { MealCard } from "@/components/cards/MealCard.jsx";
import { normalizeError, todayIST, downloadMessTemplate } from "../utils/adminUtils.js";
import AdminBanner from "../components/AdminBanner.jsx";
import AdminConfirmModal from "../components/AdminConfirmModal.jsx";

export default function AdminMessSection() {
  const [activeSubTab, setActiveSubTab] = useState("menu"); // "menu" | "closures"
  const [hostel, setHostel] = useState("boys");
  const [selectedDate, setSelectedDate] = useState(todayIST());
  const [preview, setPreview] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rowsLoading, setRowsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingRow, setSavingRow] = useState(false);
  const [deletingRowId, setDeletingRowId] = useState(null);
  const [deleteConfirmRow, setDeleteConfirmRow] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [banner, setBanner] = useState({ type: "", message: "" });

  // Closures states
  const [closures, setClosures] = useState([]);
  const [closuresLoading, setClosuresLoading] = useState(false);
  const [closureHostelFilter, setClosureHostelFilter] = useState("all");
  const [closureStatusFilter, setClosureStatusFilter] = useState("all");
  const [editingClosure, setEditingClosure] = useState(null);
  const [savingClosure, setSavingClosure] = useState(false);
  const [deletingClosure, setDeletingClosure] = useState(null);
  const [deletingClosureBusy, setDeletingClosureBusy] = useState(false);

  const loadPreview = useCallback(async () => {
    if (!hostel || !selectedDate) return;
    setLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const response = await api.get("/mess", { params: { hostel, date: selectedDate } });
      setPreview(response.data || {});
    } catch (err) {
      setPreview(null);
      setBanner({ type: "error", message: normalizeError(err, "Failed to load mess menu") });
    } finally {
      setLoading(false);
    }
  }, [hostel, selectedDate]);

  const loadRows = useCallback(async () => {
    if (!hostel || !selectedDate) return;
    setRowsLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await listMessMenuRows({ hostel, date: selectedDate });
      setRows(result.data || []);
    } catch (err) {
      setRows([]);
      setBanner({ type: "error", message: normalizeError(err, "Failed to load mess rows") });
    } finally {
      setRowsLoading(false);
    }
  }, [hostel, selectedDate]);

  const loadClosures = useCallback(async () => {
    setClosuresLoading(true);
    try {
      const result = await listMessClosures({
        hostel: closureHostelFilter,
        status: closureStatusFilter,
      });
      setClosures(result?.data || []);
    } catch (err) {
      setClosures([]);
      setBanner({ type: "error", message: normalizeError(err, "Failed to load mess closures") });
    } finally {
      setClosuresLoading(false);
    }
  }, [closureHostelFilter, closureStatusFilter]);

  useEffect(() => {
    loadPreview();
    loadRows();
  }, [loadPreview, loadRows]);

  useEffect(() => {
    loadClosures();
  }, [loadClosures]);

  const fullMenu = preview?.full_menu || {};
  const totalItems = useMemo(() => {
    return ["breakfast", "lunch", "dinner"].reduce((sum, key) => sum + (fullMenu[key]?.length || 0), 0);
  }, [fullMenu]);

  const currentMeal = preview?.current_meal?.meal_type?.toLowerCase?.() || "breakfast";

  const closedMealsInPreview = useMemo(() => {
    if (!preview?.closures) return [];
    return ["breakfast", "lunch", "dinner"].filter((m) => preview.closures[m]?.is_closed);
  }, [preview?.closures]);

  const closureStats = useMemo(() => {
    const today = todayIST();
    let activeNow = 0;
    let upcoming = 0;
    closures.forEach((c) => {
      if (c.is_active) {
        if (c.start_date <= today && c.end_date >= today) activeNow++;
        else if (c.start_date > today) upcoming++;
      }
    });
    return { activeNow, upcoming, total: closures.length };
  }, [closures]);

  const editingForm = editingRow || {
    hostel,
    date: selectedDate,
    day: preview?.day || "",
    meal_type: "Breakfast",
    item: "",
    item_order: 1,
  };

  async function saveRow(event) {
    event.preventDefault();
    if (!editingRow) return;
    setSavingRow(true);
    setBanner({ type: "", message: "" });
    try {
      const result = await updateMessMenuRow(editingRow.id, {
        hostel: editingForm.hostel,
        date: editingForm.date,
        day: editingForm.day,
        meal_type: editingForm.meal_type,
        item: editingForm.item,
        item_order: Number(editingForm.item_order || 1),
      });
      setBanner({ type: "success", message: result?.message || "Menu item updated" });
      setEditingRow(null);
      await Promise.all([loadPreview(), loadRows()]);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to update menu item") });
    } finally {
      setSavingRow(false);
    }
  }

  async function executeDeleteRow() {
    if (!deleteConfirmRow) return;
    const rowId = deleteConfirmRow.id;
    setDeletingRowId(rowId);
    setBanner({ type: "", message: "" });
    try {
      const result = await deleteMessMenuRow(rowId);
      setBanner({ type: "success", message: result?.message || "Menu item deleted" });
      setDeleteConfirmRow(null);
      await Promise.all([loadPreview(), loadRows()]);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete menu item") });
    } finally {
      setDeletingRowId(null);
    }
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const formData = new FormData();
    formData.append("hostel", hostel);
    formData.append("file", file);

    setUploading(true);
    setBanner({ type: "", message: "" });

    try {
      const result = await uploadMessMenuCsv(formData);
      setBanner({ type: "success", message: result?.message || "Mess menu uploaded successfully" });
      await Promise.all([loadPreview(), loadRows()]);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to upload mess CSV") });
    } finally {
      setUploading(false);
    }
  }

  function mealOrderNumber(meal) {
    switch ((meal || "").toLowerCase()) {
      case "breakfast": return 1;
      case "lunch": return 2;
      case "dinner": return 3;
      default: return 1;
    }
  }

  function applyClosurePreset(presetKey) {
    const today = todayIST();
    const d = new Date();
    if (presetKey === "diwali") {
      const end = new Date(d);
      end.setDate(end.getDate() + 4);
      const endStr = end.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      setEditingClosure((prev) => ({
        ...prev,
        reason: "Mess closed due to Diwali holiday",
        notes: "Mess is closed for Diwali festival holidays. Dining services will resume as scheduled.",
        start_date: today,
        start_meal: "Lunch",
        end_date: endStr,
        end_meal: "Dinner",
      }));
    } else if (presetKey === "pongal") {
      const end = new Date(d);
      end.setDate(end.getDate() + 4);
      const endStr = end.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      setEditingClosure((prev) => ({
        ...prev,
        reason: "Mess closed due to Pongal holidays",
        notes: "Mess is closed for Pongal holidays. Regular mess service resumes on reopening morning.",
        start_date: today,
        start_meal: "Lunch",
        end_date: endStr,
        end_meal: "Dinner",
      }));
    } else if (presetKey === "vacation") {
      const end = new Date(d);
      end.setDate(end.getDate() + 7);
      const endStr = end.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
      setEditingClosure((prev) => ({
        ...prev,
        reason: "Mess closed for semester vacation",
        notes: "Hostel mess is closed during the academic vacation period.",
        start_date: today,
        start_meal: "Breakfast",
        end_date: endStr,
        end_meal: "Dinner",
      }));
    } else if (presetKey === "maintenance") {
      setEditingClosure((prev) => ({
        ...prev,
        reason: "Mess closed for kitchen maintenance",
        notes: "Mess is closed for deep kitchen cleaning and routine maintenance.",
        start_date: today,
        start_meal: "Lunch",
        end_date: today,
        end_meal: "Dinner",
      }));
    }
  }

  async function handleSaveClosure(e) {
    e.preventDefault();
    if (!editingClosure) return;
    if (!editingClosure.start_date || !editingClosure.end_date) {
      setBanner({ type: "error", message: "Start date and end date are required" });
      return;
    }
    if (!editingClosure.reason || !editingClosure.reason.trim()) {
      setBanner({ type: "error", message: "Reason is required" });
      return;
    }

    setSavingClosure(true);
    setBanner({ type: "", message: "" });
    try {
      if (editingClosure.id) {
        const res = await updateMessClosure(editingClosure.id, editingClosure);
        setBanner({ type: "success", message: res?.message || "Mess closure updated" });
      } else {
        const res = await createMessClosure(editingClosure);
        setBanner({ type: "success", message: res?.message || "Mess closure scheduled" });
      }
      setEditingClosure(null);
      await Promise.all([loadClosures(), loadPreview()]);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to save mess closure") });
    } finally {
      setSavingClosure(false);
    }
  }

  async function handleToggleClosureActive(closure) {
    try {
      await updateMessClosure(closure.id, { is_active: !closure.is_active });
      await Promise.all([loadClosures(), loadPreview()]);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to toggle closure status") });
    }
  }

  async function handleDeleteClosure() {
    if (!deletingClosure) return;
    setDeletingClosureBusy(true);
    try {
      const res = await deleteMessClosure(deletingClosure.id);
      setBanner({ type: "success", message: res?.message || "Mess closure deleted" });
      setDeletingClosure(null);
      await Promise.all([loadClosures(), loadPreview()]);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete mess closure") });
    } finally {
      setDeletingClosureBusy(false);
    }
  }

  function getClosureStatus(c) {
    if (!c.is_active) return { label: "Disabled", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" };
    const today = todayIST();
    if (c.end_date < today) return { label: "Past", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" };
    if (c.start_date > today) return { label: "Upcoming", color: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300" };
    return { label: "Active Now", color: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200" };
  }

  return (
    <section className="rounded-2xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-900 p-5 dark:border-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              Mess Menu & Closures
            </h2>
            <span className="rounded-md border border-zinc-900 bg-blue-50 px-2 py-0.5 text-xs font-black text-blue-700 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-300 dark:shadow-[1px_1px_0px_#ffffff]">
              {totalItems} items ({selectedDate})
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Configure boys & girls daily dining menus, bulk CSV imports, and scheduled holiday closures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {activeSubTab === "menu" ? (
            <>
              <button
                type="button"
                onClick={downloadMessTemplate}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Template</span>
              </button>
              <label className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer">
                {uploading ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                <span>{uploading ? "Uploading..." : "Upload CSV"}</span>
                <input type="file" accept=".csv,text/csv" onChange={handleUpload} className="sr-only" disabled={uploading} />
              </label>
            </>
          ) : (
            <button
              type="button"
              onClick={() =>
                setEditingClosure({
                  hostel: "all",
                  start_date: todayIST(),
                  start_meal: "Lunch",
                  end_date: todayIST(),
                  end_meal: "Dinner",
                  reason: "Mess closed due to Diwali holiday",
                  notes: "",
                  is_active: true,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Schedule Mess Closure</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab Navigation Pills */}
      <div className="flex border-b border-zinc-200 bg-zinc-50 px-5 pt-3 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab("menu")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black transition-all cursor-pointer ${
              activeSubTab === "menu"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Daily Menu & CSV</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("closures")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-black transition-all cursor-pointer ${
              activeSubTab === "closures"
                ? "border-rose-600 text-rose-600 dark:border-rose-400 dark:text-rose-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400"
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Mess Closures & Holidays</span>
            {closureStats.activeNow > 0 && (
              <span className="rounded-md border border-zinc-900 bg-rose-100 px-1.5 py-0.2 text-[10px] font-black text-rose-800 dark:border-white dark:bg-rose-950 dark:text-rose-200">
                {closureStats.activeNow} Active
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {banner.message && (
          <AdminBanner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
        )}

        {/* Tab 1: Menu Preview */}
        {activeSubTab === "menu" && (
          <div className="space-y-5">
            {closedMealsInPreview.length > 0 && (
              <div className="flex items-center justify-between rounded-xl border border-zinc-900 bg-rose-50 p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-rose-950 dark:shadow-[2px_2px_0px_#ffffff]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚫</span>
                  <div>
                    <h4 className="text-sm font-black text-rose-900 dark:text-rose-200">
                      Mess Closed on {selectedDate} ({closedMealsInPreview.map((m) => m.toUpperCase()).join(", ")})
                    </h4>
                    <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                      Reason: {preview?.day_closure_reason || "Scheduled Holiday Closure"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("closures")}
                  className="rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-black text-rose-800 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-rose-200 cursor-pointer"
                >
                  Manage Closures &rarr;
                </button>
              </div>
            )}

            {/* Selector Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Hostel</span>
                <div className="mt-2 flex gap-2">
                  {["boys", "girls"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setHostel(val)}
                      className={`flex-1 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        hostel === val
                          ? "border-zinc-900 bg-blue-600 text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:shadow-[1.5px_1.5px_0px_#ffffff]"
                          : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {val === "boys" ? "Boys" : "Girls"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] focus:outline-none dark:border-white dark:bg-zinc-800 dark:text-zinc-100"
                />
              </div>

              <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Menu Items</span>
                <div className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  {totalItems}
                </div>
                <p className="text-xs font-semibold text-zinc-400">For {preview?.day || "selected date"}</p>
              </div>

              <div className="rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff]">
                <span className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Actions</span>
                <button
                  type="button"
                  onClick={loadPreview}
                  className="mt-2 w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Refresh Preview</span>
                </button>
              </div>
            </div>

            {/* Meal Cards Preview */}
            <div className="grid gap-4 lg:grid-cols-3">
              {loading ? (
                <div className="lg:col-span-3 rounded-xl border border-dashed border-zinc-300 py-16 text-center text-sm font-bold text-zinc-400">
                  Loading mess menu preview...
                </div>
              ) : (
                ["breakfast", "lunch", "dinner"].map((meal) => (
                  <MealCard
                    key={meal}
                    type={meal}
                    items={fullMenu[meal] || []}
                    isActive={currentMeal === meal}
                    isServingNow={preview?.current_meal?.meal_type?.toLowerCase?.() === meal}
                    closure={preview?.closures?.[meal]}
                  />
                ))
              )}
            </div>

            {/* Menu Rows Table */}
            <div className="rounded-xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
              <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
                <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50">Menu Items for {selectedDate}</h3>
                <button
                  type="button"
                  onClick={() => Promise.all([loadPreview(), loadRows()])}
                  className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Refresh Items</span>
                </button>
              </div>

              {rowsLoading ? (
                <div className="p-8 text-center text-xs font-bold text-zinc-400">Loading menu rows...</div>
              ) : rows.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-zinc-400">No items found for this date.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                    <thead className="bg-zinc-100 dark:bg-zinc-800 text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-300">
                      <tr>
                        <th className="px-4 py-2.5 text-left">Order</th>
                        <th className="px-4 py-2.5 text-left">Meal</th>
                        <th className="px-4 py-2.5 text-left">Item</th>
                        <th className="px-4 py-2.5 text-left">Day</th>
                        <th className="px-4 py-2.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {rows.map((row) => (
                        <tr key={row.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                          <td className="px-4 py-2.5 font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">{row.item_order}</td>
                          <td className="px-4 py-2.5 font-bold text-zinc-800 dark:text-zinc-200">{row.meal_type}</td>
                          <td className="px-4 py-2.5 font-semibold text-zinc-900 dark:text-zinc-100">{row.item}</td>
                          <td className="px-4 py-2.5 text-xs text-zinc-600 dark:text-zinc-400">{row.day}</td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setEditingRow(row)}
                                className="rounded-lg border border-zinc-900 bg-white px-2 py-1 text-xs font-bold text-zinc-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmRow(row)}
                                disabled={deletingRowId === row.id}
                                className="rounded-lg border border-zinc-900 bg-rose-600 px-2 py-1 text-xs font-bold text-white shadow-[1px_1px_0px_#18181b] dark:border-white cursor-pointer disabled:opacity-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Closures & Holidays */}
        {activeSubTab === "closures" && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-zinc-900 bg-rose-50 p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-rose-950/40">
                <p className="text-xs font-black uppercase tracking-wider text-rose-700 dark:text-rose-300">Active Closures</p>
                <p className="mt-1 text-2xl font-black text-rose-900 dark:text-rose-100">{closureStats.activeNow}</p>
                <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">Currently closed right now</p>
              </div>

              <div className="rounded-xl border border-zinc-900 bg-blue-50 p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-blue-950/40">
                <p className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-300">Upcoming Closures</p>
                <p className="mt-1 text-2xl font-black text-blue-900 dark:text-blue-100">{closureStats.upcoming}</p>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Scheduled future holidays</p>
              </div>

              <div className="rounded-xl border border-zinc-900 bg-zinc-50 p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800">
                <p className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Total Recorded</p>
                <p className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-50">{closureStats.total}</p>
                <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">All closure records</p>
              </div>
            </div>

            {/* Closures Cards */}
            {closuresLoading ? (
              <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center text-sm font-bold text-zinc-400">
                Loading mess closure schedules...
              </div>
            ) : closures.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 py-12 text-center">
                <AlertTriangle className="mx-auto h-8 w-8 text-zinc-400 mb-2" />
                <h4 className="text-sm font-black text-zinc-800 dark:text-zinc-200">No Mess Closures Scheduled</h4>
                <p className="mt-1 text-xs font-semibold text-zinc-500">Click Schedule Mess Closure to add holidays.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {closures.map((c) => {
                  const status = getClosureStatus(c);
                  return (
                    <div
                      key={c.id}
                      className={`flex flex-col justify-between rounded-xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] transition-all ${
                        !c.is_active ? "opacity-60" : ""
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className={`rounded-md border border-zinc-900 px-2 py-0.5 text-[10px] font-black uppercase dark:border-white ${status.color}`}>
                            {status.label}
                          </span>
                          <span className="rounded-md border border-zinc-900 bg-zinc-100 px-2 py-0.5 text-[10px] font-black uppercase text-zinc-700 dark:border-white dark:bg-zinc-800 dark:text-zinc-200">
                            {c.hostel === "boys" ? "Boys Hostel" : c.hostel === "girls" ? "Girls Hostel" : "All Hostels"}
                          </span>
                        </div>

                        <h4 className="mt-3 text-base font-black text-zinc-900 dark:text-zinc-50">
                          {c.reason}
                        </h4>

                        <div className="mt-2.5 flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
                          <CalendarDays className="h-4 w-4 text-rose-500 shrink-0" />
                          <span>{c.start_date} ({c.start_meal})</span>
                          <span>&rarr;</span>
                          <span>{c.end_date} ({c.end_meal})</span>
                        </div>

                        {c.notes && (
                          <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            {c.notes}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-3 dark:border-zinc-800">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={c.is_active}
                            onChange={() => handleToggleClosureActive(c)}
                            className="h-4 w-4 rounded border-zinc-900 text-blue-600 focus:ring-blue-500"
                          />
                          <span>{c.is_active ? "Enabled" : "Disabled"}</span>
                        </label>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingClosure({ ...c })}
                            className="rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                          >
                            <Edit2 className="h-3.5 w-3.5 inline mr-1" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingClosure(c)}
                            className="rounded-lg border border-zinc-900 bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-[1px_1px_0px_#18181b] dark:border-white cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5 inline mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Single Menu Row Modal */}
      {editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onClick={() => setEditingRow(null)}>
          <div
            className="w-full max-w-lg rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-50">Edit Menu Item</h3>
              <button
                type="button"
                onClick={() => setEditingRow(null)}
                className="rounded-lg border border-zinc-900 p-1 text-zinc-600 hover:bg-zinc-100 dark:border-white dark:text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={saveRow} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Item Name</label>
                <input
                  type="text"
                  value={editingForm.item}
                  onChange={(e) => setEditingRow((prev) => ({ ...prev, item: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2 font-semibold text-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Meal Type</label>
                  <select
                    value={editingForm.meal_type}
                    onChange={(e) => setEditingRow((prev) => ({ ...prev, meal_type: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-2 font-bold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={editingForm.item_order}
                    onChange={(e) => setEditingRow((prev) => ({ ...prev, item_order: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-2 font-bold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingRow(null)}
                  className="rounded-lg border border-zinc-900 bg-white px-4 py-2 text-xs font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRow}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] dark:border-white disabled:opacity-50"
                >
                  {savingRow && <Loader className="h-3.5 w-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit / Add Closure Modal */}
      {editingClosure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onClick={() => setEditingClosure(null)}>
          <div
            className="w-full max-w-xl rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4 dark:border-zinc-800">
              <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
                {editingClosure.id ? "Edit Closure" : "Schedule Mess Closure"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingClosure(null)}
                className="rounded-lg border border-zinc-900 p-1 text-zinc-600 hover:bg-zinc-100 dark:border-white dark:text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClosure} className="space-y-4">
              {/* Presets */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                  Holiday Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "diwali", label: "🪔 Diwali" },
                    { key: "pongal", label: "🌾 Pongal" },
                    { key: "vacation", label: "🏖️ Vacation" },
                    { key: "maintenance", label: "🔧 Maintenance" },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => applyClosurePreset(p.key)}
                      className="rounded-lg border border-zinc-900 bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-[1px_1px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-200 transition-all cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hostel */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Hostel</label>
                <div className="flex gap-2">
                  {[
                    { key: "all", label: "All Hostels" },
                    { key: "boys", label: "Boys" },
                    { key: "girls", label: "Girls" },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setEditingClosure((prev) => ({ ...prev, hostel: tab.key }))}
                      className={`flex-1 rounded-lg border py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        (editingClosure.hostel || "all") === tab.key
                          ? "border-zinc-900 bg-blue-600 text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white"
                          : "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={editingClosure.start_date || ""}
                    onChange={(e) => setEditingClosure((prev) => ({ ...prev, start_date: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-1.5 text-xs font-semibold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                    required
                  />
                  <select
                    value={editingClosure.start_meal || "Breakfast"}
                    onChange={(e) => setEditingClosure((prev) => ({ ...prev, start_meal: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">End Date</label>
                  <input
                    type="date"
                    value={editingClosure.end_date || ""}
                    onChange={(e) => setEditingClosure((prev) => ({ ...prev, end_date: e.target.value }))}
                    className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-1.5 text-xs font-semibold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                    required
                  />
                  <select
                    value={editingClosure.end_meal || "Dinner"}
                    onChange={(e) => setEditingClosure((prev) => ({ ...prev, end_meal: e.target.value }))}
                    className="mt-1.5 w-full rounded-xl border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                  </select>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Reason *</label>
                <input
                  type="text"
                  value={editingClosure.reason || ""}
                  onChange={(e) => setEditingClosure((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="e.g. Mess closed due to Diwali holiday"
                  className="w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2 text-xs font-semibold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingClosure(null)}
                  className="rounded-lg border border-zinc-900 bg-white px-4 py-2 text-xs font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingClosure}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] dark:border-white disabled:opacity-50 cursor-pointer"
                >
                  {savingClosure && <Loader className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingClosure.id ? "Update Closure" : "Schedule Closure"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <AdminConfirmModal
        open={Boolean(deleteConfirmRow)}
        title="Delete Menu Item"
        description={`Delete "${deleteConfirmRow?.item}" from the mess menu? This cannot be undone.`}
        confirmLabel="Delete Item"
        busy={Boolean(deletingRowId)}
        onConfirm={executeDeleteRow}
        onCancel={() => setDeleteConfirmRow(null)}
      />

      <AdminConfirmModal
        open={Boolean(deletingClosure)}
        title="Delete Mess Closure"
        description={`Delete closure "${deletingClosure?.reason}" (${deletingClosure?.start_date} to ${deletingClosure?.end_date})?`}
        confirmLabel="Delete Closure"
        busy={deletingClosureBusy}
        onConfirm={handleDeleteClosure}
        onCancel={() => setDeletingClosure(null)}
      />
    </section>
  );
}

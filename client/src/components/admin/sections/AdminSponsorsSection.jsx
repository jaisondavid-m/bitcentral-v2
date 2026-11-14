import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Heart,
  RefreshCw,
  Loader,
  Edit2,
  Trash2,
  Plus,
  Search,
  X,
  Upload,
  Download,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";
import {
  getAdminSponsors,
  getAdminSponsorsLeaderboard,
  updateSponsorNameOverride,
  deleteSponsorNameOverride,
  getSponsorDepartments,
  createSponsorDepartment,
  createSponsorDepartmentsBatch,
  updateSponsorDepartment,
  deleteSponsorDepartment,
  updateSponsorDepartmentMapping,
  updateSponsorDepartmentMappingsBatch,
  updateSponsorTransactionOverride,
} from "@/api/admin.js";
import { normalizeError } from "@/utils/adminUtils.js";
import AdminBanner from "@/components/admin/AdminBanner.jsx";

export default function AdminSponsorsSection() {
  const [activeSubTab, setActiveSubTab] = useState("leaderboard"); // "leaderboard" | "departments" | "transactions"
  const [data, setData] = useState({ orders: [], total_amount_raised: 0 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [deptLeaderboard, setDeptLeaderboard] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [deptSearchQuery, setDeptSearchQuery] = useState("");
  const [txSearchQuery, setTxSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState({ type: "", message: "" });

  // Modal State for Editing Leaderboard Name & Department Mapping
  const [editingDonor, setEditingDonor] = useState(null);
  const [customNameInput, setCustomNameInput] = useState("");
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // State for Creating & Editing Department
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptEmailCode, setNewDeptEmailCode] = useState("");
  const [newDeptYear, setNewDeptYear] = useState("1st Year");
  const [newDeptYearCode, setNewDeptYearCode] = useState("");
  const [isAddingDept, setIsAddingDept] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [isSavingDept, setIsSavingDept] = useState(false);

  // Bulk Upload State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState("departments");
  const [bulkDeptFile, setBulkDeptFile] = useState(null);
  const [bulkDeptPreview, setBulkDeptPreview] = useState([]);
  const [bulkMappingFile, setBulkMappingFile] = useState(null);
  const [bulkMappingPreview, setBulkMappingPreview] = useState([]);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  const filteredDepartments = useMemo(() => {
    if (!deptSearchQuery.trim()) return departments;
    const q = deptSearchQuery.toLowerCase().trim();
    return departments.filter(
      (dept) =>
        dept.name?.toLowerCase().includes(q) ||
        dept.code?.toLowerCase().includes(q) ||
        dept.email_code?.toLowerCase().includes(q) ||
        dept.year?.toLowerCase().includes(q) ||
        dept.year_code?.toLowerCase().includes(q) ||
        String(dept.id).includes(q)
    );
  }, [departments, deptSearchQuery]);

  const filteredTransactions = useMemo(() => {
    const orders = data.orders || [];
    const sorted = [...orders].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeB - timeA;
    });

    if (!txSearchQuery.trim()) return sorted;
    const q = txSearchQuery.toLowerCase().trim();
    return sorted.filter((item) => {
      return (
        item.id?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.phone?.toLowerCase().includes(q) ||
        String(item.amount).includes(q) ||
        item.status?.toLowerCase().includes(q) ||
        (item.is_anonymous ? "anonymous" : "public").includes(q) ||
        item.created_at?.toLowerCase().includes(q)
      );
    });
  }, [data.orders, txSearchQuery]);

  const fetchSponsorsData = useCallback(async () => {
    setLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const [sponsorsRes, leaderboardRes, deptsRes] = await Promise.allSettled([
        getAdminSponsors({ count: 100, skip: 0 }),
        getAdminSponsorsLeaderboard(),
        getSponsorDepartments(),
      ]);

      if (sponsorsRes.status === "fulfilled" && sponsorsRes.value?.success) {
        setData(sponsorsRes.value);
      } else if (sponsorsRes.status === "rejected") {
        setBanner({ type: "error", message: normalizeError(sponsorsRes.reason, "Failed to load sponsor transactions") });
      }

      if (leaderboardRes.status === "fulfilled" && leaderboardRes.value?.success) {
        setLeaderboard(leaderboardRes.value.leaderboard || []);
        setDeptLeaderboard(leaderboardRes.value.department_leaderboard || []);
      }

      if (deptsRes.status === "fulfilled" && deptsRes.value?.success) {
        setDepartments(deptsRes.value.departments || []);
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to fetch sponsor data") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsorsData();
  }, [fetchSponsorsData]);

  const handleOpenEditModal = (donor) => {
    setEditingDonor(donor);
    setCustomNameInput(donor.display_name || donor.original_name || "");
    setSelectedDeptId(donor.department_id ? String(donor.department_id) : "");
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ""));
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
      if (values.length === 0 || (values.length === 1 && !values[0])) continue;
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] || "";
      });
      records.push(row);
    }
    return records;
  };

  const handleDeptCsvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkDeptFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = parseCSV(text);
      const parsedDepts = rows
        .map((r) => ({
          name: r.name || r["department name"] || r.department || "",
          code: (r.code || r["short code"] || r.shortcode || "").toUpperCase(),
          email_code: (r.email_code || r["email code"] || r.email_short_code || "").toLowerCase(),
          year: r.year || r["year / batch"] || r.batch || "1st Year",
          year_code: (r.year_code || r["year code"] || r.batch_code || "").toLowerCase(),
        }))
        .filter((d) => d.name && d.code);
      setBulkDeptPreview(parsedDepts);
    };
    reader.readAsText(file);
  };

  const handleMappingCsvChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkMappingFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = parseCSV(text);
      const parsedMappings = rows
        .map((r) => ({
          email: r.email || r["donor email"] || "",
          phone: r.phone || r["donor phone"] || r.contact || "",
          donor_key: r.donor_key || r.key || "",
          department_code: (r.department_code || r.code || r.department || "").toUpperCase(),
          year: r.year || r.batch || "1st Year",
        }))
        .filter((m) => m.department_code && (m.email || m.phone || m.donor_key));
      setBulkMappingPreview(parsedMappings);
    };
    reader.readAsText(file);
  };

  const handleUploadBulkDepts = async () => {
    if (bulkDeptPreview.length === 0) return;
    setIsUploadingBulk(true);
    try {
      const res = await createSponsorDepartmentsBatch(bulkDeptPreview);
      if (res?.success) {
        setBanner({ type: "success", message: res.message || "Bulk departments uploaded successfully!" });
        setBulkDeptFile(null);
        setBulkDeptPreview([]);
        setIsBulkModalOpen(false);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to bulk upload departments" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to upload departments batch") });
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const handleUploadBulkMappings = async () => {
    if (bulkMappingPreview.length === 0) return;
    setIsUploadingBulk(true);
    try {
      const res = await updateSponsorDepartmentMappingsBatch(bulkMappingPreview);
      if (res?.success) {
        setBanner({ type: "success", message: res.message || "Bulk donor mappings updated successfully!" });
        setBulkMappingFile(null);
        setBulkMappingPreview([]);
        setIsBulkModalOpen(false);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to bulk map donors" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to upload donor mappings batch") });
    } finally {
      setIsUploadingBulk(false);
    }
  };

  const downloadDeptTemplate = () => {
    const content = "name,code,email_code,year,year_code\nComputer Science and Engineering,CSE,cs,1st Year,25\nComputer Science and Engineering,CSE,cs,2nd Year,24\nElectrical and Electronics Engineering,EEE,ee,3rd Year,24\nInformation Technology,IT,it,1st Year,25";
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "departments_template.csv";
    a.click();
  };

  const downloadMappingTemplate = () => {
    const content = "email,phone,code,year\nstudent1@example.com,9876543210,CSE,1st Year\nstudent2@example.com,,IT,2nd Year";
    const blob = new Blob([content], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "donor_mappings_template.csv";
    a.click();
  };

  const handleSaveCustomName = async (e) => {
    e.preventDefault();
    if (!editingDonor || !customNameInput.trim()) return;

    setIsSaving(true);
    try {
      const [nameRes, deptRes] = await Promise.all([
        updateSponsorNameOverride({
          donor_key: editingDonor.donor_key,
          custom_name: customNameInput.trim(),
          email: editingDonor.email,
          phone: editingDonor.phone,
        }),
        updateSponsorDepartmentMapping({
          donor_key: editingDonor.donor_key,
          department_id: Number(selectedDeptId) || 0,
          email: editingDonor.email,
          phone: editingDonor.phone,
        }),
      ]);

      if (nameRes?.success && deptRes?.success) {
        setBanner({ type: "success", message: "Donor display name and department updated successfully!" });
        setEditingDonor(null);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: nameRes?.error || deptRes?.error || "Failed to update donor settings" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to save donor settings") });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToOriginal = async () => {
    if (!editingDonor) return;
    setIsSaving(true);
    try {
      const res = await deleteSponsorNameOverride(editingDonor.donor_key);
      if (res?.success) {
        setBanner({ type: "success", message: "Leaderboard name reset to original!" });
        setEditingDonor(null);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to reset name" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to reset leaderboard name") });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTransactionAnonymous = async (item) => {
    const nextIsAnon = !item.is_anonymous;
    setIsSaving(true);
    try {
      const res = await updateSponsorTransactionOverride({
        payment_id: item.id,
        is_anonymous: nextIsAnon,
      });
      if (res?.success) {
        setBanner({
          type: "success",
          message: `Transaction ${item.id} updated.`,
        });
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to update status" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to toggle anonymous status") });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) return;

    setIsAddingDept(true);
    try {
      const res = await createSponsorDepartment({
        name: newDeptName.trim(),
        code: newDeptCode.trim().toUpperCase(),
        email_code: newDeptEmailCode.trim().toLowerCase(),
        year: newDeptYear || "1st Year",
        year_code: newDeptYearCode.trim().toLowerCase(),
      });

      if (res?.success) {
        setBanner({ type: "success", message: res.message || "Department created successfully!" });
        setNewDeptName("");
        setNewDeptCode("");
        setNewDeptEmailCode("");
        setNewDeptYear("1st Year");
        setNewDeptYearCode("");
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to create department" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to create department") });
    } finally {
      setIsAddingDept(false);
    }
  };

  const handleUpdateDepartment = async (e) => {
    e.preventDefault();
    if (!editingDept || !editingDept.name.trim() || !editingDept.code.trim()) return;

    setIsSavingDept(true);
    try {
      const res = await updateSponsorDepartment(editingDept.id, {
        name: editingDept.name.trim(),
        code: editingDept.code.trim().toUpperCase(),
        email_code: (editingDept.email_code || "").trim().toLowerCase(),
        year: editingDept.year || "1st Year",
        year_code: (editingDept.year_code || "").trim().toLowerCase(),
      });

      if (res?.success) {
        setBanner({ type: "success", message: "Department updated successfully!" });
        setEditingDept(null);
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to update department" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to update department") });
    } finally {
      setIsSavingDept(false);
    }
  };

  const handleDeleteDept = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      const res = await deleteSponsorDepartment(id);
      if (res?.success) {
        setBanner({ type: "success", message: "Department deleted successfully!" });
        await fetchSponsorsData();
      } else {
        setBanner({ type: "error", message: res?.error || "Failed to delete department" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete department") });
    }
  };

  return (
    <section className="space-y-6">
      {/* Top Banner Summary */}
      <div className="flex flex-col gap-4 rounded-2xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-current" />
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              Sponsors & Contributions
            </h2>
          </div>
          <p className="mt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Review donor phone numbers/emails, map users to departments, and manage public leaderboard rankings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-xl border border-zinc-900 bg-emerald-50 px-3.5 py-1.5 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-emerald-950 dark:shadow-[1.5px_1.5px_0px_#ffffff]">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 mr-2">
              Total Raised:
            </span>
            <span className="text-sm font-black text-emerald-800 dark:text-emerald-200">
              ₹{Number(data.total_amount_raised || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchSponsorsData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {banner.message && (
        <AdminBanner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
      )}

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2 overflow-x-auto">
        {[
          { key: "leaderboard", label: `🏆 Individual Donors (${leaderboard.length})` },
          { key: "departments", label: `🏢 Departments & Batch (${departments.length})` },
          { key: "transactions", label: `💳 Razorpay Logs (${data.orders?.length || 0})` },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveSubTab(tab.key)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeSubTab === tab.key
                ? "border-zinc-900 bg-blue-600 text-white shadow-[2px_2px_0px_#18181b] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]"
                : "border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Leaderboard */}
      {activeSubTab === "leaderboard" && (
        <div className="rounded-2xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50">Top Donors Leaderboard</h3>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              Review donor email/phone, override display names, and map users to created departments.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader className="h-7 w-7 animate-spin text-blue-600" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="p-8 text-center text-xs font-bold text-zinc-400">No donors recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
                <thead className="bg-zinc-100 dark:bg-zinc-800 text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-300">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Rank</th>
                    <th className="px-4 py-2.5 text-left">Display Name</th>
                    <th className="px-4 py-2.5 text-left">Department</th>
                    <th className="px-4 py-2.5 text-left">Phone & Email</th>
                    <th className="px-4 py-2.5 text-left">Contributed</th>
                    <th className="px-4 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-[#111827]">
                  {leaderboard.map((donor, idx) => (
                    <tr key={donor.donor_key || idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                      <td className="px-4 py-3 font-mono text-xs font-bold text-zinc-500">#{idx + 1}</td>
                      <td className="px-4 py-3">
                        <span className="font-black text-zinc-900 dark:text-zinc-50">{donor.display_name}</span>
                        {donor.is_overridden && (
                          <span className="block text-[10px] text-zinc-400">Orig: {donor.original_name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {donor.department_display ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-zinc-900 bg-purple-50 px-2 py-0.5 text-[10px] font-black uppercase text-purple-700 dark:border-white dark:bg-purple-950 dark:text-purple-300">
                            <GraduationCap className="h-3 w-3" />
                            {donor.department_display}
                          </span>
                        ) : (
                          <span className="rounded-md border border-zinc-300 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
                            Unmapped
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{donor.phone || "No phone"}</p>
                        <p className="text-[11px] text-zinc-500">{donor.email || "No email"}</p>
                      </td>
                      <td className="px-4 py-3 font-black text-emerald-600 dark:text-emerald-400">
                        ₹{donor.amount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(donor)}
                          className="rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-[1px_1px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3 inline mr-1" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Departments */}
      {activeSubTab === "departments" && (
        <div className="space-y-5">
          {/* Add department card */}
          <div className="rounded-2xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200 pb-3 mb-4 dark:border-zinc-800">
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50">Create New Department</h3>
              <button
                type="button"
                onClick={() => setIsBulkModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] dark:border-white cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Bulk CSV Upload</span>
              </button>
            </div>

            <form onSubmit={handleAddDepartment} className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Name *</label>
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-1.5 text-xs font-semibold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Code *</label>
                <input
                  type="text"
                  value={newDeptCode}
                  onChange={(e) => setNewDeptCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CSE"
                  className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold uppercase shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Email Code</label>
                <input
                  type="text"
                  value={newDeptEmailCode}
                  onChange={(e) => setNewDeptEmailCode(e.target.value.toLowerCase())}
                  placeholder="e.g. cs"
                  className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold lowercase shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Year / Batch</label>
                <select
                  value={newDeptYear}
                  onChange={(e) => setNewDeptYear(e.target.value)}
                  className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="All Years">All Years</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isAddingDept || !newDeptName.trim() || !newDeptCode.trim()}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white disabled:opacity-50 cursor-pointer"
                >
                  {isAddingDept ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  <span>Add Dept</span>
                </button>
              </div>
            </form>
          </div>

          {/* Department Leaderboard preview */}
          <div className="rounded-2xl border border-zinc-900 bg-white p-5 shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
            <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 mb-3">Department Rankings</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {deptLeaderboard.map((d, idx) => (
                <div key={d.id || idx} className="flex items-center justify-between rounded-xl border border-zinc-900 bg-zinc-50 p-3 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-600">#{idx + 1}</span>
                    <span className="text-xs font-black text-zinc-900 dark:text-zinc-50">{d.display_name || d.name}</span>
                  </div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 text-xs">
                    ₹{Number(d.total_amount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Transactions */}
      {activeSubTab === "transactions" && (
        <div className="rounded-2xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50">Razorpay Orders & Transactions</h3>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Toggle public / anonymous visibility per payment</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={txSearchQuery}
                onChange={(e) => setTxSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-900 bg-white pl-8 pr-3 py-1.5 text-xs font-semibold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
              <thead className="bg-zinc-100 dark:bg-zinc-800 text-[11px] font-black uppercase text-zinc-600 dark:text-zinc-300">
                <tr>
                  <th className="px-4 py-2.5 text-left">Order ID</th>
                  <th className="px-4 py-2.5 text-left">Donor</th>
                  <th className="px-4 py-2.5 text-left">Amount</th>
                  <th className="px-4 py-2.5 text-left">Status</th>
                  <th className="px-4 py-2.5 text-left">Visibility</th>
                  <th className="px-4 py-2.5 text-right">Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-[#111827]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-2.5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{tx.id}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-bold text-zinc-900 dark:text-zinc-50">{tx.name || "Anonymous"}</span>
                      <span className="block text-[10px] text-zinc-400">{tx.email || tx.phone || "-"}</span>
                    </td>
                    <td className="px-4 py-2.5 font-black text-emerald-600 dark:text-emerald-400">₹{tx.amount}</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-md border border-zinc-900 bg-emerald-50 px-1.5 py-0.2 text-[10px] font-black text-emerald-800 uppercase dark:border-white dark:bg-emerald-950 dark:text-emerald-200">
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs font-bold">
                      {tx.is_anonymous ? "Anonymous" : "Public"}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleTransactionAnonymous(tx)}
                        className="rounded-lg border border-zinc-900 bg-white px-2 py-1 text-xs font-bold text-zinc-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                      >
                        {tx.is_anonymous ? <Eye className="h-3 w-3 inline mr-1" /> : <EyeOff className="h-3 w-3 inline mr-1" />}
                        {tx.is_anonymous ? "Make Public" : "Make Anon"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Donor Modal */}
      {editingDonor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onClick={() => setEditingDonor(null)}>
          <div
            className="w-full max-w-md rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-50">Edit Donor Display Name</h3>
              <button
                type="button"
                onClick={() => setEditingDonor(null)}
                className="rounded-lg border border-zinc-900 p-1 text-zinc-600 hover:bg-zinc-100 dark:border-white dark:text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomName} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Display Name</label>
                <input
                  type="text"
                  value={customNameInput}
                  onChange={(e) => setCustomNameInput(e.target.value)}
                  className="w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2 text-xs font-semibold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 mb-1">Assigned Department</label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-900 bg-white px-3 py-2 text-xs font-bold shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-50"
                >
                  <option value="">-- No Department (Unmapped) --</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.year} ({d.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                {editingDonor.is_overridden ? (
                  <button
                    type="button"
                    onClick={handleResetToOriginal}
                    className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                  >
                    Reset Name
                  </button>
                ) : <div />}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingDonor(null)}
                    className="rounded-lg border border-zinc-900 bg-white px-3 py-1.5 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#18181b] dark:border-white disabled:opacity-50"
                  >
                    {isSaving && <Loader className="h-3 w-3 animate-spin" />}
                    <span>Save</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

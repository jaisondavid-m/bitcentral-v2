import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Building2,
  Award,
  CalendarDays,
  Layers,
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader,
  X,
  CheckCircle,
  AlertTriangle,
  Filter,
  HelpCircle,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  FileCheck,
  Calendar,
  Eye,
  UploadCloud,
  ExternalLink,
} from "lucide-react";

import {
  fetchAcademicOptions,
  listDepartments,
  createDepartment,
  updateDepartment,
  setDepartmentCurrentSemester,
  deleteDepartment,
  listRegulations,
  createRegulation,
  updateRegulation,
  deleteRegulation,
  listBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  listSemesters,
  createSemester,
  updateSemester,
  deleteSemester,
  listCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  bulkUploadCourses,
  listMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  listExams,
  createExam,
  updateExam,
  deleteExam,
  addExamSchedule,
  deleteExamSchedule,
  listQuestionPapers,
  createQuestionPaper,
  deleteQuestionPaper,
  fetchCourseContent,
  uploadFile,
} from "@/api/academic.js";

function Banner({ banner, onDismiss }) {
  if (!banner?.message) return null;
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition ${
        banner.type === "error"
          ? "border-red-300 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300"
          : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300"
      }`}
    >
      {banner.type === "error" ? (
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span className="flex-1">{banner.message}</span>
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="ml-2 opacity-60 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function ConfirmModal({ open, title, description, confirmLabel = "Delete", cancelLabel = "Cancel", tone = "danger", busy = false, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          </div>
          <button type="button" onClick={onCancel} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {busy && <Loader className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-900">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function downloadCSVTemplate() {
  const headers = "department_code,regulation_year,semester_number,course_code,course_name,short_name,is_elective,description\n";
  const rows = [
    "CSE,2025,1,CS25C01,Programming in C,C Prog,0,Introductory C Programming",
    "ECE,2025,2,EC25C02,Circuit Theory,Circuits,0,Basic circuit analysis",
    "MECH,2025,3,ME25C03,Engineering Mechanics,Eng Mechanics,0,Statics and dynamics",
  ].join("\n");

  const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "course_mapping_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function BulkUploadModal({ open, onClose, onSuccess, onError }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  if (!open) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      onError("Please choose a CSV file to upload");
      return;
    }
    setUploading(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      const res = await bulkUploadCourses(fd);
      if (res.success) {
        setResult(res.data);
        onSuccess(res.message || "Bulk upload completed successfully");
      }
    } catch (err) {
      onError(err.response?.data?.message || err.message || "Bulk upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal open={open} title="Bulk Upload Courses via CSV" onClose={onClose}>
      <div className="space-y-5">
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/40 dark:bg-blue-950/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Step 1: Download CSV Template</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Use the template with columns: <code className="font-mono font-bold">department_code, regulation_year, semester_number, course_code, course_name</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={downloadCSVTemplate}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-400"
            >
              <Download className="h-4 w-4" /> Download Template
            </button>
          </div>
        </div>

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Step 2: Select CSV File</label>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="mt-1 w-full text-sm text-slate-500 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-900 dark:file:text-slate-200"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {uploading && <Loader className="h-4 w-4 animate-spin" />}
              <Upload className="h-4 w-4" /> Upload Courses
            </button>
          </div>
        </form>

        {result && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
              <span>Total Rows Processed: {result.total_rows}</span>
              <div className="flex gap-3">
                <span className="text-emerald-600">✓ {result.success_count} Succeeded</span>
                {result.failed_count > 0 && <span className="text-red-600">✗ {result.failed_count} Failed</span>}
              </div>
            </div>

            {result.errors?.length > 0 && (
              <div className="mt-3 max-h-36 overflow-y-auto rounded-lg border border-red-200 bg-red-50/50 p-3 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                <div className="font-bold">Errors Detail:</div>
                <ul className="mt-1 list-disc list-inside space-y-0.5">
                  {result.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

// Student View Course Content Modal
function CourseContentViewModal({ open, course, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && course?.id) {
      setLoading(true);
      fetchCourseContent(course.id)
        .then((res) => {
          if (res.success) setData(res.data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [open, course?.id]);

  if (!open) return null;

  return (
    <Modal open={open} title={`Student View - ${course?.code || ""} ${course?.name || ""}`} onClose={onClose}>
      {loading ? (
        <div className="flex h-48 items-center justify-center text-slate-400">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{data?.course?.name}</h2>
            <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-950 dark:text-blue-300">{data?.course?.code}</span>
              <span>{data?.course?.department_name}</span>
              <span>•</span>
              <span>{data?.course?.semester_name}</span>
            </div>
          </div>

          {/* Materials Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 pb-2 dark:border-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" /> Materials
            </h3>
            {data?.materials?.length ? (
              <div className="mt-3 space-y-2">
                {data.materials.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">{m.unit}</span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{m.title}</span>
                      </div>
                      {m.description && <p className="mt-1 text-xs text-slate-400">{m.description}</p>}
                    </div>
                    <a
                      href={m.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300"
                    >
                      <FileText className="h-3.5 w-3.5" /> View PDF
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs italic text-slate-400">No published materials uploaded for this course yet.</p>
            )}
          </div>

          {/* Exams & Question Banks Section */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b border-slate-200 pb-2 dark:border-slate-800 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" /> Exams & Question Banks
            </h3>
            {data?.exams?.length || data?.question_banks?.length ? (
              <div className="mt-3 space-y-3">
                {data?.exams?.map((ex) => {
                  const sch = ex.schedules?.[0];
                  const qb = data?.question_banks?.find((q) => q.exam_id === ex.id);
                  return (
                    <div key={ex.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">{ex.exam_type}</span>
                          <h4 className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{ex.name}</h4>
                          {sch && (
                            <p className="mt-1 text-xs text-slate-500">
                              📅 {sch.exam_date} | 🕒 {sch.start_time} - {sch.end_time} | 📍 Venue: {sch.venue}
                            </p>
                          )}
                        </div>

                        {qb ? (
                          <a
                            href={qb.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700"
                          >
                            <Download className="h-3.5 w-3.5" /> Question Bank PDF
                          </a>
                        ) : (
                          <span className="text-xs italic text-slate-400">No Question Bank uploaded</span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Additional unassigned Question Banks */}
                {data?.question_banks?.filter((q) => !q.exam_id)?.map((qb) => (
                  <div key={qb.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div>
                      <span className="text-xs font-semibold text-slate-500">{qb.exam_type || "Question Bank"}</span>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{qb.description || "Question Bank PDF"}</p>
                    </div>
                    <a
                      href={qb.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-700"
                    >
                      <Download className="h-3.5 w-3.5" /> Question Bank PDF
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs italic text-slate-400">No exams or question banks configured for this course yet.</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export default function AcademicManagement({ defaultSubTab = "departments" }) {
  const [activeTab, setActiveTab] = useState(defaultSubTab);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", description: "", onConfirm: null, busy: false });
  const [modalState, setModalState] = useState({ open: false, title: "", type: "", data: null });
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [previewCourse, setPreviewCourse] = useState(null);

  // Lookup options for dropdowns
  const [options, setOptions] = useState({
    departments: [],
    regulations: [],
    semesters: [],
    courses: [],
  });

  // Dependent Filter Selection State
  const [deptFilter, setDeptFilter] = useState("");
  const [regFilter, setRegFilter] = useState("");
  const [semFilter, setSemFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Data lists
  const [departments, setDepartments] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [batches, setBatches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [exams, setExams] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);

  const showBanner = (type, message) => {
    setBanner({ type, message });
    setTimeout(() => setBanner({ type: "", message: "" }), 5000);
  };

  // Load lookup options
  const loadLookupOptions = useCallback(async (deptId = "", regId = "", semId = "") => {
    try {
      const res = await fetchAcademicOptions({
        department_id: deptId,
        regulation_id: regId,
        semester_id: semId,
      });
      if (res.success) {
        setOptions({
          departments: res.departments || [],
          regulations: res.regulations || [],
          semesters: res.semesters || [],
          courses: res.courses || [],
        });
      }
    } catch (err) {
      console.error("Failed to load options", err);
    }
  }, []);

  useEffect(() => {
    loadLookupOptions(deptFilter, regFilter, semFilter);
  }, [deptFilter, regFilter, semFilter, loadLookupOptions]);

  // Load main tab data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === "departments") {
        const res = await listDepartments();
        if (res.success) setDepartments(res.data || []);
      } else if (activeTab === "regulations") {
        const res = await listRegulations();
        if (res.success) setRegulations(res.data || []);
      } else if (activeTab === "batches") {
        const res = await listBatches({ department_id: deptFilter, regulation_id: regFilter });
        if (res.success) setBatches(res.data || []);
      } else if (activeTab === "semesters") {
        const res = await listSemesters();
        if (res.success) setSemesters(res.data || []);
      } else if (activeTab === "courses") {
        const res = await listCourses({
          department_id: deptFilter,
          regulation_id: regFilter,
          semester_id: semFilter,
          search: searchQuery,
        });
        if (res.success) setCourses(res.data || []);
      } else if (activeTab === "materials") {
        const res = await listMaterials({
          department_id: deptFilter,
          semester_id: semFilter,
          course_id: courseFilter,
        });
        if (res.success) setMaterials(res.data || []);
      } else if (activeTab === "exams") {
        const res = await listExams({
          department_id: deptFilter,
          semester_id: semFilter,
        });
        if (res.success) setExams(res.data || []);
      } else if (activeTab === "question-papers") {
        const res = await listQuestionPapers({
          department_id: deptFilter,
          semester_id: semFilter,
          course_id: courseFilter,
        });
        if (res.success) setQuestionPapers(res.data || []);
      }
    } catch (err) {
      showBanner("error", err.response?.data?.message || err.message || "Failed to load academic data");
    } finally {
      setLoading(false);
    }
  }, [activeTab, deptFilter, regFilter, semFilter, courseFilter, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tabs = [
    { key: "departments", label: "Departments", icon: Building2 },
    { key: "regulations", label: "Regulations", icon: Award },
    { key: "batches", label: "Batches", icon: CalendarDays },
    { key: "semesters", label: "Semesters", icon: Layers },
    { key: "courses", label: "Course Mapping", icon: BookOpen },
    { key: "materials", label: "Course Materials (PDF)", icon: FileText },
    { key: "exams", label: "Exams & Schedules", icon: Calendar },
    { key: "question-papers", label: "Question Banks (PDF)", icon: FileCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Banner Notice */}
      <Banner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />

      {/* Navigation Sub-Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 dark:border-slate-800 scrollbar-none">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Cascading Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Filter className="h-4 w-4" /> Filters:
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="">All Departments</option>
            {options.departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.code} - {d.name}
              </option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            value={semFilter}
            onChange={(e) => setSemFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="">All Semesters</option>
            {options.semesters.map((s) => (
              <option key={s.id} value={s.id}>
                {s.semester_name} (Year {s.year_number})
              </option>
            ))}
          </select>

          {/* Course Filter (for Materials, Question Papers) */}
          {(activeTab === "materials" || activeTab === "question-papers") && (
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 max-w-xs truncate"
            >
              <option value="">All Mapped Courses</option>
              {options.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          )}

          {/* Search Box */}
          <div className="relative min-w-[180px] flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm font-medium text-slate-800 outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          {/* Bulk Upload CSV (Only for Course Mapping) */}
          {activeTab === "courses" && (
            <button
              type="button"
              onClick={() => setBulkModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Upload className="h-4 w-4 text-blue-600" /> Bulk Upload CSV
            </button>
          )}

          {/* Add New Button */}
          <button
            type="button"
            onClick={() => setModalState({ open: true, title: `Add New ${activeTab.replace("-", " ")}`, type: activeTab, data: null })}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Record
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        {loading ? (
          <div className="flex h-48 items-center justify-center text-slate-400">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {activeTab === "departments" && (
              <DepartmentsTable
                data={departments}
                semesters={options.semesters}
                onSetCurrentSemester={async (item, newSemId) => {
                  try {
                    await setDepartmentCurrentSemester(item.id, newSemId);
                    const targetSem = options.semesters.find((s) => s.id === newSemId);
                    showBanner(
                      "success",
                      targetSem
                        ? `Set ${item.code} active semester to Semester ${targetSem.semester_number}`
                        : `Cleared ${item.code} active semester`
                    );
                    fetchData();
                    loadLookupOptions();
                  } catch (err) {
                    showBanner("error", err.message);
                  }
                }}
                onEdit={(item) => setModalState({ open: true, title: "Edit Department", type: "departments", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Department?",
                    description: `Are you sure you want to delete department "${item.name}"? This cannot be undone.`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteDepartment(item.id);
                        showBanner("success", "Department deleted");
                        fetchData();
                        loadLookupOptions();
                      } catch (err) {
                        showBanner("error", err.message);
                      } finally {
                        setConfirmModal({ open: false });
                      }
                    },
                  })
                }
              />
            )}

            {activeTab === "regulations" && (
              <RegulationsTable
                data={regulations}
                onEdit={(item) => setModalState({ open: true, title: "Edit Regulation", type: "regulations", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Regulation?",
                    description: `Delete regulation "${item.name}"?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteRegulation(item.id);
                        showBanner("success", "Regulation deleted");
                        fetchData();
                        loadLookupOptions();
                      } catch (err) {
                        showBanner("error", err.message);
                      } finally {
                        setConfirmModal({ open: false });
                      }
                    },
                  })
                }
              />
            )}

            {activeTab === "batches" && (
              <BatchesTable
                data={batches}
                onEdit={(item) => setModalState({ open: true, title: "Edit Batch", type: "batches", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Batch?",
                    description: `Delete batch "${item.batch_name}"?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteBatch(item.id);
                        showBanner("success", "Batch deleted");
                        fetchData();
                      } catch (err) {
                        showBanner("error", err.message);
                      } finally {
                        setConfirmModal({ open: false });
                      }
                    },
                  })
                }
              />
            )}

            {activeTab === "semesters" && (
              <SemestersTable
                data={semesters}
                onEdit={(item) => setModalState({ open: true, title: "Edit Semester", type: "semesters", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Semester?",
                    description: `Delete semester "${item.semester_name}"?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteSemester(item.id);
                        showBanner("success", "Semester deleted");
                        fetchData();
                        loadLookupOptions();
                      } catch (err) {
                        showBanner("error", err.message);
                      } finally {
                        setConfirmModal({ open: false });
                      }
                    },
                  })
                }
              />
            )}

            {activeTab === "courses" && (
              <CoursesTable
                data={courses}
                onPreview={(item) => setPreviewCourse(item)}
                onEdit={(item) => setModalState({ open: true, title: "Edit Mapped Course", type: "courses", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Course Mapping?",
                    description: `Delete mapped course "${item.code} - ${item.name}"?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteCourse(item.id);
                        showBanner("success", "Course deleted");
                        fetchData();
                        loadLookupOptions();
                      } catch (err) {
                        showBanner("error", err.message);
                      } finally {
                        setConfirmModal({ open: false });
                      }
                    },
                  })
                }
              />
            )}

            {activeTab === "materials" && (
              <MaterialsTable
                data={materials}
                onEdit={(item) => setModalState({ open: true, title: "Edit Course Material", type: "materials", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Course Material?",
                    description: `Delete material "${item.title}"?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteMaterial(item.id);
                        showBanner("success", "Material deleted");
                        fetchData();
                      } catch (err) {
                        showBanner("error", err.message);
                      } finally {
                        setConfirmModal({ open: false });
                      }
                    },
                  })
                }
              />
            )}

            {activeTab === "exams" && (
              <ExamsTable
                data={exams}
                onAddSchedule={(exam) => setModalState({ open: true, title: `Add Course to ${exam.name}`, type: "add-exam-schedule", data: { exam_id: exam.id, department_id: exam.department_id, semester_id: exam.semester_id } })}
                onEdit={(item) => setModalState({ open: true, title: "Edit Exam", type: "exams", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Exam?",
                    description: `Delete exam "${item.name}" and all schedules?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteExam(item.id);
                        showBanner("success", "Exam deleted");
                        fetchData();
                      } catch (err) {
                        showBanner("error", err.message);
                      } finally {
                        setConfirmModal({ open: false });
                      }
                    },
                  })
                }
                onDeleteSchedule={async (schId) => {
                  try {
                    await deleteExamSchedule(schId);
                    showBanner("success", "Course schedule removed from exam");
                    fetchData();
                  } catch (err) {
                    showBanner("error", err.message);
                  }
                }}
              />
            )}

            {activeTab === "question-papers" && (
              <QuestionPapersTable
                data={questionPapers}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Question Bank?",
                    description: `Delete Question Bank for "${item.course_code} - ${item.course_name}"?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteQuestionPaper(item.id);
                        showBanner("success", "Question Bank deleted");
                        fetchData();
                      } catch (err) {
                        showBanner("error", err.message);
                      } finally {
                        setConfirmModal({ open: false });
                      }
                    },
                  })
                }
              />
            )}
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmModal {...confirmModal} onCancel={() => setConfirmModal({ open: false })} />

      {/* Dynamic Entity Form Modal */}
      <Modal open={modalState.open} title={modalState.title} onClose={() => setModalState({ open: false })}>
        <AcademicForm
          type={modalState.type}
          initial={modalState.data}
          options={options}
          onSuccess={() => {
            setModalState({ open: false });
            showBanner("success", "Saved successfully");
            fetchData();
            loadLookupOptions();
          }}
          onError={(msg) => showBanner("error", msg)}
        />
      </Modal>

      {/* Bulk Upload CSV Modal */}
      <BulkUploadModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onSuccess={(msg) => {
          showBanner("success", msg);
          fetchData();
          loadLookupOptions();
        }}
        onError={(msg) => showBanner("error", msg)}
      />

      {/* Student View Course Content Modal */}
      <CourseContentViewModal open={Boolean(previewCourse)} course={previewCourse} onClose={() => setPreviewCourse(null)} />
    </div>
  );
}

// -----------------------------------------------------------------------------
// TABLES
// -----------------------------------------------------------------------------

function StatusBadge({ status }) {
  const isOk = status === "active" || status === "published" || status === "scheduled";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isOk
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isOk ? "bg-emerald-500" : "bg-slate-400"}`} />
      {status}
    </span>
  );
}

function DepartmentsTable({ data, semesters, onEdit, onDelete, onSetCurrentSemester }) {
  if (!data?.length) return <EmptyState label="departments" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Department Name</th>
            <th className="px-4 py-3">Current Active Semester</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">{item.code}</td>
              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{item.name}</td>
              <td className="px-4 py-3">
                <select
                  value={item.current_semester_id || ""}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : null;
                    onSetCurrentSemester(item, val);
                  }}
                  className="rounded-xl border border-blue-200 bg-blue-50/50 px-3 py-1.5 text-xs font-semibold text-blue-700 outline-none ring-blue-500 focus:ring dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300"
                >
                  <option value="">Select Active Semester</option>
                  {semesters?.map((s) => (
                    <option key={s.id} value={s.id}>
                      Semester {s.semester_number} ({s.semester_name})
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-slate-500 max-w-xs truncate">{item.description || "-"}</td>
              <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => onDelete(item)} className="p-1.5 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RegulationsTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="regulations" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Regulation Name</th>
            <th className="px-4 py-3">Year</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{item.name}</td>
              <td className="px-4 py-3 font-mono">{item.year}</td>
              <td className="px-4 py-3 text-slate-500">{item.description || "-"}</td>
              <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => onDelete(item)} className="p-1.5 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BatchesTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="batches" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Batch Name</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Regulation</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">{item.batch_name}</td>
              <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{item.department_name}</td>
              <td className="px-4 py-3 text-slate-500">{item.regulation_name}</td>
              <td className="px-4 py-3 text-slate-500">{item.start_year} - {item.end_year}</td>
              <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => onDelete(item)} className="p-1.5 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SemestersTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="semesters" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Sem #</th>
            <th className="px-4 py-3">Semester Name</th>
            <th className="px-4 py-3">Year Number</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">Semester {item.semester_number}</td>
              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{item.semester_name}</td>
              <td className="px-4 py-3">Year {item.year_number}</td>
              <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => onDelete(item)} className="p-1.5 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CoursesTable({ data, onPreview, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="department-wise courses mapped" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Semester & Regulation</th>
            <th className="px-4 py-3">Course Code & Name</th>
            <th className="px-4 py-3">Elective</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{item.department_name || "-"}</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                <div>{item.semester_name || "-"}</div>
                <div className="text-xs text-slate-400">{item.regulation_name || "-"}</div>
              </td>
              <td className="px-4 py-3">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.code}</span> - {item.name}
              </td>
              <td className="px-4 py-3">
                {item.is_elective ? (
                  <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">Elective</span>
                ) : (
                  <span className="text-xs text-slate-400">Core</span>
                )}
              </td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onPreview(item)} className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300">
                  <Eye className="h-3.5 w-3.5" /> Student View
                </button>
                <button onClick={() => onEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => onDelete(item)} className="p-1.5 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MaterialsTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="course materials (PDF only)" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Unit</th>
            <th className="px-4 py-3">Material Title</th>
            <th className="px-4 py-3">PDF File</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3">
                <span className="font-mono font-bold text-blue-600">{item.course_code}</span>
                <div className="text-xs text-slate-500">{item.course_name}</div>
              </td>
              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{item.unit}</td>
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{item.title}</td>
              <td className="px-4 py-3">
                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  <FileText className="h-3.5 w-3.5" /> View PDF
                </a>
              </td>
              <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
              <td className="px-4 py-3 text-right space-x-2">
                <button onClick={() => onEdit(item)} className="p-1.5 text-slate-500 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => onDelete(item)} className="p-1.5 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExamsTable({ data, onAddSchedule, onEdit, onDelete, onDeleteSchedule }) {
  if (!data?.length) return <EmptyState label="exams and schedules" />;
  return (
    <div className="space-y-4">
      {data.map((exam) => (
        <div key={exam.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">{exam.exam_type}</span>
                <span className="text-xs font-semibold text-slate-400">{exam.academic_year}</span>
              </div>
              <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">{exam.name}</h3>
              <p className="text-xs text-slate-500">{exam.department_name} • {exam.semester_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddSchedule(exam)}
                className="inline-flex items-center gap-1 rounded-xl bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300"
              >
                <Plus className="h-3.5 w-3.5" /> Add Course Schedule
              </button>
              <button onClick={() => onEdit(exam)} className="p-1.5 text-slate-500 hover:text-blue-600"><Edit2 className="h-4 w-4" /></button>
              <button onClick={() => onDelete(exam)} className="p-1.5 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Exam Schedules for Courses */}
          <div className="mt-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Scheduled Courses:</h4>
            {exam.schedules?.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {exam.schedules.map((sch) => (
                  <div key={sch.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs dark:border-slate-800 dark:bg-slate-900">
                    <div>
                      <span className="font-mono font-bold text-blue-600">{sch.course_code}</span> - <span className="font-semibold text-slate-800 dark:text-slate-200">{sch.course_name}</span>
                      <div className="mt-1 text-slate-500">
                        📅 {sch.exam_date} | 🕒 {sch.start_time} - {sch.end_time} | 📍 {sch.venue}
                      </div>
                    </div>
                    <button onClick={() => onDeleteSchedule(sch.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-slate-400">No courses scheduled for this exam yet. Click "Add Course Schedule" above.</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestionPapersTable({ data, onDelete }) {
  if (!data?.length) return <EmptyState label="question banks (PDF only)" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Exam / Type</th>
            <th className="px-4 py-3">Department & Semester</th>
            <th className="px-4 py-3">Question Bank PDF</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3">
                <span className="font-mono font-bold text-blue-600">{item.course_code}</span>
                <div className="text-xs text-slate-500">{item.course_name}</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-semibold text-slate-800 dark:text-slate-200">{item.exam_name || item.exam_type || "Question Bank"}</div>
                <div className="text-xs text-slate-400">{item.academic_year}</div>
              </td>
              <td className="px-4 py-3 text-slate-500">{item.department_name} • {item.semester_name}</td>
              <td className="px-4 py-3">
                <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300">
                  <Download className="h-3.5 w-3.5" /> Download PDF
                </a>
              </td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onDelete(item)} className="p-1.5 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
      <HelpCircle className="h-12 w-12 stroke-1" />
      <p className="mt-3 text-base font-semibold text-slate-600 dark:text-slate-300">No {label} found</p>
      <p className="mt-1 text-xs text-slate-400">Try adjusting your filters or click "Add Record" to create one.</p>
    </div>
  );
}

function SearchableCourseSelect({ courses, value, onChange, placeholder = "Search and select course..." }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedCourse = useMemo(() => courses.find((c) => Number(c.id) === Number(value)), [courses, value]);

  const filteredCourses = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return courses;
    return courses.filter(
      (c) => (c.code || "").toLowerCase().includes(q) || (c.name || "").toLowerCase().includes(q)
    );
  }, [courses, search]);

  return (
    <div className="relative mt-1">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={selectedCourse ? `${selectedCourse.code} - ${selectedCourse.name}` : placeholder}
          value={search}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 py-2 text-sm font-medium text-slate-800 outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
        />
        {value || search ? (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setSearch("");
              setIsOpen(true);
            }}
            className="absolute right-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      {selectedCourse && !search && (
        <div className="mt-1 flex items-center justify-between rounded-lg bg-blue-50/80 px-3 py-1.5 text-xs text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
          <span className="truncate">
            Selected: <strong className="font-mono font-bold">{selectedCourse.code}</strong> - {selectedCourse.name}
          </span>
          <button type="button" onClick={() => setIsOpen(true)} className="ml-2 font-semibold hover:underline">
            Change
          </button>
        </div>
      )}

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-950">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((c) => {
                const isSelected = Number(c.id) === Number(value);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onChange(c.id);
                      setSearch("");
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                      isSelected
                        ? "bg-blue-600 text-white font-semibold"
                        : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                    }`}
                  >
                    <div className="truncate">
                      <span className={`font-mono font-bold mr-2 ${isSelected ? "text-blue-100" : "text-blue-600 dark:text-blue-400"}`}>
                        {c.code}
                      </span>
                      <span>{c.name}</span>
                    </div>
                    {isSelected && <CheckCircle className="h-3.5 w-3.5 shrink-0 ml-2 text-white" />}
                  </button>
                );
              })
            ) : (
              <div className="p-3 text-center text-xs text-slate-400">No courses match your search "{search}"</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// DYNAMIC ACADEMIC FORM MODAL
// -----------------------------------------------------------------------------

function AcademicForm({ type, initial, options, onSuccess, onError }) {
  const [formData, setFormData] = useState(initial || {});
  const [submitting, setSubmitting] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const set = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      onError("Only PDF files (.pdf) are allowed.");
      e.target.value = "";
      return;
    }

    setUploadingPdf(true);
    try {
      const res = await uploadFile(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, file_url: res.url }));
      }
    } catch (err) {
      onError("Failed to upload PDF file");
    } finally {
      setUploadingPdf(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (type === "departments") {
        const payload = {
          ...formData,
          current_semester_id: formData.current_semester_id ? Number(formData.current_semester_id) : null,
        };
        if (initial?.id) await updateDepartment(initial.id, payload);
        else await createDepartment(payload);
      } else if (type === "regulations") {
        const payload = { ...formData, year: Number(formData.year) };
        if (initial?.id) await updateRegulation(initial.id, payload);
        else await createRegulation(payload);
      } else if (type === "batches") {
        const payload = {
          ...formData,
          department_id: Number(formData.department_id),
          regulation_id: Number(formData.regulation_id),
          start_year: Number(formData.start_year),
          end_year: Number(formData.end_year),
        };
        if (initial?.id) await updateBatch(initial.id, payload);
        else await createBatch(payload);
      } else if (type === "semesters") {
        const payload = {
          ...formData,
          semester_number: Number(formData.semester_number),
          year_number: Number(formData.year_number),
        };
        if (initial?.id) await updateSemester(initial.id, payload);
        else await createSemester(payload);
      } else if (type === "courses") {
        const payload = {
          ...formData,
          department_id: Number(formData.department_id),
          regulation_id: Number(formData.regulation_id),
          semester_id: Number(formData.semester_id),
          is_elective: Boolean(formData.is_elective),
        };
        if (initial?.id) await updateCourse(initial.id, payload);
        else await createCourse(payload);
      } else if (type === "materials") {
        const payload = {
          ...formData,
          course_id: Number(formData.course_id),
          item_order: Number(formData.item_order || 0),
        };
        if (initial?.id) await updateMaterial(initial.id, payload);
        else await createMaterial(payload);
      } else if (type === "exams") {
        const payload = {
          ...formData,
          department_id: formData.department_id ? Number(formData.department_id) : 0,
          department_ids: (formData.department_ids || []).map(Number),
          semester_id: Number(formData.semester_id),
        };
        if (initial?.id) await updateExam(initial.id, payload);
        else await createExam(payload);
      } else if (type === "add-exam-schedule") {
        const payload = {
          ...formData,
          exam_id: Number(formData.exam_id),
          course_id: Number(formData.course_id),
        };
        await addExamSchedule(payload);
      } else if (type === "question-papers") {
        const payload = {
          ...formData,
          course_id: Number(formData.course_id),
          exam_id: formData.exam_id ? Number(formData.exam_id) : null,
        };
        await createQuestionPaper(payload);
      }
      onSuccess();
    } catch (err) {
      onError(err.response?.data?.message || err.message || "Failed to save record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === "departments" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Department Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Computer Science and Engineering"
              value={formData.name || ""}
              onChange={set("name")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Short Code</label>
            <input
              type="text"
              required
              placeholder="e.g. CSE"
              value={formData.code || ""}
              onChange={set("code")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Current Active Semester</label>
            <select
              value={formData.current_semester_id || ""}
              onChange={(e) => setFormData((p) => ({ ...p, current_semester_id: e.target.value ? Number(e.target.value) : null }))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select Active Semester</option>
              {options?.semesters?.map((s) => (
                <option key={s.id} value={s.id}>
                  Semester {s.semester_number} ({s.semester_name})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              value={formData.description || ""}
              onChange={set("description")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </>
      )}

      {type === "regulations" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Regulation Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Regulation 2025"
              value={formData.name || ""}
              onChange={set("name")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Regulation Year</label>
            <input
              type="number"
              required
              placeholder="e.g. 2025"
              value={formData.year || ""}
              onChange={set("year")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </>
      )}

      {type === "batches" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Department</label>
            <select
              required
              value={formData.department_id || ""}
              onChange={set("department_id")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select Department</option>
              {options.departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Regulation</label>
            <select
              required
              value={formData.regulation_id || ""}
              onChange={set("regulation_id")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select Regulation</option>
              {options.regulations.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Start Year</label>
              <input
                type="number"
                required
                placeholder="2025"
                value={formData.start_year || ""}
                onChange={set("start_year")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">End Year</label>
              <input
                type="number"
                required
                placeholder="2029"
                value={formData.end_year || ""}
                onChange={set("end_year")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </>
      )}

      {type === "semesters" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Semester Number (1-8)</label>
            <input
              type="number"
              min="1"
              max="10"
              required
              value={formData.semester_number || ""}
              onChange={set("semester_number")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Semester Name</label>
            <input
              type="text"
              placeholder="e.g. Semester 1"
              value={formData.semester_name || ""}
              onChange={set("semester_name")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </>
      )}

      {type === "courses" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Department</label>
            <select
              required
              value={formData.department_id || ""}
              onChange={set("department_id")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select Department</option>
              {options.departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Regulation</label>
              <select
                required
                value={formData.regulation_id || ""}
                onChange={set("regulation_id")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Select Regulation</option>
                {options.regulations.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Semester</label>
              <select
                required
                value={formData.semester_id || ""}
                onChange={set("semester_id")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Select Semester</option>
                {options.semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.semester_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Course Code</label>
              <input
                type="text"
                required
                placeholder="e.g. CS25C01"
                value={formData.code || ""}
                onChange={set("code")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Course Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Data Structures & Algorithms"
                value={formData.name || ""}
                onChange={set("name")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input type="checkbox" id="is_elective" checked={formData.is_elective || false} onChange={set("is_elective")} className="h-4 w-4 rounded text-blue-600" />
            <label htmlFor="is_elective" className="text-sm text-slate-700 dark:text-slate-300 font-medium">Mark as Elective Course</label>
          </div>
        </>
      )}

      {type === "materials" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Target Course</label>
            <SearchableCourseSelect
              courses={options.courses}
              value={formData.course_id}
              onChange={(val) => setFormData((p) => ({ ...p, course_id: val }))}
              placeholder="Search by code or title (e.g. 22CH103, Chemistry)..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Material Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Unit 1 Notes"
                value={formData.title || ""}
                onChange={set("title")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Unit (e.g. Unit 1, Unit 2)</label>
              <input
                type="text"
                placeholder="e.g. Unit 1"
                value={formData.unit || ""}
                onChange={set("unit")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Upload PDF File (PDF Only)</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePDFUpload}
              className="mt-1 w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploadingPdf && <p className="mt-1 text-xs text-blue-600 animate-pulse">Uploading PDF...</p>}
            {formData.file_url && (
              <p className="mt-1 text-xs font-mono text-emerald-600 truncate">
                Attached PDF: {formData.file_url}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Publish Status</label>
            <select
              value={formData.status || "published"}
              onChange={set("status")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
          </div>
        </>
      )}

      {type === "exams" && (
        <>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Target Department(s)</label>
              {!initial?.id && options.departments?.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIds = formData.department_ids || [];
                    const allIds = options.departments.map((d) => d.id);
                    if (currentIds.length === allIds.length) {
                      setFormData((p) => ({ ...p, department_ids: [] }));
                    } else {
                      setFormData((p) => ({ ...p, department_ids: allIds }));
                    }
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  {(formData.department_ids || []).length === options.departments.length ? "Deselect All" : "Select All Departments"}
                </button>
              )}
            </div>

            {!initial?.id ? (
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200 p-3 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                {options.departments.map((d) => {
                  const isChecked = (formData.department_ids || []).includes(d.id);
                  return (
                    <label key={d.id} className="flex items-center gap-2 text-xs font-medium text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => {
                            const ids = new Set(prev.department_ids || []);
                            if (checked) ids.add(d.id);
                            else ids.delete(d.id);
                            return { ...prev, department_ids: Array.from(ids) };
                          });
                        }}
                        className="h-4 w-4 rounded text-blue-600"
                      />
                      <span className="font-semibold">{d.code}</span> - <span className="truncate">{d.name}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <select
                required
                value={formData.department_id || ""}
                onChange={set("department_id")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Select Department</option>
                {options.departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} - {d.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Semester</label>
              <select
                required
                value={formData.semester_id || ""}
                onChange={set("semester_id")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="">Select Semester</option>
                {options.semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.semester_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Exam Type</label>
              <select
                required
                value={formData.exam_type || "PT-1"}
                onChange={set("exam_type")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="PT-1">PT-1</option>
                <option value="PT-2">PT-2</option>
                <option value="Model Exam">Model Exam</option>
                <option value="Semester-End Exam">Semester-End Exam</option>
                <option value="Practical Exam">Practical Exam</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Exam Name</label>
            <input
              type="text"
              required
              placeholder="e.g. PT-1 Midterm Examinations"
              value={formData.name || ""}
              onChange={set("name")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Start Date</label>
              <input
                type="date"
                value={formData.start_date || ""}
                onChange={set("start_date")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">End Date</label>
              <input
                type="date"
                value={formData.end_date || ""}
                onChange={set("end_date")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </>
      )}

      {type === "add-exam-schedule" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Course</label>
            <SearchableCourseSelect
              courses={options.courses}
              value={formData.course_id}
              onChange={(val) => setFormData((p) => ({ ...p, course_id: val }))}
              placeholder="Search by code or title (e.g. 22CS007, Agile)..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Exam Date</label>
            <input
              type="date"
              required
              value={formData.exam_date || ""}
              onChange={set("exam_date")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Start Time</label>
              <input
                type="text"
                required
                placeholder="e.g. 09:30 AM"
                value={formData.start_time || ""}
                onChange={set("start_time")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">End Time</label>
              <input
                type="text"
                required
                placeholder="e.g. 12:30 PM"
                value={formData.end_time || ""}
                onChange={set("end_time")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Venue</label>
            <input
              type="text"
              required
              placeholder="e.g. Main Examination Hall 101"
              value={formData.venue || ""}
              onChange={set("venue")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </>
      )}

      {type === "question-papers" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Course</label>
            <SearchableCourseSelect
              courses={options.courses}
              value={formData.course_id}
              onChange={(val) => setFormData((p) => ({ ...p, course_id: val }))}
              placeholder="Search by code or title (e.g. 22CS007, Agile)..."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Upload Question Bank PDF (PDF Only)</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handlePDFUpload}
              className="mt-1 w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-purple-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-purple-700 hover:file:bg-purple-100"
            />
            {uploadingPdf && <p className="mt-1 text-xs text-purple-600 animate-pulse">Uploading PDF...</p>}
            {formData.file_url && (
              <p className="mt-1 text-xs font-mono text-emerald-600 truncate">
                Attached PDF: {formData.file_url}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Description (Optional)</label>
            <input
              type="text"
              placeholder="e.g. PT-1 Question Bank with Answer Key"
              value={formData.description || ""}
              onChange={set("description")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </>
      )}

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={submitting || uploadingPdf}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting && <Loader className="h-4 w-4 animate-spin" />}
          Save Record
        </button>
      </div>
    </form>
  );
}

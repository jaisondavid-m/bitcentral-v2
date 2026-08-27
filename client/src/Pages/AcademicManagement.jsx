import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Building2,
  Award,
  Calendar,
  Layers,
  BookOpen,
  FolderKanban,
  FileText,
  Clock,
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader,
  X,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  ExternalLink,
  Upload,
  CalendarDays,
  Tag,
  Check,
} from "lucide-react";

import {
  fetchAcademicOptions,
  listDepartments,
  createDepartment,
  updateDepartment,
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
  listCurriculum,
  assignCurriculum,
  updateCurriculum,
  deleteCurriculum,
  listMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  listExams,
  createExam,
  updateExam,
  deleteExam,
  listExamSchedules,
  createExamSchedule,
  updateExamSchedule,
  deleteExamSchedule,
  listQuestionPapers,
  createQuestionPaper,
  updateQuestionPaper,
  deleteQuestionPaper,
} from "../api/academic.js";
import { uploadAdminFile } from "../api/admin.js";

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
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
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

// -----------------------------------------------------------------------------
// MAIN COMPONENT
// -----------------------------------------------------------------------------

export default function AcademicManagement({ defaultSubTab = "departments" }) {
  const [activeTab, setActiveTab] = useState(defaultSubTab);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", description: "", onConfirm: null, busy: false });
  const [modalState, setModalState] = useState({ open: false, title: "", type: "", data: null });

  // Lookup options for dependent dropdowns
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
  const [searchQuery, setSearchQuery] = useState("");

  // Data lists
  const [departments, setDepartments] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [batches, setBatches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [exams, setExams] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);
  const [questionPapers, setQuestionPapers] = useState([]);

  // Selected Exam for Exam Details view
  const [selectedExam, setSelectedExam] = useState(null);

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
        const res = await listCourses({ search: searchQuery });
        if (res.success) setCourses(res.data || []);
      } else if (activeTab === "curriculum") {
        const res = await listCurriculum({
          department_id: deptFilter,
          regulation_id: regFilter,
          semester_id: semFilter,
        });
        if (res.success) setCurriculum(res.data || []);
      } else if (activeTab === "materials") {
        const res = await listMaterials();
        if (res.success) setMaterials(res.data || []);
      } else if (activeTab === "exams") {
        const res = await listExams({
          department_id: deptFilter,
          regulation_id: regFilter,
          semester_id: semFilter,
        });
        if (res.success) {
          setExams(res.data || []);
          if (res.data?.length > 0 && !selectedExam) {
            setSelectedExam(res.data[0]);
          }
        }
      } else if (activeTab === "question-papers") {
        const res = await listQuestionPapers({
          regulation_id: regFilter,
          semester_id: semFilter,
        });
        if (res.success) setQuestionPapers(res.data || []);
      }
    } catch (err) {
      showBanner("error", err.response?.data?.message || err.message || "Failed to load academic data");
    } finally {
      setLoading(false);
    }
  }, [activeTab, deptFilter, regFilter, semFilter, searchQuery, selectedExam]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Load Exam Schedules when selectedExam changes
  const fetchSchedulesForExam = useCallback(async (examId) => {
    if (!examId) return;
    try {
      const res = await listExamSchedules({ exam_id: examId });
      if (res.success) setExamSchedules(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "exams" && selectedExam?.id) {
      fetchSchedulesForExam(selectedExam.id);
    }
  }, [activeTab, selectedExam, fetchSchedulesForExam]);

  const tabs = [
    { key: "departments", label: "Departments", icon: Building2 },
    { key: "regulations", label: "Regulations", icon: Award },
    { key: "batches", label: "Batches", icon: CalendarDays },
    { key: "semesters", label: "Semesters", icon: Layers },
    { key: "courses", label: "Courses", icon: BookOpen },
    { key: "curriculum", label: "Curriculum", icon: FolderKanban },
    { key: "materials", label: "Materials", icon: FileText },
    { key: "exams", label: "Exams & Schedules", icon: Clock },
    { key: "question-papers", label: "Question Papers", icon: HelpCircle },
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
              onClick={() => {
                setActiveTab(t.key);
                setSelectedExam(null);
              }}
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

          {/* Regulation Filter */}
          <select
            value={regFilter}
            onChange={(e) => setRegFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-800 outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="">All Regulations</option>
            {options.regulations.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
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

          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-sm font-medium text-slate-800 outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          {/* Add New Button */}
          <button
            type="button"
            onClick={() => setModalState({ open: true, title: `Add New ${activeTab.slice(0, -1)}`, type: activeTab, data: null })}
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
                onEdit={(item) => setModalState({ open: true, title: "Edit Master Course", type: "courses", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Course?",
                    description: `Delete course "${item.code} - ${item.name}"?`,
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

            {activeTab === "curriculum" && (
              <CurriculumTable
                data={curriculum}
                onEdit={(item) => setModalState({ open: true, title: "Edit Curriculum Assignment", type: "curriculum", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Remove from Curriculum?",
                    description: `Remove course assignment for "${item.course_code}"?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteCurriculum(item.id);
                        showBanner("success", "Course assignment removed");
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

            {activeTab === "materials" && (
              <MaterialsTable
                data={materials}
                onEdit={(item) => setModalState({ open: true, title: "Edit Material", type: "materials", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Material?",
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
              <ExamsView
                exams={exams}
                selectedExam={selectedExam}
                onSelectExam={setSelectedExam}
                schedules={examSchedules}
                onAddExam={() => setModalState({ open: true, title: "Create Exam", type: "exams", data: null })}
                onEditExam={(e) => setModalState({ open: true, title: "Edit Exam", type: "exams", data: e })}
                onDeleteExam={(e) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Exam?",
                    description: `Delete exam "${e.name}" and all its schedule entries?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteExam(e.id);
                        showBanner("success", "Exam deleted");
                        setSelectedExam(null);
                        fetchData();
                      } catch (err) {
                        showBanner("error", err.message);
                      } finally {
                        setConfirmModal({ open: false });
                      }
                    },
                  })
                }
                onAddSchedule={() => setModalState({ open: true, title: "Add Exam Schedule", type: "exam-schedules", data: { exam_id: selectedExam?.id } })}
                onEditSchedule={(s) => setModalState({ open: true, title: "Edit Exam Schedule", type: "exam-schedules", data: s })}
                onDeleteSchedule={(s) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Schedule?",
                    description: `Delete schedule entry for course "${s.course_code}"?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteExamSchedule(s.id);
                        showBanner("success", "Schedule deleted");
                        fetchSchedulesForExam(selectedExam.id);
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

            {activeTab === "question-papers" && (
              <QuestionPapersTable
                data={questionPapers}
                onEdit={(item) => setModalState({ open: true, title: "Edit Question Paper", type: "question-papers", data: item })}
                onDelete={(item) =>
                  setConfirmModal({
                    open: true,
                    title: "Delete Question Paper?",
                    description: `Delete question paper for "${item.course_code}"?`,
                    onConfirm: async () => {
                      try {
                        setConfirmModal((p) => ({ ...p, busy: true }));
                        await deleteQuestionPaper(item.id);
                        showBanner("success", "Question paper deleted");
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
            if (activeTab === "exams" && selectedExam?.id) {
              fetchSchedulesForExam(selectedExam.id);
            }
          }}
          onError={(msg) => showBanner("error", msg)}
        />
      </Modal>
    </div>
  );
}

// -----------------------------------------------------------------------------
// TABLES & VIEWS
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

function DepartmentsTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="departments" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Department Name</th>
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

function CoursesTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="master courses" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Code</th>
            <th className="px-4 py-3">Course Name</th>
            <th className="px-4 py-3">Credits</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{item.code}</td>
              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{item.name}</td>
              <td className="px-4 py-3 font-mono">{item.credits} Credits</td>
              <td className="px-4 py-3"><span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium dark:bg-slate-900">{item.course_type}</span></td>
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

function CurriculumTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="curriculum course assignments" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Department / Regulation</th>
            <th className="px-4 py-3">Semester</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Credits</th>
            <th className="px-4 py-3">Elective</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3">
                <div className="font-semibold text-slate-900 dark:text-slate-100">{item.department_name}</div>
                <div className="text-xs text-slate-400">{item.regulation_name}</div>
              </td>
              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{item.semester_name}</td>
              <td className="px-4 py-3">
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{item.course_code}</span> - {item.course_name}
              </td>
              <td className="px-4 py-3 font-mono">{item.course_credits}</td>
              <td className="px-4 py-3">
                {item.is_elective ? (
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">Elective</span>
                ) : (
                  <span className="text-xs text-slate-400">Core</span>
                )}
              </td>
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

function MaterialsTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="materials" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Unit</th>
            <th className="px-4 py-3">Link/File</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">{item.course_code}</td>
              <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">{item.title}</td>
              <td className="px-4 py-3"><span className="rounded-lg bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">{item.material_type}</span></td>
              <td className="px-4 py-3 text-slate-500">{item.unit || "-"}</td>
              <td className="px-4 py-3">
                <a href={item.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                  View File <ExternalLink className="h-3 w-3" />
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

function ExamsView({ exams, selectedExam, onSelectExam, schedules, onAddExam, onEditExam, onDeleteExam, onAddSchedule, onEditSchedule, onDeleteSchedule }) {
  return (
    <div className="space-y-6">
      {/* Exam Header Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Select Exam:</label>
          <select
            value={selectedExam?.id || ""}
            onChange={(e) => {
              const found = exams.find((x) => x.id === Number(e.target.value));
              onSelectExam(found || null);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="">-- Choose Exam --</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.academic_year} - {ex.exam_type})
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onAddExam}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Create Exam
        </button>
      </div>

      {selectedExam ? (
        <div className="space-y-6">
          {/* Selected Exam Meta Card */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedExam.name}</h3>
                <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                  <span>Academic Year: <strong>{selectedExam.academic_year}</strong></span>
                  <span>Department: <strong>{selectedExam.department_name}</strong></span>
                  <span>Semester: <strong>{selectedExam.semester_name}</strong></span>
                  <span>Type: <strong>{selectedExam.exam_type}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEditExam(selectedExam)}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit Exam
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteExam(selectedExam)}
                  className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-slate-900"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* Schedules Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Exam Schedules (Time Table)</h4>
              <button
                type="button"
                onClick={onAddSchedule}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
              >
                <Plus className="h-3.5 w-3.5" /> Add Schedule Entry
              </button>
            </div>

            {schedules?.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-400 dark:border-slate-800">
                No schedule entries added for this exam yet. Click "Add Schedule Entry" above.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                  <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Time Slot</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Venue</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {schedules.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{s.exam_date}</td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{s.start_time} - {s.end_time}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{s.course_code}</span> - {s.course_name}
                        </td>
                        <td className="px-4 py-3"><span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium dark:bg-slate-900">{s.venue}</span></td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button onClick={() => onEditSchedule(s)} className="p-1 text-slate-500 hover:text-blue-600"><Edit2 className="h-3.5 w-3.5" /></button>
                          <button onClick={() => onDeleteSchedule(s)} className="p-1 text-slate-500 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <EmptyState label="exams selected. Please select an exam from the dropdown above or create a new one." />
      )}
    </div>
  );
}

function QuestionPapersTable({ data, onEdit, onDelete }) {
  if (!data?.length) return <EmptyState label="question papers" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
          <tr>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Academic Year</th>
            <th className="px-4 py-3">Exam Type</th>
            <th className="px-4 py-3">Regulation / Sem</th>
            <th className="px-4 py-3">PDF Paper</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
              <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{item.course_code} - {item.course_name}</td>
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{item.academic_year}</td>
              <td className="px-4 py-3">{item.exam_type}</td>
              <td className="px-4 py-3 text-slate-500">{item.regulation_name} • {item.semester_name}</td>
              <td className="px-4 py-3">
                <a href={item.file_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                  Download PDF <ExternalLink className="h-3 w-3" />
                </a>
              </td>
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

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-400">
      <HelpCircle className="h-12 w-12 stroke-1" />
      <p className="mt-3 text-base font-semibold text-slate-600 dark:text-slate-300">No {label} found</p>
      <p className="mt-1 text-xs text-slate-400">Try adjusting your filters or click "Add Record" to create one.</p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// DYNAMIC ACADEMIC FORM MODAL
// -----------------------------------------------------------------------------

function AcademicForm({ type, initial, options, onSuccess, onError }) {
  const [formData, setFormData] = useState(initial || {});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const handleFileUpload = async (e, key) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadAdminFile(fd);
      if (res?.url) {
        setFormData((prev) => ({ ...prev, [key]: res.url }));
      }
    } catch (err) {
      onError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (type === "departments") {
        if (initial?.id) await updateDepartment(initial.id, formData);
        else await createDepartment(formData);
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
        const payload = { ...formData, credits: Number(formData.credits || 3) };
        if (initial?.id) await updateCourse(initial.id, payload);
        else await createCourse(payload);
      } else if (type === "curriculum") {
        const payload = {
          ...formData,
          department_id: Number(formData.department_id),
          regulation_id: Number(formData.regulation_id),
          semester_id: Number(formData.semester_id),
          course_id: Number(formData.course_id),
          is_elective: Boolean(formData.is_elective),
          course_order: Number(formData.course_order || 0),
        };
        if (initial?.id) await updateCurriculum(initial.id, payload);
        else await assignCurriculum(payload);
      } else if (type === "materials") {
        const payload = { ...formData, course_id: Number(formData.course_id) };
        if (initial?.id) await updateMaterial(initial.id, payload);
        else await createMaterial(payload);
      } else if (type === "exams") {
        const payload = {
          ...formData,
          department_id: Number(formData.department_id),
          regulation_id: Number(formData.regulation_id),
          semester_id: Number(formData.semester_id),
        };
        if (initial?.id) await updateExam(initial.id, payload);
        else await createExam(payload);
      } else if (type === "exam-schedules") {
        const payload = {
          ...formData,
          exam_id: Number(formData.exam_id),
          course_id: Number(formData.course_id),
        };
        if (initial?.id) await updateExamSchedule(initial.id, payload);
        else await createExamSchedule(payload);
      } else if (type === "question-papers") {
        const payload = {
          ...formData,
          course_id: Number(formData.course_id),
          regulation_id: Number(formData.regulation_id),
          semester_id: Number(formData.semester_id),
          year_number: Number(formData.year_number || 1),
        };
        if (initial?.id) await updateQuestionPaper(initial.id, payload);
        else await createQuestionPaper(payload);
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Year Number (1-4)</label>
            <input
              type="number"
              min="1"
              max="5"
              required
              value={formData.year_number || ""}
              onChange={set("year_number")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </>
      )}

      {type === "courses" && (
        <>
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
              placeholder="e.g. Programming in C"
              value={formData.name || ""}
              onChange={set("name")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Credits</label>
              <input
                type="number"
                value={formData.credits || 3}
                onChange={set("credits")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Course Type</label>
              <select
                value={formData.course_type || "Theory"}
                onChange={set("course_type")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Theory">Theory</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Project">Project</option>
                <option value="Elective">Elective</option>
                <option value="Practical">Practical</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </>
      )}

      {type === "curriculum" && (
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Course (Master List)</label>
            <select
              required
              value={formData.course_id || ""}
              onChange={set("course_id")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select Course</option>
              {options.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name} ({c.credits} credits)
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input type="checkbox" id="is_elective" checked={formData.is_elective || false} onChange={set("is_elective")} className="h-4 w-4 rounded text-blue-600" />
            <label htmlFor="is_elective" className="text-sm text-slate-700 dark:text-slate-300 font-medium">Mark as Elective Course</label>
          </div>
        </>
      )}

      {type === "materials" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Select Course</label>
            <select
              required
              value={formData.course_id || ""}
              onChange={set("course_id")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select Course</option>
              {options.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Material Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Unit 1 Lecture Notes PDF"
              value={formData.title || ""}
              onChange={set("title")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Material Type</label>
              <select
                value={formData.material_type || "Notes"}
                onChange={set("material_type")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Notes">Notes</option>
                <option value="PDF">PDF</option>
                <option value="Video">Video</option>
                <option value="Link">Link</option>
                <option value="Question Bank">Question Bank</option>
                <option value="Previous Year Paper">Previous Year Paper</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Unit / Module</label>
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">File URL or Upload</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                required
                placeholder="https://... or upload PDF"
                value={formData.file_url || ""}
                onChange={set("file_url")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
              <label className="inline-flex shrink-0 cursor-pointer items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {uploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <input type="file" onChange={(e) => handleFileUpload(e, "file_url")} className="sr-only" />
              </label>
            </div>
          </div>
        </>
      )}

      {type === "exams" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Exam Name</label>
            <input
              type="text"
              required
              placeholder="e.g. End Semester Examination"
              value={formData.name || ""}
              onChange={set("name")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Year</label>
              <input
                type="text"
                required
                placeholder="e.g. 2026-27"
                value={formData.academic_year || "2026-27"}
                onChange={set("academic_year")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Exam Type</label>
              <select
                value={formData.exam_type || "End Semester Examination"}
                onChange={set("exam_type")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="Internal Assessment">Internal Assessment</option>
                <option value="Model Examination">Model Examination</option>
                <option value="End Semester Examination">End Semester Examination</option>
                <option value="Practical Examination">Practical Examination</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
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
        </>
      )}

      {type === "exam-schedules" && (
        <>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Select Course</label>
            <select
              required
              value={formData.course_id || ""}
              onChange={set("course_id")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select Course</option>
              {options.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
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
                placeholder="10:00 AM"
                value={formData.start_time || "10:00 AM"}
                onChange={set("start_time")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">End Time</label>
              <input
                type="text"
                required
                placeholder="01:00 PM"
                value={formData.end_time || "01:00 PM"}
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
              placeholder="e.g. Hall 204"
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Select Course</label>
            <select
              required
              value={formData.course_id || ""}
              onChange={set("course_id")}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="">Select Course</option>
              {options.courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Academic Year</label>
              <input
                type="text"
                required
                placeholder="2025"
                value={formData.academic_year || "2025"}
                onChange={set("academic_year")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Exam Type</label>
              <select
                value={formData.exam_type || "End Semester"}
                onChange={set("exam_type")}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              >
                <option value="End Semester">End Semester</option>
                <option value="Internal Assessment 1">Internal Assessment 1</option>
                <option value="Internal Assessment 2">Internal Assessment 2</option>
                <option value="Model Exam">Model Exam</option>
              </select>
            </div>
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">PDF File URL or Upload</label>
            <div className="mt-1 flex gap-2">
              <input
                type="text"
                required
                placeholder="https://... or upload PDF"
                value={formData.file_url || ""}
                onChange={set("file_url")}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
              <label className="inline-flex shrink-0 cursor-pointer items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                {uploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, "file_url")} className="sr-only" />
              </label>
            </div>
          </div>
        </>
      )}

      <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting && <Loader className="h-4 w-4 animate-spin" />}
          Save Record
        </button>
      </div>
    </form>
  );
}

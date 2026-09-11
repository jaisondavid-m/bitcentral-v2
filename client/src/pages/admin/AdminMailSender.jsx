import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Mail,
  Send,
  Users,
  Search,
  CheckCircle,
  AlertTriangle,
  Loader,
  RefreshCw,
  Plus,
  Trash2,
  X,
  Eye,
  Check,
  Filter,
  UserCheck,
  UserX,
  Server,
  Clock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShieldCheck,
  ExternalLink,
  History,
  Tag,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  ListOrdered,
  Layers,
  CheckCircle2,
} from "lucide-react";
import {
  listAdminUsers,
  getAdminMailConfig,
  testAdminMailConnection,
  sendAdminMail,
  getAdminMailQueues,
  getAdminMailQueueDetails,
  resendFailedAdminMailQueue,
  retryAdminMailQueueItem,
  deleteAdminMailQueue,
  getAdminMailHistory,
  deleteAdminMailLog,
} from "@/api/admin.js";

function normalizeError(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function parseISTDate(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed || trimmed === "-") return null;
    if (/^\d{10,}$/.test(trimmed)) {
      const d = new Date(Number(trimmed));
      if (!Number.isNaN(d.getTime())) return d;
    }
    if (/^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?(\.\d+)?$/.test(trimmed)) {
      const d = new Date(trimmed.replace(" ", "T") + "Z");
      if (!Number.isNaN(d.getTime())) return d;
    }
    const d = new Date(trimmed);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}

function formatISTDateTime(value) {
  const date = parseISTDate(value);
  if (!date) return "-";
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatStudentDisplayName(name, displayName, email) {
  const trimmedName = (name || "").trim();
  if (trimmedName && trimmedName !== "Student" && trimmedName !== "User" && trimmedName !== "-" && !trimmedName.includes("@")) {
    return trimmedName;
  }

  const trimmedDisplay = (displayName || "").trim();
  if (trimmedDisplay && trimmedDisplay !== "Student" && trimmedDisplay !== "User" && trimmedDisplay !== "-" && !trimmedDisplay.includes("@")) {
    return trimmedDisplay;
  }

  if (!email) return "Student";
  const prefix = email.split("@")[0] || "";
  const parts = prefix.split(".");

  if (parts.length >= 2) {
    const rawName = parts[0];
    const deptBatchTag = parts[1].toUpperCase();

    let formattedName = rawName;
    const match = rawName.match(/^([a-zA-Z]{3,})([a-zA-Z])$/);
    if (match) {
      formattedName = `${match[1]} ${match[2]}`.toUpperCase();
    } else {
      formattedName = rawName.toUpperCase();
    }

    return `${formattedName} (${deptBatchTag})`;
  }

  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

const TEMPLATES = [
  {
    id: "custom",
    name: "Custom Blank Message",
    subject: "",
    body: "Hello {{first_name}},\n\n\n\nBest regards,\nBIT Central Team",
  },
  {
    id: "announcement",
    name: "📢 Platform Announcement",
    subject: "📢 Important Update: New Features on BIT Central",
    body: `Hello {{first_name}},

We are pleased to introduce several performance improvements and new academic resources on BIT Central.

Key Updates:
• Real-time exam seat allocation and hall schedules
• Enhanced Question Bank & Answer Key repositories
• Faster dashboard loading and improved profile tracking

Visit the portal to explore the updates: https://bitcentral.bitsathy.in

Best regards,
BIT Central Team
Bannari Amman Institute of Technology`,
  },
  {
    id: "account_notice",
    name: "⚠️ Account Notice / Reminder",
    subject: "Notice regarding your BIT Central account ({{user_id}})",
    body: `Dear {{name}},

This is a formal notice regarding your BIT Central account associated with {{email}}.

Please ensure your profile information, User ID ({{user_id}}), Register No ({{register_no}}), and department details are accurate and up to date.

If you have any questions, feel free to reply to this email or reach out through the in-app support chat.

Warm regards,
BIT Central Administration`,
  },
  {
    id: "exam_update",
    name: "📝 Examination & QB Update",
    subject: "Exam Schedule & Question Papers Updated for {{batch}}",
    body: `Hello {{first_name}},

The latest semester exam question papers and updated answer keys for your department have been published on BIT Central.

Please log in to your account to review the subject-wise study material and schedule.

Good luck with your preparations!

Best regards,
Academic Support · BIT Central`,
  },
  {
    id: "feedback_followup",
    name: "💬 Feedback Follow-up",
    subject: "Regarding your recent feedback on BIT Central",
    body: `Hi {{first_name}},

Thank you for providing feedback to the BIT Central team. We have reviewed your suggestion and implemented improvements to enhance your student experience.

If there is anything else you would like to see on the platform, don't hesitate to reach out.

Best regards,
Jaison David M & BIT Central Dev Team`,
  },
];

const VARIABLE_TAGS = [
  { tag: "{{name}}", label: "Full Name", desc: "e.g. John Doe" },
  { tag: "{{first_name}}", label: "First Name", desc: "e.g. John" },
  { tag: "{{email}}", label: "Email Address", desc: "e.g. user@bitsathy.ac.in" },
  { tag: "{{user_id}}", label: "User ID", desc: "e.g. 621324243105" },
  { tag: "{{register_no}}", label: "Register No", desc: "e.g. 1045" },
  { tag: "{{department}}", label: "Department", desc: "e.g. CSE" },
  { tag: "{{batch}}", label: "Batch", desc: "e.g. 2022" },
  { tag: "{{date}}", label: "Current Date", desc: "e.g. 10-Sep-2026" },
];

export default function AdminMailSender() {
  // Navigation tabs: 'composer' | 'queue' | 'history'
  const [activeSubTab, setActiveSubTab] = useState("composer");

  // Users query and pagination state (searches all records in users table)
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [userSearch, setUserSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedRole, setSelectedRole] = useState("all");

  const [userPage, setUserPage] = useState(1);
  const [userPageSize] = useState(25);
  const [userTotalFiltered, setUserTotalFiltered] = useState(0);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [userBatchCounts, setUserBatchCounts] = useState({});

  // Selected recipient objects (key: email)
  const [selectedRecipients, setSelectedRecipients] = useState({});

  // Email form state
  const [selectedTemplateId, setSelectedTemplateId] = useState("custom");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("Hello {{first_name}},\n\n\n\nBest regards,\nBIT Central Team");
  const [isHTML, setIsHTML] = useState(true);
  const [customFromName, setCustomFromName] = useState("BIT Central");
  const [replyTo, setReplyTo] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  // SMTP Config state
  const [smtpConfig, setSmtpConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testEmailTarget, setTestEmailTarget] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Sending state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const [banner, setBanner] = useState({ type: "", message: "" });

  // Job Queue state
  const [queues, setQueues] = useState([]);
  const [queueStats, setQueueStats] = useState({ total_jobs: 0, active_jobs: 0, total_sent: 0, total_failed: 0, total_pending: 0 });
  const [queueTotal, setQueueTotal] = useState(0);
  const [queuePage, setQueuePage] = useState(1);
  const [queueStatusFilter, setQueueStatusFilter] = useState("all");
  const [queueSearch, setQueueSearch] = useState("");
  const [debouncedQueueSearch, setDebouncedQueueSearch] = useState("");
  const [loadingQueues, setLoadingQueues] = useState(false);
  const [expandedBatchId, setExpandedBatchId] = useState(null);
  const [batchDetails, setBatchDetails] = useState({});
  const [loadingBatchDetails, setLoadingBatchDetails] = useState({});
  const [actionInProgress, setActionInProgress] = useState({});

  // History state
  const [historyLogs, setHistoryLogs] = useState([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyPage, setHistoryPage] = useState(1);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const textareaRef = useRef(null);

  // Debounce user search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(userSearch.trim());
      setUserPage(1);
    }, 250);
    return () => clearTimeout(handler);
  }, [userSearch]);

  // Debounce queue search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQueueSearch(queueSearch.trim());
      setQueuePage(1);
    }, 250);
    return () => clearTimeout(handler);
  }, [queueSearch]);

  // 1. Fetch Users with Server Query & Pagination from `users` table
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await listAdminUsers({
        page: userPage,
        limit: userPageSize,
        search: debouncedSearch,
        batch: selectedBatch !== "all" ? selectedBatch : "",
        status: selectedRole !== "all" ? selectedRole : "",
      });

      if (res?.success) {
        setUsers(res.users || []);
        setUserTotalFiltered(res.filteredTotal || res.total || 0);
        setUserTotalPages(res.totalPages || 1);
        if (res.batchCounts && Object.keys(res.batchCounts).length > 0) {
          setUserBatchCounts(res.batchCounts);
        }
      }
    } catch (err) {
      console.error("Failed to query users table for mailer", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [userPage, userPageSize, debouncedSearch, selectedBatch, selectedRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 2. Fetch SMTP Config
  const fetchSMTPConfig = useCallback(async () => {
    try {
      setLoadingConfig(true);
      const res = await getAdminMailConfig();
      if (res?.success && res.config) {
        setSmtpConfig(res.config);
        if (res.config.from_name) {
          setCustomFromName(res.config.from_name);
        }
      }
    } catch (err) {
      console.error("Failed to load SMTP config", err);
    } finally {
      setLoadingConfig(false);
    }
  }, []);

  // 3. Fetch Job Queues
  const fetchQueues = useCallback(async (page = 1, showLoading = true) => {
    try {
      if (showLoading) setLoadingQueues(true);
      const res = await getAdminMailQueues({
        page,
        limit: 15,
        status: queueStatusFilter !== "all" ? queueStatusFilter : "",
        search: debouncedQueueSearch,
      });
      if (res?.success) {
        setQueues(res.data || []);
        setQueueTotal(res.total || 0);
        setQueuePage(res.page || 1);
        if (res.stats) {
          setQueueStats(res.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load email queues", err);
    } finally {
      if (showLoading) setLoadingQueues(false);
    }
  }, [queueStatusFilter, debouncedQueueSearch]);

  // 4. Fetch Details for Expanded Batch
  const fetchBatchItems = useCallback(async (batchId) => {
    try {
      setLoadingBatchDetails((prev) => ({ ...prev, [batchId]: true }));
      const res = await getAdminMailQueueDetails(batchId);
      if (res?.success && res.items) {
        setBatchDetails((prev) => ({ ...prev, [batchId]: res.items }));
      }
    } catch (err) {
      console.error(`Failed to load items for batch ${batchId}`, err);
    } finally {
      setLoadingBatchDetails((prev) => ({ ...prev, [batchId]: false }));
    }
  }, []);

  // Auto-refresh queues when on queue tab and active jobs exist
  useEffect(() => {
    if (activeSubTab !== "queue") return;

    fetchQueues(queuePage, true);

    const interval = setInterval(() => {
      fetchQueues(queuePage, false);
      if (expandedBatchId) {
        fetchBatchItems(expandedBatchId);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [activeSubTab, queuePage, expandedBatchId, fetchQueues, fetchBatchItems]);

  // 5. Fetch History
  const fetchHistory = useCallback(async (page = 1) => {
    try {
      setLoadingHistory(true);
      const res = await getAdminMailHistory({ page, limit: 15 });
      if (res?.success) {
        setHistoryLogs(res.data || []);
        setHistoryTotal(res.total || 0);
        setHistoryPage(res.page || 1);
      }
    } catch (err) {
      console.error("Failed to load mail history", err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchSMTPConfig();
  }, [fetchSMTPConfig]);

  useEffect(() => {
    if (activeSubTab === "history") {
      fetchHistory(1);
    }
  }, [activeSubTab, fetchHistory]);

  // Batch options from server counts or defaults
  const batchOptions = useMemo(() => {
    const keys = Object.keys(userBatchCounts);
    if (keys.length > 0) {
      return keys.filter((k) => k && k !== "Unknown").sort().reverse();
    }
    const currentYr = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => String(currentYr - i));
  }, [userBatchCounts]);

  // Selection handlers
  const handleToggleUser = (user) => {
    const email = (user.email || "").toLowerCase().trim();
    if (!email) return;

    const formattedName = formatStudentDisplayName(user.name, user.display_name || user.displayName, user.email);

    setSelectedRecipients((prev) => {
      const next = { ...prev };
      if (next[email]) {
        delete next[email];
      } else {
        next[email] = {
          email,
          name: formattedName,
          user_id: user.user_id || user.id || "",
          register_no: user.register_no || user.roll_no || "",
          department: user.department || "",
          batch: user.batch || "",
        };
      }
      return next;
    });
  };

  const handleSelectAllOnPage = () => {
    setSelectedRecipients((prev) => {
      const next = { ...prev };
      users.forEach((u) => {
        const email = (u.email || "").toLowerCase().trim();
        if (email) {
          next[email] = {
            email,
            name: formatStudentDisplayName(u.name, u.display_name || u.displayName, u.email),
            user_id: u.user_id || u.id || "",
            register_no: u.register_no || u.roll_no || "",
            department: u.department || "",
            batch: u.batch || "",
          };
        }
      });
      return next;
    });
  };

  const handleDeselectAllOnPage = () => {
    setSelectedRecipients((prev) => {
      const next = { ...prev };
      users.forEach((u) => {
        const email = (u.email || "").toLowerCase().trim();
        delete next[email];
      });
      return next;
    });
  };

  const handleClearAllRecipients = () => {
    setSelectedRecipients({});
  };

  const handleRemoveRecipient = (email) => {
    setSelectedRecipients((prev) => {
      const next = { ...prev };
      delete next[email];
      return next;
    });
  };

  // Template switch
  const handleSelectTemplate = (templateId) => {
    setSelectedTemplateId(templateId);
    const tmpl = TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      if (tmpl.subject) setSubject(tmpl.subject);
      if (tmpl.body) setBody(tmpl.body);
    }
  };

  // Insert variable tag into body at cursor
  const handleInsertTag = (tag) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setBody((prev) => prev + " " + tag);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const newVal = currentVal.substring(0, start) + tag + currentVal.substring(end);
    setBody(newVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length, start + tag.length);
    }, 10);
  };

  // Preview sample interpolation from real tracker user records
  const sampleRecipient = useMemo(() => {
    const list = Object.values(selectedRecipients);
    if (list.length > 0) return list[0];
    if (users.length > 0) {
      const u = users[0];
      const displayName = formatStudentDisplayName(u.name, u.display_name || u.displayName, u.email);
      return {
        name: displayName || "null",
        first_name: (displayName || "").split(" ")[0] || "null",
        email: u.email || "null",
        user_id: u.user_id || u.id || "null",
        register_no: u.register_no || u.roll_no || "null",
        department: u.department || "null",
        batch: u.batch || "null",
      };
    }
    return {
      name: "null",
      first_name: "null",
      email: "null",
      user_id: "null",
      register_no: "null",
      department: "null",
      batch: "null",
    };
  }, [selectedRecipients, users]);

  const previewSubject = useMemo(() => {
    let s = subject;
    s = s.replace(/{{name}}/g, sampleRecipient.name || "null");
    s = s.replace(/{{first_name}}/g, sampleRecipient.first_name || (sampleRecipient.name || "null").split(" ")[0] || "null");
    s = s.replace(/{{email}}/g, sampleRecipient.email || "null");
    s = s.replace(/{{user_id}}/g, sampleRecipient.user_id || "null");
    s = s.replace(/{{register_no}}/g, sampleRecipient.register_no || "null");
    s = s.replace(/{{roll_no}}/g, sampleRecipient.register_no || sampleRecipient.user_id || "null");
    s = s.replace(/{{department}}/g, sampleRecipient.department || "null");
    s = s.replace(/{{batch}}/g, sampleRecipient.batch || "null");
    s = s.replace(/{{date}}/g, new Date().toLocaleDateString("en-GB"));
    s = s.replace(/{{year}}/g, String(new Date().getFullYear()));
    return s;
  }, [subject, sampleRecipient]);

  const previewBody = useMemo(() => {
    let b = body;
    b = b.replace(/{{name}}/g, sampleRecipient.name || "null");
    b = b.replace(/{{first_name}}/g, sampleRecipient.first_name || (sampleRecipient.name || "null").split(" ")[0] || "null");
    b = b.replace(/{{email}}/g, sampleRecipient.email || "null");
    b = b.replace(/{{user_id}}/g, sampleRecipient.user_id || "null");
    b = b.replace(/{{register_no}}/g, sampleRecipient.register_no || "null");
    b = b.replace(/{{roll_no}}/g, sampleRecipient.register_no || sampleRecipient.user_id || "null");
    b = b.replace(/{{department}}/g, sampleRecipient.department || "null");
    b = b.replace(/{{batch}}/g, sampleRecipient.batch || "null");
    b = b.replace(/{{date}}/g, new Date().toLocaleDateString("en-GB"));
    b = b.replace(/{{year}}/g, String(new Date().getFullYear()));
    return b;
  }, [body, sampleRecipient]);

  // Test SMTP connection
  const handleTestSMTP = async (e) => {
    e?.preventDefault();
    if (!testEmailTarget.trim() || !testEmailTarget.includes("@")) {
      setTestResult({ success: false, message: "Please enter a valid target email address." });
      return;
    }

    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await testAdminMailConnection({ target_email: testEmailTarget.trim() });
      setTestResult({ success: Boolean(res?.success), message: res?.message || "Test completed" });
    } catch (err) {
      setTestResult({
        success: false,
        message: normalizeError(err, "Failed to connect to SMTP server. Check credentials in server .env."),
      });
    } finally {
      setTestingConnection(false);
    }
  };

  // Trigger Send (Enqueues Job)
  const handleOpenSendConfirmation = (e) => {
    e.preventDefault();
    const recipientCount = Object.keys(selectedRecipients).length;
    if (recipientCount === 0) {
      setBanner({ type: "error", message: "Please select at least 1 recipient before sending." });
      return;
    }
    if (!subject.trim()) {
      setBanner({ type: "error", message: "Please enter an email subject." });
      return;
    }
    if (!body.trim()) {
      setBanner({ type: "error", message: "Email body cannot be empty." });
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleExecuteSend = async () => {
    const recipientsList = Object.values(selectedRecipients);
    setSending(true);
    setSendResult(null);

    try {
      const payload = {
        recipients: recipientsList,
        subject: subject.trim(),
        body: body.trim(),
        is_html: isHTML,
        custom_from_name: customFromName.trim(),
        reply_to: replyTo.trim(),
      };

      const res = await sendAdminMail(payload);
      if (res?.success) {
        setSendResult({
          success: true,
          batch_id: res.batch_id,
          message: res.message || `Successfully queued ${res.total} emails for sequential delivery!`,
          details: res,
        });
        setBanner({
          type: "success",
          message: `Emails queued for delivery! (Batch ID: ${res.batch_id})`,
        });
      } else {
        setSendResult({
          success: false,
          message: res?.message || "Encountered issues creating email queue.",
          details: res,
        });
        setBanner({
          type: "error",
          message: res?.message || "Failed to queue emails.",
        });
      }
    } catch (err) {
      const errMsg = normalizeError(err, "Failed to dispatch email job.");
      setSendResult({ success: false, message: errMsg });
      setBanner({ type: "error", message: errMsg });
    } finally {
      setSending(false);
    }
  };

  // Queue actions
  const handleToggleExpandBatch = (batchId) => {
    if (expandedBatchId === batchId) {
      setExpandedBatchId(null);
    } else {
      setExpandedBatchId(batchId);
      if (!batchDetails[batchId]) {
        fetchBatchItems(batchId);
      }
    }
  };

  const handleResendFailedBatch = async (batchId) => {
    setActionInProgress((prev) => ({ ...prev, [batchId]: true }));
    try {
      const res = await resendFailedAdminMailQueue(batchId);
      if (res?.success) {
        setBanner({ type: "success", message: res.message || "Failed emails re-queued successfully!" });
        fetchQueues(queuePage, false);
        fetchBatchItems(batchId);
      } else {
        setBanner({ type: "error", message: res?.message || "Failed to re-queue failed emails." });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to re-queue emails.") });
    } finally {
      setActionInProgress((prev) => ({ ...prev, [batchId]: false }));
    }
  };

  const handleRetryItem = async (itemId, batchId) => {
    setActionInProgress((prev) => ({ ...prev, [`item_${itemId}`]: true }));
    try {
      const res = await retryAdminMailQueueItem(itemId);
      if (res?.success) {
        setBanner({ type: "success", message: "Email re-queued for delivery!" });
        fetchQueues(queuePage, false);
        fetchBatchItems(batchId);
      } else {
        setBanner({ type: "error", message: res?.message || "Failed to retry email." });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to retry email.") });
    } finally {
      setActionInProgress((prev) => ({ ...prev, [`item_${itemId}`]: false }));
    }
  };

  const handleDeleteQueue = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this email job queue?")) return;
    try {
      await deleteAdminMailQueue(batchId);
      setQueues((prev) => prev.filter((q) => q.batch_id !== batchId));
      setQueueTotal((prev) => Math.max(0, prev - 1));
      setBanner({ type: "success", message: "Email queue deleted." });
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete queue.") });
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm("Are you sure you want to remove this sent mail log?")) return;
    try {
      await deleteAdminMailLog(id);
      setHistoryLogs((prev) => prev.filter((l) => l.id !== id));
      setHistoryTotal((prev) => Math.max(0, prev - 1));
    } catch (err) {
      alert(normalizeError(err, "Failed to delete mail log"));
    }
  };

  const recipientCount = Object.keys(selectedRecipients).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Banner */}
      {banner.message && (
        <div
          className={`flex items-start justify-between gap-3 p-4 rounded-2xl border text-sm shadow-xs ${
            banner.type === "error"
              ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/70 dark:border-rose-900/60 dark:text-rose-200"
              : "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:border-emerald-900/60 dark:text-emerald-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {banner.type === "error" ? (
              <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
            ) : (
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            )}
            <span className="font-medium">{banner.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setBanner({ type: "", message: "" })}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header & Sub-Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Admin Mail Sender & Job Queues
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Dispatch personalized emails sequentially via Gomail SMTP with real-time queue tracking & auto-retry.
              </p>
            </div>
          </div>
        </div>

        {/* Right Action & SMTP Status Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* SMTP Readiness Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {smtpConfig?.host ? `${smtpConfig.host}:${smtpConfig.port}` : "SMTP Ready"}
            </span>
            {smtpConfig?.user_masked && (
              <span className="hidden md:inline font-mono text-[11px] text-slate-400">
                ({smtpConfig.user_masked})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setTestResult(null);
              setIsTestModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <Server className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
            <span>Test SMTP</span>
          </button>

          {/* Sub-tab switcher */}
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveSubTab("composer")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeSubTab === "composer"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Send className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span>Composer</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("queue")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeSubTab === "queue"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5 text-amber-500" />
              <span>Job Queues</span>
              {queueStats.active_jobs > 0 && (
                <span className="ml-0.5 rounded-full bg-amber-500 text-white px-1.5 py-0.2 text-[10px] font-mono animate-pulse">
                  {queueStats.active_jobs}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab("history")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                activeSubTab === "history"
                  ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <History className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <span>Logs</span>
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === "composer" ? (
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* LEFT COLUMN: User Selection Card with Server Query & Pagination */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 space-y-3.5">
              {/* Card Header & Selected Count Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Target Recipients
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    recipientCount > 0
                      ? "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800"
                      : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                  }`}
                >
                  <UserCheck className="h-3 w-3" />
                  {recipientCount} Selected
                </span>
              </div>

              {/* Real-time Search Across Entire Users Table */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search all users by name, email, register no, user id..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 py-2 text-xs text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white"
                />
                {userSearch && (
                  <button
                    type="button"
                    onClick={() => setUserSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Dropdowns (Batch & Role) */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {/* Batch Filter */}
                <select
                  value={selectedBatch}
                  onChange={(e) => {
                    setSelectedBatch(e.target.value);
                    setUserPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                >
                  <option value="all">All Batches</option>
                  {batchOptions.map((b) => (
                    <option key={b} value={b}>
                      Batch {b}
                    </option>
                  ))}
                </select>

                {/* Role Filter */}
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    setSelectedRole(e.target.value);
                    setUserPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users only</option>
                  <option value="admin">Admins only</option>
                </select>

                <span className="text-[11px] text-slate-400 ml-auto">
                  {userTotalFiltered.toLocaleString()} match{userTotalFiltered === 1 ? "" : "es"}
                </span>
              </div>

              {/* Quick Select Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllOnPage}
                    className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-bold hover:underline cursor-pointer"
                  >
                    + Select Page ({users.length})
                  </button>
                  <span className="text-slate-300 dark:text-slate-700">|</span>
                  <button
                    type="button"
                    onClick={handleDeselectAllOnPage}
                    className="text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:underline cursor-pointer"
                  >
                    Deselect Page
                  </button>
                </div>

                {recipientCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllRecipients}
                    className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-medium hover:underline cursor-pointer"
                  >
                    Clear Selected ({recipientCount})
                  </button>
                )}
              </div>

              {/* Scrollable User Directory List */}
              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200/80 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {loadingUsers ? (
                  <div className="flex h-32 items-center justify-center">
                    <Loader className="h-5 w-5 animate-spin text-teal-600" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No users matching <strong className="text-slate-600 dark:text-slate-300">"{debouncedSearch}"</strong> in database.
                  </div>
                ) : (
                  users.map((u) => {
                    const email = (u.email || "").toLowerCase().trim();
                    const isSelected = Boolean(selectedRecipients[email]);
                    const displayNameFormatted = formatStudentDisplayName(u.name, u.display_name || u.displayName, u.email);

                    return (
                      <div
                        key={u.id || u.uid || email}
                        onClick={() => handleToggleUser(u)}
                        className={`flex items-center justify-between p-2.5 text-xs transition cursor-pointer ${
                          isSelected
                            ? "bg-teal-50/80 dark:bg-teal-950/40"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleUser(u)}
                            className="h-3.5 w-3.5 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          />
                          {u.photo_url ? (
                            <img
                              src={u.photo_url}
                              alt=""
                              className="h-6 w-6 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300 shrink-0">
                              {(displayNameFormatted || "U")[0].toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 dark:text-white truncate">
                              {displayNameFormatted}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-mono">
                              {email}
                              {(u.register_no || u.user_id) && (
                                <span className="ml-1 text-slate-400 font-normal">
                                  · {u.register_no ? `Reg: ${u.register_no}` : ""} {u.user_id ? `(ID: ${u.user_id})` : ""}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          {u.role && u.role !== "user" && (
                            <span className="rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 px-1.5 py-0.2 text-[9px] font-bold uppercase">
                              {u.role}
                            </span>
                          )}
                          {u.batch && (
                            <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                              {u.batch}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* User Pagination Bar */}
              {userTotalPages > 1 && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                  <span>
                    Page {userPage} of {userTotalPages}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                      disabled={userPage <= 1 || loadingUsers}
                      className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                      title="Previous Page"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                      disabled={userPage >= userTotalPages || loadingUsers}
                      className="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                      title="Next Page"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Selected Recipients Tray (Chips) */}
              {recipientCount > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Selected Recipients Tray</span>
                    <span>{recipientCount} total selected</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 rounded-xl bg-slate-50/60 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
                    {Object.values(selectedRecipients).map((r) => (
                      <span
                        key={r.email}
                        className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs"
                      >
                        <span className="truncate max-w-[140px]">{r.name || r.email}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipient(r.email)}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Email Composer (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-4">
            <form
              onSubmit={handleOpenSendConfirmation}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/95 space-y-4"
            >
              {/* Preset Template Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span>Email Template Preset</span>
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white cursor-pointer"
                >
                  {TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Tag Injector Chips */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Tag className="h-3 w-3 text-teal-600" />
                    Insert Variable Placeholders
                  </span>
                  <span>Click to insert at cursor</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {VARIABLE_TAGS.map((vt) => (
                    <button
                      key={vt.tag}
                      type="button"
                      onClick={() => handleInsertTag(vt.tag)}
                      title={vt.desc}
                      className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50/60 px-2 py-1 text-[11px] font-mono font-bold text-teal-700 transition hover:bg-teal-100 hover:border-teal-300 dark:border-teal-900/80 dark:bg-teal-950/40 dark:text-teal-300 dark:hover:bg-teal-900/60 cursor-pointer shadow-2xs"
                    >
                      <span>{vt.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject Line Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Subject Line *
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {subject.length} chars
                  </span>
                </div>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Important Announcement for Batch 2022"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {/* Sender Name & Reply-To */}
              <div className="grid gap-3 sm:grid-cols-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Sender Display Name
                  </label>
                  <input
                    type="text"
                    value={customFromName}
                    onChange={(e) => setCustomFromName(e.target.value)}
                    placeholder="BIT Central"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Reply-To Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={replyTo}
                    onChange={(e) => setReplyTo(e.target.value)}
                    placeholder="developer@bitsathy.in"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Mode Switcher: Compose vs Live HTML Preview */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Email Content Message *
                  </label>
                  <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setPreviewMode(false)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                        !previewMode
                          ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                      }`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode(true)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                        previewMode
                          ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-white"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                      }`}
                    >
                      <Eye className="inline h-3 w-3 mr-1" />
                      Live Preview
                    </button>
                  </div>
                </div>

                {!previewMode ? (
                  <textarea
                    ref={textareaRef}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={9}
                    required
                    placeholder="Write your email body here... You can use {{first_name}}, {{user_id}}, {{register_no}}, etc."
                    className="w-full rounded-xl border border-slate-300 bg-white p-3.5 text-xs text-slate-900 font-sans outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white leading-relaxed resize-y"
                  />
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-950 space-y-3">
                    {/* Simulated Mail Client Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-3 border-b border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-500">Subject:</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {previewSubject || "(No subject)"}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        To: {sampleRecipient.name} &lt;{sampleRecipient.email}&gt;
                      </span>
                    </div>

                    {/* Exact Email Container Mockup */}
                    <div className="mx-auto max-w-[580px] rounded-2xl overflow-hidden bg-white shadow-md border border-slate-200 text-left font-sans text-slate-800">
                      {/* Email Header Banner */}
                      <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-5 text-white">
                        <h1 className="text-xl font-bold tracking-tight text-white m-0">
                          BIT Central
                        </h1>
                        <p className="text-blue-100 text-xs mt-1 m-0">
                          Official Student & Campus Portal Notification
                        </p>
                      </div>

                      {/* Email Body Content */}
                      <div className="p-6 sm:p-7 text-sm leading-relaxed text-slate-700 whitespace-pre-line min-h-[140px]">
                        {previewBody}
                      </div>

                      {/* Email Footer Banner */}
                      <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 text-center text-[11px] text-slate-500 space-y-0.5">
                        <p className="m-0 text-slate-600 font-normal">
                          This is an automated computer-generated message from BIT Central.
                        </p>
                        <p className="m-0 text-[10px] text-slate-400">
                          If you don't need this message again, please contact{" "}
                          <span className="text-blue-600 underline">developer@bitsathy.in</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Ready to queue for{" "}
                  <strong className="text-teal-600 dark:text-teal-400">
                    {recipientCount} recipient{recipientCount === 1 ? "" : "s"}
                  </strong>
                </div>

                <button
                  type="submit"
                  disabled={recipientCount === 0 || !subject.trim() || !body.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-500/20 transition hover:from-teal-700 hover:to-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  <span>Queue & Send Emails</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : activeSubTab === "queue" ? (
        /* JOB QUEUES TAB */
        <div className="space-y-5">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Batches</span>
                <Layers className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {queueStats.total_jobs}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs dark:border-amber-900/50 dark:bg-amber-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Active In Queue</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <p className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
                {queueStats.total_pending}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-2xs dark:border-emerald-900/50 dark:bg-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Delivered (Sent)</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {queueStats.total_sent}
              </p>
            </div>

            <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-2xs dark:border-rose-900/50 dark:bg-rose-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Failed Mails</span>
                <AlertCircle className="h-4 w-4 text-rose-500" />
              </div>
              <p className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">
                {queueStats.total_failed}
              </p>
            </div>
          </div>

          {/* Queue Filter & Action Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Bar */}
                <div className="relative min-w-[240px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={queueSearch}
                    onChange={(e) => setQueueSearch(e.target.value)}
                    placeholder="Search by subject or batch ID..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-teal-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  {queueSearch && (
                    <button
                      type="button"
                      onClick={() => setQueueSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <select
                  value={queueStatusFilter}
                  onChange={(e) => {
                    setQueueStatusFilter(e.target.value);
                    setQueuePage(1);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="processing">Processing</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Auto-sync active (every 3.5s)
                </span>
                <button
                  type="button"
                  onClick={() => fetchQueues(queuePage, true)}
                  disabled={loadingQueues}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingQueues ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Queue Batches List */}
            {loadingQueues && queues.length === 0 ? (
              <div className="flex h-48 items-center justify-center">
                <Loader className="h-6 w-6 animate-spin text-teal-600" />
              </div>
            ) : queues.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                <Mail className="h-8 w-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p>No email queues found matching the filter criteria.</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {queues.map((batch) => {
                  const isExpanded = expandedBatchId === batch.batch_id;
                  const percentSent = batch.total_count > 0 ? Math.round((batch.sent_count / batch.total_count) * 100) : 0;
                  const percentFailed = batch.total_count > 0 ? Math.round((batch.failed_count / batch.total_count) * 100) : 0;
                  const percentPending = batch.total_count > 0 ? Math.max(0, 100 - percentSent - percentFailed) : 0;
                  const isBatchActionLoading = actionInProgress[batch.batch_id];
                  const items = batchDetails[batch.batch_id] || [];
                  const isLoadingItems = loadingBatchDetails[batch.batch_id];

                  return (
                    <div
                      key={batch.batch_id}
                      className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/60 space-y-3.5 transition hover:border-slate-300 dark:hover:border-slate-700"
                    >
                      {/* Batch Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-md">
                              {batch.subject}
                            </h4>

                            {/* Status Badge */}
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                batch.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : batch.status === "processing"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 animate-pulse"
                                  : batch.status === "failed"
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              }`}
                            >
                              {batch.status === "processing" && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />}
                              {batch.status}
                            </span>

                            <span className="font-mono text-[10px] text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                              {batch.batch_id}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400">
                            Queued on {formatISTDateTime(batch.created_at)} · Sender:{" "}
                            <span className="text-slate-600 dark:text-slate-300 font-medium">
                              {batch.custom_from_name || "BIT Central"}
                            </span>{" "}
                            ({batch.admin_email || batch.admin_uid || "Admin"})
                          </p>
                        </div>

                        {/* Batch Action Buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Resend Failed Button */}
                          {batch.failed_count > 0 && (
                            <button
                              type="button"
                              onClick={() => handleResendFailedBatch(batch.batch_id)}
                              disabled={isBatchActionLoading}
                              className="inline-flex items-center gap-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 text-xs font-bold shadow-xs transition cursor-pointer disabled:opacity-50"
                              title="Re-queue all failed recipients in this batch"
                            >
                              <RotateCcw className={`h-3 w-3 ${isBatchActionLoading ? "animate-spin" : ""}`} />
                              <span>Resend Failed ({batch.failed_count})</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleToggleExpandBatch(batch.batch_id)}
                            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs"
                          >
                            <span>{isExpanded ? "Hide Details" : "View Recipients"}</span>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteQueue(batch.batch_id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer transition"
                            title="Delete queue batch"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Visual Multi-Segment Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-medium">
                          <span className="text-slate-500 dark:text-slate-400">
                            Delivery Progress:{" "}
                            <strong className="text-slate-900 dark:text-white">
                              {batch.sent_count} / {batch.total_count} Sent
                            </strong>{" "}
                            ({percentSent}%)
                          </span>

                          <div className="flex items-center gap-3 text-[10px] font-semibold font-mono">
                            <span className="text-emerald-600 dark:text-emerald-400">
                              ✓ {batch.sent_count} Sent
                            </span>
                            {batch.pending_count > 0 && (
                              <span className="text-amber-600 dark:text-amber-400">
                                ⏳ {batch.pending_count} Pending
                              </span>
                            )}
                            {batch.failed_count > 0 && (
                              <span className="text-rose-600 dark:text-rose-400">
                                ✕ {batch.failed_count} Failed
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar Track */}
                        <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex shadow-inner">
                          {percentSent > 0 && (
                            <div
                              style={{ width: `${percentSent}%` }}
                              className="bg-emerald-500 transition-all duration-500"
                              title={`${batch.sent_count} Delivered`}
                            />
                          )}
                          {percentFailed > 0 && (
                            <div
                              style={{ width: `${percentFailed}%` }}
                              className="bg-rose-500 transition-all duration-500"
                              title={`${batch.failed_count} Failed`}
                            />
                          )}
                          {percentPending > 0 && (
                            <div
                              style={{ width: `${percentPending}%` }}
                              className="bg-amber-400/80 animate-pulse transition-all duration-500"
                              title={`${batch.pending_count} Pending`}
                            />
                          )}
                        </div>
                      </div>

                      {/* Expanded Recipient Items List */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex items-center justify-between text-xs">
                            <h5 className="font-bold text-slate-800 dark:text-slate-200">
                              Recipient Queue Items ({items.length || batch.total_count})
                            </h5>
                            <button
                              type="button"
                              onClick={() => fetchBatchItems(batch.batch_id)}
                              disabled={isLoadingItems}
                              className="text-slate-400 hover:text-teal-600 text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                            >
                              <RefreshCw className={`h-3 w-3 ${isLoadingItems ? "animate-spin" : ""}`} />
                              <span>Refresh Items</span>
                            </button>
                          </div>

                          {isLoadingItems && items.length === 0 ? (
                            <div className="flex h-24 items-center justify-center">
                              <Loader className="h-4 w-4 animate-spin text-teal-600" />
                            </div>
                          ) : items.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-400">
                              No recipient records loaded. Click refresh items.
                            </div>
                          ) : (
                            <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                              {items.map((item) => {
                                const isItemLoading = actionInProgress[`item_${item.id}`];

                                return (
                                  <div
                                    key={item.id}
                                    className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                                  >
                                    <div className="space-y-0.5 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-slate-900 dark:text-white truncate">
                                          {item.recipient_name || item.recipient_email}
                                        </span>
                                        <span className="font-mono text-[11px] text-slate-400 truncate">
                                          &lt;{item.recipient_email}&gt;
                                        </span>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                                        {item.recipient_register_no && (
                                          <span>Reg: {item.recipient_register_no}</span>
                                        )}
                                        {item.recipient_dept && (
                                          <span>Dept: {item.recipient_dept}</span>
                                        )}
                                        {item.recipient_batch && (
                                          <span>Batch: {item.recipient_batch}</span>
                                        )}
                                        <span>Attempts: {item.attempts}</span>
                                        {item.sent_at && (
                                          <span>Sent: {formatISTDateTime(item.sent_at)}</span>
                                        )}
                                      </div>

                                      {/* Failure reason if any */}
                                      {item.status === "failed" && item.error_message && (
                                        <p className="text-[10px] text-rose-600 dark:text-rose-400 font-mono bg-rose-50 dark:bg-rose-950/60 p-1.5 rounded-lg border border-rose-200 dark:border-rose-900 mt-1">
                                          ⚠️ Error: {item.error_message}
                                        </p>
                                      )}
                                    </div>

                                    {/* Item Status & Retry Action */}
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                          item.status === "sent"
                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                            : item.status === "processing"
                                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 animate-pulse"
                                            : item.status === "failed"
                                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                                            : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                        }`}
                                      >
                                        {item.status}
                                      </span>

                                      {item.status === "failed" && (
                                        <button
                                          type="button"
                                          onClick={() => handleRetryItem(item.id, batch.batch_id)}
                                          disabled={isItemLoading}
                                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 border border-rose-200 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/80 dark:border-rose-900 dark:text-rose-300 cursor-pointer shadow-2xs transition disabled:opacity-50"
                                        >
                                          <RotateCcw className={`h-3 w-3 ${isItemLoading ? "animate-spin" : ""}`} />
                                          <span>Retry</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SENT HISTORY TAB */
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Sent Email Dispatches & Logs
                </h3>
              </div>
              <button
                type="button"
                onClick={() => fetchHistory(historyPage)}
                disabled={loadingHistory}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingHistory ? "animate-spin" : ""}`} />
                <span>Refresh Logs</span>
              </button>
            </div>

            {loadingHistory ? (
              <div className="flex h-48 items-center justify-center">
                <Loader className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : historyLogs.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No email broadcast logs found yet. Sent dispatches will appear here.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {historyLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  let parsedRecipients = [];
                  try {
                    parsedRecipients = typeof log.recipients === "string" ? JSON.parse(log.recipients) : log.recipients || [];
                  } catch (e) {
                    parsedRecipients = [];
                  }

                  return (
                    <div key={log.id} className="py-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {log.subject}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                log.fail_count === 0
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                              }`}
                            >
                              {log.success_count} / {log.recipient_count} Delivered
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Dispatched on {formatISTDateTime(log.sent_at)} · Sender:{" "}
                            {log.admin_email || log.admin_uid || "Admin"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                          >
                            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteLog(log.id)}
                            className="rounded-lg p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 cursor-pointer"
                            title="Delete log"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded View */}
                      {isExpanded && (
                        <div className="mt-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs space-y-3">
                          {/* Message Body */}
                          <div>
                            <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                              Message Content
                            </span>
                            <div className="rounded-lg bg-white p-3 font-sans text-slate-800 dark:bg-slate-900 dark:text-slate-200 whitespace-pre-line border border-slate-200 dark:border-slate-800 max-h-40 overflow-y-auto">
                              {log.body}
                            </div>
                          </div>

                          {/* Recipient list */}
                          {parsedRecipients.length > 0 && (
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                                Recipients ({parsedRecipients.length})
                              </span>
                              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                                {parsedRecipients.map((r, idx) => (
                                  <span
                                    key={idx}
                                    className="rounded-md bg-slate-200/80 px-2 py-0.5 text-[10px] font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                  >
                                    {r.email || r.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Error Details if any */}
                          {log.error_details && (
                            <div className="rounded-lg bg-rose-50 p-3 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                              <span className="font-bold block mb-0.5">Failure Details:</span>
                              <pre className="font-mono text-[10px] whitespace-pre-wrap">
                                {log.error_details}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SMTP TEST CONNECTION MODAL */}
      {isTestModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setIsTestModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Server className="h-4 w-4 text-teal-600" /> Test Gomail SMTP Connection
              </h3>
              <button
                type="button"
                onClick={() => setIsTestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleTestSMTP} className="mt-4 space-y-4 text-xs">
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Sends a verification test email via Gomail to ensure your SMTP credentials and port
                settings are working correctly.
              </p>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                  Target Recipient Email
                </label>
                <input
                  type="email"
                  value={testEmailTarget}
                  onChange={(e) => setTestEmailTarget(e.target.value)}
                  placeholder="e.g. developer@bitsathy.in"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              {testResult && (
                <div
                  className={`p-3 rounded-xl border text-xs font-medium ${
                    testResult.success
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/80 dark:text-rose-200"
                  }`}
                >
                  {testResult.message}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={testingConnection || !testEmailTarget.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-teal-700 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {testingConnection ? <Loader className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  <span>{testingConnection ? "Testing..." : "Send Test Email"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SEND CONFIRMATION & DISPATCH MODAL */}
      {isConfirmModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => {
            if (!sending) setIsConfirmModalOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="h-4 w-4 text-teal-600" />
                Confirm Email Queue Broadcast
              </h3>
              {!sending && (
                <button
                  type="button"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Checklist Overview */}
            <div className="space-y-2.5 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-950 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Recipients:</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400 text-sm">
                    {recipientCount} Students / Users
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sender Display:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {customFromName || "BIT Central"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
                    {previewSubject}
                  </span>
                </div>
              </div>

              {sendResult ? (
                <div
                  className={`p-4 rounded-xl border text-xs font-medium space-y-2 ${
                    sendResult.success
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-200"
                      : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/80 dark:text-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {sendResult.success ? (
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                    )}
                    <span>{sendResult.message}</span>
                  </div>

                  {sendResult.success && sendResult.batch_id && (
                    <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900 flex items-center justify-between">
                      <span className="font-mono text-[11px]">Batch ID: {sendResult.batch_id}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsConfirmModalOpen(false);
                          setActiveSubTab("queue");
                          setExpandedBatchId(sendResult.batch_id);
                        }}
                        className="inline-flex items-center gap-1 font-bold text-teal-700 dark:text-teal-300 hover:underline cursor-pointer"
                      >
                        <span>View in Live Queue</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Emails will be added to the background Job Queue and dispatched sequentially one-by-one to prevent SMTP provider rate limits.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                disabled={sending}
                onClick={() => setIsConfirmModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer disabled:opacity-50"
              >
                {sendResult ? "Done" : "Cancel"}
              </button>

              {!sendResult && (
                <button
                  type="button"
                  onClick={handleExecuteSend}
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-teal-500/20 hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 cursor-pointer"
                >
                  {sending ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span>{sending ? `Queueing ${recipientCount} emails...` : "Confirm & Queue"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


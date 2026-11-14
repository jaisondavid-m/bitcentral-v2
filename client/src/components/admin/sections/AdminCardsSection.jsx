import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  LayoutGrid,
  Search,
  Plus,
  RefreshCw,
  Loader,
  Edit2,
  Trash2,
  Eye,
  GripVertical,
  Upload,
  Download,
  X,
  CheckCircle,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  listAdminCards,
  createCard,
  updateCard,
  deleteCard,
  reorderAdminCards,
  bulkUploadCards,
} from "@/api/admin.js";
import { normalizeError, fileToDataURL } from "@/utils/adminUtils.js";
import AdminBanner from "@/components/admin/AdminBanner.jsx";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal.jsx";

const CARD_CSV_TEMPLATE = `name,card_order,link,app_route,btntext,keywords,img,click_count
"Exam Hall Finder",1,"","/exam-hall","Find Now","hall, venue, finder, exam, sem","/CardImgs/hallfinder.png",0
"Mess Menu",2,"","/mess","MessMenu","food, mess, menu, lunch, dinner, breakfast, snacks","/CardImgs/bitmenu.png",0
"PBL Portal",3,"https://pcdp.bitsathy.ac.in/stf/pbl","","Open Now","pbl, venue, portal","",0
"Upcoming Leave Details",4,"","/leavedetails","View Now","leave, holidays, details","",0`;

const CARD_JSON_TEMPLATE = JSON.stringify(
  [
    {
      name: "Exam Hall Finder",
      card_order: 1,
      link: "",
      app_route: "/exam-hall",
      btntext: "Find Now",
      keywords: ["hall", "venue", "finder", "exam", "sem"],
      img: "/CardImgs/hallfinder.png",
      click_count: 0,
    },
    {
      name: "Mess Menu",
      card_order: 2,
      link: "",
      app_route: "/mess",
      btntext: "MessMenu",
      keywords: ["food", "mess", "menu", "lunch", "dinner", "breakfast", "snacks"],
      img: "/CardImgs/bitmenu.png",
      click_count: 0,
    },
    {
      name: "PBL Portal",
      card_order: 3,
      link: "https://pcdp.bitsathy.ac.in/stf/pbl",
      app_route: "",
      btntext: "Open Now",
      keywords: ["pbl", "venue", "portal"],
      img: "",
      click_count: 0,
    },
  ],
  null,
  2
);

function downloadCardTemplateFile(format = "csv") {
  const isCsv = format === "csv";
  const content = isCsv ? CARD_CSV_TEMPLATE : CARD_JSON_TEMPLATE;
  const mime = isCsv ? "text/csv;charset=utf-8;" : "application/json;charset=utf-8;";
  const filename = isCsv ? "cards_template.csv" : "cards_template.json";
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function parseCardCSVText(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  const parseRow = (rowStr) => {
    const result = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if (char === '"' || char === "'") {
        if (inQuotes && rowStr[i + 1] === char) {
          cur += char;
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result.map((v) => v.replace(/^["']|["']$/g, "").trim());
  };

  const headers = parseRow(lines[0]).map((h) => h.toLowerCase().replace(/[\s_-]+/g, ""));
  const records = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    if (!values || values.length === 0 || (values.length === 1 && !values[0])) continue;
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] !== undefined ? values[idx] : "";
    });
    records.push(row);
  }

  return records.map((r, idx) => {
    const name = r.name || r.cardname || r.title || "";
    let keywords = [];
    const kwRaw = r.keywords || r.keyword || r.tags || r.tag || "";
    if (Array.isArray(kwRaw)) {
      keywords = kwRaw;
    } else if (typeof kwRaw === "string" && kwRaw.trim()) {
      if (kwRaw.startsWith("[") && kwRaw.endsWith("]")) {
        try {
          keywords = JSON.parse(kwRaw);
        } catch (e) {
          keywords = kwRaw.replace(/^\[|\]$/g, "").split(",").map((s) => s.replace(/^["']|["']$/g, "").trim()).filter(Boolean);
        }
      } else {
        keywords = kwRaw.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    const order = parseInt(r.card_order || r.cardorder || r.order || r.position || "0", 10) || (idx + 1);
    const clickCount = parseInt(r.click_count || r.clickcount || r.clicks || r.count || "0", 10) || 0;
    const img = r.img || r.image || r.icon || r.icon_url || "";
    const link = r.link || r.url || r.website || "";
    const appRoute = r.app_route || r.approute || r.route || r.app_redirection_route || "";
    const btntext = r.btntext || r.btn_text || r.buttontext || r.button_text || r.button || "";
    const id = r.id ? parseInt(r.id, 10) : undefined;

    return {
      ...(id ? { id } : {}),
      name: name.trim(),
      card_order: order,
      click_count: clickCount,
      img: img.trim(),
      keywords,
      link: link.trim(),
      app_route: appRoute.trim(),
      btntext: btntext.trim(),
    };
  }).filter((c) => c.name);
}

function parseCardJSONText(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new Error("Invalid JSON syntax: " + err.message);
  }
  const list = Array.isArray(parsed) ? parsed : (parsed?.cards || parsed?.data || []);
  if (!Array.isArray(list)) {
    throw new Error("JSON must contain an array of cards or a { cards: [...] } object");
  }

  return list.map((c, idx) => {
    let kw = c.keywords || c.tags || [];
    if (typeof kw === "string") {
      kw = kw.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return {
      ...(c.id ? { id: Number(c.id) } : {}),
      name: (c.name || c.title || "").trim(),
      card_order: Number(c.card_order ?? c.order ?? (idx + 1)),
      click_count: Number(c.click_count ?? c.clicks ?? 0),
      img: (c.img || c.image || "").trim(),
      keywords: Array.isArray(kw) ? kw : [],
      link: (c.link || c.url || "").trim(),
      app_route: (c.app_route || c.route || "").trim(),
      btntext: (c.btntext || c.btn_text || c.button_text || "").trim(),
    };
  }).filter((c) => c.name);
}

function CardForm({ initial, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(
    initial || { img: "", name: "", keywords: [], link: "", app_route: "", btntext: "" }
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setForm(initial || { img: "", name: "", keywords: [], link: "", app_route: "", btntext: "" });
  }, [initial]);

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const base64 = await fileToDataURL(file);
      setForm((p) => ({ ...p, img: base64 }));
    } catch (err) {
      console.error("card image upload error", err);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      img: form.img || null,
      name: (form.name || "").trim(),
      keywords: Array.isArray(form.keywords) ? form.keywords : (form.keywords || "").split(",").map((s) => s.trim()).filter(Boolean),
      link: (form.link || "").trim() || null,
      app_route: (form.app_route || "").trim() || null,
      btntext: (form.btntext || "").trim() || null,
    };
    if (!payload.name) return;
    onSubmit(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Card Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-900 shadow-[2px_2px_0px_#18181b] focus:outline-none dark:border-white dark:bg-[#111827] dark:text-zinc-50 dark:shadow-[2px_2px_0px_#ffffff]"
            required
            placeholder="e.g. Exam Hall Finder"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Button Text</label>
          <input
            value={form.btntext}
            onChange={(e) => setForm({ ...form, btntext: e.target.value })}
            placeholder="e.g. Open Portal"
            className="w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-900 shadow-[2px_2px_0px_#18181b] focus:outline-none dark:border-white dark:bg-[#111827] dark:text-zinc-50 dark:shadow-[2px_2px_0px_#ffffff]"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Website Link</label>
          <input
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            placeholder="e.g. /mess-menu or https://..."
            className="w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-900 shadow-[2px_2px_0px_#18181b] focus:outline-none dark:border-white dark:bg-[#111827] dark:text-zinc-50 dark:shadow-[2px_2px_0px_#ffffff]"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">App Route (Mobile)</label>
          <input
            value={form.app_route || ""}
            onChange={(e) => setForm({ ...form, app_route: e.target.value })}
            placeholder="e.g. MessMenu or /support-dev"
            className="w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-900 shadow-[2px_2px_0px_#18181b] focus:outline-none dark:border-white dark:bg-[#111827] dark:text-zinc-50 dark:shadow-[2px_2px_0px_#ffffff]"
          />
        </div>
        <div className="sm:col-span-2 space-y-1">
          <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Keywords (Comma-separated)</label>
          <input
            value={Array.isArray(form.keywords) ? form.keywords.join(", ") : form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            placeholder="e.g. hall, venue, finder, exam, sem"
            className="w-full rounded-xl border border-zinc-900 bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-900 shadow-[2px_2px_0px_#18181b] focus:outline-none dark:border-white dark:bg-[#111827] dark:text-zinc-50 dark:shadow-[2px_2px_0px_#ffffff]"
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-900 bg-zinc-50 p-4 dark:border-white dark:bg-zinc-800">
        <label className="block text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Card Image</label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={form.img}
            onChange={(e) => setForm({ ...form, img: e.target.value })}
            placeholder="Paste URL or upload image file..."
            className="flex-1 rounded-xl border border-zinc-900 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] focus:outline-none dark:border-white dark:bg-[#111827] dark:text-zinc-50 dark:shadow-[1.5px_1.5px_0px_#ffffff]"
          />
          <label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-3.5 py-2 text-xs font-bold text-zinc-900 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[1.5px_1.5px_0px_#ffffff] transition-all">
            {uploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-900 bg-white px-4 py-2 text-xs sm:text-sm font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
        >
          {isLoading && <Loader className="h-4 w-4 animate-spin" />}
          <span>{initial ? "Save Changes" : "Create Card"}</span>
        </button>
      </div>
    </form>
  );
}

function BulkCardUploadModal({ onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("file");
  const [selectedFile, setSelectedFile] = useState(null);
  const [pasteFormat, setPasteFormat] = useState("csv");
  const [pasteText, setPasteText] = useState("");
  const [importMode, setImportMode] = useState("append");
  const [parsedCards, setParsedCards] = useState([]);
  const [parseError, setParseError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = useCallback((file) => {
    if (!file) return;
    setSelectedFile(file);
    setParseError("");
    const ext = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        if (ext === "json") {
          const cards = parseCardJSONText(text);
          if (cards.length === 0) {
            setParseError("No valid cards found in JSON file (each card must have a 'name')");
          }
          setParsedCards(cards);
        } else if (ext === "csv") {
          const cards = parseCardCSVText(text);
          if (cards.length === 0) {
            setParseError("No valid cards found in CSV file (make sure headers include 'name')");
          }
          setParsedCards(cards);
        } else {
          setParseError("Unsupported file type. Please upload a .csv or .json file.");
          setParsedCards([]);
        }
      } catch (err) {
        setParseError(err.message || "Failed to parse file");
        setParsedCards([]);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) processFile(file);
  };

  const handlePasteChange = (text, format = pasteFormat) => {
    setPasteText(text);
    setParseError("");
    if (!text.trim()) {
      setParsedCards([]);
      return;
    }
    try {
      if (format === "json") {
        const cards = parseCardJSONText(text);
        if (cards.length === 0) {
          setParseError("No valid cards found (ensure each card object has a 'name' field)");
        }
        setParsedCards(cards);
      } else {
        const cards = parseCardCSVText(text);
        if (cards.length === 0) {
          setParseError("No valid cards found in CSV text (ensure header row contains 'name')");
        }
        setParsedCards(cards);
      }
    } catch (err) {
      setParseError(err.message || "Parsing error");
      setParsedCards([]);
    }
  };

  const handleDropFile = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleUpload = async () => {
    if (parsedCards.length === 0) return;
    setIsUploading(true);
    setParseError("");

    try {
      let res;
      if (activeTab === "file" && selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("mode", importMode);
        res = await bulkUploadCards(formData, true);
      } else {
        res = await bulkUploadCards({
          cards: parsedCards,
          mode: importMode,
        });
      }

      if (res?.success) {
        onSuccess(res.message || `${parsedCards.length} cards uploaded successfully`);
      } else {
        setParseError(res?.error || "Upload failed");
      }
    } catch (err) {
      setParseError(normalizeError(err, "Failed to upload cards"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs sm:p-6" onClick={onClose}>
      <div
        className="relative z-50 w-full max-w-3xl overflow-hidden rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2 border-b border-zinc-200 pb-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">Bulk Card Import</h3>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">Upload a CSV or JSON file to update or add home cards.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadCardTemplateFile("csv")}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100"
            >
              <Download className="h-3 w-3 text-emerald-600" />
              CSV
            </button>
            <button
              type="button"
              onClick={() => downloadCardTemplateFile("json")}
              className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100"
            >
              <Download className="h-3 w-3 text-blue-600" />
              JSON
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-900 p-1 text-zinc-600 hover:bg-zinc-100 dark:border-white dark:text-zinc-400"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex rounded-lg border border-zinc-900 bg-zinc-100 p-0.5 dark:border-white dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => { setActiveTab("file"); setParseError(""); }}
                className={`rounded-md px-3 py-1 text-xs font-bold transition ${activeTab === "file" ? "bg-blue-600 text-white" : "text-zinc-700 dark:text-zinc-300"}`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("paste"); setParseError(""); }}
                className={`rounded-md px-3 py-1 text-xs font-bold transition ${activeTab === "paste" ? "bg-blue-600 text-white" : "text-zinc-700 dark:text-zinc-300"}`}
              >
                Paste Raw
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-zinc-500">Mode:</span>
              <label className="flex items-center gap-1 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="cardImportMode"
                  value="append"
                  checked={importMode === "append"}
                  onChange={() => setImportMode("append")}
                  className="text-blue-600"
                />
                Append
              </label>
              <label className="flex items-center gap-1 font-bold text-rose-600 cursor-pointer">
                <input
                  type="radio"
                  name="cardImportMode"
                  value="replace"
                  checked={importMode === "replace"}
                  onChange={() => setImportMode("replace")}
                  className="text-rose-600"
                />
                Replace All
              </label>
            </div>
          </div>

          {activeTab === "file" ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDropFile}
              onClick={() => fileInputRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
                isDragging ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40" : "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".csv,.json" onChange={handleFileChange} className="sr-only" />
              <Upload className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                {selectedFile ? selectedFile.name : "Click to select or drag & drop CSV / JSON"}
              </p>
              {selectedFile && (
                <span className="mt-2 rounded-md border border-zinc-900 bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800">
                  {parsedCards.length} cards parsed
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                rows={5}
                value={pasteText}
                onChange={(e) => handlePasteChange(e.target.value, pasteFormat)}
                placeholder="Paste CSV or JSON content here..."
                className="w-full font-mono rounded-xl border border-zinc-900 bg-white p-3 text-xs font-semibold shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:text-zinc-50"
              />
            </div>
          )}

          {parseError && (
            <div className="rounded-lg border border-zinc-900 bg-rose-50 p-2.5 text-xs font-bold text-rose-800 dark:border-white dark:bg-rose-950 dark:text-rose-200">
              {parseError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-900 bg-white px-4 py-2 text-xs font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-zinc-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading || parsedCards.length === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white disabled:opacity-50"
            >
              {isUploading ? <Loader className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              <span>Import {parsedCards.length > 0 ? `${parsedCards.length} Cards` : ""}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminCardsSection() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [viewCard, setViewCard] = useState(null);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const [dropTargetId, setDropTargetId] = useState(null);
  const [banner, setBanner] = useState({ type: "", message: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const orderedCards = useMemo(() => {
    return [...cards].sort((left, right) => {
      const leftOrder = Number(left.card_order ?? 0);
      const rightOrder = Number(right.card_order ?? 0);
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return Number(left.id ?? 0) - Number(right.id ?? 0);
    });
  }, [cards]);

  const visibleCards = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orderedCards;
    return orderedCards.filter((card) => {
      const keywords = Array.isArray(card.keywords) ? card.keywords.join(" ") : "";
      return [card.name, card.link, card.btntext, keywords].join(" ").toLowerCase().includes(query);
    });
  }, [orderedCards, searchQuery]);

  const cardStats = useMemo(() => ({
    total: orderedCards.length,
    cardsWithImage: orderedCards.filter((card) => Boolean(card.img)).length,
    totalKeywords: orderedCards.reduce((count, card) => count + (Array.isArray(card.keywords) ? card.keywords.length : 0), 0),
    totalClicks: orderedCards.reduce((count, card) => count + Number(card.click_count ?? 0), 0),
  }), [orderedCards]);

  const load = useCallback(async () => {
    setLoading(true);
    setBanner({ type: "", message: "" });
    try {
      const res = await listAdminCards();
      setCards(res.data || []);
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to load cards") });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persistCardOrder = async (nextCards) => {
    const previousCards = cards;
    const normalizedCards = nextCards.map((card, index) => ({
      ...card,
      card_order: index + 1,
    }));

    setCards(normalizedCards);
    setBanner({ type: "", message: "" });

    try {
      await reorderAdminCards({ card_ids: normalizedCards.map((card) => card.id) });
      setBanner({ type: "success", message: "Card order saved successfully" });
    } catch (err) {
      setCards(previousCards);
      setBanner({ type: "error", message: normalizeError(err, "Failed to reorder cards") });
      await load();
    }
  };

  const swapCardOrder = async (fromId, toId) => {
    if (searchQuery.trim() || fromId === toId) return;

    const fromIndex = orderedCards.findIndex((card) => card.id === fromId);
    const toIndex = orderedCards.findIndex((card) => card.id === toId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const nextCards = [...orderedCards];
    [nextCards[fromIndex], nextCards[toIndex]] = [nextCards[toIndex], nextCards[fromIndex]];
    await persistCardOrder(nextCards);
  };

  const handleDragStart = (cardId) => (event) => {
    if (searchQuery.trim()) return;
    setDraggedCardId(cardId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(cardId));
  };

  const handleDragOver = (cardId) => (event) => {
    if (searchQuery.trim()) return;
    event.preventDefault();
    setDropTargetId(cardId);
  };

  const handleDrop = (cardId) => async (event) => {
    if (searchQuery.trim()) return;
    event.preventDefault();
    setDropTargetId(null);
    await swapCardOrder(draggedCardId, cardId);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDropTargetId(null);
  };

  const onCreate = async (payload) => {
    try {
      const res = await createCard(payload);
      if (res?.success) {
        setCards((current) => [...(current || []), res.data]);
        setShowForm(false);
        setBanner({ type: "success", message: "Card created successfully" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to create card") });
    }
  };

  const onUpdate = async (payload) => {
    try {
      const res = await updateCard(editItem.id, payload);
      if (res?.success) {
        setCards((current) => current.map((card) => (card.id === editItem.id ? res.data : card)));
        setEditItem(null);
        setShowForm(false);
        setBanner({ type: "success", message: "Card updated successfully" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to update card") });
    }
  };

  const onDeleteCard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      const res = await deleteCard(id);
      if (res?.success) {
        await load();
        setBanner({ type: "success", message: "Card deleted" });
      }
    } catch (err) {
      setBanner({ type: "error", message: normalizeError(err, "Failed to delete card") });
    }
  };

  return (
    <section className="rounded-2xl border border-zinc-900 bg-white shadow-[3px_3px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[3px_3px_0px_#ffffff]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-zinc-900 p-5 dark:border-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              Homepage Portals & Cards
            </h2>
            <span className="rounded-md border border-zinc-900 bg-blue-50 px-2 py-0.5 text-xs font-black text-blue-700 shadow-[1px_1px_0px_#18181b] dark:border-white dark:bg-zinc-800 dark:text-blue-300 dark:shadow-[1px_1px_0px_#ffffff]">
              {cardStats.total} cards
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Control student home portals, links, tags, and drag cards to reorder.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
          >
            <Upload className="h-3.5 w-3.5 text-blue-600" />
            <span>Bulk Upload</span>
          </button>
          <button
            type="button"
            onClick={() => { setEditItem(null); setShowForm(true); }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Card</span>
          </button>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-900 bg-white px-3.5 py-1.5 text-xs font-bold text-zinc-800 shadow-[2px_2px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 dark:shadow-[2px_2px_0px_#ffffff] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {banner.message && (
          <AdminBanner banner={banner} onDismiss={() => setBanner({ type: "", message: "" })} />
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cards by title, keywords, or link..."
            className="w-full rounded-xl border border-zinc-900 bg-white pl-9 pr-8 py-2 text-xs sm:text-sm font-semibold text-zinc-900 shadow-[2px_2px_0px_#18181b] placeholder:text-zinc-400 focus:outline-none dark:border-white dark:bg-[#111827] dark:text-zinc-50 dark:shadow-[2px_2px_0px_#ffffff]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Cards list */}
        {loading ? (
          <div className="flex h-36 items-center justify-center">
            <Loader className="h-7 w-7 animate-spin text-blue-600" />
          </div>
        ) : visibleCards.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 p-6 dark:border-zinc-700">
            <p className="text-sm font-black text-zinc-700 dark:text-zinc-300">{searchQuery ? "No matching cards" : "No cards configured"}</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {visibleCards.map((card, index) => {
              const keywords = Array.isArray(card.keywords) ? card.keywords : [];
              const isDragging = draggedCardId === card.id;
              const isDropTarget = dropTargetId === card.id;

              return (
                <div
                  key={card.id}
                  draggable={!searchQuery.trim()}
                  onDragStart={handleDragStart(card.id)}
                  onDragOver={handleDragOver(card.id)}
                  onDrop={handleDrop(card.id)}
                  onDragEnd={handleDragEnd}
                  className={`flex flex-col gap-3 rounded-xl border border-zinc-900 bg-white p-4 shadow-[2px_2px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[2px_2px_0px_#ffffff] sm:flex-row sm:items-center transition-all ${
                    isDragging ? "opacity-40" : ""
                  } ${isDropTarget ? "ring-2 ring-blue-600" : ""}`}
                >
                  <div
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-900 bg-zinc-100 text-zinc-600 dark:border-white dark:bg-zinc-800 dark:text-zinc-300 cursor-grab active:cursor-grabbing"
                    title={searchQuery.trim() ? "Clear search to reorder" : "Drag row to reorder"}
                  >
                    <GripVertical className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-zinc-900 bg-zinc-100 px-2 py-0.2 text-[10px] font-black uppercase text-zinc-700 dark:border-white dark:bg-zinc-800 dark:text-zinc-200">
                        Order #{card.card_order ?? index + 1}
                      </span>
                      <span className="rounded-md border border-zinc-900 bg-blue-50 px-2 py-0.2 text-[10px] font-black uppercase text-blue-700 dark:border-white dark:bg-blue-950 dark:text-blue-300">
                        {card.click_count ?? 0} clicks
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                      <h4 className="text-sm font-black text-zinc-900 dark:text-zinc-50 truncate">
                        {card.name}
                      </h4>
                      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 truncate">
                        {card.link || card.app_route || "No URL"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {keywords.map((k) => (
                        <span key={k} className="rounded border border-zinc-300 bg-zinc-50 px-1.5 py-0.2 text-[10px] font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setViewCard(card)}
                      disabled={!card.img}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 disabled:opacity-40 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditItem(card); setShowForm(true); }}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-white px-2.5 py-1 text-xs font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCard(card.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-900 bg-rose-600 px-2.5 py-1 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#18181b] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 dark:border-white cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Card Image Modal */}
      {viewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onClick={() => setViewCard(null)}>
          <div
            className="w-full max-w-lg rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4 dark:border-zinc-800">
              <h3 className="text-base font-black text-zinc-900 dark:text-zinc-50">{viewCard.name}</h3>
              <button
                type="button"
                onClick={() => setViewCard(null)}
                className="rounded-lg border border-zinc-900 p-1 text-zinc-600 hover:bg-zinc-100 dark:border-white dark:text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {viewCard.img ? (
              <img src={viewCard.img} alt={viewCard.name} className="max-h-[60vh] w-full rounded-xl border border-zinc-900 object-contain dark:border-white" />
            ) : (
              <p className="text-center text-xs text-zinc-500">No image attached</p>
            )}
          </div>
        </div>
      )}

      {/* Edit / Add Card Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" onClick={() => { setShowForm(false); setEditItem(null); }}>
          <div
            className="w-full max-w-xl rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#111827] dark:shadow-[6px_6px_0px_#ffffff]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4 dark:border-zinc-800">
              <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50">
                {editItem ? "Edit Card" : "New Card"}
              </h3>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditItem(null); }}
                className="rounded-lg border border-zinc-900 p-1 text-zinc-600 hover:bg-zinc-100 dark:border-white dark:text-zinc-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <CardForm
              initial={editItem}
              onSubmit={editItem ? onUpdate : onCreate}
              onCancel={() => { setShowForm(false); setEditItem(null); }}
              isLoading={false}
            />
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <BulkCardUploadModal
          onClose={() => setShowBulkModal(false)}
          onSuccess={async (msg) => {
            setShowBulkModal(false);
            setBanner({ type: "success", message: msg });
            await load();
          }}
        />
      )}
    </section>
  );
}

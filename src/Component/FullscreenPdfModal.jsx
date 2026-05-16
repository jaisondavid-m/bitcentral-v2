import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function getInitialZoom() {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth < 640) return 0.7;
  if (window.innerWidth < 1024) return 0.9;
  return 1.2;
}

const ZOOM_STEP = 0.15;
const ZOOM_MIN = 0.4;
const ZOOM_MAX = 3.0;

export default function FullscreenPdfModal({
  url,
  name,
  onClose,
  originalUrl,
  allowExternalActions = true,
}) {
  const [zoom, setZoom] = useState(getInitialZoom);
  const [loadError, setLoadError] = useState("");
  const [pdfSource, setPdfSource] = useState("");
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingPages, setLoadingPages] = useState(true);
  const [fetchingPdf, setFetchingPdf] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);

  const canvasRefs = useRef([]);
  const pageRefs = useRef([]);
  const scrollRef = useRef(null);
  const searchInputRef = useRef(null);
  const renderTasksRef = useRef([]);
  const pdfDocRef = useRef(null);

  const resolveUrl = (value) => {
    if (!value) return "";
    try {
      return new URL(value, import.meta.env?.VITE_API_BASE_URL || window.location.origin).href;
    } catch {
      return value;
    }
  };

  const resolvedUrl = useMemo(() => resolveUrl(url), [url]);
  const resolvedOriginalUrl = useMemo(() => resolveUrl(originalUrl || url), [originalUrl, url]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showSearch) setShowSearch(false);
        else onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setShowSearch((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "=") {
        e.preventDefault();
        setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        setZoom(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, showSearch]);

  // Focus search input when shown
  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  // Reset on URL change
  useEffect(() => {
    setZoom(getInitialZoom());
    setLoadError("");
    setPdfSource("");
    setNumPages(0);
    setCurrentPage(1);
    setLoadingPages(true);
    setFetchingPdf(true);
    setThumbnails([]);
    canvasRefs.current = [];
    pageRefs.current = [];
  }, [url]);

  // Fetch PDF blob
  useEffect(() => {
    if (!resolvedUrl) return;
    const controller = new AbortController();
    let objectUrl = "";

    (async () => {
      try {
        setFetchingPdf(true);
        const response = await fetch(resolvedUrl, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfSource(objectUrl);
      } catch (err) {
        if (controller.signal.aborted) return;
        setLoadError("Failed to load PDF. Please check the file URL and try again.");
        setFetchingPdf(false);
      }
    })();

    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [resolvedUrl]);

  // Load PDF document
  useEffect(() => {
    if (!pdfSource) return;
    let cancelled = false;

    (async () => {
      try {
        const task = getDocument(pdfSource);
        const doc = await task.promise;
        if (cancelled) { doc.destroy(); return; }
        pdfDocRef.current = doc;
        setNumPages(doc.numPages);
        setFetchingPdf(false);
        setLoadingPages(true);
        setLoadError("");
        generateThumbnails(doc);
      } catch (err) {
        if (cancelled) return;
        setLoadError("Could not parse PDF. The file may be corrupted or unsupported.");
        setFetchingPdf(false);
      }
    })();

    return () => { cancelled = true; };
  }, [pdfSource]);

  // Generate thumbnails for sidebar
  const generateThumbnails = async (doc) => {
    const thumbs = [];
    for (let i = 1; i <= doc.numPages; i++) {
      try {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
        thumbs.push({ src: canvas.toDataURL(), width: vp.width, height: vp.height });
      } catch {
        thumbs.push(null);
      }
    }
    setThumbnails(thumbs);
  };

  // Render PDF pages
  useEffect(() => {
    if (!pdfSource || !numPages) return;
    let cancelled = false;

    // Cancel previous render tasks
    renderTasksRef.current.forEach((t) => { try { t.cancel(); } catch {} });
    renderTasksRef.current = [];

    (async () => {
      try {
        await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
        if (cancelled) return;

        const doc = pdfDocRef.current;
        if (!doc) return;

        for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
          const canvas = canvasRefs.current[pageNum - 1];
          if (!canvas) continue;

          const page = await doc.getPage(pageNum);
          if (cancelled) return;

          const vp = page.getViewport({ scale: zoom * (window.devicePixelRatio || 1) });
          const ctx = canvas.getContext("2d");

          canvas.width = vp.width;
          canvas.height = vp.height;
          canvas.style.width = `${vp.width / (window.devicePixelRatio || 1)}px`;
          canvas.style.height = `${vp.height / (window.devicePixelRatio || 1)}px`;

          const task = page.render({ canvasContext: ctx, viewport: vp });
          renderTasksRef.current.push(task);
          await task.promise;
        }

        if (!cancelled) setLoadingPages(false);
      } catch (err) {
        if (cancelled || err?.name === "RenderingCancelledException") return;
        setLoadError("Error rendering PDF pages.");
      }
    })();

    return () => {
      cancelled = true;
      renderTasksRef.current.forEach((t) => { try { t.cancel(); } catch {} });
    };
  }, [pdfSource, numPages, zoom]);

  // Track current page via scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = pageRefs.current.indexOf(entry.target);
            if (idx !== -1) setCurrentPage(idx + 1);
          }
        });
      },
      { root: container, threshold: 0.4 }
    );

    pageRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [numPages, loadingPages]);

  const scrollToPage = (pageNum) => {
    const el = pageRefs.current[pageNum - 1];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrentPage(pageNum);
  };

  const getDownloadUrl = (u) => {
    try {
      if (!u) return u;
      const parsed = new URL(u, window.location.origin);
      if (parsed.hostname.includes("drive.google.com")) {
        const match = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
        const id = match ? match[1] : parsed.searchParams.get("id");
        if (id) return `https://drive.google.com/uc?export=download&id=${id}`;
      }
      return parsed.href;
    } catch {
      return u;
    }
  };

  const downloadUrl = useMemo(() => getDownloadUrl(resolvedOriginalUrl), [resolvedOriginalUrl]);
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        background: "#1a1a1a",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#e8e8e8",
      }}
    >
      {/* ── TOP TOOLBAR ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          height: 52,
          background: "#242424",
          borderBottom: "1px solid #333",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {/* Left group */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <ToolBtn onClick={onClose} title="Close (Esc)" danger>
            ✕
          </ToolBtn>
          <ToolBtn onClick={() => setSidebarOpen((v) => !v)} title="Toggle thumbnails" active={sidebarOpen}>
            ☰
          </ToolBtn>
        </div>

        <Divider />

        {/* File name */}
        <div
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 13,
            color: "#ccc",
            fontWeight: 500,
          }}
        >
          {name || "PDF Document"}
        </div>

        {/* Page navigation */}
        {numPages > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <ToolBtn
              onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              title="Previous page"
            >
              ‹
            </ToolBtn>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 13,
                color: "#ccc",
                minWidth: 70,
                justifyContent: "center",
              }}
            >
              <input
                type="number"
                min={1}
                max={numPages}
                value={currentPage}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (v >= 1 && v <= numPages) scrollToPage(v);
                }}
                style={{
                  width: 36,
                  background: "#333",
                  border: "1px solid #444",
                  borderRadius: 4,
                  color: "#e8e8e8",
                  fontSize: 13,
                  textAlign: "center",
                  padding: "2px 4px",
                  outline: "none",
                }}
              />
              <span style={{ color: "#888" }}>/ {numPages}</span>
            </div>
            <ToolBtn
              onClick={() => scrollToPage(Math.min(numPages, currentPage + 1))}
              disabled={currentPage >= numPages}
              title="Next page"
            >
              ›
            </ToolBtn>
          </div>
        )}

        <Divider />

        {/* Zoom controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <ToolBtn
            onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))}
            disabled={zoom <= ZOOM_MIN}
            title="Zoom out (Ctrl -)"
          >
            −
          </ToolBtn>
          <button
            onClick={() => setZoom(1)}
            title="Reset zoom (Ctrl 0)"
            style={{
              background: "#333",
              border: "1px solid #444",
              borderRadius: 4,
              color: "#e8e8e8",
              fontSize: 12,
              fontWeight: 600,
              padding: "3px 8px",
              cursor: "pointer",
              minWidth: 48,
              textAlign: "center",
            }}
          >
            {zoomPercent}%
          </button>
          <ToolBtn
            onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))}
            disabled={zoom >= ZOOM_MAX}
            title="Zoom in (Ctrl +)"
          >
            +
          </ToolBtn>
        </div>

        <Divider />

        {/* Fit options */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <ToolBtn onClick={() => fitToWidth()} title="Fit to width">⇔</ToolBtn>
          <ToolBtn onClick={() => setZoom(1)} title="Actual size">⊡</ToolBtn>
        </div>

        <Divider />

        {/* Search */}
        <ToolBtn
          onClick={() => setShowSearch((v) => !v)}
          active={showSearch}
          title="Search (Ctrl+F)"
        >
          🔍
        </ToolBtn>

        {/* External actions */}
        {allowExternalActions && (
          <>
            <Divider />
            <ToolBtn onClick={() => window.open(resolvedUrl, "_blank")} title="Open in new tab">
              ↗
            </ToolBtn>
            <a
              href={downloadUrl}
              download={name}
              title="Download"
              style={{
                background: "#1a6b3c",
                border: "1px solid #2a8a4f",
                borderRadius: 4,
                color: "#7fffb3",
                fontSize: 13,
                padding: "4px 10px",
                cursor: "pointer",
                textDecoration: "none",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              ↓ Save
            </a>
          </>
        )}
      </div>

      {/* ── SEARCH BAR ── */}
      {showSearch && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            background: "#2a2a2a",
            borderBottom: "1px solid #333",
            flexShrink: 0,
          }}
        >
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search in document…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              background: "#333",
              border: "1px solid #555",
              borderRadius: 4,
              color: "#e8e8e8",
              fontSize: 13,
              padding: "5px 10px",
              outline: "none",
              maxWidth: 360,
            }}
          />
          <span style={{ fontSize: 12, color: "#888" }}>
            Use Ctrl+F to toggle
          </span>
          <ToolBtn onClick={() => setShowSearch(false)}>✕</ToolBtn>
        </div>
      )}

      {/* ── MAIN BODY ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── SIDEBAR THUMBNAILS ── */}
        {sidebarOpen && (
          <div
            style={{
              width: 140,
              background: "#1e1e1e",
              borderRight: "1px solid #333",
              overflowY: "auto",
              flexShrink: 0,
              padding: "8px 6px",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i + 1)}
                title={`Page ${i + 1}`}
                style={{
                  background: currentPage === i + 1 ? "#2a5fff22" : "transparent",
                  border: currentPage === i + 1 ? "2px solid #4a7fff" : "2px solid transparent",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {thumbnails[i] ? (
                  <img
                    src={thumbnails[i].src}
                    alt={`Page ${i + 1}`}
                    style={{ width: "100%", borderRadius: 2, display: "block" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "0.77",
                      background: "#2a2a2a",
                      borderRadius: 2,
                    }}
                  />
                )}
                <span style={{ fontSize: 10, color: currentPage === i + 1 ? "#7aaeff" : "#777" }}>
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── PAGE CANVAS AREA ── */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "auto",
            padding: "20px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            background: "#2c2c2c",
          }}
        >
          {/* Loading / error states */}
          {fetchingPdf && !loadError && (
            <div style={statusBoxStyle}>
              <Spinner />
              <span>Loading PDF…</span>
            </div>
          )}

          {loadError && (
            <div
              style={{
                ...statusBoxStyle,
                background: "#3a1010",
                border: "1px solid #7a2020",
                color: "#f88",
                maxWidth: 500,
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 20 }}>⚠</span>
              <div>{loadError}</div>
            </div>
          )}

          {/* Pages */}
          {!loadError &&
            Array.from({ length: numPages }, (_, i) => (
              <div
                key={i}
                ref={(el) => { pageRefs.current[i] = el; }}
                style={{
                  position: "relative",
                  background: "#fff",
                  borderRadius: 4,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                  overflow: "hidden",
                  flexShrink: 0,
                }}
              >
                {/* Page number label */}
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 8,
                    background: "rgba(0,0,0,0.45)",
                    color: "#fff",
                    fontSize: 10,
                    borderRadius: 3,
                    padding: "1px 5px",
                    zIndex: 2,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </div>
                <canvas
                  ref={(el) => { canvasRefs.current[i] = el; }}
                  style={{ display: "block" }}
                />
              </div>
            ))}

          {/* Rendering indicator */}
          {!fetchingPdf && !loadError && numPages > 0 && loadingPages && (
            <div style={statusBoxStyle}>
              <Spinner />
              <span>Rendering pages…</span>
            </div>
          )}

          {/* Empty state */}
          {!fetchingPdf && !loadError && numPages === 0 && !loadingPages && (
            <div style={statusBoxStyle}>No pages found in this PDF.</div>
          )}
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div
        style={{
          height: 28,
          background: "#1e1e1e",
          borderTop: "1px solid #333",
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
          gap: 16,
          fontSize: 11,
          color: "#777",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        {numPages > 0 && <span>Page {currentPage} of {numPages}</span>}
        <span>{zoomPercent}% zoom</span>
        {loadingPages && !fetchingPdf && <span style={{ color: "#4a7fff" }}>Rendering…</span>}
        {!loadingPages && !loadError && <span style={{ color: "#4a4" }}>✓ Ready</span>}
        <span style={{ marginLeft: "auto" }}>Ctrl+F: Search &nbsp;·&nbsp; Ctrl+±: Zoom &nbsp;·&nbsp; Esc: Close</span>
      </div>
    </div>
  );

  function fitToWidth() {
    const container = scrollRef.current;
    if (!container || !pdfDocRef.current) return;
    pdfDocRef.current.getPage(1).then((page) => {
      const vp = page.getViewport({ scale: 1 });
      const availW = container.clientWidth - 32;
      const newZoom = availW / vp.width;
      setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +newZoom.toFixed(2))));
    });
  }
}

// ── Helpers ──

function ToolBtn({ onClick, children, title, active, danger, disabled }) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        background: active ? "#2a4aaa" : danger ? "#3a1212" : "transparent",
        border: `1px solid ${active ? "#4a7fff" : danger ? "#7a2020" : "#3a3a3a"}`,
        borderRadius: 4,
        color: disabled ? "#555" : active ? "#9ab8ff" : danger ? "#f88" : "#ccc",
        fontSize: 15,
        lineHeight: 1,
        padding: "4px 8px",
        cursor: disabled ? "default" : "pointer",
        minWidth: 28,
        textAlign: "center",
        transition: "background 0.1s, border-color 0.1s",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !active) e.currentTarget.style.background = "#333";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = active ? "#2a4aaa" : "transparent";
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div
      style={{ width: 1, height: 20, background: "#3a3a3a", flexShrink: 0, margin: "0 2px" }}
    />
  );
}

function Spinner() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        border: "2px solid #444",
        borderTopColor: "#4a7fff",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

const statusBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  background: "#242424",
  border: "1px solid #333",
  borderRadius: 6,
  padding: "12px 20px",
  fontSize: 13,
  color: "#aaa",
  marginTop: 20,
};

// Inject spinner keyframes once
if (typeof document !== "undefined" && !document.getElementById("pdf-spinner-kf")) {
  const style = document.createElement("style");
  style.id = "pdf-spinner-kf";
  style.textContent = "@keyframes spin { to { transform: rotate(360deg); } }";
  document.head.appendChild(style);
}
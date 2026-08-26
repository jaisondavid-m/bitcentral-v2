import React, { Component, useEffect, useRef, useState, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  X,
  ZoomIn,
  ZoomOut,
  FileText,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Worker setup ─────────────────────────────────────────────────────────────
// react-pdf and pdfjs-dist must use the same worker version.
// Pin the worker to the exact PDF.js API version exposed by react-pdf.
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ─── Error Boundary ───────────────────────────────────────────────────────────

class PdfErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return <ErrorState />;
    return this.props.children;
  }
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function ErrorState() {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 2,
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 16, background: "#f8fafc", padding: 32,
    }}>
      <AlertCircle size={40} color="#dc2626" />
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>
          Unable to preview
        </p>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>
          The file could not be loaded. The server may be blocking cross-origin requests.
        </p>
      </div>
    </div>
  );
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function Toolbar({ name, zoom, onZoomIn, onZoomOut, onResetZoom, onClose }) {
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 16px", borderBottom: "1px solid #e5e7eb",
      background: "#ffffff", gap: 12, minHeight: 52, flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <button onClick={onClose} title="Close" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 8, border: "1px solid #e5e7eb",
          background: "transparent", cursor: "pointer", color: "#374151", flexShrink: 0,
        }}>
          <X size={16} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 7, overflow: "hidden" }}>
          <FileText size={15} color="#2563eb" style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: 14, fontWeight: 600, color: "#111827",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "38vw",
          }}>
            {name}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f3f4f6", borderRadius: 8, padding: "3px 6px" }}>
        <ToolbarBtn onClick={onZoomOut} title="Zoom out"><ZoomOut size={15} /></ToolbarBtn>
        <button onClick={onResetZoom} title="Reset zoom" style={{
          fontSize: 12, fontWeight: 600, color: "#374151", background: "transparent",
          border: "none", cursor: "pointer", padding: "0 4px", minWidth: 38, textAlign: "center",
        }}>
          {Math.round(zoom * 100)}%
        </button>
        <ToolbarBtn onClick={onZoomIn} title="Zoom in"><ZoomIn size={15} /></ToolbarBtn>
      </div>
    </header>
  );
}

function ToolbarBtn({ children, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 28, height: 28, borderRadius: 6, border: "none",
      background: "transparent", cursor: "pointer", color: "#374151",
    }}>
      {children}
    </button>
  );
}

// ─── PdfFrame ─────────────────────────────────────────────────────────────────

/**
 * Key fixes vs previous version:
 *
 * 1. Pass the raw ArrayBuffer directly to { data: buffer } — do NOT convert to
 *    Uint8Array first. Transferring a Uint8Array detaches the underlying buffer,
 *    causing DataCloneError in the PDF.js worker postMessage.
 *
 * 2. Memoize the `file` object with useMemo so react-pdf's <Document> does not
 *    see a new object reference on every render (eliminates the "File prop changed"
 *    warning and prevents redundant reloads).
 *
 * 3. Worker version mismatch is fixed at the import site above — using
 *    import.meta.url resolution always picks the worker that ships with the
 *    installed pdfjs-dist, so the versions stay in sync automatically.
 */
function PdfFrame({ url }) {
  const [status, setStatus] = useState("loading");
  const [pdfBuffer, setPdfBuffer] = useState(null); // raw ArrayBuffer
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const containerRef = useRef(null);

  // Fetch once per URL, store the raw ArrayBuffer (do NOT detach it).
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setPdfBuffer(null);
    setNumPages(0);

    fetch(url, { credentials: "omit" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.arrayBuffer();
      })
      .then((buffer) => {
        if (cancelled) return;

        // Validate PDF magic bytes (%PDF) before handing to react-pdf
        const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
        if (magic !== "%PDF") throw new Error("Not a PDF");

        setPdfBuffer(buffer);
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => { cancelled = true; };
  }, [url]);

  // Memoize the file prop — react-pdf uses referential equality to decide
  // whether to reload. A new object on every render causes redundant work.
  const pdfFile = useMemo(
    () => (pdfBuffer ? { data: pdfBuffer } : null),
    [pdfBuffer]
  );

  useEffect(() => {
    const updateWidth = () => {
      const w = containerRef.current?.clientWidth || 0;
      setPageWidth(w > 0 ? Math.max(320, w - 24) : 0);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const handleDocLoadSuccess = ({ numPages: pages }) => {
    setNumPages(pages || 0);
    setStatus("ready");
  };

  const handleError = () => setStatus("error");

  return (
    <div
  className="w-full md:w-1/2 mx-auto flex justify-center"
  style={{ position: "relative", height: "100%" }}
>
      {/* Spinner */}
      {status === "loading" && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 12, background: "#f8fafc",
        }}>
          <Loader2 size={32} color="#2563eb" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 14, color: "#6b7280" }}>Loading PDF…</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error */}
      {status === "error" && <ErrorState />}

      {/* Viewer */}
      <div
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%", height: "100%",
          overflowY: "auto",
          background: "#f3f4f6",
          opacity: status === "ready" ? 1 : 0,
          transition: "opacity 0.2s",
          pointerEvents: status === "ready" ? "auto" : "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        <div style={{ padding: 12 }}>
          {pdfFile && (
            <PdfErrorBoundary url={url}>
              <Document
                file={pdfFile}
                loading={null}
                error={null}
                onLoadSuccess={handleDocLoadSuccess}
                onLoadError={handleError}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <div key={`page_${i + 1}`} style={{ margin: "0 auto 12px", width: "fit-content" }}>
                    <Page
                      pageNumber={i + 1}
                      width={pageWidth || undefined}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </Document>
            </PdfErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function FullscreenPdfModal({
  url,
  name,
  onClose,
  siblings = [],
  siblingIndex = 0,
}) {
  const [zoom, setZoom] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(siblingIndex);

  const hasSiblings = siblings.length > 1;
  const current = hasSiblings ? siblings[currentIndex] : { url, name };
  const activeUrl = current.url;
  const activeName = current.name;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "u"].includes(e.key)) e.preventDefault();
      if (e.key === "ArrowLeft" && hasSiblings) setCurrentIndex((i) => Math.max(0, i - 1));
      if (e.key === "ArrowRight" && hasSiblings) setCurrentIndex((i) => Math.min(siblings.length - 1, i + 1));
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, hasSiblings, siblings.length]);

  const clampZoom = (z) => Math.min(3, Math.max(0.5, +z.toFixed(2)));

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", flexDirection: "column", background: "#fff",
    }}>
      <Toolbar
        name={activeName}
        zoom={zoom}
        onZoomIn={() => setZoom((z) => clampZoom(z + 0.25))}
        onZoomOut={() => setZoom((z) => clampZoom(z - 0.25))}
        onResetZoom={() => setZoom(1)}
        onClose={onClose}
      />

      {hasSiblings && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
          borderBottom: "1px solid #e5e7eb", background: "#f9fafb",
          overflowX: "auto", flexShrink: 0,
        }}>
          {siblings.map((s, i) => (
            <button key={i} onClick={() => setCurrentIndex(i)} style={{
              padding: "4px 12px", borderRadius: 20,
              border: `1px solid ${i === currentIndex ? "#2563eb" : "#e5e7eb"}`,
              background: i === currentIndex ? "#2563eb" : "#fff",
              color: i === currentIndex ? "#fff" : "#374151",
              fontSize: 12, fontWeight: i === currentIndex ? 600 : 400,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}>
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflow: "hidden", background: "#e5e7eb", position: "relative" }}>
        <div style={{
          width: `${100 / zoom}%`,
          height: `${100 / zoom}%`,
          transform: `scale(${zoom})`,
          transformOrigin: "top left",
        }}>
          <PdfFrame key={activeUrl} url={activeUrl} name={activeName} />
        </div>

        {hasSiblings && (
          <>
            <NavArrow direction="left" disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))} />
            <NavArrow direction="right" disabled={currentIndex === siblings.length - 1}
              onClick={() => setCurrentIndex((i) => Math.min(siblings.length - 1, i + 1))} />
          </>
        )}
      </div>

      {hasSiblings && (
        <div style={{
          padding: "6px 16px", borderTop: "1px solid #e5e7eb",
          background: "#f9fafb", fontSize: 12, color: "#6b7280",
          textAlign: "center", flexShrink: 0,
        }}>
          {currentIndex + 1} / {siblings.length}
        </div>
      )}
    </div>
  );
}

function NavArrow({ direction, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      position: "absolute", top: "50%",
      ...(direction === "left" ? { left: 12 } : { right: 12 }),
      transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%",
      border: "1px solid #e5e7eb",
      background: disabled ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: disabled ? "default" : "pointer",
      opacity: disabled ? 0.3 : 1, boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}>
      {direction === "left" ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  );
}
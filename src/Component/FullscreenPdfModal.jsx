import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  FileText,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── helpers ────────────────────────────────────────────────────────────────

function getApiBase() {
  return (import.meta.env.VITE_API_BASE_URL || window.location.origin).replace(/\/$/, "");
}

function normalizeUrl(url) {
  return typeof url === "string" ? url.trim() : url;
}

function getDriveId(url) {
  try {
    const parsed = new URL(normalizeUrl(url));
    if (!parsed.hostname.includes("drive.google.com")) return null;
    const match = parsed.pathname.match(/(?:\/file\/d\/|\/d\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : parsed.searchParams.get("id");
  } catch {
    return null;
  }
}

function getDrivePreviewUrl(id) {
  return `https://drive.google.com/file/d/${id}/preview?rm=minimal`;
}

function getDriveProxyUrl(id, download = false) {
  return `${getApiBase()}/pdf/${id}${download ? "?download=1" : ""}`;
}

function getViewUrl(url) {
  const driveId = getDriveId(url);
  if (!driveId) return normalizeUrl(url);
  return import.meta.env.PROD ? getDriveProxyUrl(driveId) : getDrivePreviewUrl(driveId);
}

function getDownloadUrl(url) {
  const driveId = getDriveId(url);
  if (!driveId) return normalizeUrl(url);
  return import.meta.env.PROD
    ? getDriveProxyUrl(driveId, true)
    : `https://drive.google.com/uc?export=download&id=${driveId}`;
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function Toolbar({ name, zoom, onZoomIn, onZoomOut, onResetZoom, onNewTab, onClose, downloadUrl, allowExternalActions }) {
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

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
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

        {allowExternalActions && (
          <>
            <ToolbarBtn onClick={onNewTab} title="Open in new tab"><ExternalLink size={15} /></ToolbarBtn>
            <a href={downloadUrl} download={name} title="Download" style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: 8, border: "1px solid #bbf7d0",
              background: "#f0fdf4", color: "#15803d", cursor: "pointer",
              textDecoration: "none", flexShrink: 0,
            }}>
              <Download size={15} />
            </a>
          </>
        )}
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
 * FIX: Previously the component detected mobile and immediately showed a
 * static fallback without ever attempting to render the PDF. This caused the
 * PDF to never open on mobile.
 *
 * New strategy:
 * 1. Always attempt iframe rendering on ALL platforms (mobile + desktop).
 * 2. Use a fallback timer (LOAD_TIMEOUT_MS). If onLoad fires → ready.
 *    If it never fires → assume silent success (PDF rendered natively by browser).
 * 3. If onError fires → show the "unable to preview" error UI with open/download links.
 * 4. On mobile, after the iframe is visible, show an optional sticky banner
 *    with "Open" and "Download" links as a convenience — but don't block the iframe.
 *
 * Many mobile browsers (Chrome Android, Safari iOS) CAN render PDFs in iframes
 * when the server sends correct Content-Type headers. We let them try first.
 */
const LOAD_TIMEOUT_MS = 8000; // slightly longer for slower mobile connections

function PdfFrame({ url, name, allowExternalActions }) {
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const timerRef = useRef(null);
  const src = getViewUrl(url);

  const isMobile =
    typeof navigator !== "undefined" &&
    /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

  // Reset and arm the fallback timer whenever the URL changes
  useEffect(() => {
    setStatus("loading");
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      // Still loading after timeout → assume the PDF rendered silently (common on mobile)
      setStatus((prev) => (prev === "loading" ? "ready" : prev));
    }, LOAD_TIMEOUT_MS);

    return () => clearTimeout(timerRef.current);
  }, [src]);

  const handleLoad = () => {
    clearTimeout(timerRef.current);
    // Small delay: some browsers fire onLoad before the PDF plugin has painted
    setTimeout(() => setStatus("ready"), 150);
  };

  const handleError = () => {
    clearTimeout(timerRef.current);
    setStatus("error");
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Spinner overlay — shown while loading */}
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

      {/* Error state — shown only if iframe explicitly fires onError */}
      {status === "error" && (
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
              This file may require sign-in or may be restricted.
            </p>
          </div>
          {allowExternalActions && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <a href={src} target="_blank" rel="noreferrer" style={btnStyle("#2563eb", "#fff")}>Open in new tab</a>
              <a href={getDownloadUrl(url)} download={name} style={btnStyle("#f0fdf4", "#15803d", "#bbf7d0")}>Download</a>
            </div>
          )}
        </div>
      )}

      {/*
        The iframe is ALWAYS in the DOM regardless of status so the browser
        starts fetching the PDF immediately. Hidden visually until ready.
        This works on both desktop and mobile — mobile Chrome/Safari can render
        PDFs natively inside iframes when content-type is correct.
      */}
      <iframe
        key={src}
        src={src}
        title={name}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          position: "absolute", top: 0, left: 0,
          width: "100%", height: "100%",
          border: "none", display: "block",
          opacity: status === "ready" ? 1 : 0,
          transition: "opacity 0.2s",
          pointerEvents: status === "ready" ? "auto" : "none",
        }}
      />

      {/*
        Mobile convenience banner — shown after PDF loads.
        Does NOT block the PDF; sits as a floating strip at the bottom.
        Users who prefer to open externally can tap here.
      */}
      {isMobile && status === "ready" && allowExternalActions && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 3,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          padding: "10px 16px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(6px)",
          borderTop: "1px solid #e5e7eb",
        }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>Having trouble viewing?</span>
          <a href={src} target="_blank" rel="noreferrer" style={btnStyle("#2563eb", "#fff")}>Open</a>
          <a href={getDownloadUrl(url)} download={name} style={btnStyle("#f0fdf4", "#15803d", "#bbf7d0")}>Download</a>
        </div>
      )}
    </div>
  );
}

function btnStyle(bg, color, border) {
  return {
    padding: "7px 14px", borderRadius: 8, background: bg, color,
    border: border ? `1px solid ${border}` : "none",
    fontSize: 13, fontWeight: 500, textDecoration: "none",
    display: "inline-block",
  };
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function FullscreenPdfModal({
  url,
  name,
  onClose,
  originalUrl,
  allowExternalActions = true,
  siblings = [],
  siblingIndex = 0,
}) {
  const [zoom, setZoom] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(siblingIndex);

  const hasSiblings = siblings.length > 1;
  const current = hasSiblings ? siblings[currentIndex] : { url, name, allowExternalActions };
  const activeUrl = current.url;
  const activeName = current.name;
  const activeAllow = current.allowExternalActions ?? true;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
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
        onNewTab={() => window.open(getViewUrl(activeUrl), "_blank")}
        downloadUrl={getDownloadUrl(originalUrl || activeUrl)}
        onClose={onClose}
        allowExternalActions={activeAllow}
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
          <PdfFrame key={activeUrl} url={activeUrl} name={activeName} allowExternalActions={activeAllow} />
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
      [direction === "left" ? "left" : "right"]: 12,
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

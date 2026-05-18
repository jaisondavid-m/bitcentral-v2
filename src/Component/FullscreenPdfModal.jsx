import React, { useEffect, useState } from "react";
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

function isDirectPdf(url) {
  try {
    return new URL(normalizeUrl(url)).pathname.toLowerCase().endsWith(".pdf");
  } catch {
    return false;
  }
}

// ─── Toolbar ─────────────────────────────────────────────────────────────────

function Toolbar({ name, zoom, onZoomIn, onZoomOut, onResetZoom, onNewTab, onClose, downloadUrl, allowExternalActions }) {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        borderBottom: "1px solid #e5e7eb",
        background: "#ffffff",
        gap: 12,
        minHeight: 52,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <button
          onClick={onClose}
          title="Close"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "transparent",
            cursor: "pointer",
            color: "#374151",
            flexShrink: 0,
          }}
        >
          <X size={16} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 7, overflow: "hidden" }}>
          <FileText size={15} color="#2563eb" style={{ flexShrink: 0 }} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#111827",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "38vw",
            }}
          >
            {name}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "#f3f4f6",
            borderRadius: 8,
            padding: "3px 6px",
          }}
        >
          <ToolbarBtn onClick={onZoomOut} title="Zoom out">
            <ZoomOut size={15} />
          </ToolbarBtn>
          <button
            onClick={onResetZoom}
            title="Reset zoom"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#374151",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0 4px",
              minWidth: 38,
              textAlign: "center",
            }}
          >
            {Math.round(zoom * 100)}%
          </button>
          <ToolbarBtn onClick={onZoomIn} title="Zoom in">
            <ZoomIn size={15} />
          </ToolbarBtn>
        </div>

        {allowExternalActions && (
          <>
            <ToolbarBtn onClick={onNewTab} title="Open in new tab" variant="ghost">
              <ExternalLink size={15} />
            </ToolbarBtn>
            <a
              href={downloadUrl}
              download={name}
              title="Download"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid #bbf7d0",
                background: "#f0fdf4",
                color: "#15803d",
                cursor: "pointer",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <Download size={15} />
            </a>
          </>
        )}
      </div>
    </header>
  );
}

function ToolbarBtn({ children, onClick, title, variant = "ghost" }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 6,
        border: variant === "outline" ? "1px solid #e5e7eb" : "none",
        background: "transparent",
        cursor: "pointer",
        color: "#374151",
      }}
    >
      {children}
    </button>
  );
}

// ─── PdfFrame ─────────────────────────────────────────────────────────────────

function PdfFrame({ url, name, allowExternalActions }) {
  const [status, setStatus] = useState("loading");
  const src = getViewUrl(url);
  const toolbarCrop = allowExternalActions ? 0 : 56;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {status === "loading" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: "#f8fafc",
            zIndex: 2,
          }}
        >
          <Loader2 size={32} color="#2563eb" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 14, color: "#6b7280" }}>Loading PDF…</span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {status === "error" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "#f8fafc",
            padding: 32,
            zIndex: 2,
          }}
        >
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
            <div style={{ display: "flex", gap: 8 }}>
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Open in new tab
              </a>
              <a
                href={getDownloadUrl(url)}
                download={name}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  background: "#f0fdf4",
                  color: "#15803d",
                  border: "1px solid #bbf7d0",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Download
              </a>
            </div>
          )}
        </div>
      )}

      <iframe
        key={src}
        src={src}
        title={name}
        onLoad={() => setStatus("ready")}
        onError={() => setStatus("error")}
        style={{
          position: "absolute",
          top: -toolbarCrop,
          left: 0,
          width: "100%",
          height: `calc(100% + ${toolbarCrop}px)`,
          border: "none",
          display: "block",
          opacity: status === "loading" ? 0 : 1,
          transition: "opacity 0.25s",
        }}
      />
    </div>
  );
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        background: "#fff",
      }}
    >
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            borderBottom: "1px solid #e5e7eb",
            background: "#f9fafb",
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          {siblings.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                border: `1px solid ${i === currentIndex ? "#2563eb" : "#e5e7eb"}`,
                background: i === currentIndex ? "#2563eb" : "#fff",
                color: i === currentIndex ? "#fff" : "#374151",
                fontSize: 12,
                fontWeight: i === currentIndex ? 600 : 400,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          flex: 1,
          overflow: "hidden",
          background: "#e5e7eb",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${100 / zoom}%`,
            height: `${100 / zoom}%`,
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
          }}
        >
          <PdfFrame key={activeUrl} url={activeUrl} name={activeName} allowExternalActions={activeAllow} />
        </div>

        {hasSiblings && (
          <>
            <NavArrow
              direction="left"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            />
            <NavArrow
              direction="right"
              disabled={currentIndex === siblings.length - 1}
              onClick={() => setCurrentIndex((i) => Math.min(siblings.length - 1, i + 1))}
            />
          </>
        )}
      </div>

      {hasSiblings && (
        <div
          style={{
            padding: "6px 16px",
            borderTop: "1px solid #e5e7eb",
            background: "#f9fafb",
            fontSize: 12,
            color: "#6b7280",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {currentIndex + 1} / {siblings.length}
        </div>
      )}
    </div>
  );
}

function NavArrow({ direction, disabled, onClick }) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        position: "absolute",
        top: "50%",
        [direction === "left" ? "left" : "right"]: 12,
        transform: "translateY(-50%)",
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "1px solid #e5e7eb",
        background: disabled ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.3 : 1,
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <Icon size={18} />
    </button>
  );
}

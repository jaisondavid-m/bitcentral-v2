import React, { useEffect, useMemo, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  ExternalLink,
  Download,
} from "lucide-react";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const ZOOM_STEP = 0.15;
const ZOOM_MIN = 0.3;
const ZOOM_MAX = 4.0;

function fitZoom(pageNaturalW, containerW) {
  if (!pageNaturalW || !containerW) return 1;
  const padding = 32;
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, (containerW - padding) / pageNaturalW));
}

function resolveGoogleDriveUrl(url = "") {
  if (!url) return { viewUrl: "", downloadUrl: "", embedUrl: "", fileId: "", isGdrive: false };

  const isGdrive = url.includes("drive.google.com") || url.includes("docs.google.com");
  if (!isGdrive) return { viewUrl: url, downloadUrl: url, embedUrl: "", fileId: "", isGdrive: false };

  const patterns = [/\/d\/([a-zA-Z0-9_-]+)/, /id=([a-zA-Z0-9_-]+)/, /\/file\/d\/([a-zA-Z0-9_-]+)/];
  let fileId = "";
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      fileId = match[1];
      break;
    }
  }

  if (!fileId) return { viewUrl: url, downloadUrl: url, embedUrl: url, fileId: "", isGdrive: true };

  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  return { viewUrl: downloadUrl, downloadUrl, embedUrl, fileId, isGdrive: true };
}

export default function FullscreenPdfModal({
  url,
  name = "Document",
  onClose,
  allowExternalActions = true,
}) {
  const [zoom, setZoom] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [thumbnails, setThumbnails] = useState([]);
  const [loadState, setLoadState] = useState("fetching");
  const [errorMsg, setErrorMsg] = useState("");
  const [pdfSource, setPdfSource] = useState("");
  const [nativePreviewUrl, setNativePreviewUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [pageInput, setPageInput] = useState("1");
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 640 : false);
  const [isFitMode, setIsFitMode] = useState(true);

  const scrollRef = useRef(null);
  const canvasRefs = useRef([]);
  const pageRefs = useRef([]);
  const renderTasksRef = useRef([]);
  const pdfDocRef = useRef(null);
  const objectUrlRef = useRef("");
  const firstPageWRef = useRef(0);
  const searchInputRef = useRef(null);

  const { viewUrl, downloadUrl, embedUrl, isGdrive } = useMemo(
    () => resolveGoogleDriveUrl(url),
    [url]
  );

  const showOpenNew = allowExternalActions && !isGdrive;
  const showDownload = allowExternalActions && !isGdrive;
  const hideExternalActions = !allowExternalActions;
  const canShowNav = numPages > 0 && (loadState === "rendering" || loadState === "ready");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showSearch) setShowSearch(false);
        else onClose?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setShowSearch((v) => !v);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        setZoom((z) => Math.min(ZOOM_MAX, +(((z ?? 1) + ZOOM_STEP).toFixed(2))));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        setZoom((z) => Math.max(ZOOM_MIN, +(((z ?? 1) - ZOOM_STEP).toFixed(2))));
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        recalcFitZoom();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSearch, onClose]);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  useEffect(() => {
    setZoom(null);
    setErrorMsg("");
    setPdfSource("");
    setNativePreviewUrl("");
    setNumPages(0);
    setCurrentPage(1);
    setPageInput("1");
    setLoadState("fetching");
    setThumbnails([]);
    setIsFitMode(true);
    canvasRefs.current = [];
    pageRefs.current = [];
    firstPageWRef.current = 0;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }
  }, [url]);

  useEffect(() => {
    if (!viewUrl) return;
    const controller = new AbortController();

    if (isGdrive && !allowExternalActions) {
      setLoadState("blocked");
      return () => controller.abort();
    }

    (async () => {
      try {
        const fetchCandidates = [];

        if (isGdrive) {
          if (downloadUrl) fetchCandidates.push(downloadUrl);
          if (embedUrl && embedUrl.includes("/d/")) {
            const fid = embedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1];
            if (fid) {
              fetchCandidates.push(`https://drive.google.com/uc?export=download&id=${fid}&confirm=1`);
              fetchCandidates.push(`https://drive.google.com/uc?export=download&confirm=1&id=${fid}`);
            }
          }
        }

        if (!fetchCandidates.length) fetchCandidates.push(viewUrl);

        let usedBlob = null;
        let lastError = null;

        for (const candidate of fetchCandidates) {
          try {
            const response = await fetch(candidate, { signal: controller.signal });
            const contentType = response.headers.get("content-type") || "";
            if (!response.ok || contentType.includes("text/html")) {
              lastError = new Error(`HTTP ${response.status} or HTML response`);
              continue;
            }

            usedBlob = await response.blob();
            break;
          } catch (error) {
            if (controller.signal.aborted) return;
            lastError = error;
          }
        }

        if (usedBlob) {
          const objectUrl = URL.createObjectURL(usedBlob);
          objectUrlRef.current = objectUrl;
          setPdfSource(objectUrl);
          return;
        }

        if (isGdrive) {
          if (allowExternalActions) {
            setLoadState("blocked");
            return;
          }

          setErrorMsg("This Google Drive file cannot be previewed here — it may require sign-in or different sharing permissions.");
          setLoadState("error");
          return;
        }

        throw lastError || new Error("Failed to fetch PDF");
      } catch {
        if (controller.signal.aborted) return;
        if (isGdrive && allowExternalActions) {
          setLoadState("blocked");
        } else {
          setNativePreviewUrl(viewUrl);
          setLoadState("native");
        }
      }
    })();

    return () => {
      controller.abort();
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = "";
      }
    };
  }, [viewUrl, downloadUrl, embedUrl, isGdrive, allowExternalActions]);

  useEffect(() => {
    if (!pdfSource) return;
    let cancelled = false;

    (async () => {
      try {
        const doc = await getDocument(pdfSource).promise;
        if (cancelled) {
          doc.destroy();
          return;
        }

        pdfDocRef.current = doc;

        const pageWidths = await Promise.all(
          Array.from({ length: doc.numPages }, async (_, index) => {
            const page = await doc.getPage(index + 1);
            const viewport = page.getViewport({ scale: 1 });
            page.cleanup();
            return viewport.width;
          })
        );
        firstPageWRef.current = Math.max(...pageWidths);

        setNumPages(doc.numPages);
        setLoadState("rendering");
        generateThumbnails(doc);
      } catch {
        if (!cancelled) {
          setErrorMsg("Could not parse PDF. Showing the browser PDF viewer instead.");
          setNativePreviewUrl(viewUrl);
          setLoadState("native");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [pdfSource]);

  useEffect(() => {
    if (!numPages || !firstPageWRef.current) return;
    if (zoom !== null) return;
    const containerW = scrollRef.current?.clientWidth ?? window.innerWidth;
    setZoom(fitZoom(firstPageWRef.current, containerW));
  }, [numPages, zoom]);

  useEffect(() => {
    if (!isFitMode || !numPages || !firstPageWRef.current) return;

    const updateZoom = () => {
      const containerW = scrollRef.current?.clientWidth ?? window.innerWidth;
      setZoom(fitZoom(firstPageWRef.current, containerW));
    };

    updateZoom();

    const container = scrollRef.current;
    if (!container || typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateZoom);
      return () => window.removeEventListener("resize", updateZoom);
    }

    const observer = new ResizeObserver(updateZoom);
    observer.observe(container);
    return () => observer.disconnect();
  }, [isFitMode, numPages]);

  useEffect(() => {
    if (!pdfSource || !numPages || zoom === null) return;
    let cancelled = false;

    renderTasksRef.current.forEach((task) => {
      try {
        task.cancel();
      } catch {}
    });
    renderTasksRef.current = [];

    (async () => {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (cancelled) return;

      const doc = pdfDocRef.current;
      if (!doc) return;

      try {
        for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
          const canvas = canvasRefs.current[pageNumber - 1];
          if (!canvas || cancelled) break;

          const page = await doc.getPage(pageNumber);
          if (cancelled) return;

          const dpr = window.devicePixelRatio || 1;
          const vp = page.getViewport({ scale: zoom * dpr });

          canvas.width = vp.width;
          canvas.height = vp.height;
          canvas.style.width = `${vp.width / dpr}px`;
          canvas.style.height = `${vp.height / dpr}px`;

          const task = page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
          renderTasksRef.current.push(task);
          await task.promise;
          page.cleanup();
        }

        if (!cancelled) setLoadState("ready");
      } catch (error) {
        if (cancelled || error?.name === "RenderingCancelledException") return;
        setErrorMsg("Error rendering pages.");
        setLoadState("error");
      }
    })();

    return () => {
      cancelled = true;
      renderTasksRef.current.forEach((task) => {
        try {
          task.cancel();
        } catch {}
      });
    };
  }, [pdfSource, numPages, zoom]);

  const generateThumbnails = async (doc) => {
    const results = [];
    for (let i = 1; i <= doc.numPages; i++) {
      try {
        const page = await doc.getPage(i);
        const vp = page.getViewport({ scale: 0.2 });
        const canvas = document.createElement("canvas");
        canvas.width = vp.width;
        canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext("2d"), viewport: vp }).promise;
        results.push(canvas.toDataURL());
        page.cleanup();
      } catch {
        results.push(null);
      }
      setThumbnails([...results]);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !numPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = pageRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setCurrentPage(index + 1);
              setPageInput(String(index + 1));
            }
          }
        });
      },
      { root: container, threshold: 0.3 }
    );

    pageRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [numPages, loadState]);

  const scrollToPage = (n) => {
    const el = pageRefs.current[n - 1];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrentPage(n);
    setPageInput(String(n));
  };

  const recalcFitZoom = () => {
    const pageWidth = firstPageWRef.current;
    const containerWidth = scrollRef.current?.clientWidth ?? window.innerWidth;
    if (pageWidth && containerWidth) {
      setIsFitMode(true);
      setZoom(fitZoom(pageWidth, containerWidth));
    }
  };

  const changeZoom = (delta) =>
    setZoom((z) => {
      setIsFitMode(false);
      return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, +(((z ?? 1) + delta).toFixed(2))));
    });

  return (
    <div style={S.root}>
      <div style={S.toolbar}>
        <div style={S.row}>
          <button onClick={onClose} style={S.iconBtn("danger")} title="Close">
            <X size={16} />
          </button>
          {canShowNav && (
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              style={S.iconBtn(sidebarOpen ? "active" : "default")}
              title="Thumbnails"
            >
              <Menu size={16} />
            </button>
          )}
        </div>

        <div style={S.fileName}>
          <span style={S.fileNameText} title={name}>
            {name}
          </span>
          {isGdrive && <span style={S.akBadge}>Google Drive</span>}
        </div>

        <div style={S.row}>
          {canShowNav && !isMobile && (
            <>
              <button
                onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
                style={S.iconBtn()}
                disabled={currentPage <= 1}
                title="Prev"
              >
                <ChevronLeft size={16} />
              </button>
              <div style={S.pageBox}>
                <input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={() => {
                    const n = parseInt(pageInput, 10);
                    if (n >= 1 && n <= numPages) scrollToPage(n);
                    else setPageInput(String(currentPage));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const n = parseInt(pageInput, 10);
                      if (n >= 1 && n <= numPages) scrollToPage(n);
                      else setPageInput(String(currentPage));
                    }
                  }}
                  style={S.pageInput}
                />
                <span style={S.pageTotal}>/ {numPages}</span>
              </div>
              <button
                onClick={() => scrollToPage(Math.min(numPages, currentPage + 1))}
                style={S.iconBtn()}
                disabled={currentPage >= numPages}
                title="Next"
              >
                <ChevronRight size={16} />
              </button>
              <div style={S.sep} />
            </>
          )}

          <button onClick={() => changeZoom(-ZOOM_STEP)} style={S.iconBtn()} disabled={zoom !== null && zoom <= ZOOM_MIN} title="Zoom out">
            <ZoomOut size={16} />
          </button>
          <button onClick={recalcFitZoom} style={S.zoomBadge} title="Fit to width">
            {zoom !== null ? `${Math.round(zoom * 100)}%` : "…"}
          </button>
          <button onClick={() => changeZoom(ZOOM_STEP)} style={S.iconBtn()} disabled={zoom !== null && zoom >= ZOOM_MAX} title="Zoom in">
            <ZoomIn size={16} />
          </button>

          {canShowNav && (
            <>
              <div style={S.sep} />
              <button onClick={recalcFitZoom} style={S.iconBtn()} title="Fit to width">
                <Maximize2 size={14} />
              </button>
              <button onClick={() => setShowSearch((v) => !v)} style={S.iconBtn(showSearch ? "active" : "default")} title="Search">
                <Search size={15} />
              </button>
            </>
          )}

          {showOpenNew && (
            <button onClick={() => window.open(url, "_blank")} style={S.iconBtn()} title="Open in new tab">
              <ExternalLink size={15} />
            </button>
          )}

          {showDownload && (
            <a href={downloadUrl} download={name} style={S.downloadBtn} title="Download">
              <Download size={14} />
              {!isMobile && <span>Save</span>}
            </a>
          )}

          {hideExternalActions && !showOpenNew && !showDownload && (
            <div
              aria-hidden="true"
              title="External actions disabled for this PDF"
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: "#000",
                border: "1px solid #111",
                flexShrink: 0,
              }}
            />
          )}
        </div>
      </div>

      {canShowNav && isMobile && (
        <div style={S.mobileNav}>
          <button onClick={() => scrollToPage(Math.max(1, currentPage - 1))} style={S.mobileNavBtn} disabled={currentPage <= 1}>
            <ChevronLeft size={18} />
          </button>
          <span style={S.mobileNavLabel}>Page {currentPage} / {numPages}</span>
          <button onClick={() => scrollToPage(Math.min(numPages, currentPage + 1))} style={S.mobileNavBtn} disabled={currentPage >= numPages}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {showSearch && (
        <div style={S.searchBar}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search in document…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={S.searchInput}
          />
          <button onClick={() => setShowSearch(false)} style={S.iconBtn()}>
            <X size={14} />
          </button>
        </div>
      )}

      <div style={S.body}>
        {sidebarOpen && canShowNav && (
          <div style={S.sidebar}>
            {Array.from({ length: numPages }, (_, i) => (
              <button
                key={i}
                onClick={() => scrollToPage(i + 1)}
                title={`Page ${i + 1}`}
                style={{
                  ...S.thumbBtn,
                  border: `2px solid ${currentPage === i + 1 ? "#3b6ef8" : "transparent"}`,
                  background: currentPage === i + 1 ? "#1e3a7a18" : "transparent",
                }}
              >
                {thumbnails[i] ? (
                  <img src={thumbnails[i]} alt={`Page ${i + 1}`} style={{ width: "100%", display: "block", borderRadius: 2 }} />
                ) : (
                  <div style={S.thumbPlaceholder} />
                )}
                <span style={{ fontSize: 10, color: currentPage === i + 1 ? "#3b6ef8" : "#888", fontWeight: 500 }}>
                  {i + 1}
                </span>
              </button>
            ))}
          </div>
        )}

        <div ref={scrollRef} style={S.canvasArea}>
          {loadState === "fetching" && <StatusBox><Spin /> Loading PDF…</StatusBox>}
          {loadState === "error" && <StatusBox danger><span style={{ fontSize: 20 }}>⚠</span>{errorMsg}</StatusBox>}

          {loadState === "blocked" && embedUrl && (
            <div style={{ display: "flex", flexDirection: "column", width: "100%", flex: 1, minHeight: 0 }}>
              <div style={S.gdriveNotice}>
                <span>📄 Showing Google Drive preview</span>
                {allowExternalActions && (
                  <a href={url} target="_blank" rel="noreferrer" style={{ color: "#3b6ef8", fontSize: 12, marginLeft: "auto" }}>
                    Open in Drive ↗
                  </a>
                )}
              </div>
              <iframe src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}rm=minimal`} style={S.gdriveFrame} title="PDF Preview" allow="autoplay" />
            </div>
          )}

          {loadState === "blocked" && !embedUrl && (
            <StatusBox danger>
              <span style={{ fontSize: 20 }}>🔒</span>
              <div>Could not load this PDF. Permissions may be restricted.</div>
            </StatusBox>
          )}

          {loadState === "native" && nativePreviewUrl && (
            <div style={{ display: "flex", flexDirection: "column", width: "100%", flex: 1, minHeight: 0 }}>
              <div style={S.gdriveNotice}>
                <span>📄 Showing browser PDF preview</span>
                {allowExternalActions && (
                  <a href={viewUrl} target="_blank" rel="noreferrer" style={{ color: "#3b6ef8", fontSize: 12, marginLeft: "auto" }}>
                    Open raw file ↗
                  </a>
                )}
              </div>
              <iframe src={nativePreviewUrl} style={S.gdriveFrame} title="PDF Preview" />
            </div>
          )}

          {(loadState === "rendering" || loadState === "ready") &&
            Array.from({ length: numPages }, (_, i) => (
              <div key={i} ref={(el) => { pageRefs.current[i] = el; }} style={S.pageWrap}>
                <div style={S.pageLabel}>{i + 1}</div>
                <canvas ref={(el) => { canvasRefs.current[i] = el; }} style={{ display: "block", width: "100%", height: "auto" }} />
              </div>
            ))}

          {loadState === "rendering" && numPages > 0 && <StatusBox><Spin /> Rendering…</StatusBox>}
        </div>
      </div>

      <div style={S.statusBar}>
        {canShowNav && <span>Page {currentPage} of {numPages}</span>}
        <span>{zoom !== null ? `${Math.round(zoom * 100)}%` : "…"} zoom</span>
        {loadState === "rendering" && <span style={{ color: "#3b6ef8" }}>Loading…</span>}
        {loadState === "ready" && <span style={{ color: "#22c55e" }}>✓ Ready</span>}
        {loadState === "native" && <span style={{ color: "#60a5fa" }}>Browser preview</span>}
        {loadState === "blocked" && <span style={{ color: "#f59e0b" }}>Embed mode</span>}
        <span style={{ marginLeft: "auto", color: "#555", fontSize: 10 }}>
          {!isMobile && "Ctrl+F · Ctrl+± · "}Esc to close
        </span>
      </div>
    </div>
  );
}

function Spin() {
  return (
    <span
      style={{
        display: "inline-block",
        width: 15,
        height: 15,
        flexShrink: 0,
        border: "2px solid #333",
        borderTopColor: "#3b6ef8",
        borderRadius: "50%",
        animation: "pdfSpin .7s linear infinite",
      }}
    />
  );
}

function StatusBox({ children, danger }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexDirection: "column",
        background: danger ? "#2a0f0f" : "#1e1e1e",
        border: `1px solid ${danger ? "#7a2020" : "#2e2e2e"}`,
        borderRadius: 10,
        padding: "18px 26px",
        fontSize: 13,
        color: danger ? "#f88" : "#999",
        marginTop: 24,
        maxWidth: 460,
        textAlign: "center",
        lineHeight: 1.6,
      }}
    >
      {children}
    </div>
  );
}

const S = {
  root: { position: "fixed", inset: 0, zIndex: 9999, display: "flex", flexDirection: "column", background: "#111", color: "#ddd", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", overflow: "hidden" },
  toolbar: { display: "flex", alignItems: "center", gap: 6, padding: "0 10px", height: 48, flexShrink: 0, background: "#1a1a1a", borderBottom: "1px solid #272727", userSelect: "none", overflowX: "auto", overflowY: "hidden" },
  row: { display: "flex", alignItems: "center", gap: 4, flexShrink: 0 },
  sep: { width: 1, height: 20, background: "#2e2e2e", margin: "0 2px", flexShrink: 0 },
  fileName: { flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8, overflow: "hidden" },
  fileNameText: { fontSize: 13, fontWeight: 500, color: "#bbb", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  akBadge: { flexShrink: 0, fontSize: 10, fontWeight: 700, background: "#7c3aed22", color: "#a78bfa", border: "1px solid #7c3aed55", borderRadius: 4, padding: "1px 7px", letterSpacing: "0.04em" },
  iconBtn: (variant) => ({ display: "flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: 6, border: "1px solid", cursor: "pointer", transition: "all .1s", flexShrink: 0, background: variant === "active" ? "#1e3a7a" : variant === "danger" ? "#3a0f0f" : "transparent", borderColor: variant === "active" ? "#3b6ef8" : variant === "danger" ? "#7a1e1e" : "#2e2e2e", color: variant === "active" ? "#7aaeff" : variant === "danger" ? "#f87171" : "#ccc" }),
  pageBox: { display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#bbb" },
  pageInput: { width: 38, background: "#222", border: "1px solid #333", borderRadius: 4, color: "#e0e0e0", fontSize: 12, textAlign: "center", padding: "2px 4px", outline: "none" },
  pageTotal: { color: "#555" },
  zoomBadge: { background: "#222", border: "1px solid #333", borderRadius: 5, color: "#ccc", fontSize: 11, fontWeight: 600, padding: "3px 9px", cursor: "pointer", minWidth: 46, textAlign: "center", flexShrink: 0 },
  downloadBtn: { display: "flex", alignItems: "center", gap: 5, flexShrink: 0, background: "#052e16", border: "1px solid #16a34a55", borderRadius: 6, color: "#4ade80", fontSize: 12, fontWeight: 700, padding: "4px 11px", textDecoration: "none" },
  mobileNav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 12px", background: "#161616", borderBottom: "1px solid #222", flexShrink: 0 },
  mobileNavBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: 6, border: "1px solid #2e2e2e", background: "transparent", color: "#ccc", cursor: "pointer" },
  mobileNavLabel: { fontSize: 12, fontWeight: 500, color: "#999" },
  searchBar: { display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#161616", borderBottom: "1px solid #222", flexShrink: 0 },
  searchInput: { flex: 1, maxWidth: 320, background: "#222", border: "1px solid #333", borderRadius: 4, color: "#e0e0e0", fontSize: 13, padding: "5px 10px", outline: "none" },
  body: { flex: 1, display: "flex", overflow: "hidden" },
  sidebar: { width: 140, background: "#151515", borderRight: "1px solid #222", overflowY: "auto", flexShrink: 0, padding: "8px 6px", display: "flex", flexDirection: "column", gap: 6 },
  thumbBtn: { background: "transparent", border: "2px solid transparent", borderRadius: 5, cursor: "pointer", padding: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%", transition: "border-color .15s, background .15s" },
  thumbPlaceholder: { width: "100%", aspectRatio: "0.77", background: "#222", borderRadius: 2 },
  canvasArea: { flex: 1, overflowY: "auto", overflowX: "auto", padding: "16px 12px 40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, background: "#1c1c1c" },
  pageWrap: { position: "relative", background: "#fff", borderRadius: 3, flexShrink: 0, boxShadow: "0 4px 24px rgba(0,0,0,.55)", overflow: "visible", width: "fit-content", maxWidth: "none" },
  pageLabel: { position: "absolute", top: 6, right: 8, background: "rgba(0,0,0,.5)", color: "#fff", fontSize: 10, fontWeight: 600, borderRadius: 3, padding: "1px 5px", zIndex: 2, pointerEvents: "none", userSelect: "none" },
  gdriveNotice: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0, background: "#1a2a1a", border: "1px solid #1e4a1e", borderRadius: "8px 8px 0 0", padding: "8px 14px", fontSize: 12, color: "#86efac" },
  gdriveFrame: { flex: 1, width: "100%", border: "none", minHeight: "calc(100vh - 160px)", background: "#fff" },
  statusBar: { height: 26, background: "#111", borderTop: "1px solid #1e1e1e", display: "flex", alignItems: "center", padding: "0 12px", gap: 16, fontSize: 11, color: "#555", flexShrink: 0, userSelect: "none" },
};

if (typeof document !== "undefined" && !document.getElementById("pdfSpin-kf")) {
  const s = document.createElement("style");
  s.id = "pdfSpin-kf";
  s.textContent = "@keyframes pdfSpin { to { transform: rotate(360deg); } }";
  document.head.appendChild(s);
}
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/build/pdf.mjs";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

function getInitialZoom() {
  if (typeof window === "undefined") return 1;
  if (window.innerWidth < 640) return 0.72;
  if (window.innerWidth < 1024) return 0.85;
  return 1;
}

export default function FullscreenPdfModal({ url, name, onClose, originalUrl, allowExternalActions = true }) {
  const [zoom, setZoom] = useState(getInitialZoom);
  const [loadError, setLoadError] = useState("");
  const [pdfSource, setPdfSource] = useState("");
  const [numPages, setNumPages] = useState(0);
  const canvasRefs = useRef([]);

  const resolveUrl = (value) => {
    if (!value) return "";
    try {
      return new URL(value, import.meta.env.VITE_API_BASE_URL || window.location.origin).href;
    } catch (e) {
      return value;
    }
  };

  const resolvedUrl = useMemo(() => resolveUrl(url), [url]);
  const resolvedOriginalUrl = useMemo(() => resolveUrl(originalUrl || url), [originalUrl, url]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    setZoom(getInitialZoom());
    setLoadError("");
    setPdfSource("");
    setNumPages(0);
    canvasRefs.current = [];
  }, [url]);

  useEffect(() => {
    if (!resolvedUrl) return undefined;

    const controller = new AbortController();
    let objectUrl = "";

    const loadPdf = async () => {
      try {
        const response = await fetch(resolvedUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfSource(objectUrl);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("PDF fetch error:", error);
        setLoadError("Unable to open PDF. Check the uploaded file URL and server access.");
        setPdfSource("");
      }
    };

    loadPdf();

    return () => {
      controller.abort();
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [resolvedUrl]);

  useEffect(() => {
    if (!pdfSource) return undefined;

    let cancelled = false;
    let pdfDocument = null;

    const renderPdf = async () => {
      try {
        const loadingTask = getDocument(pdfSource);
        pdfDocument = await loadingTask.promise;
        if (cancelled) return;

        setNumPages(pdfDocument.numPages);
        setLoadError("");
      } catch (error) {
        if (cancelled) return;
        console.error("PDF render error:", error);
        setLoadError("Unable to open PDF. Check the uploaded file URL and server access.");
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
      if (pdfDocument) {
        pdfDocument.destroy();
      }
    };
  }, [pdfSource, zoom]);

  useEffect(() => {
    if (!pdfSource || !numPages) return undefined;

    let cancelled = false;
    let pdfDocument = null;

    const renderPages = async () => {
      try {
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (cancelled) return;

        const loadingTask = getDocument(pdfSource);
        pdfDocument = await loadingTask.promise;
        if (cancelled) return;

        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
          const canvas = canvasRefs.current[pageNumber - 1];
          if (!canvas) continue;

          const page = await pdfDocument.getPage(pageNumber);
          if (cancelled) return;

          const viewport = page.getViewport({ scale: zoom });
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;

          await page.render({ canvasContext: context, viewport }).promise;
        }
      } catch (error) {
        if (cancelled) return;
        console.error("PDF render error:", error);
        setLoadError("Unable to open PDF. Check the uploaded file URL and server access.");
      }
    };

    renderPages();

    return () => {
      cancelled = true;
      if (pdfDocument) {
        pdfDocument.destroy();
      }
    };
  }, [pdfSource, numPages, zoom]);

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
    } catch (e) {
      return u;
    }
  };

  const downloadUrl = useMemo(() => getDownloadUrl(resolvedOriginalUrl), [resolvedOriginalUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/40">
      <div className="relative flex h-full w-full flex-col bg-white text-slate-900 shadow-xl">
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={onClose} className="rounded bg-gray-100 px-3 py-1 text-slate-800 hover:bg-gray-200">
              Close
            </button>
            <div className="max-w-[60vw] truncate font-medium">{name}</div>
          </div>
          <div className="flex items-center gap-2">
            {allowExternalActions && (
              <button onClick={() => window.open(resolvedUrl, "_blank")} className="rounded bg-gray-100 px-3 py-1 text-slate-800 hover:bg-gray-200">
                New tab
              </button>
            )}
            {allowExternalActions && (
              <a href={downloadUrl} download={name} className="rounded bg-emerald-100 px-3 py-1 text-emerald-800 hover:bg-emerald-200">
                Download
              </a>
            )}
            <button onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(2)))} className="rounded bg-gray-100 px-3 py-1 text-slate-800 hover:bg-gray-200">
              +
            </button>
            <button onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.1).toFixed(2)))} className="rounded bg-gray-100 px-3 py-1 text-slate-800 hover:bg-gray-200">
              -
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-slate-100 p-2 sm:p-4">
          <div className="mx-auto flex w-full max-w-none justify-center sm:max-w-5xl">
            {!pdfSource && !loadError ? (
              <div className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow">Loading PDF...</div>
            ) : loadError ? (
              <div className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {loadError}
              </div>
            ) : (
              <div className="flex w-full flex-col items-center gap-3 sm:gap-4">
                {Array.from({ length: numPages }, (_, index) => (
                  <div key={`page_${index + 1}`} className="overflow-hidden rounded-md bg-white shadow-lg w-full">
                    <canvas
                      ref={(el) => {
                        canvasRefs.current[index] = el;
                      }}
                      className="block h-auto w-full"
                    />
                  </div>
                ))}
                {numPages === 0 ? (
                  <div className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow">Loading PDF...</div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

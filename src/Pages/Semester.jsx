import React, { useCallback, useEffect, useRef, useState } from ‘react’
import { Document, Page, pdfjs } from ‘react-pdf’
import ‘react-pdf/dist/Page/AnnotationLayer.css’
import ‘react-pdf/dist/Page/TextLayer.css’

// Point PDF.js worker to CDN — add this once in your app entry if preferred
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

// ─── helpers ──────────────────────────────────────────────────────────────────

/**

- Google Drive share/view URLs must be converted to a direct-download URL
- so PDF.js can actually fetch the bytes.
  */
  function toDirectUrl(u) {
  try {
  if (!u) return u
  const parsed = new URL(u, window.location.origin)
  if (parsed.hostname.includes(‘drive.google.com’)) {
  const match = parsed.pathname.match(//d/([a-zA-Z0-9_-]+)/)
  const id = match ? match[1] : parsed.searchParams.get(‘id’)
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`
  }
  return parsed.href
  } catch {
  return u
  }
  }

// ─── sub-components ───────────────────────────────────────────────────────────

function ToolbarButton({ onClick, title, children, className = ‘’ }) {
return (
<button
type=“button”
onClick={onClick}
title={title}
className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
>
{children}
</button>
)
}

// ─── main component ───────────────────────────────────────────────────────────

export default function FullscreenPdfModal({
url,
name,
onClose,
originalUrl,
allowExternalActions = true,
}) {
const [numPages, setNumPages] = useState(null)
const [pageNumber, setPageNumber] = useState(1)
const [scale, setScale] = useState(1.2)
const [loadError, setLoadError] = useState(null)
const [inputPage, setInputPage] = useState(‘1’)
const containerRef = useRef(null)

const pdfUrl = toDirectUrl(originalUrl || url)
const downloadUrl = toDirectUrl(originalUrl || url)

// Close on Escape
useEffect(() => {
const prev = document.body.style.overflow
document.body.style.overflow = ‘hidden’
const onKey = (e) => { if (e.key === ‘Escape’) onClose() }
window.addEventListener(‘keydown’, onKey)
return () => {
window.removeEventListener(‘keydown’, onKey)
document.body.style.overflow = prev
}
}, [onClose])

const onDocumentLoadSuccess = useCallback(({ numPages }) => {
setNumPages(numPages)
setPageNumber(1)
setInputPage(‘1’)
setLoadError(null)
}, [])

const onDocumentLoadError = useCallback((err) => {
console.error(‘PDF load error:’, err)
setLoadError(err?.message || ‘Failed to load PDF.’)
}, [])

const goTo = (p) => {
const clamped = Math.max(1, Math.min(numPages ?? 1, p))
setPageNumber(clamped)
setInputPage(String(clamped))
}

const handlePageInput = (e) => {
setInputPage(e.target.value)
}

const handlePageInputBlur = () => {
const parsed = parseInt(inputPage, 10)
if (!isNaN(parsed)) goTo(parsed)
else setInputPage(String(pageNumber))
}

const handlePageInputKey = (e) => {
if (e.key === ‘Enter’) e.target.blur()
}

const zoomIn  = () => setScale((s) => Math.min(3, +(s + 0.2).toFixed(1)))
const zoomOut = () => setScale((s) => Math.max(0.4, +(s - 0.2).toFixed(1)))
const resetZoom = () => setScale(1.2)

// ── render ──────────────────────────────────────────────────────────────────
return (
<div className=“fixed inset-0 z-50 flex flex-col bg-gray-100” role=“dialog” aria-modal=“true” aria-label={`PDF viewer: ${name}`}>

```
  {/* ── toolbar ── */}
  <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 py-2 shadow-sm">

    {/* Left: close + title */}
    <div className="flex min-w-0 items-center gap-2">
      <ToolbarButton
        onClick={onClose}
        title="Close (Esc)"
        className="bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        {/* X icon */}
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        <span className="ml-1 hidden sm:inline">Close</span>
      </ToolbarButton>

      <span className="max-w-[40vw] truncate text-sm font-semibold text-slate-800 sm:max-w-[50vw]">
        {name}
      </span>
    </div>

    {/* Center: page navigation */}
    {numPages && (
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => goTo(pageNumber - 1)}
          title="Previous page"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        </ToolbarButton>

        <div className="flex items-center gap-1 text-sm text-slate-700">
          <input
            type="text"
            value={inputPage}
            onChange={handlePageInput}
            onBlur={handlePageInputBlur}
            onKeyDown={handlePageInputKey}
            className="w-10 rounded border border-gray-300 px-1 py-0.5 text-center text-sm focus:border-blue-400 focus:outline-none"
            aria-label="Page number"
          />
          <span className="text-gray-500">/ {numPages}</span>
        </div>

        <ToolbarButton
          onClick={() => goTo(pageNumber + 1)}
          title="Next page"
          className="bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
          </svg>
        </ToolbarButton>
      </div>
    )}

    {/* Right: zoom + actions */}
    <div className="flex items-center gap-1.5">
      <ToolbarButton onClick={zoomOut} title="Zoom out" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          <path fillRule="evenodd" d="M5 8a1 1 0 011-1h4a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd"/>
        </svg>
      </ToolbarButton>

      <button
        type="button"
        onClick={resetZoom}
        title="Reset zoom"
        className="min-w-[3.5rem] rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-mono font-medium text-slate-700 hover:bg-gray-50 transition-colors"
      >
        {Math.round(scale * 100)}%
      </button>

      <ToolbarButton onClick={zoomIn} title="Zoom in" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
          <path fillRule="evenodd" d="M8 5a1 1 0 011 1v2h2a1 1 0 110 2H9v2a1 1 0 11-2 0V10H5a1 1 0 110-2h2V6a1 1 0 011-1z" clipRule="evenodd"/>
        </svg>
      </ToolbarButton>

      {allowExternalActions && (
        <>
          <div className="mx-1 h-5 w-px bg-gray-200" />
          <ToolbarButton
            onClick={() => window.open(url, '_blank')}
            title="Open in new tab"
            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
            </svg>
            <span className="ml-1 hidden sm:inline text-xs">New tab</span>
          </ToolbarButton>

          <a
            href={downloadUrl}
            download={name}
            title="Download PDF"
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
            <span className="hidden sm:inline">Download</span>
          </a>
        </>
      )}
    </div>
  </header>

  {/* ── PDF canvas area ── */}
  <div ref={containerRef} className="flex flex-1 flex-col items-center overflow-auto bg-gray-200 px-4 py-6">

    {loadError ? (
      /* Fallback when PDF.js can't load (e.g. CORS on some Google Drive files) */
      <div className="flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-md">
        <svg className="h-12 w-12 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
        </svg>
        <div>
          <p className="text-base font-semibold text-slate-800">Unable to display PDF</p>
          <p className="mt-1 text-sm text-slate-500">
            The file may be behind a login or blocked by CORS. Try opening it directly.
          </p>
        </div>
        {allowExternalActions && (
          <div className="flex gap-3">
            <a
              href={downloadUrl}
              download={name}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </a>
            <button
              type="button"
              onClick={() => window.open(url, '_blank')}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
            >
              Open in new tab
            </button>
          </div>
        )}
      </div>
    ) : (
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex flex-col items-center gap-3 pt-16 text-slate-500">
            <svg className="h-8 w-8 animate-spin text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <span className="text-sm">Loading PDF…</span>
          </div>
        }
        options={{
          cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
          cMapPacked: true,
        }}
      >
        <Page
          pageNumber={pageNumber}
          scale={scale}
          className="shadow-lg"
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      </Document>
    )}

    {/* Bottom page nav for convenience */}
    {numPages && numPages > 1 && (
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => goTo(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          ← Prev
        </button>
        <span className="text-sm text-slate-500">
          Page {pageNumber} of {numPages}
        </span>
        <button
          type="button"
          onClick={() => goTo(pageNumber + 1)}
          disabled={pageNumber >= numPages}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          Next →
        </button>
      </div>
    )}
  </div>
</div>
```

)
}
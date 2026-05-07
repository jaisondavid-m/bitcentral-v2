import React, { useEffect, useState } from 'react'

export default function FullscreenPdfModal({ url, name, onClose, originalUrl, allowExternalActions = true }) {
  const [zoom, setZoom] = useState(1)
  const iframeSandbox = allowExternalActions
    ? undefined
    : 'allow-scripts allow-same-origin allow-forms'

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const getDownloadUrl = (u) => {
    try {
      if (!u) return u
      const parsed = new URL(u, window.location.origin)
      if (parsed.hostname.includes('drive.google.com')) {
        const match = parsed.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/)
        const id = match ? match[1] : parsed.searchParams.get('id')
        if (id) return `https://drive.google.com/uc?export=download&id=${id}`
      }
      return parsed.href
    } catch (e) {
      return u
    }
  }

  const downloadUrl = getDownloadUrl(originalUrl || url)

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/40">
      <div className="relative w-full h-full bg-white text-slate-900 flex flex-col shadow-xl">
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-slate-800">Close</button>
            <div className="font-medium truncate max-w-[60vw]">{name}</div>
          </div>
          <div className="flex items-center gap-2">
            {allowExternalActions && (
              <button onClick={() => window.open(url, '_blank')} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-slate-800">New tab</button>
            )}
            {allowExternalActions && (
              <a href={downloadUrl} download={name} className="px-3 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800">Download</a>
            )}
            <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-slate-800">+</button>
            <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-slate-800">-</button>
          </div>
        </header>

        <div className="flex-1 overflow-auto flex items-start justify-center p-4 bg-white">
          <div style={{ width: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: 'top left' }} className="relative min-h-full">
            <iframe
              title={name}
              src={url}
              sandbox={iframeSandbox}
              className="w-full h-[90vh] border border-gray-200 bg-white"
            />
            {!allowExternalActions && (
              <div
                className="absolute top-0 right-0 z-10 h-14 w-14 bg-[#1f2023]"
                aria-hidden="true"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

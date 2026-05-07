import React, { useEffect, useState } from 'react'

export default function FullscreenPdfModal({ url, name, onClose, originalUrl }) {
  const [zoom, setZoom] = useState(1)

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

  const isDrive = (u) => {
    try { return u && new URL(u).hostname.includes('drive.google.com') } catch (e) { return false }
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = originalUrl || url
    a.download = name
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/40">
      <div className="relative w-full h-full bg-white text-slate-900 flex flex-col shadow-xl">
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-slate-800">Close</button>
            <div className="font-medium truncate max-w-[60vw]">{name}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.open(url, '_blank')} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-slate-800">New tab</button>
            <button onClick={download} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-slate-800">Download</button>
            <button onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-slate-800">+</button>
            <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))} className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-slate-800">-</button>
          </div>
        </header>

        <div className="flex-1 overflow-auto flex items-start justify-center p-4 bg-white">
          <div style={{ width: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: 'top left' }} className="min-h-full">
            <iframe
              title={name}
              src={url}
              className="w-full h-[90vh] border border-gray-200 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

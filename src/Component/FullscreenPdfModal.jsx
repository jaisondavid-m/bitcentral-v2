import React, { useEffect, useState } from 'react'

export default function FullscreenPdfModal({ url, name, onClose, originalUrl, allowExternalActions = true }) {
  const [zoom, setZoom] = useState(1)
  const iframeSandbox = allowExternalActions
    ? undefined
    : 'allow-scripts allow-same-origin allow-forms'

  // detect Google Drive file id when present
  const parsedUrl = (() => {
    try {
      return new URL(originalUrl || url, window.location.origin)
    } catch (e) {
      return null
    }
  })()
  let driveId = null
  if (parsedUrl && parsedUrl.hostname.includes('drive.google.com')) {
    const m = parsedUrl.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/)
    driveId = m ? m[1] : parsedUrl.searchParams.get('id')
  }
  const drivePreviewUrl = driveId ? `https://drive.google.com/file/d/${driveId}/preview` : null
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || null
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null)
  const [fetchingPdf, setFetchingPdf] = useState(false)
  const [pdfError, setPdfError] = useState(null)

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
          {driveId ? (
            <div style={{ width: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: 'top left' }} className="relative min-h-full">
              {pdfError ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-red-600">{pdfError}</p>
                </div>
              ) : pdfBlobUrl ? (
                <iframe title={name} src={pdfBlobUrl} className="w-full h-[90vh] border border-gray-200 bg-white" />
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-slate-600">Preview requires permission to access this Drive file.</p>
                  <div className="mt-3 flex justify-center gap-2">
                    <button
                      onClick={async () => {
                        // if we have a Google client id, attempt to get an access token and fetch via proxy
                        if (!googleClientId) {
                          // fallback to proxy direct (public/service-account)
                          window.open(`${apiBase.replace(/\/$/, '')}/pdf/${driveId}`)
                          return
                        }
                        setFetchingPdf(true)
                        setPdfError(null)
                        try {
                          // load GSI script if needed
                          if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
                            await new Promise((res, rej) => {
                              const s = document.createElement('script')
                              s.src = 'https://accounts.google.com/gsi/client'
                              s.async = true
                              s.defer = true
                              s.onload = res
                              s.onerror = rej
                              document.head.appendChild(s)
                            })
                          }

                          const tokenClient = window.google.accounts.oauth2.initTokenClient({
                            client_id: googleClientId,
                            scope: 'https://www.googleapis.com/auth/drive.readonly',
                            callback: async (resp) => {
                              if (resp.error) {
                                setPdfError('Failed to acquire access token')
                                setFetchingPdf(false)
                                return
                              }
                              try {
                                const r = await fetch(`${apiBase.replace(/\/$/, '')}/pdf/${driveId}`, {
                                  headers: { Authorization: `Bearer ${resp.access_token}` },
                                })
                                if (!r.ok) throw new Error(`Failed to fetch PDF: ${r.status}`)
                                const blob = await r.blob()
                                const url = URL.createObjectURL(blob)
                                setPdfBlobUrl(url)
                              } catch (err) {
                                setPdfError(String(err))
                              } finally {
                                setFetchingPdf(false)
                              }
                            },
                          })

                          // try to request token silently first (prompt: none)
                          tokenClient.requestAccessToken({ prompt: '' })
                        } catch (err) {
                          setPdfError('Could not load Google auth library')
                          setFetchingPdf(false)
                        }
                      }}
                      className="px-4 py-2 rounded bg-blue-600 text-white"
                      disabled={fetchingPdf}
                    >
                      {fetchingPdf ? 'Loading…' : 'Load preview'}
                    </button>
                    {allowExternalActions && (
                      <a href={`${apiBase.replace(/\/$/, '')}/pdf/${driveId}?download=1`} className="px-4 py-2 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800">Download</a>
                    )}
                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                {!allowExternalActions && (
                  <div
                    className="absolute top-0 right-0 z-10 h-14 w-14 bg-[#1f2023]"
                    aria-hidden="true"
                  />
                )}
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  )
}
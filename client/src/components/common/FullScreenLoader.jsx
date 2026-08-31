import React from 'react'

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="rounded-3xl border border-blue-100 bg-white/95 px-6 py-5 shadow-lg shadow-blue-100/40 backdrop-blur-sm text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
        </div>
        <p className="text-sm font-semibold text-slate-900">Loading BitCentral</p>
        <p className="mt-1 text-xs text-slate-500">Checking your session securely...</p>
      </div>
    </div>
  )
}

export default FullScreenLoader
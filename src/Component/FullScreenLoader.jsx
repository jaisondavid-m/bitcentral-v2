import React from 'react'

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-black">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin dark:border-slate-700"></div>
    </div>
  )
}

export default FullScreenLoader
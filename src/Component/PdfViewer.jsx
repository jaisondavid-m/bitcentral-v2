import React, {useState, useEffect} from 'react'

// Uses Vite's import.meta.glob to load PDFs from /src/data as URLs
const pdfModules = import.meta.glob('/src/data/*.pdf', { as: 'url' })

export default function PdfViewer() {
  const [pdfs, setPdfs] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    // Resolve the glob into an array of {name, url}
    const entries = Object.entries(pdfModules).map(([path, resolver]) => {
      // path looks like '/src/data/filename.pdf'
      const name = path.split('/').pop()
      return resolver().then((url) => ({ name, url }))
    })

    Promise.all(entries).then((res) => {
      // sort alphabetically
      res.sort((a, b) => a.name.localeCompare(b.name))
      setPdfs(res)
    })
  }, [])

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold mb-4">Question Banks (PDFs)</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <ul className="space-y-2">
            {pdfs.length === 0 && <li className="text-gray-500">No PDFs found</li>}
            {pdfs.map((p) => (
              <li key={p.name} className="flex items-center justify-between border rounded px-3 py-2 bg-white">
                <span className="truncate mr-3">{p.name.replace(/_/g, ' ')}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelected(p.url)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Open
                  </button>
                  <a href={p.url} target="_blank" rel="noreferrer" className="text-sm text-gray-600">New tab</a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-h-[400px] border rounded bg-white">
          {selected ? (
            <iframe
              title="pdf-viewer"
              src={selected}
              className="w-full h-[600px]"
            />
          ) : (
            <div className="p-6 text-gray-500">Select a PDF to preview</div>
          )}
        </div>
      </div>
    </div>
  )
}

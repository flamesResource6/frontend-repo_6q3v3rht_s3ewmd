import { useEffect, useState } from 'react'

export default function Dashboard({ onOpenTest }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/tests`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  return (
    <div className="bg-white/70 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Creative Tests</h2>
        <button onClick={load} className="text-sm px-3 py-1 rounded bg-gray-800 text-white">Refresh</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">No tests yet. Create one to get started.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {items.map(it => (
            <div key={it.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{it.name}</h3>
                  <p className="text-sm text-gray-600">{it.objective}</p>
                </div>
                <button onClick={()=>onOpenTest(it.id)} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">Open</button>
              </div>
              <div className="mt-3 text-xs text-gray-500">Variants: {it.variants?.length || 0} • Status: {it.status}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'

export default function ExperimentBuilder({ creatives, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState([])
  const [hypothesis, setHypothesis] = useState('')
  const [loading, setLoading] = useState(false)
  const backend = import.meta.env.VITE_BACKEND_URL

  const toggle = (id) => {
    setSelected((arr) =>
      arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]
    )
  }

  const create = async () => {
    if (selected.length < 2) return
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/experiments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, creative_ids: selected, hypothesis }),
      })
      if (!res.ok) throw new Error('Failed to create experiment')
      const data = await res.json()
      onCreated && onCreated(data.id)
      setName(''); setDescription(''); setSelected([]); setHypothesis('')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Experiment name" className="input" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className="input" />
        <input value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} placeholder="Hypothesis" className="input" />
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-2">Select at least 2 creatives</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {creatives.map((c) => (
            <button key={c._id} onClick={() => toggle(c._id)} className={`p-2 rounded border text-left ${selected.includes(c._id) ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
              <img src={c.media_url} alt={c.name} className="w-full h-24 object-cover rounded" />
              <div className="mt-2 text-sm font-medium line-clamp-1">{c.name}</div>
              <div className="text-xs text-gray-500">{c.platform} · {c.format}</div>
            </button>
          ))}
        </div>
      </div>
      <button disabled={loading || selected.length < 2} onClick={create} className="btn-primary">{loading ? 'Creating...' : 'Create experiment'}</button>
    </div>
  )
}

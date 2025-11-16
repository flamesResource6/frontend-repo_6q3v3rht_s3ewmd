import { useEffect, useState } from 'react'

export default function Reviewer({ testId }) {
  const [summary, setSummary] = useState(null)
  const [rating, setRating] = useState(4)
  const [comment, setComment] = useState('')
  const [selected, setSelected] = useState(0)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async () => {
    const res = await fetch(`${baseUrl}/api/tests/${testId}/summary`)
    const data = await res.json()
    setSummary(data)
  }

  const submitFeedback = async () => {
    const res = await fetch(`${baseUrl}/api/tests/feedback`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test_id: testId, feedback: { variant_index: selected, rating, comment, tags: [] } })
    })
    if (!res.ok) {
      const d = await res.json(); alert(d.detail || 'Failed')
    } else {
      setComment('')
      await load()
    }
  }

  useEffect(()=>{ load() }, [testId])

  if (!summary) return <div className="bg-white p-6 rounded-xl shadow">Loading...</div>

  return (
    <div className="bg-white/70 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Review: {summary.test?.name}</h2>
        <div className="text-sm text-gray-600">Avg rating: {summary.avg_rating ? summary.avg_rating.toFixed(1) : '—'} ({summary.feedback_count})</div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {summary.variants?.map((v, i) => (
          <button key={i} onClick={()=>setSelected(i)} className={`text-left border rounded-lg p-3 bg-white hover:border-blue-500 ${selected===i?'ring-2 ring-blue-500':''}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="font-medium">{v.title || `Variant ${i+1}`}</div>
              {selected===i && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">Selected</span>}
            </div>
            {v.image_url ? <img src={v.image_url} alt="preview" className="rounded mb-2"/> : <div className="h-24 bg-gray-100 rounded mb-2 flex items-center justify-center text-gray-400">No preview</div>}
            <div className="text-sm">{v.headline}</div>
            <div className="text-xs text-gray-600">{v.primary_text}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-sm text-gray-600">Rating</label>
          <input type="range" min="1" max="5" value={rating} onChange={e=>setRating(parseInt(e.target.value))} className="w-full"/>
          <div className="text-sm text-gray-700">{rating} / 5</div>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Comment</label>
          <input value={comment} onChange={e=>setComment(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Share quick thoughts"/>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button onClick={submitFeedback} className="px-4 py-2 rounded bg-blue-600 text-white">Submit Feedback</button>
      </div>
    </div>
  )
}

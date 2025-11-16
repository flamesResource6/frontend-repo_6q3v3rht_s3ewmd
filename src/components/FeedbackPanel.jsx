import { useEffect, useState } from 'react'

export default function FeedbackPanel({ experimentId, creatives }) {
  const [feedback, setFeedback] = useState([])
  const [score, setScore] = useState(5)
  const [note, setNote] = useState('')
  const [creativeId, setCreativeId] = useState('')
  const [loading, setLoading] = useState(false)

  const backend = import.meta.env.VITE_BACKEND_URL

  const load = async () => {
    const q = new URLSearchParams(experimentId ? { experiment_id: experimentId } : {})
    const res = await fetch(`${backend}/api/feedback?${q.toString()}`)
    const data = await res.json()
    setFeedback(data)
  }

  useEffect(() => { load() }, [experimentId])

  const submit = async () => {
    if (!creativeId) return
    setLoading(true)
    try {
      const res = await fetch(`${backend}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiment_id: experimentId, creative_id: creativeId, score: Number(score), note }),
      })
      if (res.ok) {
        setNote(''); setScore(5); setCreativeId('')
        await load()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <select value={creativeId} onChange={(e) => setCreativeId(e.target.value)} className="input">
            <option value="">Choose creative</option>
            {creatives.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <input type="number" min={1} max={5} value={score} onChange={(e) => setScore(e.target.value)} className="input" />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Short note" className="input" />
          <button onClick={submit} disabled={!creativeId || loading} className="btn-primary">{loading ? 'Submitting...' : 'Submit feedback'}</button>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Recent feedback</h3>
        <div className="space-y-2 max-h-64 overflow-auto pr-2">
          {feedback.map(f => (
            <div key={f._id} className="p-3 rounded border border-gray-200 flex items-center justify-between">
              <div>
                <div className="text-sm">{f.note || 'No note'}</div>
                <div className="text-xs text-gray-500">Creative: {f.creative_id} · Score: {f.score}</div>
              </div>
              <div className="text-sm font-medium">⭐ {f.score}</div>
            </div>
          ))}
          {feedback.length === 0 && <p className="text-sm text-gray-500">No feedback yet.</p>}
        </div>
      </div>
    </div>
  )
}

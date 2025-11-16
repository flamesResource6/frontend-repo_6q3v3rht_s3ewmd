import { useState } from 'react'

export default function Creator({ onCreated }) {
  const [name, setName] = useState('Q1 Headline Test')
  const [objective, setObjective] = useState('Improve CTR by 15%')
  const [variants, setVariants] = useState([
    { title: 'Variant A', headline: 'Shop the new collection', primary_text: 'Fresh drops, limited time', call_to_action: 'Shop Now', image_url: '' },
    { title: 'Variant B', headline: 'New season, new you', primary_text: 'Upgrade your style today', call_to_action: 'Learn More', image_url: '' },
  ])
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const addVariant = () => setVariants(v => [...v, { title: `Variant ${String.fromCharCode(65+v.length)}`, headline: '', primary_text: '', call_to_action: '', image_url: '' }])
  const updateVariant = (i, key, value) => setVariants(v => v.map((it, idx) => idx === i ? { ...it, [key]: value } : it))
  const removeVariant = (i) => setVariants(v => v.filter((_, idx) => idx !== i))

  const createTest = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: { name, objective, variants, status: 'draft' } })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create')
      onCreated?.(data.id)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/70 backdrop-blur p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">New Creative Test</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-600">Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Objective</label>
          <input value={objective} onChange={e=>setObjective(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Variants</h3>
          <button onClick={addVariant} className="text-sm px-3 py-1 rounded bg-blue-600 text-white">Add Variant</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {variants.map((v, i) => (
            <div key={i} className="border rounded-lg p-3 bg-white">
              <div className="flex items-center justify-between mb-2">
                <input value={v.title} onChange={e=>updateVariant(i,'title',e.target.value)} className="font-medium" />
                <button onClick={()=>removeVariant(i)} className="text-xs text-red-600">Remove</button>
              </div>
              <input placeholder="Headline" value={v.headline} onChange={e=>updateVariant(i,'headline',e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />
              <textarea placeholder="Primary Text" value={v.primary_text} onChange={e=>updateVariant(i,'primary_text',e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />
              <input placeholder="CTA" value={v.call_to_action} onChange={e=>updateVariant(i,'call_to_action',e.target.value)} className="w-full border rounded px-2 py-1 mb-2" />
              <input placeholder="Image URL (optional)" value={v.image_url} onChange={e=>updateVariant(i,'image_url',e.target.value)} className="w-full border rounded px-2 py-1" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button disabled={loading} onClick={createTest} className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50">{loading? 'Creating...':'Create Test'}</button>
      </div>
    </div>
  )
}

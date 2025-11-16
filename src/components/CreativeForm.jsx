import { useState } from 'react'

export default function CreativeForm({ onCreated }) {
  const [form, setForm] = useState({
    name: '',
    media_url: '',
    headline: '',
    primary_text: '',
    cta: '',
    platform: 'meta',
    format: 'image',
    tags: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const backend = import.meta.env.VITE_BACKEND_URL

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }

    try {
      const res = await fetch(`${backend}/api/creatives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to create creative')
      const data = await res.json()
      onCreated && onCreated(data.id)
      setForm({
        name: '', media_url: '', headline: '', primary_text: '', cta: '', platform: 'meta', format: 'image', tags: ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Creative name" className="input" required />
        <input name="media_url" value={form.media_url} onChange={handleChange} placeholder="Image/Video URL" className="input" required />
        <input name="headline" value={form.headline} onChange={handleChange} placeholder="Headline" className="input" />
        <input name="primary_text" value={form.primary_text} onChange={handleChange} placeholder="Primary text" className="input" />
        <input name="cta" value={form.cta} onChange={handleChange} placeholder="CTA (e.g., Shop Now)" className="input" />
        <select name="platform" value={form.platform} onChange={handleChange} className="input">
          <option value="meta">Meta</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
        </select>
        <select name="format" value={form.format} onChange={handleChange} className="input">
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="carousel">Carousel</option>
          <option value="story">Story</option>
        </select>
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="input" />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={loading} className="btn-primary w-full md:w-auto">{loading ? 'Saving...' : 'Save creative'}</button>
    </form>
  )
}

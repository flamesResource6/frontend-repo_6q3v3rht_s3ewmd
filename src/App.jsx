import { useEffect, useMemo, useState } from 'react'
import CreativeForm from './components/CreativeForm'
import ExperimentBuilder from './components/ExperimentBuilder'
import FeedbackPanel from './components/FeedbackPanel'

function Section({ title, children, subtitle }) {
  return (
    <section className="bg-white/70 backdrop-blur border border-gray-100 rounded-xl p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  )
}

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL
  const [creatives, setCreatives] = useState([])
  const [experiments, setExperiments] = useState([])
  const [activeExperiment, setActiveExperiment] = useState('')

  const load = async () => {
    const [cRes, eRes] = await Promise.all([
      fetch(`${backend}/api/creatives`),
      fetch(`${backend}/api/experiments`),
    ])
    const [cData, eData] = await Promise.all([cRes.json(), eRes.json()])
    setCreatives(cData)
    setExperiments(eData)
  }

  useEffect(() => { load() }, [])

  const activeCreatives = useMemo(() => {
    if (!activeExperiment) return []
    const exp = experiments.find((e) => e._id === activeExperiment)
    if (!exp) return []
    return creatives.filter((c) => exp.creative_ids.includes(c._id))
  }, [activeExperiment, experiments, creatives])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-teal-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Meta Creatives Testing Tools</h1>
          <a href="https://developers.facebook.com/docs/marketing-apis/" target="_blank" className="text-blue-600 text-sm hover:underline">Meta Marketing API docs</a>
        </header>

        <Section title="Create creatives" subtitle="Define the assets and copy you want to test.">
          <CreativeForm onCreated={load} />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {creatives.map(c => (
              <div key={c._id} className="p-3 rounded-lg border border-gray-200 bg-white">
                <img src={c.media_url} alt={c.name} className="w-full h-28 object-cover rounded" />
                <div className="mt-2 text-sm font-medium line-clamp-1">{c.name}</div>
                <div className="text-xs text-gray-500">{c.platform} · {c.format}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Build experiment" subtitle="Pick at least two creatives to compare.">
          <ExperimentBuilder creatives={creatives} onCreated={load} />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            {experiments.map(e => (
              <button key={e._id} onClick={() => setActiveExperiment(e._id)} className={`p-3 rounded border text-left ${activeExperiment === e._id ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                <div className="font-medium">{e.name}</div>
                <div className="text-xs text-gray-500 line-clamp-2">{e.description || 'No description'}</div>
                <div className="text-xs mt-1">Creatives: {e.creative_ids.length}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section title="Collect feedback" subtitle="Rate creatives and capture notes to decide winners.">
          <FeedbackPanel experimentId={activeExperiment} creatives={activeCreatives} />
        </Section>

        <footer className="pt-6 text-center text-xs text-gray-500">Local testing UI. Not affiliated with Meta.</footer>
      </div>
    </div>
  )
}

export default App

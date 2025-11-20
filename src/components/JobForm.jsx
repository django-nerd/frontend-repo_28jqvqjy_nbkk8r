import { useEffect, useState } from 'react'

const providers = [
  { key: 'gemini', name: 'Gemini AI' },
  { key: 'wan2_1', name: 'WAN 2.1' },
  { key: 'grok', name: 'Grok AI' },
  { key: 'hailuo', name: 'Hailuo AI' },
  { key: 'sora2', name: 'Sora 2' },
]

function JobForm({ onCreated }) {
  const [prompt, setPrompt] = useState('A neon-lit city at night with flying cars, cinematic')
  const [provider, setProvider] = useState(providers[0].key)
  const [aspect, setAspect] = useState('16:9')
  const [duration, setDuration] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Optionally fetch providers from backend
    // but we already know the list
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, prompt, aspect_ratio: aspect, duration: Number(duration) }),
      })
      if (!res.ok) throw new Error(`Failed: ${res.status}`)
      const data = await res.json()
      onCreated && onCreated(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-white/10 rounded-2xl p-6 backdrop-blur">
      <div className="grid gap-4">
        <textarea
          className="w-full rounded-xl bg-slate-900/60 border border-white/10 p-4 text-blue-50 placeholder:text-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the scene you want to generate"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select value={provider} onChange={(e) => setProvider(e.target.value)} className="rounded-xl bg-slate-900/60 border border-white/10 p-3 text-blue-50">
            {providers.map(p => <option key={p.key} value={p.key}>{p.name}</option>)}
          </select>
          <select value={aspect} onChange={(e) => setAspect(e.target.value)} className="rounded-xl bg-slate-900/60 border border-white/10 p-3 text-blue-50">
            {['16:9','9:16','1:1','4:3'].map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <input type="number" min={1} max={60} value={duration} onChange={(e)=>setDuration(e.target.value)} className="rounded-xl bg-slate-900/60 border border-white/10 p-3 text-blue-50" />
          <button disabled={loading} className="rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-medium px-4">
            {loading ? 'Creating…' : 'Generate'}
          </button>
        </div>
        {error && <div className="text-red-300 text-sm">{error}</div>}
      </div>
    </form>
  )
}

export default JobForm

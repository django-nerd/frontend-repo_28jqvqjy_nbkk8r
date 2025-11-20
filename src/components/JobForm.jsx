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

  // Multi-frame/multi-image
  const [mode, setMode] = useState('text_to_video')
  const [imageUrlsText, setImageUrlsText] = useState('')
  const [fps, setFps] = useState(24)

  // Optional API keys per request
  const [hailuoKey, setHailuoKey] = useState('')
  const [soraKey, setSoraKey] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // noop
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const image_urls = imageUrlsText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)

      const payload = {
        provider,
        mode,
        prompt,
        aspect_ratio: aspect,
        duration: Number(duration),
      }

      if (mode !== 'text_to_video') {
        payload.image_urls = image_urls
      }
      if (mode === 'image_sequence_to_video') {
        payload.fps = Number(fps)
      }

      const api_keys = {}
      if (hailuoKey) api_keys.hailuo = hailuoKey
      if (soraKey) api_keys.sora2 = soraKey
      if (Object.keys(api_keys).length) payload.api_keys = api_keys

      const res = await fetch(`${baseUrl}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg || `Failed: ${res.status}`)
      }
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select value={mode} onChange={(e)=>setMode(e.target.value)} className="rounded-xl bg-slate-900/60 border border-white/10 p-3 text-blue-50">
            <option value="text_to_video">Text → Video</option>
            <option value="image_sequence_to_video">Image sequence → Video</option>
            <option value="multi_image_guided">Multi‑image guided Text → Video</option>
          </select>
          {mode !== 'text_to_video' && (
            <textarea
              className="md:col-span-2 w-full rounded-xl bg-slate-900/60 border border-white/10 p-3 text-blue-50 placeholder:text-blue-200/40"
              rows={3}
              value={imageUrlsText}
              onChange={(e)=>setImageUrlsText(e.target.value)}
              placeholder="Paste image URLs, one per line in order"
            />
          )}
          {mode === 'image_sequence_to_video' && (
            <input type="number" min={1} max={60} value={fps} onChange={(e)=>setFps(e.target.value)} className="rounded-xl bg-slate-900/60 border border-white/10 p-3 text-blue-50" placeholder="FPS" />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input type="password" value={hailuoKey} onChange={(e)=>setHailuoKey(e.target.value)} className="rounded-xl bg-slate-900/60 border border-white/10 p-3 text-blue-50" placeholder="Optional HAILUO_API_KEY (per request)" />
          <input type="password" value={soraKey} onChange={(e)=>setSoraKey(e.target.value)} className="rounded-xl bg-slate-900/60 border border-white/10 p-3 text-blue-50" placeholder="Optional SORA_API_KEY (per request)" />
        </div>

        {error && <div className="text-red-300 text-sm">{error}</div>}
      </div>
    </form>
  )
}

export default JobForm

import { useEffect, useState } from 'react'

function JobList() {
  const [jobs, setJobs] = useState([])

  const fetchJobs = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${baseUrl}/api/jobs?limit=50`)
      if (!res.ok) return
      const data = await res.json()
      setJobs(data)
    } catch (e) {
      // silent
    }
  }

  useEffect(() => {
    fetchJobs()
    const t = setInterval(fetchJobs, 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {jobs.map(job => (
        <div key={job.id} className="bg-slate-800/60 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-blue-100 text-sm">{job.provider.toUpperCase()}</div>
            <div className={`text-xs px-2 py-0.5 rounded-full ${job.status==='completed'?'bg-green-500/20 text-green-300': job.status==='failed'?'bg-red-500/20 text-red-300':'bg-yellow-500/10 text-yellow-200'}`}>{job.status}</div>
          </div>
          <div className="text-blue-50/80 text-sm line-clamp-2 mb-3">{job.prompt}</div>
          {job.result_url && (
            <video className="w-full rounded-lg" src={job.result_url} controls/>
          )}
        </div>
      ))}
    </div>
  )
}

export default JobList

import Hero from './components/Hero'
import JobForm from './components/JobForm'
import JobList from './components/JobList'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Hero />

      <main className="relative z-10 max-w-5xl mx-auto px-6 -mt-16 space-y-8">
        <JobForm />
        <JobList />
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-16 text-center text-blue-200/60">
        Built for exploring multi‑model video generation.
      </footer>
    </div>
  )
}

export default App

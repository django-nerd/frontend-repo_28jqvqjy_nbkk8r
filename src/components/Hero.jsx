import Spline from '@splinetool/react-spline'

function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-40">
          <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-200 text-xs mb-6 backdrop-blur">
          Multi‑Model AI Video Generator
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
          Create videos with Gemini, Sora 2, WAN 2.1, Grok, and Hailuo
        </h1>
        <p className="mt-4 text-blue-100/80 md:text-lg">
          Type a prompt, choose a model, and generate short clips. Preview, compare, and download.
        </p>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-slate-900 pointer-events-none" />
    </section>
  )
}

export default Hero

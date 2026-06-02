import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FRAME_COUNT = 240
const FRAME_PATH = (i) =>
  `/headshot-frames/ezgif-frame-${String(i).padStart(3, '0')}.jpg`
const STATIC_FRAME = '/headshot-frames/ezgif-frame-120.jpg'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return isMobile
}

function Tagline({ opacity = 1 }) {
  return (
    <div
      style={{ opacity, transform: `translateY(${(1 - opacity) * 16}px)` }}
      className="pointer-events-none absolute inset-x-0 bottom-[12%] z-10 px-6 text-center"
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-400">
        The person behind the code
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-50 drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)] sm:text-5xl">
        Curious. Relentless. Shipping.
      </h2>
    </div>
  )
}

export default function HeadshotSequence() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileHeadshot /> : <DesktopSequence />
}

function MobileHeadshot() {
  return (
    <section className="relative h-[72vh] w-full overflow-hidden bg-zinc-950">
      <img
        src={STATIC_FRAME}
        alt="Smit Merchant"
        className="absolute inset-0 h-full w-full object-cover"
        loading="eager"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/20 via-transparent to-zinc-950/80" />
      <Tagline opacity={1} />
    </section>
  )
}

function DesktopSequence() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const images = []
    const frame = { index: 0 }
    let loadedCount = 0

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image()
      img.src = FRAME_PATH(i)
      img.onload = () => {
        loadedCount += 1
        setLoaded(loadedCount)
        if (loadedCount === 1) render()
      }
      images.push(img)
    }

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      render()
    }

    const render = () => {
      const img = images[Math.min(frame.index, images.length - 1)]
      if (!img || !img.complete || !img.naturalWidth) return
      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      ctx.clearRect(0, 0, cw, ch)
      // contain fit so the full figure (head + body) stays visible as it scrubs
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight)
      const w = img.naturalWidth * scale
      const h = img.naturalHeight * scale
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h)
    }

    sizeCanvas()
    window.addEventListener('resize', sizeCanvas)
    // Recalculate pin positions once frames have loaded.
    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 400)

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=320%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        setProgress(self.progress)
        frame.index = Math.min(FRAME_COUNT - 1, Math.floor(self.progress * (FRAME_COUNT - 1)))
        render()
      },
    })

    return () => {
      st.kill()
      clearTimeout(refreshTimer)
      window.removeEventListener('resize', sizeCanvas)
    }
  }, [])

  const overlayOpacity = Math.max(0, (progress - 0.78) / 0.22)
  const loadPct = Math.round((loaded / FRAME_COUNT) * 100)

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-zinc-950">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ filter: 'contrast(1.04) saturate(1.04)' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950/25 via-transparent to-zinc-950/75" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_62%,rgba(9,9,11,0.6)_100%)]" />

      {loaded < FRAME_COUNT && (
        <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-md border border-zinc-800 bg-zinc-900/70 px-3 py-1 font-mono text-xs text-zinc-400">
          Loading… {loadPct}%
        </div>
      )}

      <Tagline opacity={overlayOpacity} />
    </section>
  )
}

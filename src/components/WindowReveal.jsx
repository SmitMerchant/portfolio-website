import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROFILE } from '../data'

gsap.registerPlugin(ScrollTrigger)

const PORTRAIT = '/hero-cutout.png'
const MASK_WORD = 'SMIT'

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function WindowReveal() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const photoRef = useRef(null)
  const maskTextRef = useRef(null)
  const overlayRef = useRef(null)
  const introRef = useRef(null)
  const cueRef = useRef(null)
  const heroRef = useRef(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReduced(true)
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(heroRef.current, { autoAlpha: 0, y: 24 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=260%',
          pin: stageRef.current,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      // Phase 1 — the word grows into a window onto the lit upper body, which
      // is held zoomed in so the reveal never opens onto empty/dark areas.
      tl.fromTo(
        maskTextRef.current,
        { scale: 1, transformOrigin: '50% 50%' },
        { scale: 32, transformOrigin: '50% 50%', ease: 'power1.in', duration: 0.72 },
        0
      )
        // Subtle parallax only — keep the lit upper body anchored at the window.
        .fromTo(
          photoRef.current,
          { scale: 1.08, transformOrigin: '50% 40%' },
          { scale: 1, transformOrigin: '50% 40%', ease: 'none', duration: 1 },
          0
        )
        // The intro line + scroll cue fade as the window opens.
        .to(introRef.current, { autoAlpha: 0, y: -20, ease: 'power1.in', duration: 0.28 }, 0)
        .to(cueRef.current, { autoAlpha: 0, ease: 'power1.in', duration: 0.22 }, 0)
        // Phase 2 — dissolve the panel and pull back to the full figure.
        .to(overlayRef.current, { autoAlpha: 0, ease: 'power1.out', duration: 0.2 }, 0.58)
        .to(heroRef.current, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0.72)
    }, sectionRef)

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 300)
    return () => {
      clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative w-full bg-zinc-950"
    >
      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden bg-zinc-950"
      >
        {/* Studio backdrop behind the (transparent) portrait */}
        <div className="absolute inset-0 bg-[radial-gradient(125%_95%_at_50%_30%,#33333c_0%,#1c1c22_42%,#0c0c0f_100%)]" />
        {/* soft key light behind the figure */}
        <div className="absolute inset-0 bg-[radial-gradient(46%_52%_at_50%_40%,rgba(150,160,185,0.30)_0%,transparent_72%)]" />
        <div className="grain pointer-events-none absolute inset-0 opacity-[0.16]" />

        {/* The fixed image being revealed */}
        <div ref={photoRef} className="absolute inset-0 will-change-transform">
          <img
            src={PORTRAIT}
            alt="Smit Merchant"
            draggable="false"
            className="portrait-blend absolute bottom-0 left-1/2 h-[94%] max-w-none -translate-x-1/2 select-none object-contain"
          />
          {/* fade the base of the figure into the backdrop */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-zinc-950" />
        </div>

        {/* SVG clip-mask overlay — the word is punched out of a solid panel */}
        {!reduced && (
          <svg
            ref={overlayRef}
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <mask id="window-mask">
                <rect width="100%" height="100%" fill="white" />
                <text
                  ref={maskTextRef}
                  x="50%"
                  y="40%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="mask-word"
                  fill="black"
                >
                  {MASK_WORD}
                </text>
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="#09090b"
              mask="url(#window-mask)"
            />
          </svg>
        )}

        {/* Intro label sitting inside the closed window */}
        {!reduced && (
          <div
            ref={introRef}
            className="pointer-events-none absolute inset-x-0 top-[16%] z-10 text-center"
          >
            <p className="font-mono text-xs uppercase tracking-[0.34em] text-zinc-400">
              {PROFILE.role}
            </p>
          </div>
        )}

        {/* Scroll cue */}
        {!reduced && (
          <div
            ref={cueRef}
            className="pointer-events-none absolute inset-x-0 bottom-7 z-10 flex flex-col items-center gap-2 text-zinc-400"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.3em]">
              Scroll
            </span>
            <span className="scroll-cue h-9 w-px bg-gradient-to-b from-zinc-400 to-transparent" />
          </div>
        )}

        {/* Hero content revealed over the photo */}
        <div
          ref={heroRef}
          className="absolute inset-x-0 bottom-0 z-20 px-6 pb-14 sm:px-10 sm:pb-16"
        >
          <div className="mx-auto w-full max-w-5xl">
            <p className="mb-4 inline-flex items-center gap-2 font-mono text-xs text-zinc-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Available for AI &amp; full-stack roles
            </p>
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-tight text-zinc-50 drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] sm:text-7xl">
              {PROFILE.name}
            </h1>
            <p className="mt-3 max-w-lg text-base text-zinc-300 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {PROFILE.role} &middot; {PROFILE.location}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

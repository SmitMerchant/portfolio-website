import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS } from '../data'
import Reveal from './Reveal'
import { ExternalIcon, GithubIcon } from './Icons'

gsap.registerPlugin(ScrollTrigger)

const META = {
  'LeadGen Pro': 'SaaS product',
  'Smart Search for Research Expert Connections': 'QA & AI testing',
  'Food Transparency': 'Side project',
  ReflectoChain: 'Side project',
  'Dissertation — Action Recognition for Surveillance': 'MSc dissertation',
}

const CARD_COUNT = PROJECTS.length
const ANGLE_STEP = 360 / CARD_COUNT

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function ProjectCard({ project, active = false }) {
  const hasLinks = project.live || project.github
  return (
    <article
      className={`card-3d-face flex h-full min-h-[320px] flex-col border bg-zinc-900/50 p-5 transition-[border-color,box-shadow] duration-200 ${
        active
          ? 'border-zinc-600 shadow-[0_28px_70px_rgba(0,0,0,0.5)]'
          : 'border-zinc-800'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-medium text-zinc-100">{project.title}</h3>
        <span className="shrink-0 whitespace-nowrap font-mono text-xs text-zinc-500">
          {META[project.title]}
        </span>
      </div>

      <p className="mt-2.5 flex-1 text-sm leading-relaxed text-zinc-400">{project.blurb}</p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-5 border-t border-zinc-800/80 pt-4">
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" className="link">
            <ExternalIcon width="14" height="14" /> Live demo
          </a>
        )}
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" className="link">
            <GithubIcon width="14" height="14" /> Source
          </a>
        )}
        {!hasLinks && <span className="font-mono text-xs text-zinc-600">Private repository</span>}
      </div>
    </article>
  )
}

function StaticGrid() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2">
      {PROJECTS.map((project, i) => (
        <Reveal key={project.title} delay={(i % 2) * 0.05} className="h-full">
          <ProjectCard project={project} />
        </Reveal>
      ))}
    </div>
  )
}

function CardCarousel() {
  const stageRef = useRef(null)
  const ringRef = useRef(null)
  const focusRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [radius, setRadius] = useState(520)

  useEffect(() => {
    const calcRadius = () => (window.innerWidth < 768 ? 340 : 520)
    setRadius(calcRadius())

    const onResize = () => setRadius(calcRadius())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const stage = stageRef.current
    const ring = ringRef.current
    const focuses = focusRefs.current.filter(Boolean)
    if (!stage || !ring || focuses.length === 0) return

    const updateFocus = (rotationY) => {
      let closest = 0
      let closestDist = Infinity

      focuses.forEach((focus, i) => {
        const worldAngle = ((i * ANGLE_STEP + rotationY) % 360 + 360) % 360
        const dist = Math.min(worldAngle, 360 - worldAngle)
        const opacity = gsap.utils.clamp(0.22, 1, gsap.utils.mapRange(0, 65, 1, 0.22, dist))
        const scale = gsap.utils.clamp(0.76, 1, gsap.utils.mapRange(0, 65, 1, 0.76, dist))

        gsap.set(focus, { opacity, scale, zIndex: Math.round(100 - dist) })

        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      })

      setActiveIndex(closest)
    }

    const ctx = gsap.context(() => {
      const laps = 1.4
      const totalRotation = 360 * laps

      gsap.to(ring, {
        rotateY: -totalRotation,
        ease: 'none',
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: `+=${Math.round(CARD_COUNT * 110 * laps)}%`,
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          onUpdate: (self) => {
            updateFocus(-totalRotation * self.progress)
          },
        },
      })

      updateFocus(0)
    }, stage)

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 400)

    return () => {
      clearTimeout(refreshTimer)
      ctx.revert()
    }
  }, [radius])

  return (
    <div className="relative mt-10">
      <div ref={stageRef} className="card-carousel-stage relative">
        <div className="pointer-events-none absolute inset-x-0 top-5 z-10 flex justify-center">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
            {String(activeIndex + 1).padStart(2, '0')} / {String(CARD_COUNT).padStart(2, '0')}
          </span>
        </div>

        <div className="card-carousel-floor pointer-events-none absolute inset-x-0 bottom-6 h-28 bg-[radial-gradient(55%_90%_at_50%_100%,rgba(90,100,125,0.2)_0%,transparent_72%)]" />

        <div className="card-carousel-tilt">
          <div ref={ringRef} className="card-carousel-ring">
            {PROJECTS.map((project, i) => (
              <div
                key={project.title}
                className="card-carousel-slot"
                style={{
                  transform: `rotateY(${i * ANGLE_STEP}deg) translateZ(${radius}px) translateY(-50%)`,
                }}
              >
                <div
                  ref={(el) => {
                    focusRefs.current[i] = el
                  }}
                  className="card-carousel-focus"
                >
                  <ProjectCard project={project} active={i === activeIndex} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-600">
        Scroll to revolve
      </p>
    </div>
  )
}

export default function Projects() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  return (
    <section id="projects" className="container-px scroll-mt-20 border-t border-zinc-900 py-16 sm:py-24">
      <Reveal>
        <span className="eyebrow">Projects</span>
        <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
          A selection of products and research I&apos;ve built — spanning shipped SaaS,
          applied NLP and computer-vision systems.
        </p>
      </Reveal>

      {reduced ? <StaticGrid /> : <CardCarousel />}
    </section>
  )
}

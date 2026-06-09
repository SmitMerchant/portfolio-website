import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EDUCATION } from '../data'
import Reveal from './Reveal'
import Logomark from './Logomark'

gsap.registerPlugin(ScrollTrigger)

const EDU_LOGOS = {
  'Sheffield Hallam University': { file: 'shu.png', monogram: 'SHU' },
  'University of Mumbai': { file: 'mumbai.svg', monogram: 'UoM' },
}

const ABOUT_COPY = [
  "I'm an AI full-stack developer based in Sheffield. I hold a Master's in Artificial Intelligence and a Bachelor's in Computer Engineering, and I focus on taking AI from research and prototypes into software that ships and stays reliable.",
  'My work spans the whole stack, training and evaluating models, designing FastAPI and Next.js services, and building the interfaces people actually use. Most recently I built a five-phase AI sales-intelligence pipeline that automates prospect discovery, lead scoring and personalised outreach at scale.',
  'Outside of work I build and ship side projects and keep a close eye on where applied AI is heading.',
]

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function ScrollBoldText({ paragraphs }) {
  const blockRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const words = blockRef.current?.querySelectorAll('.about-word')
    if (!words?.length) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: blockRef.current,
          start: 'top 80%',
          end: 'bottom 35%',
          scrub: 0.45,
        },
      })

      words.forEach((word, i) => {
        tl.to(
          word,
          {
            color: '#fafafa',
            ease: 'none',
            duration: 0.5,
          },
          i * 0.035
        )
      })
    }, blockRef)

    return () => ctx.revert()
  }, [paragraphs])

  return (
    <div
      ref={blockRef}
      className="max-w-xl space-y-4 text-[15px] font-semibold leading-relaxed"
    >
      {paragraphs.map((paragraph) => {
        const words = paragraph.split(' ')
        return (
          <p key={paragraph.slice(0, 24)} className="break-words">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="about-word text-zinc-500 will-change-[color]"
              >
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        )
      })}
    </div>
  )
}

export default function About() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(prefersReducedMotion())
  }, [])

  return (
    <section id="about" className="container-px scroll-mt-20 border-t border-zinc-900 py-16 sm:py-24">
      <Reveal>
        <span className="eyebrow">About</span>
      </Reveal>

      <div className="mt-2 flex flex-col gap-16 lg:grid lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-12">
        <div className="min-w-0">
          {reduced ? (
            <Reveal>
              <div className="max-w-xl space-y-4 text-[15px] font-semibold leading-relaxed text-zinc-100">
                {ABOUT_COPY.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="break-words">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ) : (
            <ScrollBoldText paragraphs={ABOUT_COPY} />
          )}
        </div>

        <Reveal delay={0.05} className="min-w-0 shrink-0">
          <div className="border-t border-zinc-900 pt-10 lg:border-t-0 lg:pt-0">
            <h3 className="mb-4 text-sm font-medium text-zinc-300">Education</h3>
            <ul className="space-y-5">
              {EDUCATION.map((ed) => {
                const logo = EDU_LOGOS[ed.school] || {}
                return (
                  <li key={ed.degree} className="flex gap-3">
                    <Logomark file={logo.file} name={ed.school} monogram={logo.monogram} />
                    <div className="min-w-0">
                      <p className="text-sm text-zinc-200">{ed.degree}</p>
                      <p className="text-sm text-zinc-400">{ed.school}</p>
                      <p className="mt-0.5 font-mono text-xs text-zinc-500">{ed.date}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

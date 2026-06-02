import { EDUCATION } from '../data'
import Reveal from './Reveal'
import Logomark from './Logomark'

const EDU_LOGOS = {
  'Sheffield Hallam University': { file: 'shu.png', monogram: 'SHU' },
  'University of Mumbai': { file: 'mumbai.svg', monogram: 'UoM' },
}

export default function About() {
  return (
    <section id="about" className="container-px scroll-mt-20 border-t border-zinc-900 py-16 sm:py-24">
      <Reveal>
        <span className="eyebrow">About</span>
      </Reveal>

      <div className="mt-2 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
        <Reveal>
          <div className="max-w-xl space-y-4 text-[15px] leading-relaxed text-zinc-400">
            <p>
              I&apos;m an AI full-stack developer based in Sheffield. I hold a Master&apos;s in
              Artificial Intelligence and a Bachelor&apos;s in Computer Engineering, and I focus on
              taking AI from research and prototypes into software that ships and stays reliable.
            </p>
            <p>
              My work spans the whole stack — training and evaluating models, designing FastAPI
              and Next.js services, and building the interfaces people actually use. Most recently
              I built a five-phase AI sales-intelligence pipeline that automates prospect discovery,
              lead scoring and personalised outreach at scale.
            </p>
            <p>
              Outside of work I build and ship side projects and keep a close eye on where applied
              AI is heading.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div>
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

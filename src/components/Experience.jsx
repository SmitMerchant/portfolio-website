import { EXPERIENCE } from '../data'
import Reveal from './Reveal'
import Logomark from './Logomark'

const COMPANY_LOGOS = {
  Adtecher: { file: 'adtecher.jpg', monogram: 'AD' },
}

export default function Experience() {
  return (
    <section id="experience" className="container-px scroll-mt-20 border-t border-zinc-900 py-16 sm:py-24">
      <Reveal>
        <span className="eyebrow">Experience</span>
      </Reveal>

      <div className="mt-2 space-y-10">
        {EXPERIENCE.map((job) => {
          const logo = COMPANY_LOGOS[job.company] || {}
          return (
            <Reveal key={job.company}>
              <article className="grid gap-4 sm:grid-cols-[auto_1fr]">
                <Logomark file={logo.file} name={job.company} monogram={logo.monogram} />
                <div>
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <div>
                      <h3 className="text-base font-medium text-zinc-100">{job.role}</h3>
                      <p className="text-sm text-zinc-400">
                        {job.company} &middot; {job.location}
                      </p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-zinc-500">{job.date}</span>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {job.points.map((p, i) => (
                      <li key={i} className="relative pl-4 text-sm leading-relaxed text-zinc-400">
                        <span className="absolute left-0 top-2.5 h-1 w-1 rounded-full bg-zinc-600" />
                        {p}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.tech.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}

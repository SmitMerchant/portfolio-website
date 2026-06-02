import { PROFILE } from '../data'
import { GithubIcon, LinkedinIcon, MailIcon } from './Icons'

export default function Hero() {
  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="top" className="container-px py-16 sm:py-24">
      <div className="grid">
        <div className="animate-fade-up">
          <p className="mb-5 inline-flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Available for AI &amp; full-stack roles
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
            {PROFILE.name}
          </h1>
          <p className="mt-2 text-base text-zinc-400">
            {PROFILE.role} &middot; {PROFILE.location}
          </p>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            I build production AI systems end to end — data pipelines, models, APIs and
            the interfaces on top. Currently shipping an AI sales-intelligence platform at
            Adtecher, with a background spanning deep learning research and full-stack
            product engineering.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={() => scrollTo('#projects')} className="btn-solid">
              View projects
            </button>
            <a href={PROFILE.cv} download className="btn-outline">
              Download résumé
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href={PROFILE.github} target="_blank" rel="noreferrer" className="link">
              <GithubIcon width="16" height="16" /> GitHub
            </a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="link">
              <LinkedinIcon width="16" height="16" /> LinkedIn
            </a>
            <a href={`mailto:${PROFILE.email}`} className="link">
              <MailIcon width="16" height="16" /> {PROFILE.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

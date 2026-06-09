import { PROFILE } from '../data'
import { GithubIcon, LinkedinIcon, MailIcon } from './Icons'

export default function Hero() {
  const scrollTo = (href) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="container-px py-20 sm:py-28">
      <div className="grid">
        <div className="animate-fade-up">
          <span className="eyebrow">Introduction</span>

          <h2 className="max-w-2xl text-2xl font-semibold leading-snug tracking-tight text-zinc-100 sm:text-3xl">
            I build production AI systems end to end — data pipelines, models, APIs
            and the interfaces people actually use.
          </h2>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-zinc-400">
            Currently shipping an AI sales-intelligence platform at Adtecher, with a
            background spanning deep-learning research and full-stack product
            engineering. Based in {PROFILE.location}.
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

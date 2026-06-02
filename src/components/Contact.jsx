import { PROFILE } from '../data'
import Reveal from './Reveal'
import { GithubIcon, LinkedinIcon, MailIcon } from './Icons'

export default function Contact() {
  return (
    <section id="contact" className="container-px scroll-mt-20 border-t border-zinc-900 py-16 sm:py-24">
      <Reveal>
        <span className="eyebrow">Contact</span>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">Get in touch</h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-zinc-400">
          I&apos;m open to AI and full-stack roles and interesting problems. The quickest way to
          reach me is email — I read everything.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a href={`mailto:${PROFILE.email}`} className="btn-solid">
            {PROFILE.email}
          </a>
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
            <MailIcon width="16" height="16" /> Email
          </a>
        </div>
      </Reveal>

      <footer className="mt-16 flex flex-col gap-2 border-t border-zinc-900 pt-6 text-xs text-zinc-600 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {PROFILE.name}</p>
        <p className="font-mono">{PROFILE.location}</p>
      </footer>
    </section>
  )
}

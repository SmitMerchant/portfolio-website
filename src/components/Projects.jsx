import { PROJECTS } from '../data'
import Reveal from './Reveal'
import { ExternalIcon, GithubIcon } from './Icons'

const META = {
  'LeadGen Pro': 'SaaS product',
  'Smart Search for Research Expert Connections': 'QA & AI testing',
  'Food Transparency': 'Side project',
  ReflectoChain: 'Side project',
  'Dissertation — Action Recognition for Surveillance': 'MSc dissertation',
}

function ProjectCard({ project }) {
  const hasLinks = project.live || project.github
  return (
    <article className="flex h-full flex-col border border-zinc-800 bg-zinc-900/30 p-5 transition-colors duration-150 hover:border-zinc-700 hover:bg-zinc-900/60">
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

export default function Projects() {
  return (
    <section id="projects" className="container-px scroll-mt-20 border-t border-zinc-900 py-16 sm:py-24">
      <Reveal>
        <span className="eyebrow">Projects</span>
        <p className="max-w-xl text-[15px] leading-relaxed text-zinc-400">
          A selection of products and research I&apos;ve built — spanning shipped SaaS,
          applied NLP and computer-vision systems.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PROJECTS.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.05} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

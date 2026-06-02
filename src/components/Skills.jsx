import { SKILLS } from '../data'
import Reveal from './Reveal'

export default function Skills() {
  return (
    <section id="skills" className="container-px scroll-mt-20 border-t border-zinc-900 py-16 sm:py-24">
      <Reveal>
        <span className="eyebrow">Skills</span>
      </Reveal>

      <div className="mt-2 grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {SKILLS.map((cat) => (
          <Reveal key={cat.group}>
            <div className="border-t border-zinc-800 pt-4">
              <h3 className="mb-3 text-sm font-medium text-zinc-300">{cat.group}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">
                {cat.items.join(', ')}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

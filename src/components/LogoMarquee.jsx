import { useState } from 'react'

const ROW_ONE = [
  { name: 'Sheffield Hallam', file: 'shu.png' },
  { name: 'Adtecher', file: 'adtecher.jpg' },
  { name: 'Anthropic', file: 'anthropic.svg' },
  { name: 'AWS', file: 'aws.svg' },
  { name: 'Google Cloud', file: 'google-cloud.svg' },
  { name: 'Vercel', file: 'vercel.svg' },
  { name: 'GitHub', file: 'github.svg' },
]

const ROW_TWO = [
  { name: 'Python', file: 'python.svg' },
  { name: 'PyTorch', file: 'pytorch.svg' },
  { name: 'React', file: 'react.svg' },
  { name: 'Next.js', file: 'nextjs.svg' },
  { name: 'PostgreSQL', file: 'postgresql.svg' },
  { name: 'Firebase', file: 'firebase.svg' },
  { name: 'Docker', file: 'docker.svg' },
  { name: 'Tailwind CSS', file: 'tailwind.svg' },
  { name: 'Three.js', file: 'threejs.svg' },
]

function LogoItem({ item }) {
  const [failed, setFailed] = useState(!item.file)
  return (
    <div className="logo-item group flex shrink-0 items-center gap-2.5">
      {failed ? (
        <span className="font-mono text-sm text-zinc-500">{item.name}</span>
      ) : (
        <>
          <img
            src={`/logos/${item.file}`}
            alt={item.name}
            onError={() => setFailed(true)}
            className="h-6 w-auto select-none opacity-50 grayscale transition-all duration-300 group-hover:opacity-90 group-hover:grayscale-0"
            draggable="false"
            loading="lazy"
          />
          <span className="text-sm text-zinc-500 transition-colors group-hover:text-zinc-300">
            {item.name}
          </span>
        </>
      )}
    </div>
  )
}

function MarqueeRow({ items, direction }) {
  const loop = [...items, ...items]
  return (
    <div className="marquee">
      <div className={`marquee-track ${direction === 'right' ? 'marquee-right' : 'marquee-left'}`}>
        {loop.map((item, i) => (
          <LogoItem key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function LogoMarquee() {
  return (
    <section
      aria-label="Tools, platforms and places I've worked with"
      className="border-y border-zinc-900 py-12"
    >
      <p className="container-px mb-8 font-mono text-xs uppercase tracking-[0.18em] text-zinc-600">
        Tools, platforms &amp; places I&apos;ve worked with
      </p>
      <div className="marquee-mask flex flex-col gap-6">
        <MarqueeRow items={ROW_ONE} direction="left" />
        <MarqueeRow items={ROW_TWO} direction="right" />
      </div>
    </section>
  )
}

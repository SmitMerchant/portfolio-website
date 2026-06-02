import { useEffect, useState } from 'react'
import { NAV_LINKS, PROFILE } from '../data'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-50% 0px -45% 0px' }
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  const handleNav = (href) => {
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        scrolled ? 'border-zinc-800/80 bg-zinc-950/80 backdrop-blur' : 'border-transparent'
      }`}
    >
      <nav className="container-px flex h-14 items-center justify-between">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="text-sm font-medium text-zinc-100"
        >
          {PROFILE.name}
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1)
            return (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {link.label}
              </button>
            )
          })}
          <a href={PROFILE.cv} download className="btn-outline ml-2 !px-3 !py-1.5">
            Résumé
          </a>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-md border border-zinc-800 md:hidden"
        >
          <span className={`h-px w-4 bg-zinc-300 transition-all ${open ? 'translate-y-[3px] rotate-45' : ''}`} />
          <span className={`h-px w-4 bg-zinc-300 transition-all ${open ? '-translate-y-[3px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <div className="border-t border-zinc-800 bg-zinc-950 md:hidden">
          <div className="container-px flex flex-col py-2">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="rounded-md px-2 py-2.5 text-left text-sm text-zinc-300 hover:text-zinc-100"
              >
                {link.label}
              </button>
            ))}
            <a href={PROFILE.cv} download className="btn-outline mt-2 w-full">
              Résumé
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

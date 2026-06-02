import { useState } from 'react'

// Renders a brand logo from /public/logos with a clean monogram fallback.
export default function Logomark({ file, name, monogram }) {
  const [failed, setFailed] = useState(!file)

  if (failed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 font-mono text-xs text-zinc-400">
        {monogram || name?.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-800 bg-zinc-900 p-1.5">
      <img
        src={`/logos/${file}`}
        alt={name}
        onError={() => setFailed(true)}
        className="h-full w-full object-contain"
      />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { CHATBOT_SYSTEM_PROMPT } from '../data'
import { CloseIcon, SendIcon, SparkleIcon } from './Icons'

const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions'
const SUGGESTIONS = [
  'What is Smit working on now?',
  'Summarise his AI experience',
  'Which tech does he use?',
]

const GREETING = {
  role: 'assistant',
  content:
    "Hi — I'm a small assistant trained on Smit's background. Ask me about his experience, projects or skills.",
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading, open])

  const send = async (text) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setInput('')

    const next = [...messages, { role: 'user', content }]
    setMessages(next)

    if (!apiKey) {
      setMessages([
        ...next,
        {
          role: 'assistant',
          content:
            "The assistant isn't configured here yet. You can reach Smit directly at smit.merchant@gmail.com.",
        },
      ])
      return
    }

    setLoading(true)
    try {
      const res = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          temperature: 0.5,
          messages: [
            { role: 'system', content: CHATBOT_SYSTEM_PROMPT },
            ...next.map((m) => ({ role: m.role, content: m.content })),
          ],
        }),
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      const reply =
        data?.choices?.[0]?.message?.content?.trim() ||
        "Sorry, I couldn't generate a response just now."
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Something went wrong reaching the assistant. Please try again, or email smit.merchant@gmail.com.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open ? (
        <button
          onClick={() => setOpen(false)}
          aria-label="Close assistant"
          className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 bg-zinc-900 text-zinc-200 shadow-lg transition-colors hover:bg-zinc-800"
        >
          <CloseIcon width="18" height="18" />
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open assistant — ask me anything"
          className="group fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 ring-1 ring-white/10 transition-all hover:shadow-violet-500/40 hover:brightness-110"
        >
          <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 opacity-60 blur-md transition-opacity group-hover:opacity-90" />
          <SparkleIcon width="16" height="16" />
          Ask me anything
        </button>
      )}

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[min(540px,72vh)] w-[min(370px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-sm font-medium text-zinc-200">Ask about Smit</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">AI</span>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'border border-zinc-800 bg-zinc-900/60 text-zinc-300'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5">
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-500"
                      style={{ animationDelay: `${d * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="flex flex-col items-start gap-1.5 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-md border border-zinc-800 px-2.5 py-1.5 text-xs text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex items-center gap-2 border-t border-zinc-800 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a question…"
              className="flex-1 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Send"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 transition-opacity hover:bg-white disabled:opacity-40"
            >
              <SendIcon width="16" height="16" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

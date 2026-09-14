import { isIP } from 'node:net'
import { CHATBOT_SYSTEM_PROMPT } from '../src/data.js'
import { portfolioAnswer } from '../src/portfolio-answer.js'
import { reserveRequest } from '../server/chat-limits.js'

const MAX_BODY_BYTES = 24000
const MAX_CONTEXT_BYTES = 9000
const MAX_OUTPUT_TOKENS = 400
const ALLOWED_ORIGINS = new Set(['https://smitmerchant.qzz.io', 'https://www.smitmerchant.qzz.io'])

export function createChatHandler({ env = process.env, fetchImpl = fetch, now = Date.now, log = console.info } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'Method not allowed' })
    }
    // Origin checking is browser defence in depth, not authentication.
    const origin = req.headers.origin
    const trustedOrigins = new Set(ALLOWED_ORIGINS)
    if (env.VERCEL_URL) trustedOrigins.add(`https://${env.VERCEL_URL}`)
    if (env.VERCEL_PROJECT_PRODUCTION_URL) trustedOrigins.add(`https://${env.VERCEL_PROJECT_PRODUCTION_URL}`)
    if (env.NODE_ENV !== 'production') {
      trustedOrigins.add('http://localhost:3000')
      trustedOrigins.add('http://localhost:5173')
    }
    if (origin && !trustedOrigins.has(origin)) return res.status(403).json({ error: 'Origin not allowed' })
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
      return res.status(415).json({ error: 'JSON required' })
    }
    let body
    try {
      if (Number(req.headers['content-length']) > MAX_BODY_BYTES) return res.status(413).json({ error: 'Request too large' })
      const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      if (!raw || Buffer.byteLength(raw) > MAX_BODY_BYTES) return res.status(413).json({ error: 'Request too large' })
      body = JSON.parse(raw)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON' })
    }
    const messages = body?.messages
    if (!Array.isArray(messages) || messages.length < 1 || messages.length > 5 ||
      messages.some((m) => !m || !['user', 'assistant'].includes(m.role) ||
        typeof m.content !== 'string' || !m.content.trim() || m.content.length > 1000) ||
      messages.at(-1).role !== 'user') {
      return res.status(400).json({ error: 'Send up to five messages, each at most 1000 characters, ending with a question.' })
    }
    const question = messages.at(-1).content
    const fallback = (reason) => {
      log(JSON.stringify({ event: 'portfolio_chat_fallback', reason }))
      return res.status(200).json({ mode: 'saved', reply: portfolioAnswer(messages) })
    }
    // Deliberately opt-in. Never reuse the previously public VITE_ key.
    if (env.CHAT_ENABLED !== 'true' || !env.DEEPSEEK_API_KEY || !env.UPSTASH_REDIS_REST_URL ||
      !env.UPSTASH_REDIS_REST_TOKEN || !env.CHAT_RATE_LIMIT_SECRET || env.CHAT_RATE_LIMIT_SECRET.length < 32) {
      return fallback('disabled_or_unconfigured')
    }
    // Vercel overwrites this header. Never trust arbitrary x-forwarded-for values.
    const ip = env.VERCEL === '1' ? req.headers['x-vercel-forwarded-for'] : req.socket?.remoteAddress
    if (typeof ip !== 'string' || !isIP(ip)) return fallback('missing_trusted_ip')
    const context = [{ role: 'system', content: `${CHATBOT_SYSTEM_PROMPT}\nOnly answer portfolio questions. Do not invent facts. Keep replies under 150 words.` },
      ...messages.map(({ role, content }) => ({ role, content }))]
    // Trim oldest turns before enforcing a bound on the complete provider context.
    while (Buffer.byteLength(JSON.stringify(context)) > MAX_CONTEXT_BYTES && context.length > 2) context.splice(1, 1)
    if (Buffer.byteLength(JSON.stringify(context)) > MAX_CONTEXT_BYTES) return res.status(413).json({ error: 'Question too large' })
    try {
      if (!(await reserveRequest({ env, ip, fetchImpl, now: now() }))) return fallback('usage_limit')
    } catch {
      return fallback('usage_controls_unavailable')
    }
    try {
      const response = await fetchImpl('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'deepseek-flash', thinking: { type: 'disabled' },
          max_tokens: MAX_OUTPUT_TOKENS, messages: context, stream: false }),
        signal: AbortSignal.timeout(18000),
      })
      if (!response.ok) {
        log(JSON.stringify({ event: 'portfolio_chat_provider_error', status: response.status }))
        return fallback('provider_error')
      }
      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content
      if (typeof reply !== 'string' || !reply.trim()) return fallback('empty_reply')
      // Only numeric usage metadata is logged; never keys, prompts, IPs or replies.
      const usage = Object.fromEntries(Object.entries(data.usage || {}).filter(([, value]) => typeof value === 'number'))
      log(JSON.stringify({ event: 'portfolio_chat_usage', model: 'deepseek-flash', usage }))
      return res.status(200).json({ mode: 'ai', reply: reply.trim() })
    } catch {
      return fallback('provider_unavailable')
    }
  }
}

export default createChatHandler()

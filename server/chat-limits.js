import { createHmac } from 'node:crypto'

// One atomic reservation shared by every function instance. Never refund uncertain
// failures: the provider may have generated billable tokens before a timeout.
export const RESERVE_SCRIPT = `
local limits = {tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])}
for i = 1, 3 do
  if tonumber(redis.call('GET', KEYS[i]) or '0') >= limits[i] then return 0 end
end
for i = 1, 3 do
  local n = redis.call('INCR', KEYS[i])
  if n == 1 then redis.call('EXPIRE', KEYS[i], tonumber(ARGV[i + 3])) end
end
return 1
`

export async function reserveRequest({ env, ip, fetchImpl, now }) {
  const stamp = Math.floor(now / 1000)
  const day = Math.floor(stamp / 86400)
  const minute = Math.floor(stamp / 60)
  const identity = createHmac('sha256', env.CHAT_RATE_LIMIT_SECRET).update(ip).digest('hex')
  const prefix = 'portfolio-chat:v1'
  const response = await fetchImpl(env.UPSTASH_REDIS_REST_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(['EVAL', RESERVE_SCRIPT, 3,
      `${prefix}:minute:${minute}:${identity}`, `${prefix}:day:${day}:${identity}`, `${prefix}:global:${day}`,
      5, 20, 30, 120, 172800, 172800]),
    signal: AbortSignal.timeout(3000),
  })
  if (!response.ok) throw new Error('Usage controls unavailable')
  const data = await response.json()
  if (data.error || (data.result !== 0 && data.result !== 1)) throw new Error('Invalid reservation')
  return data.result === 1
}

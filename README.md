# Smit Merchant — Portfolio

A premium, recruiter-ready personal portfolio for **Smit Merchant**, an AI Full-Stack Developer based in Sheffield, UK.

Dark, cinematic theme with soft purple/blue AI glow accents, a 3D AI orb, an Apple-style scroll-scrubbed headshot sequence, a bento-grid project showcase, and a floating AI assistant that answers recruiter questions about Smit.

## Tech stack

- **Vite** + **React 18**
- **Tailwind CSS** (dark theme)
- **Three.js** + **React Three Fiber** + **Drei** (3D hero orb)
- **GSAP ScrollTrigger** (scroll-scrubbed headshot sequence)
- **Framer Motion** (UI animation)
- **DeepSeek API** (floating chatbot)

## Getting started

```bash
npm install
cp .env.example .env   # AI stays off until server credentials and limits are ready
npm run dev
```

Open http://localhost:5173.

## Chatbot security and setup

The browser calls only `/api/chat`. DeepSeek credentials are server-only. The guide returns saved portfolio facts if AI is disabled, any limit is reached, or either provider is unavailable.

| Server variable | Purpose |
| --- | --- |
| `DEEPSEEK_API_KEY` | Fresh DeepSeek key, stored as a Vercel Production secret. Never use a `VITE_` prefix. |
| `CHAT_ENABLED` | Set to `true` only after revoking the exposed key and configuring all controls. Otherwise no paid calls are made. |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Shared Redis REST counter, with eviction and automatic paid plan upgrades disabled. |
| `CHAT_RATE_LIMIT_SECRET` | At least 32 random characters, stored as a server secret, for hashing IPs. |

The backend fixes the model to `deepseek-flash`, disables thinking and limits output to 400 tokens. It accepts at most five messages of 1,000 characters each and trims history to a 9,000-byte total context. Redis atomically reserves requests across all instances: 5/IP/minute, 20/IP/UTC day and 30 globally/UTC day. Timeouts and failures are not refunded or retried, since the provider may already have billed them. This bounds API calls and their size; it is not a provider-enforced dollar budget, and does not cover other apps or leaked keys. UTC day limits reset at midnight UTC.

The Redis global key must remain shared across deployments. Do not delete counters to recover capacity or enable eviction. If Redis is missing, full or unavailable, AI fails closed. Use the Free plan with automatic upgrades disabled to avoid counter-service overages.

Vercel supplies the trusted client-IP header; a caller-supplied `x-forwarded-for` is ignored. Origin checks are only defence in depth. Numeric usage and fallback reasons appear in Vercel function logs; keys, prompts, replies and raw IPs are not logged. The UI marks fallback replies as saved information.

For a complete local backend use `npx vercel dev`. Plain `npm run dev` / `npm run preview` serve the frontend only; the guide falls back to saved facts. Production secrets should not be copied into local development.

Run `npm test` for mocked security regression tests (no provider charges). `npm run build` also scans public assets for key-shaped secrets and direct DeepSeek API calls.

### If a key has been exposed

Revoke it in DeepSeek first. Removing an environment variable or deploying new code cannot invalidate downloaded copies, browser caches or historical deployment assets. Remove `VITE_DEEPSEEK_API_KEY` from Vercel and local env files; create a fresh server-only key. Do not restore any deployment that contains the old direct-to-DeepSeek chatbot. Enable AI only after the shared controls pass verification.

## Headshot scroll sequence

Sequential frames live in `public/headshot-frames/` named `ezgif-frame-001.jpg … ezgif-frame-240.jpg`. They are preloaded on mount and scrubbed via GSAP ScrollTrigger as you scroll. On mobile (`< 768px`) a single static frame is shown instead for performance.

### Extracting frames (FFmpeg — skip ezgif)

Online tools like ezgif compress frames heavily (~800px, low JPEG quality), which makes scroll scrubbing look soft. Use the included script instead — it pulls frames at **full source resolution** with `-q:v 1` (highest JPEG quality).

1. Place your source video at `HERO.mp4` in the project root (or pass a path).
2. Run:

```bash
npm run extract-frames
```

Options:

```bash
npm run extract-frames -- path/to/video.mp4 --frames 240 --output public/headshot-frames
```

The script uses the bundled FFmpeg in `ffmpeg-8.1.1-essentials_build/` if present, otherwise falls back to a system `ffmpeg` on your PATH. Frame count defaults to 240; update `FRAME_COUNT` in `src/components/HeadshotSequence.jsx` if you change it.

Manual one-liner (same quality):

```bash
ffmpeg -y -nostdin -i HERO.mp4 -vf fps=30 -frames:v 240 -q:v 1 -start_number 1 public/headshot-frames/ezgif-frame-%03d.jpg
```

## Build & deploy

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

Deploy-ready for **Vercel** (see `vercel.json`). Configure the server-only variables above. Keep AI disabled until credentials and shared limits are ready.

## Project structure

```
public/
  headshot-frames/        sequential scroll-sequence frames
  Smit_Merchant_Resume.pdf
src/
  components/             Navbar, Hero, AIOrb, HeadshotSequence, About, Projects,
                         Experience, Skills, Contact, Chatbot, Reveal, Icons
  data.js                all portfolio content + chatbot system prompt
  App.jsx
```

Project links marked as "coming soon" are disabled until their URLs are added in `src/data.js`.

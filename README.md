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
cp .env.example .env   # then add your DeepSeek key
npm run dev
```

Open http://localhost:5173.

## Environment variables

| Variable | Description |
| --- | --- |
| `VITE_DEEPSEEK_API_KEY` | DeepSeek API key for the floating portfolio chatbot. The site still works without it — the chatbot falls back to a polite "email me" message. |

> Note: the key is exposed client-side (any `VITE_*` var is). Use a key scoped/limited to this use, or proxy through a serverless function if you need it fully hidden.

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

Deploy-ready for **Vercel** (see `vercel.json`). Add `VITE_DEEPSEEK_API_KEY` in the Vercel project's Environment Variables for the chatbot to go live.

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

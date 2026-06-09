#!/usr/bin/env node
/**
 * Extract high-quality scroll-sequence frames from a video using FFmpeg.
 * Replaces the ezgif workflow — full resolution, minimal JPEG compression.
 *
 * Usage:
 *   npm run extract-frames
 *   npm run extract-frames -- path/to/video.mp4
 *   npm run extract-frames -- path/to/video.mp4 --frames 240 --output public/headshot-frames
 */

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const DEFAULT_VIDEO = join(ROOT, 'HERO.mp4')
const DEFAULT_OUTPUT = join(ROOT, 'public', 'headshot-frames')
const DEFAULT_FRAMES = 240
const FRAME_PATTERN = 'ezgif-frame-%03d.jpg'

function parseArgs(argv) {
  const positional = []
  const flags = {}

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--frames' || arg === '-n') {
      flags.frames = Number(argv[++i])
    } else if (arg === '--output' || arg === '-o') {
      flags.output = argv[++i]
    } else if (arg === '--fps') {
      flags.fps = Number(argv[++i])
    } else if (arg === '--help' || arg === '-h') {
      flags.help = true
    } else if (!arg.startsWith('-')) {
      positional.push(arg)
    }
  }

  return {
    video: resolve(positional[0] || DEFAULT_VIDEO),
    output: resolve(flags.output || DEFAULT_OUTPUT),
    frames: flags.frames || DEFAULT_FRAMES,
    fps: flags.fps,
    help: flags.help,
  }
}

function findFfmpeg() {
  const bundled = process.platform === 'win32'
    ? join(ROOT, 'ffmpeg-8.1.1-essentials_build', 'ffmpeg-8.1.1-essentials_build', 'bin', 'ffmpeg.exe')
    : join(ROOT, 'ffmpeg-8.1.1-essentials_build', 'ffmpeg-8.1.1-essentials_build', 'bin', 'ffmpeg')

  if (existsSync(bundled)) return bundled
  return 'ffmpeg'
}

function probeDuration(ffmpeg, video) {
  const ffprobe = ffmpeg.replace(/ffmpeg(\.exe)?$/, 'ffprobe$1')
  const probeBin = existsSync(ffprobe) ? ffprobe : 'ffprobe'

  const result = spawnSync(
    probeBin,
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', video],
    { encoding: 'utf8' },
  )

  if (result.status !== 0) return null
  const duration = parseFloat(result.stdout.trim())
  return Number.isFinite(duration) ? duration : null
}

function clearExistingFrames(outputDir) {
  if (!existsSync(outputDir)) return 0

  const removed = readdirSync(outputDir).filter((f) => f.endsWith('.jpg') || f.endsWith('.png'))
  for (const file of removed) unlinkSync(join(outputDir, file))
  return removed.length
}

function printHelp() {
  console.log(`
Extract high-quality scroll-sequence frames from a video.

Usage:
  npm run extract-frames [-- <video>] [--frames N] [--output dir] [--fps N]

Options:
  --frames, -n   Target frame count (default: ${DEFAULT_FRAMES})
  --output, -o   Output directory (default: public/headshot-frames)
  --fps          Override auto fps (default: frames / video duration)
  -h, --help     Show this help

Examples:
  npm run extract-frames
  npm run extract-frames -- HERO.mp4 --frames 240
`)
}

const opts = parseArgs(process.argv.slice(2))

if (opts.help) {
  printHelp()
  process.exit(0)
}

if (!existsSync(opts.video)) {
  console.error(`Video not found: ${opts.video}`)
  console.error('Place your source video at HERO.mp4 in the project root, or pass a path.')
  process.exit(1)
}

const ffmpeg = findFfmpeg()
const duration = probeDuration(ffmpeg, opts.video)
const fps = opts.fps ?? (duration ? opts.frames / duration : 30)

mkdirSync(opts.output, { recursive: true })
const cleared = clearExistingFrames(opts.output)

console.log(`Video:    ${opts.video}`)
console.log(`Output:   ${opts.output}`)
console.log(`FFmpeg:   ${ffmpeg}`)
console.log(`Frames:   ${opts.frames} @ ${fps.toFixed(2)} fps${duration ? ` (${duration.toFixed(1)}s source)` : ''}`)
if (cleared) console.log(`Cleared:  ${cleared} existing frame(s)`)
console.log('')

const outputPattern = join(opts.output, FRAME_PATTERN)
const args = [
  '-y',
  '-nostdin',
  '-i', opts.video,
  '-vf', `fps=${fps}`,
  '-frames:v', String(opts.frames),
  '-q:v', '1',
  '-start_number', '1',
  outputPattern,
]

const result = spawnSync(ffmpeg, args, { stdio: 'inherit' })

if (result.status !== 0) {
  console.error('\nFrame extraction failed.')
  if (ffmpeg === 'ffmpeg') {
    console.error('Tip: download FFmpeg essentials build into ffmpeg-8.1.1-essentials_build/, or install ffmpeg globally.')
  }
  process.exit(result.status ?? 1)
}

const written = readdirSync(opts.output).filter((f) => f.endsWith('.jpg')).length
console.log(`\nDone — ${written} frames written to ${opts.output}`)
console.log('Update FRAME_COUNT in src/components/HeadshotSequence.jsx if the count changed.')

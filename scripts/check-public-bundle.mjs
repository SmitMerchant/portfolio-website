import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) await check(file)
    else if (/\.(js|html|css|map)$/.test(file)) {
      const source = await readFile(file, 'utf8')
      if (/sk-[a-z0-9_-]{20,}/i.test(source) || source.includes('api.deepseek.com') || source.includes('VITE_DEEPSEEK_API_KEY')) {
        // Report only the path, never the matching credential.
        throw new Error(`Unsafe public credential or direct provider call in ${file}`)
      }
    }
  }
}
await check('dist')
console.log('Public bundle check passed: no key-shaped secrets or direct DeepSeek calls.')

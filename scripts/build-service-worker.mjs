import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'dist/public')
const urls = new Set()
const fingerprintFiles = []

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(full)
    else {
      const relative = path.relative(output, full).split(path.sep).join('/')
      if (relative === 'sw.js' || relative === '_headers') continue
      fingerprintFiles.push({ relative, full })
      if (relative.endsWith('/index.html')) urls.add(`/${relative.slice(0, -'index.html'.length)}`)
      else if (relative === 'index.html') urls.add('/')
      else if (/\.(html|js|css|svg|png|webmanifest|woff2|txt)$/.test(relative)) urls.add(`/${relative}`)
    }
  }
}

await walk(output)
const sortedUrls = [...urls].sort()
const fingerprint = createHash('sha256')
for (const file of fingerprintFiles.sort((a, b) => a.relative.localeCompare(b.relative))) {
  fingerprint.update(file.relative)
  fingerprint.update(await readFile(file.full))
}
const version = `ruhit-shell-${fingerprint.digest('hex').slice(0, 12)}`
const source = await readFile(path.join(root, 'client/public/sw.js'), 'utf8')
const worker = source
  .replace("const CACHE_NAME = 'ruhit-shell-dev-v2'", `const CACHE_NAME = '${version}'`)
  .replace("const PRECACHE_URLS = ['/','/kelas/5/','/kelas/5/pecahan/','/laporan/','/privasi/','/manifest.webmanifest','/favicon.svg']", `const PRECACHE_URLS = ${JSON.stringify(sortedUrls)}`)
await writeFile(path.join(output, 'sw.js'), worker)
console.log(`Generated service worker with ${urls.size} precached assets (${version}).`)

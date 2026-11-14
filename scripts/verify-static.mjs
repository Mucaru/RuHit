import assert from 'node:assert/strict'
import { access, readFile, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
await import('./generate-routes.mjs')
const read = (file) => readFile(path.join(root, file), 'utf8')
const packageJson = JSON.parse(await read('package.json'))
const headers = await read('client/public/_headers')
const wrangler = await read('wrangler.jsonc')
const app = await read('client/src/App.tsx')
const progress = await read('client/src/lib/progress.ts')
const engine = await read('client/src/lib/learning/engine.ts')
async function walk(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const relative = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await walk(relative))
    else if (/\.(?:ts|tsx)$/.test(entry.name)) files.push(relative.replaceAll('\\', '/'))
  }
  return files
}
const allSourceFiles = await walk('client/src')

assert.equal('express' in packageJson.dependencies, false, 'Express must not be a runtime dependency')
assert.equal('express' in packageJson.devDependencies, false, 'Express must not be a dev dependency')
assert.match(wrangler, /"directory":\s*"\.\/dist\/public"/, 'Cloudflare must use the single static output directory')
assert.match(wrangler, /"not_found_handling":\s*"404-page"/, 'Unknown routes must use the static 404 page')
assert.doesNotMatch(app, /pushState|replaceState|dangerouslySetInnerHTML|innerHTML|\beval\s*\(/, 'App must not use history hacks or HTML injection')
assert.match(headers, /Content-Security-Policy:/)
assert.doesNotMatch(headers, /unsafe-inline|unsafe-eval/)
for (const header of ['Strict-Transport-Security:', 'Cross-Origin-Opener-Policy:', 'Cross-Origin-Resource-Policy:', 'Referrer-Policy:', 'Permissions-Policy:']) assert.ok(headers.includes(header), `Missing ${header}`)
assert.match(progress, /STORAGE_KEY = 'ruang-hitung:progress:v2'/)
assert.match(progress, /migrateV1/)
assert.match(progress, /JSON\.parse/)
assert.match(progress, /MAX_HISTORY|500_000/)
assert.match(await read('client/public/sw.js'), /isStaticAsset/)
assert.match(await read('client/public/sw.js'), /PRECACHE_URLS\.includes/)
const localStorageFiles = []
for (const file of allSourceFiles) {
  if (file.endsWith('.test.ts') || file.endsWith('.test.tsx')) continue
  if ((await read(file)).includes('localStorage')) localStorageFiles.push(file)
}
assert.deepEqual(localStorageFiles, ['client/src/lib/progress.ts'], 'Only the validated progress module may access localStorage')
assert.doesNotMatch(engine, /\beval\s*\(|innerHTML|dangerouslySetInnerHTML/)
for (const file of allSourceFiles) {
  const source = await read(file)
  assert.doesNotMatch(source, /dangerouslySetInnerHTML|\binnerHTML\s*=|\beval\s*\(/, `${file} must not inject HTML or evaluate strings`)
  assert.doesNotMatch(source, /style=\{\{/, `${file} must not use inline React styles under the strict CSP`)
}
await access(path.join(root, 'client/public/.well-known/security.txt'))
await access(path.join(root, 'client/public/manifest.webmanifest'))
await access(path.join(root, 'client/public/sw.js'))
await access(path.join(root, 'docs/riset-kurikulum.md'))
await access(path.join(root, 'docs/brand.md'))
const output = await stat(path.join(root, 'client/kelas/5/index.html'))
assert.ok(output.isFile(), 'Class 5 route HTML should be generated before dev/build')

// Tipografi: tidak boleh ada font-size di bawah 12px. Token --fs-body = 16px dan --fs-caption = 14px.
const typographyTokens = { '--fs-body': 16, '--fs-caption': 14 }
const tokensCss = await read('client/src/styles/tokens.css')
assert.match(tokensCss, /--fs-body:\s*16px/, 'Token --fs-body harus 16px')
assert.match(tokensCss, /--fs-caption:\s*14px/, 'Token --fs-caption harus 14px')
const cssFiles = (await readdir(path.join(root, 'client/src/styles'))).filter((name) => name.endsWith('.css')).map((name) => `client/src/styles/${name}`)
cssFiles.push('client/public/404.css')
for (const file of cssFiles) {
  for (const match of (await read(file)).matchAll(/font-size:\s*([^;}]+)/g)) {
    const value = match[1].trim()
    const token = value.match(/var\((--[a-z-]+)\)/)
    if (token) { assert.ok(token[1] in typographyTokens, `${file}: token font-size tidak dikenal (${value})`); continue }
    const literal = value.match(/^(\d*\.?\d+)(px|rem|em)$/)
    if (!literal) continue
    assert.notEqual(literal[2], 'em', `${file}: font-size ${value} berbasis em harus dibungkus max(..., var(--fs-caption))`)
    assert.ok((literal[2] === 'px' ? Number(literal[1]) : Number(literal[1]) * 16) >= 12, `${file}: font-size ${value} di bawah 12px`)
  }
}
if ((await read('client/public/.well-known/security.txt')).includes('GANTI-DENGAN')) console.warn('PERINGATAN: client/public/.well-known/security.txt masih berisi placeholder. Isi kontak keamanan asli sebelum rilis publik.')
console.log('PASS: static architecture, CSP/security headers, progress schema, no HTML injection, and generated routes.')

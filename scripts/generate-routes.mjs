import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const client = path.join(root, 'client')
const template = await readFile(path.join(client, 'index.html'), 'utf8')
for (const generated of ['kelas', 'latihan', 'laporan', 'privasi']) await rm(path.join(client, generated), { recursive: true, force: true })
await rm(path.join(client, '404.html'), { force: true })
const curriculum = await readFile(path.join(client, 'src/data/kurikulum.ts'), 'utf8')

const routes = new Map([
  ['/latihan/', 'Pilih latihan'],
  ['/laporan/', 'Laporan belajar'],
  ['/privasi/', 'Privasi'],
])

for (let grade = 1; grade <= 6; grade += 1) routes.set(`/kelas/${grade}/`, `Matematika kelas ${grade}`)

for (const line of curriculum.split('\n')) {
  if (!line.includes('{ id:') || !line.includes('slug:') || !line.includes('classes:')) continue
  const slug = line.match(/slug: '([^']+)'/)?.[1]
  const title = line.match(/title: '([^']+)'/)?.[1] ?? 'Latihan matematika'
  const grades = line.match(/classes: \[([^\]]+)\]/)?.[1]
  if (!slug || !grades) continue
  routes.set(`/latihan/${slug}/`, `Latihan ${title}`)
  for (const grade of grades.split(',').map((value) => Number(value.trim())).filter(Number.isInteger)) {
    routes.set(`/kelas/${grade}/${slug}/`, `${title} — kelas ${grade}`)
  }
}

const legacy = [
  ['penjumlahan-bersusun', 'Penjumlahan bersusun'],
  ['pengurangan-bersusun', 'Pengurangan bersusun'],
  ['perkalian-bersusun', 'Perkalian bersusun'],
  ['pembagian-bersusun', 'Pembagian bersusun'],
  ['pohon-faktor', 'Pohon faktor'],
  ['bilangan-prima', 'Bilangan prima'],
  ['fpb', 'FPB'],
  ['kpk', 'KPK'],
]
for (const [slug, title] of legacy) routes.set(`/latihan/${slug}/`, `Latihan ${title}`)

for (const [route, title] of routes) {
  const relative = route.replace(/^\//, '').replace(/\/$/, '')
  const directory = path.join(client, relative)
  await mkdir(directory, { recursive: true })
  const page = template.replace('<title>Ruang Hitung — Matematika SD</title>', `<title>${title} | Ruang Hitung</title>`)
  await writeFile(path.join(directory, 'index.html'), page)
}

await writeFile(path.join(client, '404.html'), `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Halaman tidak ditemukan | Ruang Hitung</title><link rel="stylesheet" href="/404.css"></head><body><main class="not-found"><p class="eyebrow">404 · HALAMAN TIDAK ADA</p><h1>Yuk kembali ke halaman awal.</h1><a class="button button-primary" href="/">Kembali ke beranda</a></main></body></html>`)
console.log(`Generated ${routes.size + 1} static route pages.`)

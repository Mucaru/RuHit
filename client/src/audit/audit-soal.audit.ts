/**
 * Audit soal (HANYA MEMBACA). Membangkitkan setiap tipe soal pada tiap kelas dan tingkat kesulitan,
 * lalu menulis docs/audit-soal.md berisi temuan otomatis dan contoh soal.
 * Jalankan: pnpm audit:soal
 * Tidak masuk ke pnpm test dan tidak ikut ke bundel produksi (tidak diimpor dari halaman mana pun).
 */
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { it } from 'vitest'
import { topics } from '../data/kurikulum'
import { checkAnswer, generateQuestion, solveQuestion } from '../lib/learning/engine'
import { solutionSteps } from '../lib/learning/solutions'
import type { LearningQuestion, VisualKind } from '../lib/learning/types'

type Severity = 'tinggi' | 'sedang' | 'rendah'
type Flag = { code: string; severity: Severity; message: string }

const SEEDS_PER_DIFFICULTY = 6
const DIFFICULTIES = [0, 1, 2, 3, 4]

function seeded(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}
const hash = (text: string) => [...text].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261)
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const clean = (text: string) => text.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()
const has = (q: LearningQuestion, key: string) => q.params[key] !== undefined

/** Angka yang berdiri sendiri di dalam teks (titik dianggap pemisah ribuan). */
const numbersIn = (text: string) => (text.match(/\d[\d.]*\d|\d/g) ?? []).map((item) => Number(item.replace(/\./g, ''))).filter((value) => Number.isFinite(value))
const leaks = (text: string, answer: string) => answer.length >= 2 && !/^[A-D]$/i.test(answer) && new RegExp(`(^|[^\\d.,/])${escapeRegExp(answer)}($|[^\\d.,/])`).test(text)

/** Parameter yang dibutuhkan komponen VisualAid. Kalau kosong, komponen memakai nilai bawaan yang menyesatkan. */
const visualNeeds: Partial<Record<VisualKind, (q: LearningQuestion) => string | null>> = {
  'place-value': (q) => (has(q, 'value') || has(q, 'a') ? null : 'params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan"'),
  blocks: (q) => (has(q, 'value') || has(q, 'a') ? null : 'params tanpa value/a: tabel nilai tempat menampilkan "0 Satuan"'),
  'number-line': (q) => (Array.isArray(q.params.values) || (has(q, 'a') && has(q, 'b')) ? null : 'tanpa values atau a+b: garis bilangan memakai 0 dan 10'),
  grid: (q) => (['columns', 'length', 'side'].some((key) => has(q, key)) && ['rows', 'width', 'height'].some((key) => has(q, key)) ? null : 'tanpa kolom dan baris eksplisit: kisi memakai nilai a/b atau bawaan 4x3'),
  chart: (q) => (Array.isArray(q.params.values) || Array.isArray(q.params.counts) ? null : 'tanpa values/counts: diagram memakai data bawaan [3, 5, 2]'),
  shape: (q) => (has(q, 'sides') ? null : 'tanpa sides: bangun selalu segiempat'),
  position: (q) => (has(q, 'position') ? null : 'tanpa position: bola selalu di kiri'),
  pattern: (q) => (has(q, 'first') && has(q, 'second') ? null : 'tanpa first/second: pola bawaan lingkaran-segitiga'),
  tally: (q) => (has(q, 'count') ? null : 'tanpa count: turus bawaan 5'),
  angle: (q) => (has(q, 'angle') ? null : 'tanpa angle: sudut bawaan 90 derajat'),
  volume: (q) => (has(q, 'side') ? null : 'tanpa side: kubus bawaan 3'),
}
/** Hasil membaca VisualAid.tsx: jenis visual yang tidak sampai ke layar sebagaimana dirancang. */
const notRendered: Partial<Record<VisualKind, string>> = {
  volume: 'VisualAid tidak memanggil VolumeVisual; layar hanya menampilkan "Bayangkan benda di sekitarmu"',
  angle: 'VisualAid memakai ilustrasi CSS statis; AngleVisual (SVG sesuai derajat) tidak dipakai, jadi besar sudut tidak tergambar',
}
/** Hasil membaca FractionModel.tsx: tipe yang punya cabang sendiri, dan tipe yang memakai caption tanpa label. */
const fractionSwitch = new Set(['fraction-identify', 'fraction-half-quarter', 'fraction-equivalent', 'fraction-simplify', 'fraction-compare', 'fraction-order', 'fraction-add-same', 'fraction-word-add', 'fraction-subtract-same', 'fraction-word-subtract', 'fraction-add-different', 'fraction-subtract-different', 'fraction-multiply-whole', 'fraction-divide-whole', 'fraction-of-quantity', 'fraction-improper-to-mixed', 'fraction-mixed-to-improper'])
const fractionCaptionOnly = new Set(['fraction-add-same', 'fraction-word-add', 'fraction-subtract-same', 'fraction-word-subtract'])

function inspect(q: LearningQuestion): Flag[] {
  const flags: Flag[] = []
  const add = (code: string, severity: Severity, message: string) => flags.push({ code, severity, message })
  const expected = q.expected ?? ''
  if (!expected.trim()) add('JAWABAN-KOSONG', 'tinggi', 'expected kosong')

  const solved = String(solveQuestion(q))
  const accepted = checkAnswer(q, expected)
  if (!accepted) add('CHECKER-MENOLAK', 'tinggi', `checkAnswer menolak jawaban generator "${expected}"`)
  if (solved.trim().toLowerCase() !== expected.trim().toLowerCase()) add('JAWABAN-BEDA', accepted ? 'sedang' : 'tinggi', `generator "${expected}" vs checker independen "${solved}"`)

  const texts: Array<[string, string]> = [['prompt', q.prompt], ['penjelasan', q.explanation], ['miskonsepsi', q.misconception], ...q.hints.map((hint, index): [string, string] => [`petunjuk ${index + 1}`, hint])]
  for (const [name, text] of texts) {
    if (!text.trim()) add('TEKS-KOSONG', 'tinggi', `${name} kosong`)
    if (/undefined|NaN|\[object|\$\{|\bnull\b/.test(text)) add('TEKS-RUSAK', 'tinggi', `${name} berisi nilai mentah: ${clean(text).slice(0, 80)}`)
    if (/ {2,}/.test(text)) add('SPASI-GANDA', 'rendah', `${name} punya spasi ganda`)
  }

  if (q.choices) {
    if (!q.choices.includes(expected)) add('PILIHAN-TANPA-JAWABAN', 'tinggi', `jawaban "${expected}" tidak ada di pilihan [${q.choices.join(' | ')}]`)
    if (new Set(q.choices).size !== q.choices.length) add('PILIHAN-GANDA-SAMA', 'tinggi', `pilihan duplikat [${q.choices.join(' | ')}]`)
    if (q.choices.length < 2) add('PILIHAN-TERLALU-SEDIKIT', 'sedang', 'kurang dari 2 pilihan')
  }

  if (leaks(q.hints[0], expected) || leaks(q.hints[1], expected)) add('PETUNJUK-BOCOR', 'sedang', `petunjuk 1/2 sudah menyebut jawaban "${expected}"`)
  if (!q.choices && leaks(q.prompt, expected) && expected.length >= 3) add('SOAL-BOCOR', 'sedang', `soal sudah memuat jawaban "${expected}"`)
  if (new Set(q.hints).size < 3) add('PETUNJUK-SAMA', 'rendah', 'ada petunjuk yang identik')

  const need = visualNeeds[q.visual]?.(q)
  if (need) add('VISUAL-PARAMETER', 'tinggi', `${q.visual}: ${need}`)
  if ((q.visual === 'place-value' || q.visual === 'blocks') && typeof q.params.a === 'number' && typeof q.params.b === 'number') add('VISUAL-HANYA-SATU', 'tinggi', `visual nilai tempat hanya menggambar a=${q.params.a}, bilangan b=${q.params.b} tidak tampil`)
  if (notRendered[q.visual]) add('VISUAL-TIDAK-TAMPIL', 'sedang', `${q.visual}: ${notRendered[q.visual]}`)
  if (q.visual === 'fraction-bar' && !fractionSwitch.has(q.typeId)) add('VISUAL-PECAHAN-DEFAULT', 'sedang', 'tipe ini jatuh ke cabang default FractionModel (satu batang saja)')
  if (q.visual === 'fraction-bar' && fractionCaptionOnly.has(q.typeId)) add('BATANG-SEMPIT', 'tinggi', 'batang pecahan tanpa label + caption: .fm-bar terjepit di kolom auto dan tampil sebagai garis hitam (terlihat di screenshot soal 5/8 + 1/8)')
  if (q.visual === 'none' && /\b(gambar|lihat|perhatikan|diagram|tabel)\b/i.test(q.prompt)) add('RUJUK-GAMBAR-TANPA-VISUAL', 'sedang', `soal menyebut gambar/tabel tapi visual = none: ${clean(q.prompt).slice(0, 80)}`)

  let steps: ReturnType<typeof solutionSteps> = []
  try { steps = solutionSteps(q) } catch (error) { add('LANGKAH-ERROR', 'tinggi', `solutionSteps melempar error: ${String(error)}`) }
  if (steps.length > 0) {
    if (steps.length < 3) add('LANGKAH-SEDIKIT', 'rendah', `hanya ${steps.length} langkah`)
    if (!steps[steps.length - 1].final) add('LANGKAH-TANPA-AKHIR', 'sedang', 'langkah terakhir tidak bertanda final')
    steps.forEach((item, index) => { if (/undefined|NaN|\[object|\$\{/.test(item.title + item.text)) add('LANGKAH-RUSAK', 'tinggi', `langkah ${index + 1} berisi nilai mentah: ${clean(item.text).slice(0, 80)}`) })
  }

  if (/\b\d{4,}\b/.test(q.prompt.replace(/\d{1,3}(\.\d{3})+/g, ''))) add('ANGKA-TANPA-TITIK', 'rendah', `angka 4 digit tanpa pemisah ribuan: ${clean(q.prompt).slice(0, 80)}`)
  if (q.prompt.split(/\s+/).length > 28) add('SOAL-PANJANG', 'rendah', `soal ${q.prompt.split(/\s+/).length} kata, panjang untuk anak SD`)
  return flags
}

type Combo = { topicId: string; topicTitle: string; typeId: string; grade: number }
type ComboResult = { combo: Combo; total: number; unique: number; flags: Map<string, { severity: Severity; count: number; example: string }>; samples: LearningQuestion[]; difficultyNote: string | null; error: string | null }

function auditCombo(combo: Combo): ComboResult {
  const flags: ComboResult['flags'] = new Map()
  const prompts = new Set<string>()
  const samples: LearningQuestion[] = []
  const magnitude: number[] = DIFFICULTIES.map(() => 0)
  let total = 0
  let error: string | null = null
  DIFFICULTIES.forEach((difficulty, difficultyIndex) => {
    for (let seed = 0; seed < SEEDS_PER_DIFFICULTY; seed += 1) {
      try {
        const q = generateQuestion(combo.typeId, combo.topicId, seeded(hash(`${combo.typeId}:${combo.grade}:${difficulty}:${seed}`)), combo.grade, difficulty)
        total += 1
        prompts.add(q.prompt)
        magnitude[difficultyIndex] += Math.max(0, ...numbersIn(q.prompt)) / SEEDS_PER_DIFFICULTY
        if (seed === 0 && [0, 2, 4].includes(difficulty)) samples.push(q)
        for (const flag of inspect(q)) {
          const entry = flags.get(flag.code)
          if (entry) entry.count += 1
          else flags.set(flag.code, { severity: flag.severity, count: 1, example: flag.message })
        }
      } catch (caught) {
        error = String(caught)
        const entry = flags.get('GENERATOR-ERROR')
        if (entry) entry.count += 1
        else flags.set('GENERATOR-ERROR', { severity: 'tinggi', count: 1, example: String(caught) })
      }
    }
  })
  if (total > 0 && prompts.size < Math.min(8, total / 3)) flags.set('SOAL-MONOTON', { severity: 'sedang', count: total, example: `hanya ${prompts.size} soal berbeda dari ${total} percobaan` })
  const difficultyNote = magnitude[4] <= magnitude[0] && magnitude[0] > 0 ? `angka terbesar rata-rata level 0 = ${Math.round(magnitude[0])}, level 4 = ${Math.round(magnitude[4])}` : null
  if (difficultyNote) flags.set('KESULITAN-TIDAK-NAIK', { severity: 'rendah', count: 1, example: difficultyNote })
  return { combo, total, unique: prompts.size, flags, samples, difficultyNote, error }
}

const order: Record<Severity, number> = { tinggi: 0, sedang: 1, rendah: 2 }

it('menulis docs/audit-soal.md', () => {
  const combos: Combo[] = topics.flatMap((topic) => topic.generatorTypes.flatMap((typeId) => topic.classes.map((grade) => ({ topicId: topic.id, topicTitle: topic.title, typeId, grade }))))
  const results = combos.map(auditCombo)

  const byCode = new Map<string, { severity: Severity; count: number; combos: Set<string>; example: string }>()
  for (const result of results) {
    for (const [code, entry] of result.flags) {
      const row = byCode.get(code) ?? { severity: entry.severity, count: 0, combos: new Set<string>(), example: entry.example }
      row.count += entry.count
      row.combos.add(`${result.combo.typeId} (kelas ${result.combo.grade})`)
      byCode.set(code, row)
    }
  }
  const codes = [...byCode.entries()].sort((a, b) => order[a[1].severity] - order[b[1].severity] || b[1].count - a[1].count)
  const totalQuestions = results.reduce((sum, item) => sum + item.total, 0)
  const clean_ = results.filter((item) => item.flags.size === 0).length

  const md: string[] = []
  md.push('# Audit soal RuHit', '', `Dibangkitkan otomatis oleh \`pnpm audit:soal\`. ${combos.length} kombinasi (tipe x topik x kelas), ${totalQuestions} soal contoh, ${DIFFICULTIES.length} tingkat kesulitan x ${SEEDS_PER_DIFFICULTY} seed. Seed tetap, jadi hasilnya bisa diulang.`, '', 'Ini temuan HEURISTIK dari data dan hasil membaca kode: bukan bukti bug sampai dilihat di layar. Tidak ada kode soal yang diubah.', '')
  md.push('## 1. Ringkasan', '', `- Kombinasi tanpa temuan apa pun: **${clean_}** dari ${combos.length}`, '', '| Tingkat | Kode | Jumlah soal | Kombinasi terdampak | Contoh |', '|---|---|---|---|---|')
  for (const [code, row] of codes) md.push(`| ${row.severity} | \`${code}\` | ${row.count} | ${row.combos.size} | ${clean(row.example).slice(0, 110)} |`)
  md.push('', '## 2. Temuan dari membaca kode (berlaku global)', '')
  md.push('1. **Urutan tabel nilai tempat terbalik.** `PlaceValue` memakai `.reverse()` dan tidak membaliknya lagi, jadi 1.058 tampil sebagai 8, 5, 0, 1 (satuan paling kiri). Cara baca angka di buku adalah ribuan paling kiri.')
  md.push('2. **Garis bilangan tidak proporsional.** Titik-titiknya disebar rata (`flex: 1`) berapa pun nilainya, padahal teksnya meminta anak memperhatikan letak nilai.')
  md.push('3. **Kode mati.** `AngleVisual` dan `VolumeVisual` didefinisikan tapi tidak dipanggil `VisualAid`.')
  md.push('4. **Batang pecahan bercaption tanpa label** terjepit di kolom `auto` (CSS `.fm-row`), tampil sebagai garis hitam. Terlihat di screenshot soal 5/8 + 1/8.')
  md.push('', '## 3. Per tipe soal', '')
  let currentTopic = ''
  for (const result of results) {
    const { combo } = result
    if (combo.topicId !== currentTopic) { currentTopic = combo.topicId; md.push(`### Topik: ${combo.topicTitle} (\`${combo.topicId}\`)`, '') }
    md.push(`#### \`${combo.typeId}\` kelas ${combo.grade}`, '', `${result.total} soal dibangkitkan, ${result.unique} berbeda.${result.error ? ` ERROR: ${clean(result.error)}` : ''}`, '')
    const rows = [...result.flags.entries()].sort((a, b) => order[a[1].severity] - order[b[1].severity])
    if (rows.length === 0) md.push('Tidak ada temuan otomatis.', '')
    else {
      md.push('| Tingkat | Kode | Jumlah | Contoh |', '|---|---|---|---|')
      for (const [code, entry] of rows) md.push(`| ${entry.severity} | \`${code}\` | ${entry.count} | ${clean(entry.example).slice(0, 160)} |`)
      md.push('')
    }
    for (const q of result.samples) {
      let finalStep = ''
      try { finalStep = solutionSteps(q).map((item) => item.title).join(' > ') } catch { finalStep = '(error)' }
      md.push(`- **Contoh** visual \`${q.visual}\`: ${clean(q.prompt)}`)
      md.push(`  - params: \`${clean(JSON.stringify(q.params))}\``)
      if (q.choices) md.push(`  - pilihan: ${q.choices.map((choice) => `\`${clean(choice)}\``).join(', ')}`)
      md.push(`  - jawaban: \`${clean(q.expected)}\``)
      md.push(`  - petunjuk: 1) ${clean(q.hints[0])} 2) ${clean(q.hints[1])} 3) ${clean(q.hints[2])}`)
      md.push(`  - penjelasan: ${clean(q.explanation)}`)
      md.push(`  - langkah Biji: ${clean(finalStep)}`)
    }
    md.push('')
  }
  writeFileSync(fileURLToPath(new URL('../../../docs/audit-soal.md', import.meta.url)), md.join('\n'))
}, 180_000)
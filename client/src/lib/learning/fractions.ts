import type { QuestionParams, VisualKind } from './types'

/**
 * Soal pecahan tambahan untuk Ruang Hitung v3.
 * Dipisahkan dari engine.ts supaya materi pecahan mudah dikembangkan.
 * Jawaban dihitung ulang secara independen di extraAnswer().
 */
export type FractionBuild = {
  params: QuestionParams
  prompt: string
  expected: string
  explanation: string
  hints: [string, string, string]
  misconception: string
  visual: VisualKind
  choices?: string[]
}
export type FractionBuilder = (rng: () => number, grade: number) => FractionBuild

export const NEW_FRACTION_TYPES = [
  'fraction-identify',
  'fraction-subtract-same',
  'fraction-improper-to-mixed',
  'fraction-mixed-to-improper',
  'fraction-word-add',
  'fraction-word-subtract',
] as const

/** Tipe yang jawabannya harus persis (bukan pecahan senilai). */
export const STRICT_FRACTION_TYPES = new Set(['fraction-simplify', 'fraction-equivalent', 'fraction-identify', 'fraction-improper-to-mixed', 'fraction-mixed-to-improper'])

const integer = (rng: () => number, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))
const pick = <T,>(rng: () => number, values: T[]) => values[integer(rng, 0, values.length - 1)]
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))
const frac = (n: number, d: number) => `${n}/${d}`
const simplify = (n: number, d: number) => {
  const g = gcd(n, d)
  const a = n / g
  const b = d / g
  return b === 1 ? String(a) : frac(a, b)
}
const shuffle = <T,>(rng: () => number, values: T[]) => {
  const copy = [...values]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const names = ['Adi', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fani', 'Gita', 'Hana']
const foods = ['kue', 'pizza', 'semangka', 'cokelat batang', 'roti panjang']

export const fractionBuilders: Record<string, FractionBuilder> = {
  // Perbaikan: penyebut selalu berbeda dan hasil kurang dari 1 utuh agar jawabannya mudah ditulis.
  'fraction-add-different': (rng) => {
    let d1 = 2; let d2 = 3; let a = 1; let b = 1
    for (let attempt = 0; attempt < 200; attempt += 1) {
      d1 = pick(rng, [2, 3, 4, 5, 6]); d2 = pick(rng, [2, 3, 4, 5, 6])
      a = integer(rng, 1, d1 - 1); b = integer(rng, 1, d2 - 1)
      if (d1 !== d2 && a * d2 + b * d1 < d1 * d2) break
    }
    if (d1 === d2 || a * d2 + b * d1 >= d1 * d2) { d1 = 2; d2 = 4; a = 1; b = 1 }
    const num = a * d2 + b * d1
    const den = d1 * d2
    return {
      params: { a, d1, b, d2 },
      prompt: `Hitung ${frac(a, d1)} + ${frac(b, d2)}.`,
      expected: simplify(num, den),
      explanation: 'Samakan penyebut terlebih dahulu, lalu jumlahkan pembilangnya.',
      hints: ['Penyebut berbeda, artinya ukuran potongannya juga berbeda.', 'Ubah keduanya jadi pecahan senilai dengan penyebut yang sama.', 'Setelah penyebutnya sama, jumlahkan pembilangnya. Penyebut tetap.'],
      misconception: 'Menjumlahkan pembilang dengan pembilang dan penyebut dengan penyebut secara langsung.',
      visual: 'fraction-bar',
    }
  },

  'fraction-identify': (rng) => {
    const d = pick(rng, [3, 4, 5, 6, 8])
    const options = Array.from({ length: d - 1 }, (_, i) => i + 1).filter((n) => gcd(n, d) === 1)
    const n = pick(rng, options)
    return {
      params: { n, d },
      prompt: `Sebuah batang dibagi menjadi ${d} bagian sama besar. Ada ${n} bagian yang diarsir. Pecahan apa yang menunjukkan bagian yang diarsir?`,
      expected: frac(n, d),
      explanation: `Bagian yang diarsir ada ${n}, seluruh bagian ada ${d}. Jadi pecahannya ${frac(n, d)}.`,
      hints: ['Hitung dulu ada berapa bagian seluruhnya.', 'Angka bawah (penyebut) = jumlah seluruh bagian sama besar.', 'Angka atas (pembilang) = jumlah bagian yang diarsir.'],
      misconception: 'Menulis jumlah bagian yang tidak diarsir sebagai pembilang, atau menukar pembilang dan penyebut.',
      visual: 'fraction-bar',
    }
  },

  'fraction-subtract-same': (rng) => {
    const d = pick(rng, [4, 5, 6, 7, 8, 9, 10])
    const a = integer(rng, 3, d - 1)
    const b = integer(rng, 1, a - 1)
    return {
      params: { a, b, d },
      prompt: `Hitung ${frac(a, d)} − ${frac(b, d)}.`,
      expected: simplify(a - b, d),
      explanation: `Penyebut sama (${d}), jadi kurangkan pembilangnya: ${a} − ${b} = ${a - b}. Hasilnya ${frac(a - b, d)}${gcd(a - b, d) > 1 ? `, lalu disederhanakan menjadi ${simplify(a - b, d)}` : ''}.`,
      hints: ['Lihat penyebutnya. Kalau sama, potongannya sama besar.', 'Kurangkan pembilangnya saja.', 'Penyebut tidak berubah. Sederhanakan kalau bisa.'],
      misconception: 'Ikut mengurangkan penyebut sehingga ukuran potongan berubah.',
      visual: 'fraction-bar',
    }
  },

  'fraction-improper-to-mixed': (rng) => {
    const d = pick(rng, [2, 3, 4, 5, 6])
    const w = integer(rng, 1, 4)
    const r = integer(rng, 1, d - 1)
    const n = w * d + r
    const expected = `${w} ${frac(r, d)}`
    const wrong = [`${w + 1} ${frac(r, d)}`, `${w} ${frac(d, r)}`, `${w} ${frac(r, d + 1)}`, `${Math.max(1, w - 1)} ${frac(r, d)}`].filter((item) => item !== expected)
    return {
      params: { n, d, w, r },
      prompt: `Ubah ${frac(n, d)} menjadi pecahan campuran.`,
      expected,
      choices: shuffle(rng, [expected, ...wrong.slice(0, 2)]),
      explanation: `${n} ÷ ${d} = ${w} sisa ${r}. Jadi ${frac(n, d)} = ${expected}.`,
      hints: ['Pembilang lebih besar dari penyebut, artinya lebih dari 1 utuh.', `Bagi ${n} dengan ${d}. Hasil baginya adalah bilangan utuh.`, 'Sisa pembagian menjadi pembilang baru. Penyebut tetap.'],
      misconception: 'Mengabaikan sisa pembagian atau mengubah penyebut saat membuat pecahan campuran.',
      visual: 'fraction-bar',
    }
  },

  'fraction-mixed-to-improper': (rng) => {
    const d = pick(rng, [2, 3, 4, 5, 6])
    const w = integer(rng, 1, 4)
    const n = integer(rng, 1, d - 1)
    return {
      params: { w, n, d },
      prompt: `Ubah ${w} ${frac(n, d)} menjadi pecahan biasa (pembilangnya lebih besar dari penyebut).`,
      expected: frac(w * d + n, d),
      explanation: `${w} utuh = ${w} × ${d} = ${w * d} potong. Tambah ${n} potong = ${w * d + n} potong. Jadi ${frac(w * d + n, d)}.`,
      hints: [`1 utuh sama dengan ${d}/${d}. Ubah bagian utuhnya jadi potongan.`, `Kalikan bilangan utuh ${w} dengan penyebut ${d}.`, `Tambahkan pembilang ${n}. Penyebut tetap ${d}.`],
      misconception: 'Menjumlahkan bilangan utuh dengan pembilang tanpa mengalikannya dengan penyebut.',
      visual: 'fraction-bar',
    }
  },

  'fraction-word-add': (rng) => {
    const d = pick(rng, [5, 6, 7, 8, 9, 10])
    const a = integer(rng, 1, d - 2)
    const b = integer(rng, 1, d - a - 1)
    const [first, second] = shuffle(rng, names)
    const food = pick(rng, foods)
    return {
      params: { a, b, d },
      prompt: `Ibu membuat satu ${food} yang dibagi jadi ${d} bagian sama besar. ${first} makan ${frac(a, d)} bagian dan ${second} makan ${frac(b, d)} bagian. Berapa bagian ${food} yang sudah dimakan?`,
      expected: simplify(a + b, d),
      explanation: `Dimakan ${a} potong + ${b} potong = ${a + b} potong dari ${d} potong, yaitu ${frac(a + b, d)}${gcd(a + b, d) > 1 ? ` atau ${simplify(a + b, d)} jika disederhanakan` : ''}.`,
      hints: ['Cerita ini meminta kita menggabungkan dua bagian. Operasinya penjumlahan.', 'Penyebutnya sama, jadi tinggal jumlahkan pembilang.', 'Tulis hasilnya dengan penyebut yang sama.'],
      misconception: 'Menjumlahkan penyebut padahal potongan kue berukuran sama.',
      visual: 'fraction-bar',
    }
  },

  'fraction-word-subtract': (rng) => {
    const d = pick(rng, [5, 6, 7, 8, 9, 10])
    const a = integer(rng, 3, d - 1)
    const b = integer(rng, 1, a - 1)
    const [first] = shuffle(rng, names)
    const food = pick(rng, foods)
    return {
      params: { a, b, d },
      prompt: `Di piring ada ${frac(a, d)} bagian ${food}. ${first} memakan ${frac(b, d)} bagian. Berapa bagian ${food} yang tersisa di piring?`,
      expected: simplify(a - b, d),
      explanation: `Tersisa ${a} potong − ${b} potong = ${a - b} potong dari ${d} potong, yaitu ${frac(a - b, d)}${gcd(a - b, d) > 1 ? ` atau ${simplify(a - b, d)} jika disederhanakan` : ''}.`,
      hints: ['Kata "tersisa" berarti kita mengurangi.', 'Penyebutnya sama, kurangkan pembilangnya saja.', 'Penyebut tetap sama.'],
      misconception: 'Menjumlahkan padahal soal menanyakan bagian yang tersisa.',
      visual: 'fraction-bar',
    }
  },
}

/** Jawaban independen untuk tipe soal baru. Mengembalikan undefined jika bukan tipe baru. */
export function extraAnswer(type: string, p: QuestionParams): string | undefined {
  const n = (key: string) => Number(p[key])
  switch (type) {
    case 'fraction-identify': return `${n('n')}/${n('d')}`
    case 'fraction-subtract-same':
    case 'fraction-word-subtract': return simplify(n('a') - n('b'), n('d'))
    case 'fraction-word-add': return simplify(n('a') + n('b'), n('d'))
    case 'fraction-improper-to-mixed': return `${Math.floor(n('n') / n('d'))} ${n('n') % n('d')}/${n('d')}`
    case 'fraction-mixed-to-improper': return `${n('w') * n('d') + n('n')}/${n('d')}`
    default: return undefined
  }
}

/** Dua pecahan "a/b" dan "c/d" dianggap senilai bila hasil kali silangnya sama. */
export function sameFractionValue(left: string, right: string): boolean {
  const l = left.trim().match(/^(\d+)\s*\/\s*(\d+)$/)
  const r = right.trim().match(/^(\d+)\s*\/\s*(\d+)$/)
  if (!l || !r) return false
  const [ln, ld, rn, rd] = [Number(l[1]), Number(l[2]), Number(r[1]), Number(r[2])]
  if (ld === 0 || rd === 0) return false
  return ln * rd === rn * ld
}

export const fractionHelpers = { gcd, simplify }

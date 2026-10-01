export type Activity =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'factor-tree'
  | 'prime'
  | 'gcd'
  | 'lcm'

export type Choice = { value: string; label: string; helper?: string }

/** Satu langkah kecil yang dikerjakan anak (satu kotak jawaban). */
export type Step = {
  id: string
  kind: string
  prompt: string
  expected: string
  hint: string
  coach: string
  meta?: Record<string, any>
  choices?: Choice[]
  /** Jawaban lain yang juga dianggap benar (selain `expected`). */
  accepts?: string[]
}

export type Question = {
  id: string
  activity: Activity
  title: string
  eyebrow: string
  a?: number
  b?: number
  number?: number
  other?: number
  visual: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'tree' | 'concept'
  steps: Step[]
  /**
   * Dipanggil saat anak menjawab benar dengan jawaban alternatif (bukan `expected`).
   * Mengembalikan langkah pengganti mulai dari langkah itu sampai akhir, atau null kalau tidak perlu diubah.
   */
  branch?: (step: Step, answer: string) => Step[] | null
}

/** Pasangan angka hasil generator (soal satu angka hanya memakai elemen pertama). */
export type Pair = [number, number?]
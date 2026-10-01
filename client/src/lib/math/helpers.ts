import type { Activity, Choice, Step } from './types'

export const PLACE_NAMES = ['satuan', 'puluhan', 'ratusan', 'ribuan']

export const ACTIVITY_TITLES: Record<Activity, string> = {
  addition: 'Penjumlahan bersusun',
  subtraction: 'Pengurangan bersusun',
  multiplication: 'Perkalian bersusun',
  division: 'Pembagian bersusun',
  'factor-tree': 'Pohon faktor',
  prime: 'Bilangan prima',
  gcd: 'FPB',
  lcm: 'KPK',
}

/** Angka pada posisi tertentu (0 = satuan). */
export const digitAt = (value: number, position: number) => Math.floor(value / 10 ** position) % 10

/** Daftar angka dari kiri ke kanan, diisi nol di kiri sampai selebar `width`. */
export const digitsOf = (value: number, width = String(value).length) =>
  String(value).padStart(width, '0').split('').map(Number)

export const hasZeroDigit = (n: number) => String(n).includes('0')

export const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

/** Ambil konfigurasi untuk level tertentu (level di luar batas dijepit). */
export const atLevel = <T>(list: T[], level: number) =>
  list[Math.min(Math.max(level, 1), list.length) - 1]

/** Cari kandidat acak yang lolos `accept`; kalau gagal, pakai `fallback` yang sudah pasti valid. */
export function search<T>(produce: () => T, accept: (value: T) => boolean, fallback: T, tries = 400): T {
  for (let i = 0; i < tries; i += 1) {
    const candidate = produce()
    if (accept(candidate)) return candidate
  }
  return fallback
}

type StepInput = {
  kind: string
  prompt: string
  expected: number | string
  hint: string
  coach: string
  meta?: Record<string, any>
  choices?: Choice[]
  accepts?: Array<number | string>
}

export function makeStep({ kind, prompt, expected, hint, coach, meta = {}, choices, accepts }: StepInput): Step {
  return {
    id: `${kind}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    prompt,
    expected: String(expected),
    hint,
    coach,
    meta,
    choices,
    accepts: accepts?.map(String),
  }
}
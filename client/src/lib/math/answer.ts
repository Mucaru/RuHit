import type { Step } from './types'

/** Langkah yang jawabannya berupa daftar angka (urutan bebas). */
export const LIST_KINDS = ['tree-final', 'set-a', 'set-b', 'multiple-a', 'multiple-b', 'prime-factors']

const LIST_SEPARATORS = /[\s,;×x]+/

export const normalizeList = (value: string) =>
  value
    .split(LIST_SEPARATORS)
    .filter(Boolean)
    .map(Number)
    .sort((x, y) => x - y)
    .join(',')

export const normalizeText = (value: string) => value.trim().toLowerCase()

const isWholeNumber = (value: string) => /^-?\d+$/.test(value.trim())

export function stepMatches(step: Step, value: string) {
  if (step.accepts?.some((alt) => (isWholeNumber(alt) ? isWholeNumber(value) && Number(value) === Number(alt) : normalizeText(value) === normalizeText(alt)))) return true
  if (LIST_KINDS.includes(step.kind)) return normalizeList(value) === normalizeList(step.expected)
  // Angka: "07" dianggap 7, tapi "1 2" bukan 12 (spasi di dalam angka = salah)
  if (isWholeNumber(step.expected)) return isWholeNumber(value) && Number(value) === Number(step.expected)
  return normalizeText(value) === normalizeText(step.expected)
}
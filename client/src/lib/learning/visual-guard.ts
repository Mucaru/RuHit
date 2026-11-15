import type { LearningQuestion, VisualKind } from './types'

/** Hasil keputusan: jenis visual yang boleh digambar, atau 'hidden' kalau visual akan menyesatkan atau membocorkan jawaban. */
export type VisualDecision = VisualKind | 'hidden'

const isNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const isCount = (value: unknown, min: number, max: number): value is number => isNumber(value) && Number.isInteger(value) && value >= min && value <= max
const firstOf = (question: LearningQuestion, keys: string[]) => keys.map((key) => question.params[key]).find((value) => value !== undefined)

/**
 * Tabel nilai tempat hanya bermakna untuk tipe yang memang membahas bilangan bulat.
 * Sengaja tidak termasuk: whole-compose (tabelnya adalah jawabannya), desimal (angka disimpan sebagai bilangan bulat berskala),
 * serta perkalian, pembagian, rasio, uang, dan konversi satuan (nilai tempat tidak membantu dan dulu tampil sebagai "0 Satuan").
 */
const placeValueTypes: ReadonlySet<string> = new Set(['whole-place-value', 'whole-compare', 'compare-whole', 'whole-add', 'add-whole', 'whole-subtract', 'subtract-whole'])

/** Bilangan yang digambar di tabel nilai tempat: satu (value) atau dua (a dan b), maksimal 6 digit. Null kalau tidak boleh digambar. */
export function placeValueNumbers(question: LearningQuestion): number[] | null {
  if (!placeValueTypes.has(question.typeId)) return null
  const { value, a, b } = question.params
  const ok = (item: unknown): item is number => isCount(item, 0, 999999)
  if (question.typeId !== 'whole-place-value' && ok(a) && ok(b)) return [a, b]
  if (ok(value)) return [value]
  if (ok(a)) return [a]
  return null
}

/** Ukuran kisi yang sungguh dipakai GridVisual: kolom dari columns/length/side, baris dari rows/width/height. */
export function gridSize(question: LearningQuestion): { columns: number; rows: number } | null {
  const columns = firstOf(question, ['columns', 'length', 'side'])
  const rows = firstOf(question, ['rows', 'width', 'height'])
  return isCount(columns, 2, 8) && isCount(rows, 2, 6) ? { columns, rows } : null
}

const numericList = (value: unknown, min: number) => Array.isArray(value) && value.length >= min && value.every(isNumber)

/**
 * Penjaga: visual yang parameternya tidak lengkap dulu memakai nilai bawaan yang salah
 * (kisi 8x3 untuk persegi sisi 8, diagram [3, 5, 2] untuk soal pita, "0 Satuan" untuk kembalian).
 * Lebih baik tidak ada gambar daripada gambar yang salah.
 */
export function usableVisual(question: LearningQuestion): VisualDecision {
  const params = question.params
  switch (question.visual) {
    case 'place-value':
    case 'blocks':
      return placeValueNumbers(question) ? question.visual : 'hidden'
    case 'number-line':
      return numericList(params.values, 2) || (isNumber(params.a) && isNumber(params.b)) ? question.visual : 'hidden'
    case 'grid':
      return gridSize(question) ? question.visual : 'hidden'
    case 'chart':
      return numericList(params.values, 2) || numericList(params.counts, 2) ? question.visual : 'hidden'
    case 'shape':
      return params.sides !== undefined ? question.visual : 'hidden'
    case 'position':
      return params.position !== undefined ? question.visual : 'hidden'
    case 'pattern':
      return params.first !== undefined && params.second !== undefined ? question.visual : 'hidden'
    case 'tally':
      return params.count !== undefined ? question.visual : 'hidden'
    default:
      return question.visual
  }
}

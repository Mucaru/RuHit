import { describeCards, describeFood, describeMoney, describeObjects, describeRatio } from './story-visual'
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

/** Bangun yang digambar GeometryVisual. Hanya berisi ukuran yang sudah diketahui soal, tidak pernah hasil keliling atau luas. */
export type Geometry =
  | { kind: 'rectangle'; length: number; width: number; mode: 'perimeter' | 'area'; square: boolean }
  | { kind: 'triangle-sides'; a: number; b: number; c: number }
  | { kind: 'triangle-area'; base: number; height: number }
  | { kind: 'composite'; a: number; b: number; c: number; d: number }
  | { kind: 'locator'; x: number; y: number }

/** Membaca parameter soal geometri; null kalau ada yang kurang atau tidak masuk akal (mis. segitiga yang tidak bisa dibuat). */
export function describeGeometry(question: LearningQuestion): Geometry | null {
  const p = question.params
  const size = (value: unknown): value is number => isCount(value, 1, 40)
  const mode = question.typeId.startsWith('area') ? 'area' : 'perimeter'
  switch (question.typeId) {
    case 'perimeter-square':
    case 'area-square':
      return size(p.side) ? { kind: 'rectangle', length: p.side, width: p.side, mode, square: true } : null
    case 'perimeter-rectangle':
    case 'area-rectangle':
      return size(p.length) && size(p.width) ? { kind: 'rectangle', length: p.length, width: p.width, mode, square: false } : null
    case 'perimeter-triangle':
      return size(p.a) && size(p.b) && size(p.c) && p.a + p.b > p.c && p.a + p.c > p.b && p.b + p.c > p.a ? { kind: 'triangle-sides', a: p.a, b: p.b, c: p.c } : null
    case 'area-triangle':
      return size(p.base) && size(p.height) ? { kind: 'triangle-area', base: p.base, height: p.height } : null
    case 'area-composite':
      return size(p.a) && size(p.b) && size(p.c) && size(p.d) ? { kind: 'composite', a: p.a, b: p.b, c: p.c, d: p.d } : null
    case 'grid-location':
      return isCount(p.x, 1, 6) && isCount(p.y, 1, 6) ? { kind: 'locator', x: p.x, y: p.y } : null
    default:
      return null
  }
}

/** Bangun ruang yang digambar SolidVisual. cubes = true: balok dari kubus satuan (berkisi dan berlabel); false: bangun polos dengan rusuk tersembunyi putus-putus. */
export type SolidShape = { length: number; width: number; height: number; cubes: boolean }

export function describeSolid(question: LearningQuestion): SolidShape | null {
  const p = question.params
  const dim = (value: unknown): value is number => isCount(value, 1, 8)
  if (question.typeId === 'volume-unit-cubes') return dim(p.length) && dim(p.width) && dim(p.height) ? { length: p.length, width: p.width, height: p.height, cubes: true } : null
  if (question.typeId === 'solid-properties') {
    if (p.solid === 'kubus') return { length: 3, width: 3, height: 3, cubes: false }
    if (p.solid === 'balok') return { length: 4, width: 3, height: 2, cubes: false }
  }
  return null
}

/** Jumlah seperempat putaran (1 sampai 4) yang diarsir pada gambar sudut. Tidak pernah menggambar atau menulis derajatnya. */
export function angleTurn(question: LearningQuestion): number | null {
  return isCount(question.params.turn, 1, 4) ? question.params.turn : null
}

/** Waktu berangkat dan tiba (menit sejak tengah malam) untuk dua jam analog. */
export function clockTimes(question: LearningQuestion): { start: number; end: number } | null {
  const { start, end } = question.params
  return isNumber(start) && isNumber(end) && start >= 0 && end >= start && end < 2880 ? { start, end } : null
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
      return describeGeometry(question) ? question.visual : 'hidden'
    case 'volume':
      return describeSolid(question) ? question.visual : 'hidden'
    case 'angle':
      return angleTurn(question) !== null ? question.visual : 'hidden'
    case 'clock':
      return clockTimes(question) ? question.visual : 'hidden'
    case 'chart':
      return numericList(params.values, 2) || numericList(params.counts, 2) ? question.visual : 'hidden'
    case 'objects':
      return describeObjects(question) ? question.visual : 'hidden'
    case 'food':
      return describeFood(question) ? question.visual : 'hidden'
    case 'money':
      return describeMoney(question) ? question.visual : 'hidden'
    case 'ratio':
      return describeRatio(question) ? question.visual : 'hidden'
    case 'cards':
      return describeCards(question) ? question.visual : 'hidden'
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

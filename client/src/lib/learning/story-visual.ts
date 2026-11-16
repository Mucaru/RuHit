import type { LearningQuestion } from './types'
import { FRUIT_TRIO, ITEMS, isItemId, rupiah } from './items'
import type { ItemId } from './items'

/**
 * Deskripsi dan tata letak visual soal cerita (benda, makanan, uang, tabel rasio, kartu banding).
 * Semuanya murni (tanpa React) supaya bisa disapu di tes. Aturannya sama dengan visual lain:
 * hanya yang SUDAH DIKETAHUI soal yang digambar, tidak pernah jawabannya. Null berarti "jangan digambar".
 */

const isInt = (value: unknown, min: number, max: number): value is number => typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max
const intList = (value: unknown, length: number, min: number, max: number): value is number[] => Array.isArray(value) && value.length === length && value.every((item) => isInt(item, min, max))

export type TextItem = { x: number; y: number; text: string; anchor: 'start' | 'middle' | 'end'; size: number; bold?: boolean }
export type IconItem = { item: ItemId; x: number; y: number; size: number }

/** Perkiraan lebar teks tebal; sengaja agak lebar supaya pemeriksaan batas kanvas konservatif. */
export const estimateTextWidth = (text: string, size: number) => text.length * size * 0.62

// ---------- Benda: menghitung gabungan, piktogram, tabel frekuensi ----------

export type ObjectsStory =
  | { kind: 'count'; rows: Array<{ item: ItemId; count: number }> }
  | { kind: 'pictogram'; unit: number; rows: Array<{ item: ItemId; count: number }> }
  | { kind: 'table'; rows: Array<{ item: ItemId; value: number }> }

export function describeObjects(question: LearningQuestion): ObjectsStory | null {
  const p = question.params
  switch (question.typeId) {
    case 'count-objects':
      return isItemId(p.itemA) && isItemId(p.itemB) && p.itemA !== p.itemB && isInt(p.a, 1, 8) && isInt(p.b, 1, 8)
        ? { kind: 'count', rows: [{ item: p.itemA, count: p.a }, { item: p.itemB, count: p.b }] }
        : null
    case 'pictogram-read': {
      const { unit, counts } = p
      return isInt(unit, 1, 100) && intList(counts, 3, 1, 4)
        ? { kind: 'pictogram', unit, rows: FRUIT_TRIO.map((item, index) => ({ item, count: counts[index] })) }
        : null
    }
    case 'table-frequency': {
      const { values } = p
      return intList(values, 3, 0, 99)
        ? { kind: 'table', rows: FRUIT_TRIO.map((item, index) => ({ item, value: values[index] })) }
        : null
    }
    default:
      return null
  }
}

export type ObjectsLayout = { width: number; height: number; icons: IconItem[]; texts: TextItem[]; lines: Array<{ x1: number; y1: number; x2: number; y2: number }> }

const ICON = 28
const STEP = 34

export function objectsLayout(story: ObjectsStory): ObjectsLayout {
  const icons: IconItem[] = []
  const texts: TextItem[] = []
  const lines: ObjectsLayout['lines'] = []
  if (story.kind === 'count') {
    story.rows.forEach((row, r) => {
      const top = r * 64
      texts.push({ x: 14, y: top + 18, text: ITEMS[row.item].label, anchor: 'start', size: 16, bold: true })
      for (let i = 0; i < row.count; i += 1) icons.push({ item: row.item, x: 14 + i * STEP, y: top + 30, size: ICON })
    })
    return { width: 300, height: story.rows.length * 64 + 6, icons, texts, lines }
  }
  if (story.kind === 'pictogram') {
    story.rows.forEach((row, r) => {
      const top = r * 44
      texts.push({ x: 12, y: top + 22, text: ITEMS[row.item].label, anchor: 'start', size: 16, bold: true })
      for (let i = 0; i < row.count; i += 1) icons.push({ item: row.item, x: 104 + i * STEP, y: top + 8, size: ICON })
      lines.push({ x1: 8, y1: top + 44, x2: 292, y2: top + 44 })
    })
    texts.push({ x: 12, y: 3 * 44 + 22, text: `Satu gambar = ${story.unit} kg`, anchor: 'start', size: 16 })
    return { width: 300, height: 3 * 44 + 44, icons, texts, lines }
  }
  story.rows.forEach((row, r) => {
    const top = r * 44
    icons.push({ item: row.item, x: 12, y: top + 8, size: ICON })
    texts.push({ x: 56, y: top + 22, text: ITEMS[row.item].label, anchor: 'start', size: 16, bold: true })
    texts.push({ x: 288, y: top + 22, text: `${row.value} kg`, anchor: 'end', size: 16, bold: true })
    lines.push({ x1: 8, y1: top + 44, x2: 292, y2: top + 44 })
  })
  return { width: 300, height: 3 * 44 + 4, icons, texts, lines }
}

// ---------- Makanan dipotong: soal cerita pecahan ----------

export type FoodStory = { mode: 'add' | 'subtract'; item: ItemId; d: number; first: number; second: number }

export function describeFood(question: LearningQuestion): FoodStory | null {
  const p = question.params
  const mode = question.typeId === 'fraction-word-add' ? 'add' : question.typeId === 'fraction-word-subtract' ? 'subtract' : null
  if (!mode || !isItemId(p.item) || ITEMS[p.item].group !== 'makanan' || !isInt(p.d, 3, 12) || !isInt(p.a, 1, p.d) || !isInt(p.b, 1, p.d)) return null
  if (mode === 'add' ? p.a + p.b > p.d : p.b >= p.a) return null
  return { mode, item: p.item, d: p.d, first: p.a, second: p.b }
}

export type FoodSlice = { path: string; on: boolean }
export type FoodLayout = { width: number; height: number; foods: Array<{ label: string; cx: number; slices: FoodSlice[] }>; texts: TextItem[] }

const round = (value: number) => Math.round(value * 100) / 100
export function pieSlicePath(cx: number, cy: number, r: number, index: number, total: number) {
  const point = (degrees: number) => [cx + r * Math.cos((degrees * Math.PI) / 180), cy + r * Math.sin((degrees * Math.PI) / 180)]
  const [x1, y1] = point(-90 + (index * 360) / total)
  const [x2, y2] = point(-90 + ((index + 1) * 360) / total)
  return `M${round(cx)} ${round(cy)}L${round(x1)} ${round(y1)}A${r} ${r} 0 0 1 ${round(x2)} ${round(y2)}Z`
}
export const barSlicePath = (x: number, y: number, width: number, height: number, index: number, total: number) => {
  const w = width / total
  return `M${round(x + index * w)} ${y}h${round(w)}v${height}h${round(-w)}Z`
}

/** Dua gambar makanan terpisah. Tidak pernah ada gambar yang menjumlahkan atau mengurangkan, supaya jawabannya tidak terlihat. */
export function foodLayout(story: FoodStory): FoodLayout {
  const cut = ITEMS[story.item].cut
  const labels = story.mode === 'add' ? ['Yang pertama', 'Yang kedua'] : ['Di piring', 'Dimakan']
  const counts = [story.first, story.second]
  const centers = [80, 220]
  const foods = centers.map((cx, index) => ({
    label: labels[index],
    cx,
    slices: Array.from({ length: story.d }, (_, i): FoodSlice => ({
      path: cut === 'pie' ? pieSlicePath(cx, 70, 52, i, story.d) : barSlicePath(cx - 62, 30, 124, 46, i, story.d),
      on: i < counts[index],
    })),
  }))
  const labelY = cut === 'pie' ? 146 : 104
  const texts: TextItem[] = foods.map((food) => ({ x: food.cx, y: labelY, text: food.label, anchor: 'middle', size: 16, bold: true }))
  return { width: 300, height: labelY + 20, foods, texts }
}

// ---------- Uang: harga dan uang yang dibayar (kembalian tidak digambar) ----------

export type MoneyStory = { item: ItemId | null; price: number; paid: number }

export function describeMoney(question: LearningQuestion): MoneyStory | null {
  const p = question.params
  if (question.typeId !== 'money-change' || !isInt(p.price, 1000, 999000) || !isInt(p.paid, 1000, 999000) || p.paid < p.price) return null
  return { item: isItemId(p.item) ? p.item : null, price: p.price, paid: p.paid }
}

export type MoneyLayout = { width: number; height: number; icon: IconItem | null; texts: TextItem[] }

export function moneyLayout(story: MoneyStory): MoneyLayout {
  const texts: TextItem[] = [
    { x: 67, y: 28, text: 'Harga', anchor: 'middle', size: 14 },
    { x: 67, y: 92, text: 'per 1 kg', anchor: 'middle', size: 14 },
    { x: 67, y: 118, text: rupiah(story.price), anchor: 'middle', size: 16, bold: true },
    { x: 217, y: 28, text: 'Uang dibayar', anchor: 'middle', size: 14 },
    { x: 232, y: 78, text: rupiah(story.paid), anchor: 'middle', size: 16, bold: true },
  ]
  return { width: 300, height: 146, icon: story.item ? { item: story.item, x: 49, y: 40, size: 36 } : null, texts }
}

// ---------- Tabel rasio: dua baris, jawabannya bertanda ? ----------

export type RatioStory = { a: number; b: number; second: number }

export function describeRatio(question: LearningQuestion): RatioStory | null {
  const p = question.params
  return question.typeId === 'proportion' && isInt(p.a, 1, 20) && isInt(p.b, 1, 20) && isInt(p.k, 2, 9) ? { a: p.a, b: p.b, second: p.a * p.k } : null
}

export type RatioLayout = { width: number; height: number; texts: TextItem[] }

export function ratioLayout(story: RatioStory): RatioLayout {
  return {
    width: 300,
    height: 164,
    texts: [
      { x: 80, y: 34, text: 'Sirup (sendok)', anchor: 'middle', size: 14, bold: true },
      { x: 220, y: 34, text: 'Air (gelas)', anchor: 'middle', size: 14, bold: true },
      { x: 80, y: 82, text: String(story.a), anchor: 'middle', size: 20, bold: true },
      { x: 220, y: 82, text: String(story.b), anchor: 'middle', size: 20, bold: true },
      { x: 80, y: 134, text: String(story.second), anchor: 'middle', size: 20, bold: true },
      { x: 220, y: 134, text: '?', anchor: 'middle', size: 20, bold: true },
    ],
  }
}

// ---------- Kartu banding: dua benda berlabel, ukuran gambar sama (ukuran asli tidak digambar) ----------

export type CardsStory = { thing: 'pita' | 'karung'; unit: 'cm' | 'kg'; a: number; b: number }

export function describeCards(question: LearningQuestion): CardsStory | null {
  const p = question.params
  const thing = question.typeId === 'compare-length' ? 'pita' : question.typeId === 'compare-weight' ? 'karung' : null
  if (!thing || !isInt(p.a, 1, 999) || !isInt(p.b, 1, 999) || p.a === p.b) return null
  return { thing, unit: thing === 'pita' ? 'cm' : 'kg', a: p.a, b: p.b }
}

export type CardsLayout = { width: number; height: number; cards: Array<{ x: number; cx: number }>; texts: TextItem[] }

export function cardsLayout(story: CardsStory): CardsLayout {
  const name = story.thing === 'pita' ? 'Pita' : 'Karung'
  const cards = [{ x: 10, cx: 75 }, { x: 160, cx: 225 }]
  const texts: TextItem[] = [
    { x: cards[0].cx, y: 30, text: `${name} A`, anchor: 'middle', size: 16, bold: true },
    { x: cards[1].cx, y: 30, text: `${name} B`, anchor: 'middle', size: 16, bold: true },
    { x: cards[0].cx, y: 122, text: `${story.a} ${story.unit}`, anchor: 'middle', size: 18, bold: true },
    { x: cards[1].cx, y: 122, text: `${story.b} ${story.unit}`, anchor: 'middle', size: 18, bold: true },
  ]
  return { width: 300, height: 150, cards, texts }
}

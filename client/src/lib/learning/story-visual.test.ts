import { describe, expect, it } from 'vitest'
import { generateQuestion } from './engine'
import { COUNT_PAIRS, FOOD_ITEMS, FRUIT_TRIO, ITEMS, groupNoun, isItemId, rupiah } from './items'
import { cardsLayout, describeCards, describeFood, describeMoney, describeObjects, describeRatio, estimateTextWidth, foodLayout, moneyLayout, objectsLayout, ratioLayout } from './story-visual'
import type { TextItem } from './story-visual'
import { usableVisual } from './visual-guard'
import type { LearningQuestion, VisualKind } from './types'

const q = (typeId: string, visual: VisualKind, params: LearningQuestion['params']): LearningQuestion => ({ id: 't', typeId, topicId: 'uji', params, prompt: '', expected: '', explanation: '', hints: ['', '', ''], misconception: '', visual })
const seeded = (seed: number) => { let state = seed; return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296 } }

const STORY_TYPES: Record<string, VisualKind> = {
  'count-objects': 'objects', 'pictogram-read': 'objects', 'table-frequency': 'objects', 'money-change': 'money', proportion: 'ratio',
  'compare-length': 'cards', 'compare-weight': 'cards', 'fraction-word-add': 'food', 'fraction-word-subtract': 'food',
}

/** Semua soal dari generator (semua kelas dan kesulitan, banyak seed). */
function sweep(typeId: string, visit: (question: LearningQuestion) => void) {
  for (let seed = 1; seed <= 120; seed += 1) visit(generateQuestion(typeId, 'uji', seeded(seed * 71 + 13), 1 + (seed % 6), seed % 5))
}

const inCanvas = (text: TextItem, width: number, height: number) => {
  const half = estimateTextWidth(text.text, text.size) / 2
  const [left, right] = text.anchor === 'middle' ? [text.x - half, text.x + half] : text.anchor === 'start' ? [text.x, text.x + 2 * half] : [text.x - 2 * half, text.x]
  return left >= 0 && right <= width && text.y - text.size / 2 >= 0 && text.y + text.size / 2 <= height
}

describe('items: registri benda', () => {
  it('semua daftar generator berisi id yang ada di registri', () => {
    for (const id of [...FRUIT_TRIO, ...FOOD_ITEMS, ...COUNT_PAIRS.flat()]) expect(isItemId(id), id).toBe(true)
    expect(isItemId('durian')).toBe(false)
    expect(isItemId(7)).toBe(false)
  })

  it('nama benda di kalimat soal sama dengan sebelum Commit 5 (tidak mengubah teks yang sudah dikenal)', () => {
    expect(ITEMS.cokelat.noun).toBe('cokelat batang')
    expect(ITEMS.roti.noun).toBe('roti panjang')
    expect(ITEMS['bola-merah'].noun).toBe('bola merah')
    expect(groupNoun('bola-merah', 'bola-biru')).toBe('bola')
    expect(groupNoun('apel', 'jeruk')).toBe('buah')
  })

  it('rupiah memakai titik ribuan tanpa bergantung locale', () => {
    expect(rupiah(45000)).toBe('Rp45.000')
    expect(rupiah(130000)).toBe('Rp130.000')
    expect(rupiah(5000)).toBe('Rp5.000')
  })
})

describe('story-visual: deskripsi hanya dari parameter yang lengkap', () => {
  it('benda: dua kelompok berbeda, jumlah 1 sampai 8', () => {
    expect(describeObjects(q('count-objects', 'objects', { a: 5, b: 8, itemA: 'apel', itemB: 'jeruk' }))).toEqual({ kind: 'count', rows: [{ item: 'apel', count: 5 }, { item: 'jeruk', count: 8 }] })
    expect(describeObjects(q('count-objects', 'objects', { a: 5, b: 8 }))).toBeNull()
    expect(describeObjects(q('count-objects', 'objects', { a: 5, b: 8, itemA: 'apel', itemB: 'apel' }))).toBeNull()
    expect(describeObjects(q('count-objects', 'objects', { a: 9, b: 8, itemA: 'apel', itemB: 'jeruk' }))).toBeNull()
    expect(describeObjects(q('pictogram-read', 'objects', { unit: 5, counts: [1, 2, 3] }))).toMatchObject({ kind: 'pictogram', unit: 5 })
    expect(describeObjects(q('pictogram-read', 'objects', { unit: 5, counts: [1, 2] }))).toBeNull()
    expect(describeObjects(q('table-frequency', 'objects', { values: [4, 3, 5] }))).toMatchObject({ kind: 'table' })
    expect(describeObjects(q('table-frequency', 'objects', {}))).toBeNull()
  })

  it('makanan: tambah butuh a+b <= d, kurang butuh b < a', () => {
    expect(describeFood(q('fraction-word-add', 'food', { a: 1, b: 3, d: 7, item: 'kue' }))).toEqual({ mode: 'add', item: 'kue', d: 7, first: 1, second: 3 })
    expect(describeFood(q('fraction-word-add', 'food', { a: 5, b: 3, d: 7, item: 'kue' }))).toBeNull()
    expect(describeFood(q('fraction-word-subtract', 'food', { a: 5, b: 2, d: 7, item: 'roti' }))).toMatchObject({ mode: 'subtract', first: 5, second: 2 })
    expect(describeFood(q('fraction-word-subtract', 'food', { a: 2, b: 5, d: 7, item: 'roti' }))).toBeNull()
    expect(describeFood(q('fraction-word-subtract', 'food', { a: 5, b: 2, d: 7, item: 'apel' }))).toBeNull()
    expect(describeFood(q('fraction-word-subtract', 'food', { a: 5, b: 2, d: 7 }))).toBeNull()
  })

  it('uang, rasio, dan kartu banding', () => {
    expect(describeMoney(q('money-change', 'money', { price: 41000, paid: 50000, item: 'jeruk' }))).toEqual({ item: 'jeruk', price: 41000, paid: 50000 })
    expect(describeMoney(q('money-change', 'money', { price: 41000, paid: 50000 }))).toMatchObject({ item: null })
    expect(describeMoney(q('money-change', 'money', { price: 51000, paid: 50000 }))).toBeNull()
    expect(describeRatio(q('proportion', 'ratio', { a: 3, b: 2, k: 3 }))).toEqual({ a: 3, b: 2, second: 9 })
    expect(describeRatio(q('proportion', 'ratio', { a: 3, b: 2 }))).toBeNull()
    expect(describeCards(q('compare-length', 'cards', { a: 38, b: 20 }))).toEqual({ thing: 'pita', unit: 'cm', a: 38, b: 20 })
    expect(describeCards(q('compare-weight', 'cards', { a: 8, b: 3 }))).toMatchObject({ thing: 'karung', unit: 'kg' })
    expect(describeCards(q('compare-weight', 'cards', { a: 8, b: 8 }))).toBeNull()
    expect(describeCards(q('compare-weight', 'cards', {}))).toBeNull()
  })

  it('penjaga menyembunyikan visual cerita yang parameternya kosong', () => {
    for (const [typeId, kind] of Object.entries(STORY_TYPES)) expect(usableVisual(q(typeId, kind, {})), typeId).toBe('hidden')
  })
})

describe('story-visual: semua soal dari generator tergambar', () => {
  it('jenis visual dan keputusan penjaga untuk 9 tipe cerita', () => {
    for (const [typeId, kind] of Object.entries(STORY_TYPES)) {
      sweep(typeId, (question) => {
        expect(question.visual, typeId).toBe(kind)
        expect(usableVisual(question), `${typeId}: ${question.prompt}`).toBe(kind)
      })
    }
  })

  it('benda di params selalu ada di registri dan nama bendanya muncul di kalimat soal', () => {
    sweep('count-objects', (question) => {
      const { itemA, itemB } = question.params
      expect(isItemId(itemA) && isItemId(itemB)).toBe(true)
      if (isItemId(itemA) && isItemId(itemB)) { expect(question.prompt).toContain(ITEMS[itemA].noun); expect(question.prompt).toContain(ITEMS[itemB].noun) }
    })
    sweep('money-change', (question) => { expect(isItemId(question.params.item)).toBe(true); expect(question.prompt).toContain(ITEMS[question.params.item as keyof typeof ITEMS].noun) })
    for (const typeId of ['fraction-word-add', 'fraction-word-subtract']) {
      sweep(typeId, (question) => { expect(isItemId(question.params.item)).toBe(true); expect(question.prompt).toContain(ITEMS[question.params.item as keyof typeof ITEMS].noun) })
    }
  })

  it('semua variasi benda dan makanan muncul (tidak ada yang tak pernah terpilih)', () => {
    const seen = new Set<string>()
    for (const typeId of ['fraction-word-add', 'fraction-word-subtract']) sweep(typeId, (question) => seen.add(String(question.params.item)))
    expect([...seen].sort()).toEqual([...FOOD_ITEMS].sort())
    const pairs = new Set<string>()
    sweep('count-objects', (question) => pairs.add(`${question.params.itemA}+${question.params.itemB}`))
    expect(pairs.size).toBe(COUNT_PAIRS.length)
  })
})

describe('story-visual: tata letak di dalam kanvas', () => {
  it('teks dan ikon benda/piktogram/tabel tidak keluar kanvas', () => {
    for (const typeId of ['count-objects', 'pictogram-read', 'table-frequency']) {
      sweep(typeId, (question) => {
        const story = describeObjects(question)
        expect(story, question.prompt).not.toBeNull()
        if (!story) return
        const layout = objectsLayout(story)
        for (const text of layout.texts) expect(inCanvas(text, layout.width, layout.height), `${typeId}: ${text.text}`).toBe(true)
        for (const icon of layout.icons) expect(icon.x >= 0 && icon.x + icon.size <= layout.width && icon.y >= 0 && icon.y + icon.size <= layout.height, `${typeId}: ikon ${icon.x},${icon.y}`).toBe(true)
        const ids = layout.icons.map((icon) => `${Math.round(icon.x)},${Math.round(icon.y)}`)
        expect(new Set(ids).size).toBe(ids.length)
      })
    }
  })

  it('jumlah ikon sama dengan angka yang diketahui soal (a dan b, atau jumlah gambar piktogram)', () => {
    sweep('count-objects', (question) => {
      const story = describeObjects(question)
      if (story?.kind !== 'count') throw new Error('bukan count')
      const layout = objectsLayout(story)
      expect(layout.icons).toHaveLength(Number(question.params.a) + Number(question.params.b))
    })
    sweep('pictogram-read', (question) => {
      const story = describeObjects(question)
      if (story?.kind !== 'pictogram') throw new Error('bukan piktogram')
      expect(objectsLayout(story).icons).toHaveLength((question.params.counts as number[]).reduce((sum, value) => sum + value, 0))
    })
  })

  it('makanan: potongan pas d, hanya dua gambar, tidak ada gambar gabungan', () => {
    for (const typeId of ['fraction-word-add', 'fraction-word-subtract']) {
      sweep(typeId, (question) => {
        const story = describeFood(question)
        expect(story, question.prompt).not.toBeNull()
        if (!story) return
        const layout = foodLayout(story)
        expect(layout.foods).toHaveLength(2)
        const on = layout.foods.map((food) => food.slices.filter((slice) => slice.on).length)
        expect(on).toEqual([story.first, story.second])
        for (const food of layout.foods) expect(food.slices).toHaveLength(story.d)
        const result = story.mode === 'add' ? story.first + story.second : story.first - story.second
        // Jawaban (jumlah atau sisa potongan) tidak boleh menjadi satu-satunya kelompok berwarna di sebuah gambar.
        if (story.mode === 'add') expect(on.every((count) => count !== result)).toBe(true)
        for (const text of layout.texts) expect(inCanvas(text, layout.width, layout.height), text.text).toBe(true)
        for (const food of layout.foods) for (const slice of food.slices) expect(slice.path).not.toMatch(/NaN|undefined/)
      })
    }
  })

  it('uang, rasio, dan kartu banding: teks muat di kanvas', () => {
    sweep('money-change', (question) => {
      const story = describeMoney(question)
      if (!story) throw new Error(question.prompt)
      const layout = moneyLayout(story)
      for (const text of layout.texts) expect(inCanvas(text, layout.width, layout.height), text.text).toBe(true)
      // urutan teks: Harga, per 1 kg, harga, Uang dibayar, uang dibayar (dicari berdasarkan urutan karena harga bisa sama dengan uang dibayar)
      const [, , price, , paid] = layout.texts
      const half = (text: TextItem) => estimateTextWidth(text.text, text.size) / 2
      // uang dibayar muat di lembar uang (x 149 sampai 285) dan tidak menimpa lingkaran lambang (sampai x 180)
      expect(paid.x - half(paid) >= 182 && paid.x + half(paid) <= 285, paid.text).toBe(true)
      // harga muat di kartu harga (x 8 sampai 126)
      expect(price.x - half(price) >= 10 && price.x + half(price) <= 124, price.text).toBe(true)
    })
    sweep('proportion', (question) => {
      const story = describeRatio(question)
      if (!story) throw new Error(question.prompt)
      const layout = ratioLayout(story)
      for (const text of layout.texts) expect(inCanvas(text, layout.width, layout.height), text.text).toBe(true)
      // judul kolom harus muat dalam kolomnya (lebar 140)
      for (const text of layout.texts.filter((item) => item.size === 14)) expect(estimateTextWidth(text.text, text.size) <= 138, text.text).toBe(true)
    })
    for (const typeId of ['compare-length', 'compare-weight']) {
      sweep(typeId, (question) => {
        const story = describeCards(question)
        if (!story) throw new Error(question.prompt)
        const layout = cardsLayout(story)
        for (const text of layout.texts) { expect(inCanvas(text, layout.width, layout.height), text.text).toBe(true); expect(estimateTextWidth(text.text, text.size) <= 124, text.text).toBe(true) }
      })
    }
  })
})

import { describe, expect, it } from 'vitest'
import { generateQuestion } from './engine'
import { describeGeometry, placeValueNumbers, usableVisual } from './visual-guard'
import type { LearningQuestion, VisualKind } from './types'

const q = (typeId: string, visual: VisualKind, params: LearningQuestion['params']): LearningQuestion => ({ id: 't', typeId, topicId: 'uji', params, prompt: '', expected: '', explanation: '', hints: ['', '', ''], misconception: '', visual })
const seeded = (seed: number) => { let state = seed; return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296 } }

describe('visual-guard: tabel nilai tempat', () => {
  it('whole-compose tidak pernah menggambar tabel (tabelnya adalah jawabannya)', () => {
    for (let seed = 1; seed <= 50; seed += 1) {
      const question = generateQuestion('whole-compose', 'uji', seeded(seed), 5, seed % 5)
      expect(usableVisual(question), question.prompt).toBe('hidden')
    }
  })

  it('soal dua bilangan menggambar keduanya, soal satu bilangan menggambar satu', () => {
    expect(usableVisual(q('whole-compare', 'place-value', { a: 1058, b: 9812 }))).toBe('place-value')
    expect(placeValueNumbers(q('whole-compare', 'place-value', { a: 1058, b: 9812 }))).toEqual([1058, 9812])
    expect(placeValueNumbers(q('whole-place-value', 'place-value', { value: 4532, position: 2 }))).toEqual([4532])
  })

  it('tipe yang nilai tempatnya tidak bermakna atau salah skala disembunyikan', () => {
    expect(usableVisual(q('decimal-add', 'place-value', { a: 12, b: 88 }))).toBe('hidden')
    expect(usableVisual(q('money-change', 'blocks', {}))).toBe('hidden')
    expect(usableVisual(q('ratio-simplify', 'place-value', { a: 12, b: 18 }))).toBe('hidden')
    expect(usableVisual(q('whole-add', 'place-value', { a: 1234567, b: 5 }))).toBe('hidden')
    expect(usableVisual(q('whole-add', 'place-value', {}))).toBe('hidden')
  })
})

describe('visual-guard: kisi, garis bilangan, diagram', () => {
  it('bangun geometri diterima kalau parameternya lengkap dan masuk akal', () => {
    expect(usableVisual(q('area-square', 'grid', { side: 8 }))).toBe('grid')
    expect(describeGeometry(q('area-rectangle', 'grid', { length: 6, width: 4 }))).toEqual({ kind: 'rectangle', length: 6, width: 4, mode: 'area', square: false })
    expect(describeGeometry(q('perimeter-square', 'grid', { side: 5 }))).toMatchObject({ mode: 'perimeter', square: true })
    expect(usableVisual(q('perimeter-triangle', 'grid', { a: 5, b: 6, c: 7 }))).toBe('grid')
    expect(usableVisual(q('grid-location', 'grid', { x: 3, y: 2 }))).toBe('grid')
  })

  it('bangun geometri ditolak kalau parameter kurang atau mustahil', () => {
    expect(usableVisual(q('area-rectangle', 'grid', {}))).toBe('hidden')
    expect(usableVisual(q('area-rectangle', 'grid', { length: 6 }))).toBe('hidden')
    expect(usableVisual(q('perimeter-triangle', 'grid', { a: 3, b: 4, c: 9 }))).toBe('hidden')
    expect(usableVisual(q('grid-location', 'grid', { x: 9, y: 1 }))).toBe('hidden')
    expect(usableVisual(q('tipe-lain', 'grid', { side: 5 }))).toBe('hidden')
  })

  it('semua soal luas, keliling, dan petak dari generator tergambar (tidak ada yang tersembunyi)', () => {
    const types = ['perimeter-square', 'perimeter-rectangle', 'perimeter-triangle', 'area-square', 'area-rectangle', 'area-triangle', 'area-composite', 'grid-location']
    for (const typeId of types) {
      for (let seed = 1; seed <= 60; seed += 1) {
        const question = generateQuestion(typeId, 'uji', seeded(seed * 31 + 7), 3 + (seed % 4), seed % 5)
        expect(usableVisual(question), `${typeId}: ${question.prompt}`).toBe('grid')
      }
    }
  })

  it('garis bilangan dan diagram tanpa data sungguhan disembunyikan', () => {
    expect(usableVisual(q('pattern-additive', 'number-line', { start: 2, step: 3 }))).toBe('hidden')
    expect(usableVisual(q('whole-order', 'number-line', { values: [5, 2, 9] }))).toBe('number-line')
    expect(usableVisual(q('decimal-compare', 'number-line', { a: 1.5, b: 2.5 }))).toBe('number-line')
    expect(usableVisual(q('compare-length', 'chart', {}))).toBe('hidden')
    expect(usableVisual(q('bar-chart-read', 'chart', { values: [3, 5, 2] }))).toBe('chart')
    expect(usableVisual(q('bar-chart-read', 'chart', { values: [3] }))).toBe('hidden')
  })

  it('bangun, posisi, pola, turus: hanya disembunyikan kalau parameternya tidak ada', () => {
    expect(usableVisual(q('shape-recognition', 'shape', {}))).toBe('hidden')
    expect(usableVisual(q('shape-recognition', 'shape', { sides: 5 }))).toBe('shape')
    expect(usableVisual(q('position-objects', 'position', { position: 'kanan' }))).toBe('position')
    expect(usableVisual(q('pattern-shape', 'pattern', { first: 'lingkaran' }))).toBe('hidden')
    expect(usableVisual(q('count-objects', 'tally', {}))).toBe('hidden')
  })

  it('visual lain (pecahan, sudut, volume, none) diteruskan apa adanya', () => {
    for (const kind of ['fraction-bar', 'angle', 'volume', 'none'] as VisualKind[]) expect(usableVisual(q('apa-saja', kind, {}))).toBe(kind)
  })
})

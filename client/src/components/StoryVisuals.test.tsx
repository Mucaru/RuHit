// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { VisualAid } from './VisualAid'
import { generateQuestion } from '../lib/learning/engine'
import type { LearningQuestion, VisualKind } from '../lib/learning/types'

afterEach(() => cleanup())

const q = (typeId: string, visual: VisualKind, params: LearningQuestion['params']): LearningQuestion => ({ id: 't', typeId, topicId: 'uji', params, prompt: '', expected: '', explanation: '', hints: ['', '', ''], misconception: '', visual })
const seeded = (seed: number) => { let state = seed; return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296 } }
/** Bilangan dalam teks, titik ribuan dibuang ("Rp41.000." menjadi 41000). */
const numbersIn = (text: string) => new Set((text.match(/\d[\d.]*/g) ?? []).map((token) => token.replace(/\.+$/, '').replace(/\./g, '')))
/** Semua teks yang terlihat atau dibacakan pembaca layar, dipisah spasi (textContent menyambung "3","2","12" menjadi "3212"). */
const spoken = (container: HTMLElement) => `${[...container.querySelectorAll('text, small')].map((item) => item.textContent).join(' ')} ${container.querySelector('svg')?.getAttribute('aria-label') ?? ''}`

const STORY_TYPES = ['count-objects', 'pictogram-read', 'table-frequency', 'money-change', 'proportion', 'compare-length', 'compare-weight', 'fraction-word-add', 'fraction-word-subtract']

describe('StoryVisuals: semua soal cerita dari generator tergambar dan tidak membocorkan jawaban', () => {
  for (const typeId of STORY_TYPES) {
    it(`${typeId}: tergambar, tanpa inline style, dan semua angka di gambar sudah ada di soal`, () => {
      for (let seed = 1; seed <= 40; seed += 1) {
        const question = generateQuestion(typeId, 'uji', seeded(seed * 37 + 5), 1 + (seed % 6), seed % 5)
        const { container } = render(<VisualAid question={question} />)
        const svg = container.querySelector('svg')
        expect(svg, question.prompt).not.toBeNull()
        expect(svg?.getAttribute('role')).toBe('img')
        expect(container.querySelector('[style]'), question.prompt).toBeNull()
        const allowed = numbersIn(question.prompt)
        for (const number of numbersIn(spoken(container))) expect(allowed.has(number), `${typeId}: angka ${number} tidak ada di soal "${question.prompt}"`).toBe(true)
        cleanup()
      }
    })
  }
})

describe('StoryVisuals: isi gambar', () => {
  it('count-objects: satu ikon per benda, dua kelompok berlabel nama benda', () => {
    const { container } = render(<VisualAid question={q('count-objects', 'objects', { a: 5, b: 3, itemA: 'bola-merah', itemB: 'bola-biru' })} />)
    expect(container.querySelectorAll('[data-item="bola-merah"]')).toHaveLength(5)
    expect(container.querySelectorAll('[data-item="bola-biru"]')).toHaveLength(3)
    expect([...container.querySelectorAll('text')].map((item) => item.textContent)).toEqual(['Bola merah', 'Bola biru'])
    expect(container.textContent).not.toContain('8')
  })

  it('pictogram-read: ikon per buah dan keterangan nilai satu gambar; total tidak tertulis', () => {
    const { container } = render(<VisualAid question={q('pictogram-read', 'objects', { unit: 5, counts: [3, 2, 4] })} />)
    expect(container.querySelectorAll('[data-item="apel"]')).toHaveLength(3)
    expect(container.querySelectorAll('[data-item="jeruk"]')).toHaveLength(2)
    expect(container.querySelectorAll('[data-item="pisang"]')).toHaveLength(4)
    expect(container.textContent).toContain('Satu gambar = 5 kg')
    expect(container.textContent).not.toContain('45')
  })

  it('table-frequency: tiga baris, tanpa baris jumlah', () => {
    const { container } = render(<VisualAid question={q('table-frequency', 'objects', { values: [4, 3, 5] })} />)
    expect([...container.querySelectorAll('text')].map((item) => item.textContent)).toEqual(['Apel', '4 kg', 'Jeruk', '3 kg', 'Pisang', '5 kg'])
  })

  it('pecahan cerita (tambah): dua makanan terpisah, bagian berwarna a dan b, jumlahnya tidak digambar', () => {
    const { container } = render(<VisualAid question={q('fraction-word-add', 'food', { a: 1, b: 3, d: 7, item: 'kue' })} />)
    const foods = container.querySelectorAll('.story-food')
    expect(foods).toHaveLength(2)
    expect([...foods].map((food) => food.querySelectorAll('.is-on').length)).toEqual([1, 3])
    expect([...foods].map((food) => food.querySelectorAll('.story-slice').length)).toEqual([7, 7])
    expect([...container.querySelectorAll('text')].map((item) => item.textContent)).toEqual(['Yang pertama', 'Yang kedua'])
  })

  it('pecahan cerita (kurang): di piring a bagian dan dimakan b bagian; sisanya tidak digambar', () => {
    const { container } = render(<VisualAid question={q('fraction-word-subtract', 'food', { a: 5, b: 2, d: 8, item: 'cokelat' })} />)
    const foods = container.querySelectorAll('.story-food')
    expect([...foods].map((food) => food.querySelectorAll('.is-on').length)).toEqual([5, 2])
    expect([...container.querySelectorAll('text')].map((item) => item.textContent)).toEqual(['Di piring', 'Dimakan'])
  })

  it('money-change: harga dan uang dibayar saja, kembalian tidak tertulis', () => {
    const { container } = render(<VisualAid question={q('money-change', 'money', { price: 41000, paid: 50000, item: 'jeruk' })} />)
    expect([...container.querySelectorAll('text')].map((item) => item.textContent)).toEqual(['Harga', 'per 1 kg', 'Rp41.000', 'Uang dibayar', 'Rp50.000'])
    expect(container.textContent).not.toContain('9.000')
    expect(container.querySelectorAll('[data-item="jeruk"]')).toHaveLength(1)
  })

  it('proportion: dua baris tabel dan sel jawaban bertanda ?', () => {
    const { container } = render(<VisualAid question={q('proportion', 'ratio', { a: 3, b: 2, k: 3 })} />)
    expect([...container.querySelectorAll('text')].map((item) => item.textContent)).toEqual(['Sirup (sendok)', 'Air (gelas)', '3', '2', '9', '?'])
    expect(container.textContent).not.toContain('6')
  })

  it('compare-length dan compare-weight: dua kartu berlabel, ukuran gambar sama, ada catatan bukan ukuran sebenarnya', () => {
    const { container } = render(<VisualAid question={q('compare-length', 'cards', { a: 38, b: 20 })} />)
    expect([...container.querySelectorAll('text')].map((item) => item.textContent)).toEqual(['Pita A', 'Pita B', '38 cm', '20 cm'])
    const widths = [...container.querySelectorAll('polygon')].map((item) => item.getAttribute('points'))
    expect(widths).toHaveLength(2)
    expect(widths[0]).toBe(widths[1])
    expect(container.querySelector('.story-note')?.textContent).toContain('bukan ukuran sebenarnya')
    cleanup()
    const weight = render(<VisualAid question={q('compare-weight', 'cards', { a: 8, b: 3 })} />)
    expect([...weight.container.querySelectorAll('text')].map((item) => item.textContent)).toEqual(['Karung A', 'Karung B', '8 kg', '3 kg'])
  })

  it('parameter kurang: tidak menggambar apa pun', () => {
    for (const question of [q('count-objects', 'objects', { a: 5, b: 3 }), q('fraction-word-add', 'food', { a: 1, b: 3, d: 7 }), q('money-change', 'money', {}), q('proportion', 'ratio', {}), q('compare-weight', 'cards', {})]) {
      const { container } = render(<VisualAid question={question} />)
      expect(container.innerHTML, question.typeId).toBe('')
      cleanup()
    }
  })
})

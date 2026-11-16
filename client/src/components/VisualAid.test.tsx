// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { VisualAid } from './VisualAid'
import type { LearningQuestion, VisualKind } from '../lib/learning/types'

afterEach(() => cleanup())

const q = (typeId: string, visual: VisualKind, params: LearningQuestion['params']): LearningQuestion => ({ id: 't', typeId, topicId: 'uji', params, prompt: '', expected: '', explanation: '', hints: ['', '', ''], misconception: '', visual })
const digits = (row: Element) => [...row.querySelectorAll('.place-value-cell strong')].map((item) => item.textContent)
const labels = (row: Element) => [...row.querySelectorAll('.place-value-cell small')].map((item) => item.textContent)

describe('VisualAid: tabel nilai tempat', () => {
  it('ribuan di kiri dan satuan di kanan (urutan baca biasa)', () => {
    const { container } = render(<VisualAid question={q('whole-place-value', 'place-value', { value: 1058, position: 0 })} />)
    const row = container.querySelector('.place-value-row')!
    expect(digits(row)).toEqual(['1', '0', '5', '8'])
    expect(labels(row)).toEqual(['Ribuan', 'Ratusan', 'Puluhan', 'Satuan'])
    expect(container.querySelector('.place-value-name')).toBeNull()
  })

  it('soal membandingkan menggambar kedua bilangan, A dan B', () => {
    const { container } = render(<VisualAid question={q('whole-compare', 'place-value', { a: 1058, b: 9812 })} />)
    const rows = container.querySelectorAll('.place-value-row')
    expect(rows).toHaveLength(2)
    expect(digits(rows[0])).toEqual(['1', '0', '5', '8'])
    expect(digits(rows[1])).toEqual(['9', '8', '1', '2'])
    expect([...container.querySelectorAll('.place-value-name')].map((item) => item.textContent)).toEqual(['A', 'B'])
  })

  it('bilangan yang lebih pendek diberi sel kosong supaya tempat yang sama sekolom', () => {
    const { container } = render(<VisualAid question={q('whole-add', 'place-value', { a: 58, b: 9812 })} />)
    const rows = container.querySelectorAll('.place-value-row')
    expect(rows[0].querySelectorAll('.is-empty')).toHaveLength(2)
    expect(rows[1].querySelectorAll('.is-empty')).toHaveLength(0)
    expect(labels(rows[0])).toEqual(labels(rows[1]))
  })
})

describe('VisualAid: penjaga', () => {
  it('tidak menggambar apa pun untuk visual yang akan menyesatkan atau membocorkan jawaban', () => {
    for (const question of [q('whole-compose', 'place-value', { value: 4321, hundreds: 3 }), q('money-change', 'blocks', {}), q('area-rectangle', 'grid', {}), q('compare-length', 'chart', {})]) {
      const { container } = render(<VisualAid question={question} />)
      expect(container.innerHTML, question.typeId).toBe('')
      cleanup()
    }
  })
})

const labelsOf = (container: HTMLElement) => [...container.querySelectorAll('.geo-label')].map((item) => item.textContent)

describe('VisualAid: bangun geometri hanya menampilkan yang diketahui soal', () => {
  it('luas persegi panjang: panjang, lebar, dan kisi satuan; luasnya tidak tertulis', () => {
    const { container } = render(<VisualAid question={q('area-rectangle', 'grid', { length: 6, width: 4 })} />)
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toContain('6 cm kali 4 cm')
    expect(labelsOf(container)).toEqual(['6 cm', '4 cm'])
    expect(container.querySelectorAll('.geo-grid line')).toHaveLength(5 + 3)
    expect(container.textContent).not.toContain('24')
  })

  it('keliling persegi panjang: keempat sisi berlabel, tanpa kisi, kelilingnya tidak tertulis', () => {
    const { container } = render(<VisualAid question={q('perimeter-rectangle', 'grid', { length: 6, width: 4 })} />)
    expect(labelsOf(container)).toEqual(['6 cm', '6 cm', '4 cm', '4 cm'])
    expect(container.querySelector('.geo-grid')).toBeNull()
    expect(container.textContent).not.toContain('20')
  })

  it('keliling segitiga: tiga titik dan tiga label sisi', () => {
    const { container } = render(<VisualAid question={q('perimeter-triangle', 'grid', { a: 5, b: 6, c: 7 })} />)
    expect(container.querySelector('.geo-shape')?.getAttribute('points')?.split(' ')).toHaveLength(3)
    expect(labelsOf(container).sort()).toEqual(['5 cm', '6 cm', '7 cm'])
    expect(container.textContent).not.toContain('18')
  })

  it('luas segitiga: alas dan tinggi saja', () => {
    const { container } = render(<VisualAid question={q('area-triangle', 'grid', { base: 8, height: 6 })} />)
    expect(labelsOf(container)).toEqual(['alas 8 cm', 'tinggi 6 cm'])
    expect(container.textContent).not.toContain('24')
  })

  it('bangun gabungan: dua persegi panjang dan tanda tambah, luas total tidak tertulis', () => {
    const { container } = render(<VisualAid question={q('area-composite', 'grid', { a: 4, b: 3, c: 2, d: 5 })} />)
    expect(container.querySelectorAll('.geo-shape')).toHaveLength(2)
    expect(labelsOf(container)).toEqual(['+', '4 × 3 cm', '2 × 5 cm'])
    expect(container.textContent).not.toContain('22')
  })

  it('petak: kisi 6x6 dengan satu penanda di posisi sekarang', () => {
    const { container } = render(<VisualAid question={q('grid-location', 'grid', { x: 3, y: 2, nx: 4, ny: 3 })} />)
    expect(container.querySelectorAll('.geo-cell')).toHaveLength(36)
    expect(container.querySelectorAll('.geo-player')).toHaveLength(1)
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toContain('kolom 3, baris 2')
  })

  it('tidak memakai inline style (CSP)', () => {
    const { container } = render(<VisualAid question={q('perimeter-triangle', 'grid', { a: 5, b: 6, c: 7 })} />)
    expect(container.querySelector('[style]')).toBeNull()
  })
})

describe('VisualAid: bangun ruang, sudut, dan jam', () => {
  it('balok kubus satuan: kisi tiga sisi dan label ukuran; jumlah kubusnya tidak tertulis', () => {
    const { container } = render(<VisualAid question={q('volume-unit-cubes', 'volume', { length: 6, width: 2, height: 4 })} />)
    expect(container.querySelectorAll('.geo-grid line')).toHaveLength(2 * (5 + 1 + 3))
    expect(labelsOf(container)).toEqual(['panjang 6', 'lebar 2', 'tinggi 4'])
    expect(container.textContent).not.toContain('48')
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toContain('panjang 6')
  })

  it('bangun ruang polos (kubus): tiga sisi, tiga rusuk tersembunyi putus-putus, tanpa teks', () => {
    const { container } = render(<VisualAid question={q('solid-properties', 'volume', { solid: 'kubus', property: 'faces' })} />)
    expect(container.querySelectorAll('.geo-shape')).toHaveLength(3)
    expect(container.querySelectorAll('.geo-dash')).toHaveLength(3)
    expect(container.textContent).toBe('')
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe('Gambar kubus')
  })

  it('sudut: tiga perempat putaran diarsir, derajatnya tidak ditulis', () => {
    const { container } = render(<VisualAid question={q('angle-measure', 'angle', { turn: 3 })} />)
    expect(container.querySelector('.geo-shape')?.getAttribute('points')?.split(' ')).toHaveLength(1 + 36 + 1)
    expect(container.textContent).toBe('')
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toContain('tiga perempat')
  })

  it('jam: dua jam analog dengan waktu berangkat dan tiba; lama perjalanan tidak tertulis', () => {
    const { container } = render(<VisualAid question={q('duration-calculate', 'clock', { start: 810, duration: 88, end: 898 })} />)
    expect(container.querySelectorAll('.geo-clock')).toHaveLength(2)
    expect([...container.querySelectorAll('.geo-name')].map((item) => item.textContent)).toEqual(['Berangkat', 'Tiba'])
    expect([...container.querySelectorAll('.geo-time')].map((item) => item.textContent)).toEqual(['13.30', '14.58'])
    expect(container.textContent).not.toContain('88')
    const first = container.querySelector('.geo-clock')!
    const minute = first.querySelector('.geo-hand-m')!
    const hour = first.querySelector('.geo-hand-h')!
    expect(Number(minute.getAttribute('x2'))).toBeCloseTo(75, 1)
    expect(Number(minute.getAttribute('y2'))).toBeGreaterThan(72)
    expect(Number(hour.getAttribute('x2'))).toBeGreaterThan(75)
    expect(Number(hour.getAttribute('y2'))).toBeLessThan(72)
  })

  it('tidak memakai inline style (CSP)', () => {
    for (const question of [q('volume-unit-cubes', 'volume', { length: 3, width: 3, height: 3 }), q('angle-measure', 'angle', { turn: 1 }), q('duration-calculate', 'clock', { start: 600, end: 650 })]) {
      const { container } = render(<VisualAid question={question} />)
      expect(container.querySelector('[style]')).toBeNull()
      cleanup()
    }
  })
})


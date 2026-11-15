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
    for (const question of [q('whole-compose', 'place-value', { value: 4321, hundreds: 3 }), q('money-change', 'blocks', {}), q('area-square', 'grid', { side: 8 }), q('compare-length', 'chart', {})]) {
      const { container } = render(<VisualAid question={question} />)
      expect(container.innerHTML, question.typeId).toBe('')
      cleanup()
    }
  })

  it('kisi yang valid tetap tampil dengan jumlah petak yang benar', () => {
    const { container } = render(<VisualAid question={q('area-rectangle', 'grid', { length: 6, width: 4 })} />)
    expect(container.querySelectorAll('.area-grid-cell')).toHaveLength(24)
  })
})

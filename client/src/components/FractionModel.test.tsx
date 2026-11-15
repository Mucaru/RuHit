// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { FractionBarRow, FractionModel } from './FractionModel'
import type { LearningQuestion } from '../lib/learning/types'

afterEach(() => cleanup())

describe('FractionBarRow', () => {
  it('batang tanpa label diberi kelas fm-row-bare supaya selebar baris (bukan garis sempit)', () => {
    const { container } = render(<FractionBarRow d={8} segments={[{ count: 5, tone: 'a' }, { count: 1, tone: 'b' }]} caption="5/8 + 1/8" />)
    expect(container.querySelector('.fm-row')?.classList.contains('fm-row-bare')).toBe(true)
    expect(container.querySelectorAll('.fm-cell')).toHaveLength(8)
    expect(container.querySelector('.fm-caption')?.textContent).toBe('5/8 + 1/8')
  })

  it('batang berlabel memakai tata letak dua kolom biasa', () => {
    const { container } = render(<FractionBarRow d={4} segments={[{ count: 1, tone: 'a' }]} label="1/4" />)
    expect(container.querySelector('.fm-row')?.classList.contains('fm-row-bare')).toBe(false)
    expect(container.querySelector('.fm-label')?.textContent).toBe('1/4')
  })
})

const q = (typeId: string, params: Record<string, number>): LearningQuestion => ({ id: 't', typeId, topicId: 'uji', params, prompt: '', expected: '', explanation: '', hints: ['', '', ''], misconception: '', visual: 'fraction-bar' })
const coloured = (container: HTMLElement) => container.querySelectorAll('.fm-cell.fm-a, .fm-cell.fm-b, .fm-cell.fm-c, .fm-cell.fm-cross').length

describe('FractionModel tidak membocorkan jawaban', () => {
  it('pecahan senilai: batang jawaban kosong dan berlabel ?', () => {
    const { container } = render(<FractionModel question={q('fraction-equivalent', { n: 1, d: 6, factor: 2 })} />)
    expect(container.textContent).toContain('1/6')
    expect(container.textContent).toContain('?/12')
    expect(container.textContent).not.toContain('2/12')
    expect(coloured(container)).toBe(1)
  })

  it('menyederhanakan: hanya pecahan awal yang digambar', () => {
    const { container } = render(<FractionModel question={q('fraction-simplify', { n: 4, d: 8 })} />)
    expect(container.querySelectorAll('.fm-bar')).toHaveLength(1)
    expect(container.textContent).toContain('4/8')
    expect(container.textContent).not.toContain('1/2')
  })

  it.each(['fraction-add-different', 'fraction-subtract-different'])('%s: batang disamakan kosong, hanya dua pecahan soal yang berwarna', (typeId) => {
    const { container } = render(<FractionModel question={q(typeId, { a: 1, d1: 2, b: 1, d2: 3 })} />)
    const bars = container.querySelectorAll('.fm-bar')
    expect(bars).toHaveLength(3)
    expect(bars[2].querySelectorAll('.fm-cell:not(.fm-off)')).toHaveLength(0)
    expect(container.textContent).toContain('Disamakan: 6')
    expect(coloured(container)).toBe(2)
  })

  it('membagi pecahan dengan bilangan bulat: hasil bagi tidak digambar', () => {
    const { container } = render(<FractionModel question={q('fraction-divide-whole', { n: 2, d: 4, whole: 2 })} />)
    expect(container.querySelectorAll('.fm-bar')).toHaveLength(1)
    expect(coloured(container)).toBe(2)
  })
})

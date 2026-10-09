// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { buildDivision } from '../../lib/math/builders/division'
import { buildMultiplication } from '../../lib/math/builders/multiplication'
import { DivisionBoard } from './DivisionBoard'
import { MultiplicationBoard } from './MultiplicationBoard'

afterEach(() => cleanup())

const IN_CELL = '.mc-slot, .mc-bubble, .ldb-entry'

function renderStep(Board: typeof MultiplicationBoard, question: ReturnType<typeof buildMultiplication>, i: number) {
  return render(<Board question={question} current={question.steps[i]} completed={question.steps.slice(0, i)} value="" onChange={vi.fn()} disabled={false} />)
}

describe('MultiplicationBoard (perkalian bersusun)', () => {
  it('menyusun angka per kolom, bukan satu baris datar', () => {
    const q = buildMultiplication(123, 14)
    const { container } = renderStep(MultiplicationBoard, q, 0)
    const digits = [...container.querySelectorAll('.mc-digit')].map((el) => el.textContent)
    expect(digits).toEqual(['1', '2', '3', '1', '4'])
    expect(container.querySelectorAll('.mul-partial').length).toBe(2)
  })

  it.each([[15, 6], [123, 14], [408, 7], [38, 29], [305, 12]])('%i × %i: tiap langkah punya tepat satu input yang berada di dalam sel', (a, b) => {
    const q = buildMultiplication(a, b)
    q.steps.forEach((_, i) => {
      const { container, unmount } = renderStep(MultiplicationBoard, q, i)
      const inputs = container.querySelectorAll('input')
      expect(inputs.length, `langkah ${i} (${q.steps[i].kind})`).toBe(1)
      expect(inputs[0].closest(IN_CELL), `langkah ${i} (${q.steps[i].kind})`).not.toBeNull()
      unmount()
    })
  })

  it('angka simpanan muncul di sel atas kolom berikutnya, dan 0 penempatan terlihat di baris ke-2', () => {
    const q = buildMultiplication(15, 6)
    const carryIdx = q.steps.findIndex((s) => s.kind === 'multiply-carry')
    const at = renderStep(MultiplicationBoard, q, carryIdx)
    expect(at.container.querySelector('.mc-carry.mc-active input')).not.toBeNull()
    at.unmount()
    const q2 = buildMultiplication(23, 14)
    const afterZero = q2.steps.findIndex((s) => s.kind === 'place-zero') + 1
    const { container } = renderStep(MultiplicationBoard, q2, afterZero)
    expect(container.querySelectorAll('.mul-partial')[1].querySelector('.mc-filled')?.textContent).toBe('0')
  })

  it('tidak lagi memuat kata "carry"', () => {
    const q = buildMultiplication(15, 6)
    const { container } = renderStep(MultiplicationBoard, q, q.steps.findIndex((s) => s.kind === 'multiply-carry'))
    expect(container.textContent?.toLowerCase()).not.toContain('carry')
    expect(container.querySelector('input')?.getAttribute('placeholder')).not.toBe('carry')
  })
})

describe('DivisionBoard (porogapit)', () => {
  it.each([[74, 2], [876, 6], [245, 12], [507, 5], [100, 7]])('%i ÷ %i: tiap langkah punya tepat satu input di dalam petak kerja', (a, b) => {
    const q = buildDivision(a, b)
    q.steps.forEach((_, i) => {
      const { container, unmount } = renderStep(DivisionBoard as any, q as any, i)
      const inputs = container.querySelectorAll('input')
      expect(inputs.length, `langkah ${i} (${q.steps[i].kind})`).toBe(1)
      const kind = q.steps[i].kind
      if (!['division-final', 'remainder-final'].includes(kind)) expect(inputs[0].closest(IN_CELL), `langkah ${i} (${kind})`).not.toBeNull()
      unmount()
    })
  })

  it('kurung bagi tanpa celah: kolom pembagi langsung disusul digit pertama; tidak ada pill/caption pengulang', () => {
    const q = buildDivision(74, 2)
    const { container } = renderStep(DivisionBoard as any, q as any, 0)
    const top = container.querySelector('.ldb-top')!
    expect([...top.children].map((el) => el.textContent)).toEqual(['2', '7', '4'])
    expect(container.querySelector('.flow-pills')).toBeNull()
    expect(container.querySelector('.board-caption')).toBeNull()
  })

  it('sel hasil bagi aktif berada tepat di atas digit yang sedang dibagi', () => {
    const q = buildDivision(876, 6)
    const { container } = renderStep(DivisionBoard as any, q as any, 0)
    const qRow = container.querySelector('.ldb-row')!
    expect(qRow.querySelector('.ldb-entry input')).not.toBeNull()
    const idx = [...qRow.children].findIndex((el) => el.querySelector('input'))
    expect(idx).toBe(1) // kolom 0 = pembagi, jadi kolom 1 = digit pertama (8)
  })
})

describe('fuzz papan: semua langkah dari soal acak tetap punya tepat satu input', () => {
  const r = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo
  it('perkalian L1-L4', () => {
    const ranges = [[12, 49, 2, 9], [112, 499, 2, 9], [12, 49, 12, 29], [112, 399, 12, 39]]
    ranges.forEach(([aMin, aMax, bMin, bMax]) => {
      for (let n = 0; n < 12; n += 1) {
        const q = buildMultiplication(r(aMin, aMax), r(bMin, bMax))
        q.steps.forEach((_, i) => {
          const { container, unmount } = renderStep(MultiplicationBoard, q, i)
          expect(container.querySelectorAll('input').length, `${q.id} langkah ${i}`).toBe(1)
          unmount()
        })
      }
    })
  })
  it('pembagian L1-L4 (termasuk bersisa)', () => {
    const ranges = [[10, 99, 2, 9], [100, 999, 2, 9], [100, 999, 2, 9], [200, 999, 11, 25]]
    ranges.forEach(([lo, hi, dMin, dMax]) => {
      for (let n = 0; n < 12; n += 1) {
        const q = buildDivision(r(lo, hi), r(dMin, dMax))
        q.steps.forEach((_, i) => {
          const { container, unmount } = renderStep(DivisionBoard as any, q as any, i)
          expect(container.querySelectorAll('input').length, `${q.id} langkah ${i}`).toBe(1)
          unmount()
        })
      }
    })
  })
})

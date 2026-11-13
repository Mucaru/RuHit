// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { BijiCompanion } from './BijiCompanion'
import { FractionModel } from './FractionModel'
import { generateQuestion, solveQuestion } from '../lib/learning/engine'
import { solutionSteps } from '../lib/learning/solutions'

afterEach(() => cleanup())

function seeded(seed: number) {
  let t = seed
  return () => { t += 0x6d2b79f5; let r = Math.imul(t ^ (t >>> 15), t | 1); r ^= r + Math.imul(r ^ (r >>> 7), r | 61); return ((r ^ (r >>> 14)) >>> 0) / 4294967296 }
}

const question = generateQuestion('fraction-add-different', 'pecahan-operasi', seeded(5), 5, 2)

function renderBiji(overrides: Partial<Parameters<typeof BijiCompanion>[0]> = {}) {
  const onHelpUsed = vi.fn()
  render(<BijiCompanion question={question} questionNumber={1} status="idle" mistakes={0} streak={0} guided={false} onHelpUsed={onHelpUsed} {...overrides} />)
  return onHelpUsed
}

describe('BijiCompanion', () => {
  it('menyapa dengan tips sesuai jenis soal', () => {
    renderBiji()
    expect(screen.getByRole('status').textContent).toMatch(/Samakan dulu|Penyebut beda/)
  })

  it('menunjukkan langkah satu per satu dan menahan jawaban sampai diminta', () => {
    const onHelpUsed = renderBiji()
    fireEvent.click(screen.getByRole('button', { name: /Bantu aku/ }))
    expect(onHelpUsed).toHaveBeenCalledWith('steps')
    const steps = solutionSteps(question)
    for (let i = 0; i < steps.length - 1; i += 1) {
      expect(screen.getByRole('status').textContent).toContain(steps[i].title)
      if (i < steps.length - 2) fireEvent.click(screen.getByRole('button', { name: /Langkah berikutnya/ }))
    }
    fireEvent.click(screen.getByRole('button', { name: /Langkah berikutnya/ }))
    expect(screen.getByRole('status').textContent).not.toContain(`Jawabannya ${solveQuestion(question)}`)
    fireEvent.click(screen.getByRole('button', { name: /Tunjukkan jawabannya/ }))
    expect(onHelpUsed).toHaveBeenCalledWith('answer')
    expect(screen.getByRole('status').textContent).toContain(`Jawabannya ${solveQuestion(question)}`)
  })

  it('menawarkan bantuan setelah salah dua kali dan merayakan jawaban benar', () => {
    renderBiji({ status: 'wrong', mistakes: 2 })
    expect(screen.getByRole('status').textContent).toMatch(/Bantu aku|langkah pertamanya/)
    cleanup()
    renderBiji({ status: 'correct', streak: 3 })
    expect(screen.queryByRole('button', { name: /Bantu aku/ })).toBeNull()
  })
})

describe('FractionModel', () => {
  it.each(['fraction-identify', 'fraction-compare', 'fraction-add-same', 'fraction-subtract-same', 'fraction-add-different', 'fraction-of-quantity', 'fraction-improper-to-mixed', 'fraction-mixed-to-improper', 'fraction-multiply-whole', 'fraction-divide-whole', 'fraction-equivalent', 'fraction-simplify', 'fraction-order', 'fraction-percent'])('%s tampil tanpa inline style', (typeId) => {
    const q = generateQuestion(typeId, 'pecahan-operasi', seeded(11), 5, 2)
    const { container } = render(<FractionModel question={q} />)
    expect(container.querySelectorAll('.fm-cell, .fm-slice, .fm-group').length).toBeGreaterThan(0)
    expect(container.querySelector('[style]')).toBeNull()
  })
})

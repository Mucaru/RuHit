// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { makeSession, questionSummary } from '../lib/math'
import type { Question } from '../lib/math'
import { toSpeakable } from '../lib/speech'
import { Exercise } from './Exercise'

const spoken: string[] = []

beforeEach(() => {
  spoken.length = 0
  class FakeUtterance { text: string; lang = ''; rate = 1; voice: unknown = null; onend: (() => void) | null = null; onerror: (() => void) | null = null; constructor(text: string) { this.text = text } }
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
  vi.stubGlobal('speechSynthesis', { cancel: vi.fn(), getVoices: () => [], speak: (u: FakeUtterance) => { spoken.push(u.text) } })
  Object.defineProperty(window, 'speechSynthesis', { value: (globalThis as any).speechSynthesis, configurable: true })
  Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance, configurable: true })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals() })

function setup(question: Question, extra: Partial<Parameters<typeof Exercise>[0]> = {}) {
  const props = { question, questionNumber: 1, total: 10, onNext: vi.fn(), onSkip: vi.fn(), ...extra }
  render(<Exercise {...props} />)
  return props
}
const addition = () => makeSession('addition', 1, 1)[0]

describe('Exercise (mode fokus)', () => {
  it('urutan layar: kalimat langkah dulu, baru papan dan jawaban', () => {
    const q = addition()
    setup(q)
    const panel = document.querySelector('.work-panel')!
    expect(panel.children[0].className).toContain('prompt-block')
    expect(panel.children[0].textContent).toContain(q.steps[0].prompt)
    expect(panel.querySelector('form')).not.toBeNull()
  })

  it('tidak ada lagi elemen pengalih: pill skor, panel samping, tombol keluar', () => {
    setup(addition())
    expect(document.querySelector('.score-pill, .support-panel, .exit-button, .hint-card')).toBeNull()
    expect(screen.queryByText(/Keluar dari sesi/)).toBeNull()
  })

  it('hanya satu aksi utama: Periksa, lalu berganti jadi Lanjut setelah benar', () => {
    const q = addition()
    setup(q)
    expect(document.querySelectorAll('.answer-actions .primary-button')).toHaveLength(1)
    expect(screen.getByRole('button', { name: /Periksa/ })).toBeTruthy()
    const input = document.querySelector<HTMLInputElement>('input:not(:disabled)')!
    fireEvent.change(input, { target: { value: q.steps[0].expected } })
    fireEvent.click(screen.getByRole('button', { name: /Periksa/ }))
    expect(screen.queryByRole('button', { name: /Periksa/ })).toBeNull()
    expect(document.querySelectorAll('.answer-actions .primary-button')).toHaveLength(1)
    expect(screen.getByRole('button', { name: /Lanjut langkah/ })).toBeTruthy()
  })

  it('jawaban salah tidak melanjutkan dan menampilkan umpan balik', () => {
    const q = addition()
    setup(q)
    const input = document.querySelector<HTMLInputElement>('input:not(:disabled)')!
    const wrong = String((Number(q.steps[0].expected) + 1) % 10)
    fireEvent.change(input, { target: { value: wrong } })
    fireEvent.click(screen.getByRole('button', { name: /Periksa/ }))
    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Lanjut langkah/ })).toBeNull()
  })

  it('petunjuk muncul bertahap, sampai habis lalu tombol nonaktif', () => {
    setup(addition())
    const hint = () => screen.getByRole('button', { name: /petunjuk/i })
    expect(document.querySelector('.hint-inline')).toBeNull()
    fireEvent.click(hint())
    expect(document.querySelector('.hint-inline')?.textContent).toContain('Petunjuk 1 dari')
    fireEvent.click(hint()); fireEvent.click(hint()); fireEvent.click(hint())
    expect((hint() as HTMLButtonElement).disabled).toBe(true)
  })

  it('Lewati soal memanggil onSkip', () => {
    const props = setup(addition())
    fireEvent.click(screen.getByRole('button', { name: /Lewati soal/ }))
    expect(props.onSkip).toHaveBeenCalledTimes(1)
  })

  it('Dengar membaca langkah yang tampil, BUKAN ringkasan soal utuh (regresi bug laporan user)', () => {
    const q = addition()
    setup(q)
    fireEvent.click(screen.getByRole('button', { name: /Dengarkan langkah ini/ }))
    expect(spoken).toHaveLength(1)
    expect(spoken[0]).toBe(toSpeakable(q.steps[0].prompt))
    expect(spoken[0]).not.toContain(toSpeakable(questionSummary(q).label))
  })
})

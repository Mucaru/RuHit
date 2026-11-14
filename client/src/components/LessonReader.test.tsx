// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { LessonReader } from './LessonReader'
import { pecahanChapters } from '../data/lesson-pecahan'

const spoken: Array<{ text: string; lang: string }> = []
const cancel = vi.fn()

beforeEach(() => {
  spoken.length = 0
  cancel.mockClear()
  class FakeUtterance { text: string; lang = ''; rate = 1; voice: unknown = null; onend: (() => void) | null = null; onerror: (() => void) | null = null; constructor(text: string) { this.text = text } }
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
  Object.defineProperty(window, 'speechSynthesis', { value: { cancel, getVoices: () => [], speak: (item: FakeUtterance) => { spoken.push({ text: item.text, lang: item.lang }) } }, configurable: true })
})
afterEach(() => { cleanup(); vi.unstubAllGlobals(); Reflect.deleteProperty(window, 'speechSynthesis') })

describe('LessonReader: tombol Dengarkan', () => {
  it('membacakan judul, intinya, dan cerita bab yang sedang tampil dalam id-ID', () => {
    render(<LessonReader chapters={pecahanChapters} topicId="pecahan-operasi" slug="pecahan" />)
    fireEvent.click(screen.getByRole('button', { name: /Dengarkan/ }))
    expect(spoken).toHaveLength(1)
    expect(spoken[0].lang).toBe('id-ID')
    expect(spoken[0].text).toContain(pecahanChapters[0].title)
    expect(spoken[0].text).toContain(pecahanChapters[0].story.slice(0, 12))
  })

  it('berhenti membaca saat pindah bab', () => {
    render(<LessonReader chapters={pecahanChapters} topicId="pecahan-operasi" slug="pecahan" />)
    fireEvent.click(screen.getByRole('button', { name: /Dengarkan/ }))
    cancel.mockClear()
    fireEvent.click(screen.getByRole('button', { name: /Bab 2/ }))
    expect(cancel).toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /Dengarkan/ }).getAttribute('aria-pressed')).toBe('false')
  })
})

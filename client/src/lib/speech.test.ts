import { describe, expect, it } from 'vitest'
import { stepSpeech, toSpeakable } from './speech'

describe('stepSpeech', () => {
  it('membaca kalimat langkah saja, tanpa ringkasan soal utuh', () => {
    const text = toSpeakable(stepSpeech({ prompt: 'Jumlahkan kolom satuan: 1 + 6 = ...' }))
    expect(text).toBe('Jumlahkan kolom satuan: 1 ditambah 6 sama dengan berapa')
    expect(text).not.toContain('31')
    expect(text).not.toContain('26')
  })

  it('menambahkan pilihan jawaban kalau langkahnya pilihan ganda', () => {
    const text = stepSpeech({ prompt: 'Mana yang prima?', choices: [{ label: '7' }, { label: '9' }] })
    expect(text).toBe('Mana yang prima? Pilihannya: 7, 9.')
  })
})

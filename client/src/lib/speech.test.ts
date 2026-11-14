// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { canSpeak, indonesianVoice, speak, stepSpeech, stopSpeaking, toSpeakable } from './speech'

type FakeVoice = { lang: string; name: string }
class FakeUtterance {
  text: string; lang = ''; rate = 1; voice: unknown = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor(text: string) { this.text = text }
}

function installSpeech(voices: FakeVoice[] = []) {
  const utterances: FakeUtterance[] = []
  const synth = { cancel: vi.fn(), getVoices: () => voices, speak: vi.fn((item: FakeUtterance) => { utterances.push(item) }) }
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance)
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true })
  return { synth, utterances }
}

afterEach(() => {
  vi.unstubAllGlobals()
  Reflect.deleteProperty(window, 'speechSynthesis')
})

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

describe('speak (satu-satunya pintu suara)', () => {
  beforeEach(() => { Reflect.deleteProperty(window, 'speechSynthesis') })

  it('mengembalikan false dan tidak error kalau perangkat tidak punya suara', () => {
    expect(canSpeak()).toBe(false)
    expect(speak('Halo')).toBe(false)
    expect(() => stopSpeaking()).not.toThrow()
  })

  it('mengganti simbol matematika dengan kata, memakai id-ID, dan menghentikan suara sebelumnya', () => {
    const { synth, utterances } = installSpeech()
    expect(speak('2 × 3 = ...')).toBe(true)
    expect(synth.cancel).toHaveBeenCalledTimes(1)
    expect(utterances).toHaveLength(1)
    expect(utterances[0].text).toBe('2 kali 3 sama dengan berapa')
    expect(utterances[0].lang).toBe('id-ID')
    expect(utterances[0].rate).toBe(0.85)
  })

  it('memilih suara Indonesia kalau ada (id-ID maupun id_ID), kalau tidak ada tetap jalan tanpa suara khusus', () => {
    const indo = { lang: 'id_ID', name: 'Indonesia' }
    expect(indonesianVoice([{ lang: 'en-US', name: 'English' }, indo] as SpeechSynthesisVoice[])).toBe(indo)
    expect(indonesianVoice([{ lang: 'en-US', name: 'English' }] as SpeechSynthesisVoice[])).toBeUndefined()

    const withVoice = installSpeech([{ lang: 'en-US', name: 'English' }, indo])
    speak('Halo')
    expect(withVoice.utterances[0].voice).toBe(indo)

    const without = installSpeech([{ lang: 'en-US', name: 'English' }])
    speak('Halo')
    expect(without.utterances[0].voice).toBeNull()
  })

  it('memanggil onEnd saat suara selesai maupun gagal', () => {
    const { utterances } = installSpeech()
    const onEnd = vi.fn()
    speak('Halo', onEnd)
    utterances[0].onend?.()
    utterances[0].onerror?.()
    expect(onEnd).toHaveBeenCalledTimes(2)
  })
})

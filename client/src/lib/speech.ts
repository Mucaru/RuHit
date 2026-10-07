/** Baca soal dengan suara (Web Speech API bawaan browser). Tidak ada data yang dikirim ke server mana pun. */

export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'

/** Simbol matematika diganti kata, karena mesin suara sering membacanya "tanda minus"/diam. */
export function toSpeakable(text: string) {
  return text
    .replace(/\s*×\s*/g, ' kali ')
    .replace(/\s*÷\s*/g, ' dibagi ')
    .replace(/\s*[−–]\s*/g, ' dikurang ')
    .replace(/\s*\+\s*/g, ' ditambah ')
    .replace(/\s*=\s*/g, ' sama dengan ')
    .replace(/\.\.\./g, ' berapa')
    .replace(/\bFPB\b/g, 'F P B')
    .replace(/\bKPK\b/g, 'K P K')
    .replace(/\s+/g, ' ')
    .trim()
}

export function speak(text: string, onEnd?: () => void) {
  if (!canSpeak()) return false
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(toSpeakable(text))
  utterance.lang = 'id-ID'
  utterance.rate = 0.85
  const voice = synth.getVoices().find((item) => item.lang.toLowerCase().replace('_', '-').startsWith('id'))
  if (voice) utterance.voice = voice
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()
  synth.speak(utterance)
  return true
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel()
}

/** Teks yang dibacakan untuk SATU langkah: hanya kalimat langkah yang sedang tampil (plus pilihan jika ada), bukan ringkasan soal utuh. */
export function stepSpeech(step: { prompt: string; choices?: { label: string }[] }) {
  const choices = step.choices?.length ? ` Pilihannya: ${step.choices.map((choice) => choice.label).join(', ')}.` : ''
  return `${step.prompt}${choices}`
}

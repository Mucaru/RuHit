import { LIST_KINDS } from './math'
import type { Step } from './math'

export const HINT_TIERS = 3

export function hintText(step: Step, tier: number) {
  const expected = String(step.expected)
  if (tier <= 1) return step.hint
  if (tier === 2) {
    if (LIST_KINDS.includes(step.kind)) return `${step.hint} Jawabannya berisi ${expected.split(/[\s,]+/).filter(Boolean).length} angka, dimulai dari ${expected.split(/[\s,]+/)[0]}.`
    if (/^-?\d+$/.test(expected)) return `${step.hint} Jawabannya terdiri dari ${expected.replace(/\D/g, '').length} angka.`
    return `${step.hint} Baca pilihan di bawah dengan teliti, lalu pilih yang paling cocok.`
  }
  if (step.choices) return `Jawabannya: ${step.choices.find((c) => c.value === expected)?.label ?? expected}. Tekan tombol pilihan itu supaya kamu bisa lanjut.`
  return `Jawabannya: ${expected}. Ketik lalu tekan Periksa supaya kamu bisa lanjut.`
}

export function wrongMessage(step: Step, answer: string) {
  const expected = String(step.expected)
  if (step.kind === 'tree-factor' && step.meta?.current) return `${answer.trim()} tidak habis membagi ${step.meta.current}. Pilih bilangan prima yang bisa membagi habis ${step.meta.current}, tanpa sisa.`
  if (LIST_KINDS.includes(step.kind)) {
    const got = answer.split(/[\s,;×x]+/).filter(Boolean).length
    const want = expected.split(/[\s,]+/).filter(Boolean).length
    if (got < want) return 'Angkamu masih kurang. Adakah yang terlewat?'
    if (got > want) return 'Angkamu kebanyakan. Periksa lagi daftarnya.'
    return 'Jumlah angkanya sudah pas, tapi masih ada yang keliru. Periksa satu per satu.'
  }
  if (/^-?\d+$/.test(expected)) {
    if (!/^-?\d+$/.test(answer.trim())) return 'Di sini tulis angka saja, ya.'
    const diff = Number(answer) - Number(expected)
    const shift = Number(step.meta?.placeValue ?? 1)
    if (step.kind === 'partial' && shift > 1 && Number(answer) * shift === Number(expected)) return 'Hampir! Baris ini bergeser ke kiri, jangan lupa tulis 0 di paling kanan.'
    if ((step.kind === 'add-write' || step.kind === 'multiply-write') && Number(answer) > 9) return 'Kotak ini hanya muat 1 angka. Tulis angka satuannya saja, puluhannya disimpan.'
    if (Math.abs(diff) === 1) return `Hampir tepat! Jawabanmu sedikit ${diff > 0 ? 'kebesaran' : 'kekecilan'}. Hitung ulang pelan-pelan.`
    if (Math.abs(diff) === 10) return 'Hampir! Perhatikan lagi nilai tempatnya (satuan, puluhan, ratusan).'
  }
  return 'Belum tepat. Periksa lagi langkah kecil ini, lalu coba sekali lagi.'
}
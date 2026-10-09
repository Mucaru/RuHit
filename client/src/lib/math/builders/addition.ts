import { ACTIVITY_TITLES, PLACE_NAMES, digitAt, makeStep } from '../helpers'
import type { Question, Step } from '../types'

/** Jumlah "simpanan" (carry) yang terjadi saat a + b dijumlahkan kolom per kolom. */
export function countCarries(a: number, b: number) {
  let carry = 0
  let count = 0
  let x = a
  let y = b
  while (x > 0 || y > 0 || carry > 0) {
    carry = (x % 10) + (y % 10) + carry >= 10 ? 1 : 0
    count += carry
    x = Math.floor(x / 10)
    y = Math.floor(y / 10)
  }
  return count
}

export function buildAddition(a: number, b: number): Question {
  const width = Math.max(String(a).length, String(b).length)
  const steps: Step[] = []
  let carry = 0

  for (let position = width - 1; position >= 0; position -= 1) {
    const offset = width - 1 - position // 0 = satuan
    const top = digitAt(a, offset)
    const bottom = digitAt(b, offset)
    const place = PLACE_NAMES[offset]
    const raw = top + bottom + carry
    const carryText = carry ? ` + ${carry} yang disimpan` : ''

    steps.push(
      makeStep({
        kind: 'add-column',
        prompt: `Jumlahkan kolom ${place}: ${top} + ${bottom}${carryText} = ...`,
        expected: raw,
        hint: `Lihat dua angka di kolom ${place}.`,
        coach: raw < 10
          ? `Jumlah kolom ini ${raw}, langsung ditulis di bawah kolom ${place}.`
          : `Jumlah kolom ini ${raw}.${carry ? ' Sudah termasuk angka yang disimpan dari kanan.' : ''}`,
        meta: { position, top, bottom, carryIn: carry, place, width },
      })
    )
    // Hasil 0-9 sudah menjadi angka yang ditulis: tidak perlu mengetik angka yang sama dua kali.
    if (raw >= 10) {
      steps.push(
        makeStep({
          kind: 'add-write',
          prompt: `Angka berapa yang ditulis di kolom ${place}?`,
          expected: raw % 10,
          hint: 'Hasilnya dua digit: tulis angka satuannya di bawah, puluhannya disimpan.',
          coach: `Tulis angka satuan dari ${raw}, yaitu ${raw % 10}.`,
          meta: { position, place, raw, width },
        })
      )
    }

    carry = Math.floor(raw / 10)
    if (carry > 0) {
      const isLeftmost = position === 0
      steps.push(
        makeStep({
          kind: 'add-carry',
          prompt: isLeftmost
            ? 'Hasil kolom ini lebih dari 9. Angka berapa yang ditulis paling kiri di jawaban?'
            : 'Simpan angka berapa untuk kolom di sebelah kiri?',
          expected: carry,
          hint: `Angka yang disimpan adalah bagian puluhan dari ${raw}.`,
          coach: isLeftmost
            ? `Tulis ${carry} di paling kiri hasil.`
            : `Simpan ${carry} di kotak kecil di atas kolom berikutnya.`,
          meta: { position, carry, width },
        })
      )
    }
  }

  steps.push(
    makeStep({
      kind: 'final',
      prompt: `Sekarang baca hasil ${a} + ${b} dari kiri ke kanan.`,
      expected: a + b,
      hint: 'Baca semua angka jawaban, termasuk simpanan paling kiri.',
      coach: `Benar! ${a} + ${b} = ${a + b}.`,
      meta: { width, answer: a + b },
    })
  )

  return {
    id: `addition-${a}-${b}`,
    activity: 'addition',
    title: ACTIVITY_TITLES.addition,
    eyebrow: 'TULIS DARI KANAN KE KIRI',
    a,
    b,
    visual: 'addition',
    steps,
  }
}

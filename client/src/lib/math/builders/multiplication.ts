import { ACTIVITY_TITLES, PLACE_NAMES, makeStep } from '../helpers'
import type { Question, Step } from '../types'

export function buildMultiplication(a: number, b: number): Question {
  const aDigits = String(a).split('').reverse().map(Number)
  const bDigits = String(b).split('').reverse().map(Number)
  const width = String(a).length
  const steps: Step[] = []
  const partials: number[] = []
  const singleRow = bDigits.length === 1

  bDigits.forEach((multiplier, row) => {
    const placeValue = 10 ** row
    let carry = 0

    // Cara sekolah: baris ke-2 dan seterusnya dimulai dengan menulis 0 di kolom satuan (geser ke kiri).
    if (row > 0) {
      const zeros = '0'.repeat(row)
      steps.push(
        makeStep({
          kind: 'place-zero',
          prompt: `Angka ${multiplier} ada di kolom ${PLACE_NAMES[row]}, jadi baris ini bergeser ke kiri. Tulis angka berapa di kolom satuan baris ini?`,
          expected: 0,
          hint: `Baris ini digeser ${row} tempat, jadi bagian kanan diisi 0 dulu.`,
          coach: `Betul, tulis ${zeros} di kanan dulu. Setelah itu kalikan ${a} × ${multiplier} mulai dari kolom di sebelahnya.`,
          meta: { row, multiplier, placeValue, width },
        })
      )
    }

    aDigits.forEach((digit, column) => {
      const raw = digit * multiplier + carry
      const carryText = carry ? ` + ${carry} yang disimpan` : ''
      steps.push(
        makeStep({
          kind: 'multiply-column',
          prompt: `${digit} × ${multiplier}${carryText} = ...`,
          expected: raw,
          hint: `Mulai dari kolom ${PLACE_NAMES[column]} pada ${a}.`,
          coach: carry
            ? `Kalikan dulu, lalu tambahkan simpanan ${carry}.`
            : 'Tidak ada simpanan, jadi cukup dikalikan.',
          meta: { row, column, raw, carryIn: carry, multiplier, placeValue, width },
        }),
        makeStep({
          kind: 'multiply-write',
          prompt: `Angka satuan dari ${raw} yang ditulis adalah ...`,
          expected: raw % 10,
          hint: 'Yang ditulis di kolom ini adalah angka satuannya.',
          coach: `Tulis ${raw % 10}.`,
          meta: { row, column, raw, placeValue, width },
        })
      )
      carry = Math.floor(raw / 10)
      if (carry > 0 && column < aDigits.length - 1) {
        steps.push(
          makeStep({
            kind: 'multiply-carry',
            prompt: 'Simpan angka berapa untuk perkalian berikutnya?',
            expected: carry,
            hint: `Ambil bagian puluhan dari ${raw}.`,
            coach: `Simpan ${carry} di atas kolom berikutnya.`,
            meta: { row, column, carry, placeValue, width },
          })
        )
      }
    })

    if (carry > 0) {
      steps.push(
        makeStep({
          kind: 'multiply-carry-final',
          prompt: 'Angka simpanan terakhir ditulis paling kiri di baris ini. Angkanya adalah ...',
          expected: carry,
          hint: 'Ambil angka puluhan dari hasil kali kolom terakhir.',
          coach: `Tulis ${carry} di paling kiri baris ini.`,
          meta: { row, carry, placeValue, width },
        })
      )
    }

    const partial = a * multiplier * placeValue
    partials.push(partial)
    // Kalau pengalinya satu angka, baris ini sudah hasil akhir (tidak perlu ditanya dua kali).
    steps.push(
      makeStep({
        kind: 'partial',
        prompt: singleRow
          ? `Baca semua angka di baris itu. Hasil akhir ${a} × ${b} adalah ...`
          : row === 0
            ? 'Hasil kali baris pertama adalah ...'
            : `Hasil kali baris ini (baca lengkap dengan ${'0'.repeat(row)} di kanan) adalah ...`,
        expected: partial,
        hint: singleRow
          ? 'Baca semua angka hasil dari kiri ke kanan, termasuk simpanan paling kiri.'
          : row === 0
            ? 'Baca semua angka di baris pertama dari kiri ke kanan.'
            : `Baca semua angka baris ini dari kiri ke kanan, termasuk ${'0'.repeat(row)} di paling kanan.`,
        coach: singleRow ? `Hebat! ${a} × ${b} = ${a * b}.` : `Hasil baris ini ${partial}.`,
        meta: { row, partial, placeValue, width },
      })
    )
  })

  if (!singleRow) {
    steps.push(
      makeStep({
        kind: 'partial-sum',
        prompt: `Jumlahkan hasil tiap baris: ${partials.join(' + ')}. Hasil akhir ${a} × ${b} adalah ...`,
        expected: a * b,
        hint: 'Pastikan angka nol pada baris puluhan tetap sejajar.',
        coach: `Hebat! ${a} × ${b} = ${a * b}.`,
        meta: { partials, width: String(a).length + String(b).length, answer: a * b },
      })
    )
  }

  return {
    id: `multiplication-${a}-${b}`,
    activity: 'multiplication',
    title: ACTIVITY_TITLES.multiplication,
    eyebrow: 'KALIKAN PER KOLOM',
    a,
    b,
    visual: 'multiplication',
    steps,
  }
}
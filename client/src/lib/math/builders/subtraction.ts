import { ACTIVITY_TITLES, PLACE_NAMES, digitsOf, makeStep } from '../helpers'
import type { Question, Step } from '../types'

/** Cari kolom di kiri yang masih bisa memberi pinjaman (angkanya bukan 0). */
function findDonor(working: number[], position: number) {
  let donor = position - 1
  while (donor >= 0 && working[donor] === 0) donor -= 1
  return donor
}

/**
 * Berapa kolom yang perlu meminjam, dan apakah ada "rantai nol" (pinjam melewati angka 0,
 * misalnya 305 − 128). Dipakai generator untuk mengatur tingkat kesulitan.
 */
export function borrowProfile(a: number, b: number) {
  const width = Math.max(String(a).length, String(b).length)
  const bottom = digitsOf(b, width)
  const working = digitsOf(a, width)
  let count = 0
  let chain = false

  for (let position = width - 1; position >= 0; position -= 1) {
    if (working[position] >= bottom[position]) continue
    count += 1
    const donor = findDonor(working, position)
    if (donor < position - 1) chain = true
    for (let cursor = donor; cursor < position; cursor += 1) {
      working[cursor] -= 1
      working[cursor + 1] += 10
    }
  }
  return { count, chain }
}

export function buildSubtraction(a: number, b: number): Question {
  const width = Math.max(String(a).length, String(b).length)
  const bottom = digitsOf(b, width)
  const working = digitsOf(a, width)
  const steps: Step[] = []

  for (let position = width - 1; position >= 0; position -= 1) {
    const place = PLACE_NAMES[width - 1 - position]

    if (working[position] < bottom[position]) {
      const donor = findDonor(working, position)
      if (donor >= 0) {
        for (let cursor = donor; cursor < position; cursor += 1) {
          const cursorPlace = PLACE_NAMES[width - 1 - cursor]
          working[cursor] -= 1
          working[cursor + 1] += 10
          steps.push(
            makeStep({
              kind: 'borrow',
              prompt: `Pinjam 1 dari kolom ${cursorPlace}. Angka itu sekarang menjadi ...`,
              expected: working[cursor],
              hint: 'Cari angka di sebelah kiri yang masih bisa memberi pinjaman.',
              coach: `${cursorPlace} berkurang 1 menjadi ${working[cursor]}.`,
              meta: { position, cursor, board: [...working], width, place },
            })
          )
        }
        steps.push(
          makeStep({
            kind: 'borrow-receive',
            prompt: `Setelah menerima pinjaman, angka di kolom ${place} menjadi ...`,
            expected: working[position],
            hint: 'Satu puluhan bernilai 10 satuan.',
            coach: `Kolom ${place} sekarang bernilai ${working[position]}.`,
            meta: { position, board: [...working], width, place },
          })
        )
      }
    }

    const top = working[position]
    const result = top - bottom[position]
    steps.push(
      makeStep({
        kind: 'subtract-column',
        prompt: `${top} − ${bottom[position]} = ...`,
        expected: result,
        hint: 'Kurangkan angka atas setelah proses pinjam.',
        coach: `Betul, ${top} − ${bottom[position]} = ${result}.`,
        meta: { position, top, bottom: bottom[position], result, board: [...working], width, place },
      })
    )
  }

  steps.push(
    makeStep({
      kind: 'final',
      prompt: `Sekarang baca hasil ${a} − ${b} dari kiri ke kanan.`,
      expected: a - b,
      hint: 'Susun kembali angka hasil setiap kolom.',
      coach: `Benar! ${a} − ${b} = ${a - b}.`,
      meta: { width, answer: a - b },
    })
  )

  return {
    id: `subtraction-${a}-${b}`,
    activity: 'subtraction',
    title: ACTIVITY_TITLES.subtraction,
    eyebrow: 'PINJAM DENGAN TENANG',
    a,
    b,
    visual: 'subtraction',
    steps,
  }
}

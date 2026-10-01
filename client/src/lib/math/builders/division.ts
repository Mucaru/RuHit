import { ACTIVITY_TITLES, makeStep } from '../helpers'
import type { Question, Step } from '../types'

export function buildDivision(dividend: number, divisor: number): Question {
  const dividendDigits = String(dividend).split('').map(Number)
  const lastIndex = dividendDigits.length - 1
  const steps: Step[] = []
  let remainder = 0
  let quotient = ''
  let started = false // sudah mulai menulis hasil bagi?

  dividendDigits.forEach((digit, index) => {
    const current = remainder * 10 + digit
    // Angka depan yang masih lebih kecil dari pembagi digabung dengan angka berikutnya.
    if (!started && current < divisor && index < lastIndex) {
      remainder = current
      return
    }
    started = true

    const qDigit = Math.floor(current / divisor)
    const product = divisor * qDigit
    const tooSmallHint =
      quotient === '' && index > 0
        ? `Angka ${dividendDigits.slice(0, index).join('')} masih terlalu kecil untuk dibagi ${divisor}, jadi kita ambil ${current}.`
        : `Cari kelipatan ${divisor} yang paling dekat dengan ${current}.`

    steps.push(
      makeStep({
        kind: 'divide',
        prompt: `Berapa kali ${divisor} masuk ke ${current}? (${current} ÷ ${divisor})`,
        expected: qDigit,
        hint: tooSmallHint,
        coach: `${divisor} masuk ke ${current} sebanyak ${qDigit} kali.`,
        meta: { current, divisor, qDigit, index, quotient: `${quotient}${qDigit}`, remainder },
      })
    )
    quotient += String(qDigit)

    steps.push(
      makeStep({
        kind: 'multiply-back',
        prompt: `${divisor} × ${qDigit} = ...`,
        expected: product,
        hint: 'Kalikan balik pembagi dengan angka hasil bagi.',
        coach: `${divisor} × ${qDigit} = ${product}.`,
        meta: { current, divisor, qDigit, product, index, quotient },
      })
    )

    remainder = current - product
    steps.push(
      makeStep({
        kind: 'subtract',
        prompt: `${current} − ${product} = ...`,
        expected: remainder,
        hint: 'Kurangkan hasil kali balik dari angka yang sedang dibagi.',
        coach: `Sisa sementara adalah ${remainder}.`,
        meta: { current, product, remainder, index, quotient },
      })
    )

    if (index < lastIndex) {
      const next = dividendDigits[index + 1]
      const brought = remainder * 10 + next
      steps.push(
        makeStep({
          kind: 'bring-down',
          prompt: `Turunkan angka ${next}. Angka baru yang terbentuk adalah ...`,
          expected: brought,
          hint: `Letakkan ${next} di sebelah kanan sisa ${remainder}.`,
          coach: `Sisa ${remainder} dan angka ${next} membentuk ${brought}.`,
          meta: { remainder, next, brought, index, quotient },
        })
      )
    }
  })

  const quotientNumber = Number(quotient || '0')
  steps.push(
    makeStep({
      kind: 'division-final',
      prompt: `Hasil bagi dari ${dividend} ÷ ${divisor} adalah ...`,
      expected: quotientNumber,
      hint: 'Baca semua angka hasil bagi dari kiri ke kanan.',
      coach: `Hasil baginya ${quotientNumber}.`,
      meta: { quotient: quotientNumber, remainder, dividend, divisor },
    })
  )

  // Kalau habis dibagi, tidak perlu menanyakan "sisa = 0".
  if (remainder !== 0) {
    steps.push(
      makeStep({
        kind: 'remainder-final',
        prompt: `Sisa pembagian ${dividend} ÷ ${divisor} adalah ...`,
        expected: remainder,
        hint: 'Sisa harus lebih kecil daripada pembagi.',
        coach: `Sisanya ${remainder}, dan ${remainder} lebih kecil dari ${divisor}.`,
        meta: { quotient: quotientNumber, remainder, divisor },
      })
    )
  }

  return {
    id: `division-${dividend}-${divisor}`,
    activity: 'division',
    title: ACTIVITY_TITLES.division,
    eyebrow: 'BAGI · KALI · KURANGI · TURUNKAN',
    a: dividend,
    b: divisor,
    visual: 'division',
    steps,
  }
}

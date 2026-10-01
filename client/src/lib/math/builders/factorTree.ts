import { ACTIVITY_TITLES, makeStep } from '../helpers'
import { isPrime, primeFactors } from '../numbers'
import type { Choice, Question, Step } from '../types'

const PRIME_CHOICES: Choice[] = [2, 3, 5, 7].map((value) => ({
  value: String(value),
  label: String(value),
  helper: isPrime(value) ? 'bilangan prima' : '',
}))

export function buildFactorTree(n: number): Question {
  const factors = primeFactors(n)
  const steps: Step[] = []
  let current = n

  // Setiap faktor kecuali yang terakhir menghasilkan satu cabang (pilih prima, lalu bagi).
  factors.slice(0, -1).forEach((factor, index) => {
    const next = current / factor
    steps.push(
      makeStep({
        kind: 'tree-factor',
        prompt: `Pilih prima terkecil yang dapat membagi ${current}.`,
        expected: factor,
        hint: 'Coba dari 2, lalu 3, 5, dan 7.',
        coach: `${factor} adalah prima terkecil yang membagi ${current}.`,
        meta: { current, factor, next, index },
        choices: PRIME_CHOICES,
      }),
      makeStep({
        kind: 'tree-quotient',
        prompt: `Lengkapi cabang: ${current} ÷ ${factor} = ...`,
        expected: next,
        hint: 'Gunakan angka prima yang baru kamu pilih sebagai pembagi.',
        coach: `${current} ÷ ${factor} = ${next}.`,
        meta: { current, factor, next, index },
      })
    )
    current = next
  })

  steps.push(
    makeStep({
      kind: 'tree-final',
      prompt: `Tulis semua daun prima dari pohon faktor ${n}, pisahkan dengan koma.`,
      expected: factors.join(', '),
      hint: 'Tulis semua daun prima. Faktor yang sama ditulis berulang, urutannya boleh bebas.',
      coach: `${n} = ${factors.join(' × ')}.`,
      meta: { factors },
    })
  )

  return {
    id: `tree-${n}`,
    activity: 'factor-tree',
    title: ACTIVITY_TITLES['factor-tree'],
    eyebrow: 'PECAH SAMPAI TINGGAL PRIMA',
    number: n,
    visual: 'tree',
    steps,
  }
}

import { ACTIVITY_TITLES, makeStep } from '../helpers'
import { isPrime, primeFactors } from '../numbers'
import type { Choice, Question, Step } from '../types'

/** Prima yang boleh dipilih anak. Generator L3-L4 memakai 11 dan 13; L1-L2 hanya sampai 7. */
export const TREE_PRIMES = [2, 3, 5, 7, 11, 13]
const PRIME_CHOICES: Choice[] = TREE_PRIMES.map((value) => ({
  value: String(value),
  label: String(value),
  helper: isPrime(value) ? 'bilangan prima' : '',
}))

/** Satu cabang: pilih prima yang membagi `current` (prima apa pun yang habis membagi boleh), lalu tulis hasil baginya. */
function branchSteps(current: number, index: number, chosen?: number): Step[] {
  const factors = primeFactors(current)
  if (factors.length <= 1) return [] // sudah prima: tidak ada cabang lagi
  const factor = chosen ?? factors[0]
  const next = current / factor
  const validPrimes = Array.from(new Set(factors))

  return [
    makeStep({
      kind: 'tree-factor',
      prompt: `Pilih satu bilangan prima yang bisa membagi habis ${current}.`,
      expected: factor,
      accepts: validPrimes,
      hint: 'Coba bilangan prima kecil dulu: 2, 3, 5, 7, 11, atau 13. Pilih yang habis membagi, tanpa sisa.',
      coach: `${factor} adalah bilangan prima dan habis membagi ${current}. Bagus!`,
      meta: { current, factor, next, index },
      choices: PRIME_CHOICES,
    }),
    makeStep({
      kind: 'tree-quotient',
      prompt: `Lengkapi cabang: ${current} ÷ ${factor} = ...`,
      expected: next,
      hint: 'Bagi dengan bilangan prima yang baru kamu pilih.',
      coach: `${current} ÷ ${factor} = ${next}.`,
      meta: { current, factor, next, index },
    }),
    ...branchSteps(next, index + 1),
  ]
}

export function buildFactorTree(n: number): Question {
  const factors = primeFactors(n)

  const finalStep = () =>
    makeStep({
      kind: 'tree-final',
      prompt: `Tulis semua ujung prima dari pohon faktor ${n}, pisahkan dengan koma.`,
      expected: factors.join(', '),
      hint: 'Tulis semua ujung prima. Angka yang sama ditulis berulang, urutannya boleh bebas.',
      coach: `${n} = ${factors.join(' × ')}.`,
      meta: { factors },
    })

  return {
    id: `tree-${n}`,
    activity: 'factor-tree',
    title: ACTIVITY_TITLES['factor-tree'],
    eyebrow: 'PECAH SAMPAI TINGGAL PRIMA',
    number: n,
    visual: 'tree',
    steps: [...branchSteps(n, 0), finalStep()],
    // Anak memilih prima lain yang juga benar (mis. 12 ÷ 3): susun ulang sisa pohonnya dari pilihan itu.
    branch: (step, answer) => {
      if (step.kind !== 'tree-factor') return null
      const chosen = Number(answer)
      if (chosen === Number(step.expected)) return null
      return [...branchSteps(step.meta!.current, step.meta!.index, chosen), finalStep()]
    },
  }
}
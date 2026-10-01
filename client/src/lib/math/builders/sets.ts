import { ACTIVITY_TITLES, makeStep } from '../helpers'
import { gcd, lcm, listFactors } from '../numbers'
import type { Question } from '../types'

const multiples = (n: number, count: number) => Array.from({ length: count }, (_, i) => n * (i + 1))

/** FPB dan KPK: tulis daftar faktor / kelipatan kedua bilangan, lalu pilih yang bersama. */
export function buildSetQuestion(activity: 'gcd' | 'lcm', a: number, b: number): Question {
  const isGcd = activity === 'gcd'
  const common = lcm(a, b)
  // KPK: tulis kelipatan secukupnya sampai kelipatan bersama pertama muncul (minimal 4),
  // supaya anak tidak perlu mengetik 8 + 8 angka.
  const countA = Math.max(4, common / a + 1)
  const countB = Math.max(4, common / b + 1)

  const listA = isGcd ? listFactors(a) : multiples(a, countA)
  const listB = isGcd ? listFactors(b) : multiples(b, countB)
  const shared = listA.filter((value) => listB.includes(value))
  const answer = isGcd ? gcd(a, b) : common

  const listPrompt = (n: number, count: number) =>
    isGcd
      ? `Tuliskan semua faktor dari ${n}, pisahkan dengan koma.`
      : `Tuliskan ${count} kelipatan pertama dari ${n}, pisahkan dengan koma.`
  const listCoach = (n: number, list: number[]) => `${isGcd ? 'Faktor' : 'Kelipatan'} ${n}: ${list.join(', ')}.`

  return {
    id: `${activity}-${a}-${b}`,
    activity,
    title: ACTIVITY_TITLES[activity],
    eyebrow: isGcd ? 'CARI FAKTOR BERSAMA' : 'CARI KELIPATAN BERSAMA',
    number: a,
    other: b,
    visual: 'concept',
    steps: [
      makeStep({
        kind: isGcd ? 'set-a' : 'multiple-a',
        prompt: listPrompt(a, countA),
        expected: listA.join(', '),
        hint: isGcd ? 'Cari angka yang membagi habis tanpa sisa.' : 'Kalikan bilangan dengan 1, 2, 3, dan seterusnya.',
        coach: listCoach(a, listA),
        meta: { list: listA },
      }),
      makeStep({
        kind: isGcd ? 'set-b' : 'multiple-b',
        prompt: listPrompt(b, countB),
        expected: listB.join(', '),
        hint: isGcd ? 'Gunakan cara yang sama untuk bilangan kedua.' : 'Lanjutkan daftar hingga menemukan angka yang sama.',
        coach: listCoach(b, listB),
        meta: { list: listB },
      }),
      makeStep({
        kind: 'set-final',
        prompt: `${isGcd ? 'Faktor bersama terbesar' : 'Kelipatan bersama terkecil'} dari ${a} dan ${b} adalah ...`,
        expected: answer,
        hint: isGcd
          ? `Faktor bersamanya adalah ${shared.join(', ')}.`
          : `Kelipatan bersama pertama yang terlihat adalah ${shared[0]}.`,
        coach: `${isGcd ? 'FPB' : 'KPK'} dari ${a} dan ${b} = ${answer}.`,
        meta: { answer, shared },
      }),
    ],
  }
}

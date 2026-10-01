import { ACTIVITY_TITLES, makeStep } from '../helpers'
import { isPrime, listFactors } from '../numbers'
import type { Question } from '../types'

export function buildPrime(n: number): Question {
  const prime = isPrime(n)
  const answer = prime ? 'ya' : 'tidak'
  const factors = listFactors(n)

  return {
    id: `prime-${n}`,
    activity: 'prime',
    title: ACTIVITY_TITLES.prime,
    eyebrow: 'CEK DUA FAKTOR SAJA',
    number: n,
    visual: 'concept',
    steps: [
      makeStep({
        kind: 'prime-check',
        prompt: `Apakah ${n} termasuk bilangan prima?`,
        expected: answer,
        hint: 'Bilangan prima hanya punya dua faktor: 1 dan dirinya sendiri.',
        coach: prime
          ? `${n} hanya punya faktor 1 dan ${n}.`
          : `${n} punya faktor lain, yaitu ${factors.slice(1, -1).join(', ')}.`,
        meta: { factors },
        choices: [
          { value: 'ya', label: 'Ya, prima', helper: 'hanya 1 dan dirinya' },
          { value: 'tidak', label: 'Bukan prima', helper: 'punya faktor lain' },
        ],
      }),
      makeStep({
        kind: 'prime-explain',
        prompt: `Tulis jumlah faktor dari ${n}.`,
        expected: factors.length,
        hint: 'Hitung semua angka yang dapat membagi habis.',
        coach: `${n} punya ${factors.length} faktor.`,
        meta: { factors },
      }),
    ],
  }
}

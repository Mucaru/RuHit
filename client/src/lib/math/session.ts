import { buildAddition } from './builders/addition'
import { buildDivision } from './builders/division'
import { buildFactorTree } from './builders/factorTree'
import { buildMultiplication } from './builders/multiplication'
import { buildPrime } from './builders/prime'
import { buildSetQuestion } from './builders/sets'
import { buildSubtraction } from './builders/subtraction'
import { generators } from './generators'
import type { Activity, Pair, Question } from './types'

function build(activity: Activity, [a, b]: Pair): Question {
  switch (activity) {
    case 'addition':
      return buildAddition(a, b!)
    case 'subtraction':
      return buildSubtraction(a, b!)
    case 'multiplication':
      return buildMultiplication(a, b!)
    case 'division':
      return buildDivision(a, b!)
    case 'factor-tree':
      return buildFactorTree(a)
    case 'prime':
      return buildPrime(a)
    case 'gcd':
    case 'lcm':
      return buildSetQuestion(activity, a, b!)
  }
}

/** Kunci pembeda soal: 23 + 45 dan 45 + 23 dianggap soal yang sama. */
function questionKey(activity: Activity, [a, b]: Pair) {
  if (activity === 'addition' && b !== undefined) return [Math.min(a, b), Math.max(a, b)].join('-')
  return `${a}-${b ?? ''}`
}

/** Buat satu sesi soal acak sesuai level, tanpa soal kembar (selama ruang soalnya cukup). */
export function makeSession(activity: Activity, level: number, size: number): Question[] {
  const seen = new Set<string>()
  const session: Question[] = []
  let attempts = 0

  while (session.length < size) {
    const pair = generators[activity](level)
    const key = questionKey(activity, pair)
    attempts += 1
    // Setelah terlalu banyak percobaan, izinkan soal kembar agar tidak looping selamanya.
    if (seen.has(key) && attempts < size * 60) continue
    seen.add(key)
    session.push(build(activity, pair))
  }
  return session
}

import { borrowProfile } from './builders/subtraction'
import { countCarries } from './builders/addition'
import { atLevel, hasZeroDigit, rand, search } from './helpers'
import { gcd, isPrime, lcm, primeFactors } from './numbers'
import type { Activity, Pair } from './types'

type Generator = (level: number) => Pair
type Range = [min: number, max: number]

const smooth = (n: number, maxPrime = 7) => primeFactors(n).every((factor) => factor <= maxPrime)
const hasBigPrime = (n: number) => primeFactors(n).some((factor) => factor === 11 || factor === 13)
const ordered = (x: number, y: number): [number, number] => (x < y ? [x, y] : [y, x])

/** Penjumlahan: L1 tanpa simpanan, L2 satu simpanan, L3 satu-dua simpanan, L4 dua+ simpanan. */
const addition: Generator = (level) => {
  const [min, max] = atLevel<Range>([[11, 49], [25, 99], [120, 899], [1100, 4999]], level)
  const carriesOk = (c: number) =>
    level <= 1 ? c === 0 : level === 2 ? c === 1 : level === 3 ? c >= 1 && c <= 2 : c >= 2
  return search<[number, number]>(
    () => [rand(min, max), rand(min, max)],
    ([a, b]) => a !== b && carriesOk(countCarries(a, b)),
    atLevel<[number, number]>([[12, 13], [47, 38], [367, 245], [2487, 3695]], level)
  )
}

/** Pengurangan: L1 tanpa pinjam, L2 satu pinjam, L3-L4 pinjam + sebagian soal "rantai nol" (305 − 128). */
const subtraction: Generator = (level) => {
  const [min, max] = atLevel<Range>([[20, 99], [20, 99], [200, 999], [1000, 9999]], level)
  const wantChain = level === 3 ? Math.random() < 0.3 : level >= 4 ? Math.random() < 0.4 : false
  const accept = ([a, b]: [number, number]) => {
    if (a === b) return false
    const { count, chain } = borrowProfile(a, b)
    if (level <= 1) return count === 0
    if (level === 2) return count === 1
    if (wantChain && !chain) return false
    return count >= (level >= 4 ? 2 : 1)
  }
  return search<[number, number]>(
    () => {
      const [lo, hi] = ordered(rand(min, max), rand(min, max))
      return [hi, lo]
    },
    accept,
    atLevel<[number, number]>([[98, 35], [91, 58], [702, 358], [5003, 1789]], level)
  )
}

/** Perkalian: pengali tidak pernah memuat 0; angka yang dikali kadang memuat 0 (L2 dan L4). */
const multiplication: Generator = (level) => {
  const [aMin, aMax, bMin, bMax] = atLevel<[number, number, number, number]>(
    [[12, 49, 2, 9], [112, 499, 2, 9], [12, 49, 12, 29], [112, 399, 12, 39]],
    level
  )
  const wantZeroInA = (level === 2 || level === 4) && Math.random() < 0.3
  return search<[number, number]>(
    () => [rand(aMin, aMax), rand(bMin, bMax)],
    ([a, b]) => !hasZeroDigit(b) && hasZeroDigit(a) === wantZeroInA,
    atLevel<[number, number]>([[23, 4], [123, 4], [23, 14], [123, 14]], level)
  )
}

/** Pembagian: L1-L2 habis dibagi, L3-L4 kebanyakan bersisa (sekitar 30% habis dibagi). */
const division: Generator = (level) => {
  const exact = (lo: number, hi: number, dMin: number, dMax: number): Pair => {
    const divisor = rand(dMin, dMax)
    return [divisor * rand(Math.ceil(lo / divisor), Math.floor(hi / divisor)), divisor]
  }
  if (level === 1) return exact(10, 99, 2, 9)
  if (level === 2) return exact(100, 999, 2, 9)
  const [lo, hi, dMin, dMax] = level === 3 ? [100, 999, 2, 9] : [200, 999, 11, 25]
  if (Math.random() < 0.3) return exact(lo, hi, dMin, dMax)
  return search<[number, number]>(
    () => [rand(lo, hi), rand(dMin, dMax)],
    ([dividend, divisor]) => dividend % divisor !== 0,
    [lo + 1, dMin]
  )
}

/** Pohon faktor: L1-L2 prima sampai 7; L3-L4 sekitar 40% soal memuat 11 atau 13 (semua faktor tetap <= 13). */
const factorTree: Generator = (level) => {
  const [min, max] = atLevel<Range>([[12, 30], [32, 60], [60, 100], [100, 150]], level)
  const wantBig = level >= 3 && Math.random() < 0.4
  return [
    search(
      () => rand(min, max),
      (n) => !isPrime(n) && (level >= 3 ? smooth(n, 13) && hasBigPrime(n) === wantBig : smooth(n)),
      level >= 3 ? 66 : 12
    ),
  ]
}

const prime: Generator = (level) => {
  const [min, max] = atLevel<Range>([[11, 29], [30, 59], [60, 99]], level)
  const wantPrime = Math.random() < 0.5
  return [
    search(
      () => rand(min, max),
      (n) => isPrime(n) === wantPrime && (level === 1 || n % 2 === 1),
      wantPrime ? 13 : 15
    ),
  ]
}

/** FPB: biasanya punya faktor bersama > 1; level 2+ kadang berkelipatan, level 3 kadang FPB = 1. */
const gcdQuestion: Generator = (level) => {
  const [min, max] = atLevel<Range>([[6, 24], [12, 36], [24, 60]], level)
  const special = level >= 3 && Math.random() < 0.2 ? 'coprime' : level >= 2 && Math.random() < 0.2 ? 'multiple' : null
  return search<[number, number]>(
    () => ordered(rand(min, max), rand(min, max)),
    ([a, b]) => {
      if (a === b) return false
      if (special === 'coprime') return gcd(a, b) === 1
      if (special === 'multiple') return b % a === 0
      return gcd(a, b) > 1 && b % a !== 0
    },
    [min, min * 2 - (min % 2)] // pasangan genap berurutan-ganda: selalu punya faktor bersama
  )
}

/** KPK: pilih pasangan yang kelipatan bersamanya muncul dalam 8 kelipatan pertama. */
const lcmQuestion: Generator = (level) => {
  const [min, max] = atLevel<Range>([[2, 8], [3, 10], [6, 15]], level)
  return search<[number, number]>(
    () => ordered(rand(min, max), rand(min, max)),
    ([a, b]) => {
      if (a === b || b % a === 0) return false
      const common = lcm(a, b)
      return common / a <= 8 && common / b <= 8
    },
    [min, min + 1]
  )
}

export const generators: Record<Activity, Generator> = {
  addition,
  subtraction,
  multiplication,
  division,
  'factor-tree': factorTree,
  prime,
  gcd: gcdQuestion,
  lcm: lcmQuestion,
}

export function gcd(a: number, b: number) {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) [x, y] = [y, x % y]
  return x
}

export const lcm = (a: number, b: number) => (a * b) / gcd(a, b)

export function isPrime(n: number) {
  if (n < 2) return false
  for (let candidate = 2; candidate * candidate <= n; candidate += 1) {
    if (n % candidate === 0) return false
  }
  return true
}

export function listFactors(n: number) {
  return Array.from({ length: n }, (_, index) => index + 1).filter((value) => n % value === 0)
}

/** Faktor prima dari kecil ke besar, faktor yang sama diulang (12 -> 2, 2, 3). */
export function primeFactors(n: number) {
  const result: number[] = []
  let remaining = n
  for (let candidate = 2; candidate * candidate <= remaining; candidate += 1) {
    while (remaining % candidate === 0) {
      result.push(candidate)
      remaining /= candidate
    }
  }
  if (remaining > 1) result.push(remaining)
  return result
}

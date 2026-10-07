import { gcd, isPrime, lcm, primeFactors } from './numbers'
import type { Question } from './types'

/** Teks soal + jawaban benarnya, untuk ringkasan hasil sesi dan laporan. Dihitung dari angka soal, bukan dari langkah. */
export function questionSummary(question: Question): { label: string; answer: string } {
  const { a, b, number: n, other } = question
  switch (question.activity) {
    case 'addition':
      return { label: `${a} + ${b}`, answer: String(a! + b!) }
    case 'subtraction':
      return { label: `${a} − ${b}`, answer: String(a! - b!) }
    case 'multiplication':
      return { label: `${a} × ${b}`, answer: String(a! * b!) }
    case 'division': {
      const rest = a! % b!
      return { label: `${a} ÷ ${b}`, answer: `${Math.floor(a! / b!)}${rest ? `, sisa ${rest}` : ''}` }
    }
    case 'factor-tree':
      return { label: `Pohon faktor ${n}`, answer: primeFactors(n!).join(' × ') }
    case 'prime':
      return { label: `Apakah ${n} prima?`, answer: isPrime(n!) ? 'Ya, prima' : 'Bukan prima' }
    case 'gcd':
      return { label: `FPB ${n} dan ${other}`, answer: String(gcd(n!, other!)) }
    case 'lcm':
      return { label: `KPK ${n} dan ${other}`, answer: String(lcm(n!, other!)) }
  }
}

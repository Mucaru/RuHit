export type Activity = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'factor-tree' | 'prime' | 'gcd' | 'lcm'

export type Choice = { value: string; label: string; helper?: string }

export type Step = {
  id: string
  kind: string
  prompt: string
  expected: string
  hint: string
  coach: string
  meta?: Record<string, any>
  choices?: Choice[]
}

export type Question = {
  id: string
  activity: Activity
  title: string
  eyebrow: string
  a?: number
  b?: number
  number?: number
  other?: number
  visual: 'addition' | 'subtraction' | 'multiplication' | 'division' | 'tree' | 'concept'
  steps: Step[]
}

const activityTitles: Record<Activity, string> = {
  addition: 'Penjumlahan bersusun',
  subtraction: 'Pengurangan bersusun',
  multiplication: 'Perkalian bersusun',
  division: 'Pembagian bersusun',
  'factor-tree': 'Pohon faktor',
  prime: 'Bilangan prima',
  gcd: 'FPB',
  lcm: 'KPK',
}

const placeNames = ['satuan', 'puluhan', 'ratusan', 'ribuan']
const digit = (value: number, position: number) => Math.floor(value / 10 ** position) % 10
const digits = (value: number, width = String(value).length) => String(value).padStart(width, '0').split('').map(Number)

function step(kind: string, prompt: string, expected: number | string, hint: string, coach: string, meta: Record<string, any> = {}, choices?: Choice[]): Step {
  return { id: `${kind}-${Math.random().toString(36).slice(2, 8)}`, kind, prompt, expected: String(expected), hint, coach, meta, choices }
}

function makeAddition(a: number, b: number): Question {
  const width = Math.max(String(a).length, String(b).length)
  const steps: Step[] = []
  let carry = 0
  let stepIndex = 0
  for (let position = width - 1; position >= 0; position -= 1) {
    const top = digit(a, width - 1 - position)
    const bottom = digit(b, width - 1 - position)
    const place = placeNames[width - 1 - position]
    const raw = top + bottom + carry
    steps.push(step('add-column', `Jumlahkan kolom ${place}: ${top} + ${bottom}${carry ? ` + ${carry} yang disimpan` : ''} = ...`, raw, `Lihat dua angka di kolom ${place}.`, `Jumlah kolom ini ${raw}. Jangan lupa angka yang disimpan dari kanan.`, { position, top, bottom, carryIn: carry, place, width }, undefined))
    steps.push(step('add-write', `Angka berapa yang ditulis di kolom ${place}?`, raw % 10, `Kalau hasilnya dua digit, tulis angka satuannya di bawah.`, `Tulis angka satuan dari ${raw}, yaitu ${raw % 10}.`, { position, place, raw, width }))
    carry = Math.floor(raw / 10)
    if (carry > 0) steps.push(step('add-carry', `Simpan angka berapa untuk kolom di sebelah kiri?`, carry, `Angka yang disimpan adalah bagian puluhan dari ${raw}.`, `Simpan ${carry} di kotak kecil di atas kolom berikutnya.`, { position, carry, width }))
    stepIndex += 1
  }
  steps.push(step('final', `Sekarang baca hasil ${a} + ${b} dari kiri ke kanan.`, a + b, 'Baca semua angka jawaban, termasuk simpanan paling kiri.', `Benar! ${a} + ${b} = ${a + b}.`, { width, answer: a + b }))
  return { id: `addition-${a}-${b}-${stepIndex}`, activity: 'addition', title: activityTitles.addition, eyebrow: 'TULIS DARI KANAN KE KIRI', a, b, visual: 'addition', steps }
}

function makeSubtraction(a: number, b: number): Question {
  const width = Math.max(String(a).length, String(b).length)
  const topDigits = digits(a, width)
  const bottomDigits = digits(b, width)
  const working = [...topDigits]
  const steps: Step[] = []
  let stepIndex = 0
  for (let position = width - 1; position >= 0; position -= 1) {
    const place = placeNames[width - 1 - position]
    if (working[position] < bottomDigits[position]) {
      let donor = position - 1
      while (donor >= 0 && working[donor] === 0) donor -= 1
      if (donor >= 0) {
        for (let cursor = donor; cursor < position; cursor += 1) {
          working[cursor] -= 1
          working[cursor + 1] += 10
          steps.push(step('borrow', `Pinjam 1 dari kolom ${placeNames[width - 1 - cursor]}. Angka itu sekarang menjadi ...`, working[cursor], `Cari angka di sebelah kiri yang masih bisa memberi pinjaman.`, `${placeNames[width - 1 - cursor]} berkurang 1 menjadi ${working[cursor]}.`, { position, cursor, board: [...working], width, place }))
        }
        steps.push(step('borrow-receive', `Setelah menerima pinjaman, angka di kolom ${place} menjadi ...`, working[position], `Satu puluhan bernilai 10 satuan.`, `Kolom ${place} sekarang bernilai ${working[position]}.`, { position, board: [...working], width, place }))
      }
    }
    const result = working[position] - bottomDigits[position]
    steps.push(step('subtract-column', `${working[position]} − ${bottomDigits[position]} = ...`, result, `Kurangkan angka atas setelah proses pinjam.`, `Betul, ${working[position]} − ${bottomDigits[position]} = ${result}.`, { position, top: working[position], bottom: bottomDigits[position], result, board: [...working], width, place }))
    stepIndex += 1
  }
  steps.push(step('final', `Sekarang baca hasil ${a} − ${b} dari kiri ke kanan.`, a - b, 'Susun kembali angka hasil setiap kolom.', `Benar! ${a} − ${b} = ${a - b}.`, { width, answer: a - b }))
  return { id: `subtraction-${a}-${b}-${stepIndex}`, activity: 'subtraction', title: activityTitles.subtraction, eyebrow: 'PINJAM DENGAN TENANG', a, b, visual: 'subtraction', steps }
}

function makeMultiplication(a: number, b: number): Question {
  const aDigits = String(a).split('').reverse().map(Number)
  const bDigits = String(b).split('').reverse().map(Number)
  const steps: Step[] = []
  const partials: number[] = []
  let sequence = 0
  for (let row = 0; row < bDigits.length; row += 1) {
    const multiplier = bDigits[row]
    const placeValue = 10 ** row
    let carry = 0
    if (row > 0) steps.push(step('place-value', `Angka ${multiplier} berada di kolom ${placeNames[row]}. Nilainya adalah ...`, multiplier * placeValue, `Lihat posisi angka ${multiplier} di bilangan ${b}.`, `${multiplier} pada tempat ${placeNames[row]} bernilai ${multiplier * placeValue}.`, { row, multiplier, placeValue }))
    for (let column = 0; column < aDigits.length; column += 1) {
      const raw = aDigits[column] * multiplier + carry
      steps.push(step('multiply-column', `${aDigits[column]} × ${multiplier}${carry ? ` + ${carry} yang disimpan` : ''} = ...`, raw, `Mulai dari kolom ${placeNames[column]} pada ${a}.`, `Kalikan dulu, lalu tambahkan ${carry ? `simpanan ${carry}` : 'tanpa simpanan'}.`, { row, column, raw, carryIn: carry, multiplier, placeValue, width: String(a).length }))
      steps.push(step('multiply-write', `Angka satuan dari ${raw} yang ditulis adalah ...`, raw % 10, `Yang ditulis di kolom ini adalah angka satuannya.`, `Tulis ${raw % 10}.`, { row, column, raw, placeValue, width: String(a).length }))
      carry = Math.floor(raw / 10)
      if (carry > 0 && column < aDigits.length - 1) steps.push(step('multiply-carry', `Simpan angka berapa untuk perkalian berikutnya?`, carry, `Ambil bagian puluhan dari ${raw}.`, `Simpan ${carry} di atas kolom berikutnya.`, { row, column, carry, placeValue, width: String(a).length }))
      sequence += 1
    }
    if (carry > 0) steps.push(step('multiply-carry-final', `Angka simpanan terakhir ditulis paling kiri di baris ini. Angkanya adalah ...`, carry, 'Ambil angka puluhan dari hasil kali kolom terakhir.', `Tulis ${carry} di paling kiri baris ini.`, { row, carry, placeValue, width: String(a).length }))
    const partial = a * multiplier * placeValue
    partials.push(partial)
    steps.push(step('partial', `Hasil kali parsial baris ini adalah ...`, partial, row === 0 ? 'Baca hasil perkalian pertama dari kanan ke kiri.' : 'Baris kedua bergeser satu tempat ke kiri.', `Hasil baris ini ${partial}.`, { row, partial, placeValue, width: String(a).length }))
  }
  if (partials.length > 1) steps.push(step('partial-sum', `Jumlahkan hasil parsial ${partials.join(' + ')} = ...`, a * b, 'Pastikan angka nol pada baris puluhan tetap sejajar.', `Hasil parsial jika dijumlahkan menjadi ${a * b}.`, { partials, width: String(a).length + String(b).length }))
  steps.push(step('final', `Tulis hasil akhir ${a} × ${b}.`, a * b, 'Periksa kembali semua baris sebelum menulis jawaban akhir.', `Hebat! ${a} × ${b} = ${a * b}.`, { answer: a * b }))
  return { id: `multiplication-${a}-${b}-${sequence}`, activity: 'multiplication', title: activityTitles.multiplication, eyebrow: 'KALIKAN PER KOLOM', a, b, visual: 'multiplication', steps }
}

function makeDivision(dividend: number, divisor: number): Question {
  const digitsOfDividend = String(dividend).split('').map(Number)
  const steps: Step[] = []
  let remainder = 0
  let quotient = ''
  let active = false
  let sequence = 0
  for (let index = 0; index < digitsOfDividend.length; index += 1) {
    const current = remainder * 10 + digitsOfDividend[index]
    if (!active && current < divisor && index < digitsOfDividend.length - 1) {
      remainder = current
      continue
    }
    active = true
    const qDigit = Math.floor(current / divisor)
    const product = divisor * qDigit
    steps.push(step('divide', `${current} ÷ ${divisor} = ...`, qDigit, quotient === '' && index > 0 ? `Angka ${digitsOfDividend.slice(0, index).join('')} masih terlalu kecil untuk dibagi ${divisor}, jadi kita ambil ${current}.` : `Cari kelipatan ${divisor} yang paling dekat dengan ${current}.`, `${divisor} masuk ke ${current} sebanyak ${qDigit} kali.`, { current, divisor, qDigit, index, quotient: `${quotient}${qDigit}`, remainder }))
    quotient += String(qDigit)
    steps.push(step('multiply-back', `${divisor} × ${qDigit} = ...`, product, 'Kalikan balik pembagi dengan angka hasil bagi.', `${divisor} × ${qDigit} = ${product}.`, { current, divisor, qDigit, product, index, quotient }))
    remainder = current - product
    steps.push(step('subtract', `${current} − ${product} = ...`, remainder, 'Kurangkan hasil kali balik dari angka yang sedang dibagi.', `Sisa sementara adalah ${remainder}.`, { current, product, remainder, index, quotient }))
    if (index < digitsOfDividend.length - 1) {
      const next = digitsOfDividend[index + 1]
      const brought = remainder * 10 + next
      steps.push(step('bring-down', `Turunkan angka ${next}. Angka baru yang terbentuk adalah ...`, brought, `Letakkan ${next} di sebelah kanan sisa ${remainder}.`, `Sisa ${remainder} dan angka ${next} membentuk ${brought}.`, { remainder, next, brought, index, quotient }))
    }
    sequence += 1
  }
  const qNumber = Number(quotient || '0')
  steps.push(step('division-final', `Hasil bagi dari ${dividend} ÷ ${divisor} adalah ...`, qNumber, 'Baca semua angka hasil bagi dari kiri ke kanan.', `Hasil baginya ${qNumber}.`, { quotient: qNumber, remainder, dividend, divisor }))
  if (remainder !== 0) steps.push(step('remainder-final', `Sisa pembagian ${dividend} ÷ ${divisor} adalah ...`, remainder, 'Sisa harus lebih kecil daripada pembagi.', `Sisanya ${remainder}, dan ${remainder} lebih kecil dari ${divisor}.`, { quotient: qNumber, remainder, divisor }))
  return { id: `division-${dividend}-${divisor}-${sequence}`, activity: 'division', title: activityTitles.division, eyebrow: 'BAGI · KALI · KURANGI · TURUNKAN', a: dividend, b: divisor, visual: 'division', steps }
}

export function listFactors(n: number) {
  return Array.from({ length: n }, (_, index) => index + 1).filter((value) => n % value === 0)
}

export function isPrime(n: number) {
  if (n < 2) return false
  for (let candidate = 2; candidate * candidate <= n; candidate += 1) if (n % candidate === 0) return false
  return true
}

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

function makeFactorTree(n: number): Question {
  const factors = primeFactors(n)
  const steps: Step[] = []
  let current = n
  factors.slice(0, -1).forEach((factor, index) => {
    const next = current / factor
    steps.push(step('tree-factor', `Pilih prima terkecil yang dapat membagi ${current}.`, factor, 'Coba dari 2, lalu 3, 5, dan 7.', `${factor} adalah prima terkecil yang membagi ${current}.`, { current, factor, next, index }, [2, 3, 5, 7].map((value) => ({ value: String(value), label: String(value), helper: isPrime(value) ? 'bilangan prima' : '' }))))
    steps.push(step('tree-quotient', `Lengkapi cabang: ${current} ÷ ${factor} = ...`, next, `Gunakan angka prima yang baru kamu pilih sebagai pembagi.`, `${current} ÷ ${factor} = ${next}.`, { current, factor, next, index }))
    current = next
  })
  steps.push(step('tree-final', `Tulis semua daun prima dari pohon faktor ${n}, pisahkan dengan koma.`, factors.join(', '), 'Tulis semua daun prima. Faktor yang sama ditulis berulang, urutannya boleh bebas.', `${n} = ${factors.join(' × ')}.`, { factors }))
  return { id: `tree-${n}`, activity: 'factor-tree', title: activityTitles['factor-tree'], eyebrow: 'PECAH SAMPAI TINGGAL PRIMA', number: n, visual: 'tree', steps }
}

function makePrime(n: number): Question {
  const answer = isPrime(n) ? 'ya' : 'tidak'
  const factors = listFactors(n)
  return {
    id: `prime-${n}`,
    activity: 'prime',
    title: activityTitles.prime,
    eyebrow: 'CEK DUA FAKTOR SAJA',
    number: n,
    visual: 'concept',
    steps: [
      step('prime-check', `Apakah ${n} termasuk bilangan prima?`, answer, 'Bilangan prima hanya punya dua faktor: 1 dan dirinya sendiri.', answer === 'ya' ? `${n} hanya punya faktor 1 dan ${n}.` : `${n} punya faktor lain, yaitu ${factors.slice(1, -1).join(', ')}.`, { factors }, [
        { value: 'ya', label: 'Ya, prima', helper: 'hanya 1 dan dirinya' },
        { value: 'tidak', label: 'Bukan prima', helper: 'punya faktor lain' },
      ]),
      step('prime-explain', `Tulis jumlah faktor dari ${n}.`, factors.length, 'Hitung semua angka yang dapat membagi habis.', `${n} punya ${factors.length} faktor.`, { factors }),
    ],
  }
}

function makeSetQuestion(activity: 'gcd' | 'lcm', a: number, b: number): Question {
  const factorA = listFactors(a)
  const factorB = listFactors(b)
  const common = activity === 'gcd' ? factorA.filter((value) => factorB.includes(value)) : []
  const answer = activity === 'gcd' ? Math.max(...common) : Math.abs((a * b) / gcd(a, b))
  const multiples = (n: number) => Array.from({ length: 8 }, (_, index) => n * (index + 1))
  const listA = activity === 'gcd' ? factorA : multiples(a)
  const listB = activity === 'gcd' ? factorB : multiples(b)
  const shared = activity === 'gcd' ? common : multiples(a).filter((value) => multiples(b).includes(value))
  return {
    id: `${activity}-${a}-${b}`,
    activity,
    title: activityTitles[activity],
    eyebrow: activity === 'gcd' ? 'CARI FAKTOR BERSAMA' : 'CARI KELIPATAN BERSAMA',
    number: a,
    other: b,
    visual: 'concept',
    steps: [
      step(activity === 'gcd' ? 'set-a' : 'multiple-a', `${activity === 'gcd' ? 'Tuliskan semua faktor' : 'Tuliskan 8 kelipatan pertama'} dari ${a}, pisahkan dengan koma.`, listA.join(', '), activity === 'gcd' ? 'Cari angka yang membagi habis tanpa sisa.' : 'Kalikan bilangan dengan 1, 2, 3, dan seterusnya.', `${activity === 'gcd' ? 'Faktor' : 'Kelipatan'} ${a}: ${listA.join(', ')}.`, { list: listA }),
      step(activity === 'gcd' ? 'set-b' : 'multiple-b', `${activity === 'gcd' ? 'Tuliskan semua faktor' : 'Tuliskan 8 kelipatan pertama'} dari ${b}, pisahkan dengan koma.`, listB.join(', '), activity === 'gcd' ? 'Gunakan cara yang sama untuk bilangan kedua.' : 'Lanjutkan daftar hingga menemukan angka yang sama.', `${activity === 'gcd' ? 'Faktor' : 'Kelipatan'} ${b}: ${listB.join(', ')}.`, { list: listB }),
      step('set-final', `${activity === 'gcd' ? 'Faktor bersama terbesar' : 'Kelipatan bersama terkecil'} dari ${a} dan ${b} adalah ...`, answer, activity === 'gcd' ? `Faktor bersamanya adalah ${shared.join(', ')}.` : `Kelipatan bersama pertama yang terlihat adalah ${shared[0]}.`, `${activity === 'gcd' ? 'FPB' : 'KPK'} dari ${a} dan ${b} = ${answer}.`, { answer, shared }),
    ],
  }
}

export function gcd(a: number, b: number) {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) [x, y] = [y, x % y]
  return x
}

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const at = <T>(list: T[], level: number) => list[Math.min(Math.max(level, 1), list.length) - 1]
const addCarries = (x: number, y: number) => { let carry = 0, count = 0; while (x > 0 || y > 0 || carry > 0) { carry = (x % 10) + (y % 10) + carry >= 10 ? 1 : 0; count += carry; x = Math.floor(x / 10); y = Math.floor(y / 10) } return count }
const borrows = (x: number, y: number) => { let borrow = 0, count = 0; while (x > 0 || y > 0) { borrow = (x % 10) - borrow - (y % 10) < 0 ? 1 : 0; count += borrow; x = Math.floor(x / 10); y = Math.floor(y / 10) } return count }
const noZero = (n: number) => !String(n).includes('0')
const smooth = (n: number) => primeFactors(n).every((f) => f <= 7)
const lcm = (x: number, y: number) => (x * y) / gcd(x, y)

type Pair = [number, number?]
const generators: Record<Activity, (level: number) => Pair> = {
  addition: (level) => {
    const [min, max] = at([[11, 49], [25, 99], [120, 899], [1100, 4999]], level)
    let pair: Pair = [min, max]
    for (let i = 0; i < 300; i += 1) {
      const a = rand(min, max), b = rand(min, max), carries = addCarries(a, b)
      pair = [a, b]
      if (level === 1 ? carries === 0 : carries >= Math.min(level, 2)) break
    }
    return pair
  },
  subtraction: (level) => {
    const [min, max] = at([[20, 99], [20, 99], [200, 999], [1000, 9999]], level)
    let pair: Pair = [max, min]
    for (let i = 0; i < 300; i += 1) {
      const x = rand(min, max), y = rand(min, max)
      if (x === y) continue
      const [a, b] = x > y ? [x, y] : [y, x]
      pair = [a, b]
      const count = borrows(a, b)
      if (level === 1 ? count === 0 : count >= (level === 4 ? 2 : 1)) break
    }
    return pair
  },
  multiplication: (level) => {
    const [aMin, aMax, bMin, bMax] = at([[12, 49, 2, 9], [112, 499, 2, 9], [12, 49, 12, 29], [112, 399, 12, 39]], level)
    let pair: Pair = [aMin, bMin]
    for (let i = 0; i < 300; i += 1) {
      pair = [rand(aMin, aMax), rand(bMin, bMax)]
      if (noZero(pair[0]) && noZero(pair[1]!)) break
    }
    return pair
  },
  division: (level) => {
    if (level <= 2) {
      const divisor = rand(2, 9)
      const [lo, hi] = level === 1 ? [10, 99] : [100, 999]
      return [divisor * rand(Math.ceil(lo / divisor), Math.floor(hi / divisor)), divisor]
    }
    const [lo, hi, dMin, dMax] = level === 3 ? [100, 999, 2, 9] : [200, 999, 11, 25]
    // ~30% soal habis dibagi, supaya anak tidak mengira pembagian selalu ada sisa
    if (Math.random() < 0.3) {
      const exactDivisor = rand(dMin, dMax)
      return [exactDivisor * rand(Math.ceil(lo / exactDivisor), Math.floor(hi / exactDivisor)), exactDivisor]
    }
    let pair: Pair = [lo + 1, dMin]
    for (let i = 0; i < 300; i += 1) {
      const divisor = rand(dMin, dMax), dividend = rand(lo, hi)
      pair = [dividend, divisor]
      if (dividend % divisor !== 0) break
    }
    return pair
  },
  'factor-tree': (level) => {
    const [min, max] = at([[12, 30], [32, 60], [60, 100], [100, 150]], level)
    let n = min
    for (let i = 0; i < 300; i += 1) { n = rand(min, max); if (!isPrime(n) && smooth(n)) break }
    return [n]
  },
  prime: (level) => {
    const [min, max] = at([[11, 29], [30, 59], [60, 99]], level)
    const wantPrime = Math.random() < 0.5
    let n = min
    for (let i = 0; i < 300; i += 1) { n = rand(min, max); if (isPrime(n) === wantPrime && (level === 1 || n % 2 === 1)) break }
    return [n]
  },
  gcd: (level) => {
    const [min, max] = at([[6, 24], [12, 36], [24, 60]], level)
    let pair: Pair = [min, min * 2]
    // variasi kasus khusus: pasangan berkelipatan (level 2+) dan pasangan tanpa faktor bersama selain 1 (level 3)
    const special: 'multiple' | 'coprime' | null = level >= 3 && Math.random() < 0.2 ? 'coprime' : level >= 2 && Math.random() < 0.2 ? 'multiple' : null
    for (let i = 0; i < 300; i += 1) {
      const x = rand(min, max), y = rand(min, max)
      if (x === y) continue
      const [a, b] = x < y ? [x, y] : [y, x]
      pair = [a, b]
      const common = gcd(a, b)
      if (special === 'coprime' ? common === 1 : special === 'multiple' ? b % a === 0 : common > 1 && b % a !== 0) break
    }
    return pair
  },
  lcm: (level) => {
    const [min, max] = at([[2, 8], [3, 10], [6, 15]], level)
    let pair: Pair = [min, min + 1]
    for (let i = 0; i < 300; i += 1) {
      const x = rand(min, max), y = rand(min, max)
      if (x === y) continue
      const [a, b] = x < y ? [x, y] : [y, x]
      pair = [a, b]
      const common = lcm(a, b)
      if (b % a !== 0 && common / a <= 8 && common / b <= 8) break
    }
    return pair
  },
}

function build(activity: Activity, [a, b]: Pair): Question {
  if (activity === 'addition') return makeAddition(a, b!)
  if (activity === 'subtraction') return makeSubtraction(a, b!)
  if (activity === 'multiplication') return makeMultiplication(a, b!)
  if (activity === 'division') return makeDivision(a, b!)
  if (activity === 'factor-tree') return makeFactorTree(a)
  if (activity === 'prime') return makePrime(a)
  return makeSetQuestion(activity, a, b!)
}

/** Buat satu sesi soal acak sesuai level, tanpa soal kembar. */
export function makeSession(activity: Activity, level: number, size: number): Question[] {
  const seen = new Set<string>()
  const session: Question[] = []
  let guard = 0
  while (session.length < size) {
    const pair = generators[activity](level)
    const key = `${pair[0]}-${pair[1] ?? ''}`
    guard += 1
    if (seen.has(key) && guard < size * 60) continue
    seen.add(key)
    session.push(build(activity, pair))
  }
  return session
}

export const LIST_KINDS = ['tree-final', 'set-a', 'set-b', 'multiple-a', 'multiple-b']
export const normalizeList = (value: string) => value.split(/[\s,;×x]+/).filter(Boolean).map(Number).sort((x, y) => x - y).join(',')
export const normalizeText = (value: string) => value.trim().toLowerCase()
const isWholeNumber = (value: string) => /^-?\d+$/.test(value.trim())
export const stepMatches = (current: Step, value: string) => {
  if (LIST_KINDS.includes(current.kind)) return normalizeList(value) === normalizeList(current.expected)
  // Angka: "07" dianggap 7, tapi "1 2" bukan 12 (spasi di dalam angka = salah)
  if (isWholeNumber(current.expected)) return isWholeNumber(value) && Number(value) === Number(current.expected)
  return normalizeText(value) === normalizeText(current.expected)
}

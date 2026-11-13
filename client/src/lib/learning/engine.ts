import type { LearningQuestion, QuestionParams, VisualKind } from './types'
import { NEW_FRACTION_TYPES, STRICT_FRACTION_TYPES, extraAnswer, fractionBuilders, sameFractionValue } from './fractions'

export const CLASS_FIVE_QUESTION_TYPES = [
  'whole-place-value', 'whole-compose', 'whole-compare', 'whole-order', 'whole-add', 'whole-subtract', 'whole-multiply', 'whole-divide', 'money-change',
  'factor-list', 'prime-check', 'gcd', 'lcm',
  'fraction-compare', 'fraction-order', 'fraction-equivalent', 'fraction-simplify', 'fraction-add-same', 'fraction-add-different', 'fraction-subtract-different', 'fraction-multiply-whole', 'fraction-divide-whole', 'fraction-of-quantity', 'fraction-to-decimal',
  ...NEW_FRACTION_TYPES,
  'decimal-compare', 'decimal-order', 'decimal-place', 'decimal-add', 'decimal-subtract', 'decimal-to-fraction', 'fraction-percent', 'percent-of-number',
  'ratio-simplify', 'unit-rate', 'proportion', 'pattern-multiplicative', 'missing-multiply-divide',
  'perimeter-square', 'perimeter-rectangle', 'perimeter-triangle', 'area-square', 'area-rectangle', 'area-triangle', 'area-composite', 'angle-measure', 'duration-calculate',
  'volume-unit-cubes', 'solid-properties', 'grid-location', 'table-frequency', 'bar-chart-read', 'pictogram-read',
] as const

export type ClassFiveQuestionType = (typeof CLASS_FIVE_QUESTION_TYPES)[number]

type Build = { params: QuestionParams; prompt: string; expected: string; explanation: string; hints: [string, string, string]; misconception: string; visual: VisualKind; choices?: string[] }
type Builder = (rng: () => number, grade: number) => Build

const integer = (rng: () => number, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))
const pick = <T,>(rng: () => number, values: T[]) => values[integer(rng, 0, values.length - 1)]
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b)
const fraction = (n: number, d: number) => `${n}/${d}`
const simplify = (n: number, d: number) => { const g = gcd(n, d); const a = n / g; const b = d / g; return b === 1 ? String(a) : fraction(a, b) }
const decimal = (n: number) => (n / 10).toFixed(1).replace('.', ',')
const factors = (n: number) => Array.from({ length: n }, (_, i) => i + 1).filter((v) => n % v === 0)
const isPrime = (n: number) => n > 1 && factors(n).length === 2
const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b)
const choice = (correct: string, distractors: string[]) => [correct, ...distractors.filter((item) => item !== correct)].slice(0, 3)
const shuffled = (rng: () => number, values: string[]) => [...values].sort(() => rng() - 0.5)

const build: Record<string, Builder> = {
  'whole-place-value': (rng, grade) => {
    const value = integer(rng, grade <= 2 ? 10 : grade <= 4 ? 1000 : 100000, grade <= 2 ? 99 : grade <= 4 ? 9999 : 999999)
    const digits = String(value)
    const position = integer(rng, 0, digits.length - 1)
    const place = 10 ** position
    const answer = Math.floor(value / place) % 10 * place
    return { params: { value, position }, prompt: `Pada bilangan ${value.toLocaleString('id-ID')}, berapa nilai angka ${digits[digits.length - 1 - position]}?`, expected: String(answer), explanation: `Angka itu berada di tempat ${place.toLocaleString('id-ID')}, jadi nilainya ${answer.toLocaleString('id-ID')}.`, hints: ['Cari posisi angka dari kanan.', 'Urutannya satuan, puluhan, ratusan, ribuan, dan seterusnya.', 'Kalikan angka tersebut dengan nilai tempatnya.'], misconception: 'Menyebut digitnya saja, bukan nilai digit berdasarkan tempat.', visual: 'place-value' }
  },
  'whole-compose': (rng, grade) => {
    const thousands = grade >= 5 ? integer(rng, 1, 8) : 0
    const hundreds = integer(rng, 0, 9)
    const tens = integer(rng, 0, 9)
    let ones = integer(rng, 0, 9)
    if (thousands === 0 && hundreds === 0 && tens === 0 && ones === 0) ones = integer(rng, 1, 9)
    const value = thousands * 1000 + hundreds * 100 + tens * 10 + ones
    const clean = value
    return { params: { thousands, hundreds, tens, ones, value: clean }, prompt: `Susun bilangan dari ${thousands ? `${thousands} ribuan, ` : ''}${hundreds} ratusan, ${tens} puluhan, dan ${ones} satuan.`, expected: String(clean), explanation: 'Gabungkan nilai setiap tempat dari kiri ke kanan.', hints: ['Tuliskan nilai tiap tempat.', 'Ribuan diikuti ratusan, puluhan, lalu satuan.', 'Jumlahkan semua nilai tempat.'], misconception: 'Menggabungkan digit tanpa mempertahankan posisi tempat.', visual: 'place-value' }
  },
  'whole-compare': (rng, grade) => {
    const max = grade <= 2 ? 20 : grade <= 4 ? 10000 : 100000
    const a = integer(rng, 10, max)
    let b = integer(rng, 10, max)
    while (a === b) b = integer(rng, 10, max)
    const answer = a > b ? 'A' : 'B'
    return { params: { a, b }, prompt: `Bilangan mana yang lebih besar? A: ${a.toLocaleString('id-ID')} atau B: ${b.toLocaleString('id-ID')}?`, expected: answer, explanation: `${Math.max(a, b).toLocaleString('id-ID')} lebih besar.`, hints: ['Bandingkan banyak digit terlebih dahulu.', 'Jika digitnya sama banyak, bandingkan dari tempat terbesar.', 'Pilih A jika angka pertama lebih besar, selain itu pilih B.'], misconception: 'Membandingkan digit paling kanan sebelum nilai tempat yang lebih besar.', visual: 'place-value', choices: ['A', 'B'] }
  },
  'whole-order': (rng, grade) => {
    const max = grade <= 2 ? 20 : grade <= 4 ? 10000 : 100000
    const values = [integer(rng, 10, max), integer(rng, 10, max), integer(rng, 10, max)]
    while (new Set(values).size < 3) values[2] = integer(rng, 10, max)
    const sorted = [...values].sort((a, b) => a - b)
    const expected = sorted.join(' – ')
    return { params: { values }, prompt: `Urutkan dari yang terkecil: ${values.join(', ')}.`, expected, explanation: `Urutan yang benar: ${expected}.`, hints: ['Perhatikan jumlah digit.', 'Bandingkan nilai tempat dari kiri.', 'Susun dari nilai paling kecil ke paling besar.'], misconception: 'Mengurutkan dari digit terakhir atau menebak berdasarkan panjang tulisan.', visual: 'number-line', choices: [expected, values.join(' – '), [...sorted].reverse().join(' – ')] }
  },
  'whole-add': (rng, grade) => {
    const max = grade <= 2 ? 20 : grade <= 4 ? 1000 : 99999
    const a = integer(rng, 10, max); const b = integer(rng, 10, max)
    return { params: { a, b }, prompt: `Hitung ${a.toLocaleString('id-ID')} + ${b.toLocaleString('id-ID')}.`, expected: String(a + b), explanation: `${a.toLocaleString('id-ID')} + ${b.toLocaleString('id-ID')} = ${(a + b).toLocaleString('id-ID')}.`, hints: ['Sejajarkan satuan dengan satuan.', 'Kerjakan dari kanan ke kiri dan perhatikan simpanan.', 'Jumlahkan kedua bilangan sesuai nilai tempat.'], misconception: 'Salah menaruh angka simpanan pada kolom yang tepat.', visual: 'place-value' }
  },
  'whole-subtract': (rng, grade) => {
    const max = grade <= 2 ? 20 : grade <= 4 ? 1000 : 99999
    const a = integer(rng, 20, max); const b = integer(rng, 1, a)
    return { params: { a, b }, prompt: `Hitung ${a.toLocaleString('id-ID')} − ${b.toLocaleString('id-ID')}.`, expected: String(a - b), explanation: `${a.toLocaleString('id-ID')} dikurangi ${b.toLocaleString('id-ID')} sama dengan ${(a - b).toLocaleString('id-ID')}.`, hints: ['Sejajarkan angka berdasarkan nilai tempat.', 'Jika angka atas lebih kecil, pinjam dari kolom di sebelah kiri.', 'Kurangkan dari kanan ke kiri.'], misconception: 'Meminjam tanpa mengurangi nilai kolom asal atau lupa mengubah angka.', visual: 'place-value' }
  },
  'whole-multiply': (rng, grade) => {
    const a = integer(rng, 12, grade >= 5 ? 999 : 99); const b = integer(rng, 2, 12)
    return { params: { a, b }, prompt: `Hitung ${a.toLocaleString('id-ID')} × ${b}.`, expected: String(a * b), explanation: `${a.toLocaleString('id-ID')} dikali ${b} sama dengan ${(a * b).toLocaleString('id-ID')}.`, hints: ['Pikirkan sebagai penjumlahan berulang.', 'Kalikan mulai dari satuan.', 'Perhatikan nilai tempat dan simpanan.'], misconception: 'Mengalikan digit satu per satu tetapi lupa menyimpan hasil puluhan.', visual: 'place-value' }
  },
  'whole-divide': (rng, grade) => {
    const divisor = integer(rng, 2, 12); const quotient = integer(rng, 10, grade >= 5 ? 999 : 99); const dividend = divisor * quotient
    return { params: { dividend, divisor }, prompt: `Hitung ${dividend.toLocaleString('id-ID')} ÷ ${divisor}.`, expected: String(quotient), explanation: `${dividend.toLocaleString('id-ID')} dibagi ${divisor} sama dengan ${quotient}.`, hints: ['Pikirkan perkalian yang hasilnya sama dengan bilangan yang dibagi.', 'Tentukan berapa kelompok berisi pembagi.', 'Kalikan hasil bagi dengan pembagi untuk memeriksa.'], misconception: 'Mencampur angka hasil bagi dengan sisa atau melewatkan nol pada hasil bagi.', visual: 'place-value' }
  },
  'money-change': (rng) => {
    const price = integer(rng, 10, 100) * 1000; const paid = Math.ceil(price / 10000) * 10000 + integer(rng, 0, 3) * 10000
    return { params: { price, paid }, prompt: `Di pasar, harga 1 kg jeruk Rp${price.toLocaleString('id-ID')}. Kamu membayar Rp${paid.toLocaleString('id-ID')}. Berapa kembaliannya?`, expected: String(Math.max(0, paid - price)), explanation: `Kembalian = uang dibayar − harga = Rp${(paid - price).toLocaleString('id-ID')}.`, hints: ['Cari selisih uang yang dibayar dan harga.', 'Kurangi harga dari uang pembayaran.', 'Kembalian adalah uang dibayar dikurangi harga.'], misconception: 'Mengurangi uang yang dibayar dari harga, sehingga urutannya terbalik.', visual: 'blocks' }
  },
  'factor-list': (rng) => {
    const n = integer(rng, 12, 48)
    const answer = factors(n).join(', ')
    return { params: { n }, prompt: `Tuliskan semua faktor dari ${n}, urut dari kecil. Pisahkan dengan koma.`, expected: answer, explanation: `Faktor ${n} adalah bilangan yang membagi ${n} tanpa sisa: ${answer}.`, hints: ['Coba bagi dengan 1, 2, 3, dan seterusnya.', 'Faktor selalu membagi habis bilangan.', `Periksa pasangan perkalian yang hasilnya tepat ${n}.`,], misconception: 'Menulis kelipatan sebagai faktor atau melewatkan pasangan faktor.', visual: 'number-line' }
  },
  'prime-check': (rng) => {
    const n = integer(rng, 9, 59); const answer = isPrime(n) ? 'Ya' : 'Bukan'
    return { params: { n }, prompt: `Apakah ${n} bilangan prima?`, expected: answer, explanation: isPrime(n) ? `${n} hanya punya dua faktor: 1 dan ${n}.` : `${n} memiliki faktor selain 1 dan dirinya sendiri.`, hints: ['Bilangan prima punya tepat dua faktor.', 'Coba bagi dengan bilangan kecil selain 1.', 'Jika ada pembagi lain selain 1 dan bilangan itu sendiri, jawab Bukan.'], misconception: 'Mengira bilangan ganjil pasti prima atau lupa bahwa 1 bukan bilangan prima.', visual: 'number-line', choices: ['Ya', 'Bukan'] }
  },
  gcd: (rng) => {
    const a = integer(rng, 12, 48); const b = integer(rng, 12, 48)
    return { params: { a, b }, prompt: `Tentukan FPB dari ${a} dan ${b}.`, expected: String(gcd(a, b)), explanation: `Faktor terbesar yang membagi keduanya adalah ${gcd(a, b)}.`, hints: ['Tuliskan faktor dari kedua bilangan.', 'Cari faktor yang muncul di kedua daftar.', 'Pilih faktor persekutuan yang paling besar.'], misconception: 'Memilih kelipatan persekutuan atau mengambil faktor yang hanya dimiliki satu bilangan.', visual: 'number-line' }
  },
  lcm: (rng) => {
    const a = integer(rng, 3, 12); const b = integer(rng, 3, 12)
    return { params: { a, b }, prompt: `Tentukan KPK dari ${a} dan ${b}.`, expected: String(lcm(a, b)), explanation: `Kelipatan persekutuan terkecil dari ${a} dan ${b} adalah ${lcm(a, b)}.`, hints: ['Tuliskan beberapa kelipatan dari masing-masing bilangan.', 'Cari angka yang muncul di kedua daftar.', 'Pilih kelipatan bersama yang paling kecil.'], misconception: 'Menggunakan faktor persekutuan terbesar saat soal meminta kelipatan persekutuan terkecil.', visual: 'number-line' }
  },
  'fraction-compare': (rng) => {
    const a = integer(rng, 1, 5); const b = integer(rng, a + 1, 8); let c = integer(rng, 1, 5); let d = integer(rng, c + 1, 8)
    while (a * d === c * b) { c = integer(rng, 1, 5); d = integer(rng, c + 1, 8) }
    const left = a * d; const right = c * b; const answer = left > right ? 'A' : 'B'
    return { params: { a, b, c, d }, prompt: `Pecahan mana yang lebih besar? A: ${fraction(a, b)} atau B: ${fraction(c, d)}?`, expected: answer, explanation: `Kalikan silang: ${a} × ${d} = ${left}, sedangkan ${c} × ${b} = ${right}.`, hints: ['Bayangkan dua bar pecahan dengan ukuran utuh yang sama.', 'Samakan penyebut atau bandingkan hasil kali silang.', 'Pilih pecahan dengan nilai lebih besar.'], misconception: 'Membandingkan pembilang atau penyebut saja tanpa mempertimbangkan ukuran keseluruhan.', visual: 'fraction-bar', choices: ['A', 'B'] }
  },
  'fraction-order': (rng) => {
    const d = pick(rng, [4, 5, 6, 8, 10]); const nums = [1, integer(rng, 2, d - 2), d - 1].sort((a, b) => a - b)
    const values = nums.map((n) => fraction(n, d)); const shuffledValues = shuffled(rng, values)
    const expected = values.join(' – ')
    return { params: { nums: shuffledValues.map((item) => Number(item.split('/')[0])), d }, prompt: `Urutkan dari terkecil: ${shuffledValues.join(', ')}.`, expected, explanation: `Penyebut sama, jadi urutkan pembilangnya: ${expected}.`, hints: ['Semua pecahan memiliki penyebut sama.', 'Bandingkan pembilangnya.', 'Urutkan pembilang dari kecil ke besar.'], misconception: 'Mengurutkan pecahan berdasarkan penyebut atau menganggap penyebut besar selalu lebih besar.', visual: 'fraction-bar', choices: [expected, values.slice().reverse().join(' – '), shuffledValues.join(' – ')] }
  },
  'fraction-equivalent': (rng) => {
    const n = integer(rng, 1, 4); const d = integer(rng, n + 1, 6); const factor = integer(rng, 2, 4)
    return { params: { n, d, factor }, prompt: `Pecahan senilai: ${fraction(n, d)} = ?/${d * factor}. Berapa angka yang hilang?`, expected: String(n * factor), explanation: `Pembilang dan penyebut dikali ${factor}, jadi pembilang baru ${n * factor}.`, hints: ['Pecahan senilai memiliki nilai yang sama.', 'Jika penyebut dikali suatu bilangan, pembilang juga dikali bilangan itu.', `Kalikan ${n} dengan ${factor}.`], misconception: 'Mengubah penyebut tanpa mengubah pembilang dengan faktor yang sama.', visual: 'fraction-bar' }
  },
  'fraction-simplify': (rng) => {
    const n = integer(rng, 2, 8); const d = integer(rng, n + 1, 10); const k = integer(rng, 2, 5)
    return { params: { n: n * k, d: d * k }, prompt: `Sederhanakan pecahan ${fraction(n * k, d * k)}.`, expected: simplify(n * k, d * k), explanation: `Bagi pembilang dan penyebut dengan faktor persekutuan terbesar.`, hints: ['Cari bilangan yang dapat membagi pembilang dan penyebut.', 'Bagi keduanya dengan bilangan yang sama.', 'Ulangi sampai tidak ada faktor persekutuan selain 1.'], misconception: 'Hanya membagi pembilang atau penyebut, bukan keduanya.', visual: 'fraction-bar' }
  },
  'fraction-add-same': (rng) => {
    const d = integer(rng, 3, 10); const a = integer(rng, 1, d - 2); const b = integer(rng, 1, d - a)
    return { params: { a, b, d }, prompt: `Hitung ${fraction(a, d)} + ${fraction(b, d)}.`, expected: simplify(a + b, d), explanation: `Penyebut tetap ${d}; jumlahkan pembilang: ${a} + ${b} = ${a + b}.`, hints: ['Penyebut kedua pecahan sama.', 'Ukuran potongannya sama, jadi jumlahkan pembilang.', 'Penyebut tetap, pembilang dijumlahkan.'], misconception: 'Menjumlahkan penyebut meskipun penyebutnya sudah sama.', visual: 'fraction-bar' }
  },
  'fraction-add-different': (rng) => {
    const d1 = pick(rng, [2, 3, 4, 5, 6]); const d2 = pick(rng, [2, 3, 4, 5, 6]); const a = integer(rng, 1, d1 - 1); const b = integer(rng, 1, d2 - 1)
    const den = d1 * d2; const num = a * d2 + b * d1
    return { params: { a, d1, b, d2 }, prompt: `Hitung ${fraction(a, d1)} + ${fraction(b, d2)}.`, expected: simplify(num, den), explanation: `Samakan penyebut terlebih dahulu, lalu jumlahkan pembilangnya.`, hints: ['Penyebut berbeda, ukuran bagiannya juga berbeda.', 'Ubah menjadi pecahan senilai dengan penyebut sama.', 'Jumlahkan pembilang setelah penyebut disamakan.'], misconception: 'Menjumlahkan pembilang dan penyebut secara langsung.', visual: 'fraction-bar' }
  },
  'fraction-subtract-different': (rng) => {
    let d1 = 4; let d2 = 3; let a = 3; let b = 1
    for (let attempt = 0; attempt < 80; attempt += 1) {
      d1 = pick(rng, [3, 4, 5, 6]); d2 = pick(rng, [2, 3, 4, 5])
      a = integer(rng, 2, d1 - 1); b = integer(rng, 1, d2 - 1)
      if (a * d2 > b * d1) break
    }
    let num = a * d2 - b * d1
    if (num <= 0) { d1 = 4; d2 = 3; a = 3; b = 1; num = a * d2 - b * d1 }
    const den = d1 * d2
    return { params: { a, d1, b, d2 }, prompt: `Hitung ${fraction(a, d1)} − ${fraction(b, d2)}.`, expected: simplify(num, den), explanation: 'Samakan penyebut, lalu kurangkan pembilang.', hints: ['Pastikan pecahan pertama lebih besar.', 'Samakan penyebut dengan pecahan senilai.', 'Kurangkan pembilang dan pertahankan penyebut yang sama.'], misconception: 'Mengurangi penyebut atau mengurangi pembilang tanpa menyamakan penyebut.', visual: 'fraction-bar' }
  },
  'fraction-multiply-whole': (rng) => {
    const n = integer(rng, 1, 4); const d = integer(rng, n + 1, 8); const whole = integer(rng, 2, 5)
    return { params: { n, d, whole }, prompt: `Hitung ${whole} × ${fraction(n, d)}.`, expected: simplify(whole * n, d), explanation: `Kalikan bilangan asli dengan pembilang: ${whole} × ${n} = ${whole * n}.`, hints: [`Pahami sebagai ${whole} kelompok dari pecahan yang sama.`, 'Kalikan bilangan asli dengan pembilang.', 'Penyebut tetap, lalu sederhanakan jika bisa.'], misconception: 'Mengalikan bilangan asli dengan penyebut, bukan pembilang.', visual: 'fraction-bar' }
  },
  'fraction-divide-whole': (rng) => {
    const n = integer(rng, 1, 5); const d = integer(rng, n + 1, 9); const whole = integer(rng, 2, 4)
    return { params: { n, d, whole }, prompt: `Hitung ${fraction(n, d)} ÷ ${whole}.`, expected: simplify(n, d * whole), explanation: `Membagi pecahan dengan bilangan asli sama dengan mengalikan penyebut dengan ${whole}.`, hints: ['Membagi menjadi lebih banyak bagian membuat tiap bagian lebih kecil.', 'Kalikan penyebut dengan bilangan pembagi.', `Pembilang tetap, penyebut dikali ${whole}.`], misconception: 'Membagi pembilang dengan bilangan asli tanpa memahami pembagian bagian.', visual: 'fraction-bar' }
  },
  'fraction-of-quantity': (rng) => {
    const d = pick(rng, [2, 3, 4, 5, 6, 8]); const n = integer(rng, 1, d - 1); const groups = integer(rng, 2, 10); const total = d * groups
    return { params: { n, d, total }, prompt: `Dari ${total} anak yang menonton pertandingan sepak bola, ${fraction(n, d)} memakai jersey merah. Berapa anak yang memakai jersey merah?`, expected: String(n * groups), explanation: `Satu bagian berisi ${groups} benda; ${n} bagian berisi ${n * groups} benda.`, hints: [`Bagi jumlah benda menjadi ${d} kelompok sama banyak.`, 'Cari isi satu kelompok terlebih dahulu.', `Ambil ${n} kelompok.`], misconception: 'Mengalikan jumlah benda dengan penyebut, bukan membaginya terlebih dahulu.', visual: 'fraction-bar' }
  },
  'fraction-to-decimal': (rng) => {
    const d = pick(rng, [2, 4, 5, 10]); const n = integer(rng, 1, d - 1); const value = n / d
    return { params: { n, d }, prompt: `Ubah ${fraction(n, d)} menjadi desimal.`, expected: value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '').replace('.', ','), explanation: `${n} dibagi ${d} sama dengan ${value.toLocaleString('id-ID')}.`, hints: ['Pecahan berarti pembilang dibagi penyebut.', 'Lakukan pembagian pembilang dengan penyebut.', 'Tulis hasil desimal menggunakan koma.'], misconception: 'Menuliskan pembilang dan penyebut berdampingan seolah-olah satu bilangan.', visual: 'number-line' }
  },
  'decimal-compare': (rng) => {
    const a = integer(rng, 1, 9); const b = integer(rng, 1, 9); let c = integer(rng, 1, 9); while (c === a) c = integer(rng, 1, 9)
    return { params: { a, c }, prompt: `Bilangan desimal mana yang lebih besar: ${decimal(a)} atau ${decimal(c)}?`, expected: a > c ? 'A' : 'B', explanation: 'Bandingkan nilai persepuluhannya.', hints: ['Lihat angka di tempat persepuluhan.', 'Bandingkan angka setelah koma.', 'Angka persepuluhan yang lebih besar menunjukkan bilangan lebih besar.'], misconception: 'Mengabaikan koma dan memperlakukan bagian desimal sebagai bilangan bulat terpisah.', visual: 'number-line', choices: ['A', 'B'] }
  },
  'decimal-order': (rng) => {
    const a = integer(rng, 1, 9)
    let b = integer(rng, 1, 9); while (b === a) b = integer(rng, 1, 9)
    let c = integer(rng, 1, 9); while (c === a || c === b) c = integer(rng, 1, 9)
    const unique = [a, b, c].sort((x, y) => x - y)
    const expected = unique.map(decimal).join(' – ')
    const alternate = [unique[1], unique[0], unique[2]].map(decimal).join(' – ')
    return { params: { values: unique }, prompt: `Urutkan desimal berikut dari terkecil: ${shuffled(rng, unique.map(decimal)).join(', ')}.`, expected, explanation: `Urutannya ${expected}.`, hints: ['Semua bilangan punya satu angka di belakang koma.', 'Bandingkan angka persepuluhan.', 'Susun dari nilai paling kecil ke paling besar.'], misconception: 'Membandingkan digit setelah koma sebagai angka bulat yang terpisah.', visual: 'number-line', choices: [expected, unique.slice().reverse().map(decimal).join(' – '), alternate] }
  },
  'decimal-place': (rng) => {
    const whole = integer(rng, 1, 99); const tenths = integer(rng, 1, 9)
    return { params: { whole, tenths }, prompt: `Pada bilangan ${whole},${tenths}, berapa nilai angka persepuluhannya?`, expected: decimal(tenths), explanation: `Angka ${tenths} berada di tempat persepuluhan, nilainya ${decimal(tenths)}.`, hints: ['Perhatikan angka setelah koma.', 'Tempat pertama setelah koma adalah persepuluhan.', 'Nilai angka itu adalah angka × 0,1.'], misconception: 'Menjawab digit saja tanpa nilai tempatnya.', visual: 'place-value' }
  },
  'decimal-add': (rng) => {
    const a = integer(rng, 1, 99); const b = integer(rng, 1, 99)
    return { params: { a, b }, prompt: `Hitung ${decimal(a)} + ${decimal(b)}.`, expected: decimal(a + b), explanation: 'Sejajarkan koma, lalu jumlahkan nilai persepuluhan.', hints: ['Tulis koma pada posisi yang sama.', 'Jumlahkan angka persepuluhan.', 'Jika hasil persepuluhan 10 atau lebih, tukar 10 persepuluhan menjadi 1 satuan.'], misconception: 'Menjumlahkan angka tanpa menyelaraskan koma.', visual: 'place-value' }
  },
  'decimal-subtract': (rng) => {
    const a = integer(rng, 20, 99); const b = integer(rng, 1, a - 1)
    return { params: { a, b }, prompt: `Hitung ${decimal(a)} − ${decimal(b)}.`, expected: decimal(a - b), explanation: 'Sejajarkan koma, lalu kurangkan persepuluhan dan satuan.', hints: ['Tulis koma pada posisi yang sama.', 'Kurangkan dari tempat persepuluhan.', 'Jika perlu, tukar satu satuan menjadi sepuluh persepuluhan.'], misconception: 'Mengurangkan digit setelah koma secara terpisah tanpa regrouping.', visual: 'place-value' }
  },
  'decimal-to-fraction': (rng) => {
    const whole = integer(rng, 1, 9); const tenths = integer(rng, 1, 9)
    const expected = `${whole} ${tenths}/10`
    return { params: { whole, tenths }, prompt: `Ubah ${whole},${tenths} menjadi pecahan campuran.`, expected, choices: [expected, `${whole} ${tenths}/100`, `${whole} ${tenths}/9`], explanation: `${whole},${tenths} berarti ${whole} satuan dan ${tenths} persepuluhan.`, hints: ['Pisahkan bagian satuan dan persepuluhan.', 'Angka setelah koma menjadi pembilang.', 'Penyebut persepuluhan adalah 10.'], misconception: 'Mengubah bagian desimal menjadi pecahan dengan penyebut yang tidak sesuai nilai tempat.', visual: 'fraction-bar' }
  },
  'fraction-percent': (rng) => {
    const percent = pick(rng, [10, 20, 25, 40, 50, 60, 75, 80]); const n = percent / gcd(percent, 100); const d = 100 / gcd(percent, 100)
    return { params: { n, d }, prompt: `Berapa persen dari pecahan ${fraction(n, d)}?`, expected: `${percent}%`, explanation: `${fraction(n, d)} setara dengan ${percent} dari 100, yaitu ${percent}%.`, hints: ['Persen berarti per seratus.', 'Ubah pecahan menjadi penyebut 100.', 'Kalikan pembilang dengan faktor yang membuat penyebut menjadi 100.'], misconception: 'Mengalikan pembilang dengan 100 tanpa membandingkan penyebut.', visual: 'fraction-bar' }
  },
  'percent-of-number': (rng) => {
    const p = pick(rng, [10, 20, 25, 50, 75]); const base = integer(rng, 2, 20) * 4
    const total = base * 25
    return { params: { p, total }, prompt: `Berapa ${p}% dari ${total}?`, expected: String(total * p / 100), explanation: `${p}% berarti ${p}/100 dari ${total}.`, hints: ['Ubah persen menjadi pecahan per 100.', 'Cari 10%, 25%, atau setengahnya jika membantu.', 'Kalikan bilangan dengan persen lalu bagi 100.'], misconception: 'Menganggap 25% berarti menambah 25, bukan mengambil 25 dari setiap 100.', visual: 'fraction-bar' }
  },
  'ratio-simplify': (rng) => {
    const k = integer(rng, 2, 6); const a = integer(rng, 1, 5) * k; const b = integer(rng, 2, 7) * k
    return { params: { a, b }, prompt: `Sederhanakan rasio ${a}:${b}.`, expected: `${a / gcd(a, b)}:${b / gcd(a, b)}`, explanation: `Bagi kedua bagian rasio dengan FPB-nya, yaitu ${gcd(a, b)}.`, hints: ['Cari faktor persekutuan kedua bilangan.', 'Bagi kedua bagian dengan bilangan yang sama.', 'Rasio sederhana tidak memiliki faktor persekutuan selain 1.'], misconception: 'Hanya menyederhanakan salah satu bagian rasio.', visual: 'blocks' }
  },
  'unit-rate': (rng) => {
    const unit = integer(rng, 2, 12); const rate = integer(rng, 2, 20) * 1000; const total = unit * rate
    return { params: { unit, rate, total }, prompt: `Di kios pasar, ${unit} bungkus kerupuk harganya Rp${total.toLocaleString('id-ID')}. Berapa harga satu bungkus?`, expected: String(rate), explanation: `Harga satu buku = Rp${total.toLocaleString('id-ID')} ÷ ${unit} = Rp${rate.toLocaleString('id-ID')}.`, hints: ['Cari harga untuk satu benda.', 'Bagi total harga dengan banyak benda.', 'Gunakan pembagian untuk mendapatkan nilai per satuan.'], misconception: 'Mengalikan jumlah barang dengan total harga, bukan membagi.', visual: 'blocks' }
  },
  proportion: (rng) => {
    const a = integer(rng, 2, 5); const b = integer(rng, 2, 6); const k = integer(rng, 2, 5)
    return { params: { a, b, k }, prompt: `Resep sirup memakai ${a} sendok sirup untuk ${b} gelas air. Jika sirupnya ${a * k} sendok, berapa gelas air yang diperlukan agar rasanya tetap sama?`, expected: String(b * k), explanation: `Bagian pertama dikali ${k}, jadi bagian kedua juga dikali ${k}.`, hints: ['Rasio harus tetap setara.', `Perhatikan faktor pengali dari ${a} ke ${a * k}.`, `Kalikan ${b} dengan faktor yang sama.`], misconception: 'Menambahkan selisih yang sama alih-alih mengalikan kedua bagian dengan faktor yang sama.', visual: 'blocks' }
  },
  'pattern-multiplicative': (rng) => {
    const start = integer(rng, 2, 9); const factor = pick(rng, [2, 3, 4]); const current = start * factor * factor
    return { params: { start, factor, current }, prompt: `Pola: ${start}, ${start * factor}, ${current}, ... Angka berikutnya berapa?`, expected: String(current * factor), explanation: `Setiap suku dikali ${factor}.`, hints: ['Bandingkan suku pertama dan kedua.', 'Cari bilangan pengali yang sama.', `Kalikan suku terakhir dengan ${factor}.`], misconception: 'Menggunakan selisih tetap padahal polanya dikali.', visual: 'number-line' }
  },
  'missing-multiply-divide': (rng) => {
    const factor = integer(rng, 2, 12); const missing = integer(rng, 2, 15); const product = factor * missing
    return { params: { factor, product }, prompt: `Lengkapi: ${factor} × □ = ${product}.`, expected: String(missing), explanation: `Bilangan yang hilang adalah ${product} ÷ ${factor} = ${missing}.`, hints: ['Gunakan operasi kebalikan.', 'Jika perkalian diketahui hasilnya, gunakan pembagian.', `Bagi ${product} dengan ${factor}.`], misconception: 'Menggunakan operasi yang sama, bukan operasi kebalikan.', visual: 'blocks' }
  },
  'perimeter-square': (rng) => {
    const side = integer(rng, 2, 20)
    return { params: { side }, prompt: `Sebuah persegi memiliki sisi ${side} cm. Berapa kelilingnya?`, expected: String(4 * side), explanation: `Keliling persegi = 4 × sisi = ${4 * side} cm.`, hints: ['Keliling adalah panjang seluruh sisi luar.', 'Persegi memiliki empat sisi sama panjang.', 'Kalikan panjang sisi dengan 4.'], misconception: 'Menghitung luas (sisi × sisi) saat diminta keliling.', visual: 'grid' }
  },
  'perimeter-rectangle': (rng) => {
    const length = integer(rng, 5, 20); const width = integer(rng, 2, length - 1)
    return { params: { length, width }, prompt: `Persegi panjang berukuran ${length} cm × ${width} cm. Berapa kelilingnya?`, expected: String(2 * (length + width)), explanation: `Keliling = 2 × (panjang + lebar) = ${2 * (length + width)} cm.`, hints: ['Keliling mengikuti seluruh tepi bangun.', 'Jumlahkan panjang dan lebar, lalu kalikan dua.', 'Gunakan 2 × (p + l).'], misconception: 'Mengalikan panjang dan lebar sehingga menghitung luas.', visual: 'grid' }
  },
  'perimeter-triangle': (rng) => {
    const a = integer(rng, 4, 10); const b = integer(rng, 4, 10); const c = integer(rng, Math.abs(a - b) + 1, a + b - 1)
    return { params: { a, b, c }, prompt: `Segitiga memiliki sisi ${a} cm, ${b} cm, dan ${c} cm. Berapa kelilingnya?`, expected: String(a + b + c), explanation: 'Keliling segitiga adalah jumlah panjang ketiga sisinya.', hints: ['Keliling berarti seluruh sisi luar.', 'Segitiga memiliki tiga sisi.', 'Jumlahkan ketiga panjang sisi.'], misconception: 'Mengalikan dua sisi atau hanya menjumlahkan dua sisi.', visual: 'grid' }
  },
  'area-square': (rng) => {
    const side = integer(rng, 2, 12)
    return { params: { side }, prompt: `Sebuah persegi memiliki sisi ${side} cm. Berapa luasnya?`, expected: String(side * side), explanation: `Luas persegi = sisi × sisi = ${side * side} cm².`, hints: ['Luas mengukur bagian dalam bangun.', 'Bayangkan petak satuan yang menutupi persegi.', 'Kalikan sisi dengan sisi.'], misconception: 'Menghitung keliling saat yang ditanya luas.', visual: 'grid' }
  },
  'area-rectangle': (rng) => {
    const length = integer(rng, 3, 16); const width = integer(rng, 2, 10)
    return { params: { length, width }, prompt: `Persegi panjang berukuran ${length} cm × ${width} cm. Berapa luasnya?`, expected: String(length * width), explanation: `Luas = panjang × lebar = ${length * width} cm².`, hints: ['Luas adalah banyak petak satuan di bagian dalam.', `Bayangkan ada ${length} kolom dan ${width} baris.`, 'Kalikan panjang dengan lebar.'], misconception: 'Menjumlahkan sisi karena tertukar dengan keliling.', visual: 'grid' }
  },
  'area-triangle': (rng) => {
    const base = integer(rng, 4, 16); const height = integer(rng, 2, 12) * 2
    return { params: { base, height }, prompt: `Segitiga memiliki alas ${base} cm dan tinggi ${height} cm. Berapa luasnya?`, expected: String(base * height / 2), explanation: `Luas segitiga = alas × tinggi ÷ 2 = ${base * height / 2} cm².`, hints: ['Segitiga dapat dipasangkan menjadi satu persegi panjang.', 'Luas segitiga adalah setengah alas kali tinggi.', 'Kalikan alas dengan tinggi, lalu bagi dua.'], misconception: 'Lupa membagi dua setelah mengalikan alas dan tinggi.', visual: 'grid' }
  },
  'area-composite': (rng) => {
    const a = integer(rng, 3, 8); const b = integer(rng, 2, 7); const c = integer(rng, 2, 6); const d = integer(rng, 2, 6)
    return { params: { a, b, c, d }, prompt: `Bangun gabungan terdiri dari dua persegi panjang: ${a} × ${b} cm dan ${c} × ${d} cm. Berapa luas seluruhnya?`, expected: String(a * b + c * d), explanation: `Hitung luas masing-masing bagian lalu jumlahkan: ${a * b} + ${c * d} = ${a * b + c * d} cm².`, hints: ['Pisahkan bangun menjadi dua bagian sederhana.', 'Hitung luas tiap persegi panjang.', 'Jumlahkan kedua luas.'], misconception: 'Menghitung bagian yang bertumpuk dua kali atau menggunakan keliling.', visual: 'grid' }
  },
  'angle-measure': (rng) => {
    const turn = pick(rng, [1, 2, 3]); const answer = turn * 90
    return { params: { turn }, prompt: `Besar sudut dari ${turn === 1 ? 'seperempat' : turn === 2 ? 'setengah' : 'tiga perempat'} putaran adalah berapa derajat?`, expected: String(answer), explanation: `Satu putaran penuh 360°. ${turn} bagian seperempat putaran = ${answer}°.`, hints: ['Satu putaran penuh adalah 360°.', 'Seperempat putaran adalah 90°.', `Kalikan ${turn} dengan 90°.`], misconception: 'Menilai sudut dari panjang kaki, bukan besar bukaan atau putarannya.', visual: 'angle' }
  },
  'duration-calculate': (rng) => {
    const start = integer(rng, 7 * 60, 15 * 60); const duration = integer(rng, 20, 180); const end = start + duration
    const fmt = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}.${String(minutes % 60).padStart(2, '0')}`
    return { params: { start, duration, end }, prompt: `Angkot berangkat pukul ${fmt(start)} dan tiba pukul ${fmt(end)}. Berapa lama perjalanan dalam menit?`, expected: String(duration), explanation: `Selisih waktu dari mulai sampai selesai adalah ${duration} menit.`, hints: ['Ubah jam menjadi menit atau hitung bertahap.', 'Ingat satu jam sama dengan 60 menit.', 'Kurangi waktu selesai dengan waktu mulai.'], misconception: 'Menganggap satu jam sama dengan 100 menit.', visual: 'number-line' }
  },
  'volume-unit-cubes': (rng) => {
    const length = integer(rng, 2, 6); const width = integer(rng, 2, 5); const height = integer(rng, 2, 4)
    return { params: { length, width, height }, prompt: `Balok tersusun dari kubus satuan: ${length} panjang, ${width} lebar, dan ${height} tinggi. Berapa kubus satuan yang dibutuhkan?`, expected: String(length * width * height), explanation: `Jumlah kubus = ${length} × ${width} × ${height} = ${length * width * height}.`, hints: ['Hitung jumlah kubus pada satu lapisan.', 'Kalikan panjang dan lebar untuk satu lapisan.', 'Kalikan banyak kubus satu lapisan dengan jumlah lapisan.'], misconception: 'Menghitung hanya satu lapisan atau mencampur jumlah kubus dengan luas permukaan.', visual: 'blocks' }
  },
  'solid-properties': (rng) => {
    const solid = pick(rng, [{ name: 'kubus', faces: 6, edges: 12, vertices: 8 }, { name: 'balok', faces: 6, edges: 12, vertices: 8 }])
    const property = pick(rng, ['faces', 'edges', 'vertices'] as const)
    const labels: Record<'faces' | 'edges' | 'vertices', string> = { faces: 'sisi', edges: 'rusuk', vertices: 'titik sudut' }
    const answer = solid[property]
    return { params: { faces: solid.faces, edges: solid.edges, vertices: solid.vertices, property }, prompt: `Berapa banyak ${labels[property]} pada ${solid.name}?`, expected: String(answer), explanation: `${solid.name} memiliki ${solid.faces} sisi, ${solid.edges} rusuk, dan ${solid.vertices} titik sudut.`, hints: ['Bayangkan bangun ruang dari beberapa sisi datar.', 'Bedakan sisi, rusuk, dan titik sudut.', 'Kubus dan balok memiliki jumlah sisi, rusuk, dan titik sudut yang sama.'], misconception: 'Menyamakan sisi (bidang) dengan rusuk (garis tepi).', visual: 'blocks' }
  },
  'grid-location': (rng) => {
    const x = integer(rng, 2, 5); const y = integer(rng, 1, 5); const dx = pick(rng, [-1, 1]); const dy = pick(rng, [-1, 1]); const nx = x + dx; const ny = Math.min(6, Math.max(1, y + dy))
    return { params: { x, y, nx, ny }, prompt: `Kamu berada di petak (${x}, ${y}). Bergerak satu petak ${dx > 0 ? 'ke kanan' : 'ke kiri'}. Kolom berubah. Berapa kolom barumu?`, expected: String(nx), explanation: `Kolom berubah dari ${x} menjadi ${nx}; baris tetap ${y}.`, hints: ['Koordinat pertama menunjukkan kolom.', 'Gerak ke kanan menambah kolom satu.', `Kolom baru adalah ${x} ${dx > 0 ? '+' : '−'} 1.`], misconception: 'Menukar urutan kolom dan baris pada koordinat.', visual: 'grid' }
  },
  'table-frequency': (rng) => {
    const values = [integer(rng, 2, 9), integer(rng, 2, 9), integer(rng, 2, 9)]
    const index = integer(rng, 0, 2); const names = ['Apel', 'Jeruk', 'Pisang']
    return { params: { values, index }, prompt: `Data buah di pasar: Apel ${values[0]} kg, Jeruk ${values[1]} kg, Pisang ${values[2]} kg. Berapa kilogram jumlah seluruh buah?`, expected: String(values.reduce((sum, v) => sum + v, 0)), explanation: 'Jumlah seluruh data diperoleh dengan menjumlahkan frekuensi setiap kategori.', hints: ['Perhatikan jumlah pada setiap kategori.', 'Jangan menjumlahkan nama kategori, jumlahkan angkanya.', 'Jumlahkan ketiga frekuensi.'], misconception: 'Membaca frekuensi satu kategori sebagai jumlah seluruh data.', visual: 'chart' }
  },
  'bar-chart-read': (rng) => {
    const values = [integer(rng, 2, 12), integer(rng, 2, 12), integer(rng, 2, 12)]
    const max = Math.max(...values); const min = Math.min(...values)
    return { params: { values }, prompt: `Diagram batang jumlah pemain yang hadir pada tiga latihan sepak bola: hari 1 ${values[0]}, hari 2 ${values[1]}, hari 3 ${values[2]}. Berapa selisih kehadiran terbanyak dan tersedikit?`, expected: String(max - min), explanation: `Selisih = data terbesar ${max} − data terkecil ${min} = ${max - min}.`, hints: ['Temukan batang paling tinggi dan paling rendah.', 'Baca angka pada kedua batang.', 'Kurangkan jumlah terkecil dari jumlah terbesar.'], misconception: 'Mengurangkan kategori yang salah atau membaca batang tanpa skala.', visual: 'chart' }
  },
  'pictogram-read': (rng) => {
    const unit = pick(rng, [2, 5]); const counts = [integer(rng, 1, 4), integer(rng, 1, 4), integer(rng, 1, 4)]
    return { params: { unit, counts }, prompt: `Pada piktogram kios buah, satu gambar mewakili ${unit} kg. Ada ${counts[0]}, ${counts[1]}, dan ${counts[2]} gambar pada tiga keranjang. Berapa kilogram jumlah buah seluruhnya?`, expected: String(counts.reduce((sum, v) => sum + v, 0) * unit), explanation: `Jumlah gambar ${counts.reduce((sum, v) => sum + v, 0)}. Setiap gambar bernilai ${unit}, jadi total ${counts.reduce((sum, v) => sum + v, 0) * unit}.`, hints: ['Baca keterangan nilai satu gambar.', 'Jumlahkan semua gambar terlebih dahulu.', 'Kalikan total gambar dengan nilai setiap gambar.'], misconception: 'Menganggap satu simbol selalu bernilai satu tanpa membaca legenda.', visual: 'chart' }
  },
  'count-objects': (rng) => {
    const a = integer(rng, 2, 8); const b = integer(rng, 1, 8)
    return { params: { a, b, values: [a, b] }, prompt: `Ada ${a} bola merah dan ${b} bola biru. Berapa jumlah bola semuanya?`, expected: String(a + b), explanation: `${a} bola merah ditambah ${b} bola biru sama dengan ${a + b} bola.`, hints: ['Gabungkan dua kelompok bola.', 'Mulai hitung dari kelompok yang lebih besar.', 'Jumlahkan banyak bola merah dan biru.'], misconception: 'Menghitung satu kelompok saja atau mengulang hitungan awal.', visual: 'chart' }
  },
  'compare-length': (rng) => {
    const a = integer(rng, 10, 90); let b = integer(rng, 10, 90); while (a === b) b = integer(rng, 10, 90)
    const expected = a > b ? 'A' : 'B'
    return { params: { a, b }, prompt: `Pita A panjangnya ${a} cm dan pita B ${b} cm. Pita mana yang lebih panjang?`, expected, choices: ['A', 'B'], explanation: `Pita ${expected} lebih panjang karena ukurannya lebih besar.`, hints: ['Perhatikan satuan kedua pita.', 'Bandingkan angka panjangnya.', 'Pilih pita dengan ukuran sentimeter lebih besar.'], misconception: 'Mengira pita yang angkanya lebih kecil berarti lebih panjang.', visual: 'chart' }
  },
  'compare-weight': (rng) => {
    const a = integer(rng, 1, 20); let b = integer(rng, 1, 20); while (a === b) b = integer(rng, 1, 20)
    const expected = a > b ? 'A' : 'B'
    return { params: { a, b }, prompt: `Karung A beratnya ${a} kg dan karung B ${b} kg. Karung mana yang lebih berat?`, expected, choices: ['A', 'B'], explanation: `Karung ${expected} lebih berat karena jumlah kilogramnya lebih besar.`, hints: ['Kedua berat memakai satuan kilogram.', 'Bandingkan angka kilogram.', 'Pilih angka yang lebih besar.'], misconception: 'Menyamakan ukuran benda dengan beratnya tanpa membandingkan satuan.', visual: 'chart' }
  },
  'compare-duration': (rng) => {
    const a = integer(rng, 10, 90); let b = integer(rng, 10, 90); while (a === b) b = integer(rng, 10, 90)
    const expected = a > b ? 'A' : 'B'
    return { params: { a, b }, prompt: `Kegiatan A berlangsung ${a} menit dan kegiatan B ${b} menit. Kegiatan mana yang lebih lama?`, expected, choices: ['A', 'B'], explanation: `Kegiatan ${expected} berlangsung lebih lama karena jumlah menitnya lebih banyak.`, hints: ['Kedua durasi memakai satuan menit.', 'Bandingkan jumlah menitnya.', 'Durasi dengan menit lebih besar berlangsung lebih lama.'], misconception: 'Mengira kegiatan yang dimulai lebih dulu pasti lebih lama.', visual: 'number-line' }
  },
  'fraction-half-quarter': (rng) => {
    const denominator = pick(rng, [2, 4]); const expected = `1/${denominator}`
    return { params: { numerator: 1, denominator }, prompt: `Satu dari ${denominator} bagian sama besar disebut pecahan apa?`, expected, choices: ['1/2', '1/4', '1/3'].filter((item) => item !== expected).concat(expected).slice(0, 3), explanation: `Satu dari ${denominator} bagian sama besar ditulis ${expected}.`, hints: ['Perhatikan berapa bagian sama besar seluruh benda.', 'Angka bawah menunjukkan jumlah semua bagian.', `Satu bagian dari ${denominator} bagian ditulis ${expected}.`], misconception: 'Menghitung jumlah bagian yang diambil sebagai penyebut, bukan jumlah seluruh bagian.', visual: 'fraction-bar' }
  },
  'pattern-shape': (rng) => {
    const first = pick(rng, ['lingkaran', 'segitiga', 'persegi']); const second = pick(rng, ['lingkaran', 'segitiga', 'persegi'].filter((shape) => shape !== first))
    return { params: { first, second }, prompt: `Perhatikan pola: ${first}, ${second}, ${first}, ${second}, ... Bentuk berikutnya?`, expected: first, choices: [first, second, 'persegi panjang'].filter((item, index, all) => all.indexOf(item) === index).slice(0, 3), explanation: `Pola bergantian antara ${first} dan ${second}, jadi berikutnya ${first}.`, hints: ['Perhatikan dua bentuk yang berulang.', 'Pola kembali ke bentuk pertama setelah bentuk kedua.', `Bentuk berikutnya adalah ${first}.`], misconception: 'Melanjutkan pola dengan memilih bentuk baru, bukan mengulang aturan.', visual: 'pattern' }
  },
  'shape-recognition': (rng) => {
    const shape = pick(rng, [{ name: 'segitiga', sides: 3 }, { name: 'persegi', sides: 4 }, { name: 'segilima', sides: 5 }])
    const choices = ['segitiga', 'persegi', 'segilima'].filter((name) => name !== shape.name)
    return { params: { sides: shape.sides }, prompt: `Bangun datar yang memiliki ${shape.sides} sisi lurus disebut apa?`, expected: shape.name, choices: [shape.name, ...choices].slice(0, 3), explanation: `${shape.name} memiliki ${shape.sides} sisi lurus.`, hints: ['Hitung garis tepi yang membentuk bangun.', 'Setiap garis tepi adalah satu sisi.', `Bangun dengan ${shape.sides} sisi disebut ${shape.name}.`], misconception: 'Menghitung titik sudut sebagai sisi atau tertukar nama bangun.', visual: 'shape' }
  },
  'position-objects': (rng) => {
    const position = pick(rng, ['kiri', 'kanan', 'atas', 'bawah'])
    return { params: { position }, prompt: `Bola berada di sebelah ${position} kotak. Di mana posisi bola terhadap kotak?`, expected: position, choices: ['kiri', 'kanan', 'atas', 'bawah'], explanation: `Bola berada di sebelah ${position} kotak.`, hints: ['Perhatikan letak bola terhadap kotak.', 'Gunakan kata posisi yang sesuai.', `Posisi bola adalah ${position}.`], misconception: 'Membaca posisi dari arah pandang yang berbeda atau menukar kiri dan kanan.', visual: 'position' }
  },
  'tally-read': (rng) => {
    const count = integer(rng, 3, 12)
    return { params: { count, values: [count] }, prompt: `Turus pada papan pilihan menunjukkan ${count} suara. Berapa jumlah suara yang tercatat?`, expected: String(count), explanation: `Jumlah turus yang tercatat adalah ${count} suara.`, hints: ['Hitung setiap garis turus.', 'Satu kelompok lima turus tetap bernilai lima.', `Jumlah suara yang tercatat ${count}.`], misconception: 'Menghitung satu kelompok lima turus sebagai satu suara.', visual: 'tally' }
  },
  'compose-shapes': (rng) => {
    const rows = integer(rng, 2, 5); const columns = integer(rng, 2, 6)
    return { params: { rows, columns }, prompt: `Beberapa petak disusun menjadi persegi panjang dengan ${rows} baris dan ${columns} kolom. Berapa petak yang membentuk bangun itu?`, expected: String(rows * columns), explanation: `Jumlah petak = ${rows} × ${columns} = ${rows * columns}.`, hints: ['Hitung petak pada satu baris.', 'Lihat berapa baris yang disusun.', 'Kalikan banyak baris dengan banyak kolom.'], misconception: 'Menghitung hanya panjang dan lebar tanpa menghitung seluruh petak.', visual: 'grid' }
  },
  // Fase A/B: generator dasar yang juga dipakai sebagai prasyarat dan penguatan.
  'pattern-additive': (rng) => {
    const start = integer(rng, 1, 20); const step = integer(rng, 1, 8)
    return { params: { start, step }, prompt: `Pola: ${start}, ${start + step}, ${start + 2 * step}, ... Angka berikutnya?`, expected: String(start + 3 * step), explanation: `Setiap suku bertambah ${step}.`, hints: ['Cari selisih dua suku yang berdekatan.', 'Periksa apakah selisihnya tetap.', 'Tambahkan selisih itu pada suku terakhir.'], misconception: 'Tidak memeriksa aturan pola pada lebih dari satu pasangan suku.', visual: 'number-line' }
  },
  'missing-add-sub': (rng) => {
    const a = integer(rng, 10, 90); const b = integer(rng, 10, 90); const sum = a + b
    return { params: { a, b, sum }, prompt: `Lengkapi kalimat: ${a} + □ = ${sum}.`, expected: String(b), explanation: `Gunakan operasi kebalikan: ${sum} − ${a} = ${b}.`, hints: ['Cari bilangan yang jika ditambah menghasilkan jumlah itu.', 'Gunakan pengurangan untuk mencari nilai yang hilang.', 'Kurangi hasil dengan bilangan yang sudah diketahui.'], misconception: 'Mengisi kotak dengan hasil penjumlahan yang sudah diketahui.', visual: 'blocks' }
  },
  'length-convert': (rng) => {
    const meters = integer(rng, 1, 12)
    return { params: { meters }, prompt: `${meters} meter sama dengan berapa sentimeter?`, expected: String(meters * 100), explanation: 'Satu meter sama dengan 100 sentimeter.', hints: ['Ingat hubungan meter dan sentimeter.', 'Setiap 1 meter terdiri dari 100 cm.', 'Kalikan jumlah meter dengan 100.'], misconception: 'Membagi dengan 100 saat mengubah meter ke sentimeter.', visual: 'blocks' }
  },
  'mass-convert': (rng) => {
    const kg = integer(rng, 1, 9)
    return { params: { kg }, prompt: `${kg} kilogram sama dengan berapa gram?`, expected: String(kg * 1000), explanation: 'Satu kilogram sama dengan 1.000 gram.', hints: ['Ingat hubungan kilogram dan gram.', 'Setiap 1 kilogram terdiri dari 1.000 gram.', 'Kalikan kilogram dengan 1.000.'], misconception: 'Menggunakan faktor 100 atau membagi ketika seharusnya mengalikan.', visual: 'blocks' }
  },
  'shape-properties': (rng) => {
    const shapes = [{ name: 'segitiga', sides: 3 }, { name: 'segiempat', sides: 4 }, { name: 'segilima', sides: 5 }, { name: 'segienam', sides: 6 }]
    const shape = pick(rng, shapes)
    return { params: { sides: shape.sides }, prompt: `Berapa banyak sisi lurus pada ${shape.name}?`, expected: String(shape.sides), explanation: `${shape.name} memiliki ${shape.sides} sisi lurus.`, hints: ['Telusuri garis tepi bangun.', 'Hitung setiap sisi satu kali.', 'Jumlahkan semua sisi lurus.'], misconception: 'Menghitung titik sudut, bukan sisi.', visual: 'shape' }
  },
  'area-composite-basic': (rng) => {
    const a = integer(rng, 2, 6); const b = integer(rng, 2, 6)
    return { params: { a, b }, prompt: `Sebuah persegi panjang terdiri dari ${a} baris dan ${b} kolom petak. Berapa banyak petak seluruhnya?`, expected: String(a * b), explanation: `Ada ${a} × ${b} = ${a * b} petak.`, hints: ['Hitung petak pada satu baris.', 'Hitung jumlah baris.', 'Kalikan baris dengan kolom.'], misconception: 'Menghitung hanya petak pada satu baris.', visual: 'grid' }
  },
}

Object.assign(build, fractionBuilders)

const aliases: Record<string, string> = {
  'compare-whole': 'whole-compare',
  'add-whole': 'whole-add',
  'subtract-whole': 'whole-subtract',
}

function canonicalType(typeId: string): string {
  return aliases[typeId] ?? typeId
}

function independentAnswer(typeId: string, p: QuestionParams): string {
  const type = canonicalType(typeId)
  const n = (key: string) => Number(p[key])
  switch (type) {
    case 'whole-place-value': return String(Math.floor(n('value') / 10 ** n('position')) % 10 * 10 ** n('position'))
    case 'whole-compose': return String(n('thousands') * 1000 + n('hundreds') * 100 + n('tens') * 10 + n('ones'))
    case 'whole-compare': return n('a') > n('b') ? 'A' : 'B'
    case 'whole-order': return (p.values as number[]).slice().sort((a, b) => a - b).join(' – ')
    case 'whole-add': return String(n('a') + n('b'))
    case 'whole-subtract': return String(n('a') - n('b'))
    case 'whole-multiply': return String(n('a') * n('b'))
    case 'whole-divide': return String(n('dividend') / n('divisor'))
    case 'money-change': return String(n('paid') - n('price'))
    case 'factor-list': return Array.from({ length: n('n') }, (_, i) => i + 1).filter((v) => n('n') % v === 0).join(', ')
    case 'prime-check': return Array.from({ length: n('n') - 1 }, (_, i) => i + 1).filter((v) => n('n') % v === 0).length === 1 ? 'Ya' : 'Bukan'
    case 'gcd': { let a = n('a'); let b = n('b'); while (b) [a, b] = [b, a % b]; return String(Math.abs(a)) }
    case 'lcm': { let a = n('a'); let b = n('b'); let x = a; let y = b; while (y) [x, y] = [y, x % y]; return String(Math.abs(a * b) / Math.abs(x)) }
    case 'fraction-compare': return n('a') * n('d') > n('c') * n('b') ? 'A' : 'B'
    case 'fraction-order': return (p.nums as number[]).slice().sort((a, b) => a - b).map((v) => fraction(v, n('d'))).join(' – ')
    case 'fraction-equivalent': return String(n('n') * n('factor'))
    case 'fraction-simplify': { let a = n('n'); let b = n('d'); while (b) [a, b] = [b, a % b]; const g = Math.abs(a); const top = n('n') / g; const bottom = n('d') / g; return bottom === 1 ? String(top) : `${top}/${bottom}` }
    case 'fraction-add-same': return simplify(n('a') + n('b'), n('d'))
    case 'fraction-add-different': return simplify(n('a') * n('d2') + n('b') * n('d1'), n('d1') * n('d2'))
    case 'fraction-subtract-different': return simplify(n('a') * n('d2') - n('b') * n('d1'), n('d1') * n('d2'))
    case 'fraction-multiply-whole': return simplify(n('n') * n('whole'), n('d'))
    case 'fraction-divide-whole': return simplify(n('n'), n('d') * n('whole'))
    case 'fraction-of-quantity': return String(n('n') * (n('total') / n('d')))
    case 'fraction-to-decimal': return (n('n') / n('d')).toFixed(2).replace(/0+$/, '').replace(/\.$/, '').replace('.', ',')
    case 'decimal-compare': return n('a') > n('c') ? 'A' : 'B'
    case 'decimal-order': return (p.values as number[]).slice().sort((a, b) => a - b).map(decimal).join(' – ')
    case 'decimal-place': return decimal(n('tenths'))
    case 'decimal-add': return decimal(n('a') + n('b'))
    case 'decimal-subtract': return decimal(n('a') - n('b'))
    case 'decimal-to-fraction': return `${n('whole')} ${n('tenths')}/10`
    case 'fraction-percent': return `${n('n') * 100 / n('d')}%`
    case 'percent-of-number': return String(n('p') * n('total') / 100)
    case 'ratio-simplify': { let a = n('a'); let b = n('b'); while (b) [a, b] = [b, a % b]; const g = Math.abs(a); return `${n('a') / g}:${n('b') / g}` }
    case 'unit-rate': return String(n('total') / n('unit'))
    case 'proportion': return String(n('b') * n('k'))
    case 'pattern-multiplicative': return String(n('current') * n('factor'))
    case 'missing-multiply-divide': return String(n('product') / n('factor'))
    case 'perimeter-square': return String(4 * n('side'))
    case 'perimeter-rectangle': return String(2 * (n('length') + n('width')))
    case 'perimeter-triangle': return String(n('a') + n('b') + n('c'))
    case 'area-square': return String(n('side') * n('side'))
    case 'area-rectangle': return String(n('length') * n('width'))
    case 'area-triangle': return String(n('base') * n('height') / 2)
    case 'area-composite': return String(n('a') * n('b') + n('c') * n('d'))
    case 'angle-measure': return String(n('turn') * 90)
    case 'duration-calculate': return String(n('end') - n('start'))
    case 'volume-unit-cubes': return String(n('length') * n('width') * n('height'))
    case 'solid-properties': return String(p[String(p.property)] ?? 0)
    case 'grid-location': return String(n('nx'))
    case 'table-frequency': return String((p.values as number[]).reduce((sum, v) => sum + v, 0))
    case 'bar-chart-read': { const values = p.values as number[]; return String(Math.max(...values) - Math.min(...values)) }
    case 'pictogram-read': return String((p.counts as number[]).reduce((sum, v) => sum + v, 0) * n('unit'))
    case 'pattern-additive': return String(n('start') + n('step') * 3)
    case 'missing-add-sub': return String(n('sum') - n('a'))
    case 'count-objects': return String(n('a') + n('b'))
    case 'compare-length': return n('a') > n('b') ? 'A' : 'B'
    case 'compare-weight': return n('a') > n('b') ? 'A' : 'B'
    case 'compare-duration': return n('a') > n('b') ? 'A' : 'B'
    case 'fraction-half-quarter': return `1/${n('denominator')}`
    case 'pattern-shape': return String(p.first)
    case 'shape-recognition': return ({ 3: 'segitiga', 4: 'persegi', 5: 'segilima' } as Record<number, string>)[n('sides')]
    case 'position-objects': return String(p.position)
    case 'tally-read': return String(n('count'))
    case 'compose-shapes': return String(n('rows') * n('columns'))
    case 'length-convert': return String(n('meters') * 100)
    case 'mass-convert': return String(n('kg') * 1000)
    case 'shape-properties': return String(n('sides'))
    case 'area-composite-basic': return String(n('a') * n('b'))
    default: { const extra = extraAnswer(type, p); if (extra !== undefined) return extra; throw new Error(`Tipe soal belum didukung: ${typeId}`) }
  }
}

function promptBuild(typeId: string, rng: () => number, grade: number): Build {
  const type = canonicalType(typeId)
  const generator = build[type]
  if (!generator) throw new Error(`Generator tidak ditemukan: ${typeId}`)
  return generator(rng, grade)
}

const visualByType: Record<string, VisualKind> = {
  'whole-place-value': 'place-value', 'whole-compose': 'place-value', 'whole-compare': 'place-value', 'whole-order': 'number-line',
  'whole-add': 'place-value', 'whole-subtract': 'place-value', 'whole-multiply': 'place-value', 'whole-divide': 'place-value',
  'fraction-compare': 'fraction-bar', 'fraction-order': 'fraction-bar', 'fraction-equivalent': 'fraction-bar', 'fraction-simplify': 'fraction-bar',
  'fraction-identify': 'fraction-bar', 'fraction-subtract-same': 'fraction-bar', 'fraction-improper-to-mixed': 'fraction-bar', 'fraction-mixed-to-improper': 'fraction-bar', 'fraction-word-add': 'fraction-bar', 'fraction-word-subtract': 'fraction-bar',
  'fraction-add-same': 'fraction-bar', 'fraction-add-different': 'fraction-bar', 'fraction-subtract-different': 'fraction-bar', 'fraction-multiply-whole': 'fraction-bar', 'fraction-divide-whole': 'fraction-bar', 'fraction-of-quantity': 'fraction-bar', 'fraction-to-decimal': 'number-line',
  'decimal-compare': 'number-line', 'decimal-order': 'number-line', 'decimal-place': 'place-value', 'decimal-add': 'place-value', 'decimal-subtract': 'place-value', 'decimal-to-fraction': 'fraction-bar',
  'perimeter-square': 'grid', 'perimeter-rectangle': 'grid', 'perimeter-triangle': 'grid', 'area-square': 'grid', 'area-rectangle': 'grid', 'area-triangle': 'grid', 'area-composite': 'grid', 'area-composite-basic': 'grid',
  'angle-measure': 'angle', 'duration-calculate': 'number-line', 'table-frequency': 'chart', 'bar-chart-read': 'chart', 'pictogram-read': 'chart',
}

function shuffleChoices(values: string[], rng: () => number): string[] {
  const copy = [...values]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function generateQuestion(typeId: string, topicId: string, rng: () => number = Math.random, grade = 5, difficulty = 2): LearningQuestion {
  const adaptiveGrade = Math.min(6, Math.max(1, grade + (difficulty <= 1 ? -1 : difficulty >= 4 ? 1 : 0)))
  const data = promptBuild(typeId, rng, adaptiveGrade)
  return {
    id: `${typeId}-${Math.floor(rng() * 1_000_000_000).toString(36)}`,
    typeId,
    topicId,
    ...data,
    choices: data.choices && data.choices.length > 2 ? shuffleChoices(data.choices, rng) : data.choices,
    visual: data.visual ?? visualByType[canonicalType(typeId)] ?? 'none',
  }
}

function normalizeAnswer(value: string): string {
  return value.trim().replace(/\s+/g, ' ').replace(/,/g, ',').replace(/\s*[–-]\s*/g, ' – ').toLowerCase()
}

export function solveQuestion(question: Pick<LearningQuestion, 'typeId' | 'params'>): string {
  return independentAnswer(question.typeId, question.params)
}

export function checkAnswer(question: Pick<LearningQuestion, 'typeId' | 'params'>, answer: string): boolean {
  const expected = solveQuestion(question)
  if (normalizeAnswer(answer) === normalizeAnswer(expected)) return true
  if (/^-?\d+,\d+$/.test(expected) && /^-?\d+[.,]\d+$/.test(answer.trim())) return Number(answer.replace(',', '.')) === Number(expected.replace(',', '.'))
  if (!STRICT_FRACTION_TYPES.has(question.typeId) && sameFractionValue(answer, expected)) return true
  if (expected.includes(',')) return normalizeAnswer(answer).replace(/\s*,\s*/g, ',') === normalizeAnswer(expected).replace(/\s*,\s*/g, ',')
  if (expected.includes(':')) return normalizeAnswer(answer).replace(/\s*:\s*/g, ':') === expected
  if (expected.includes('/')) return normalizeAnswer(answer).replace(/\s*\/\s*/g, '/') === expected
  if (expected.endsWith('%')) return normalizeAnswer(answer).replace(/\s/g, '').replace(/%$/, '') === expected.toLowerCase().replace(/%$/, '')
  const numericAnswer = Number(answer.replace(',', '.'))
  const numericExpected = Number(expected.replace(',', '.'))
  return Number.isFinite(numericAnswer) && Number.isFinite(numericExpected) && Math.abs(numericAnswer - numericExpected) < 0.000001
}

export function availableQuestionTypes(): string[] {
  return Object.keys(build).concat(Object.keys(aliases))
}

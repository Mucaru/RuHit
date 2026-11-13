import { solveQuestion } from './engine'
import { gcd } from './fractions'
import type { LearningQuestion } from './types'

/**
 * Langkah penyelesaian bertahap yang dipakai Biji (maskot) dan halaman materi.
 * Semua angka dihitung ulang dari params soal, jadi selalu cocok dengan soalnya.
 */
export type SolutionStep = { title: string; text: string; final?: boolean }

const f = (n: number, d: number) => `${n}/${d}`
const lcm = (a: number, b: number) => (a * b) / gcd(a, b)
const multiples = (n: number, upTo: number) => Array.from({ length: Math.floor(upTo / n) }, (_, i) => n * (i + 1))
const step = (title: string, text: string): SolutionStep => ({ title, text })
const simplifyText = (n: number, d: number): SolutionStep => {
  const g = gcd(n, d)
  if (g > 1) return step('Sederhanakan', `${f(n, d)} masih bisa disederhanakan. Atas dan bawah sama-sama bisa dibagi ${g}: ${n} ÷ ${g} = ${n / g} dan ${d} ÷ ${g} = ${d / g}. Jadi hasilnya ${f(n / g, d / g)}.`)
  return step('Cek lagi', `${f(n, d)} sudah paling sederhana, karena tidak ada angka (selain 1) yang bisa membagi atas dan bawah sekaligus.`)
}

function withAnswer(steps: SolutionStep[], question: LearningQuestion): SolutionStep[] {
  return [...steps, { title: 'Jawabanmu', text: `Jawabannya ${solveQuestion(question)}. Keren, kamu bisa mengikuti caranya!`, final: true }]
}

export function solutionSteps(question: LearningQuestion): SolutionStep[] {
  const p = question.params
  const n = (key: string) => Number(p[key])
  switch (question.typeId) {
    case 'fraction-identify':
      return withAnswer([
        step('Hitung semua bagiannya', `Batang ini dibagi jadi ${n('d')} bagian sama besar. Angka ${n('d')} ini menjadi penyebut (angka di bawah).`),
        step('Hitung bagian yang diarsir', `Yang berwarna ada ${n('n')} bagian. Angka ${n('n')} ini menjadi pembilang (angka di atas).`),
        step('Tulis pecahannya', `Pembilang di atas, penyebut di bawah: ${f(n('n'), n('d'))}. Dibaca "${n('n')} per ${n('d')}".`),
      ], question)

    case 'fraction-half-quarter':
      return withAnswer([
        step('Hitung seluruh bagian', `Benda dibagi menjadi ${n('denominator')} bagian sama besar.`),
        step('Ambil satu bagian', `Kita ambil 1 bagian dari ${n('denominator')} bagian, jadi pembilangnya 1.`),
        step('Tulis', `Satu dari ${n('denominator')} bagian ditulis ${f(1, n('denominator'))}.`),
      ], question)

    case 'fraction-equivalent': {
      const nn = n('n'); const d = n('d'); const k = n('factor')
      return withAnswer([
        step('Lihat penyebutnya', `Penyebut berubah dari ${d} menjadi ${d * k}. Potongannya dipotong lagi jadi lebih kecil.`),
        step('Cari kali berapa', `${d} × ${k} = ${d * k}. Jadi penyebutnya dikali ${k}.`),
        step('Atas ikut dikali', `Biar nilainya sama, pembilang harus dikali ${k} juga: ${nn} × ${k} = ${nn * k}.`),
        step('Hasil', `${f(nn, d)} = ${f(nn * k, d * k)}. Bentuknya beda, nilainya sama!`),
      ], question)
    }

    case 'fraction-simplify': {
      const nn = n('n'); const d = n('d'); const g = gcd(nn, d)
      return withAnswer([
        step('Cari pembagi bersama', `Cari bilangan yang bisa membagi ${nn} dan ${d} sampai habis. Bilangan terbesarnya adalah ${g}.`),
        step('Bagi atas', `${nn} ÷ ${g} = ${nn / g}.`),
        step('Bagi bawah', `${d} ÷ ${g} = ${d / g}.`),
        step('Hasil', `${f(nn, d)} sama dengan ${f(nn / g, d / g)}. Ini sudah paling sederhana.`),
      ], question)
    }

    case 'fraction-compare': {
      const a = n('a'); const b = n('b'); const c = n('c'); const d = n('d'); const l = lcm(b, d)
      const left = a * (l / b); const right = c * (l / d)
      return withAnswer([
        step('Penyebutnya beda', `A = ${f(a, b)} dan B = ${f(c, d)}. Potongannya beda ukuran, jadi belum bisa dibandingkan langsung.`),
        step('Samakan penyebut', `Cari penyebut sama untuk ${b} dan ${d}. Kelipatan terkecil yang sama adalah ${l}.`),
        step('Ubah kedua pecahan', `A: ${f(a, b)} = ${f(left, l)} (atas dan bawah dikali ${l / b}). B: ${f(c, d)} = ${f(right, l)} (atas dan bawah dikali ${l / d}).`),
        step('Lihat pembilangnya', `Penyebut sudah sama, jadi lihat pembilangnya: ${left} dan ${right}. ${left > right ? `${left} lebih besar, jadi A lebih besar.` : `${right} lebih besar, jadi B lebih besar.`}`),
      ], question)
    }

    case 'fraction-order':
      return withAnswer([
        step('Lihat penyebut', `Semua pecahan punya penyebut ${n('d')}, jadi potongannya sama besar.`),
        step('Bandingkan pembilang', 'Kalau potongannya sama besar, pembilang yang lebih kecil berarti lebih sedikit potongan, jadi pecahannya lebih kecil.'),
        step('Urutkan', 'Susun pembilang dari yang paling kecil ke yang paling besar.'),
      ], question)

    case 'fraction-add-same':
    case 'fraction-word-add': {
      const a = n('a'); const b = n('b'); const d = n('d')
      return withAnswer([
        step('Lihat penyebutnya', `Kedua pecahan punya penyebut ${d}. Artinya potongannya sama besar, jadi langsung bisa digabung.`),
        step('Jumlahkan pembilang', `Tambah banyak potongannya: ${a} + ${b} = ${a + b}.`),
        step('Penyebut tetap', `Ukuran potongan tidak berubah, jadi penyebut tetap ${d}. Hasil sementara ${f(a + b, d)}.`),
        simplifyText(a + b, d),
      ], question)
    }

    case 'fraction-subtract-same':
    case 'fraction-word-subtract': {
      const a = n('a'); const b = n('b'); const d = n('d')
      return withAnswer([
        step('Lihat penyebutnya', `Kedua pecahan punya penyebut ${d}, jadi potongannya sama besar.`),
        step('Kurangkan pembilang', `Ambil potongan yang dikurangi: ${a} − ${b} = ${a - b}.`),
        step('Penyebut tetap', `Ukuran potongan tidak berubah, jadi penyebut tetap ${d}. Hasil sementara ${f(a - b, d)}.`),
        simplifyText(a - b, d),
      ], question)
    }

    case 'fraction-add-different':
    case 'fraction-subtract-different': {
      const a = n('a'); const d1 = n('d1'); const b = n('b'); const d2 = n('d2'); const l = lcm(d1, d2)
      const add = question.typeId === 'fraction-add-different'
      const x = a * (l / d1); const y = b * (l / d2); const result = add ? x + y : x - y
      return withAnswer([
        step('Penyebutnya beda', `${f(a, d1)} dan ${f(b, d2)} punya potongan berbeda ukuran. Kita harus samakan dulu penyebutnya sebelum ${add ? 'menjumlahkan' : 'mengurangkan'}.`),
        step('Cari penyebut yang sama', `Kelipatan ${d1}: ${multiples(d1, l).join(', ')}. Kelipatan ${d2}: ${multiples(d2, l).join(', ')}. Angka yang sama pertama kali adalah ${l}.`),
        step('Ubah pecahan pertama', `${f(a, d1)}: ${d1} × ${l / d1} = ${l}, jadi atasnya juga × ${l / d1}. ${a} × ${l / d1} = ${x}. Jadi ${f(a, d1)} = ${f(x, l)}.`),
        step('Ubah pecahan kedua', `${f(b, d2)}: ${d2} × ${l / d2} = ${l}, jadi atasnya juga × ${l / d2}. ${b} × ${l / d2} = ${y}. Jadi ${f(b, d2)} = ${f(y, l)}.`),
        step(add ? 'Jumlahkan' : 'Kurangkan', `Sekarang penyebutnya sama (${l}). ${x} ${add ? '+' : '−'} ${y} = ${result}. Hasilnya ${f(result, l)}.`),
        simplifyText(result, l),
      ], question)
    }

    case 'fraction-multiply-whole': {
      const nn = n('n'); const d = n('d'); const w = n('whole')
      return withAnswer([
        step('Bayangkan berulang', `${w} × ${f(nn, d)} artinya ${f(nn, d)} diambil ${w} kali: ${Array.from({ length: w }, () => f(nn, d)).join(' + ')}.`),
        step('Kalikan pembilang', `Jumlah potongan jadi ${w} × ${nn} = ${w * nn}.`),
        step('Penyebut tetap', `Ukuran potongan tidak berubah, penyebut tetap ${d}. Hasil sementara ${f(w * nn, d)}.`),
        simplifyText(w * nn, d),
      ], question)
    }

    case 'fraction-divide-whole': {
      const nn = n('n'); const d = n('d'); const w = n('whole')
      return withAnswer([
        step('Bayangkan membagi rata', `${f(nn, d)} dibagi ${w} artinya ${f(nn, d)} dibagikan rata ke ${w} bagian.`),
        step('Potongan makin kecil', `Setiap potongan dipotong lagi menjadi ${w} bagian. Jadi jumlah potongan seluruhnya jadi ${d} × ${w} = ${d * w}. Penyebut jadi ${d * w}.`),
        step('Pembilang tetap', `Banyak potongan yang diambil tetap ${nn}. Hasil sementara ${f(nn, d * w)}.`),
        simplifyText(nn, d * w),
      ], question)
    }

    case 'fraction-of-quantity': {
      const nn = n('n'); const d = n('d'); const total = n('total'); const group = total / d
      return withAnswer([
        step('Bagi jadi kelompok', `Penyebut ${d} artinya semuanya dibagi jadi ${d} kelompok sama banyak. ${total} ÷ ${d} = ${group}.`),
        step('Isi satu kelompok', `Satu kelompok berisi ${group}.`),
        step('Ambil sesuai pembilang', `Pembilang ${nn} artinya kita ambil ${nn} kelompok. ${nn} × ${group} = ${nn * group}.`),
      ], question)
    }

    case 'fraction-improper-to-mixed': {
      const nn = n('n'); const d = n('d'); const w = Math.floor(nn / d); const r = nn % d
      return withAnswer([
        step('Cek ukurannya', `${f(nn, d)} pembilangnya lebih besar dari penyebut, artinya lebih dari 1 utuh.`),
        step('Bagi', `${nn} ÷ ${d} = ${w} sisa ${r}. Hasil bagi ${w} adalah banyaknya utuh.`),
        step('Sisa jadi pecahan', `Sisanya ${r} menjadi pembilang, penyebut tetap ${d}: ${f(r, d)}.`),
        step('Gabungkan', `${f(nn, d)} = ${w} ${f(r, d)}.`),
      ], question)
    }

    case 'fraction-mixed-to-improper': {
      const w = n('w'); const nn = n('n'); const d = n('d')
      return withAnswer([
        step('Ubah utuh jadi potongan', `1 utuh = ${f(d, d)}. Jadi ${w} utuh = ${w} × ${d} = ${w * d} potongan.`),
        step('Tambah sisa potongan', `${w * d} + ${nn} = ${w * d + nn} potongan.`),
        step('Penyebut tetap', `Ukuran potongan tetap ${d}. Jadi hasilnya ${f(w * d + nn, d)}.`),
      ], question)
    }

    case 'fraction-to-decimal': {
      const nn = n('n'); const d = n('d'); const target = d === 4 ? 100 : 10; const k = target / d
      return withAnswer([
        step('Ubah penyebut jadi 10 atau 100', `Penyebut ${d} bisa diubah jadi ${target}, karena ${d} × ${k} = ${target}.`),
        step('Kalikan atas dan bawah', `${nn} × ${k} = ${nn * k}. Jadi ${f(nn, d)} = ${f(nn * k, target)}.`),
        step('Tulis sebagai desimal', target === 10 ? `${nn * k} per 10 artinya ${nn * k} persepuluhan, ditulis 0,${nn * k}.` : `${nn * k} per 100 artinya ${nn * k} perseratusan, ditulis 0,${nn * k}.`),
      ], question)
    }

    case 'fraction-percent': {
      const nn = n('n'); const d = n('d'); const k = 100 / d
      return withAnswer([
        step('Ingat arti persen', 'Persen artinya "per seratus". 50% = 50 per 100.'),
        step('Ubah penyebut jadi 100', `${d} × ${k} = 100, jadi atas juga dikali ${k}: ${nn} × ${k} = ${nn * k}.`),
        step('Tulis persen', `${f(nn, d)} = ${f(nn * k, 100)} = ${nn * k}%.`),
      ], question)
    }

    default:
      return withAnswer([
        step('Pahami soalnya', question.hints[0]),
        step('Pikirkan caranya', question.hints[1]),
        step('Kerjakan pelan-pelan', question.hints[2]),
        step('Cek hasilnya', question.explanation),
      ], question)
  }
}

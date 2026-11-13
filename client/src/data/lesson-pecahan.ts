import { generateQuestion } from '../lib/learning/engine'
import type { LearningQuestion, QuestionParams } from '../lib/learning/types'

/**
 * Materi Pecahan Ruang Hitung: 12 bab, dari mengenal pecahan sampai desimal dan persen.
 * Contoh tiap bab diambil dari generator soal yang sama dengan latihan (angka dipilih lewat
 * predikat `where`), sehingga langkah dari Biji selalu cocok dengan soalnya.
 */
export type LessonChapter = {
  id: string
  emoji: string
  title: string
  short: string
  idea: string
  story: string
  rules: string[]
  mistake: string
  exampleType: string
  where: (params: QuestionParams) => boolean
  focus: string[]
}

export const pecahanChapters: LessonChapter[] = [
  {
    id: 'kenalan', emoji: '🍕', title: 'Kenalan dengan pecahan', short: 'Kenalan',
    idea: 'Pecahan adalah cara menulis bagian dari satu benda utuh yang dibagi sama besar.',
    story: 'Ibu membeli satu pizza lalu memotongnya menjadi 4 potong sama besar. Kamu makan 1 potong. Berarti kamu makan 1/4 pizza. Dibacanya "satu per empat".',
    rules: ['Angka bawah (penyebut) = ada berapa potong seluruhnya.', 'Angka atas (pembilang) = berapa potong yang diambil.', 'Semua potongan harus sama besar.'],
    mistake: 'Sering tertukar atas dan bawah. Ingat: bawah = semuanya, atas = yang diambil.',
    exampleType: 'fraction-identify', where: (p) => p.d === 4 && p.n === 3, focus: ['fraction-identify'],
  },
  {
    id: 'senilai', emoji: '🟰', title: 'Pecahan senilai', short: 'Senilai',
    idea: 'Pecahan boleh ditulis berbeda, tetapi nilainya sama.',
    story: 'Setengah pizza (1/2) sama banyaknya dengan 2 dari 4 potong pizza (2/4). Potongannya jadi lebih kecil dan lebih banyak, tetapi bagian yang kamu makan tetap sama.',
    rules: ['Kalikan atas dan bawah dengan angka yang SAMA.', 'Atau bagi atas dan bawah dengan angka yang SAMA.', 'Jangan hanya mengubah salah satunya.'],
    mistake: 'Mengubah penyebut saja tanpa mengubah pembilang. Nilainya jadi berubah!',
    exampleType: 'fraction-equivalent', where: (p) => p.factor === 3 && Number(p.d) <= 4, focus: ['fraction-equivalent'],
  },
  {
    id: 'sederhana', emoji: '✂️', title: 'Menyederhanakan pecahan', short: 'Sederhana',
    idea: 'Menyederhanakan berarti membuat angkanya sekecil mungkin tanpa mengubah nilainya.',
    story: 'Kamu makan 4 dari 8 potong pizza. Itu sama saja dengan 1 dari 2 potong. Kita menggabung potongan kecil jadi potongan besar.',
    rules: ['Cari bilangan terbesar yang bisa membagi atas dan bawah.', 'Bagi atas dan bawah dengan bilangan itu.', 'Berhenti kalau tidak ada lagi pembagi selain 1.'],
    mistake: 'Hanya membagi atas atau bawah saja. Keduanya harus dibagi.',
    exampleType: 'fraction-simplify', where: (p) => Number(p.d) <= 12 && gcdNum(Number(p.n), Number(p.d)) === 3, focus: ['fraction-simplify'],
  },
  {
    id: 'bandingkan', emoji: '⚖️', title: 'Membandingkan pecahan', short: 'Bandingkan',
    idea: 'Untuk membandingkan, samakan dulu ukuran potongannya (penyebut).',
    story: 'Mana lebih besar: 1/2 pizza atau 1/3 pizza? Kalau pizza dibagi 2, potongannya besar. Kalau dibagi 3, potongannya lebih kecil. Jadi 1/2 lebih besar daripada 1/3.',
    rules: ['Penyebut sama: pembilang lebih besar = pecahan lebih besar.', 'Penyebut beda: samakan dulu penyebutnya.', 'Penyebut besar BUKAN berarti pecahan besar.'],
    mistake: 'Mengira 1/8 lebih besar dari 1/4 karena 8 lebih besar dari 4.',
    exampleType: 'fraction-compare', where: (p) => p.b === 3 && p.d === 4, focus: ['fraction-compare', 'fraction-order'],
  },
  {
    id: 'tambah-sama', emoji: '➕', title: 'Menjumlahkan: penyebut sama', short: 'Tambah',
    idea: 'Kalau potongannya sama besar, kita tinggal menambah banyak potongannya.',
    story: 'Adi makan 1/6 pizza, Budi makan 2/6 pizza. Potongannya sama besar, jadi 1 potong + 2 potong = 3 potong dari 6 potong, yaitu 3/6 atau 1/2.',
    rules: ['Jumlahkan pembilangnya.', 'Penyebut TIDAK berubah.', 'Sederhanakan hasilnya kalau bisa.'],
    mistake: 'Ikut menjumlahkan penyebut (1/6 + 2/6 ≠ 3/12).',
    exampleType: 'fraction-add-same', where: (p) => p.d === 6 && p.a === 1 && p.b === 2, focus: ['fraction-add-same', 'fraction-word-add'],
  },
  {
    id: 'kurang-sama', emoji: '➖', title: 'Mengurangkan: penyebut sama', short: 'Kurang',
    idea: 'Mengurangkan pecahan berpenyebut sama caranya mirip dengan menjumlahkan.',
    story: 'Di piring ada 5/8 bagian kue. Kamu makan 2/8 bagian. Sisanya 5 potong − 2 potong = 3 potong dari 8, yaitu 3/8.',
    rules: ['Kurangkan pembilangnya.', 'Penyebut TIDAK berubah.', 'Sederhanakan hasilnya kalau bisa.'],
    mistake: 'Mengurangkan penyebut juga. Ukuran potongan tidak boleh berubah.',
    exampleType: 'fraction-subtract-same', where: (p) => p.d === 8 && p.a === 5 && p.b === 2, focus: ['fraction-subtract-same', 'fraction-word-subtract'],
  },
  {
    id: 'beda-penyebut', emoji: '🧩', title: 'Penyebut berbeda', short: 'Beda penyebut',
    idea: 'Kalau penyebutnya beda, ubah dulu supaya penyebutnya sama. Baru jumlahkan atau kurangkan.',
    story: '1/2 pizza dan 1/3 pizza punya potongan berbeda ukuran. Kita potong ulang keduanya menjadi 6 bagian: 1/2 = 3/6 dan 1/3 = 2/6. Sekarang potongannya sama, jadi 3/6 + 2/6 = 5/6.',
    rules: ['Cari kelipatan yang sama dari kedua penyebut.', 'Ubah kedua pecahan: atas dan bawah dikali angka yang sama.', 'Jumlahkan/kurangkan pembilang, penyebut tetap.'],
    mistake: 'Langsung menjumlahkan atas dengan atas dan bawah dengan bawah.',
    exampleType: 'fraction-add-different', where: (p) => p.d1 === 2 && p.d2 === 3 && p.a === 1 && p.b === 1, focus: ['fraction-add-different', 'fraction-subtract-different'],
  },
  {
    id: 'campuran', emoji: '🥧', title: 'Pecahan campuran', short: 'Campuran',
    idea: 'Pecahan campuran terdiri dari bilangan utuh dan pecahan, misalnya 2 1/3.',
    story: 'Kamu punya 2 pizza utuh dan 1/3 pizza. Kita tulis 2 1/3. Kalau semuanya dipotong jadi sepertiga, ada 7 potong, jadi 7/3.',
    rules: ['Biasa → campuran: bagi pembilang dengan penyebut. Hasil bagi = utuh, sisa = pembilang baru.', 'Campuran → biasa: utuh × penyebut, lalu tambah pembilang.', 'Penyebut tetap sama.'],
    mistake: 'Lupa mengalikan bilangan utuh dengan penyebut.',
    exampleType: 'fraction-improper-to-mixed', where: (p) => p.d === 3 && p.w === 2 && p.r === 1, focus: ['fraction-improper-to-mixed', 'fraction-mixed-to-improper'],
  },
  {
    id: 'kali', emoji: '✖️', title: 'Pecahan × bilangan asli', short: 'Kali',
    idea: 'Mengalikan dengan bilangan asli sama dengan menambah pecahan itu berulang kali.',
    story: '3 × 2/5 artinya 2/5 + 2/5 + 2/5 = 6/5. Cepatnya: 3 × 2 = 6 potong, potongannya tetap seperlima.',
    rules: ['Kalikan bilangan asli dengan pembilang.', 'Penyebut TIDAK berubah.', 'Sederhanakan kalau bisa.'],
    mistake: 'Mengalikan bilangan asli dengan penyebut juga.',
    exampleType: 'fraction-multiply-whole', where: (p) => p.n === 2 && p.d === 5 && p.whole === 3, focus: ['fraction-multiply-whole'],
  },
  {
    id: 'bagi', emoji: '➗', title: 'Pecahan ÷ bilangan asli', short: 'Bagi',
    idea: 'Membagi pecahan berarti memotong potongannya lagi menjadi lebih kecil.',
    story: 'Kamu punya 1/2 pizza dan membaginya rata untuk 2 orang. Setiap potong dibelah dua, jadi tiap orang dapat 1/4 pizza.',
    rules: ['Kalikan penyebut dengan bilangan pembagi.', 'Pembilang TIDAK berubah.', 'Hasilnya lebih kecil dari pecahan awal.'],
    mistake: 'Membagi pembilang. Padahal potongannya yang dibelah, jadi penyebutnya yang berubah.',
    exampleType: 'fraction-divide-whole', where: (p) => p.n === 1 && p.d === 2 && p.whole === 2, focus: ['fraction-divide-whole'],
  },
  {
    id: 'dari-jumlah', emoji: '🎯', title: 'Pecahan dari jumlah benda', short: 'Dari jumlah',
    idea: 'Untuk mencari pecahan dari sekumpulan benda: bagi dulu, baru ambil.',
    story: 'Ada 20 anak, 3/4 memakai jersey merah. Bagi 20 anak jadi 4 kelompok, tiap kelompok 5 anak. Ambil 3 kelompok: 3 × 5 = 15 anak.',
    rules: ['Bagi jumlah benda dengan penyebut.', 'Kalikan hasilnya dengan pembilang.', 'Jawabannya berupa banyak benda.'],
    mistake: 'Mengalikan jumlah benda dengan penyebut.',
    exampleType: 'fraction-of-quantity', where: (p) => p.n === 3 && p.d === 4 && p.total === 20, focus: ['fraction-of-quantity'],
  },
  {
    id: 'desimal-persen', emoji: '💯', title: 'Pecahan, desimal, dan persen', short: 'Desimal & persen',
    idea: 'Pecahan, desimal, dan persen adalah tiga cara menulis nilai yang sama.',
    story: '1/4 pizza sama dengan 0,25 pizza, sama dengan 25% pizza. Kuncinya: ubah penyebutnya menjadi 10 atau 100.',
    rules: ['Persen artinya "per 100".', 'Ubah penyebut jadi 10 atau 100 dengan perkalian.', '25/100 = 0,25 = 25%.'],
    mistake: 'Salah menaruh koma, misalnya menulis 1/4 = 1,4.',
    exampleType: 'fraction-to-decimal', where: (p) => p.n === 1 && p.d === 4, focus: ['fraction-to-decimal', 'fraction-percent'],
  },
]

function gcdNum(a: number, b: number): number { return b === 0 ? a : gcdNum(b, a % b) }

function mulberry32(seed: number) {
  let t = seed
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), t | 1)
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

/** Cari soal contoh yang memenuhi predikat. Hasilnya deterministik dan tidak berubah antar render. */
export function findExample(chapter: LessonChapter, topicId: string): { question: LearningQuestion; exact: boolean } {
  let fallback: LearningQuestion | null = null
  for (let seed = 1; seed <= 6000; seed += 1) {
    const question = generateQuestion(chapter.exampleType, topicId, mulberry32(seed), 5, 2)
    fallback ??= question
    if (chapter.where(question.params)) return { question, exact: true }
  }
  return { question: fallback as LearningQuestion, exact: false }
}

export const lessonsByTopic: Record<string, LessonChapter[]> = {
  'pecahan-operasi': pecahanChapters,
  'pecahan-b': pecahanChapters.filter((chapter) => ['kenalan', 'senilai', 'sederhana', 'bandingkan'].includes(chapter.id)),
}

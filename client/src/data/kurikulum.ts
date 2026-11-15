/**
 * Peta belajar Ruang Hitung berdasarkan CP Matematika pada KepKaBSKAP 046/H/KR/2025.
 * CP resmi ditetapkan per fase (A: kelas 1-2, B: 3-4, C: 5-6), bukan per kelas.
 * Pembagian kelas di bawah adalah urutan belajar yang diusulkan, bukan ATP resmi nasional.
 */
export type Elemen = 'Bilangan' | 'Aljabar' | 'Pengukuran' | 'Geometri' | 'Analisis Data & Peluang'
export type Fase = 'A' | 'B' | 'C'
export type Topic = {
  id: string
  slug: string
  title: string
  description: string
  element: Elemen
  phase: Fase
  classes: number[]
  objectives: string[]
  generatorTypes: string[]
  misconception: string
  visual: 'place-value' | 'fraction-bar' | 'number-line' | 'grid' | 'angle' | 'chart' | 'blocks' | 'none'
  sources: string[]
  note?: string
}

export const curriculumSources = {
  cp2025: {
    id: 'cp2025',
    title: 'Keputusan Kepala BSKAP Nomor 046/H/KR/2025 — Capaian Pembelajaran',
    url: 'https://bpmpbabel.kemendikdasmen.go.id/PPID/wp-content/uploads/2025/07/KepKaBSKAP-046_2025-ttg-CP.pdf',
    detail: 'Lampiran II, IV.1 Capaian Pembelajaran Matematika; fase A, B, dan C.',
  },
  panduan2025: {
    id: 'panduan2025',
    title: 'Panduan Mata Pelajaran Matematika Fase A–F (BSKAP, 2025)',
    url: 'https://repositori.kemendikdasmen.go.id/33608/',
    detail: 'Panduan implementasi dan contoh pengembangan pembelajaran Matematika.',
  },
  cpaIes: {
    id: 'cpaIes',
    title: 'IES / What Works Clearinghouse — Assisting Students Struggling with Mathematics',
    url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/26',
    detail: 'Strong evidence: systematic instruction, mathematical language, concrete/semi-concrete representations, number lines, and word problems.',
  },
  cpaToolkit: {
    id: 'cpaToolkit',
    title: 'IES REL — Mathematics Support Grades 3–6, Representations',
    url: 'https://ies.ed.gov/ncee/rel/math-support-grades-3-6/',
    detail: 'Menghubungkan model konkret, gambar/diagram, dan simbol; fleksibel sesuai tujuan belajar.',
  },
  fractionReview: {
    id: 'fractionReview',
    title: 'Sunandar et al. — Desain Pembelajaran untuk Miskonsepsi Pecahan pada Siswa SD (2026)',
    url: 'https://www.journal.unpas.ac.id/index.php/pendas/article/view/42836',
    detail: 'Systematic review 48 artikel: miskonsepsi konsep dasar, perbandingan/pengurutan, dan operasi pecahan.',
  },
  decimalMisconception: {
    id: 'decimalMisconception',
    title: 'Misconceptions of Elementary School Students about Comparing Decimal Numbers (2014)',
    url: 'https://www.sciencedirect.com/science/article/pii/S1877042814053129',
    detail: 'Mengidentifikasi whole-number rule, fraction rule, dan zero rule pada perbandingan desimal.',
  },
  areaPerimeter: {
    id: 'areaPerimeter',
    title: 'Winarti et al. — Learning the Concept of Area and Perimeter by Exploring Their Relation (2012)',
    url: 'https://eric.ed.gov/?id=EJ1078518',
    detail: 'Miskonsepsi umum: luas sama dianggap selalu memiliki keliling sama.',
  },
  measurement: {
    id: 'measurement',
    title: 'Tan Sisman & Aksu — Misconceptions and Errors in Spatial Measurement (2016)',
    url: 'https://eric.ed.gov/?id=EJ1112633',
    detail: 'Kesalahan pada panjang, luas, dan volume termasuk tertukarnya rumus luas dan keliling.',
  },
  angle: {
    id: 'angle',
    title: 'Devichi & Munier — About the Concept of Angle in Elementary School (2013)',
    url: 'https://eric.ed.gov/?id=EJ995568',
    detail: 'Hambatan: mengukur sudut dari panjang kaki sudut dan terpaku pada sudut siku-siku.',
  },
  dataPrivacy: {
    id: 'dataPrivacy',
    title: 'Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi',
    url: 'https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022-10',
    detail: 'Rujukan prinsip minimisasi data dan pelindungan data pribadi.',
  },
} as const

const cp = ['cp2025']
const phaseB = ['cp2025', 'panduan2025']
const phaseC = ['cp2025', 'panduan2025']

export const topics: Topic[] = [
  // Fase A: urutan kelas di sini adalah pembagian pembelajaran yang diusulkan.
  { id: 'bilangan-20', slug: 'bilangan-sampai-20', title: 'Bilangan sampai 20', description: 'Mengenal, membandingkan, dan menyusun bilangan kecil.', element: 'Bilangan', phase: 'A', classes: [1], objectives: ['Membaca dan menulis bilangan cacah sampai 20.', 'Membandingkan dan mengurutkan bilangan menggunakan benda konkret.'], generatorTypes: ['count-objects', 'compare-whole'], misconception: 'Anak dapat membalik urutan angka atau membandingkan dari digit terakhir, bukan nilai bilangan.', visual: 'blocks', sources: cp },
  { id: 'operasi-dasar-a', slug: 'tambah-kurang-sampai-20', title: 'Tambah dan kurang sampai 20', description: 'Menggabungkan dan mengambil benda dengan gambar atau benda konkret.', element: 'Bilangan', phase: 'A', classes: [1, 2], objectives: ['Melakukan penjumlahan dan pengurangan sampai 20 dengan benda konkret atau gambar.'], generatorTypes: ['add-whole', 'subtract-whole'], misconception: 'Menganggap tanda sama dengan sebagai tanda untuk menulis jawaban, bukan hubungan kesetaraan.', visual: 'blocks', sources: cp },
  { id: 'pecahan-awal', slug: 'setengah-seperempat', title: 'Setengah dan seperempat', description: 'Membagi benda atau kumpulan benda menjadi bagian sama besar.', element: 'Bilangan', phase: 'A', classes: [2], objectives: ['Memahami setengah dan seperempat sebagai bagian dari keseluruhan yang dibagi sama banyak.'], generatorTypes: ['fraction-half-quarter'], misconception: 'Menyebut satu dari empat bagian sebagai seperempat walau ukuran bagiannya tidak sama.', visual: 'fraction-bar', sources: cp },
  { id: 'pola-gambar', slug: 'pola-gambar', title: 'Pola gambar dan bentuk', description: 'Melanjutkan pola warna, gambar, dan bentuk.', element: 'Aljabar', phase: 'A', classes: [1, 2], objectives: ['Mengenali, meniru, dan melanjutkan pola bukan bilangan.'], generatorTypes: ['pattern-shape'], misconception: 'Melihat satu perubahan saja dan melewatkan aturan pola yang berulang.', visual: 'none', sources: cp },
  { id: 'ukur-awal', slug: 'membandingkan-pengukuran', title: 'Membandingkan ukuran', description: 'Membandingkan panjang, berat, dan durasi dengan benda sekitar.', element: 'Pengukuran', phase: 'A', classes: [1, 2], objectives: ['Membandingkan panjang, berat, dan durasi secara langsung.', 'Mengukur dengan satuan tidak baku.'], generatorTypes: ['compare-length', 'compare-weight', 'compare-duration'], misconception: 'Menganggap benda yang tampak lebih besar selalu lebih berat atau durasinya lebih lama.', visual: 'blocks', sources: cp },
  { id: 'bangun-a', slug: 'bangun-datar-dan-ruang', title: 'Bangun datar dan ruang', description: 'Mengenali bentuk dan posisi benda di sekitar.', element: 'Geometri', phase: 'A', classes: [1, 2], objectives: ['Mengenali segitiga, segiempat, segi banyak, lingkaran, kubus, balok, kerucut, dan bola.', 'Menentukan posisi kanan, kiri, depan, belakang, atas, dan bawah.'], generatorTypes: ['shape-recognition', 'position-objects'], misconception: 'Mengelompokkan bangun hanya dari orientasi atau warna, bukan ciri bentuknya.', visual: 'none', sources: cp },
  { id: 'data-awal', slug: 'mengelompokkan-data', title: 'Mengelompokkan data', description: 'Menyortir benda, membuat turus, dan membaca piktogram sederhana.', element: 'Analisis Data & Peluang', phase: 'A', classes: [2], objectives: ['Mengurutkan, menyortir, mengelompokkan, membandingkan, dan menyajikan data dengan turus atau piktogram hingga empat kategori.'], generatorTypes: ['tally-read', 'pictogram-read'], misconception: 'Menghitung simbol piktogram satu per satu tanpa memperhatikan keterangan nilai tiap simbol.', visual: 'chart', sources: cp },

  // Fase B.
  { id: 'bilangan-10000', slug: 'bilangan-sampai-10000', title: 'Bilangan sampai 10.000', description: 'Nilai tempat, membandingkan, mengurutkan, dan mengurai bilangan.', element: 'Bilangan', phase: 'B', classes: [3, 4], objectives: ['Memahami bilangan cacah sampai 10.000.', 'Membaca, menulis, membandingkan, mengurutkan, serta melakukan komposisi dan dekomposisi bilangan.'], generatorTypes: ['whole-place-value', 'whole-compose', 'whole-compare', 'whole-order'], misconception: 'Nilai digit dibaca sebagai digit tunggal tanpa memperhatikan posisi satuan, puluhan, ratusan, atau ribuan.', visual: 'place-value', sources: phaseB },
  { id: 'operasi-b', slug: 'operasi-bilangan-kelas-3-4', title: 'Operasi bilangan', description: 'Tambah, kurang, kali, dan bagi dengan model gambar serta simbol.', element: 'Bilangan', phase: 'B', classes: [3, 4], objectives: ['Menyelesaikan penjumlahan dan pengurangan sampai 1.000.', 'Menyelesaikan perkalian dan pembagian sampai 100 dengan benda konkret, gambar, dan simbol.'], generatorTypes: ['whole-add', 'whole-subtract', 'whole-multiply', 'whole-divide'], misconception: 'Salah nilai tempat saat menyimpan/meminjam, atau menganggap pembagian selalu menghasilkan bilangan bulat.', visual: 'place-value', sources: phaseB },
  { id: 'faktor-kelipatan', slug: 'faktor-dan-kelipatan', title: 'Faktor dan kelipatan', description: 'Membedakan bilangan yang membagi habis dan hasil kelipatannya.', element: 'Bilangan', phase: 'B', classes: [4], objectives: ['Mengenal faktor dan kelipatan bilangan.'], generatorTypes: ['factor-list', 'prime-check'], misconception: 'Menukar pengertian faktor dengan kelipatan; mengira semua bilangan ganjil adalah prima.', visual: 'number-line', sources: phaseB },
  { id: 'pecahan-b', slug: 'pecahan-sederhana', title: 'Pecahan sederhana', description: 'Membandingkan, mengurutkan, dan mengenali pecahan senilai.', element: 'Bilangan', phase: 'B', classes: [3, 4], objectives: ['Membandingkan pecahan berpembilang satu dan pecahan berpenyebut sama.', 'Mengenali pecahan senilai.'], generatorTypes: ['fraction-identify', 'fraction-compare', 'fraction-equivalent', 'fraction-simplify'], misconception: 'Menganggap penyebut yang lebih besar selalu berarti pecahan lebih besar; membandingkan pembilang dan penyebut sebagai bilangan terpisah.', visual: 'fraction-bar', sources: ['cp2025', 'fractionReview'] },
  { id: 'desimal-persen-b', slug: 'desimal-dan-persen-dasar', title: 'Desimal dan persen dasar', description: 'Menghubungkan pecahan sederhana, desimal, dan persen.', element: 'Bilangan', phase: 'B', classes: [4], objectives: ['Memiliki intuisi bilangan desimal.', 'Menentukan representasi pecahan sebagai desimal dan persen.'], generatorTypes: ['decimal-compare', 'decimal-place', 'fraction-percent'], misconception: 'Membaca digit di belakang koma sebagai bilangan bulat terpisah; mengabaikan nol penanda tempat.', visual: 'number-line', sources: ['cp2025', 'decimalMisconception'], note: 'Materi ini diperkenalkan pada Fase B dan dapat diulang sebagai penguatan di kelas 5–6.' },
  { id: 'pola-b', slug: 'pola-bilangan-dasar', title: 'Pola bilangan dasar', description: 'Menemukan aturan pola yang bertambah atau berkurang.', element: 'Aljabar', phase: 'B', classes: [3, 4], objectives: ['Mengidentifikasi, meniru, dan mengembangkan pola bilangan membesar atau mengecil dengan penjumlahan dan pengurangan sampai 100.', 'Menemukan nilai yang belum diketahui pada kalimat penjumlahan dan pengurangan.'], generatorTypes: ['pattern-additive', 'missing-add-sub'], misconception: 'Menggunakan selisih satu pasangan angka saja tanpa menguji apakah aturan berlaku untuk seluruh pola.', visual: 'number-line', sources: phaseB },
  { id: 'ukur-b', slug: 'satuan-panjang-berat-luas-volume', title: 'Panjang, berat, luas, dan volume', description: 'Mengukur dan mengubah satuan dalam konteks sehari-hari.', element: 'Pengukuran', phase: 'B', classes: [3, 4], objectives: ['Menggunakan satuan baku panjang cm dan m serta berat g dan kg.', 'Menghubungkan satuan panjang dan berat.', 'Mengukur atau mengestimasi luas dan volume dengan satuan tidak baku maupun baku berupa bilangan cacah.'], generatorTypes: ['length-convert', 'mass-convert', 'volume-unit-cubes'], misconception: 'Menggunakan faktor konversi yang salah; mencampur keliling dengan luas atau satuan persegi dengan satuan panjang.', visual: 'grid', sources: ['cp2025', 'measurement'] },
  { id: 'geometri-b', slug: 'ciri-bangun-datar', title: 'Ciri bangun datar', description: 'Mengenali ciri dan menyusun atau mengurai bangun datar.', element: 'Geometri', phase: 'B', classes: [3, 4], objectives: ['Mendeskripsikan ciri segiempat, segitiga, dan segi banyak.', 'Menyusun dan mengurai bangun datar dengan lebih dari satu cara jika memungkinkan.'], generatorTypes: ['shape-properties', 'compose-shapes'], misconception: 'Menganggap persegi yang diputar bukan persegi karena orientasinya berubah.', visual: 'grid', sources: phaseB },
  { id: 'data-b', slug: 'tabel-piktogram-diagram-batang', title: 'Tabel dan diagram', description: 'Membaca, membandingkan, dan menyajikan data sederhana.', element: 'Analisis Data & Peluang', phase: 'B', classes: [3, 4], objectives: ['Mengurutkan, membandingkan, menyajikan, menganalisis, dan menginterpretasi data dalam tabel, diagram gambar, piktogram, dan diagram batang berskala satu satuan.'], generatorTypes: ['table-frequency', 'bar-chart-read', 'pictogram-read'], misconception: 'Membaca tinggi batang tanpa membaca skala atau salah membedakan kategori dan jumlah.', visual: 'chart', sources: phaseB },

  // Fase C. Distribusi kelas 5-6 adalah usulan urutan belajar, bukan pembagian CP resmi.
  { id: 'bilangan-besar', slug: 'bilangan-besar', title: 'Bilangan besar dan uang', description: 'Membaca nilai tempat hingga jutaan dan menyelesaikan masalah uang.', element: 'Bilangan', phase: 'C', classes: [5, 6], objectives: ['Memahami bilangan cacah sampai 1.000.000.', 'Membaca, menulis, membandingkan, mengurutkan, menyusun, dan mengurai bilangan.', 'Menyelesaikan masalah yang berkaitan dengan uang.'], generatorTypes: ['whole-place-value', 'whole-compose', 'whole-compare', 'whole-order', 'money-change'], misconception: 'Mengurutkan berdasarkan panjang digit atau mengabaikan posisi nol di tengah bilangan.', visual: 'place-value', sources: phaseC },
  { id: 'operasi-besar', slug: 'operasi-bilangan-besar', title: 'Operasi bilangan besar', description: 'Operasi hitung bilangan cacah sampai 100.000.', element: 'Bilangan', phase: 'C', classes: [5, 6], objectives: ['Melakukan operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan cacah sampai 100.000.'], generatorTypes: ['whole-add', 'whole-subtract', 'whole-multiply', 'whole-divide'], misconception: 'Salah menempatkan hasil simpanan atau menganggap nol di tengah hasil bagi boleh dihilangkan.', visual: 'place-value', sources: phaseC },
  { id: 'fpb-kpk', slug: 'fpb-kpk', title: 'FPB dan KPK', description: 'Menyelesaikan masalah pembagian kelompok dan jadwal berulang.', element: 'Bilangan', phase: 'C', classes: [5, 6], objectives: ['Menyelesaikan masalah yang berkaitan dengan faktor persekutuan terbesar dan kelipatan persekutuan terkecil.'], generatorTypes: ['factor-list', 'prime-check', 'gcd', 'lcm'], misconception: 'Tertukar kapan memakai FPB (membagi menjadi kelompok sama besar) dan KPK (menemukan waktu/kelipatan bersama).', visual: 'number-line', sources: phaseC },
  { id: 'pecahan-operasi', slug: 'pecahan', title: 'Pecahan dan operasinya', description: 'Membandingkan, mengurutkan, menjumlahkan, mengurangkan, mengalikan, dan membagi pecahan.', element: 'Bilangan', phase: 'C', classes: [5, 6], objectives: ['Membandingkan dan mengurutkan pecahan termasuk pecahan campuran.', 'Menjumlahkan dan mengurangkan pecahan.', 'Mengalikan dan membagi pecahan dengan bilangan asli.', 'Mengubah pecahan menjadi berbagai bentuk pecahan lain.'], generatorTypes: ['fraction-identify', 'fraction-compare', 'fraction-order', 'fraction-equivalent', 'fraction-simplify', 'fraction-add-same', 'fraction-word-add', 'fraction-subtract-same', 'fraction-word-subtract', 'fraction-add-different', 'fraction-subtract-different', 'fraction-improper-to-mixed', 'fraction-mixed-to-improper', 'fraction-multiply-whole', 'fraction-divide-whole', 'fraction-of-quantity', 'fraction-to-decimal', 'fraction-percent'], misconception: 'Menjumlahkan penyebut, menganggap pembilang dan penyebut sebagai bilangan bulat terpisah, atau mengalikan penyebut saat membagi pecahan dengan bilangan asli.', visual: 'fraction-bar', sources: ['cp2025', 'fractionReview'] },
  { id: 'desimal', slug: 'desimal', title: 'Bilangan desimal', description: 'Membandingkan, mengurutkan, dan memahami nilai tempat desimal satu angka di belakang koma.', element: 'Bilangan', phase: 'C', classes: [5, 6], objectives: ['Membandingkan dan mengurutkan bilangan desimal dengan satu angka di belakang koma.'], generatorTypes: ['decimal-compare', 'decimal-order', 'decimal-place', 'decimal-add', 'decimal-subtract', 'decimal-to-fraction'], misconception: 'Menerapkan aturan bilangan bulat pada digit setelah koma; misalnya mengira 0,8 lebih kecil dari 0,5 karena 8 < 5 (atau sebaliknya pada contoh dua digit).', visual: 'number-line', sources: ['cp2025', 'decimalMisconception'] },
  { id: 'persen-penguatan', slug: 'persen', title: 'Persen (penguatan)', description: 'Menghubungkan persen dengan pecahan dan desimal yang sudah dikenal.', element: 'Bilangan', phase: 'C', classes: [5, 6], objectives: ['Menggunakan representasi persen sebagai penguatan kompetensi Fase B tentang pecahan, desimal, dan persen.'], generatorTypes: ['fraction-percent', 'percent-of-number'], misconception: 'Menganggap 25% berarti 25 dari 10, atau salah menggeser nilai saat mengubah persen ke desimal.', visual: 'fraction-bar', sources: ['cp2025', 'decimalMisconception'], note: 'Penguatan Fase B; tidak dinyatakan sebagai butir CP baru Fase C.' },
  { id: 'rasio-proporsi', slug: 'rasio-dan-proporsi', title: 'Rasio dan proporsi', description: 'Membandingkan dua besaran dan mencari nilai per satuan.', element: 'Aljabar', phase: 'C', classes: [5, 6], objectives: ['Bernalar secara proporsional untuk menyelesaikan masalah sehari-hari dengan rasio satuan.', 'Menggunakan perkalian dan pembagian dalam masalah proporsi.'], generatorTypes: ['ratio-simplify', 'unit-rate', 'proportion'], misconception: 'Menggunakan penalaran aditif (menambah angka yang sama) ketika hubungan yang diperlukan bersifat perkalian.', visual: 'blocks', sources: phaseC },
  { id: 'pola-proporsional', slug: 'pola-dan-nilai-tak-diketahui', title: 'Pola dan nilai yang belum diketahui', description: 'Mencari aturan pola perkalian/pembagian dan nilai yang hilang.', element: 'Aljabar', phase: 'C', classes: [5, 6], objectives: ['Menemukan nilai yang belum diketahui pada kalimat matematika dengan empat operasi sampai 1.000.', 'Mengembangkan pola bilangan membesar dan mengecil yang melibatkan perkalian dan pembagian.'], generatorTypes: ['pattern-multiplicative', 'missing-multiply-divide'], misconception: 'Meneruskan pola berdasarkan selisih tetap meskipun aturan sebenarnya perkalian atau pembagian.', visual: 'number-line', sources: phaseC },
  { id: 'keliling-luas', slug: 'keliling-dan-luas', title: 'Keliling dan luas', description: 'Menghitung tepi dan bagian dalam bangun datar serta gabungannya.', element: 'Pengukuran', phase: 'C', classes: [5, 6], objectives: ['Menentukan keliling dan luas segitiga, segiempat, segi banyak, serta gabungannya.'], generatorTypes: ['perimeter-square', 'perimeter-rectangle', 'perimeter-triangle', 'area-square', 'area-rectangle', 'area-triangle', 'area-composite'], misconception: 'Menganggap bangun dengan luas lebih besar selalu memiliki keliling lebih besar; tertukar antara mengukur tepi dan bagian dalam.', visual: 'grid', sources: ['cp2025', 'areaPerimeter', 'measurement'] },
  { id: 'sudut-waktu', slug: 'sudut-dan-durasi-waktu', title: 'Sudut dan durasi waktu', description: 'Mengukur sudut dan menghitung lama suatu kegiatan.', element: 'Pengukuran', phase: 'C', classes: [5, 6], objectives: ['Menghitung durasi waktu.', 'Mengukur besar sudut pada bangun datar atau yang dibentuk dua garis berpotongan.'], generatorTypes: ['angle-measure', 'duration-calculate'], misconception: 'Mengira sudut lebih besar karena kaki sudut lebih panjang; menghitung menit seperti satuan berbasis 100, bukan 60.', visual: 'angle', sources: ['cp2025', 'angle'] },
  { id: 'volume-ruang', slug: 'bangun-ruang-dan-volume', title: 'Bangun ruang dan volume', description: 'Menyusun kubus dan balok serta memahami tampak depan, atas, dan samping.', element: 'Geometri', phase: 'C', classes: [5, 6], objectives: ['Mengkonstruksi dan mengurai kubus, balok, dan gabungannya.', 'Mengenali visualisasi spasial dari depan, atas, dan samping.', 'Membandingkan karakteristik bangun datar dan bangun ruang.'], generatorTypes: ['volume-unit-cubes', 'solid-properties'], misconception: 'Mengacaukan jumlah kubus satuan dengan luas permukaan atau menganggap bentuk yang berbeda pasti memiliki volume berbeda.', visual: 'blocks', sources: ['cp2025', 'measurement'], note: 'Penghitungan volume dengan kubus satuan dipakai untuk membangun intuisi; rumus volume formal tidak diklaim sebagai target eksplisit CP Fase C.' },
  { id: 'peta-berpetak', slug: 'peta-berpetak', title: 'Lokasi pada peta berpetak', description: 'Menentukan posisi dan rute sederhana pada petak.', element: 'Geometri', phase: 'C', classes: [5, 6], objectives: ['Menentukan lokasi pada peta yang menggunakan sistem berpetak.'], generatorTypes: ['grid-location'], misconception: 'Membaca koordinat terbalik: kolom dianggap baris atau sebaliknya.', visual: 'grid', sources: phaseC },
  { id: 'data-c', slug: 'membaca-dan-menganalisis-data', title: 'Membaca dan menganalisis data', description: 'Membaca tabel frekuensi, piktogram, dan diagram batang.', element: 'Analisis Data & Peluang', phase: 'C', classes: [5, 6], objectives: ['Mengurutkan, membandingkan, menyajikan, dan menganalisis data banyak benda serta hasil pengukuran dalam gambar, piktogram, diagram batang, dan tabel frekuensi.'], generatorTypes: ['table-frequency', 'bar-chart-read', 'pictogram-read'], misconception: 'Mengabaikan skala, membandingkan tinggi batang tanpa membaca label, atau salah menjumlahkan frekuensi.', visual: 'chart', sources: phaseC },
]

export const classPlan: Record<number, { phase: Fase; title: string; note: string }> = {
  1: { phase: 'A', title: 'Kelas 1', note: 'Mulai dari dasar, pelan-pelan dan selangkah demi selangkah.' },
  2: { phase: 'A', title: 'Kelas 2', note: 'Memperkuat dasar sambil mencoba soal yang sedikit lebih baru.' },
  3: { phase: 'B', title: 'Kelas 3', note: 'Naik satu tahap, tetap dengan contoh dan latihan yang ramah.' },
  4: { phase: 'B', title: 'Kelas 4', note: 'Makin lancar menghitung dan mengenali pola.' },
  5: { phase: 'C', title: 'Kelas 5', note: 'Waktunya kenalan lebih dekat dengan pecahan, persen, dan bangun ruang.' },
  6: { phase: 'C', title: 'Kelas 6', note: 'Mengulang dan memperkuat materi yang sudah dikenal.' },
}

export function topicsForClass(grade: number): Topic[] {
  return topics.filter((topic) => topic.classes.includes(grade))
}

export function topicBySlug(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug)
}

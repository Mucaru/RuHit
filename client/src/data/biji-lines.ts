/** Kalimat Biji. Nada: sabar, hangat, membahas cara berpikir, bukan menilai anak. */
export const cheers = ['Yeay, betul! Kamu menemukan caranya!', 'Mantap! Pelan-pelan tapi pasti.', 'Wah, tepat sekali! Biji ikut senang.', 'Hebat! Kamu makin paham nih.', 'Betul! Otakmu lagi panas, hehe.']
export const streakCheers = ['Tiga soal beruntun! Kamu jagoan!', 'Berturut-turut benar! Biji bangga banget.', 'Kamu lagi di atas angin! Lanjut yuk.']
export const gentleWrong = ['Belum tepat, tidak apa-apa. Coba lihat gambarnya lagi ya.', 'Hampir! Periksa satu langkah saja.', 'Salah itu bagian dari belajar. Yuk coba lagi pelan-pelan.']
export const offerHelp = ['Mau Biji tunjukkan langkah pertamanya?', 'Kita kerjakan bareng yuk. Ketuk "Bantu aku".']
export const idleNudges = ['Butuh teman? Biji siap bantu kapan saja.', 'Tidak perlu buru-buru. Kalau bingung, ketuk "Bantu aku".']
export const tapLines = ['Hai! Aku Biji. Yuk hitung bareng!', 'Hehe, geli! Ayo lanjut belajar.', 'Kamu pasti bisa. Biji percaya!', 'Satu langkah kecil dulu, ya.', 'Tahukah kamu? Nol itu penting banget buat nilai tempat!']

const tipsByType: Record<string, string> = {
  'fraction-identify': 'Hitung semua potongan dulu (penyebut), baru hitung yang berwarna (pembilang).',
  'fraction-half-quarter': 'Bagi sama besar dulu, lalu ambil satu bagian.',
  'fraction-equivalent': 'Atas dan bawah harus dikali angka yang SAMA.',
  'fraction-simplify': 'Cari angka yang bisa membagi atas dan bawah sekaligus.',
  'fraction-compare': 'Samakan penyebutnya dulu, baru lihat siapa yang lebih besar.',
  'fraction-order': 'Penyebut sama? Tinggal lihat pembilangnya.',
  'fraction-add-same': 'Penyebut sama berarti potongan sama besar. Tambah pembilangnya saja!',
  'fraction-word-add': 'Ceritanya tentang menggabungkan. Tambah pembilangnya, penyebut tetap.',
  'fraction-subtract-same': 'Penyebut sama? Kurangi pembilangnya saja, penyebut tetap.',
  'fraction-word-subtract': 'Kata "tersisa" artinya kurangi. Penyebut tetap sama.',
  'fraction-add-different': 'Penyebut beda? Samakan dulu pakai kelipatan yang sama.',
  'fraction-subtract-different': 'Samakan penyebut dulu, baru dikurangi.',
  'fraction-improper-to-mixed': 'Bagi pembilang dengan penyebut. Hasil bagi = utuh, sisa = pembilang baru.',
  'fraction-mixed-to-improper': 'Utuh × penyebut, lalu tambah pembilang.',
  'fraction-multiply-whole': 'Kalikan bilangan itu dengan PEMBILANG saja. Penyebut tetap.',
  'fraction-divide-whole': 'Dibagi makin kecil, jadi penyebut dikali. Pembilang tetap.',
  'fraction-of-quantity': 'Bagi total dengan penyebut dulu, lalu kali pembilang.',
  'fraction-to-decimal': 'Ubah penyebut jadi 10 atau 100, lalu tulis dengan koma.',
  'fraction-percent': 'Persen artinya per 100. Ubah penyebutnya jadi 100.',
}

export function introFor(typeId: string, guided: boolean): string {
  const tip = tipsByType[typeId]
  if (tip) return guided ? `Kita kerjakan bareng. ${tip}` : `Kamu pasti bisa! Tips dari Biji: ${tip}`
  return guided ? 'Pelan-pelan, kita hitung bareng!' : 'Sekarang giliranmu. Biji menemani dari sini!'
}

export const pickLine = (lines: string[], seed: number) => lines[Math.abs(seed) % lines.length]

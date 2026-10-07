import type { Activity } from '../lib/math'

export const activityMeta: Array<{ id: Activity; icon: string; title: string; description: string; tone: string; label?: string }> = [
  { id: 'addition', icon: '+', title: 'Penjumlahan bersusun', description: 'Susun angka, catat simpanannya, lalu baca hasilnya.', tone: 'mint', label: 'Paling dasar' },
  { id: 'subtraction', icon: '−', title: 'Pengurangan bersusun', description: 'Belajar meminjam dengan panah dan kolom nilai tempat.', tone: 'peach' },
  { id: 'multiplication', icon: '×', title: 'Perkalian bersusun', description: 'Kali per kolom, catat simpanannya, lalu jumlahkan hasil tiap baris.', tone: 'lavender', label: 'Favorit' },
  { id: 'division', icon: '÷', title: 'Pembagian bersusun', description: 'Ikuti urutan bagi, kali, kurang, lalu turunkan.', tone: 'blue' },
  { id: 'factor-tree', icon: '⌁', title: 'Pohon faktor', description: 'Pecah bilangan sampai semua daunnya prima.', tone: 'yellow', label: 'Cara utama faktor' },
  { id: 'prime', icon: '✦', title: 'Bilangan prima', description: 'Periksa apakah hanya punya dua faktor.', tone: 'mint' },
  { id: 'gcd', icon: '∩', title: 'FPB', description: 'Temukan faktor bersama yang paling besar.', tone: 'peach' },
  { id: 'lcm', icon: '↗', title: 'KPK', description: 'Cari kelipatan bersama yang paling kecil.', tone: 'blue' },
]

export const levelInfo = [
  ['Pemanasan', 'Angka kecil, fokus kenalan dengan langkah.'],
  ['Mulai lancar', 'Angka mulai lebih panjang, langkah baru mulai muncul.'],
  ['Makin jago', 'Angka lebih panjang dan langkah lebih banyak.'],
  ['Tantangan', 'Angka terpanjang, saatnya menguji strategimu.'],
]

export const levels: Record<Activity, number> = { addition: 4, subtraction: 4, multiplication: 4, division: 4, 'factor-tree': 4, prime: 3, gcd: 3, lcm: 3 }
export const SESSION_SIZE = 10
// perkalian level 3-4 bisa 15-20 langkah per soal, jadi sesinya dipendekkan agar anak tidak kelelahan
export const sessionSize = (activity: Activity, level: number) => (activity === 'multiplication' && level >= 3 ? 5 : SESSION_SIZE)
export const PLACE_NAMES = ['satuan', 'puluhan', 'ratusan', 'ribuan']

/**
 * Registri benda untuk soal cerita bergambar. Generator menyimpan id benda di `params` (`item`, `itemA`, `itemB`),
 * jadi gambar tidak perlu menebak benda dari kalimat soal. Nama benda di kalimat soal juga diambil dari sini.
 */
export type ItemId = 'apel' | 'jeruk' | 'pisang' | 'bola-merah' | 'bola-biru' | 'kue' | 'pizza' | 'semangka' | 'cokelat' | 'roti'
export type ItemGroup = 'buah' | 'bola' | 'makanan'
/** Cara makanan dipotong: irisan lingkaran (pie) atau potongan memanjang (bar). */
export type ItemCut = 'pie' | 'bar' | 'none'

export type Item = { id: ItemId; noun: string; label: string; group: ItemGroup; cut: ItemCut }

export const ITEMS: Record<ItemId, Item> = {
  apel: { id: 'apel', noun: 'apel', label: 'Apel', group: 'buah', cut: 'none' },
  jeruk: { id: 'jeruk', noun: 'jeruk', label: 'Jeruk', group: 'buah', cut: 'none' },
  pisang: { id: 'pisang', noun: 'pisang', label: 'Pisang', group: 'buah', cut: 'none' },
  'bola-merah': { id: 'bola-merah', noun: 'bola merah', label: 'Bola merah', group: 'bola', cut: 'none' },
  'bola-biru': { id: 'bola-biru', noun: 'bola biru', label: 'Bola biru', group: 'bola', cut: 'none' },
  kue: { id: 'kue', noun: 'kue', label: 'Kue', group: 'makanan', cut: 'pie' },
  pizza: { id: 'pizza', noun: 'pizza', label: 'Pizza', group: 'makanan', cut: 'pie' },
  semangka: { id: 'semangka', noun: 'semangka', label: 'Semangka', group: 'makanan', cut: 'pie' },
  cokelat: { id: 'cokelat', noun: 'cokelat batang', label: 'Cokelat batang', group: 'makanan', cut: 'bar' },
  roti: { id: 'roti', noun: 'roti panjang', label: 'Roti panjang', group: 'makanan', cut: 'bar' },
}

export const isItemId = (value: unknown): value is ItemId => typeof value === 'string' && Object.prototype.hasOwnProperty.call(ITEMS, value)

/** Tiga buah yang selalu muncul di tabel dan piktogram kios buah (urutannya sama dengan kalimat soal). */
export const FRUIT_TRIO: readonly ItemId[] = ['apel', 'jeruk', 'pisang']
/** Makanan untuk soal pecahan cerita; urutannya tidak boleh diubah (menjaga hasil acak yang sudah ada). */
export const FOOD_ITEMS: readonly ItemId[] = ['kue', 'pizza', 'semangka', 'cokelat', 'roti']
/** Pasangan benda untuk soal menghitung gabungan dua kelompok. */
export const COUNT_PAIRS: ReadonlyArray<readonly [ItemId, ItemId]> = [['bola-merah', 'bola-biru'], ['apel', 'jeruk'], ['jeruk', 'pisang'], ['apel', 'pisang']]
/** Kata untuk menyebut gabungan dua kelompok: "jumlah bola", "jumlah buah". */
export const groupNoun = (a: ItemId, b: ItemId) => (ITEMS[a].group === ITEMS[b].group ? ITEMS[a].group : 'benda')

/** 45000 menjadi "Rp45.000" (tanpa bergantung pada data locale perangkat). */
export const rupiah = (value: number) => `Rp${String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`

/**
 * Daftar angka yang diisi satu per satu (FPB, KPK, faktor, ujung pohon faktor).
 * Nilainya tetap berupa teks "1, 2, 3" supaya pemeriksa jawaban (normalizeList) tidak berubah.
 * Bagian setelah pemisah terakhir adalah "draf" (angka yang sedang diketik).
 */
const SEPARATORS = /[\s,;×x.]+/
const digitsOnly = (text: string) => text.replace(/\D/g, '')

export function serializeList(items: string[], draft = '') {
  return items.length ? `${items.join(', ')}, ${draft}` : draft
}

export function parseList(value: string) {
  const tokens = value.split(SEPARATORS).map(digitsOnly)
  const draft = tokens.pop() ?? ''
  return { items: tokens.filter(Boolean), draft }
}

/** Anak mengetik di kotak draf: pemisah (koma, spasi, titik, x) otomatis memasukkan angka ke daftar. */
export function editDraft(value: string, typed: string) {
  const { items } = parseList(value)
  const parts = typed.split(SEPARATORS).map(digitsOnly)
  const draft = parts.pop() ?? ''
  return serializeList([...items, ...parts.filter(Boolean)], draft)
}

export function commitDraft(value: string) {
  const { items, draft } = parseList(value)
  return serializeList(draft ? [...items, draft] : items, '')
}

export function removeAt(value: string, index: number) {
  const { items, draft } = parseList(value)
  return serializeList(items.filter((_, i) => i !== index), draft)
}

export function popLast(value: string) {
  const { items, draft } = parseList(value)
  return serializeList(items.slice(0, -1), draft)
}

export const countList = (value: string) => {
  const { items, draft } = parseList(value)
  return items.length + (draft ? 1 : 0)
}

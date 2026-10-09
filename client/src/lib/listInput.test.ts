import { describe, expect, it } from 'vitest'
import { commitDraft, countList, editDraft, parseList, popLast, removeAt, serializeList } from './listInput'
import { normalizeList } from './math/answer'

describe('daftar angka satu per satu', () => {
  it('mengetik angka lalu pemisah memasukkannya ke daftar', () => {
    let v = ''
    v = editDraft(v, '1')
    expect(parseList(v)).toEqual({ items: [], draft: '1' })
    v = editDraft(v, '1,')
    expect(parseList(v)).toEqual({ items: ['1'], draft: '' })
    v = editDraft(v, '2')
    v = commitDraft(v)
    expect(parseList(v)).toEqual({ items: ['1', '2'], draft: '' })
  })
  it('menempel "1, 2, 3 4" sekaligus: tiga masuk daftar, satu jadi draf', () => {
    expect(parseList(editDraft('', '1, 2, 3 4'))).toEqual({ items: ['1', '2', '3'], draft: '4' })
  })
  it('huruf dan simbol lain dibuang, draf kosong tidak membuat angka', () => {
    expect(parseList(editDraft('', 'a1b'))).toEqual({ items: [], draft: '1' })
    expect(commitDraft('1, 2, ')).toBe('1, 2, ')
    expect(countList('1, 2, ')).toBe(2)
  })
  it('hapus satu angka dan hapus yang terakhir', () => {
    expect(parseList(removeAt('1, 2, 3, ', 1)).items).toEqual(['1', '3'])
    expect(parseList(popLast('1, 2, 3, ')).items).toEqual(['1', '2'])
    expect(parseList(popLast('')).items).toEqual([])
  })
  it('hasilnya cocok dengan pemeriksa jawaban walau draf belum dimasukkan', () => {
    expect(normalizeList(editDraft(serializeList(['1', '2'], ''), '6'))).toBe('1,2,6')
    expect(normalizeList(commitDraft('2, 2, 3'))).toBe('2,2,3')
  })
})

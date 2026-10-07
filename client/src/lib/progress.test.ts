import { describe, expect, it } from 'vitest'
import { STORAGE_KEY, emptyProgress, isMastered, loadProgress, parseProgress, recommendedLevel, recordSession, saveProgress, starsFor, streakOf } from './progress'
import type { QuestionResult, StorageLike } from './progress'

const memory = (initial: Record<string, string> = {}): StorageLike & { data: Record<string, string> } => {
  const data = { ...initial }
  return { data, getItem: (k) => (k in data ? data[k] : null), setItem: (k, v) => { data[k] = v }, removeItem: (k) => { delete data[k] } }
}
const results = (outcomes: Array<QuestionResult['outcome']>): QuestionResult[] => outcomes.map((outcome, i) => ({ label: `soal ${i + 1}`, answer: String(i), outcome, mistakes: outcome === 'clean' ? 0 : 1 }))
const day = (y: number, m: number, d: number) => new Date(y, m - 1, d, 10, 0, 0)

describe('starsFor', () => {
  it('memberi bintang sesuai porsi soal mandiri', () => {
    expect(starsFor(10, 10, 10)).toBe(3)
    expect(starsFor(8, 10, 10)).toBe(3)
    expect(starsFor(7, 10, 10)).toBe(2)
    expect(starsFor(5, 10, 10)).toBe(2)
    expect(starsFor(4, 10, 10)).toBe(1)
    expect(starsFor(0, 0, 10)).toBe(0)
    expect(starsFor(0, 0, 0)).toBe(0)
  })
})

describe('streakOf', () => {
  it('menghitung hari beruntun, hari ini belum berlatih tapi kemarin sudah = masih hidup', () => {
    expect(streakOf(['2026-10-05', '2026-10-06', '2026-10-07'], day(2026, 10, 7))).toBe(3)
    expect(streakOf(['2026-10-05', '2026-10-06'], day(2026, 10, 7))).toBe(2)
    expect(streakOf(['2026-10-04'], day(2026, 10, 7))).toBe(0)
    expect(streakOf([], day(2026, 10, 7))).toBe(0)
  })
  it('lintas bulan dan tahun', () => {
    expect(streakOf(['2026-12-31', '2027-01-01'], day(2027, 1, 1))).toBe(2)
    expect(streakOf(['2026-02-28', '2026-03-01'], day(2026, 3, 1))).toBe(2)
  })
})

describe('recordSession', () => {
  it('menyimpan bintang terbaik dan tidak menurunkannya', () => {
    const first = recordSession(emptyProgress(), { activity: 'addition', level: 1, results: results(Array(10).fill('clean')) }, day(2026, 10, 7))
    expect(first.summary.stars).toBe(3)
    expect(first.summary.improved).toBe(true)
    const second = recordSession(first.progress, { activity: 'addition', level: 1, results: results(Array(10).fill('helped')) }, day(2026, 10, 7))
    expect(second.summary.stars).toBe(1)
    expect(second.summary.improved).toBe(false)
    expect(second.progress.levels['addition:1'].bestStars).toBe(3)
    expect(second.progress.levels['addition:1'].plays).toBe(2)
    expect(second.progress.days).toHaveLength(1)
  })
  it('review hanya berisi soal yang tidak mandiri', () => {
    const { summary } = recordSession(emptyProgress(), { activity: 'division', level: 2, results: results(['clean', 'helped', 'skipped', 'clean']) })
    expect(summary.review.map((r) => r.label)).toEqual(['soal 2', 'soal 3'])
    expect(summary.score).toBe(3)
    expect(summary.clean).toBe(2)
  })
  it('riwayat dibatasi 30 sesi', () => {
    let p = emptyProgress()
    for (let i = 0; i < 40; i += 1) p = recordSession(p, { activity: 'prime', level: 1, results: results(['clean']) }, day(2026, 10, 7)).progress
    expect(p.history).toHaveLength(30)
  })
})

describe('level disarankan', () => {
  it('level pertama yang belum 3 bintang, tidak ada yang dikunci', () => {
    let p = emptyProgress()
    expect(recommendedLevel(p, 'addition', 4)).toBe(1)
    p = recordSession(p, { activity: 'addition', level: 1, results: results(Array(10).fill('clean')) }).progress
    expect(isMastered(p, 'addition', 1)).toBe(true)
    expect(recommendedLevel(p, 'addition', 4)).toBe(2)
    p = recordSession(p, { activity: 'addition', level: 2, results: results(Array(10).fill('helped')) }).progress
    expect(recommendedLevel(p, 'addition', 4)).toBe(2)
  })
})

describe('penyimpanan', () => {
  it('simpan lalu muat kembali', () => {
    const storage = memory()
    const { progress } = recordSession(emptyProgress(), { activity: 'gcd', level: 1, results: results(['clean', 'skipped']) })
    expect(saveProgress(progress, storage)).toBe(true)
    expect(loadProgress(storage).levels['gcd:1'].plays).toBe(1)
  })
  it('data rusak, versi asing, atau storage melempar error = progres kosong, bukan crash', () => {
    expect(parseProgress('{rusak')).toEqual(emptyProgress())
    expect(parseProgress(JSON.stringify({ v: 99, levels: {} }))).toEqual(emptyProgress())
    expect(parseProgress(JSON.stringify({ v: 1, levels: { '<script>': { bestStars: 3 } }, history: 'x', days: [1, 'bukan-tanggal'] }))).toEqual(emptyProgress())
    const broken: StorageLike = { getItem: () => { throw new Error('blocked') }, setItem: () => { throw new Error('quota') }, removeItem: () => {} }
    expect(loadProgress(broken)).toEqual(emptyProgress())
    expect(saveProgress(emptyProgress(), broken)).toBe(false)
    expect(loadProgress(memory({ [STORAGE_KEY]: 'null' }))).toEqual(emptyProgress())
  })
  it('bintang di data tersimpan dijepit 0..3', () => {
    const raw = JSON.stringify({ v: 1, levels: { 'addition:1': { plays: 1, bestStars: 99, bestClean: 1, total: 10, lastPlayed: '2026-10-07' } }, history: [], days: [] })
    expect(parseProgress(raw).levels['addition:1'].bestStars).toBe(3)
  })
})

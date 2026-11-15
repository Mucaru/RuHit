import { describe, expect, it } from 'vitest'
import { STORAGE_KEY, dueLeitnerCards, emptyProgress, isMastered, loadProgress, parseProgress, recommendedLevel, recordLearningSession, recordSession, saveProgress, setLastGrade, hasProgress, starsFor, streakOf } from './progress'
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

describe('migrasi dan validasi progres v2', () => {
  it('memigrasikan progres v1 tanpa membuang catatan level yang valid', () => {
    const raw = JSON.stringify({ v: 1, levels: { 'addition:1': { plays: 3, bestStars: 2, bestClean: 7, total: 10, lastPlayed: '2026-10-07' } }, history: [], days: ['2026-10-07'] })
    const migrated = parseProgress(raw)
    expect(migrated.v).toBe(2)
    expect(migrated.levels['addition:1'].plays).toBe(3)
    expect(migrated.topics).toEqual({})
  })

  it('membatasi data lokal yang terlalu besar atau tidak sesuai schema', () => {
    const raw = JSON.stringify({
      v: 2,
      levels: { 'addition:1': { plays: 1e12, bestStars: 99, bestClean: -4, total: 5000, lastPlayed: 'bad' }, '<img>': { bestStars: 3 } },
      topics: { pecahan: { plays: 1e12, correct: -5, helped: 2, total: 9999, mastery: 99, lastPlayed: '2026-10-07' }, '<script>': { mastery: 4 } },
      leitner: { 'pecahan-fraction-add': { box: 99, dueDate: '2026-10-08', lastReviewed: 'bad', correctStreak: 1e12 } },
      history: [], days: ['2026-10-07'], stickers: ['mastery-pecahan', '<script>'], seenGuide: true,
    })
    const parsed = parseProgress(raw)
    expect(parsed.levels['addition:1'].plays).toBe(10000)
    expect(parsed.levels['addition:1'].bestStars).toBe(3)
    expect(parsed.levels['addition:1'].bestClean).toBe(0)
    expect(parsed.topics.pecahan.mastery).toBe(4)
    expect(parsed.leitner['pecahan-fraction-add'].box).toBe(5)
    expect(parsed.stickers).toEqual(['mastery-pecahan'])
  })
})

describe('penguasaan topik dan kotak Leitner', () => {
  it('meningkatkan mastery setelah latihan baik dan menjadwalkan pengulangan', () => {
    const now = day(2026, 10, 7)
    const recorded = recordLearningSession(emptyProgress(), {
      topicId: 'pecahan-operasi', total: 8, attempted: 8, correct: 8, helped: 0, skipped: 0,
      questionIds: [{ id: 'pecahan-operasi-fraction-add-same', mastered: true, skipped: false }],
    }, now)
    expect(recorded.summary.mastery).toBe(1)
    expect(recorded.progress.topics['pecahan-operasi'].total).toBe(8)
    expect(recorded.progress.leitner['pecahan-operasi-fraction-add-same'].box).toBe(2)
    expect(recorded.progress.leitner['pecahan-operasi-fraction-add-same'].dueDate).toBe('2026-10-08')
    expect(dueLeitnerCards(recorded.progress, day(2026, 10, 8))).toContain('pecahan-operasi-fraction-add-same')
  })



  it('tidak menurunkan penguasaan atau kotak review ketika anak melewati soal', () => {
    const first = recordLearningSession(emptyProgress(), {
      topicId: 'pecahan-operasi', total: 8, attempted: 8, correct: 8, helped: 0, skipped: 0,
      questionIds: [{ id: 'pecahan-operasi-fraction-add-same', mastered: true, skipped: false }],
    }, day(2026, 10, 7)).progress
    const skipped = recordLearningSession(first, {
      topicId: 'pecahan-operasi', total: 8, attempted: 0, correct: 0, helped: 0, skipped: 8,
      questionIds: [{ id: 'pecahan-operasi-fraction-add-same', mastered: false, skipped: true }],
    }, day(2026, 10, 8)).progress
    expect(skipped.topics['pecahan-operasi'].mastery).toBe(1)
    expect(skipped.leitner['pecahan-operasi-fraction-add-same'].box).toBe(2)
  })

  it('mengembalikan kotak ke awal jika topik belum dikuasai', () => {
    const first = recordLearningSession(emptyProgress(), {
      topicId: 'pecahan-operasi', total: 8, attempted: 8, correct: 8, helped: 0, skipped: 0,
      questionIds: [{ id: 'pecahan-operasi-fraction-add-same', mastered: true, skipped: false }],
    }, day(2026, 10, 7)).progress
    const second = recordLearningSession(first, {
      topicId: 'pecahan-operasi', total: 8, attempted: 8, correct: 3, helped: 5, skipped: 0,
      questionIds: [{ id: 'pecahan-operasi-fraction-add-same', mastered: false, skipped: false }],
    }, day(2026, 10, 8)).progress
    expect(second.leitner['pecahan-operasi-fraction-add-same'].box).toBe(1)
    expect(second.topics['pecahan-operasi'].total).toBe(16)
  })
})

describe('kelas terakhir (lastGrade)', () => {
  const raw = (grade: unknown) => JSON.stringify({ v: 2, levels: {}, topics: {}, leitner: {}, history: [], days: [], stickers: [], seenGuide: true, lastGrade: grade })

  it('divalidasi dan dijepit ke 1-6 saat dibaca dari localStorage', () => {
    expect(parseProgress(raw(4)).lastGrade).toBe(4)
    expect(parseProgress(raw(99)).lastGrade).toBe(6)
    expect(parseProgress(raw(-3)).lastGrade).toBe(1)
    expect(parseProgress(raw(5.9)).lastGrade).toBe(5)
  })

  it('nilai yang bukan angka menjadi null, data lama tanpa lastGrade juga null', () => {
    expect(parseProgress(raw('5')).lastGrade).toBeNull()
    expect(parseProgress(raw(null)).lastGrade).toBeNull()
    expect(parseProgress(raw(Number.NaN)).lastGrade).toBeNull()
    expect(emptyProgress().lastGrade).toBeNull()
    expect(parseProgress(JSON.stringify({ v: 1, levels: {}, history: [], days: [] })).lastGrade).toBeNull()
  })

  it('setLastGrade menyimpan kelas valid dan mengembalikan objek yang sama kalau tidak berubah', () => {
    const start = emptyProgress()
    const saved = setLastGrade(start, 3)
    expect(saved.lastGrade).toBe(3)
    expect(setLastGrade(saved, 3)).toBe(saved)
    expect(setLastGrade(saved, 99).lastGrade).toBe(6)
    expect(setLastGrade(saved, Number.NaN)).toBe(saved)
  })

  it('hasProgress hanya true setelah anak benar-benar berlatih, bukan sekadar membuka kelas', () => {
    expect(hasProgress(setLastGrade(emptyProgress(), 5))).toBe(false)
    expect(hasProgress(recordSession(emptyProgress(), { activity: 'addition', level: 1, results: results(['clean']) }).progress)).toBe(true)
  })
})

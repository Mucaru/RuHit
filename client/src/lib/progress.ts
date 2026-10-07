/**
 * Progres belajar anak, disimpan di localStorage perangkat (tanpa server, tanpa akun).
 * Semua fungsi murni (storage dan waktu bisa disuntik) supaya gampang dites.
 */

export const STORAGE_KEY = 'ruang-hitung:progress:v1'
const MAX_HISTORY = 30
const MAX_DAYS = 120
const MAX_REVIEW = 6

export type Outcome = 'clean' | 'helped' | 'skipped'

/** Hasil satu soal dalam sesi. */
export type QuestionResult = {
  label: string
  answer: string
  outcome: Outcome
  mistakes: number
}

export type LevelRecord = {
  plays: number
  bestStars: number
  bestClean: number
  total: number
  lastPlayed: string
}

export type SessionEntry = {
  date: string
  activity: string
  level: number
  score: number
  clean: number
  total: number
  stars: number
  review: Array<{ label: string; answer: string; outcome: Outcome }>
}

export type Progress = {
  v: 1
  levels: Record<string, LevelRecord>
  history: SessionEntry[]
  days: string[]
  seenGuide: boolean
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export const emptyProgress = (): Progress => ({ v: 1, levels: {}, history: [], days: [], seenGuide: false })

/** localStorage bisa melempar error (mode privat, kuota penuh, diblokir); jangan sampai app ikut crash. */
export function safeStorage(): StorageLike | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage
  } catch {
    return null
  }
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const num = (value: unknown, fallback = 0) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback)
const str = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback)
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

/** Baca data tersimpan; data rusak/versi asing dibuang diam-diam, bukan bikin app error. */
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress()
  try {
    const data: unknown = JSON.parse(raw)
    if (!isObject(data) || data.v !== 1) return emptyProgress()
    const levels: Record<string, LevelRecord> = {}
    if (isObject(data.levels)) {
      for (const [key, value] of Object.entries(data.levels)) {
        if (!/^[a-z-]+:\d{1,2}$/.test(key) || !isObject(value)) continue
        levels[key] = {
          plays: Math.max(0, Math.floor(num(value.plays))),
          bestStars: clamp(Math.floor(num(value.bestStars)), 0, 3),
          bestClean: Math.max(0, Math.floor(num(value.bestClean))),
          total: Math.max(0, Math.floor(num(value.total))),
          lastPlayed: str(value.lastPlayed),
        }
      }
    }
    const history: SessionEntry[] = Array.isArray(data.history)
      ? data.history.filter(isObject).slice(-MAX_HISTORY).map((item) => ({
          date: str(item.date),
          activity: str(item.activity),
          level: Math.max(1, Math.floor(num(item.level, 1))),
          score: Math.max(0, Math.floor(num(item.score))),
          clean: Math.max(0, Math.floor(num(item.clean))),
          total: Math.max(0, Math.floor(num(item.total))),
          stars: clamp(Math.floor(num(item.stars)), 0, 3),
          review: Array.isArray(item.review)
            ? item.review.filter(isObject).slice(0, MAX_REVIEW).map((r) => ({
                label: str(r.label),
                answer: str(r.answer),
                outcome: r.outcome === 'skipped' ? ('skipped' as const) : ('helped' as const),
              }))
            : [],
        }))
      : []
    const days = Array.isArray(data.days) ? data.days.filter((d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)).slice(-MAX_DAYS) : []
    return { v: 1, levels, history, days, seenGuide: data.seenGuide === true }
  } catch {
    return emptyProgress()
  }
}

export function loadProgress(storage: StorageLike | null = safeStorage()): Progress {
  if (!storage) return emptyProgress()
  try {
    return parseProgress(storage.getItem(STORAGE_KEY))
  } catch {
    return emptyProgress()
  }
}

/** Mengembalikan false kalau gagal simpan (kuota penuh / diblokir), supaya UI bisa jujur ke pengguna. */
export function saveProgress(progress: Progress, storage: StorageLike | null = safeStorage()): boolean {
  if (!storage) return false
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(progress))
    return true
  } catch {
    return false
  }
}

export function clearProgress(storage: StorageLike | null = safeStorage()): void {
  try {
    storage?.removeItem(STORAGE_KEY)
  } catch {
    /* abaikan */
  }
}

/** 3 bintang = mandiri >= 80%, 2 = mandiri >= 50%, 1 = selesai dan ada soal terjawab, 0 = semua dilewati. */
export function starsFor(clean: number, score: number, total: number): number {
  if (total <= 0) return 0
  if (clean / total >= 0.8) return 3
  if (clean / total >= 0.5) return 2
  return score > 0 ? 1 : 0
}

const pad = (n: number) => String(n).padStart(2, '0')
/** Tanggal lokal perangkat (bukan UTC), supaya streak tidak putus jam 7 pagi WIB. */
export const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const dayBefore = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return dateKey(new Date(y, m - 1, d - 1))
}

/** Hari beruntun berlatih. Hari ini belum berlatih tapi kemarin sudah: streak masih hidup. */
export function streakOf(days: string[], now: Date = new Date()): number {
  const set = new Set(days)
  let cursor = dateKey(now)
  if (!set.has(cursor)) cursor = dayBefore(cursor)
  let streak = 0
  while (set.has(cursor)) {
    streak += 1
    cursor = dayBefore(cursor)
  }
  return streak
}

export const levelKey = (activity: string, level: number) => `${activity}:${level}`
export const levelRecord = (progress: Progress, activity: string, level: number): LevelRecord | undefined => progress.levels[levelKey(activity, level)]
export const isMastered = (progress: Progress, activity: string, level: number) => (levelRecord(progress, activity, level)?.bestStars ?? 0) >= 3

/** Level yang disarankan: level pertama yang belum 3 bintang. Semua tuntas: level terakhir. Tidak ada yang dikunci. */
export function recommendedLevel(progress: Progress, activity: string, levelCount: number): number {
  for (let level = 1; level <= levelCount; level += 1) if (!isMastered(progress, activity, level)) return level
  return levelCount
}

export const totalStars = (progress: Progress) => Object.values(progress.levels).reduce((sum, record) => sum + record.bestStars, 0)

export type SessionInput = { activity: string; level: number; results: QuestionResult[] }
export type SessionSummary = { score: number; clean: number; total: number; stars: number; previousBest: number; improved: boolean; review: QuestionResult[]; streak: number }

export function recordSession(progress: Progress, input: SessionInput, now: Date = new Date()): { progress: Progress; summary: SessionSummary } {
  const total = input.results.length
  const score = input.results.filter((r) => r.outcome !== 'skipped').length
  const clean = input.results.filter((r) => r.outcome === 'clean').length
  const stars = starsFor(clean, score, total)
  const today = dateKey(now)
  const key = levelKey(input.activity, input.level)
  const previous = progress.levels[key]
  const review = input.results.filter((r) => r.outcome !== 'clean')

  const record: LevelRecord = {
    plays: (previous?.plays ?? 0) + 1,
    bestStars: Math.max(previous?.bestStars ?? 0, stars),
    bestClean: Math.max(previous?.bestClean ?? 0, clean),
    total,
    lastPlayed: today,
  }
  const entry: SessionEntry = {
    date: today,
    activity: input.activity,
    level: input.level,
    score,
    clean,
    total,
    stars,
    review: review.slice(0, MAX_REVIEW).map(({ label, answer, outcome }) => ({ label, answer, outcome })),
  }
  const days = progress.days.includes(today) ? progress.days : [...progress.days, today].slice(-MAX_DAYS)
  const next: Progress = {
    ...progress,
    levels: { ...progress.levels, [key]: record },
    history: [...progress.history, entry].slice(-MAX_HISTORY),
    days,
  }
  const previousBest = previous?.bestStars ?? 0
  return { progress: next, summary: { score, clean, total, stars, previousBest, improved: stars > previousBest, review, streak: streakOf(days, now) } }
}

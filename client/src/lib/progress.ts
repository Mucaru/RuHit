/**
 * Progress data is untrusted input: validate, clamp, migrate, and cap every collection.
 * No names, email addresses, or account identifiers are stored.
 */
export const STORAGE_KEY = 'ruang-hitung:progress:v2'
export const LEGACY_STORAGE_KEY = 'ruang-hitung:progress:v1'
const MAX_HISTORY = 30
const MAX_DAYS = 120
const MAX_REVIEW = 6
const MAX_TOPICS = 120
const MAX_CARDS = 240
const MAX_STICKERS = 24

export type Outcome = 'clean' | 'helped' | 'skipped'
export type QuestionResult = { label: string; answer: string; outcome: Outcome; mistakes: number }
export type LevelRecord = { plays: number; bestStars: number; bestClean: number; total: number; lastPlayed: string }
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
export type TopicRecord = { plays: number; correct: number; helped: number; total: number; mastery: number; lastPlayed: string }
export type LeitnerCard = { box: number; dueDate: string; lastReviewed: string; correctStreak: number }
export type Progress = {
  v: 2
  levels: Record<string, LevelRecord>
  topics: Record<string, TopicRecord>
  leitner: Record<string, LeitnerCard>
  history: SessionEntry[]
  days: string[]
  stickers: string[]
  seenGuide: boolean
}
export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export const emptyProgress = (): Progress => ({ v: 2, levels: {}, topics: {}, leitner: {}, history: [], days: [], stickers: [], seenGuide: false })

export function safeStorage(): StorageLike | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage
  } catch {
    return null
  }
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)
const num = (value: unknown, fallback = 0) => typeof value === 'number' && Number.isFinite(value) ? value : fallback
const str = (value: unknown, fallback = '', max = 120) => typeof value === 'string' ? value.slice(0, max) : fallback
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)
const validDate = (value: unknown): value is string => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}
const safeKey = (value: string, pattern: RegExp) => pattern.test(value)

function readLevels(raw: unknown): Record<string, LevelRecord> {
  const levels: Record<string, LevelRecord> = {}
  if (!isObject(raw)) return levels
  for (const [key, value] of Object.entries(raw).slice(0, MAX_TOPICS * 4)) {
    if (!safeKey(key, /^[a-z0-9-]{1,64}:\d{1,2}$/) || !isObject(value)) continue
    levels[key] = {
      plays: clamp(Math.floor(num(value.plays)), 0, 10000),
      bestStars: clamp(Math.floor(num(value.bestStars)), 0, 3),
      bestClean: clamp(Math.floor(num(value.bestClean)), 0, 1000),
      total: clamp(Math.floor(num(value.total)), 0, 1000),
      lastPlayed: validDate(value.lastPlayed) ? value.lastPlayed : '',
    }
  }
  return levels
}

function readHistory(raw: unknown): SessionEntry[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(isObject).slice(-MAX_HISTORY).map((item) => ({
    date: validDate(item.date) ? item.date : '',
    activity: str(item.activity, 'unknown', 64).replace(/[^a-z0-9-]/gi, '') || 'unknown',
    level: clamp(Math.floor(num(item.level, 1)), 1, 20),
    score: clamp(Math.floor(num(item.score)), 0, 1000),
    clean: clamp(Math.floor(num(item.clean)), 0, 1000),
    total: clamp(Math.floor(num(item.total)), 0, 1000),
    stars: clamp(Math.floor(num(item.stars)), 0, 3),
    review: Array.isArray(item.review) ? item.review.filter(isObject).slice(0, MAX_REVIEW).map((review) => ({
      label: str(review.label, 'Latihan', 80),
      answer: str(review.answer, '', 80),
      outcome: review.outcome === 'skipped' ? 'skipped' as const : 'helped' as const,
    })) : [],
  }))
}

function migrateV1(data: Record<string, unknown>): Progress {
  return {
    ...emptyProgress(),
    levels: readLevels(data.levels),
    history: readHistory(data.history),
    days: Array.isArray(data.days) ? data.days.filter(validDate).slice(-MAX_DAYS) : [],
    seenGuide: data.seenGuide === true,
  }
}

export function parseProgress(raw: string | null): Progress {
  if (!raw || raw.length > 500_000) return emptyProgress()
  try {
    const data: unknown = JSON.parse(raw)
    if (!isObject(data)) return emptyProgress()
    if (data.v === 1) return migrateV1(data)
    if (data.v !== 2) return emptyProgress()

    const topics: Record<string, TopicRecord> = {}
    if (isObject(data.topics)) {
      for (const [key, value] of Object.entries(data.topics).slice(0, MAX_TOPICS)) {
        if (!safeKey(key, /^[a-z0-9-]{1,64}$/) || !isObject(value)) continue
        const total = clamp(Math.floor(num(value.total)), 0, 1000)
        topics[key] = {
          plays: clamp(Math.floor(num(value.plays)), 0, 10000),
          correct: clamp(Math.floor(num(value.correct)), 0, total),
          helped: clamp(Math.floor(num(value.helped)), 0, total),
          total,
          mastery: clamp(Math.floor(num(value.mastery)), 0, 4),
          lastPlayed: validDate(value.lastPlayed) ? value.lastPlayed : '',
        }
      }
    }
    const leitner: Record<string, LeitnerCard> = {}
    if (isObject(data.leitner)) {
      for (const [key, value] of Object.entries(data.leitner).slice(0, MAX_CARDS)) {
        if (!safeKey(key, /^[a-z0-9-]{1,64}$/) || !isObject(value)) continue
        leitner[key] = {
          box: clamp(Math.floor(num(value.box, 1)), 1, 5),
          dueDate: validDate(value.dueDate) ? value.dueDate : '',
          lastReviewed: validDate(value.lastReviewed) ? value.lastReviewed : '',
          correctStreak: clamp(Math.floor(num(value.correctStreak)), 0, 100),
        }
      }
    }
    const stickers = Array.isArray(data.stickers)
      ? [...new Set(data.stickers.filter((item): item is string => typeof item === 'string' && /^[a-z0-9-]{1,40}$/.test(item)))].slice(0, MAX_STICKERS)
      : []
    return {
      v: 2,
      levels: readLevels(data.levels),
      topics,
      leitner,
      history: readHistory(data.history),
      days: Array.isArray(data.days) ? [...new Set(data.days.filter(validDate))].slice(-MAX_DAYS) : [],
      stickers,
      seenGuide: data.seenGuide === true,
    }
  } catch {
    return emptyProgress()
  }
}

export function loadProgress(storage: StorageLike | null = safeStorage()): Progress {
  if (!storage) return emptyProgress()
  try {
    const current = storage.getItem(STORAGE_KEY)
    if (current) return parseProgress(current)
    const legacy = storage.getItem(LEGACY_STORAGE_KEY)
    if (!legacy) return emptyProgress()
    const migrated = parseProgress(legacy)
    if (migrated.v === 2) saveProgress(migrated, storage)
    return migrated
  } catch {
    return emptyProgress()
  }
}

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
    storage?.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // Storage can be disabled or quota-limited; the UI remains usable.
  }
}

export function starsFor(clean: number, score: number, total: number): number {
  if (total <= 0) return 0
  if (clean / total >= 0.8) return 3
  if (clean / total >= 0.5) return 2
  return score > 0 ? 1 : 0
}

const pad = (n: number) => String(n).padStart(2, '0')
export const dateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
const dayBefore = (key: string) => {
  const [year, month, day] = key.split('-').map(Number)
  return dateKey(new Date(year, month - 1, day - 1))
}

export function streakOf(days: string[], now: Date = new Date()): number {
  const set = new Set(days)
  let cursor = dateKey(now)
  if (!set.has(cursor)) cursor = dayBefore(cursor)
  let streak = 0
  while (set.has(cursor)) { streak += 1; cursor = dayBefore(cursor) }
  return streak
}

export const levelKey = (activity: string, level: number) => `${activity}:${level}`
export const levelRecord = (progress: Progress, activity: string, level: number) => progress.levels[levelKey(activity, level)]
export const isMastered = (progress: Progress, activity: string, level: number) => (levelRecord(progress, activity, level)?.bestStars ?? 0) >= 3

export function recommendedLevel(progress: Progress, activity: string, levelCount: number): number {
  for (let level = 1; level <= levelCount; level += 1) if (!isMastered(progress, activity, level)) return level
  return levelCount
}

export const totalStars = (progress: Progress) => Object.values(progress.levels).reduce((sum, record) => sum + record.bestStars, 0)
export type SessionInput = { activity: string; level: number; results: QuestionResult[] }
export type SessionSummary = { score: number; clean: number; total: number; stars: number; previousBest: number; improved: boolean; review: QuestionResult[]; streak: number }

export function recordSession(progress: Progress, input: SessionInput, now: Date = new Date()): { progress: Progress; summary: SessionSummary } {
  const total = input.results.length
  const score = input.results.filter((result) => result.outcome !== 'skipped').length
  const clean = input.results.filter((result) => result.outcome === 'clean').length
  const stars = starsFor(clean, score, total)
  const today = dateKey(now)
  const key = levelKey(input.activity, input.level)
  const previous = progress.levels[key]
  const review = input.results.filter((result) => result.outcome !== 'clean')
  const record: LevelRecord = {
    plays: (previous?.plays ?? 0) + 1,
    bestStars: Math.max(previous?.bestStars ?? 0, stars),
    bestClean: Math.max(previous?.bestClean ?? 0, clean),
    total,
    lastPlayed: today,
  }
  const entry: SessionEntry = { date: today, activity: input.activity, level: input.level, score, clean, total, stars, review: review.slice(0, MAX_REVIEW).map(({ label, answer, outcome }) => ({ label, answer, outcome })) }
  const days = progress.days.includes(today) ? progress.days : [...progress.days, today].slice(-MAX_DAYS)
  const next: Progress = { ...progress, levels: { ...progress.levels, [key]: record }, history: [...progress.history, entry].slice(-MAX_HISTORY), days }
  const previousBest = previous?.bestStars ?? 0
  return { progress: next, summary: { score, clean, total, stars, previousBest, improved: stars > previousBest, review, streak: streakOf(days, now) } }
}

const REVIEW_INTERVAL_DAYS = [0, 1, 3, 7, 14]
const addDays = (key: string, amount: number) => {
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(year, month - 1, day + amount)
  return dateKey(date)
}

export type LearningSessionInput = { topicId: string; total: number; attempted: number; correct: number; helped: number; skipped: number; questionIds: Array<{ id: string; mastered: boolean; skipped: boolean }> }
export type LearningSessionSummary = { mastery: number; correct: number; helped: number; total: number; attempted: number; skipped: number; stickersEarned: string[]; dueReviews: number }

export function recordLearningSession(progress: Progress, input: LearningSessionInput, now: Date = new Date()): { progress: Progress; summary: LearningSessionSummary } {
  const today = dateKey(now)
  const previous = progress.topics[input.topicId]
  const ratio = input.attempted > 0 ? input.correct / input.attempted : null
  const mastery = ratio === null ? (previous?.mastery ?? 0) : clamp(ratio >= 0.9 ? (previous?.mastery ?? 0) + 1 : ratio >= 0.7 ? previous?.mastery ?? 0 : Math.max(0, (previous?.mastery ?? 0) - 1), 0, 4)
  const topicRecord: TopicRecord = {
    plays: (previous?.plays ?? 0) + 1,
    correct: (previous?.correct ?? 0) + input.correct,
    helped: (previous?.helped ?? 0) + input.helped,
    total: (previous?.total ?? 0) + input.attempted,
    mastery,
    lastPlayed: today,
  }
  const leitner = { ...progress.leitner }
  for (const item of input.questionIds.slice(0, 40)) {
    if (item.skipped || !safeKey(item.id, /^[a-z0-9-]{1,64}$/)) continue
    const old = leitner[item.id]
    const box = item.mastered ? Math.min(5, (old?.box ?? 1) + 1) : 1
    leitner[item.id] = { box, dueDate: addDays(today, REVIEW_INTERVAL_DAYS[box - 1]), lastReviewed: today, correctStreak: (old?.correctStreak ?? 0) + (item.mastered ? 1 : 0) }
  }
  const days = progress.days.includes(today) ? progress.days : [...progress.days, today].slice(-MAX_DAYS)
  const stickersEarned = mastery >= 1 && !progress.stickers.includes(`mastery-${input.topicId}`) ? [`mastery-${input.topicId}`] : []
  const sessionStars = starsFor(Math.max(0, input.correct - input.helped), input.correct, input.attempted)
  const historyEntry: SessionEntry = { date: today, activity: input.topicId, level: mastery || 1, score: input.correct, clean: Math.max(0, input.correct - input.helped), total: input.attempted, stars: sessionStars, review: [] }
  const next: Progress = {
    ...progress,
    topics: { ...progress.topics, [input.topicId]: topicRecord },
    leitner,
    history: [...progress.history, historyEntry].slice(-MAX_HISTORY),
    days,
    stickers: [...progress.stickers, ...stickersEarned].slice(0, MAX_STICKERS),
  }
  const dueReviews = Object.values(leitner).filter((card) => card.dueDate !== '' && card.dueDate <= today).length
  return { progress: next, summary: { mastery, correct: input.correct, helped: input.helped, total: input.total, attempted: input.attempted, skipped: input.skipped, stickersEarned, dueReviews } }
}

export function dueLeitnerCards(progress: Progress, now: Date = new Date()): string[] {
  const today = dateKey(now)
  return Object.entries(progress.leitner).filter(([, card]) => card.dueDate !== '' && card.dueDate <= today).map(([id]) => id)
}

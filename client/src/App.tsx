import { useCallback, useEffect, useState } from 'react'
import { HomePage } from './screens/HomePage'
import { GradePage } from './screens/GradePage'
import { TopicPage } from './screens/TopicPage'
import { PracticePage } from './screens/PracticePage'
import { ReportPage } from './screens/ReportPage'
import { PrivacyPage } from './screens/PrivacyPage'
import { legacyTopicBySlug } from './data/legacy-topics'
import { topicBySlug } from './data/kurikulum'
import { clearProgress, emptyProgress, loadProgress, saveProgress } from './lib/progress'
import type { Progress } from './lib/progress'
import { ErrorBoundary } from './components/ErrorBoundary'

function routeParts() {
  const parts = window.location.pathname.split('/').filter(Boolean).map((part) => decodeURIComponent(part))
  return parts
}

function AppContent() {
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  }, [])

  const updateProgress = useCallback((next: Progress) => {
    setProgress(next)
    setSaveFailed(!saveProgress(next))
  }, [])

  const resetProgress = useCallback(() => {
    clearProgress()
    setProgress(emptyProgress())
    setSaveFailed(false)
  }, [])

  const parts = routeParts()
  if (parts.length === 0) return <HomePage progress={progress} onProgress={updateProgress} />
  if (parts[0] === 'kelas' && parts.length === 2) {
    const grade = Number(parts[1])
    if (grade >= 1 && grade <= 6) return <GradePage grade={grade} progress={progress} />
  }
  if (parts[0] === 'kelas' && parts.length === 3) {
    const grade = Number(parts[1])
    const topic = topicBySlug(parts[2])
    if (grade >= 1 && grade <= 6 && topic?.classes.includes(grade)) return <TopicPage topic={topic} grade={grade} />
    const legacy = legacyTopicBySlug(parts[2])
    if (grade >= 5 && legacy) return <TopicPage legacyTopic={legacy} grade={grade} />
  }
  if (parts[0] === 'latihan' && parts.length === 1) return <GradePage grade={5} progress={progress} />
  if (parts[0] === 'latihan' && parts.length === 2) {
    const grade = topicBySlug(parts[1])?.classes[0] ?? 5
    return <PracticePage slug={parts[1]} grade={grade} progress={progress} onProgress={updateProgress} saveFailed={saveFailed} />
  }
  if (parts[0] === 'laporan') return <ReportPage progress={progress} saveFailed={saveFailed} onReset={resetProgress} />
  if (parts[0] === 'privasi') return <PrivacyPage />
  return <main className="page not-found"><p className="eyebrow">404 · TIDAK KETEMU</p><h1>Halaman ini belum ada.</h1><a className="button button-primary" href="/">Kembali ke beranda</a></main>
}

export default function App() {
  return <div className="app-shell"><ErrorBoundary><AppContent /></ErrorBoundary></div>
}

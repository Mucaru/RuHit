import { useEffect, useMemo, useRef, useState } from 'react'
import { makeSession, questionSummary } from './lib/math'
import type { Activity, Question } from './lib/math'
import { AppHeader } from './components/AppHeader'
import { FirstTimeGuide } from './components/FirstTimeGuide'
import { LeaveDialog } from './components/LeaveDialog'
import { activityMeta, levels as levelCounts, sessionSize } from './data/activities'
import { clearProgress, emptyProgress, loadProgress, recordSession, saveProgress } from './lib/progress'
import type { Progress, QuestionResult, SessionSummary } from './lib/progress'
import { ActivityPicker } from './screens/ActivityPicker'
import { Exercise } from './screens/Exercise'
import { Home } from './screens/Home'
import { LevelPicker } from './screens/LevelPicker'
import { Report } from './screens/Report'
import { Result } from './screens/Result'
import type { Screen } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activity, setActivity] = useState<Activity>('addition')
  const [level, setLevel] = useState(1)
  const [origin, setOrigin] = useState<'home' | 'activities'>('activities')
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [results, setResults] = useState<QuestionResult[]>([])
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [progress, setProgress] = useState<Progress>(() => loadProgress())
  const [saveFailed, setSaveFailed] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [leaveAction, setLeaveAction] = useState<(() => void) | null>(null)

  const currentQuestion = questions[questionIndex]
  const currentMeta = activityMeta.find((item) => item.id === activity)!
  const screenTitle = useMemo(() => screen === 'levels' ? currentMeta.title : screen === 'exercise' ? `${currentMeta.title} · Level ${level}` : screen === 'activities' ? 'Pilih latihan' : screen === 'report' ? 'Laporan belajar' : 'Ruang Hitung', [screen, currentMeta.title, level])

  function commit(next: Progress) { setProgress(next); setSaveFailed(!saveProgress(next)) }
  function startActivity(next: Activity, from: 'home' | 'activities') { setActivity(next); setOrigin(from); setScreen('levels') }
  function startSession(nextLevel: number) {
    setLevel(nextLevel); setQuestions(makeSession(activity, nextLevel, sessionSize(activity, nextLevel))); setQuestionIndex(0); setResults([]); setSummary(null); setScreen('exercise')
    if (!progress.seenGuide) setShowGuide(true)
  }
  function closeGuide() { setShowGuide(false); commit({ ...progress, seenGuide: true }) }
  function finishQuestion(outcome: QuestionResult['outcome'], mistakes: number) {
    const info = questionSummary(currentQuestion)
    const nextResults = [...results, { ...info, outcome, mistakes }]
    setResults(nextResults)
    if (questionIndex === questions.length - 1) {
      const recorded = recordSession(progress, { activity, level, results: nextResults })
      commit(recorded.progress); setSummary(recorded.summary); setScreen('result')
    } else setQuestionIndex((old) => old + 1)
  }
  function resetHome() { setQuestions([]); setQuestionIndex(0); setResults([]); setSummary(null); setScreen('home') }
  function resetProgress() { clearProgress(); setProgress(emptyProgress()); setSaveFailed(false) }
  function guard(action: () => void) { if (screen === 'exercise') setLeaveAction(() => action); else action() }
  const screenRef = useRef(screen)
  const backRef = useRef<() => void>(() => {})
  const sentinel = useRef(false)
  const ignorePop = useRef(false)
  function goBack() { if (screen === 'activities') setScreen('home'); else if (screen === 'levels') setScreen(origin); else if (screen === 'exercise') setScreen('levels'); else if (screen === 'result') setScreen('home'); else setScreen('home') }

  screenRef.current = screen
  backRef.current = goBack

  // pindah layar/soal -> selalu mulai dari atas (SPA tidak otomatis reset scroll)
  useEffect(() => { window.scrollTo({ top: 0 }) }, [screen, questionIndex])

  // tombol Back HP/browser = tombol Kembali di aplikasi (bukan keluar dari situs)
  useEffect(() => {
    if (screen !== 'home' && !sentinel.current) { window.history.pushState({ ruangHitung: true }, ''); sentinel.current = true }
    else if (screen === 'home' && sentinel.current) { sentinel.current = false; ignorePop.current = true; window.history.back() }
  }, [screen])
  useEffect(() => {
    const onPop = () => {
      if (ignorePop.current) { ignorePop.current = false; return }
      sentinel.current = false
      if (screenRef.current === 'home') return
      if (screenRef.current === 'exercise') { window.history.pushState({ ruangHitung: true }, ''); sentinel.current = true; setLeaveAction(() => () => backRef.current()); return }
      backRef.current()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return <div className="app-shell">
    {screen !== 'home' && <AppHeader title={screenTitle} focus={screen === 'exercise'} onBack={() => guard(goBack)} onHome={() => guard(resetHome)} />}
    {screen === 'home' && <Home progress={progress} onOpen={(next) => next ? startActivity(next, 'home') : setScreen('activities')} onReport={() => setScreen('report')} />}
    {screen === 'activities' && <ActivityPicker onChoose={(next) => startActivity(next, 'activities')} onBack={goBack} />}
    {screen === 'levels' && <LevelPicker activity={activity} progress={progress} onStart={startSession} onBack={goBack} />}
    {screen === 'exercise' && currentQuestion && <Exercise key={`${questionIndex}-${currentQuestion.id}`} question={currentQuestion} questionNumber={questionIndex + 1} total={questions.length} onNext={finishQuestion} onSkip={(mistakes) => finishQuestion('skipped', mistakes)} />}
    {screen === 'result' && summary && <Result summary={summary} title={currentMeta.title} level={level} hasNextLevel={level < levelCounts[activity]} saveFailed={saveFailed} onHome={resetHome} onAgain={() => startSession(level)} onNextLevel={() => startSession(level + 1)} />}
    {screen === 'report' && <Report progress={progress} saveFailed={saveFailed} onReset={resetProgress} onPractice={(next, nextLevel) => { setActivity(next); setOrigin('home'); setLevel(nextLevel); setQuestions(makeSession(next, nextLevel, sessionSize(next, nextLevel))); setQuestionIndex(0); setResults([]); setSummary(null); setScreen('exercise') }} />}
    {showGuide && screen === 'exercise' && <FirstTimeGuide onClose={closeGuide} />}
    {leaveAction && <LeaveDialog onStay={() => setLeaveAction(null)} onLeave={() => { const action = leaveAction; setLeaveAction(null); action() }} />}
  </div>
}

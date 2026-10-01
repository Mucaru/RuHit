import { useEffect, useMemo, useRef, useState } from 'react'
import { makeSession } from './lib/math'
import type { Activity, Question } from './lib/math'
import { AppHeader } from './components/AppHeader'
import { LeaveDialog } from './components/LeaveDialog'
import { activityMeta, sessionSize } from './data/activities'
import { ActivityPicker } from './screens/ActivityPicker'
import { Exercise } from './screens/Exercise'
import { Home } from './screens/Home'
import { LevelPicker } from './screens/LevelPicker'
import { Result } from './screens/Result'
import type { Screen } from './types'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activity, setActivity] = useState<Activity>('addition')
  const [level, setLevel] = useState(1)
  const [origin, setOrigin] = useState<'home' | 'activities'>('activities')
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [clean, setClean] = useState(0)
  const [leaveAction, setLeaveAction] = useState<(() => void) | null>(null)

  const currentQuestion = questions[questionIndex]
  const currentMeta = activityMeta.find((item) => item.id === activity)!
  const screenTitle = useMemo(() => screen === 'levels' ? currentMeta.title : screen === 'exercise' ? `${currentMeta.title} · Level ${level}` : screen === 'activities' ? 'Pilih latihan' : 'Ruang Hitung', [screen, currentMeta.title, level])

  function startActivity(next: Activity, from: 'home' | 'activities') { setActivity(next); setOrigin(from); setScreen('levels') }
  function startSession(nextLevel: number) { setLevel(nextLevel); setQuestions(makeSession(activity, nextLevel, sessionSize(activity, nextLevel))); setQuestionIndex(0); setScore(0); setClean(0); setScreen('exercise') }
  function nextQuestion(correct: boolean, isClean = false) { setScore((old) => old + (correct ? 1 : 0)); setClean((old) => old + (isClean ? 1 : 0)); if (questionIndex === questions.length - 1) setScreen('result'); else setQuestionIndex((old) => old + 1) }
  function resetHome() { setQuestions([]); setQuestionIndex(0); setScore(0); setClean(0); setScreen('home') }
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

  return <div className="app-shell">{screen !== 'home' && <AppHeader title={screenTitle} onBack={() => guard(goBack)} onHome={() => guard(resetHome)} />}{screen === 'home' && <Home onOpen={(next) => next ? startActivity(next, 'home') : setScreen('activities')} />}{screen === 'activities' && <ActivityPicker onChoose={(next) => startActivity(next, 'activities')} onBack={goBack} />}{screen === 'levels' && <LevelPicker activity={activity} onStart={startSession} onBack={goBack} />}{screen === 'exercise' && currentQuestion && <Exercise key={`${questionIndex}-${currentQuestion.id}`} question={currentQuestion} questionNumber={questionIndex + 1} total={questions.length} score={score} onNext={nextQuestion} onSkip={() => nextQuestion(false)} onExit={() => guard(goBack)} />}{screen === 'result' && <Result score={score} clean={clean} total={questions.length} title={currentMeta.title} onHome={resetHome} onAgain={() => startSession(level)} />}{leaveAction && <LeaveDialog onStay={() => setLeaveAction(null)} onLeave={() => { const action = leaveAction; setLeaveAction(null); action() }} />}</div>
}

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { LIST_KINDS, stepMatches } from '../lib/math'
import type { Question } from '../lib/math'
import { WorkBoard } from '../components/boards/WorkBoard'
import { HINT_TIERS, hintText, wrongMessage } from '../lib/feedback'
import { canSpeak, speak, stepSpeech, stopSpeaking } from '../lib/speech'
import type { AnswerStatus } from '../types'

export function Exercise({ question, questionNumber, total, score, onNext, onSkip, onExit }: { question: Question; questionNumber: number; total: number; score: number; onNext: (outcome: 'clean' | 'helped', mistakes: number) => void; onSkip: (mistakes: number) => void; onExit: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [steps, setSteps] = useState(question.steps)
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<AnswerStatus>('idle')
  const [attempts, setAttempts] = useState(0)
  const [hintLevel, setHintLevel] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [usedHint, setUsedHint] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  const continueRef = useRef<HTMLButtonElement>(null)
  const current = steps[stepIndex]
  const completed = steps.slice(0, stepIndex)
  const stepsDone = stepIndex + (status === 'correct' ? 1 : 0)
  const progress = Math.round(((questionNumber - 1 + stepsDone / steps.length) / total) * 100)
  const textInput = LIST_KINDS.includes(current.kind)
  const isLastStep = stepIndex === steps.length - 1
  const feedback = status === 'correct' ? current.coach : status === 'empty' ? 'Kotaknya masih kosong. Coba isi jawabanmu dulu, ya.' : status === 'wrong' ? wrongMessage(current, value) : ''

  const focusInput = (select = false) => {
    const input = panelRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')
    input?.focus({ preventScroll: true })
    if (select) input?.select()
  }
  useEffect(() => { focusInput() }, [stepIndex])
  // suara berhenti saat pindah langkah atau keluar dari soal
  useEffect(() => { stopSpeaking(); setSpeaking(false) }, [stepIndex])
  useEffect(() => () => stopSpeaking(), [])
  useEffect(() => {
    if (status === 'correct') continueRef.current?.focus({ preventScroll: true })
    else if (status === 'wrong' || status === 'empty') focusInput(true)
  }, [status])

  function updateValue(next: string) {
    setValue(next)
    if (status !== 'idle') setStatus('idle')
  }
  function submit(answer = value) {
    if (status === 'correct') return
    if (!answer.trim()) { setStatus('empty'); return }
    if (stepMatches(current, answer)) {
      // jawaban benar tapi berbeda dari rencana awal (mis. pohon faktor): susun ulang sisa langkahnya
      const replacement = question.branch?.(current, answer.trim())
      if (replacement) setSteps((old) => [...old.slice(0, stepIndex), ...replacement])
      setStatus('correct')
    }
    else { setStatus('wrong'); setAttempts((old) => old + 1); setMistakes((old) => old + 1) }
  }
  function continueStep() {
    if (isLastStep) onNext(mistakes === 0 && !usedHint ? 'clean' : 'helped', mistakes)
    else { setStepIndex((old) => old + 1); setValue(''); setStatus('idle'); setAttempts(0); setHintLevel(0) }
  }
  function toggleSpeech() {
    if (speaking) { stopSpeaking(); setSpeaking(false); return }
    setSpeaking(speak(stepSpeech(current), () => setSpeaking(false)))
  }
  function choose(valueToUse: string) { updateValue(valueToUse); submit(valueToUse) }

  return <main className="page exercise-page"><div className="exercise-top"><div><div className="kicker muted">{question.title.toUpperCase()}</div><h1>Kerjakan bersama</h1></div><div className="score-pill"><span>✦</span> Benar <b>{score}</b><small>/{total}</small></div></div><div className="progress-track" role="progressbar" aria-label="Kemajuan sesi latihan" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div><div className="exercise-meta"><span>Soal <b>{questionNumber}</b> / {total}</span><span className="step-pill">Langkah {stepIndex + 1} / {steps.length}</span></div><div className="exercise-layout"><section className="work-panel" ref={panelRef}><WorkBoard question={{ ...question, steps }} current={current} completed={completed} value={value} onChange={updateValue} disabled={status === 'correct'} /><div className="prompt-block"><div className="prompt-label"><span /> Giliranmu · {question.eyebrow}</div><div className="prompt-row"><h2 id="step-prompt">{current.prompt}</h2>{canSpeak() && <button type="button" className="speak-button" onClick={toggleSpeech} aria-pressed={speaking} aria-label={speaking ? 'Berhenti membaca' : 'Dengarkan soal'}>{speaking ? <VolumeX size={22} aria-hidden="true" /> : <Volume2 size={22} aria-hidden="true" />}<span>{speaking ? 'Stop' : 'Dengar'}</span></button>}</div>{attempts >= 2 && status !== 'correct' && <div className="coach-note"><span>✦</span><div><strong>Tarik napas, kita pecah pelan-pelan.</strong><p>Kalau masih bingung, petunjuk di samping bisa dibuka kapan saja.</p></div></div>}</div><form id="answer-form" className="answer-form" onSubmit={(event) => { event.preventDefault(); submit() }}>{current.choices ? <div className="choice-grid">{current.choices.map((choice) => <button type="button" className={`choice ${value === choice.value ? 'selected' : ''}`} aria-pressed={value === choice.value} key={choice.value} onClick={() => choose(choice.value)} disabled={status === 'correct'}><strong>{choice.label}</strong><small>{choice.helper}</small></button>)}</div> : textInput && <div className="token-row"><span>Bantuan tanda:</span><button type="button" onClick={() => updateValue(`${value}${value ? ', ' : ''}`)}>, koma</button><button type="button" onClick={() => updateValue(`${value} × `)}>× kali</button></div>}<div className="answer-actions"><button type="submit" className="primary-button" disabled={status === 'correct'}>Periksa <span>✓</span></button>{status === 'correct' ? <button type="button" className="secondary-button" ref={continueRef} onClick={continueStep}>{isLastStep ? (questionNumber === total ? 'Lihat hasil sesi' : 'Soal berikutnya') : 'Lanjut langkah'} <span>→</span></button> : <button type="button" className="skip-button" onClick={() => onSkip(mistakes)}>Lewati soal</button>}</div></form>{status !== 'idle' && <div className={`feedback feedback-${status}`} role="status"><span>{status === 'correct' ? '✓' : status === 'empty' ? '!' : '↺'}</span><p>{feedback}</p></div>}</section><aside className="support-panel"><div className={`hint-card ${hintLevel ? 'open' : ''}`}><div className="hint-heading"><span>✦</span><div><strong>Butuh petunjuk?</strong><small>{hintLevel ? `Petunjuk tahap ${hintLevel} dari ${HINT_TIERS}` : 'Belum dibuka'}</small></div></div>{hintLevel ? <p>{hintText(current, hintLevel)}</p> : <p className="hint-locked">Petunjuk tersembunyi dulu. Coba kerjakan sendiri sebelum membukanya.</p>}<button className="hint-button" type="button" disabled={hintLevel >= HINT_TIERS || status === 'correct'} onClick={() => { setHintLevel((old) => Math.min(old + 1, HINT_TIERS)); setUsedHint(true) }}>{hintLevel >= HINT_TIERS ? 'Petunjuk habis' : hintLevel ? 'Petunjuk berikutnya' : 'Buka petunjuk'} <span>→</span></button></div><button className="exit-button" type="button" onClick={onExit}>← Keluar dari sesi</button></aside></div></main>
}
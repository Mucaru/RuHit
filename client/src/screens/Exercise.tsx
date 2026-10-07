import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Check, CircleAlert, Lightbulb, RotateCcw, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { LIST_KINDS, stepMatches } from '../lib/math'
import type { Question } from '../lib/math'
import { WorkBoard } from '../components/boards/WorkBoard'
import { HINT_TIERS, hintText, wrongMessage } from '../lib/feedback'
import { canSpeak, speak, stepSpeech, stopSpeaking } from '../lib/speech'
import type { AnswerStatus } from '../types'

/** Mode fokus: satu langkah, satu aksi utama. Urutan layar: kalimat langkah -> papan -> jawaban -> tombol utama. */
export function Exercise({ question, questionNumber, total, onNext, onSkip }: { question: Question; questionNumber: number; total: number; onNext: (outcome: 'clean' | 'helped', mistakes: number) => void; onSkip: (mistakes: number) => void }) {
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
  const hintsLeft = hintLevel < HINT_TIERS

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
  function openHint() { setHintLevel((old) => Math.min(old + 1, HINT_TIERS)); setUsedHint(true) }
  function choose(valueToUse: string) { updateValue(valueToUse); submit(valueToUse) }

  return <main className="page exercise-page focus-mode">
    <h1 className="sr-only">{question.title}, soal {questionNumber} dari {total}</h1>
    <div className="progress-track" role="progressbar" aria-label="Kemajuan sesi latihan" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
    <div className="exercise-meta">
      <span>Soal <b>{questionNumber}</b> / {total} <span className="step-pill">Langkah {stepIndex + 1} / {steps.length}</span></span>
      {status !== 'correct' && <button type="button" className="skip-button" onClick={() => onSkip(mistakes)}><SkipForward size={18} aria-hidden="true" /> Lewati soal</button>}
    </div>
    <section className="work-panel" ref={panelRef}>
      <div className="prompt-block">
        <div className="prompt-label"><span /> Giliranmu · {question.eyebrow}</div>
        <div className="prompt-row">
          <h2 id="step-prompt">{current.prompt}</h2>
          {canSpeak() && <button type="button" className="speak-button" onClick={toggleSpeech} aria-pressed={speaking} aria-label={speaking ? 'Berhenti membaca' : 'Dengarkan langkah ini'} title={speaking ? 'Berhenti' : 'Dengarkan'}>{speaking ? <VolumeX size={24} aria-hidden="true" /> : <Volume2 size={24} aria-hidden="true" />}</button>}
        </div>
        {hintLevel > 0 && <div className="hint-inline" role="note"><strong>Petunjuk {hintLevel} dari {HINT_TIERS}</strong><p>{hintText(current, hintLevel)}</p></div>}
        {attempts >= 2 && status !== 'correct' && <div className="coach-note"><span>✦</span><div><strong>Tarik napas, kita pecah pelan-pelan.</strong><p>Kalau masih bingung, tekan tombol Petunjuk.</p></div></div>}
      </div>
      <WorkBoard question={{ ...question, steps }} current={current} completed={completed} value={value} onChange={updateValue} disabled={status === 'correct'} />
      <form id="answer-form" className="answer-form" onSubmit={(event) => { event.preventDefault(); submit() }}>
        {current.choices ? <div className="choice-grid">{current.choices.map((choice) => <button type="button" className={`choice ${value === choice.value ? 'selected' : ''}`} aria-pressed={value === choice.value} key={choice.value} onClick={() => choose(choice.value)} disabled={status === 'correct'}><strong>{choice.label}</strong><small>{choice.helper}</small></button>)}</div> : textInput && <div className="token-row"><span>Bantuan tanda:</span><button type="button" onClick={() => updateValue(`${value}${value ? ', ' : ''}`)}>, koma</button><button type="button" onClick={() => updateValue(`${value} × `)}>× kali</button></div>}
        {status !== 'idle' && <div className={`feedback feedback-${status}`} role="status"><span>{status === 'correct' ? <Check size={16} aria-hidden="true" /> : status === 'empty' ? <CircleAlert size={16} aria-hidden="true" /> : <RotateCcw size={16} aria-hidden="true" />}</span><p>{feedback}</p></div>}
        <div className="answer-actions">
          {status === 'correct'
            ? <button key="next" type="button" className="primary-button" ref={continueRef} onClick={continueStep}>{isLastStep ? (questionNumber === total ? 'Lihat hasil sesi' : 'Soal berikutnya') : 'Lanjut langkah'} <ArrowRight size={20} aria-hidden="true" /></button>
            : <>
              <button key="hint" type="button" className="hint-trigger" disabled={!hintsLeft} onClick={openHint} aria-label={hintLevel === 0 ? 'Buka petunjuk' : hintsLeft ? 'Petunjuk berikutnya' : 'Petunjuk sudah habis'}><Lightbulb size={20} aria-hidden="true" /> Petunjuk</button>
              <button key="check" type="submit" className="primary-button">Periksa <Check size={20} aria-hidden="true" /></button>
            </>}
        </div>
      </form>
    </section>
  </main>
}

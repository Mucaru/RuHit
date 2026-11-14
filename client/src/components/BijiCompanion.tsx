import { useEffect, useMemo, useState } from 'react'
import { Mascot } from './Mascot'
import type { MascotExpression, MascotMotion } from './Mascot'
import { cheers, gentleWrong, idleNudges, introFor, offerHelp, pickLine, streakCheers, tapLines } from '../data/biji-lines'
import { solutionSteps } from '../lib/learning/solutions'
import type { LearningQuestion } from '../lib/learning/types'
import { canSpeak, speak, stopSpeaking } from '../lib/speech'

type Props = {
  question: LearningQuestion
  questionNumber: number
  status: 'idle' | 'correct' | 'wrong'
  mistakes: number
  streak: number
  guided: boolean
  /** Dipanggil saat anak memakai bantuan Biji, supaya soal tidak dihitung "mandiri". */
  onHelpUsed: (kind: 'steps' | 'answer') => void
}

/**
 * Biji sebagai teman mengerjakan soal:
 * - bereaksi pada jawaban benar/salah dengan kalimat yang membahas cara, bukan anak,
 * - menawarkan bantuan setelah salah lagi, tanpa memaksa,
 * - menunjukkan langkah penyelesaian satu per satu. Jawaban akhir baru muncul bila diminta.
 */
export function BijiCompanion({ question, questionNumber, status, mistakes, streak, guided, onHelpUsed }: Props) {
  const steps = useMemo(() => solutionSteps(question), [question])
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [answerShown, setAnswerShown] = useState(false)
  const [tapMessage, setTapMessage] = useState<string | null>(null)
  const [tapCount, setTapCount] = useState(0)
  const [nudged, setNudged] = useState(false)

  useEffect(() => { setOpen(false); setStepIndex(0); setAnswerShown(false); setTapMessage(null); setNudged(false) }, [questionNumber])
  useEffect(() => { setTapMessage(null) }, [status, mistakes])

  // Dorongan lembut sekali per soal bila anak diam lama. Bukan timer nilai, hanya sapaan.
  useEffect(() => {
    if (status !== 'idle' || open || nudged) return undefined
    const handle = window.setTimeout(() => setNudged(true), 45000)
    return () => window.clearTimeout(handle)
  }, [status, open, nudged, questionNumber, mistakes])

  useEffect(() => () => stopSpeaking(), [])

  const lastIndex = steps.length - 1
  const atFinal = stepIndex === lastIndex
  const current = steps[stepIndex]

  let expression: MascotExpression = 'happy'
  let motion: MascotMotion = 'float'
  let message = introFor(question.typeId, guided)
  if (open) { expression = 'thinking'; message = atFinal && !answerShown ? 'Sebelum lihat jawaban, coba hitung sendiri dulu dengan langkah tadi!' : `Langkah ${stepIndex + 1} dari ${steps.length}: ${current.title}` }
  else if (status === 'correct') { expression = streak >= 3 ? 'celebrate' : 'excited'; motion = 'bounce'; message = streak >= 3 ? pickLine(streakCheers, questionNumber) : pickLine(cheers, questionNumber) }
  else if (status === 'wrong') {
    expression = mistakes >= 3 ? 'oops' : 'almost'; motion = 'wiggle'
    message = mistakes >= 2 ? `${pickLine(gentleWrong, mistakes)} ${pickLine(offerHelp, mistakes)}` : pickLine(gentleWrong, mistakes + questionNumber)
  } else if (nudged) message = pickLine(idleNudges, questionNumber)
  if (tapMessage && !open) { message = tapMessage; motion = 'bounce'; expression = 'excited' }

  function openHelp() {
    setOpen(true); setStepIndex(0); setAnswerShown(false)
    onHelpUsed('steps')
  }
  function next() {
    if (stepIndex < lastIndex) setStepIndex(stepIndex + 1)
  }
  function showAnswer() {
    setAnswerShown(true)
    onHelpUsed('answer')
  }
  function tap() {
    setTapMessage(pickLine(tapLines, tapCount + questionNumber))
    setTapCount((count) => count + 1)
  }

  const stepText = open ? (atFinal && !answerShown ? null : current.text) : null
  const readAloud = open ? (stepText ?? message) : message

  return (
    <section className={`biji-companion biji-${expression}`} aria-label="Biji, teman belajarmu">
      <button type="button" className="biji-avatar" onClick={tap} aria-label="Colek Biji">
        <Mascot expression={expression} size="medium" motion={motion} label="Biji" />
      </button>
      <div className="biji-body">
        <div className="biji-bubble" role="status" aria-live="polite">
          <p className="biji-message">{message}</p>
          {open && stepText && <p className="biji-step-text">{stepText}</p>}
          {open && atFinal && !answerShown && (
            <button type="button" className="button button-secondary biji-reveal" onClick={showAnswer}>Tunjukkan jawabannya</button>
          )}
        </div>
        <div className="biji-actions">
          {!open && status !== 'correct' && <button type="button" className="button button-help" onClick={openHelp}><span aria-hidden="true">🙋</span> Bantu aku, Biji!</button>}
          {open && (
            <>
              <button type="button" className="button button-secondary" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>← Sebelumnya</button>
              <button type="button" className="button button-primary" onClick={next} disabled={atFinal}>Langkah berikutnya →</button>
              <button type="button" className="biji-close" onClick={() => setOpen(false)}>Tutup bantuan</button>
            </>
          )}
          {canSpeak() && <button type="button" className="biji-speak" onClick={() => speak(readAloud)} aria-label="Dengarkan Biji bicara"><span aria-hidden="true">🔊</span> Dengarkan</button>}
        </div>
        {open && <ol className="biji-progress" aria-label="Kemajuan langkah">{steps.map((item, index) => <li key={item.title + index} className={index === stepIndex ? 'is-current' : index < stepIndex ? 'is-done' : ''}><span className="sr-only">{item.title}</span></li>)}</ol>}
      </div>
    </section>
  )
}

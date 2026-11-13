import { useEffect, useMemo, useState } from 'react'
import { Exercise } from './Exercise'
import { BijiCompanion } from '../components/BijiCompanion'
import { Confetti } from '../components/Confetti'
import { Mascot } from '../components/Mascot'
import { NumberKeypad } from '../components/NumberKeypad'
import { SiteHeader } from '../components/SiteHeader'
import { VisualAid } from '../components/VisualAid'
import { activityMeta, levelInfo, levels, sessionSize } from '../data/activities'
import { legacyTopicBySlug } from '../data/legacy-topics'
import { topicBySlug } from '../data/kurikulum'
import { checkAnswer, generateQuestion } from '../lib/learning/engine'
import type { Progress, QuestionResult, SessionSummary } from '../lib/progress'
import { dueLeitnerCards, levelRecord, recordLearningSession, recordSession, recommendedLevel } from '../lib/progress'
import { makeSession } from '../lib/math'
import type { Activity } from '../lib/math'

export function PracticePage({ slug, grade, progress, onProgress, saveFailed }: { slug: string; grade: number; progress: Progress; onProgress: (progress: Progress) => void; saveFailed: boolean }) {
  const legacyTopic = legacyTopicBySlug(slug)
  const topic = topicBySlug(slug)
  if (legacyTopic) return <LegacyPractice slug={slug} grade={grade} activity={legacyTopic.activity} progress={progress} onProgress={onProgress} saveFailed={saveFailed} />
  if (topic) return <LearningPractice topicId={topic.id} slug={slug} grade={grade} progress={progress} onProgress={onProgress} saveFailed={saveFailed} />
  return <main className="page not-found"><h1>Topik tidak ditemukan.</h1><a className="button button-primary" href={`/kelas/${grade}/`}>Kembali ke kelas</a></main>
}

function LegacyPractice({ slug, grade, activity, progress, onProgress, saveFailed }: { slug: string; grade: number; activity: Activity; progress: Progress; onProgress: (progress: Progress) => void; saveFailed: boolean }) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const [sessionVersion, setSessionVersion] = useState(0)
  if (selectedLevel === null) return <LegacyLevelChooser activity={activity} grade={grade} progress={progress} onStart={setSelectedLevel} />
  return <LegacySession key={`${activity}-${selectedLevel}-${sessionVersion}`} slug={slug} grade={grade} activity={activity} level={selectedLevel} progress={progress} onProgress={onProgress} onChooseLevel={setSelectedLevel} onRestart={() => setSessionVersion((version) => version + 1)} saveFailed={saveFailed} />
}

function LegacyLevelChooser({ activity, grade, progress, onStart }: { activity: Activity; grade: number; progress: Progress; onStart: (level: number) => void }) {
  const meta = activityMeta.find((item) => item.id === activity)!
  const recommended = recommendedLevel(progress, activity, levels[activity])
  return <>
    <SiteHeader backHref={`/kelas/${grade}/`} backLabel="Kelas" compact />
    <main className="page inner-page legacy-level-page">
      <section className="page-heading paper-card"><div><p className="eyebrow">LATIHAN BERSUSUN</p><h1>{meta.title}</h1><p>{meta.description} Pilih tingkat yang terasa nyaman.</p></div><Mascot expression="thinking" size="medium" /></section>
      <div className="section-heading"><div><p className="eyebrow">PILIH TINGKATMU</p><h2>Mulai dari mana hari ini?</h2></div></div>
      <div className="legacy-level-grid">{Array.from({ length: levels[activity] }, (_, index) => {
        const level = index + 1
        const record = levelRecord(progress, activity, level)
        const stars = record?.bestStars ?? 0
        return <button className={`legacy-level-card legacy-level-${level} ${level === recommended && stars < 3 ? 'is-recommended' : ''}`} type="button" key={level} onClick={() => onStart(level)}>
          <span className="legacy-level-number">LEVEL {String(level).padStart(2, '0')}</span>
          <strong>{levelInfo[index][0]}</strong>
          <small>{levelInfo[index][1]}</small>
          <span className="legacy-level-stars" aria-label={`${stars} dari 3 bintang`}>{'★'.repeat(stars)}{'☆'.repeat(3 - stars)}</span>
          {level === recommended && stars < 3 ? <span className="legacy-level-tag">Saran berikutnya</span> : null}
        </button>
      })}</div>
    </main>
  </>
}

function LegacySession({ slug, grade, activity, level, progress, onProgress, onChooseLevel, onRestart, saveFailed }: { slug: string; grade: number; activity: Activity; level: number; progress: Progress; onProgress: (progress: Progress) => void; onChooseLevel: (level: number | null) => void; onRestart: () => void; saveFailed: boolean }) {
  const questions = useMemo(() => makeSession(activity, level, sessionSize(activity, level)), [activity, level])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<QuestionResult[]>([])
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const meta = activityMeta.find((item) => item.id === activity)!

  function finish(outcome: QuestionResult['outcome'], mistakes: number) {
    const question = questions[index]
    const result: QuestionResult = { label: question.title, answer: question.steps.at(-1)?.expected ?? '', outcome, mistakes }
    const next = [...results, result]
    setResults(next)
    if (index + 1 >= questions.length) {
      const recorded = recordSession(progress, { activity, level, results: next })
      onProgress(recorded.progress)
      setSummary(recorded.summary)
    } else setIndex((current) => current + 1)
  }

  if (summary) {
    const canNext = summary.stars >= 3 && level < levels[activity]
    return <>
      <SiteHeader backHref={`/kelas/${grade}/`} backLabel="Kelas" compact />
      <main className="page result-page paper-card">
        <Mascot expression={summary.stars >= 2 ? 'celebrate' : 'happy'} size="large" />
        <p className="eyebrow">SESI SELESAI · {meta.title.toUpperCase()}</p>
        <div className="result-stars" aria-label={`${summary.stars} dari 3 bintang`}>{'★'.repeat(summary.stars)}{'☆'.repeat(3 - summary.stars)}</div>
        <h1>{summary.stars === 3 ? 'Luar biasa, kamu makin lancar!' : summary.stars === 2 ? 'Bagus, teruskan latihanmu!' : 'Terima kasih sudah mencoba!'}</h1>
        <p>{summary.score} dari {summary.total} soal selesai, {summary.clean} dikerjakan mandiri.</p>
        {summary.streak >= 2 && <p className="streak-note">Kamu sudah berlatih {summary.streak} hari beruntun. Hebat!</p>}
        {summary.review.length > 0 && <section className="legacy-review"><h2>Langkah yang bisa diulang</h2><ul>{summary.review.map((item, itemIndex) => <li key={`${item.label}-${itemIndex}`}><span>{item.label}</span><strong>{item.answer}</strong></li>)}</ul><p>Jawaban benar ditampilkan agar bisa dipelajari lagi, bukan untuk menghukum.</p></section>}
        {saveFailed && <p className="save-warning" role="status">Browser tidak mengizinkan penyimpanan. Progres sesi ini belum tersimpan.</p>}
        <div className="hero-actions"><button className="button button-primary" type="button" onClick={() => canNext ? onChooseLevel(level + 1) : onRestart()}>{canNext ? `Lanjut ke level ${level + 1}` : 'Ulangi level ini'}</button><button className="button button-secondary" type="button" onClick={() => onChooseLevel(null)}>Pilih level lain</button></div>
      </main>
    </>
  }

  return <>
    <SiteHeader backHref={`/kelas/${grade}/`} backLabel="Kelas" compact confirmBack />
    <div className="practice-intro page"><div><p className="eyebrow">LATIHAN BERSUSUN · {meta.title.toUpperCase()} · LEVEL {level}</p><h1>Satu langkah, satu jawaban.</h1></div><span className="practice-count">{index + 1} / {questions.length}</span></div>
    <Exercise key={`${index}-${questions[index].id}`} question={questions[index]} questionNumber={index + 1} total={questions.length} onNext={(outcome, mistakes) => finish(outcome, mistakes)} onSkip={(mistakes) => finish('skipped', mistakes)} />
  </>
}

function LearningPractice({ topicId, slug, grade, progress, onProgress, saveFailed }: { topicId: string; slug: string; grade: number; progress: Progress; onProgress: (progress: Progress) => void; saveFailed: boolean }) {
  const topic = topicBySlug(slug)!
  const mode = new URLSearchParams(window.location.search).get('mode') === 'guided' ? 'guided' : 'independent'
  const guided = mode === 'guided'
  const questionCount = 8
  const difficulty = progress.topics[topicId]?.mastery ?? 0
  const questions = useMemo(() => {
    const dueTypes = dueLeitnerCards(progress).filter((id) => id.startsWith(`${topicId}-`)).map((id) => id.slice(topicId.length + 1))
    const focus = (new URLSearchParams(window.location.search).get('focus') ?? '').split(',').filter((id) => topic.generatorTypes.includes(id))
    const types = focus.length > 0 ? focus : [...new Set([...dueTypes, ...topic.generatorTypes])]
    return Array.from({ length: questionCount }, (_, index) => {
      const typeId = types[index % types.length]
      return generateQuestion(typeId, topicId, Math.random, grade, difficulty)
    })
  }, [difficulty, grade, progress.leitner, topic.generatorTypes, topicId])

  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [hintLevel, setHintLevel] = useState(guided ? 1 : 0)
  const [usedHint, setUsedHint] = useState(guided)
  const [mistakes, setMistakes] = useState(0)
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [burst, setBurst] = useState(0)
  const [outcomes, setOutcomes] = useState<Array<{ typeId: string; mastered: boolean; correct: boolean; skipped: boolean }>>([])
  const [summary, setSummary] = useState<{ correct: number; total: number; attempted: number; skipped: number; mastery: number; stickers: string[] } | null>(null)
  const question = questions[index]
  let trailing = 0
  for (let i = outcomes.length - 1; i >= 0 && outcomes[i].correct; i -= 1) trailing += 1
  const streak = trailing + (status === 'correct' ? 1 : 0)

  useEffect(() => {
    if (status === 'correct') return
    setAnswer('')
  }, [index])

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  function speakPrompt() {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(`${question.prompt}. ${hintLevel > 0 ? question.hints[hintLevel - 1] : ''}`)
    utterance.lang = 'id-ID'
    utterance.rate = 0.9
    window.speechSynthesis.speak(utterance)
  }

  function updateAnswer(value: string) {
    setAnswer(value)
    if (status !== 'idle') setStatus('idle')
  }

  function check() {
    if (!answer.trim()) return
    if (checkAnswer(question, answer)) { setStatus('correct'); setBurst((value) => value + 1) }
    else { setStatus('wrong'); setMistakes((value) => value + 1) }
  }

  function showHint() {
    setHintLevel((value) => Math.min(3, value + 1))
    setUsedHint(true)
  }

  function nextQuestion(skipped = false) {
    const mastered = !skipped && status === 'correct' && !usedHint && mistakes === 0
    const correct = !skipped && status === 'correct'
    const nextOutcomes = [...outcomes, { typeId: question.typeId, mastered, correct, skipped }]
    setOutcomes(nextOutcomes)
    if (index + 1 >= questions.length) {
      const correctCount = nextOutcomes.filter((item) => item.correct).length
      const skippedCount = nextOutcomes.filter((item) => item.skipped).length
      const attemptedCount = questions.length - skippedCount
      const helpedCount = nextOutcomes.filter((item) => !item.mastered && !item.skipped).length
      const masteryByType = new Map<string, { mastered: boolean; attempted: boolean }>()
      nextOutcomes.forEach((item) => {
        const previous = masteryByType.get(item.typeId) ?? { mastered: true, attempted: false }
        if (!item.skipped) masteryByType.set(item.typeId, { mastered: previous.mastered && item.mastered, attempted: true })
      })
      const recorded = recordLearningSession(progress, {
        topicId,
        total: questions.length,
        attempted: attemptedCount,
        correct: correctCount,
        helped: helpedCount,
        skipped: skippedCount,
        questionIds: [...masteryByType.entries()].map(([typeId, result]) => ({ id: `${topicId}-${typeId}`, mastered: result.mastered, skipped: !result.attempted })),
      })
      onProgress(recorded.progress)
      setSummary({ correct: correctCount, total: questions.length, attempted: attemptedCount, skipped: skippedCount, mastery: recorded.summary.mastery, stickers: recorded.summary.stickersEarned })
      return
    }
    setIndex((value) => value + 1)
    setAnswer('')
    setHintLevel(guided ? 1 : 0)
    setUsedHint(guided)
    setMistakes(0)
    setStatus('idle')
  }

  if (summary) return <>
    <SiteHeader backHref={`/kelas/${grade}/${slug}/`} backLabel="Kembali ke topik" compact />
    <main className="page result-page paper-card">
      {summary.correct >= 5 && <Confetti burst={1} />}
      <Mascot expression={summary.correct >= 6 ? 'celebrate' : 'happy'} size="large" motion={summary.correct >= 6 ? 'bounce' : 'float'} />
      <p className="eyebrow">SESI SELESAI</p><h1>Usahamu hari ini berarti!</h1>
      <p>{summary.correct} dari {summary.attempted} soal yang dicoba berhasil dijawab. {summary.skipped > 0 ? `${summary.skipped} soal dilewati tanpa pengurangan nilai.` : 'Tidak perlu terburu-buru untuk jadi lebih jago.'}</p>
      <div className={`mastery-meter mastery-meter-${summary.mastery}`}><span /></div>
      <p className="mastery-label">Penguasaan topik: {summary.mastery}/4</p>
      {summary.stickers.length > 0 && <p className="sticker-earned">★ Stiker baru didapat: Biji bangga padamu!</p>}
      {saveFailed && <p className="save-warning" role="status">Browser tidak mengizinkan penyimpanan. Progres sesi ini belum tersimpan.</p>}
      <div className="hero-actions"><a className="button button-primary" href={`/latihan/${slug}/?mode=guided`}>Latihan lagi</a><a className="button button-secondary" href={`/kelas/${grade}/`}>Pilih topik lain</a></div>
    </main>
  </>

  return <>
    <SiteHeader backHref={`/kelas/${grade}/${slug}/`} backLabel="Kembali ke topik" compact confirmBack />
    <main className="page learning-practice">
      <div className="practice-topline"><div><p className="eyebrow">{topic.title.toUpperCase()}</p><h1>{guided ? 'Kita kerjakan bareng.' : 'Sekarang giliranmu.'}</h1></div><span className="practice-count">{index + 1} / {questionCount}</span></div>
      <progress className="session-progress" value={index + (status === 'correct' ? 1 : 0)} max={questionCount} aria-label="Kemajuan latihan" />
      <section className="question-card paper-card"><Confetti burst={burst} />
        <div className="question-meta"><span>SOAL {String(index + 1).padStart(2, '0')}</span><button type="button" className="sound-button" onClick={speakPrompt} aria-label="Bacakan soal">Dengarkan</button></div>
        <h2>{question.prompt}</h2>
        <VisualAid question={question} />
        <BijiCompanion question={question} questionNumber={index + 1} status={status} mistakes={mistakes} streak={streak} guided={guided} onHelpUsed={() => setUsedHint(true)} />
        {question.choices ? <div className="answer-choices">{question.choices.map((option) => <button type="button" className={`answer-choice ${answer === option ? 'is-selected' : ''}`} key={option} onClick={() => updateAnswer(option)} aria-pressed={answer === option}>{option}</button>)}</div> : <>
          <label className="answer-label" htmlFor="answer-display">Jawabanmu</label>
          <input id="answer-display" className="answer-display" value={answer} readOnly inputMode="none" placeholder="Ketuk angka di bawah" aria-describedby="keypad-help" />
          <p className="sr-only" id="keypad-help">Gunakan papan angka di bawah untuk mengisi jawaban.</p>
          <NumberKeypad value={answer} onChange={updateAnswer} disabled={status === 'correct'} />
        </>}
        {hintLevel > 0 && <div className="hint-card" role="note"><strong>Petunjuk {hintLevel} dari 3</strong><p>{question.hints[hintLevel - 1]}</p></div>}
        {status === 'wrong' && <div className="feedback feedback-wrong" role="status"><div><strong>Belum tepat. Tidak apa-apa.</strong><p>{question.misconception} Coba lihat modelnya dan periksa lagi.</p></div></div>}
        {status === 'correct' && <div className="feedback feedback-correct" role="status"><div><strong>Betul! Kamu menemukan jawabannya.</strong><p>{question.explanation}</p></div></div>}
        <div className="practice-actions">
          {status === 'correct' ? <button type="button" className="button button-primary" onClick={() => nextQuestion()}>Lanjut <span aria-hidden="true">→</span></button> : <>
            <button type="button" className="button button-help" onClick={showHint} disabled={hintLevel >= 3}>Petunjuk {hintLevel > 0 ? `${hintLevel}/3` : ''}</button>
            <button type="button" className="button button-primary" onClick={check} disabled={!answer.trim()}>Periksa</button>
          </>}
          {status !== 'correct' && <button type="button" className="skip-link" onClick={() => nextQuestion(true)}>Lewati dulu</button>}
        </div>
      </section>
    </main>
  </>
}

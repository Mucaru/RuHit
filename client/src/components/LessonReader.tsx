import { useEffect, useMemo, useState } from 'react'
import { Mascot } from './Mascot'
import { VisualAid } from './VisualAid'
import { findExample } from '../data/lesson-pecahan'
import type { LessonChapter } from '../data/lesson-pecahan'
import { solutionSteps } from '../lib/learning/solutions'
import { canSpeak, speak, stopSpeaking } from '../lib/speech'

/** Materi bab per bab: cerita, gambar, langkah dari Biji, lalu latihan khusus bab itu. */
export function LessonReader({ chapters, topicId, slug }: { chapters: LessonChapter[]; topicId: string; slug: string }) {
  const [active, setActive] = useState(0)
  const [revealed, setRevealed] = useState(1)
  const chapter = chapters[Math.min(active, chapters.length - 1)]
  const example = useMemo(() => findExample(chapter, topicId).question, [chapter, topicId])
  const steps = useMemo(() => solutionSteps(example), [example])
  const shown = Math.min(revealed, steps.length)
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => () => stopSpeaking(), [])

  function choose(index: number) { stopSpeaking(); setSpeaking(false); setActive(index); setRevealed(1) }

  function toggleSpeech() {
    if (speaking) { stopSpeaking(); setSpeaking(false); return }
    setSpeaking(speak(`${chapter.title}. ${chapter.idea} ${chapter.story}`, () => setSpeaking(false)))
  }

  return (
    <section className="lesson-reader" aria-labelledby="lesson-reader-title">
      <div className="section-heading"><div><p className="eyebrow">MATERI LENGKAP</p><h2 id="lesson-reader-title">Belajar dulu, yuk!</h2></div><span className="section-aside">{chapters.length} bab</span></div>
      <nav className="chapter-tabs" aria-label="Pilih bab materi">
        {chapters.map((item, index) => (
          <button type="button" key={item.id} className={index === active ? 'chapter-tab is-active' : 'chapter-tab'} onClick={() => choose(index)} aria-current={index === active ? 'true' : undefined}>
            <span className="chapter-emoji" aria-hidden="true">{item.emoji}</span>
            <span className="chapter-number">Bab {index + 1}</span>
            <strong>{item.short}</strong>
          </button>
        ))}
      </nav>

      <article className="chapter-card paper-card" key={chapter.id}>
        <header className="chapter-head">
          <span className="chapter-emoji chapter-emoji-large" aria-hidden="true">{chapter.emoji}</span>
          <div><p className="eyebrow">BAB {active + 1} DARI {chapters.length}</p><h3>{chapter.title}</h3></div>
          {canSpeak() && <button type="button" className="button button-secondary lesson-listen" onClick={toggleSpeech} aria-pressed={speaking}><span aria-hidden="true">{speaking ? '⏹' : '🔊'}</span> {speaking ? 'Berhenti' : 'Dengarkan'}</button>}
        </header>

        <div className="chapter-idea"><Mascot expression="excited" size="small" motion="float" label="Biji" /><p><strong>Intinya:</strong> {chapter.idea}</p></div>

        <div className="chapter-block chapter-story"><p className="eyebrow">CERITANYA</p><p>{chapter.story}</p></div>

        <div className="chapter-block">
          <p className="eyebrow">CONTOH DIKERJAKAN BIJI</p>
          <p className="example-question">{example.prompt}</p>
          <VisualAid question={example} />
          <ol className="chapter-steps">
            {steps.slice(0, shown).map((item, index) => (
              <li key={item.title + index} className={item.final ? 'chapter-step is-final' : 'chapter-step'}>
                <span className="chapter-step-number">{item.final ? '🎉' : index + 1}</span>
                <div><strong>{item.title}</strong><p>{item.text}</p></div>
              </li>
            ))}
          </ol>
          <div className="chapter-step-actions">
            {shown < steps.length
              ? <><button type="button" className="button button-primary" onClick={() => setRevealed(shown + 1)}>Langkah berikutnya →</button><button type="button" className="text-link" onClick={() => setRevealed(steps.length)}>Tampilkan semua langkah</button></>
              : <button type="button" className="button button-secondary" onClick={() => setRevealed(1)}>Ulangi dari awal</button>}
          </div>
        </div>

        <div className="chapter-block chapter-rules"><p className="eyebrow">INGAT!</p><ul>{chapter.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul></div>
        <div className="chapter-block chapter-mistake"><p className="eyebrow">AWAS SALAH KAPRAH</p><p>{chapter.mistake}</p></div>

        <footer className="chapter-foot">
          <a className="button button-primary" href={`/latihan/${slug}/?mode=guided&focus=${chapter.focus.join(',')}`}>Latihan bab ini bareng Biji</a>
          {active < chapters.length - 1 && <button type="button" className="button button-secondary" onClick={() => choose(active + 1)}>Bab berikutnya →</button>}
        </footer>
      </article>
    </section>
  )
}

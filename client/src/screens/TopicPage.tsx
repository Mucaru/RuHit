import { useMemo, useState } from 'react'
import { LessonReader } from '../components/LessonReader'
import { Mascot } from '../components/Mascot'
import { SiteHeader } from '../components/SiteHeader'
import { VisualAid } from '../components/VisualAid'
import { lessonsByTopic } from '../data/lesson-pecahan'
import { generateQuestion } from '../lib/learning/engine'
import { solutionSteps } from '../lib/learning/solutions'
import type { Topic } from '../data/kurikulum'
import type { LegacyTopic } from '../data/legacy-topics'

export function TopicPage({ topic, legacyTopic, grade }: { topic?: Topic; legacyTopic?: LegacyTopic; grade: number }) {
  const [showExample, setShowExample] = useState(false)
  const [exampleStep, setExampleStep] = useState(1)
  const [exampleSeed, setExampleSeed] = useState(0)
  const selectedTopic = topic
  const title = selectedTopic?.title ?? legacyTopic?.title ?? 'Latihan matematika'
  const description = selectedTopic?.description ?? legacyTopic?.description ?? 'Berlatih satu langkah demi satu langkah.'
  const slug = selectedTopic?.slug ?? legacyTopic?.slug ?? ''
  const chapters = selectedTopic ? lessonsByTopic[selectedTopic.id] : undefined
  const example = useMemo(() => {
    if (!selectedTopic?.generatorTypes.length) return null
    const typeId = selectedTopic.generatorTypes[exampleSeed % selectedTopic.generatorTypes.length]
    return generateQuestion(typeId, selectedTopic.id, Math.random, grade)
  }, [selectedTopic?.id, grade, exampleSeed])
  const steps = useMemo(() => (example ? solutionSteps(example) : []), [example])

  return (
    <>
      <SiteHeader backHref={`/kelas/${grade}/`} backLabel={`Kelas ${grade}`} grade={grade} />
      <main className="page inner-page topic-page">
        <section className="topic-hero paper-card">
          <div><p className="eyebrow">KELAS {grade} · {selectedTopic?.element ?? 'LATIHAN BERSUSUN'}</p><h1>{title}</h1><p>{description}</p></div>
          <Mascot expression="thinking" size="medium" motion="float" />
        </section>
        {selectedTopic && <section className="learning-objectives"><p className="eyebrow">TUJUAN BELAJAR</p><ul>{selectedTopic.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>{selectedTopic.note && <p className="curriculum-note">{selectedTopic.note}</p>}</section>}

        {selectedTopic && chapters && <LessonReader chapters={chapters} topicId={selectedTopic.id} slug={slug} />}

        <section className="lesson-flow">
          <div className="lesson-step lesson-step-look">
            <span className="step-number">01</span><div><p className="eyebrow">LIHAT</p><h2>Kenali caranya dulu</h2><p>Biji akan menunjukkan contoh baru dan menjelaskan langkahnya satu per satu.</p></div>
            <button className="button button-secondary" type="button" onClick={() => { setShowExample((shown) => !shown); setExampleStep(1) }}>{showExample ? 'Tutup contoh' : 'Lihat contoh'}</button>
          </div>
          {showExample && <div className="worked-example">
            <div className="worked-example-heading"><Mascot expression="thinking" size="small" motion="float" /><div><strong>Contoh dikerjakan Biji</strong><small>Amati gambarnya, lalu baca langkahnya.</small></div></div>
            {example ? <>
              <p className="example-question">{example.prompt}</p>
              <VisualAid question={example} />
              <ol className="chapter-steps">{steps.slice(0, exampleStep).map((item, index) => <li key={item.title + index} className={item.final ? 'chapter-step is-final' : 'chapter-step'}><span className="chapter-step-number">{item.final ? '🎉' : index + 1}</span><div><strong>{item.title}</strong><p>{item.text}</p></div></li>)}</ol>
              <div className="chapter-step-actions">
                {exampleStep < steps.length ? <button className="button button-secondary" type="button" onClick={() => setExampleStep((step) => step + 1)}>Langkah berikutnya →</button> : <button className="button button-secondary" type="button" onClick={() => { setExampleSeed((seed) => seed + 1); setExampleStep(1) }}>Contoh lain</button>}
              </div>
            </> : <p>Susun angka berdasarkan nilai tempat, lalu periksa setiap langkah.</p>}
          </div>}
          <div className="lesson-step lesson-step-together"><span className="step-number">02</span><div><p className="eyebrow">KERJAKAN BARENG</p><h2>Biji menemani kamu</h2><p>Ada tombol "Bantu aku, Biji!" kalau kamu bingung. Petunjuk muncul bertahap.</p></div><a className="button button-secondary" href={`/latihan/${slug}/?mode=guided`}>Mulai bersama</a></div>
          <div className="lesson-step lesson-step-alone"><span className="step-number">03</span><div><p className="eyebrow">COBA SENDIRI</p><h2>Sekarang giliranmu</h2><p>Kerjakan dengan tenang. Biji tetap menyemangati dari samping.</p></div><a className="button button-primary" href={`/latihan/${slug}/?mode=independent`}>Mulai mandiri <span aria-hidden="true">→</span></a></div>
        </section>
      </main>
    </>
  )
}

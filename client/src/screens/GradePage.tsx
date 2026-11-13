import { SiteHeader } from '../components/SiteHeader'
import { TopicCard } from '../components/TopicCard'
import { topicsForClass, classPlan } from '../data/kurikulum'
import { legacyTopics } from '../data/legacy-topics'
import type { Progress } from '../lib/progress'

const elementOrder = ['Bilangan', 'Aljabar', 'Pengukuran', 'Geometri', 'Analisis Data & Peluang'] as const

export function GradePage({ grade, progress }: { grade: number; progress: Progress }) {
  const plan = classPlan[grade]
  const topics = topicsForClass(grade)
  return (
    <>
      <SiteHeader backHref="/" backLabel="Beranda" />
      <main className="page inner-page">
        <section className="page-heading paper-card">
          <div><p className="eyebrow">FASE {plan.phase} · MATEMATIKA SD</p><h1>Belajar <span>kelas {grade}</span></h1><p>{plan.note} Pilih satu topik dulu, ya.</p></div>
          <div className="grade-stamp">{grade}<small>KELAS</small></div>
        </section>
        <div className="section-heading topic-heading"><div><p className="eyebrow">PETA BELAJAR</p><h2>Topik yang bisa dipelajari</h2></div><span className="section-aside">{topics.length} topik</span></div>
        {elementOrder.map((element) => {
          const items = topics.filter((topic) => topic.element === element)
          if (!items.length) return null
          return <section className="element-section" key={element}><h3>{element}</h3><div className="topic-list">{items.map((topic) => <div className="topic-list-item" key={topic.id}><TopicCard topic={topic} grade={grade} />{progress.topics[topic.id] && <span className="topic-progress">{progress.topics[topic.id].mastery}/4</span>}</div>)}</div></section>
        })}
        {grade >= 5 && <section className="legacy-section"><div><p className="eyebrow">LATIHAN BERSUSUN YANG SUDAH ADA</p><h2>Berlatih langkah hitung</h2><p>Gunakan papan kerja untuk melihat simpanan, pinjaman, dan urutan operasi.</p></div><div className="legacy-grid">{legacyTopics.map((topic) => <a className="legacy-card" href={`/latihan/${topic.slug}/`} key={topic.id}><strong>{topic.title}</strong><span aria-hidden="true">→</span></a>)}</div></section>}
        <footer className="site-footer"><a href="/laporan/">Lihat laporan belajar</a><a href="/privasi/">Privasi</a></footer>
      </main>
    </>
  )
}

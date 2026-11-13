import { useMemo, useState } from 'react'
import { SiteHeader } from '../components/SiteHeader'
import { topics } from '../data/kurikulum'
import { legacyTopics } from '../data/legacy-topics'
import { dueLeitnerCards, streakOf, totalStars } from '../lib/progress'
import type { Progress } from '../lib/progress'

export function ReportPage({ progress, saveFailed, onReset }: { progress: Progress; saveFailed: boolean; onReset: () => void }) {
  const [confirming, setConfirming] = useState(false)
  const practiced = Object.values(progress.topics).reduce((sum, item) => sum + item.plays, 0) + Object.values(progress.levels).reduce((sum, item) => sum + item.plays, 0)
  const due = dueLeitnerCards(progress)
  const topicRows = useMemo(() => topics.map((topic) => {
    const record = progress.topics[topic.id]
    const accuracy = record && record.total > 0 ? Math.round(record.correct / record.total * 100) : 0
    return { topic, record, accuracy }
  }).filter((row) => row.record).sort((a, b) => (a.record?.mastery ?? 0) - (b.record?.mastery ?? 0)), [progress.topics])
  const needsPractice = topicRows.filter((row) => row.accuracy < 70 || (row.record?.mastery ?? 0) < 2).slice(0, 4)
  const mastered = topicRows.filter((row) => (row.record?.mastery ?? 0) >= 3)
  const legacyRows = legacyTopics.map((topic) => {
    const records = Object.entries(progress.levels).filter(([key]) => key.startsWith(`${topic.id}:`)).map(([, record]) => record)
    return { topic, plays: records.reduce((sum, record) => sum + record.plays, 0), bestStars: records.reduce((best, record) => Math.max(best, record.bestStars), 0) }
  }).filter((row) => row.plays > 0)
  const recent = [...progress.history].reverse().slice(0, 10)
  const titleFor = (id: string) => topics.find((topic) => topic.id === id)?.title ?? legacyTopics.find((topic) => topic.id === id)?.title ?? id
  const formatDate = (key: string) => {
    const [year, month, day] = key.split('-').map(Number)
    return year ? new Date(year, month - 1, day).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Tanggal tidak tersedia'
  }

  function reset() {
    onReset()
    setConfirming(false)
  }

  return <>
    <SiteHeader backHref="/" backLabel="Beranda" />
    <main className="page inner-page report-page">
      <section className="page-heading paper-card"><div><p className="eyebrow">RINGKASAN UNTUK ORANG TUA & GURU</p><h1>Perkembangan <span>belajarmu</span></h1><p>Catatan ini hanya tersimpan di browser pada perangkat ini.</p></div><button className="button button-secondary print-button" type="button" onClick={() => window.print()}>Cetak laporan</button></section>
      {saveFailed && <p className="save-warning" role="status">Browser tidak mengizinkan penyimpanan. Progres sesi ini belum tersimpan.</p>}
      <section className="report-stats"><div><strong>{practiced}</strong><span>sesi latihan</span></div><div><strong>{totalStars(progress)}</strong><span>bintang operasi</span></div><div><strong>{streakOf(progress.days)}</strong><span>hari beruntun</span></div><div><strong>{due.length}</strong><span>ulangan siap</span></div></section>
      {topicRows.length === 0 && legacyRows.length === 0 ? <section className="empty-report paper-card"><h2>Belum ada catatan latihan.</h2><p>Setelah anak menyelesaikan latihan, topik kuat dan bagian yang perlu diulang akan muncul di sini.</p><a className="button button-primary" href="/kelas/5/">Mulai latihan</a></section> : <>
        <section className="report-section"><div className="section-heading"><div><p className="eyebrow">LANGKAH BERIKUTNYA</p><h2>Topik yang bisa diulang</h2></div></div>
          {needsPractice.length ? <div className="report-topic-list">{needsPractice.map(({ topic, record, accuracy }) => <article className="report-topic" key={topic.id}><div><strong>{topic.title}</strong><small>{accuracy}% jawaban benar · penguasaan {record?.mastery ?? 0}/4</small></div><a className="button button-secondary" href={`/latihan/${topic.slug}/?mode=guided`}>Latihan</a></article>)}</div> : <p className="report-positive">Belum ada topik yang perlu diulang. Pertahankan kebiasaan belajar santai!</p>}
        </section>
        <section className="report-section"><div className="section-heading"><div><p className="eyebrow">SUDAH KUAT</p><h2>Topik yang mulai dikuasai</h2></div></div>
          {mastered.length ? <ul className="mastered-list">{mastered.map(({ topic, accuracy, record }) => <li key={topic.id}><span>{topic.title}</span><strong>{accuracy}% · {record?.mastery}/4</strong></li>)}</ul> : <p>Topik akan muncul di sini setelah latihan beberapa kali.</p>}
        </section>
        {legacyRows.length > 0 && <section className="report-section"><h2>Latihan bersusun</h2><ul className="mastered-list">{legacyRows.map(({ topic, plays, bestStars }) => <li key={topic.id}><span>{topic.title} · {plays} sesi</span><strong>{bestStars}/3 bintang terbaik</strong></li>)}</ul></section>}
        {recent.length > 0 && <section className="report-section"><h2>10 sesi terakhir</h2><ul className="history-list">{recent.map((item, index) => <li key={`${item.date}-${item.activity}-${index}`}><div><strong>{titleFor(item.activity)}</strong><small>{formatDate(item.date)} · {item.score}/{item.total} jawaban benar · {item.clean} mandiri</small></div><span className="history-stars" aria-label={`${item.stars} bintang`}>{'★'.repeat(item.stars)}{'☆'.repeat(3 - item.stars)}</span></li>)}</ul></section>}
        <section className="report-section report-note"><h2>Catatan belajar</h2><p>Gunakan hasil ini sebagai petunjuk, bukan nilai atau peringkat. Anak boleh mengulang topik kapan saja dan tidak ada hukuman untuk jawaban yang salah.</p></section>
      </>}
      <section className="report-reset">
        {confirming ? <div className="reset-confirm" role="alert"><strong>Hapus semua progres di perangkat ini?</strong><p>Bintang, stiker, dan riwayat latihan akan dihapus. Tindakan ini tidak bisa dibatalkan.</p><div><button className="button button-danger" type="button" onClick={reset}>Ya, hapus semua</button><button className="button button-secondary" type="button" onClick={() => setConfirming(false)}>Batal</button></div></div> : <button className="reset-link" type="button" disabled={practiced === 0 && progress.history.length === 0} onClick={() => setConfirming(true)}>Hapus semua progres</button>}
      </section>
      <footer className="site-footer"><a href="/">Beranda</a><a href="/privasi/">Privasi</a></footer>
    </main>
  </>
}

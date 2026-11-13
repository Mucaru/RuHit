import { useState } from 'react'
import { Brand } from '../components/Brand'
import { FirstTimeGuide } from '../components/FirstTimeGuide'
import { Mascot } from '../components/Mascot'
import { tapLines } from '../data/biji-lines'
import { totalStars, streakOf } from '../lib/progress'
import type { Progress } from '../lib/progress'

function HeroBiji() {
  const [count, setCount] = useState(0)
  const [expression, setExpression] = useState<'happy' | 'excited'>('happy')
  const line = count === 0 ? 'Hai! Aku Biji. Colek aku, ya!' : tapLines[count % tapLines.length]
  return (
    <div className="hero-biji-wrap">
      <p className="speech" role="status" aria-live="polite">{line}</p>
      <button type="button" className="hero-biji" onClick={() => { setCount((value) => value + 1); setExpression('excited') }} onAnimationEnd={() => setExpression('happy')} aria-label="Colek Biji">
        <Mascot expression={expression} size="large" motion={count > 0 ? 'bounce' : 'float'} />
      </button>
      <p className="hero-biji-note">Teman hitung yang sabar, selalu siap mencoba lagi.</p>
    </div>
  )
}

export function HomePage({ progress, onProgress }: { progress: Progress; onProgress: (progress: Progress) => void }) {
  const [showGuide, setShowGuide] = useState(!progress.seenGuide)
  const stars = totalStars(progress) + Object.values(progress.topics).reduce((sum, topic) => sum + topic.mastery, 0)
  const practiced = Object.values(progress.topics).reduce((sum, topic) => sum + topic.plays, 0) + Object.values(progress.levels).reduce((sum, level) => sum + level.plays, 0)
  const streak = streakOf(progress.days)
  return (
    <>
    <main className="page home-page">
      <div className="home-topline"><Brand /><span className="home-note">Belajar tanpa buru-buru</span></div>
      <section className="home-hero paper-card">
        <div className="hero-copy">
          <p className="eyebrow">RUANG BELAJAR MATEMATIKA SD</p>
          <h1>Belajar hitung jadi <span>seru bareng Biji!</span></h1>
          <p className="hero-description">Lihat contoh, kerjakan bareng Biji, lalu coba sendiri. Bingung? Biji siap bantu langkah demi langkah. Salah itu bukan masalah, kita cari tahu bareng!</p>
          <div className="hero-actions">
            <a className="button button-primary" href="/kelas/5/">Mulai belajar kelas 5 <span aria-hidden="true">→</span></a>
            <a className="button button-help" href="/kelas/5/pecahan/"><span aria-hidden="true">🍕</span> Materi pecahan</a><a className="button button-secondary" href="/kelas/1/">Pilih kelas</a>
          </div>
          <div className="home-promises"><span>✓ Tanpa timer</span><span>✓ Biji bantu tiap soal</span><span>✓ Materi pecahan lengkap</span></div>
        </div>
        <div className="hero-mascot-area"><HeroBiji /></div>
      </section>

      <section className="quick-stats" aria-label="Ringkasan belajarmu">
        <div><strong>{practiced}</strong><span>topik dicoba</span></div>
        <div><strong>{stars}</strong><span>bintang & level</span></div>
        <div><strong>{streak}</strong><span>hari beruntun</span></div>
      </section>

      <section className="class-section">
        <div className="section-heading"><div><p className="eyebrow">PILIH KELAS</p><h2>Mau belajar kelas berapa?</h2></div><span className="section-aside">Kelas 1–6</span></div>
        <div className="class-grid">
          {[1, 2, 3, 4, 5, 6].map((grade) => <a className={`class-card class-card-${grade}`} href={`/kelas/${grade}/`} key={grade}><span className="class-card-label">KELAS</span><strong>{grade}</strong><span className="class-card-arrow" aria-hidden="true">↗</span></a>)}
        </div>
      </section>

      {progress.stickers.length > 0 && <section className="sticker-collection"><div><p className="eyebrow">KOLEKSI KECIL</p><strong>Stiker Biji yang kamu dapat</strong></div><div className="sticker-list">{progress.stickers.map((sticker) => <span className="sticker-chip" key={sticker}><img src="/brand/mascot-celebrate.svg" alt="" width="22" height="22" /> {sticker.replace('mastery-', '').replaceAll('-', ' ')}</span>)}</div></section>}

      <section className="home-footer-card">
        <Mascot expression="thinking" size="small" />
        <div><strong>Untuk orang tua dan guru</strong><p>Lihat topik yang sudah dikuasai dan latihan yang bisa diulang.</p></div>
        <a className="text-link" href="/laporan/">Buka laporan <span aria-hidden="true">→</span></a>
      </section>
      <footer className="site-footer"><span>Ruang Hitung · Matematika SD</span><a href="/privasi/">Privasi</a></footer>
    </main>
    {showGuide && <FirstTimeGuide onClose={() => { setShowGuide(false); onProgress({ ...progress, seenGuide: true }) }} />}
    </>
  )
}

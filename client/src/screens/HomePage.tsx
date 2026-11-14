import { useState } from 'react'
import { Brand } from '../components/Brand'
import { FirstTimeGuide } from '../components/FirstTimeGuide'
import { Mascot } from '../components/Mascot'
import { tapLines } from '../data/biji-lines'
import { topics } from '../data/kurikulum'
import { legacyTopics } from '../data/legacy-topics'
import { hasProgress, totalStars, streakOf } from '../lib/progress'
import type { Progress } from '../lib/progress'

type StartTarget = { href: string; label: string; resume: boolean; hint: string | null }

/**
 * Satu tujuan untuk tombol utama beranda.
 * - Sudah pernah berlatih: "Lanjutkan" ke topik terakhir (kalau dikenali), kalau tidak ke kelas terakhir.
 * - Belum pernah: "Mulai belajar" ke kelas terakhir yang dibuka, atau turun ke pilihan kelas.
 * Topik kurikulum punya halaman /kelas/{kelas}/{slug}/; latihan bersusun hanya punya /latihan/{slug}/.
 */
function startTarget(progress: Progress): StartTarget {
  const grade = progress.lastGrade
  if (hasProgress(progress)) {
    const lastId = progress.history.at(-1)?.activity
    const topic = topics.find((item) => item.id === lastId)
    if (topic) return { href: `/kelas/${grade !== null && topic.classes.includes(grade) ? grade : topic.classes[0]}/${topic.slug}/`, label: 'Lanjutkan belajar', resume: true, hint: topic.title }
    const legacy = legacyTopics.find((item) => item.id === lastId)
    if (legacy) return { href: `/latihan/${legacy.slug}/`, label: 'Lanjutkan belajar', resume: true, hint: legacy.title }
    if (grade !== null) return { href: `/kelas/${grade}/`, label: 'Lanjutkan belajar', resume: true, hint: `Kelas ${grade}` }
  }
  return { href: grade !== null ? `/kelas/${grade}/` : '#pilih-kelas', label: 'Mulai belajar', resume: false, hint: null }
}

function HeroBiji() {
  const [count, setCount] = useState(0)
  const [expression, setExpression] = useState<'happy' | 'excited'>('happy')
  const line = count === 0 ? 'Hai! Aku Biji. Colek aku, ya!' : tapLines[count % tapLines.length]
  return (
    <div className="hero-biji-wrap">
      <p className="speech" role="status" aria-live="polite">{line}</p>
      <button type="button" className="hero-biji" onClick={() => { setCount((value) => value + 1); setExpression('excited') }} onAnimationEnd={() => setExpression('happy')} aria-label="Colek Biji">
        <Mascot expression={expression} size="large" motion={count > 0 ? 'bounce' : 'float'} priority />
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
  const hasStats = practiced > 0 || stars > 0 || streak > 0
  const start = startTarget(progress)
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
            <a className="button button-primary" href={start.href}>{start.label} <span aria-hidden="true">→</span></a>
          </div>
          {start.resume && start.hint && <p className="hero-resume">Terakhir: {start.hint}</p>}
          <div className="home-promises"><span>✓ Tanpa timer</span><span>✓ Biji bantu tiap soal</span><span>✓ Materi pecahan lengkap</span></div>
        </div>
        <div className="hero-mascot-area"><HeroBiji /></div>
      </section>

      {hasStats ? (
        <section className="quick-stats" aria-label="Ringkasan belajarmu">
          <div><strong>{practiced}</strong><span>topik dicoba</span></div>
          <div><strong>{stars}</strong><span>bintang & level</span></div>
          <div><strong>{streak}</strong><span>hari beruntun</span></div>
        </section>
      ) : (
        <section className="quick-empty" aria-label="Ringkasan belajarmu">
          <p><strong>Bintang pertamamu menunggu.</strong> Satu latihan pendek saja cukup untuk mulai. Biji temani, ya!</p>
        </section>
      )}

      <section className="class-section" id="pilih-kelas">
        <div className="section-heading"><div><p className="eyebrow">PILIH KELAS</p><h2>Mau belajar kelas berapa?</h2></div><span className="section-aside">Kelas 1–6</span></div>
        <div className="class-grid">
          {[1, 2, 3, 4, 5, 6].map((grade) => <a className={`class-card class-card-${grade}`} href={`/kelas/${grade}/`} key={grade}><span className="class-card-label">Kelas</span><strong>{grade}</strong><span className="class-card-arrow" aria-hidden="true">↗</span></a>)}
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

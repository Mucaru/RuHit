import type { Activity } from '../lib/math'
import { ActivityCard } from '../components/ActivityCard'
import { Brand } from '../components/Brand'
import { activityMeta } from '../data/activities'
import { Flame, Star } from 'lucide-react'
import { streakOf, totalStars } from '../lib/progress'
import type { Progress } from '../lib/progress'

export function Home({ progress, onOpen, onReport }: { progress: Progress; onOpen: (activity?: Activity) => void; onReport: () => void }) {
  const stars = totalStars(progress)
  const streak = streakOf(progress.days)
  return <main className="page home-page">
    <header className="home-nav"><Brand /><div className="nav-note"><span>✦</span> Belajar tanpa buru-buru</div></header>
    <section className="hero">
      <div className="hero-copy"><div className="kicker"><span className="spark-dot" /> KELAS 5 · BELAJAR SAMBIL PAHAM</div><h1>Matematika jadi mudah saat kamu <mark>ikut mengerjakan.</mark></h1><p>Di sini bukan tebak jawaban. Kamu menulis setiap langkah, melihat nilai tempat, dan tahu kenapa jawabanmu benar.</p><div className="hero-actions"><button className="primary-button large" type="button" onClick={() => onOpen('addition')}>Mulai dari penjumlahan <span>→</span></button><button className="ghost-button" type="button" onClick={() => onOpen()}>Lihat semua latihan</button></div><div className="hero-trust"><span>sesi singkat</span><i /> <span>bebas coba lagi</span><i /> <span>ada petunjuk</span></div></div>
      <div className="hero-visual"><span className="orbit orbit-a" /><span className="orbit orbit-b" /><div className="floating-note note-top">Tulis langkahmu <b>✎</b></div><div className="worksheet-card"><div className="worksheet-head"><span className="mini-number">1</span><strong>375 + 923</strong><span className="mini-star">✦</span></div><div className="carry-mini"><i /><i /><i /><i /></div><div className="sum-mini"><span /><b>3</b><b>7</b><b>5</b><em>+</em><b>9</b><b>2</b><b>3</b></div><div className="sum-line" /><div className="answer-mini"><i /><i /><i /><i /></div><div className="worksheet-tip">Kotak kecil untuk angka simpanan</div></div><div className="floating-note note-bottom"><span>✓</span> Langkah demi langkah</div><div className="hero-spark spark-one">＋</div><div className="hero-spark spark-two">÷</div></div>
    </section>
    {(stars > 0 || streak > 0) && <section className="progress-strip" aria-label="Progres belajarmu"><div><Star size={24} className="star on" aria-hidden="true" /><b>{stars}</b><span>bintang</span></div><div><Flame size={24} className="flame" aria-hidden="true" /><b>{streak}</b><span>hari beruntun</span></div></section>}
    <section className="home-section"><div className="section-intro"><div><div className="kicker muted">PILIH PETUALANGANMU</div><h2>Mau belajar apa hari ini?</h2></div><span className="topic-count">8 cara belajar</span></div><div className="activity-list">{activityMeta.map((item) => <ActivityCard key={item.id} item={item} onClick={() => onOpen(item.id)} />)}</div></section>
    <section className="principles"><div className="principle"><span>01</span><div><strong>Bukan tebak-tebakan</strong><p>Setiap jawaban punya alasan yang bisa kamu lihat.</p></div></div><div className="principle"><span>02</span><div><strong>Seperti di buku tulis</strong><p>Kolom, carry, pinjaman, dan panah ditunjukkan jelas.</p></div></div><div className="principle"><span>03</span><div><strong>Salah itu petunjuk</strong><p>Feedback membantu menemukan langkah yang perlu diperbaiki.</p></div></div></section>
    <footer className="home-footer"><span>Pelan-pelan tidak apa-apa. Yang penting kamu paham caranya.</span><button type="button" className="report-link" onClick={onReport}>Laporan untuk orang tua dan guru</button></footer>
  </main>
}

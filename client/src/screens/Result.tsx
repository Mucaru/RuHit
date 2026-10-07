import { Flame, Star } from 'lucide-react'
import type { SessionSummary } from '../lib/progress'

const HEADLINE = ['Ayo coba lagi, pelan-pelan saja', 'Bagus, kamu sudah mencoba!', 'Hebat, hampir sempurna!', 'Luar biasa, kamu jago!']

export function Result({ summary, title, level, hasNextLevel, saveFailed, onHome, onAgain, onNextLevel }: { summary: SessionSummary; title: string; level: number; hasNextLevel: boolean; saveFailed: boolean; onHome: () => void; onAgain: () => void; onNextLevel: () => void }) {
  const { stars, score, total, review, streak, improved } = summary
  const goNext = stars >= 3 && hasNextLevel
  return <main className="page result-page"><section className="result-card">
    <div className="kicker muted">SESI SELESAI</div>
    <div className="star-row large" role="img" aria-label={`${stars} dari 3 bintang`}>{[1, 2, 3].map((n) => <Star key={n} size={44} className={n <= stars ? 'star on' : 'star'} aria-hidden="true" />)}</div>
    <h1>{HEADLINE[stars]}</h1>
    <p>{improved && stars > 0 ? 'Bintangmu naik dari sebelumnya!' : `${score} dari ${total} soal selesai, ${summary.clean} dikerjakan mandiri.`}</p>
    {streak >= 2 && <div className="streak-chip"><Flame size={20} aria-hidden="true" /> {streak} hari berlatih beruntun</div>}
    {review.length > 0 && <div className="review-box"><h2>Yang perlu diulang</h2><ul>{review.map((item, index) => <li key={index}><span>{item.label}</span><b>{item.answer}</b></li>)}</ul><p className="review-hint">Jawaban benarnya ada di sebelah kanan.</p></div>}
    {saveFailed && <p className="save-warning" role="status">Progres tidak bisa disimpan di perangkat ini (mungkin mode privat). Bintang akan hilang kalau halaman ditutup.</p>}
    <div className="result-actions"><button className="primary-button large" type="button" onClick={goNext ? onNextLevel : onAgain}>{goNext ? `Naik ke Level ${level + 1}` : `Latihan ${title} lagi`}</button><button className="secondary-button" type="button" onClick={onHome}>Ke beranda</button></div>
  </section></main>
}

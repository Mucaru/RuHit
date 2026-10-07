import { useState } from 'react'
import { Star } from 'lucide-react'
import type { Activity } from '../lib/math'
import { activityMeta, levels } from '../data/activities'
import { levelRecord, streakOf } from '../lib/progress'
import type { Progress } from '../lib/progress'

const titleOf = (id: string) => activityMeta.find((item) => item.id === id)?.title ?? id
const formatDate = (key: string) => { const [y, m, d] = key.split('-').map(Number); return y ? new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-' }
const Stars = ({ count }: { count: number }) => <span className="star-row small" role="img" aria-label={`${count} dari 3 bintang`}>{[1, 2, 3].map((n) => <Star key={n} size={18} className={n <= count ? 'star on' : 'star'} aria-hidden="true" />)}</span>

export function Report({ progress, saveFailed, onReset, onPractice }: { progress: Progress; saveFailed: boolean; onReset: () => void; onPractice: (activity: Activity, level: number) => void }) {
  const [confirming, setConfirming] = useState(false)
  const sessions = Object.values(progress.levels).reduce((sum, item) => sum + item.plays, 0)
  const stars = Object.values(progress.levels).reduce((sum, item) => sum + item.bestStars, 0)
  const weak = activityMeta.flatMap((item) => Array.from({ length: levels[item.id] }, (_, i) => ({ id: item.id, level: i + 1, record: levelRecord(progress, item.id, i + 1) }))).filter((row) => row.record && row.record.bestStars < 2)
  const recent = [...progress.history].reverse().slice(0, 10)
  return <main className="page inner-page report-page">
    <div className="page-intro tone-mint"><div className="kicker muted">LAPORAN BELAJAR</div><h1>Perkembangan <em>di perangkat ini.</em></h1><p>Data hanya tersimpan di browser ini. Tidak dikirim ke mana pun.</p></div>
    {saveFailed && <p className="save-warning" role="status">Browser ini menolak penyimpanan, jadi progres tidak tersimpan.</p>}
    <div className="report-stats"><div><b>{sessions}</b><span>sesi selesai</span></div><div><b>{stars}</b><span>bintang</span></div><div><b>{streakOf(progress.days)}</b><span>hari beruntun</span></div></div>
    {sessions === 0 ? <p className="report-empty">Belum ada sesi latihan. Setelah anak menyelesaikan satu sesi, laporannya muncul di sini.</p> : <>
      {weak.length > 0 && <section className="report-section"><h2>Perlu diulang</h2><ul className="report-weak">{weak.map((row) => <li key={`${row.id}-${row.level}`}><div><strong>{titleOf(row.id)} · Level {row.level}</strong><Stars count={row.record!.bestStars} /></div><button type="button" className="secondary-button" onClick={() => onPractice(row.id, row.level)}>Latihan</button></li>)}</ul></section>}
      <section className="report-section"><h2>Bintang per topik</h2><div className="report-table" role="table" aria-label="Bintang per topik dan level">{activityMeta.map((item) => <div className="report-row" role="row" key={item.id}><span role="rowheader">{item.title}</span>{Array.from({ length: levels[item.id] }, (_, i) => { const r = levelRecord(progress, item.id, i + 1); return <span role="cell" key={i} className={r ? '' : 'untouched'}><small>L{i + 1}</small>{r ? <Stars count={r.bestStars} /> : <em>belum</em>}</span> })}</div>)}</div></section>
      <section className="report-section"><h2>10 sesi terakhir</h2><ul className="report-history">{recent.map((item, index) => <li key={index}><div><strong>{titleOf(item.activity)} · Level {item.level}</strong><small>{formatDate(item.date)} · {item.score}/{item.total} selesai, {item.clean} mandiri</small>{item.review.length > 0 && <small className="review-line">Perlu diulang: {item.review.map((r) => r.label).join(', ')}</small>}</div><Stars count={item.stars} /></li>)}</ul></section>
    </>}
    <section className="report-section danger-zone">{confirming ? <><p>Semua bintang dan riwayat di perangkat ini akan dihapus dan tidak bisa dikembalikan.</p><div className="dialog-actions"><button type="button" className="primary-button" autoFocus onClick={() => { onReset(); setConfirming(false) }}>Ya, hapus semua</button><button type="button" className="secondary-button" onClick={() => setConfirming(false)}>Batal</button></div></> : <button type="button" className="ghost-button" disabled={sessions === 0 && progress.history.length === 0} onClick={() => setConfirming(true)}>Hapus semua progres</button>}</section>
  </main>
}

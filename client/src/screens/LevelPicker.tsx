import { Star } from 'lucide-react'
import type { Activity } from '../lib/math'
import { activityMeta, levelInfo, levels } from '../data/activities'
import { levelRecord, recommendedLevel } from '../lib/progress'
import type { Progress } from '../lib/progress'

export function LevelPicker({ activity, progress, onStart, onBack }: { activity: Activity; progress: Progress; onStart: (level: number) => void; onBack: () => void }) {
  const meta = activityMeta.find((item) => item.id === activity)!
  const recommended = recommendedLevel(progress, activity, levels[activity])
  return <main className="page inner-page level-page"><div className={`page-intro tone-${meta.tone}`}><div className="kicker muted">{meta.title.toUpperCase()}</div><h1>Pilih level <em>dengan caramu.</em></h1><p>Mulai dari yang terasa nyaman. Semua sesi punya petunjuk dan bisa diulang.</p><div className="intro-doodle">{meta.icon} 1 2 3</div></div><div className="section-intro compact"><div><div className="kicker muted">PILIH TINGKATMU</div><h2>Seberapa siap kamu hari ini?</h2></div><button className="back-link" type="button" onClick={onBack}>← Ganti topik</button></div><div className="level-grid">{Array.from({ length: levels[activity] }, (_, index) => {
    const number = index + 1
    const stars = levelRecord(progress, activity, number)?.bestStars ?? 0
    const isRecommended = number === recommended && stars < 3
    return <button className={`level-card level-${number} ${stars >= 3 ? 'mastered' : ''} ${isRecommended ? 'recommended' : ''}`} type="button" key={index} onClick={() => onStart(number)}><div className="level-top"><span>{String(number).padStart(2, '0')}</span>{stars >= 3 ? <em className="level-chip done">Sudah jago</em> : isRecommended ? <em className="level-chip next">Coba ini</em> : null}</div><strong>{levelInfo[index][0]}</strong><small>{levelInfo[index][1]}</small><div className="star-row" role="img" aria-label={`${stars} dari 3 bintang`}>{[1, 2, 3].map((n) => <Star key={n} size={22} className={n <= stars ? 'star on' : 'star'} aria-hidden="true" />)}</div><div className="level-go">Mulai <span>→</span></div></button>
  })}</div></main>
}

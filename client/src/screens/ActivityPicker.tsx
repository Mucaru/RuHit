import type { Activity } from '../lib/math'
import { ActivityCard } from '../components/ActivityCard'
import { activityMeta } from '../data/activities'

export function ActivityPicker({ onChoose, onBack }: { onChoose: (activity: Activity) => void; onBack: () => void }) {
  return <main className="page inner-page"><div className="page-intro tone-mint"><div className="kicker muted">PILIH CARA BERHITUNG</div><h1>Satu langkah kecil, lalu <em>langkah berikutnya.</em></h1><p>Pilih topik yang ingin kamu pelajari. Setiap latihan punya papan kerja agar kamu bisa mengikuti cara hitungnya.</p><div className="intro-doodle">＋ × ÷</div></div><div className="section-intro compact"><div><div className="kicker muted">SEMUA LATIHAN</div><h2>Mulai dari yang terasa nyaman</h2></div><button className="back-link" type="button" onClick={onBack}>← Kembali ke home</button></div><div className="activity-list">{activityMeta.map((item) => <ActivityCard key={item.id} item={item} onClick={() => onChoose(item.id)} />)}</div></main>
}

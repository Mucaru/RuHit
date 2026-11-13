import type { Topic } from '../data/kurikulum'

const icons: Record<Topic['element'], string> = {
  Bilangan: '🔢',
  Aljabar: '🧩',
  Pengukuran: '📏',
  Geometri: '🔷',
  'Analisis Data & Peluang': '📊',
}

function iconFor(topic: Topic) {
  if (topic.slug.includes('pecahan') || topic.slug.includes('setengah')) return '🍕'
  if (topic.slug.includes('desimal') || topic.slug.includes('persen')) return '💯'
  if (topic.slug.includes('waktu')) return '⏰'
  return icons[topic.element]
}

export function TopicCard({ topic, grade }: { topic: Topic; grade: number }) {
  return (
    <a className="topic-card" href={`/kelas/${grade}/${topic.slug}/`}>
      <span className="topic-number" aria-hidden="true">{iconFor(topic)}</span>
      <span className="topic-card-copy">
        <strong>{topic.title}</strong>
        <small>{topic.description}</small>
      </span>
      <span className="topic-arrow" aria-hidden="true">→</span>
    </a>
  )
}

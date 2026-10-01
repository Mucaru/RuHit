import { activityMeta } from '../data/activities'

export function ActivityCard({ item, onClick }: { item: typeof activityMeta[number]; onClick: () => void }) {
  return <button className={`activity-card tone-${item.tone}`} type="button" onClick={onClick}><div className="activity-card-top"><span className="activity-icon">{item.icon}</span>{item.label && <small>{item.label}</small>}</div><strong>{item.title}</strong><p>{item.description}</p><span className="card-link">Mulai latihan <b>→</b></span></button>
}

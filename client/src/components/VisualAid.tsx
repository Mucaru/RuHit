import type { LearningQuestion, VisualKind } from '../lib/learning/types'
import { FractionModel } from './FractionModel'

function PlaceValue({ question }: { question: LearningQuestion }) {
  const value = Number(question.params.value ?? question.params.a ?? 0)
  const digits = String(value).split('').reverse()
  const labels = ['Satuan', 'Puluhan', 'Ratusan', 'Ribuan', 'Puluh ribuan', 'Ratus ribuan']
  return <div className="place-value-visual" aria-label="Tabel nilai tempat">
    {digits.slice(0, 6).map((digit, index) => <div className="place-value-cell" key={`${digit}-${index}`}><strong>{digit}</strong><small>{labels[index]}</small></div>)}
  </div>
}

function NumberLine({ question }: { question: LearningQuestion }) {
  const values = Array.isArray(question.params.values) ? question.params.values as number[] : [Number(question.params.a ?? 0), Number(question.params.b ?? 10)]
  const min = Math.min(...values); const max = Math.max(...values); const spread = Math.max(1, max - min)
  return <div className="number-line-visual" aria-label="Garis bilangan dengan penanda nilai">
    <div className="number-line-track" />
    {values.slice(0, 5).map((value, index) => <span className="number-line-point" key={`${value}-${index}`}><i /><small>{value}</small></span>)}
    <small className="number-line-caption">Perhatikan letak nilai, bukan hanya bentuk angkanya.</small>
    <span className="sr-only">Rentang contoh {min} sampai {max}, selisih {spread}.</span>
  </div>
}

function GridVisual({ question }: { question: LearningQuestion }) {
  const columns = Math.min(8, Math.max(2, Number(question.params.columns ?? question.params.length ?? question.params.side ?? question.params.b ?? 4)))
  const rows = Math.min(6, Math.max(2, Number(question.params.rows ?? question.params.width ?? question.params.height ?? question.params.a ?? 3)))
  return <div className={`area-grid area-grid-${columns}`} aria-label={`Kisi petak ${columns} kolom dan ${rows} baris`}>
    {Array.from({ length: columns * rows }, (_, index) => <span className="area-grid-cell" key={index} />)}
  </div>
}

function ChartVisual({ question }: { question: LearningQuestion }) {
  const values = (question.params.values as number[] | undefined) ?? (question.params.counts as number[] | undefined) ?? [3, 5, 2]
  const max = Math.max(1, ...values)
  return <div className="chart-visual" role="img" aria-label="Diagram batang sederhana">
    {values.slice(0, 5).map((value, index) => <div className="chart-column" key={index}><span className={`chart-bar chart-bar-${Math.round(value / max * 10)}`} /><small>{['A', 'B', 'C', 'D', 'E'][index]}</small></div>)}
  </div>
}


function ShapeVisual({ question }: { question: LearningQuestion }) {
  const sides = Math.max(3, Math.min(8, Number(question.params.sides ?? 4)))
  const points = Array.from({ length: sides }, (_, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / sides)
    return `${100 + 68 * Math.cos(angle)},${80 + 62 * Math.sin(angle)}`
  }).join(' ')
  return <div className="shape-visual"><svg viewBox="0 0 200 160" role="img" aria-label={`Bangun datar dengan ${sides} sisi`}><polygon points={points} fill="#f2c85b" stroke="#202a2b" strokeWidth="5" strokeLinejoin="round" /></svg><small>Hitung setiap sisi satu kali.</small></div>
}

function PositionVisual({ question }: { question: LearningQuestion }) {
  const position = String(question.params.position ?? 'kiri')
  return <div className={`position-visual position-${position}`} role="img" aria-label={`Bola berada di sebelah ${position} kotak`}><span className="position-ball" /><span className="position-box" /></div>
}

function PatternVisual({ question }: { question: LearningQuestion }) {
  const first = String(question.params.first ?? 'lingkaran')
  const second = String(question.params.second ?? 'segitiga')
  return <div className="pattern-visual" aria-label="Pola bentuk berulang">{[first, second, first, second].map((shape, index) => <span className={`pattern-shape shape-${shape}`} key={index} />)}<span className="pattern-question">?</span></div>
}


function AngleVisual({ question }: { question: LearningQuestion }) {
  const degrees = Math.max(15, Math.min(165, Number(question.params.angle ?? 90)))
  const radians = -degrees * Math.PI / 180
  const endX = 100 + 72 * Math.cos(radians)
  const endY = 120 + 72 * Math.sin(radians)
  const arcX = 100 + 28 * Math.cos(radians)
  const arcY = 120 + 28 * Math.sin(radians)
  return <div className="angle-visual"><svg viewBox="0 0 200 150" role="img" aria-label={`Sudut ${degrees} derajat`}><path d="M100 120 L180 120" stroke="#202a2b" strokeWidth="5" strokeLinecap="round"/><path d={`M100 120 L${endX} ${endY}`} stroke="#202a2b" strokeWidth="5" strokeLinecap="round"/><path d={`M128 120 Q${arcX} ${arcY} 100 92`} stroke="#ed6b3d" strokeWidth="3" fill="none"/><circle cx="100" cy="120" r="4" fill="#202a2b"/></svg><small>{degrees}°</small></div>
}

function VolumeVisual({ question }: { question: LearningQuestion }) {
  const side = Math.max(2, Math.min(8, Number(question.params.side ?? 3)))
  return <div className="volume-visual" role="img" aria-label={`Kubus dengan panjang rusuk ${side} sentimeter`}><svg viewBox="0 0 220 170"><path d="M110 20 190 62 110 104 30 62Z" fill="#f2c85b" stroke="#202a2b" strokeWidth="4" strokeLinejoin="round"/><path d="M30 62v74l80 30v-62Z" fill="#ed6b3d" stroke="#202a2b" strokeWidth="4" strokeLinejoin="round"/><path d="M110 104v62l80-30V62Z" fill="#28799a" stroke="#202a2b" strokeWidth="4" strokeLinejoin="round"/><path d="M110 20v84M30 62l80 42 80-42" fill="none" stroke="#202a2b" strokeWidth="2" strokeDasharray="5 5"/></svg><small>Rusuk {side} cm · isi kubus dihitung dalam kubik</small></div>
}

function TallyVisual({ question }: { question: LearningQuestion }) {
  const count = Math.max(1, Math.min(20, Number(question.params.count ?? 5)))
  const groups = Array.from({ length: Math.ceil(count / 5) }, (_, index) => Math.min(5, count - index * 5))
  return <div className="tally-visual" aria-label={`${count} turus`}>{groups.map((group, index) => <span className="tally-group" key={index}>{Array.from({ length: group }, (_, line) => <i className={line === 4 ? 'tally-diagonal' : ''} key={line} />)}</span>)}</div>
}

export function VisualAid({ question, kind }: { question: LearningQuestion; kind?: VisualKind }) {
  const visual = kind ?? question.visual
  if (visual === 'fraction-bar') return <FractionModel question={question} />
  if (visual === 'place-value' || visual === 'blocks') return <PlaceValue question={question} />
  if (visual === 'number-line') return <NumberLine question={question} />
  if (visual === 'grid') return <GridVisual question={question} />
  if (visual === 'chart') return <ChartVisual question={question} />
  if (visual === 'shape') return <ShapeVisual question={question} />
  if (visual === 'position') return <PositionVisual question={question} />
  if (visual === 'pattern') return <PatternVisual question={question} />
  if (visual === 'tally') return <TallyVisual question={question} />
  if (visual === 'angle') return <div className="angle-visual" aria-label="Ilustrasi sudut"><span className="angle-ray angle-ray-one" /><span className="angle-ray angle-ray-two" /><span className="angle-arc" /></div>
  return <div className="visual-note">Bayangkan benda di sekitarmu, lalu hubungkan dengan soal ini.</div>
}

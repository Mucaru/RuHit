import type { LearningQuestion, VisualKind } from '../lib/learning/types'
import { placeValueNumbers, usableVisual } from '../lib/learning/visual-guard'
import { FractionModel } from './FractionModel'
import { AngleVisual, ClockVisual } from './AngleClockVisual'
import { GeometryVisual } from './GeometryVisual'
import { SolidVisual } from './SolidVisual'

const placeLabels = ['Satuan', 'Puluhan', 'Ratusan', 'Ribuan', 'Puluh ribuan', 'Ratus ribuan']

/** Tabel nilai tempat dengan urutan baca biasa (ribuan di kiri). Dua bilangan digambar sejajar supaya tempat yang sama berada satu kolom. */
function PlaceValue({ question }: { question: LearningQuestion }) {
  const numbers = placeValueNumbers(question) ?? []
  const width = Math.max(1, ...numbers.map((value) => String(value).length))
  const labels = placeLabels.slice(0, width).reverse()
  const names = question.typeId.includes('compare') ? ['A', 'B'] : ['Atas', 'Bawah']
  return <div className="place-value-group" role="group" aria-label="Tabel nilai tempat">
    {numbers.map((value, row) => (
      <div className="place-value-row" key={row}>
        {numbers.length > 1 && <span className="place-value-name">{names[row]}</span>}
        <div className="place-value-visual">
          {String(value).padStart(width, ' ').split('').map((digit, index) => digit === ' '
            ? <div className="place-value-cell is-empty" key={index}><strong aria-hidden="true">·</strong><small>{labels[index]}</small></div>
            : <div className="place-value-cell" key={index}><strong>{digit}</strong><small>{labels[index]}</small></div>)}
        </div>
      </div>
    ))}
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


function TallyVisual({ question }: { question: LearningQuestion }) {
  const count = Math.max(1, Math.min(20, Number(question.params.count ?? 5)))
  const groups = Array.from({ length: Math.ceil(count / 5) }, (_, index) => Math.min(5, count - index * 5))
  return <div className="tally-visual" aria-label={`${count} turus`}>{groups.map((group, index) => <span className="tally-group" key={index}>{Array.from({ length: group }, (_, line) => <i className={line === 4 ? 'tally-diagonal' : ''} key={line} />)}</span>)}</div>
}

export function VisualAid({ question, kind }: { question: LearningQuestion; kind?: VisualKind }) {
  const visual = kind ?? usableVisual(question)
  if (visual === 'hidden') return null
  if (visual === 'fraction-bar') return <FractionModel question={question} />
  if (visual === 'place-value' || visual === 'blocks') return <PlaceValue question={question} />
  if (visual === 'number-line') return <NumberLine question={question} />
  if (visual === 'grid') return <GeometryVisual question={question} />
  if (visual === 'chart') return <ChartVisual question={question} />
  if (visual === 'shape') return <ShapeVisual question={question} />
  if (visual === 'position') return <PositionVisual question={question} />
  if (visual === 'pattern') return <PatternVisual question={question} />
  if (visual === 'tally') return <TallyVisual question={question} />
  if (visual === 'angle') return <AngleVisual question={question} />
  if (visual === 'volume') return <SolidVisual question={question} />
  if (visual === 'clock') return <ClockVisual question={question} />
  return <div className="visual-note">Bayangkan benda di sekitarmu, lalu hubungkan dengan soal ini.</div>
}

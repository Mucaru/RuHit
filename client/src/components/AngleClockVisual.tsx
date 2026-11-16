import { angleTurn, clockTimes } from '../lib/learning/visual-guard'
import type { LearningQuestion } from '../lib/learning/types'

type Point = [number, number]
const TURN_NAMES = ['seperempat', 'setengah', 'tiga perempat', 'satu']

/** Titik pada jarak tertentu dari pusat; 0 derajat = arah jam 12, searah jarum jam. */
const polar = (cx: number, cy: number, degrees: number, length: number): Point => [cx + length * Math.sin((degrees * Math.PI) / 180), cy - length * Math.cos((degrees * Math.PI) / 180)]
const points = (list: Point[]) => list.map((point) => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(' ')

/** Lingkaran empat bagian sama besar; sejumlah `turn` bagian diarsir dari jam 12 searah jarum jam. Derajatnya tidak ditulis (itu jawabannya). */
export function AngleVisual({ question }: { question: LearningQuestion }) {
  const turn = angleTurn(question)
  if (turn === null) return null
  const cx = 150
  const cy = 100
  const radius = 70
  const steps = turn * 12
  const arc = Array.from({ length: steps + 1 }, (_, index) => polar(cx, cy, (index / steps) * turn * 90, radius))
  const spokes = [0, 90, 180, 270].map((degrees) => polar(cx, cy, degrees, radius))
  return (
    <svg className="geometry-visual" viewBox="0 0 300 200" role="img" aria-label={`Lingkaran dibagi empat bagian sama besar; ${TURN_NAMES[turn - 1]} putaran diarsir dari jam 12 searah jarum jam`}>
      <circle className="geo-cell" cx={cx} cy={cy} r={radius} />
      <polygon className="geo-shape" points={points([[cx, cy], ...arc])} />
      <g className="geo-grid">{spokes.map((spoke, index) => <line key={index} x1={cx} y1={cy} x2={spoke[0]} y2={spoke[1]} />)}</g>
      <line className="geo-edge" x1={cx} y1={cy} x2={arc[0][0]} y2={arc[0][1]} />
      <line className="geo-edge" x1={cx} y1={cy} x2={arc[steps][0]} y2={arc[steps][1]} />
    </svg>
  )
}

const format = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}.${String(minutes % 60).padStart(2, '0')}`

function Clock({ cx, minutes, name }: { cx: number; minutes: number; name: string }) {
  const cy = 72
  const radius = 56
  const total = ((minutes % 1440) + 1440) % 1440
  const hour = Math.floor(total / 60)
  const minute = total % 60
  const hourTip = polar(cx, cy, ((hour % 12) + minute / 60) * 30, 20)
  const minuteTip = polar(cx, cy, minute * 6, 29)
  return (
    <g className="geo-clock">
      <circle className="geo-cell" cx={cx} cy={cy} r={radius} />
      <g className="geo-grid">
        {[30, 60, 120, 150, 210, 240, 300, 330].map((degrees) => {
          const outer = polar(cx, cy, degrees, radius - 3)
          const inner = polar(cx, cy, degrees, radius - 9)
          return <line key={degrees} x1={outer[0]} y1={outer[1]} x2={inner[0]} y2={inner[1]} />
        })}
      </g>
      {([[12, 0], [3, 90], [6, 180], [9, 270]] as const).map(([numeral, degrees]) => {
        const at = polar(cx, cy, degrees, 41)
        return <text className="geo-label" key={numeral} x={at[0]} y={at[1]} textAnchor="middle" dominantBaseline="middle">{numeral}</text>
      })}
      <line className="geo-hand-h" x1={cx} y1={cy} x2={hourTip[0]} y2={hourTip[1]} />
      <line className="geo-hand-m" x1={cx} y1={cy} x2={minuteTip[0]} y2={minuteTip[1]} />
      <circle className="geo-player" cx={cx} cy={cy} r={4} />
      <text className="geo-label geo-name" x={cx} y={142} textAnchor="middle" dominantBaseline="middle">{name}</text>
      <text className="geo-label geo-time" x={cx} y={164} textAnchor="middle" dominantBaseline="middle">{format(total)}</text>
    </g>
  )
}

/** Dua jam analog: waktu berangkat dan tiba. Lama perjalanan tidak digambar. */
export function ClockVisual({ question }: { question: LearningQuestion }) {
  const times = clockTimes(question)
  if (!times) return null
  return (
    <svg className="geometry-visual" viewBox="0 0 300 176" role="img" aria-label={`Jam berangkat pukul ${format(times.start)} dan jam tiba pukul ${format(times.end)}`}>
      <Clock cx={75} minutes={times.start} name="Berangkat" />
      <text className="geo-label" x={150} y={72} textAnchor="middle" dominantBaseline="middle">→</text>
      <Clock cx={225} minutes={times.end} name="Tiba" />
    </svg>
  )
}

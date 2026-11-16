import { describeGeometry } from '../lib/learning/visual-guard'
import type { Geometry } from '../lib/learning/visual-guard'
import type { LearningQuestion } from '../lib/learning/types'

type Point = [number, number]
const cm = (value: number) => `${value} cm`

/** Persegi dan persegi panjang. Keliling: keempat sisi diberi label. Luas: hanya panjang dan lebar, dengan kisi satuan. */
function Box({ length, width, mode, square }: { length: number; width: number; mode: 'perimeter' | 'area'; square: boolean }) {
  // Lebar gambar 188 (bukan 212) menyisakan ruang untuk label sisi dua digit di kiri dan kanan.
  const scale = Math.min(188 / length, 140 / width)
  const w = length * scale
  const h = width * scale
  const x0 = (300 - w) / 2
  const y0 = (200 - h) / 2
  const label = square ? `Persegi dengan sisi ${length} cm` : `Persegi panjang berukuran ${length} cm kali ${width} cm`
  return (
    <svg className="geometry-visual" viewBox="0 0 300 200" role="img" aria-label={label}>
      <rect className="geo-shape" x={x0} y={y0} width={w} height={h} />
      {mode === 'area' && (
        <g className="geo-grid">
          {Array.from({ length: length - 1 }, (_, index) => <line key={`v${index}`} x1={x0 + (index + 1) * scale} y1={y0} x2={x0 + (index + 1) * scale} y2={y0 + h} />)}
          {Array.from({ length: width - 1 }, (_, index) => <line key={`h${index}`} x1={x0} y1={y0 + (index + 1) * scale} x2={x0 + w} y2={y0 + (index + 1) * scale} />)}
        </g>
      )}
      <text className="geo-label" x={x0 + w / 2} y={y0 - 14} textAnchor="middle" dominantBaseline="middle">{cm(length)}</text>
      {mode === 'perimeter' && <text className="geo-label" x={x0 + w / 2} y={y0 + h + 16} textAnchor="middle" dominantBaseline="middle">{cm(length)}</text>}
      <text className="geo-label" x={x0 - 8} y={y0 + h / 2} textAnchor="end" dominantBaseline="middle">{cm(width)}</text>
      {mode === 'perimeter' && <text className="geo-label" x={x0 + w + 8} y={y0 + h / 2} textAnchor="start" dominantBaseline="middle">{cm(width)}</text>}
    </svg>
  )
}

/** Label sisi PQ diletakkan di luar segitiga (menjauhi titik R). */
function sideLabel(p: Point, q: Point, r: Point, text: string) {
  const mid: Point = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  const dx = q[0] - p[0]
  const dy = q[1] - p[1]
  const length = Math.hypot(dx, dy) || 1
  let nx = -dy / length
  let ny = dx / length
  if (nx * (mid[0] - r[0]) + ny * (mid[1] - r[1]) < 0) { nx = -nx; ny = -ny }
  return <text className="geo-label" key={text + mid.join()} x={mid[0] + nx * 18} y={mid[1] + ny * 18} textAnchor="middle" dominantBaseline="middle">{text}</text>
}

/** Segitiga dengan tiga sisi diketahui; bentuknya dibangun dari panjang sisi (aturan kosinus), jadi proporsional. */
function TriangleSides({ a, b, c }: { a: number; b: number; c: number }) {
  const px = (b * b + c * c - a * a) / (2 * c)
  const py = Math.sqrt(Math.max(0, b * b - px * px))
  const minX = Math.min(0, px)
  const maxX = Math.max(c, px)
  const scale = Math.min(190 / (maxX - minX), 120 / py)
  const ox = (300 - (maxX - minX) * scale) / 2 - minX * scale
  const oy = (200 + py * scale) / 2
  const at = (x: number, y: number): Point => [ox + x * scale, oy - y * scale]
  const A = at(0, 0)
  const B = at(c, 0)
  const C = at(px, py)
  return (
    <svg className="geometry-visual" viewBox="0 0 300 200" role="img" aria-label={`Segitiga dengan sisi ${a} cm, ${b} cm, dan ${c} cm`}>
      <polygon className="geo-shape" points={[A, B, C].map((point) => point.join(',')).join(' ')} />
      {sideLabel(B, C, A, cm(a))}
      {sideLabel(C, A, B, cm(b))}
      {sideLabel(A, B, C, cm(c))}
    </svg>
  )
}

/** Segitiga dengan alas dan tinggi (garis putus-putus tegak lurus alas). */
function TriangleArea({ base, height }: { base: number; height: number }) {
  const scale = Math.min(212 / base, 120 / height)
  const w = base * scale
  const h = height * scale
  const x0 = (300 - w) / 2
  const yBase = (200 + h) / 2
  const apexX = x0 + w * 0.35
  const yApex = yBase - h
  return (
    <svg className="geometry-visual" viewBox="0 0 300 200" role="img" aria-label={`Segitiga dengan alas ${base} cm dan tinggi ${height} cm`}>
      <polygon className="geo-shape" points={`${x0},${yBase} ${x0 + w},${yBase} ${apexX},${yApex}`} />
      <line className="geo-dash" x1={apexX} y1={yApex} x2={apexX} y2={yBase} />
      <path className="geo-dash" d={`M ${apexX - 9} ${yBase} L ${apexX - 9} ${yBase - 9} L ${apexX} ${yBase - 9}`} />
      <text className="geo-label" x={x0 + w / 2} y={yBase + 18} textAnchor="middle" dominantBaseline="middle">{`alas ${cm(base)}`}</text>
      <text className="geo-label" x={apexX + 8} y={(yApex + yBase) / 2} textAnchor="start" dominantBaseline="middle">{`tinggi ${cm(height)}`}</text>
    </svg>
  )
}

/** Dua persegi panjang digambar terpisah dengan skala yang sama; soal tidak menyebut cara menyambungnya. */
function Composite({ a, b, c, d }: { a: number; b: number; c: number; d: number }) {
  const gap = 28
  const scale = Math.min((212 - gap) / (a + c), 110 / Math.max(b, d))
  const x0 = (300 - ((a + c) * scale + gap)) / 2
  const yBottom = 150
  return (
    <svg className="geometry-visual" viewBox="0 0 300 204" role="img" aria-label={`Dua persegi panjang: ${a} cm kali ${b} cm dan ${c} cm kali ${d} cm`}>
      <rect className="geo-shape" x={x0} y={yBottom - b * scale} width={a * scale} height={b * scale} />
      <rect className="geo-shape" x={x0 + a * scale + gap} y={yBottom - d * scale} width={c * scale} height={d * scale} />
      <text className="geo-label" x={x0 + a * scale + gap / 2} y={yBottom - (Math.max(b, d) * scale) / 2} textAnchor="middle" dominantBaseline="middle">+</text>
      <text className="geo-label" x={x0 + (a * scale) / 2} y={yBottom + 20} textAnchor="middle" dominantBaseline="middle">{`${a} × ${b} cm`}</text>
      <text className="geo-label" x={x0 + a * scale + gap + (c * scale) / 2} y={yBottom + 42} textAnchor="middle" dominantBaseline="middle">{`${c} × ${d} cm`}</text>
    </svg>
  )
}

/** Kisi 6x6 bernomor; hanya posisi sekarang yang ditandai, bukan posisi setelah bergerak. */
function Locator({ x, y }: { x: number; y: number }) {
  const cell = 30
  const x0 = (300 - cell * 6) / 2
  const y0 = 34
  return (
    <svg className="geometry-visual" viewBox="0 0 300 224" role="img" aria-label={`Kisi 6 kolom dan 6 baris. Kamu berada di kolom ${x}, baris ${y}`}>
      {Array.from({ length: 36 }, (_, index) => <rect className="geo-cell" key={index} x={x0 + (index % 6) * cell} y={y0 + Math.floor(index / 6) * cell} width={cell} height={cell} />)}
      {Array.from({ length: 6 }, (_, index) => <text className="geo-label" key={`c${index}`} x={x0 + (index + 0.5) * cell} y={y0 - 14} textAnchor="middle" dominantBaseline="middle">{index + 1}</text>)}
      {Array.from({ length: 6 }, (_, index) => <text className="geo-label" key={`r${index}`} x={x0 - 14} y={y0 + (index + 0.5) * cell} textAnchor="middle" dominantBaseline="middle">{index + 1}</text>)}
      <circle className="geo-player" cx={x0 + (x - 0.5) * cell} cy={y0 + (y - 0.5) * cell} r={10} />
    </svg>
  )
}

export function GeometryVisual({ question }: { question: LearningQuestion }) {
  const geometry: Geometry | null = describeGeometry(question)
  if (!geometry) return null
  switch (geometry.kind) {
    case 'rectangle': return <Box length={geometry.length} width={geometry.width} mode={geometry.mode} square={geometry.square} />
    case 'triangle-sides': return <TriangleSides a={geometry.a} b={geometry.b} c={geometry.c} />
    case 'triangle-area': return <TriangleArea base={geometry.base} height={geometry.height} />
    case 'composite': return <Composite a={geometry.a} b={geometry.b} c={geometry.c} d={geometry.d} />
    case 'locator': return <Locator x={geometry.x} y={geometry.y} />
  }
}

import type { LearningQuestion } from '../lib/learning/types'

type Segment = { count: number; tone: 'a' | 'b' | 'c' | 'cross' }

const clampCols = (value: number) => Math.max(1, Math.min(30, Math.round(value) || 1))

/** Batang pecahan: d kotak, diwarnai per segmen. Tanpa inline style (CSP). */
export function FractionBarRow({ d, segments, label, caption }: { d: number; segments: Segment[]; label?: string; caption?: string }) {
  const cols = clampCols(d)
  const cells: Array<Segment['tone'] | 'off'> = []
  segments.forEach((segment) => { for (let i = 0; i < segment.count; i += 1) cells.push(segment.tone) })
  while (cells.length < cols) cells.push('off')
  return (
    <div className="fm-row">
      {label && <span className="fm-label">{label}</span>}
      <div className={`fm-bar fm-cols-${cols}`} role="img" aria-label={caption ?? `${cells.filter((cell) => cell !== 'off').length} dari ${cols} bagian`}>
        {cells.slice(0, cols).map((tone, index) => <span key={index} className={`fm-cell fm-${tone}`} />)}
      </div>
      {caption && <span className="fm-caption">{caption}</span>}
    </div>
  )
}

/** Pizza (diagram lingkaran) dengan irisan sama besar. */
export function FractionPie({ n, d }: { n: number; d: number }) {
  const slices = clampCols(Math.min(d, 12))
  const filled = Math.max(0, Math.min(slices, n))
  const radius = 54
  const center = 60
  const point = (index: number) => {
    const angle = -Math.PI / 2 + (index / slices) * Math.PI * 2
    return [center + radius * Math.cos(angle), center + radius * Math.sin(angle)]
  }
  return (
    <svg className="fm-pie" viewBox="0 0 120 120" role="img" aria-label={`Pizza dibagi ${slices} irisan, ${filled} irisan berwarna`}>
      {Array.from({ length: slices }, (_, index) => {
        const [x1, y1] = point(index)
        const [x2, y2] = point(index + 1)
        const path = slices === 1 ? `M ${center - radius} ${center} a ${radius} ${radius} 0 1 0 ${radius * 2} 0 a ${radius} ${radius} 0 1 0 ${-radius * 2} 0` : `M ${center} ${center} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${radius} ${radius} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`
        return <path key={index} className={index < filled ? 'fm-slice is-on' : 'fm-slice'} d={path} />
      })}
    </svg>
  )
}

function Groups({ d, n, per }: { d: number; n: number; per: number }) {
  return (
    <div className="fm-groups" role="img" aria-label={`${d} kelompok, masing-masing ${per} benda. ${n} kelompok diambil.`}>
      {Array.from({ length: clampCols(d) }, (_, group) => (
        <div key={group} className={group < n ? 'fm-group is-on' : 'fm-group'}>
          <div className="fm-dots">{Array.from({ length: Math.min(12, per) }, (_, dot) => <i key={dot} />)}</div>
          <small>{per}</small>
        </div>
      ))}
    </div>
  )
}

export function FractionModel({ question }: { question: LearningQuestion }) {
  const p = question.params
  const n = (key: string, fallback = 1) => Number(p[key] ?? fallback)
  const type = question.typeId
  let body: React.ReactNode
  let note = 'Bagian berwarna = bagian yang diambil dari satu utuh.'

  switch (type) {
    case 'fraction-identify':
    case 'fraction-half-quarter': {
      const d = type === 'fraction-half-quarter' ? n('denominator', 4) : n('d', 4)
      const num = type === 'fraction-half-quarter' ? 1 : n('n', 1)
      body = <div className="fm-pair"><FractionPie n={num} d={d} /><FractionBarRow d={d} segments={[{ count: num, tone: 'a' }]} /></div>
      note = 'Hitung semua bagian (penyebut), lalu hitung bagian yang berwarna (pembilang).'
      break
    }
    case 'fraction-equivalent': {
      const k = n('factor', 2)
      body = <><FractionBarRow d={n('d')} segments={[{ count: n('n'), tone: 'a' }]} label={`${n('n')}/${n('d')}`} /><FractionBarRow d={n('d') * k} segments={[{ count: n('n') * k, tone: 'a' }]} label={`${n('n') * k}/${n('d') * k}`} /></>
      note = 'Panjang bagian berwarna sama. Bentuk pecahannya beda, nilainya sama.'
      break
    }
    case 'fraction-simplify': {
      const nn = n('n'); const d = n('d')
      let g = nn; let h = d
      while (h) [g, h] = [h, g % h]
      body = <><FractionBarRow d={d} segments={[{ count: nn, tone: 'a' }]} label={`${nn}/${d}`} /><FractionBarRow d={d / g} segments={[{ count: nn / g, tone: 'b' }]} label={`${nn / g}/${d / g}`} /></>
      note = 'Dua batang ini sama panjang berwarnanya. Yang bawah lebih sederhana.'
      break
    }
    case 'fraction-compare': {
      body = <><FractionBarRow d={n('b')} segments={[{ count: n('a'), tone: 'a' }]} label={`A ${n('a')}/${n('b')}`} /><FractionBarRow d={n('d')} segments={[{ count: n('c'), tone: 'b' }]} label={`B ${n('c')}/${n('d')}`} /></>
      note = 'Batang yang bagian warnanya lebih panjang menunjukkan pecahan lebih besar.'
      break
    }
    case 'fraction-order': {
      const nums = (Array.isArray(p.nums) ? p.nums : [1, 2, 3]) as number[]
      body = <>{nums.slice(0, 4).map((value) => <FractionBarRow key={value} d={n('d')} segments={[{ count: value, tone: 'a' }]} label={`${value}/${n('d')}`} />)}</>
      note = 'Penyebut sama, jadi lihat pembilang: makin banyak warna, makin besar.'
      break
    }
    case 'fraction-add-same':
    case 'fraction-word-add': {
      const a = n('a'); const b = n('b'); const d = n('d')
      body = <><FractionBarRow d={d} segments={[{ count: a, tone: 'a' }, { count: b, tone: 'b' }]} caption={`${a}/${d} + ${b}/${d}`} /></>
      note = 'Warna pertama dan warna kedua digabung di satu batang.'
      break
    }
    case 'fraction-subtract-same':
    case 'fraction-word-subtract': {
      const a = n('a'); const b = n('b'); const d = n('d')
      body = <FractionBarRow d={d} segments={[{ count: a - b, tone: 'a' }, { count: b, tone: 'cross' }]} caption={`${a}/${d} − ${b}/${d}`} />
      note = 'Kotak bercoret diambil atau dimakan. Yang tersisa tetap berwarna.'
      break
    }
    case 'fraction-add-different':
    case 'fraction-subtract-different': {
      const a = n('a'); const d1 = n('d1'); const b = n('b'); const d2 = n('d2')
      const l = (d1 * d2) / gcdOf(d1, d2)
      const x = a * (l / d1); const y = b * (l / d2)
      const add = type === 'fraction-add-different'
      body = <>
        <FractionBarRow d={d1} segments={[{ count: a, tone: 'a' }]} label={`${a}/${d1}`} />
        <FractionBarRow d={d2} segments={[{ count: b, tone: 'b' }]} label={`${b}/${d2}`} />
        <FractionBarRow d={l} segments={add ? [{ count: x, tone: 'a' }, { count: y, tone: 'b' }] : [{ count: x - y, tone: 'a' }, { count: y, tone: 'cross' }]} label={`Disamakan: ${l}`} />
      </>
      note = `Setelah potongannya disamakan jadi ${l} bagian, kedua pecahan bisa digabung atau dikurangi.`
      break
    }
    case 'fraction-multiply-whole': {
      const rows = Math.min(5, n('whole', 2))
      body = <>{Array.from({ length: rows }, (_, index) => <FractionBarRow key={index} d={n('d')} segments={[{ count: n('n'), tone: index % 2 ? 'b' : 'a' }]} label={`${index + 1}×`} />)}</>
      note = 'Satu batang diulang beberapa kali, lalu semua bagian berwarna dihitung.'
      break
    }
    case 'fraction-divide-whole': {
      const w = n('whole', 2)
      body = <><FractionBarRow d={n('d')} segments={[{ count: n('n'), tone: 'a' }]} label={`${n('n')}/${n('d')}`} /><FractionBarRow d={n('d') * w} segments={[{ count: n('n'), tone: 'b' }]} label={`÷ ${w}`} /></>
      note = 'Dibagi rata, potongan jadi makin kecil, penyebut jadi makin besar.'
      break
    }
    case 'fraction-of-quantity': {
      body = <Groups d={n('d')} n={n('n')} per={n('total') / n('d')} />
      note = 'Bagi semua benda jadi kelompok sama banyak, lalu ambil kelompok yang diminta.'
      break
    }
    case 'fraction-improper-to-mixed': {
      const d = n('d'); const full = Math.floor(n('n') / d); const r = n('n') % d
      body = <>{Array.from({ length: full }, (_, index) => <FractionBarRow key={index} d={d} segments={[{ count: d, tone: 'a' }]} label="1 utuh" />)}<FractionBarRow d={d} segments={[{ count: r, tone: 'b' }]} label="sisa" /></>
      note = 'Batang penuh = bilangan utuh. Batang terakhir = pecahan sisanya.'
      break
    }
    case 'fraction-mixed-to-improper': {
      const d = n('d')
      body = <>{Array.from({ length: n('w') }, (_, index) => <FractionBarRow key={index} d={d} segments={[{ count: d, tone: 'a' }]} label="1 utuh" />)}<FractionBarRow d={d} segments={[{ count: n('n'), tone: 'b' }]} label="sisa" /></>
      note = 'Hitung semua kotak berwarna, itu pembilang barunya.'
      break
    }
    default: {
      const d = n('d', n('b', n('denominator', 4)))
      const num = n('n', n('a', 1))
      body = <FractionBarRow d={d} segments={[{ count: Math.min(num, d), tone: 'a' }]} caption={`${Math.min(num, d)}/${d}`} />
    }
  }

  return (
    <div className="visual-fraction fraction-model" aria-label="Model pecahan">
      {body}
      <small>{note}</small>
    </div>
  )
}

function gcdOf(a: number, b: number): number {
  return b === 0 ? Math.abs(a) : gcdOf(b, a % b)
}

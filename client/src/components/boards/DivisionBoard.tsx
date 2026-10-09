import type { CSSProperties, ReactNode } from 'react'
import { BoardInput } from './BoardInput'
import type { BoardProps } from '../../types'

type Row = { kind: 'product' | 'rem'; text: string; end: number; ruleEnd?: number; ruleLen?: number }
type Entry = { start: number; end: number }

/**
 * Porogapit (pembagian bersusun) gaya buku SD Indonesia:
 * hasil bagi di atas angka yang dibagi, hasil kali di bawah (diberi tanda −), garis, sisa, lalu angka diturunkan.
 * Jawaban diketik LANGSUNG di petak kerja langkah aktif.
 */
export function DivisionBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const dividend = String(question.a).split('')
  const n = dividend.length
  const kind = current.kind
  const idx = typeof current.meta?.index === 'number' ? (current.meta.index as number) : null
  const firstIdx = (question.steps.find((s) => s.kind === 'divide')?.meta?.index as number | undefined) ?? 0
  const quotient: string[] = Array(n).fill('')
  const rows: Row[] = []
  completed.forEach((item) => {
    const index = item.meta?.index as number
    if (item.kind === 'divide') quotient[index] = String(item.expected)
    if (item.kind === 'multiply-back') rows.push({ kind: 'product', text: String(item.expected), end: index })
    if (item.kind === 'subtract') rows.push({ kind: 'rem', text: String(item.expected), end: index, ruleEnd: index, ruleLen: String(item.meta?.product).length })
    if (item.kind === 'bring-down' && rows.length) Object.assign(rows[rows.length - 1], { text: String(item.expected), end: index + 1 })
  })

  const input = (placeholder = '?') => <BoardInput value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} />
  const grid: CSSProperties = { gridTemplateColumns: `var(--lc) repeat(${n}, var(--lc))` }
  const entryCell = (e: Entry) => (
    <span key="entry" className="ldb-entry" style={{ gridColumn: `${e.start + 2} / span ${e.end - e.start + 1}` }}>{input()}</span>
  )

  const renderRow = (key: string, digits: Record<number, string>, signAt: number | null, entry?: Entry) => (
    <div className="ldb-row" style={grid} key={key}>
      <i className="ldb-side" style={{ gridColumn: 1 }}>{signAt === -1 ? '−' : ''}</i>
      {Array.from({ length: n }, (_, j) => {
        if (entry && j >= entry.start && j <= entry.end) return j === entry.start ? entryCell(entry) : null
        return <i key={j} className={digits[j] ? 'ldb-filled' : ''} style={{ gridColumn: j + 2 }}>{digits[j] ?? (signAt === j ? '−' : '')}</i>
      })}
    </div>
  )
  const digitsOf = (row: Row) => {
    const out: Record<number, string> = {}
    const start = row.end - row.text.length + 1
    row.text.split('').forEach((d, k) => { out[start + k] = d })
    return out
  }
  const ruleRow = (key: string, ruleEnd: number, ruleLen: number) => (
    <div className="ldb-row ldb-rulerow" style={grid} key={key} aria-hidden="true">
      <i style={{ gridColumn: 1 }} />
      {Array.from({ length: n }, (_, j) => <i key={j} className={j > ruleEnd - ruleLen && j <= ruleEnd ? 'ldb-rule' : ''} style={{ gridColumn: j + 2 }} />)}
    </div>
  )

  const body: ReactNode[] = []
  rows.forEach((row, i) => {
    if (row.kind === 'rem') body.push(ruleRow(`rule-${i}`, row.ruleEnd as number, row.ruleLen as number))
    const start = row.end - row.text.length + 1
    body.push(renderRow(`row-${i}`, digitsOf(row), row.kind === 'product' ? start - 1 : null))
  })

  // Petak kerja langkah aktif
  const rowsLen = rows.length
  if (kind === 'multiply-back' && idx !== null) {
    const len = String(current.meta?.current).length
    const start = Math.max(0, idx - len + 1)
    body.push(renderRow('active', {}, start - 1, { start, end: idx }))
  }
  if (kind === 'subtract' && idx !== null) {
    const len = String(current.meta?.product).length
    body.push(ruleRow('rule-active', idx, len))
    body.push(renderRow('active', {}, null, { start: Math.max(0, idx - len + 1), end: idx }))
  }
  if (kind === 'bring-down' && idx !== null && rowsLen) {
    // baris sisa terakhir diganti kotak isian: sisa + angka yang diturunkan
    const len = String(current.meta?.remainder).length + 1
    const end = idx + 1
    const keep = body.length - 1
    body[keep] = renderRow(`row-${rowsLen - 1}`, {}, null, { start: Math.max(0, end - len + 1), end })
  }

  const cursor = idx !== null ? (kind === 'bring-down' ? idx + 1 : idx) : n - 1
  const nextDigit = kind === 'bring-down' && idx !== null ? idx + 1 : null
  const reading = kind === 'division-final' || kind === 'remainder-final'

  return (
    <div className="board ld-board">
      <div className="ldb-scroll">
        <div className="ldb" style={{ '--n': n } as CSSProperties}>
          <div className="ldb-row" style={grid}>
            <i className="ldb-side" style={{ gridColumn: 1 }} />
            {Array.from({ length: n }, (_, j) => {
              const active = kind === 'divide' && idx === j
              if (active) return <span key={j} className="ldb-entry ldb-q" style={{ gridColumn: j + 2 }}>{input()}</span>
              if (quotient[j]) return <i key={j} className="ldb-q ldb-filled" style={{ gridColumn: j + 2 }}>{quotient[j]}</i>
              return <i key={j} className={j >= firstIdx ? 'ldb-q ldb-slot' : ''} style={{ gridColumn: j + 2 }} />
            })}
          </div>
          <div className="ldb-row ldb-top" style={grid}>
            <i className="ldb-side ldb-divisor" style={{ gridColumn: 1 }}>{question.b}</i>
            {dividend.map((digit, j) => (
              <i key={j} className={`ldb-digit ${j === 0 ? 'ldb-first' : ''} ${j <= cursor ? 'taken' : ''} ${nextDigit === j ? 'drop' : ''}`} style={{ gridColumn: j + 2 }}>{digit}</i>
            ))}
          </div>
          {body}
        </div>
      </div>
      {reading && (
        <div className="ldb-answer"><span>{kind === 'division-final' ? 'Hasil bagi' : 'Sisa'}</span>{input()}</div>
      )}
    </div>
  )
}

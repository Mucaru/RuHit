import type { CSSProperties } from 'react'
import { BoardInput } from './BoardInput'
import type { BoardProps } from '../../types'

type DivRow = { kind: 'product' | 'rem'; text: string; end: number; ruleEnd?: number; ruleLen?: number }

export function DivisionBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const dividend = String(question.a).split('')
  const n = dividend.length
  const quotient: string[] = Array(n).fill('')
  const rows: DivRow[] = []
  completed.forEach((item) => {
    const index = item.meta?.index as number
    if (item.kind === 'divide') quotient[index] = String(item.expected)
    if (item.kind === 'multiply-back') rows.push({ kind: 'product', text: String(item.expected), end: index })
    if (item.kind === 'subtract') rows.push({ kind: 'rem', text: String(item.expected), end: index, ruleEnd: index, ruleLen: String(item.meta?.product).length })
    if (item.kind === 'bring-down' && rows.length) Object.assign(rows[rows.length - 1], { text: String(item.expected), end: index + 1 })
  })
  const cursor = current.meta?.index != null ? (current.kind === 'bring-down' ? current.meta.index + 1 : current.meta.index) : n - 1
  const grid = { gridTemplateColumns: `var(--ld-d) repeat(${n + 1}, var(--ld-c))` } as CSSProperties
  const cellsOf = (row: DivRow) => {
    const start = row.end - row.text.length + 1
    return Array.from({ length: n + 1 }, (_, col) => {
      const digit = col - 1 >= start && col - 1 <= row.end ? row.text[col - 1 - start] : col === start && row.kind === 'product' ? '−' : ''
      const rule = row.kind === 'rem' && row.ruleEnd != null && col - 1 > row.ruleEnd - (row.ruleLen ?? 0) && col - 1 <= row.ruleEnd
      return <i className={rule ? 'ld-rule' : ''} key={col}>{digit}</i>
    })
  }
  const label = current.kind === 'divide' ? 'angka hasil bagi' : current.kind === 'multiply-back' ? 'hasil kali balik' : current.kind === 'subtract' ? 'sisa sementara' : current.kind === 'bring-down' ? 'angka baru setelah diturunkan' : current.kind === 'division-final' ? 'hasil bagi' : 'sisa pembagian'
  return <div className="board division-board"><div className="board-label">PEMBAGIAN BERSUSUN <span className="board-live">● ikuti 4 langkah</span></div><div className="ld-scroll"><div className="ld">
    <div className="ld-row" style={grid}><i />{['', ...quotient].map((digit, col) => <i className="ld-q" key={col}>{digit}</i>)}</div>
    <div className="ld-row" style={grid}><i className="ld-divisor">{question.b}</i>{['', ...dividend].map((digit, col) => <i className={`ld-top ${col > 0 && col - 1 <= cursor ? 'taken' : ''}`} key={col}>{digit}</i>)}</div>
    {rows.map((row, index) => <div className="ld-row" style={grid} key={index}><i />{cellsOf(row)}</div>)}
  </div></div><div className="division-working"><div className="flow-pills"><span className={current.kind === 'divide' ? 'active' : ''}>1 Bagi</span><span className={current.kind === 'multiply-back' ? 'active' : ''}>2 Kali</span><span className={current.kind === 'subtract' ? 'active' : ''}>3 Kurangi</span><span className={current.kind === 'bring-down' ? 'active' : ''}>4 Turunkan</span></div><div className="division-scratch"><small>{label}</small><BoardInput value={value} onChange={onChange} disabled={disabled} placeholder="?" /></div></div><div className="board-caption"><span className="caption-dot" /> Urutannya selalu: bagi · kali · kurang · turunkan</div></div>
}

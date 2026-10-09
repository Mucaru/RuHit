import type { CSSProperties } from 'react'
import { BoardInput } from './BoardInput'
import type { BoardProps } from '../../types'

/**
 * Perkalian bersusun gaya buku: angka tersusun per kolom, rata kanan.
 * Jawaban diketik LANGSUNG di sel yang sedang aktif (bukan kotak terpisah).
 * Posisi `pos` = 0 untuk satuan, 1 puluhan, dst. Kolom grid = C - 1 - pos.
 */
export function MultiplicationBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const a = String(question.a).split('')
  const b = String(question.b).split('')
  const C = a.length + b.length
  const kind = current.kind
  const row = typeof current.meta?.row === 'number' ? (current.meta.row as number) : null
  const col = typeof current.meta?.column === 'number' ? (current.meta.column as number) : null
  const singleRow = b.length === 1
  const grid: CSSProperties = { gridTemplateColumns: `repeat(${C}, var(--mc))` }

  // Angka yang sudah ditulis anak: written[baris][pos]
  const written: string[][] = b.map(() => Array(C).fill(''))
  const carries: Record<number, string> = {}
  completed.forEach((item) => {
    const r = item.meta?.row as number
    if (item.kind === 'place-zero') for (let k = 0; k < r; k += 1) written[r][k] = '0'
    if (item.kind === 'multiply-write') written[r][r + (item.meta?.column as number)] = item.expected
    if (item.kind === 'multiply-carry-final') written[r][r + a.length] = item.expected
    if (item.kind === 'multiply-carry' && r === row) carries[(item.meta?.column as number) + 1] = item.expected
  })

  const input = (placeholder = '?') => <BoardInput value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} />
  const posAt = (gi: number) => C - 1 - gi
  const cells = (render: (pos: number) => { className?: string; content?: React.ReactNode }) =>
    Array.from({ length: C }, (_, gi) => {
      const { className = '', content = '' } = render(posAt(gi))
      return <span key={gi} className={className}>{content}</span>
    })

  const digitRow = (digits: string[], activePos: number | null) =>
    cells((pos) => {
      const digit = digits[digits.length - 1 - pos]
      return digit === undefined ? {} : { className: pos === activePos ? 'mc-digit mc-hl' : 'mc-digit', content: digit }
    })

  const activeA = kind === 'multiply-column' || kind === 'multiply-write' || kind === 'multiply-carry' ? col : null
  const activeB = row

  const partialRow = (r: number) =>
    cells((pos) => {
      if (pos > r + a.length) return {}
      const entry =
        (kind === 'place-zero' && row === r && pos === 0) ||
        (kind === 'multiply-write' && row === r && col !== null && pos === r + col) ||
        (kind === 'multiply-carry-final' && row === r && pos === r + a.length)
      if (entry) return { className: 'mc-slot mc-active', content: input() }
      if (written[r][pos]) return { className: 'mc-slot mc-filled', content: written[r][pos] }
      return { className: 'mc-slot' }
    })

  const carryRow = cells((pos) => {
    if (pos < 1 || pos >= a.length) return {}
    if (kind === 'multiply-carry' && col !== null && pos === col + 1) return { className: 'mc-slot mc-active mc-carry', content: input() }
    if (carries[pos]) return { className: 'mc-slot mc-filled mc-carry', content: carries[pos] }
    return { className: 'mc-slot mc-carry' }
  })

  const reading = kind === 'partial' || kind === 'partial-sum'
  const showResultRow = !singleRow || kind === 'partial'
  const readPlaceholder = kind === 'partial-sum' || singleRow ? 'hasil akhir' : `baris ${(row ?? 0) + 1}`

  return (
    <div className="board mul-board" style={{ '--cols': C } as CSSProperties}>
      <div className="mul-row mc-scratch" style={grid}>
        {kind === 'multiply-column' && col !== null && (
          <span className="mc-bubble" style={{ gridColumn: `${C - col - 1} / span 2` }}>{input('hitung')}</span>
        )}
      </div>
      <div className="mul-row" style={grid}>{carryRow}</div>
      <div className="mul-row" style={grid}>{digitRow(a, activeA)}</div>
      <div className="mul-row" style={grid}>
        <b className="mc-op" style={{ gridColumn: 1 }}>×</b>
        {Array.from({ length: C }, (_, gi) => {
          const pos = posAt(gi)
          const digit = b[b.length - 1 - pos]
          return digit === undefined ? null : <span key={gi} className={pos === activeB ? 'mc-digit mc-hl' : 'mc-digit'} style={{ gridColumn: gi + 1 }}>{digit}</span>
        })}
      </div>
      <div className="mul-line" />
      {b.map((_, r) => <div className={`mul-row mul-partial ${row === r ? 'is-current' : ''}`} style={grid} key={r}>{partialRow(r)}</div>)}
      {showResultRow && (
        <>
          {!singleRow && <div className="mul-line" />}
          <div className="mul-row mul-result" style={grid}>
            {reading && <span className="mc-slot mc-active mc-wide" style={{ gridColumn: '1 / -1' }}>{input(readPlaceholder)}</span>}
          </div>
        </>
      )}
    </div>
  )
}

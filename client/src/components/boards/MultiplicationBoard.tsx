import type { ReactNode } from 'react'
import { BoardInput } from './BoardInput'
import type { BoardProps } from '../../types'

/** Perkalian bersusun gaya buku: angka tersusun per kolom dan input berada di langkah aktif. */
export function MultiplicationBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const a = String(question.a).split('')
  const b = String(question.b).split('')
  const columns = a.length + b.length
  const kind = current.kind
  const row = typeof current.meta?.row === 'number' ? current.meta.row : null
  const col = typeof current.meta?.column === 'number' ? current.meta.column : null
  const singleRow = b.length === 1
  const gridClass = `mul-grid-${Math.min(8, Math.max(2, columns))}`
  const colClass = (column: number) => `mc-col-${column}`
  const spanClass = (span: number) => `mc-span-${span}`

  const written: string[][] = b.map(() => Array(columns).fill(''))
  const carries: Record<number, string> = {}
  completed.forEach((item) => {
    const r = item.meta?.row as number
    if (item.kind === 'place-zero') for (let k = 0; k < r; k += 1) written[r][k] = '0'
    if (item.kind === 'multiply-write') written[r][r + (item.meta?.column as number)] = item.expected
    if (item.kind === 'multiply-carry-final') written[r][r + a.length] = item.expected
    if (item.kind === 'multiply-carry' && r === row) carries[(item.meta?.column as number) + 1] = item.expected
  })

  const input = (placeholder = '?') => <BoardInput value={value} onChange={onChange} disabled={disabled} placeholder={placeholder} />
  const posAt = (gridIndex: number) => columns - 1 - gridIndex
  const cells = (render: (position: number) => { className?: string; content?: ReactNode }) => Array.from({ length: columns }, (_, gridIndex) => {
    const { className = '', content = '' } = render(posAt(gridIndex))
    return <span key={gridIndex} className={`${className} ${colClass(gridIndex + 1)}`}>{content}</span>
  })
  const digitRow = (digits: string[], activePosition: number | null) => cells((position) => {
    const digit = digits[digits.length - 1 - position]
    return digit === undefined ? {} : { className: position === activePosition ? 'mc-digit mc-hl' : 'mc-digit', content: digit }
  })
  const activeA = kind === 'multiply-column' || kind === 'multiply-write' || kind === 'multiply-carry' ? col : null
  const activeB = row
  const partialRow = (currentRow: number) => cells((position) => {
    if (position > currentRow + a.length) return {}
    const entry = (kind === 'place-zero' && row === currentRow && position === 0)
      || (kind === 'multiply-write' && row === currentRow && col !== null && position === currentRow + col)
      || (kind === 'multiply-carry-final' && row === currentRow && position === currentRow + a.length)
    if (entry) return { className: 'mc-slot mc-active', content: input() }
    if (written[currentRow][position]) return { className: 'mc-slot mc-filled', content: written[currentRow][position] }
    return { className: 'mc-slot' }
  })
  const carryRow = cells((position) => {
    if (position < 1 || position >= a.length) return {}
    if (kind === 'multiply-carry' && col !== null && position === col + 1) return { className: 'mc-slot mc-active mc-carry', content: input() }
    if (carries[position]) return { className: 'mc-slot mc-filled mc-carry', content: carries[position] }
    return { className: 'mc-slot mc-carry' }
  })
  const reading = kind === 'partial' || kind === 'partial-sum'
  const showResultRow = !singleRow || kind === 'partial'
  const readPlaceholder = kind === 'partial-sum' || singleRow ? 'hasil akhir' : `baris ${(row ?? 0) + 1}`

  return (
    <div className={`board mul-board mul-cols-${columns}`}>
      <div className={`mul-row mc-scratch ${gridClass}`}>
        {kind === 'multiply-column' && col !== null && <span className={`mc-bubble ${colClass(columns - col - 1)} ${spanClass(2)}`}>{input('hitung')}</span>}
      </div>
      <div className={`mul-row ${gridClass}`}>{carryRow}</div>
      <div className={`mul-row ${gridClass}`}>{digitRow(a, activeA)}</div>
      <div className={`mul-row ${gridClass}`}>
        <b className={`mc-op ${colClass(1)}`}>×</b>
        {Array.from({ length: columns }, (_, gridIndex) => {
          const position = posAt(gridIndex)
          const digit = b[b.length - 1 - position]
          return digit === undefined ? <span className={colClass(gridIndex + 1)} key={gridIndex} /> : <span key={gridIndex} className={`${position === activeB ? 'mc-digit mc-hl' : 'mc-digit'} ${colClass(gridIndex + 1)}`}>{digit}</span>
        })}
      </div>
      <div className="mul-line" />
      {b.map((_, currentRow) => <div className={`mul-row mul-partial ${gridClass} ${row === currentRow ? 'is-current' : ''}`} key={currentRow}>{partialRow(currentRow)}</div>)}
      {showResultRow && <><div className="mul-line" /><div className={`mul-row mul-result ${gridClass}`}>{reading && <span className={`mc-slot mc-active mc-wide ${colClass(1)} ${spanClass(columns)}`}>{input(readPlaceholder)}</span>}</div></>}
    </div>
  )
}

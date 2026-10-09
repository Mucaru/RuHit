import { BoardInput } from './BoardInput'
import { PLACE_NAMES } from '../../data/activities'
import type { BoardProps } from '../../types'

export function VerticalBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const width = Math.max(String(question.a).length, String(question.b).length)
  const columns = width + 1
  const top = String(question.a).padStart(columns, ' ').split('')
  const bottom = String(question.b).padStart(columns, ' ').split('')
  const isAddition = question.activity === 'addition'
  const kind = current.kind
  const isFinal = kind === 'final'
  const writeKind = isAddition ? 'add-write' : 'subtract-column'
  const written: Record<number, string> = {}
  const carries: Record<number, string> = {}
  completed.forEach((item) => {
    const position = item.meta?.position ?? 0
    if (item.kind === 'add-write' || item.kind === 'subtract-column') written[position + 1] = item.expected
    // jumlah kolom 0-9 tidak punya langkah tulis terpisah: angkanya langsung muncul di bawah kolom
    if (item.kind === 'add-column' && Number(item.expected) < 10) written[position + 1] = item.expected
    if (item.kind === 'add-carry') {
      carries[position] = item.expected
      if (position === 0) written[0] = item.expected
    }
  })
  const cellPosition = current.meta?.position != null ? current.meta.position + 1 : -1
  const carryIndex = kind === 'add-carry' ? current.meta?.position : kind === 'borrow' ? current.meta?.cursor + 1 : kind === 'borrow-receive' ? current.meta?.position + 1 : null
  const hasInlineCell = kind === writeKind || carryIndex != null
  const lastBoard = [...completed].reverse().find((item) => item.meta?.board)?.meta?.board as number[] | undefined
  const borrowed = (index: number) => (!isAddition && lastBoard && index > 0 && lastBoard[index - 1] !== Number(top[index].trim() || 0) ? lastBoard[index - 1] : undefined)
  const placeLabel = (index: number) => (index === 0 ? (isAddition ? 'simpanan' : '') : PLACE_NAMES[columns - 1 - index])
  const grid = { gridTemplateColumns: `repeat(${columns}, 1fr)` }
  const answerCell = (index: number) => {
    const inline = kind === writeKind && cellPosition === index
    const cls = inline ? '' : written[index] ? 'filled-cell' : cellPosition === index && !hasInlineCell && kind !== 'add-column' ? 'active-placeholder' : ''
    return <span className={cls} key={index}>{inline ? <BoardInput value={value} onChange={onChange} disabled={disabled} /> : written[index] || ''}</span>
  }
  const carryCell = (index: number) => {
    const entry = carryIndex === index
    const shown = isAddition ? carries[index] : borrowed(index)
    const filled = !entry && shown !== undefined && shown !== ''
    return <span className={`${entry ? 'active' : ''} ${filled ? 'filled-cell' : ''}`.trim()} key={index}>{entry ? <BoardInput value={value} onChange={onChange} disabled={disabled} /> : shown ?? ''}</span>
  }
  return <div className={`board vertical-board ${question.visual}`}><div className="place-labels" style={grid}>{top.map((_, index) => kind === 'add-column' && index === (current.meta?.position ?? -2) + 1 ? <span key={index} className="vb-bubble"><BoardInput value={value} onChange={onChange} disabled={disabled} placeholder="hitung" /></span> : <span key={index}>{placeLabel(index)}</span>)}</div><div className="carry-row" style={grid}>{top.map((_, index) => carryCell(index))}</div><div className="number-row" style={grid}>{top.map((char, index) => <span className={borrowed(index) !== undefined ? 'struck' : ''} key={index}>{char.trim()}</span>)}</div><div className="number-row operator-row" style={grid}><b>{isAddition ? '+' : '−'}</b>{bottom.map((char, index) => <span key={index}>{char.trim()}</span>)}</div><div className="board-line" /><div className="answer-row" style={grid}>{top.map((_, index) => answerCell(index))}</div>{isFinal && <div className="vb-final"><BoardInput value={value} onChange={onChange} disabled={disabled} className="wide-input" placeholder="hasil akhir" /></div>}</div>
}

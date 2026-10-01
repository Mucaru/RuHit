import type { CSSProperties } from 'react'
import { isPrime } from '../../lib/math'
import { BoardInput } from './BoardInput'
import type { BoardProps } from '../../types'

export function TreeBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const pairs = completed.filter((item) => item.kind === 'tree-quotient').map((item) => ({ leaf: String(item.meta?.factor), node: String(item.expected) }))
  const levels = question.steps.filter((item) => item.kind === 'tree-factor').length
  const picking = current.kind === 'tree-factor'
  const quotienting = current.kind === 'tree-quotient'
  const pairStyle = (depth: number) => ({ '--d': depth }) as CSSProperties
  const nodeClass = (text: string) => `tree-cell ${/^\d+$/.test(text) && isPrime(Number(text)) ? 'tree-leaf' : 'tree-num'}`
  return <div className="board tree-board"><div className="board-label">POHON FAKTOR <span className="board-live">● bagi terus sampai semua ujung prima</span></div><div className="tree-scroll"><div className="tree-canvas" style={{ '--levels': levels } as CSSProperties}>
    <div className="tree-root-row"><span className="tree-cell tree-num">{question.number}</span></div>
    {pairs.map((pair, index) => <div className="tree-pair" style={pairStyle(index)} key={index}><b className="tree-cell tree-leaf">{pair.leaf}</b><span className={nodeClass(pair.node)}>{pair.node}</span></div>)}
    {(picking || quotienting) && <div className="tree-pair active-pair" style={pairStyle(pairs.length)}><b className={`tree-cell ${quotienting ? 'tree-leaf' : 'tree-ask'}`}>{quotienting ? current.meta?.factor : '?'}</b>{quotienting ? <BoardInput value={value} onChange={onChange} disabled={disabled} placeholder="?" /> : <span className="tree-cell tree-ask">?</span>}</div>}
  </div></div>{current.kind === 'tree-final' && <div className="tree-final-entry"><span>Semua ujung prima (boleh urutan bebas)</span><BoardInput value={value} onChange={onChange} disabled={disabled} text placeholder="2, 2, 3" /></div>}<div className="prime-legend"><span>2</span><span>3</span><span>5</span><span>7</span><small>pilih prima yang habis membagi</small></div><div className="board-caption"><span className="caption-dot" /> Kiri: faktor prima · Kanan: hasil bagi yang dipecah lagi</div></div>
}
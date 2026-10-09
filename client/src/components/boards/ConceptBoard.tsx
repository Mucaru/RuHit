import { ListInput } from './ListInput'
import { BoardInput } from './BoardInput'
import type { BoardProps } from '../../types'

export function ConceptBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  if (question.activity === 'prime') {
    const listing = current.kind === 'prime-factors'
    return <div className="board concept-board"><div className="concept-number">{question.number}</div><p>Bilangan prima hanya punya <b>2 faktor</b>: 1 dan dirinya sendiri.</p>{listing && <div className="board-entry-list"><span>Faktor dari {question.number}</span><ListInput value={value} onChange={onChange} disabled={disabled} /></div>}</div>
  }
  const isGcd = question.activity === 'gcd'
  const leftStep = completed.find((step) => step.kind.endsWith('a'))
  const rightStep = completed.find((step) => step.kind.endsWith('b'))
  const isLeft = current.kind.endsWith('a')
  const isRight = current.kind.endsWith('b')
  const left = leftStep?.expected || (isLeft ? '...' : `${question.number} : ...`)
  const right = rightStep?.expected || (isRight ? '...' : `${question.other} : ...`)
  const target = isLeft ? question.number : question.other
  return <div className="board concept-board"><div className="set-pair"><div className={isLeft ? 'is-active' : ''}><small>{question.number}</small><strong>{left}</strong></div><span>{isGcd ? '∩' : '↗'}</span><div className={isRight ? 'is-active' : ''}><small>{question.other}</small><strong>{right}</strong></div></div>{(isLeft || isRight) && <div className="board-entry-list"><span>{isGcd ? 'Faktor dari' : 'Kelipatan dari'} {target}</span><ListInput value={value} onChange={onChange} disabled={disabled} /></div>}{!isLeft && !isRight && <div className="board-entry-row"><span>{isGcd ? 'FPB' : 'KPK'} dari kedua bilangan</span><BoardInput value={value} onChange={onChange} disabled={disabled} /></div>}<div className="concept-tip">{isGcd ? 'Pilih faktor yang muncul di kedua sisi.' : 'Cari angka pertama yang muncul di kedua daftar.'}</div></div>
}

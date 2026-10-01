import { BoardInput } from './BoardInput'
import type { BoardProps } from '../../types'

export function ConceptBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  if (question.activity === 'prime') return <div className="board concept-board"><div className="board-label">CEK BILANGAN PRIMA</div><div className="concept-number">{question.number}</div>{current.kind === 'prime-explain' && <div className="factor-chips">{(current.meta?.factors || []).map((factor: number) => <span key={factor}>{factor}</span>)}</div>}<p>Bilangan prima hanya punya <b>2 faktor</b>: 1 dan dirinya sendiri.</p>{current.kind === 'prime-explain' && <div className="board-entry-row"><span>Jumlah faktor</span><BoardInput value={value} onChange={onChange} disabled={disabled} /></div>}</div>
  const label = question.activity === 'gcd' ? 'FAKTOR BERSAMA' : 'KELIPATAN BERSAMA'
  const leftStep = completed.find((step) => step.kind.endsWith('a'))
  const rightStep = completed.find((step) => step.kind.endsWith('b'))
  const left = leftStep?.expected || `${question.number} : ...`
  const right = rightStep?.expected || `${question.other} : ...`
  const isLeft = current.kind.endsWith('a')
  const isRight = current.kind.endsWith('b')
  return <div className="board concept-board"><div className="board-label">{label}</div><div className="set-pair"><div><small>{question.number}</small>{isLeft ? <BoardInput value={value} onChange={onChange} disabled={disabled} text placeholder="tulis daftar" /> : <strong>{left}</strong>}</div><span>{question.activity === 'gcd' ? '∩' : '↗'}</span><div><small>{question.other}</small>{isRight ? <BoardInput value={value} onChange={onChange} disabled={disabled} text placeholder="tulis daftar" /> : <strong>{right}</strong>}</div></div>{!isLeft && !isRight && <div className="board-entry-row"><span>{question.activity === 'gcd' ? 'FPB' : 'KPK'} dari kedua bilangan</span><BoardInput value={value} onChange={onChange} disabled={disabled} /></div>}<div className="concept-tip">{question.activity === 'gcd' ? 'Pilih faktor yang muncul di kedua sisi.' : 'Cari angka pertama yang muncul di kedua daftar.'}</div><div className="board-caption"><span className="caption-dot" /> Tulis daftar dulu, baru cari jawabannya</div></div>
}

import { ConceptBoard } from './ConceptBoard'
import { DivisionBoard } from './DivisionBoard'
import { MultiplicationBoard } from './MultiplicationBoard'
import { TreeBoard } from './TreeBoard'
import { VerticalBoard } from './VerticalBoard'
import type { BoardProps } from '../../types'

export function WorkBoard(props: BoardProps) {
  const { question } = props
  if (question.visual === 'addition' || question.visual === 'subtraction') return <VerticalBoard {...props} />
  if (question.visual === 'multiplication') return <MultiplicationBoard {...props} />
  if (question.visual === 'division') return <DivisionBoard {...props} />
  if (question.visual === 'tree') return <TreeBoard {...props} />
  return <ConceptBoard {...props} />
}

export type VisualKind = 'place-value' | 'fraction-bar' | 'number-line' | 'grid' | 'angle' | 'chart' | 'blocks' | 'shape' | 'position' | 'pattern' | 'tally' | 'volume' | 'none'
export type QuestionParams = Record<string, number | string | number[]>

export type LearningQuestion = {
  id: string
  typeId: string
  topicId: string
  prompt: string
  expected: string
  params: QuestionParams
  explanation: string
  hints: [string, string, string]
  misconception: string
  visual: VisualKind
  choices?: string[]
}

export type QuestionOutcome = 'correct' | 'helped' | 'skipped'

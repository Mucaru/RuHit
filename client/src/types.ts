import type { Question, Step } from './lib/math'

export type AnswerStatus = 'idle' | 'correct' | 'wrong' | 'empty'

export type BoardProps = {
  question: Question
  current: Step
  completed: Step[]
  value: string
  onChange: (value: string) => void
  disabled: boolean
}

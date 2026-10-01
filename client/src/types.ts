import type { Question, Step } from './lib/math'

export type Screen = 'home' | 'activities' | 'levels' | 'exercise' | 'result'
export type AnswerStatus = 'idle' | 'correct' | 'wrong' | 'empty'

export type BoardProps = {
  question: Question
  current: Step
  completed: Step[]
  value: string
  onChange: (value: string) => void
  disabled: boolean
}

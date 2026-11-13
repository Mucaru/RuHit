import { describe, expect, it } from 'vitest'
import { topics } from '../../data/kurikulum'
import { CLASS_FIVE_QUESTION_TYPES, availableQuestionTypes, checkAnswer, generateQuestion, solveQuestion } from './engine'

function seeded(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x1_0000_0000
  }
}

describe('generator matematika parametrik kelas 5', () => {
  it('memiliki sedikitnya 40 tipe soal kelas 5', () => {
    expect(new Set(CLASS_FIVE_QUESTION_TYPES).size).toBeGreaterThanOrEqual(40)
  })

  it('semua tipe soal pada peta kurikulum memiliki generator', () => {
    const known = new Set(availableQuestionTypes())
    const missing = [...new Set(topics.flatMap((topic) => topic.generatorTypes))].filter((id) => !known.has(id))
    expect(missing).toEqual([])
  })

  it('seluruh tipe pada peta kurikulum lolos pemeriksaan lintas seed', () => {
    const allTypes = [...new Set(topics.flatMap((topic) => topic.generatorTypes))]
    for (const typeId of allTypes) {
      for (let seed = 1; seed <= 30; seed += 1) {
        const question = generateQuestion(typeId, 'all-curriculum-test', seeded(seed), 5)
        expect(solveQuestion(question)).toBe(question.expected)
        expect(checkAnswer(question, question.expected)).toBe(true)
      }
    }
  })

  it.each(CLASS_FIVE_QUESTION_TYPES)('%s: hasil generator sama dengan checker independen', (typeId) => {
    for (let seed = 1; seed <= 100; seed += 1) {
      const question = generateQuestion(typeId, 'property-test', seeded(seed), 5)
      expect(solveQuestion(question)).toBe(question.expected)
      expect(checkAnswer(question, question.expected)).toBe(true)
    }
  })

  it('generator tidak menghasilkan teks soal kosong atau jawaban kosong', () => {
    for (const typeId of CLASS_FIVE_QUESTION_TYPES) {
      const question = generateQuestion(typeId, 'smoke-test', Math.random, 5)
      expect(question.prompt.trim().length).toBeGreaterThan(10)
      expect(question.expected.trim().length).toBeGreaterThan(0)
      expect(question.hints).toHaveLength(3)
    }
  })

  it('menurunkan atau menaikkan rentang bilangan sesuai penguasaan', () => {
    const lower = generateQuestion('whole-add', 'adaptive', seeded(1), 5, 0)
    const higher = generateQuestion('whole-add', 'adaptive', seeded(1), 5, 4)
    expect(Number(lower.params.a)).toBeLessThan(10000)
    expect(Number(higher.params.a)).toBeGreaterThanOrEqual(10000)
  })

  it('checker menerima koma atau titik untuk jawaban desimal', () => {
    const question = generateQuestion('fraction-to-decimal', 'fractions', seeded(42), 5)
    expect(checkAnswer(question, question.expected.replace(',', '.'))).toBe(true)
  })
})

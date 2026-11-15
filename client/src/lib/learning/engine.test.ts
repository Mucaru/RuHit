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

describe('pilihan ganda tipe urutan', () => {
  const cases: Array<[string, number[]]> = [['whole-order', [1, 2, 3, 4, 5, 6]], ['fraction-order', [4, 5, 6]]]
  for (const [typeId, grades] of cases) {
    it(`${typeId}: tiga pilihan berbeda dan memuat jawaban benar (600 soal)`, () => {
      for (const grade of grades) {
        for (let seed = 1; seed <= 100; seed += 1) {
          const question = generateQuestion(typeId, 'uji', seeded(seed * 7919 + grade), grade, seed % 5)
          const choices = question.choices ?? []
          expect(choices, `${typeId} kelas ${grade} seed ${seed}: ${choices.join(' | ')}`).toHaveLength(3)
          expect(new Set(choices).size, `pilihan kembar: ${choices.join(' | ')}`).toBe(3)
          expect(choices).toContain(question.expected)
          if (typeId === 'whole-order') expect(new Set(question.params.values as number[]).size, 'bilangan kembar (dulu bisa membuat loop tak berujung)').toBe(3)
          expect(checkAnswer(question, question.expected)).toBe(true)
        }
      }
    })
  }
})

describe('whole-place-value: soal yang jelas dan menguji nilai tempat', () => {
  it('angka yang ditanyakan unik, bukan 0, bukan satuan; jawaban beda dari bilangan (900 soal)', () => {
    for (const grade of [1, 2, 3, 4, 5, 6]) {
      for (let seed = 1; seed <= 150; seed += 1) {
        const question = generateQuestion('whole-place-value', 'uji', seeded(seed * 104729 + grade), grade, seed % 5)
        const value = String(question.params.value)
        const asked = question.prompt.match(/nilai angka (\d)\?/)?.[1] ?? ''
        const message = `${question.prompt} -> ${question.expected}`
        expect(asked, message).not.toBe('')
        expect(asked, message).not.toBe('0')
        expect(value.split('').filter((digit) => digit === asked), `angka kembar: ${message}`).toHaveLength(1)
        const position = Number(question.params.position)
        expect(position, message).toBeGreaterThanOrEqual(1)
        expect(value[value.length - 1 - position], message).toBe(asked)
        expect(question.expected, `jawaban = bilangan: ${message}`).not.toBe(value)
        expect(question.expected, message).toBe(String(Number(asked) * 10 ** position))
        expect(checkAnswer(question, question.expected)).toBe(true)
      }
    }
  })
})


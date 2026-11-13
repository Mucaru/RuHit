import { describe, expect, it } from 'vitest'
import { CLASS_FIVE_QUESTION_TYPES, checkAnswer, generateQuestion, solveQuestion } from './engine'
import { solutionSteps } from './solutions'
import { pecahanChapters, findExample, lessonsByTopic } from '../../data/lesson-pecahan'
import { topicBySlug } from '../../data/kurikulum'

function seeded(seed: number) {
  let t = seed
  return () => { t += 0x6d2b79f5; let r = Math.imul(t ^ (t >>> 15), t | 1); r ^= r + Math.imul(r ^ (r >>> 7), r | 61); return ((r ^ (r >>> 14)) >>> 0) / 4294967296 }
}

describe('langkah penyelesaian Biji', () => {
  it.each(CLASS_FIVE_QUESTION_TYPES)('%s: langkah lengkap, rapi, dan berakhir di jawaban yang benar', (typeId) => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const question = generateQuestion(typeId, 'uji', seeded(seed), 5, 2)
      const steps = solutionSteps(question)
      expect(steps.length).toBeGreaterThanOrEqual(3)
      expect(steps.at(-1)?.final).toBe(true)
      expect(steps.at(-1)?.text).toContain(solveQuestion(question))
      for (const step of steps) {
        expect(`${step.title} ${step.text}`).not.toMatch(/undefined|NaN|\$\{|\[object/)
        expect(step.text.trim().length).toBeGreaterThan(8)
      }
      for (const hint of question.hints) expect(hint).not.toContain('${')
    }
  })

  it('jawaban benar selalu diterima checker dan pilihan ganda mengandung jawaban', () => {
    for (const typeId of CLASS_FIVE_QUESTION_TYPES) {
      for (let seed = 1; seed <= 30; seed += 1) {
        const question = generateQuestion(typeId, 'uji', seeded(seed * 7), 5, 2)
        expect(checkAnswer(question, solveQuestion(question))).toBe(true)
        if (question.choices) expect(question.choices).toContain(question.expected)
      }
    }
  })

  it('pilihan jawaban diacak, jawaban benar tidak selalu di urutan pertama', () => {
    const positions = new Set<number>()
    for (let seed = 1; seed <= 60; seed += 1) {
      const question = generateQuestion('fraction-improper-to-mixed', 'uji', seeded(seed), 5, 2)
      positions.add(question.choices!.indexOf(question.expected))
    }
    expect(positions.size).toBeGreaterThan(1)
  })
})

describe('pengecekan jawaban pecahan', () => {
  it('menerima pecahan senilai pada penjumlahan, tetapi tidak pada soal menyederhanakan', () => {
    const add = { typeId: 'fraction-add-same', params: { a: 1, b: 3, d: 8 } }
    expect(solveQuestion(add)).toBe('1/2')
    expect(checkAnswer(add, '4/8')).toBe(true)
    expect(checkAnswer(add, '1/2')).toBe(true)
    expect(checkAnswer(add, '4/16')).toBe(false)
    const simplify = { typeId: 'fraction-simplify', params: { n: 4, d: 8 } }
    expect(checkAnswer(simplify, '4/8')).toBe(false)
    expect(checkAnswer(simplify, '1/2')).toBe(true)
  })

  it('mengubah pecahan biasa dan campuran dengan benar', () => {
    expect(solveQuestion({ typeId: 'fraction-improper-to-mixed', params: { n: 7, d: 3 } })).toBe('2 1/3')
    expect(solveQuestion({ typeId: 'fraction-mixed-to-improper', params: { w: 2, n: 1, d: 3 } })).toBe('7/3')
  })

  it('penjumlahan penyebut beda selalu punya penyebut berbeda dan hasil kurang dari satu', () => {
    for (let seed = 1; seed <= 200; seed += 1) {
      const q = generateQuestion('fraction-add-different', 'uji', seeded(seed), 5, 2)
      const { a, b, d1, d2 } = q.params as Record<string, number>
      expect(d1).not.toBe(d2)
      expect(a * d2 + b * d1).toBeLessThan(d1 * d2)
    }
  })
})

describe('materi pecahan', () => {
  it('ada 12 bab dan setiap contoh ditemukan sesuai angka yang diminta', () => {
    expect(pecahanChapters).toHaveLength(12)
    for (const chapter of pecahanChapters) {
      const { question, exact } = findExample(chapter, 'pecahan-operasi')
      expect(exact, `contoh bab ${chapter.id}`).toBe(true)
      expect(question.typeId).toBe(chapter.exampleType)
      expect(chapter.rules.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('latihan tiap bab hanya memakai tipe soal yang ada di topik', () => {
    const topic = topicBySlug('pecahan')!
    for (const chapter of lessonsByTopic[topic.id]) {
      for (const type of chapter.focus) expect(topic.generatorTypes, `${chapter.id}/${type}`).toContain(type)
    }
  })
})

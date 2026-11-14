// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { HomePage } from './HomePage'
import { topics } from '../data/kurikulum'
import { legacyTopics } from '../data/legacy-topics'
import { emptyProgress } from '../lib/progress'
import type { Progress } from '../lib/progress'

afterEach(() => cleanup())

const base = (): Progress => ({ ...emptyProgress(), seenGuide: true })
const entry = (activity: string) => ({ date: '2026-11-10', activity, level: 1, score: 5, clean: 4, total: 8, stars: 2, review: [] })
const played = (activity: string, lastGrade: number | null): Progress => ({
  ...base(),
  lastGrade,
  topics: { [activity]: { plays: 1, correct: 5, helped: 1, total: 8, mastery: 1, lastPlayed: '2026-11-10' } },
  history: [entry(activity)],
})
const mainCta = () => screen.getByRole('link', { name: /Mulai belajar|Lanjutkan belajar/ })

describe('HomePage: satu tombol utama tanpa kelas 5 yang dikunci', () => {
  it('anak baru: "Mulai belajar" turun ke pilihan kelas, bukan ke kelas 5', () => {
    render(<HomePage progress={base()} onProgress={vi.fn()} />)
    expect(mainCta().textContent).toContain('Mulai belajar')
    expect(mainCta().getAttribute('href')).toBe('#pilih-kelas')
    expect(screen.getAllByRole('link', { name: /Mulai belajar|Lanjutkan belajar/ })).toHaveLength(1)
  })

  it('sudah memilih kelas tapi belum berlatih: "Mulai belajar" ke kelas itu', () => {
    render(<HomePage progress={{ ...base(), lastGrade: 3 }} onProgress={vi.fn()} />)
    expect(mainCta().textContent).toContain('Mulai belajar')
    expect(mainCta().getAttribute('href')).toBe('/kelas/3/')
  })

  it('sudah berlatih topik kurikulum: "Lanjutkan belajar" ke topik terakhir di kelas terakhir', () => {
    const topic = topics.find((item) => item.id === 'pecahan-operasi')!
    render(<HomePage progress={played(topic.id, 6)} onProgress={vi.fn()} />)
    const grade = topic.classes.includes(6) ? 6 : topic.classes[0]
    expect(mainCta().textContent).toContain('Lanjutkan belajar')
    expect(mainCta().getAttribute('href')).toBe(`/kelas/${grade}/${topic.slug}/`)
    expect(screen.getByText(`Terakhir: ${topic.title}`)).toBeTruthy()
  })

  it('sudah berlatih topik bersusun: "Lanjutkan belajar" ke /latihan/ (halaman kelas untuk topik ini tidak ada)', () => {
    const legacy = legacyTopics.find((item) => item.id === 'addition')!
    render(<HomePage progress={played(legacy.id, 5)} onProgress={vi.fn()} />)
    expect(mainCta().getAttribute('href')).toBe(`/latihan/${legacy.slug}/`)
  })

  it('riwayat tidak dikenali: jatuh ke kelas terakhir, bukan tautan rusak', () => {
    render(<HomePage progress={played('topik-yang-sudah-dihapus', 4)} onProgress={vi.fn()} />)
    expect(mainCta().textContent).toContain('Lanjutkan belajar')
    expect(mainCta().getAttribute('href')).toBe('/kelas/4/')
  })
})

describe('HomePage: ringkasan belajar', () => {
  it('semua nol: statistik disembunyikan dan diganti ajakan', () => {
    render(<HomePage progress={base()} onProgress={vi.fn()} />)
    expect(screen.queryByText('hari beruntun')).toBeNull()
    expect(screen.queryByText('topik dicoba')).toBeNull()
    expect(screen.getByText(/Bintang pertamamu menunggu/)).toBeTruthy()
  })

  it('sudah ada aktivitas: statistik tampil, ajakan hilang', () => {
    render(<HomePage progress={played('pecahan-operasi', 5)} onProgress={vi.fn()} />)
    expect(screen.getByText('hari beruntun')).toBeTruthy()
    expect(screen.queryByText(/Bintang pertamamu menunggu/)).toBeNull()
  })
})

describe('HomePage: maskot hero', () => {
  it('dimuat eager dengan prioritas tinggi; maskot lain tetap lazy', () => {
    const { container } = render(<HomePage progress={base()} onProgress={vi.fn()} />)
    const hero = container.querySelector('.hero-biji img')!
    expect(hero.getAttribute('loading')).toBe('eager')
    expect(hero.getAttribute('fetchpriority')).toBe('high')
    const footer = container.querySelector('.home-footer-card img')!
    expect(footer.getAttribute('loading')).toBe('lazy')
  })
})

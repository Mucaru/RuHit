// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { SiteHeader } from './SiteHeader'

afterEach(() => cleanup())

describe('SiteHeader: pemilih kelas', () => {
  it('menu Kelas membuka tautan Kelas 1 sampai 6 dan menandai kelas yang sedang dibuka', () => {
    render(<SiteHeader backHref="/" backLabel="Beranda" grade={4} />)
    const button = screen.getByRole('button', { name: /Kelas/ })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryAllByRole('link', { name: /^Kelas \d$/ })).toHaveLength(0)

    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')
    const links = screen.getAllByRole('link', { name: /^Kelas \d$/ })
    expect(links.map((link) => link.getAttribute('href'))).toEqual([1, 2, 3, 4, 5, 6].map((grade) => `/kelas/${grade}/`))
    expect(links.filter((link) => link.getAttribute('aria-current') === 'page').map((link) => link.textContent)).toEqual(['Kelas 4'])
  })

  it('tidak lagi mengunci ke kelas 5', () => {
    const { container } = render(<SiteHeader />)
    expect(container.querySelector('a[href="/kelas/5/"]')).toBeNull()
  })

  it('Escape menutup menu dan mengembalikan fokus ke tombol', () => {
    render(<SiteHeader />)
    const button = screen.getByRole('button', { name: /Kelas/ })
    fireEvent.click(button)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button)
  })

  it('tautan Laporan tetap ada', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('link', { name: 'Laporan' }).getAttribute('href')).toBe('/laporan/')
  })
})

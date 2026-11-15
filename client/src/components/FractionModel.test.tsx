// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { FractionBarRow } from './FractionModel'

afterEach(() => cleanup())

describe('FractionBarRow', () => {
  it('batang tanpa label diberi kelas fm-row-bare supaya selebar baris (bukan garis sempit)', () => {
    const { container } = render(<FractionBarRow d={8} segments={[{ count: 5, tone: 'a' }, { count: 1, tone: 'b' }]} caption="5/8 + 1/8" />)
    expect(container.querySelector('.fm-row')?.classList.contains('fm-row-bare')).toBe(true)
    expect(container.querySelectorAll('.fm-cell')).toHaveLength(8)
    expect(container.querySelector('.fm-caption')?.textContent).toBe('5/8 + 1/8')
  })

  it('batang berlabel memakai tata letak dua kolom biasa', () => {
    const { container } = render(<FractionBarRow d={4} segments={[{ count: 1, tone: 'a' }]} label="1/4" />)
    expect(container.querySelector('.fm-row')?.classList.contains('fm-row-bare')).toBe(false)
    expect(container.querySelector('.fm-label')?.textContent).toBe('1/4')
  })
})

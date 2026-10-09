// @vitest-environment jsdom
import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { ListInput } from './ListInput'

afterEach(cleanup)

function Harness({ start = '' }: { start?: string }) {
  const [value, setValue] = useState(start)
  return <><span data-testid="value">{value}</span><ListInput value={value} onChange={setValue} disabled={false} /></>
}

describe('ListInput', () => {
  it('angka + koma masuk jadi kartu, tombol Tambah memasukkan angka terakhir', () => {
    render(<Harness />)
    const input = screen.getByRole('textbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: '6,' } })
    expect(screen.getByRole('button', { name: 'Hapus 6' })).toBeTruthy()
    fireEvent.change(input, { target: { value: '9' } })
    fireEvent.click(screen.getByRole('button', { name: /Tambah/ }))
    expect(screen.getByRole('button', { name: 'Hapus 9' })).toBeTruthy()
    expect(screen.getByText('2 angka')).toBeTruthy()
  })
  it('tombol Tambah mati saat kotak kosong; ketuk kartu menghapus angka', () => {
    render(<Harness start="1, 2, 3, " />)
    expect((screen.getByRole('button', { name: /Tambah/ }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Hapus 2' }))
    expect(screen.queryByRole('button', { name: 'Hapus 2' })).toBeNull()
    expect(screen.getByText('2 angka')).toBeTruthy()
  })
  it('hanya ada satu kotak isian (fokus otomatis tetap benar)', () => {
    const { container } = render(<Harness start="1, 2, " />)
    expect(container.querySelectorAll('input').length).toBe(1)
  })
})

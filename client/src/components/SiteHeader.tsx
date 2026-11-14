import { useEffect, useId, useRef, useState } from 'react'
import type { FocusEvent } from 'react'
import { Brand } from './Brand'
import { LeaveDialog } from './LeaveDialog'
import { MAX_GRADE, MIN_GRADE } from '../lib/progress'

const grades = Array.from({ length: MAX_GRADE - MIN_GRADE + 1 }, (_, index) => MIN_GRADE + index)

/** Pemilih kelas: tombol yang membuka daftar tautan kelas 1-6. Escape, klik di luar, atau Tab keluar menutupnya. */
function GradeMenu({ current }: { current?: number }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      buttonRef.current?.focus()
    }
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
  }

  return (
    <div className="grade-menu" ref={wrapRef} onBlur={onBlur}>
      <button ref={buttonRef} type="button" className="grade-menu-button" aria-expanded={open} aria-controls={listId} onClick={() => setOpen((value) => !value)}>
        Kelas <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className="grade-menu-list" id={listId} aria-label="Pilih kelas">
          {grades.map((grade) => (
            <li key={grade}><a href={`/kelas/${grade}/`} aria-current={grade === current ? 'page' : undefined}>Kelas {grade}</a></li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function SiteHeader({ backHref, backLabel = 'Kembali', compact = false, confirmBack = false, grade }: { backHref?: string; backLabel?: string; compact?: boolean; confirmBack?: boolean; grade?: number }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <header className="site-header">
      <div className="site-header-inner">
        {backHref && <a className="back-link" href={backHref} onClick={(event) => { if (confirmBack) { event.preventDefault(); setConfirming(true) } }}><span aria-hidden="true">←</span> {backLabel}</a>}
        <Brand compact={compact} />
        <nav className="site-nav" aria-label="Navigasi utama">
          <GradeMenu current={grade} />
          <a href="/laporan/">Laporan</a>
        </nav>
      </div>
      {confirming && backHref && <LeaveDialog onStay={() => setConfirming(false)} onLeave={() => window.location.assign(backHref)} />}
    </header>
  )
}

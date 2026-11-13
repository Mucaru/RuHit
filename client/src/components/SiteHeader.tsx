import { useState } from 'react'
import { Brand } from './Brand'
import { LeaveDialog } from './LeaveDialog'

export function SiteHeader({ backHref, backLabel = 'Kembali', compact = false, confirmBack = false }: { backHref?: string; backLabel?: string; compact?: boolean; confirmBack?: boolean }) {
  const [confirming, setConfirming] = useState(false)
  return (
    <header className="site-header">
      <div className="site-header-inner">
        {backHref && <a className="back-link" href={backHref} onClick={(event) => { if (confirmBack) { event.preventDefault(); setConfirming(true) } }}><span aria-hidden="true">←</span> {backLabel}</a>}
        <Brand compact={compact} />
        <nav className="site-nav" aria-label="Navigasi utama">
          <a href="/kelas/5/">Kelas</a>
          <a href="/laporan/">Laporan</a>
        </nav>
      </div>
      {confirming && backHref && <LeaveDialog onStay={() => setConfirming(false)} onLeave={() => window.location.assign(backHref)} />}
    </header>
  )
}

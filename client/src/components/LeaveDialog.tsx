import { useEffect } from 'react'

export function LeaveDialog({ onStay, onLeave }: { onStay: () => void; onLeave: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onStay() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onStay])
  return <div className="dialog-backdrop" role="presentation" onClick={onStay}><div className="dialog-card" role="dialog" aria-modal="true" aria-labelledby="leave-title" onClick={(event) => event.stopPropagation()}><h2 id="leave-title">Keluar dari sesi?</h2><p>Latihan yang sedang berjalan akan hilang. Kamu bisa mulai lagi kapan saja.</p><div className="dialog-actions"><button type="button" className="primary-button" autoFocus onClick={onStay}>Lanjut latihan</button><button type="button" className="secondary-button" onClick={onLeave}>Ya, keluar</button></div></div></div>
}

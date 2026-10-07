import { useEffect } from 'react'

const STEPS = [
  { title: 'Isi kotak yang menyala', text: 'Kotak yang bergerak itu giliranmu.' },
  { title: 'Tekan Periksa', text: 'Salah? Tidak apa-apa, coba lagi.' },
  { title: 'Bingung? Buka Petunjuk', text: 'Petunjuk ada di samping. Tombol Dengar bisa membacakan soal.' },
]

export function FirstTimeGuide({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return <div className="dialog-backdrop" role="presentation"><div className="dialog-card guide-card" role="dialog" aria-modal="true" aria-labelledby="guide-title"><h2 id="guide-title">Cara mainnya gampang</h2><ol className="guide-steps">{STEPS.map((step, index) => <li key={step.title}><span aria-hidden="true">{index + 1}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>)}</ol><div className="dialog-actions"><button type="button" className="primary-button large" autoFocus onClick={onClose}>Mulai!</button></div></div></div>
}

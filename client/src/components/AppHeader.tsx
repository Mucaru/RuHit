import { Brand } from './Brand'

export function AppHeader({ title, onBack, onHome }: { title: string; onBack: () => void; onHome: () => void }) {
  return <header className="topbar"><div className="topbar-inner"><button className="text-button" type="button" onClick={onBack}><span aria-hidden="true">←</span> Kembali</button><Brand /><div className="topbar-title">{title}</div><button className="home-button" type="button" onClick={onHome} aria-label="Ke beranda"><span aria-hidden="true">⌂</span><em>Home</em></button></div></header>
}

import { Brand } from './Brand'

/** focus = layar latihan: hanya Kembali + judul, supaya anak tidak tergoda tombol lain. */
export function AppHeader({ title, onBack, onHome, focus = false }: { title: string; onBack: () => void; onHome: () => void; focus?: boolean }) {
  return <header className={`topbar ${focus ? 'topbar-focus' : ''}`}><div className="topbar-inner"><button className="text-button" type="button" onClick={onBack}><span aria-hidden="true">←</span> Kembali</button>{!focus && <Brand />}<div className="topbar-title">{title}</div>{focus ? <span className="topbar-spacer" aria-hidden="true" /> : <button className="home-button" type="button" onClick={onHome} aria-label="Ke beranda"><span aria-hidden="true">⌂</span><em>Home</em></button>}</div></header>
}

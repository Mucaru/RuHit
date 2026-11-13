export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? 'brand-compact' : ''}`} href="/" aria-label="Ruang Hitung, beranda">
      <img className="brand-symbol" src="/brand/logo.svg" alt="" width="44" height="44" />
      <span className="brand-copy">
        <strong><span className="brand-a">ruang</span> <span className="brand-b">hitung</span></strong>
        {!compact && <small>BELAJAR BARENG BIJI</small>}
      </span>
    </a>
  )
}

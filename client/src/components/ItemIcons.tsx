import type { ItemId } from '../lib/learning/items'

/** Ikon benda berupa SVG inline (atribut SVG, tanpa style, aman untuk CSP). Digambar pada kotak 32 x 32 lalu diskalakan ke `size`. */
function Shape({ item }: { item: ItemId }) {
  switch (item) {
    case 'apel':
      return <>
        <path d="M16 10C12 6 5 8 5 17c0 7 5 13 8 13 1.4 0 2-.9 3-.9s1.6.9 3 .9c3 0 8-6 8-13 0-9-7-11-11-7z" fill="#e0453a" stroke="#9c2b24" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M16 10c0-3 1-5 2.5-6.5" fill="none" stroke="#5a3b1e" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M18.5 6.5c2-2.5 5-2.5 7-1.5-1 2.5-4.5 3.5-7 1.5z" fill="#4fa35a" />
      </>
    case 'jeruk':
      return <>
        <circle cx="16" cy="18" r="12" fill="#f59a23" stroke="#c26d0b" strokeWidth="1.5" />
        <path d="M16 7c.5-3 3-4.5 6-4-.5 3-3 4.5-6 4z" fill="#4fa35a" />
        <path d="M8.5 16c1-3 3.5-5.5 6.5-6.5" fill="none" stroke="#fcc46a" strokeWidth="2" strokeLinecap="round" />
      </>
    case 'pisang':
      return <path d="M5 5c-1 12 6 21 22 21 2.2 0 2.8 2.6.8 3.6C13 35 .5 23 1.5 5z" fill="#f5d33d" stroke="#b8901a" strokeWidth="1.5" strokeLinejoin="round" />
    case 'bola-merah':
      return <>
        <circle cx="16" cy="16" r="13" fill="#e5483d" stroke="#9c2b24" strokeWidth="1.5" />
        <path d="M8 13c1-3 3.5-5.5 7-6.5" fill="none" stroke="#fbb2ab" strokeWidth="2.2" strokeLinecap="round" />
      </>
    case 'bola-biru':
      return <>
        <circle cx="16" cy="16" r="13" fill="#3b7ddd" stroke="#244f93" strokeWidth="1.5" />
        <path d="M8 13c1-3 3.5-5.5 7-6.5" fill="none" stroke="#b3d0f7" strokeWidth="2.2" strokeLinecap="round" />
      </>
    default:
      return <circle cx="16" cy="16" r="12" fill="#f2c85b" stroke="#283334" strokeWidth="1.5" />
  }
}

export function ItemIcon({ item, x, y, size }: { item: ItemId; x: number; y: number; size: number }) {
  return <g className="story-icon" data-item={item} transform={`translate(${x} ${y}) scale(${size / 32})`}><Shape item={item} /></g>
}

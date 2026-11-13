/** Ledakan konfeti kecil. Murni CSS, tanpa inline style, dan dimatikan saat reduce-motion. */
export function Confetti({ burst }: { burst: number }) {
  if (burst <= 0) return null
  return (
    <div className="confetti" aria-hidden="true" key={burst}>
      {Array.from({ length: 24 }, (_, index) => <i className={`confetti-piece confetti-${index % 8} confetti-pos-${index}`} key={index} />)}
    </div>
  )
}

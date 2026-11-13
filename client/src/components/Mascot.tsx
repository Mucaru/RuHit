export type MascotExpression = 'happy' | 'thinking' | 'excited' | 'almost' | 'oops' | 'celebrate'
export type MascotMotion = 'none' | 'float' | 'bounce' | 'wiggle'

/**
 * Biji, maskot manik sempoa. Gerak dibuat dengan CSS dan otomatis berhenti
 * ketika perangkat meminta pengurangan gerak (prefers-reduced-motion).
 */
export function Mascot({ expression = 'happy', size = 'large', label = 'Biji, teman belajar matematika', motion = 'float' }: { expression?: MascotExpression; size?: 'small' | 'medium' | 'large'; label?: string; motion?: MascotMotion }) {
  return <img className={`mascot mascot-${size} mascot-${expression} mascot-motion-${motion}`} src={`/brand/mascot-${expression}.svg`} alt={label} width="180" height="180" loading="lazy" />
}

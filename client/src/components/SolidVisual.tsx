import type { ReactElement } from 'react'
import { describeSolid } from '../lib/learning/visual-guard'
import type { LearningQuestion } from '../lib/learning/types'

type Point = [number, number]
const COS30 = Math.cos(Math.PI / 6)
const points = (list: Point[]) => list.map((point) => `${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(' ')

/**
 * Balok/kubus dalam proyeksi isometrik. x (panjang) ke kanan-bawah, y (lebar) ke kiri-bawah, z (tinggi) ke atas.
 * cubes = true: kisi kubus satuan di tiga sisi yang terlihat dan label ukuran (bahan soal), tanpa jumlah kubusnya.
 * cubes = false: bangun polos; tiga rusuk yang tersembunyi digambar putus-putus supaya semua titik sudut terlihat.
 */
export function SolidVisual({ question }: { question: LearningQuestion }) {
  const solid = describeSolid(question)
  if (!solid) return null
  const { length: L, width: W, height: H, cubes } = solid
  const spanX = (L + W) * COS30
  const spanY = (L + W) / 2 + H
  const scale = Math.min((cubes ? 118 : 190) / spanX, (cubes ? 112 : 150) / spanY)
  const ox = 150 - ((L - W) * COS30 * scale) / 2
  const oy = (cubes ? 88 : 100) - (((L + W) / 2 - H) / 2) * scale
  const at = (x: number, y: number, z: number): Point => [ox + (x - y) * COS30 * scale, oy + ((x + y) / 2 - z) * scale]
  const line = (key: string, a: Point, b: Point, className?: string) => <line key={key} className={className} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />

  const grid: ReactElement[] = []
  if (cubes) {
    for (let i = 1; i < L; i += 1) { grid.push(line(`tx${i}`, at(i, 0, H), at(i, W, H))); grid.push(line(`lx${i}`, at(i, W, 0), at(i, W, H))) }
    for (let j = 1; j < W; j += 1) { grid.push(line(`ty${j}`, at(0, j, H), at(L, j, H))); grid.push(line(`ry${j}`, at(L, j, 0), at(L, j, H))) }
    for (let k = 1; k < H; k += 1) { grid.push(line(`rz${k}`, at(L, 0, k), at(L, W, k))); grid.push(line(`lz${k}`, at(0, W, k), at(L, W, k))) }
  }
  const name = L === W && W === H ? 'kubus' : 'balok'
  const label = cubes ? `Balok dari kubus satuan: panjang ${L}, lebar ${W}, tinggi ${H}` : `Gambar ${name}`
  const lengthAt = at(L / 2, W, 0)
  const widthAt = at(L, W / 2, 0)
  const heightAt = at(0, W, H / 2)
  return (
    <svg className="geometry-visual" viewBox="0 0 300 200" role="img" aria-label={label}>
      {!cubes && (
        <g>
          {line('h1', at(0, 0, 0), at(L, 0, 0), 'geo-dash')}
          {line('h2', at(0, 0, 0), at(0, W, 0), 'geo-dash')}
          {line('h3', at(0, 0, 0), at(0, 0, H), 'geo-dash')}
        </g>
      )}
      <polygon className="geo-shape geo-face-top" points={points([at(0, 0, H), at(L, 0, H), at(L, W, H), at(0, W, H)])} />
      <polygon className="geo-shape geo-face-right" points={points([at(L, 0, 0), at(L, W, 0), at(L, W, H), at(L, 0, H)])} />
      <polygon className="geo-shape" points={points([at(0, W, 0), at(L, W, 0), at(L, W, H), at(0, W, H)])} />
      {cubes && <g className="geo-grid">{grid}</g>}
      {cubes && (
        <g>
          <text className="geo-label" x={lengthAt[0] - 9} y={lengthAt[1] + 16} textAnchor="middle" dominantBaseline="middle">{`panjang ${L}`}</text>
          <text className="geo-label" x={widthAt[0] + 9} y={widthAt[1] + 16} textAnchor="middle" dominantBaseline="middle">{`lebar ${W}`}</text>
          <text className="geo-label" x={heightAt[0] - 10} y={heightAt[1]} textAnchor="end" dominantBaseline="middle">{`tinggi ${H}`}</text>
        </g>
      )}
    </svg>
  )
}

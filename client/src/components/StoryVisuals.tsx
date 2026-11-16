import { cardsLayout, describeCards, describeFood, describeMoney, describeObjects, describeRatio, foodLayout, moneyLayout, objectsLayout, ratioLayout } from '../lib/learning/story-visual'
import type { TextItem } from '../lib/learning/story-visual'
import { ITEMS, rupiah } from '../lib/learning/items'
import type { LearningQuestion } from '../lib/learning/types'
import { ItemIcon } from './ItemIcons'

/** Soal cerita bergambar. Semua gambar hanya menampilkan yang sudah diketahui soal; hasil hitung tidak pernah digambar. */

function StoryText({ item }: { item: TextItem }) {
  return <text className={`story-text story-t${item.size}`} x={item.x} y={item.y} textAnchor={item.anchor} dominantBaseline="middle">{item.text}</text>
}

/** Benda (apel, jeruk, bola, ...) per baris, piktogram, atau tabel frekuensi. */
export function ObjectsVisual({ question }: { question: LearningQuestion }) {
  const story = describeObjects(question)
  if (!story) return null
  const layout = objectsLayout(story)
  const label = story.kind === 'count'
    ? `${story.rows.map((row) => `${row.count} ${ITEMS[row.item].noun}`).join(' dan ')}`
    : story.kind === 'pictogram'
      ? `Piktogram: ${story.rows.map((row) => `${row.count} gambar ${ITEMS[row.item].noun}`).join(', ')}. Satu gambar mewakili ${story.unit} kg.`
      : `Tabel: ${story.rows.map((row) => `${ITEMS[row.item].label} ${row.value} kg`).join(', ')}`
  return (
    <svg className="story-visual" viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={label}>
      {layout.lines.map((line, index) => <line className="story-rule" key={index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} />)}
      {layout.icons.map((icon, index) => <ItemIcon key={index} item={icon.item} x={icon.x} y={icon.y} size={icon.size} />)}
      {layout.texts.map((text, index) => <StoryText key={index} item={text} />)}
    </svg>
  )
}

const foodFill: Record<string, string> = { kue: '#f4a8b8', pizza: '#f2a93b', semangka: '#e8556a', cokelat: '#8a5a3c', roti: '#e3b26b' }

/** Soal cerita pecahan: dua makanan terpisah. Tidak ada gambar gabungan, jadi hasil tambah atau kurang tidak terlihat. */
export function FoodVisual({ question }: { question: LearningQuestion }) {
  const story = describeFood(question)
  if (!story) return null
  const layout = foodLayout(story)
  const noun = ITEMS[story.item].noun
  const fill = foodFill[story.item] ?? '#f2c85b'
  const label = story.mode === 'add'
    ? `Dua gambar ${noun}, masing-masing dibagi ${story.d} bagian sama besar. Gambar pertama menandai ${story.first} bagian, gambar kedua menandai ${story.second} bagian.`
    : `Dua gambar ${noun}, masing-masing dibagi ${story.d} bagian sama besar. Di piring ada ${story.first} bagian, yang dimakan ${story.second} bagian.`
  return (
    <svg className="story-visual" viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={label}>
      {layout.foods.map((food) => (
        <g className="story-food" key={food.cx}>
          {story.item === 'semangka' && <circle cx={food.cx} cy={70} r={54} fill="none" stroke="#4f9a4e" strokeWidth="6" />}
          {food.slices.map((slice, index) => (
            <path className={slice.on ? 'story-slice is-on' : 'story-slice is-off'} key={index} d={slice.path} fill={slice.on ? fill : '#fffdf7'} stroke={slice.on ? '#283334' : '#9d9b8e'} strokeWidth="2" strokeLinejoin="round" strokeDasharray={slice.on ? undefined : '4 3'} />
          ))}
        </g>
      ))}
      {layout.texts.map((text, index) => <StoryText key={index} item={text} />)}
    </svg>
  )
}

/** Label harga dan selembar uang yang dibayar. Kembalian tidak digambar. */
export function MoneyVisual({ question }: { question: LearningQuestion }) {
  const story = describeMoney(question)
  if (!story) return null
  const layout = moneyLayout(story)
  const what = story.item ? ` ${ITEMS[story.item].noun}` : ''
  return (
    <svg className="story-visual" viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={`Harga ${rupiah(story.price)} per 1 kg${what}. Uang dibayar ${rupiah(story.paid)}.`}>
      <rect className="story-card" x="8" y="10" width="118" height="128" rx="12" />
      {layout.icon && <ItemIcon item={layout.icon.item} x={layout.icon.x} y={layout.icon.y} size={layout.icon.size} />}
      <rect x="142" y="40" width="150" height="76" rx="8" fill="#d8ecd3" stroke="#283334" strokeWidth="2.5" />
      <rect x="149" y="47" width="136" height="62" rx="5" fill="none" stroke="#6b9a63" strokeWidth="1.5" />
      <circle cx="166" cy="78" r="14" fill="#fffdf7" stroke="#6b9a63" strokeWidth="2" />
      {layout.texts.map((text, index) => <StoryText key={index} item={text} />)}
    </svg>
  )
}

/** Tabel dua baris untuk soal perbandingan senilai; sel yang ditanyakan bertanda ?. */
export function RatioVisual({ question }: { question: LearningQuestion }) {
  const story = describeRatio(question)
  if (!story) return null
  const layout = ratioLayout(story)
  return (
    <svg className="story-visual" viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={`Tabel perbandingan: ${story.a} sendok sirup untuk ${story.b} gelas air; ${story.second} sendok sirup untuk berapa gelas air.`}>
      <rect className="story-card" x="10" y="10" width="280" height="44" rx="10" />
      <rect className="story-card" x="10" y="58" width="280" height="44" rx="10" />
      <rect className="story-card" x="10" y="110" width="280" height="44" rx="10" />
      <rect className="story-ask" x="156" y="112" width="130" height="40" rx="8" />
      <line className="story-rule" x1="150" y1="14" x2="150" y2="150" />
      {layout.texts.map((text, index) => <StoryText key={index} item={text} />)}
    </svg>
  )
}

function Ribbon({ x, y }: { x: number; y: number }) {
  return (
    <g className="story-icon" transform={`translate(${x} ${y})`}>
      <polygon points="0,0 90,0 82,14 90,28 0,28 8,14" fill="#ee7ba0" stroke="#9c3a63" strokeWidth="2" strokeLinejoin="round" />
      <rect x="40" y="0" width="10" height="28" fill="#c9487a" />
    </g>
  )
}

function Sack({ x, y }: { x: number; y: number }) {
  return (
    <g className="story-icon" transform={`translate(${x} ${y})`}>
      <path d="M14 14 L8 52 Q28 60 48 52 L42 14 Q28 8 14 14Z" fill="#d9b27c" stroke="#7a5a2e" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 14 Q28 22 42 14" fill="none" stroke="#7a5a2e" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 8 Q28 2 35 8" fill="none" stroke="#7a5a2e" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
}

/** Dua benda berlabel dengan ukuran gambar sama. Panjang atau berat sebenarnya tidak digambar karena itu jawabannya. */
export function CardsVisual({ question }: { question: LearningQuestion }) {
  const story = describeCards(question)
  if (!story) return null
  const layout = cardsLayout(story)
  const name = story.thing === 'pita' ? 'Pita' : 'Karung'
  return (
    <div className="story-wrap">
      <svg className="story-visual" viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={`${name} A ${story.a} ${story.unit}, ${name} B ${story.b} ${story.unit}.`}>
        {layout.cards.map((card) => (
          <g key={card.x}>
            <rect className="story-card" x={card.x} y="8" width="130" height="134" rx="12" />
            {story.thing === 'pita' ? <Ribbon x={card.cx - 45} y={56} /> : <Sack x={card.cx - 28} y={44} />}
          </g>
        ))}
        {layout.texts.map((text, index) => <StoryText key={index} item={text} />)}
      </svg>
      <small className="story-note">Gambar bukan ukuran sebenarnya.</small>
    </div>
  )
}


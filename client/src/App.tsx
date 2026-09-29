import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { Activity, Question, Step } from './lib/math'
import { isPrime, makeSession, stepMatches } from './lib/math'
import './index.css'

type Screen = 'home' | 'activities' | 'levels' | 'exercise' | 'result'
type AnswerStatus = 'idle' | 'correct' | 'wrong' | 'empty'

type BoardProps = {
  question: Question
  current: Step
  completed: Step[]
  value: string
  onChange: (value: string) => void
  disabled: boolean
}

const activityMeta: Array<{ id: Activity; icon: string; title: string; description: string; tone: string; label?: string }> = [
  { id: 'addition', icon: '+', title: 'Penjumlahan bersusun', description: 'Susun angka, simpan carry, lalu baca hasilnya.', tone: 'mint', label: 'Paling dasar' },
  { id: 'subtraction', icon: '−', title: 'Pengurangan bersusun', description: 'Belajar meminjam dengan panah dan kolom nilai tempat.', tone: 'peach' },
  { id: 'multiplication', icon: '×', title: 'Perkalian bersusun', description: 'Kali per kolom, simpan carry, dan susun hasil parsial.', tone: 'lavender', label: 'Favorit' },
  { id: 'division', icon: '÷', title: 'Pembagian bersusun', description: 'Ikuti urutan bagi, kali, kurang, lalu turunkan.', tone: 'blue' },
  { id: 'factor-tree', icon: '⌁', title: 'Pohon faktor', description: 'Pecah bilangan sampai semua daunnya prima.', tone: 'yellow', label: 'Cara utama faktor' },
  { id: 'prime', icon: '✦', title: 'Bilangan prima', description: 'Periksa apakah hanya punya dua faktor.', tone: 'mint' },
  { id: 'gcd', icon: '∩', title: 'FPB', description: 'Temukan faktor bersama yang paling besar.', tone: 'peach' },
  { id: 'lcm', icon: '↗', title: 'KPK', description: 'Cari kelipatan bersama yang paling kecil.', tone: 'blue' },
]

const levelInfo = [
  ['Pemanasan', 'Angka kecil, fokus kenalan dengan langkah.'],
  ['Mulai lancar', 'Mulai ada carry, pinjam, atau sisa.'],
  ['Makin jago', 'Angka lebih panjang, tetap pelan-pelan.'],
  ['Tantangan', 'Campuran langkah untuk menguji strategi.'],
]

const levels: Record<Activity, number> = { addition: 4, subtraction: 4, multiplication: 4, division: 4, 'factor-tree': 4, prime: 3, gcd: 3, lcm: 3 }
const SESSION_SIZE = 10
const PLACE_NAMES = ['satuan', 'puluhan', 'ratusan', 'ribuan']

function Brand() {
  return <div className="brand"><span className="brand-mark"><b>＋</b><i>×</i></span><span><strong>ruang hitung</strong><small>MATEMATIKA KELAS 5</small></span></div>
}

function AppHeader({ title, onBack, onHome }: { title: string; onBack: () => void; onHome: () => void }) {
  return <header className="topbar"><div className="topbar-inner"><button className="text-button" type="button" onClick={onBack}><span>←</span> Kembali</button><Brand /><div className="topbar-title">{title}</div><button className="home-button" type="button" onClick={onHome}><span>⌂</span><em>Home</em></button></div></header>
}

function Home({ onOpen }: { onOpen: (activity?: Activity) => void }) {
  return <main className="page home-page">
    <header className="home-nav"><Brand /><div className="nav-note"><span>✦</span> Belajar tanpa buru-buru</div></header>
    <section className="hero">
      <div className="hero-copy"><div className="kicker"><span className="spark-dot" /> KELAS 5 · BELAJAR SAMBIL PAHAM</div><h1>Matematika jadi mudah saat kamu <mark>ikut mengerjakan.</mark></h1><p>Di sini bukan tebak jawaban. Kamu menulis setiap langkah, melihat nilai tempat, dan tahu kenapa jawabanmu benar.</p><div className="hero-actions"><button className="primary-button large" type="button" onClick={() => onOpen('addition')}>Mulai dari penjumlahan <span>→</span></button><button className="ghost-button" type="button" onClick={() => onOpen()}>Lihat semua latihan</button></div><div className="hero-trust"><span>10 soal per sesi</span><i /> <span>bebas coba lagi</span><i /> <span>ada petunjuk</span></div></div>
      <div className="hero-visual"><span className="orbit orbit-a" /><span className="orbit orbit-b" /><div className="floating-note note-top">Tulis langkahmu <b>✎</b></div><div className="worksheet-card"><div className="worksheet-head"><span className="mini-number">1</span><strong>375 + 923</strong><span className="mini-star">✦</span></div><div className="carry-mini"><i /><i /><i /><i /></div><div className="sum-mini"><span /><b>3</b><b>7</b><b>5</b><em>+</em><b>9</b><b>2</b><b>3</b></div><div className="sum-line" /><div className="answer-mini"><i /><i /><i /><i /></div><div className="worksheet-tip">Kotak kecil untuk angka simpanan</div></div><div className="floating-note note-bottom"><span>✓</span> Langkah demi langkah</div><div className="hero-spark spark-one">＋</div><div className="hero-spark spark-two">÷</div></div>
    </section>
    <section className="home-section"><div className="section-intro"><div><div className="kicker muted">PILIH PETUALANGANMU</div><h2>Mau belajar apa hari ini?</h2></div><span className="topic-count">8 cara belajar</span></div><div className="module-grid">{activityMeta.slice(0, 5).map((item) => <ActivityCard key={item.id} item={item} onClick={() => onOpen(item.id)} />)}</div></section>
    <section className="principles"><div className="principle"><span>01</span><div><strong>Bukan tebak-tebakan</strong><p>Setiap jawaban punya alasan yang bisa kamu lihat.</p></div></div><div className="principle"><span>02</span><div><strong>Seperti di buku tulis</strong><p>Kolom, carry, pinjaman, dan panah ditunjukkan jelas.</p></div></div><div className="principle"><span>03</span><div><strong>Salah itu petunjuk</strong><p>Feedback membantu menemukan langkah yang perlu diperbaiki.</p></div></div></section>
    <footer className="home-footer">✿ <span>Pelan-pelan tidak apa-apa. Yang penting kamu paham caranya.</span></footer>
  </main>
}

function ActivityCard({ item, onClick }: { item: typeof activityMeta[number]; onClick: () => void }) {
  return <button className={`activity-card tone-${item.tone}`} type="button" onClick={onClick}><div className="activity-card-top"><span className="activity-icon">{item.icon}</span>{item.label && <small>{item.label}</small>}</div><strong>{item.title}</strong><p>{item.description}</p><span className="card-link">Mulai latihan <b>→</b></span></button>
}

function ActivityPicker({ onChoose, onBack }: { onChoose: (activity: Activity) => void; onBack: () => void }) {
  return <main className="page inner-page"><div className="page-intro tone-mint"><div className="kicker muted">PILIH CARA BERHITUNG</div><h1>Satu langkah kecil, lalu <em>langkah berikutnya.</em></h1><p>Pilih topik yang ingin kamu pelajari. Setiap latihan punya papan kerja agar kamu bisa mengikuti cara hitungnya.</p><div className="intro-doodle">＋ × ÷</div></div><div className="section-intro compact"><div><div className="kicker muted">SEMUA LATIHAN</div><h2>Mulai dari yang terasa nyaman</h2></div><button className="back-link" type="button" onClick={onBack}>← Kembali ke home</button></div><div className="activity-list">{activityMeta.map((item) => <ActivityCard key={item.id} item={item} onClick={() => onChoose(item.id)} />)}</div></main>
}

function LevelPicker({ activity, onStart, onBack }: { activity: Activity; onStart: (level: number) => void; onBack: () => void }) {
  const meta = activityMeta.find((item) => item.id === activity)!
  return <main className="page inner-page level-page"><div className={`page-intro tone-${meta.tone}`}><div className="kicker muted">{meta.title.toUpperCase()}</div><h1>Pilih level <em>dengan caramu.</em></h1><p>Mulai dari yang terasa nyaman. Semua sesi tetap punya petunjuk dan bisa dicoba lagi.</p><div className="intro-doodle">{meta.icon} 1 2 3</div></div><div className="section-intro compact"><div><div className="kicker muted">PILIH TINGKATMU</div><h2>Seberapa siap kamu hari ini?</h2></div><button className="back-link" type="button" onClick={onBack}>← Ganti topik</button></div><div className="level-grid">{Array.from({ length: levels[activity] }, (_, index) => <button className={`level-card level-${index + 1}`} type="button" key={index} onClick={() => onStart(index + 1)}><div className="level-top"><span>{String(index + 1).padStart(2, '0')}</span><b>{'✦'.repeat(Math.min(index + 1, 3))}</b></div><strong>{levelInfo[index][0]}</strong><small>{levelInfo[index][1]}</small><div className="level-go">Mulai <span>→</span></div></button>)}</div><div className="safe-note"><span>✦</span><p><strong>Ruang aman untuk belajar.</strong> Tidak ada nyawa dan tidak ada waktu habis. Kamu boleh berpikir pelan-pelan.</p></div></main>
}

function BoardInput({ value, onChange, text = false, disabled, className = '', placeholder = '?' }: { value: string; onChange: (value: string) => void; text?: boolean; disabled: boolean; className?: string; placeholder?: string }) {
  return <input className={`board-input ${text ? 'board-input-text' : ''} ${className}`} form="answer-form" value={value} disabled={disabled} inputMode={text ? 'text' : 'numeric'} autoComplete="off" placeholder={placeholder} aria-label="Isi kotak langkahmu" onChange={(event) => onChange(text ? event.target.value : event.target.value.replace(/\D/g, ''))} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); (document.getElementById('answer-form') as HTMLFormElement | null)?.requestSubmit() } }} />
}

function VerticalBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const width = Math.max(String(question.a).length, String(question.b).length)
  const columns = width + 1
  const top = String(question.a).padStart(columns, ' ').split('')
  const bottom = String(question.b).padStart(columns, ' ').split('')
  const isAddition = question.activity === 'addition'
  const kind = current.kind
  const isFinal = kind === 'final'
  const writeKind = isAddition ? 'add-write' : 'subtract-column'
  const written: Record<number, string> = {}
  const carries: Record<number, string> = {}
  completed.forEach((item) => {
    const position = item.meta?.position ?? 0
    if (item.kind === 'add-write' || item.kind === 'subtract-column') written[position + 1] = item.expected
    if (item.kind === 'add-carry') {
      carries[position] = item.expected
      if (position === 0) written[0] = item.expected
    }
  })
  const cellPosition = current.meta?.position != null ? current.meta.position + 1 : -1
  const carryIndex = kind === 'add-carry' ? current.meta?.position : kind === 'borrow' ? current.meta?.cursor + 1 : kind === 'borrow-receive' ? current.meta?.position + 1 : null
  const hasInlineCell = kind === writeKind || carryIndex != null
  const lastBoard = [...completed].reverse().find((item) => item.meta?.board)?.meta?.board as number[] | undefined
  const borrowed = (index: number) => (!isAddition && lastBoard && index > 0 && lastBoard[index - 1] !== Number(top[index].trim() || 0) ? lastBoard[index - 1] : undefined)
  const placeLabel = (index: number) => (index === 0 ? (isAddition ? 'simpanan' : '') : PLACE_NAMES[columns - 1 - index])
  const grid = { gridTemplateColumns: `repeat(${columns}, 1fr)` }
  const answerCell = (index: number) => {
    if (kind === writeKind && cellPosition === index) return <BoardInput value={value} onChange={onChange} disabled={disabled} />
    return <span className={written[index] ? 'filled-cell' : ''}>{written[index] || ''}</span>
  }
  const carryCell = (index: number) => {
    if (carryIndex === index) return <BoardInput value={value} onChange={onChange} disabled={disabled} />
    const shown = isAddition ? carries[index] : borrowed(index)
    return <span className={shown !== undefined && shown !== '' ? 'filled-cell' : ''}>{shown ?? ''}</span>
  }
  const entryLabel = isFinal ? 'Tulis hasil akhir' : kind === 'add-column' ? 'Hasil kolom' : kind.startsWith('borrow') ? 'Angka setelah pinjam' : 'Tulis hasil langkah'
  return <div className={`board vertical-board ${question.visual}`}><div className="board-label">CARA BERSUSUN <span className="board-live">● kotak aktif = giliranmu</span></div><div className="place-labels" style={grid}>{top.map((_, index) => <span key={index}>{placeLabel(index)}</span>)}</div><div className="carry-row" style={grid}>{top.map((_, index) => <span className={carryIndex === index ? 'active' : ''} key={index}>{carryCell(index)}</span>)}</div><div className="number-row" style={grid}>{top.map((char, index) => <span className={borrowed(index) !== undefined ? 'struck' : ''} key={index}>{char.trim()}</span>)}</div><div className="number-row operator-row" style={grid}><b>{isAddition ? '+' : '−'}</b>{bottom.map((char, index) => <span key={index}>{char.trim()}</span>)}</div><div className="board-line" /><div className="answer-row" style={grid}>{top.map((_, index) => <span className={cellPosition === index && !hasInlineCell ? 'active-placeholder' : ''} key={index}>{answerCell(index)}</span>)}</div>{!hasInlineCell && <div className="board-entry-row"><span>{entryLabel}</span><BoardInput value={value} onChange={onChange} disabled={disabled} className={isFinal ? 'wide-input' : ''} placeholder={isFinal ? 'hasil' : '?'} /></div>}<div className="board-caption"><span className="caption-dot" /> {isAddition ? 'Klik kotak berwarna, lalu tulis jawaban langkahmu' : 'Angka yang dipinjam dicoret, angka barunya ditulis di kotak atas'}</div></div>
}

function MultiplicationBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const partials = completed.filter((item) => item.kind === 'partial').map((item) => item.expected)
  const activeRow = current.meta?.row
  const carryStep = ['multiply-carry', 'multiply-carry-final'].includes(current.kind)
  return <div className="board multiplication-board"><div className="board-label">KALI PER KOLOM <span className="board-live">● simpan carry di atas</span></div><div className="multiplication-expression"><span>{question.a}</span><b>×</b><span>{question.b}</span></div><div className="mini-rule" /><div className="carry-strip">{carryStep ? <BoardInput value={value} onChange={onChange} disabled={disabled} placeholder="carry" /> : <span className="carry-guide">{current.kind === 'multiply-column' ? 'hitung kolom ini' : 'ikuti baris hasil'}</span>}</div><div className="partial-lines"><div><small>baris 1</small><strong>{partials[0] || '· · ·'}</strong></div>{question.b! >= 10 && <div className={activeRow === 1 ? 'active-row' : ''}><small>baris 2 digeser ←</small><strong>{partials[1] || '· · ·'}</strong></div>}{completed.some((item) => item.kind === 'partial-sum') && <div className="sum-result"><small>jumlahkan</small><strong>{completed.find((item) => item.kind === 'partial-sum')?.expected}</strong></div>}</div>{!carryStep && <div className="board-entry-row"><span>{current.kind === 'final' ? 'Hasil akhir' : current.kind === 'partial' || current.kind === 'partial-sum' ? 'Isi hasil baris' : 'Hasil kolom ini'}</span><BoardInput value={value} onChange={onChange} disabled={disabled} className={['final', 'partial', 'partial-sum'].includes(current.kind) ? 'wide-input' : ''} placeholder={current.kind === 'final' ? 'hasil' : '?'} /></div>}<div className="board-caption"><span className="caption-dot" /> Setiap baris dikerjakan dari kanan ke kiri</div></div>
}

type DivRow = { kind: 'product' | 'rem'; text: string; end: number; ruleEnd?: number; ruleLen?: number }

function DivisionBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const dividend = String(question.a).split('')
  const n = dividend.length
  const quotient: string[] = Array(n).fill('')
  const rows: DivRow[] = []
  completed.forEach((item) => {
    const index = item.meta?.index as number
    if (item.kind === 'divide') quotient[index] = String(item.expected)
    if (item.kind === 'multiply-back') rows.push({ kind: 'product', text: String(item.expected), end: index })
    if (item.kind === 'subtract') rows.push({ kind: 'rem', text: String(item.expected), end: index, ruleEnd: index, ruleLen: String(item.meta?.product).length })
    if (item.kind === 'bring-down' && rows.length) Object.assign(rows[rows.length - 1], { text: String(item.expected), end: index + 1 })
  })
  const cursor = current.meta?.index != null ? (current.kind === 'bring-down' ? current.meta.index + 1 : current.meta.index) : n - 1
  const grid = { gridTemplateColumns: `var(--ld-d) repeat(${n + 1}, var(--ld-c))` } as CSSProperties
  const cellsOf = (row: DivRow) => {
    const start = row.end - row.text.length + 1
    return Array.from({ length: n + 1 }, (_, col) => {
      const digit = col - 1 >= start && col - 1 <= row.end ? row.text[col - 1 - start] : col === start && row.kind === 'product' ? '−' : ''
      const rule = row.kind === 'rem' && row.ruleEnd != null && col - 1 > row.ruleEnd - (row.ruleLen ?? 0) && col - 1 <= row.ruleEnd
      return <i className={rule ? 'ld-rule' : ''} key={col}>{digit}</i>
    })
  }
  const label = current.kind === 'divide' ? 'angka hasil bagi' : current.kind === 'multiply-back' ? 'hasil kali balik' : current.kind === 'subtract' ? 'sisa sementara' : current.kind === 'bring-down' ? 'angka baru setelah diturunkan' : current.kind === 'division-final' ? 'hasil bagi' : 'sisa pembagian'
  return <div className="board division-board"><div className="board-label">PEMBAGIAN BERSUSUN <span className="board-live">● ikuti 4 langkah</span></div><div className="ld-scroll"><div className="ld">
    <div className="ld-row" style={grid}><i />{['', ...quotient].map((digit, col) => <i className="ld-q" key={col}>{digit}</i>)}</div>
    <div className="ld-row" style={grid}><i className="ld-divisor">{question.b}</i>{['', ...dividend].map((digit, col) => <i className={`ld-top ${col > 0 && col - 1 <= cursor ? 'taken' : ''}`} key={col}>{digit}</i>)}</div>
    {rows.map((row, index) => <div className="ld-row" style={grid} key={index}><i />{cellsOf(row)}</div>)}
  </div></div><div className="division-working"><div className="flow-pills"><span className={current.kind === 'divide' ? 'active' : ''}>1 Bagi</span><span className={current.kind === 'multiply-back' ? 'active' : ''}>2 Kali</span><span className={current.kind === 'subtract' ? 'active' : ''}>3 Kurangi</span><span className={current.kind === 'bring-down' ? 'active' : ''}>4 Turunkan</span></div><div className="division-scratch"><small>{label}</small><BoardInput value={value} onChange={onChange} disabled={disabled} placeholder="?" /></div></div><div className="board-caption"><span className="caption-dot" /> Urutannya selalu: bagi · kali · kurang · turunkan</div></div>
}

function TreeBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  const pairs = completed.filter((item) => item.kind === 'tree-factor').map((item) => ({ leaf: String(item.expected), node: String(item.meta?.next) }))
  const levels = question.steps.filter((item) => item.kind === 'tree-factor').length
  const picking = current.kind === 'tree-factor'
  const quotienting = current.kind === 'tree-quotient'
  const pairStyle = (depth: number) => ({ '--d': depth }) as CSSProperties
  const nodeClass = (text: string) => `tree-cell ${/^\d+$/.test(text) && isPrime(Number(text)) ? 'tree-leaf' : 'tree-num'}`
  return <div className="board tree-board"><div className="board-label">POHON FAKTOR <span className="board-live">● bagi terus sampai semua ujung prima</span></div><div className="tree-scroll"><div className="tree-canvas" style={{ '--levels': levels } as CSSProperties}>
    <div className="tree-root-row"><span className="tree-cell tree-num">{question.number}</span></div>
    {pairs.map((pair, index) => <div className="tree-pair" style={pairStyle(index)} key={index}><b className="tree-cell tree-leaf">{pair.leaf}</b><span className={nodeClass(pair.node)}>{pair.node}</span></div>)}
    {(picking || quotienting) && <div className="tree-pair active-pair" style={pairStyle(pairs.length)}><b className={`tree-cell ${quotienting ? 'tree-leaf' : 'tree-ask'}`}>{quotienting ? current.meta?.factor : '?'}</b>{quotienting ? <BoardInput value={value} onChange={onChange} disabled={disabled} placeholder="?" /> : <span className="tree-cell tree-ask">?</span>}</div>}
  </div></div>{current.kind === 'tree-final' && <div className="tree-final-entry"><span>Semua ujung prima (boleh urutan bebas)</span><BoardInput value={value} onChange={onChange} disabled={disabled} text placeholder="2, 2, 3" /></div>}<div className="prime-legend"><span>2</span><span>3</span><span>5</span><span>7</span><small>pilih prima terkecil yang habis membagi</small></div><div className="board-caption"><span className="caption-dot" /> Kiri: faktor prima · Kanan: hasil bagi yang dipecah lagi</div></div>
}

function ConceptBoard({ question, current, completed, value, onChange, disabled }: BoardProps) {
  if (question.activity === 'prime') return <div className="board concept-board"><div className="board-label">CEK BILANGAN PRIMA</div><div className="concept-number">{question.number}</div>{current.kind === 'prime-explain' && <div className="factor-chips">{(current.meta?.factors || []).map((factor: number) => <span key={factor}>{factor}</span>)}</div>}<p>Bilangan prima hanya punya <b>2 faktor</b>: 1 dan dirinya sendiri.</p>{current.kind === 'prime-explain' && <div className="board-entry-row"><span>Jumlah faktor</span><BoardInput value={value} onChange={onChange} disabled={disabled} /></div>}</div>
  const label = question.activity === 'gcd' ? 'FAKTOR BERSAMA' : 'KELIPATAN BERSAMA'
  const leftStep = completed.find((step) => step.kind.endsWith('a'))
  const rightStep = completed.find((step) => step.kind.endsWith('b'))
  const left = leftStep?.expected || `${question.number} : ...`
  const right = rightStep?.expected || `${question.other} : ...`
  const isLeft = current.kind.endsWith('a')
  const isRight = current.kind.endsWith('b')
  return <div className="board concept-board"><div className="board-label">{label}</div><div className="set-pair"><div><small>{question.number}</small>{isLeft ? <BoardInput value={value} onChange={onChange} disabled={disabled} text placeholder="tulis daftar" /> : <strong>{left}</strong>}</div><span>{question.activity === 'gcd' ? '∩' : '↗'}</span><div><small>{question.other}</small>{isRight ? <BoardInput value={value} onChange={onChange} disabled={disabled} text placeholder="tulis daftar" /> : <strong>{right}</strong>}</div></div>{!isLeft && !isRight && <div className="board-entry-row"><span>{question.activity === 'gcd' ? 'FPB' : 'KPK'} dari kedua bilangan</span><BoardInput value={value} onChange={onChange} disabled={disabled} /></div>}<div className="concept-tip">{question.activity === 'gcd' ? 'Pilih faktor yang muncul di kedua sisi.' : 'Cari angka pertama yang muncul di kedua daftar.'}</div><div className="board-caption"><span className="caption-dot" /> Tulis daftar dulu, baru cari jawabannya</div></div>
}

function WorkBoard(props: BoardProps) {
  const { question, current } = props
  if (question.visual === 'addition' || question.visual === 'subtraction') return <VerticalBoard {...props} />
  if (question.visual === 'multiplication') return <MultiplicationBoard {...props} />
  if (question.visual === 'division') return <DivisionBoard {...props} />
  if (question.visual === 'tree') return <TreeBoard {...props} />
  return <ConceptBoard {...props} />
}

function Exercise({ question, questionNumber, total, score, onNext, onSkip, onExit }: { question: Question; questionNumber: number; total: number; score: number; onNext: (correct: boolean) => void; onSkip: () => void; onExit: () => void }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<AnswerStatus>('idle')
  const [attempts, setAttempts] = useState(0)
  const [hintLevel, setHintLevel] = useState(0)
  const current = question.steps[stepIndex]
  const completed = question.steps.slice(0, stepIndex)
  const progress = Math.round((questionNumber / total) * 100)
  const textInput = ['tree-final', 'set-a', 'set-b', 'multiple-a', 'multiple-b'].includes(current.kind)
  const isLastStep = stepIndex === question.steps.length - 1
  const feedback = status === 'correct' ? current.coach : status === 'empty' ? 'Kotaknya masih kosong. Coba isi jawabanmu dulu, ya.' : status === 'wrong' ? 'Belum tepat. Periksa lagi langkah kecil ini, lalu coba sekali lagi.' : ''

  function updateValue(next: string) {
    setValue(next)
    if (status !== 'idle') setStatus('idle')
  }
  function submit(answer = value) {
    if (status === 'correct') return
    if (!answer.trim()) { setStatus('empty'); return }
    if (stepMatches(current, answer)) setStatus('correct')
    else { setStatus('wrong'); setAttempts((old) => old + 1) }
  }
  function continueStep() {
    if (isLastStep) onNext(true)
    else { setStepIndex((old) => old + 1); setValue(''); setStatus('idle'); setAttempts(0); setHintLevel(0) }
  }
  function choose(valueToUse: string) { updateValue(valueToUse); submit(valueToUse) }

  return <main className="page exercise-page"><div className="exercise-top"><div><div className="kicker muted">{question.title.toUpperCase()}</div><h1>Kerjakan bersama</h1></div><div className="score-pill"><span>✦</span> Benar <b>{score}</b></div></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="exercise-meta"><span>Soal <b>{questionNumber}</b> / {total}</span><span className="step-pill">Langkah {stepIndex + 1} / {question.steps.length}</span></div><div className="exercise-layout"><section className="work-panel"><WorkBoard question={question} current={current} completed={completed} value={value} onChange={updateValue} disabled={status === 'correct'} /><div className="prompt-block"><div className="prompt-label"><span /> Giliranmu · {question.eyebrow}</div><h2>{current.prompt}</h2>{attempts >= 2 && status !== 'correct' && <div className="coach-note"><span>✦</span><div><strong>Tarik napas, kita pecah pelan-pelan.</strong><p>Kalau masih bingung, petunjuk di samping bisa dibuka kapan saja.</p></div></div>}</div><form id="answer-form" className="answer-form" onSubmit={(event) => { event.preventDefault(); submit() }}>{current.choices ? <div className="choice-grid">{current.choices.map((choice) => <button type="button" className={`choice ${value === choice.value ? 'selected' : ''}`} key={choice.value} onClick={() => choose(choice.value)} disabled={status === 'correct'}><strong>{choice.label}</strong><small>{choice.helper}</small></button>)}</div> : textInput && <div className="token-row"><span>Bantuan tanda:</span><button type="button" onClick={() => updateValue(`${value}${value ? ', ' : ''}`)}>, koma</button><button type="button" onClick={() => updateValue(`${value} × `)}>× kali</button></div>}<div className="answer-actions"><button type="submit" className="primary-button" disabled={status === 'correct'}>Periksa <span>✓</span></button>{status === 'correct' ? <button type="button" className="secondary-button" onClick={continueStep}>{isLastStep ? (questionNumber === total ? 'Lihat hasil sesi' : 'Soal berikutnya') : 'Lanjut langkah'} <span>→</span></button> : <button type="button" className="skip-button" onClick={onSkip}>Lewati soal</button>}</div></form>{status !== 'idle' && <div className={`feedback feedback-${status}`}><span>{status === 'correct' ? '✓' : status === 'empty' ? '!' : '↺'}</span><p>{feedback}</p></div>}</section><aside className="support-panel"><div className={`hint-card ${hintLevel ? 'open' : ''}`}><div className="hint-heading"><span>✦</span><div><strong>Butuh petunjuk?</strong><small>{hintLevel ? `Petunjuk tahap ${hintLevel}` : 'Belum dibuka'}</small></div></div>{hintLevel ? <p>{current.hint}</p> : <p className="hint-locked">Petunjuk tersembunyi dulu. Coba kerjakan sendiri sebelum membukanya.</p>}<button className="hint-button" type="button" onClick={() => setHintLevel((old) => old >= 3 ? 1 : old + 1)}>{hintLevel >= 3 ? 'Ulangi petunjuk' : hintLevel ? 'Petunjuk berikutnya' : 'Buka petunjuk'} <span>→</span></button></div><div className="support-card"><span>✿</span><p>Kesalahan bukan akhir. Kita gunakan untuk menemukan kolom mana yang perlu diperiksa lagi.</p></div><button className="exit-button" type="button" onClick={onExit}>← Keluar dari sesi</button></aside></div></main>
}

function Result({ score, title, onHome, onAgain }: { score: number; title: string; onHome: () => void; onAgain: () => void }) {
  const perfect = score === SESSION_SIZE
  return <main className="page result-page"><div className="result-confetti"><span>✦</span><span>＋</span><span>◌</span><span>✿</span><span>×</span></div><section className="result-card"><div className="result-badge">{perfect ? '✦' : '✓'}</div><div className="kicker muted">SESI SELESAI</div><h1>{perfect ? 'Wah, luar biasa!' : 'Kamu sudah berlatih!'}</h1><p>{perfect ? 'Semua langkah kamu lewati dengan tepat.' : 'Setiap langkah tadi jadi bekal baru untukmu.'}</p><div className="result-score"><strong>{score}</strong><span>/ {SESSION_SIZE}</span><small>soal berhasil diselesaikan</small></div><div className="result-note"><span>✦</span><p>Yang paling penting: kamu mencoba, memperbaiki langkah, dan terus belajar.</p></div><div className="result-actions"><button className="primary-button large" type="button" onClick={onAgain}>Latihan {title} lagi <span>↻</span></button><button className="secondary-button" type="button" onClick={onHome}>Kembali ke Home <span>⌂</span></button></div></section><p className="result-footnote">Tidak ada nilai yang mengurangi usahamu. Terus tumbuh, ya! <span>✿</span></p></main>
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [activity, setActivity] = useState<Activity>('addition')
  const [level, setLevel] = useState(1)
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)

  const currentQuestion = questions[questionIndex]
  const currentMeta = activityMeta.find((item) => item.id === activity)!
  const screenTitle = useMemo(() => screen === 'levels' ? currentMeta.title : screen === 'exercise' ? `${currentMeta.title} · Level ${level}` : screen === 'activities' ? 'Pilih latihan' : 'Ruang Hitung', [screen, currentMeta.title, level])

  function startActivity(next: Activity) { setActivity(next); setScreen('levels') }
  function startSession(nextLevel: number) { setLevel(nextLevel); setQuestions(makeSession(activity, nextLevel, SESSION_SIZE)); setQuestionIndex(0); setScore(0); setScreen('exercise') }
  function nextQuestion(correct: boolean) { const nextScore = score + (correct ? 1 : 0); if (questionIndex === questions.length - 1) { setScore(nextScore); setScreen('result') } else { setScore(nextScore); setQuestionIndex((old) => old + 1) } }
  function resetHome() { setQuestions([]); setQuestionIndex(0); setScore(0); setScreen('home') }
  function goBack() { if (screen === 'activities') setScreen('home'); else if (screen === 'levels') setScreen('activities'); else if (screen === 'exercise') setScreen('levels'); else if (screen === 'result') setScreen('home'); else setScreen('home') }

  return <div className="app-shell">{screen !== 'home' && <AppHeader title={screenTitle} onBack={goBack} onHome={resetHome} />}{screen === 'home' && <Home onOpen={(next) => next ? startActivity(next) : setScreen('activities')} />}{screen === 'activities' && <ActivityPicker onChoose={startActivity} onBack={goBack} />}{screen === 'levels' && <LevelPicker activity={activity} onStart={startSession} onBack={goBack} />}{screen === 'exercise' && currentQuestion && <Exercise key={currentQuestion.id} question={currentQuestion} questionNumber={questionIndex + 1} total={questions.length} score={score} onNext={nextQuestion} onSkip={() => nextQuestion(false)} onExit={goBack} />}{screen === 'result' && <Result score={score} title={currentMeta.title} onHome={resetHome} onAgain={() => startSession(level)} />}</div>
}
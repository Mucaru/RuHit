import { useRef } from 'react'
import { Plus, X } from 'lucide-react'
import { commitDraft, countList, editDraft, parseList, popLast, removeAt } from '../../lib/listInput'

/** Isi daftar angka satu per satu dengan keyboard angka. Angka masuk sebagai kartu kecil; ketuk kartu untuk menghapus. */
export function ListInput({ value, onChange, disabled, placeholder = '?' }: { value: string; onChange: (value: string) => void; disabled: boolean; placeholder?: string }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { items, draft } = parseList(value)
  const total = countList(value)
  const add = () => { onChange(commitDraft(value)); inputRef.current?.focus({ preventScroll: true }) }
  return <div className="list-input">
    {items.length > 0 && <ul className="list-chips" aria-label="Angka yang sudah ditulis">{items.map((item, index) => <li key={`${index}-${item}`}><button type="button" className="list-chip" disabled={disabled} onClick={() => onChange(removeAt(value, index))} aria-label={`Hapus ${item}`}>{item}<X size={14} aria-hidden="true" /></button></li>)}</ul>}
    <div className="list-entry">
      <input
        ref={inputRef}
        className="board-input list-draft"
        form="answer-form"
        value={draft}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        aria-labelledby="step-prompt"
        onChange={(event) => onChange(editDraft(value, event.target.value))}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && draft) { event.preventDefault(); add() }
          else if (event.key === 'Backspace' && !draft && items.length) { event.preventDefault(); onChange(popLast(value)) }
        }}
      />
      <button type="button" className="list-add" disabled={disabled || !draft} onMouseDown={(event) => event.preventDefault()} onClick={add}><Plus size={18} aria-hidden="true" /> Tambah</button>
    </div>
    <small className="list-count" aria-live="polite">{total} angka</small>
  </div>
}

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '0', '/', '%']

export function NumberKeypad({ value, onChange, disabled = false }: { value: string; onChange: (value: string) => void; disabled?: boolean }) {
  const add = (key: string) => onChange(`${value}${key}`)
  return (
    <div className="keypad" aria-label="Papan angka">
      {keys.map((key) => <button type="button" className="keypad-key" key={key} onClick={() => add(key)} disabled={disabled}>{key}</button>)}
      <button type="button" className="keypad-key keypad-action" onClick={() => onChange(value.slice(0, -1))} disabled={disabled} aria-label="Hapus satu angka">⌫</button>
      <button type="button" className="keypad-key keypad-action" onClick={() => onChange('')} disabled={disabled}>Hapus</button>
      <button type="button" className="keypad-key keypad-action" onClick={() => add(':')} disabled={disabled}>:</button>
    </div>
  )
}

'use client'
interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
  error?: string | null
}
export default function WingaIdInput({ value, onChange, onSubmit, error }: Props) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
        Winga ID
      </label>
      <input
        type="text"
        placeholder="WNGA01001"
        value={value}
        onChange={e => onChange(e.target.value.toUpperCase().replace(/\s/g, ''))}
        onKeyDown={e => e.key === 'Enter' && onSubmit()}
        className={`input-field font-mono tracking-widest text-center uppercase
          ${error ? 'border-danger focus:border-danger' : ''}`}
      />
      {error && <p className="text-xs text-danger mt-2 ml-1">{error}</p>}
      <p className="text-xs text-text-muted mt-2 ml-1">Mfano: WNGA10001</p>
    </div>
  )
}

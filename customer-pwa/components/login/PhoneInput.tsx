'use client'
interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
}
export default function PhoneInput({ value, onChange, onSubmit }: Props) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
        Namba ya Simu
      </label>
      <div className="flex items-center bg-input-bg rounded-2xl border-2 border-transparent
                      focus-within:border-primary focus-within:shadow-input transition-all duration-200">
        <span className="pl-4 pr-3 text-sm font-bold text-text-dark whitespace-nowrap border-r border-card-border mr-1">
          🇹🇿 +255
        </span>
        <input
          type="tel"
          inputMode="numeric"
          placeholder="712 345 678"
          value={value}
          onChange={e => onChange(e.target.value.replace(/\D/g, ''))}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          className="flex-1 h-14 bg-transparent outline-none px-3 text-base text-text-dark placeholder:text-text-muted"
        />
      </div>
      <p className="text-xs text-text-muted mt-2 ml-1">Bila +255 au 0 mwanzoni</p>
    </div>
  )
}

'use client'
interface Props {
  active: 'phone' | 'wingaid'
  onChange: (tab: 'phone' | 'wingaid') => void
}
export default function EntryTabs({ active, onChange }: Props) {
  return (
    <div className="flex bg-input-bg rounded-2xl p-1 mb-6">
      {(['phone', 'wingaid'] as const).map(tab => (
        <button key={tab} onClick={() => onChange(tab)}
          className={`flex-1 h-11 rounded-xl text-sm font-bold transition-all duration-200
            ${active === tab
              ? 'bg-white text-primary shadow-card'
              : 'text-text-muted'}`}>
          {tab === 'phone' ? '📱 Namba ya Simu' : '🪪 Winga ID'}
        </button>
      ))}
    </div>
  )
}

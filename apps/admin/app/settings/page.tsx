'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-primary' : 'bg-gray-200'}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200
        ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  )
}

function NumberInput({ label, value, onChange, prefix = 'TZS', suffix = '' }: any) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-card-border last:border-0">
      <div>
        <p className="text-sm font-semibold text-text-dark">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {prefix && <span className="text-sm text-text-muted">{prefix}</span>}
        <input type="number" value={value} onChange={e => onChange(Number(e.target.value))}
          className="w-28 h-9 text-right border border-card-border rounded-xl px-3 text-sm font-bold text-text-dark outline-none focus:border-primary bg-input-bg" />
        {suffix && <span className="text-sm text-text-muted">{suffix}</span>}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [commission, setCommission]   = useState(12)
  const [traTax, setTraTax]           = useState(3)
  const [priceHourly, setPriceH]      = useState(5000)
  const [priceHalf, setPriceHalf]     = useState(15000)
  const [priceFull, setPriceFull]     = useState(25000)
  const [emailNotif, setEmailNotif]   = useState(true)
  const [smsNotif, setSmsNotif]       = useState(true)
  const [saving, setSaving]           = useState(false)

  const save = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false)
    toast.success('Mipangilio imehifadhiwa!')
  }

  return (
    <AdminLayout title="Mipangilio">
      <div className="max-w-2xl space-y-5">

        {/* Commission */}
        <div className="card p-5">
          <h2 className="font-bold text-text-dark mb-1">💰 Mgawanyo wa Mapato</h2>
          <p className="text-xs text-text-muted mb-4">Mabadiliko yataathiri safari zote mpya tu</p>
          <NumberInput label="Ada ya App (%)" value={commission} onChange={setCommission} prefix="" suffix="%" />
          <NumberInput label="Kodi TRA (%)" value={traTax} onChange={setTraTax} prefix="" suffix="%" />
          <div className="mt-3 p-3 bg-primary-soft rounded-xl">
            <p className="text-xs font-semibold text-primary">
              Winga anapata: {100 - commission - traTax}% · App: {commission}% · TRA: {traTax}%
            </p>
          </div>
        </div>

        {/* Prices */}
        <div className="card p-5">
          <h2 className="font-bold text-text-dark mb-1">🏷️ Bei za Huduma</h2>
          <p className="text-xs text-text-muted mb-4">Bei zinaonyeshwa kwa wateja wakati wa kuomba</p>
          <NumberInput label="Saa 1 (Hourly)"     value={priceHourly} onChange={setPriceH} />
          <NumberInput label="Nusu Siku (Half Day)" value={priceHalf}  onChange={setPriceHalf} />
          <NumberInput label="Siku Nzima (Full Day)" value={priceFull} onChange={setPriceFull} />
        </div>

        {/* Notifications */}
        <div className="card p-5">
          <h2 className="font-bold text-text-dark mb-4">🔔 Arifa</h2>
          {[
            { label:'Arifa za Barua Pepe', desc:'Pokea arifa kwa email ya admin', value:emailNotif, set:setEmailNotif },
            { label:'Arifa za SMS',        desc:'Pokea arifa kwa SMS',             value:smsNotif,   set:setSmsNotif   },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between py-4 border-b border-card-border last:border-0">
              <div>
                <p className="text-sm font-semibold text-text-dark">{s.label}</p>
                <p className="text-xs text-text-muted">{s.desc}</p>
              </div>
              <Toggle value={s.value} onChange={s.set} />
            </div>
          ))}
        </div>

        <button onClick={save} disabled={saving}
          className="btn-primary w-full h-11">
          {saving ? 'Inahifadhi...' : 'Hifadhi Mabadiliko'}
        </button>
      </div>
    </AdminLayout>
  )
}
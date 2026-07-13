'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import PageHeader from '@/components/shared/PageHeader'
import Button from '@/components/shared/Button'
import type { ServiceType, DeliveryMethod } from '@/types/winga'

const CATEGORIES = [
  { id:'groceries',   label:'Vyakula',     emoji:'🛒' },
  { id:'electronics', label:'Simu/Elec.',  emoji:'📱' },
  { id:'clothes',     label:'Mavazi',      emoji:'👗' },
  { id:'medicine',    label:'Dawa',        emoji:'💊' },
  { id:'furniture',   label:'Samani',      emoji:'🛋️' },
  { id:'hardware',    label:'Ujenzi',      emoji:'🔧' },
  { id:'beauty',      label:'Uzuri',       emoji:'💄' },
  { id:'school',      label:'Shule',       emoji:'📚' },
  { id:'wholesale',   label:'Jumla',       emoji:'📦' },
  { id:'market',      label:'Sokoni',      emoji:'🏪' },
  { id:'other',       label:'Nyingine',    emoji:'✨' },
]

const SERVICE_OPTIONS: { value: ServiceType; label: string; price: string }[] = [
  { value:'hourly',   label:'Saa 1',      price:'TZS 5,000' },
  { value:'half_day', label:'Nusu Siku',  price:'TZS 15,000' },
  { value:'full_day', label:'Siku Nzima', price:'TZS 25,000' },
]

const DELIVERY_OPTIONS: { value: DeliveryMethod; label: string; emoji: string }[] = [
  { value:'with_customer', label:'Na Mteja',      emoji:'🚶' },
  { value:'delivery',      label:'Tunawasilisha', emoji:'🛵' },
  { value:'pickup',        label:'Pickup',         emoji:'📍' },
]

const AREAS = ['Kariakoo','Mwenge','Kinondoni','Ilala','Temeke','Mbezi Beach','Mikocheni','Msasani']

export default function BookPage() {
  const router = useRouter()
  const [category, setCategory]   = useState('')
  const [service, setService]     = useState<ServiceType | ''>('')
  const [delivery, setDelivery]   = useState<DeliveryMethod | ''>('')
  const [meetingPoint, setMeeting] = useState('')
  const [area, setArea]           = useState('')
  const [notes, setNotes]         = useState('')
  const [loading, setLoading]     = useState(false)

  const price = SERVICE_OPTIONS.find(s => s.value === service)?.price

  const canSubmit = category && service && delivery

  const handleSubmit = async () => {
    if (!canSubmit) { toast.error('Chagua aina ya huduma na njia ya utoaji'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200)) // placeholder
    toast.success('Ombi limetumwa! Winga anakuja...')
    setLoading(false)
    router.push('/requests')
  }

  return (
    <div className="bg-white">
      <PageHeader title="Omba Winga" />

      <div className="px-5 pb-10 space-y-6">
        {/* Category */}
        <div>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
            Aina ya Ununuzi
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all
                  ${category === cat.id
                    ? 'bg-primary text-white shadow-card-md scale-95'
                    : 'bg-input-bg text-text-mid active:scale-90'}`}>
                <span className="text-2xl mb-1">{cat.emoji}</span>
                <span className="text-[10px] font-semibold leading-tight text-center">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Service type */}
        <div>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
            Aina ya Huduma
          </h3>
          <div className="space-y-2">
            {SERVICE_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setService(opt.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl
                  border-2 transition-all ${service === opt.value
                    ? 'border-primary bg-primary-soft'
                    : 'border-transparent bg-input-bg'}`}>
                <span className={`font-bold text-sm ${service === opt.value ? 'text-primary' : 'text-text-dark'}`}>
                  {opt.label}
                </span>
                <span className={`text-sm font-semibold ${service === opt.value ? 'text-primary' : 'text-text-muted'}`}>
                  {opt.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Delivery method */}
        <div>
          <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
            Njia ya Utoaji
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {DELIVERY_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setDelivery(opt.value)}
                className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all
                  ${delivery === opt.value
                    ? 'border-primary bg-primary-soft'
                    : 'border-transparent bg-input-bg'}`}>
                <span className="text-2xl mb-1">{opt.emoji}</span>
                <span className={`text-xs font-semibold ${delivery === opt.value ? 'text-primary' : 'text-text-mid'}`}>
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Meeting point */}
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Mahali pa Kukutana
          </label>
          <input type="text" placeholder="Mfano: Mlango wa Kariakoo Market"
            value={meetingPoint} onChange={e => setMeeting(e.target.value)}
            className="input-field" />
        </div>

        {/* Shopping area */}
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Soko / Eneo
          </label>
          <div className="flex flex-wrap gap-2">
            {AREAS.map(a => (
              <button key={a} onClick={() => setArea(a)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all
                  ${area === a ? 'bg-primary text-white' : 'bg-input-bg text-text-mid'}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
            Maelekezo ya Ziada (Hiari)
          </label>
          <textarea placeholder="Mfano: Nunua mchele kilo 5, sukari kilo 2..."
            value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            className="w-full bg-input-bg rounded-2xl p-4 text-sm text-text-dark placeholder:text-text-muted
                       outline-none border-2 border-transparent focus:border-primary resize-none" />
        </div>

        {/* Price preview */}
        {price && (
          <div className="bg-primary-soft rounded-2xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-primary">Bei Inayokadiriwa</span>
            <span className="text-lg font-extrabold text-primary">{price}</span>
          </div>
        )}

        <Button onClick={handleSubmit} loading={loading} disabled={!canSubmit}>
          Tuma Ombi ✈️
        </Button>
      </div>
    </div>
  )
}

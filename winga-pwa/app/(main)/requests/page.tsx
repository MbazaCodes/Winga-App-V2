'use client'
import { useState } from 'react'
import { MapPin, Clock, Phone } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import type { RequestStatus } from '@/types/winga'

type Tab = 'all' | 'active' | 'completed'

const STATUS_LABEL: Record<RequestStatus, string> = {
  searching: 'Inatafuta',
  accepted:  'Imekubaliwa',
  shopping:  'Inanunua',
  completed: 'Imekamilika',
  cancelled: 'Imehairishwa',
}

const MOCK = [
  { id:'1', customer:'Sarah Kimani', phone:'0712345678', category:'Vyakula 🛒',
    service:'Saa 1', area:'Kariakoo', price:5000, final:5000,
    status:'completed' as RequestStatus, date:'2026-07-12' },
  { id:'2', customer:'Ali Hassan', phone:'0756789012', category:'Mavazi 👗',
    service:'Nusu Siku', area:'Mwenge', price:15000, final:null,
    status:'shopping' as RequestStatus, date:'2026-07-13' },
]

export default function WingaRequestsPage() {
  const [tab, setTab] = useState<Tab>('all')

  const TABS: { key: Tab; label: string }[] = [
    { key:'all',       label:'Zote' },
    { key:'active',    label:'Inaendelea' },
    { key:'completed', label:'Zilizokamilika' },
  ]

  const filtered = MOCK.filter(r => {
    if (tab === 'active')    return ['accepted','shopping','searching'].includes(r.status)
    if (tab === 'completed') return r.status === 'completed'
    return true
  })

  return (
    <div className="bg-white">
      <PageHeader title="Maombi Yangu Yote" />

      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                ${tab === t.key ? 'bg-primary text-white' : 'bg-input-bg text-text-muted'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6">
        {filtered.length === 0 ? (
          <EmptyState icon="📋" title="Hakuna maombi" subtitle="Maombi yatakuja ukiwa mtandaoni." />
        ) : (
          <div className="space-y-3">
            {filtered.map(req => (
              <div key={req.id} className="card p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-text-dark text-sm">{req.category}</p>
                    <p className="text-xs text-text-muted mt-0.5">{req.service}</p>
                  </div>
                  <span className={`badge badge-${req.status}`}>
                    {STATUS_LABEL[req.status]}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 mb-3">
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    👤 {req.customer}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Phone size={10} /> {req.phone}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <MapPin size={10} /> {req.area}
                  </span>
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={10} /> {new Date(req.date).toLocaleDateString('sw-TZ')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-card-border">
                  <span className="text-xs text-text-muted">Bei</span>
                  <span className="text-sm font-extrabold text-primary">
                    TZS {(req.final ?? req.price).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

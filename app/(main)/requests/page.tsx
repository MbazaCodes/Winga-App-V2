'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Star } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import SkeletonCard from '@/components/shared/SkeletonCard'
import Button from '@/components/shared/Button'
import type { RequestStatus } from '@/types/winga'

type Tab = 'all' | 'active' | 'completed' | 'cancelled'

const STATUS_LABEL: Record<RequestStatus, string> = {
  searching: 'Inatafuta',
  accepted:  'Imekubaliwa',
  shopping:  'Inanunua',
  completed: 'Imekamilika',
  cancelled: 'Imehairishwa',
}

// Mock data for structure
const MOCK_REQUESTS = [
  { id:'1', category:'Vyakula 🛒', service_type:'Saa 1', status:'searching' as RequestStatus,
    winga:null, estimated_price:5000, created_at:'2026-07-13T08:00:00Z', notes:'Mchele na sukari' },
  { id:'2', category:'Mavazi 👗', service_type:'Nusu Siku', status:'completed' as RequestStatus,
    winga:{ name:'Amina Hassan', badge:'verified' }, estimated_price:15000, final_price:15000,
    created_at:'2026-07-12T10:00:00Z', notes:null },
]

export default function RequestsPage() {
  const [tab, setTab] = useState<Tab>('all')
  const [loading] = useState(false)

  const TABS: { key: Tab; label: string }[] = [
    { key:'all',       label:'Zote' },
    { key:'active',    label:'Inaendelea' },
    { key:'completed', label:'Zilizokamilika' },
    { key:'cancelled', label:'Zilizohairishwa' },
  ]

  const filtered = MOCK_REQUESTS.filter(r => {
    if (tab === 'all') return true
    if (tab === 'active') return ['searching','accepted','shopping'].includes(r.status)
    if (tab === 'completed') return r.status === 'completed'
    if (tab === 'cancelled') return r.status === 'cancelled'
    return true
  })

  return (
    <div className="bg-white">
      <PageHeader title="Safari Zangu"  />

      {/* Filter tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                ${tab === t.key ? 'bg-primary text-white shadow-card' : 'bg-input-bg text-text-muted'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pb-6">
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="🛍️" title="Hakuna safari"
            subtitle="Bonyeza + omba Winga wako wa kwanza!"
            action={
              <Link href="/book">
                <button className="btn-primary w-40">Omba Winga →</button>
              </Link>
            } />
        ) : (
          <div className="space-y-3">
            {filtered.map(req => (
              <div key={req.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-bold text-text-dark text-sm">{req.category}</span>
                    <p className="text-xs text-text-muted mt-0.5">{req.service_type}</p>
                  </div>
                  <span className={`badge badge-${req.status}`}>
                    {STATUS_LABEL[req.status]}
                  </span>
                </div>

                {req.winga && (
                  <div className="flex items-center gap-2 mb-3 p-3 bg-input-bg rounded-xl">
                    <div className="w-8 h-8 bg-primary-soft rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{req.winga.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-dark">{req.winga.name}</p>
                      <p className="text-[10px] text-text-muted">{req.winga.badge === 'verified' ? '✅ Verified' : '⭐ ' + req.winga.badge}</p>
                    </div>
                  </div>
                )}

                {req.notes && (
                  <p className="text-xs text-text-muted mb-3 italic">"{req.notes}"</p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {new Date(req.created_at).toLocaleDateString('sw-TZ')}
                  </span>
                  <span className="text-sm font-bold text-text-dark">
                    TZS {(req.final_price ?? req.estimated_price ?? 0).toLocaleString()}
                  </span>
                </div>

                {req.status === 'completed' && (
                  <button className="w-full mt-3 py-2 text-xs font-bold text-primary
                                     bg-primary-soft rounded-xl active:scale-95 transition-transform">
                    ⭐ Pima Huduma
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

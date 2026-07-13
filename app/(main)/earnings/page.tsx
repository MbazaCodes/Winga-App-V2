'use client'
import { useState } from 'react'
import { TrendingDown } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import Link from 'next/link'

type Period = '7' | '30' | 'all'

const MOCK_HISTORY = [
  { id:'1', winga:'Amina Hassan', badge:'verified', date:'2026-07-12', amount:15000 },
  { id:'2', winga:'John Mwangi',  badge:'mid',      date:'2026-07-10', amount:5000 },
]

export default function EarningsPage() {
  const [period, setPeriod] = useState<Period>('30')

  const PERIODS: { key: Period; label: string }[] = [
    { key:'7',   label:'Wiki 7' },
    { key:'30',  label:'Mwezi' },
    { key:'all', label:'Yote' },
  ]

  const total = MOCK_HISTORY.reduce((s, r) => s + r.amount, 0)

  return (
    <div className="bg-white">
      <PageHeader title="Matumizi Yangu" showBack={false} />

      {/* Summary cards */}
      <div className="px-5 mb-5">
        <div className="bg-primary rounded-3xl p-5 mb-3">
          <p className="text-xs font-bold text-white/70 mb-1">Jumla Nililolipa</p>
          <p className="text-3xl font-extrabold text-white">
            TZS {total.toLocaleString()}
          </p>
          <p className="text-xs text-white/60 mt-1">Malipo yote</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card p-4">
            <p className="text-xs text-text-muted mb-1">Pochi Yangu</p>
            <p className="text-lg font-extrabold text-text-dark">TZS 0</p>
            <p className="text-[10px] text-text-muted">Referral credits</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-text-muted mb-1">Safari Zote</p>
            <p className="text-lg font-extrabold text-text-dark">{MOCK_HISTORY.length}</p>
            <p className="text-[10px] text-text-muted">Zilizolipwa</p>
          </div>
        </div>
      </div>

      {/* Period filter */}
      <div className="px-5 mb-4">
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all
                ${period === p.key ? 'bg-primary text-white' : 'bg-input-bg text-text-muted'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="px-5 pb-6">
        <h3 className="text-sm font-bold text-text-dark mb-3">Historia ya Safari</h3>
        {MOCK_HISTORY.length === 0 ? (
          <EmptyState icon="💸" title="Bado hujafanya safari"
            subtitle="Omba Winga wako wa kwanza sasa!"
            action={<Link href="/book"><button className="btn-primary w-40">Omba Winga →</button></Link>} />
        ) : (
          <div className="space-y-3">
            {MOCK_HISTORY.map(h => (
              <div key={h.id} className="card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-2xl flex items-center justify-center">
                    <TrendingDown size={18} className="text-danger" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-dark">{h.winga}</p>
                    <p className="text-xs text-text-muted">{new Date(h.date).toLocaleDateString('sw-TZ')}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-danger">
                  -TZS {h.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

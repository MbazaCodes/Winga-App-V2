'use client'
import { useState } from 'react'
import { TrendingUp, ArrowDownRight } from 'lucide-react'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'

type Period = 'today' | 'week' | 'month' | 'all'

const MOCK_TRIPS = [
  { id:'1', customer:'Sarah Kimani', date:'2026-07-12', gross:5000, net:4250, tip:0 },
  { id:'2', customer:'Ali Hassan',   date:'2026-07-10', gross:15000, net:12750, tip:500 },
]

const PERIODS: { key: Period; label: string }[] = [
  { key:'today', label:'Leo' },
  { key:'week',  label:'Wiki' },
  { key:'month', label:'Mwezi' },
  { key:'all',   label:'Yote' },
]

export default function WingaEarningsPage() {
  const [period, setPeriod] = useState<Period>('month')

  const gross = MOCK_TRIPS.reduce((s,t) => s + t.gross, 0)
  const net   = MOCK_TRIPS.reduce((s,t) => s + t.net, 0)
  const tips  = MOCK_TRIPS.reduce((s,t) => s + t.tip, 0)
  const tax   = Math.round(gross * 0.03)
  const fee   = Math.round(gross * 0.12)

  return (
    <div className="bg-white">
      <PageHeader title="Mapato Yangu" />

      {/* Summary */}
      <div className="px-5 mb-5">
        <div className="bg-primary rounded-3xl p-5 mb-3">
          <p className="text-xs font-bold text-white/70 mb-1">Jumla ya Mapato (Gross)</p>
          <p className="text-3xl font-extrabold text-white">TZS {gross.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-2">
            <TrendingUp size={14} className="text-white/70" />
            <span className="text-xs text-white/70">{MOCK_TRIPS.length} safari</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="card p-3 text-center">
            <p className="text-[10px] text-text-muted mb-1">Kipato 85%</p>
            <p className="text-base font-extrabold text-green-600">
              TZS {net.toLocaleString()}
            </p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-[10px] text-text-muted mb-1">Tips</p>
            <p className="text-base font-extrabold text-gold">
              TZS {tips.toLocaleString()}
            </p>
          </div>
          <div className="card p-3 text-center">
            <p className="text-[10px] text-text-muted mb-1">TRA 3%</p>
            <p className="text-base font-extrabold text-danger">
              TZS {tax.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mx-5 mb-5 card p-4">
        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">
          Mgawanyo wa Mapato
        </p>
        {[
          { label:'Gross (Jumla)',    value:gross, color:'text-text-dark' },
          { label:'Ada ya App 12%',  value:-fee,  color:'text-danger' },
          { label:'Kodi TRA 3%',     value:-tax,  color:'text-danger' },
          { label:'Kipato Chako 85%',value:net,   color:'text-green-600 font-extrabold' },
        ].map(row => (
          <div key={row.label}
            className={`flex justify-between py-2 ${row.label.includes('85%') ? 'border-t border-card-border mt-1 pt-3' : ''}`}>
            <span className="text-sm text-text-muted">{row.label}</span>
            <span className={`text-sm font-bold ${row.color}`}>
              TZS {Math.abs(row.value).toLocaleString()}
            </span>
          </div>
        ))}
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
        {MOCK_TRIPS.length === 0 ? (
          <EmptyState icon="💰" title="Bado hujapata mapato"
            subtitle="Kubali maombi na uanze kupata pesa!" />
        ) : (
          <div className="space-y-3">
            {MOCK_TRIPS.map(t => (
              <div key={t.id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-2xl flex items-center justify-center">
                      <TrendingUp size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-dark">{t.customer}</p>
                      <p className="text-xs text-text-muted">
                        {new Date(t.date).toLocaleDateString('sw-TZ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-green-600">
                      +TZS {t.net.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-text-muted">
                      Gross: {t.gross.toLocaleString()}
                    </p>
                  </div>
                </div>
                {t.tip > 0 && (
                  <div className="flex items-center justify-between px-3 py-2 bg-yellow-50 rounded-xl">
                    <span className="text-xs font-semibold text-yellow-700">⭐ Tip iliyopokelewa</span>
                    <span className="text-xs font-bold text-yellow-700">+TZS {t.tip.toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

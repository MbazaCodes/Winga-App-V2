'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { TrendingUp, TrendingDown } from 'lucide-react'

const TRANSACTIONS = [
  { id:'t1', winga:'Amina Hassan', customer:'Sarah Kimani',  amount:5000,  net:4250,  fee:600,  tax:150,  date:'2026-07-13', status:'completed' },
  { id:'t2', winga:'John Mwangi',  customer:'Ali Hassan',    amount:15000, net:12750, fee:1800, tax:450,  date:'2026-07-13', status:'completed' },
  { id:'t3', winga:'Amina Hassan', customer:'Amina Rashid',  amount:25000, net:21250, fee:3000, tax:750,  date:'2026-07-12', status:'completed' },
  { id:'t4', winga:'Fatuma Said',  customer:'Grace Nyale',   amount:5000,  net:4250,  fee:600,  tax:150,  date:'2026-07-12', status:'completed' },
]

const gross   = TRANSACTIONS.reduce((s,t) => s + t.amount, 0)
const netAll  = TRANSACTIONS.reduce((s,t) => s + t.net,    0)
const feeAll  = TRANSACTIONS.reduce((s,t) => s + t.fee,    0)
const taxAll  = TRANSACTIONS.reduce((s,t) => s + t.tax,    0)

const TOP_WINGAS = [
  { name:'Amina Hassan', badge:'✅', trips:2, gross:30000, net:25500 },
  { name:'John Mwangi',  badge:'🔵', trips:1, gross:15000, net:12750 },
  { name:'Fatuma Said',  badge:'⭐', trips:1, gross:5000,  net:4250  },
]

export default function EarningsPage() {
  const [period, setPeriod] = useState('month')

  return (
    <AdminLayout title="Mapato na Malipo">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Jumla Mapato (Gross)', value:`TZS ${gross.toLocaleString()}`,    icon:TrendingUp,   color:'bg-primary text-white' },
          { label:'Winga Walipata 85%',  value:`TZS ${netAll.toLocaleString()}`,   icon:TrendingUp,   color:'bg-green-50 text-green-700' },
          { label:'Ada ya App 12%',      value:`TZS ${feeAll.toLocaleString()}`,   icon:TrendingDown, color:'bg-blue-50 text-blue-600' },
          { label:'Kodi TRA 3%',         value:`TZS ${taxAll.toLocaleString()}`,   icon:TrendingDown, color:'bg-yellow-50 text-yellow-700' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.color === 'bg-primary text-white' ? 'bg-primary text-white' : ''}`}>
            <p className={`text-xs font-bold mb-2 ${s.color === 'bg-primary text-white' ? 'text-white/70' : 'text-text-muted'}`}>{s.label}</p>
            <p className={`text-xl font-extrabold ${s.color === 'bg-primary text-white' ? 'text-white' : s.color.split(' ')[1]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Period filter */}
      <div className="flex gap-2 mb-5">
        {[['today','Leo'],['week','Wiki'],['month','Mwezi'],['all','Yote']].map(([k,v]) => (
          <button key={k} onClick={() => setPeriod(k)}
            className={`px-4 h-9 rounded-xl text-xs font-bold transition-all
              ${period === k ? 'bg-primary text-white' : 'bg-white border border-card-border text-text-muted'}`}>
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Transactions table */}
        <div className="col-span-2 card p-5">
          <h2 className="font-bold text-text-dark mb-4">Historia ya Malipo</h2>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-card-border">
                {['Winga','Mteja','Jumla','Ada 12%','TRA 3%','Kipato 85%','Tarehe'].map(h => (
                  <th key={h} className="pb-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {TRANSACTIONS.map(t => (
                <tr key={t.id} className="text-sm hover:bg-[#F8F9FC]">
                  <td className="py-3 font-semibold text-text-dark">{t.winga}</td>
                  <td className="py-3 text-text-muted text-xs">{t.customer}</td>
                  <td className="py-3 font-bold text-text-dark">TZS {t.amount.toLocaleString()}</td>
                  <td className="py-3 text-danger text-xs">-{t.fee.toLocaleString()}</td>
                  <td className="py-3 text-warning text-xs">-{t.tax.toLocaleString()}</td>
                  <td className="py-3 font-bold text-green-600">TZS {t.net.toLocaleString()}</td>
                  <td className="py-3 text-text-muted text-xs">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Wingas */}
        <div className="card p-5">
          <h2 className="font-bold text-text-dark mb-4">🏆 Wingas Bora</h2>
          <div className="space-y-4">
            {TOP_WINGAS.map((w, i) => (
              <div key={w.name} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-soft rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-xs font-extrabold text-primary">{i+1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text-dark truncate">{w.name} {w.badge}</p>
                  <p className="text-[10px] text-text-muted">{w.trips} safari</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-green-600">TZS {w.net.toLocaleString()}</p>
                  <p className="text-[10px] text-text-muted">net</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-card-border">
            <p className="text-xs font-bold text-text-muted mb-3">MGAWANYO</p>
            {[
              { label:'Winga (85%)',  pct:85, color:'bg-primary' },
              { label:'App (12%)',   pct:12, color:'bg-blue-400' },
              { label:'TRA (3%)',    pct:3,  color:'bg-yellow-400' },
            ].map(r => (
              <div key={r.label} className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${r.color} shrink-0`} />
                <span className="text-xs text-text-muted flex-1">{r.label}</span>
                <div className="w-20 h-1.5 bg-input-bg rounded-full overflow-hidden">
                  <div className={`h-full ${r.color} rounded-full`} style={{width:`${r.pct}%`}} />
                </div>
                <span className="text-xs font-bold text-text-dark">{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

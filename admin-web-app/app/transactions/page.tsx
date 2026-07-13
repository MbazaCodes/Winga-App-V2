'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Search } from 'lucide-react'

const TXN = [
  { id:'txn-001', winga:'Amina Hassan', customer:'Sarah Kimani',  amount:5000,  status:'success',  date:'2026-07-13 10:32', method:'OTP' },
  { id:'txn-002', winga:'John Mwangi',  customer:'Ali Hassan',    amount:15000, status:'success',  date:'2026-07-13 09:15', method:'OTP' },
  { id:'txn-003', winga:'Fatuma Said',  customer:'Grace Nyale',   amount:5000,  status:'pending',  date:'2026-07-13 08:00', method:'M-Pesa' },
  { id:'txn-004', winga:'Amina Hassan', customer:'Amina Rashid',  amount:25000, status:'success',  date:'2026-07-12 15:22', method:'OTP' },
  { id:'txn-005', winga:'John Mwangi',  customer:'John Doe',      amount:5000,  status:'failed',   date:'2026-07-12 12:00', method:'Airtel' },
]

const total   = TXN.reduce((s,t) => s + t.amount, 0)
const success = TXN.filter(t => t.status === 'success').reduce((s,t) => s + t.amount, 0)
const failed  = TXN.filter(t => t.status === 'failed').length
const pending = TXN.filter(t => t.status === 'pending').length

export default function TransactionsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = TXN.filter(t =>
    (status === 'all' || t.status === status) &&
    (!search || t.customer.toLowerCase().includes(search.toLowerCase()) || t.winga.toLowerCase().includes(search.toLowerCase())))

  return (
    <AdminLayout title="Malipo">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Jumla (TZS)',   value:`TZS ${total.toLocaleString()}`,   color:'bg-primary text-white' },
          { label:'Zilizofanikiwa',value:`TZS ${success.toLocaleString()}`, color:'bg-green-50 text-green-700' },
          { label:'Zinasubiri',    value:pending.toString(),                 color:'bg-yellow-50 text-yellow-700' },
          { label:'Zilizoshindwa', value:failed.toString(),                  color:'bg-red-50 text-danger' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.color.startsWith('bg-primary') ? 'bg-primary' : ''}`}>
            <p className={`text-xs font-bold mb-2 ${s.color.startsWith('bg-primary') ? 'text-white/70' : 'text-text-muted'}`}>{s.label}</p>
            <p className={`text-xl font-extrabold ${s.color.startsWith('bg-primary') ? 'text-white' : s.color.split(' ')[1]}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-card-border rounded-xl px-3 h-10 flex-1 max-w-sm">
          <Search size={15} className="text-text-muted" />
          <input placeholder="Tafuta..." value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent outline-none text-sm flex-1" />
        </div>
        {[['all','Zote'],['success','Zilizofanikiwa'],['pending','Zinasubiri'],['failed','Zilizoshindwa']].map(([k,v]) => (
          <button key={k} onClick={() => setStatus(k)}
            className={`px-3 h-10 rounded-xl text-xs font-bold transition-all
              ${status === k ? 'bg-primary text-white' : 'bg-white border border-card-border text-text-muted'}`}>{v}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F8F9FC] border-b border-card-border">
            <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {['ID','Winga','Mteja','Kiasi','Njia','Hali','Tarehe/Saa'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-[#F8F9FC]">
                <td className="px-4 py-3 font-mono text-xs text-text-muted">{t.id}</td>
                <td className="px-4 py-3 text-sm font-semibold text-text-dark">{t.winga}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{t.customer}</td>
                <td className="px-4 py-3 text-sm font-bold text-text-dark">TZS {t.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-text-muted">{t.method}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${t.status === 'success' ? 'badge-completed' : t.status === 'pending' ? 'badge-searching' : 'badge-cancelled'}`}>
                    {t.status === 'success' ? '✅ Imefanikiwa' : t.status === 'pending' ? '⏳ Inasubiri' : '❌ Imeshindwa'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-text-muted">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}
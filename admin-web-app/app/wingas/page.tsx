'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Search, Filter } from 'lucide-react'

const WINGAS = [
  { id:'W1', name:'Amina Hassan', phone:'0712345678', city:'Dar es Salaam', badge:'verified', rating:4.9, trips:128, completion:95, online:true,  nida:'19XXXX' },
  { id:'W2', name:'John Mwangi',  phone:'0756789012', city:'Mwanza',        badge:'mid',      rating:4.7, trips:54,  completion:82, online:true,  nida:'19YYYY' },
  { id:'W3', name:'Fatuma Said',  phone:'0698765432', city:'Arusha',        badge:'starter',  rating:4.5, trips:12,  completion:65, online:false, nida:'19ZZZZ' },
]

export default function WingasPage() {
  const [search, setSearch] = useState('')
  const [badge, setBadge]   = useState('all')

  const filtered = WINGAS.filter(w =>
    (badge === 'all' || w.badge === badge) &&
    (!search || w.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <AdminLayout title="Wingas">
      {/* Controls */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-card-border rounded-xl px-3 h-10 flex-1 max-w-xs">
          <Search size={15} className="text-text-muted" />
          <input placeholder="Tafuta Winga..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1" />
        </div>
        {['all','starter','mid','verified'].map(b => (
          <button key={b} onClick={() => setBadge(b)}
            className={`px-4 h-10 rounded-xl text-xs font-bold transition-all
              ${badge === b ? 'bg-primary text-white' : 'bg-white border border-card-border text-text-muted'}`}>
            {b === 'all' ? 'Wote' : b === 'starter' ? '⭐ Starter' : b === 'mid' ? '🔵 Mid' : '✅ Verified'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F8F9FC] border-b border-card-border">
            <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {['Jina','Simu','Mji','Badge','Alama','Safari','Ukamilifu','Hali','Vitendo'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filtered.map(w => (
              <tr key={w.id} className="hover:bg-[#F8F9FC] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-soft rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{w.name[0]}</span>
                    </div>
                    <span className="text-sm font-semibold text-text-dark">{w.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">{w.phone}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{w.city}</td>
                <td className="px-4 py-3"><span className={`badge badge-${w.badge}`}>{w.badge}</span></td>
                <td className="px-4 py-3 text-sm font-bold text-text-dark">⭐ {w.rating}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{w.trips}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-input-bg rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${w.completion>=75?'bg-green-500':'bg-warning'}`}
                        style={{width:`${w.completion}%`}} />
                    </div>
                    <span className="text-xs font-bold text-text-muted">{w.completion}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className={`w-2 h-2 rounded-full ${w.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="px-2 py-1 text-[10px] font-bold text-primary bg-primary-soft rounded-lg">
                      Angalia
                    </button>
                    <button className="px-2 py-1 text-[10px] font-bold text-danger bg-red-50 rounded-lg">
                      Simamisha
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

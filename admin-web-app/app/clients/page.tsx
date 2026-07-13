'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Search, Ban, Eye } from 'lucide-react'

const CLIENTS = [
  { id:'c1', name:'Sarah Kimani',  phone:'0712345678', joined:'2026-07-01', spent:20000, trips:2, status:'active' },
  { id:'c2', name:'Ali Hassan',    phone:'0756789012', joined:'2026-06-20', spent:15000, trips:1, status:'active' },
  { id:'c3', name:'Grace Nyale',   phone:'0698765432', joined:'2026-07-10', spent:0,     trips:0, status:'active' },
  { id:'c4', name:'John Doe',      phone:'0745678901', joined:'2026-05-15', spent:45000, trips:5, status:'banned' },
  { id:'c5', name:'Amina Rashid',  phone:'0789012345', joined:'2026-07-12', spent:5000,  trips:1, status:'active' },
]

const STATS = [
  { label:'Wateja Wote',       value: CLIENTS.length.toString(),                               color:'bg-blue-50 text-blue-600' },
  { label:'Wapya Wiki Hii',    value:'3',                                                       color:'bg-green-50 text-green-600' },
  { label:'Wanaofanya Kazi',   value: CLIENTS.filter(c=>c.status==='active').length.toString(), color:'bg-purple-50 text-primary' },
  { label:'Waliozuiwa',        value: CLIENTS.filter(c=>c.status==='banned').length.toString(), color:'bg-red-50 text-danger' },
]

export default function ClientsPage() {
  const [search, setSearch]   = useState('')
  const [tab, setTab]         = useState('all')
  const [clients, setClients] = useState(CLIENTS)

  const filtered = clients.filter(c => {
    const matchTab = tab === 'all' || c.status === tab
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
    return matchTab && matchSearch
  })

  const toggleBan = (id: string) =>
    setClients(cs => cs.map(c => c.id === id
      ? { ...c, status: c.status === 'banned' ? 'active' : 'banned' }
      : c))

  return (
    <AdminLayout title="Wateja">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STATS.map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs font-bold text-text-muted mb-2">{s.label}</p>
            <p className={`text-2xl font-extrabold px-2 py-0.5 rounded-lg inline-block ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-white border border-card-border rounded-xl px-3 h-10 flex-1 max-w-sm">
          <Search size={15} className="text-text-muted" />
          <input placeholder="Tafuta kwa jina au simu..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1" />
        </div>
        {['all','active','banned'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 h-10 rounded-xl text-xs font-bold transition-all
              ${tab === t ? 'bg-primary text-white' : 'bg-white border border-card-border text-text-muted'}`}>
            {t === 'all' ? 'Wote' : t === 'active' ? '✅ Wanaofanya Kazi' : '🚫 Waliozuiwa'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F8F9FC] border-b border-card-border">
            <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {['Jina','Simu','Tarehe ya Kujisajili','Safari','Jumla Aliyolipa','Hali','Vitendo'].map(h => (
                <th key={h} className="px-4 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-[#F8F9FC] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-soft rounded-xl flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{c.name[0]}</span>
                    </div>
                    <span className="text-sm font-semibold text-text-dark">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">{c.phone}</td>
                <td className="px-4 py-3 text-sm text-text-muted">{c.joined}</td>
                <td className="px-4 py-3 text-sm font-bold text-text-dark">{c.trips}</td>
                <td className="px-4 py-3 text-sm font-bold text-text-dark">
                  TZS {c.spent.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${c.status === 'active' ? 'badge-completed' : 'badge-cancelled'}`}>
                    {c.status === 'active' ? '✅ Anafanya kazi' : '🚫 Amezuiwa'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-primary bg-primary-soft rounded-lg">
                      <Eye size={11} /> Angalia
                    </button>
                    <button onClick={() => toggleBan(c.id)}
                      className={`flex items-center gap-1 px-2 py-1 text-[10px] font-bold rounded-lg
                        ${c.status === 'active' ? 'text-danger bg-red-50' : 'text-green-700 bg-green-50'}`}>
                      <Ban size={11} /> {c.status === 'active' ? 'Zuia' : 'Acha'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">Hakuna wateja wanaolingana na utafutaji huu</div>
        )}
      </div>
    </AdminLayout>
  )
}

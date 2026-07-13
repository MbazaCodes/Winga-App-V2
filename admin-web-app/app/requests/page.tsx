'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Search, Eye } from 'lucide-react'

const REQUESTS = [
  { id:'#1248', customer:'Sarah Kimani',  phone:'0712345678', winga:'Amina Hassan', category:'Vyakula 🛒', service:'Saa 1',      area:'Kariakoo', status:'completed', amount:5000,  date:'2026-07-13' },
  { id:'#1247', customer:'Ali Hassan',    phone:'0756789012', winga:'John Mwangi',  category:'Mavazi 👗',  service:'Nusu Siku', area:'Mwenge',   status:'shopping',  amount:15000, date:'2026-07-13' },
  { id:'#1246', customer:'Grace Nyale',   phone:'0698765432', winga:null,           category:'Dawa 💊',    service:'Saa 1',     area:'Ilala',    status:'searching', amount:5000,  date:'2026-07-13' },
  { id:'#1245', customer:'Amina Rashid',  phone:'0789012345', winga:'Amina Hassan', category:'Samani 🛋️', service:'Siku Nzima',area:'Mikocheni',status:'completed', amount:25000, date:'2026-07-12' },
  { id:'#1244', customer:'John Doe',      phone:'0745678901', winga:'Fatuma Said',  category:'Simu 📱',   service:'Saa 1',     area:'Kariakoo', status:'cancelled', amount:5000,  date:'2026-07-12' },
]

export default function RequestsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = REQUESTS.filter(r =>
    (status === 'all' || r.status === status) &&
    (!search || r.customer.toLowerCase().includes(search.toLowerCase()) || r.id.includes(search))
  )

  const total = REQUESTS.reduce((s,r) => s + r.amount, 0)

  return (
    <AdminLayout title="Maombi Yote">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Maombi Yote',      value: REQUESTS.length.toString(),                                  color:'bg-blue-50 text-blue-600' },
          { label:'Yanayoendelea',    value: REQUESTS.filter(r=>['searching','accepted','shopping'].includes(r.status)).length.toString(), color:'bg-yellow-50 text-yellow-700' },
          { label:'Zilizokamilika',   value: REQUESTS.filter(r=>r.status==='completed').length.toString(), color:'bg-green-50 text-green-700' },
          { label:'Mapato (TZS)',     value: total.toLocaleString(),                                      color:'bg-purple-50 text-primary' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs font-bold text-text-muted mb-2">{s.label}</p>
            <p className={`text-xl font-extrabold px-2 py-0.5 rounded-lg inline-block ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-card-border rounded-xl px-3 h-10 flex-1 max-w-sm">
          <Search size={15} className="text-text-muted" />
          <input placeholder="Tafuta kwa jina au ID..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm flex-1" />
        </div>
        {[['all','Yote'],['searching','Inatafuta'],['accepted','Imekubaliwa'],['shopping','Inanunua'],['completed','Zilizokamilika'],['cancelled','Zilizohairishwa']].map(([k,v]) => (
          <button key={k} onClick={() => setStatus(k)}
            className={`px-3 h-10 rounded-xl text-xs font-bold transition-all whitespace-nowrap
              ${status === k ? 'bg-primary text-white' : 'bg-white border border-card-border text-text-muted'}`}>
            {v}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F8F9FC] border-b border-card-border">
            <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
              {['ID','Mteja','Simu','Winga','Aina','Huduma','Eneo','Hali','Bei','Tarehe','Vitendo'].map(h => (
                <th key={h} className="px-3 py-3 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-card-border">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-[#F8F9FC] transition-colors">
                <td className="px-3 py-3 font-mono text-xs text-text-muted">{r.id}</td>
                <td className="px-3 py-3 text-sm font-semibold text-text-dark">{r.customer}</td>
                <td className="px-3 py-3 text-xs text-text-muted">{r.phone}</td>
                <td className="px-3 py-3 text-sm text-text-muted">{r.winga ?? <span className="text-warning">—</span>}</td>
                <td className="px-3 py-3 text-xs text-text-muted">{r.category}</td>
                <td className="px-3 py-3 text-xs text-text-muted">{r.service}</td>
                <td className="px-3 py-3 text-xs text-text-muted">{r.area}</td>
                <td className="px-3 py-3"><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                <td className="px-3 py-3 text-sm font-bold text-text-dark">TZS {r.amount.toLocaleString()}</td>
                <td className="px-3 py-3 text-xs text-text-muted">{r.date}</td>
                <td className="px-3 py-3">
                  <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-primary bg-primary-soft rounded-lg">
                    <Eye size={11} /> Angalia
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">Hakuna maombi yanayolingana</div>
        )}
      </div>
    </AdminLayout>
  )
}

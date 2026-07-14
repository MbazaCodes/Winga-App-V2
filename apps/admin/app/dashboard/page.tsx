import AdminLayout from '@/components/admin/AdminLayout'
import { Users, UserCheck, ClipboardList, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react'

const STATS = [
  { label:'Maombi Yote',    value:'1,248', change:'+12%', up:true,  icon:ClipboardList, color:'bg-blue-50 text-blue-600' },
  { label:'Yaliyokamilika', value:'1,089', change:'+8%',  up:true,  icon:UserCheck,     color:'bg-green-50 text-green-600' },
  { label:'Yanayoendelea',  value:'23',    change:'-3%',  up:false, icon:ClipboardList, color:'bg-yellow-50 text-yellow-600' },
  { label:'Mapato (TZS)',   value:'28.4M', change:'+18%', up:true,  icon:TrendingUp,    color:'bg-purple-50 text-primary' },
]

const RECENT = [
  { id:'#1248', customer:'Sarah Kimani', winga:'Amina Hassan', category:'Vyakula', status:'completed', amount:'TZS 5,000' },
  { id:'#1247', customer:'Ali Hassan',   winga:'John Mwangi',  category:'Mavazi',  status:'shopping',  amount:'TZS 15,000' },
  { id:'#1246', customer:'Grace Nyale',  winga:null,           category:'Dawa',    status:'searching', amount:'TZS 5,000' },
]

export default function DashboardPage() {
  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {STATS.map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-text-muted">{s.label}</p>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon size={17} />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-text-dark">{s.value}</p>
            <div className={`flex items-center gap-1 text-xs font-bold ${s.up ? 'text-green-600' : 'text-danger'}`}>
              {s.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />} {s.change} wiki hii
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Recent requests */}
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-text-dark">Maombi ya Hivi Karibuni</h2>
            <a href="/requests" className="text-xs font-bold text-primary">Ona Yote →</a>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-card-border">
                <th className="pb-3 text-left">ID</th>
                <th className="pb-3 text-left">Mteja</th>
                <th className="pb-3 text-left">Winga</th>
                <th className="pb-3 text-left">Aina</th>
                <th className="pb-3 text-left">Hali</th>
                <th className="pb-3 text-right">Bei</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {RECENT.map(r => (
                <tr key={r.id} className="text-sm">
                  <td className="py-3 font-mono text-xs text-text-muted">{r.id}</td>
                  <td className="py-3 font-semibold text-text-dark">{r.customer}</td>
                  <td className="py-3 text-text-muted">{r.winga ?? '—'}</td>
                  <td className="py-3 text-text-muted">{r.category}</td>
                  <td className="py-3"><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                  <td className="py-3 text-right font-bold text-text-dark">{r.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="card p-5">
            <h2 className="font-bold text-text-dark mb-4">Mgawanyo wa Mapato</h2>
            {[
              { label:'Winga (85%)',    value:'TZS 24.1M', color:'bg-primary' },
              { label:'App Fee (12%)', value:'TZS 3.4M',  color:'bg-blue-400' },
              { label:'TRA 3%',        value:'TZS 852K',  color:'bg-yellow-400' },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${r.color}`} />
                  <span className="text-xs text-text-muted">{r.label}</span>
                </div>
                <span className="text-xs font-bold text-text-dark">{r.value}</span>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <h2 className="font-bold text-text-dark mb-3">Wingas Bora</h2>
            {['Amina Hassan','John Mwangi','Fatuma Said'].map((w,i) => (
              <div key={w} className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-primary-soft rounded-xl flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{i+1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-text-dark">{w}</p>
                  <p className="text-[10px] text-text-muted">✅ Verified</p>
                </div>
                <span className="text-xs font-bold text-primary">⭐ 4.{9-i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

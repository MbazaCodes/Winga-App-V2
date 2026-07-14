import AdminLayout from '@/components/admin/AdminLayout'
import { Download, FileText, FileSpreadsheet } from 'lucide-react'

const REPORTS = [
  { name:'Ripoti ya Mapato ya Mwezi',      type:'PDF',  size:'245 KB', date:'2026-07-01', icon:'📊' },
  { name:'Utendaji wa Wingas',             type:'PDF',  size:'180 KB', date:'2026-07-01', icon:'👥' },
  { name:'Kuzingatia Kodi TRA',            type:'PDF',  size:'92 KB',  date:'2026-07-01', icon:'🏛️' },
  { name:'Muhtasari wa Maombi',            type:'XLSX', size:'340 KB', date:'2026-07-01', icon:'📋' },
  { name:'Ripoti ya Shughuli za Wateja',   type:'PDF',  size:'210 KB', date:'2026-07-01', icon:'👤' },
  { name:'Rekodi ya Miamala',              type:'XLSX', size:'520 KB', date:'2026-07-01', icon:'💳' },
]

const METRICS = [
  { label:'Maombi Yote',  value:'1,248', change:'+12%', up:true  },
  { label:'Mapato (TZS)', value:'345K',  change:'+18%', up:true  },
  { label:'Wingas Wapya', value:'14',    change:'+5%',  up:true  },
  { label:'Wateja Wapya', value:'89',    change:'+23%', up:true  },
]

export default function ReportsPage() {
  return (
    <AdminLayout title="Ripoti">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {METRICS.map(m => (
          <div key={m.label} className="card p-4">
            <p className="text-xs font-bold text-text-muted mb-2">{m.label}</p>
            <p className="text-2xl font-extrabold text-text-dark">{m.value}</p>
            <p className={`text-xs font-bold mt-1 ${m.up ? 'text-green-600' : 'text-danger'}`}>
              {m.up ? '↑' : '↓'} {m.change} mwezi huu
            </p>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-text-dark">Faili za Kupakua</h2>
          <div className="flex gap-2">
            {['Mwezi Huu','Miezi 3','Mwaka'].map(p => (
              <button key={p} className="px-3 h-8 rounded-xl text-xs font-bold bg-input-bg text-text-muted hover:bg-primary-soft hover:text-primary transition-all">{p}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {REPORTS.map(r => (
            <div key={r.name} className="flex items-center justify-between p-4 bg-[#F8F9FC] rounded-2xl hover:bg-primary-soft transition-colors group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-text-dark">{r.name}</p>
                  <p className="text-xs text-text-muted">{r.type} · {r.size} · {r.date}</p>
                </div>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-card-border text-xs font-bold text-primary rounded-xl
                                 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all active:scale-95">
                <Download size={12} /> Pakua
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
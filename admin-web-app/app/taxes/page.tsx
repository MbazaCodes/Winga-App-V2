import AdminLayout from '@/components/admin/AdminLayout'
import { FileText, Download } from 'lucide-react'

const MONTHLY = [
  { month:'Julai 2026',     gross:50000,  tax:1500,  status:'pending' },
  { month:'Juni 2026',      gross:120000, tax:3600,  status:'filed'   },
  { month:'Mei 2026',       gross:95000,  tax:2850,  status:'filed'   },
  { month:'Aprili 2026',    gross:80000,  tax:2400,  status:'filed'   },
]

const totalTax   = MONTHLY.reduce((s,m) => s + m.tax, 0)
const totalGross = MONTHLY.reduce((s,m) => s + m.gross, 0)

export default function TaxesPage() {
  return (
    <AdminLayout title="Kodi TRA">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Kodi Iliyokusanywa', value:`TZS ${totalTax.toLocaleString()}`,  color:'text-danger' },
          { label:'Jumla Mapato',       value:`TZS ${totalGross.toLocaleString()}`, color:'text-primary' },
          { label:'Kiwango Halisi',     value:'3.0%',                               color:'text-text-dark' },
          { label:'TRA Filing Pending', value: MONTHLY.filter(m=>m.status==='pending').length.toString() + ' miezi', color:'text-warning' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs font-bold text-text-muted mb-2">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-text-dark">Muhtasari wa Kodi kwa Mwezi</h2>
            <button className="flex items-center gap-2 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl active:scale-95">
              <Download size={13} /> Export PDF
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-card-border">
                {['Mwezi','Mapato Gross','Kodi 3%','Hali ya TRA'].map(h => <th key={h} className="pb-3 text-left">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border">
              {MONTHLY.map(m => (
                <tr key={m.month} className="hover:bg-[#F8F9FC]">
                  <td className="py-3 font-semibold text-text-dark text-sm">{m.month}</td>
                  <td className="py-3 text-sm text-text-muted">TZS {m.gross.toLocaleString()}</td>
                  <td className="py-3 text-sm font-bold text-danger">TZS {m.tax.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`badge ${m.status === 'filed' ? 'badge-completed' : 'badge-searching'}`}>
                      {m.status === 'filed' ? '✅ Imewasilishwa' : '⏳ Inasubiri'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-text-dark mb-4">📋 TRA Compliance</h2>
          <div className="space-y-3">
            {[
              { label:'Mwezi wa Sasa',    value:'⏳ Inasubiri',     ok:false },
              { label:'Miezi Iliyopita',  value:'✅ Imefanywa',     ok:true  },
              { label:'Kiwango cha Kodi', value:'3% (TRA Default)', ok:true  },
              { label:'Mbinu ya Malipo',  value:'Wakati wa Kutoa',  ok:true  },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between py-2 border-b border-card-border last:border-0">
                <span className="text-xs text-text-muted">{r.label}</span>
                <span className={`text-xs font-bold ${r.ok ? 'text-green-600' : 'text-warning'}`}>{r.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
            <p className="text-xs font-bold text-green-700">✅ Mfumo wa kodi unafanya kazi vizuri</p>
            <p className="text-[10px] text-green-600 mt-1">3% inakusanywa kiotomatiki kwa kila safari</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
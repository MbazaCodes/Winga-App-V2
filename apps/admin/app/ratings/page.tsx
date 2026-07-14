import AdminLayout from '@/components/admin/AdminLayout'
import { Star } from 'lucide-react'

const REVIEWS = [
  { id:'r1', customer:'Sarah Kimani',  winga:'Amina Hassan', rating:5, comment:'Huduma nzuri sana! Haraka na ya kuaminika.', date:'2026-07-13' },
  { id:'r2', customer:'Ali Hassan',    winga:'John Mwangi',  rating:4, comment:'Alifika kwa wakati. Asante.',                date:'2026-07-12' },
  { id:'r3', customer:'Amina Rashid',  winga:'Amina Hassan', rating:5, comment:'Best Winga! Atamrudi tena.',                 date:'2026-07-12' },
  { id:'r4', customer:'Grace Nyale',   winga:'Fatuma Said',  rating:3, comment:'Alichelewa kidogo lakini alimaliza kazi.',   date:'2026-07-11' },
]

const avg = (REVIEWS.reduce((s,r) => s + r.rating, 0) / REVIEWS.length).toFixed(1)
const dist = [5,4,3,2,1].map(n => ({ n, count: REVIEWS.filter(r => r.rating === n).length }))

export default function RatingsPage() {
  return (
    <AdminLayout title="Tathmini">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Alama ya Wastani', value:`${avg} ⭐`,                      color:'text-gold' },
          { label:'Tathmini Zote',    value: REVIEWS.length.toString(),         color:'text-primary' },
          { label:'Alama 5 ⭐',       value: REVIEWS.filter(r=>r.rating===5).length.toString(), color:'text-green-600' },
          { label:'Kiwango cha Majibu',value:'94%',                            color:'text-text-dark' },
        ].map(s => (
          <div key={s.label} className="card p-4">
            <p className="text-xs font-bold text-text-muted mb-2">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 card p-5">
          <h2 className="font-bold text-text-dark mb-4">Tathmini za Hivi Karibuni</h2>
          <div className="space-y-4">
            {REVIEWS.map(r => (
              <div key={r.id} className="p-4 bg-[#F8F9FC] rounded-2xl">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-text-dark">{r.customer}</p>
                    <p className="text-xs text-text-muted">kwa → {r.winga}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={14} className={n <= r.rating ? 'text-gold fill-gold' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-text-muted italic">"{r.comment}"</p>
                <p className="text-[10px] text-text-muted mt-2">{r.date}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-bold text-text-dark mb-4">Mgawanyo wa Alama</h2>
          <div className="space-y-3">
            {dist.map(d => (
              <div key={d.n} className="flex items-center gap-3">
                <span className="text-xs font-bold text-text-dark w-8">{d.n} ⭐</span>
                <div className="flex-1 h-2 bg-input-bg rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full transition-all"
                    style={{width: REVIEWS.length ? `${(d.count/REVIEWS.length)*100}%` : '0%'}} />
                </div>
                <span className="text-xs text-text-muted w-4">{d.count}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 p-3 bg-primary-soft rounded-xl text-center">
            <p className="text-2xl font-extrabold text-primary">{avg}</p>
            <div className="flex justify-center gap-0.5 mt-1">
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={16} className={n <= Math.round(Number(avg)) ? 'text-gold fill-gold' : 'text-gray-200'} />
              ))}
            </div>
            <p className="text-xs text-text-muted mt-1">{REVIEWS.length} tathmini</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
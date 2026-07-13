'use client'
import { useState } from 'react'
import { Bell, Power, Star, MapPin, Clock, CheckCircle, ShoppingBag, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'
import type { RequestStatus } from '@/types/winga'

const STATUS_LABEL: Record<string, string> = {
  searching: 'Inatafuta',
  accepted:  'Imekubaliwa',
  shopping:  'Inanunua',
  completed: 'Imekamilika',
}

const STATUS_NEXT: Record<string, { label: string; status: RequestStatus; icon: any }> = {
  accepted: { label:'Ninaenda Kununua 🛒', status:'shopping',  icon: ShoppingBag },
  shopping: { label:'Imekamilika ✅',       status:'completed', icon: CheckCircle  },
}

// Mock incoming requests
const MOCK_AVAILABLE = [
  { id:'r1', customer:'Sarah Kimani', category:'Vyakula 🛒', service:'Saa 1',
    area:'Kariakoo', price:5000, notes:'Mchele na sukari kilo 2' },
  { id:'r2', customer:'Ali Hassan',   category:'Dawa 💊',    service:'Nusu Siku',
    area:'Mwenge',   price:15000, notes:null },
]

const MOCK_MY_REQUESTS = [
  { id:'r3', customer:'Fatuma Said', category:'Mavazi 👗', service:'Saa 1',
    area:'Ilala', price:5000, status:'accepted' as RequestStatus, phone:'0712345678' },
]

export default function WingaHomePage() {
  const { user } = useAuthStore()
  const [isOnline, setIsOnline]         = useState(false)
  const [available, setAvailable]       = useState(MOCK_AVAILABLE)
  const [myRequests, setMyRequests]     = useState(MOCK_MY_REQUESTS)

  const name  = user?.name ?? 'Winga'
  const today = new Date().toLocaleDateString('sw-TZ', { weekday:'long', day:'numeric', month:'long' })

  const toggleOnline = () => {
    setIsOnline(v => !v)
    toast.success(!isOnline ? '✅ Uko Mtandaoni — Maombi yatakuja!' : '⏸️ Umesimama — Hakuna maombi.')
  }

  const acceptRequest = (req: typeof MOCK_AVAILABLE[0]) => {
    setAvailable(a => a.filter(r => r.id !== req.id))
    setMyRequests(m => [...m, { ...req, status:'accepted' as RequestStatus, phone:'07XXXXXXXX' }])
    toast.success(`✅ Umekubali ombi la ${req.customer}!`)
  }

  const advanceStatus = (id: string, nextStatus: RequestStatus) => {
    setMyRequests(m => m.map(r => r.id === id ? { ...r, status: nextStatus } : r))
    if (nextStatus === 'completed') toast.success('🎉 Safari imekamilika!')
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className={`px-5 pt-12 pb-5 transition-colors duration-300 ${isOnline ? 'bg-primary' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className={`text-xs font-semibold ${isOnline ? 'text-white/70' : 'text-text-muted'}`}>
              {today}
            </p>
            <h1 className={`text-xl font-extrabold ${isOnline ? 'text-white' : 'text-text-dark'}`}>
              Habari, {name.split(' ')[0]}! {isOnline ? '🟢' : '⚫'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className={`w-10 h-10 rounded-2xl flex items-center justify-center
              ${isOnline ? 'bg-white/20' : 'bg-input-bg'}`}>
              <Bell size={18} className={isOnline ? 'text-white' : 'text-text-dark'} />
            </button>
            {/* Online toggle */}
            <button onClick={toggleOnline}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs
                transition-all duration-300 active:scale-90
                ${isOnline
                  ? 'bg-white text-primary shadow-card-md'
                  : 'bg-primary text-white shadow-card'}`}>
              <Power size={14} />
              {isOnline ? 'Mtandaoni' : 'Ingia'}
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className={`grid grid-cols-3 gap-2 mt-4 p-3 rounded-2xl
          ${isOnline ? 'bg-white/15' : 'bg-input-bg'}`}>
          {[
            { label:'Leo', value:'TZS 0' },
            { label:'Safari Zote', value:'1' },
            { label:'Alama %', value:'100%' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-base font-extrabold ${isOnline ? 'text-white' : 'text-text-dark'}`}>
                {s.value}
              </p>
              <p className={`text-[10px] font-semibold ${isOnline ? 'text-white/70' : 'text-text-muted'}`}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Offline warning */}
      {!isOnline && (
        <div className="mx-5 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-2xl
                        flex items-center gap-3">
          <AlertCircle size={18} className="text-yellow-600 shrink-0" />
          <p className="text-xs font-semibold text-yellow-700">
            Uko nje ya mtandao — Gonga <strong>Ingia</strong> ili kupokea maombi.
          </p>
        </div>
      )}

      {/* My active requests */}
      {myRequests.filter(r => r.status !== 'completed').length > 0 && (
        <div className="px-5 mt-5">
          <h2 className="text-sm font-bold text-text-dark mb-3">🔥 Maombi Yangu</h2>
          <div className="space-y-3">
            {myRequests.filter(r => r.status !== 'completed').map(req => (
              <div key={req.id} className="card p-4 border-l-4 border-primary">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-text-dark text-sm">{req.category}</p>
                    <p className="text-xs text-text-muted">{req.customer} · {req.area}</p>
                    <p className="text-xs text-text-muted mt-0.5">📞 {req.phone}</p>
                  </div>
                  <span className="text-sm font-extrabold text-primary">
                    TZS {req.price.toLocaleString()}
                  </span>
                </div>
                {STATUS_NEXT[req.status] && (
                  <button
                    onClick={() => advanceStatus(req.id, STATUS_NEXT[req.status].status)}
                    className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl
                               active:scale-95 transition-transform">
                    {STATUS_NEXT[req.status].label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available requests */}
      <div className="px-5 mt-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-text-dark">
            📋 Maombi Yanayopatikana
          </h2>
          <span className="text-xs text-text-muted">{available.length} maombi</span>
        </div>

        {!isOnline ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">💤</p>
            <p className="text-sm font-semibold text-text-muted">Ingia mtandaoni ili uone maombi</p>
          </div>
        ) : available.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-sm font-semibold text-text-muted">Umekabili maombi yote!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {available.map(req => (
              <div key={req.id} className="card p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-text-dark text-sm">{req.category}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <MapPin size={10} /> {req.area}
                      </span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Clock size={10} /> {req.service}
                      </span>
                    </div>
                    {req.notes && (
                      <p className="text-xs text-text-muted mt-1 italic">"{req.notes}"</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-base font-extrabold text-primary">
                      TZS {req.price.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-text-muted">{req.customer}</p>
                  </div>
                </div>
                <button onClick={() => acceptRequest(req)}
                  className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl
                             active:scale-95 transition-transform">
                  Kubali Ombi ✅
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="px-5 pb-8">
        <h2 className="text-sm font-bold text-text-dark mb-3">⚡ Shortcuts</h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label:'Mapato',   emoji:'💰', href:'/winga/earnings' },
            { label:'Maombi',   emoji:'📋', href:'/winga/requests' },
            { label:'Wasifu',   emoji:'👤', href:'/winga/profile'  },
            { label:'Alama',    emoji:'⭐', href:'/winga/profile'  },
          ].map(a => (
            <a key={a.label} href={a.href}
              className="flex flex-col items-center p-3 bg-input-bg rounded-2xl
                         active:scale-90 transition-transform">
              <span className="text-2xl mb-1">{a.emoji}</span>
              <span className="text-[10px] font-semibold text-text-mid">{a.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

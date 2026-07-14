'use client'
import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

const NOTIFICATIONS = [
  { id:'n1', type:'registration', title:'Winga Mpya Amesajiliwa', body:'John Mwenge amesajiliwa kama Winga kutoka Arusha.', time:'Dakika 5 zilizopita', read:false },
  { id:'n2', type:'request',      title:'Ombi Jipya #1249',       body:'Sarah Kimani ametuma ombi la Vyakula — Kariakoo.',  time:'Dakika 12 zilizopita', read:false },
  { id:'n3', type:'payment',      title:'Malipo Yamefanikiwa',     body:'TZS 15,000 yamepokelewa kwa safari #1247.',         time:'Saa 1 iliyopita',     read:true  },
  { id:'n4', type:'registration', title:'Mteja Mpya',              body:'Grace Nyale amesajiliwa kama mteja.',               time:'Saa 2 zilizopita',    read:true  },
  { id:'n5', type:'request',      title:'Ombi Limekamilika #1245', body:'Safari ya Amina Rashid imekamilika — TZS 25,000.',   time:'Jana 3:00 PM',        read:true  },
]

const ICONS: Record<string,string> = { registration:'👤', request:'📋', payment:'💳' }

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS)

  const markRead = (id: string) =>
    setNotifs(ns => ns.map(n => n.id === id ? {...n, read:true} : n))

  const markAllRead = () =>
    setNotifs(ns => ns.map(n => ({...n, read:true})))

  const unread = notifs.filter(n => !n.read).length

  return (
    <AdminLayout title="Arifa">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-text-muted">
          <span className="font-bold text-primary">{unread}</span> arifa mpya
        </p>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="text-xs font-bold text-primary active:scale-95 transition-transform">
            Soma Zote
          </button>
        )}
      </div>

      <div className="card divide-y divide-card-border">
        {notifs.map(n => (
          <div key={n.id} onClick={() => markRead(n.id)}
            className={`flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-[#F8F9FC]
              ${!n.read ? 'bg-primary-soft' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0
              ${!n.read ? 'bg-primary text-white' : 'bg-input-bg'}`}>
              {ICONS[n.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-bold ${!n.read ? 'text-text-dark' : 'text-text-mid'}`}>{n.title}</p>
                {!n.read && <div className="w-2 h-2 bg-primary rounded-full mt-1 shrink-0" />}
              </div>
              <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{n.body}</p>
              <p className="text-[10px] text-text-muted mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}